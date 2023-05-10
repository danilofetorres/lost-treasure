function preload() {
    this.load.image('tiles', 'assets/tilesets/tiles.png')
    this.load.image('barril', 'assets/tilesets/barrel_1(0px).png')
    this.load.image('escada', 'assets/tilesets/ladder(7px).png')
    this.load.image('door_1(7px)', 'assets/tilesets/door_1(7px).png')
    this.load.image('door_2(14px)', 'assets/tilesets/door_2(14px).png')
    this.load.image('torch(7px)', 'assets/tilesets/torch(7px).png')
    this.load.image('window(19px)', 'assets/tilesets/window(19px).png')
    this.load.image('ladder_middle(0px)', 'assets/tilesets/ladder_middle(0px).png')
    this.load.tilemapTiledJSON('map1', 'assets/tilesets/teste.json')
    this.load.spritesheet({
    key: 'player',
    url: 'assets/character/knight/idle/knight_idle.png',
    frameConfig: {
        frameWidth: 64,
        frameHeight: 64,
        startFrame: 0,
        endFrame: 14
    }
});
}

function create() {
    const map = this.add.tilemap('map1')
    
    const blocks = map.addTilesetImage('ts1', 'tiles')
    const stairs_tiles = map.addTilesetImage('ladder(7px)', 'escada')
    const barrel_tile = map.addTilesetImage('barrel(1px)', 'barril')
    const closed_door_tile = map.addTilesetImage('door_1(7px)', 'door_1(7px)')
    const opened_door_tile = map.addTilesetImage('door_2(14px)', 'door_2(14px)')
    const torch_tile = map.addTilesetImage('torch(7px)', 'torch(7px)')
    const ladder_middle_tile = map.addTilesetImage('ladder_middle(0px)', 'ladder_middle(0px)')
    const window_tile = map.addTilesetImage('window(19px)', 'window(19px)')

    
    const inner_background = map.createStaticLayer('fundo_interno', blocks, 0, 0)
    const outside_background = map.createStaticLayer('fundo', blocks, 0, 0)

    
    const closed_door = map.createStaticLayer('porta_fechada', closed_door_tile, 0, 0)
    const opened_door = map.createStaticLayer('porta_aberta', opened_door_tile, 0, 0)
    const stairs = map.createStaticLayer('escadas', stairs_tiles, 0, 0)
    const barrels = map.createStaticLayer('barris', barrel_tile, 0, 0)
    const blocklayer = map.createStaticLayer('blocklayer', blocks, 0, 0)
    const torchs = map.createStaticLayer('tochas', torch_tile, 0, 0)
    const middle_ladder = map.createStaticLayer('escada_meio', ladder_middle_tile, 0, 0)
    const windows = map.createStaticLayer('janelas', window_tile, 0, 0)
    
    
    
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    
    const anim = {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 14, first: 14 }),
            frameRate: 10,
            repeat: -1
        };
    this.anims.create(anim);

    this.player = this.physics.add.sprite(config.width / 2, config.height / 2, 'player');
    this.player.play('idle');

    
    //this.add.image(config.width / 2, config.height / 2, 'player', 0);
    //this.player = this.physics.add.image(config.width / 2, config.height / 2, 'player').setScale(1, 1);
    this.player.setCollideWorldBounds(true);
}

function update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if ((cursors.left.isDown || this.a.isDown) || (cursors.right.isDown || this.d.isDown)) this.player.setVelocityX(cursors.left.isDown || this.a.isDown ? -160 : 160);
    else this.player.setVelocityX(0);
    if ((cursors.up.isDown || this.w.isDown) || (cursors.down.isDown || this.s.isDown)) this.player.setVelocityY(cursors.up.isDown || this.w.isDown ? -160 : 160);
    else this.player.setVelocityY(0);
}

const config = {
    type: Phaser.AUTO,
    width: 2160,
    height: 1440,
    backgroundColor: '#f9f9f9',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);