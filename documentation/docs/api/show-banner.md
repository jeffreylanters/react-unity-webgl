# Show Banner

The Show Banner API allows you to intercept non-critical warnings and error messages from the Unity Instance and route them into your own UI instead of relying on Unity's default in-DOM banner.

## Type Definition

```tsx title="Type Definition"
function showBanner(message: string, type?: UnityBannerType): void;
```

```tsx title="Type Definition"
type UnityBannerType = "error" | "warning";
```

## Implementation

When the Unity Instance encounters a non-critical issue it would normally display a banner directly in the DOM, above the canvas. By providing a `showBanner` handler to the Unity Config you take ownership of that signal — Unity will call your handler with the message and an optional type instead of rendering its own banner.

This is the official way (supported since Unity 6.3) to surface Unity warnings and recoverable errors inside your React UI, for example as a toast, a banner of your own, or a telemetry event.

- `message` is the human readable text Unity wanted to display.
- `type` is `"error"` or `"warning"`. It may be `undefined` for messages that do not carry a severity.

:::info
The handler is captured once during initialisation and passed to `createUnityInstance`. Changing the function reference after the Unity Instance has booted will not have any effect, so prefer a stable reference (for example via `useCallback` or a module-scope function).
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll route warnings and errors to a piece of React state which renders a custom banner above the Unity canvas.

```jsx {6-8,15} showLineNumbers title="App.jsx"
import React, { useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [banner, setBanner] = useState(null);

  function handleShowBanner(message, type) {
    setBanner({ message, type: type ?? "info" });
  }

  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    showBanner: handleShowBanner,
  });

  return (
    <>
      {banner && (
        <div role="alert" data-severity={banner.type}>
          {banner.message}
        </div>
      )}
      <Unity unityProvider={unityProvider} />
    </>
  );
}
```

When using TypeScript, the `UnityBannerType` is exported from the package so you can type your handler explicitly.

```tsx showLineNumbers title="App.tsx"
import { UnityBannerType } from "react-unity-webgl";

function handleShowBanner(message: string, type?: UnityBannerType) {
  // ...
}
```
