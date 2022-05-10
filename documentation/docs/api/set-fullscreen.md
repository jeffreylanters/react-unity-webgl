# Set Fullscreen

Enabled or disabled te fullscreen mode of the Unity Application's Canvas.

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
function setFullscreen(enabled: boolean): void;
```

## Implementation

The exposed set fullscreen function allows you to enable and disable the fullscreen mode of your Unity Application. The parameter `enabled` is a boolean value that indicates if the fullscreen mode should be enabled or disabled.

:::tip
Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking.
:::

To get started, destructure the set fullscreen function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the set fullscreen function"
const { setFullscreen } = useUnityContext();
```

Next you'll be able to invoke the set fullscreen function with the desired state.

```jsx showLineNumbers title="Example: Using the set fullscreen function"
function handleClick() {
  setFullscreen(true);
}

return <button onClick={handleClick}>Enter Fullscreen</button>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display a button which will enter fullscreen mode.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, setFullscreen } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  function handleClickEnterFullscreen() {
    setFullscreen(true);
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickEnterFullscreen}>Enter Fullscreen</button>
    </Fragment>
  );
}
```
