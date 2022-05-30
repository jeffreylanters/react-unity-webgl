# Setting the Canvas Class Name

Sets the class name of the Unity Application's canvas.

> Available since version 6.0.1

## Type Definition

```tsx title="Type Definition"
<Unity className={string} />
```

## Implementation

Just like you're used to while working on your other Components and Elements, you can add an optional class name to the Unity component. The class name attribute specifies one or more class names for the Unity Application's Canvas. The class name attribute is mostly used to point to a class in a style sheet.

There are many ways to suplement your React Application with available classnames. The most common ways are by providing an external CSS or importing your stylesheet using a CSS module. It's also possible to use CSS-in-JS, this refers to a pattern where CSS is composed using JavaScript instead of defined in external files. Note that this functionality is not a part of React, but provided by third-party libraries.

:::info
Some examples in the documentation use style for convenience, but using the style attribute as the primary means of styling elements is generally not recommended by React. In most cases, className should be used to reference classes defined in an external CSS stylesheet or CSS in JS. Style is most often used in React applications to add dynamically-computed styles at render time.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll simply add a classname to the Canvas.

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

  return <Unity unityProvider={unityProvider} className="my-unity-app" />;
}
```
