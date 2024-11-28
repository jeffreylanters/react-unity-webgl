# Unsafe Detach and Unload Immediate

:::warning
**It is not recommended to use this API unless you are an advanced user.** When using this API, you are responsible for managing the lifecycle of the Unity instance. If you are not careful, you may encounter memory leaks or other issues.
:::

The `UNSAFE__detachAndUnloadImmediate` function is used to detach and unload the Unity instance immediately. This function is useful when you want to unload the Unity instance immediately without waiting for the next garbage collection cycle.

## Type Definition

```ts title="Type Definition"
const UNSAFE__detachAndUnloadImmediate: () => Promise<void>;
```

## Example Usage

A basic implementation could look something like this. In the following example we are using the `useEffect` hook to call the `UNSAFE__detachAndUnloadImmediate` function when the component is unmounted.

```jsx {12-16} showLineNumbers title="App.jsx"
import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, UNSAFE__detachAndUnloadImmediate } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  useEffect(() => {
    return () => {
      UNSAFE__detachAndUnloadImmediate();
    };
  }, []);

  return <Unity unityProvider={unityProvider} />;
}
```
