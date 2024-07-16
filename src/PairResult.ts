import { Container, Sprite, Texture } from 'pixi.js';

export interface PairResultOptions {
  headTextures: Texture[];
  buttTextures: Texture[];
}

export default class PairResult extends Container {
  _headTextures: Texture[];
  _buttTextures: Texture[];

  constructor(opt: PairResultOptions) {
    super();
    this._headTextures = opt.headTextures;
    this._buttTextures = opt.buttTextures;
  }

  set head(n: number | null) {
    const head = this.getChildByLabel('head');
    if (head) {
      this.removeChild(head);
    }

    if (typeof n === 'number') {
      const t = this._headTextures[n];
      const head = new Sprite(t);
      head.x = -t.width;
      head.label = 'head';
      this.addChild(head);
    }
  }

  set butt(n: number | null) {
    const butt = this.getChildByLabel('butt');
    if (butt) {
      this.removeChild(butt);
    }

    if (typeof n === 'number') {
      const t = this._buttTextures[n];
      const butt = new Sprite(t);
      butt.x = 0;
      butt.label = 'butt';
      this.addChild(butt);
    }
  }
}
