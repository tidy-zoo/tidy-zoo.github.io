import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { initialState, watchStore } from '../../store';

export default class Timeline extends Container {
  constructor() {
    super();

    const bg = new Sprite(Texture.from('timeline'));
    bg.x = bg.width * -0.5 + 1;
    bg.y = bg.height * -0.5 + 2;

    const timeline = new Sprite(Texture.from('timelineBlue'));
    timeline.pivot.set(timeline.width * 0.5, timeline.height * 0.5);
    timeline.x = timeline.y = 0;

    const mask = new Graphics().rect(0, 0, timeline.width, timeline.height).fill(0xff0000);
    mask.x = timeline.x - timeline.width * 0.5;
    mask.y = timeline.y - timeline.height * 0.5;
    this.addChild(bg, timeline, mask);
    timeline.mask = mask;

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
      }
    );
  }
}
