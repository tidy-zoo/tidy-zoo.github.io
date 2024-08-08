import { Container, Sprite, Texture } from 'pixi.js';
import TextField from '../../components/TextField';

export default class ScoreBoard extends Container {
  _scoreTexts: TextField[];

  constructor() {
    super();

    const textures = [
      Texture.from('bearHead'),
      Texture.from('boarHead'),
      Texture.from('elephantHead'),
      Texture.from('giraffeHead'),
      Texture.from('gorillaHead'),
      Texture.from('hippoHead'),
      Texture.from('oxHead'),
      Texture.from('pigHead'),
      Texture.from('rhinoHead'),
      Texture.from('twbearHead')
    ];
    const maxHeight = textures.reduce((h, t) => Math.max(t.height, h), 0);

    const numCol = 5;

    this._scoreTexts = textures.map((t, index) => {
      const score = new Container();
      const col = index % numCol;
      const row = Math.floor(index / 5);
      score.x = col * 200;
      score.y = row * 150;
      this.addChild(score);

      const icon = new Sprite(t);
      icon.scale = 0.2;
      icon.y = maxHeight * icon.scale.y - icon.height;

      const scoreText = new TextField('', {
        fill: 0x6a6a6b
      });
      scoreText.x = icon.width + 5;
      scoreText.y = icon.y + icon.height - scoreText.height;

      score.addChild(icon, scoreText);

      return scoreText;
    });
  }

  set scores(val: { [index: string]: number }) {
    this._scoreTexts.forEach((tf, id) => {
      tf.text = `x${val[id] ?? 0}`;
    });
  }
}
