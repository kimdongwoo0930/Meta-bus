const app = require("express")();

const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origins: ["http://localhost:8080"],
    },
});

const PlayerList = {};

io.on("connection", (socket) => {
    console.log("connected");
    PlayerList[socket.id] = { x: 200, y: 200, direction: "down" };
    // 처음 접속했을때 이 게임에 존재하는 모든 유저 정보 보내기
    socket.emit("connects", { otherPlayer: PlayerList });
    // 나를 제외한 다른 사람들에게 나의 참가 여부를 알려줌
    socket.broadcast.emit("connection", {
        id: socket.id,
        x: PlayerList[socket.id].x,
        y: PlayerList[socket.id].y,
    });
    // 접속을 종료했을때 유저 데이터에서 삭제하기 위해 전송및 데이터 삭제
    socket.on("disconnect", () => {
        console.log("disconnect");
        socket.broadcast.emit("delete", socket.id);
        delete PlayerList[socket.id];
    });

    // 캐릭터의 움직임을 알리기위한 정보
    socket.on("move", ({ socketId, x, y, direction }) => {
        PlayerList[socketId].x = x;
        PlayerList[socketId].y = y;
        PlayerList[socketId].direction = direction;
        socket.broadcast.emit("move", { socketId, x, y, direction });
    });
    // 캐릭터가 움직임을 멈췄을때 알리기 위한 정보
    socket.on("moveEnd", (socketId) => {
        socket.broadcast.emit("moveEnd", socketId);
    });
});

http.listen(3000, () => {
    console.log("Server listening on localhost:3000");
});
