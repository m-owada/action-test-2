
// FROG DUNGEON ver 0.1 Copyright (c) 2021 m-owada.

/************************************************************
 * タイトル
 ************************************************************/

var titleScene = new Phaser.Scene("titleScene");

titleScene.preload = function()
{
    
    
    
    this.load.image("title", "img/title.png");
    
    this.load.spritesheet("char", "img/char.png", { frameWidth: 26, frameHeight: 32 });
    this.load.spritesheet("tile", "img/tile.png", { frameWidth: 32, frameHeight: 32 });
    
    this.load.spritesheet("button", "img/button.png", { frameWidth: 64, frameHeight: 32 });
    
    this.load.image("message", "img/message.png");
    
    this.load.tilemapTiledJSON("map001", "map/map001.json");
    this.load.tilemapTiledJSON("map002", "map/map002.json");
    
    
    
    this.load.html("login", "form/login.html");
    
    
    
    
    
};

titleScene.create = function()
{
    var width = this.game.canvas.width;
    var height = this.game.canvas.height;
    
    
    var title = this.add.image(160, 100, "title");
    
    var text1 = this.add.text(76, 150, "NAME", { font: "12px sans-serif", color: "#ffffff" });
    
    var username = this.add.dom(160, 180).createFromHTML("<input type='text' name='username' size='20' maxlength='10' />").getChildByName("username");
    
    var text2 = this.add.text(76, 220, "PASSWORD", { font: "12px sans-serif", color: "#ffffff" });
    
    var password = this.add.dom(160, 250).createFromHTML("<input type='password' name='password' size='20' maxlength='10' />").getChildByName("password");
    
    
    
    var register = this.add.dom(90, 300).createFromHTML("<input type='checkbox' name='register' />").getChildByName("register");
    
    var text3 = this.add.text(104, 291, "新しくゲームを始める", { font: "12px sans-serif", color: "#ffffff" });
    
    
    var login = this.add.sprite(160, 360, "button", 0).setInteractive();
    
    
    
    
    login.on("pointerdown", function()
    {
        console.log(username.value);
        console.log(password.value);
        console.log(register.checked);
        
        titleScene.scene.start("mainScene", { id: 1, x: 128, y: 96, flipX: false });
        
    });
    
    
    
    
    
};

titleScene.update = function()
{
    if(this.input.mousePointer.isDown)
    {
        //this.scene.start("mainScene", { id: 1, x: 128, y: 96, flipX: false });
    }
    
    
    
    
    
};

/************************************************************
 * メイン
 ************************************************************/

var mainScene = new Phaser.Scene("mainScene");

var player;
var cursors;
var layer;
var layer2;
var blocks = [];
var mails = [];
var menu;
var msgBox;
var msgText;

//mainScene.preload = function()
//{
//};

mainScene.create = function(data)
{
    player = null;
    cursors = null;
    layer = null;
    layer2 = null;
    blocks = [];
    mails = [];
    menu = null;
    msgBox = null;
    msgText = null;
    
    
    this.createPlayer(data.x, data.y, data.flipX);
    
    
    this.createMap(data.id);
    
    
    
    
    
    
    
    
    
    
    
    
    
    this.createObject();
    
    this.createTimer();
    
    
    
    this.createUi();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    cursors = this.input.keyboard.createCursorKeys();
    
    
    
    var mainCamera = this.cameras.main;
    mainCamera.startFollow(player, true);
    
    mainCamera.ignore(this.getUiObjects());
    
    var uiCamera = this.cameras.add(0, 0, this.game.canvas.width, this.game.canvas.height);
    uiCamera.ignore(this.getMainObjects());
    
    
    
    
    this.fadeIn();
    
    
    
};












