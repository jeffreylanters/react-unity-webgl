# Getting Metrics Info

The `getMetricsInfo` function is used to retrieve information about the Unity Application's metrics, such as memory usage and frame rate. This can be useful for debugging and performance analysis.

:::tip
Use the built-in [Unity Metrics Info hook](/docs/api/use-unity-metrics-info) for a more convenient way to access metrics information in your React components.
:::

## Type Definition

```tsx title="Type Definition"
function getMetricsInfo(): UnityMetricsInfo | undefined;
```

## Implementation

:::info
The getMetricsInfo function is only available in Unity Builds created with Unity 6000.1 or later.
:::

Web builds can get quite large, and it can be useful to know how much memory is being used by the Unity Application. The `getMetricsInfo` function provides a way to retrieve this information. It returns an object containing various metrics, such as memory usage, frame rate, and more.

To get started, destructure the getMetricsInfo function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the unload function"
const { getMetricsInfo } = useUnityContext();
```

Next you'll be able to invoke the `getMetricsInfo` function to retrieve the metrics information. The function returns an object of type `UnityMetricsInfo`, which contains various properties related to the Unity Application's performance.

```jsx showLineNumbers title="Example: Using the get metrics info function"
async function handleClick() {
  const metricsInfo = getMetricsInfo();
}

return <button onClick={handleClick}>Check metrics</button>;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display a button which allows us to check the current frames per second (FPS) of the Unity Application. When the button is clicked, it will log the FPS to the console.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, getMetricsInfo } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  function handleClickCheckFps() {
    const metricsInfo = getMetricsInfo();
    if (metricsInfo) {
      console.log("FPS:", metricsInfo.fps);
    } else {
      console.warn("Metrics info is not available.");
    }
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickCheckFps}>Check FPS</button>
    </Fragment>
  );
}
```
