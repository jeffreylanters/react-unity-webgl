# Contribution and Development

When contributing to this repository, please first discuss the change you wish to make via the discussion board with me before making a change. Before commiting, please compile your code using npm run compile and open a pull request.

Before submitting a pull request, please make sure the following is done:

- Create a public fork [the React Unity WebGL repository](https://github.com/jeffreylanters/react-unity-webgl) and and commit your changes to a new branch from the main branch.
- Make sure the package installs using `npm install`, your code lints using `ts lint`, is formatted using [prettier](https://github.com/prettier/prettier) and compiles using `npm test`.
- Typecheck all of your changes and make sure the documentation in both the code, Read Me and JSDocs are provided.
- Make sure your changes passes and are compatibly with Unity WebGL builds using the [test environment](https://github.com/jeffreylanters/react-unity-webgl-tests) which provides a series of tests and basic implementations.

#### Development and Test-Cycle

> When building this package, do not use a symlink-based technique (e.g. with the "npm link" command) because [npm link breaks libraries that are based on React](https://dev.to/vcarl/testing-npm-packages-before-publishing-h7o).

> This package _must not_ have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application.

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

```sh
cd ../react-unity-webgl/
npm pack
cd ../your-app
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```