mainScene.update = function()
{
    if(!this.physics.world.isPaused)
    {
        this.updateExit();
        
        
        
        
        
        
        
        
        
        
        this.updateObject();
        
        
        this.updatePlayer();
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};








mainScene.getMainObjects = function()
{
    return [].concat([player, layer, layer2]).concat(blocks).concat(mails);
}

mainScene.getUiObjects = function()
{
    return [].concat([menu, msgBox, msgText]);
}

mainScene.getFadeObjects = function()
{
    return [].concat(this.getMainObjects()).concat([menu]);
}

mainScene.pause = function(flg)
{
    if(flg)
    {
        this.physics.pause();
        player.stop();
    }
    else
    {
        this.physics.resume();
    }
    player.actionSetting.jump = -1;
    player.actionSetting.spead = 0;
}


mainScene.fadeIn = function(callback)
{
    var targets = this.getFadeObjects();
    var func = callback || function(){ return; };
    
    this.pause(true);
    
    for(var i = 0; i < targets.length; i++)
    {
        targets[i].setAlpha(0);
    }
    
    this.tweens.add(
    {
        targets: targets,
        alpha: 1,
        duration: 500,
        ease: "Cubic.easeIn"
    }, this);
    
    this.time.addEvent(
    {
        delay: 500,
        callback: function()
        {
            func();
            mainScene.pause(false);
            return;
        },
        loop: false
    });
};


mainScene.fadeOut = function(callback)
{
    var targets = this.getFadeObjects();
    var func = callback || function(){ return; };
    
    this.pause(true);
    
    this.tweens.add(
    {
        targets: targets,
        alpha: 0,
        duration: 500,
        ease: "Cubic.easeInOut"
    }, this);
    
    this.time.addEvent(
    {
        delay: 500,
        callback: function()
        {
            func();
            mainScene.pause(false);
            return;
        },
        loop: false
    });
};

mainScene.createPlayer = function(x, y, flipX)
{
    player = this.physics.add.sprite((flipX)? x + 12: x + 20, y + 16, "char");
    player.setBounce(0, 0);
    player.setFriction(0, 0);
    player.setCollideWorldBounds(false);
    player.setMaxVelocity(1000, 1000);
    player.actionSetting = { jump: -1, spead: 80 };
    player.setDepth(1);
    player.setFlipX(flipX);
    
    this.anims.create(
    {
        key: "stop",
        frames: this.anims.generateFrameNumbers("char", { frames: [0] }),
        frameRate: 8,
        repeat: 0
    });
    
    this.anims.create(
    {
        key: "move",
        frames: this.anims.generateFrameNumbers("char", { frames: [1, 0, 2, 0] }),
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create(
    {
        key: "jump",
        frames: this.anims.generateFrameNumbers("char", { frames: [3, 4] }),
        frameRate: 8,
        repeat: 0
    });
    
    player.isDuplicate = function(x, y, width, height)
    {
        if(x <= getX(this) && x + width >= getX(this) + getWidth(this) && y <= getY(this) && y + height >= getY(this) + getHeight(this))
        {
            return true;
        }
        return false;
    };
    
    player.isDuplicateSprite = function(sprite)
    {
        return this.isDuplicate(getX(sprite), getY(sprite), getWidth(sprite), getHeight(sprite));
    };
};

mainScene.createMap = function(id)
{
    var map = this.make.tilemap({ key: "map" + ("000" + id).slice(-3) });
    var tileset = map.addTilesetImage("tileset", "tile");
    layer = map.createLayer("layer", tileset, 0, 0);
    layer.setCollisionByProperty({ collision: true });
    layer.setDepth(0);
    
    layer.moveSetting = [];
    layer.messageSetting = [];
    
    for(var i = 0; i < layer.tilemap.properties.length; i++)
    {
        if(layer.tilemap.properties[i].name == "move")
        {
            layer.moveSetting = (new Function("return " + layer.tilemap.properties[i].value))();
        }
        else if(layer.tilemap.properties[i].name == "message")
        {
            layer.messageSetting = (new Function("return " + layer.tilemap.properties[i].value))();
        }
    }
    
    layer2 = map.createLayer("layer2", tileset, 0, 0);
    layer2.setDepth(2);
    
    this.physics.add.collider(player, layer);
};




mainScene.createObject = function()
{
    layer.forEachTile(function(tile)
    {
        var spriteFrame = -1;
        var velocityX = 0;
        var velocityY = 0;
        if(tile.index == 10)
        {
            spriteFrame = 10;
            velocityX = 80;
        }
        else if(tile.index == 12)
        {
            spriteFrame = 12;
            velocityY = 80;
        }
        else if(tile.index == 14)
        {
            spriteFrame = 14;
        }
        if(spriteFrame == 10 || spriteFrame == 12)
        {
            var block = mainScene.physics.add.sprite(layer.tileToWorldX(tile.x) + tile.width / 2, layer.tileToWorldY(tile.y) + tile.height / 2, "tile", spriteFrame);
            block.setBounce(0, 0);
            block.setFriction(0, 1);
            block.setPushable(false);
            block.body.setAllowGravity(false);
            block.velocitySetting = { x: velocityX, y: velocityY };
            mainScene.physics.add.collider(player, block);
            mainScene.physics.add.collider(layer, block);
            blocks.push(block);
        }
        else if(spriteFrame == 14)
        {
            var mail = mainScene.add.sprite(layer.tileToWorldX(tile.x) + tile.width / 2, layer.tileToWorldY(tile.y) + tile.height / 2, "tile", spriteFrame);
            mails.push(mail);
        }
    });
};

mainScene.createTimer = function()
{
    var count = 0;
    var timer = this.time.addEvent(
    {
        delay: 2000,
        callback: function()
        {
            if(!mainScene.physics.world.isPaused)
            {
                var tiles = layer.getTilesWithinWorldXY(getX(player), getY(player), getWidth(player), getHeight(player));
                for(var i = 0; i < tiles.length; i++)
                {
                    if(tiles[i].index == 8)
                    {
                        count = 0;
                        break;
                    }
                }
                if(count > 0)
                {
                    layer.replaceByIndex(8, 9);
                    layer.setCollision(9);
                    count--;
                }
                else
                {
                    layer.replaceByIndex(9, 8);
                    layer.setCollision(8, false);
                    count = 2;
                }
            }
        },
        loop: true
    });
};


mainScene.createUi = function()
{
    menu = this.add.sprite(37, 25, "button", 1).setInteractive();
    
    menu.on("pointerdown", function()
    {
        if(menu.frame.name == 1)
        {
            if(!mainScene.physics.world.isPaused)
            {
                mainScene.pause(true);
                menu.setFrame(2);
                
                var targets = mainScene.getMainObjects();
                for(var i = 0; i < targets.length; i++)
                {
                    targets[i].setAlpha(0.2);
                }
                
            }
        }
        else
        {
            mainScene.pause(false);
            menu.setFrame(1);
            
            var targets = mainScene.getMainObjects();
            for(var i = 0; i < targets.length; i++)
            {
                targets[i].setAlpha(1);
            }
            
            
            
        }
    });
    
    msgBox = this.add.image(160, 380, "message");
    msgBox.setAlpha(0);
    
    msgText = this.add.text(16, 315, "", { font: "18px sans-serif", color: "#ffffff" });
    msgText.setWordWrapWidth(290, true);
    msgText.setLineSpacing(1);
    msgText.setAlpha(0);
};

mainScene.updateExit = function()
{
    for(var i = 0; i < layer.moveSetting.length; i++)
    {
        var move = layer.moveSetting[i];
        if(player.isDuplicate(move.fromX, move.fromY, layer.tilemap.tileWidth, layer.tilemap.tileHeight))
        {
            this.fadeOut(function()
            {
                mainScene.scene.start("mainScene", { id: move.id, x: move.toX, y: move.toY, flipX: player.flipX });
            });
            break;
        }
    }
};


mainScene.updateObject = function()
{
    var tile = null;
    
    if(player.body.onFloor())
    {
        if(player.flipX)
        {
            tile = layer.getTileAtWorldXY(getX(player) + getWidth(player), getY(player) + getHeight(player));
        }
        else
        {
            tile = layer.getTileAtWorldXY(getX(player), getY(player) + getHeight(player));
        }
        if(tile != null)
        {
            switch(tile.index)
            {
                case 3:
                    player.actionSetting.jump = 1;
                    break;
                case 4:
                    player.actionSetting.spead = 0;
                    break;
                case 5:
                    player.flipX = true;
                    break;
                case 6:
                    player.flipX = false;
                    break;
                case 7:
                    player.actionSetting.jump = 2;
                    break;
                case 48:
                    player.actionSetting.spead = 40;
                    break;
            }
        }
    }
    
    for(var i = 0; i < blocks.length; i++)
    {
        if(blocks[i].body.onWall() || blocks[i].body.touching.left || blocks[i].body.touching.right)
        {
            blocks[i].velocitySetting.x *= -1;
        }
        if(blocks[i].body.onCeiling() || blocks[i].body.onFloor())
        {
            blocks[i].velocitySetting.y *= -1;
        }
        if(blocks[i].body.touching.up && player.body.touching.down && Math.abs(getX(blocks[i]) - getX(player)) > getWidth(blocks[i]) / 2)
        {
            if(blocks[i].velocitySetting.x > 0 && !player.flipX || blocks[i].velocitySetting.x < 0 && player.flipX)
            {
                player.actionSetting.spead = 0;
            }
        }
        blocks[i].setVelocityX(blocks[i].velocitySetting.x);
        blocks[i].setVelocityY(blocks[i].velocitySetting.y);
    }
    
    for(var i = 0; i < mails.length; i++)
    {
        var mail = mails[i];
        
        if(player.isDuplicateSprite(mail) && mail.active)
        {
            for(var j = 0; j < layer.messageSetting.length; j++)
            {
                var messageSetting = layer.messageSetting[j];
                if(player.isDuplicate(messageSetting.x, messageSetting.y, layer.tilemap.tileWidth, layer.tilemap.tileHeight))
                {
                    this.setMessage(messageSetting.message, function()
                    {
                        mail.destroy();
                    });
                }
            }
        }
    }
};


mainScene.setMessage = function(messages, callback)
{
    var func = callback || function(){ return; };
    
    this.pause(true);
    
    msgBox.setAlpha(1);
    msgText.setAlpha(1);
    
    var page = 0;
    var count = 1;
    var click = true;
    
    var timedEvent = this.time.addEvent(
    {
        delay: 100,
        callback: function()
        {
            msgText.setText(messages[page].substr(0, count));
            count++;
            
            if(mainScene.enter())
            {
                if(!click)
                {
                    if(count >= messages[page].length)
                    {
                        page++
                        count = 1;
                        if(page >= messages.length)
                        {
                            msgBox.setAlpha(0);
                            msgText.setAlpha(0);
                            msgText.setText("");
                            mainScene.pause(false);
                            timedEvent.remove(false);
                            func();
                        }
                    }
                    else
                    {
                        count = messages[page].length;
                    }
                }
                click = true;
            }
            else
            {
                click = false;
            }
            return;
        },
        loop: true
    });
};




mainScene.updatePlayer = function()
{
    if(this.enter())
    {
        if(player.actionSetting.jump == 0)
        {
            player.actionSetting.jump = 1;
        }
    }
    if(player.body.onFloor() || player.body.touching.down)
    {
        if(player.body.onWall() || player.body.touching.left || player.body.touching.right)
        {
            player.flipX = !player.flipX;
        }
        if(player.actionSetting.jump == 1)
        {
            player.setVelocityY(-480);
            player.play("jump", true);
        }
        else if(player.actionSetting.jump == 2)
        {
            player.setVelocityY(-640);
            player.play("jump", true);
        }
        else if(player.actionSetting.spead == 0)
        {
            player.play("stop", true);
        }
        else
        {
            player.play("move", true);
        }
    }
    else
    {
        if(player.actionSetting.jump == 1)
        {
            player.flipX = !player.flipX;
        }
    }
    if(player.flipX)
    {
        player.setVelocityX(player.actionSetting.spead * -1);
    }
    else
    {
        player.setVelocityX(player.actionSetting.spead);
    }
    player.actionSetting.spead = 80;
    if(this.enter())
    {
        player.actionSetting.jump = -1;
    }
    else
    {
        player.actionSetting.jump = 0;
    }
};


mainScene.enter = function()
{
    if(cursors.space.isDown || this.input.mousePointer.isDown)
    {
        return true;
    }
    return false;
}




function getX(sprite)
{
    return sprite.x - getWidth(sprite) / 2;
}

function getY(sprite)
{
    return sprite.y - getHeight(sprite) / 2;
}

function getWidth(sprite)
{
    return sprite.width * sprite.scale;
}

function getHeight(sprite)
{
    return sprite.height * sprite.scale;
}










/************************************************************
 * コンフィグ
 ************************************************************/

var config =
{
    type: Phaser.AUTO,
    parent: "canvas",
    width: 320,
    height: 480,
    pixelArt: true,
    backgroundColor: "#111111",
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    physics:
    {
        default: "arcade",
        arcade:
        {
            gravity: { y: 1000 },
            debug: false
        }
    },
    dom:
    {
        createContainer: true
    },
    scene: [titleScene, mainScene]
};

/************************************************************
 * ゲーム開始
 ************************************************************/

var game = new Phaser.Game(config);
