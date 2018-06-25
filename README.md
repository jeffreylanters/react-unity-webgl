# React Unity WebGL &middot; [![license](https://img.shields.io/badge/license-MIT-red.svg)]() [![npm](https://img.shields.io/npm/v/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/build-passing-brightgreen.svg)]() [![npm](https://img.shields.io/npm/dt/react-unity-webgl.svg)]() [![npm](https://img.shields.io/badge/typescript-supported-2a507e.svg)]()

When building content for the web, you might need to communicate with other elements on React Application. Or you might want to implement functionality using Web APIs which [Unity](https://unity3d.com) does not currently expose by default. In both cases, you need to directly interface with the browser’s JavaScript engine. React Unity WebGL provides an easy library for Unity 5.6^, 2017 and 2018 with different methods to do this.

<img src="https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/logo.png" width="300px"><br />

👀 [Example GIF](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/master/resources/readme/demo-video.gif)<br/>
🚀 [Test environment](https://github.com/jeffreylanters/react-unity-webgl-test)

- [Installation](#installation)
- [Usage](#usage)
- [Optional attributes](#optional-attributes)
  - [Width and height](#width-and-height)
  - [Tracking progression](#tracking-progression)
  - [Modules](#modules)
  - [Fullscreen](#fullscreen)
- [Calling Unity scripts functions from JavaScript in React](#calling-unity-scripts-functions-from-javascript-in-react)
- [Calling JavaScript functions within React from Unity scripts](#calling-javascript-functions-within-react-from-unity-scripts)
- [Notes](#notes)
  - [Best practices for adding the src and loader files on a public path](#best-practices-for-adding-the-src-and-loader-files-on-a-public-path)
  - [5.x to 6.x Upgrade note](#5x-to-6x-upgrade-note)
  - [JavaScript to UnityScript types](#havaScript-to-unityScript-types)
- [Contributing](#contributing)

<br/><br/><br/>

# Installation

Install using npm. Make sure you download the release matching with your Unity version. I try to update this plugin in case of need as fast as possible. Check the [releases on GitHub](https://github.com/jeffreylanters/react-unity-webgl/releases) for the corresponding version or [view on NPM](https://www.npmjs.com/package/react-unity-webgl).

```sh
$ npm install react-unity-webgl
```

<br/><br/><br/>

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

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue with the owners of this repository before making a change. Before commiting, please compile your code using `npm run compile` and open a pull request. Thank you very much!
