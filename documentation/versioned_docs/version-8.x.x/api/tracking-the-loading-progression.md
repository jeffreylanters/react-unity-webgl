# Tracking the loading progression

> Available since version 6.0.1

While your game is being downloaded from the server and loaded into memory, you might want to display some sort of loading indicator informing the user of the progression. The built-in progression event listeners can be used for such cases. On Progress is emitted while the Unity player is being loaded. The parameter contains the progression from 0 to 1. When the game is fully loaded into memory and will start execution, the progression will hit 1. The event will invoke everytime the progression advances.

```ts
function on(
  eventName: "progress",
  eventListener: (progression: number) => void
): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll track the loading progression and show a loading indicator.

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
  const [progression, setProgression] = useState(0);

  useEffect(function () {
    unityContext.on("progress", function (progression) {
      setProgression(progression);
    });
  }, []);

  return (
    <div>
      <p>Loading {progression * 100} percent...</p>
      <Unity unityContext={unityContext} />
    </div>
  );
}
```
