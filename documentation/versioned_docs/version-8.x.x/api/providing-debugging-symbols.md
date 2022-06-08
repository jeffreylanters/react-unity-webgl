# Providing Debugging Symbols

> Available since version 8.8.0

This is set to the filename of the JSON file containing debug symbols when the current build is using debug symbols, otherwise it is set to an empty string. If the Debug Symbols option is enabled and the Development Build option is disabled then the Debug Symbols will be generated automatically.

```tsx
<IUnityConfig>{
  symbolsUrl: string,
};
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the debugging symbols url to the "memoryUrl" directory.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  symbolsUrl: "build/debug-symbols.json",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
