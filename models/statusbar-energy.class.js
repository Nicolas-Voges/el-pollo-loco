class StatusBarEnergy extends StatusBar {
    IMAGES = IMAGES_PATHS.statusbars.life.IMAGES;

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
        this.img = imageCache[path];
    }

    /**
     * This function checks percentage and
     * 
     * @returns {number} .
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage > 75) {
            return 4;
        } else if (this.percentage > 40) {
            return 3;
        } else if (this.percentage > 20) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}