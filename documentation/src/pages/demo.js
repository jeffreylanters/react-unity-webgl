import React, { useEffect, useMemo, useRef } from "react";
import Layout from "@theme/Layout";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Demo() {
  const { unityProvider, UNSAFE__detachAndUnloadImmediate } = useUnityContext({
    loaderUrl: "/demo-unity-build/build.loader.js",
    dataUrl: "/demo-unity-build/build.data",
    codeUrl: "/demo-unity-build/build.wasm",
    frameworkUrl: "/demo-unity-build/build.framework.js",
  });

  useEffect(
    () => UNSAFE__detachAndUnloadImmediate,
    [UNSAFE__detachAndUnloadImmediate]
  );

  return (
    <Layout title="Demo" description="Demo">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "20px 0",
        }}
      >
        <h1>React Unity WebGL Demo</h1>
        <Unity
          unityProvider={unityProvider}
          style={{ width: 800, height: 500 }}
        />
      </div>
    </Layout>
  );
}
