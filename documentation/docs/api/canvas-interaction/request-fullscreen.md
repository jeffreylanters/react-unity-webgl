# Request Fullscreen

Enabled or disabled te fullscreen mode of the Unity Application's Canvas.

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
function requestFullscreen(enabled: boolean): void;
```

## Implementation

The exposed request fullscreen function allows you to enable and disable the fullscreen mode of your Unity Application. The parameter `enabled` is a boolean value that indicates if the fullscreen mode should be enabled or disabled.

:::info
It is posible to also request locking the pointer within the canvas via the [request pointer lock function](/docs/api/canvas-interaction/request-pointer-lock) within the Unity Context. Cursor locking and full-screen mode are both supported simultaneously in React Unity WebGL, implemented using their respective HTML5 APIs.
:::

To get started, destructure the request fullscreen function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the request fullscreen function"
const { requestFullscreen } = useUnityContext();
```

Next you'll be able to invoke the request fullscreen function with the desired state.

```jsx showLineNumbers title="Example: Using the request fullscreen function"
function handleClick() {
  requestFullscreen(true);
}

return <button onClick={handleClick}>Enter Fullscreen</button>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display a button which will enter fullscreen mode.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, requestFullscreen } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  function handleClickEnterFullscreen() {
    requestFullscreen(true);
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickEnterFullscreen}>Enter Fullscreen</button>
    </Fragment>
  );
}
```
