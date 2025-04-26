import { messages } from "../content/messages.js";
import { characters } from "../content/characters.js";

export function MainMenu() {
    add([
        rect(width()+20, 140),
        color(20,80,180),
        anchor("center"),
        pos(center().x, center().y - 50),
        outline(4, rgb(0,200,200)),
    ]);

    add([
        color(250,100,200),
        text("Stay Cool, [banana]Banana Bro[/banana]", { 
            size: 55,
            font: 'Lilita One',
            styles: {
                "banana": {
                    color: rgb(254, 211, 0)
                }
            }
         }),
        pos(center().x+5, center().y - 45),
        anchor("center"),
    ])  
    add([
        color(100,200,10),
        text("Stay Cool, [banana]Banana Bro[/banana]", { 
            size: 55,
            font: 'Lilita One',
            styles: {
                "banana": {
                    color: rgb(254, 211, 0)
                }
            }
         }),
        pos(center().x+3, center().y - 47),
        anchor("center"),
    ])  
    add([
        text("Stay Cool, [banana]Banana Bro[/banana]", { 
            size: 55,
            font: 'Lilita One',
            styles: {
                "banana": {
                    color: rgb(254, 211, 0)
                }
            }
         }),
        pos(center().x, center().y - 50),
        anchor("center"),
    ])
  

    add([
        text("Press the |SPACE BAR| to play", {
            font: 'Lilita One',
            // transform: (idx, ch) => ({
            //     scale: wave(1.0, 1.025, time() * 10 + idx),
            // })
        }),
        pos(center().x, height() - 50),
        anchor("center")
    ])

    add([
        sprite("banana", {flipX:  true, anim:"jump"}),
        scale(0.3),
        color(characters.banana.color),
        pos(40, center().y - 50),
        anchor("left")
    ])

    add([
        sprite("banana", {flipX:  false, anim:"jump"}),
        scale(0.3),
        color(characters.banana.color),
        pos(width() - 40, center().y - 50),
        anchor("right")
    ])    

    onKeyPress("space", () => go("chapter-intro"));
    onGamepadButtonPress("south", () => go("chapter-intro"));
}