function preload() {
    this.load.image('tiles', 'assets/tilesets/tiles.png')
    this.load.image('barril', 'assets/tilesets/barrel_1(0px).png')
    this.load.image('escada', 'assets/tilesets/ladder(7px).png')
    this.load.image('door_1(7px)', 'assets/tilesets/door_1(7px).png')
    this.load.image('door_2(14px)', 'assets/tilesets/door_2(14px).png')
    this.load.image('torch(7px)', 'assets/tilesets/torch(7px).png')
    this.load.image('window(19px)', 'assets/tilesets/window(19px).png')
    this.load.image('ladder_middle(0px)', 'assets/tilesets/ladder_middle(0px).png')
    this.load.image('fundo_vermelho', 'assets/tilesets/fundo_vermelho.png')
    this.load.image('chest(0px)', 'assets/tilesets/chest(0px).png')
    this.load.image('coins', 'assets/tilesets/image-removebg-preview-removebg-preview.png')

    this.load.tilemapTiledJSON('map1', 'assets/tilesets/teste.json')
    this.load.tilemapTiledJSON('map2', 'assets/tilesets/map2.json')
    // this.load.spritesheet({
    //     key: 'player',
    //     url: 'assets/character/knight/idle/player_idle.png',
    //     frameConfig: {
    //         frameWidth: 64,
    //         frameHeight: 64,
    //         startFrame: 0,
    //         endFrame: 14
    //     }
    // });
    this.load.spritesheet({
        key: 'knight',
        url: 'assets/character/knight/idle/knight_idle.png',
        frameConfig: {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 14
        }
    });
    this.load.spritesheet({
        key: 'warrior',
        url: 'assets/character/warrior/idle/warrior_idle.png',
        frameConfig: {
            frameWidth: 96,
            frameHeight: 96,
            startFrame: 0,
            endFrame: 20
        }
    });
    this.load.spritesheet({
        key: 'archer',
        url: 'assets/character/archer/idle/archer_idle.png',
        frameConfig: {
            frameWidth: 96,
            frameHeight: 96,
            startFrame: 0,
            endFrame: 15
        }
    });
    this.load.spritesheet({
        key: 'necromancer',
        url: 'assets/character/necromancer/idle/necromancer_idle.png',
        frameConfig: {
            frameWidth: 96,
            frameHeight: 96,
            startFrame: 0,
            endFrame: 50
        }
    });
     this.load.spritesheet({
        key: 'king',
        url: 'assets/character/king/idle/king_idle.png',
        frameConfig: {
            frameWidth: 128,
            frameHeight: 128,
            startFrame: 0,
            endFrame: 17
        }
    });
    // this.load.spritesheet({
    //     key: 'archer_2',
    //     url: 'assets/character/archer_2/idle/archer2_idle.png',
    //     frameConfig: {
    //         frameWidth: 128,
    //         frameHeight: 128,
    //         startFrame: 0,
    //         endFrame: 7
    //     }
    // });
}

function create() {
    this.map = this.make.tilemap({key: 'map1', tileWidth: 48, tileHeight: 48})

    const blocks = this.map.addTilesetImage('ts1', 'tiles')
    const closed_door_tile = this.map.addTilesetImage('door_1(7px)', 'door_1(7px)')
    const inner_background = this.map.createStaticLayer('fundo_interno', blocks, 0, 0)
    const outside_background = this.map.createStaticLayer('fundo', blocks, 0, 0)
    


    const closed_door = this.map.createStaticLayer('porta_fechada', closed_door_tile, 0, 0)
    generateCommonLayers(this, blocks)
    
    
    
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    
    // const animPlayer = {
    //         key: 'idle',
    //         frames: this.anims.generateFrameNumbers('player', { start: 0, end: 14, first: 14 }),
    //         frameRate: 10,
    //         repeat: -1
    // };
    const animKnight = {
            key: 'idleKnight',
            frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 14, first: 14 }),
            frameRate: 10,
            repeat: -1
    };
    const animWarrior = {
        key: 'idleWarrior',
            frames: this.anims.generateFrameNumbers('warrior', { start: 0, end: 20, first: 20 }),
            frameRate: 10,
            repeat: -1
    }
    const animArcher = {
        key: 'idleArcher',
            frames: this.anims.generateFrameNumbers('archer', { start: 1, end: 15, first: 15 }),
            frameRate: 10,
            repeat: -1
    }
    const animNecro = {
        key: 'idleNecro',
            frames: this.anims.generateFrameNumbers('necromancer', { start: 0, end: 45, first: 45 }),
            frameRate: 10,
            repeat: -1
    }
    const animKing = {
        key: 'idleKing',
            frames: this.anims.generateFrameNumbers('king', { start: 0, end: 17, first: 17 }),
            frameRate: 10,
            repeat: -1
    }
    // const animDashArc = {
    //     key: 'idleDashArc',
    //         frames: this.anims.generateFrameNumbers('archer_2', { start: 0, end: 7, first: 7 }),
    //         frameRate: 10,
    //         repeat: -1
    // }
    //this.anims.create(animPlayer);
    this.anims.create(animWarrior);
    this.anims.create(animArcher);
    this.anims.create(animNecro);
    this.anims.create(animKnight);
    this.anims.create(animKing);
    // this.anims.create(animDashArc);

    this.player = this.physics.add.sprite(70, 264, 'knight');
    this.player.play('idleKnight');

    this.warrior = this.physics.add.sprite(700, 264, 'warrior');
    this.warrior.play('idleWarrior')

    this.warrior = this.physics.add.sprite(750, 264, 'archer');
    this.warrior.play('idleArcher')
    this.warrior = this.physics.add.sprite(800, 264, 'necromancer');
    this.warrior.play('idleNecro')
  //  this.warrior = this.physics.add.sprite(950, 264, 'knight');
   // this.warrior.play('idleKnight')
    this.warrior = this.physics.add.sprite(850, 264, 'king');
    this.warrior.play('idleKing')
    // this.warrior = this.physics.add.sprite(950, 264, 'archer_2');
    // this.warrior.play('idleDashArc')

    
    //this.add.image(config.width / 2, config.height / 2, 'player', 0);
    //this.player = this.physics.add.image(config.width / 2, config.height / 2, 'player').setScale(1, 1);
    this.player.setCollideWorldBounds(true);
}

