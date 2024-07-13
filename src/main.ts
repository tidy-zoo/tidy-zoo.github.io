import { Application, Assets, Texture } from 'pixi.js';
import Reel from './Reel';
import Result from './Result';

(async () => {
  const symbolSize = 150;
  const app = new Application();
  globalThis.__PIXI_APP__ = app;

  await app.init({ resizeTo: window });
  document.body.appendChild(app.canvas);

  const numSymbols = Math.floor(app.canvas.height / symbolSize) + 2;

  await Assets.load([
    '/bear/butt-side.png',
    '/bear/butt.png',
    '/bear/head-side.png',
    '/bear/head.png',
    '/gorilla/butt-side.png',
    '/gorilla/butt.png',
    '/gorilla/head-side.png',
    '/gorilla/head.png',
    '/hippo/butt-side.png',
    '/hippo/butt.png',
    '/hippo/head-side.png',
    '/hippo/head.png',
    '/pig/butt-side.png',
    '/pig/butt.png',
    '/pig/head-side.png',
    '/pig/head.png'
  ]);

  const reelLeft = app.stage.addChild(
    new Reel({
      numSymbols,
      symbolSize,
      textures: [
        Texture.from('/bear/head.png'),
        Texture.from('/gorilla/head.png'),
        Texture.from('/hippo/head.png'),
        Texture.from('/pig/head.png')
      ]
    })
  );
  reelLeft.x = 0;
  reelLeft.run();

  const reelRight = app.stage.addChild(
    new Reel({
      numSymbols,
      symbolSize,
      textures: [
        Texture.from('/bear/butt.png'),
        Texture.from('/gorilla/butt.png'),
        Texture.from('/hippo/butt.png'),
        Texture.from('/pig/butt.png')
      ]
    })
  );

  reelRight.x = app.canvas.width - symbolSize;
  reelRight.run(false);

  const result = new Result({
    headTextures: [
      Texture.from('/bear/head-side.png'),
      Texture.from('/gorilla/head-side.png'),
      Texture.from('/hippo/head-side.png'),
      Texture.from('/pig/head-side.png')
    ],
    buttTextures: [
      Texture.from('/bear/butt-side.png'),
      Texture.from('/gorilla/butt-side.png'),
      Texture.from('/hippo/butt-side.png'),
      Texture.from('/pig/butt-side.png')
    ]
  });
  app.stage.addChild(result);
  result.x = app.stage.width * 0.5;

  reelLeft.on('click_symbol', payload => {
    result.head = payload.id;
  });

  reelRight.on('click_symbol', payload => {
    result.butt = payload.id;
  });
})();
