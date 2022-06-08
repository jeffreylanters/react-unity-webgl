# Defining the Streaming Assets URL

> Available since version 6.1.0

When using Streaming Assets, a URL (or Path) can be defined where your Unity Application can find these files. The URL will be used as the base of every Streaming Asset request.

```tsx
<IUnityConfig>{
  streamingAssetsUrl: string,
};
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the streaming assets url to the "streamingassets" directory.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  streamingAssetsUrl: "streamingassets",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
