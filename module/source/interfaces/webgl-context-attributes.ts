/**
 * WebGLContextAttributes object that contains the actual context parameters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#parameters (@WebGL context attributes)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes
 */
export interface IWebGLContextAttributes {
  /**
   * If set to true, the context contains an alpha (transparency) buffer.
   * @public
   * @readonly
   * @type {boolean}
   * @default true
   */
  readonly alpha?: boolean;

  /**
   * If set to true, the context is requested to have a 16 bit depth buffer.
   * @public
   * @readonly
   * @type {boolean}
   * @default true
   */
  readonly depth?: boolean;

  /**
   * If set to true, the context is requested to have a stencil buffer of at
   * least 8 bits.
   * @public
   * @readonly
   * @type {boolean}
   * @default false
   */
  readonly stencil?: boolean;

  /**
   * If set to true, this hints the user agent (browser) to reduce the latency
   * by desynchronizing the context paint cycle from the event loop.
   * @public
   * @readonly
   * @type {boolean}
   * @default false
   */
  readonly desynchronized?: boolean;

  /**
   * If set to true, the context will attempt to perform antialiased rendering
   * if possible.
   * @public
   * @readonly
   * @type {boolean}
   * @default true
   */
  readonly antialias?: boolean;

  /**
   * If the value is true, context creation will fail if the implementation
   * determines that the performance of the created WebGL context would be
   * dramatically lower than that of a native application making equivalent
   * OpenGL calls. This could happen for a number of reasons, including an
   * implementation might switch to a software rasterizer if the user's GPU
   * driver is known to be unstable. And an implementation might require reading
   * back the framebuffer from GPU memory to system memory before compositing it
   * with the rest of the page, significantly reducing performance.
   * @public
   * @readonly
   * @type {boolean}
   * @default false
   */
  readonly failIfMajorPerformanceCaveat?: boolean;

  /**
   * Provides a hint to the user agent (browser) indicating what configuration
   * of GPU is suitable for this WebGL context. This may influence which GPU is
   * used in a system with multiple GPUs. For example, a dual-GPU system might
   * have one GPU that consumes less power at the expense of rendering
   * performance. Note that this property is only a hint and a WebGL
   * implementation may choose to ignore it. WebGL implementations use context
   * lost and restoredevents to regulate power and memory consumption,
   * regardless of the value of this attribute.
   * - default: Let the user agent (browser) decide which GPU configuration is
   *   most suitable.
   * - high-performance: Prioritizes rendering performance over power
   *   consumption.
   * - low-power: Prioritizes power saving over rendering performance.
   * @public
   * @readonly
   * @type {"default" | "high-performance" | "low-power"}
   * @default "default"
   */
  readonly powerPreference?: "default" | "high-performance" | "low-power";

  /**
   * If set to true, page compositor will assume the drawing buffer contains colors
   * with pre-multiplied alpha. (The color channels in the framebuffer should be
   * stored premultipled by the alpha channel to improve performance.)
   * @public
   * @readonly
   * @type {boolean}
   * @default true
   */
  readonly premultipliedAlpha?: boolean;

  /**
   * If set to true, the buffers will not be cleared and will preserve their values
   * until cleared or overwritten by the author. If you wish to use canvas.toDataURL()
   * you will either need to draw to the canvas immediately before calling toDataURL()
   * or set preserveDrawingBuffer to true to keep the buffer available after the
   * browser has displayed the buffer (at the cost of increased memory use).
   * @public
   * @readonly
   * @type {boolean}
   * @default false
   */
  readonly preserveDrawingBuffer?: boolean;

  /**
   * If set to true, this hints to the user agent (browser) to use a compatible graphics
   * adapter for an immersive XR device. Setting this synchronous flag at context creation
   * is discouraged; rather call the asynchronous WebGLRenderingContext.makeXRCompatible()
   * method the moment you intend to start an XR session.
   * @public
   * @readonly
   * @type {boolean}
   * @default false
   */
  readonly xrCompatible?: boolean;
}
