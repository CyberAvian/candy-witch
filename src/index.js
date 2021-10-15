// import Phaser from 'phaser';

class MyGame extends Phaser.Scene
{
    PAIRS = 3;

    constructor ()
    {
        super();
    }

    preload ()
    {
        this.canvas = this.sys.game.canvas;
        this.viewHeight = window.innerHeight;
        this.viewWidth = window.innerWidth;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.load.image('background', 'src/assets/background.png')
        this.load.image('obstacle', 'src/assets/obstacle.png');
        this.load.spritesheet('winny', 'src/assets/winny.png', { frameWidth: 16, frameheight: 16});
    }

    create ()
    {
        const background = this.add.image(180, 320, 'background');

        this.obstacles = this.physics.add.group();

        for (let index = 0; index < this.PAIRS; index++) {
            let offset = 256 * (index + 1);
            this.createObstacles(offset);
        }

        this.obstacleChildren = this.obstacles.getChildren();

        this.winny = this.physics.add.sprite(50, this.canvas.height / 2, 'winny').setScale(2);
        this.winny.setCollideWorldBounds(true);
        this.winny.setGravityY(1000);

        this.cursors.space.on('down', () => {this.winny.setVelocityY(-300);});

        for (let index = 0, length = this.obstacleChildren.length; index < length; index++) {
            let obstacle = this.obstacleChildren[index];
            obstacle.setVelocityX(-150);
        }
    }

    update ()
    {   
        this.listenLeavePlayArea();
    }

    createObstacles(offset) {
        let widthScale = 64 / 16;
        let heights = this.getScaledObstacleHeights();
        let obstacleX = this.canvas.width + offset;
        let obstacleTopY = heights[0] * 16 / 2;
        let obstacleBottomY = this.canvas.height - (heights[1] * 16 / 2);

        this.obstacles.create(obstacleX, obstacleTopY, 'obstacle').setScale(widthScale, heightScaleTop);
        this.obstacles.create(obstacleX, obstacleBottomY, 'obstacle').setScale(widthScale, heightScaleBottom);
    }

    getScaledObstacleHeights() {
        let spaceBetween = 56;
        // The height of the top obstacle should be between 1/4 of the canvas height and 3/4 of the canvas height.
        // However, we are accounting for the space between the top and bottom obstacles in this height.
        // Therefore, the height really is between 1/4 the canvas and 3/4 the canvas minus the space between height. 
        let maxHeight = (this.canvas.height * 3 / 4) - spaceBetween
        let topHeight = Math.floor(Math.random() * maxHeight) + (this.canvas.height / 4);
        if (topHeight < (this.canvas.height / 4)) topHeight = this.canvas.height / 4;
        let bottomHeight = this.canvas.height - topHeight - spaceBetween;

        return [topHeight, bottomHeight];
    }

    listenLeavePlayArea() {
        for (let index = 0, length = this.obstacles.getLength(); index < length; index++) {
            if (this.checkOutsidePlayArea(index)) {
                let obstacle = this.obstacleChildren[index];
                this.resetObstacle(obstacle, index);
            }
        }
    }

    checkOutsidePlayArea(index) {
        let obstacle = this.obstacles.getChildren()[index];
        let x = obstacle.body.x;
        if (x <= -64) {
            return true;
        }
        return false;
    }

    resetObstacles(index) {
        let topObstacle = this.obstacleChildren[index];
        let bottomObstacle = this.obstacleChildren[index + 1];
        let heights = this.getScaledObstacleHeights();
        let obstacleTopHeight = heights[0] * 16 / 2;
        let obstacleBottomHeight = this.canvas.height - (heights[1] * 16 / 2);

        this.setObstaclePosition(index, topObstacle, heights[0]);
        this.setObstaclePosition(index + 1, bottomObstacle, heights[1]);
    }

    setObstaclePosition(index, obstacle, height) {
        let leadObstacleIndex = (index + this.PAIRS + 1) % (this.PAIRS * 2);
        let leadObstacle = this.obstacleChildren[leadObstacleIndex];
        
        obstacle.body.x = leadObstacle.body.x + 224;
        ;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);