// import * as cfg from "../utils/config.js";

class SmoothedHorionztalControl {
  constructor(speed) {
      this.msSpeed = speed;
      this.value = 0;
  }

  moveLeft(delta) {
      if (this.value > 0) { this.reset(); }
      this.value -= this.msSpeed * delta;
      if (this.value < -1) { this.value = -1; }
  }

  moveRight(delta) {
      if (this.value < 0) { this.reset(); }
      this.value += this.msSpeed * delta;
      if (this.value > 1) { this.value = 1; }
  }

  reset() {
      this.value = 0;
  }
}

class Map1 extends Phaser.Scene {
  constructor() {
    super("Map1");
  }

  blockLayer;
  playerController;
  cursors;
  smoothedControls;

  preload() {
    this.load.image("tiles", "assets/tilesets/tiles.png");
    this.load.image('door_1(7px)', 'assets/tilesets/door_1(7px).png');
    this.load.image('barril', 'assets/tilesets/barrel_1(0px).png');
    this.load.image('escada', 'assets/tilesets/ladder(7px).png');
    this.load.image('door_2(14px)', 'assets/tilesets/door_2(14px).png');
    this.load.image('torch(7px)', 'assets/tilesets/torch(7px).png');
    this.load.image('window(19px)', 'assets/tilesets/window(19px).png');
    this.load.image('ladder_middle(0px)', 'assets/tilesets/ladder_middle(0px).png');

    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // this.load.spritesheet(cfg.sheet("player", "assets/character/player/idle/player_idle.png", 170, 96, 14));
    this.load.spritesheet('player', 'assets/character/player/idle/player_idle.png', { frameWidth: 170, frameHeight: 96 });
    // this.load.spritesheet(cfg.sheet("knight", "assets/character/knight/idle/knight_idle.png", 64, 64, 14));
    // this.load.spritesheet(cfg.sheet("warrior", "assets/character/warrior/idle/warrior_idle.png", 96, 96, 20));
    // this.load.spritesheet(cfg.sheet("archer", "assets/character/archer/idle/archer_idle.png", 96, 96, 15));
    // this.load.spritesheet(cfg.sheet("necromancer", "assets/character/necromancer/idle/necromancer_idle.png", 96, 96, 50));
    // this.load.spritesheet(cfg.sheet("king", "assets/character/king/idle/king_idle.png", 128, 128, 17));
    // this.load.spritesheet(cfg.sheet("archer_2", "assets/character/archer_2/idle/archer2_idle.png", 128, 128, 7));
  }

  create(data) {
    this.map = this.make.tilemap({ key: "map1" });

    const blocks = this.map.addTilesetImage("ts1", "tiles");
    const closed_door_tile = this.map.addTilesetImage("door_1(7px)", "door_1(7px)");
    const stairs_tiles = this.map.addTilesetImage("ladder(7px)", "escada");
    const barrel_tile = this.map.addTilesetImage("barrel(1px)", "barril");
    const opened_door_tile = this.map.addTilesetImage("door_2(14px)", "door_2(14px)");
    const torch_tile = this.map.addTilesetImage("torch(7px)", "torch(7px)");
    const ladder_middle_tile = this.map.addTilesetImage("ladder_middle(0px)", "ladder_middle(0px)");
    const window_tile = this.map.addTilesetImage("window(19px)", "window(19px)");
    
    const inner_background = this.map.createStaticLayer("fundo_interno", blocks, 0, 0);
    const outside_background = this.map.createStaticLayer("fundo", blocks, 0, 0);

    this.blockLayer = this.map.createStaticLayer("blocklayer", blocks, 0, 0);

    this.blockLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.blockLayer);

    this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
    this.matter.world.createDebugGraphic();
    this.matter.world.drawDebug = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.smoothedControls = new SmoothedHorionztalControl(0.0005);

    this.playerController = {
      matterSprite: this.matter.add.sprite(0, 0, 'player', 4),
      blocked: {
          left: false,
          right: false,
          bottom: false
      },
      numTouching: {
          left: 0,
          right: 0,
          bottom: 0
      },
      sensors: {
          bottom: null,
          left: null,
          right: null
      },
      time: {
          leftDown: 0,
          rightDown: 0
      },
      lastJumpedAt: 0,
      speed: {
          run: 7,
          jump: 10
      }
  };

  const M = Phaser.Physics.Matter.Matter;
  const w = this.playerController.matterSprite.width;
  const h = this.playerController.matterSprite.height;

