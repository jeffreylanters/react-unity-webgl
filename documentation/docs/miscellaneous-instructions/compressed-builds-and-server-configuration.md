# Compressed Builds and Server Configuration

To deploy a WebGL build, you must configure your server and make sure you’re using the correct response headers, so that the browser can receive the proper response and process the response correctly. There are two main settings in Unity that affect how you set up the server:

- [Compression Format](#compression-format): Determines how Unity compresses files during the build step.
- [Decompression Fallback](#decompression-fallback): Determines how Unity processes downloaded files when the build runs in the browser.

## Compression Format

Choose the compression type from the WebGL Player Settings window.

- GZip: This is the default option. Gzip files are bigger than Brotli files, but faster to build, and natively supported by all browsers over both HTTP and HTTPS.
- Brotli: Brotli compression offers the best compression ratios. Brotli compressed files are smaller than gzip, but take a longer time to compress, which increases your iteration times on release builds. Chrome and Firefox only natively support Brotli compression over HTTPS.
- None: Disables compression. Use this option if you want to implement your own compression in post-processing scripts. You should also use it if you plan to use static compression on the hosting server.

## Web Server Configuration

You might need to adjust your server configuration to match your specific build setup. In particular, there might be issues if you already have another server-side configuration to compress hosted files, which could interfere with this setup. To make the browser perform decompression natively while it downloads your application, append a Content-Encoding header to the server response. This header must correspond to the type of compression Unity uses at build time. For code samples, see Server Configuration Code Samples.

## Decompression Fallback

The decompression fallback option enables Unity to automatically embed a JavaScript decompressor into your build. This decompressor corresponds to your selected compression method, and decompresses your content if the browser fails to do so.

### Enabling Decompression Fallback

Enable decompression fallback from the Player Settings window. When you enable decompression fallback, Unity adds a .unityweb extension to the build files. You should consider using Decompression Fallback if you have less experience with server configuration, or if server configuration is unavailable to you.

:::info
Using this option results in a larger loader size and a less efficient loading scheme for the build files.
:::

### Disabling Decompression Fallback

The Decompression Fallback option is disabled by default. Therefore, by default, build files have an extension that corresponds to the compression method you select. To enable browsers to natively decompress Unity build files while they’re downloading, you need to configure your web server to serve the compressed files with the appropriate HTTP headers. This is called native browser decompression. It has the advantage of being faster than the JavaScript decompression fallback, which can reduce your application’s startup time.

## Content-Encoding Headers

A Content-Encoding header tells the browser which type of compression Unity has used for the compressed files. This allows the browser to decompress the files natively. Set the Content-Encoding response header to the compression method selected in the Player Settings.

### WebAssembly Streaming

WebAssembly streaming allows the browser to compile the WebAssembly code while it is still downloading the code. This significantly improves loading times. For WebAssembly streaming compilation to work, the server needs to return WebAssembly files with an application/wasm MIME type. To use WebAssembly streaming, you need to serve WebAssembly files with the Content-Type: application/wasm response header. A Content-Type header tells the server which media type the content is. This value should be set to application/wasm for WebAssembly files.

:::info
WebAssembly streaming does not work together with JavaScript decompression (when the Decompression Fallback option is enabled). In such cases, the downloaded WebAssembly file must first go through the JavaScript decompressor and therefore the browser cannot stream it during download.
:::

### Additional Headers

If your file contains JavaScript, you should add the application/javascript Content-Type header. Some servers might include this automatically, while others do not.

:::info
For more information, visit the Unity Manual on [WebGL Deploying](https://docs.unity3d.com/Manual/webgl-deploying.html).
:::
