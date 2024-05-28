import { messages } from "../content/messages.js";
import { difficulties } from "../content/difficulties.js";
import { characters } from "../content/characters.js";

export function Game() {
    let encouragementIntervals = [500, 650, 790, 1000];
    let nextEncouragement = 1500;
    let nextStorm = 2000;
    let gameRunning = false;
    let actionPaused = false;
    let zenMode = false;
    let maxBowlHeight= 0;
    let difficulty = difficulties[0];
    let score = {
        time: 0,
        squash: 0,
        storms: 0
    };
    
    // the ground
    add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4, rgb(20, 100 , 20)),
        area(),
        body({isStatic: true}),
        color(120, 200, 160)
    ]);

    // the scoreboard
    const scoreLabel = add([
        text(score.time, {
            font: 'Lilita One',
            size: 30,
        }),
        pos(10, height() - 40)
    ]);
    const squashLabel = add([
        text(`${score.squash} squashed`, {
            font: 'Lilita One',
            size: 30,
            align: "right"
        }),
        anchor("topright"),
        pos(width() - 10, height() - 40)
    ])

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

    // the atmosphere
    function spawnClouds() {
        for (let i=0; i<difficulty.cloudDensity(); i++) {
            add([
                sprite("cloud"),
                pos(rand(10,width()+100), rand(0, 70)),
                anchor("center"),
                opacity(1),
                fadeIn(rand(2,4)),
                scale(rand(0.05, 0.25)),
                move(LEFT, rand(20,40)),
                "cloud"
            ]);
        }
        wait(rand(1, 5), () => {
            spawnClouds();
        });
    }

    // the player
    const banana = add([
        sprite("banana", {anim: "jump"}),
        pos(center().x, -130),
        scale(characters.banana.scale),
        rotate(0),
        color(...characters.banana.color),
        area(),
        body({isStatic: true})
    ]);

    maxBowlHeight = banana.height * characters.banana.scale;
    
    // the tofu
    function spawnTofu(autoRespawn = true) {
        let s = characters.tofu.scale * rand(0.75,1.0);
        let p = new Vec2(rand(40, width()-40), -42+(42*s));
        let tofu = add([
            sprite("tofu", {anim: "jump"}),
            color(...characters.tofu.color),
            pos(p),
            body({isStatic: true, onGround: () => {shake()}}),
            timer(),
            scale(s),
            area(),                         
            "tofu",
            "enemy"
        ]);
        tofu.wait(difficulty.tofuDropDelay, () => {
            tofu.isStatic = false; 
        });
        if (autoRespawn && !actionPaused) {
            wait(difficulty.tofuRate(), () => {
                spawnTofu();
            })
        }
    }
  
    // the bowl towers
    function spawnBowlTower() {
        let s = difficulty.towerScale();

        const bowl = add([
            sprite("bowl", {anim: "run"}),
            area(),
            pos(width(), height() - 48),
            scale(s),
            anchor("botleft"),
            move(LEFT, 240),
            "danger"
        ]);
        
        let bowlCount = rand(0, Math.round(maxBowlHeight/(bowl.height*s)));
        for(let i=0;i<bowlCount-1; i++) {
            bowl.add([
                sprite("bowl", {anim: "sitting"}),
                area(),
                pos(0, -110*(i+1)),
                anchor("botleft"),
                "danger"
            ])
        }
        
        if (!actionPaused) {
            wait(difficulty.towerRate(), () => {
                spawnBowlTower();
            });
        }
    }

    function tofuStorm() {
        actionPaused = true;

        for (let i=0; i<10; i++) {
            add([
                color(randi(100)),
                sprite("cloud"),
                pos(rand(10,width()+100), rand(0, 70)),
                anchor("center"),
                opacity(1),
                fadeIn(rand(2,4)),
                scale(rand(0.05, 0.25)),
                move(LEFT, rand(20,40)),
                "storm-cloud"
            ]);
        }

        wait(2, () => {
            showBananner(new Vec2(center().x, 3), "¡¡¡Tofu Storm!!!", 60, 0.5, 4.0, -30, rgb(255,250,223));
            showBananner(new Vec2(center().x, 0), "¡¡¡Tofu Storm!!!", 60, 0.5, 4.0, -30, color(60));
    
            for (let i=0; i<20; i++) {
                add([
                    color(randi(100)),
                    sprite("cloud"),
                    pos(rand(10,width()+100), rand(0, 70)),
                    anchor("center"),
                    opacity(1),
                    fadeIn(rand(2,4)),
                    scale(rand(0.05, 0.25)),
                    move(LEFT, rand(20,40)),
                    "storm-cloud"
                ]);
            }

            wait(4, () => {
                for (let i=0; i<5; i++)  {
                    wait(i*0.25, spawnTofu(false));
                }
        
                wait(6, () => {
                    actionPaused = false;
                    startAction();
                    score.storms++;
                    nextStorm += randi(2000,3000);
                });
            });
        })
    }

    function updateSquashScore() {
        squashLabel.text = `${score.squash} squashed`;
    }

    function startAction() {
        wait(3, () => {
            spawnBowlTower();
            
            wait(rand(2, 10), () => {
                spawnTofu();
            });
        });
    }

    function endGame() {
        gameRunning = false;
        
        shake();
        
        banana.anchor = "center";
        banana.play("jump");
        banana.scale = 0.75;
        banana.onUpdate(() => {
            banana.angle += 500 * dt();
        });
        
        wait(1, () => go("game-over", score));
    }

    function generateAura(p) {
        add([
            circle(1),
            pos(p.x+30,height() - 90),
            anchor("center"),
            color([20,80,180]),
            fadeIn(2.0),
            opacity(0.15),
            lifespan(3.0, {fade: 0.5}),            
            z(-90),
            "aura",
            "aura-inner"
        ])
        onUpdate("aura-inner", (aura) => {
            if (aura.radius < 75) aura.radius +=0.5;
        })
        add([
            circle(1),
            pos(p.x+30,height() - 90),
            anchor("center"),
            color(characters.banana.color),
            fadeIn(2.5),
            opacity(0.15),
            lifespan(3.0, {fade: 0.5}),            
            z(-100),
            "aura",
            "aura-outer"
        ])
        onUpdate("aura-outer", (aura) => {
            if (aura.radius < 78) aura.radius +=0.25;
        })        
    }

    setGravity(3200);
    spawnClouds();
    showBananner(center(), choose(messages.hello), 40, 0.5, 1.5, 0, color(255,255,255));

    // START THE GAME
    // make it a staggered start 
    // don't spawn enemies until after the game runs for a few seconds
    // let the player get settled in first
    wait(1, () => {
        banana.isStatic = false;
        startAction();
    });  


    // handle events
    on("ground", "tofu", (t) => {
        t.play("press");
        shake();
    });

    function jump() {
        if (banana.isGrounded()) {
            banana.play("jump");
            banana.jump(1000);
         }
    }

    function goZen() {
        if (banana.isGrounded() ) {
            banana.play("zen");
            if (!zenMode) {
                zenMode = true;
                generateAura(banana.pos);
            }
        }
    }

    function stopZen() {
        zenMode = false;
        destroyAll("aura");
    }

    function goLeft() {
        if (zenMode) return;
        if (banana.pos.x > 0) {
            banana.flipX = false;
            banana.move(-300,0);
        }
        if (banana.isGrounded() && banana.curAnim() !== "run") {
            banana.play("run")
        }  
    }
    
    function goRight() {
        if (zenMode) return;
        if (banana.pos.x < width() - banana.width*characters.banana.scale) {
            banana.flipX = true;
            banana.move(300,0);
        }
        if (banana.isGrounded() && banana.curAnim() !== "run") {
		    banana.play("run")
	    }                
    }

    onKeyPress("space", jump);
    onKeyDown("right", goRight); 
    onKeyDown("left", goLeft);
    onKeyDown("down", goZen)

    onGamepadButtonPress("south", jump);
    onGamepadStick("left", (v) => {
        if (v.x.toFixed(1) > 0.0) goRight();
        if (v.x.toFixed(1) < 0.0) goLeft();
        if (v.x.toFixed(1) == 0.0 && banana.isGrounded() && !isKeyDown("left") && !isKeyDown("right") && !isKeyDown("down")) banana.play("idle");
        if (v.y.toFixed(1) > 0.0) goZen();
        if (v.y.toFixed(1) == 0.0) stopZen();
    });
    
    ["left", "right", "down"].forEach((key) => {
        onKeyRelease(key, () => {
        // Only reset to "idle" if player is not holding any of these keys
            if (banana.isGrounded() && !isKeyDown("left") && !isKeyDown("right") && !isKeyDown("down")) {
                banana.play("idle");
            }
            if (key = "down") stopZen();
	    })
    })

    onUpdate(() => {
        if (gameRunning) {
            score.time++;
            scoreLabel.text = score.time; 

            if (score.time%nextEncouragement === 0) {
                showBananner(banana.pos, choose(messages.encouragement), 30, 0.5, 2.0, 100, color(254, 211, 0));
                nextEncouragement = choose(encouragementIntervals);
            }
            if (score.time === 2000) difficulty = difficulties[1];
            if (score.time === 3000) difficulty = difficulties[2];   
            if (score.time === 5000) difficulty = difficulties[3];   
            
            if (score.time%nextStorm === 0) {
                tofuStorm();
            }
        }
    });

    banana.onGround((e) => {
        if (!gameRunning) {
            gameRunning = true;
        }
        // e.g. banana landed on top of the tofu
        if (e.is("enemy")) {
            score.squash++;
            updateSquashScore();

            showBananner(e.pos, choose(messages.tofuDestroy), 20, 0, 0.35, 100, color(250,100,200));
            banana.play("jump");
            banana.jump(500);
            destroy(e);
            
        } else {
            if (!isKeyDown("left") && !isKeyDown("right")) {
                banana.play("idle")
            } else {
                banana.play("run")
            }
        }
    })

    banana.onCollide("danger", () => {
        endGame();
    });
    
    banana.onCollide("enemy", (e, col) => {
        if (!col.isBottom()) {
            endGame();
        }
    });
}