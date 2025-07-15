/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createElement } from "react";

let canvasCounter = 0;

export const Unity = () => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);
  const [canvasId, setCanvasId] = useState<string>("react-unity-webgl");

  useEffect(() => {
    const initializeUnity = async () => {
      if (!canvasRef || unityInstance) {
        return;
      }

      setCanvasId(`react-unity-webgl-${++canvasCounter}`);

      const unityConfig = {
        dataUrl: "/unity-build/unity.data",
        frameworkUrl: "/unity-build/unity.framework.js",
        codeUrl: "/unity-build/unity.wasm",
      };

      setUnityInstance(
        await window.createUnityInstance(canvasRef, unityConfig)
      );
    };

    const detachUnity = async () => {
      if (!unityInstance || !canvasRef) {
        return;
      }

      const cleanupCanvasRef = document.createElement("canvas");
      cleanupCanvasRef.id = canvasRef.id;
      cleanupCanvasRef.setAttribute("react-unity-webgl-role", "cleanup");
      document.body.appendChild(cleanupCanvasRef);
      unityInstance.Module.canvas = cleanupCanvasRef;
      setUnityInstance(null);
      await unityInstance.Quit();
      document.body.removeChild(cleanupCanvasRef);
    };

    initializeUnity();

    return () => {
      detachUnity();
    };
  }, [canvasRef, unityInstance]);

  return createElement("canvas", {
    ref: setCanvasRef,
    id: canvasId,
  });
};
