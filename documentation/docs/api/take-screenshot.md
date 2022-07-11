# Capturing a Screenshot

Takes a screenshot of the canvas and returns a data URL containing image data.

## Type Definition

```tsx title="Type Definition"
function takeScreenshot(
  dataType?: string,
  quality?: number
): string | undefined;
```

## Implementation

Takes a screenshot of the canvas and returns a data URL containing image data. An optional data type can be provided, this parameter has to contain a valid image mimetype such as `image/png` or `image/jpg`. If no data type is provided, the default value of `image/png` is used. The quality of the image is optional, if not provided the default value of 0.9 is used. The quality is only used for the `image/jpg` mimetype.

If an attempt to take a screenshot was made before the Unity Application was initialized, the function will return `undefined` instead of a data URL.

:::info
In order to take screenshot of the Unity WebGL canvas, you'll need to enable preserve drawing buffer within the WebGL context attributes. Enabling this feature makes sure that the canvas is not cleared before the screenshot is taken. This setting en disabled by default, and can be enabled via the Unity Config's [WebGLRenderingContext](/docs/api/webgl-rendering-context) property.

```jsx showLineNumbers title="Example: Preserving the Drawing Buffer"
const unityContext = useUnityContext({
  webGLContextAttributes: {
    preserveDrawingBuffer: true,
  },
});
```

:::

To get started, destructure the take screenshot function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the take screenshot function"
const { takeScreenshot } = useUnityContext();
```

Next you'll be able to invoke the take screenshot function with the desired image type and quality.

```jsx showLineNumbers title="Example: Using the take screenshot function"
function handleClick() {
  const dataUrl = takeScreenshot("image/jpg", 1.0);
}

return <button onClick={handleClick}>Take Screenshot</button>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display a button which allows the user to take a screenshot of the Unity WebGL canvas. For demonstration purposes, we'll open the image in a new tab.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, takeScreenshot } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    webGLContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  function handleClickTakeScreenshot() {
    const dataUrl = takeScreenshot("image/jpg", 0.5);
    window.open(dataUrl, "_blank");
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickTakeScreenshot}>Take Screenshot</button>
    </Fragment>
  );
}
```
