# Contribution and Development

When contributing to this repository, please first discuss the change you wish to make via issue with the owners of this repository before making a change. Before commiting, please compile your code using npm run compile and open a pull request.

Before submitting a pull request, please make sure the following is done:

- Fork the repository and create your branch from master.
- Run npm install in the repository root.
- If you've fixed a bug or added code that should be tested, using the test environment.
- Ensure the test suite passes using npm test on the library.
- Ensure the test suite passes using npm start on the test environment and check if everything works.
- Format your code with prettier.
- Make sure your code lints (ts lint).
- Typecheck all of your changes and make sure JSDocs are provided.
- If you haven't already, complete the CLA.

## Development and test cycle

If you want to modify this package and iteratively test it in inside your application, use the following steps while you're inside the directory of your own application:

```sh
cd ../react-unity-webgl/
npm pack
cd ../yourapp
npm remove react-unity-webgl
npm install ../react-unity-webgl/react-unity-webgl-x.y.z.tgz
```

The "npm pack" command creates a .tgz file exactly the way it would if you were going to publish the package to npm. You can use that .tgz file to install it in your app. That way you can be sure that everything works exactly as it will do when you publish the package, later.

Do not use a symlink-based technique (e.g. with the "npm link" command) because npm link breaks libraries that are based on React.

This package here must not have a dependency on React, only a dev dependency on @types/react. Otherwise, the users of this package might install two different versions of React which will lead to problems.
