import { Text, TextStyle, TextStyleOptions } from 'pixi.js';

export default class TextField extends Text {
  constructor(text: string, style?: Partial<TextStyleOptions>) {
    super({
      text,
      style: new TextStyle({
        fontFamily: 'Edu AU VIC WA NT Hand',
        fill: '#fff',
        fontWeight: 'bold',
        ...style
      })
    });
  }
}
