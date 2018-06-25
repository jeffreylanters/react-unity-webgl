# React Unity WebGL &middot; [![license](https://img.shields.io/badge/license-MIT-red.svg)]() [![npm](https://img.shields.io/npm/v/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)]() [![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/typescript-supported-2a507e.svg)]()

When building content for the web, you might need to communicate with other elements on React Application. Or you might want to implement functionality using Web APIs which [Unity](https://unity3d.com) does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy library for Unity 5.6^, 2017 and 2018 with different methods to do this.

<img src="https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/logo.png" width="300px"><br />

👀 [Example GIF](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/demo-video.gif)<br/>
🚀 [Test environment](https://github.com/jeffreylanters/react-unity-webgl-test)<br/>
📖 [Documentation](https://github.com/jeffreylanters/react-unity-webgl/wiki)

# Installation

Install using npm. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. Check the [releases on GitHub](https://github.com/jeffreylanters/react-unity-webgl/releases) for the corresponding version or [view on NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl
```

# Usage

To get started import the default Unity class from react-unity-webgl and include it in your render while giving the public path to your src and loader files. [Best practices for adding the src and loader files on a public path](#best-practices-for-adding-the-src-and-loader-files-on-a-public-path).

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
