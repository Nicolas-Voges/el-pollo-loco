class StatusBarBoss extends StatusBar {
    x = 600;
    otherDirection = true;
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    /**
     * This first called function calls the constructor function and loads images.
     * Also sets percentage.
     */
    constructor() {
        super().loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    /**
     * This function checks percentage and
     * 
     * @returns {number} .
     */
    resolveImageIndex() {
        if (this.percentage === 50) {
            return 5;
        } else if (this.percentage > 35) {
            return 4;
        } else if (this.percentage > 25) {
            return 3;
        } else if (this.percentage > 10) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}