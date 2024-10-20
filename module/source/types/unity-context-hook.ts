import { UnityProvider } from "./unity-provider";
import { EventSystemHook } from "./event-system-hook";
import { ReactUnityEventParameter } from "./react-unity-event-parameters";
import { UnityInstance } from "../../declarations/unity-instance";

/**
 * The Unity Context hook.
 */
type UnityContextHook = EventSystemHook & {
  /**
   * The Unity Context returns a Unity Provider instance. This immutable object
   * should be passed onto a Unity Component in order to be able to access the
   * Unity Context's state.
   */
  readonly unityProvider: UnityProvider;

  /**
   * The Unity Instance's loading progression represents the percentage of the
   * Unity Instance's loading process that has been completed.
   */
  readonly loadingProgression: number;

  /**
   * Defines whether the Unity Instance has been loaded.
   */
  readonly isLoaded: boolean;

  /**
   * May contain an error that occurred during the initialisation of the Unity
   * Instance.
   */
  readonly initialisationError: Error | null;

  /**
   * A reference to the internal Unity Instance. This Unity Instance is the
   * object that is exposed by the Unity Loader is meant to be used only
   * internally by the module. In the event that you need to access the Unity
   * Instance when for example using a third-party library, that requires access
   * to the Unity Instance, you can use this variable.
   *
   * Warning! Please make sure that any changes made to, or events bound to the
   * Unity Instance are not reflected inside of the module. This could lead to
   * unexpected behaviour.
   */
  readonly UNSAFE__unityInstance: UnityInstance | null;

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @param enabled Defines whether Unity should be in fullscreen.
   */
  readonly requestFullscreen: (enabled: boolean) => void;

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param gameObjectName the name of the game object in your Unity scene.
   * @param methodName the name of the public method on the game object.
   * @param parameter an optional parameter to pass along to the method.
   */
  readonly sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventParameter
  ) => void;

  /**
   * Takes a screenshot of the Unity Instance and returns a base64 encoded
   * string.
   * @param type Defines the type of screenshot to take.
   * @param quality Defines the quality of the screenshot.
   * @returns A base 64 encoded string of the screenshot.
   */
  readonly takeScreenshot: (
    dataType?: string,
    quality?: number
  ) => string | undefined;

  /**
   * Lets you asynchronously ask for the pointer to be locked on the given Unity
   * Application's Canvas Element. To track the success or failure of the
   * request, it is necessary to listen for the pointerlockchange and
   * pointerlockerror events at the Document level.
   */
  readonly requestPointerLock: () => void;

  /**
   * Requests the UnityInstance to be unloaded from memory in order to be
   * unmounted from the DOM.
   * @returns A promise that resolves when the UnityInstance has been unloaded.
   */
  readonly unload: () => Promise<void>;

  /**
   * Detaches the Unity Instance from the React DOM, by doing so, the Unity
   * Instance can be unloaded from the memory while the Unity component can be
   * unmounted safely.
   *
   * Warning! This is a workaround for the fact that the Unity WebGL instances
   * which are build with Unity 2021.2 and newer cannot be unmounted before the
   * Unity Instance is unloaded.
   * @see https://github.com/jeffreylanters/react-unity-webgl/issues/22
   * @returns A promise that resolves when the UnityInstance has been detached.
   */
  readonly UNSAFE__detachAndUnloadImmediate: () => Promise<void>;
};

export type { UnityContextHook };
