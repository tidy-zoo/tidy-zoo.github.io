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
        { alias: 'timeline', src: '/assets/timeline.png' },
        { alias: 'replayBtn', src: '/assets/replayBtn.png' },
        { alias: 'quitBtn', src: '/assets/quitBtn.png' },

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

    this.addChild(new Sprite(Texture.from('bgWelcome')));

    const startBtn = new Button(Texture.from('startBtn'));
    startBtn.x = this.width * 0.5;
    startBtn.y = this.height - 100;

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
    progressText.x = this.width * 0.5 - progressText.width * 0.5;
    progressText.y = this.height - 500;
    this.addChild(progressText);

    watchStore(
      state => state.textureProgress,
      state => {
        const progress = Math.ceil(state.textureProgress * 100);
        progressText.text = `${progress}%`;

        if (progress === 100) {
          this.removeChild(progressText);
          this.addChild(startBtn);
        }
      }
    );
  }
}
