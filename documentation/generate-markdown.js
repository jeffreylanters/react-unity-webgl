/**
 * Utility script to build the GitHub pages for the project. The GitHub pages
 * are build based on the readme.md file, which should be published to the
 * GitHub pages.
 */
const FileSystem = require("fs");
const Path = require("path");

(async function build() {
  let sidebarContent = "";
  const rootPath = Path.join(__dirname, "..");
  const outputPath = Path.join(rootPath, "documentation");
  // Read the readme.md file.
  const readmePath = Path.join(rootPath, "README.md");
  let readmeContent = await FileSystem.promises.readFile(readmePath, "utf8");
  // Replace hashtag links with file links.
  readmeContent = readmeContent.replace(
    // Match the markdown links.
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    function replacer(match, text, link) {
      // If the link is a hashtag link.
      if (link.startsWith("#") === true) {
        link = link.substring(1);
        // Replace the link with the file link.
        return `[${text}](${link}.md)`;
      }
      // Otherwise, return the original match.
      return match;
    }
  );
  // Break the readme into sections splitted by headers.
  const sectionsContent = readmeContent
    // TODO -- Replace this with a split by regex
    .split("\n# ")
    .join("~SECTION~# ")
    .split("\n## ")
    .join("~SECTION~## ")
    .split("~SECTION~")
    .map(function callback(section, index) {
      return section.trim();
    });
  // Convert all sections into markdown files.
  for (const content of sectionsContent) {
    try {
      // Extract the section name and generate the filename.
      let header = content.split("\n")[0].trim();
      let title = header.replace(/#/g, "").trim();
      let fileName = title.toLowerCase().replace(/\s/g, "-");
      if (header.startsWith("#") === false) {
        header = "# Home";
        title = "Home";
        fileName = "README";
      }
      const level = header.split("#").length - 1;
      // Write the file
      const filePath = Path.join(outputPath, fileName + ".md");
      const path = Path.dirname(filePath);
      await FileSystem.promises.mkdir(path, { recursive: true });
      await FileSystem.promises.writeFile(filePath, content);
      // Populate the sidebar.
      for (let i = 1; i < level; i++) {
        sidebarContent += "  ";
      }
      sidebarContent += `* [${title}](${fileName}.md)\n`;
    } catch (error) {
      console.warn(error);
    }
  }
  // Write the sidebar.
  const sidebarPath = Path.join(rootPath, "documentation", "_sidebar.md");
  await FileSystem.promises.writeFile(sidebarPath, sidebarContent);
})();
