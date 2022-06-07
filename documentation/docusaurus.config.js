const lightCodeTheme = require("prism-react-renderer/themes/nightOwlLight");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "React Unity WebGL",
  tagline: "Bring your Unity Games to the Web!",
  url: "https://react-unity-webgl.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "images/favicon.ico",
  organizationName: "jeffreylanters",
  projectName: "react-unity-webgl",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          sidebarPath: require.resolve("./sidebars.json"),
          editUrl:
            "https://github.com/jeffreylanters/react-unity-webgl/tree/main/documentation/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: [],
        },
        googleAnalytics: {
          trackingID: "G-RFKR3KVKBZ",
          anonymizeIP: true,
        },
      }),
    ],
  ],
  themeConfig: {
    announcementBar: {
      id: "support_me",
      content:
        'If you like this module, please considing <a target="_blank" href="https://github.com/sponsors/jeffreylanters">sponsoring</a> and giving it a star on <a target="_blank" href="https://github.com/jeffreylanters/react-unity-webgl/stargazers">GitHub</a> ❤️',
      backgroundColor: "#2399EF",
      textColor: "#ffffff",
      isCloseable: false,
    },
    navbar: {
      title: "React Unity WebGL",
      logo: {
        alt: "React Unity WebGL Logo",
        src: "images/logo.svg",
        srcDark: "images/logo-light.svg",
      },
      items: [
        {
          to: "/docs/introduction",
          position: "left",
          label: "Docs",
        },
        {
          to: "/docs/api/introduction",
          position: "left",
          label: "API",
        },
        {
          to: "/docs/legacy/introduction",
          position: "left",
          label: "Legacy",
        },
        {
          to: "/made-with",
          position: "left",
          label: "Made With",
        },
        {
          href: "https://github.com/jeffreylanters/react-unity-webgl",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      style: "light",
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
              label: "Npm",
              href: "https://www.npmjs.com/package/react-unity-webgl",
            },
            {
              label: "Sponsor",
              href: "https://github.com/sponsors/jeffreylanters",
            },
          ],
        },
      ],
      logo: {
        alt: "React Unity WebGL Logo",
        src: "images/logo.svg",
        srcDark: "images/logo-light.svg",
        href: "https://opensource.facebook.com",
        width: 160,
        height: 51,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Jeffrey Lanters`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
