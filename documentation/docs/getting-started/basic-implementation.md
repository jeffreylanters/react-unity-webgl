---
sidebar_position: 1
---

# Basic implementation

It's easy and quick to get your first React Unity project up-and-running. Just make sure you have your Unity WebGL build ready, and have your React project all set up. There are no specific React requirements, any project will do. If it's your first time working with React, I recommend checking out [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). All JavaScript and TypeScript compilers are compatible.

Get started by import the Unity and Unity Context from the module. The Unity Context Object will house all of your configuration, event listeners and references. Create a new Unity Context Object, pass along the paths to your Unity build and assign it to the Unity component in your Render Method. for more information about the Unity Context Object, check out [Understanding the Unity Context Object](/docs/getting-started/understanding-the-unity-context-object).

:::tip
Make sure to create your Unity Context object either somewhere outside of your component, or in a component did mount cycle to prevent it from being created multiple times thus losing a reference to the Unity Instance.
:::

A basic implementation should look something like this:

```jsx
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
