# Contributing

You're looking into contributing? Awesome! When contributing to this mono-repository, please first discuss the change you wish to make via the [discussion board](https://github.com/jeffreylanters/react-unity-webgl/discussions) with me before making a change. Before submitting a pull request, please make sure the following is done:

- Create a public fork the React Unity WebGL mono-repository and commit your changes to a new branch which is based from the original repository's main branch.
- Make sure both the module as well as the documentation installs using `npm install`, your code lints using `ts lint`, is formatted using [prettier](https://github.com/prettier/prettier) and compiles using `npm run build`.
- Typecheck all of your changes and make sure the documentation in both the source code as well as the official website is up to date and reflects the changes you've made.
- Make sure your changes passes and are compatibly with Unity WebGL builds using the [testing suite](https://github.com/jeffreylanters/react-unity-webgl/tree/main/testing).

## Development and Test-Cycle

> When building this module, do not use a symlink-based technique (e.g. with the "npm link" command) [because npm link breaks libraries that are based on React](https://dev.to/vcarl/testing-npm-packages-before-publishing-h7o).

> When installing, make sure the module does not install React due to it being listed in the peer dependencies. This module must not have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this module might install two different versions of React which will lead to problems.

If you want to modify the module and iteratively test it in inside your React Application, use one the following techniques while you're inside the directory of the testing suite.

The `npm pack` command creates a .tgz file exactly the way it would if you were going to publish the module to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the module, later.

It is also possible to install the module locally using a relative path rather than using a package name. This can be very useful if you want to test the module in your own React Application while being able to keep using live editing features such as hot module reloading and fast refreshing.

## Documentation Contribution

English is my second language and I suffer from dyslexia. I try to document everything as clearly and correctly as possible. Contributions to spelling and grammar errors are more than welcome and much appreciated.

Thanks for your contribution!

Happy coding!
