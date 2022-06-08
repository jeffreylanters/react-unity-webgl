# Application Meta Data

Sets the application meta data.

```tsx showLineNumbers
<IUnityConfig>{
  productName: string,
  productVersion: string,
  companyName: string,
};
```

#### Example implementation

A basic implementation could look something like this.

```jsx showLineNumbers
import React from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  productName: "My Game",
  productVersion: "1.0.0",
  companyName: "El Raccoone",
});

function App() {
  return <Unity unityContext={unityContext} />;
}
```
