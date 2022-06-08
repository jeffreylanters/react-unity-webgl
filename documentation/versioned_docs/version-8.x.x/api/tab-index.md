# Tab Index and Input Keyboard Capturing

By default, Unity WebGL builds capture the keyboard as soon as it's loaded. This means that all keyboard input on your React Application is captured by the Unity Application instead. Doing so will result in a focus and blur on all keyboard events when clicking on, or around the Unity Application. Implementing the tabIndex of the element mitigates this issue and allows for other elements to be selected.

```tsx showLineNumbers
<Unity tabIndex={number} />
```

In order for this to work, Capture All Keyboard Input has to be set to false within your Unity Application. Preferably as soon as the Application is loaded. This property determines whether keyboard inputs are captured by WebGL. If this is enabled (default), all inputs will be received by the WebGL canvas regardless of focus, and other elements in the webpage will not receive keyboard inputs. You need to disable this property if you need inputs to be received by other html input elements.

```csharp showLineNumbers
WebGLInput.captureAllKeyboardInput = false;
```

#### Example implementation

A basic implementation could look something like this. In the following example we'll set the canvas's tab index to a specific value allowing other elements such as HTML Input Elements and HTML TextArea Elements to capture input too.

```jsx showLineNumbers
import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
});

function App() {
  return <Unity unityContext={unityContext} tabIndex={1} />;
}
```

```csharp showLineNumbers
using UnityEngine;

public class GameController : MonoBehaviour {
  private void Start () {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    WebGLInput.captureAllKeyboardInput = false;
#endif
  }
}
```
