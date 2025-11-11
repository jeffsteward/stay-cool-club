import kaplay from "https://unpkg.com/kaplay@3001/dist/kaplay.mjs";
import { MainMenu } from "./scenes/mainmenu.js";
import { Instructions } from "./scenes/instructions.js";
import { Intro } from "./scenes/intro.js";
import { Game } from "./scenes/game.js";
import { GameOver } from "./scenes/gameover.js";

kaplay({
    width: 800,
    height: 550,
    canvas: document.getElementById("gameboard"),
    background: [100, 100, 255]
});

loadFont("Lilita One", "/fonts/LilitaOne-Regular.ttf")
loadSprite("cloud", "/img/clouds.png");
loadSprite("banana", "/img/banana-2-0-sprites.png", {
    sliceX: 10,
    sliceY: 1,
    anims: {
        idle: 0,
        run: { from: 1, to: 2, speed: 12, loop: true },
        jump: 3,
        zen: 4,
        armup: 5,
        throw: 6,
        defeated: 7,
        defeatedWalk: {from: 7, to: 9, speed: 3, loop: true, pingpong: true} 
    }
});
loadSprite("bazombie", "/img/banana-zombie-sprites.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
        idle: 0,
        walk: { from: 0, to: 3, speed: 5, loop: true },
    }
});
loadSprite("bazombie2", "/img/banana-zombie-3-sprites.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
        idle: 3,
        walk: { from: 0, to: 3, speed: 5, loop: true },
    }
});
loadSprite("shades", "/img/shades-sprites.png", {
    sliceX: 4,
    sliceY: 1,
    anims: {
        idle: 0,
        toss: { from: 0, to: 3, speed: 12, loop: true },
    }
});
loadSprite("background", "/img/background-roadway.png");
loadSprite("aura", "/img/aura-2.png");

setLayers(["bg", "obj", "ui"], "bg");

scene("main-menu", MainMenu);
scene("chapter-intro", Intro);
scene("instructions", Instructions);
scene("game", Game);
scene("game-over", GameOver);

go("main-menu");
// go("game");
// go("instructions");
// go("game-over", {
//         cooled: 14,
//         tosses: 16,
//         time: 0
//     });

// try to figure out if the user has a keyboard which is required to play the game
let mobileDetected = false;
let keyboardDetected = false;

function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}
function detectKeyboardOnce(e) {
    keyboardDetected = true;
    //hide the warning, play the game
    window.removeEventListener('keydown', detectKeyboardOnce);
}
window.addEventListener('keydown', detectKeyboardOnce);

mobileDetected = isMobile();
if (mobileDetected) {
    //show the warning
    document.getElementById("keyboard-warning").classList.remove("d-none");
    document.getElementById("gameboard").classList.add("d-none");
}