import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Loading Overlay

In the following example, we'll be rendering a Unity Application in our React Application. The Unity Application will render within a container, this allows us to overlay the containing with a loading overlay. This overlay will be visible while the Unity Application is loading.

<Tabs>
<TabItem value="App.jsx" label="App.jsx">

```jsx showLineNumbers title="App.jsx"
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  // We'll round the loading progression to a whole number to represent the
  // percentage of the Unity Application that has loaded.
  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <div className="container">
      {isLoaded === false && (
        // We'll conditionally render the loading overlay if the Unity
        // Application is not loaded.
        <div className="loading-overlay">
          <p>Loading... ({loadingPercentage}%)</p>
        </div>
      )}
      <Unity className="unity" unityProvider={unityProvider} />
    </div>
  );
}
```

</TabItem>
<TabItem value="App.css" label="App.css">

```css showLineNumbers title="App.css"
.container {
  position: relative;
  /* The container determains the size. */
  width: 800px;
  height: 600px;
}

.container > .loading-overlay {
  /* We'll render the overlay on top of the Unity Application. */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: grey;
  /* We'll set the following Flex properties in order to center the text. */
  display: flex;
  justify-content: center;
  align-items: center;
}

.container > .unity {
  /* The Unity Application matches it size to the container. */
  width: 100%;
  height: 100%;
}
```

</TabItem>
</Tabs>
