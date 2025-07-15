import { Fragment, useState } from "react";
import { Unity, useUnityContext } from "../../module/source/exports";

export function Application() {
  const [isMounted, setIsMounted] = useState(false);

  const { unityProvider } = useUnityContext({
    codeUrl: `/unity-build/unity.wasm`,
    dataUrl: `/unity-build/unity.data`,
    frameworkUrl: `/unity-build/unity.framework.js`,
    loaderUrl: `/unity-build/unity.loader.js`,
  });

  return (
    <Fragment>
      <h1>Unity Test</h1>
      <button onClick={() => setIsMounted((prev) => !prev)}>
        {isMounted ? "Unmount Unity" : "Mount Unity"}
      </button>
      {isMounted && (
        <Unity
          unityProvider={unityProvider}
          style={{ width: 400, height: 250 }}
        />
      )}
    </Fragment>
  );
}
