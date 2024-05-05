import { characters } from "../content/characters.js";

export function Characters() {
    add([
        color(250,100,200),
        text("Our Hero",{ 
            size: 35,
            font: 'Lilita One'
         }),
         pos(140, 50),
         anchor("center")
    ]);
    createCard(characters.banana, new Vec2(20, 80));

    add([
        color(250,100,200),
        text("Our Antagonists",{ 
            size: 35,
            font: 'Lilita One'
         }),
         pos(530, 50),
         anchor("center")
    ]);
    createCard(characters.dough, new Vec2(280, 80));
    createCard(characters.tofu, new Vec2(540, 80));

    function createCard(character, p) {
        add([
            rect(240, 240, {radius: 10}),
            color(20,80,180),
            anchor("topleft"),
            pos(p),
            outline(4, rgb(0,200,200)),
        ]);
        add([
            sprite(character.sprite, {anim: "idle"}),
            color(character.color),
            pos(p.x+230, p.y+20),
            anchor("topright"),
            scale(0.4)
        ])
        add([
            text(character.name, { 
                size: 25,
                font: 'Lilita One'
            }),
            anchor('topleft'),
            pos(p.x + 10, p.y+20)       
        ])
        add([
            text(
                `${character.profession}\n\n\n\nLoves:\n${character.loves}\n\nDislikes:\n${character.dislikes}\n\nMotto:\n${character.motto}`,
                {
                    size:13,
                    width: 220,
                }
            ),
            anchor('topleft'),
            pos(p.x + 10, p.y+50)
        ])
    }

    add([
        text("Press the |SPACE BAR| to start the game", {
            font: 'Lilita One',
            size: 30
        }),
        pos(center().x, height() - 30),
        anchor("center")
    ])    
    
    onKeyPress("space", () => go("game"));
}