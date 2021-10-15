// import Phaser from 'phaser';

class MyGame extends Phaser.Scene
{
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
        let scale = (this.canvas.height / 2 - 32) / 16;
        
        const background = this.add.image(180, 320, 'background');

        this.obstacles = this.physics.add.group();

        let obstacleTopY = (scale * 16 / 2);
        let obstacleBottomY = (scale * 16 / 2) + (this.canvas.height / 2 + 56)
        this.obstacles.create(this.canvas.width + 576, obstacleTopY, 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width + 576, obstacleBottomY, 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width + 800, obstacleTopY, 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width + 800, obstacleBottomY, 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width + 1024, obstacleTopY, 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width + 1024, obstacleBottomY, 'obstacle').setScale(4, scale);

        this.winny = this.physics.add.sprite(50, this.canvas.height / 2, 'winny').setScale(2);
        this.winny.setCollideWorldBounds(true);
        this.winny.setGravityY(1000);

        this.cursors.space.on('down', () => {this.winny.setVelocityY(-300);});

        for (let index = 0, length = this.obstacles.getLength(); index < length; index++) {
            let obstacle = this.obstacles.getChildren()[index];
            obstacle.setVelocityX(-150);
        }

    }

    update ()
    {   
        for (let index = 0, length = this.obstacles.getLength(); index < length; index++) {
            let obstacle = this.obstacles.getChildren()[index];
            let x = obstacle.body.x;
            if (x <= -64) {
                let leadingPosition = (index + 2) % 6;
                console.log(`Index ${index} Leading Position ${leadingPosition}`);
                let leadingObstacle = this.obstacles.getChildren()[leadingPosition];
                let leadingObstacleX = leadingObstacle.body.x;
                obstacle.body.x = leadingObstacleX + 224;
            }
        }
    }

    createObstacle() {
        let width = 64;
        let spaceBetween = 56;
        let topHeight = Math.floor( Math.random() * ( this.canvas.height * 3 / 4 ) );
        let bottomHeight = this.canvas.height - ( topHeight + spaceBetween );
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