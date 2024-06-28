class StatusBarBottle extends StatusBar {
    y = 80;
    percentage = 0;
    IMAGES = IMAGES_PATHS.statusbars.bottles.IMAGES;

    /**
     * This first called function calls the constructor function and loads images.
     * Also sets percentage.
     * 
     */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }

    /**
     * This function chooses the image by considering its persentage.
     * 
     * @param {number} percentage 
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * This function checks percentage and
     * 
     * @returns {number} .
     */
    resolveImageIndex() {
        if (this.percentage >= 99) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}