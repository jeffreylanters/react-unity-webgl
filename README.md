<div align="center">

<img src="https://raw.githubusercontent.com/elraccoone/react-unity-webgl/master/.github/WIKI/logo.png" height="200px"></br>

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg)]()
[![npm](https://img.shields.io/badge/supported-typescript-2a507e.svg)]()
[![npm](https://img.shields.io/badge/supported-babel-yellow.svg)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**This package is an open source hobby project with ongoing development. A result of a long road since 2017, full of sleepless nights, working after hours, and busy weekends. If you're using this module for production, please consider [donating](https://paypal.me/jeffreylanters) to support the project. Thank you!** 🥳

**&Lt;**
[**Documentation**](https://github.com/jeffreylanters/react-unity-webgl/wiki) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test) &middot;
[**My other Modules**](https://github.com/elraccoone)
**&Gt;**

Made with &hearts; by Jeffrey Lanters

</div></br></br>

# Installation

Install using npm. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. Check the [releases on GitHub](https://github.com/jeffreylanters/react-unity-webgl/releases) for the corresponding version or [view on NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl
```

# Usage

To get started import the Unity and Unity Content class from the React Unity WebGL library. Create a new content object and assign it in your render function. For further intructions please head to the [documentation](https://github.com/jeffreylanters/react-unity-webgl/wiki), follow the [quick start guide](https://github.com/jeffreylanters/react-unity-webgl/wiki/Quick-Start-Guide) or open an [issue](https://github.com/jeffreylanters/react-unity-webgl/issues) on this repository.

```jsx
import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      "MyGame/Build.json",
      "MyGame/UnityLoader.js"
    );
  }

  render() {
    return <Unity unityContent={this.unityContent} />;
  }
}
```
