---
sidebar_position: 0
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Loading Progression

> Available since version 9.0.0

While your Unity Application is being downloaded from the server and loaded into memory, you might want to display some sort of loading indicator informing the user of the progression. The Unity Context's loading progression value can be used for such cases. This statefull value will update while the Unity Application is being loaded. Its value will be between 0 and 1, where 0 means the Unity Application has not started loading and 1 means the Unity Application has finished loading.

To get started, destructure the loading progression value from the Unity Context.

```jsx
const { loadingProgression } = useUnityContext();
```

Next you'll be able to use the loading progression value to display a loading indicator.

```jsx
<p>Loading {loadingProgression}...</p>
```

You're not limited by just showing the percentage of the loading progression, you can for example also use it's value to display a loading bar. The posibilities are endless!

```jsx
<div style={{ width: `${loadingProgression * 100}%` }} />
```

:::tip
If you want to do something based on when the Unity Application has finished loading, you can use the [is loaded stateful value](/main-concepts/is-loaded) rather than checking whether the loading progression's value is 1.
:::

## Complete Example

A basic implementation could look something like this. In the following example we'll track the loading progression and display a text which shows the loading progression as a percentage.

```jsx
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, loadingProgression } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Fragment>
      <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      <Unity unityProvider={unityProvider} />
    </Fragment>
  );
}
```
