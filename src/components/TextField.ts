import { Text, TextStyle, TextStyleOptions } from 'pixi.js';

export default class extends Text {
  constructor(text: string, style?: Partial<TextStyleOptions>) {
    super({
      text,
      style: new TextStyle({
        fontFamily: 'Varela Round',
        fontSize: 200,
        fill: '#fff',
        fontWeight: 'bold',
        ...style
      })
    });
  }
}
