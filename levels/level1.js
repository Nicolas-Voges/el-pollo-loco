let level1;
let collectableObjects
let backgrounds = [];

for (let i = 0, px = -719; i < 7; i++, px += 1438) {
    backgrounds.push(new BackgroungObject('./img/5_background/layers/air.png', px, 0));
    backgrounds.push(new BackgroungObject('./img/5_background/layers/air.png', 719 + px , 0));
}

for (let i = 0, px = -719; i < 7; i++, px += 1438) {
    backgrounds.push(new BackgroungObject('./img/5_background/layers/3_third_layer/1.png', px, 4));
    backgrounds.push(new BackgroungObject('./img/5_background/layers/3_third_layer/2.png', 719 + px, 4));
}

for (let i = 0, px = -719; i < 7; i++, px += 1438) {
    backgrounds.push(new BackgroungObject('./img/5_background/layers/2_second_layer/1.png', px, 2));
    backgrounds.push(new BackgroungObject('./img/5_background/layers/2_second_layer/2.png', 719 + px, 2));
}

for (let i = 0, px = -719; i < 7; i++, px += 1438) {
    backgrounds.push(new BackgroungObject('./img/5_background/layers/1_first_layer/1.png', px, 0));
    backgrounds.push(new BackgroungObject('./img/5_background/layers/1_first_layer/2.png', 719 + px, 0));
}

function initLevel1() {
    level1 = new Level([
        new Chick(1500),
        new Chick(1500),
        new Chick(1500),
        new Chick(2300),
        new Chick(2300),
        new Chicken(2500),
        new Chicken(2500),
        new Chicken(2500),
        new Chicken(3500),
        new Chicken(3500),
        new Chicken(3500),
        new Chicken(3500),
        new Chicken(3500),
        new Chicken(3500),
        new Chicken(4000),
        new Chicken(4000),
        new Chicken(4000),
        new Chicken(4000),
        new Chicken(4000),
        new Chicken(4000),
        new Endboss()
    ],
    cloudObjects = [
        new Cloud(20),
        new Cloud(1020),
        new Cloud(2020),
        new Cloud(3333),
        new Cloud(4000),
        new Cloud(5000),
    
    ],
        backgrounds,
        collectableObjects = [
            new Coin(100, 100),
            new Coin(1200, 140),
            new Coin(1250, 130),
            new Coin(2000, 100),
            new Coin(2400, 50),
            new Bottle(1550, 325, 0),
            new Bottle(2940, 390, 1),
            new Bottle(3740, 100, 2),
            new Bottle(4300, 380, 0),
            new Bottle(2370, 310, 1)
        ]);
}