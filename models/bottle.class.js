class Bottle extends CollectableObject {
    offsetTop = 10;
    offsetRight = 15;
    offsetBottom = 8;
    offsetLeft = 22;
    width = 60;
    height = 60;
    IMAGES = IMAGES_PATHS.bottle.IMAGES;

    /**
     * This first called function calls the constructor function of CollectableObject class and hands over its given
     * x, y and imgIndex variables.
     * Than it loads the objects image and the IMAGES Array.
     * After that it calls the chooseOffset function and hands over the imgIndex.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} imgIndex 
     */
    constructor(x, y, imgIndex) {
        super(x, y).loadImage(this.IMAGES[imgIndex]);
        this.loadImages(this.IMAGES);
        this.chooseOffset(imgIndex);
    }

    /**
     * This function sets the offset values based on the images index.
     * 
     * @param {number} imgIndex 
     */
    chooseOffset(imgIndex) {
        switch (imgIndex) {
            case 0:
                this.offsetTop = 10;
                this.offsetRight = 13;
                this.offsetBottom = 8;
                this.offsetLeft = 27;
                break;
            case 1:
                this.offsetTop = 10;
                this.offsetRight = 19;
                this.offsetBottom = 8;
                this.offsetLeft = 19;
                break;
            case 2:
                this.offsetTop = 10;
                this.offsetRight = 23;
                this.offsetBottom = 8;
                this.offsetLeft = 23;
                break;
            default:
                break;
        }
    }
}