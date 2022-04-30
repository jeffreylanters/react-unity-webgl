---
sidebar_position: 1
---

# Hello World

It's easy and simple to get your first React Unity WebGL project up-and-running. Just make sure you have your Unity WebGL build ready, and have your React project all set up. If it's your first time working with React, I recommend checking out [Create React App](https://reactjs.org/docs/create-a-new-react-app.html).

Get started by importing the Unity Component and Unity Context hook from the module. A basic implementation of the Unity Context Hook only requires some basic configuration. While it is taking care of everything complicated such as communication, event listeners and references internally, all we're interested in is the Unity Provider spit out by the hook. We're going to pass down this object in order to render the configured Unity Application.

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
