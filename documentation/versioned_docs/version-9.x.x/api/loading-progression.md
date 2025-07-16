# Tracking the Loading Progression

Represents the percentual loading progression of the Unity Application.

## Type Definition

```tsx title="Type Definition"
const loadingProgression: number = 0;
```

## Implementation

While your Unity Application is being downloaded from the server and loaded into memory, you might want to display some sort of loading indicator informing the user of the progression. The Unity Context's loading progression value can be used for such cases. This stateful value will update while the Unity Application is being loaded. Its value will be between 0 and 1, where 0 means the Unity Application has not started loading and 1 means the Unity Application has finished loading.

To get started, destructure the loading progression value from the Unity Context.

```jsx showLineNumbers title="Example: Destructuring the loading progression value"
const { loadingProgression } = useUnityContext();
```

Next you'll be able to use the loading progression value to display a loading indicator.

```jsx showLineNumbers title="Example: Using the loading progression value"
<p>Loading {loadingProgression}...</p>
```

You're not limited by just showing the percentage of the loading progression, you can for example also use it's value to display a loading bar. The posibilities are endless!

```jsx showLineNumbers title="Example: Using the loading progression value"
<div style={{ width: `${loadingProgression * 100}%` }} />
```

:::tip
If you want to do something based on when the Unity Application has finished loading, you can use the [is loaded stateful value](/docs/9.x.x/api/is-loaded) rather than checking whether the loading progression's value is 1.
:::

## Example Usage

A basic implementation could look something like this. In the following example we'll track the loading progression and display a text which shows the loading progression as a percentage.

```jsx showLineNumbers title="App.jsx"
import React from "react";
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
