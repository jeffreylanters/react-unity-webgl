# Handeling on when the Application is loaded

> Available since version 6.0.2

While your application is being downloaded from the server and loaded into memory, you might want to display some sort of overlay or loading screen. The built-in loaded event listeners can be used for such cases. On Loaded is emitted when the Unity player is loaded into memory and execution is started. Event will be invoked only once.

```ts
function on(eventName: "loaded", eventListener: () => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the games visibility to hidden until it's loaded.

```jsx
// File: App.jsx

import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(function () {
    unityContext.on("loaded", function () {
      setIsLoaded(true);
    });
  }, []);

  return (
    <Unity
      style={{ visibility: isLoaded ? "visible" : "hidden" }}
      unityContext={unityContext}
    />
  );
}
```
