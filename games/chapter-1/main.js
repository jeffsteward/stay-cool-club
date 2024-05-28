import { MainMenu } from "./scenes/mainmenu.js";
import { Instructions } from "./scenes/instructions.js";
import { Intro } from "./scenes/intro.js";
import { Game } from "./scenes/game.js";
import { GameOver } from "./scenes/gameover.js";

kaboom({
    width: 800,
    height: 400,
    root: document.getElementById("gameboard"),
    background: [100, 100, 255]
});

loadFont("Lilita One", "/fonts/LilitaOne-Regular.ttf")
loadSprite("cloud", "/img/clouds.png");
loadSprite("bowl", "/img/bowl-sprites.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        idle: 0,
        run: {from: 0, to: 3, speed: 20, loop: true},
        sitting: 4
    }
});
loadSprite("tofu", "/img/tofu-v2-sprites.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        jump: 0,
        idle: 1,
        press: { from: 1, to: 2, speed: 1, loop: true },
        run: { from: 3, to: 4, speed: 12, loop: true }
    }
});
loadSprite("banana", "/img/banana-v3-sprites.png", {
    sliceX: 7,
    sliceY: 1,
    anims: {
        idle: 0,
        run: { from: 1, to: 2, speed: 12, loop: true },
        jump: 3,
        zen: 4,
        throw: { from: 5, to: 6, speed: 12 }
    }
});

scene("main-menu", MainMenu);
scene("chapter-intro", Intro);
scene("instructions", Instructions);
scene("game", Game);
scene("game-over", GameOver);

go("main-menu");