import { Application, Assets, Texture } from 'pixi.js';
import Reel from './Reel';
import Result from './Result';
import bearButt from './assets/bear/butt.png';
import bearButtSide from './assets/bear/butt-side.png';
import bearHead from './assets/bear/head.png';
import bearHeadSide from './assets/bear/head-side.png';
import gorillaButt from './assets/gorilla/butt.png';
import gorillaButtSide from './assets/gorilla/butt-side.png';
import gorillaHead from './assets/gorilla/head.png';
import gorillaHeadSide from './assets/gorilla/head-side.png';
import hippoButt from './assets/hippo/butt.png';
import hippoButtSide from './assets/hippo/butt-side.png';
import hippoHead from './assets/hippo/head.png';
import hippoHeadSide from './assets/hippo/head-side.png';
import pigButt from './assets/pig/butt.png';
import pigButtSide from './assets/pig/butt-side.png';
import pigHead from './assets/pig/head.png';
import pigHeadSide from './assets/pig/head-side.png';

declare global {
  interface Window {
    __PIXI_APP__: Application;
  }
}

(async () => {
  const symbolSize = 150;
  const app = new Application();

  if (import.meta.env.DEV) {
    window.__PIXI_APP__ = app;
  }

  await app.init({ resizeTo: window });
  document.body.appendChild(app.canvas);

  const numSymbols = Math.floor(app.canvas.height / symbolSize) + 2;

  await Assets.load([
    { alias: 'bearButt', src: bearButt },
    { alias: 'bearButtSide', src: bearButtSide },
    { alias: 'bearHead', src: bearHead },
    { alias: 'bearHeadSide', src: bearHeadSide },
    { alias: 'gorillaButt', src: gorillaButt },
    { alias: 'gorillaButtSide', src: gorillaButtSide },
    { alias: 'gorillaHead', src: gorillaHead },
    { alias: 'gorillaHeadSide', src: gorillaHeadSide },
    { alias: 'hippoButt', src: hippoButt },
    { alias: 'hippoButtSide', src: hippoButtSide },
    { alias: 'hippoHead', src: hippoHead },
    { alias: 'hippoHeadSide', src: hippoHeadSide },
    { alias: 'pigButt', src: pigButt },
    { alias: 'pigButtSide', src: pigButtSide },
    { alias: 'pigHead', src: pigHead },
    { alias: 'pigHeadSide', src: pigHeadSide }
  ]);

  const reelLeft = app.stage.addChild(
    new Reel({
      numSymbols,
      symbolSize,
      textures: [
        Texture.from('bearHead'),
        Texture.from('gorillaHead'),
        Texture.from('hippoHead'),
        Texture.from('pigHead')
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
        Texture.from('bearButt'),
        Texture.from('gorillaButt'),
        Texture.from('hippoButt'),
        Texture.from('pigButt')
      ]
    })
  );

  reelRight.x = app.canvas.width - symbolSize;
  reelRight.run(false);

  const result = new Result({
    headTextures: [
      Texture.from('bearHeadSide'),
      Texture.from('gorillaHeadSide'),
      Texture.from('hippoHeadSide'),
      Texture.from('pigHeadSide')
    ],
    buttTextures: [
      Texture.from('bearButtSide'),
      Texture.from('gorillaButtSide'),
      Texture.from('hippoButtSide'),
      Texture.from('pigButtSide')
    ]
  });
  app.stage.addChild(result);
  result.x = app.stage.width * 0.5;

  const matchResult: (number | null)[] = [null, null];
  const updateMatchResult = (updater: (r: typeof matchResult) => void) => {
    if (matchResult[0] !== null && matchResult[1] !== null) {
      matchResult[0] = matchResult[1] = null;
    }
    updater(matchResult);
    result.head = matchResult[0];
    result.butt = matchResult[1];
  };

  reelLeft.on('click_symbol', payload => {
    updateMatchResult(matchResult => {
      matchResult[0] = payload.id;
    });
  });

  reelRight.on('click_symbol', payload => {
    updateMatchResult(matchResult => {
      matchResult[1] = payload.id;
    });
  });
})();
