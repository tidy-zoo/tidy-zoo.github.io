import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Reel from './Reel';
import PairResult from './PairResult';
import Timeline from './Timeline';
import { watchStore } from '../../store';
import ScoreBoard from './ScoreBoard';
import RoundResult from './RoundResult';

export default class Matching extends Container {
  constructor() {
    super();

    const bg = new Sprite(Texture.from('bgMatching'));
    this.addChild(bg);

    // reel left
    const maskLeft = new Graphics().rect(0, 0, 293, 761).fill(0xff0000);
    maskLeft.alpha = 0.2;
    maskLeft.x = 49;
    maskLeft.y = 49;
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
    reelLeft.x = 105;
    reelLeft.scale = 0.45;
    reelLeft.mask = maskLeft;
    this.addChild(reelLeft);

    // reel right
    const maskRight = new Graphics().rect(0, 0, 293, 761).fill(0xff0000);
    maskRight.x = this.width - 342;
    maskRight.y = 49;
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
    reelRight.x = 1585;
    reelRight.scale = 0.45;
    reelRight.mask = maskRight;
    this.addChild(reelRight);

    // result
    const pairResult = new PairResult();
    pairResult.x = bg.width * 0.5;
    pairResult.y = 608;
    this.addChild(pairResult);

    // timeline
    const timeline = new Timeline();
    timeline.pivot.set(timeline.width * 0.5, 0);
    timeline.x = bg.width * 0.5;
    timeline.y = 733;
    this.addChild(timeline);

    // scores
    const scores = new ScoreBoard();
    scores.x = this.width * 0.5 - scores.width * 0.5;
    scores.y = 170;
    this.addChild(scores);

    // round result
    const roundResult = new RoundResult(this.width, this.height);
    this.addChild(roundResult);

    this.addChild(roundResult);
    watchStore(
      state => state.countdowning,
      state => {
        if (state.countdowning) {
          scores.visible = true;
          roundResult.visible = false;
          reelLeft.run();
          reelRight.run();
        } else {
          scores.visible = false;
          roundResult.visible = true;
          reelLeft.stop();
          reelRight.stop();
        }
      }
    );
  }
}
