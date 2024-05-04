kaboom({
    width: 800,
    height: 400,
    root: document.getElementById("gameboard"),
    background: [100, 100, 255]
});

const settings = {
    PLAYER_SCALING: 0.4,
    TOFU_SCALING: 0.2
};
const characters = {
    banana: {
        color: rgb(254, 211, 0),
        sprite: 'banana',
        name: 'Banana Bro',
        profession: 'Fruit of leisure',
        loves: 'Hammocks, mirrored sunglasses, roller skates',
        dislikes: 'Ethylene, b@n@n@ bread',
        motto: 'Right on.'
    },
    tofu: {
        color: rgb(255,250,223),
        sprite: 'tofu',
        name: 'Pressed Tofu',
        profession: 'Bodybuilder',
        loves: 'Leg day, jorts',
        dislikes: 'Soft and silken wimps',
        motto: 'The action is the juice.'
    },
    dough: {
        color: rgb(255,255,255),
        sprite: 'bowl',
        name: 'Dough Bowl',
        profession: 'Baker’s assistant',
        loves: 'Being left alone on top of the refrigerator',
        dislikes: 'Feeling sticky',
        motto: 'I don’t have to proof nothing.'
    }
};
const messages = {
    mainmenu: `Can you stay cool?`,
    hello: [
        "Hello, Banana Bro",
        "Olá, Banana Bro", 
        "Allô, Banana Bro",
        "Hej, Banana Bro",
        "Halló, Banana Bro"
    ],
    encouragement: [
        "Keep it Mellow",
        "Ripe Moves!",
        "Let’s Split",
        "Rad-tastic",
        "So Pumped",
        "Cheese It!",
        "Every Day I’m Shufflin’"
    ],
    discouragement: [
        "That has got to hurt"
    ],
    tofuDestroy: [
        "Soy long for now!",
        "Do you even lift?",
    ],
    bowlDestory: [
        "Knead this!",
    ],
    gameover: [
        "Game Over",
        "Harsh Toke",
        "What a Bummer",
        "Too Ripe",
        "Sorry, Buddy :(",
        "Banana Bread R.I.P."
    ],
    controls: [
        '[highlight]<[/highlight] and [highlight]>[/highlight] to move',
        '[highlight]Space bar[/highlight] to jump'
    ], 
    instructions: [
        'Jump over dough bowls.',
        'Avoid tofu blocks. Squash them and they disappear.',
        'Watch out for storms. Keep on keepin’ on.'
    ]
};
const difficulties = [
    {
        towerRate: () => rand(1.5, 2.5),
        towerScale: () => rand(0.10, 0.18),
        tofuRate: () => rand(5, 10),
        tofuDropDelay: 1.5,
        cloudDensity: () => randi(3)
    },
    {
        towerRate: () => rand(1.4, 2.4),
        towerScale: () => rand(0.14, 0.22),
        tofuRate: () => rand(4, 9),
        tofuDropDelay: 1.0,
        cloudDensity: () => randi(5)
    },
    {
        towerRate: () => rand(1.3, 2.3),
        towerScale: () => rand(0.18, 0.30),
        tofuRate: () => rand(3, 8),
        tofuDropDelay: 0.8,
        cloudDensity: () => randi(8)
    },
    {
        towerRate: () => rand(1.0, 2.0),
        towerScale: () => rand(0.20, 0.38),
        tofuRate: () => rand(2, 7),
        tofuDropDelay: 0.4,
        cloudDensity: () => randi(10)
    },
]

loadAssets();

scene("game", () => {
    let encouragementIntervals = [500, 650, 790, 1000];
    let nextEncouragement = 1500;
    let nextStorm = 2000;
    let gameRunning = false;
    let actionPaused = false;
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
        scale(settings.PLAYER_SCALING),
        rotate(0),
        color(characters.banana.color),
        area(),
        body({isStatic: true})
    ]);

    maxBowlHeight = banana.height * settings.PLAYER_SCALING;
    
    // the tofu
    function spawnTofu(autoRespawn = true) {
        let s = settings.TOFU_SCALING * rand(0.75,1.0);
        let p = new Vec2(rand(40, width()-40), -42+(42*s));
        let tofu = add([
            sprite("tofu", {anim: "jump"}),
            color(characters.tofu.color),
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

    function goLeft() {
        if (banana.pos.x > 0) {
            banana.flipX = false;
            banana.move(-300,0);
        }
        if (banana.isGrounded() && banana.curAnim() !== "run") {
            banana.play("run")
        }  
    }

    function goRight() {
        if (banana.pos.x < width() - banana.width*settings.PLAYER_SCALING) {
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
    onGamepadButtonPress("south", jump);
    onGamepadStick("left", (v) => {
        if (v.x.toFixed(1) > 0.0) goRight();
        if (v.x.toFixed(1) < 0.0) goLeft();
        if (v.x.toFixed(1) == 0.0 && banana.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) banana.play("idle");
    });
    
    ["left", "right"].forEach((key) => {
        onKeyRelease(key, () => {
        // Only reset to "idle" if player is not holding any of these keys
            if (banana.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
                banana.play("idle")
            }
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
});

scene("game-over", (score) => {
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
            scale(settings.PLAYER_SCALING),
            color(characters.banana.color),
            anchor("bot"),
            move(RIGHT, 240),
        ])

        for(let i=0; i<score.squash; i++) {
            let tofu = add([
                sprite("tofu", {anim: "run", animSpeed: rand(0.25,0.75)}),
                color(characters.tofu.color),
                pos(-600-(rand(80,100)*i), height()),
                scale(settings.TOFU_SCALING*rand(0.75,1.25)),
                anchor("bot"),
                move(RIGHT, rand(220, 260))
            ]);
        }
    });

    onKeyPress("space", () => go("game"));
    onGamepadButtonPress("south", () => go("game"));
    onGamepadButtonPress("start", () => go("main-menu"));
});

scene("main-menu", () => {
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
        }),
        pos(center().x, height() - 50),
        anchor("center")
    ])

    add([
        sprite("banana", {flipX:  true, anim:"jump"}),
        scale(0.3),
        color(254, 211, 0),
        pos(40, center().y - 50),
        anchor("left")
    ])

    add([
        sprite("banana", {flipX:  false, anim:"jump"}),
        scale(0.3),
        color(254, 211, 0),
        pos(width() - 40, center().y - 50),
        anchor("right")
    ])    

    onKeyPress("space", () => go("chapter-intro"));
    onGamepadButtonPress("south", () => go("chapter-intro"));
});

scene("instructions", () => {
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
});

scene("characters", () => {
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
});

scene("chapter-intro", () => {
    const messages = [
        "Chapter 1",
        "Hop to It"
    ];
    add([
        rect(width()+20, 140),
        color(20,80,180),
        anchor("center"),
        pos(center().x, center().y - 50),
        outline(4, rgb(0,200,200)),
    ]);

    let bananner = add([
        color(250,100,200),
        text(messages[0], { 
            size: 55,
            font: 'Lilita One'
         }),
        pos(center().x, center().y - 45),
        anchor("center"),
    ]);

    wait(2, () => {
        bananner.text = messages[1];
        wait(2, () => {
            go("instructions");
        }) 
    });
});

function loadAssets() {
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
        sliceX: 4,
        sliceY: 1,
        anims: {
            idle: 0,
            run: { from: 1, to: 2, speed: 12, loop: true },
            jump: 3
        }
    });
}

go("main-menu");