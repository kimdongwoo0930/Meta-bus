const app = require("express")();
const dotenv = require("dotenv").config({path : "../.env"});

const http = require("http");
const fs = require('fs');
const https = require('https');

const HTTPS_PORT = process.env.HTTPS_PORT;
const HTTP_PORT = process.env.HTTP_PORT;

const options = {
    key : fs.readFileSync(process.env.SSL_KEY),
    cert : fs.readFileSync(process.env.SSL_CERT)
};

const io = require("socket.io")(https.createServer(options,app).listen(HTTPS_PORT), {  
    cors: { origin: "*",
    methods: ['GET', 'POST']
    } 
});



// 존재하고 있는 방들의 정보
const Room = ['public']

// 어느 방에 누가 접속해 있는지 기록하는 목록
const Rooms = [
    { roomId : "public" , players : [], count : 0, maxsize : 9999, password : "", maker : "root"},
];
// 이 서버에 있는 모든 유저의 정보
const PlayerList = {}

// 소켓통신 시작
io.on("connection", (socket) => {
    // 서버에 접속자수를 반환 해준다.
    const RoomSize = (RoomId) => {
        return socket.adapter.rooms.get(RoomId)?.size;
    }

    // 처음 들어온 사람들은 모두 로비로 이동
    socket.join("Lobby")


    // 방찾기를 통해 방을 들어가면 리스트에 룸을 저장하고 플레이어 리스트에 자신을 저장한다.
    socket.on("JoinRoom", ({ RoomId , nickname}) => {

        // 로비를 떠나고 방으로 들어간다.
        socket.leave("Lobby")
        socket.join(RoomId);
        
        console.log(`${socket.id} : 접속했습니다.`);
        // 기록을 위해 리스트에 추가해준다.
        // 어느 방에 있는지 확인한 후 추가해준다.
        Rooms.map((item) => {
            if(item.roomId === RoomId){
                item.players.push(socket.id)
                item.count = item.count + 1
            }
            
        })
        // 플레이어 목록에 새로운 플레이어 추가
        PlayerList[socket.id] = { roomId : RoomId ,x: 200, y: 200, direction: "down", peerId : "", nickname : nickname  };
        socket.broadcast.to("Lobby").emit("RoomListRefresh",{ Rooms : Rooms })
    })

    // 다른 유저들의 정보를 요청하면 같은 룸에 있는 유저들을 모두 보내준다.
    socket.on("otherPlayer",({RoomId}) => {
        const player = {}
        Rooms.map((item) => {
            if(item.roomId === RoomId){
                item.players.map((item) => {
                    player[item] = PlayerList[item]
                })
            }
        })
        // 자신에게 서버에 접속되어있는 유저들의 정보를 보내준다.
        socket.emit("connects", { otherPlayer: player});
    })

    // 처음 접속했을때 이 게임에 존재하는 모든 유저 정보 보내기
    // 나를 제외한 다른 사람들에게 나의 참가 여부를 알려줌
    socket.on("JoinNew", ({RoomId, nickname}) => {
        socket.broadcast.to(RoomId).emit("connection", {
            id: socket.id,
            x: PlayerList[socket.id].x,
            y: PlayerList[socket.id].y,
            nickname : nickname
        });
    })
    // 접속을 종료했을때 유저 데이터에서 삭제하기 위해 전송및 데이터 삭제
    socket.on("disconnect", () => {
        console.log(`${socket.id} : 종료했습니다.`);
        // 만약 이 소켓 유저가 플레이어 리스트안에 있다면 방에서도 나가고, 소켓에서도 나가고, 리스트에서도 제거한후 다른 유저에게 퇴장메세지를 보낸다.
        if(socket.id in PlayerList){
            const rmId = PlayerList[socket.id].roomId
            const Peer = PlayerList[socket.id].PeerId
            socket.broadcast.to(rmId).emit("delete", socket.id);
            socket.broadcast.to(rmId).emit("disconnect-peer", { peerId : Peer})
            Rooms.map((item) => {
                if(item.roomId === rmId){
                    item.players.splice(item.players.indexOf(socket.id),1)
                    if(item.count === 1 && item.roomId !== "public"){
                        Rooms.splice(Rooms.indexOf(item),1)
                    }
                    else{ item.count -= 1  }
                }
                
            })
            socket.broadcast.to("Lobby").emit("RoomListRefresh",{ Rooms : Rooms })
            socket.leave(PlayerList[socket.id].roomId)
            delete PlayerList[socket.id];
        }
    });

    // 캐릭터의 움직임을 알리기위한 정보
    socket.on("move", ({ socketId, x, y, direction, RoomId }) => {
        PlayerList[socketId].x = x;
        PlayerList[socketId].y = y;
        PlayerList[socketId].direction = direction;
        socket.broadcast.to(RoomId).emit("move", { socketId, x, y, direction, RoomId });
    });

    // 캐릭터가 움직임을 멈췄을때 알리기 위한 정보
    socket.on("moveEnd", ({socketId, RoomId}) => {
        socket.broadcast.to(RoomId).emit("moveEnd", {socketId});
    });



    // 방 목록
    socket.on("RoomList",() => {
        socket.emit("RoomListReturn",{Rooms : Rooms})
    })

    // 방을 생성했을 경우 다른 플레이어들에게 실시간으로 보내줘서 새로고침을 한다.
    socket.on("CreateRoom",({ Name, Password, MaxSize, Maker })=>{
        if (Room.includes(Name)) { socket.emit("RoomCreateReturn",{ result : false }) }
        else {
            Room.push(Name)
            Rooms.push({roomId: Name, players: [], count : 0, maxsize : MaxSize, password : Password, maker : Maker})
            console.log(Rooms)
            socket.emit("RoomCreateReturn",{ result : true, name : Name })
            socket.broadcast.to("Lobby").emit("RoomListRefresh",{ return : Rooms })
        }
    })

    // // 이미 존재하는 방 이름인지 확인
    // socket.on("CheckRoomName",({ RoomName }) => {
    //     let result = true
    //     if (Room.includes(RoomName)) {result = false}
    //     socket.emit("CheckRoomNameReturn",{ result : result })
    // })


    // Peerjs 주소 저장및 전달
    socket.on("Join-Peer",({socketId, PeerId, RoomId}) => {

        PlayerList[socketId].peerId = PeerId
        console.log(socketId, PeerId, RoomId)
        socket.broadcast.to(RoomId).emit("New-Player", {socketId: socketId, peerId : PeerId})
        
    })


    // 가까운 플레이어를 받으면 다시 자신에게 전송해준다. 2초에 한번 실행한다.
    socket.on("close-User",({ List }) => {
        const NewList = []
        const Nicks = {}
        console.log(List)
        List.map((item) => {
            console.log(PlayerList[item])
            if(PlayerList[item]?.peerId !== "" && PlayerList[item] !== undefined){
                NewList.push(PlayerList[item].peerId)
                Nicks[PlayerList[item].peerId] = PlayerList[item].nickname
            }
        })
        socket.emit("close-User-Return",{List : NewList, Nicks : Nicks})
    })


});

http.createServer(app).listen(HTTP_PORT, () => {
    console.log("Server listening on http://localhost:" + HTTP_PORT);
});
