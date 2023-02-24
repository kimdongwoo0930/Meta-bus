
import Phaser from "phaser";
import Socket from "../service/Socket";

export default class Boot extends Phaser.Scene {

    preloadComplete = false
    socket
    constructor() {
        super("boot");

    }
    preload() {
        this.socket = new Socket();
        console.log("OK")
        this.load.image("tiles", "assets/tiles/Tiles.png");
        this.load.tilemapTiledJSON("map", "assets/Map/tiles.json");

        this.load.spritesheet("player", "/assets/player.png", {
            frameHeight: 32,
            frameWidth: 32,
        });
        this.load.spritesheet("otherPlayer", "/assets/player.png", {
            frameHeight: 32,
            frameWidth: 32,
        });
        this.load.on('complete',() => {
            this.preloadComplete = true
        })
    }

    create(data){
        console.log(data)
        if(!this.preloadComplete) return
        this.scene.launch('Game',{socket : this.socket, roomId : data.RoomId})
        console.log(this.socket)
    }


}
