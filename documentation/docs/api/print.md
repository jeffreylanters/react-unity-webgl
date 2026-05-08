# Print

The Print API lets you intercept all standard log output coming out of the Unity Module — both internal information messages from the loader and runtime, and `Debug.Log` calls from your C# code — before they reach the browser console.

## Type Definition

```tsx title="Type Definition"
function print(message: string): void;
```

## Implementation

By default, Unity routes its standard output through `console.log`. When a `print` handler is provided to the Unity Config, Unity will call your handler instead of writing to the console directly. This is useful for forwarding Unity logs into a custom logger, dev tools panel, telemetry sink, or in-app debug overlay.

Both internal Unity messages (loader progress, framework diagnostics) and your own `Debug.Log` calls flow through this handler.

:::info
The handler is captured once during initialisation and passed to `createUnityInstance`. Changing the function reference after the Unity Instance has booted will not have any effect, so prefer a stable reference (for example via `useCallback` or a module-scope function).
:::

:::caution
The handler replaces the default console output. If you still want messages in the browser console, call `console.log` from inside your handler.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll forward every Unity log message to both the console and a telemetry function.

```jsx {5-8,15} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  function handlePrint(message) {
    console.log("[Unity]", message);
    telemetry.capture({ severity: "info", message });
  }

  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    print: handlePrint,
  });

  return <Unity unityProvider={unityProvider} />;
}
```
