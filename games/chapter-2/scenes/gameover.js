// import { characters } from "../content/characters.js";
import { messages } from "../content/messages.js";

export function GameOver(score) {
    add([
        rect(width()+20, 140),
        color(20,80,180),
        anchor("center"),
        pos(center().x, center().y - 58),
        outline(4, rgb(0,200,200)),
    ]);
    let banner = choose(messages.gameover);
    add([
        color(200,30,130),
        text(banner, {
            font: 'Lilita One',
            size: 60
        }),
        pos(center().x+2, center().y-56),
        anchor("center")
    ])
    add([
        text(banner, {
            font: 'Lilita One',
            size: 60
        }),
        pos(center().x, center().y-58),
        anchor("center")
    ])

    add([
        text(`You saved [hightlight]${score.cooled}[/hightlight]`, {
            font: 'Lilita One',
            styles: {
                "hightlight": {
                    color: rgb(254, 211, 0)
                }
            }
        }),
        pos(center().add(0, 60)),
        anchor("center")
    ])        

    add([
        text(`You tossed [hightlight]${score.tosses}[/hightlight] shades`, {
            font: 'Lilita One',
            styles: {
                "hightlight": {
                    color: rgb(254, 211, 0)
                }
            }
        }),
        pos(center().add(0, 100)),
        anchor("center")
    ])       

    add([
        text("Press the |SPACE BAR| to play again", {
            font: 'Lilita One',
            size: 30
        }),
        pos(center().x, height() - 30),
        anchor("center")
    ])

    wait(2, () => { 
        // end game animation
    });

    onKeyRelease("space", () => go("game"));
    onGamepadButtonPress("south", () => go("game"));
    onKeyPress("m", () => go("main-menu"));
    onGamepadButtonPress("start", () => go("main-menu"));    
};