function update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if ((cursors.left.isDown || this.a.isDown) || (cursors.right.isDown || this.d.isDown)) {
        this.player.setVelocityX(cursors.left.isDown || this.a.isDown ? -160 : 160);
    }
         
else this.player.setVelocityX(0);
    if ((cursors.up.isDown || this.w.isDown) || (cursors.down.isDown || this.s.isDown)){
        this.player.setVelocityY(cursors.up.isDown || this.w.isDown ? -160 : 160);
    } 
    else this.player.setVelocityY(0);

    let x = Math.round(this.player.x);
    let y = Math.round(this.player.y)
    if((x > 65 && x < 75) && (y > 1320 && y < 1330)){
        this.player.x = 70;
        this.player.y = 528/2;
        loadmap2(this);

        this.player = this.physics.add.sprite(70, 528/2, 'knight');
        this.player.play('idleKnight');
        this.player.setCollideWorldBounds(true);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 2160,
    height: 2880,
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
function loadmap2(obj){
    obj.map.destroy();
    obj.map = obj.make.tilemap({key: 'map2', tileWidth: 48, tileHeight: 48});
    const blocks = obj.map.addTilesetImage('ts1', 'tiles');
    const red_background = obj.map.addTilesetImage('fundo_vermelho', 'fundo_vermelho');
    const coin = obj.map.addTilesetImage('image-removebg-preview-removebg-preview', 'coins')
    const chest = obj.map.addTilesetImage('chest(0px)', 'chest(0px)');
    
    const inner_background = obj.map.createStaticLayer('fundo', red_background, 0, 0)
    const moedas = obj.map.createStaticLayer('moedas', coin, 0, 0)
    const chests = obj.map.createStaticLayer('baus', chest, 0, 0)
    
    generateCommonLayers(obj, blocks);
}

function generateCommonLayers(obj, blocks){
    const stairs_tiles = obj.map.addTilesetImage('ladder(7px)', 'escada')
    const barrel_tile = obj.map.addTilesetImage('barrel(1px)', 'barril')
    
    const opened_door_tile = obj.map.addTilesetImage('door_2(14px)', 'door_2(14px)')
    const torch_tile = obj.map.addTilesetImage('torch(7px)', 'torch(7px)')
    const ladder_middle_tile = obj.map.addTilesetImage('ladder_middle(0px)', 'ladder_middle(0px)')
    const window_tile = obj.map.addTilesetImage('window(19px)', 'window(19px)')
    

    
   
    const opened_door = obj.map.createStaticLayer('porta_aberta', opened_door_tile, 0, 0)
    const stairs = obj.map.createStaticLayer('escadas', stairs_tiles, 0, 0)
    const barrels = obj.map.createStaticLayer('barris', barrel_tile, 0, 0)
    const blocklayer = obj.map.createStaticLayer('blocklayer', blocks, 0, 0)
    const torchs = obj.map.createStaticLayer('tochas', torch_tile, 0, 0)
    const middle_ladder = obj.map.createStaticLayer('escada_meio', ladder_middle_tile, 0, 0)
    const windows = obj.map.createStaticLayer('janelas', window_tile, 0, 0)
}



const game = new Phaser.Game(config);