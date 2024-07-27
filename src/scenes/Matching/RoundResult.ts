import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Button from '../../components/Button';
import { newRound, store } from '../../store';
import ScoreBoard from './ScoreBoard';

export default class RoundResult extends Container {
  constructor(width: number, height: number) {
    super();

    // bg
    const bg = new Graphics().rect(0, 0, width, height).fill(0x000000);
    bg.alpha = 0.9;

    const bgRoundResult = new Sprite(Texture.from('bgRoundResult'));
    bgRoundResult.x = width * 0.5 - bgRoundResult.width * 0.5;
    bgRoundResult.y = 160;

    const bgTotalScore = new Sprite(Texture.from('bgTotalScore'));
    bgTotalScore.x = width * 0.5 - bgTotalScore.width * 0.5;
    bgTotalScore.y = 100;

    const replayBtn = new Button(Texture.from('replayBtn'));
    replayBtn.x = width * 0.5;
    replayBtn.y = 720;

    const scores = new ScoreBoard();
    scores.scale = 1.5;
    scores.x = 290;
    scores.y = 320;

    const score1 = new Sprite(Texture.from('bgScore1'));
    const score2 = new Sprite(Texture.from('bgScore2'));
    const score3 = new Sprite(Texture.from('bgScore3'));
    score1.x = score2.x = score3.x = 1280;
    score1.y = 280;
    score2.y = 380;
    score3.y = 480;

    replayBtn.on('transition_end', () => {
      store.dispatch(newRound());
    });

    this.addChild(bg, bgRoundResult, bgTotalScore, score1, score2, score3, scores, replayBtn);
  }
}
