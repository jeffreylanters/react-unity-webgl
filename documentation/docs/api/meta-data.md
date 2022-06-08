# Application Meta Data

Sets the Unity Application meta data.

## Type Definition

```ts title="Type Definition"
interface IUnityConfig {
  readonly productName?: string;
  readonly productVersion?: string;
  readonly companyName?: string;
}
```

## Example Usage

A basic implementation could look something like this. In the following example we'll provide the application meta data.

```jsx {10-12} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    productName: "My Game",
    productVersion: "1.0.0",
    companyName: "Developer",
  });

  return <Unity unityProvider={unityProvider} />;
}
```
