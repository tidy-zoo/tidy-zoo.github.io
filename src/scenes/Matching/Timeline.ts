import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { initialState, watchStore } from '../../store';
import TextField from '../../components/TextField';

export default class Timeline extends Container {
  constructor() {
    super();

    const timeline = new Sprite(Texture.from('timelineBlue'));
    const mask = new Graphics().rect(0, 0, timeline.width, timeline.height).fill(0xff0000);
    const remainText = new TextField('00:00', {
      fill: 0x6a6a6b
    });
    this.addChild(mask, timeline, remainText);
    timeline.mask = mask;
    remainText.x = this.width * 0.5 - remainText.width * 0.5;

    watchStore(
      state => state.countdown,
      state => {
        const scale = state.countdown / initialState.countdown;
        mask.scale.x = scale;
        if (state.countdown <= 10) {
          timeline.texture = Texture.from('timelineRed');
        } else {
          timeline.texture = Texture.from('timelineBlue');
        }

        let minutes = Math.floor(state.countdown / 60).toString();
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;

        let seconds = (state.countdown % 60).toString();
        seconds = seconds.length < 2 ? `0${seconds}` : seconds;

        remainText.text = `${minutes}:${seconds}`;
      }
    );
  }
}
