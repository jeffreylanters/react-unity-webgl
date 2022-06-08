# Adding Styles to the Canvas Element

> Available since version 8.2.0

The style tag allows for adding inline CSS for styling the component. The style's properties will be assigned directly onto the actual canvas.

The style attribute accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes. React will automatically append a “px” suffix to certain numeric inline style properties. If you want to use units other than “px”, specify the value as a string with the desired unit.

```tsx
<Unity style={CSSProperties} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's width to 100%, and the height to a fixed 950px.

```jsx
// File: App.jsx

import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  return (
    <Unity
      unityContext={unityContext}
      style={{
        height: "100%",
        width: 950,
        border: "2px solid black",
        background: "grey",
      }}
    />
  );
}
```
