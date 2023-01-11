# Installation

Get started by installing React Unity WebGL using the Node Package Manager or Yarn in your JavaScript or TypeScript React project. If you don't have a React project yet, I recommend using [Creat React App](https://reactjs.org/docs/create-a-new-react-app.html) to get you started right away.

:::tip
Before installing the module, make sure you're installing a version which is compatible with your build's Unity version. When a new Unity version releases, I'll update the module as soon as possible in order to keep the compatibility. If you are running into any issues, please open an issue on the [React Unity WebGL Github page](https://github.com/jeffreylanters/react-unity-webgl/issues).
:::

```sh
% npm install react-unity-webgl
```

## Requirements

- [React](https://reactjs.org) version >= 16.8.0 or above
- [Unity](https://unity.com) version >= 2020.1.0 or above
  - If you are using an older version of Unity which does not support Web Assemly, using a module version prior to version 9 is required. To find out more, read the [Compatibility](#compatibility) section below.

## Unity Version Compatibility

The web and Unity are evolving fast, to keep up with these changes the React Unity WebGL module has to adapt too while also keeping the module fast, lightweight and compatible. Starting at version 9 of the module, support for builds made with Unity versions prior to 2020 are no longer supported. If you're using an older version of Unity, or you'll have to maintain a project built with an older version of the module, you can use one of the legacy versions of React Unity WebGL. It however is recommended to update your project to a newer version of Unity in order to use all the latest features of React Unity WebGL.

Select another version tag in the top right corner of this website to view the documentation and API reference of older versions of React Unity WebGL.
