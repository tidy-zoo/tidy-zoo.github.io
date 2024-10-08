import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Button from '../../components/Button';
import { hidePromote, store } from '../../store';
import { SocialMedia } from '../../enum';

export default class Promote extends Container {
  constructor(width: number, height: number) {
    super();

    const backDrop = new Graphics().rect(0, 0, width, height).fill(0x000000);
    backDrop.alpha = 0.8;

    const panel = new PromotePanel();
    panel.x = width * 0.5 - panel.width * 0.5;
    panel.y = height * 0.5 - panel.height * 0.5;

    this.addChild(backDrop, panel);
  }
}

class PromotePanel extends Container {
  constructor() {
    super();

    const promoteLine = new Button(Texture.from('promoteLine'));
    promoteLine.x = 450;
    promoteLine.y = 180;
    promoteLine.on('pointerup', () => {
      window.open(SocialMedia.Line, '_blank');
    });

    const promoteFb = new Button(Texture.from('promoteFb'));
    promoteFb.x = 790;
    promoteFb.y = 180;
    promoteFb.on('pointerup', () => {
      window.open(SocialMedia.Fb, '_blank');
    });

    const promoteCloseBtn = new Button(Texture.from('promoteCloseBtn'));
    promoteCloseBtn.x = 1250;
    promoteCloseBtn.y = 540;
    promoteCloseBtn.on('transition_end', () => {
      store.dispatch(hidePromote());
    });

    this.addChild(new Sprite(Texture.from('promoteBg')), promoteLine, promoteFb, promoteCloseBtn);
  }
}
