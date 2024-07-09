class StatusBar extends DrawableObject {
    width = 100;
    height = 40;
    IMAGES = [];
    percentage = 100;

    /**
     * This first called function calls the constructor function of drawable object class.
     */
    constructor() {
        super();
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
}