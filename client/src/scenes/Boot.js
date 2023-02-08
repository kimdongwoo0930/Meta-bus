
import Phaser from "phaser";

export default class Boot extends Phaser.Scene {
    constructor() {
        super("boot");
    }
    preload() {
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
    }

    create() {
        this.scene.start("Game");
    }
}
