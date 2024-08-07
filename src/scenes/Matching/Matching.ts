import { Container, Sprite, Texture } from 'pixi.js';
import Reel from './Reel';
import PairResult from './PairResult';
import Timeline from './Timeline';
import { watchStore } from '../../store';
import TextField from '../../components/TextField';

export default class Matching extends Container {
  constructor() {
    super();

    const bg = new Sprite(Texture.from('bgMatching'));
    this.addChild(bg);

    // mask left
    const bgLeft = new Sprite(Texture.from('reel'));
    const maskLeft = new Sprite(Texture.from('reel'));
    bgLeft.x = maskLeft.x = 60;
    bgLeft.y = maskLeft.y = 35;
    this.addChild(bgLeft, maskLeft);

    // mask right
    const bgRight = new Sprite(Texture.from('reel'));
    const maskRight = new Sprite(Texture.from('reel'));
    bgRight.x = maskRight.x = bg.width - bgLeft.width - 60;
    bgRight.y = maskRight.y = 35;
    this.addChild(bgRight, maskRight);

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
    reelLeft.x = 90;
    reelLeft.scale = 0.6;
    reelLeft.mask = maskLeft;
    this.addChild(reelLeft);

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
    reelRight.x = 1540;
    reelRight.scale = 0.6;
    reelRight.mask = maskRight;
    this.addChild(reelRight);

    // result
    const pairResult = new PairResult();
    pairResult.x = bg.width * 0.5;
    pairResult.y = 50;
    this.addChild(pairResult);

    // timeline
    const timeline = new Timeline();
    timeline.x = bg.width * 0.5;
    timeline.y = 733;
    this.addChild(timeline);

    watchStore(
      state => state.countdowning,
      state => {
        if (state.countdowning) {
          reelLeft.run();
          reelRight.run();
        } else {
          reelLeft.stop();
          reelRight.stop();
        }
      }
    );

    // round scores
    const scoreText = new TextField('', {
      fontSize: 65
    });
    scoreText.y = 85;
    this.addChild(scoreText);

    watchStore(
      state => state.scores,
      state => {
        const roundScore = Object.values(state.scores).reduce((sum, score) => sum + score, 0);
        scoreText.text = roundScore;
        scoreText.x = bg.width * 0.5 - scoreText.width * 0.5;
      }
    );
  }
}
