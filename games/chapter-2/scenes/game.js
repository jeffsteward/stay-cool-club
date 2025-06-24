import { messages } from "../content/messages.js";
import { difficulties } from "../content/difficulties.js";

export function Game() {
    let discouragementIntervals = [200, 450, 700, 1120];
    let nextDiscouragement = 300;
    let gameRunning = false;
    let difficulty = difficulties[0];
    let shadesStash = 100;
    let score = {
        cooled: 0,
        tosses: 0,
        time: 0
    };

    let background = add([
        sprite("background"),
        pos(center()),
        anchor("center"),
        z(-10000),
        scale(1)
    ]);
    
    let banana = add([
        sprite("banana", {anim: "jump"}),
        scale(0.55),
        color([254, 211, 0]),
        pos(center().x, -200),
        anchor("center"),
        area(),
        body(),
        {
            dir: RIGHT
        },
        "player"
    ]);

    // the bananner
    // position, message, font size, fade in rate, lifespan, move speed UP (use negative for down), color()
    function showBananner(p, m, s, fi, l, ms, c) {
        add([
            c,
            text(m, {
                font: 'Lilita One',
                size: s
            }),
            anchor('center'),
            pos(p),
            fadeIn(fi),
            opacity(1),
            lifespan(l, {fade: 0.5}),
            move(UP, ms)
        ]);
    }

    function spawnTheUncool() {
        if (get("theuncool").length < 35) {
            let startX = choose([0,width()]);
            let theUncool = add([
                    sprite(choose(["bazombie", "bazombie2"]), {anim: "walk", flipX: startX}),
                    scale(rand(0.27,0.32)),
                    color(210,210,210),
                    anchor("center"),
                    area({scale: 0.75, offset: vec2(0,-25)}) ,    
                    body(),
                    z(-100),
                    pos(startX, rand(0,height())),
                    "theuncool",
                    {
                        speed: difficulty.speed
                    },
                ]);
            
            theUncool.add([
                color(220,220,220),
                text(choose(messages.discouragement), {
                    font: 'Lilita One',
                    size: 50
                }),
                anchor('bot'),
                pos(100, -150)
            ]);
        }
        wait(difficulty.frequency, spawnTheUncool)
    }

    function fire(p, a) {
        add([
            // rect(2,2),
            sprite("shades", {anim: "toss"}),
            scale(0.25),
            pos(p),
            anchor("center"),
            area(),
            color(0,0,0),
            move(a,350),
			offscreen({ destroy: true }),
            "projectile"
        ])
        shadesStash -=1;
        score.tosses +=1;
    }

    function startAction() {
        gameRunning = true;
        wait(3, () => {
            spawnTheUncool();
        });
    }
    
    function endGame() {
        difficulty = difficulties[9];
        spawnTheUncool();
        gameRunning = false;
        
        showBananner(
            center().add(5,5), 
            "I regret nothing!",
            60, 0.5, 3.0, 50, 
            color(12, 51, 77)
        );
        showBananner(
            center(), 
            "I regret nothing!",
            60, 0.5, 3.0, 50, 
            color(255, 88, 210)
        );
        wait(1.2, () => {
            showBananner(
                center().add(5,5), 
                "Stay cooollll...",
                60, 0.5, 3.0, 50, 
                color(12, 51, 77)
            );
            showBananner(
                center(), 
                "Stay cooollll...",
                60, 0.5, 3.0, 50, 
                color(255, 88, 210)
            );
        })
            
        banana.unuse("body");
        banana.play("defeated");
        tween(
            banana.color, 
            new Color(210, 210, 210),
            1.0,
            (val) => banana.color = val, 
            easings.easeInSine
        );

        wait(3, () => go("game-over", score));
    }

    // START THE GAME
    // make it a staggered start 
    // don't spawn enemies until after the game runs for a few seconds
    // let the player get settled in first
    // START UP ANIMATION
    // show the welcome message
    showBananner(center(), choose(messages.hello), 40, 0.5, 1.5, 0, color(255,255,255));
    // drop the player in to the arena
    banana.play("jump");
    tween(
        banana.pos,
        center().add(0,100),
        1.0,
        (val) => banana.pos = val,
        easings.easeInQuad
    ).onEnd(() => {
        banana.play("idle");
        startAction();
    });
    setCursor("none");

    onUpdate(() => {
        if (gameRunning) {
            score.time++;
            if (score.time === 1000) difficulty = difficulties[1];
            if (score.time === 1500) difficulty = difficulties[2];
            if (score.time === 2250) difficulty = difficulties[3];
            if (score.time === 3000) difficulty = difficulties[4];
            if (score.time === 5000) difficulty = difficulties[5];
            if (score.time === 7000) difficulty = difficulties[6];
            if (score.time === 10000) difficulty = difficulties[7];
        }
    });

    onUpdate("theuncool", (t) => {
        const dir = banana.pos.sub(t.pos).unit();
        t.flipX = (dir.x < 0);
        t.move(dir.scale(t.speed));  
    })
 
    onUpdate("thecool", (t) => {
        let x = 4 * Math.cos(time()+t.id);
        let y =  4 * Math.sin(time()+t.id);
        t.move(x,y);
    })

    banana.onCollide("theuncool", () => {
        if (gameRunning) {
            shake();
            endGame();
        }
    });

    onCollide("theuncool", "projectile", (t, p) => {
        t.untag("theuncool");
        t.isStatic = true;

        score.cooled +=1;
        showBananner(banana.pos, choose(messages.droneConvert), 20, 0.5, 1.0, 100, color(100, 244,134));
        destroy(p);   
        
        t.play("idle");
        tween(
            t.color, 
            new Color(254, 211, 0),
            1.5,
            (val) => t.color = val, 
            easings.easeInSine
        );

        wait(1.5, () => {
            let theCoolness = add([
                sprite("cloud"),
                pos(t.pos),
                anchor("center"),
                scale(0.2),
                opacity(1.0),
                fadeIn(0.75),
                "thecool"
            ]);
            theCoolness.add([
                sprite("banana", {anim: "zen", flipX: t.pos.x < center().x}),
                scale(2.35),
                anchor("center"),
                pos(-20,-200),
                color([254, 211, 0]),
            ])
            destroy(t)
        })
    });

    // game controls
    ["up", "down", "left", "right"].forEach((key) => {
        onKeyRelease(key, () => {
            if (gameRunning) {
                if (!isKeyDown("space")) {
                    banana.play("idle");
                }
            }
        });
    });
    onKeyRelease("space", () => {
        if (gameRunning) {
            banana.play("throw");
            fire(banana.pos.sub(vec2(0,10)), banana.dir);
        }
    })
    onKeyDown("up", () => {
        if (gameRunning) {
            if (!isKeyDown("space")) {
                if (banana.pos.y - ((banana.height*banana.scale.y/2)) > 0) {
                    if (banana.curAnim() !== "run") {
                        banana.play("run");
                    }
                    banana.move(UP.scale(300));
                }   
            }
        }
    });
    onKeyDown("down", () => {
        if (gameRunning) {
            if (!isKeyDown("space")) {
                if (banana.pos.y + ((banana.height*banana.scale.y/2)) < height()) {
                    if (banana.curAnim() !== "run") {
                        banana.play("run");
                    }
                    banana.move(DOWN.scale(300));
                }
            }
        }
    });
    onKeyDown("right", () => {
        if (gameRunning) {
            if (!isKeyDown("space")) {
                if (banana.pos.x < width()) {
                    if (banana.curAnim() !== "run") {
                        banana.play("run");
                    }            
                    banana.dir = LEFT;
                    banana.flipX = true; 
                    banana.move(RIGHT.scale(300));
                }
            }
        }
    });
    onKeyDown("left", () => {
        if (gameRunning) {
            if (!isKeyDown("space")) {
                if (banana.pos.x > 0) {
                    if (banana.curAnim() !== "run") {
                        banana.play("run");
                    }        
                    banana.dir = RIGHT;
                    banana.flipX = false;
                    banana.move(LEFT.scale(300));
                }
            }
        }
    });
    onKeyPress("space", () => {   
        if (gameRunning) {
            banana.play("armup");
        }
    });
}