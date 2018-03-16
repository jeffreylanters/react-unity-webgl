import { UnityInstance } from "../components/Unity";

export function SetFullscreen(isFullscreen) {
  if (typeof UnityInstance !== "undefined") {
    UnityInstance.SetFullscreen(isFullscreen === true ? 1 : 0);
  } else {
    console.warn(
      `Wait for Unity to be instantiated before setting fullscreen.`
    );
  }
}
