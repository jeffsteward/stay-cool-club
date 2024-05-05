import { characters } from "../content/characters.js";
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
        text(`Your score is [hightlight]${score.time}[/hightlight]`, {
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
        text(`You squashed [hightlight]${score.squash}[/hightlight] tofus`, {
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
       add([
            sprite("banana", {flipX: true, anim: "run"}),
            pos(-400, height()),
            scale(characters.banana.scale),
            color(...characters.banana.color),
            anchor("bot"),
            move(RIGHT, 240),
        ])

        for(let i=0; i<score.squash; i++) {
            let tofu = add([
                sprite("tofu", {anim: "run", animSpeed: rand(0.25,0.75)}),
                color(...characters.tofu.color),
                pos(-600-(rand(80,100)*i), height()),
                scale(characters.tofu.scale*rand(0.75,1.25)),
                anchor("bot"),
                move(RIGHT, rand(220, 260))
            ]);
        }
    });

    onKeyPress("space", () => go("game"));
    onGamepadButtonPress("south", () => go("game"));
    onKeyPress("m", () => go("main-menu"));
    onGamepadButtonPress("start", () => go("main-menu"));

}