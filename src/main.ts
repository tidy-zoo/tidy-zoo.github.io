import { Application, Assets, Graphics, Sprite, Texture } from 'pixi.js';
import Reel from './Reel';
import PairResult from './PairResult';
import background from './assets/background.jpg';
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

  await Assets.load([
    { alias: 'background', src: background },
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

  const bg = new Sprite(Texture.from(background));
  bg.scale.x = bg.scale.y = 0.115;
  app.stage.addChild(bg);

  const { width, height } = app.canvas.getBoundingClientRect();
  app.stage.scale.x = app.stage.scale.y = Math.min(width / bg.width, height / bg.height);

  const bgSize = bg.getSize();

  const maskLeft = new Graphics().rect(0, 23, 200, 365).fill(0xff0000);
  app.stage.addChild(maskLeft);

  const reelLeft = new Reel({
    numSymbols: 10,
    symbolSize,
    textures: [
      Texture.from('bearHead'),
      Texture.from('gorillaHead'),
      Texture.from('hippoHead'),
      Texture.from('pigHead')
    ]
  });
  reelLeft.scale.x = reelLeft.scale.y = 0.3;
  reelLeft.x = 43;
  reelLeft.mask = maskLeft;
  reelLeft.run();
  app.stage.addChild(reelLeft);

  const maskRight = new Graphics().rect(680, 23, 200, 365).fill(0xff0000);
  app.stage.addChild(maskRight);

  const reelRight = new Reel({
    numSymbols: 10,
    symbolSize,
    textures: [
      Texture.from('bearButt'),
      Texture.from('gorillaButt'),
      Texture.from('hippoButt'),
      Texture.from('pigButt')
    ]
  });
  reelRight.scale.x = reelRight.scale.y = 0.3;
  reelRight.x = 750;
  reelRight.mask = maskRight;
  reelRight.run(false);
  app.stage.addChild(reelRight);

  const result = new PairResult({
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
  result.x = bgSize.width * 0.5;
  result.y = 140;
  result.scale.x = result.scale.y = 0.33;
  app.stage.addChild(result);

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
