# Disabled Canvas Events

Overwrites the default disabled canvas events.

## Type Definition

```tsx title="Type Definition"
<Unity disabledCanvasEvents={string[]} />
```

## Implementation

> By default Unity disables the `contextmenu` and `dragstart` events on the canvas element. This is done to prevent the user from right clicking on the canvas and dragging the page while interacting with the Unity Application. Note that by setting the `disabledCanvasEvents` property you'll override the default values. If you don't want this to happen, you'll need to add events these to the array.

## Example Usage​

A basic implementation could look something like this. In the following example overwrite the default values and disable the `dragstart` and `scroll` events. This will also allow the user to right click on the canvas to open the context menu.

```jsx {10-21} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Unity
      unityProvider={unityProvider}
      disabledCanvasEvents={["dragstart", "scroll"]}
    />
  );
}
```
