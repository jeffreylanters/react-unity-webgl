---
sidebar_position: 1
---

# Is Loaded

> Available since version 9.0.0

## Type Definition

```tsx title="Type Definition"
isLoaded: boolean = false;
```

## Usage

While your Unity Application is being downloaded from the server and loaded into memory and the loading progression's stateful value is being updated to reflect the progression, you might want to hide your loading screen or display some sort of user interface when the Unity Application has finished loading and is started.

The Unity Context's is loaded value can be used for such cases. This stateful value will updates based on whether the Unity Application has finished loading and is started.

To get started, destructure the is loaded value from the Unity Context.

```jsx title="Example: Destructuring the is loaded value"
const { isLoaded } = useUnityContext();
```

Next you'll be able to use the is loaded value to display a loading indicator.

```jsx title="Example: Using the is loaded value"
if (isLoaded === false) {
  return <p>Loading...</p>;
}
return <p>Application Loaded!</p>;
```

:::tip
Display some kind of overlay over your Unity Application while it's loading to prevent the user from interacting with the Unity Application before it's completely ready. And use the [loading progression stateful value](/docs/advanced-guides/unity-application-state/loading-progression) to display a loading bar.
:::

## Example

A basic implementation could look something like this. In the following example we'll hide the Unity Application while it's being loaded to prevent the user from interacting with the Unity Application before it's completely ready.

```jsx title="Example: Hiding the Unity Application while it's loading"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Unity
      style={{ visibility: isLoaded ? "visible" : "hidden" }}
      unityProvider={unityProvider}
    />
  );
}
```
