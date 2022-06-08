# Streaming Assets

When using Streaming Assets, a URL (or Path) can be defined where your Unity Application can find these files. The URL will be used as the base of every Streaming Asset request.

## Type Definition

```ts title="Type Definition"
interface IUnityConfig {
  readonly streamingAssetsUrl?: string;
}
```

:::caution
All of the URLs which can be provided to the Unity Config, including the ones mentioned above, are due to their enormous size **not included into your bundle**. You should place these files in a public directory within your project or use a CDN. This means the files behind these URLs are loaded during runtime and should be accessible by the browser via a public URL.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll set the streaming assets url to the "streamingassets" directory.

```jsx {10} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    streamingAssetsUrl: "streamingassets",
  });

  return <Unity unityProvider={unityProvider} />;
}
```
