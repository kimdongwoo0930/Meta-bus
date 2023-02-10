const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origins: ["http://localhost:8080"],
    },
});

const Rooms = [
    { roomId : "public" , players : []}
];
const PlayerList = {}

io.on("connection", (socket) => {


    // 방찾기를 통해 방을 들어가면 리스트에 룸을 저장하고 플레이어 리스트에 자신을 저장한다.
    socket.on("JoinRoom", ({ RoomId }) => {
        socket.join(RoomId);
        console.log("connected");
        Rooms.map((item) => {
            if(item.roomId === RoomId){
                item.players.push(socket.id)
            }
        })
        PlayerList[socket.id] = { roomId : RoomId ,x: 200, y: 200, direction: "down" };
        console.log(Rooms)
        console.log(PlayerList)
    })
    // 다른 유저들의 정보를 요청하면 같은 룸에 있는 유저들을 모두 보내준다.
    socket.on("otherPlayer",() => {
        const player = {}
        Rooms.map((item) => {
            if(item.roomId === PlayerList[socket.id].roomId){
                item.players.map((item) => {
                    player[item] = PlayerList[item]
                })
            }
        })
        socket.emit("connects", { otherPlayer: player});
    })
    // 처음 접속했을때 이 게임에 존재하는 모든 유저 정보 보내기
    // 나를 제외한 다른 사람들에게 나의 참가 여부를 알려줌
    socket.on("JoinNew", () => {
        socket.broadcast.to(PlayerList[socket.id].roomId).emit("connection", {
            id: socket.id,
            x: PlayerList[socket.id].x,
            y: PlayerList[socket.id].y,
        });
    })
    // 접속을 종료했을때 유저 데이터에서 삭제하기 위해 전송및 데이터 삭제
    socket.on("disconnect", () => {
        console.log("disconnect");
        socket.broadcast.to(PlayerList[socket.id].roomId).emit("delete", socket.id);

        delete PlayerList[socket.id];
    });

    // TODO : 방단위로 구별하여 보내줘야한다.
    // 캐릭터의 움직임을 알리기위한 정보
    socket.on("move", ({ socketId, x, y, direction }) => {
        PlayerList[socketId].x = x;
        PlayerList[socketId].y = y;
        PlayerList[socketId].direction = direction;
        socket.broadcast.emit("move", { socketId, x, y, direction });
    });
    // 캐릭터가 움직임을 멈췄을때 알리기 위한 정보
    socket.on("moveEnd", (socketId) => {
        // TODO : 방단위로 구별하여 보내줘야한다.
        socket.broadcast.emit("moveEnd", socketId);
    });
});

http.listen(3000, () => {
    console.log("Server listening on localhost:3000");
});
