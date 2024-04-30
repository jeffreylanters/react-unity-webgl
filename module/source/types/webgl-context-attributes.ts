/**
 * WebGLContextAttributes object that contains the actual context parameters.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getContextAttributes
 */
type WebGLContextAttributes = {
  /**
   * If set to true, the context will have an alpha (transparency) channel.
   * @default true
   */
  readonly alpha?: boolean;

  /**
   * If set to true, the context will attempt to perform antialiased rendering
   * if possible.
   * @default true
   */
  readonly antialias?: boolean;

  /**
   * If set to true, the context will have a 16 bit depth buffer. Defaults to
   * true. Use gl.enable(DEPTH_TEST) to enable the depth test and
   * gl.depthFunc(), gl.depthMask(), and gl.depthRange() to configure the depth
   * test.
   * @default true
   */
  readonly depth?: boolean;

  /**
   * If the value is true, context creation will fail if the implementation
   * determines that the performance of the created WebGL context would be
   * dramatically lower than that of a native application making equivalent
   * OpenGL calls. This could happen for a number of reasons, including an
   * implementation might switch to a software rasterizer if the user's GPU
   * driver is known to be unstable. And an implementation might require reading
   * back the framebuffer from GPU memory to system memory before compositing it
   * with the rest of the page, significantly reducing performance.
   * @default false
   */
  readonly failIfMajorPerformanceCaveat?: boolean;

  /**
   * Provides a hint to the user agent indicating what configuration of GPU is
   * suitable for this WebGL context. This may influence which GPU is used in a
   * system with multiple GPUs. For example, a dual-GPU system might have one
   * GPU that consumes less power at the expense of rendering performance.
   * Note that this property is only a hint and a WebGL implementation may
   * choose to ignore it. WebGL implementations use context lost and restored
   * events to regulate power and memory consumption, regardless of the value of
   * this attribute. Accepts the following values:
   * 0: Default
   * 1: Low Power
   * 2: High Performance
   * @default 0
   */
  readonly powerPreference?: 0 | 1 | 2;

  /**
   * If set to true, the color channels in the framebuffer will be stored
   * premultipled by the alpha channel to improve performance.
   * @default true
   */
  readonly premultipliedAlpha?: boolean;

  /**
   * If set to false, the buffer will be cleared after rendering. If you wish to
   * use canvas.toDataURL(), you will either need to draw to the canvas
   * immediately before calling toDataURL(), or set preserveDrawingBuffer to
   * true to keep the buffer available after the browser has displayed the
   * buffer (at the cost of increased memory use).
   * @default false
   */
  readonly preserveDrawingBuffer?: boolean;

  /**
   * Stenciling enables and disables drawing on a per-pixel basis. It is
   * typically used in multipass rendering to achieve special effects.
   * @default false
   */
  readonly stencil?: boolean;

  /**
   * If set to true, the context will have an 8 bit stencil buffer. Defaults to
   * false. Use gl.enable(STENCIL_TEST) to enable depth test and
   * gl.stencilFunc(), gl.stencilFuncSeparate(), gl.stencilMask(),
   * gl.stencilMaskSeparate(), gl.stencilOp(), and gl.stencilOpSeparate()
   * to configure the stencil test.
   * @default false
   */
  readonly desynchronized?: boolean;

  /**
   * xrCompatible is a boolean that indicates whether the context is compatible.
   * @default false
   */
  readonly xrCompatible?: boolean;
};

export type { WebGLContextAttributes };
