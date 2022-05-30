import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Tab Index and Input Keyboard Capturing

Sets the tab index of the Unity Application's canvas.

> Available since version 8.0.1

## Type Definition

```tsx title="Type Definition"
<Unity tabIndex={number} />
```

## Implementation

By default, a Unity WebGL Application captures the keyboard as soon as it's loaded. This means that all keyboard input on your React Application is captured by the Unity Application instead. Doing so will result in a focus and blur on all keyboard events when clicking on, or around the Unity Application. Implementing the tab index of the element mitigates this issue and allows for other elements to be selected.

In order for this to work, Capture All Keyboard Input has to be set to false within your Unity Application. Preferably as soon as the Application is loaded. This property determines whether keyboard inputs are captured by WebGL. If this is enabled (default), all inputs will be received by the WebGL canvas regardless of focus, and other elements in the webpage will not receive keyboard inputs. You need to disable this property if you need inputs to be received by other html input elements.

```cs showLineNumbers title="Example: Disable Capture All Keyboard Input on load"
WebGLInput.captureAllKeyboardInput = false;
```

## Example Usage

A basic implementation could look something like this. In the following example we'll set the Unity Application's canvas's tab index to a specific value allowing other elements such as HTML Input Elements and HTML TextArea Elements to capture input too.

<Tabs>
<TabItem value="App.jsx" label="App.jsx">

```jsx showLineNumbers title="App.jsx"
import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/myunityapp.loader.js",
    dataUrl: "build/myunityapp.data",
    frameworkUrl: "build/myunityapp.framework.js",
    codeUrl: "build/myunityapp.wasm",
  });

  return (
    <Fragment>
      <Unity unityProvider={unityProvider} tabIndex={1} />
      <input type="text" tabIndex={2} />
    </Fragment>
  );
}
```

</TabItem>
<TabItem value="Example.cs" label="Example.cs">

```cs showLineNumbers title="Example.cs"
using UnityEngine;

public class Example : MonoBehaviour {
  void Awake () {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    WebGLInput.captureAllKeyboardInput = false;
#endif
  }
}
```

</TabItem>
</Tabs>
