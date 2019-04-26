<div align="center">

<img src="https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/.github/WIKI/logo.png" height="100px"></br>

[![license](https://img.shields.io/badge/license-Apache_2.0-red.svg)]()
[![npm](https://img.shields.io/npm/v/react-unity-webgl.svg)]()
[![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg)]()
[![npm](https://img.shields.io/badge/supported-typescript-2a507e.svg)]()
[![npm](https://img.shields.io/badge/supported-babel-yellow.svg)]()

When building content for the web, you might need to communicate with elements on a webpage. Or you might want to implement functionality using Web APIs which Unity does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy solution for embedding Unity WebGL builds in your React application, with two-way communication between your React and Unity application with advanced API's.

**&Lt;**
[**Documentation**](https://github.com/jeffreylanters/react-unity-webgl/wiki) &middot;
[**Test Environment**](https://github.com/jeffreylanters/react-unity-webgl-test) &middot;
[**My other Modules**](https://github.com/elraccoone) &middot;
[**Buy me a Coffee**](https://paypal.me/jeffreylanters)
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

# Development and test cycle

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application:

```sh
cd ../react-unity-webgl/
npm pack
cd ../yourapp
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

Do not use a symlink-based technique (e.g. with the "npm link" command) because [npm link breaks libraries that are based on React](https://dev.to/vcarl/testing-npm-packages-before-publishing-h7o).

This package here _must not_ have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.