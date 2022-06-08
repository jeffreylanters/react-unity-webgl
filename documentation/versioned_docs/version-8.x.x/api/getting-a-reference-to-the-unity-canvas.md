# Getting a Reference to the Unity Canvas

> Available since version 8.2.3

To get a reference to the canvas, we have to wait for the Unity Instance to be loaded, and the Canvas to be appended to the DOM. This is where the Canvas event comes in. The Canvas event is invoked on this exact moment and passes along a reference to the actual Unity Canvas.

```ts
function on(
  eventName: "canvas",
  eventListener: (canvas: HTMLCanvasElement) => void
): void;
```

#### Example implementation

A basic implementation could look something like this.

```jsx
// File: App.jsx

import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("canvas", function (canvas) {
      canvas.getContext("webgl");
    });
  }, []);

  return <Unity unityContext={unityContext} />;
}
```
