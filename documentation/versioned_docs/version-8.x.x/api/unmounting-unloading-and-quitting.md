# Unmounting Unloading and Quitting

> Available since version 8.0.0 and requires Unity 2020.1 or newer

The quitted event is emitted in two cases, when the Unity component is unmounted, and when Application.Quit is invoked from within your Unity Application. In both cases the Unity Player will be unloaded from memory.

```ts
function on(eventName: "quitted", eventListener: () => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll listen to the event but don't act on it yet.

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
    unityContext.on("quitted", function () {});
  }, []);

  return <Unity unityContext={unityConext} />;
}
```
