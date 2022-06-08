# Device Pixel Ratio and Retina Support

The Canvas can appear too blurry on retina screens. The device pixel ratio determines how much extra pixel density should be added to allow for a sharper image. The value will be used as a multiplier to the actual canvas scale and will have a big impact on the performance of your application.

```tsx showLineNumbers
<Unity devicePixelRatio={number} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's device pixel ratio to a value of "2" for sharper images on Retina screens.

```jsx showLineNumbers
import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  return <Unity unityContext={unityContext} devicePixelRatio={2} />;
}
```
