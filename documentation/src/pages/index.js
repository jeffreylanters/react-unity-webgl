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
        <h1>React Unity WebGL</h1>
        <p>Bringing your Unity Games to the Web since 2017!</p>
        <a href="/docs/introduction">
          <button>Get Started</button>
        </a>
      </main>
    </Layout>
  );
};

export default Index;
