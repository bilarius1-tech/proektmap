import Phaser from "phaser";
import { ForestScene } from "./forest-scene";
import type { AiLandGameCallbacks, AiLandGameHandle } from "./types";

export function createAiLandGame(
  parent: HTMLElement,
  callbacks: AiLandGameCallbacks,
  initiallyOpenBridge = false,
): AiLandGameHandle {
  const scene = new ForestScene(callbacks, initiallyOpenBridge);
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    backgroundColor: "#bfe8d1",
    pixelArt: false,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
    },
    scene: [scene],
  });

  return {
    destroy: () => game.destroy(true),
    setMoveLeft: (active) => scene.setExternalMove("left", active),
    setMoveRight: (active) => scene.setExternalMove("right", active),
    interact: () => scene.requestInteraction(),
    setPaused: (paused) => scene.setGamePaused(paused),
    openBridge: () => scene.unlockBridge(),
  };
}
