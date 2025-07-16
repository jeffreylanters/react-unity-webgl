# Unloading the Unity Application

Requests the Unity Application to be unloaded from memory in order to be unmounted from the DOM.

:::warning
Since React Unity WebGL version 10, calling the unload function is no longer required to unmount the Unity Application. The Unity Application will automatically be unmounted when the component is removed from the DOM. However, if you want to unload the Unity Application manually, you can still use the unload function. But be aware that this is not necessary in most cases.
:::

## Type Definition

```tsx title="Type Definition"
function unload(): Promise<void> | undefined;
```

## Implementation

:::info
The unload function is only available in Unity Builds created with Unity 2020.1 or later.
:::

When building a multi-page React Application, it is important to unload the Unity Application in order to completely unmount the component from the DOM to free up the memory taken by the Unity JavaScript heap, and without Unity throwing an error. Invoking the function will request the Unity Application to be unloaded from memory. The function will return a Promise that will be resolved when the Unity Application has been unloaded.

To get started, destructure the unload function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the unload function"
const { unload } = useUnityContext();
```

Next you'll be able to invoke the awaitable unload function to unload the Unity Application.

```jsx showLineNumbers title="Example: Using the unload function"
async function handleClick() {
  await unload();
}

return <button onClick={handleClick}>Unload</button>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display a button which allows the user to navigate to another page, but before this happens, the Unity Application will be unloaded.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, unload } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  async function handleClickBack() {
    await unload();
    // Ready to navigate to another page.
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickBack}>Back</button>
    </Fragment>
  );
}
```
