# Unloading the Unity Application

Requests the Unity Application to be unloaded from memory in order to be unmounted from the DOM.

## Type Definition

```tsx title="Type Definition"
function unload(): Promise<void> | undefined;
```

## Implementation

:::info
The unload function is only available in Unity Builds created with Unity 2020.1 or later.
:::

:::danger
In earlier versions of Unity, it was possible to unmount the Unity Application and its containing component immediately after invoking the unload function. However, due to a bug in newer Unity versions, this is no longer feasible when using builds made with Unity 2021.2 or later. While it is still possible to unload the Unity Application, the canvas must remain mounted until the associated promise is resolved.

As of this writing, the issue has not been resolved. However, it is possible to manually unmount the Unity Application by halting navigation to the next page. A ticket has been submitted, and the Unity team has acknowledged this as a known issue. For more details, refer to the [GitHub issue](https://github.com/jeffreylanters/react-unity-webgl/issues/250).

Alternatively, you can use the unsafe `detachAndUnloadImmediate` function to immediately unmount the Unity Application. However, this is not recommended unless you are an advanced user. For more information, refer to the [Unsafe Detach and Unload Immediate](/docs/9.x.x/api/unsafe-detach-unmount-immediate) documentation.
:::

When building a multi-page React Application, it is important to unload the Unity Application in order to completely unmount the component from the DOM to free up the memory taken by the Unity JavaScript heap, and without Unity throwing an error. Invoking the function will request the Unity Application to be unloaded from memory. The function will return a Promise that will be resolved when the Unity Application has been unloaded.

To get started, destructure the unload function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the unload function"
const { unload } = useUnityContext();
```

Next you'll be able to invoke the awaitable unload function to unload the Unity Application.

```jsx showLineNumbers title="Example: Using the take screenshot function"
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
