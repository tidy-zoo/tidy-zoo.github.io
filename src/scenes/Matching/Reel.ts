import { Container, Sprite, Texture, Ticker } from 'pixi.js';
import { selectSymbol, store } from '../../store';
import gsap from 'gsap';
import { sound } from '@pixi/sound';

const NUM_SYMBOLS = 6;
const INITIAL_SPEED = 5;

export default class Reel extends Container {
  _maxHeight: number;
  _textures: Texture[];
  _speed: number = INITIAL_SPEED;
  _tween: gsap.core.Tween | null = null;
  asLeft: boolean = false;

  constructor(textures: Texture[]) {
    super();
    this._textures = textures;
    this.interactive = true;

    for (let i = 0; i < NUM_SYMBOLS; i++) {
      const rc = new ReelSymbol(this._textures);
      rc.y = this.height;
      this.addChild(rc);
    }

    this._maxHeight = this.height;

    this.addEventListener('pointerdown', e => {
      const id = (e.target as ReelSymbol).id;
      if (this.asLeft) {
        store.dispatch(selectSymbol({ left: id }));
      } else {
        store.dispatch(selectSymbol({ right: id }));
      }
      sound.play('animalClickSound', { volume: 0.35, loop: false });
    });
  }

  run() {
    this._tween?.kill();
    this._tween = gsap.to(this, {
      duration: import.meta.env.VITE_APP_COUNTING_DOWN,
      ease: 'power3.in',
      _speed: INITIAL_SPEED + 30
    });

    Ticker.shared.add(this._onTick);
  }

  stop() {
    this._speed = INITIAL_SPEED;
    this._tween?.kill();
    Ticker.shared.remove(this._onTick);
  }

  _onTick = () => {
    const direction = this.asLeft ? 1 : -1;
    for (const c of this.children) {
      c.y += this._speed * direction;
    }

    if (this.asLeft) {
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
  };
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
