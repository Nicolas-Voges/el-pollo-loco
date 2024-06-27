class StatusBarBoss extends StatusBar {
    x = 600;
    otherDirection = true;
    IMAGES = IMAGES_PATHS.statusbars.boss.IMAGES;

    constructor() {
        super().loadImage(this.IMAGES[5]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

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