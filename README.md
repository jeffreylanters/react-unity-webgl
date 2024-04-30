<div align="center">

![readme splash](https://raw.githubusercontent.com/jeffreylanters/react-unity-webgl/main/.github/WIKI/repository-readme-splash-osawards.png)

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

[**Documentation**](https://react-unity-webgl.dev/) &middot;
[**Template Repository**](https://github.com/jeffreylanters/react-unity-webgl-template/) &middot;
[**Support the project**](https://react-unity-webgl.dev/support) &middot;
[**Discussion Board**](https://github.com/jeffreylanters/react-unity-webgl/discussions)

**Made with &hearts; by Jeffrey Lanters**

</div>

When bringing your Unity Application to the web, you might need to communicate with Components on a webpage, build interactive interfaces or might want to implement functionality using Web APIs which Unity does not expose. Combining Unity with React is a great way to achieve these goals. React Unity WebGL provides a modern solution for embedding Unity WebGL builds in your React Application while providing advanced APIs for two way communication and interaction between Unity and React.

### A quick word

Hi there! I would like to say one more thing before you start bringing your awesome games to the web. My name is Jeffrey Lanters, I'm a Unity and Web developer with a passion for Open Source. The project you're looking at right now is one of my hobby projects. Maintaining and building this project is something **I do in my spare time**, and I have been doing so since 2017. React-Unity-WebGL will **always remain free**, but adding new features, maintaining it and keeping up-to-date with Unity's updates takes a lot of work and time. If you are able to, I would appreciate it greatly if you would consider [sending a donation or becoming a sponsor](https://react-unity-webgl.dev/support) to help me keep this project going.

Thanks for your time, happy coding!

# Installation

Get started by installing React Unity WebGL using the Node Package Manager or Yarn in your JavaScript or TypeScript React project. If you don't have a React project yet, I recommend using [Vite React template](https://vitejs.dev/guide/) to get you started right away. Visit the [installation documentation](https://react-unity-webgl.dev/docs/getting-started/installation) for more information.

Before installing the module, make sure you're installing a version which is compatible with your build's Unity version. When a new Unity version releases, I'll update the module as soon as possible in order to keep the compatibility up to date. If you are running into any issues, please consider [opening an issue](https://github.com/jeffreylanters/react-unity-webgl/issues/new/choose).

```sh
% npm install react-unity-webgl
```

### Unity Version Compatibility

The web and Unity are evolving fast, to keep up with these changed the React Unity WebGL module has to adapt too while also keeping the module fast, lightweight and compatible. Starting at version 9 of the module, support for builds made with Unity versions prior to 2020 are no longer supported. If you're using an older version of Unity, or you'll have to maintain a project built with an older version of the module, you can use one of the legacy versions of React Unity WebGL. It however is recommended to update your project to a newer version of Unity in order to use all the latest features of React Unity WebGL.

Visit [on the official website](https://react-unity-webgl.dev) for more information and the documentation and API reference of older versions of React Unity WebGL.

# Documentation

Learn everything you'll need to know about React Unity WebGL [on the official website](https://react-unity-webgl.dev).

- [The docs](https://react-unity-webgl.dev/docs/introduction) will teach you all of the basics and concepts of React Unity WebGL.
- Dive straight into the [API reference](https://react-unity-webgl.dev/docs/api/introduction) to learn everything the module has to offer.
- When using an older version of Unity, you might want to check any of the [legacy docs](https://react-unity-webgl.dev/docs/8.x.x/introduction/).
- Looking to share and showcase what you've built? Check out the [made with](https://react-unity-webgl.dev/made-with) page!
- Feel free to join the [React Unity WebGL Community Discord](https://discord.gg/fVPCqXCCGf) to ask questions, contribute to the project, share your work or just hang out!

The source code of both the website and the module are contained within this mono-repo. Feel free to open a [pull request](https://github.com/jeffreylanters/react-unity-webgl/pulls) to improve or add features to the any of these. Looking for a new feature, but not sure where to start? Feel free to spin up a new [discussion](https://github.com/jeffreylanters/react-unity-webgl/discussions).

# Getting Started

The documentation consists of several examples, for both starting as well as more advanced users. You can find these in the [quick start](https://react-unity-webgl.dev/docs/quick-start/simple-example) and [advanced examples](https://react-unity-webgl.dev/docs/advanced-examples/loading-overlay) sections. To get you started, the most basic implementation should look something like this:

```jsx
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

Simply rendering your Unity Application within your React Application is just the beginning! The Unity Context exposes a lot more fun functions and properties to play around with such as two way communication or requesting fullscreen or a pointerlock. The possibilities are endless, what's next is up to you!

> Note that all of the URLs which can be provided to the Unity Config, including the ones mentioned above, are due to their enormous size not included into your bundle. You should place these files in a public directory within your project or use a CDN. This means the files behind these URLs are loaded during runtime and should be accessible by the browser via a public URL. To learn more about the Unity Config, head over to the [Unity Config documentation](https://react-unity-webgl.dev/docs/main-concepts/unity-config).

# Contributing

You're looking into contributing? Awesome! When wanting to contribute to either the module, or the documentation, this mono-repository has everything all you'll need to get you started. It is recommended to discuss the change you wish to make first via the [discussion board](https://github.com/jeffreylanters/react-unity-webgl/discussions) before submitting a pull request.

For more information about contribution and the development and test-cycle, please head over to the [documentation on the official website](https://react-unity-webgl.dev/docs/contributing).

Happy coding!
