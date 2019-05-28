import * as PIXI from 'pixi.js';

export default class CoolDownClock {
	static loadResources(app) {
		app.loader.add("assets/cooldown/cooldown.png");
    }

    constructor(app) {
    	this.app = app;
        this.speed = 0.0;
    }

    prepareObject(x_pos, y_pos, item) {
        let tex = this.app.loader.resources["assets/cooldown/cooldown.png"].texture;
      
		this.sprite = new PIXI.Sprite(tex);
        this.sprite.scale.y = 1.0;
        this.sprite.scale.x = 1.0;
		this.sprite.x = x_pos;
		this.sprite.y = y_pos;
        this.sprite.pivot.x = this.sprite.width / 2;
        this.sprite.pivot.y = this.sprite.height / 2;
        this.sprite.name = "cooldown";
		this.sprite.visible = false;
        this.sprite._zIndex = Number.MAX_SAFE_INTEGER;
        this.reloaded = false;
        this.item = item;
    }

    initObject() {
        this.app.stage.addChild(this.sprite);
    }

    update(delta, player) {
        this.sprite.position.x = player.playerSprite.x;
        this.sprite.position.y = player.playerSprite.y;
        this.sprite.angle += this.speed * delta;
        if(!this.reloaded && this.sprite.angle > 360) {
            this.reloaded = true;
            if (this.item === "pistol") {
                player.ui.cards.pistolAmmoText.text = "6/"+String.fromCharCode(8734);
            } else if (this.item === "netgun") {
                player.ui.cards.netgunAmmoText.text = "2/"+String.fromCharCode(8734);
            }
            
            this.sprite.visible = false;
        }
    }
    

}