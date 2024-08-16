import { Container, Sprite, Texture } from 'pixi.js';
import Button from '../../components/Button';
import ScoreBoard from './ScoreBoard';
import { newRound, store, watchStore } from '../../store';
import TextField from '../../components/TextField';
import { sound } from '@pixi/sound';

export default class Scores extends Container {
  constructor() {
    super();

    sound.play('resultSound', { volume: 0.35, loop: false });

    this.addChild(new Sprite(Texture.from('bgScores')));

    const score1 = new Sprite(Texture.from('bgScore1'));
    const score2 = new Sprite(Texture.from('bgScore2'));
    const score3 = new Sprite(Texture.from('bgScore3'));
    score1.x = score2.x = score3.x = 1365;
    score1.visible = score2.visible = score3.visible = false;
    score1.y = 320;
    score2.y = 430;
    score3.y = 540;

    const scoreText1 = new TextField('', { fill: '#313131', fontSize: 45 });
    const scoreText2 = new TextField('', { fill: '#313131', fontSize: 45 });
    const scoreText3 = new TextField('', { fill: '#313131', fontSize: 45 });
    scoreText1.visible = scoreText2.visible = scoreText3.visible = false;
    scoreText1.y = 325;
    scoreText2.y = 435;
    scoreText3.y = 545;

    this.addChild(score1, score2, score3, scoreText1, scoreText2, scoreText3);

    watchStore(
      state => state.historyRoundScores,
      state => {
        const [s1, s2, s3] = state.historyRoundScores;
        if (s1) {
          scoreText1.text = s1;
          scoreText1.x = score1.x + score1.width * 0.5 - scoreText1.width * 0.5;
          score1.visible = scoreText1.visible = true;
        }
        if (s2) {
          scoreText2.text = s2;
          scoreText2.x = score2.x + score2.width * 0.5 - scoreText2.width * 0.5;
          score2.visible = scoreText2.visible = true;
        }
        if (s3) {
          scoreText3.text = s3;
          scoreText3.x = score3.x + score3.width * 0.5 - scoreText3.width * 0.5;
          score3.visible = scoreText3.visible = true;
        }
      }
    );

    const roundScoreText = new TextField('199', { fill: '#313131', fontSize: 60 });
    roundScoreText.x = 1480;
    roundScoreText.y = 130;
    this.addChild(roundScoreText);

    watchStore(
      state => state.roundScore,
      state => {
        roundScoreText.text = state.roundScore;
      }
    );

    const replayBtn = new Button(Texture.from('replayBtn'));
    replayBtn.x = 1525;
    replayBtn.y = 740;
    this.addChild(replayBtn);

    replayBtn.on('transition_end', () => {
      store.dispatch(newRound());
    });

    const scoreBoard = new ScoreBoard();
    scoreBoard.x = 180;
    scoreBoard.y = 225;
    this.addChild(scoreBoard);

    watchStore(
      state => state.historyScores,
      state => {
        scoreBoard.scores = state.historyScores;
      }
    );

    const totalSum = new Sprite(Texture.from('totalSum'));
    totalSum.x = 905;
    totalSum.y = 514;

    const totalSumLv1 = new Sprite(Texture.from('totalSumLv1'));
    const totalSumLv2 = new Sprite(Texture.from('totalSumLv2'));
    const totalSumLv3 = new Sprite(Texture.from('totalSumLv3'));
    totalSumLv1.x = totalSumLv2.x = totalSumLv3.x = 370;
    totalSumLv1.y = totalSumLv2.y = totalSumLv3.y = 565;
    totalSumLv1.visible = totalSumLv2.visible = totalSumLv3.visible = false;

    const historySumTextField = new TextField('199', { fill: '#313131', fontSize: 50 });
    historySumTextField.x = 970;
    historySumTextField.y = 635;

    this.addChild(totalSumLv1, totalSumLv2, totalSumLv3, totalSum, historySumTextField);

    watchStore(
      state => state.historyScores,
      state => {
        const sum = Object.values(state.historyScores).reduce((sum, n) => sum + n, 0);
        historySumTextField.text = sum;
        historySumTextField.x = totalSum.x * 0.5 - historySumTextField.width * 0.5 + 565;

        if (sum > 150) {
          totalSumLv1.visible = true;
          totalSumLv2.visible = totalSumLv3.visible = false;
        } else if (sum >= 50) {
          totalSumLv2.visible = true;
          totalSumLv1.visible = totalSumLv3.visible = false;
        } else {
          totalSumLv3.visible = true;
          totalSumLv1.visible = totalSumLv2.visible = false;
        }
      }
    );
  }
}
