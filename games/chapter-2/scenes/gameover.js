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
        anchor("center"),
        layer("ui")
    ])
    add([
        text(banner, {
            font: 'Lilita One',
            size: 60
        }),
        pos(center().x, center().y-58),
        anchor("center"),
        layer("ui")
    ])
    
    add([
        text(`You liberated [hightlight]${score.cooled}[/hightlight] drones`, {
            font: 'Lilita One',
            styles: {
                "hightlight": {
                    color: rgb(254, 211, 0)
                }
            }
        }),
        pos(center().add(0, 60)),
        anchor("center"),
        layer("ui")
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
        anchor("center"),
        layer("ui")
    ])       

    let budget = score.tosses - score.cooled;
    let message = '';
    if (budget == 0) {
        message = `That's budget neutral`;
    } else {
        message = `That's [highlight]${budget}[/highlight] shades over budget`;
    }
    add([
        text(message, {
            font: 'Lilita One',
            size: 18,
            styles: {
                "highlight": {
                    color: rgb(255, 77, 222)
                }
            }
        }),
        pos(center().add(0, 135)),
        anchor("center"),
        layer("ui")
    ])

    if (score.cooled > 0) {
        loop(1, () => {
            // float bananas down from the top
                let theCoolness = add([
                    sprite("cloud"),
                    // pos(rand(0,width()), rand(50,height()-130)),
                    pos(randi(100,200)*-1, rand(50,height()-150)),
                    anchor("center"),
                    scale(rand(0.125,0.2)),
                    opacity(1.0),
                    fadeIn(0.75),
                    move(RIGHT, randi(10,20)),
                    "thecool"
                ]);
                theCoolness.add([
                    sprite("banana", {anim: "zen", flipX: true}),
                    scale(2.35),
                    anchor("center"),
                    pos(-20,-200),
                    color([254, 211, 0]),
                ])
        }, score.cooled, true);
    }

    add([
        text("Press the |SPACE BAR| to play again", {
            font: 'Lilita One',
            size: 30
        }),
        pos(center().x, height() - 30),
        anchor("center"),
        layer("ui")
    ])

    wait(2, () => { 
        // end game animation
        add([
            sprite("banana", {anim: "defeatedWalk"}),
            scale(0.7),
            color([210, 210, 210]),
            pos(width()+50, height()),
            layer("obj"),
            anchor("botright"),
            move(LEFT,7),
            {
                dir: RIGHT
            }
        ]);
    });

    onUpdate("thecool", (t) => {
        let x = 4 * Math.cos(time()+t.id);
        let y =  4 * Math.sin(time()+t.id);
        t.move(x,y);
    })

    onKeyRelease("space", () => go("game"));
    onGamepadButtonPress("south", () => go("game"));
    onKeyPress("m", () => go("main-menu"));
    onGamepadButtonPress("start", () => go("main-menu"));    
};