import { Assets, BlurFilter, Container, Sprite, Texture, Ticker } from 'pixi.js';

const SYMBOL_SIZE = 150;

export interface ReelOptions {
  numSymbols: number;
  textures: string[];
}

export default class Reel extends Container {
  static async create(opt: ReelOptions): Promise<Reel> {
    await Assets.load(opt.textures);

    const reel = new Reel();
    reel._textures = opt.textures.map(url => Texture.from(url));
    reel._blur = reel.filters = new BlurFilter();
    reel._numSymbols = opt.numSymbols;

    for (let i = -1; i < reel._numSymbols; i++) {
      const rc = new ReelSymbol();
      rc.y = i * SYMBOL_SIZE;
      rc.random(reel._textures);
      rc.interactive = true;
      reel.addChild(rc);

      rc.addEventListener('click', e => {
        reel.emit('click_symbol', { id: rc.id });
      });
    }

    return reel;
  }

  _blur: BlurFilter;
  _speed: number;
  _numSymbols: number;
  _lastSymbolIndex: number;
  _textures: Texture[];

  run(downward: boolean = true) {
    this.adjustSpeed(5);

    setInterval(() => {
      this.adjustSpeed();
    }, 3000);

    if (downward) {
      this._lastSymbolIndex = this._numSymbols;
      Ticker.shared.add(() => this.moveDownward());
    } else {
      this._lastSymbolIndex = 0;
      Ticker.shared.add(() => this.moveUpward());
    }
  }

  adjustSpeed(speed?: number) {
    if (speed) {
      this._speed = speed;
    } else {
      this._speed = randInt(5, 20);
    }

    if (this._speed < 8) {
      this.filters = [];
    } else {
      this.filters = [this._blur];
      this._blur.blurY = Math.floor(this._speed / 5);
    }
  }

  moveUpward() {
    const lastChild = this.getChildAt(this._lastSymbolIndex) as ReelSymbol;

    if (lastChild.y <= -SYMBOL_SIZE) {
      lastChild.y = SYMBOL_SIZE * this._numSymbols;
      lastChild.random(this._textures);

      if (this._lastSymbolIndex === this._numSymbols) {
        this._lastSymbolIndex = 0;
      } else {
        this._lastSymbolIndex = Math.max(0, this._lastSymbolIndex + 1);
      }
    }

    for (const c of this.children) {
      c.y -= this._speed;
    }
  }

  moveDownward() {
    const lastChild = this.getChildAt(this._lastSymbolIndex) as ReelSymbol;

    if (lastChild.y >= SYMBOL_SIZE * this._numSymbols) {
      lastChild.y = -SYMBOL_SIZE;
      lastChild.random(this._textures);

      if (this._lastSymbolIndex === 0) {
        this._lastSymbolIndex = this._numSymbols;
      } else {
        this._lastSymbolIndex = Math.max(0, this._lastSymbolIndex - 1);
      }
    }

    for (const c of this.children) {
      c.y += this._speed;
    }
  }
}

class ReelSymbol extends Sprite {
  id: number;

  random(textures: Texture[]) {
    this.id = randInt(0, textures.length - 1);
    this.texture = textures[this.id];
  }
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
