//Keyboard
var Key = {
  _pressed : {},
LEFT: 37,
RIGHT: 39,
UP: 38,
DOWN: 40,
D: 68,
  isDown: function(keyCode) {
     return this._pressed[keyCode];
   },

   onKeydown: function(event) {
     this._pressed[event.keyCode] = true;
   },

   onKeyup: function(event) {
     delete this._pressed[event.keyCode];
   }
 };

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight +this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/kenbig.png"), 0, 0, 368, 238, 0.1, 10, true, false);
	this.leftWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/kenbig.png"), 0, 238, 368, 238, 0.1, 10, true, false);
	this.rightWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/kenbig.png"), 0, 476, 368, 238, 0.1, 10, true, false);
    this.boomAnimation = new Animation(ASSET_MANAGER.getAsset("./img/kenbig.png"), 0, 714, 368, 238, 0.1, 8, false, false);
    //testing
    this.booming = false;
    //endoftesting
    this.radius = 100;
	this.speed  = 100;
    this.ground = 400;
    Entity.call(this, game, 200, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    //test
    if(this.game.boom){
      this.booming = true;
    }
    if(this.booming){
      if(this.boomAnimation.isDone()){
        this.boomAnimation.elapsedTime = 0;
        this.booming = false;
      }

    }
    //endoftesting
	
	  if (this.x > 800) this.x = -230;
    if(Key.isDown(Key.RIGHT)){
      this.x += this.game.clockTick * this.speed;
    }else if (Key.isDown(Key.LEFT)){
      this.x -= this.game.clockTick * this.speed;

    }else if(Key.isDown(Key.UP)){
      this.y -= this.game.clockTick * this.speed;
    }
    else if(Key.isDown(Key.DOWN)){
      this.y += this.game.clockTick * this.speed;
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
	if(this.booming){
      this.boomAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }else {
		
		 if(Key.isDown(Key.RIGHT)){
			this.rightWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		}else if (Key.isDown(Key.LEFT)){
			this.leftWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

		}else{
			this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
		}
    }
    Entity.prototype.draw.call(this);
}

/*
Code added by Travis (Tbs95). This will add my character but both characters cannot punch at the same time for some reason.
*/
function ChunLi(game) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),          0, 0,   150, 150, 0.1, 7, true, false);
  this.leftWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),  0, 150, 150, 150, 0.1, 18, true, false);
  this.rightWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"), 0, 300, 150, 150, 0.1, 16, true, false);
  this.boomAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),      0, 750, 150, 150, 0.1, 6, false, false);
  //testing
  this.booming = false;
  //endoftesting
  this.radius = 100;
  this.speed  = 100;
  this.ground = 400;
  Entity.call(this, game, 50, 100);
}

ChunLi.prototype = new Entity();
ChunLi.prototype.constructor = ChunLi;

ChunLi.prototype.update = function () {
    //test
    if(this.game.boom){
      this.booming = true;
    }
    if(this.booming){
      if(this.boomAnimation.isDone()){
        this.boomAnimation.elapsedTime = 0;
        this.booming = false;
      }

    }
    //endoftesting
  
    if (this.x > 800) this.x = -230;
    if(Key.isDown(Key.RIGHT)){
      this.x += this.game.clockTick * this.speed;
    }else if (Key.isDown(Key.LEFT)){
      this.x -= this.game.clockTick * this.speed;

    } if(Key.isDown(Key.UP)){
      this.y -= this.game.clockTick * this.speed;
    }
    else if(Key.isDown(Key.DOWN)){
      this.y += this.game.clockTick * this.speed;
    }
    Entity.prototype.update.call(this);
}

ChunLi.prototype.draw = function (ctx) {
  if(this.booming){
      this.boomAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }else {
    
     if(Key.isDown(Key.RIGHT)){
      this.rightWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }else if (Key.isDown(Key.LEFT)){
      this.leftWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);

    }else{
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/kenbig.png");
ASSET_MANAGER.queueDownload("./img/chunli.png");
ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var unicorn = new Unicorn(gameEngine);
    var chun_li = new ChunLi(gameEngine);  
	
	
    gameEngine.init(ctx);
    gameEngine.start();
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.jpg"));
    gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
    gameEngine.addEntity(chun_li);  
	
});
