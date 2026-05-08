# Print Errors

The Print Errors API lets you intercept all error output coming out of the Unity Module — runtime errors, JavaScript errors thrown from `jslib` files, and `Debug.LogError` calls from your C# code — before they reach the browser console.

## Type Definition

```tsx title="Type Definition"
function printErr(message: string): void;
```

## Implementation

By default, Unity routes its error output through `console.error`. When a `printErr` handler is provided to the Unity Config, Unity will call your handler instead of writing to the console directly. This is the counterpart to [Print](./print.md) and is the recommended channel for forwarding Unity errors into custom logging, error reporting (e.g. Sentry), or an in-app diagnostics panel.

Both runtime problems thrown by the engine and `jslib`/JavaScript errors flow through this handler.

:::info
The handler is captured once during initialisation and passed to `createUnityInstance`. Changing the function reference after the Unity Instance has booted will not have any effect, so prefer a stable reference (for example via `useCallback` or a module-scope function).
:::

:::caution
The handler replaces the default console output. If you still want messages in the browser console, call `console.error` from inside your handler.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll forward every Unity error to both the console and an error reporting service.

```jsx {5-8,15} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  function handlePrintErr(message) {
    console.error("[Unity]", message);
    errorReporter.captureMessage(message, { level: "error" });
  }

  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    printErr: handlePrintErr,
  });

  return <Unity unityProvider={unityProvider} />;
}
```
