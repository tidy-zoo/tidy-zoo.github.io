import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Reel, { ReelSymbol } from './Reel';
import PairResult from './PairResult';
import { selectSymbol, store } from '../../store';

export default class Matching extends Container {
  constructor() {
    super();

    const bg = new Sprite(Texture.from('bgMatching'));
    bg.interactiveChildren = false;
    this.addChild(bg);

    // reel left
    const maskLeft = new Graphics().rect(0, 0, 1250, 3160).fill(0xff0000);
    maskLeft.x = 190;
    maskLeft.y = 210;
    this.addChild(maskLeft);

    const reelLeft = new Reel();
    reelLeft.x = 380;
    reelLeft.scale.x = reelLeft.scale.y = 2.5;
    reelLeft.mask = maskLeft;
    reelLeft.run();
    this.addChild(reelLeft);

    // reel right
    const maskRight = new Graphics().rect(0, 0, 1250, 3160).fill(0xff0000);
    maskRight.x = 6330;
    maskRight.y = 210;
    this.addChild(maskRight);

    const reelRight = new Reel();
    reelRight.x = 6540;
    reelRight.scale.x = reelRight.scale.y = 2.5;
    reelRight.mask = maskRight;
    reelRight.run(false);
    this.addChild(reelRight);

    reelLeft.on('pointerup', e => {
      const symbol = e.target as ReelSymbol;
      store.dispatch(selectSymbol({ left: symbol.id }));
    });

    reelRight.on('pointerup', e => {
      const symbol = e.target as ReelSymbol;
      store.dispatch(selectSymbol({ right: symbol.id }));
    });

    // result
    const result = new PairResult();
    result.x = bg.width * 0.5;
    result.y = 1240;
    result.scale.x = result.scale.y = 2.7;
    this.addChild(result);

    store.subscribe(() => {
      const state = store.getState();
      if (state.mode === 'matching') {
        result.head = state.result.left;
        result.butt = state.result.right;
        reelLeft.interactiveChildren = state.result.left < 0;
        reelRight.interactiveChildren = state.result.right < 0;
      }
    });
  }
}
