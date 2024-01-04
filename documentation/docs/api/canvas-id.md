import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Canvas ID

Sets a custom ID for the Unity Application's canvas.

## Type Definition

```tsx title="Type Definition"
<Unity id={string} />
```

## Implementation

By default, Unity WebGL's canvas requires a unique ID which is used internally by Unity. React Unity WebGL will automatically generate a unique ID for the canvas if one is not provided. However, if you need to set a custom ID for the canvas, you can do so by passing the `id` prop to the `Unity` component. This can be useful if you need to target the canvas for custom implementations or other libraries.

Using a custom static ID can also be useful for server-side rendering (SSR) where the ID needs to be consistent between the server and client. In this case, you can use the `id` prop to set a static ID for the canvas.

## Example Usage

A basic implementation could look something like this. In the following example we'll apply a custom ID to the Unity Application's canvas.

```jsx {12} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return <Unity unityProvider={unityProvider} id="my-canvas-id" />;
}
```
