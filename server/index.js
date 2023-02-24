const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origins: ["http://localhost:8080"],
    },
});
// 존재하고 있는 방들의 정보
const Room = ['public']

// 어느 방에 누가 접속해 있는지 기록하는 목록
const Rooms = [
    { roomId : "public" , players : []}
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
    socket.on("JoinRoom", ({ RoomId }) => {
        // 로비를 떠나고 방으로 들어간다.
        socket.leave("Lobby")
        socket.join(RoomId);

        console.log("connected");
        // 방이 존재하지 않는다면 생성한다.
        // TODO : 나중에 방을 따로 생성한다면 다시 해줘야 한다.
        if(!Room.includes(RoomId)) {
            Room.push(RoomId)
            Rooms.push({roomId: RoomId, players: []})
        }
        // 기록을 위해 리스트에 추가해준다.
        // 어느 방에 있는지 확인한 후 추가해준다.
        Rooms.map((item) => {
            if(item.roomId === RoomId){
                item.players.push(socket.id)
            }
        })
        // 플레이어 목록에 새로운 플레이어 추가
        PlayerList[socket.id] = { roomId : RoomId ,x: 200, y: 200, direction: "down" };
        console.log(Rooms)
        console.log(PlayerList)
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
    socket.on("JoinNew", ({RoomId}) => {
        socket.broadcast.to(RoomId).emit("connection", {
            id: socket.id,
            x: PlayerList[socket.id].x,
            y: PlayerList[socket.id].y,
        });
    })
    // 접속을 종료했을때 유저 데이터에서 삭제하기 위해 전송및 데이터 삭제
    socket.on("disconnect", () => {
        console.log("disconnect");
        if(socket.id in PlayerList){
            socket.broadcast.to(PlayerList[socket.id].roomId).emit("delete", socket.id);
            socket.leave(PlayerList[socket.id].roomId)
            delete PlayerList[socket.id];
        }
    });

    // TODO : 방단위로 구별하여 보내줘야한다.
    // 캐릭터의 움직임을 알리기위한 정보
    socket.on("move", ({ socketId, x, y, direction, RoomId }) => {
        PlayerList[socketId].x = x;
        PlayerList[socketId].y = y;
        PlayerList[socketId].direction = direction;
        socket.broadcast.to(RoomId).emit("move", { socketId, x, y, direction, RoomId });
    });
    // 캐릭터가 움직임을 멈췄을때 알리기 위한 정보
    socket.on("moveEnd", ({socketId, RoomId}) => {
        // TODO : 방단위로 구별하여 보내줘야한다.
        socket.broadcast.to(RoomId).emit("moveEnd", {socketId});
    });



    // 방 목록
    // TODO : 방 목록 전송해주기
    socket.on("RoomList",() => {
        const RoomSizes = []
        Room.map((item) => {
            RoomSizes.push(RoomSize(item))
        })
        socket.emit("RoomListReturn",{ RoomList : Room, RoomSize : RoomSizes})
    })
    // 방을 생성했을 경우 다른 플레이어들에게 실시간으로 보내줘서 새로고침을 한다.
    socket.on("CreateRoom",()=>{
        const RoomSizes = []
        Room.map((item) => {
            RoomSizes.push(RoomSize(item))
        })
        socket.broadcast.to("Lobby").emit("CreateRoomReturn",{ RoomList : Room, RoomSize : RoomSizes })
    })


});




http.listen(3000, () => {
    console.log("Server listening on localhost:3000");
});
