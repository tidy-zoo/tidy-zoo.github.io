import { Container, Graphics, Texture } from 'pixi.js';
import Button from '../../components/Button';
import { newRound, store } from '../../store';

export default class RoundResult extends Container {
  constructor(width: number, height: number) {
    super();

    // bg
    const bg = new Graphics().rect(0, 0, width, height).fill(0x000000);
    bg.alpha = 0.9;

    const replayBtn = new Button(Texture.from('replayBtn'));
    replayBtn.scale = 3.8;
    replayBtn.x = replayBtn.width * -0.5;

    replayBtn.on('transition_end', () => {
      store.dispatch(newRound());
    });

    const quitBtn = new Button(Texture.from('quitBtn'));
    quitBtn.scale = 3.8;
    quitBtn.x = quitBtn.width * 0.5;

    const btnContainer = new Container();
    btnContainer.addChild(replayBtn, quitBtn);
    btnContainer.x = width * 0.5;
    btnContainer.y = 2000;

    this.addChild(bg, btnContainer);
  }
}
