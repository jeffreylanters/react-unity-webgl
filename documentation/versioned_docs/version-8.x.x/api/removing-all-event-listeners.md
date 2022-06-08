# Removing All Event Listeners

> Available since version 8.4.0

Allows the deletion of all event listeners for both built-in and custom events binded to a Unity Context. This can come in handy when unmounting your component or changing your user interface. The event listener will be removed on both the React and Unity side.

```ts
function removeAllEventListeners(): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll remove all event listeners, when the component will unmount.

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
    unityContext.on("progress", function (progression) {});
    unityContext.on("customEvent", function () {});
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  return <Unity unityContext={unityConext} />;
}
```
