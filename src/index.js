// import Phaser from 'phaser';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('background', 'src/assets/background.png')
        this.load.image('obstacle', 'src/assets/obstacle.png');
        this.load.image('winny', 'src/assets/winny.png');
    }

    create ()

    {
        const background = this.add.image(180, 320, 'background');
        const obstacle = this.add.image(300, 120, 'obstacle').setScale(2);
        const winny = this.add.image(100, 120, 'winny').setScale(2);

    }
}

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scene: MyGame
};

const game = new Phaser.Game(config);