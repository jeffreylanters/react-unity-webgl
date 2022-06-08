# WebGL Rendering Context

The WebGLContexAttributes allow you to configure WebGLRenderingContext creation options when passed as an additional context attributes parameter to the UnityContext. An object can be used as the WebGLContextAttributes and if the properties below are specified on it, they will be used instead of the default values. Only the options passed to the first call will apply, subsequent calls will ignore the attributes.

## Type Definition

```ts title="Type Definition"
interface IWebGLContextAttributes {
  readonly alpha?: boolean;
  readonly antialias?: boolean;
  readonly depth?: boolean;
  readonly failIfMajorPerformanceCaveat?: boolean;
  readonly powerPreference?: "default" | "high-performance" | "low-power";
  readonly premultipliedAlpha?: boolean;
  readonly preserveDrawingBuffer?: boolean;
  readonly stencil?: boolean;
  readonly desynchronized?: boolean;
  readonly xrCompatible?: boolean;
}
```

## Implementation

Provide any of the following properties to the WebGLContextAttributes object to override the default values.

#### Alpha

If set to true, the context will have an alpha (transparency) channel.

#### Antialias

If set to true, the context will attempt to perform antialiased rendering if possible.

#### Depth

If set to true, the context will have a 16 bit depth buffer. Defaults to true. Use gl.enable(DEPTH_TEST) to enable the depth test and gl.depthFunc(), gl.depthMask(), and gl.depthRange() to configure the depth test.

#### Fail if major performance caveat

If the value is true, context creation will fail if the implementation determines that the performance of the created WebGL context would be dramatically lower than that of a native application making equivalent OpenGL calls. This could happen for a number of reasons, including an implementation might switch to a software rasterizer if the user's GPU driver is known to be unstable. And an implementation might require reading back the framebuffer from GPU memory to system memory before compositing it with the rest of the page, significantly reducing performance.

#### Power preference

Provides a hint to the user agent indicating what configuration of GPU is suitable for this WebGL context. This may influence which GPU is used in a system with multiple GPUs. For example, a dual-GPU system might have one GPU that consumes less power at the expense of rendering performance. Note that this property is only a hint and a WebGL implementation may choose to ignore it. WebGL implementations use context lost and restored events to regulate power and memory consumption, regardless of the value of this attribute.

#### Premultiplied alpha

If set to true, the color channels in the framebuffer will be stored premultipled by the alpha channel to improve performance.

#### Preserve drawing buffer

If set to false, the buffer will be cleared after rendering. If you wish to use canvas.toDataURL(), you will either need to draw to the canvas immediately before calling toDataURL(), or set preserveDrawingBuffer to true to keep the buffer available after the browser has displayed the buffer (at the cost of increased memory use).

#### Stencil

Stenciling enables and disables drawing on a per-pixel basis. It is typically used in multipass rendering to achieve special effects.

#### Desynchronized

If set to true, the context will have an 8 bit stencil buffer. Defaults to false. Use gl.enable(STENCIL_TEST) to enable depth test and gl.stencilFunc(), gl.stencilFuncSeparate(), gl.stencilMask(), gl.stencilMaskSeparate(), gl.stencilOp(), and gl.stencilOpSeparate() to configure the stencil test.

#### xrCompatible

xrCompatible is a boolean that indicates whether the context is compatible.

## Example Usage

A basic implementation could look something like this.

```jsx {10-21} showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
    webGLContextAttributes: {
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

  return <Unity unityProvider={unityProvider} />;
}
```
