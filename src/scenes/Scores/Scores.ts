import { Container, Sprite, Texture } from 'pixi.js';
import Button from '../../components/Button';
import ScoreBoard from './ScoreBoard';
import { newRound, store } from '../../store';

export default class Scores extends Container {
  constructor() {
    super();

    this.addChild(new Sprite(Texture.from('bgScores')));

    const score1 = new Sprite(Texture.from('bgScore1'));
    const score2 = new Sprite(Texture.from('bgScore2'));
    const score3 = new Sprite(Texture.from('bgScore3'));
    score1.x = score2.x = score3.x = 1365;
    score1.y = 320;
    score2.y = 430;
    score3.y = 540;

    const replayBtn = new Button(Texture.from('replayBtn'));
    replayBtn.x = 1525;
    replayBtn.y = 740;

    replayBtn.on('transition_end', () => {
      store.dispatch(newRound());
    });

    const totalSum = new Sprite(Texture.from('totalSum'));
    totalSum.x = 905;
    totalSum.y = 514;

    const totalSumLv1 = new Sprite(Texture.from('totalSumLv1'));
    const totalSumLv2 = new Sprite(Texture.from('totalSumLv2'));
    const totalSumLv3 = new Sprite(Texture.from('totalSumLv3'));
    totalSumLv1.x = totalSumLv2.x = totalSumLv3.x = 370;
    totalSumLv1.y = totalSumLv2.y = totalSumLv3.y = 565;

    const scoreBoard = new ScoreBoard();
    scoreBoard.x = 180;
    scoreBoard.y = 225;

    this.addChild(score1, score2, score3, replayBtn, totalSumLv1, totalSumLv2, totalSumLv3, totalSum, scoreBoard);
  }
}
