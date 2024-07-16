import { BlurFilter, Container, Sprite, Texture, Ticker } from 'pixi.js';

export interface ReelOptions {
  numSymbols: number;
  symbolSize: number;
  textures: Texture[];
}

export default class Reel extends Container {
  _blur: BlurFilter;
  _maxHeight: number;
  _textures: Texture[];

  constructor(opt: ReelOptions) {
    super();
    this._blur = this.filters = new BlurFilter();
    this._textures = opt.textures;
    this.interactive = true;

    for (let i = 0; i < opt.numSymbols; i++) {
      const rc = new ReelSymbol(this._textures);
      rc.y = this.height;
      this.addChild(rc);
    }

    this._maxHeight = this.height;

    // const onClick = (e: Event) => {
    //   console.log(e.target);
    //   this.emit('click_symbol', { id: (e.target as ReelSymbol).id });
    // };

    // this.addEventListener('click', onClick);
    // this.addEventListener('touchend', onClick);
  }

  run(downward: boolean = true) {
    let speed = 5;

    setInterval(() => {
      speed = randInt(5, 50);
    }, 3000);

    Ticker.shared.add(() => {
      const direction = downward ? 1 : -1;
      for (const c of this.children) {
        c.y += speed * direction;
      }

      if (downward) {
        const firstChild = this.getChildAt(0);
        if (firstChild.y > 0) {
          const newChild = new ReelSymbol(this._textures);
          newChild.y = firstChild.y - newChild.height;
          this.addChildAt(newChild, 0);
        }

        const lastChild = this.getChildAt(this.children.length - 1);
        if (lastChild.y >= this._maxHeight) {
          this.removeChild(lastChild);
        }
      } else {
        const firstChild = this.getChildAt(0);
        if (firstChild.y + firstChild.height < 0) {
          this.removeChild(firstChild);
        }

        const lastChild = this.getChildAt(this.children.length - 1);
        if (lastChild.y + lastChild.height <= this._maxHeight) {
          const newChild = new ReelSymbol(this._textures);
          newChild.y = lastChild.y + lastChild.height;
          this.addChild(newChild);
        }
      }

      if (speed < 30) {
        this.filters = [];
      } else {
        this.filters = [this._blur];
        this._blur.blurY = Math.floor(speed / 5);
      }
    });
  }
}

class ReelSymbol extends Sprite {
  id: number = -1;

  constructor(textures: Texture[]) {
    super();
    this.interactive = true;
    this.id = randInt(0, textures.length - 1);
    this.texture = textures[this.id];
  }
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
