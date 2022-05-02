import Layout from "@theme/Layout";
import React from "react";
import styles from "./index.module.css";

const Index = () => (
  <Layout
    title={`React Unity WebGL`}
    description="Bring your Unity Games to the Web!"
  >
    <main className={styles.main}>
      <img src="/images/logo.svg" alt="React Unity WebGL Logo" />
      <h1>React Unity WebGL</h1>
      <p>Bring your Unity Games to the Web!</p>
      <a href="/docs/introduction">
        <button>Get Started</button>
      </a>
    </main>
  </Layout>
);

export default Index;
