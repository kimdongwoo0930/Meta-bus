import Phaser from "phaser";
import { createCharacterAnims } from "../anims/CharacterAnims";


export default class Game extends Phaser.Scene {
   cursors
    player
    socket
    otherPlayers= {}

    roomId

    constructor() {
        super("Game");
    }



    preload() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create(data) {
       console.log(data)
        this.socket = data.socket
        this.roomId = data.roomId

        this.socket.emit("JoinRoom",{ RoomId : this.roomId})
        this.socket.emit("otherPlayer",{RoomId : this.roomId})
        this.socket.emit("JoinNew",{ RoomId : this.roomId})


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
                }
            });
        });

        this.socket.on("connection", ({ id, x, y }) => {
            this.otherPlayers[id] = this.physics.add.sprite(x, y, "otherPlayer");
        });

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("Tiles", "tiles");

        map.createLayer("Ground", tileset);
        const Water = map.createLayer("Water", tileset);

        Water.setCollisionByProperty({ collides: true });
        this.player = this.physics.add.sprite(200, 200, "player");
        // console.log(this.otherPlayers);

        this.physics.add.collider(this.player, Water);
        this.cameras.main.zoom = 2;
        this.cameras.main.startFollow(this.player, true);

        this.socket.on("move", ({ socketId, x, y, direction }) => {
            // console.log(socketId, x, y);
            const play = this.otherPlayers[socketId];
            play.x = x;
            play.y = y;
            play.anims.play(direction, true);
        });

        this.socket.on("moveEnd", ({ socketId }) => {
            this.otherPlayers[socketId]?.anims.stop();
        });

        this.socket.on("delete", (Id) => {
            this.otherPlayers[Id].destroy();
        });
    }

    update(t, dt) {
        if (!this.cursors || !this.player) {
            return;
        }
        const speed = 100;
        if (this.cursors.left?.isDown) {
            this.player.anims.play("left", true);
            this.player.setVelocity(-speed, 0);
            this.socket.emit("move", {
                socketId: this.socket.id,
                x: this.player.x,
                y: this.player.y,
                direction: "left",
                RoomId : this.roomId
            });
        } else if (this.cursors.right?.isDown) {
            this.player.anims.play("right", true);
            this.player.setVelocity(speed, 0);
            this.socket.emit("move", {
                socketId: this.socket.id,
                x: this.player.x,
                y: this.player.y,
                direction: "right",
                RoomId : this.roomId
            });
        } else if (this.cursors.up?.isDown) {
            this.player.anims.play("up", true);
            this.player.setVelocity(0, -speed);
            this.socket.emit("move", {
                socketId: this.socket.id,
                x: this.player.x,
                y: this.player.y,
                direction: "up",
                RoomId : this.roomId
            });
        } else if (this.cursors.down?.isDown) {
            this.player.anims.play("down", true);
            this.player.setVelocity(0, speed);
            this.socket.emit("move", {
                socketId: this.socket.id,
                x: this.player.x,
                y: this.player.y,
                direction: "down",
                RoomId : this.roomId

            });
        } else {
            this.player.anims.stop();
            this.player.setVelocity(0, 0);
            this.socket.emit("moveEnd", { socketId: this.socket.id, RoomId : this.roomId });
        }

        //console.log(this.player.x, this.player.y);
    }
}
