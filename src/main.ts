import { Application, Assets } from 'pixi.js';

import bgMatching from './assets/bg-matching.jpg';
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
import Matching from './scenes/Matching';
import { store } from './store';

declare global {
  interface Window {
    __PIXI_APP__: Application;
  }
}

(async () => {
  const app = new Application();

  if (import.meta.env.DEV) {
    window.__PIXI_APP__ = app;
  }

  await app.init({ resizeTo: window });
  document.body.appendChild(app.canvas);

  await Assets.load([
    { alias: 'bgMatching', src: bgMatching },
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

  const { width } = app.canvas.getBoundingClientRect();

  const matching = new Matching();
  matching.scale.x = matching.scale.y = width / matching.width;
  app.stage.addChild(matching);

  store.subscribe(() => {
    console.log(store.getState());
  });
})();
