import { BlurFilter, Container, Sprite, Texture, Ticker } from 'pixi.js';

export interface ReelOptions {
  numSymbols: number;
  symbolSize: number;
  textures: Texture[];
}

export default class Reel extends Container {
  _blur: BlurFilter;
  _speed: number;
  _numSymbols: number;
  _symbolSize: number;
  _lastSymbolIndex: number;
  _textures: Texture[];

  constructor(opt: ReelOptions) {
    super();
    this._textures = opt.textures;
    this._blur = this.filters = new BlurFilter();
    this._numSymbols = opt.numSymbols;
    this._symbolSize = opt.symbolSize;

    for (let i = -1; i < this._numSymbols; i++) {
      const rc = new ReelSymbol();
      rc.scale.x = rc.scale.y = opt.symbolSize / 400;
      rc.y = i * opt.symbolSize;
      rc.random(this._textures);
      rc.interactive = true;
      this.addChild(rc);

      const onClick = e => {
        this.emit('click_symbol', { id: rc.id });
      };

      rc.addEventListener('click', onClick);
      rc.addEventListener('touchend', onClick);
    }
  }

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

    if (lastChild.y <= -this._symbolSize) {
      lastChild.y = this._symbolSize * this._numSymbols;
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

    if (lastChild.y >= this._symbolSize * this._numSymbols) {
      lastChild.y = -this._symbolSize;
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
