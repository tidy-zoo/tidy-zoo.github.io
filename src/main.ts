import { Application } from 'pixi.js';
import Welcome from './scenes/Welcome';
import Matching from './scenes/Matching';

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

  await app.init({
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio ?? 1
  });
  document.body.appendChild(app.canvas);

  const { width } = app.canvas.getBoundingClientRect();

  const welcome = new Welcome();
  await welcome.initialize();
  welcome.scale.x = welcome.scale.y = width / welcome.width;
  app.stage.addChild(welcome);

  const matching = new Matching(width);
  app.stage.addChild(matching);
})();
