import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { newRound, store, updateTextureProgress, watchStore } from '../../store';
import Button from '../../components/Button';
import TextField from '../../components/TextField';

export default class Welcome extends Container {
  async initialize() {
    await Assets.load([
      { alias: 'bgWelcome', src: '/assets/bgWelcome.jpg' },
      { alias: 'startBtn', src: '/assets/startBtn.png' }
    ]);

    // load game textures
    Assets.load(
      [
        { alias: 'bgMatching', src: '/assets/bgMatching.jpg' },
        { alias: 'bgRoundResult', src: '/assets/bgRoundResult.png' },
        { alias: 'bgScores', src: '/assets/bgScores.jpg' },
        { alias: 'bgScore1', src: '/assets/bgScore1.png' },
        { alias: 'bgScore2', src: '/assets/bgScore2.png' },
        { alias: 'bgScore3', src: '/assets/bgScore3.png' },
        { alias: 'bgTotalScore', src: '/assets/bgTotalScore.png' },
        { alias: 'timeline', src: '/assets/timeline.png' },
        { alias: 'timelineBlue', src: '/assets/timelineBlue.png' },
        { alias: 'timelineRed', src: '/assets/timelineRed.png' },
        { alias: 'replayBtn', src: '/assets/replayBtn.png' },
        { alias: 'cloudFailed', src: '/assets/cloudFailed.png' },
        { alias: 'cloud', src: '/assets/cloud.png' },
        { alias: 'rainbow', src: '/assets/rainbow.png' },
        { alias: 'reel', src: '/assets/reel.png' },
        { alias: 'totalSum', src: '/assets/totalSum.png' },
        { alias: 'totalSumLv1', src: '/assets/totalSumLv1.png' },
        { alias: 'totalSumLv2', src: '/assets/totalSumLv2.png' },
        { alias: 'totalSumLv3', src: '/assets/totalSumLv3.png' },

        // symbols
        { alias: 'bearButt', src: '/assets/bear/butt.png' },
        { alias: 'bearButtSide', src: '/assets/bear/buttSide.png' },
        { alias: 'bearHead', src: '/assets/bear/head.png' },
        { alias: 'bearHeadSide', src: '/assets/bear/headSide.png' },

        { alias: 'boarButt', src: '/assets/boar/butt.png' },
        { alias: 'boarButtSide', src: '/assets/boar/buttSide.png' },
        { alias: 'boarHead', src: '/assets/boar/head.png' },
        { alias: 'boarHeadSide', src: '/assets/boar/headSide.png' },

        { alias: 'elephantButt', src: '/assets/elephant/butt.png' },
        { alias: 'elephantButtSide', src: '/assets/elephant/buttSide.png' },
        { alias: 'elephantHead', src: '/assets/elephant/head.png' },
        { alias: 'elephantHeadSide', src: '/assets/elephant/headSide.png' },

        { alias: 'giraffeButt', src: '/assets/giraffe/butt.png' },
        { alias: 'giraffeButtSide', src: '/assets/giraffe/buttSide.png' },
        { alias: 'giraffeHead', src: '/assets/giraffe/head.png' },
        { alias: 'giraffeHeadSide', src: '/assets/giraffe/headSide.png' },

        { alias: 'gorillaButt', src: '/assets/gorilla/butt.png' },
        { alias: 'gorillaButtSide', src: '/assets/gorilla/buttSide.png' },
        { alias: 'gorillaHead', src: '/assets/gorilla/head.png' },
        { alias: 'gorillaHeadSide', src: '/assets/gorilla/headSide.png' },

        { alias: 'hippoButt', src: '/assets/hippo/butt.png' },
        { alias: 'hippoButtSide', src: '/assets/hippo/buttSide.png' },
        { alias: 'hippoHead', src: '/assets/hippo/head.png' },
        { alias: 'hippoHeadSide', src: '/assets/hippo/headSide.png' },

        { alias: 'oxButt', src: '/assets/ox/butt.png' },
        { alias: 'oxButtSide', src: '/assets/ox/buttSide.png' },
        { alias: 'oxHead', src: '/assets/ox/head.png' },
        { alias: 'oxHeadSide', src: '/assets/ox/headSide.png' },

        { alias: 'pigButt', src: '/assets/pig/butt.png' },
        { alias: 'pigButtSide', src: '/assets/pig/buttSide.png' },
        { alias: 'pigHead', src: '/assets/pig/head.png' },
        { alias: 'pigHeadSide', src: '/assets/pig/headSide.png' },

        { alias: 'rhinoButt', src: '/assets/rhino/butt.png' },
        { alias: 'rhinoButtSide', src: '/assets/rhino/buttSide.png' },
        { alias: 'rhinoHead', src: '/assets/rhino/head.png' },
        { alias: 'rhinoHeadSide', src: '/assets/rhino/headSide.png' },

        { alias: 'twbearBbutt', src: '/assets/twbear/butt.png' },
        { alias: 'twbearButtSide', src: '/assets/twbear/buttSide.png' },
        { alias: 'twbearHead', src: '/assets/twbear/head.png' },
        { alias: 'twbearHeadSide', src: '/assets/twbear/headSide.png' }
      ],
      progress => {
        store.dispatch(updateTextureProgress(progress));
      }
    );

    const bg = new Sprite(Texture.from('bgWelcome'));

    const startBtn = new Button(Texture.from('startBtn'));
    startBtn.x = 240;
    startBtn.y = 740;
    startBtn.visible = false;

    startBtn.on('transition_end', () => {
      store.dispatch(newRound());
    });

    watchStore(
      state => state.scene,
      state => {
        this.visible = state.scene === 'welcome';
      }
    );

    const progressText = new TextField('');
    progressText.y = 330;

    this.addChild(bg, progressText, startBtn);

    watchStore(
      state => state.textureProgress,
      state => {
        const progress = Math.ceil(state.textureProgress * 100);
        progressText.text = `${progress}%`;
        progressText.x = bg.width * 0.5 - progressText.width * 0.5;

        if (progress === 100) {
          progressText.visible = false;
          startBtn.visible = true;
        }
      }
    );
  }
}
