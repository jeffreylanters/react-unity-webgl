# Taking Screenshots of the Canvas

> Available since version 8.6.0

Takes a screenshot of the canvas and returns a data URL containing image data. The image data is in .png format unless otherwise specified. Enabling preserve drawing buffer within the WebGL context attributes is required in order to take a screenshot.

```ts
function takeScreenshot(
  dataType?: "image/png" | "image/jpeg" | "image/webp",
  quality?: number
): string | null;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, a high quality JPEG screenshot will be taken and opened within a new tab.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});

function App() {
  function handleOnClickTakeScreenshot() {
    const data = unityContext.takeScreenshot("image/jpeg", 1.0);
    if (data !== null) {
      window.open(data, "_blank");
    }
  }

  return (
    <div>
      <button onClick={handleOnClickTakeScreenshot}>Take Screenshot</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
```
