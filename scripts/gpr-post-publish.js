const fileSystem = require("fs");
const pathUtility = require("path");
const packageFilePath = pathUtility.join(__dirname, "../package.json");
let packageJson = String(fileSystem.readFileSync(packageFilePath));
const package = JSON.parse(packageJson);
package.name = "@jeffreylanters/" + package.name;
packageJson = JSON.stringify(package);
fileSystem.writeFileSync(packageFilePath, packageJson);
