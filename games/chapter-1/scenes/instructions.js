import { messages } from "../content/messages.js";

export function Instructions() {
    add([
        rect(width()+20, 85),
        color(20,80,180),
        pos(-10, -5),
        outline(4, rgb(0,200,200)),
    ]);

    let bananner = add([
        color(250,100,200),
        text(`How to Play`, { 
            size: 55,
            font: 'Lilita One'
         }),
        pos(20, 65),
        anchor('botleft')
    ]);

    bananner.add([
        text(messages.controls[0], {
            size: 30,
            font: 'Lilita One',
            styles: {
                "highlight": {
                    color: rgb(254, 211, 0)
                }
            }
        }), 
        pos(0, 40),
    ])    

    bananner.add([
        text(messages.controls[1], {
            size: 30,
            font: 'Lilita One',
            styles: {
                "highlight": {
                    color: rgb(254, 211, 0)
                }
            }
        }), 
        pos(0, 72),
    ])
    
    bananner.add([
        text(messages.instructions.join('\n'), {
            size: 30,
            lineSpacing: 9,
            font: 'Lilita One'
        }),
        pos(0, 133)
    ])

    add([
        text("Press the |SPACE BAR| to start the game", {
            font: 'Lilita One',
            size: 30
        }),
        pos(center().x, height() - 30),
        anchor("center")
    ])    
    
    onKeyPress("space", () => go("game"));
    onGamepadButtonPress("south", () => go("game"));
    onGamepadButtonPress("start", () => go("main-menu"));
}