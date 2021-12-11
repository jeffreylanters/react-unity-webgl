# React Unity WebGL version 9 Hooks proposal

## To Do List

- Adding and removing event listeners
  - custom events
  - debug
  - quitted

## Example usage

```jsx
import React, { Fragment } from "react";
import Unity, { useUnityContext } from "react-unity-webgl";

function App() {
  // Inclusion of the use Unity Context hook
  const {
    config, // Exposing the entire config, should be passed to the Unity component
    sendMessage, // A method which can be used to send messages to the Unity instance
    isLoaded, // A boolean indicating if the Unity instance has loaded
    loadingProgression, // A number between 0 and 1 indicating the loading progression
    takeScreenshot, // A method which can be used to take a screenshot of the Unity canvas
    setFullscreen, // A method which can be used to set the Unity canvas to fullscreen
    requestPointerLock, // A method which can be used to request pointer lock on the Unity canvas
    canvas, // The Unity canvas element
    error, // An error object if the Unity instance has failed to load
  } = new useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    // Optional
    streamingAssetsUrl: "streamingassets",
    productName: "My Game",
    productVersion: "1.0.0",
    companyName: "El Raccoone",
    webGLContextAttributes: {
      alpha: true,
      antialias: true,
      depth: true,
      failIfMajorPerformanceCaveat: true,
      powerPreference: "default",
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      stencil: true,
      desynchronized: true,
      xrCompatible: true,
    },
  });

  function handleOnClickSendMessage() {
    sendMessage("Hello from React!");
  }

  return (
    <Unity
      config={config}
      // Optional
      style={{}}
      className=""
      devicePixelRatio={1}
      tabIndex={1}
      matchWebGLToCanvasSize={true}
    />
  );
}
```
