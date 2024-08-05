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

    const cloud = new Sprite(Texture.from('cloud'));
    const cloudFailed = new Sprite(Texture.from('cloudFailed'));
    const rainbow = new Sprite(Texture.from('rainbow'));
    cloud.x = -cloud.width * 0.5;
    cloudFailed.x = -cloudFailed.width * 0.5;
    rainbow.x = -rainbow.width * 0.5;
    rainbow.y = 265;
    this.addChild(cloud, cloudFailed, rainbow);

    const left = new Sprite();
    const right = new Sprite();
    this.addChild(left, right);

    watchStore(
      state => state.result,
      state => {
        if (state.result.left < 0 || state.result.right < 0) {
          cloud.visible = true;
          cloudFailed.visible = false;
          rainbow.visible = false;
        } else if (state.result.left === state.result.right) {
          cloud.visible = true;
          cloudFailed.visible = false;
          rainbow.visible = true;
        } else {
          cloud.visible = false;
          cloudFailed.visible = true;
          rainbow.visible = false;
        }

        left.texture = state.result.left < 0 ? Texture.EMPTY : leftTextures[state.result.left];
        right.texture = state.result.right < 0 ? Texture.EMPTY : rightTextures[state.result.right];
        left.scale = right.scale = 0.65;
        left.pivot.set(left.width / 0.65, left.height / 0.65);
        right.pivot.set(0, right.height / 0.65);
        left.x = right.x = 0;
        left.y = right.y = 615;
      }
    );
  }
}
