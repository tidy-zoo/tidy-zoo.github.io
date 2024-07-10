import { Application } from 'pixi.js';
import Reel from './Reel';

(async () => {
  const app = new Application();
  globalThis.__PIXI_APP__ = app;

  await app.init({ resizeTo: window });
  document.body.appendChild(app.canvas);

  const reel = app.stage.addChild(
    await Reel.create({
      numSymbols: 3,
      textures: [
        'https://pixijs.com/assets/eggHead.png',
        'https://pixijs.com/assets/flowerTop.png',
        'https://pixijs.com/assets/helmlok.png',
        'https://pixijs.com/assets/skully.png'
      ]
    })
  );
  const reel2 = app.stage.addChild(
    await Reel.create({
      numSymbols: 3,
      textures: [
        'https://pixijs.com/assets/eggHead.png',
        'https://pixijs.com/assets/flowerTop.png',
        'https://pixijs.com/assets/helmlok.png',
        'https://pixijs.com/assets/skully.png'
      ]
    })
  );

  reel2.x = 300;
  reel.run();
  reel2.run(false);
})();
