# Entering or Leaving Fullscreen

The Unity context object allows you to enable and disable the fullscreen mode of your application. Cursor locking (using Cursor.lockState) and full-screen mode are both supported in WebGL, implemented using the respective HTML5 APIs (Element.requestPointerLock and Element.requestFullscreen). These are supported in Firefox and Chrome. Safari cannot currently use full-screen and cursor locking. An implementation could look something like:

```ts showLineNumbers
function setFullscreen(enabled: boolean): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example a button is added to the Render. When it's being clicked, the application will enter fullscreen mode.

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
  function handleOnClickFullscreen() {
    unityContext.setFullscreen(true);
  }

  return (
    <div>
      <button onClick={handleOnClickFullscreen}>Fullscreen</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
```
