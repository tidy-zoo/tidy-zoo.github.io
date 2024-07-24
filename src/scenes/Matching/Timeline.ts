import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { initialState, watchStore } from '../../store';

export default class Timeline extends Container {
  constructor() {
    super();

    const timeline = new Sprite(Texture.from('timeline'));
    const mask = new Graphics().rect(0, 0, timeline.width, timeline.height).fill(0xff0000);
    this.addChild(mask);
    this.addChild(timeline);
    timeline.mask = mask;

    watchStore(
      state => state.countdown,
      state => {
        mask.scale.x = state.countdown / initialState.countdown;
      }
    );
  }
}
