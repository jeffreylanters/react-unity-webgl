# Providing an external Memory File

> Available since version 8.8.0

This is set to the filename of the memory file when memory is stored in an external file, otherwise it is set to an empty string.

```tsx
<IUnityConfig>{
  memoryUrl: string,
};
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the memory url to the "memoryUrl" directory.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  memoryUrl: "memoryfile",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
