import { sound } from '@pixi/sound';
import gsap from 'gsap';
import { Sprite, Texture } from 'pixi.js';

export default class Button extends Sprite {
  constructor(t: Texture) {
    super(t);

    this.pivot.set(this.width * 0.5, this.height * 0.5);
    this.interactive = true;

    this.on('pointerup', () => {
      const initialScale = this.scale.clone();
      sound.play('btnSound', { volume: 0.35, loop: false });

      gsap.to(this.scale, {
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        x: this.scale.x + 0.1,
        y: this.scale.y + 0.1,
        onStart: () => {},
        onComplete: () => {
          this.scale = initialScale;
          this.emit('transition_end');
        }
      });
    });
  }
}
