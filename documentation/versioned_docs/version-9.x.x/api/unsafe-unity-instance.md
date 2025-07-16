# Unsafe Unity Instance

:::warning
**It is not recommended to use this API unless you are an advanced user.** Please make sure that any changes made to, or events bound to the Unity Instance are not reflected inside of the module. This could lead to unexpected behaviour, use with caution.
:::

In the rare case that you need to access the Unity Instance directly, you can do so by using the `useUnityContext` hook to return a reference to the Unity Instance.

## Type Definition

```ts title="Type Definition"
const UNSAFE__unityInstance: UnityInstance | null = null;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll bind the Unity Instance to the window so external scripts can access it.

```jsx {12-15} showLineNumbers title="App.jsx"
import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, UNSAFE__unityInstance } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  useEffect(
    () => (window.unityInstance = UNSAFE__unityInstance),
    [UNSAFE__unityInstance]
  );

  return <Unity unityProvider={unityProvider} />;
}
```
