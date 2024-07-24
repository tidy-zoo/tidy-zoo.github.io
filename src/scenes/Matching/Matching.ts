import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Reel from './Reel';
import PairResult from './PairResult';
import Timeline from './Timeline';
import { watchStore } from '../../store';
import ScoreBoard from './ScoreBoard';
import RoundResult from './RoundResult';

export default class Matching extends Container {
  reelLeft?: Reel;
  reelRight?: Reel;
  pairResult?: PairResult;

  constructor(width: number) {
    super();

    watchStore(
      state => state.scene,
      state => {
        if (state.scene === 'matching') {
          this._initialize();
          this.scale.x = this.scale.y = width / this.width;
        }
      }
    );
  }

  _initialize() {
    const bg = new Sprite(Texture.from('bgMatching'));
    this.addChild(bg);

    // reel left
    const maskLeft = new Graphics().rect(0, 0, 1250, 3160).fill(0xff0000);
    maskLeft.x = 190;
    maskLeft.y = 210;
    this.addChild(maskLeft);

    const reelLeft = new Reel([
      Texture.from('bearHead'),
      Texture.from('boarHead'),
      Texture.from('elephantHead'),
      Texture.from('giraffeHead'),
      Texture.from('gorillaHead'),
      Texture.from('hippoHead'),
      Texture.from('oxHead'),
      Texture.from('pigHead'),
      Texture.from('rhinoHead'),
      Texture.from('twbearHead')
    ]);
    reelLeft.asLeft = true;
    reelLeft.x = 380;
    reelLeft.scale.x = reelLeft.scale.y = 2;
    reelLeft.mask = maskLeft;
    this.addChild(reelLeft);

    // reel right
    const maskRight = new Graphics().rect(0, 0, 1250, 3160).fill(0xff0000);
    maskRight.x = 6330;
    maskRight.y = 210;
    this.addChild(maskRight);

    const reelRight = new Reel([
      Texture.from('bearButt'),
      Texture.from('boarButt'),
      Texture.from('elephantButt'),
      Texture.from('giraffeButt'),
      Texture.from('gorillaButt'),
      Texture.from('hippoButt'),
      Texture.from('oxButt'),
      Texture.from('pigButt'),
      Texture.from('rhinoButt'),
      Texture.from('twbearBbutt')
    ]);
    reelRight.x = 6540;
    reelRight.scale.x = reelRight.scale.y = 2;
    reelRight.mask = maskRight;
    this.addChild(reelRight);

    // result
    const pairResult = new PairResult();
    pairResult.x = bg.width * 0.5;
    pairResult.y = 1600;
    pairResult.scale.x = pairResult.scale.y = 2.7;
    this.addChild(pairResult);

    // timeline
    const timeline = new Timeline();
    timeline.pivot.set(timeline.width * 0.5, 0);
    timeline.scale.x = timeline.scale.y = 4.1;
    timeline.x = bg.width * 0.5;
    timeline.y = 2905;
    this.addChild(timeline);

    // scores
    const scores = new ScoreBoard();
    scores.x = this.width * 0.5 - scores.width * 0.5;
    scores.y = 600;
    this.addChild(scores);

    watchStore(
      state => state.result,
      state => {
        pairResult.head = state.result.left;
        pairResult.butt = state.result.right;
        reelLeft.interactiveChildren = state.result.left < 0;
        reelRight.interactiveChildren = state.result.right < 0;
      }
    );

    // round result
    const roundResult = new RoundResult(this.width, this.height);

    watchStore(
      state => state.countdowning,
      state => {
        if (state.countdowning) {
          reelLeft.run();
          reelRight.run();
          this.removeChild(roundResult);
        } else {
          reelLeft.stop();
          reelRight.stop();
          this.addChild(roundResult);
        }
      }
    );
  }
}
