# Adding Styles to the Canvas

Sets the style of the Unity Application's canvas.

## Type Definition

```tsx title="Type Definition"
<Unity styles={CSSProperties} />
```

## Implementation

Just like you're used to while working on your other Components and Elements, the style attribute accepts a JavaScript object with camelCased properties rather than a CSS string. This is consistent with the DOM style JavaScript property, is more efficient, and prevents XSS security holes.

:::info
Some examples in the documentation use style for convenience, but using the style attribute as the primary means of styling elements is generally not recommended by React. In most cases, className should be used to reference classes defined in an external CSS stylesheet or CSS in JS. Style is most often used in React applications to add dynamically-computed styles at render time.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll simply add some styles to the Canvas.

```jsx showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Unity unityProvider={unityProvider} style={{ height: 600, width: 800 }} />
  );
}
```
