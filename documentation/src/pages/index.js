import Layout from "@theme/Layout";
import React from "react";
import styles from "./index.module.css";
import ThemedImage from "@theme/ThemedImage";

const Index = () => {
  return (
    <Layout
      title={`React Unity WebGL`}
      description="Bring your Unity Games to the Web!"
    >
      <main className={styles.main}>
        <ThemedImage
          alt={"React Unity WebGL Logo"}
          sources={{
            light: "/images/logo.svg",
            dark: "/images/logo-light.svg",
          }}
        />
        <div>
          <h1>React Unity WebGL</h1>
          <h2>Bringing your Unity Games to the Web since 2017!</h2>
        </div>
        <p>
          When bringing your Unity Application to the web, you might need to
          communicate with Components on a webpage, build interactive interfaces
          or might want to implement functionality using Web APIs which Unity
          does not expose. Combining Unity with React is a great way achieve
          these goals. React Unity WebGL provides a modern solution for
          embedding Unity WebGL builds in your React Application while providing
          advanced APIs for two way communication and interaction between Unity
          and React.
        </p>
        <a href="/docs/introduction">
          <button>Get Started</button>
        </a>
      </main>
    </Layout>
  );
};

export default Index;
