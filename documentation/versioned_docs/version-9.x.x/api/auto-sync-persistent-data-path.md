# Auto Sync Persistent Data Path

Enables or disables auto synchronization of the persistent data path.

## Type Definition

```tsx title="Type Definition"
const autoSyncPersistentDataPath: boolean = false;
```

## Implementation

If set to true, all file writes inside the Unity `Application.persistentDataPath` directory automatically persist so that the contents are remembered when the user revisits the website the next time. If unset (or set to false), you must manually sync file modifications inside the `Application.persistentDataPath` directory by calling the `JS_FileSystem_Sync()` JavaScript function.

## Example Usage

A basic implementation could look something like this. In the following example we'll enable auto synchronization of the persistent data path.

```jsx {10} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    autoSyncPersistentDataPath: true,
  });

  return <Unity unityProvider={unityProvider} />;
}
```
