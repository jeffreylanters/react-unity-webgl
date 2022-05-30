# Device Pixel Ratio and Retina Support

Sets the device pixel ratio of the Unity Application's canvas.

> Available since version 8.1.1

:::info
Usage of this feature requires your Unity Application to be built with Unity 2020.1 or newer.
:::

## Type Definition

```tsx title="Type Definition"
<Unity devicePixelRatio={number} />
```

## Implementation

The Canvas can appear too blurry on retina screens. The device pixel ratio determines how much extra pixel density should be added to allow for a sharper image. Providing this prop will set the device pixel ratio of the Unity Application's canvas by multiplying the default resolution of the canvas by the provided value.

You can use the browser's device pixel ratio to determine the device pixel ratio of the Unity Application's canvas. Head over to the advanced examples to see [how to implement a dynamic device pixel ratio](/docs/advanced-examples/dynamic-device-pixel-ratio).

:::warning
The value will be used as a multiplier to the actual canvas scale and will litterally add extra pixels to the canvas. This will have a big impact on the performance of your Unity Application and overall performance of your browser.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll use the browser's device pixel ratio to determine the device pixel ratio of the Unity Application's canvas. You can change this value to 1 on retina screens to see blurry canvas.

```jsx showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Unity
      unityProvider={unityProvider}
      devicePixelRatio={window.devicePixelRatio}
    />
  );
}
```
