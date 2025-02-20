# Using a Web Worker

When using a web worker, you can provide the URL to the Unity Web Worker file.
Web Workers are particularly useful when your Unity application performs heavy computations or processing that could potentially block the main thread. By moving these operations to a separate thread, your application remains responsive to user interactions.

## Type Definition

```ts title="Type Definition"
type UnityConfig = {
  readonly workerUrl?: string;
};
```

## Example Usage

Here's a basic implementation showing how to configure the web worker. In this example, we'll set the worker URL to point to the Unity worker file in the build directory.

```jsx showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    workerUrl: "build/myunityapp.worker.js",
  });

  return <Unity unityProvider={unityProvider} />;
}
```
