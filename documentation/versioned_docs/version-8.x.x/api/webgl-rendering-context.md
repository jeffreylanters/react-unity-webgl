# WebGL Rendering Context

The WebGLContexAttributes allow you to configure WebGLRenderingContext creation options when passed as an additional context attributes parameter to the UnityContext. An object can be used as the WebGLContextAttributes and if the properties below are specified on it, they will be used instead of the default values. Only the options passed to the first call will apply, subsequent calls will ignore the attributes.

```tsx showLineNumbers
<IUnityConfig>{
  webGLContextAttributes: {
    alpha: boolean,
    antialias: boolean,
    depth: boolean,
    failIfMajorPerformanceCaveat: boolean,
    powerPreference: "default" | "high-performance" | "low-power",
    premultipliedAlpha: boolean,
    preserveDrawingBuffer: boolean,
    stencil: boolean,
    desynchronized: boolean,
    xrCompatible: boolean,
  },
};
```

#### Example implementation

A basic implementation could look something like this.

```jsx showLineNumbers
import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  webglContextAttributes: {
    alpha: true,
    antialias: true,
    depth: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "high-performance",
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
    stencil: true,
    desynchronized: true,
    xrCompatible: true,
  },
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
