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
        let scale = (this.canvas.height / 2 - 64) / 16;
        
        const background = this.add.image(180, 320, 'background');

        this.obstacles = this.physics.add.group();
        this.obstacles.create(this.canvas.width - 16, (scale * 16 / 2), 'obstacle').setScale(4, scale);
        this.obstacles.create(this.canvas.width - 16, (this.canvas.height / 2 + 32) + (scale * 16 / 2), 'obstacle').setScale(4, scale);

        const winny = this.physics.add.sprite(50, this.canvas.height / 2, 'winny').setScale(2);
        winny.setCollideWorldBounds(true);
        winny.setGravityY(1000);

        this.cursors.space.on('down', () => {winny.setVelocityY(-300);});
    }

    update ()
    {
        this.obstacles.setVelocityX(-300);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: {y: 1000},
            fps: 60
        }
    },
    scene: MyGame
};

const game = new Phaser.Game(config);