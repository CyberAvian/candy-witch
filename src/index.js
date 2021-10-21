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
        this.width = 64 / 16;

        for (let index = 0; index < this.PAIRS; index++) {
            let offset = 256 * (index + 1);
            this.createObstacles(offset);
        }

        this.obstacleChildren = this.obstacles.getChildren();
        this.testObstacle = this.obstacleChildren[0];
        // console.log(`Test 0: ${this.testObstacle.body.x}`);

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
        let heights = this.getScaledHeights();
        let obstacleX = this.canvas.width + offset;
        let topObstacleY = heights[0] * 16 / 2;
        let bottomObstacleY = this.canvas.height - (heights[1] * 16 / 2);
        
        let topObstacle = this.obstacles.create(obstacleX, topObstacleY, 'obstacle').setScale(this.width, heights[0]);
        let bottomObstacle = this.obstacles.create(obstacleX, bottomObstacleY, 'obstacle').setScale(this.width, heights[1]);
    }

    getScaledHeights() {
        let spaceBetween = 56;
        // The height of the top obstacle should be between 1/4 of the canvas height and 3/4 of the canvas height.
        // However, we are accounting for the space between the top and bottom obstacles in this height.
        // Therefore, the height really is between 1/4 the canvas and 3/4 the canvas minus the space between height. 
        let maxHeight = (this.canvas.height * 3 / 4) - spaceBetween
        let topHeight = Math.floor(Math.random() * maxHeight) + (this.canvas.height / 4);
        if (topHeight < (this.canvas.height / 4)) topHeight = this.canvas.height / 4;
        let bottomHeight = this.canvas.height - topHeight - spaceBetween;

        return [topHeight / 16, bottomHeight / 16];
    }

    listenLeavePlayArea() {
        for (let index = 0, length = this.obstacles.getLength(); index < length; index += 2) {
            // console.log(`Test 3: ${this.testObstacle.body.x}`);
            if (this.isOutsidePlayArea(index)) this.resetObstacles(index);
        }
        this.testObstacle = this.obstacleChildren[0];
    }

    isOutsidePlayArea(index) {
        this.testObstacle = this.obstacleChildren[0];
        let obstacle = this.obstacleChildren[index];
        let x = obstacle.body.x;
        if (x <= -64) {
            return true;
        }
        return false;
    }

    resetObstacles(index) {
        let heights = this.getScaledHeights();

        let topObstacle = this.obstacleChildren[index];
        let bottomObstacle = this.obstacleChildren[index + 1];

        let leadIndex = (index + this.PAIRS + 1) % (this.PAIRS * 2);
        let topLeadObstacle = this.obstacleChildren[leadIndex];
        let bottomLeadObstacle = this.obstacleChildren[leadIndex + 1];

        let topObstacleX = topLeadObstacle.body.x + 256;
        let bottomObstacleX = bottomLeadObstacle.body.x + 256;

        let topObstacleY = heights[0] * 16 / 2;
        let bottomObstacleY = this.canvas.height - (heights[1] * 16 / 2);

        this.obstacles.remove(topObstacle, true, true);
        this.obstacles.remove(bottomObstacle, true, true);

        this.obstacles.create(topObstacleX, topObstacleY, 'obstacle').setScale(this.width, heights[0]).setVelocityX(-150);
        this.obstacles.create(bottomObstacleX, bottomObstacleY, 'obstacle').setScale(this.width, heights[1]).setVelocityX(-150);
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