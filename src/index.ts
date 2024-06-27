import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  timeout,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  DiamondPlugin,
  FrameFadePlugin,
  GLTFAnimationPlugin,
  GroundPlugin,
  BloomPlugin,
  TemporalAAPlugin,
  AnisotropyPlugin,
  GammaCorrectionPlugin,
  addBasePlugins,
  ITexture,
  TweakpaneUiPlugin,
  AssetManagerBasicPopupPlugin,
  CanvasSnipperPlugin,
  IViewerPlugin,
  FileTransferPlugin,

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // Add plugins individually.
  // await viewer.addPlugin(GBufferPlugin)
  // await viewer.addPlugin(new ProgressivePlugin(32))
  // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
  // await viewer.addPlugin(GammaCorrectionPlugin)
  // await viewer.addPlugin(SSRPlugin)
  // await viewer.addPlugin(SSAOPlugin)
  // await viewer.addPlugin(DiamondPlugin)
  // await viewer.addPlugin(FrameFadePlugin)
  // await viewer.addPlugin(GLTFAnimationPlugin)
  // await viewer.addPlugin(GroundPlugin)
  // await viewer.addPlugin(BloomPlugin)
  // await viewer.addPlugin(TemporalAAPlugin) // await viewer.addPlugin(AnisotropyPlugin)
  // and many more...

  // or use this to add all main ones at once.
  await addBasePlugins(viewer); // check the source: https://codepen.io/repalash/pen/JjLxGmy for the list of plugins added.

  // Add a popup(in HTML) with download progress when any asset is downloading.
  await viewer.addPlugin(AssetManagerBasicPopupPlugin);

  // Required for downloading files from the UI
  await viewer.addPlugin(FileTransferPlugin);

  // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
  await viewer.addPlugin(CanvasSnipperPlugin);

  // Import and add a GLB file.
  await viewer.load("./assets/drill.glb");

  // Load an environment map if not set in the glb file
  // await viewer.setEnvironmentMap("./assets/environment.hdr");

  // Add some UI for tweak and testing.
  const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin);
  // Add plugins to the UI to see their settings.
  uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin);

  function triggerParams(ref: string) {
    return {
      scrollTrigger: {
        trigger: ref,
        start: "top bottom",
        end: "top top",
        scrub: 0.1,
        immediateRender: false,
      },
    };
  }

  function setupScrollAnimation() {
    const tl = gsap.timeline();

    // First transition
    tl.to(position, {
      x: 3.38,
      y: -2.76,
      z: -4.74,
      ...triggerParams(".second"),
      onComplete: startSecondAnimation,
    }).to(target, {
      x: -0.73,
      y: 0.33,
      z: -0.46,
      ...triggerParams(".second"),
    });

    // Second transition
    function startSecondAnimation() {
      tl.to(position, {
        x: -2.99,
        y: 0.09,
        z: 1.97,
        ...triggerParams(".third"),
      }).to(target, {
        x: -1.05,
        y: 1.19,
        z: -0.29,
        ...triggerParams(".third"),
      });
    }
  }

  viewer.addEventListener("preFrame", () => {
    camera.positionUpdated(false);
    camera.targetUpdated(true);
  });

  setupScrollAnimation();
}

setupViewer();
