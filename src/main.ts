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

  const welcome = new Welcome();
  await welcome.initialize();
  app.stage.addChild(welcome);

  const originWidth = welcome.width;
  const originalHeight = welcome.height;

  let matching: Matching;
  let scores: Scores;
  let isInitialized = false;

  const resizeScenes = () => {
    const { width, height } = app.canvas.getBoundingClientRect();
    const scale = width / originWidth;

    welcome.scale = scale;
    welcome.y = height * 0.5 - welcome.height * 0.5;

    if (matching) {
      matching.scale = scale;
      matching.y = height * 0.5 - matching.height * 0.5;
    }

    if (scores) {
      scores.scale = scale;
      scores.y = height * 0.5 - scores.height * 0.5;
    }
  };

  resizeScenes();
  new ResizeObserver(resizeScenes).observe(app.canvas);

  watchStore(
    state => state.scene,
    state => {
      switch (state.scene) {
        case 'matching':
          if (!isInitialized) {
            isInitialized = true;
            matching = new Matching();
            scores = new Scores();
            resizeScenes();
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
