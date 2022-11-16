# WebGL Browser Compatibility

Unity’s WebGL
support for desktop browsers differs depending on the browser. It supports browsers providing the following conditions are true:

- The browser is WebGL 1 or WebGL 2 capable. Note: Unity has marked WebGL 1 support for deprecation and will remove it in a future release.
- The browser is HTML 5 standards-compliant.
- The browser is 64-bit and supports WebAssembly.

Unity WebGL doesn’t support mobile devices. It might work on high-end devices, but current devices are often not powerful enough and don’t have enough memory to support Unity WebGL content. To make the end user aware of this, the default template for Unity WebGL displays a warning message when the end user attempts to load a Unity WebGL application on a mobile browser. To remove this warning from your application, add your own WebGL template. For information on how to do this, see Add a WebGL template.

## WebGL 1 deprecation

In version 2021.2, Unity marked support for the WebGL 1 Graphics API as deprecated. Currently, there are no changes in behavior and Unity still includes the WebGL 1 Graphics API if you enable the Auto Graphics API Player Setting. However, Unity will remove support for WebGL 1 In a future release.

:::info
For more information, visit the Unity Manual on [WebGL Browser Compatibility](https://docs.unity3d.com/Manual/webgl-browsercompatibility.html).
:::
