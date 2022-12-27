---
hide_table_of_contents: true
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<div style={{ maxWidth: 900, margin: "0 auto" }}>
<div style={{ textAlign: "center" }}>

<img src="/images/logo.svg#gh-light-mode-only" alt="drawing" width="200"/>
<img src="/images/logo-light.svg#gh-dark-mode-only" alt="drawing" width="200"/>

# React Unity WebGL

## Bringing your Unity Games to the Web since 2017!

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg?style=for-the-badge)](https://www.npmjs.com/package/react-unity-webgl)
[![build](https://img.shields.io/github/actions/workflow/status/jeffreylanters/react-unity-webgl/validate-module.yml?branch=main&style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/actions)
[![deployment](https://img.shields.io/github/deployments/jeffreylanters/react-unity-webgl/Node%20Package%20Registry?style=for-the-badge)](https://github.com/jeffreylanters/react-unity-webgl/deployments/activity_log?environment=Node+Package+Registry)
[![stars](https://img.shields.io/github/stars/jeffreylanters/react-unity-webgl.svg?style=for-the-badge&color=fe8523&label=stargazers)](https://github.com/jeffreylanters/react-unity-webgl/stargazers)
[![downloads](https://img.shields.io/npm/dt/react-unity-webgl.svg?style=for-the-badge&color=40AA72)](https://www.npmtrends.com/react-unity-webgl)
[![size](https://img.shields.io/bundlephobia/minzip/react-unity-webgl?style=for-the-badge&label=size)](https://bundlephobia.com/result?p=react-unity-webgl)
[![sponsors](https://img.shields.io/github/sponsors/jeffreylanters?color=E12C9A&style=for-the-badge)](https://github.com/sponsors/jeffreylanters)
[![support](https://img.shields.io/badge/support-donate-F23150?style=for-the-badge)](https://react-unity-webgl.dev/support)
[![discord](https://img.shields.io/discord/1047824448910270544?color=%236373F6&label=discord&style=for-the-badge)](https://discord.gg/fVPCqXCCGf)

When bringing your Unity Application to the web, you might need to communicate with Components on a webpage, build interactive interfaces or might want to implement functionality using Web APIs which Unity does not expose. Combining Unity with React is a great way to achieve these goals. React Unity WebGL provides a modern solution for embedding Unity WebGL builds in your React Application while providing advanced APIs for two way communication and interaction between Unity and React.

</div>

```sh
% npm install react-unity-webgl
```

<Tabs>
<TabItem value="Hello World" label="Hello World">

```jsx showLineNumbers title="A basic example showing how to embed a Unity WebGL build in your React Application."
import React from "react";
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

</TabItem>
<TabItem value="Loading State" label="Loading State">

```jsx showLineNumbers title="An example showing how to use the Unity Context to provide a loading state."
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Fragment>
      {!isLoaded && (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ visibility: isLoaded ? "visible" : "hidden" }}
      />
    </Fragment>
  );
}
```

</TabItem>
<TabItem value="Communication" label="Communication">

```jsx showLineNumbers title="An advanced example showing how to use the Unity Context to communicate between Unity and React."
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [userName, setUserName] = useState();
  const [score, setScore] = useState();

  const { unityProvider, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "build/myunityapp.loader.js",
      dataUrl: "build/myunityapp.data",
      frameworkUrl: "build/myunityapp.framework.js",
      codeUrl: "build/myunityapp.wasm",
    });

  const handleGameOver = useCallback((userName, score) => {
    setIsGameOver(true);
    setUserName(userName);
    setScore(score);
  }, []);

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    return () => {
      removeEventListener("GameOver", handleGameOver);
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  function handleClickSpawnEnemies() {
    sendMessage("GameController", "SpawnEnemies", 100);
  }

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} />
      <button onClick={handleClickSpawnEnemies}>Spawn Enemies</button>
      {isGameOver === true && (
        <p>{`Game Over ${userName}! You've scored ${score} points.`}</p>
      )}
    </Fragment>
  );
}
```

</TabItem>
</Tabs>

 </div>
