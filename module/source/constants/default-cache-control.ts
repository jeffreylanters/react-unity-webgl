import { UnityCacheControlMode } from "../types/unity-cache-control-mode";

/**
 * Default cache control function for Unity WebGL builds.
 * This function is used to set the cache control mode for Unity assets.
 * It returns "no-cache" to ensure that the assets are always fetched fresh.
 * @param url - The URL of the asset.
 * @returns A string representing the cache control mode.
 */
const defaultCacheControl = (url: string): UnityCacheControlMode =>
  "must-revalidate";

export { defaultCacheControl };
