import { Container, Sprite, Texture } from 'pixi.js';
import { watchStore } from '../../store';

export default class PairResult extends Container {
  constructor() {
    super();

    const leftTextures = [
      Texture.from('bearHeadSide'),
      Texture.from('boarHeadSide'),
      Texture.from('elephantHeadSide'),
      Texture.from('giraffeHeadSide'),
      Texture.from('gorillaHeadSide'),
      Texture.from('hippoHeadSide'),
      Texture.from('oxHeadSide'),
      Texture.from('pigHeadSide'),
      Texture.from('rhinoHeadSide'),
      Texture.from('twbearHeadSide')
    ];

    const rightTextures = [
      Texture.from('bearButtSide'),
      Texture.from('boarButtSide'),
      Texture.from('elephantButtSide'),
      Texture.from('giraffeButtSide'),
      Texture.from('gorillaButtSide'),
      Texture.from('hippoButtSide'),
      Texture.from('oxButtSide'),
      Texture.from('pigButtSide'),
      Texture.from('rhinoButtSide'),
      Texture.from('twbearButtSide')
    ];

    const circle = new Sprite();
    const left = new Sprite();
    const right = new Sprite();
    left.scale = right.scale = 0.55;
    left.y = right.y = 70;

    this.addChild(circle, left, right);

    watchStore(
      state => state.result,
      state => {
        if (state.result.left < 0 || state.result.right < 0) {
          circle.texture = Texture.EMPTY;
        } else if (state.result.left === state.result.right) {
          circle.texture = Texture.from('circleCorrect');
        } else {
          circle.texture = Texture.from('circleFailed');
        }
        circle.x = -circle.width * 0.5;
        circle.y = -290;

        left.texture = state.result.left < 0 ? Texture.EMPTY : leftTextures[state.result.left];
        left.x = -left.width;
        left.y = -left.height;

        right.texture = state.result.right < 0 ? Texture.EMPTY : rightTextures[state.result.right];
        right.x = 0;
        right.y = -right.height;
      }
    );
  }
}
