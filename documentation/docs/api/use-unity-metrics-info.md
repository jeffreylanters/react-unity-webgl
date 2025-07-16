# Using Metrics Info

The `useUnityMetricsInfo` hook is a part of the `react-unity-webgl` library that allows you to access metrics information from your Unity application. This can be particularly useful for monitoring performance and resource usage in your Unity WebGL builds.

## Type Definition

```tsx title="Type Definition"
function useUnityMetricsInfo(
  getMetricsInfo: () => UnityMetricsInfo | undefined,
  metricsConfig: MetricsConfig
): UnityMetricsInfo;
```

## Implementation

:::info
The getMetricsInfo function is only available in Unity Builds created with Unity 6000.1 or later.
:::

Web builds can get quite large, and it can be useful to know how much memory is being used by the Unity Application. The `getMetricsInfo` function provides a way to retrieve this information. It returns an object containing various metrics, such as memory usage, frame rate, and more.

The `useUnityMetricsInfo` hook is a custom React hook that allows you to easily access the metrics information from your Unity application. It takes the `getMetricsInfo` function as an argument and returns the metrics data.

To get started, destructure the getMetricsInfo function from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the unload function"
const { getMetricsInfo } = useUnityContext();
```

Next you'll create a new hook that uses the `getMetricsInfo` function to retrieve the metrics information. This hook can be used to access the metrics data throughout your application.

```tsx showLineNumbers title="Example: Using the useUnityMetricsInfo hook"
const metricsInfo = useUnityMetricsInfo(getMetricsInfo);
```

:::tip
You can provide additional configuration options through the `metricsConfig` parameter, such as setting the interval for metrics updates.
:::

Finally, you can use the `metricsInfo` object to access the metrics data. This object will contain properties such as `fps`, `pageLoadTime`, and others, depending on what metrics are available in your Unity build.

```tsx showLineNumbers title="Example: Accessing metrics data"
<p>FPS: {metricsInfo.fps}</p>
```

## Example Usage

A basic implementation could look something like this. In the following example we'll display the FPS (frames per second) of the Unity application.

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext, useUnityMetricsInfo } from "react-unity-webgl";

function App() {
  const { unityProvider, getMetricsInfo } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  const { fps } = useUnityMetricsInfo(getMetricsInfo, {
    interval: 1000 / 60,
  });

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <p>FPS: {fps}</p>
    </Fragment>
  );
}
```
