import Phaser from "phaser";
import Boot from "./scenes/Boot";
import Game from "./scenes/Game";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    pixelArt: true,
    backgroundColor: "#93cbee",
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    autoFocus: true,
    scene: [Boot, Game],
};
const phaserGame = new Phaser.Game(config);
(window).game = phaserGame;

export default phaserGame;
