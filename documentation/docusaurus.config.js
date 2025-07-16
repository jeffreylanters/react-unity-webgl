const themes = require("prism-react-renderer").themes;
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

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
          lastVersion: "current",
          versions: {
            current: {
              label: "Current version",
              banner: "none",
              badge: true,
              path: "",
            },
            "9.x.x": {
              label: "Version 9 (Maintenance LTS)",
              banner: "unmaintained",
              badge: true,
              path: "9.x.x",
            },
            "8.x.x": {
              label: "Version 8 (Maintenance LTS)",
              banner: "unmaintained",
              badge: true,
              path: "8.x.x",
            },
            "7.x.x": {
              label: "Version 7 (Maintenance LTS)",
              banner: "unmaintained",
              badge: true,
              path: "7.x.x",
            },
            "6.x.x": {
              label: "Version 6 (Maintenance LTS)",
              banner: "unmaintained",
              badge: true,
              path: "6.x.x",
            },
            "5.x.x": {
              label: "Version 5 (Maintenance LTS)",
              banner: "unmaintained",
              badge: true,
              path: "5.x.x",
            },
          },
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
        "Donations are helping me to keep this project maintained, if you find this project useful, please consider <a href='/support'>supporting</a> it. Thank you! ❤️",
      backgroundColor: "#238babff",
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
          to: "/made-with",
          position: "left",
          label: "Made With",
        },
        {
          to: "/tutorials",
          position: "left",
          label: "Tutorials",
        },
        {
          to: "/support",
          position: "left",
          label: "Support",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
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
              label: "Support",
              href: "/support",
            },
          ],
        },
      ],
      logo: {
        alt: "React Unity WebGL Logo",
        src: "images/logo.svg",
        srcDark: "images/logo-light.svg",
        href: "https://jeffreylanters.me",
        width: 50,
        height: 50,
      },
      copyright: `Made with ❤️ by Jeffrey Lanters<br/>2017 - ${new Date().getFullYear()}`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ["csharp"],
    },
  },
};

module.exports = config;
