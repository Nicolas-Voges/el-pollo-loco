const IMAGES_PATHS = {
    backgrounds: {
        air: [
            'img/5_background/layers/air.png'
        ],
        layer1: [
            'img/5_background/layers/1_first_layer/1.png',
            'img/5_background/layers/1_first_layer/2.png'
        ],
        layer2: [
            'img/5_background/layers/2_second_layer/1.png',
            'img/5_background/layers/2_second_layer/2.png'
        ],
        layer3: [
            'img/5_background/layers/3_third_layer/1.png',
            'img/5_background/layers/3_third_layer/2.png'
        ],
        clouds: [
            'img/5_background/layers/4_clouds/1.png',
            'img/5_background/layers/4_clouds/2.png'
        ]
    },
    endScreens: {
        win: [
            'img/9_intro_outro_screens/win/win_1.png',
            'img/9_intro_outro_screens/win/win_2.png',
            'img/9_intro_outro_screens/win/won_1.png',
            'img/9_intro_outro_screens/win/won_2.png'
        ],
        lose: [
            'img/9_intro_outro_screens/game_over/game over!.png',
            'img/9_intro_outro_screens/game_over/game over.png',
            'img/9_intro_outro_screens/game_over/oh no you lost!.png',
            'img/9_intro_outro_screens/game_over/you lost.png'
        ]
    }
}

const SOUNDS = {
    character: {
        LONG_IDLE: {
            SOUND: new Audio('audio/snoring.mp3'),
            VOLUME: 0.6
        },
        WALKING: {
            SOUND: new Audio('audio/walking.mp3'),
            VOLUME: 0.6
        },
        JUMPING: {
            SOUND: new Audio('audio/jump.mp3'),
            VOLUME: 0.3
        },
        HURT: {
            SOUND: new Audio('audio/hurt.mp3'),
            VOLUME: 1
        },
        DEAD: {
            SOUND: new Audio('audio/die.mp3'),
            VOLUME: 1
        }
    },
    chick: {
        DEAD: {
            SOUND: new Audio('audio/chick-hit.mp3'),
            VOLUME: 0.3
        }
    },
    chicken: {
        DEAD: {
            SOUND: new Audio('audio/chicken-hit.mp3'),
            VOLUME: 0.5
        }
    },
    endboss: {
        ALERT: {
            SOUND: new Audio('audio/boss-alert.mp3'),
            VOLUME: 0.5
        },
        ATTACK: {
            SOUND: new Audio('audio/earthquake.mp3'),
            VOLUME: 0.3
        },
        HURT: {
            SOUND: new Audio('audio/boss-hit.mp3'),
            VOLUME: 0.7
        },
        DEAD: {
            SOUND: new Audio('audio/boss-die.mp3'),
            VOLUME: 1
        }
    },
    bottle: {
        COLLECT: {
            SOUND: new Audio('audio/bottle-collect.mp3'),
            VOLUME: 1
        }
    },
    coins: {
        COLLECT: {
            SOUND: new Audio('audio/coin-collect.mp3'),
            VOLUME: 0.3
        }
    },
    throwableObject: {
        ROTATE: {
            SOUND: new Audio('audio/throw.mp3'),
            VOLUME: 1
        },
        SPLASH: {
            SOUND: new Audio('audio/bottle-broken.mp3'),
            VOLUME: 0.3
        }
    },
    world: {
        AMBIENTE: {
            SOUND: new Audio('audio/ambiente.mp3'),
            VOLUME: 0.4
        },
        MUSIC: {
            SOUND: new Audio('audio/music.mp3'),
            VOLUME: 0.25
        }
    }
}

let intervalValues = {
    character: {
        moves: 1000 / 60,
        animations: {
            default: 80,
            idle: 140
        },
        gravity: 1000 / 60
    },
    enemies: {
        moves: 1000 / 60,
        animations: 120
    },
    endboss: {
        moves: 1000 / 60,
        animations: 200,
        gravity: 1000 / 60
    },
    world: {
        run: 5
    },
    throwableObjects: {
        moves: 20,
        animations: 100,
        gravity: 1000 / 60
    },
    collectableObjects: {
        coins: {
            animations: 1000 / 3
        },
        bottles: {
            animations: 1000 / 2
        }
    }
};