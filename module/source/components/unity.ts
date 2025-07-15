import {
  useState,
  useEffect,
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  JSX,
  useImperativeHandle,
} from "react";
import { UnityInstance } from "../types/unity-instance";
import { UnityProps } from "../types/unity-props";
import { useCanvasIdentifier } from "../hooks/use-canvas-identifier";

const Unity: ForwardRefExoticComponent<
  UnityProps & React.RefAttributes<HTMLCanvasElement>
> = forwardRef<HTMLCanvasElement, UnityProps>(
  /**
   * @param unityProps The Unity props provided the the Unity component.
   * @param forwardedRef The forwarded ref to the Unity component.
   * @returns The Unity canvas renderer.
   */
  (props, forwardedRef): JSX.Element => {
    const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
    const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(
      null
    );

    const [canvasId, refreshCanvasId] = useCanvasIdentifier(props.id);

    useEffect(() => {
      const initializeUnity = async () => {
        if (!canvasRef || unityInstance) {
          return;
        }

        refreshCanvasId();

        const unityConfig = {
          dataUrl: props.unityProvider.dataUrl,
          frameworkUrl: props.unityProvider.frameworkUrl,
          codeUrl: props.unityProvider.codeUrl,
        };

        // TODO: Inject loader script

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

    useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
      forwardedRef,
      () => canvasRef
    );

    return createElement("canvas", {
      ref: setCanvasRef,
      id: canvasId,
      style: props.style,
    });
  }
);

export { Unity };
