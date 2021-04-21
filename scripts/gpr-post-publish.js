/**
 * Since this package has been published already on NPM before the GPR was
 * available, the package's json file will be altered before publishing to it.
 */
const fileSystem = require("fs");
const pathUtility = require("path");
const packageFilePath = pathUtility.join(__dirname, "../package.json");
let packageJson = String(fileSystem.readFileSync(packageFilePath));
const package = JSON.parse(packageJson);
package.name = "@jeffreylanters/" + package.name;
package.publishConfig = {
  registry: "https://npm.pkg.github.com/jeffreylanters",
};
packageJson = JSON.stringify(package);
fileSystem.writeFileSync(packageFilePath, packageJson);
