# Setting the Canvas's ClassName

> Available since version 6.0.1

You can add an optional class name to the Unity component. The class name attribute specifies one or more class names for the HTML Canvas Element. The class attribute is mostly used to point to a class in a style sheet. However, it can also be used by a JavaScript (via the HTML DOM) to make changes to HTML elements with a specified class.

```tsx
<Unity className={string} />
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's class name to a spefic value.

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
  return <Unity unityContext={unityContext} className={"game-canvas"} />;
}
```
