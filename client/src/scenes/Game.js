import Phaser from "phaser";
import { createCharacterAnims } from "../anims/CharacterAnims";
import store from "../store";
import { refresh } from "../store/closePlayerList";


export default class Game extends Phaser.Scene {
    cursors
    player
    socket
    otherPlayers= {}
    otherPlayersNickname = {}
    roomId
    closeList
    nickname
    name

    constructor() {
        super("Game");
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(data) {
        this.socket = data.socket
        this.roomId = data.roomId
        this.nickname = data.nickname
        
        this.socket.emit("JoinRoom",{ RoomId : this.roomId, nickname : this.nickname})
        this.socket.emit("otherPlayer",{RoomId : this.roomId})
        this.socket.emit("JoinNew",{ RoomId : this.roomId, nickname : this.nickname})

        // 캐릭터 걷는 모션 로딩
        createCharacterAnims(this.anims);


        this.socket.on("connects", ({ otherPlayer }) => {
            Object.keys(otherPlayer).map((Id) => {
                if (Id !== this.socket.id) {
                    this.otherPlayers[Id] = this.physics.add.sprite(
                        otherPlayer[Id]?.x,
                        otherPlayer[Id]?.y,
                        "otherPlayer"
                    );
                    this.otherPlayers[Id].anims.play(otherPlayer[Id]?.direction, true);
                    this.otherPlayers[Id].anims.stop();
                    this.otherPlayersNickname[Id] = this.add.text(otherPlayer[Id].x - 20, otherPlayer[Id].y - 30, otherPlayer[Id].nickname, { fontSize : "bold 10px soild" })
                }
            });
        });

        this.socket.on("connection", ({ id, x, y, nickname }) => {
            this.otherPlayers[id] = this.physics.add.sprite(x, y, "otherPlayer");
            this.otherPlayersNickname[id] = this.add.text(x-20,y-30,nickname,{ fontSize : "bold 10px soild" })
        });

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("Tiles", "tiles");

        map.createLayer("Ground", tileset);
        const Water = map.createLayer("Water", tileset);

        Water.setCollisionByProperty({ collides: true });
        this.player = this.physics.add.sprite(200, 200, "player");
        this.name = this.add.text(this.player.x- 20 ,this.player.y -30, this.nickname, { fontSize : "bold 10px soild" })

        this.physics.add.collider(this.player, Water);
        this.cameras.main.zoom = 2;
        this.cameras.main.startFollow(this.player, true);

        this.socket.on("move", ({ socketId, x, y, direction }) => {
            const play = this.otherPlayers[socketId];
            play.x = x;
            play.y = y;
            play.anims.play(direction, true);
            this.otherPlayersNickname[socketId].x = play.x - 20
            this.otherPlayersNickname[socketId].y = play.y - 30
        });

        this.socket.on("moveEnd", ({ socketId }) => {
            this.otherPlayers[socketId]?.anims.stop();
        });

        this.socket.on("delete", (Id) => {
            this.otherPlayers[Id].destroy();
            this.otherPlayersNickname[Id].destroy();
        });
    }

    update(t, dt) {
        if (!this.cursors || !this.player) {
            return;
        }
        const time = t / 1000;
        if(time % 1 < dt / 1000){
            this.closeUser()
        }

        if (this.cursors.left?.isDown) {
            this.moveEmit("left",-100,0)


        } else if (this.cursors.right?.isDown) {
            this.moveEmit("right",100,0)


        } else if (this.cursors.up?.isDown) {
            this.moveEmit("up",0,-100)


        } else if (this.cursors.down?.isDown) {
            this.moveEmit("down",0,100)


        } else {
            this.player.anims.stop();
            this.player.setVelocity(0, 0);
            this.socket.emit("moveEnd", { socketId: this.socket.id, RoomId : this.roomId });
        }
    }

    closeUser(){

        const x = this.player.x
        const y = this.player.y
        const List = []
        Object.entries(this.otherPlayers).map(([key,value]) => {
            if(value.x >= x - 50 && value.y >= y - 50 && value.x <= x + 50 && value.y <= y + 50){
                List.push(key)
            }
        })
        if(JSON.stringify(this.closeList) !== JSON.stringify(List)){
            console.log("변화")
            store.dispatch(refresh(List))
            console.log(List)
            this.closeList = List
        }
        
    }

    moveEmit(Direction,x,y){
        this.player.anims.play(Direction, true);
            this.player.setVelocity(x, y);
            this.name.x = this.player.x - 20
            this.name.y = this.player.y - 30
            this.socket.emit("move", {
                socketId: this.socket.id,
                x: this.player.x,
                y: this.player.y,
                direction: Direction,
                RoomId : this.roomId
            });
            
    }
}
