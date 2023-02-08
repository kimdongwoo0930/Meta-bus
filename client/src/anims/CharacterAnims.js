import Phaser from "phaser";

export const createCharacterAnims = (anims) => {
    const animsFrameRate = 15;

    anims.create({
        key: "down",
        frames: anims.generateFrameNames("player", {
            start: 0,
            end: 2,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "left",
        frames: anims.generateFrameNames("player", {
            start: 3,
            end: 5,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "right",
        frames: anims.generateFrameNames("player", {
            start: 6,
            end: 8,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "up",
        frames: anims.generateFrameNames("player", {
            start: 9,
            end: 11,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });
    anims.create({
        key: "down",
        frames: anims.generateFrameNames("otherPlayer", {
            start: 0,
            end: 2,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "left",
        frames: anims.generateFrameNames("otherPlayer", {
            start: 3,
            end: 5,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "right",
        frames: anims.generateFrameNames("otherPlayer", {
            start: 6,
            end: 8,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });

    anims.create({
        key: "up",
        frames: anims.generateFrameNames("otherPlayer", {
            start: 9,
            end: 11,
        }),
        repeat: -1,
        frameRate: animsFrameRate,
    });
};
