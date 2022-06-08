# Requesting Canvas Pointer Locking

Asynchronously ask for the pointer to be locked on current canvas. To track the success or failure of the request, it is necessary to listen for the pointerlockchange and pointerlockerror events at the Document level.

```tsx showLineNumbers
function requestPointerLock(): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll request a pointer lock on the click of a button.

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
  function requestPointerLock() {
    unityContext.requestPointerLock();
  }

  return (
    <div>
      <button onClick={requestPointerLock}>Lock Pointer</button>
      <Unity unityContext={unityContext} />
    </div>
  );
}
```
