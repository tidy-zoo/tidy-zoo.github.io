import { Application } from 'pixi.js';
import Welcome from './scenes/Welcome';
import Matching from './scenes/Matching';
import Scores from './scenes/Scores';
import { watchStore } from './store';

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

  let matching: Matching;
  let scores: Scores;
  let isInitialized = false;

  watchStore(
    state => state.scene,
    state => {
      switch (state.scene) {
        case 'matching':
          if (!isInitialized) {
            isInitialized = true;

            matching = new Matching();
            matching.scale.x = matching.scale.y = width / matching.width;

            scores = new Scores();
            scores.scale.x = scores.scale.y = width / scores.width;
          }

          app.stage.addChild(matching);
          app.stage.removeChild(scores);
          break;

        case 'scores':
          app.stage.removeChild(matching);
          app.stage.addChild(scores);
          break;
      }
    }
  );
})();
