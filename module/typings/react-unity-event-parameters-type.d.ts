/**
 * Type definition for Unity event argument types. These are the supported
 * types for the React Unity WebGL event system which can be used to dispatch
 * events to the React Application from the Unity Instance.
 *
 * Simple numeric types can be passed to JavaScript in function parameters
 * without requiring any conversion. Other data types will be passed as a
 * pointer in the emscripten heap (which is really just a big array in
 * JavaScript). For strings, you can use the Pointerstringify helper function
 * to convert to a JavaScript string.
 *
 * To return a string value you need to call _malloc to allocate some memory and
 * the writeStringToMemory helper function to write a JavaScript string to it.
 * If the string is a return value, then the il2cpp runtime will take care of
 * freeing the memory for you.
 *
 * For arrays of primitive types, emscripten provides different ArrayBufferViews
 * into it’s heap for different sizes of integer, unsigned integer or floating
 * point representations of memory: HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32,
 * HEAPU32, HEAPF32, HEAPF64. To access a texture in WebGL, emscripten provides
 * the GL.textures array which maps native texture IDs from Unity to WebGL
 * texture objects. WebGL functions can be called on emscripten’s WebGL context,
 * GLctx.
 */
declare type ReactUnityEventParameterType = string | number | undefined;
