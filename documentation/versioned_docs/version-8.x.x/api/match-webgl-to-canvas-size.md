# Change the Render Size of WebGL Canvas

> Requires Unity 2021.1 beta 8 or newer

To customize the WebGL canvas target render size instead of requiring it to always match 1:1 with the High DPI CSS size of the canvas, the match WebGL to canvas size flag can be set to false. Allowing full control over the Canvas Render size using JavaScript.

```jsx showLineNumbers
<Unity matchWebGLToCanvasSize={boolean} />
```

#### Example implementation

A basic implementation could look something like this. In this example the canvas will be styled to have a width and height of 100 pixels while setting the actual canvas's renderer size to a width of 100 pixels, and a height of 50 pixels resulting in the image to get stretched.

```jsx showLineNumbers
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
      canvas.width = 100;
      canvas.height = 50;
    });
  }, []);

  return (
    <Unity
      unityContext={unityContext}
      matchWebGLToCanvasSize={false}
      style={{ width: "100px", height: "100px" }}
    />
  );
}
```
