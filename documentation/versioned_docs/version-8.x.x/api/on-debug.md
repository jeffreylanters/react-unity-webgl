# Receiving Internal and Debug Log Messages

Both the Unity Loader and your Unity Application Instance can send debug messages. The Internal messages, as commonly sent by the Unity Loader mostly contain information about the instanciation process of your Unity Application. The messages send from your Unity Application mostly consist of Debug Log messages invoked by the source of your CSharp project or any of your used modules. By default none of these messages are written to the console.

```ts showLineNumbers
function on(eventName: "debug", eventListener: (message: string) => void): void;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll push all messages straight to the console.

```jsx showLineNumbers
import React, { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  useEffect(function () {
    unityContext.on("debug", function (message) {
      console.log(message);
    });
  }, []);

  return <Unity unityContext={unityContext} />;
}
```
