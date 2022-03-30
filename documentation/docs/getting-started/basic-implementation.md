---
sidebar_position: 1
---

# Basic implementation

It's easy and simple to get your first React Unity project up-and-running. Just make sure you have your Unity WebGL build ready, and have your React project all set up. There are no specific React requirements, any project will do. If it's your first time working with React, I recommend checking out [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). All JavaScript and TypeScript compilers are compatible.

Get started by importing the Unity Component and Unity Context hook from the module. The Unity Context Hook only requires some configuration while internally taking care of everything complicated such as communication, event listeners and references. Invoke the Unity Context hook with the configuration you want to use. The hook will spit out a Unity Provider object which you can pass down to the Unity Component.

A basic implementation should look something like this:

```jsx
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return <Unity unityProvider={unityProvider} />;
}
```
