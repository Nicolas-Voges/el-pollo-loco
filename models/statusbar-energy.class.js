class StatusBarEnergy extends StatusBar {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    constructor() {
        super().loadImage('img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png');
        this.loadImages(this.IMAGES);
    }
}