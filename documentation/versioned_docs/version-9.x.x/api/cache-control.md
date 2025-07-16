# Cache Control

The Cache Control API allows you to control the caching behavior of the Unity WebGL build.

## Type Definition

```tsx title="Type Definition"
function cacheControl(url: string): UnityCacheControlMode;
```

```tsx title="Type Definition"
type UnityCacheControlMode = "must-revalidate" | "immutable" | "no-store";
```

## Implementation

In Unity WebGL, the Cache API lets you store the asset data cached in .data files and AssetBundles within the browser cache. Storage limits for the browser cache such as maximum file size, maximum overall cache size, and eviction criteria are dependent on the browser and platform that you’re using.

By default, the WebGL Cache stores the asset data file .data and AssetBundle files .bundle, and revalidates them before loading them from the cache. You can change this behavior by adding a new WebGL Template that changes the UnityLoader configuration. The Cache Control API allows you to control the caching behavior of the Unity WebGL build.

:::info
To access Data Caching, open the Publishing Setings for WebGL from File > Build Settings > Player Settings. This enables the browser to cache the main data files into the IndexedDB database.
:::

The cacheControl function takes the url of a request as a parameter and returns one of the following:

- `must-revalidate` If the function returns must-revalidate, the cache returns to an enabled state and the file is revalidated before being loaded from the cache.
- `immutable` If the function returns immutable, the cache is enabled and the file is loaded from the cache without revalidation.
- `no-store` - If the function returns no-store, the cache is disabled.

The browser automatically stores (caches) certain file types such as .html, .js, .css, .json, .jpg, .png, so they don’t need to be explicitly stored in the WebGL Cache. Typical candidates for the WebGL cache include large files and files that use a custom file format.

## Example Usage

A basic implementation could look something like this. In the following example we'll apply a method which will handle our custom cache control. Here we'll define various cache control modes for different file types.

```jsx {5-13,20} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  function handleCacheControl(url) {
    if (url.match(/\.data/) || url.match(/\.bundle/)) {
      return "must-revalidate";
    }
    if (url.match(/\.mp4/) || url.match(/\.wav/)) {
      return "immutable";
    }
    return "no-store";
  }

  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    cacheControl: handleCacheControl,
  });

  return <Unity unityProvider={unityProvider} />;
}
```
