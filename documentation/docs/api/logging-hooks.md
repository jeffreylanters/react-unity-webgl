# Logging Hooks

Intercept logs from the Unity module.

## Type Definition

```ts title="Type Definition"
type UnityConfig = {
  readonly print?: (message: string) => void;
  readonly printErr?: (message: string) => void;
};
```

## Implementation

The `print` and `printErr` functions supplied in the `UnityConfig` will be passed verbatim to `createUnityInstance`. These functions will receive log messages coming from the Unity module - in particular, logs that would normally be printed to `stdout` or `stderr`.

:::warning
The messages received by these functions are distinct from the ones that are already printed to the console by default via `UnityEngine.Debug.Log` etc.
:::

## Example Usage

Below is an example of using `print` and `printErr` to print module logs to the console.

```jsx {10-11} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    print: console.log,
    printErr: console.error,
  });

  return <Unity unityProvider={unityProvider} />;
}
```
