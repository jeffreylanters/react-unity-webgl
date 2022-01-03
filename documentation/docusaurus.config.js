const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const config = {
  title: "React Unity WebGL",
  tagline: "Bring your Unity Games to the Web!",
  url: "https://react-unity-webgl.jeffreylanters.nl",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "images/favicon.ico",
  organizationName: "jeffreylanters",
  projectName: "react-unity-webgl",
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/jeffreylanters/react-unity-webgl/tree/main/documentation/docs",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  themeConfig: {
    announcementBar: {
      id: "support_us",
      content:
        'Help me maintain this module, please <a target="_blank" href="https://github.com/sponsors/jeffreylanters">considing sponsoring</a>',
      backgroundColor: "#fafbfc",
      textColor: "#091E42",
      isCloseable: false,
    },
    navbar: {
      title: "React Unity WebGL",
      logo: {
        alt: "React Unity WebGL Logo",
        src: "images/logo.png",
      },
      items: [
        {
          type: "doc",
          docId: "introduction",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/jeffreylanters/react-unity-webgl/discussions",
          docId: "introduction",
          position: "left",
          label: "Community",
        },
        {
          href: "https://github.com/jeffreylanters/react-unity-webgl",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Usefull Links",
          items: [
            {
              label: "Contributing",
              href: "https://github.com/jeffreylanters/react-unity-webgl/blob/main/CONTRIBUTING.md",
            },
            {
              label: "License",
              href: "https://github.com/jeffreylanters/react-unity-webgl/blob/main/LICENSE.md",
            },
            {
              label: "Security",
              href: "https://github.com/jeffreylanters/react-unity-webgl/blob/main/SECURITY.md",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discussions",
              href: "https://github.com/jeffreylanters/react-unity-webgl/discussions",
            },
            {
              label: "Issues",
              href: "https://github.com/jeffreylanters/react-unity-webgl/issues",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/reactjs+unity-webgl",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jeffreylanters/react-unity-webgl",
            },
            {
              label: "Sponsor",
              href: "https://github.com/sponsors/jeffreylanters",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jeffrey Lanters`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