  // The player's body is going to be a compound body:
  //  - playerBody is the solid body that will physically interact with the world. It has a
  //    chamfer (rounded edges) to avoid the problem of ghost vertices: http://www.iforce2d.net/b2dtut/ghost-vertices
  //  - Left/right/bottom sensors that will not interact physically but will allow us to check if
  //    the player is standing on solid ground or pushed up against a solid object.

  // Move the sensor to player center
  const sx = w / 2;
  const sy = h / 2;

  // The player's body is going to be a compound body.
  const playerBody = M.Bodies.rectangle(sx-5, sy+25, w * 0.25, h*0.38, { chamfer: { radius: 7 } });
  this.playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, { isSensor: true });
  this.playerController.sensors.left = M.Bodies.rectangle(sx - w * 0.25, sy, 5, h * 0.25, { isSensor: true });
  this.playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.25, sy, 5, h * 0.25, { isSensor: true });
  const compoundBody = M.Body.create({
      parts: [
          playerBody, this.playerController.sensors.bottom, this.playerController.sensors.left,
          this.playerController.sensors.right
      ],
      friction: 0.01,
      restitution: 0.05 // Prevent body from sticking against a wall
  });

  this.playerController.matterSprite
      .setExistingBody(compoundBody)
      .setFixedRotation() // Sets max inertia to prevent rotation
      .setPosition(630, 1000);

      this.matter.world.on('beforeupdate', function (event) {
        this.playerController.numTouching.left = 0;
        this.playerController.numTouching.right = 0;
        this.playerController.numTouching.bottom = 0;
    }, this);

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.matter.world.on('collisionactive', function (event)
    {
        const playerBody = this.playerController.body;
        const left = this.playerController.sensors.left;
        const right = this.playerController.sensors.right;
        const bottom = this.playerController.sensors.bottom;

        for (let i = 0; i < event.pairs.length; i++)
        {
            const bodyA = event.pairs[i].bodyA;
            const bodyB = event.pairs[i].bodyB;

            if (bodyA === playerBody || bodyB === playerBody)
            {
                continue;
            }
            else if (bodyA === bottom || bodyB === bottom)
            {
                // Standing on any surface counts (e.g. jumping off of a non-static crate).
                this.playerController.numTouching.bottom += 1;
            }
            else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic))
            {
                // Only static objects count since we don't want to be blocked by an object that we
                // can push around.
                this.playerController.numTouching.left += 1;
            }
            else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
            {
                this.playerController.numTouching.right += 1;
            }
        }
    }, this);

    // Update over, so now we can determine if any direction is blocked
    this.matter.world.on('afterupdate', function (event) {
        this.playerController.blocked.right = this.playerController.numTouching.right > 0 ? true : false;
        this.playerController.blocked.left = this.playerController.numTouching.left > 0 ? true : false;
        this.playerController.blocked.bottom = this.playerController.numTouching.bottom > 0 ? true : false;
    }, this);

    this.input.on('pointerdown', function () {
        this.matter.world.drawDebug = !this.matter.world.drawDebug;
        this.matter.world.debugGraphic.visible = this.matter.world.drawDebug;
    }, this);    

    // outside_background.setCollisionByProperty({ collides: true });
    
    // this.shapeGraphics = this.add.graphics();
    // this.drawCollisionShapes(this.shapeGraphics);

    const closed_door = this.map.createStaticLayer("porta_fechada", closed_door_tile, 0, 0);
    const opened_door = this.map.createStaticLayer("porta_aberta", opened_door_tile, 0, 0);
    const stairs = this.map.createStaticLayer("escadas", stairs_tiles, 0, 0);
    const barrels = this.map.createStaticLayer("barris", barrel_tile, 0, 0);
    const torchs = this.map.createStaticLayer("tochas", torch_tile, 0, 0);
    const middle_ladder = this.map.createStaticLayer("escada_meio", ladder_middle_tile, 0, 0);
    const windows = this.map.createStaticLayer("janelas", window_tile, 0, 0);
    
    // this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
    // this.anims.create(cfg.anims(this, "idle", "player", 14));
    // this.anims.create(cfg.anims(this, "idleKnight", "knight", 14));
    // this.anims.create(cfg.anims(this, "idleWarrior", "warrior", 20));
    // this.anims.create(cfg.anims(this, "idleArcher", "archer", 15));
    // this.anims.create(cfg.anims(this, "idleNecromancer", "necromancer", 45));
    // this.anims.create(cfg.anims(this, "idleKing", "king", 17));
    // this.anims.create(cfg.anims(this, "idleArcher2", "archer_2", 7));
    
    // this.player = this.physics.add.sprite(160, 200, "player").setSize(35, 35).setOffset(63, 41);
    // this.physics.add.collider(this.player, this.blockLayer);
    // this.player.play("idle");
    // this.player.setCollideWorldBounds(true);
    
    // this.knight = this.physics.add.sprite(100, 264, "knight");
    // this.knight.play("idleKnight");

    // this.warrior = this.physics.add.sprite(700, 264, "warrior");
    // this.warrior.play("idleWarrior");

    // this.archer = this.physics.add.sprite(750, 264, "archer");
    // this.archer.play("idleArcher");

    // this.necro = this.physics.add.sprite(800, 264, "necromancer");
    // this.necro.play("idleNecromancer");

    // this.king = this.physics.add.sprite(850, 264, "king");
    // this.king.play("idleKing");

    // this.archer2 = this.physics.add.sprite(950, 264, "archer_2");
    // this.archer2.play("idleArcher2");

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.blockLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // outside_background.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // this.physics.world.setBounds(0, 0, 2100, 400);

    // const camera = this.cameras.main;
    // camera.setBounds(0, 0, 2100, 400);
    // camera.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time, delta) {
    // let cursors = this.input.keyboard.createCursorKeys();

    // if(cursors.left.isDown || this.a.isDown || cursors.right.isDown || this.d.isDown) {
    //   this.player.setVelocityX(cursors.left.isDown || this.a.isDown ? -160 : 160);

    // } else {
    //   this.player.setVelocityX(0);
    // }

    // if(cursors.up.isDown || this.w.isDown || cursors.down.isDown || this.s.isDown) {
    //   this.player.setVelocityY(cursors.up.isDown || this.w.isDown ? -160 : 160);

    // } else {
    //   this.player.setVelocityY(0);
    // }

    const matterSprite = this.playerController.matterSprite;

        // Horizontal movement
        let oldVelocityX;
        let targetVelocityX;
        let newVelocityX;

        if (this.cursors.left.isDown && !this.playerController.blocked.left)
        {
            this.smoothedControls.moveLeft(delta);
            // matterSprite.anims.play('left', true);

            // Lerp the velocity towards the max run using the smoothed controls. This simulates a
            // player controlled acceleration.
            oldVelocityX = matterSprite.body.velocity.x;
            targetVelocityX = -this.playerController.speed.run;
            newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -this.smoothedControls.value);

            matterSprite.setVelocityX(newVelocityX);
        }
        else if (this.cursors.right.isDown && !this.playerController.blocked.right)
        {
            this.smoothedControls.moveRight(delta);
            // matterSprite.anims.play('right', true);

            // Lerp the velocity towards the max run using the smoothed controls. This simulates a
            // player controlled acceleration.
            oldVelocityX = matterSprite.body.velocity.x;
            targetVelocityX = this.playerController.speed.run;
            newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, this.smoothedControls.value);

            matterSprite.setVelocityX(newVelocityX);
        }
        else
        {
            this.smoothedControls.reset();
            // matterSprite.anims.play('idle', true);
        }

        // Jumping & wall jumping

        // Add a slight delay between jumps since the sensors will still collide for a few frames after
        // a jump is initiated
        const canJump = (time - this.playerController.lastJumpedAt) > 250;
        if (this.cursors.up.isDown & canJump)
        {
            if (this.playerController.blocked.bottom)
            {
                matterSprite.setVelocityY(-this.playerController.speed.jump);
                this.playerController.lastJumpedAt = time;
            }
            else if (this.playerController.blocked.left)
            {
                // Jump up and away from the wall
                matterSprite.setVelocityY(-this.playerController.speed.jump);
                matterSprite.setVelocityX(this.playerController.speed.run);
                this.playerController.lastJumpedAt = time;
            }
            else if (this.playerController.blocked.right)
            {
                // Jump up and away from the wall
                matterSprite.setVelocityY(-this.playerController.speed.jump);
                matterSprite.setVelocityX(-this.playerController.speed.run);
                this.playerController.lastJumpedAt = time;
            }
        }

        // this.smoothMoveCameraTowards(matterSprite, 0.9);
        // this.updateText();
  }
}

export default Map1;