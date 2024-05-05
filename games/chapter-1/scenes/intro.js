export function Intro() {
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
}