# Getting the Canvas Reference

The ref provides a way to access the Unity Application's Canvas element created in the render method.

:::warning
Even though it is possible to access the Canvas element directly using the ref, it is not recommended to do so. Try to use the built-in Unity Context API functions instead. If something is not working properly, or you're missing functionality, please consider opening an [issue](https://github.com/jeffreylanters/react-unity-webgl/issues), [discussion](https://github.com/jeffreylanters/react-unity-webgl/discussions) or a [pull request](https://github.com/jeffreylanters/react-unity-webgl/pulls).
:::

## Type Definition

```tsx title="Type Definition"
<Unity ref={RefAttributes<HTMLCanvasElement>} />
```

## Implementation

The reference of the Unity Application's Canvas element is provided as a prop using a forwarded ref. To access the Canvas element, simply create a ref and pass it to the Unity component.

```jsx showLineNumbers title="Example: Using a ref hook to store the reference"
const canvasRef = useRef(null);
```

```jsx showLineNumbers title="Example: Store the reference in the hook"
<Unity ref={canvasRef} />
```

## Example Usage

A basic implementation could look something like this. In the following example we'll use a ref hook to store the reference to the Unity Application's Canvas element. We'll then add a button which will focus the canvas when clicked.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  const canvasRef = useRef(null);

  function focusCanvas() {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} ref={canvasRef} />
      <button onClick={focusCanvas}>Focus Canvas</button>
    </Fragment>
  );
}
```
