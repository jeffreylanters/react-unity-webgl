function unityFramework(Module) {
  var Module = typeof Module !== "undefined" ? Module : {};
  Module.reactUnityWebGL = {
    getJSEvents: function () {
      return JSEvents;
    },
  };
  function Pointer_stringify(s, len) {
    warnOnce(
      "The JavaScript function 'Pointer_stringify(ptrToSomeCString)' is obsoleted and will be removed in a future Unity version. Please call 'UTF8ToString(ptrToSomeCString)' instead."
    );
    return UTF8ToString(s, len);
  }
  Module["Pointer_stringify"] = Pointer_stringify;
  function SendMessage(gameObject, func, param) {
    if (param === undefined)
      Module.ccall(
        "SendMessage",
        null,
        ["string", "string"],
        [gameObject, func]
      );
    else if (typeof param === "string")
      Module.ccall(
        "SendMessageString",
        null,
        ["string", "string", "string"],
        [gameObject, func, param]
      );
    else if (typeof param === "number")
      Module.ccall(
        "SendMessageFloat",
        null,
        ["string", "string", "number"],
        [gameObject, func, param]
      );
    else
      throw (
        "" +
        param +
        " is does not have a type which is supported by SendMessage."
      );
  }
  Module["SendMessage"] = SendMessage;
  var stackTraceReference =
    "(^|\\n)(\\s+at\\s+|)jsStackTrace(\\s+\\(|@)([^\\n]+):\\d+:\\d+(\\)|)(\\n|$)";
  var stackTraceReferenceMatch = jsStackTrace().match(
    new RegExp(stackTraceReference)
  );
  if (stackTraceReferenceMatch)
    Module.stackTraceRegExp = new RegExp(
      stackTraceReference
        .replace(
          "([^\\n]+)",
          stackTraceReferenceMatch[4].replace(/[\\^${}[\]().*+?|]/g, "\\$&")
        )
        .replace("jsStackTrace", "[^\\n]+")
    );
  var abort = function (what) {
    if (ABORT) return;
    ABORT = true;
    EXITSTATUS = 1;
    if (typeof ENVIRONMENT_IS_PTHREAD !== "undefined" && ENVIRONMENT_IS_PTHREAD)
      console.error("Pthread aborting at " + new Error().stack);
    if (what !== undefined) {
      out(what);
      err(what);
      what = JSON.stringify(what);
    } else {
      what = "";
    }
    var message = "abort(" + what + ") at " + stackTrace();
    if (Module.abortHandler && Module.abortHandler(message)) return;
    throw message;
  };
  var videoInputDevices = [];
  var removeEnumerateMediaDevicesRunDependency;
  function matchToOldDevice(newDevice) {
    var oldDevices = Object.keys(videoInputDevices);
    for (var i = 0; i < oldDevices.length; ++i) {
      var old = videoInputDevices[oldDevices[i]];
      if (old.deviceId && old.deviceId == newDevice.deviceId) return old;
    }
    for (var i = 0; i < oldDevices.length; ++i) {
      var old = videoInputDevices[oldDevices[i]];
      if (old == newDevice) return old;
    }
    for (var i = 0; i < oldDevices.length; ++i) {
      var old = videoInputDevices[oldDevices[i]];
      if (old.label && old.label == newDevice.label) return old;
    }
    for (var i = 0; i < oldDevices.length; ++i) {
      var old = videoInputDevices[oldDevices[i]];
      if (
        old.groupId &&
        old.kind &&
        old.groupId == newDevice.groupId &&
        old.kind == newDevice.kind
      )
        return old;
    }
  }
  function assignNewVideoInputId() {
    for (var i = 0; ; ++i) {
      if (!videoInputDevices[i]) return i;
    }
  }
  function updateVideoInputDevices(devices) {
    removeEnumerateMediaDevicesRunDependency();
    videoInputDevices = [];
    var retainedDevices = {};
    var newDevices = [];
    devices.forEach(function (device) {
      if (device.kind === "videoinput") {
        var oldDevice = matchToOldDevice(device);
        if (oldDevice) {
          retainedDevices[oldDevice.id] = oldDevice;
        } else {
          newDevices.push(device);
        }
      }
    });
    videoInputDevices = retainedDevices;
    newDevices.forEach(function (device) {
      if (!device.id) {
        device.id = assignNewVideoInputId();
        device.name = device.label || "Video input #" + (device.id + 1);
        device.isFrontFacing =
          device.name.toLowerCase().includes("front") ||
          (!device.name.toLowerCase().includes("front") &&
            !device.name.toLowerCase().includes("back"));
        videoInputDevices[device.id] = device;
      }
    });
  }
  function enumerateMediaDeviceList() {
    if (!videoInputDevices) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        updateVideoInputDevices(devices);
      })
      .catch(function (e) {
        console.warn(
          "Unable to enumerate media devices: " +
            e +
            "\nWebcams will not be available."
        );
        disableAccessToMediaDevices();
      });
    if (/Firefox/.test(navigator.userAgent)) {
      setTimeout(enumerateMediaDeviceList, 6e4);
      warnOnce(
        "Applying workaround to Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1397977"
      );
    }
  }
  function disableAccessToMediaDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        enumerateMediaDeviceList
      );
    }
    videoInputDevices = null;
  }
  Module["disableAccessToMediaDevices"] = disableAccessToMediaDevices;
  if (!navigator.mediaDevices) {
    console.warn(
      "navigator.mediaDevices not supported by this browser. Webcam access will not be available." +
        (location.protocol == "https:"
          ? ""
          : " Try hosting the page over HTTPS, because some browsers disable webcam access when insecure HTTP is being used.")
    );
    disableAccessToMediaDevices();
  } else if (
    typeof ENVIRONMENT_IS_PTHREAD === "undefined" ||
    !ENVIRONMENT_IS_PTHREAD
  )
    setTimeout(function () {
      try {
        addRunDependency("enumerateMediaDevices");
        removeEnumerateMediaDevicesRunDependency = function () {
          removeRunDependency("enumerateMediaDevices");
          if (navigator.mediaDevices)
            console.log("navigator.mediaDevices support available");
          removeEnumerateMediaDevicesRunDependency = function () {};
        };
        enumerateMediaDeviceList();
        navigator.mediaDevices.addEventListener(
          "devicechange",
          enumerateMediaDeviceList
        );
      } catch (e) {
        console.warn("Unable to enumerate media devices: " + e);
        disableAccessToMediaDevices();
      }
    }, 0);
  if (
    typeof ENVIRONMENT_IS_PTHREAD === "undefined" ||
    !ENVIRONMENT_IS_PTHREAD
  ) {
    Module["preRun"].push(function () {
      var unityFileSystemInit =
        Module["unityFileSystemInit"] ||
        function () {
          FS.mkdir("/idbfs");
          FS.mount(IDBFS, {}, "/idbfs");
          Module.addRunDependency("JS_FileSystem_Mount");
          FS.syncfs(true, function (err) {
            if (err)
              console.log(
                "IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved."
              );
            Module.removeRunDependency("JS_FileSystem_Mount");
          });
        };
      unityFileSystemInit();
    });
  }
  Module["SetFullscreen"] = function (fullscreen) {
    if (typeof runtimeInitialized === "undefined" || !runtimeInitialized) {
      console.log("Runtime not initialized yet.");
    } else if (typeof JSEvents === "undefined") {
      console.log("Player not loaded yet.");
    } else {
      var tmp = JSEvents.canPerformEventHandlerRequests;
      JSEvents.canPerformEventHandlerRequests = function () {
        return 1;
      };
      Module.ccall("SetFullscreen", null, ["number"], [fullscreen]);
      JSEvents.canPerformEventHandlerRequests = tmp;
    }
  };
  var moduleOverrides = {};
  var key;
  for (key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key];
    }
  }
  var arguments_ = [];
  var thisProgram = "./this.program";
  var quit_ = function (status, toThrow) {
    throw toThrow;
  };
  var ENVIRONMENT_IS_WEB = false;
  var ENVIRONMENT_IS_WORKER = false;
  var ENVIRONMENT_IS_NODE = false;
  var ENVIRONMENT_IS_SHELL = false;
  ENVIRONMENT_IS_WEB = typeof window === "object";
  ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
  ENVIRONMENT_IS_NODE =
    typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node === "string";
  ENVIRONMENT_IS_SHELL =
    !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
  var scriptDirectory = "";
  function locateFile(path) {
    if (Module["locateFile"]) {
      return Module["locateFile"](path, scriptDirectory);
    }
    return scriptDirectory + path;
  }
  var read_, readAsync, readBinary, setWindowTitle;
  var nodeFS;
  var nodePath;
  if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = require("path").dirname(scriptDirectory) + "/";
    } else {
      scriptDirectory = __dirname + "/";
    }
    read_ = function shell_read(filename, binary) {
      if (!nodeFS) nodeFS = require("fs");
      if (!nodePath) nodePath = require("path");
      filename = nodePath["normalize"](filename);
      return nodeFS["readFileSync"](filename, binary ? null : "utf8");
    };
    readBinary = function readBinary(filename) {
      var ret = read_(filename, true);
      if (!ret.buffer) {
        ret = new Uint8Array(ret);
      }
      assert(ret.buffer);
      return ret;
    };
    if (process["argv"].length > 1) {
      thisProgram = process["argv"][1].replace(/\\/g, "/");
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module !== "undefined") {
      module["exports"] = Module;
    }
    process["on"]("uncaughtException", function (ex) {
      if (!(ex instanceof ExitStatus)) {
        throw ex;
      }
    });
    process["on"]("unhandledRejection", abort);
    quit_ = function (status) {
      process["exit"](status);
    };
    Module["inspect"] = function () {
      return "[Emscripten Module object]";
    };
  } else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
      read_ = function shell_read(f) {
        return read(f);
      };
    }
    readBinary = function readBinary(f) {
      var data;
      if (typeof readbuffer === "function") {
        return new Uint8Array(readbuffer(f));
      }
      data = read(f, "binary");
      assert(typeof data === "object");
      return data;
    };
    if (typeof scriptArgs != "undefined") {
      arguments_ = scriptArgs;
    } else if (typeof arguments != "undefined") {
      arguments_ = arguments;
    }
    if (typeof quit === "function") {
      quit_ = function (status) {
        quit(status);
      };
    }
    if (typeof print !== "undefined") {
      if (typeof console === "undefined") console = {};
      console.log = print;
      console.warn = console.error =
        typeof printErr !== "undefined" ? printErr : print;
    }
  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = self.location.href;
    } else if (typeof document !== "undefined" && document.currentScript) {
      scriptDirectory = document.currentScript.src;
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
      scriptDirectory = scriptDirectory.substr(
        0,
        scriptDirectory.lastIndexOf("/") + 1
      );
    } else {
      scriptDirectory = "";
    }
    {
      read_ = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText;
      };
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = function (url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
      readAsync = function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
            onload(xhr.response);
            return;
          }
          onerror();
        };
        xhr.onerror = onerror;
        xhr.send(null);
      };
    }
    setWindowTitle = function (title) {
      document.title = title;
    };
  } else {
  }
  var out = Module["print"] || console.log.bind(console);
  var err = Module["printErr"] || console.warn.bind(console);
  for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key];
    }
  }
  moduleOverrides = null;
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  if (Module["quit"]) quit_ = Module["quit"];
  var STACK_ALIGN = 16;
  function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN;
    return Math.ceil(size / factor) * factor;
  }
  function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
      warnOnce.shown[text] = 1;
      err(text);
    }
  }
  var tempRet0 = 0;
  var setTempRet0 = function (value) {
    tempRet0 = value;
  };
  var getTempRet0 = function () {
    return tempRet0;
  };
  var wasmBinary;
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  var noExitRuntime = Module["noExitRuntime"] || true;
  if (typeof WebAssembly !== "object") {
    abort("no native wasm support detected");
  }
  var wasmMemory;
  var ABORT = false;
  var EXITSTATUS;
  function assert(condition, text) {
    if (!condition) {
      abort("Assertion failed: " + text);
    }
  }
  function getCFunc(ident) {
    var func = Module["_" + ident];
    assert(
      func,
      "Cannot call unknown function " + ident + ", make sure it is exported"
    );
    return func;
  }
  function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
      string: function (str) {
        var ret = 0;
        if (str !== null && str !== undefined && str !== 0) {
          var len = (str.length << 2) + 1;
          ret = stackAlloc(len);
          stringToUTF8(str, ret, len);
        }
        return ret;
      },
      array: function (arr) {
        var ret = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret);
        return ret;
      },
    };
    function convertReturnValue(ret) {
      if (returnType === "string") return UTF8ToString(ret);
      if (returnType === "boolean") return Boolean(ret);
      return ret;
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func.apply(null, cArgs);
    ret = convertReturnValue(ret);
    if (stack !== 0) stackRestore(stack);
    return ret;
  }
  function cwrap(ident, returnType, argTypes, opts) {
    argTypes = argTypes || [];
    var numericArgs = argTypes.every(function (type) {
      return type === "number";
    });
    var numericRet = returnType !== "string";
    if (numericRet && numericArgs && !opts) {
      return getCFunc(ident);
    }
    return function () {
      return ccall(ident, returnType, argTypes, arguments, opts);
    };
  }
  var UTF8Decoder =
    typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
  function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
      var str = "";
      while (idx < endPtr) {
        var u0 = heap[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heap[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heap[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
    }
    return str;
  }
  function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
  }
  function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
      var u = str.charCodeAt(i);
      if (u >= 55296 && u <= 57343) {
        var u1 = str.charCodeAt(++i);
        u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
      }
      if (u <= 127) {
        if (outIdx >= endIdx) break;
        heap[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        heap[outIdx++] = 192 | (u >> 6);
        heap[outIdx++] = 128 | (u & 63);
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        heap[outIdx++] = 224 | (u >> 12);
        heap[outIdx++] = 128 | ((u >> 6) & 63);
        heap[outIdx++] = 128 | (u & 63);
      } else {
        if (outIdx + 3 >= endIdx) break;
        heap[outIdx++] = 240 | (u >> 18);
        heap[outIdx++] = 128 | ((u >> 12) & 63);
        heap[outIdx++] = 128 | ((u >> 6) & 63);
        heap[outIdx++] = 128 | (u & 63);
      }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
  }
  function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
  }
  function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
      var u = str.charCodeAt(i);
      if (u >= 55296 && u <= 57343)
        u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
      if (u <= 127) ++len;
      else if (u <= 2047) len += 2;
      else if (u <= 65535) len += 3;
      else len += 4;
    }
    return len;
  }
  function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret;
  }
  function allocateUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret;
  }
  function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer);
  }
  function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
      HEAP8[buffer++ >> 0] = str.charCodeAt(i);
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0;
  }
  function alignUp(x, multiple) {
    if (x % multiple > 0) {
      x += multiple - (x % multiple);
    }
    return x;
  }
  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
  function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
  }
  var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 33554432;
  var wasmTable;
  var __ATPRERUN__ = [];
  var __ATINIT__ = [];
  var __ATMAIN__ = [];
  var __ATEXIT__ = [];
  var __ATPOSTRUN__ = [];
  var runtimeInitialized = false;
  var runtimeExited = false;
  function preRun() {
    if (Module["preRun"]) {
      if (typeof Module["preRun"] == "function")
        Module["preRun"] = [Module["preRun"]];
      while (Module["preRun"].length) {
        addOnPreRun(Module["preRun"].shift());
      }
    }
    callRuntimeCallbacks(__ATPRERUN__);
  }
  function initRuntime() {
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    TTY.init();
    callRuntimeCallbacks(__ATINIT__);
  }
  function preMain() {
    FS.ignorePermissions = false;
    callRuntimeCallbacks(__ATMAIN__);
  }
  function exitRuntime() {
    runtimeExited = true;
  }
  function postRun() {
    if (Module["postRun"]) {
      if (typeof Module["postRun"] == "function")
        Module["postRun"] = [Module["postRun"]];
      while (Module["postRun"].length) {
        addOnPostRun(Module["postRun"].shift());
      }
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
  }
  function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
  }
  function addOnInit(cb) {
    __ATINIT__.unshift(cb);
  }
  function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
  }
  var runDependencies = 0;
  var runDependencyWatcher = null;
  var dependenciesFulfilled = null;
  function getUniqueRunDependency(id) {
    return id;
  }
  function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
      Module["monitorRunDependencies"](runDependencies);
    }
  }
  function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
      Module["monitorRunDependencies"](runDependencies);
    }
    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }
      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback();
      }
    }
  }
  Module["preloadedImages"] = {};
  Module["preloadedAudios"] = {};
  function abort(what) {
    if (Module["onAbort"]) {
      Module["onAbort"](what);
    }
    what += "";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e;
  }
  var dataURIPrefix = "data:application/octet-stream;base64,";
  function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix);
  }
  function isFileURI(filename) {
    return filename.startsWith("file://");
  }
  var wasmBinaryFile = "build.wasm";
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }
  function getBinary(file) {
    try {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      } else {
        throw "both async and sync fetching of the wasm failed";
      }
    } catch (err) {
      abort(err);
    }
  }
  function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
      if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
        return fetch(wasmBinaryFile, { credentials: "same-origin" })
          .then(function (response) {
            if (!response["ok"]) {
              throw (
                "failed to load wasm binary file at '" + wasmBinaryFile + "'"
              );
            }
            return response["arrayBuffer"]();
          })
          .catch(function () {
            return getBinary(wasmBinaryFile);
          });
      } else {
        if (readAsync) {
          return new Promise(function (resolve, reject) {
            readAsync(
              wasmBinaryFile,
              function (response) {
                resolve(new Uint8Array(response));
              },
              reject
            );
          });
        }
      }
    }
    return Promise.resolve().then(function () {
      return getBinary(wasmBinaryFile);
    });
  }
  function createWasm() {
    var info = { a: asmLibraryArg };
    function receiveInstance(instance, module) {
      var exports = instance.exports;
      Module["asm"] = exports;
      wasmMemory = Module["asm"]["xg"];
      updateGlobalBufferAndViews(wasmMemory.buffer);
      wasmTable = Module["asm"]["Tg"];
      addOnInit(Module["asm"]["yg"]);
      removeRunDependency("wasm-instantiate");
    }
    addRunDependency("wasm-instantiate");
    function receiveInstantiationResult(result) {
      receiveInstance(result["instance"]);
    }
    function instantiateArrayBuffer(receiver) {
      return getBinaryPromise()
        .then(function (binary) {
          var result = WebAssembly.instantiate(binary, info);
          return result;
        })
        .then(receiver, function (reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
    }
    function instantiateAsync() {
      if (
        !wasmBinary &&
        typeof WebAssembly.instantiateStreaming === "function" &&
        !isDataURI(wasmBinaryFile) &&
        !isFileURI(wasmBinaryFile) &&
        typeof fetch === "function"
      ) {
        return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
          function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiationResult, function (reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(receiveInstantiationResult);
            });
          }
        );
      } else {
        return instantiateArrayBuffer(receiveInstantiationResult);
      }
    }
    if (Module["instantiateWasm"]) {
      try {
        var exports = Module["instantiateWasm"](info, receiveInstance);
        return exports;
      } catch (e) {
        err("Module.instantiateWasm callback failed with error: " + e);
        return false;
      }
    }
    instantiateAsync();
    return {};
  }
  var tempDouble;
  var tempI64;
  var ASM_CONSTS = {
    2439208: function () {
      return Module.webglContextAttributes.premultipliedAlpha;
    },
    2439269: function () {
      return Module.webglContextAttributes.preserveDrawingBuffer;
    },
  };
  function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
      var callback = callbacks.shift();
      if (typeof callback == "function") {
        callback(Module);
        continue;
      }
      var func = callback.func;
      if (typeof func === "number") {
        if (callback.arg === undefined) {
          (function () {
            dynCall_v.call(null, func);
          })();
        } else {
          (function (a1) {
            dynCall_vi.apply(null, [func, a1]);
          })(callback.arg);
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg);
      }
    }
  }
  function demangle(func) {
    return func;
  }
  function demangleAll(text) {
    var regex = /\b_Z[\w\d_]+/g;
    return text.replace(regex, function (x) {
      var y = demangle(x);
      return x === y ? x : y + " [" + x + "]";
    });
  }
  function jsStackTrace() {
    var error = new Error();
    if (!error.stack) {
      try {
        throw new Error();
      } catch (e) {
        error = e;
      }
      if (!error.stack) {
        return "(no stack trace available)";
      }
    }
    return error.stack.toString();
  }
  var runtimeKeepaliveCounter = 0;
  function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0;
  }
  function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js);
  }
  function _ClickedBoolTestButton(value) {
    dispatchReactUnityEvent("ClickedBoolTestButton", value === 1);
  }
  function _ClickedNumberTestButton(value) {
    dispatchReactUnityEvent("ClickedNumberTestButton", value);
  }
  function _ClickedNumbersTestButton(values, length) {
    var array = new Array(length);
    for (var i = 0; i < length; i++) {
      array[i] = HEAPF32[(array >> 2) + i];
    }
    dispatchReactUnityEvent("ClickedNumbersTestButton", array);
  }
  function _ClickedObjectTestButton(stringValue, intValue, boolValue) {
    dispatchReactUnityEvent("ClickedObjectTestButton", {
      stringValue: UTF8ToString(stringValue),
      intValue: intValue,
      boolValue: boolValue === 1,
    });
  }
  function _ClickedStringTestButton(value) {
    dispatchReactUnityEvent("ClickedStringTestButton", UTF8ToString(value));
  }
  function _ClickedTestButton() {
    dispatchReactUnityEvent("ClickedTestButton");
  }
  var JS_Accelerometer = null;
  var JS_Accelerometer_callback = 0;
  function _JS_Accelerometer_IsRunning() {
    return (
      (JS_Accelerometer && JS_Accelerometer.activated) ||
      JS_Accelerometer_callback != 0
    );
  }
  var JS_Accelerometer_multiplier = 1;
  var JS_Accelerometer_lastValue = { x: 0, y: 0, z: 0 };
  function JS_Accelerometer_eventHandler() {
    JS_Accelerometer_lastValue = {
      x: JS_Accelerometer.x * JS_Accelerometer_multiplier,
      y: JS_Accelerometer.y * JS_Accelerometer_multiplier,
      z: JS_Accelerometer.z * JS_Accelerometer_multiplier,
    };
    if (JS_Accelerometer_callback != 0)
      dynCall_vfff(
        JS_Accelerometer_callback,
        JS_Accelerometer_lastValue.x,
        JS_Accelerometer_lastValue.y,
        JS_Accelerometer_lastValue.z
      );
  }
  var JS_Accelerometer_frequencyRequest = 0;
  var JS_Accelerometer_frequency = 0;
  var JS_LinearAccelerationSensor_callback = 0;
  var JS_GravitySensor_callback = 0;
  var JS_Gyroscope_callback = 0;
  function JS_ComputeGravity(accelerometerValue, linearAccelerationValue) {
    var difference = {
      x: accelerometerValue.x - linearAccelerationValue.x,
      y: accelerometerValue.y - linearAccelerationValue.y,
      z: accelerometerValue.z - linearAccelerationValue.z,
    };
    var differenceMagnitudeSq =
      difference.x * difference.x +
      difference.y * difference.y +
      difference.z * difference.z;
    var sum = {
      x: accelerometerValue.x + linearAccelerationValue.x,
      y: accelerometerValue.y + linearAccelerationValue.y,
      z: accelerometerValue.z + linearAccelerationValue.z,
    };
    var sumMagnitudeSq = sum.x * sum.x + sum.y * sum.y + sum.z * sum.z;
    return differenceMagnitudeSq <= sumMagnitudeSq ? difference : sum;
  }
  function JS_DeviceMotion_eventHandler(event) {
    var accelerometerValue = {
      x: event.accelerationIncludingGravity.x * JS_Accelerometer_multiplier,
      y: event.accelerationIncludingGravity.y * JS_Accelerometer_multiplier,
      z: event.accelerationIncludingGravity.z * JS_Accelerometer_multiplier,
    };
    if (JS_Accelerometer_callback != 0)
      dynCall_vfff(
        JS_Accelerometer_callback,
        accelerometerValue.x,
        accelerometerValue.y,
        accelerometerValue.z
      );
    var linearAccelerationValue = {
      x: event.acceleration.x * JS_Accelerometer_multiplier,
      y: event.acceleration.y * JS_Accelerometer_multiplier,
      z: event.acceleration.z * JS_Accelerometer_multiplier,
    };
    if (JS_LinearAccelerationSensor_callback != 0)
      dynCall_vfff(
        JS_LinearAccelerationSensor_callback,
        linearAccelerationValue.x,
        linearAccelerationValue.y,
        linearAccelerationValue.z
      );
    if (JS_GravitySensor_callback != 0) {
      var gravityValue = JS_ComputeGravity(
        accelerometerValue,
        linearAccelerationValue
      );
      dynCall_vfff(
        JS_GravitySensor_callback,
        gravityValue.x,
        gravityValue.y,
        gravityValue.z
      );
    }
    if (JS_Gyroscope_callback != 0) {
      var degToRad = Math.PI / 180;
      dynCall_vfff(
        JS_Gyroscope_callback,
        event.rotationRate.alpha * degToRad,
        event.rotationRate.beta * degToRad,
        event.rotationRate.gamma * degToRad
      );
    }
  }
  var JS_DeviceSensorPermissions = 0;
  function JS_RequestDeviceSensorPermissions(permissions) {
    if (permissions & 1) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then(function (permissionState) {
            if (permissionState === "granted") {
              JS_DeviceSensorPermissions &= ~1;
            } else {
              warnOnce("DeviceOrientationEvent permission not granted");
            }
          })
          .catch(function (err) {
            warnOnce(err);
            JS_DeviceSensorPermissions |= 1;
          });
      }
    }
    if (permissions & 2) {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
          .then(function (permissionState) {
            if (permissionState === "granted") {
              JS_DeviceSensorPermissions &= ~2;
            } else {
              warnOnce("DeviceMotionEvent permission not granted");
            }
          })
          .catch(function (err) {
            warnOnce(err);
            JS_DeviceSensorPermissions |= 2;
          });
      }
    }
  }
  function JS_DeviceMotion_add() {
    if (
      JS_Accelerometer_callback == 0 &&
      JS_LinearAccelerationSensor_callback == 0 &&
      JS_GravitySensor_callback == 0 &&
      JS_Gyroscope_callback == 0
    ) {
      JS_RequestDeviceSensorPermissions(2);
      window.addEventListener("devicemotion", JS_DeviceMotion_eventHandler);
    }
  }
  function JS_DefineAccelerometerMultiplier() {
    var g = 9.80665;
    JS_Accelerometer_multiplier = /(iPhone|iPad|Macintosh)/i.test(
      navigator.userAgent
    )
      ? 1 / g
      : -1 / g;
  }
  function _JS_Accelerometer_Start(callback, frequency) {
    JS_DefineAccelerometerMultiplier();
    if (typeof Accelerometer === "undefined") {
      JS_DeviceMotion_add();
      if (callback != 0) JS_Accelerometer_callback = callback;
      return;
    }
    if (callback != 0) JS_Accelerometer_callback = callback;
    function InitializeAccelerometer(frequency) {
      JS_Accelerometer = new Accelerometer({
        frequency: frequency,
        referenceFrame: "device",
      });
      JS_Accelerometer.addEventListener(
        "reading",
        JS_Accelerometer_eventHandler
      );
      JS_Accelerometer.addEventListener("error", function (e) {
        warnOnce(e.error ? e.error : e);
      });
      JS_Accelerometer.start();
      JS_Accelerometer_frequency = frequency;
    }
    if (JS_Accelerometer) {
      if (JS_Accelerometer_frequency != frequency) {
        JS_Accelerometer.stop();
        JS_Accelerometer.removeEventListener(
          "reading",
          JS_Accelerometer_eventHandler
        );
        InitializeAccelerometer(frequency);
      }
    } else if (JS_Accelerometer_frequencyRequest != 0) {
      JS_Accelerometer_frequencyRequest = frequency;
    } else {
      JS_Accelerometer_frequencyRequest = frequency;
      navigator.permissions
        .query({ name: "accelerometer" })
        .then(function (result) {
          if (result.state === "granted") {
            InitializeAccelerometer(JS_Accelerometer_frequencyRequest);
          } else {
            warnOnce("No permission to use Accelerometer.");
          }
          JS_Accelerometer_frequencyRequest = 0;
        });
    }
  }
  function JS_DeviceMotion_remove() {
    if (
      JS_Accelerometer_callback == 0 &&
      JS_LinearAccelerationSensor_callback == 0 &&
      JS_GravitySensor_callback == 0 &&
      JS_Gyroscope_callback == 0
    ) {
      window.removeEventListener(
        "devicemotion",
        JS_DeviceOrientation_eventHandler
      );
    }
  }
  function _JS_Accelerometer_Stop() {
    if (JS_Accelerometer) {
      if (
        typeof GravitySensor !== "undefined" ||
        JS_GravitySensor_callback == 0
      ) {
        JS_Accelerometer.stop();
        JS_Accelerometer.removeEventListener(
          "reading",
          JS_Accelerometer_eventHandler
        );
        JS_Accelerometer = null;
      }
      JS_Accelerometer_callback = 0;
      JS_Accelerometer_frequency = 0;
    } else if (JS_Accelerometer_callback != 0) {
      JS_Accelerometer_callback = 0;
      JS_DeviceMotion_remove();
    }
  }
  function _JS_Cursor_SetImage(ptr, length) {
    var binary = "";
    for (var i = 0; i < length; i++)
      binary += String.fromCharCode(HEAPU8[ptr + i]);
    Module.canvas.style.cursor =
      "url(data:image/cur;base64," + btoa(binary) + "),default";
  }
  function _JS_Cursor_SetShow(show) {
    Module.canvas.style.cursor = show ? "default" : "none";
  }
  function jsDomCssEscapeId(id) {
    if (
      typeof window.CSS !== "undefined" &&
      typeof window.CSS.escape !== "undefined"
    ) {
      return window.CSS.escape(id);
    }
    return id.replace(/(#|\.|\+|\[|\]|\(|\)|\{|\})/g, "\\$1");
  }
  function _JS_DOM_MapViewportCoordinateToElementLocalCoordinate(
    viewportX,
    viewportY,
    targetX,
    targetY
  ) {
    var canvasId = Module["canvas"] ? Module["canvas"].id : "unity-canvas";
    var canvasSelector = "#" + jsDomCssEscapeId(canvasId);
    var canvas = document.querySelector(canvasSelector);
    var rect = canvas.getBoundingClientRect();
    HEAPU32[targetX >> 2] = viewportX - rect.left;
    HEAPU32[targetY >> 2] = viewportY - rect.top;
  }
  function stringToNewUTF8(jsString) {
    var length = lengthBytesUTF8(jsString) + 1;
    var cString = _malloc(length);
    stringToUTF8(jsString, cString, length);
    return cString;
  }
  function _JS_DOM_UnityCanvasSelector() {
    if (!_JS_DOM_UnityCanvasSelector.ptr) {
      var canvasId = Module["canvas"] ? Module["canvas"].id : "unity-canvas";
      var canvasSelector = "#" + jsDomCssEscapeId(canvasId);
      _JS_DOM_UnityCanvasSelector.ptr = stringToNewUTF8(canvasSelector);
    }
    return _JS_DOM_UnityCanvasSelector.ptr;
  }
  var fs = {
    numPendingSync: 0,
    syncInternal: 1e3,
    syncInProgress: false,
    sync: function (onlyPendingSync) {
      if (onlyPendingSync) {
        if (fs.numPendingSync == 0) return;
      } else if (fs.syncInProgress) {
        fs.numPendingSync++;
        return;
      }
      fs.syncInProgress = true;
      FS.syncfs(false, function (err) {
        fs.syncInProgress = false;
      });
      fs.numPendingSync = 0;
    },
  };
  function _JS_FileSystem_Initialize() {
    Module.setInterval(function () {
      fs.sync(true);
    }, fs.syncInternal);
  }
  function _JS_FileSystem_Sync() {
    fs.sync(false);
  }
  function _JS_Focus_Window() {
    var activeElem = document.activeElement;
    var canvasId = Module["canvas"] ? Module["canvas"].id : "unity-canvas";
    var canvasSelector = "#" + jsDomCssEscapeId(canvasId);
    var canvas = document.querySelector(canvasSelector);
    if (
      activeElem != canvas &&
      activeElem != window &&
      activeElem != document.body
    ) {
      window.focus();
    }
  }
  var JS_GravitySensor = null;
  function _JS_GravitySensor_IsRunning() {
    return typeof GravitySensor !== "undefined"
      ? JS_GravitySensor && JS_GravitySensor.activated
      : JS_GravitySensor_callback != 0;
  }
  function JS_GravitySensor_eventHandler() {
    if (JS_GravitySensor_callback != 0)
      dynCall_vfff(
        JS_GravitySensor_callback,
        JS_GravitySensor.x * JS_Accelerometer_multiplier,
        JS_GravitySensor.y * JS_Accelerometer_multiplier,
        JS_GravitySensor.z * JS_Accelerometer_multiplier
      );
  }
  var JS_GravitySensor_frequencyRequest = 0;
  var JS_LinearAccelerationSensor = null;
  function JS_LinearAccelerationSensor_eventHandler() {
    var linearAccelerationValue = {
      x: JS_LinearAccelerationSensor.x * JS_Accelerometer_multiplier,
      y: JS_LinearAccelerationSensor.y * JS_Accelerometer_multiplier,
      z: JS_LinearAccelerationSensor.z * JS_Accelerometer_multiplier,
    };
    if (JS_LinearAccelerationSensor_callback != 0)
      dynCall_vfff(
        JS_LinearAccelerationSensor_callback,
        linearAccelerationValue.x,
        linearAccelerationValue.y,
        linearAccelerationValue.z
      );
    if (
      JS_GravitySensor_callback != 0 &&
      typeof GravitySensor === "undefined"
    ) {
      var gravityValue = JS_ComputeGravity(
        JS_Accelerometer_lastValue,
        linearAccelerationValue
      );
      dynCall_vfff(
        JS_GravitySensor_callback,
        gravityValue.x,
        gravityValue.y,
        gravityValue.z
      );
    }
  }
  var JS_LinearAccelerationSensor_frequencyRequest = 0;
  var JS_LinearAccelerationSensor_frequency = 0;
  function _JS_LinearAccelerationSensor_Start(callback, frequency) {
    JS_DefineAccelerometerMultiplier();
    if (typeof LinearAccelerationSensor === "undefined") {
      JS_DeviceMotion_add();
      if (callback != 0) JS_LinearAccelerationSensor_callback = callback;
      return;
    }
    if (callback != 0) JS_LinearAccelerationSensor_callback = callback;
    function InitializeLinearAccelerationSensor(frequency) {
      JS_LinearAccelerationSensor = new LinearAccelerationSensor({
        frequency: frequency,
        referenceFrame: "device",
      });
      JS_LinearAccelerationSensor.addEventListener(
        "reading",
        JS_LinearAccelerationSensor_eventHandler
      );
      JS_LinearAccelerationSensor.addEventListener("error", function (e) {
        warnOnce(e.error ? e.error : e);
      });
      JS_LinearAccelerationSensor.start();
      JS_LinearAccelerationSensor_frequency = frequency;
    }
    if (JS_LinearAccelerationSensor) {
      if (JS_LinearAccelerationSensor_frequency != frequency) {
        JS_LinearAccelerationSensor.stop();
        JS_LinearAccelerationSensor.removeEventListener(
          "reading",
          JS_LinearAccelerationSensor_eventHandler
        );
        InitializeLinearAccelerationSensor(frequency);
      }
    } else if (JS_LinearAccelerationSensor_frequencyRequest != 0) {
      JS_LinearAccelerationSensor_frequencyRequest = frequency;
    } else {
      JS_LinearAccelerationSensor_frequencyRequest = frequency;
      navigator.permissions
        .query({ name: "accelerometer" })
        .then(function (result) {
          if (result.state === "granted") {
            InitializeLinearAccelerationSensor(
              JS_LinearAccelerationSensor_frequencyRequest
            );
          } else {
            warnOnce("No permission to use LinearAccelerationSensor.");
          }
          JS_LinearAccelerationSensor_frequencyRequest = 0;
        });
    }
  }
  function _JS_GravitySensor_Start(callback, frequency) {
    if (typeof GravitySensor === "undefined") {
      _JS_Accelerometer_Start(
        0,
        Math.max(frequency, JS_Accelerometer_frequency)
      );
      _JS_LinearAccelerationSensor_Start(
        0,
        Math.max(frequency, JS_LinearAccelerationSensor_frequency)
      );
      JS_GravitySensor_callback = callback;
      return;
    }
    JS_DefineAccelerometerMultiplier();
    JS_GravitySensor_callback = callback;
    function InitializeGravitySensor(frequency) {
      JS_GravitySensor = new GravitySensor({
        frequency: frequency,
        referenceFrame: "device",
      });
      JS_GravitySensor.addEventListener(
        "reading",
        JS_GravitySensor_eventHandler
      );
      JS_GravitySensor.addEventListener("error", function (e) {
        warnOnce(e.error ? e.error : e);
      });
      JS_GravitySensor.start();
    }
    if (JS_GravitySensor) {
      JS_GravitySensor.stop();
      JS_GravitySensor.removeEventListener(
        "reading",
        JS_GravitySensor_eventHandler
      );
      InitializeGravitySensor(frequency);
    } else if (JS_GravitySensor_frequencyRequest != 0) {
      JS_GravitySensor_frequencyRequest = frequency;
    } else {
      JS_GravitySensor_frequencyRequest = frequency;
      navigator.permissions
        .query({ name: "accelerometer" })
        .then(function (result) {
          if (result.state === "granted") {
            InitializeGravitySensor(JS_GravitySensor_frequencyRequest);
          } else {
            warnOnce("No permission to use GravitySensor.");
          }
          JS_GravitySensor_frequencyRequest = 0;
        });
    }
  }
  function _JS_LinearAccelerationSensor_Stop() {
    if (JS_LinearAccelerationSensor) {
      if (
        typeof GravitySensor !== "undefined" ||
        JS_GravitySensor_callback == 0
      ) {
        JS_LinearAccelerationSensor.stop();
        JS_LinearAccelerationSensor.removeEventListener(
          "reading",
          JS_LinearAccelerationSensor_eventHandler
        );
        JS_LinearAccelerationSensor = null;
      }
      JS_LinearAccelerationSensor_callback = 0;
      JS_LinearAccelerationSensor_frequency = 0;
    } else if (JS_LinearAccelerationSensor_callback != 0) {
      JS_LinearAccelerationSensor_callback = 0;
      JS_DeviceMotion_remove();
    }
  }
  function _JS_GravitySensor_Stop() {
    JS_GravitySensor_callback = 0;
    if (typeof GravitySensor === "undefined") {
      if (JS_Accelerometer_callback == 0) _JS_Accelerometer_Stop();
      if (JS_LinearAccelerationSensor_callback == 0)
        _JS_LinearAccelerationSensor_Stop();
      return;
    }
    if (JS_GravitySensor) {
      JS_GravitySensor.stop();
      JS_GravitySensor.removeEventListener(
        "reading",
        JS_GravitySensor_eventHandler
      );
      JS_GravitySensor = null;
    }
  }
  var JS_Gyroscope = null;
  function _JS_Gyroscope_IsRunning() {
    return (
      (JS_Gyroscope && JS_Gyroscope.activated) || JS_Gyroscope_callback != 0
    );
  }
  function JS_Gyroscope_eventHandler() {
    if (JS_Gyroscope_callback != 0)
      dynCall_vfff(
        JS_Gyroscope_callback,
        JS_Gyroscope.x,
        JS_Gyroscope.y,
        JS_Gyroscope.z
      );
  }
  var JS_Gyroscope_frequencyRequest = 0;
  function _JS_Gyroscope_Start(callback, frequency) {
    if (typeof Gyroscope === "undefined") {
      JS_DeviceMotion_add();
      JS_Gyroscope_callback = callback;
      return;
    }
    JS_Gyroscope_callback = callback;
    function InitializeGyroscope(frequency) {
      JS_Gyroscope = new Gyroscope({
        frequency: frequency,
        referenceFrame: "device",
      });
      JS_Gyroscope.addEventListener("reading", JS_Gyroscope_eventHandler);
      JS_Gyroscope.addEventListener("error", function (e) {
        warnOnce(e.error ? e.error : e);
      });
      JS_Gyroscope.start();
    }
    if (JS_Gyroscope) {
      JS_Gyroscope.stop();
      JS_Gyroscope.removeEventListener("reading", JS_Gyroscope_eventHandler);
      InitializeGyroscope(frequency);
    } else if (JS_Gyroscope_frequencyRequest != 0) {
      JS_Gyroscope_frequencyRequest = frequency;
    } else {
      JS_Gyroscope_frequencyRequest = frequency;
      navigator.permissions
        .query({ name: "gyroscope" })
        .then(function (result) {
          if (result.state === "granted") {
            InitializeGyroscope(JS_Gyroscope_frequencyRequest);
          } else {
            warnOnce("No permission to use Gyroscope.");
          }
          JS_Gyroscope_frequencyRequest = 0;
        });
    }
  }
  function _JS_Gyroscope_Stop() {
    if (JS_Gyroscope) {
      JS_Gyroscope.stop();
      JS_Gyroscope.removeEventListener("reading", JS_Gyroscope_eventHandler);
      JS_Gyroscope = null;
      JS_Gyroscope_callback = 0;
    } else if (JS_Gyroscope_callback != 0) {
      JS_Gyroscope_callback = 0;
      JS_DeviceMotion_remove();
    }
  }
  function _JS_LinearAccelerationSensor_IsRunning() {
    return (
      (JS_LinearAccelerationSensor && JS_LinearAccelerationSensor.activated) ||
      JS_LinearAccelerationSensor_callback != 0
    );
  }
  function _JS_Log_Dump(ptr, type) {
    var str = UTF8ToString(ptr);
    if (typeof dump == "function") dump(str);
    switch (type) {
      case 0:
      case 1:
      case 4:
        console.error(str);
        return;
      case 2:
        console.warn(str);
        return;
      case 3:
      case 5:
        console.log(str);
        return;
      default:
        console.error("Unknown console message type!");
        console.error(str);
    }
  }
  function _JS_Log_StackTrace(buffer, bufferSize) {
    var trace = stackTrace();
    if (buffer) stringToUTF8(trace, buffer, bufferSize);
    return lengthBytesUTF8(trace);
  }
  var mobile_input_hide_delay = null;
  var mobile_input_text = null;
  var mobile_input = null;
  var mobile_input_ignore_blur_event = false;
  function _JS_MobileKeybard_GetIgnoreBlurEvent() {
    return mobile_input_ignore_blur_event;
  }
  function _JS_MobileKeyboard_GetKeyboardStatus() {
    var kKeyboardStatusVisible = 0;
    var kKeyboardStatusDone = 1;
    if (!mobile_input) return kKeyboardStatusDone;
    return kKeyboardStatusVisible;
  }
  function _JS_MobileKeyboard_GetText(buffer, bufferSize) {
    var text =
      mobile_input && mobile_input.input
        ? mobile_input.input.value
        : mobile_input_text
        ? mobile_input_text
        : "";
    if (buffer) stringToUTF8(text, buffer, bufferSize);
    return lengthBytesUTF8(text);
  }
  function _JS_MobileKeyboard_GetTextSelection(outStart, outLength) {
    if (!mobile_input) {
      HEAP32[outStart >> 2] = 0;
      HEAP32[outLength >> 2] = 0;
      return;
    }
    HEAP32[outStart >> 2] = mobile_input.input.selectionStart;
    HEAP32[outLength >> 2] =
      mobile_input.input.selectionEnd - mobile_input.input.selectionStart;
  }
  function _JS_MobileKeyboard_Hide(delay) {
    if (mobile_input_hide_delay) return;
    mobile_input_ignore_blur_event = true;
    function hideMobileKeyboard() {
      if (mobile_input && mobile_input.input) {
        mobile_input_text = mobile_input.input.value;
        mobile_input.input = null;
        if (mobile_input.parentNode && mobile_input.parentNode) {
          mobile_input.parentNode.removeChild(mobile_input);
        }
      }
      mobile_input = null;
      mobile_input_hide_delay = null;
      setTimeout(function () {
        mobile_input_ignore_blur_event = false;
      }, 100);
    }
    if (delay) {
      var hideDelay = 200;
      mobile_input_hide_delay = setTimeout(hideMobileKeyboard, hideDelay);
    } else {
      hideMobileKeyboard();
    }
  }
  function _JS_MobileKeyboard_SetCharacterLimit(limit) {
    if (!mobile_input) return;
    mobile_input.input.maxLength = limit;
  }
  function _JS_MobileKeyboard_SetText(text) {
    if (!mobile_input) return;
    text = UTF8ToString(text);
    mobile_input.input.value = text;
  }
  function _JS_MobileKeyboard_SetTextSelection(start, length) {
    if (!mobile_input) return;
    mobile_input.input.setSelectionRange(start, start + length);
  }
  function _JS_MobileKeyboard_Show(
    text,
    keyboardType,
    autocorrection,
    multiline,
    secure,
    alert,
    placeholder,
    characterLimit
  ) {
    if (mobile_input_hide_delay) {
      clearTimeout(mobile_input_hide_delay);
      mobile_input_hide_delay = null;
    }
    text = UTF8ToString(text);
    mobile_input_text = text;
    placeholder = UTF8ToString(placeholder);
    var container = document.body;
    var hasExistingMobileInput = !!mobile_input;
    var input_type;
    var KEYBOARD_TYPE_NUMBERS_AND_PUNCTUATION = 2;
    var KEYBOARD_TYPE_URL = 3;
    var KEYBOARD_TYPE_NUMBER_PAD = 4;
    var KEYBOARD_TYPE_PHONE_PAD = 5;
    var KEYBOARD_TYPE_EMAIL_ADDRESS = 7;
    if (!secure) {
      switch (keyboardType) {
        case KEYBOARD_TYPE_EMAIL_ADDRESS:
          input_type = "email";
          break;
        case KEYBOARD_TYPE_URL:
          input_type = "url";
          break;
        case KEYBOARD_TYPE_NUMBERS_AND_PUNCTUATION:
        case KEYBOARD_TYPE_NUMBER_PAD:
        case KEYBOARD_TYPE_PHONE_PAD:
          input_type = "number";
          break;
        default:
          input_type = "text";
          break;
      }
    } else {
      input_type = "password";
    }
    if (hasExistingMobileInput) {
      if (mobile_input.multiline != multiline) {
        _JS_MobileKeyboard_Hide(false);
        return;
      }
    }
    var inputContainer = mobile_input || document.createElement("div");
    if (!hasExistingMobileInput) {
      inputContainer.style =
        "width:100%; height:" +
        (multiline ? "150px" : "100px") +
        "; position:fixed; bottom:0px; margin:0; padding:0; left:0px; box-sizing:border-box; background-color:#fff; font-size:14pt;";
      container.appendChild(inputContainer);
      mobile_input = inputContainer;
    }
    var input = hasExistingMobileInput
      ? mobile_input.input
      : document.createElement(multiline ? "textarea" : "input");
    mobile_input.multiline = multiline;
    mobile_input.secure = secure;
    mobile_input.keyboardType = keyboardType;
    mobile_input.inputType = input_type;
    input.type = input_type;
    input.style =
      "width:100%; " +
      (multiline ? "height:100px;" : "") +
      "cursor:default; resize:none; border:1px solid #000; padding:10px;";
    input.spellcheck = autocorrection ? true : false;
    input.maxLength = characterLimit > 0 ? characterLimit : 524288;
    input.value = text;
    input.placeholder = placeholder;
    if (!hasExistingMobileInput) {
      inputContainer.appendChild(input);
      inputContainer.input = input;
    }
    if (!hasExistingMobileInput) {
      var okButton = document.createElement("button");
      okButton.innerText = "OK";
      okButton.style =
        "border:0; position:absolute; left:calc(100% - 75px); top:4px; width:75px; height:30px; margin:0; padding:0; background-color:#fff;";
      okButton.addEventListener("touchend", function () {
        _JS_MobileKeyboard_Hide(true);
      });
      inputContainer.appendChild(okButton);
      inputContainer.okButton = okButton;
      input.addEventListener("keyup", function (e) {
        if (input.parentNode.multiline) return;
        if (e.code == "Enter" || e.which == 13 || e.keyCode == 13) {
          _JS_MobileKeyboard_Hide(true);
        }
      });
      input.addEventListener("blur", function (e) {
        _JS_MobileKeyboard_Hide(true);
        e.stopPropagation();
        e.preventDefault();
      });
      input.select();
      input.focus();
    } else {
      input.select();
    }
  }
  var JS_OrientationSensor = null;
  var JS_OrientationSensor_callback = 0;
  function _JS_OrientationSensor_IsRunning() {
    return (
      (JS_OrientationSensor && JS_OrientationSensor.activated) ||
      JS_OrientationSensor_callback != 0
    );
  }
  function JS_OrientationSensor_eventHandler() {
    if (JS_OrientationSensor_callback != 0)
      dynCall_vffff(
        JS_OrientationSensor_callback,
        JS_OrientationSensor.quaternion[0],
        JS_OrientationSensor.quaternion[1],
        JS_OrientationSensor.quaternion[2],
        JS_OrientationSensor.quaternion[3]
      );
  }
  var JS_OrientationSensor_frequencyRequest = 0;
  function JS_DeviceOrientation_eventHandler(event) {
    if (JS_OrientationSensor_callback) {
      var degToRad = Math.PI / 180;
      var x = event.beta * degToRad;
      var y = event.gamma * degToRad;
      var z = event.alpha * degToRad;
      var cx = Math.cos(x / 2);
      var sx = Math.sin(x / 2);
      var cy = Math.cos(y / 2);
      var sy = Math.sin(y / 2);
      var cz = Math.cos(z / 2);
      var sz = Math.sin(z / 2);
      var qx = sx * cy * cz - cx * sy * sz;
      var qy = cx * sy * cz + sx * cy * sz;
      var qz = cx * cy * sz + sx * sy * cz;
      var qw = cx * cy * cz - sx * sy * sz;
      dynCall_vffff(JS_OrientationSensor_callback, qx, qy, qz, qw);
    }
  }
  function _JS_OrientationSensor_Start(callback, frequency) {
    if (typeof RelativeOrientationSensor === "undefined") {
      if (JS_OrientationSensor_callback == 0) {
        JS_OrientationSensor_callback = callback;
        JS_RequestDeviceSensorPermissions(1);
        window.addEventListener(
          "deviceorientation",
          JS_DeviceOrientation_eventHandler
        );
      }
      return;
    }
    JS_OrientationSensor_callback = callback;
    function InitializeOrientationSensor(frequency) {
      JS_OrientationSensor = new RelativeOrientationSensor({
        frequency: frequency,
        referenceFrame: "device",
      });
      JS_OrientationSensor.addEventListener(
        "reading",
        JS_OrientationSensor_eventHandler
      );
      JS_OrientationSensor.addEventListener("error", function (e) {
        warnOnce(e.error ? e.error : e);
      });
      JS_OrientationSensor.start();
    }
    if (JS_OrientationSensor) {
      JS_OrientationSensor.stop();
      JS_OrientationSensor.removeEventListener(
        "reading",
        JS_OrientationSensor_eventHandler
      );
      InitializeOrientationSensor(frequency);
    } else if (JS_OrientationSensor_frequencyRequest != 0) {
      JS_OrientationSensor_frequencyRequest = frequency;
    } else {
      JS_OrientationSensor_frequencyRequest = frequency;
      Promise.all([
        navigator.permissions.query({ name: "accelerometer" }),
        navigator.permissions.query({ name: "gyroscope" }),
      ]).then(function (results) {
        if (
          results.every(function (result) {
            return result.state === "granted";
          })
        ) {
          InitializeOrientationSensor(JS_OrientationSensor_frequencyRequest);
        } else {
          warnOnce("No permissions to use RelativeOrientationSensor.");
        }
        JS_OrientationSensor_frequencyRequest = 0;
      });
    }
  }
  function _JS_OrientationSensor_Stop() {
    if (JS_OrientationSensor) {
      JS_OrientationSensor.stop();
      JS_OrientationSensor.removeEventListener(
        "reading",
        JS_OrientationSensor_eventHandler
      );
      JS_OrientationSensor = null;
    } else if (JS_OrientationSensor_callback != 0) {
      window.removeEventListener(
        "deviceorientation",
        JS_DeviceOrientation_eventHandler
      );
    }
    JS_OrientationSensor_callback = 0;
  }
  function _JS_RequestDeviceSensorPermissionsOnTouch() {
    if (JS_DeviceSensorPermissions == 0) return;
    JS_RequestDeviceSensorPermissions(JS_DeviceSensorPermissions);
  }
  function _JS_RunQuitCallbacks() {
    Module.QuitCleanup();
  }
  var JS_ScreenOrientation_callback = 0;
  function JS_ScreenOrientation_eventHandler() {
    if (JS_ScreenOrientation_callback)
      dynCall_viii(
        JS_ScreenOrientation_callback,
        window.innerWidth,
        window.innerHeight,
        screen.orientation ? screen.orientation.angle : window.orientation
      );
  }
  function _JS_ScreenOrientation_DeInit() {
    JS_ScreenOrientation_callback = 0;
    window.removeEventListener("resize", JS_ScreenOrientation_eventHandler);
    if (screen.orientation) {
      screen.orientation.removeEventListener(
        "change",
        JS_ScreenOrientation_eventHandler
      );
    }
  }
  function _JS_ScreenOrientation_Init(callback) {
    if (!JS_ScreenOrientation_callback) {
      if (screen.orientation) {
        screen.orientation.addEventListener(
          "change",
          JS_ScreenOrientation_eventHandler
        );
      }
      window.addEventListener("resize", JS_ScreenOrientation_eventHandler);
      JS_ScreenOrientation_callback = callback;
      setTimeout(JS_ScreenOrientation_eventHandler, 0);
    }
  }
  var JS_ScreenOrientation_requestedLockType = -1;
  var JS_ScreenOrientation_appliedLockType = -1;
  var JS_ScreenOrientation_timeoutID = -1;
  function _JS_ScreenOrientation_Lock(orientationLockType) {
    if (!screen.orientation) {
      return;
    }
    function applyLock() {
      JS_ScreenOrientation_appliedLockType =
        JS_ScreenOrientation_requestedLockType;
      var screenOrientations = [
        "any",
        0,
        "landscape",
        "portrait",
        "portrait-primary",
        "portrait-secondary",
        "landscape-primary",
        "landscape-secondary",
      ];
      var type = screenOrientations[JS_ScreenOrientation_appliedLockType];
      screen.orientation
        .lock(type)
        .then(function () {
          if (
            JS_ScreenOrientation_requestedLockType !=
            JS_ScreenOrientation_appliedLockType
          ) {
            JS_ScreenOrientation_timeoutID = setTimeout(applyLock, 0);
          } else {
            JS_ScreenOrientation_timeoutID = -1;
          }
        })
        .catch(function (err) {
          warnOnce(err);
          JS_ScreenOrientation_timeoutID = -1;
        });
    }
    JS_ScreenOrientation_requestedLockType = orientationLockType;
    if (
      JS_ScreenOrientation_timeoutID == -1 &&
      orientationLockType != JS_ScreenOrientation_appliedLockType
    ) {
      JS_ScreenOrientation_timeoutID = setTimeout(applyLock, 0);
    }
  }
  var WEBAudio = {
    audioInstanceIdCounter: 0,
    audioInstances: {},
    audioContext: null,
    audioWebEnabled: 0,
    audioCache: [],
    pendingAudioSources: {},
  };
  function _JS_Sound_ResumeIfNeeded() {
    if (WEBAudio.audioWebEnabled == 0) return;
    if (WEBAudio.audioContext.state === "suspended")
      WEBAudio.audioContext.resume();
  }
  function _JS_SystemInfo_GetCanvasClientSize(
    domElementSelector,
    outWidth,
    outHeight
  ) {
    var selector = UTF8ToString(domElementSelector);
    var canvas =
      selector == "#canvas"
        ? Module["canvas"]
        : document.querySelector(selector);
    var w = 0,
      h = 0;
    if (canvas) {
      var size = canvas.getBoundingClientRect();
      w = size.width;
      h = size.height;
    }
    HEAPF64[outWidth >> 3] = w;
    HEAPF64[outHeight >> 3] = h;
  }
  function _JS_SystemInfo_GetDocumentURL(buffer, bufferSize) {
    if (buffer) stringToUTF8(document.URL, buffer, bufferSize);
    return lengthBytesUTF8(document.URL);
  }
  function _JS_SystemInfo_GetGPUInfo(buffer, bufferSize) {
    var gpuinfo = Module.SystemInfo.gpu;
    if (buffer) stringToUTF8(gpuinfo, buffer, bufferSize);
    return lengthBytesUTF8(gpuinfo);
  }
  function _JS_SystemInfo_GetMatchWebGLToCanvasSize() {
    return (
      Module.matchWebGLToCanvasSize ||
      Module.matchWebGLToCanvasSize === undefined
    );
  }
  function _JS_SystemInfo_GetMemory() {
    return HEAPU8.length / (1024 * 1024);
  }
  function _JS_SystemInfo_GetOS(buffer, bufferSize) {
    var browser = Module.SystemInfo.os + " " + Module.SystemInfo.osVersion;
    if (buffer) stringToUTF8(browser, buffer, bufferSize);
    return lengthBytesUTF8(browser);
  }
  function _JS_SystemInfo_GetPreferredDevicePixelRatio() {
    return Module.matchWebGLToCanvasSize == false
      ? 1
      : Module.devicePixelRatio || window.devicePixelRatio || 1;
  }
  function _JS_SystemInfo_GetScreenSize(outWidth, outHeight) {
    HEAPF64[outWidth >> 3] = Module.SystemInfo.width;
    HEAPF64[outHeight >> 3] = Module.SystemInfo.height;
  }
  function _JS_SystemInfo_HasAstcHdr() {
    var ext = GLctx.getExtension("WEBGL_compressed_texture_astc");
    if (ext && ext.getSupportedProfiles) {
      return ext.getSupportedProfiles().includes("hdr");
    }
    return false;
  }
  function _JS_SystemInfo_HasCursorLock() {
    return Module.SystemInfo.hasCursorLock;
  }
  function _JS_SystemInfo_HasFullscreen() {
    return Module.SystemInfo.hasFullscreen;
  }
  function _JS_SystemInfo_HasWebGL() {
    return Module.SystemInfo.hasWebGL;
  }
  function _JS_UnityEngineShouldQuit() {
    return !!Module.shouldQuit;
  }
  var ExceptionInfoAttrs = {
    DESTRUCTOR_OFFSET: 0,
    REFCOUNT_OFFSET: 4,
    TYPE_OFFSET: 8,
    CAUGHT_OFFSET: 12,
    RETHROWN_OFFSET: 13,
    SIZE: 16,
  };
  function ___cxa_allocate_exception(size) {
    return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
  }
  function ExceptionInfo(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
    this.set_type = function (type) {
      HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2] = type;
    };
    this.get_type = function () {
      return HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2];
    };
    this.set_destructor = function (destructor) {
      HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2] =
        destructor;
    };
    this.get_destructor = function () {
      return HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2];
    };
    this.set_refcount = function (refcount) {
      HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = refcount;
    };
    this.set_caught = function (caught) {
      caught = caught ? 1 : 0;
      HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] = caught;
    };
    this.get_caught = function () {
      return HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] != 0;
    };
    this.set_rethrown = function (rethrown) {
      rethrown = rethrown ? 1 : 0;
      HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] = rethrown;
    };
    this.get_rethrown = function () {
      return HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] != 0;
    };
    this.init = function (type, destructor) {
      this.set_type(type);
      this.set_destructor(destructor);
      this.set_refcount(0);
      this.set_caught(false);
      this.set_rethrown(false);
    };
    this.add_ref = function () {
      var value = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2];
      HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = value + 1;
    };
    this.release_ref = function () {
      var prev = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2];
      HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = prev - 1;
      return prev === 1;
    };
  }
  function CatchInfo(ptr) {
    this.free = function () {
      _free(this.ptr);
      this.ptr = 0;
    };
    this.set_base_ptr = function (basePtr) {
      HEAP32[this.ptr >> 2] = basePtr;
    };
    this.get_base_ptr = function () {
      return HEAP32[this.ptr >> 2];
    };
    this.set_adjusted_ptr = function (adjustedPtr) {
      var ptrSize = 4;
      HEAP32[(this.ptr + ptrSize) >> 2] = adjustedPtr;
    };
    this.get_adjusted_ptr = function () {
      var ptrSize = 4;
      return HEAP32[(this.ptr + ptrSize) >> 2];
    };
    this.get_exception_ptr = function () {
      var isPointer = ___cxa_is_pointer_type(
        this.get_exception_info().get_type()
      );
      if (isPointer) {
        return HEAP32[this.get_base_ptr() >> 2];
      }
      var adjusted = this.get_adjusted_ptr();
      if (adjusted !== 0) return adjusted;
      return this.get_base_ptr();
    };
    this.get_exception_info = function () {
      return new ExceptionInfo(this.get_base_ptr());
    };
    if (ptr === undefined) {
      this.ptr = _malloc(8);
      this.set_adjusted_ptr(0);
    } else {
      this.ptr = ptr;
    }
  }
  var exceptionCaught = [];
  function exception_addRef(info) {
    info.add_ref();
  }
  var uncaughtExceptionCount = 0;
  function ___cxa_begin_catch(ptr) {
    var catchInfo = new CatchInfo(ptr);
    var info = catchInfo.get_exception_info();
    if (!info.get_caught()) {
      info.set_caught(true);
      uncaughtExceptionCount--;
    }
    info.set_rethrown(false);
    exceptionCaught.push(catchInfo);
    exception_addRef(info);
    return catchInfo.get_exception_ptr();
  }
  var exceptionLast = 0;
  function ___cxa_free_exception(ptr) {
    return _free(new ExceptionInfo(ptr).ptr);
  }
  function exception_decRef(info) {
    if (info.release_ref() && !info.get_rethrown()) {
      var destructor = info.get_destructor();
      if (destructor) {
        (function (a1) {
          return dynCall_ii.apply(null, [destructor, a1]);
        })(info.excPtr);
      }
      ___cxa_free_exception(info.excPtr);
    }
  }
  function ___cxa_end_catch() {
    _setThrew(0);
    var catchInfo = exceptionCaught.pop();
    exception_decRef(catchInfo.get_exception_info());
    catchInfo.free();
    exceptionLast = 0;
  }
  function ___resumeException(catchInfoPtr) {
    var catchInfo = new CatchInfo(catchInfoPtr);
    var ptr = catchInfo.get_base_ptr();
    if (!exceptionLast) {
      exceptionLast = ptr;
    }
    catchInfo.free();
    throw ptr;
  }
  function ___cxa_find_matching_catch_2() {
    var thrown = exceptionLast;
    if (!thrown) {
      setTempRet0(0);
      return 0 | 0;
    }
    var info = new ExceptionInfo(thrown);
    var thrownType = info.get_type();
    var catchInfo = new CatchInfo();
    catchInfo.set_base_ptr(thrown);
    if (!thrownType) {
      setTempRet0(0);
      return catchInfo.ptr | 0;
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var stackTop = stackSave();
    var exceptionThrowBuf = stackAlloc(4);
    HEAP32[exceptionThrowBuf >> 2] = thrown;
    for (var i = 0; i < typeArray.length; i++) {
      var caughtType = typeArray[i];
      if (caughtType === 0 || caughtType === thrownType) {
        break;
      }
      if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
        var adjusted = HEAP32[exceptionThrowBuf >> 2];
        if (thrown !== adjusted) {
          catchInfo.set_adjusted_ptr(adjusted);
        }
        setTempRet0(caughtType);
        return catchInfo.ptr | 0;
      }
    }
    stackRestore(stackTop);
    setTempRet0(thrownType);
    return catchInfo.ptr | 0;
  }
  function ___cxa_find_matching_catch_3() {
    var thrown = exceptionLast;
    if (!thrown) {
      setTempRet0(0);
      return 0 | 0;
    }
    var info = new ExceptionInfo(thrown);
    var thrownType = info.get_type();
    var catchInfo = new CatchInfo();
    catchInfo.set_base_ptr(thrown);
    if (!thrownType) {
      setTempRet0(0);
      return catchInfo.ptr | 0;
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var stackTop = stackSave();
    var exceptionThrowBuf = stackAlloc(4);
    HEAP32[exceptionThrowBuf >> 2] = thrown;
    for (var i = 0; i < typeArray.length; i++) {
      var caughtType = typeArray[i];
      if (caughtType === 0 || caughtType === thrownType) {
        break;
      }
      if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
        var adjusted = HEAP32[exceptionThrowBuf >> 2];
        if (thrown !== adjusted) {
          catchInfo.set_adjusted_ptr(adjusted);
        }
        setTempRet0(caughtType);
        return catchInfo.ptr | 0;
      }
    }
    stackRestore(stackTop);
    setTempRet0(thrownType);
    return catchInfo.ptr | 0;
  }
  function ___cxa_find_matching_catch_4() {
    var thrown = exceptionLast;
    if (!thrown) {
      setTempRet0(0);
      return 0 | 0;
    }
    var info = new ExceptionInfo(thrown);
    var thrownType = info.get_type();
    var catchInfo = new CatchInfo();
    catchInfo.set_base_ptr(thrown);
    if (!thrownType) {
      setTempRet0(0);
      return catchInfo.ptr | 0;
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var stackTop = stackSave();
    var exceptionThrowBuf = stackAlloc(4);
    HEAP32[exceptionThrowBuf >> 2] = thrown;
    for (var i = 0; i < typeArray.length; i++) {
      var caughtType = typeArray[i];
      if (caughtType === 0 || caughtType === thrownType) {
        break;
      }
      if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
        var adjusted = HEAP32[exceptionThrowBuf >> 2];
        if (thrown !== adjusted) {
          catchInfo.set_adjusted_ptr(adjusted);
        }
        setTempRet0(caughtType);
        return catchInfo.ptr | 0;
      }
    }
    stackRestore(stackTop);
    setTempRet0(thrownType);
    return catchInfo.ptr | 0;
  }
  function ___cxa_rethrow() {
    var catchInfo = exceptionCaught.pop();
    if (!catchInfo) {
      abort("no exception to throw");
    }
    var info = catchInfo.get_exception_info();
    var ptr = catchInfo.get_base_ptr();
    if (!info.get_rethrown()) {
      exceptionCaught.push(catchInfo);
      info.set_rethrown(true);
      info.set_caught(false);
      uncaughtExceptionCount++;
    } else {
      catchInfo.free();
    }
    exceptionLast = ptr;
    throw ptr;
  }
  function ___cxa_throw(ptr, type, destructor) {
    var info = new ExceptionInfo(ptr);
    info.init(type, destructor);
    exceptionLast = ptr;
    uncaughtExceptionCount++;
    throw ptr;
  }
  function _gmtime_r(time, tmPtr) {
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
    HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
    HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
    HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
    HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
    HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
    HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
    HEAP32[(tmPtr + 36) >> 2] = 0;
    HEAP32[(tmPtr + 32) >> 2] = 0;
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
    HEAP32[(tmPtr + 28) >> 2] = yday;
    if (!_gmtime_r.GMTString) _gmtime_r.GMTString = allocateUTF8("GMT");
    HEAP32[(tmPtr + 40) >> 2] = _gmtime_r.GMTString;
    return tmPtr;
  }
  function ___gmtime_r(a0, a1) {
    return _gmtime_r(a0, a1);
  }
  function _tzset() {
    if (_tzset.called) return;
    _tzset.called = true;
    var currentYear = new Date().getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
    HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);
    function extractZone(date) {
      var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
      return match ? match[1] : "GMT";
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocateUTF8(winterName);
    var summerNamePtr = allocateUTF8(summerName);
    if (summerOffset < winterOffset) {
      HEAP32[__get_tzname() >> 2] = winterNamePtr;
      HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
    } else {
      HEAP32[__get_tzname() >> 2] = summerNamePtr;
      HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
    }
  }
  function _localtime_r(time, tmPtr) {
    _tzset();
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
    HEAP32[(tmPtr + 8) >> 2] = date.getHours();
    HEAP32[(tmPtr + 12) >> 2] = date.getDate();
    HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
    HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
    HEAP32[(tmPtr + 24) >> 2] = date.getDay();
    var start = new Date(date.getFullYear(), 0, 1);
    var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
    HEAP32[(tmPtr + 28) >> 2] = yday;
    HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst =
      (summerOffset != winterOffset &&
        date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[(tmPtr + 32) >> 2] = dst;
    var zonePtr = HEAP32[(__get_tzname() + (dst ? 4 : 0)) >> 2];
    HEAP32[(tmPtr + 40) >> 2] = zonePtr;
    return tmPtr;
  }
  function ___localtime_r(a0, a1) {
    return _localtime_r(a0, a1);
  }
  var PATH = {
    splitPath: function (filename) {
      var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return splitPathRe.exec(filename).slice(1);
    },
    normalizeArray: function (parts, allowAboveRoot) {
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === ".") {
          parts.splice(i, 1);
        } else if (last === "..") {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
      if (allowAboveRoot) {
        for (; up; up--) {
          parts.unshift("..");
        }
      }
      return parts;
    },
    normalize: function (path) {
      var isAbsolute = path.charAt(0) === "/",
        trailingSlash = path.substr(-1) === "/";
      path = PATH.normalizeArray(
        path.split("/").filter(function (p) {
          return !!p;
        }),
        !isAbsolute
      ).join("/");
      if (!path && !isAbsolute) {
        path = ".";
      }
      if (path && trailingSlash) {
        path += "/";
      }
      return (isAbsolute ? "/" : "") + path;
    },
    dirname: function (path) {
      var result = PATH.splitPath(path),
        root = result[0],
        dir = result[1];
      if (!root && !dir) {
        return ".";
      }
      if (dir) {
        dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
    },
    basename: function (path) {
      if (path === "/") return "/";
      path = PATH.normalize(path);
      path = path.replace(/\/$/, "");
      var lastSlash = path.lastIndexOf("/");
      if (lastSlash === -1) return path;
      return path.substr(lastSlash + 1);
    },
    extname: function (path) {
      return PATH.splitPath(path)[3];
    },
    join: function () {
      var paths = Array.prototype.slice.call(arguments, 0);
      return PATH.normalize(paths.join("/"));
    },
    join2: function (l, r) {
      return PATH.normalize(l + "/" + r);
    },
  };
  function getRandomDevice() {
    if (
      typeof crypto === "object" &&
      typeof crypto["getRandomValues"] === "function"
    ) {
      var randomBuffer = new Uint8Array(1);
      return function () {
        crypto.getRandomValues(randomBuffer);
        return randomBuffer[0];
      };
    } else if (ENVIRONMENT_IS_NODE) {
      try {
        var crypto_module = require("crypto");
        return function () {
          return crypto_module["randomBytes"](1)[0];
        };
      } catch (e) {}
    }
    return function () {
      abort("randomDevice");
    };
  }
  var PATH_FS = {
    resolve: function () {
      var resolvedPath = "",
        resolvedAbsolute = false;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? arguments[i] : FS.cwd();
        if (typeof path !== "string") {
          throw new TypeError("Arguments to path.resolve must be strings");
        } else if (!path) {
          return "";
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charAt(0) === "/";
      }
      resolvedPath = PATH.normalizeArray(
        resolvedPath.split("/").filter(function (p) {
          return !!p;
        }),
        !resolvedAbsolute
      ).join("/");
      return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
    },
    relative: function (from, to) {
      from = PATH_FS.resolve(from).substr(1);
      to = PATH_FS.resolve(to).substr(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== "") break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== "") break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split("/"));
      var toParts = trim(to.split("/"));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push("..");
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join("/");
    },
  };
  var TTY = {
    ttys: [],
    init: function () {},
    shutdown: function () {},
    register: function (dev, ops) {
      TTY.ttys[dev] = { input: [], output: [], ops: ops };
      FS.registerDevice(dev, TTY.stream_ops);
    },
    stream_ops: {
      open: function (stream) {
        var tty = TTY.ttys[stream.node.rdev];
        if (!tty) {
          throw new FS.ErrnoError(43);
        }
        stream.tty = tty;
        stream.seekable = false;
      },
      close: function (stream) {
        stream.tty.ops.flush(stream.tty);
      },
      flush: function (stream) {
        stream.tty.ops.flush(stream.tty);
      },
      read: function (stream, buffer, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.get_char) {
          throw new FS.ErrnoError(60);
        }
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = stream.tty.ops.get_char(stream.tty);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: function (stream, buffer, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.put_char) {
          throw new FS.ErrnoError(60);
        }
        try {
          for (var i = 0; i < length; i++) {
            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
          }
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      },
    },
    default_tty_ops: {
      get_char: function (tty) {
        if (!tty.input.length) {
          var result = null;
          if (ENVIRONMENT_IS_NODE) {
            var BUFSIZE = 256;
            var buf = Buffer.alloc
              ? Buffer.alloc(BUFSIZE)
              : new Buffer(BUFSIZE);
            var bytesRead = 0;
            try {
              bytesRead = nodeFS.readSync(
                process.stdin.fd,
                buf,
                0,
                BUFSIZE,
                null
              );
            } catch (e) {
              if (e.toString().includes("EOF")) bytesRead = 0;
              else throw e;
            }
            if (bytesRead > 0) {
              result = buf.slice(0, bytesRead).toString("utf-8");
            } else {
              result = null;
            }
          } else if (
            typeof window != "undefined" &&
            typeof window.prompt == "function"
          ) {
            result = window.prompt("Input: ");
            if (result !== null) {
              result += "\n";
            }
          } else if (typeof readline == "function") {
            result = readline();
            if (result !== null) {
              result += "\n";
            }
          }
          if (!result) {
            return null;
          }
          tty.input = intArrayFromString(result, true);
        }
        return tty.input.shift();
      },
      put_char: function (tty, val) {
        if (val === null || val === 10) {
          out(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        } else {
          if (val != 0) tty.output.push(val);
        }
      },
      flush: function (tty) {
        if (tty.output && tty.output.length > 0) {
          out(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        }
      },
    },
    default_tty1_ops: {
      put_char: function (tty, val) {
        if (val === null || val === 10) {
          err(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        } else {
          if (val != 0) tty.output.push(val);
        }
      },
      flush: function (tty) {
        if (tty.output && tty.output.length > 0) {
          err(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        }
      },
    },
  };
  function mmapAlloc(size) {
    var alignedSize = alignMemory(size, 65536);
    var ptr = _malloc(alignedSize);
    while (size < alignedSize) HEAP8[ptr + size++] = 0;
    return ptr;
  }
  var MEMFS = {
    ops_table: null,
    mount: function (mount) {
      return MEMFS.createNode(null, "/", 16384 | 511, 0);
    },
    createNode: function (parent, name, mode, dev) {
      if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
        throw new FS.ErrnoError(63);
      }
      if (!MEMFS.ops_table) {
        MEMFS.ops_table = {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink,
            },
            stream: { llseek: MEMFS.stream_ops.llseek },
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              allocate: MEMFS.stream_ops.allocate,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync,
            },
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink,
            },
            stream: {},
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
            },
            stream: FS.chrdev_stream_ops,
          },
        };
      }
      var node = FS.createNode(parent, name, mode, dev);
      if (FS.isDir(node.mode)) {
        node.node_ops = MEMFS.ops_table.dir.node;
        node.stream_ops = MEMFS.ops_table.dir.stream;
        node.contents = {};
      } else if (FS.isFile(node.mode)) {
        node.node_ops = MEMFS.ops_table.file.node;
        node.stream_ops = MEMFS.ops_table.file.stream;
        node.usedBytes = 0;
        node.contents = null;
      } else if (FS.isLink(node.mode)) {
        node.node_ops = MEMFS.ops_table.link.node;
        node.stream_ops = MEMFS.ops_table.link.stream;
      } else if (FS.isChrdev(node.mode)) {
        node.node_ops = MEMFS.ops_table.chrdev.node;
        node.stream_ops = MEMFS.ops_table.chrdev.stream;
      }
      node.timestamp = Date.now();
      if (parent) {
        parent.contents[name] = node;
        parent.timestamp = node.timestamp;
      }
      return node;
    },
    getFileDataAsTypedArray: function (node) {
      if (!node.contents) return new Uint8Array(0);
      if (node.contents.subarray)
        return node.contents.subarray(0, node.usedBytes);
      return new Uint8Array(node.contents);
    },
    expandFileStorage: function (node, newCapacity) {
      var prevCapacity = node.contents ? node.contents.length : 0;
      if (prevCapacity >= newCapacity) return;
      var CAPACITY_DOUBLING_MAX = 1024 * 1024;
      newCapacity = Math.max(
        newCapacity,
        (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
          0
      );
      if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
      var oldContents = node.contents;
      node.contents = new Uint8Array(newCapacity);
      if (node.usedBytes > 0)
        node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    },
    resizeFileStorage: function (node, newSize) {
      if (node.usedBytes == newSize) return;
      if (newSize == 0) {
        node.contents = null;
        node.usedBytes = 0;
      } else {
        var oldContents = node.contents;
        node.contents = new Uint8Array(newSize);
        if (oldContents) {
          node.contents.set(
            oldContents.subarray(0, Math.min(newSize, node.usedBytes))
          );
        }
        node.usedBytes = newSize;
      }
    },
    node_ops: {
      getattr: function (node) {
        var attr = {};
        attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
        attr.ino = node.id;
        attr.mode = node.mode;
        attr.nlink = 1;
        attr.uid = 0;
        attr.gid = 0;
        attr.rdev = node.rdev;
        if (FS.isDir(node.mode)) {
          attr.size = 4096;
        } else if (FS.isFile(node.mode)) {
          attr.size = node.usedBytes;
        } else if (FS.isLink(node.mode)) {
          attr.size = node.link.length;
        } else {
          attr.size = 0;
        }
        attr.atime = new Date(node.timestamp);
        attr.mtime = new Date(node.timestamp);
        attr.ctime = new Date(node.timestamp);
        attr.blksize = 4096;
        attr.blocks = Math.ceil(attr.size / attr.blksize);
        return attr;
      },
      setattr: function (node, attr) {
        if (attr.mode !== undefined) {
          node.mode = attr.mode;
        }
        if (attr.timestamp !== undefined) {
          node.timestamp = attr.timestamp;
        }
        if (attr.size !== undefined) {
          MEMFS.resizeFileStorage(node, attr.size);
        }
      },
      lookup: function (parent, name) {
        throw FS.genericErrors[44];
      },
      mknod: function (parent, name, mode, dev) {
        return MEMFS.createNode(parent, name, mode, dev);
      },
      rename: function (old_node, new_dir, new_name) {
        if (FS.isDir(old_node.mode)) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {}
          if (new_node) {
            for (var i in new_node.contents) {
              throw new FS.ErrnoError(55);
            }
          }
        }
        delete old_node.parent.contents[old_node.name];
        old_node.parent.timestamp = Date.now();
        old_node.name = new_name;
        new_dir.contents[new_name] = old_node;
        new_dir.timestamp = old_node.parent.timestamp;
        old_node.parent = new_dir;
      },
      unlink: function (parent, name) {
        delete parent.contents[name];
        parent.timestamp = Date.now();
      },
      rmdir: function (parent, name) {
        var node = FS.lookupNode(parent, name);
        for (var i in node.contents) {
          throw new FS.ErrnoError(55);
        }
        delete parent.contents[name];
        parent.timestamp = Date.now();
      },
      readdir: function (node) {
        var entries = [".", ".."];
        for (var key in node.contents) {
          if (!node.contents.hasOwnProperty(key)) {
            continue;
          }
          entries.push(key);
        }
        return entries;
      },
      symlink: function (parent, newname, oldpath) {
        var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
        node.link = oldpath;
        return node;
      },
      readlink: function (node) {
        if (!FS.isLink(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        return node.link;
      },
    },
    stream_ops: {
      read: function (stream, buffer, offset, length, position) {
        var contents = stream.node.contents;
        if (position >= stream.node.usedBytes) return 0;
        var size = Math.min(stream.node.usedBytes - position, length);
        if (size > 8 && contents.subarray) {
          buffer.set(contents.subarray(position, position + size), offset);
        } else {
          for (var i = 0; i < size; i++)
            buffer[offset + i] = contents[position + i];
        }
        return size;
      },
      write: function (stream, buffer, offset, length, position, canOwn) {
        if (buffer.buffer === HEAP8.buffer) {
          canOwn = false;
        }
        if (!length) return 0;
        var node = stream.node;
        node.timestamp = Date.now();
        if (buffer.subarray && (!node.contents || node.contents.subarray)) {
          if (canOwn) {
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (node.usedBytes === 0 && position === 0) {
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (position + length <= node.usedBytes) {
            node.contents.set(
              buffer.subarray(offset, offset + length),
              position
            );
            return length;
          }
        }
        MEMFS.expandFileStorage(node, position + length);
        if (node.contents.subarray && buffer.subarray) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
        } else {
          for (var i = 0; i < length; i++) {
            node.contents[position + i] = buffer[offset + i];
          }
        }
        node.usedBytes = Math.max(node.usedBytes, position + length);
        return length;
      },
      llseek: function (stream, offset, whence) {
        var position = offset;
        if (whence === 1) {
          position += stream.position;
        } else if (whence === 2) {
          if (FS.isFile(stream.node.mode)) {
            position += stream.node.usedBytes;
          }
        }
        if (position < 0) {
          throw new FS.ErrnoError(28);
        }
        return position;
      },
      allocate: function (stream, offset, length) {
        MEMFS.expandFileStorage(stream.node, offset + length);
        stream.node.usedBytes = Math.max(
          stream.node.usedBytes,
          offset + length
        );
      },
      mmap: function (stream, address, length, position, prot, flags) {
        if (address !== 0) {
          throw new FS.ErrnoError(28);
        }
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        var ptr;
        var allocated;
        var contents = stream.node.contents;
        if (!(flags & 2) && contents.buffer === buffer) {
          allocated = false;
          ptr = contents.byteOffset;
        } else {
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(
                contents,
                position,
                position + length
              );
            }
          }
          allocated = true;
          ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          HEAP8.set(contents, ptr);
        }
        return { ptr: ptr, allocated: allocated };
      },
      msync: function (stream, buffer, offset, length, mmapFlags) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (mmapFlags & 2) {
          return 0;
        }
        var bytesWritten = MEMFS.stream_ops.write(
          stream,
          buffer,
          0,
          length,
          offset,
          false
        );
        return 0;
      },
    },
  };
  var IDBFS = {
    dbs: {},
    indexedDB: function () {
      if (typeof indexedDB !== "undefined") return indexedDB;
      var ret = null;
      if (typeof window === "object")
        ret =
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB;
      assert(ret, "IDBFS used, but indexedDB not supported");
      return ret;
    },
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: function (mount) {
      return MEMFS.mount.apply(null, arguments);
    },
    syncfs: function (mount, populate, callback) {
      IDBFS.getLocalSet(mount, function (err, local) {
        if (err) return callback(err);
        IDBFS.getRemoteSet(mount, function (err, remote) {
          if (err) return callback(err);
          var src = populate ? remote : local;
          var dst = populate ? local : remote;
          IDBFS.reconcile(src, dst, callback);
        });
      });
    },
    getDB: function (name, callback) {
      var db = IDBFS.dbs[name];
      if (db) {
        return callback(null, db);
      }
      var req;
      try {
        req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
      } catch (e) {
        return callback(e);
      }
      if (!req) {
        return callback("Unable to connect to IndexedDB");
      }
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        var transaction = e.target.transaction;
        var fileStore;
        if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
          fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
        } else {
          fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
        }
        if (!fileStore.indexNames.contains("timestamp")) {
          fileStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
      req.onsuccess = function () {
        db = req.result;
        IDBFS.dbs[name] = db;
        callback(null, db);
      };
      req.onerror = function (e) {
        callback(this.error);
        e.preventDefault();
      };
    },
    getLocalSet: function (mount, callback) {
      var entries = {};
      function isRealDir(p) {
        return p !== "." && p !== "..";
      }
      function toAbsolute(root) {
        return function (p) {
          return PATH.join2(root, p);
        };
      }
      var check = FS.readdir(mount.mountpoint)
        .filter(isRealDir)
        .map(toAbsolute(mount.mountpoint));
      while (check.length) {
        var path = check.pop();
        var stat;
        try {
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
        if (FS.isDir(stat.mode)) {
          check.push.apply(
            check,
            FS.readdir(path).filter(isRealDir).map(toAbsolute(path))
          );
        }
        entries[path] = { timestamp: stat.mtime };
      }
      return callback(null, { type: "local", entries: entries });
    },
    getRemoteSet: function (mount, callback) {
      var entries = {};
      IDBFS.getDB(mount.mountpoint, function (err, db) {
        if (err) return callback(err);
        try {
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
          transaction.onerror = function (e) {
            callback(this.error);
            e.preventDefault();
          };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index("timestamp");
          index.openKeyCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, {
                type: "remote",
                db: db,
                entries: entries,
              });
            }
            entries[cursor.primaryKey] = { timestamp: cursor.key };
            cursor.continue();
          };
        } catch (e) {
          return callback(e);
        }
      });
    },
    loadLocalEntry: function (path, callback) {
      var stat, node;
      try {
        var lookup = FS.lookupPath(path);
        node = lookup.node;
        stat = FS.stat(path);
      } catch (e) {
        return callback(e);
      }
      if (FS.isDir(stat.mode)) {
        return callback(null, { timestamp: stat.mtime, mode: stat.mode });
      } else if (FS.isFile(stat.mode)) {
        node.contents = MEMFS.getFileDataAsTypedArray(node);
        return callback(null, {
          timestamp: stat.mtime,
          mode: stat.mode,
          contents: node.contents,
        });
      } else {
        return callback(new Error("node type not supported"));
      }
    },
    storeLocalEntry: function (path, entry, callback) {
      try {
        if (FS.isDir(entry["mode"])) {
          FS.mkdirTree(path, entry["mode"]);
        } else if (FS.isFile(entry["mode"])) {
          FS.writeFile(path, entry["contents"], { canOwn: true });
        } else {
          return callback(new Error("node type not supported"));
        }
        FS.chmod(path, entry["mode"]);
        FS.utime(path, entry["timestamp"], entry["timestamp"]);
      } catch (e) {
        return callback(e);
      }
      callback(null);
    },
    removeLocalEntry: function (path, callback) {
      try {
        var lookup = FS.lookupPath(path);
        var stat = FS.stat(path);
        if (FS.isDir(stat.mode)) {
          FS.rmdir(path);
        } else if (FS.isFile(stat.mode)) {
          FS.unlink(path);
        }
      } catch (e) {
        return callback(e);
      }
      callback(null);
    },
    loadRemoteEntry: function (store, path, callback) {
      var req = store.get(path);
      req.onsuccess = function (event) {
        callback(null, event.target.result);
      };
      req.onerror = function (e) {
        callback(this.error);
        e.preventDefault();
      };
    },
    storeRemoteEntry: function (store, path, entry, callback) {
      var req = store.put(entry, path);
      req.onsuccess = function () {
        callback(null);
      };
      req.onerror = function (e) {
        callback(this.error);
        e.preventDefault();
      };
    },
    removeRemoteEntry: function (store, path, callback) {
      var req = store.delete(path);
      req.onsuccess = function () {
        callback(null);
      };
      req.onerror = function (e) {
        callback(this.error);
        e.preventDefault();
      };
    },
    reconcile: function (src, dst, callback) {
      var total = 0;
      var create = [];
      Object.keys(src.entries).forEach(function (key) {
        var e = src.entries[key];
        var e2 = dst.entries[key];
        if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
          create.push(key);
          total++;
        }
      });
      var remove = [];
      Object.keys(dst.entries).forEach(function (key) {
        if (!src.entries[key]) {
          remove.push(key);
          total++;
        }
      });
      if (!total) {
        return callback(null);
      }
      var errored = false;
      var db = src.type === "remote" ? src.db : dst.db;
      var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
      var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
      function done(err) {
        if (err && !errored) {
          errored = true;
          return callback(err);
        }
      }
      transaction.onerror = function (e) {
        done(this.error);
        e.preventDefault();
      };
      transaction.oncomplete = function (e) {
        if (!errored) {
          callback(null);
        }
      };
      create.sort().forEach(function (path) {
        if (dst.type === "local") {
          IDBFS.loadRemoteEntry(store, path, function (err, entry) {
            if (err) return done(err);
            IDBFS.storeLocalEntry(path, entry, done);
          });
        } else {
          IDBFS.loadLocalEntry(path, function (err, entry) {
            if (err) return done(err);
            IDBFS.storeRemoteEntry(store, path, entry, done);
          });
        }
      });
      remove
        .sort()
        .reverse()
        .forEach(function (path) {
          if (dst.type === "local") {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
    },
  };
  var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: { openFlags: { READ: 1, WRITE: 2 } },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    lookupPath: function (path, opts) {
      path = PATH_FS.resolve(FS.cwd(), path);
      opts = opts || {};
      if (!path) return { path: "", node: null };
      var defaults = { follow_mount: true, recurse_count: 0 };
      for (var key in defaults) {
        if (opts[key] === undefined) {
          opts[key] = defaults[key];
        }
      }
      if (opts.recurse_count > 8) {
        throw new FS.ErrnoError(32);
      }
      var parts = PATH.normalizeArray(
        path.split("/").filter(function (p) {
          return !!p;
        }),
        false
      );
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = i === parts.length - 1;
        if (islast && opts.parent) {
          break;
        }
        current = FS.lookupNode(current, parts[i]);
        current_path = PATH.join2(current_path, parts[i]);
        if (FS.isMountpoint(current)) {
          if (!islast || (islast && opts.follow_mount)) {
            current = current.mounted.root;
          }
        }
        if (!islast || opts.follow) {
          var count = 0;
          while (FS.isLink(current.mode)) {
            var link = FS.readlink(current_path);
            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
            var lookup = FS.lookupPath(current_path, {
              recurse_count: opts.recurse_count,
            });
            current = lookup.node;
            if (count++ > 40) {
              throw new FS.ErrnoError(32);
            }
          }
        }
      }
      return { path: current_path, node: current };
    },
    getPath: function (node) {
      var path;
      while (true) {
        if (FS.isRoot(node)) {
          var mount = node.mount.mountpoint;
          if (!path) return mount;
          return mount[mount.length - 1] !== "/"
            ? mount + "/" + path
            : mount + path;
        }
        path = path ? node.name + "/" + path : node.name;
        node = node.parent;
      }
    },
    hashName: function (parentid, name) {
      var hash = 0;
      for (var i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
      }
      return ((parentid + hash) >>> 0) % FS.nameTable.length;
    },
    hashAddNode: function (node) {
      var hash = FS.hashName(node.parent.id, node.name);
      node.name_next = FS.nameTable[hash];
      FS.nameTable[hash] = node;
    },
    hashRemoveNode: function (node) {
      var hash = FS.hashName(node.parent.id, node.name);
      if (FS.nameTable[hash] === node) {
        FS.nameTable[hash] = node.name_next;
      } else {
        var current = FS.nameTable[hash];
        while (current) {
          if (current.name_next === node) {
            current.name_next = node.name_next;
            break;
          }
          current = current.name_next;
        }
      }
    },
    lookupNode: function (parent, name) {
      var errCode = FS.mayLookup(parent);
      if (errCode) {
        throw new FS.ErrnoError(errCode, parent);
      }
      var hash = FS.hashName(parent.id, name);
      for (var node = FS.nameTable[hash]; node; node = node.name_next) {
        var nodeName = node.name;
        if (node.parent.id === parent.id && nodeName === name) {
          return node;
        }
      }
      return FS.lookup(parent, name);
    },
    createNode: function (parent, name, mode, rdev) {
      var node = new FS.FSNode(parent, name, mode, rdev);
      FS.hashAddNode(node);
      return node;
    },
    destroyNode: function (node) {
      FS.hashRemoveNode(node);
    },
    isRoot: function (node) {
      return node === node.parent;
    },
    isMountpoint: function (node) {
      return !!node.mounted;
    },
    isFile: function (mode) {
      return (mode & 61440) === 32768;
    },
    isDir: function (mode) {
      return (mode & 61440) === 16384;
    },
    isLink: function (mode) {
      return (mode & 61440) === 40960;
    },
    isChrdev: function (mode) {
      return (mode & 61440) === 8192;
    },
    isBlkdev: function (mode) {
      return (mode & 61440) === 24576;
    },
    isFIFO: function (mode) {
      return (mode & 61440) === 4096;
    },
    isSocket: function (mode) {
      return (mode & 49152) === 49152;
    },
    flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
    modeStringToFlags: function (str) {
      var flags = FS.flagModes[str];
      if (typeof flags === "undefined") {
        throw new Error("Unknown file open mode: " + str);
      }
      return flags;
    },
    flagsToPermissionString: function (flag) {
      var perms = ["r", "w", "rw"][flag & 3];
      if (flag & 512) {
        perms += "w";
      }
      return perms;
    },
    nodePermissions: function (node, perms) {
      if (FS.ignorePermissions) {
        return 0;
      }
      if (perms.includes("r") && !(node.mode & 292)) {
        return 2;
      } else if (perms.includes("w") && !(node.mode & 146)) {
        return 2;
      } else if (perms.includes("x") && !(node.mode & 73)) {
        return 2;
      }
      return 0;
    },
    mayLookup: function (dir) {
      var errCode = FS.nodePermissions(dir, "x");
      if (errCode) return errCode;
      if (!dir.node_ops.lookup) return 2;
      return 0;
    },
    mayCreate: function (dir, name) {
      try {
        var node = FS.lookupNode(dir, name);
        return 20;
      } catch (e) {}
      return FS.nodePermissions(dir, "wx");
    },
    mayDelete: function (dir, name, isdir) {
      var node;
      try {
        node = FS.lookupNode(dir, name);
      } catch (e) {
        return e.errno;
      }
      var errCode = FS.nodePermissions(dir, "wx");
      if (errCode) {
        return errCode;
      }
      if (isdir) {
        if (!FS.isDir(node.mode)) {
          return 54;
        }
        if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
          return 10;
        }
      } else {
        if (FS.isDir(node.mode)) {
          return 31;
        }
      }
      return 0;
    },
    mayOpen: function (node, flags) {
      if (!node) {
        return 44;
      }
      if (FS.isLink(node.mode)) {
        return 32;
      } else if (FS.isDir(node.mode)) {
        if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
          return 31;
        }
      }
      return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function (fd_start, fd_end) {
      fd_start = fd_start || 0;
      fd_end = fd_end || FS.MAX_OPEN_FDS;
      for (var fd = fd_start; fd <= fd_end; fd++) {
        if (!FS.streams[fd]) {
          return fd;
        }
      }
      throw new FS.ErrnoError(33);
    },
    getStream: function (fd) {
      return FS.streams[fd];
    },
    createStream: function (stream, fd_start, fd_end) {
      if (!FS.FSStream) {
        FS.FSStream = function () {};
        FS.FSStream.prototype = {
          object: {
            get: function () {
              return this.node;
            },
            set: function (val) {
              this.node = val;
            },
          },
          isRead: {
            get: function () {
              return (this.flags & 2097155) !== 1;
            },
          },
          isWrite: {
            get: function () {
              return (this.flags & 2097155) !== 0;
            },
          },
          isAppend: {
            get: function () {
              return this.flags & 1024;
            },
          },
        };
      }
      var newStream = new FS.FSStream();
      for (var p in stream) {
        newStream[p] = stream[p];
      }
      stream = newStream;
      var fd = FS.nextfd(fd_start, fd_end);
      stream.fd = fd;
      FS.streams[fd] = stream;
      return stream;
    },
    closeStream: function (fd) {
      FS.streams[fd] = null;
    },
    chrdev_stream_ops: {
      open: function (stream) {
        var device = FS.getDevice(stream.node.rdev);
        stream.stream_ops = device.stream_ops;
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
      },
      llseek: function () {
        throw new FS.ErrnoError(70);
      },
    },
    major: function (dev) {
      return dev >> 8;
    },
    minor: function (dev) {
      return dev & 255;
    },
    makedev: function (ma, mi) {
      return (ma << 8) | mi;
    },
    registerDevice: function (dev, ops) {
      FS.devices[dev] = { stream_ops: ops };
    },
    getDevice: function (dev) {
      return FS.devices[dev];
    },
    getMounts: function (mount) {
      var mounts = [];
      var check = [mount];
      while (check.length) {
        var m = check.pop();
        mounts.push(m);
        check.push.apply(check, m.mounts);
      }
      return mounts;
    },
    syncfs: function (populate, callback) {
      if (typeof populate === "function") {
        callback = populate;
        populate = false;
      }
      FS.syncFSRequests++;
      if (FS.syncFSRequests > 1) {
        err(
          "warning: " +
            FS.syncFSRequests +
            " FS.syncfs operations in flight at once, probably just doing extra work"
        );
      }
      var mounts = FS.getMounts(FS.root.mount);
      var completed = 0;
      function doCallback(errCode) {
        FS.syncFSRequests--;
        return callback(errCode);
      }
      function done(errCode) {
        if (errCode) {
          if (!done.errored) {
            done.errored = true;
            return doCallback(errCode);
          }
          return;
        }
        if (++completed >= mounts.length) {
          doCallback(null);
        }
      }
      mounts.forEach(function (mount) {
        if (!mount.type.syncfs) {
          return done(null);
        }
        mount.type.syncfs(mount, populate, done);
      });
    },
    mount: function (type, opts, mountpoint) {
      var root = mountpoint === "/";
      var pseudo = !mountpoint;
      var node;
      if (root && FS.root) {
        throw new FS.ErrnoError(10);
      } else if (!root && !pseudo) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        mountpoint = lookup.path;
        node = lookup.node;
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        if (!FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
      }
      var mount = {
        type: type,
        opts: opts,
        mountpoint: mountpoint,
        mounts: [],
      };
      var mountRoot = type.mount(mount);
      mountRoot.mount = mount;
      mount.root = mountRoot;
      if (root) {
        FS.root = mountRoot;
      } else if (node) {
        node.mounted = mount;
        if (node.mount) {
          node.mount.mounts.push(mount);
        }
      }
      return mountRoot;
    },
    unmount: function (mountpoint) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      if (!FS.isMountpoint(lookup.node)) {
        throw new FS.ErrnoError(28);
      }
      var node = lookup.node;
      var mount = node.mounted;
      var mounts = FS.getMounts(mount);
      Object.keys(FS.nameTable).forEach(function (hash) {
        var current = FS.nameTable[hash];
        while (current) {
          var next = current.name_next;
          if (mounts.includes(current.mount)) {
            FS.destroyNode(current);
          }
          current = next;
        }
      });
      node.mounted = null;
      var idx = node.mount.mounts.indexOf(mount);
      node.mount.mounts.splice(idx, 1);
    },
    lookup: function (parent, name) {
      return parent.node_ops.lookup(parent, name);
    },
    mknod: function (path, mode, dev) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      var name = PATH.basename(path);
      if (!name || name === "." || name === "..") {
        throw new FS.ErrnoError(28);
      }
      var errCode = FS.mayCreate(parent, name);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.mknod) {
        throw new FS.ErrnoError(63);
      }
      return parent.node_ops.mknod(parent, name, mode, dev);
    },
    create: function (path, mode) {
      mode = mode !== undefined ? mode : 438;
      mode &= 4095;
      mode |= 32768;
      return FS.mknod(path, mode, 0);
    },
    mkdir: function (path, mode) {
      mode = mode !== undefined ? mode : 511;
      mode &= 511 | 512;
      mode |= 16384;
      return FS.mknod(path, mode, 0);
    },
    mkdirTree: function (path, mode) {
      var dirs = path.split("/");
      var d = "";
      for (var i = 0; i < dirs.length; ++i) {
        if (!dirs[i]) continue;
        d += "/" + dirs[i];
        try {
          FS.mkdir(d, mode);
        } catch (e) {
          if (e.errno != 20) throw e;
        }
      }
    },
    mkdev: function (path, mode, dev) {
      if (typeof dev === "undefined") {
        dev = mode;
        mode = 438;
      }
      mode |= 8192;
      return FS.mknod(path, mode, dev);
    },
    symlink: function (oldpath, newpath) {
      if (!PATH_FS.resolve(oldpath)) {
        throw new FS.ErrnoError(44);
      }
      var lookup = FS.lookupPath(newpath, { parent: true });
      var parent = lookup.node;
      if (!parent) {
        throw new FS.ErrnoError(44);
      }
      var newname = PATH.basename(newpath);
      var errCode = FS.mayCreate(parent, newname);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.symlink) {
        throw new FS.ErrnoError(63);
      }
      return parent.node_ops.symlink(parent, newname, oldpath);
    },
    rename: function (old_path, new_path) {
      var old_dirname = PATH.dirname(old_path);
      var new_dirname = PATH.dirname(new_path);
      var old_name = PATH.basename(old_path);
      var new_name = PATH.basename(new_path);
      var lookup, old_dir, new_dir;
      lookup = FS.lookupPath(old_path, { parent: true });
      old_dir = lookup.node;
      lookup = FS.lookupPath(new_path, { parent: true });
      new_dir = lookup.node;
      if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
      if (old_dir.mount !== new_dir.mount) {
        throw new FS.ErrnoError(75);
      }
      var old_node = FS.lookupNode(old_dir, old_name);
      var relative = PATH_FS.relative(old_path, new_dirname);
      if (relative.charAt(0) !== ".") {
        throw new FS.ErrnoError(28);
      }
      relative = PATH_FS.relative(new_path, old_dirname);
      if (relative.charAt(0) !== ".") {
        throw new FS.ErrnoError(55);
      }
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (old_node === new_node) {
        return;
      }
      var isdir = FS.isDir(old_node.mode);
      var errCode = FS.mayDelete(old_dir, old_name, isdir);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      errCode = new_node
        ? FS.mayDelete(new_dir, new_name, isdir)
        : FS.mayCreate(new_dir, new_name);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!old_dir.node_ops.rename) {
        throw new FS.ErrnoError(63);
      }
      if (
        FS.isMountpoint(old_node) ||
        (new_node && FS.isMountpoint(new_node))
      ) {
        throw new FS.ErrnoError(10);
      }
      if (new_dir !== old_dir) {
        errCode = FS.nodePermissions(old_dir, "w");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
      }
      try {
        if (FS.trackingDelegate["willMovePath"]) {
          FS.trackingDelegate["willMovePath"](old_path, new_path);
        }
      } catch (e) {
        err(
          "FS.trackingDelegate['willMovePath']('" +
            old_path +
            "', '" +
            new_path +
            "') threw an exception: " +
            e.message
        );
      }
      FS.hashRemoveNode(old_node);
      try {
        old_dir.node_ops.rename(old_node, new_dir, new_name);
      } catch (e) {
        throw e;
      } finally {
        FS.hashAddNode(old_node);
      }
      try {
        if (FS.trackingDelegate["onMovePath"])
          FS.trackingDelegate["onMovePath"](old_path, new_path);
      } catch (e) {
        err(
          "FS.trackingDelegate['onMovePath']('" +
            old_path +
            "', '" +
            new_path +
            "') threw an exception: " +
            e.message
        );
      }
    },
    rmdir: function (path) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      var name = PATH.basename(path);
      var node = FS.lookupNode(parent, name);
      var errCode = FS.mayDelete(parent, name, true);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.rmdir) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      try {
        if (FS.trackingDelegate["willDeletePath"]) {
          FS.trackingDelegate["willDeletePath"](path);
        }
      } catch (e) {
        err(
          "FS.trackingDelegate['willDeletePath']('" +
            path +
            "') threw an exception: " +
            e.message
        );
      }
      parent.node_ops.rmdir(parent, name);
      FS.destroyNode(node);
      try {
        if (FS.trackingDelegate["onDeletePath"])
          FS.trackingDelegate["onDeletePath"](path);
      } catch (e) {
        err(
          "FS.trackingDelegate['onDeletePath']('" +
            path +
            "') threw an exception: " +
            e.message
        );
      }
    },
    readdir: function (path) {
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      if (!node.node_ops.readdir) {
        throw new FS.ErrnoError(54);
      }
      return node.node_ops.readdir(node);
    },
    unlink: function (path) {
      var lookup = FS.lookupPath(path, { parent: true });
      var parent = lookup.node;
      var name = PATH.basename(path);
      var node = FS.lookupNode(parent, name);
      var errCode = FS.mayDelete(parent, name, false);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      if (!parent.node_ops.unlink) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      try {
        if (FS.trackingDelegate["willDeletePath"]) {
          FS.trackingDelegate["willDeletePath"](path);
        }
      } catch (e) {
        err(
          "FS.trackingDelegate['willDeletePath']('" +
            path +
            "') threw an exception: " +
            e.message
        );
      }
      parent.node_ops.unlink(parent, name);
      FS.destroyNode(node);
      try {
        if (FS.trackingDelegate["onDeletePath"])
          FS.trackingDelegate["onDeletePath"](path);
      } catch (e) {
        err(
          "FS.trackingDelegate['onDeletePath']('" +
            path +
            "') threw an exception: " +
            e.message
        );
      }
    },
    readlink: function (path) {
      var lookup = FS.lookupPath(path);
      var link = lookup.node;
      if (!link) {
        throw new FS.ErrnoError(44);
      }
      if (!link.node_ops.readlink) {
        throw new FS.ErrnoError(28);
      }
      return PATH_FS.resolve(
        FS.getPath(link.parent),
        link.node_ops.readlink(link)
      );
    },
    stat: function (path, dontFollow) {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      var node = lookup.node;
      if (!node) {
        throw new FS.ErrnoError(44);
      }
      if (!node.node_ops.getattr) {
        throw new FS.ErrnoError(63);
      }
      return node.node_ops.getattr(node);
    },
    lstat: function (path) {
      return FS.stat(path, true);
    },
    chmod: function (path, mode, dontFollow) {
      var node;
      if (typeof path === "string") {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        node = lookup.node;
      } else {
        node = path;
      }
      if (!node.node_ops.setattr) {
        throw new FS.ErrnoError(63);
      }
      node.node_ops.setattr(node, {
        mode: (mode & 4095) | (node.mode & ~4095),
        timestamp: Date.now(),
      });
    },
    lchmod: function (path, mode) {
      FS.chmod(path, mode, true);
    },
    fchmod: function (fd, mode) {
      var stream = FS.getStream(fd);
      if (!stream) {
        throw new FS.ErrnoError(8);
      }
      FS.chmod(stream.node, mode);
    },
    chown: function (path, uid, gid, dontFollow) {
      var node;
      if (typeof path === "string") {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        node = lookup.node;
      } else {
        node = path;
      }
      if (!node.node_ops.setattr) {
        throw new FS.ErrnoError(63);
      }
      node.node_ops.setattr(node, { timestamp: Date.now() });
    },
    lchown: function (path, uid, gid) {
      FS.chown(path, uid, gid, true);
    },
    fchown: function (fd, uid, gid) {
      var stream = FS.getStream(fd);
      if (!stream) {
        throw new FS.ErrnoError(8);
      }
      FS.chown(stream.node, uid, gid);
    },
    truncate: function (path, len) {
      if (len < 0) {
        throw new FS.ErrnoError(28);
      }
      var node;
      if (typeof path === "string") {
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
      } else {
        node = path;
      }
      if (!node.node_ops.setattr) {
        throw new FS.ErrnoError(63);
      }
      if (FS.isDir(node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!FS.isFile(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      var errCode = FS.nodePermissions(node, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
    },
    ftruncate: function (fd, len) {
      var stream = FS.getStream(fd);
      if (!stream) {
        throw new FS.ErrnoError(8);
      }
      if ((stream.flags & 2097155) === 0) {
        throw new FS.ErrnoError(28);
      }
      FS.truncate(stream.node, len);
    },
    utime: function (path, atime, mtime) {
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
    },
    open: function (path, flags, mode, fd_start, fd_end) {
      if (path === "") {
        throw new FS.ErrnoError(44);
      }
      flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
      mode = typeof mode === "undefined" ? 438 : mode;
      if (flags & 64) {
        mode = (mode & 4095) | 32768;
      } else {
        mode = 0;
      }
      var node;
      if (typeof path === "object") {
        node = path;
      } else {
        path = PATH.normalize(path);
        try {
          var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
          node = lookup.node;
        } catch (e) {}
      }
      var created = false;
      if (flags & 64) {
        if (node) {
          if (flags & 128) {
            throw new FS.ErrnoError(20);
          }
        } else {
          node = FS.mknod(path, mode, 0);
          created = true;
        }
      }
      if (!node) {
        throw new FS.ErrnoError(44);
      }
      if (FS.isChrdev(node.mode)) {
        flags &= ~512;
      }
      if (flags & 65536 && !FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
      if (!created) {
        var errCode = FS.mayOpen(node, flags);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
      }
      if (flags & 512) {
        FS.truncate(node, 0);
      }
      flags &= ~(128 | 512 | 131072);
      var stream = FS.createStream(
        {
          node: node,
          path: FS.getPath(node),
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false,
        },
        fd_start,
        fd_end
      );
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
      if (Module["logReadFiles"] && !(flags & 1)) {
        if (!FS.readFiles) FS.readFiles = {};
        if (!(path in FS.readFiles)) {
          FS.readFiles[path] = 1;
          err("FS.trackingDelegate error on read file: " + path);
        }
      }
      try {
        if (FS.trackingDelegate["onOpenFile"]) {
          var trackingFlags = 0;
          if ((flags & 2097155) !== 1) {
            trackingFlags |= FS.tracking.openFlags.READ;
          }
          if ((flags & 2097155) !== 0) {
            trackingFlags |= FS.tracking.openFlags.WRITE;
          }
          FS.trackingDelegate["onOpenFile"](path, trackingFlags);
        }
      } catch (e) {
        err(
          "FS.trackingDelegate['onOpenFile']('" +
            path +
            "', flags) threw an exception: " +
            e.message
        );
      }
      return stream;
    },
    close: function (stream) {
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if (stream.getdents) stream.getdents = null;
      try {
        if (stream.stream_ops.close) {
          stream.stream_ops.close(stream);
        }
      } catch (e) {
        throw e;
      } finally {
        FS.closeStream(stream.fd);
      }
      stream.fd = null;
    },
    isClosed: function (stream) {
      return stream.fd === null;
    },
    llseek: function (stream, offset, whence) {
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if (!stream.seekable || !stream.stream_ops.llseek) {
        throw new FS.ErrnoError(70);
      }
      if (whence != 0 && whence != 1 && whence != 2) {
        throw new FS.ErrnoError(28);
      }
      stream.position = stream.stream_ops.llseek(stream, offset, whence);
      stream.ungotten = [];
      return stream.position;
    },
    read: function (stream, buffer, offset, length, position) {
      if (length < 0 || position < 0) {
        throw new FS.ErrnoError(28);
      }
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if ((stream.flags & 2097155) === 1) {
        throw new FS.ErrnoError(8);
      }
      if (FS.isDir(stream.node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!stream.stream_ops.read) {
        throw new FS.ErrnoError(28);
      }
      var seeking = typeof position !== "undefined";
      if (!seeking) {
        position = stream.position;
      } else if (!stream.seekable) {
        throw new FS.ErrnoError(70);
      }
      var bytesRead = stream.stream_ops.read(
        stream,
        buffer,
        offset,
        length,
        position
      );
      if (!seeking) stream.position += bytesRead;
      return bytesRead;
    },
    write: function (stream, buffer, offset, length, position, canOwn) {
      if (length < 0 || position < 0) {
        throw new FS.ErrnoError(28);
      }
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if ((stream.flags & 2097155) === 0) {
        throw new FS.ErrnoError(8);
      }
      if (FS.isDir(stream.node.mode)) {
        throw new FS.ErrnoError(31);
      }
      if (!stream.stream_ops.write) {
        throw new FS.ErrnoError(28);
      }
      if (stream.seekable && stream.flags & 1024) {
        FS.llseek(stream, 0, 2);
      }
      var seeking = typeof position !== "undefined";
      if (!seeking) {
        position = stream.position;
      } else if (!stream.seekable) {
        throw new FS.ErrnoError(70);
      }
      var bytesWritten = stream.stream_ops.write(
        stream,
        buffer,
        offset,
        length,
        position,
        canOwn
      );
      if (!seeking) stream.position += bytesWritten;
      try {
        if (stream.path && FS.trackingDelegate["onWriteToFile"])
          FS.trackingDelegate["onWriteToFile"](stream.path);
      } catch (e) {
        err(
          "FS.trackingDelegate['onWriteToFile']('" +
            stream.path +
            "') threw an exception: " +
            e.message
        );
      }
      return bytesWritten;
    },
    allocate: function (stream, offset, length) {
      if (FS.isClosed(stream)) {
        throw new FS.ErrnoError(8);
      }
      if (offset < 0 || length <= 0) {
        throw new FS.ErrnoError(28);
      }
      if ((stream.flags & 2097155) === 0) {
        throw new FS.ErrnoError(8);
      }
      if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (!stream.stream_ops.allocate) {
        throw new FS.ErrnoError(138);
      }
      stream.stream_ops.allocate(stream, offset, length);
    },
    mmap: function (stream, address, length, position, prot, flags) {
      if (
        (prot & 2) !== 0 &&
        (flags & 2) === 0 &&
        (stream.flags & 2097155) !== 2
      ) {
        throw new FS.ErrnoError(2);
      }
      if ((stream.flags & 2097155) === 1) {
        throw new FS.ErrnoError(2);
      }
      if (!stream.stream_ops.mmap) {
        throw new FS.ErrnoError(43);
      }
      return stream.stream_ops.mmap(
        stream,
        address,
        length,
        position,
        prot,
        flags
      );
    },
    msync: function (stream, buffer, offset, length, mmapFlags) {
      if (!stream || !stream.stream_ops.msync) {
        return 0;
      }
      return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
    },
    munmap: function (stream) {
      return 0;
    },
    ioctl: function (stream, cmd, arg) {
      if (!stream.stream_ops.ioctl) {
        throw new FS.ErrnoError(59);
      }
      return stream.stream_ops.ioctl(stream, cmd, arg);
    },
    readFile: function (path, opts) {
      opts = opts || {};
      opts.flags = opts.flags || 0;
      opts.encoding = opts.encoding || "binary";
      if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
        throw new Error('Invalid encoding type "' + opts.encoding + '"');
      }
      var ret;
      var stream = FS.open(path, opts.flags);
      var stat = FS.stat(path);
      var length = stat.size;
      var buf = new Uint8Array(length);
      FS.read(stream, buf, 0, length, 0);
      if (opts.encoding === "utf8") {
        ret = UTF8ArrayToString(buf, 0);
      } else if (opts.encoding === "binary") {
        ret = buf;
      }
      FS.close(stream);
      return ret;
    },
    writeFile: function (path, data, opts) {
      opts = opts || {};
      opts.flags = opts.flags || 577;
      var stream = FS.open(path, opts.flags, opts.mode);
      if (typeof data === "string") {
        var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
        var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
        FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
      } else if (ArrayBuffer.isView(data)) {
        FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
      } else {
        throw new Error("Unsupported data type");
      }
      FS.close(stream);
    },
    cwd: function () {
      return FS.currentPath;
    },
    chdir: function (path) {
      var lookup = FS.lookupPath(path, { follow: true });
      if (lookup.node === null) {
        throw new FS.ErrnoError(44);
      }
      if (!FS.isDir(lookup.node.mode)) {
        throw new FS.ErrnoError(54);
      }
      var errCode = FS.nodePermissions(lookup.node, "x");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
      FS.currentPath = lookup.path;
    },
    createDefaultDirectories: function () {
      FS.mkdir("/tmp");
      FS.mkdir("/home");
      FS.mkdir("/home/web_user");
    },
    createDefaultDevices: function () {
      FS.mkdir("/dev");
      FS.registerDevice(FS.makedev(1, 3), {
        read: function () {
          return 0;
        },
        write: function (stream, buffer, offset, length, pos) {
          return length;
        },
      });
      FS.mkdev("/dev/null", FS.makedev(1, 3));
      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
      FS.mkdev("/dev/tty", FS.makedev(5, 0));
      FS.mkdev("/dev/tty1", FS.makedev(6, 0));
      var random_device = getRandomDevice();
      FS.createDevice("/dev", "random", random_device);
      FS.createDevice("/dev", "urandom", random_device);
      FS.mkdir("/dev/shm");
      FS.mkdir("/dev/shm/tmp");
    },
    createSpecialDirectories: function () {
      FS.mkdir("/proc");
      var proc_self = FS.mkdir("/proc/self");
      FS.mkdir("/proc/self/fd");
      FS.mount(
        {
          mount: function () {
            var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
            node.node_ops = {
              lookup: function (parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: "fake" },
                  node_ops: {
                    readlink: function () {
                      return stream.path;
                    },
                  },
                };
                ret.parent = ret;
                return ret;
              },
            };
            return node;
          },
        },
        {},
        "/proc/self/fd"
      );
    },
    createStandardStreams: function () {
      if (Module["stdin"]) {
        FS.createDevice("/dev", "stdin", Module["stdin"]);
      } else {
        FS.symlink("/dev/tty", "/dev/stdin");
      }
      if (Module["stdout"]) {
        FS.createDevice("/dev", "stdout", null, Module["stdout"]);
      } else {
        FS.symlink("/dev/tty", "/dev/stdout");
      }
      if (Module["stderr"]) {
        FS.createDevice("/dev", "stderr", null, Module["stderr"]);
      } else {
        FS.symlink("/dev/tty1", "/dev/stderr");
      }
      var stdin = FS.open("/dev/stdin", 0);
      var stdout = FS.open("/dev/stdout", 1);
      var stderr = FS.open("/dev/stderr", 1);
    },
    ensureErrnoError: function () {
      if (FS.ErrnoError) return;
      FS.ErrnoError = function ErrnoError(errno, node) {
        this.node = node;
        this.setErrno = function (errno) {
          this.errno = errno;
        };
        this.setErrno(errno);
        this.message = "FS error";
      };
      FS.ErrnoError.prototype = new Error();
      FS.ErrnoError.prototype.constructor = FS.ErrnoError;
      [44].forEach(function (code) {
        FS.genericErrors[code] = new FS.ErrnoError(code);
        FS.genericErrors[code].stack = "<generic error, no stack>";
      });
    },
    staticInit: function () {
      FS.ensureErrnoError();
      FS.nameTable = new Array(4096);
      FS.mount(MEMFS, {}, "/");
      FS.createDefaultDirectories();
      FS.createDefaultDevices();
      FS.createSpecialDirectories();
      FS.filesystems = { MEMFS: MEMFS, IDBFS: IDBFS };
    },
    init: function (input, output, error) {
      FS.init.initialized = true;
      FS.ensureErrnoError();
      Module["stdin"] = input || Module["stdin"];
      Module["stdout"] = output || Module["stdout"];
      Module["stderr"] = error || Module["stderr"];
      FS.createStandardStreams();
    },
    quit: function () {
      FS.init.initialized = false;
      var fflush = Module["_fflush"];
      if (fflush) fflush(0);
      for (var i = 0; i < FS.streams.length; i++) {
        var stream = FS.streams[i];
        if (!stream) {
          continue;
        }
        FS.close(stream);
      }
    },
    getMode: function (canRead, canWrite) {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    },
    findObject: function (path, dontResolveLastLink) {
      var ret = FS.analyzePath(path, dontResolveLastLink);
      if (ret.exists) {
        return ret.object;
      } else {
        return null;
      }
    },
    analyzePath: function (path, dontResolveLastLink) {
      try {
        var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
        path = lookup.path;
      } catch (e) {}
      var ret = {
        isRoot: false,
        exists: false,
        error: 0,
        name: null,
        path: null,
        object: null,
        parentExists: false,
        parentPath: null,
        parentObject: null,
      };
      try {
        var lookup = FS.lookupPath(path, { parent: true });
        ret.parentExists = true;
        ret.parentPath = lookup.path;
        ret.parentObject = lookup.node;
        ret.name = PATH.basename(path);
        lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
        ret.exists = true;
        ret.path = lookup.path;
        ret.object = lookup.node;
        ret.name = lookup.node.name;
        ret.isRoot = lookup.path === "/";
      } catch (e) {
        ret.error = e.errno;
      }
      return ret;
    },
    createPath: function (parent, path, canRead, canWrite) {
      parent = typeof parent === "string" ? parent : FS.getPath(parent);
      var parts = path.split("/").reverse();
      while (parts.length) {
        var part = parts.pop();
        if (!part) continue;
        var current = PATH.join2(parent, part);
        try {
          FS.mkdir(current);
        } catch (e) {}
        parent = current;
      }
      return current;
    },
    createFile: function (parent, name, properties, canRead, canWrite) {
      var path = PATH.join2(
        typeof parent === "string" ? parent : FS.getPath(parent),
        name
      );
      var mode = FS.getMode(canRead, canWrite);
      return FS.create(path, mode);
    },
    createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
      var path = name
        ? PATH.join2(
            typeof parent === "string" ? parent : FS.getPath(parent),
            name
          )
        : parent;
      var mode = FS.getMode(canRead, canWrite);
      var node = FS.create(path, mode);
      if (data) {
        if (typeof data === "string") {
          var arr = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i)
            arr[i] = data.charCodeAt(i);
          data = arr;
        }
        FS.chmod(node, mode | 146);
        var stream = FS.open(node, 577);
        FS.write(stream, data, 0, data.length, 0, canOwn);
        FS.close(stream);
        FS.chmod(node, mode);
      }
      return node;
    },
    createDevice: function (parent, name, input, output) {
      var path = PATH.join2(
        typeof parent === "string" ? parent : FS.getPath(parent),
        name
      );
      var mode = FS.getMode(!!input, !!output);
      if (!FS.createDevice.major) FS.createDevice.major = 64;
      var dev = FS.makedev(FS.createDevice.major++, 0);
      FS.registerDevice(dev, {
        open: function (stream) {
          stream.seekable = false;
        },
        close: function (stream) {
          if (output && output.buffer && output.buffer.length) {
            output(10);
          }
        },
        read: function (stream, buffer, offset, length, pos) {
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = input();
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
        write: function (stream, buffer, offset, length, pos) {
          for (var i = 0; i < length; i++) {
            try {
              output(buffer[offset + i]);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
      });
      return FS.mkdev(path, mode, dev);
    },
    forceLoadFile: function (obj) {
      if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
      if (typeof XMLHttpRequest !== "undefined") {
        throw new Error(
          "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
        );
      } else if (read_) {
        try {
          obj.contents = intArrayFromString(read_(obj.url), true);
          obj.usedBytes = obj.contents.length;
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
      } else {
        throw new Error("Cannot load without read() or XMLHttpRequest.");
      }
    },
    createLazyFile: function (parent, name, url, canRead, canWrite) {
      function LazyUint8Array() {
        this.lengthKnown = false;
        this.chunks = [];
      }
      LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      };
      LazyUint8Array.prototype.setDataGetter =
        function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
      LazyUint8Array.prototype.cacheLength =
        function LazyUint8Array_cacheLength() {
          var xhr = new XMLHttpRequest();
          xhr.open("HEAD", url, false);
          xhr.send(null);
          if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing =
            (header = xhr.getResponseHeader("Accept-Ranges")) &&
            header === "bytes";
          var usesGzip =
            (header = xhr.getResponseHeader("Content-Encoding")) &&
            header === "gzip";
          var chunkSize = 1024 * 1024;
          if (!hasByteServing) chunkSize = datalength;
          var doXHR = function (from, to) {
            if (from > to)
              throw new Error(
                "invalid range (" +
                  from +
                  ", " +
                  to +
                  ") or no bytes requested!"
              );
            if (to > datalength - 1)
              throw new Error(
                "only " + datalength + " bytes available! programmer error!"
              );
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            if (datalength !== chunkSize)
              xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
            if (typeof Uint8Array != "undefined")
              xhr.responseType = "arraybuffer";
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
            xhr.send(null);
            if (
              !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
            )
              throw new Error(
                "Couldn't load " + url + ". Status: " + xhr.status
              );
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || "", true);
            }
          };
          var lazyArray = this;
          lazyArray.setDataGetter(function (chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum + 1) * chunkSize - 1;
            end = Math.min(end, datalength - 1);
            if (typeof lazyArray.chunks[chunkNum] === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] === "undefined")
              throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
          if (usesGzip || !datalength) {
            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out(
              "LazyFiles on gzip forces download of the whole file when length is accessed"
            );
          }
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
      if (typeof XMLHttpRequest !== "undefined") {
        if (!ENVIRONMENT_IS_WORKER)
          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var lazyArray = new LazyUint8Array();
        Object.defineProperties(lazyArray, {
          length: {
            get: function () {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._length;
            },
          },
          chunkSize: {
            get: function () {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._chunkSize;
            },
          },
        });
        var properties = { isDevice: false, contents: lazyArray };
      } else {
        var properties = { isDevice: false, url: url };
      }
      var node = FS.createFile(parent, name, properties, canRead, canWrite);
      if (properties.contents) {
        node.contents = properties.contents;
      } else if (properties.url) {
        node.contents = null;
        node.url = properties.url;
      }
      Object.defineProperties(node, {
        usedBytes: {
          get: function () {
            return this.contents.length;
          },
        },
      });
      var stream_ops = {};
      var keys = Object.keys(node.stream_ops);
      keys.forEach(function (key) {
        var fn = node.stream_ops[key];
        stream_ops[key] = function forceLoadLazyFile() {
          FS.forceLoadFile(node);
          return fn.apply(null, arguments);
        };
      });
      stream_ops.read = function stream_ops_read(
        stream,
        buffer,
        offset,
        length,
        position
      ) {
        FS.forceLoadFile(node);
        var contents = stream.node.contents;
        if (position >= contents.length) return 0;
        var size = Math.min(contents.length - position, length);
        if (contents.slice) {
          for (var i = 0; i < size; i++) {
            buffer[offset + i] = contents[position + i];
          }
        } else {
          for (var i = 0; i < size; i++) {
            buffer[offset + i] = contents.get(position + i);
          }
        }
        return size;
      };
      node.stream_ops = stream_ops;
      return node;
    },
    createPreloadedFile: function (
      parent,
      name,
      url,
      canRead,
      canWrite,
      onload,
      onerror,
      dontCreateFile,
      canOwn,
      preFinish
    ) {
      Browser.init();
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency("cp " + fullname);
      function processData(byteArray) {
        function finish(byteArray) {
          if (preFinish) preFinish();
          if (!dontCreateFile) {
            FS.createDataFile(
              parent,
              name,
              byteArray,
              canRead,
              canWrite,
              canOwn
            );
          }
          if (onload) onload();
          removeRunDependency(dep);
        }
        var handled = false;
        Module["preloadPlugins"].forEach(function (plugin) {
          if (handled) return;
          if (plugin["canHandle"](fullname)) {
            plugin["handle"](byteArray, fullname, finish, function () {
              if (onerror) onerror();
              removeRunDependency(dep);
            });
            handled = true;
          }
        });
        if (!handled) finish(byteArray);
      }
      addRunDependency(dep);
      if (typeof url == "string") {
        Browser.asyncLoad(
          url,
          function (byteArray) {
            processData(byteArray);
          },
          onerror
        );
      } else {
        processData(url);
      }
    },
    indexedDB: function () {
      return (
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB
      );
    },
    DB_NAME: function () {
      return "EM_FS_" + window.location.pathname;
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function (paths, onload, onerror) {
      onload = onload || function () {};
      onerror = onerror || function () {};
      var indexedDB = FS.indexedDB();
      try {
        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
      } catch (e) {
        return onerror(e);
      }
      openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
        out("creating db");
        var db = openRequest.result;
        db.createObjectStore(FS.DB_STORE_NAME);
      };
      openRequest.onsuccess = function openRequest_onsuccess() {
        var db = openRequest.result;
        var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
        var files = transaction.objectStore(FS.DB_STORE_NAME);
        var ok = 0,
          fail = 0,
          total = paths.length;
        function finish() {
          if (fail == 0) onload();
          else onerror();
        }
        paths.forEach(function (path) {
          var putRequest = files.put(
            FS.analyzePath(path).object.contents,
            path
          );
          putRequest.onsuccess = function putRequest_onsuccess() {
            ok++;
            if (ok + fail == total) finish();
          };
          putRequest.onerror = function putRequest_onerror() {
            fail++;
            if (ok + fail == total) finish();
          };
        });
        transaction.onerror = onerror;
      };
      openRequest.onerror = onerror;
    },
    loadFilesFromDB: function (paths, onload, onerror) {
      onload = onload || function () {};
      onerror = onerror || function () {};
      var indexedDB = FS.indexedDB();
      try {
        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
      } catch (e) {
        return onerror(e);
      }
      openRequest.onupgradeneeded = onerror;
      openRequest.onsuccess = function openRequest_onsuccess() {
        var db = openRequest.result;
        try {
          var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
        } catch (e) {
          onerror(e);
          return;
        }
        var files = transaction.objectStore(FS.DB_STORE_NAME);
        var ok = 0,
          fail = 0,
          total = paths.length;
        function finish() {
          if (fail == 0) onload();
          else onerror();
        }
        paths.forEach(function (path) {
          var getRequest = files.get(path);
          getRequest.onsuccess = function getRequest_onsuccess() {
            if (FS.analyzePath(path).exists) {
              FS.unlink(path);
            }
            FS.createDataFile(
              PATH.dirname(path),
              PATH.basename(path),
              getRequest.result,
              true,
              true,
              true
            );
            ok++;
            if (ok + fail == total) finish();
          };
          getRequest.onerror = function getRequest_onerror() {
            fail++;
            if (ok + fail == total) finish();
          };
        });
        transaction.onerror = onerror;
      };
      openRequest.onerror = onerror;
    },
  };
  var SYSCALLS = {
    mappings: {},
    DEFAULT_POLLMASK: 5,
    umask: 511,
    calculateAt: function (dirfd, path, allowEmpty) {
      if (path[0] === "/") {
        return path;
      }
      var dir;
      if (dirfd === -100) {
        dir = FS.cwd();
      } else {
        var dirstream = FS.getStream(dirfd);
        if (!dirstream) throw new FS.ErrnoError(8);
        dir = dirstream.path;
      }
      if (path.length == 0) {
        if (!allowEmpty) {
          throw new FS.ErrnoError(44);
        }
        return dir;
      }
      return PATH.join2(dir, path);
    },
    doStat: function (func, path, buf) {
      try {
        var stat = func(path);
      } catch (e) {
        if (
          e &&
          e.node &&
          PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
        ) {
          return -54;
        }
        throw e;
      }
      HEAP32[buf >> 2] = stat.dev;
      HEAP32[(buf + 4) >> 2] = 0;
      HEAP32[(buf + 8) >> 2] = stat.ino;
      HEAP32[(buf + 12) >> 2] = stat.mode;
      HEAP32[(buf + 16) >> 2] = stat.nlink;
      HEAP32[(buf + 20) >> 2] = stat.uid;
      HEAP32[(buf + 24) >> 2] = stat.gid;
      HEAP32[(buf + 28) >> 2] = stat.rdev;
      HEAP32[(buf + 32) >> 2] = 0;
      (tempI64 = [
        stat.size >>> 0,
        ((tempDouble = stat.size),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(buf + 40) >> 2] = tempI64[0]),
        (HEAP32[(buf + 44) >> 2] = tempI64[1]);
      HEAP32[(buf + 48) >> 2] = 4096;
      HEAP32[(buf + 52) >> 2] = stat.blocks;
      HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
      HEAP32[(buf + 60) >> 2] = 0;
      HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
      HEAP32[(buf + 68) >> 2] = 0;
      HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
      HEAP32[(buf + 76) >> 2] = 0;
      (tempI64 = [
        stat.ino >>> 0,
        ((tempDouble = stat.ino),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(buf + 80) >> 2] = tempI64[0]),
        (HEAP32[(buf + 84) >> 2] = tempI64[1]);
      return 0;
    },
    doMsync: function (addr, stream, len, flags, offset) {
      var buffer = HEAPU8.slice(addr, addr + len);
      FS.msync(stream, buffer, offset, len, flags);
    },
    doMkdir: function (path, mode) {
      path = PATH.normalize(path);
      if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
      FS.mkdir(path, mode, 0);
      return 0;
    },
    doMknod: function (path, mode, dev) {
      switch (mode & 61440) {
        case 32768:
        case 8192:
        case 24576:
        case 4096:
        case 49152:
          break;
        default:
          return -28;
      }
      FS.mknod(path, mode, dev);
      return 0;
    },
    doReadlink: function (path, buf, bufsize) {
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf + len];
      stringToUTF8(ret, buf, bufsize + 1);
      HEAP8[buf + len] = endChar;
      return len;
    },
    doAccess: function (path, amode) {
      if (amode & ~7) {
        return -28;
      }
      var node;
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
      if (!node) {
        return -44;
      }
      var perms = "";
      if (amode & 4) perms += "r";
      if (amode & 2) perms += "w";
      if (amode & 1) perms += "x";
      if (perms && FS.nodePermissions(node, perms)) {
        return -2;
      }
      return 0;
    },
    doDup: function (path, flags, suggestFD) {
      var suggest = FS.getStream(suggestFD);
      if (suggest) FS.close(suggest);
      return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
    },
    doReadv: function (stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(iov + i * 8) >> 2];
        var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
      }
      return ret;
    },
    doWritev: function (stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(iov + i * 8) >> 2];
        var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
      }
      return ret;
    },
    varargs: undefined,
    get: function () {
      SYSCALLS.varargs += 4;
      var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
      return ret;
    },
    getStr: function (ptr) {
      var ret = UTF8ToString(ptr);
      return ret;
    },
    getStreamFromFD: function (fd) {
      var stream = FS.getStream(fd);
      if (!stream) throw new FS.ErrnoError(8);
      return stream;
    },
    get64: function (low, high) {
      return low;
    },
  };
  function ___sys__newselect(nfds, readfds, writefds, exceptfds, timeout) {
    try {
      var total = 0;
      var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0,
        srcReadHigh = readfds ? HEAP32[(readfds + 4) >> 2] : 0;
      var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0,
        srcWriteHigh = writefds ? HEAP32[(writefds + 4) >> 2] : 0;
      var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0,
        srcExceptHigh = exceptfds ? HEAP32[(exceptfds + 4) >> 2] : 0;
      var dstReadLow = 0,
        dstReadHigh = 0;
      var dstWriteLow = 0,
        dstWriteHigh = 0;
      var dstExceptLow = 0,
        dstExceptHigh = 0;
      var allLow =
        (readfds ? HEAP32[readfds >> 2] : 0) |
        (writefds ? HEAP32[writefds >> 2] : 0) |
        (exceptfds ? HEAP32[exceptfds >> 2] : 0);
      var allHigh =
        (readfds ? HEAP32[(readfds + 4) >> 2] : 0) |
        (writefds ? HEAP32[(writefds + 4) >> 2] : 0) |
        (exceptfds ? HEAP32[(exceptfds + 4) >> 2] : 0);
      var check = function (fd, low, high, val) {
        return fd < 32 ? low & val : high & val;
      };
      for (var fd = 0; fd < nfds; fd++) {
        var mask = 1 << fd % 32;
        if (!check(fd, allLow, allHigh, mask)) {
          continue;
        }
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        var flags = SYSCALLS.DEFAULT_POLLMASK;
        if (stream.stream_ops.poll) {
          flags = stream.stream_ops.poll(stream);
        }
        if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
          fd < 32
            ? (dstReadLow = dstReadLow | mask)
            : (dstReadHigh = dstReadHigh | mask);
          total++;
        }
        if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
          fd < 32
            ? (dstWriteLow = dstWriteLow | mask)
            : (dstWriteHigh = dstWriteHigh | mask);
          total++;
        }
        if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
          fd < 32
            ? (dstExceptLow = dstExceptLow | mask)
            : (dstExceptHigh = dstExceptHigh | mask);
          total++;
        }
      }
      if (readfds) {
        HEAP32[readfds >> 2] = dstReadLow;
        HEAP32[(readfds + 4) >> 2] = dstReadHigh;
      }
      if (writefds) {
        HEAP32[writefds >> 2] = dstWriteLow;
        HEAP32[(writefds + 4) >> 2] = dstWriteHigh;
      }
      if (exceptfds) {
        HEAP32[exceptfds >> 2] = dstExceptLow;
        HEAP32[(exceptfds + 4) >> 2] = dstExceptHigh;
      }
      return total;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_access(path, amode) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doAccess(path, amode);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_chmod(path, mode) {
    try {
      path = SYSCALLS.getStr(path);
      FS.chmod(path, mode);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function setErrNo(value) {
    HEAP32[___errno_location() >> 2] = value;
    return value;
  }
  function ___sys_fcntl64(fd, cmd, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12: {
          var arg = SYSCALLS.get();
          var offset = 0;
          HEAP16[(arg + offset) >> 1] = 2;
          return 0;
        }
        case 13:
        case 14:
          return 0;
        case 16:
        case 8:
          return -28;
        case 9:
          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_fstat64(fd, buf) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_getcwd(buf, size) {
    try {
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd);
      if (size < cwdLengthInBytes + 1) return -68;
      stringToUTF8(cwd, buf, size);
      return buf;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_getdents64(fd, dirp, count) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }
      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);
      var idx = Math.floor(off / struct_size);
      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name[0] === ".") {
          id = 1;
          type = 4;
        } else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode)
            ? 2
            : FS.isDir(child.mode)
            ? 4
            : FS.isLink(child.mode)
            ? 10
            : 8;
        }
        (tempI64 = [
          id >>> 0,
          ((tempDouble = id),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
          (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
        (tempI64 = [
          ((idx + 1) * struct_size) >>> 0,
          ((tempDouble = (idx + 1) * struct_size),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
          (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
        HEAP16[(dirp + pos + 16) >> 1] = 280;
        HEAP8[(dirp + pos + 18) >> 0] = type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_getrusage(who, usage) {
    try {
      _memset(usage, 0, 136);
      HEAP32[usage >> 2] = 1;
      HEAP32[(usage + 4) >> 2] = 2;
      HEAP32[(usage + 8) >> 2] = 3;
      HEAP32[(usage + 12) >> 2] = 4;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_getegid32() {
    return 0;
  }
  function ___sys_getuid32() {
    return ___sys_getegid32();
  }
  function ___sys_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[argp >> 2] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28;
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          if (!stream.tty) return -59;
          return 0;
        }
        default:
          abort("bad ioctl syscall " + op);
      }
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_lstat64(path, buf) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_mkdir(path, mode) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doMkdir(path, mode);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function syscallMmap2(addr, len, prot, flags, fd, off) {
    off <<= 12;
    var ptr;
    var allocated = false;
    if ((flags & 16) !== 0 && addr % 65536 !== 0) {
      return -28;
    }
    if ((flags & 32) !== 0) {
      ptr = _memalign(65536, len);
      if (!ptr) return -48;
      _memset(ptr, 0, len);
      allocated = true;
    } else {
      var info = FS.getStream(fd);
      if (!info) return -8;
      var res = FS.mmap(info, addr, len, off, prot, flags);
      ptr = res.ptr;
      allocated = res.allocated;
    }
    SYSCALLS.mappings[ptr] = {
      malloc: ptr,
      len: len,
      allocated: allocated,
      fd: fd,
      prot: prot,
      flags: flags,
      offset: off,
    };
    return ptr;
  }
  function ___sys_mmap2(addr, len, prot, flags, fd, off) {
    try {
      return syscallMmap2(addr, len, prot, flags, fd, off);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function syscallMunmap(addr, len) {
    if ((addr | 0) === -1 || len === 0) {
      return -28;
    }
    var info = SYSCALLS.mappings[addr];
    if (!info) return 0;
    if (len === info.len) {
      var stream = FS.getStream(info.fd);
      if (stream) {
        if (info.prot & 2) {
          SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
        }
        FS.munmap(stream);
      }
      SYSCALLS.mappings[addr] = null;
      if (info.allocated) {
        _free(info.malloc);
      }
    }
    return 0;
  }
  function ___sys_munmap(addr, len) {
    try {
      return syscallMunmap(addr, len);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_open(path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
      var pathname = SYSCALLS.getStr(path);
      var mode = varargs ? SYSCALLS.get() : 0;
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_readlink(path, buf, bufsize) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doReadlink(path, buf, bufsize);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_rename(old_path, new_path) {
    try {
      old_path = SYSCALLS.getStr(old_path);
      new_path = SYSCALLS.getStr(new_path);
      FS.rename(old_path, new_path);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_rmdir(path) {
    try {
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_stat64(path, buf) {
    try {
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_statfs64(path, size, buf) {
    try {
      path = SYSCALLS.getStr(path);
      HEAP32[(buf + 4) >> 2] = 4096;
      HEAP32[(buf + 40) >> 2] = 4096;
      HEAP32[(buf + 8) >> 2] = 1e6;
      HEAP32[(buf + 12) >> 2] = 5e5;
      HEAP32[(buf + 16) >> 2] = 5e5;
      HEAP32[(buf + 20) >> 2] = FS.nextInode;
      HEAP32[(buf + 24) >> 2] = 1e6;
      HEAP32[(buf + 28) >> 2] = 42;
      HEAP32[(buf + 44) >> 2] = 2;
      HEAP32[(buf + 36) >> 2] = 255;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_truncate64(path, zero, low, high) {
    try {
      path = SYSCALLS.getStr(path);
      var length = SYSCALLS.get64(low, high);
      FS.truncate(path, length);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function ___sys_unlink(path) {
    try {
      path = SYSCALLS.getStr(path);
      FS.unlink(path);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return -e.errno;
    }
  }
  function _abort() {
    abort();
  }
  function _clock() {
    if (_clock.start === undefined) _clock.start = Date.now();
    return ((Date.now() - _clock.start) * (1e6 / 1e3)) | 0;
  }
  function _emscripten_get_now_res() {
    if (ENVIRONMENT_IS_NODE) {
      return 1;
    } else if (typeof dateNow !== "undefined") {
      return 1e3;
    } else return 1e3;
  }
  var _emscripten_get_now_is_monotonic = true;
  function _clock_getres(clk_id, res) {
    var nsec;
    if (clk_id === 0) {
      nsec = 1e3 * 1e3;
    } else if (clk_id === 1 && _emscripten_get_now_is_monotonic) {
      nsec = _emscripten_get_now_res();
    } else {
      setErrNo(28);
      return -1;
    }
    HEAP32[res >> 2] = (nsec / 1e9) | 0;
    HEAP32[(res + 4) >> 2] = nsec;
    return 0;
  }
  var _emscripten_get_now;
  if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function () {
      var t = process["hrtime"]();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow;
  } else
    _emscripten_get_now = function () {
      return performance.now();
    };
  function _clock_gettime(clk_id, tp) {
    var now;
    if (clk_id === 0) {
      now = Date.now();
    } else if (
      (clk_id === 1 || clk_id === 4) &&
      _emscripten_get_now_is_monotonic
    ) {
      now = _emscripten_get_now();
    } else {
      setErrNo(28);
      return -1;
    }
    HEAP32[tp >> 2] = (now / 1e3) | 0;
    HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
    return 0;
  }
  function _difftime(time1, time0) {
    return time1 - time0;
  }
  function _dlclose(handle) {}
  function _dlerror() {
    return 0;
  }
  function _dlopen(filename, flag) {}
  function _dlsym(handle, symbol) {
    return 0;
  }
  var readAsmConstArgsArray = [];
  function readAsmConstArgs(sigPtr, buf) {
    readAsmConstArgsArray.length = 0;
    var ch;
    buf >>= 2;
    while ((ch = HEAPU8[sigPtr++])) {
      var double = ch < 105;
      if (double && buf & 1) buf++;
      readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
      ++buf;
    }
    return readAsmConstArgsArray;
  }
  function mainThreadEM_ASM(code, sigPtr, argbuf, sync) {
    var args = readAsmConstArgs(sigPtr, argbuf);
    return ASM_CONSTS[code].apply(null, args);
  }
  function _emscripten_asm_const_int_sync_on_main_thread(code, sigPtr, argbuf) {
    return mainThreadEM_ASM(code, sigPtr, argbuf, 1);
  }
  function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
      return 1;
    }
    if (!Browser.mainLoop.running) {
      Browser.mainLoop.running = true;
    }
    if (mode == 0) {
      Browser.mainLoop.scheduler =
        function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick =
            Math.max(
              0,
              Browser.mainLoop.tickStartTime + value - _emscripten_get_now()
            ) | 0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
        };
      Browser.mainLoop.method = "timeout";
    } else if (mode == 1) {
      Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
        Browser.requestAnimationFrame(Browser.mainLoop.runner);
      };
      Browser.mainLoop.method = "rAF";
    } else if (mode == 2) {
      if (typeof setImmediate === "undefined") {
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
        var Browser_setImmediate_messageHandler = function (event) {
          if (
            event.data === emscriptenMainLoopMessageId ||
            event.data.target === emscriptenMainLoopMessageId
          ) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", Browser_setImmediate_messageHandler, true);
        setImmediate = function Browser_emulated_setImmediate(func) {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            if (Module["setImmediates"] === undefined)
              Module["setImmediates"] = [];
            Module["setImmediates"].push(func);
            postMessage({ target: emscriptenMainLoopMessageId });
          } else postMessage(emscriptenMainLoopMessageId, "*");
        };
      }
      Browser.mainLoop.scheduler =
        function Browser_mainLoop_scheduler_setImmediate() {
          setImmediate(Browser.mainLoop.runner);
        };
      Browser.mainLoop.method = "immediate";
    }
    return 0;
  }
  function _exit(status) {
    exit(status);
  }
  function maybeExit() {
    if (!keepRuntimeAlive()) {
      try {
        _exit(EXITSTATUS);
      } catch (e) {
        if (e instanceof ExitStatus) {
          return;
        }
        throw e;
      }
    }
  }
  function setMainLoop(
    browserIterationFunc,
    fps,
    simulateInfiniteLoop,
    arg,
    noSetTiming
  ) {
    assert(
      !Browser.mainLoop.func,
      "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
    );
    Browser.mainLoop.func = browserIterationFunc;
    Browser.mainLoop.arg = arg;
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    function checkIsRunning() {
      if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
        maybeExit();
        return false;
      }
      return true;
    }
    Browser.mainLoop.running = false;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
      if (ABORT) return;
      if (Browser.mainLoop.queue.length > 0) {
        var start = Date.now();
        var blocker = Browser.mainLoop.queue.shift();
        blocker.func(blocker.arg);
        if (Browser.mainLoop.remainingBlockers) {
          var remaining = Browser.mainLoop.remainingBlockers;
          var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
          if (blocker.counted) {
            Browser.mainLoop.remainingBlockers = next;
          } else {
            next = next + 0.5;
            Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
          }
        }
        console.log(
          'main loop blocker "' +
            blocker.name +
            '" took ' +
            (Date.now() - start) +
            " ms"
        );
        Browser.mainLoop.updateStatus();
        if (!checkIsRunning()) return;
        setTimeout(Browser.mainLoop.runner, 0);
        return;
      }
      if (!checkIsRunning()) return;
      Browser.mainLoop.currentFrameNumber =
        (Browser.mainLoop.currentFrameNumber + 1) | 0;
      if (
        Browser.mainLoop.timingMode == 1 &&
        Browser.mainLoop.timingValue > 1 &&
        Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0
      ) {
        Browser.mainLoop.scheduler();
        return;
      } else if (Browser.mainLoop.timingMode == 0) {
        Browser.mainLoop.tickStartTime = _emscripten_get_now();
      }
      GL.newRenderingFrameStarted();
      Browser.mainLoop.runIter(browserIterationFunc);
      if (!checkIsRunning()) return;
      if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData)
        SDL.audio.queueNewAudioData();
      Browser.mainLoop.scheduler();
    };
    if (!noSetTiming) {
      if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
      else _emscripten_set_main_loop_timing(1, 1);
      Browser.mainLoop.scheduler();
    }
    if (simulateInfiniteLoop) {
      throw "unwind";
    }
  }
  function callUserCallback(func, synchronous) {
    if (ABORT) {
      return;
    }
    if (synchronous) {
      func();
      return;
    }
    try {
      func();
    } catch (e) {
      if (e instanceof ExitStatus) {
        return;
      } else if (e !== "unwind") {
        if (e && typeof e === "object" && e.stack)
          err("exception thrown: " + [e, e.stack]);
        throw e;
      }
    }
  }
  var Browser = {
    mainLoop: {
      running: false,
      scheduler: null,
      method: "",
      currentlyRunningMainloop: 0,
      func: null,
      arg: 0,
      timingMode: 0,
      timingValue: 0,
      currentFrameNumber: 0,
      queue: [],
      pause: function () {
        Browser.mainLoop.scheduler = null;
        Browser.mainLoop.currentlyRunningMainloop++;
      },
      resume: function () {
        Browser.mainLoop.currentlyRunningMainloop++;
        var timingMode = Browser.mainLoop.timingMode;
        var timingValue = Browser.mainLoop.timingValue;
        var func = Browser.mainLoop.func;
        Browser.mainLoop.func = null;
        setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
        _emscripten_set_main_loop_timing(timingMode, timingValue);
        Browser.mainLoop.scheduler();
      },
      updateStatus: function () {
        if (Module["setStatus"]) {
          var message = Module["statusMessage"] || "Please wait...";
          var remaining = Browser.mainLoop.remainingBlockers;
          var expected = Browser.mainLoop.expectedBlockers;
          if (remaining) {
            if (remaining < expected) {
              Module["setStatus"](
                message + " (" + (expected - remaining) + "/" + expected + ")"
              );
            } else {
              Module["setStatus"](message);
            }
          } else {
            Module["setStatus"]("");
          }
        }
      },
      runIter: function (func) {
        if (ABORT) return;
        if (Module["preMainLoop"]) {
          var preRet = Module["preMainLoop"]();
          if (preRet === false) {
            return;
          }
        }
        callUserCallback(func);
        if (Module["postMainLoop"]) Module["postMainLoop"]();
      },
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: function () {
      if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
      if (Browser.initted) return;
      Browser.initted = true;
      try {
        new Blob();
        Browser.hasBlobConstructor = true;
      } catch (e) {
        Browser.hasBlobConstructor = false;
        console.log(
          "warning: no blob constructor, cannot create blobs with mimetypes"
        );
      }
      Browser.BlobBuilder =
        typeof MozBlobBuilder != "undefined"
          ? MozBlobBuilder
          : typeof WebKitBlobBuilder != "undefined"
          ? WebKitBlobBuilder
          : !Browser.hasBlobConstructor
          ? console.log("warning: no BlobBuilder")
          : null;
      Browser.URLObject =
        typeof window != "undefined"
          ? window.URL
            ? window.URL
            : window.webkitURL
          : undefined;
      if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
        console.log(
          "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
        );
        Module.noImageDecoding = true;
      }
      var imagePlugin = {};
      imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
        return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
      };
      imagePlugin["handle"] = function imagePlugin_handle(
        byteArray,
        name,
        onload,
        onerror
      ) {
        var b = null;
        if (Browser.hasBlobConstructor) {
          try {
            b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            if (b.size !== byteArray.length) {
              b = new Blob([new Uint8Array(byteArray).buffer], {
                type: Browser.getMimetype(name),
              });
            }
          } catch (e) {
            warnOnce(
              "Blob constructor present but fails: " +
                e +
                "; falling back to blob builder"
            );
          }
        }
        if (!b) {
          var bb = new Browser.BlobBuilder();
          bb.append(new Uint8Array(byteArray).buffer);
          b = bb.getBlob();
        }
        var url = Browser.URLObject.createObjectURL(b);
        var img = new Image();
        img.onload = function img_onload() {
          assert(img.complete, "Image " + name + " could not be decoded");
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          Module["preloadedImages"][name] = canvas;
          Browser.URLObject.revokeObjectURL(url);
          if (onload) onload(byteArray);
        };
        img.onerror = function img_onerror(event) {
          console.log("Image " + url + " could not be decoded");
          if (onerror) onerror();
        };
        img.src = url;
      };
      Module["preloadPlugins"].push(imagePlugin);
      var audioPlugin = {};
      audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
        return (
          !Module.noAudioDecoding &&
          name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }
        );
      };
      audioPlugin["handle"] = function audioPlugin_handle(
        byteArray,
        name,
        onload,
        onerror
      ) {
        var done = false;
        function finish(audio) {
          if (done) return;
          done = true;
          Module["preloadedAudios"][name] = audio;
          if (onload) onload(byteArray);
        }
        function fail() {
          if (done) return;
          done = true;
          Module["preloadedAudios"][name] = new Audio();
          if (onerror) onerror();
        }
        if (Browser.hasBlobConstructor) {
          try {
            var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          } catch (e) {
            return fail();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var audio = new Audio();
          audio.addEventListener(
            "canplaythrough",
            function () {
              finish(audio);
            },
            false
          );
          audio.onerror = function audio_onerror(event) {
            if (done) return;
            console.log(
              "warning: browser could not fully decode audio " +
                name +
                ", trying slower base64 approach"
            );
            function encode64(data) {
              var BASE =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
              var PAD = "=";
              var ret = "";
              var leftchar = 0;
              var leftbits = 0;
              for (var i = 0; i < data.length; i++) {
                leftchar = (leftchar << 8) | data[i];
                leftbits += 8;
                while (leftbits >= 6) {
                  var curr = (leftchar >> (leftbits - 6)) & 63;
                  leftbits -= 6;
                  ret += BASE[curr];
                }
              }
              if (leftbits == 2) {
                ret += BASE[(leftchar & 3) << 4];
                ret += PAD + PAD;
              } else if (leftbits == 4) {
                ret += BASE[(leftchar & 15) << 2];
                ret += PAD;
              }
              return ret;
            }
            audio.src =
              "data:audio/x-" +
              name.substr(-3) +
              ";base64," +
              encode64(byteArray);
            finish(audio);
          };
          audio.src = url;
          Browser.safeSetTimeout(function () {
            finish(audio);
          }, 1e4);
        } else {
          return fail();
        }
      };
      Module["preloadPlugins"].push(audioPlugin);
      function pointerLockChange() {
        Browser.pointerLock =
          document["pointerLockElement"] === Module["canvas"] ||
          document["mozPointerLockElement"] === Module["canvas"] ||
          document["webkitPointerLockElement"] === Module["canvas"] ||
          document["msPointerLockElement"] === Module["canvas"];
      }
      var canvas = Module["canvas"];
      if (canvas) {
        canvas.requestPointerLock =
          canvas["requestPointerLock"] ||
          canvas["mozRequestPointerLock"] ||
          canvas["webkitRequestPointerLock"] ||
          canvas["msRequestPointerLock"] ||
          function () {};
        canvas.exitPointerLock =
          document["exitPointerLock"] ||
          document["mozExitPointerLock"] ||
          document["webkitExitPointerLock"] ||
          document["msExitPointerLock"] ||
          function () {};
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        document.addEventListener(
          "pointerlockchange",
          pointerLockChange,
          false
        );
        document.addEventListener(
          "mozpointerlockchange",
          pointerLockChange,
          false
        );
        document.addEventListener(
          "webkitpointerlockchange",
          pointerLockChange,
          false
        );
        document.addEventListener(
          "mspointerlockchange",
          pointerLockChange,
          false
        );
        if (Module["elementPointerLock"]) {
          canvas.addEventListener(
            "click",
            function (ev) {
              if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                Module["canvas"].requestPointerLock();
                ev.preventDefault();
              }
            },
            false
          );
        }
      }
    },
    createContext: function (
      canvas,
      useWebGL,
      setInModule,
      webGLContextAttributes
    ) {
      if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
      var ctx;
      var contextHandle;
      if (useWebGL) {
        var contextAttributes = {
          antialias: false,
          alpha: false,
          majorVersion: typeof WebGL2RenderingContext !== "undefined" ? 2 : 1,
        };
        if (webGLContextAttributes) {
          for (var attribute in webGLContextAttributes) {
            contextAttributes[attribute] = webGLContextAttributes[attribute];
          }
        }
        if (typeof GL !== "undefined") {
          contextHandle = GL.createContext(canvas, contextAttributes);
          if (contextHandle) {
            ctx = GL.getContext(contextHandle).GLctx;
          }
        }
      } else {
        ctx = canvas.getContext("2d");
      }
      if (!ctx) return null;
      if (setInModule) {
        if (!useWebGL)
          assert(
            typeof GLctx === "undefined",
            "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
          );
        Module.ctx = ctx;
        if (useWebGL) GL.makeContextCurrent(contextHandle);
        Module.useWebGL = useWebGL;
        Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
          callback();
        });
        Browser.init();
      }
      return ctx;
    },
    destroyContext: function (canvas, useWebGL, setInModule) {},
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: function (lockPointer, resizeCanvas) {
      Browser.lockPointer = lockPointer;
      Browser.resizeCanvas = resizeCanvas;
      if (typeof Browser.lockPointer === "undefined")
        Browser.lockPointer = true;
      if (typeof Browser.resizeCanvas === "undefined")
        Browser.resizeCanvas = false;
      var canvas = Module["canvas"];
      function fullscreenChange() {
        Browser.isFullscreen = false;
        var canvasContainer = canvas.parentNode;
        if (
          (document["fullscreenElement"] ||
            document["mozFullScreenElement"] ||
            document["msFullscreenElement"] ||
            document["webkitFullscreenElement"] ||
            document["webkitCurrentFullScreenElement"]) === canvasContainer
        ) {
          canvas.exitFullscreen = Browser.exitFullscreen;
          if (Browser.lockPointer) canvas.requestPointerLock();
          Browser.isFullscreen = true;
          if (Browser.resizeCanvas) {
            Browser.setFullscreenCanvasSize();
          } else {
            Browser.updateCanvasDimensions(canvas);
          }
        } else {
          canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
          canvasContainer.parentNode.removeChild(canvasContainer);
          if (Browser.resizeCanvas) {
            Browser.setWindowedCanvasSize();
          } else {
            Browser.updateCanvasDimensions(canvas);
          }
        }
        if (Module["onFullScreen"])
          Module["onFullScreen"](Browser.isFullscreen);
        if (Module["onFullscreen"])
          Module["onFullscreen"](Browser.isFullscreen);
      }
      if (!Browser.fullscreenHandlersInstalled) {
        Browser.fullscreenHandlersInstalled = true;
        document.addEventListener("fullscreenchange", fullscreenChange, false);
        document.addEventListener(
          "mozfullscreenchange",
          fullscreenChange,
          false
        );
        document.addEventListener(
          "webkitfullscreenchange",
          fullscreenChange,
          false
        );
        document.addEventListener(
          "MSFullscreenChange",
          fullscreenChange,
          false
        );
      }
      var canvasContainer = document.createElement("div");
      canvas.parentNode.insertBefore(canvasContainer, canvas);
      canvasContainer.appendChild(canvas);
      canvasContainer.requestFullscreen =
        canvasContainer["requestFullscreen"] ||
        canvasContainer["mozRequestFullScreen"] ||
        canvasContainer["msRequestFullscreen"] ||
        (canvasContainer["webkitRequestFullscreen"]
          ? function () {
              canvasContainer["webkitRequestFullscreen"](
                Element["ALLOW_KEYBOARD_INPUT"]
              );
            }
          : null) ||
        (canvasContainer["webkitRequestFullScreen"]
          ? function () {
              canvasContainer["webkitRequestFullScreen"](
                Element["ALLOW_KEYBOARD_INPUT"]
              );
            }
          : null);
      canvasContainer.requestFullscreen();
    },
    exitFullscreen: function () {
      if (!Browser.isFullscreen) {
        return false;
      }
      var CFS =
        document["exitFullscreen"] ||
        document["cancelFullScreen"] ||
        document["mozCancelFullScreen"] ||
        document["msExitFullscreen"] ||
        document["webkitCancelFullScreen"] ||
        function () {};
      CFS.apply(document, []);
      return true;
    },
    nextRAF: 0,
    fakeRequestAnimationFrame: function (func) {
      var now = Date.now();
      if (Browser.nextRAF === 0) {
        Browser.nextRAF = now + 1e3 / 60;
      } else {
        while (now + 2 >= Browser.nextRAF) {
          Browser.nextRAF += 1e3 / 60;
        }
      }
      var delay = Math.max(Browser.nextRAF - now, 0);
      setTimeout(func, delay);
    },
    requestAnimationFrame: function (func) {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(func);
        return;
      }
      var RAF = Browser.fakeRequestAnimationFrame;
      RAF(func);
    },
    safeRequestAnimationFrame: function (func) {
      return Browser.requestAnimationFrame(function () {
        callUserCallback(func);
      });
    },
    safeSetTimeout: function (func, timeout) {
      return setTimeout(function () {
        callUserCallback(func);
      }, timeout);
    },
    getMimetype: function (name) {
      return {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        bmp: "image/bmp",
        ogg: "audio/ogg",
        wav: "audio/wav",
        mp3: "audio/mpeg",
      }[name.substr(name.lastIndexOf(".") + 1)];
    },
    getUserMedia: function (func) {
      if (!window.getUserMedia) {
        window.getUserMedia =
          navigator["getUserMedia"] || navigator["mozGetUserMedia"];
      }
      window.getUserMedia(func);
    },
    getMovementX: function (event) {
      return (
        event["movementX"] ||
        event["mozMovementX"] ||
        event["webkitMovementX"] ||
        0
      );
    },
    getMovementY: function (event) {
      return (
        event["movementY"] ||
        event["mozMovementY"] ||
        event["webkitMovementY"] ||
        0
      );
    },
    getMouseWheelDelta: function (event) {
      var delta = 0;
      switch (event.type) {
        case "DOMMouseScroll":
          delta = event.detail / 3;
          break;
        case "mousewheel":
          delta = event.wheelDelta / 120;
          break;
        case "wheel":
          delta = event.deltaY;
          switch (event.deltaMode) {
            case 0:
              delta /= 100;
              break;
            case 1:
              delta /= 3;
              break;
            case 2:
              delta *= 80;
              break;
            default:
              throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
          }
          break;
        default:
          throw "unrecognized mouse wheel event: " + event.type;
      }
      return delta;
    },
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: function (event) {
      if (Browser.pointerLock) {
        if (event.type != "mousemove" && "mozMovementX" in event) {
          Browser.mouseMovementX = Browser.mouseMovementY = 0;
        } else {
          Browser.mouseMovementX = Browser.getMovementX(event);
          Browser.mouseMovementY = Browser.getMovementY(event);
        }
        if (typeof SDL != "undefined") {
          Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
        } else {
          Browser.mouseX += Browser.mouseMovementX;
          Browser.mouseY += Browser.mouseMovementY;
        }
      } else {
        var rect = Module["canvas"].getBoundingClientRect();
        var cw = Module["canvas"].width;
        var ch = Module["canvas"].height;
        var scrollX =
          typeof window.scrollX !== "undefined"
            ? window.scrollX
            : window.pageXOffset;
        var scrollY =
          typeof window.scrollY !== "undefined"
            ? window.scrollY
            : window.pageYOffset;
        if (
          event.type === "touchstart" ||
          event.type === "touchend" ||
          event.type === "touchmove"
        ) {
          var touch = event.touch;
          if (touch === undefined) {
            return;
          }
          var adjustedX = touch.pageX - (scrollX + rect.left);
          var adjustedY = touch.pageY - (scrollY + rect.top);
          adjustedX = adjustedX * (cw / rect.width);
          adjustedY = adjustedY * (ch / rect.height);
          var coords = { x: adjustedX, y: adjustedY };
          if (event.type === "touchstart") {
            Browser.lastTouches[touch.identifier] = coords;
            Browser.touches[touch.identifier] = coords;
          } else if (event.type === "touchend" || event.type === "touchmove") {
            var last = Browser.touches[touch.identifier];
            if (!last) last = coords;
            Browser.lastTouches[touch.identifier] = last;
            Browser.touches[touch.identifier] = coords;
          }
          return;
        }
        var x = event.pageX - (scrollX + rect.left);
        var y = event.pageY - (scrollY + rect.top);
        x = x * (cw / rect.width);
        y = y * (ch / rect.height);
        Browser.mouseMovementX = x - Browser.mouseX;
        Browser.mouseMovementY = y - Browser.mouseY;
        Browser.mouseX = x;
        Browser.mouseY = y;
      }
    },
    asyncLoad: function (url, onload, onerror, noRunDep) {
      var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
      readAsync(
        url,
        function (arrayBuffer) {
          assert(
            arrayBuffer,
            'Loading data file "' + url + '" failed (no arrayBuffer).'
          );
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        },
        function (event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        }
      );
      if (dep) addRunDependency(dep);
    },
    resizeListeners: [],
    updateResizeListeners: function () {
      var canvas = Module["canvas"];
      Browser.resizeListeners.forEach(function (listener) {
        listener(canvas.width, canvas.height);
      });
    },
    setCanvasSize: function (width, height, noUpdates) {
      var canvas = Module["canvas"];
      Browser.updateCanvasDimensions(canvas, width, height);
      if (!noUpdates) Browser.updateResizeListeners();
    },
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: function () {
      if (typeof SDL != "undefined") {
        var flags = HEAPU32[SDL.screen >> 2];
        flags = flags | 8388608;
        HEAP32[SDL.screen >> 2] = flags;
      }
      Browser.updateCanvasDimensions(Module["canvas"]);
      Browser.updateResizeListeners();
    },
    setWindowedCanvasSize: function () {
      if (typeof SDL != "undefined") {
        var flags = HEAPU32[SDL.screen >> 2];
        flags = flags & ~8388608;
        HEAP32[SDL.screen >> 2] = flags;
      }
      Browser.updateCanvasDimensions(Module["canvas"]);
      Browser.updateResizeListeners();
    },
    updateCanvasDimensions: function (canvas, wNative, hNative) {
      if (wNative && hNative) {
        canvas.widthNative = wNative;
        canvas.heightNative = hNative;
      } else {
        wNative = canvas.widthNative;
        hNative = canvas.heightNative;
      }
      var w = wNative;
      var h = hNative;
      if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
        if (w / h < Module["forcedAspectRatio"]) {
          w = Math.round(h * Module["forcedAspectRatio"]);
        } else {
          h = Math.round(w / Module["forcedAspectRatio"]);
        }
      }
      if (
        (document["fullscreenElement"] ||
          document["mozFullScreenElement"] ||
          document["msFullscreenElement"] ||
          document["webkitFullscreenElement"] ||
          document["webkitCurrentFullScreenElement"]) === canvas.parentNode &&
        typeof screen != "undefined"
      ) {
        var factor = Math.min(screen.width / w, screen.height / h);
        w = Math.round(w * factor);
        h = Math.round(h * factor);
      }
      if (Browser.resizeCanvas) {
        if (canvas.width != w) canvas.width = w;
        if (canvas.height != h) canvas.height = h;
        if (typeof canvas.style != "undefined") {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      } else {
        if (canvas.width != wNative) canvas.width = wNative;
        if (canvas.height != hNative) canvas.height = hNative;
        if (typeof canvas.style != "undefined") {
          if (w != wNative || h != hNative) {
            canvas.style.setProperty("width", w + "px", "important");
            canvas.style.setProperty("height", h + "px", "important");
          } else {
            canvas.style.removeProperty("width");
            canvas.style.removeProperty("height");
          }
        }
      }
    },
    wgetRequests: {},
    nextWgetRequestHandle: 0,
    getNextWgetRequestHandle: function () {
      var handle = Browser.nextWgetRequestHandle;
      Browser.nextWgetRequestHandle++;
      return handle;
    },
  };
  function _emscripten_cancel_main_loop() {
    Browser.mainLoop.pause();
    Browser.mainLoop.func = null;
  }
  function _emscripten_clear_interval(id) {
    clearInterval(id);
  }
  var JSEvents = {
    inEventHandler: 0,
    removeAllEventListeners: function () {
      for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
        JSEvents._removeHandler(i);
      }
      JSEvents.eventHandlers = [];
      JSEvents.deferredCalls = [];
    },
    registerRemoveEventListeners: function () {
      if (!JSEvents.removeEventListenersRegistered) {
        __ATEXIT__.push(JSEvents.removeAllEventListeners);
        JSEvents.removeEventListenersRegistered = true;
      }
    },
    deferredCalls: [],
    deferCall: function (targetFunction, precedence, argsList) {
      function arraysHaveEqualContent(arrA, arrB) {
        if (arrA.length != arrB.length) return false;
        for (var i in arrA) {
          if (arrA[i] != arrB[i]) return false;
        }
        return true;
      }
      for (var i in JSEvents.deferredCalls) {
        var call = JSEvents.deferredCalls[i];
        if (
          call.targetFunction == targetFunction &&
          arraysHaveEqualContent(call.argsList, argsList)
        ) {
          return;
        }
      }
      JSEvents.deferredCalls.push({
        targetFunction: targetFunction,
        precedence: precedence,
        argsList: argsList,
      });
      JSEvents.deferredCalls.sort(function (x, y) {
        return x.precedence < y.precedence;
      });
    },
    removeDeferredCalls: function (targetFunction) {
      for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
        if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
          JSEvents.deferredCalls.splice(i, 1);
          --i;
        }
      }
    },
    canPerformEventHandlerRequests: function () {
      return (
        JSEvents.inEventHandler &&
        JSEvents.currentEventHandler.allowsDeferredCalls
      );
    },
    runDeferredCalls: function () {
      if (!JSEvents.canPerformEventHandlerRequests()) {
        return;
      }
      for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
        var call = JSEvents.deferredCalls[i];
        JSEvents.deferredCalls.splice(i, 1);
        --i;
        call.targetFunction.apply(null, call.argsList);
      }
    },
    eventHandlers: [],
    removeAllHandlersOnTarget: function (target, eventTypeString) {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (
          JSEvents.eventHandlers[i].target == target &&
          (!eventTypeString ||
            eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
        ) {
          JSEvents._removeHandler(i--);
        }
      }
    },
    _removeHandler: function (i) {
      var h = JSEvents.eventHandlers[i];
      h.target.removeEventListener(
        h.eventTypeString,
        h.eventListenerFunc,
        h.useCapture
      );
      JSEvents.eventHandlers.splice(i, 1);
    },
    registerOrRemoveHandler: function (eventHandler) {
      var jsEventHandler = function jsEventHandler(event) {
        ++JSEvents.inEventHandler;
        JSEvents.currentEventHandler = eventHandler;
        JSEvents.runDeferredCalls();
        eventHandler.handlerFunc(event);
        JSEvents.runDeferredCalls();
        --JSEvents.inEventHandler;
      };
      if (eventHandler.callbackfunc) {
        eventHandler.eventListenerFunc = jsEventHandler;
        eventHandler.target.addEventListener(
          eventHandler.eventTypeString,
          jsEventHandler,
          eventHandler.useCapture
        );
        JSEvents.eventHandlers.push(eventHandler);
        JSEvents.registerRemoveEventListeners();
      } else {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (
            JSEvents.eventHandlers[i].target == eventHandler.target &&
            JSEvents.eventHandlers[i].eventTypeString ==
              eventHandler.eventTypeString
          ) {
            JSEvents._removeHandler(i--);
          }
        }
      }
    },
    getNodeNameForTarget: function (target) {
      if (!target) return "";
      if (target == window) return "#window";
      if (target == screen) return "#screen";
      return target && target.nodeName ? target.nodeName : "";
    },
    fullscreenEnabled: function () {
      return document.fullscreenEnabled || document.webkitFullscreenEnabled;
    },
  };
  var currentFullscreenStrategy = {};
  function maybeCStringToJsString(cString) {
    return cString > 2 ? UTF8ToString(cString) : cString;
  }
  var specialHTMLTargets = [
    0,
    typeof document !== "undefined" ? document : 0,
    typeof window !== "undefined" ? window : 0,
  ];
  function findEventTarget(target) {
    target = maybeCStringToJsString(target);
    var domElement =
      specialHTMLTargets[target] ||
      (typeof document !== "undefined"
        ? document.querySelector(target)
        : undefined);
    return domElement;
  }
  function findCanvasEventTarget(target) {
    return findEventTarget(target);
  }
  function _emscripten_get_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    HEAP32[width >> 2] = canvas.width;
    HEAP32[height >> 2] = canvas.height;
  }
  function getCanvasElementSize(target) {
    var stackTop = stackSave();
    var w = stackAlloc(8);
    var h = w + 4;
    var targetInt = stackAlloc(target.id.length + 1);
    stringToUTF8(target.id, targetInt, target.id.length + 1);
    var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
    var size = [HEAP32[w >> 2], HEAP32[h >> 2]];
    stackRestore(stackTop);
    return size;
  }
  function _emscripten_set_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    canvas.width = width;
    canvas.height = height;
    return 0;
  }
  function setCanvasElementSize(target, width, height) {
    if (!target.controlTransferredOffscreen) {
      target.width = width;
      target.height = height;
    } else {
      var stackTop = stackSave();
      var targetInt = stackAlloc(target.id.length + 1);
      stringToUTF8(target.id, targetInt, target.id.length + 1);
      _emscripten_set_canvas_element_size(targetInt, width, height);
      stackRestore(stackTop);
    }
  }
  function registerRestoreOldStyle(canvas) {
    var canvasSize = getCanvasElementSize(canvas);
    var oldWidth = canvasSize[0];
    var oldHeight = canvasSize[1];
    var oldCssWidth = canvas.style.width;
    var oldCssHeight = canvas.style.height;
    var oldBackgroundColor = canvas.style.backgroundColor;
    var oldDocumentBackgroundColor = document.body.style.backgroundColor;
    var oldPaddingLeft = canvas.style.paddingLeft;
    var oldPaddingRight = canvas.style.paddingRight;
    var oldPaddingTop = canvas.style.paddingTop;
    var oldPaddingBottom = canvas.style.paddingBottom;
    var oldMarginLeft = canvas.style.marginLeft;
    var oldMarginRight = canvas.style.marginRight;
    var oldMarginTop = canvas.style.marginTop;
    var oldMarginBottom = canvas.style.marginBottom;
    var oldDocumentBodyMargin = document.body.style.margin;
    var oldDocumentOverflow = document.documentElement.style.overflow;
    var oldDocumentScroll = document.body.scroll;
    var oldImageRendering = canvas.style.imageRendering;
    function restoreOldStyle() {
      var fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      if (!fullscreenElement) {
        document.removeEventListener("fullscreenchange", restoreOldStyle);
        document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
        setCanvasElementSize(canvas, oldWidth, oldHeight);
        canvas.style.width = oldCssWidth;
        canvas.style.height = oldCssHeight;
        canvas.style.backgroundColor = oldBackgroundColor;
        if (!oldDocumentBackgroundColor)
          document.body.style.backgroundColor = "white";
        document.body.style.backgroundColor = oldDocumentBackgroundColor;
        canvas.style.paddingLeft = oldPaddingLeft;
        canvas.style.paddingRight = oldPaddingRight;
        canvas.style.paddingTop = oldPaddingTop;
        canvas.style.paddingBottom = oldPaddingBottom;
        canvas.style.marginLeft = oldMarginLeft;
        canvas.style.marginRight = oldMarginRight;
        canvas.style.marginTop = oldMarginTop;
        canvas.style.marginBottom = oldMarginBottom;
        document.body.style.margin = oldDocumentBodyMargin;
        document.documentElement.style.overflow = oldDocumentOverflow;
        document.body.scroll = oldDocumentScroll;
        canvas.style.imageRendering = oldImageRendering;
        if (canvas.GLctxObject)
          canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
        if (currentFullscreenStrategy.canvasResizedCallback) {
          (function (a1, a2, a3) {
            return dynCall_iiii.apply(null, [
              currentFullscreenStrategy.canvasResizedCallback,
              a1,
              a2,
              a3,
            ]);
          })(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
        }
      }
    }
    document.addEventListener("fullscreenchange", restoreOldStyle);
    document.addEventListener("webkitfullscreenchange", restoreOldStyle);
    return restoreOldStyle;
  }
  function setLetterbox(element, topBottom, leftRight) {
    element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
    element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
  }
  function getBoundingClientRect(e) {
    return specialHTMLTargets.indexOf(e) < 0
      ? e.getBoundingClientRect()
      : { left: 0, top: 0 };
  }
  function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
    var restoreOldStyle = registerRestoreOldStyle(target);
    var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
    var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
    var rect = getBoundingClientRect(target);
    var windowedCssWidth = rect.width;
    var windowedCssHeight = rect.height;
    var canvasSize = getCanvasElementSize(target);
    var windowedRttWidth = canvasSize[0];
    var windowedRttHeight = canvasSize[1];
    if (strategy.scaleMode == 3) {
      setLetterbox(
        target,
        (cssHeight - windowedCssHeight) / 2,
        (cssWidth - windowedCssWidth) / 2
      );
      cssWidth = windowedCssWidth;
      cssHeight = windowedCssHeight;
    } else if (strategy.scaleMode == 2) {
      if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
        var desiredCssHeight =
          (windowedRttHeight * cssWidth) / windowedRttWidth;
        setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
        cssHeight = desiredCssHeight;
      } else {
        var desiredCssWidth =
          (windowedRttWidth * cssHeight) / windowedRttHeight;
        setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
        cssWidth = desiredCssWidth;
      }
    }
    if (!target.style.backgroundColor) target.style.backgroundColor = "black";
    if (!document.body.style.backgroundColor)
      document.body.style.backgroundColor = "black";
    target.style.width = cssWidth + "px";
    target.style.height = cssHeight + "px";
    if (strategy.filteringMode == 1) {
      target.style.imageRendering = "optimizeSpeed";
      target.style.imageRendering = "-moz-crisp-edges";
      target.style.imageRendering = "-o-crisp-edges";
      target.style.imageRendering = "-webkit-optimize-contrast";
      target.style.imageRendering = "optimize-contrast";
      target.style.imageRendering = "crisp-edges";
      target.style.imageRendering = "pixelated";
    }
    var dpiScale =
      strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
    if (strategy.canvasResolutionScaleMode != 0) {
      var newWidth = (cssWidth * dpiScale) | 0;
      var newHeight = (cssHeight * dpiScale) | 0;
      setCanvasElementSize(target, newWidth, newHeight);
      if (target.GLctxObject)
        target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
    }
    return restoreOldStyle;
  }
  function _JSEvents_requestFullscreen(target, strategy) {
    if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
      _JSEvents_resizeCanvasForFullscreen(target, strategy);
    }
    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
      return JSEvents.fullscreenEnabled() ? -3 : -1;
    }
    currentFullscreenStrategy = strategy;
    if (strategy.canvasResizedCallback) {
      (function (a1, a2, a3) {
        return dynCall_iiii.apply(null, [
          strategy.canvasResizedCallback,
          a1,
          a2,
          a3,
        ]);
      })(37, 0, strategy.canvasResizedCallbackUserData);
    }
    return 0;
  }
  function _emscripten_exit_fullscreen() {
    if (!JSEvents.fullscreenEnabled()) return -1;
    JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);
    var d = specialHTMLTargets[1];
    if (d.exitFullscreen) {
      d.fullscreenElement && d.exitFullscreen();
    } else if (d.webkitExitFullscreen) {
      d.webkitFullscreenElement && d.webkitExitFullscreen();
    } else {
      return -1;
    }
    return 0;
  }
  function requestPointerLock(target) {
    if (target.requestPointerLock) {
      target.requestPointerLock();
    } else if (target.msRequestPointerLock) {
      target.msRequestPointerLock();
    } else {
      if (
        document.body.requestPointerLock ||
        document.body.msRequestPointerLock
      ) {
        return -3;
      } else {
        return -1;
      }
    }
    return 0;
  }
  function _emscripten_exit_pointerlock() {
    JSEvents.removeDeferredCalls(requestPointerLock);
    if (document.exitPointerLock) {
      document.exitPointerLock();
    } else if (document.msExitPointerLock) {
      document.msExitPointerLock();
    } else {
      return -1;
    }
    return 0;
  }
  function fillFullscreenChangeEventData(eventStruct) {
    var fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    var isFullscreen = !!fullscreenElement;
    HEAP32[eventStruct >> 2] = isFullscreen;
    HEAP32[(eventStruct + 4) >> 2] = JSEvents.fullscreenEnabled();
    var reportedElement = isFullscreen
      ? fullscreenElement
      : JSEvents.previousFullscreenElement;
    var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
    var id = reportedElement && reportedElement.id ? reportedElement.id : "";
    stringToUTF8(nodeName, eventStruct + 8, 128);
    stringToUTF8(id, eventStruct + 136, 128);
    HEAP32[(eventStruct + 264) >> 2] = reportedElement
      ? reportedElement.clientWidth
      : 0;
    HEAP32[(eventStruct + 268) >> 2] = reportedElement
      ? reportedElement.clientHeight
      : 0;
    HEAP32[(eventStruct + 272) >> 2] = screen.width;
    HEAP32[(eventStruct + 276) >> 2] = screen.height;
    if (isFullscreen) {
      JSEvents.previousFullscreenElement = fullscreenElement;
    }
  }
  function _emscripten_get_fullscreen_status(fullscreenStatus) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    fillFullscreenChangeEventData(fullscreenStatus);
    return 0;
  }
  function fillGamepadEventData(eventStruct, e) {
    HEAPF64[eventStruct >> 3] = e.timestamp;
    for (var i = 0; i < e.axes.length; ++i) {
      HEAPF64[(eventStruct + i * 8 + 16) >> 3] = e.axes[i];
    }
    for (var i = 0; i < e.buttons.length; ++i) {
      if (typeof e.buttons[i] === "object") {
        HEAPF64[(eventStruct + i * 8 + 528) >> 3] = e.buttons[i].value;
      } else {
        HEAPF64[(eventStruct + i * 8 + 528) >> 3] = e.buttons[i];
      }
    }
    for (var i = 0; i < e.buttons.length; ++i) {
      if (typeof e.buttons[i] === "object") {
        HEAP32[(eventStruct + i * 4 + 1040) >> 2] = e.buttons[i].pressed;
      } else {
        HEAP32[(eventStruct + i * 4 + 1040) >> 2] = e.buttons[i] == 1;
      }
    }
    HEAP32[(eventStruct + 1296) >> 2] = e.connected;
    HEAP32[(eventStruct + 1300) >> 2] = e.index;
    HEAP32[(eventStruct + 8) >> 2] = e.axes.length;
    HEAP32[(eventStruct + 12) >> 2] = e.buttons.length;
    stringToUTF8(e.id, eventStruct + 1304, 64);
    stringToUTF8(e.mapping, eventStruct + 1368, 64);
  }
  function _emscripten_get_gamepad_status(index, gamepadState) {
    if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
    if (!JSEvents.lastGamepadState[index]) return -7;
    fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
    return 0;
  }
  function _emscripten_get_heap_max() {
    return 2147483648;
  }
  function _emscripten_get_num_gamepads() {
    return JSEvents.lastGamepadState.length;
  }
  function _emscripten_html5_remove_all_event_listeners() {
    JSEvents.removeAllEventListeners();
  }
  function _emscripten_is_webgl_context_lost(contextHandle) {
    return (
      !GL.contexts[contextHandle] ||
      GL.contexts[contextHandle].GLctx.isContextLost()
    );
  }
  function reallyNegative(x) {
    return x < 0 || (x === 0 && 1 / x === -Infinity);
  }
  function convertI32PairToI53(lo, hi) {
    return (lo >>> 0) + hi * 4294967296;
  }
  function convertU32PairToI53(lo, hi) {
    return (lo >>> 0) + (hi >>> 0) * 4294967296;
  }
  function reSign(value, bits) {
    if (value <= 0) {
      return value;
    }
    var half = bits <= 32 ? Math.abs(1 << (bits - 1)) : Math.pow(2, bits - 1);
    if (value >= half && (bits <= 32 || value > half)) {
      value = -2 * half + value;
    }
    return value;
  }
  function unSign(value, bits) {
    if (value >= 0) {
      return value;
    }
    return bits <= 32
      ? 2 * Math.abs(1 << (bits - 1)) + value
      : Math.pow(2, bits) + value;
  }
  function formatString(format, varargs) {
    var textIndex = format;
    var argIndex = varargs;
    function prepVararg(ptr, type) {
      if (type === "double" || type === "i64") {
        if (ptr & 7) {
          ptr += 4;
        }
      } else {
      }
      return ptr;
    }
    function getNextArg(type) {
      var ret;
      argIndex = prepVararg(argIndex, type);
      if (type === "double") {
        ret = HEAPF64[argIndex >> 3];
        argIndex += 8;
      } else if (type == "i64") {
        ret = [HEAP32[argIndex >> 2], HEAP32[(argIndex + 4) >> 2]];
        argIndex += 8;
      } else {
        type = "i32";
        ret = HEAP32[argIndex >> 2];
        argIndex += 4;
      }
      return ret;
    }
    var ret = [];
    var curr, next, currArg;
    while (1) {
      var startTextIndex = textIndex;
      curr = HEAP8[textIndex >> 0];
      if (curr === 0) break;
      next = HEAP8[(textIndex + 1) >> 0];
      if (curr == 37) {
        var flagAlwaysSigned = false;
        var flagLeftAlign = false;
        var flagAlternative = false;
        var flagZeroPad = false;
        var flagPadSign = false;
        flagsLoop: while (1) {
          switch (next) {
            case 43:
              flagAlwaysSigned = true;
              break;
            case 45:
              flagLeftAlign = true;
              break;
            case 35:
              flagAlternative = true;
              break;
            case 48:
              if (flagZeroPad) {
                break flagsLoop;
              } else {
                flagZeroPad = true;
                break;
              }
            case 32:
              flagPadSign = true;
              break;
            default:
              break flagsLoop;
          }
          textIndex++;
          next = HEAP8[(textIndex + 1) >> 0];
        }
        var width = 0;
        if (next == 42) {
          width = getNextArg("i32");
          textIndex++;
          next = HEAP8[(textIndex + 1) >> 0];
        } else {
          while (next >= 48 && next <= 57) {
            width = width * 10 + (next - 48);
            textIndex++;
            next = HEAP8[(textIndex + 1) >> 0];
          }
        }
        var precisionSet = false,
          precision = -1;
        if (next == 46) {
          precision = 0;
          precisionSet = true;
          textIndex++;
          next = HEAP8[(textIndex + 1) >> 0];
          if (next == 42) {
            precision = getNextArg("i32");
            textIndex++;
          } else {
            while (1) {
              var precisionChr = HEAP8[(textIndex + 1) >> 0];
              if (precisionChr < 48 || precisionChr > 57) break;
              precision = precision * 10 + (precisionChr - 48);
              textIndex++;
            }
          }
          next = HEAP8[(textIndex + 1) >> 0];
        }
        if (precision < 0) {
          precision = 6;
          precisionSet = false;
        }
        var argSize;
        switch (String.fromCharCode(next)) {
          case "h":
            var nextNext = HEAP8[(textIndex + 2) >> 0];
            if (nextNext == 104) {
              textIndex++;
              argSize = 1;
            } else {
              argSize = 2;
            }
            break;
          case "l":
            var nextNext = HEAP8[(textIndex + 2) >> 0];
            if (nextNext == 108) {
              textIndex++;
              argSize = 8;
            } else {
              argSize = 4;
            }
            break;
          case "L":
          case "q":
          case "j":
            argSize = 8;
            break;
          case "z":
          case "t":
          case "I":
            argSize = 4;
            break;
          default:
            argSize = null;
        }
        if (argSize) textIndex++;
        next = HEAP8[(textIndex + 1) >> 0];
        switch (String.fromCharCode(next)) {
          case "d":
          case "i":
          case "u":
          case "o":
          case "x":
          case "X":
          case "p": {
            var signed = next == 100 || next == 105;
            argSize = argSize || 4;
            currArg = getNextArg("i" + argSize * 8);
            var argText;
            if (argSize == 8) {
              currArg =
                next == 117
                  ? convertU32PairToI53(currArg[0], currArg[1])
                  : convertI32PairToI53(currArg[0], currArg[1]);
            }
            if (argSize <= 4) {
              var limit = Math.pow(256, argSize) - 1;
              currArg = (signed ? reSign : unSign)(
                currArg & limit,
                argSize * 8
              );
            }
            var currAbsArg = Math.abs(currArg);
            var prefix = "";
            if (next == 100 || next == 105) {
              argText = reSign(currArg, 8 * argSize, 1).toString(10);
            } else if (next == 117) {
              argText = unSign(currArg, 8 * argSize, 1).toString(10);
              currArg = Math.abs(currArg);
            } else if (next == 111) {
              argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8);
            } else if (next == 120 || next == 88) {
              prefix = flagAlternative && currArg != 0 ? "0x" : "";
              if (currArg < 0) {
                currArg = -currArg;
                argText = (currAbsArg - 1).toString(16);
                var buffer = [];
                for (var i = 0; i < argText.length; i++) {
                  buffer.push((15 - parseInt(argText[i], 16)).toString(16));
                }
                argText = buffer.join("");
                while (argText.length < argSize * 2) argText = "f" + argText;
              } else {
                argText = currAbsArg.toString(16);
              }
              if (next == 88) {
                prefix = prefix.toUpperCase();
                argText = argText.toUpperCase();
              }
            } else if (next == 112) {
              if (currAbsArg === 0) {
                argText = "(nil)";
              } else {
                prefix = "0x";
                argText = currAbsArg.toString(16);
              }
            }
            if (precisionSet) {
              while (argText.length < precision) {
                argText = "0" + argText;
              }
            }
            if (currArg >= 0) {
              if (flagAlwaysSigned) {
                prefix = "+" + prefix;
              } else if (flagPadSign) {
                prefix = " " + prefix;
              }
            }
            if (argText.charAt(0) == "-") {
              prefix = "-" + prefix;
              argText = argText.substr(1);
            }
            while (prefix.length + argText.length < width) {
              if (flagLeftAlign) {
                argText += " ";
              } else {
                if (flagZeroPad) {
                  argText = "0" + argText;
                } else {
                  prefix = " " + prefix;
                }
              }
            }
            argText = prefix + argText;
            argText.split("").forEach(function (chr) {
              ret.push(chr.charCodeAt(0));
            });
            break;
          }
          case "f":
          case "F":
          case "e":
          case "E":
          case "g":
          case "G": {
            currArg = getNextArg("double");
            var argText;
            if (isNaN(currArg)) {
              argText = "nan";
              flagZeroPad = false;
            } else if (!isFinite(currArg)) {
              argText = (currArg < 0 ? "-" : "") + "inf";
              flagZeroPad = false;
            } else {
              var isGeneral = false;
              var effectivePrecision = Math.min(precision, 20);
              if (next == 103 || next == 71) {
                isGeneral = true;
                precision = precision || 1;
                var exponent = parseInt(
                  currArg.toExponential(effectivePrecision).split("e")[1],
                  10
                );
                if (precision > exponent && exponent >= -4) {
                  next = (next == 103 ? "f" : "F").charCodeAt(0);
                  precision -= exponent + 1;
                } else {
                  next = (next == 103 ? "e" : "E").charCodeAt(0);
                  precision--;
                }
                effectivePrecision = Math.min(precision, 20);
              }
              if (next == 101 || next == 69) {
                argText = currArg.toExponential(effectivePrecision);
                if (/[eE][-+]\d$/.test(argText)) {
                  argText = argText.slice(0, -1) + "0" + argText.slice(-1);
                }
              } else if (next == 102 || next == 70) {
                argText = currArg.toFixed(effectivePrecision);
                if (currArg === 0 && reallyNegative(currArg)) {
                  argText = "-" + argText;
                }
              }
              var parts = argText.split("e");
              if (isGeneral && !flagAlternative) {
                while (
                  parts[0].length > 1 &&
                  parts[0].includes(".") &&
                  (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")
                ) {
                  parts[0] = parts[0].slice(0, -1);
                }
              } else {
                if (flagAlternative && argText.indexOf(".") == -1)
                  parts[0] += ".";
                while (precision > effectivePrecision++) parts[0] += "0";
              }
              argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
              if (next == 69) argText = argText.toUpperCase();
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  argText = "+" + argText;
                } else if (flagPadSign) {
                  argText = " " + argText;
                }
              }
            }
            while (argText.length < width) {
              if (flagLeftAlign) {
                argText += " ";
              } else {
                if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
                  argText = argText[0] + "0" + argText.slice(1);
                } else {
                  argText = (flagZeroPad ? "0" : " ") + argText;
                }
              }
            }
            if (next < 97) argText = argText.toUpperCase();
            argText.split("").forEach(function (chr) {
              ret.push(chr.charCodeAt(0));
            });
            break;
          }
          case "s": {
            var arg = getNextArg("i8*");
            var argLength = arg ? _strlen(arg) : "(null)".length;
            if (precisionSet) argLength = Math.min(argLength, precision);
            if (!flagLeftAlign) {
              while (argLength < width--) {
                ret.push(32);
              }
            }
            if (arg) {
              for (var i = 0; i < argLength; i++) {
                ret.push(HEAPU8[arg++ >> 0]);
              }
            } else {
              ret = ret.concat(
                intArrayFromString("(null)".substr(0, argLength), true)
              );
            }
            if (flagLeftAlign) {
              while (argLength < width--) {
                ret.push(32);
              }
            }
            break;
          }
          case "c": {
            if (flagLeftAlign) ret.push(getNextArg("i8"));
            while (--width > 0) {
              ret.push(32);
            }
            if (!flagLeftAlign) ret.push(getNextArg("i8"));
            break;
          }
          case "n": {
            var ptr = getNextArg("i32*");
            HEAP32[ptr >> 2] = ret.length;
            break;
          }
          case "%": {
            ret.push(curr);
            break;
          }
          default: {
            for (var i = startTextIndex; i < textIndex + 2; i++) {
              ret.push(HEAP8[i >> 0]);
            }
          }
        }
        textIndex += 2;
      } else {
        ret.push(curr);
        textIndex += 1;
      }
    }
    return ret;
  }
  function traverseStack(args) {
    if (!args || !args.callee || !args.callee.name) {
      return [null, "", ""];
    }
    var funstr = args.callee.toString();
    var funcname = args.callee.name;
    var str = "(";
    var first = true;
    for (var i in args) {
      var a = args[i];
      if (!first) {
        str += ", ";
      }
      first = false;
      if (typeof a === "number" || typeof a === "string") {
        str += a;
      } else {
        str += "(" + typeof a + ")";
      }
    }
    str += ")";
    var caller = args.callee.caller;
    args = caller ? caller.arguments : [];
    if (first) str = "";
    return [args, funcname, str];
  }
  function _emscripten_get_callstack_js(flags) {
    var callstack = jsStackTrace();
    var iThisFunc = callstack.lastIndexOf("_emscripten_log");
    var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
    var iNextLine =
      callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
    callstack = callstack.slice(iNextLine);
    if (flags & 32) {
      warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring");
    }
    if (flags & 8 && typeof emscripten_source_map === "undefined") {
      warnOnce(
        'Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.'
      );
      flags ^= 8;
      flags |= 16;
    }
    var stack_args = null;
    if (flags & 128) {
      stack_args = traverseStack(arguments);
      while (stack_args[1].includes("_emscripten_"))
        stack_args = traverseStack(stack_args[0]);
    }
    var lines = callstack.split("\n");
    callstack = "";
    var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
    var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
    var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
    for (var l in lines) {
      var line = lines[l];
      var symbolName = "";
      var file = "";
      var lineno = 0;
      var column = 0;
      var parts = chromeRe.exec(line);
      if (parts && parts.length == 5) {
        symbolName = parts[1];
        file = parts[2];
        lineno = parts[3];
        column = parts[4];
      } else {
        parts = newFirefoxRe.exec(line);
        if (!parts) parts = firefoxRe.exec(line);
        if (parts && parts.length >= 4) {
          symbolName = parts[1];
          file = parts[2];
          lineno = parts[3];
          column = parts[4] | 0;
        } else {
          callstack += line + "\n";
          continue;
        }
      }
      var haveSourceMap = false;
      if (flags & 8) {
        var orig = emscripten_source_map.originalPositionFor({
          line: lineno,
          column: column,
        });
        haveSourceMap = orig && orig.source;
        if (haveSourceMap) {
          if (flags & 64) {
            orig.source = orig.source.substring(
              orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1
            );
          }
          callstack +=
            "    at " +
            symbolName +
            " (" +
            orig.source +
            ":" +
            orig.line +
            ":" +
            orig.column +
            ")\n";
        }
      }
      if (flags & 16 || !haveSourceMap) {
        if (flags & 64) {
          file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
        }
        callstack +=
          (haveSourceMap ? "     = " + symbolName : "    at " + symbolName) +
          " (" +
          file +
          ":" +
          lineno +
          ":" +
          column +
          ")\n";
      }
      if (flags & 128 && stack_args[0]) {
        if (stack_args[1] == symbolName && stack_args[2].length > 0) {
          callstack = callstack.replace(/\s+$/, "");
          callstack += " with values: " + stack_args[1] + stack_args[2] + "\n";
        }
        stack_args = traverseStack(stack_args[0]);
      }
    }
    callstack = callstack.replace(/\s+$/, "");
    return callstack;
  }
  function _emscripten_log_js(flags, str) {
    if (flags & 24) {
      str = str.replace(/\s+$/, "");
      str += (str.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(flags);
    }
    if (flags & 1) {
      if (flags & 4) {
        console.error(str);
      } else if (flags & 2) {
        console.warn(str);
      } else if (flags & 512) {
        console.info(str);
      } else if (flags & 256) {
        console.debug(str);
      } else {
        console.log(str);
      }
    } else if (flags & 6) {
      err(str);
    } else {
      out(str);
    }
  }
  function _emscripten_log(flags, format, varargs) {
    var result = formatString(format, varargs);
    var str = UTF8ArrayToString(result, 0);
    _emscripten_log_js(flags, str);
  }
  function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num);
  }
  function doRequestFullscreen(target, strategy) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
      return -3;
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
      if (strategy.deferUntilInEventHandler) {
        JSEvents.deferCall(_JSEvents_requestFullscreen, 1, [target, strategy]);
        return 1;
      } else {
        return -2;
      }
    }
    return _JSEvents_requestFullscreen(target, strategy);
  }
  function _emscripten_request_fullscreen(target, deferUntilInEventHandler) {
    var strategy = {
      scaleMode: 0,
      canvasResolutionScaleMode: 0,
      filteringMode: 0,
      deferUntilInEventHandler: deferUntilInEventHandler,
      canvasResizedCallbackTargetThread: 2,
    };
    return doRequestFullscreen(target, strategy);
  }
  function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestPointerLock && !target.msRequestPointerLock) {
      return -1;
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
      if (deferUntilInEventHandler) {
        JSEvents.deferCall(requestPointerLock, 2, [target]);
        return 1;
      } else {
        return -2;
      }
    }
    return requestPointerLock(target);
  }
  function emscripten_realloc_buffer(size) {
    try {
      wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
      updateGlobalBufferAndViews(wasmMemory.buffer);
      return 1;
    } catch (e) {}
  }
  function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    var maxHeapSize = 2147483648;
    if (requestedSize > maxHeapSize) {
      return false;
    }
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
      overGrownHeapSize = Math.min(
        overGrownHeapSize,
        requestedSize + 100663296
      );
      var newSize = Math.min(
        maxHeapSize,
        alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
      );
      var replacement = emscripten_realloc_buffer(newSize);
      if (replacement) {
        return true;
      }
    }
    return false;
  }
  function _emscripten_sample_gamepad_data() {
    return (JSEvents.lastGamepadState = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads()
      : null)
      ? 0
      : -1;
  }
  function registerFocusEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
    var focusEventHandlerFunc = function (ev) {
      var e = ev || event;
      var nodeName = JSEvents.getNodeNameForTarget(e.target);
      var id = e.target.id ? e.target.id : "";
      var focusEvent = JSEvents.focusEvent;
      stringToUTF8(nodeName, focusEvent + 0, 128);
      stringToUTF8(id, focusEvent + 128, 128);
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, focusEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: findEventTarget(target),
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: focusEventHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_blur_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerFocusEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      12,
      "blur",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_focus_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerFocusEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      13,
      "focus",
      targetThread
    );
    return 0;
  }
  function registerFullscreenChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.fullscreenChangeEvent)
      JSEvents.fullscreenChangeEvent = _malloc(280);
    var fullscreenChangeEventhandlerFunc = function (ev) {
      var e = ev || event;
      var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
      fillFullscreenChangeEventData(fullscreenChangeEvent);
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, fullscreenChangeEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: target,
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: fullscreenChangeEventhandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_fullscreenchange_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    registerFullscreenChangeEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      19,
      "fullscreenchange",
      targetThread
    );
    registerFullscreenChangeEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      19,
      "webkitfullscreenchange",
      targetThread
    );
    return 0;
  }
  function registerGamepadEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);
    var gamepadEventHandlerFunc = function (ev) {
      var e = ev || event;
      var gamepadEvent = JSEvents.gamepadEvent;
      fillGamepadEventData(gamepadEvent, e["gamepad"]);
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, gamepadEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: findEventTarget(target),
      allowsDeferredCalls: true,
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: gamepadEventHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_gamepadconnected_callback_on_thread(
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(
      2,
      userData,
      useCapture,
      callbackfunc,
      26,
      "gamepadconnected",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_gamepaddisconnected_callback_on_thread(
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(
      2,
      userData,
      useCapture,
      callbackfunc,
      27,
      "gamepaddisconnected",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_interval(cb, msecs, userData) {
    return setInterval(function () {
      (function (a1) {
        dynCall_vi.apply(null, [cb, a1]);
      })(userData);
    }, msecs);
  }
  function registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(164);
    var keyEventHandlerFunc = function (e) {
      var keyEventData = JSEvents.keyEvent;
      var idx = keyEventData >> 2;
      HEAP32[idx + 0] = e.location;
      HEAP32[idx + 1] = e.ctrlKey;
      HEAP32[idx + 2] = e.shiftKey;
      HEAP32[idx + 3] = e.altKey;
      HEAP32[idx + 4] = e.metaKey;
      HEAP32[idx + 5] = e.repeat;
      HEAP32[idx + 6] = e.charCode;
      HEAP32[idx + 7] = e.keyCode;
      HEAP32[idx + 8] = e.which;
      stringToUTF8(e.key || "", keyEventData + 36, 32);
      stringToUTF8(e.code || "", keyEventData + 68, 32);
      stringToUTF8(e.char || "", keyEventData + 100, 32);
      stringToUTF8(e.locale || "", keyEventData + 132, 32);
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, keyEventData, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: findEventTarget(target),
      allowsDeferredCalls: true,
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: keyEventHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_keydown_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerKeyEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      2,
      "keydown",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_keypress_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerKeyEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      1,
      "keypress",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_keyup_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerKeyEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      3,
      "keyup",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
    var browserIterationFunc = function () {
      dynCall_v.call(null, func);
    };
    setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop);
  }
  function fillMouseEventData(eventStruct, e, target) {
    var idx = eventStruct >> 2;
    HEAP32[idx + 0] = e.screenX;
    HEAP32[idx + 1] = e.screenY;
    HEAP32[idx + 2] = e.clientX;
    HEAP32[idx + 3] = e.clientY;
    HEAP32[idx + 4] = e.ctrlKey;
    HEAP32[idx + 5] = e.shiftKey;
    HEAP32[idx + 6] = e.altKey;
    HEAP32[idx + 7] = e.metaKey;
    HEAP16[idx * 2 + 16] = e.button;
    HEAP16[idx * 2 + 17] = e.buttons;
    HEAP32[idx + 9] = e["movementX"];
    HEAP32[idx + 10] = e["movementY"];
    var rect = getBoundingClientRect(target);
    HEAP32[idx + 11] = e.clientX - rect.left;
    HEAP32[idx + 12] = e.clientY - rect.top;
  }
  function registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(64);
    target = findEventTarget(target);
    var mouseEventHandlerFunc = function (ev) {
      var e = ev || event;
      fillMouseEventData(JSEvents.mouseEvent, e, target);
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, JSEvents.mouseEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: target,
      allowsDeferredCalls:
        eventTypeString != "mousemove" &&
        eventTypeString != "mouseenter" &&
        eventTypeString != "mouseleave",
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: mouseEventHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_mousedown_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerMouseEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      5,
      "mousedown",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_mousemove_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerMouseEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      8,
      "mousemove",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_mouseup_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerMouseEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      6,
      "mouseup",
      targetThread
    );
    return 0;
  }
  function registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1684);
    target = findEventTarget(target);
    var touchEventHandlerFunc = function (e) {
      var t,
        touches = {},
        et = e.touches;
      for (var i = 0; i < et.length; ++i) {
        t = et[i];
        t.isChanged = t.onTarget = 0;
        touches[t.identifier] = t;
      }
      for (var i = 0; i < e.changedTouches.length; ++i) {
        t = e.changedTouches[i];
        t.isChanged = 1;
        touches[t.identifier] = t;
      }
      for (var i = 0; i < e.targetTouches.length; ++i) {
        touches[e.targetTouches[i].identifier].onTarget = 1;
      }
      var touchEvent = JSEvents.touchEvent;
      var idx = touchEvent >> 2;
      HEAP32[idx + 1] = e.ctrlKey;
      HEAP32[idx + 2] = e.shiftKey;
      HEAP32[idx + 3] = e.altKey;
      HEAP32[idx + 4] = e.metaKey;
      idx += 5;
      var targetRect = getBoundingClientRect(target);
      var numTouches = 0;
      for (var i in touches) {
        var t = touches[i];
        HEAP32[idx + 0] = t.identifier;
        HEAP32[idx + 1] = t.screenX;
        HEAP32[idx + 2] = t.screenY;
        HEAP32[idx + 3] = t.clientX;
        HEAP32[idx + 4] = t.clientY;
        HEAP32[idx + 5] = t.pageX;
        HEAP32[idx + 6] = t.pageY;
        HEAP32[idx + 7] = t.isChanged;
        HEAP32[idx + 8] = t.onTarget;
        HEAP32[idx + 9] = t.clientX - targetRect.left;
        HEAP32[idx + 10] = t.clientY - targetRect.top;
        idx += 13;
        if (++numTouches > 31) {
          break;
        }
      }
      HEAP32[touchEvent >> 2] = numTouches;
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, touchEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: target,
      allowsDeferredCalls:
        eventTypeString == "touchstart" || eventTypeString == "touchend",
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: touchEventHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_touchcancel_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerTouchEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      25,
      "touchcancel",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_touchend_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerTouchEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      23,
      "touchend",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_touchmove_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerTouchEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      24,
      "touchmove",
      targetThread
    );
    return 0;
  }
  function _emscripten_set_touchstart_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    registerTouchEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      22,
      "touchstart",
      targetThread
    );
    return 0;
  }
  function registerWheelEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    eventTypeId,
    eventTypeString,
    targetThread
  ) {
    if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(96);
    var wheelHandlerFunc = function (ev) {
      var e = ev || event;
      var wheelEvent = JSEvents.wheelEvent;
      fillMouseEventData(wheelEvent, e, target);
      HEAPF64[(wheelEvent + 64) >> 3] = e["deltaX"];
      HEAPF64[(wheelEvent + 72) >> 3] = e["deltaY"];
      HEAPF64[(wheelEvent + 80) >> 3] = e["deltaZ"];
      HEAP32[(wheelEvent + 88) >> 2] = e["deltaMode"];
      if (
        (function (a1, a2, a3) {
          return dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]);
        })(eventTypeId, wheelEvent, userData)
      )
        e.preventDefault();
    };
    var eventHandler = {
      target: target,
      allowsDeferredCalls: true,
      eventTypeString: eventTypeString,
      callbackfunc: callbackfunc,
      handlerFunc: wheelHandlerFunc,
      useCapture: useCapture,
    };
    JSEvents.registerOrRemoveHandler(eventHandler);
  }
  function _emscripten_set_wheel_callback_on_thread(
    target,
    userData,
    useCapture,
    callbackfunc,
    targetThread
  ) {
    target = findEventTarget(target);
    if (typeof target.onwheel !== "undefined") {
      registerWheelEventCallback(
        target,
        userData,
        useCapture,
        callbackfunc,
        9,
        "wheel",
        targetThread
      );
      return 0;
    } else {
      return -1;
    }
  }
  function _emscripten_thread_sleep(msecs) {
    var start = _emscripten_get_now();
    while (_emscripten_get_now() - start < msecs) {}
  }
  function __webgl_enable_ANGLE_instanced_arrays(ctx) {
    var ext = ctx.getExtension("ANGLE_instanced_arrays");
    if (ext) {
      ctx["vertexAttribDivisor"] = function (index, divisor) {
        ext["vertexAttribDivisorANGLE"](index, divisor);
      };
      ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
        ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
      };
      ctx["drawElementsInstanced"] = function (
        mode,
        count,
        type,
        indices,
        primcount
      ) {
        ext["drawElementsInstancedANGLE"](
          mode,
          count,
          type,
          indices,
          primcount
        );
      };
      return 1;
    }
  }
  function __webgl_enable_OES_vertex_array_object(ctx) {
    var ext = ctx.getExtension("OES_vertex_array_object");
    if (ext) {
      ctx["createVertexArray"] = function () {
        return ext["createVertexArrayOES"]();
      };
      ctx["deleteVertexArray"] = function (vao) {
        ext["deleteVertexArrayOES"](vao);
      };
      ctx["bindVertexArray"] = function (vao) {
        ext["bindVertexArrayOES"](vao);
      };
      ctx["isVertexArray"] = function (vao) {
        return ext["isVertexArrayOES"](vao);
      };
      return 1;
    }
  }
  function __webgl_enable_WEBGL_draw_buffers(ctx) {
    var ext = ctx.getExtension("WEBGL_draw_buffers");
    if (ext) {
      ctx["drawBuffers"] = function (n, bufs) {
        ext["drawBuffersWEBGL"](n, bufs);
      };
      return 1;
    }
  }
  function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.dibvbi = ctx.getExtension(
      "WEBGL_draw_instanced_base_vertex_base_instance"
    ));
  }
  function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
    ctx
  ) {
    return !!(ctx.mdibvbi = ctx.getExtension(
      "WEBGL_multi_draw_instanced_base_vertex_base_instance"
    ));
  }
  function __webgl_enable_WEBGL_multi_draw(ctx) {
    return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
  }
  var GL = {
    counter: 1,
    buffers: [],
    mappedBuffers: {},
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    shaders: [],
    vaos: [],
    contexts: [],
    offscreenCanvases: {},
    queries: [],
    samplers: [],
    transformFeedbacks: [],
    syncs: [],
    byteSizeByTypeRoot: 5120,
    byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    stringCache: {},
    stringiCache: {},
    unpackAlignment: 4,
    recordError: function recordError(errorCode) {
      if (!GL.lastError) {
        GL.lastError = errorCode;
      }
    },
    getNewId: function (table) {
      var ret = GL.counter++;
      for (var i = table.length; i < ret; i++) {
        table[i] = null;
      }
      return ret;
    },
    MAX_TEMP_BUFFER_SIZE: 2097152,
    numTempVertexBuffersPerSize: 64,
    log2ceilLookup: function (i) {
      return 32 - Math.clz32(i === 0 ? 0 : i - 1);
    },
    generateTempBuffers: function (quads, context) {
      var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
      context.tempVertexBufferCounters1 = [];
      context.tempVertexBufferCounters2 = [];
      context.tempVertexBufferCounters1.length =
        context.tempVertexBufferCounters2.length = largestIndex + 1;
      context.tempVertexBuffers1 = [];
      context.tempVertexBuffers2 = [];
      context.tempVertexBuffers1.length = context.tempVertexBuffers2.length =
        largestIndex + 1;
      context.tempIndexBuffers = [];
      context.tempIndexBuffers.length = largestIndex + 1;
      for (var i = 0; i <= largestIndex; ++i) {
        context.tempIndexBuffers[i] = null;
        context.tempVertexBufferCounters1[i] =
          context.tempVertexBufferCounters2[i] = 0;
        var ringbufferLength = GL.numTempVertexBuffersPerSize;
        context.tempVertexBuffers1[i] = [];
        context.tempVertexBuffers2[i] = [];
        var ringbuffer1 = context.tempVertexBuffers1[i];
        var ringbuffer2 = context.tempVertexBuffers2[i];
        ringbuffer1.length = ringbuffer2.length = ringbufferLength;
        for (var j = 0; j < ringbufferLength; ++j) {
          ringbuffer1[j] = ringbuffer2[j] = null;
        }
      }
      if (quads) {
        context.tempQuadIndexBuffer = GLctx.createBuffer();
        context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
        var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
        var quadIndexes = new Uint16Array(numIndexes);
        var i = 0,
          v = 0;
        while (1) {
          quadIndexes[i++] = v;
          if (i >= numIndexes) break;
          quadIndexes[i++] = v + 1;
          if (i >= numIndexes) break;
          quadIndexes[i++] = v + 2;
          if (i >= numIndexes) break;
          quadIndexes[i++] = v;
          if (i >= numIndexes) break;
          quadIndexes[i++] = v + 2;
          if (i >= numIndexes) break;
          quadIndexes[i++] = v + 3;
          if (i >= numIndexes) break;
          v += 4;
        }
        context.GLctx.bufferData(34963, quadIndexes, 35044);
        context.GLctx.bindBuffer(34963, null);
      }
    },
    getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
      var idx = GL.log2ceilLookup(sizeBytes);
      var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
      var nextFreeBufferIndex =
        GL.currentContext.tempVertexBufferCounters1[idx];
      GL.currentContext.tempVertexBufferCounters1[idx] =
        (GL.currentContext.tempVertexBufferCounters1[idx] + 1) &
        (GL.numTempVertexBuffersPerSize - 1);
      var vbo = ringbuffer[nextFreeBufferIndex];
      if (vbo) {
        return vbo;
      }
      var prevVBO = GLctx.getParameter(34964);
      ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
      GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
      GLctx.bufferData(34962, 1 << idx, 35048);
      GLctx.bindBuffer(34962, prevVBO);
      return ringbuffer[nextFreeBufferIndex];
    },
    getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
      var idx = GL.log2ceilLookup(sizeBytes);
      var ibo = GL.currentContext.tempIndexBuffers[idx];
      if (ibo) {
        return ibo;
      }
      var prevIBO = GLctx.getParameter(34965);
      GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
      GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
      GLctx.bufferData(34963, 1 << idx, 35048);
      GLctx.bindBuffer(34963, prevIBO);
      return GL.currentContext.tempIndexBuffers[idx];
    },
    newRenderingFrameStarted: function newRenderingFrameStarted() {
      if (!GL.currentContext) {
        return;
      }
      var vb = GL.currentContext.tempVertexBuffers1;
      GL.currentContext.tempVertexBuffers1 =
        GL.currentContext.tempVertexBuffers2;
      GL.currentContext.tempVertexBuffers2 = vb;
      vb = GL.currentContext.tempVertexBufferCounters1;
      GL.currentContext.tempVertexBufferCounters1 =
        GL.currentContext.tempVertexBufferCounters2;
      GL.currentContext.tempVertexBufferCounters2 = vb;
      var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
      for (var i = 0; i <= largestIndex; ++i) {
        GL.currentContext.tempVertexBufferCounters1[i] = 0;
      }
    },
    getSource: function (shader, count, string, length) {
      var source = "";
      for (var i = 0; i < count; ++i) {
        var len = length ? HEAP32[(length + i * 4) >> 2] : -1;
        source += UTF8ToString(
          HEAP32[(string + i * 4) >> 2],
          len < 0 ? undefined : len
        );
      }
      return source;
    },
    calcBufLength: function calcBufLength(size, type, stride, count) {
      if (stride > 0) {
        return count * stride;
      }
      var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
      return size * typeSize * count;
    },
    usedTempBuffers: [],
    preDrawHandleClientVertexAttribBindings:
      function preDrawHandleClientVertexAttribBindings(count) {
        GL.resetBufferBinding = false;
        for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
          var cb = GL.currentContext.clientBuffers[i];
          if (!cb.clientside || !cb.enabled) continue;
          GL.resetBufferBinding = true;
          var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
          var buf = GL.getTempVertexBuffer(size);
          GLctx.bindBuffer(34962, buf);
          GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
          cb.vertexAttribPointerAdaptor.call(
            GLctx,
            i,
            cb.size,
            cb.type,
            cb.normalized,
            cb.stride,
            0
          );
        }
      },
    postDrawHandleClientVertexAttribBindings:
      function postDrawHandleClientVertexAttribBindings() {
        if (GL.resetBufferBinding) {
          GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
        }
      },
    createContext: function (canvas, webGLContextAttributes) {
      if (!canvas.getContextSafariWebGL2Fixed) {
        canvas.getContextSafariWebGL2Fixed = canvas.getContext;
        canvas.getContext = function (ver, attrs) {
          var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
          return (ver == "webgl") == gl instanceof WebGLRenderingContext
            ? gl
            : null;
        };
      }
      var ctx =
        webGLContextAttributes.majorVersion > 1
          ? canvas.getContext("webgl2", webGLContextAttributes)
          : canvas.getContext("webgl", webGLContextAttributes);
      if (!ctx) return 0;
      var handle = GL.registerContext(ctx, webGLContextAttributes);
      return handle;
    },
    registerContext: function (ctx, webGLContextAttributes) {
      var handle = GL.getNewId(GL.contexts);
      var context = {
        handle: handle,
        attributes: webGLContextAttributes,
        version: webGLContextAttributes.majorVersion,
        GLctx: ctx,
      };
      if (ctx.canvas) ctx.canvas.GLctxObject = context;
      GL.contexts[handle] = context;
      if (
        typeof webGLContextAttributes.enableExtensionsByDefault ===
          "undefined" ||
        webGLContextAttributes.enableExtensionsByDefault
      ) {
        GL.initExtensions(context);
      }
      context.maxVertexAttribs = context.GLctx.getParameter(34921);
      context.clientBuffers = [];
      for (var i = 0; i < context.maxVertexAttribs; i++) {
        context.clientBuffers[i] = {
          enabled: false,
          clientside: false,
          size: 0,
          type: 0,
          normalized: 0,
          stride: 0,
          ptr: 0,
          vertexAttribPointerAdaptor: null,
        };
      }
      GL.generateTempBuffers(false, context);
      return handle;
    },
    makeContextCurrent: function (contextHandle) {
      GL.currentContext = GL.contexts[contextHandle];
      Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
      return !(contextHandle && !GLctx);
    },
    getContext: function (contextHandle) {
      return GL.contexts[contextHandle];
    },
    deleteContext: function (contextHandle) {
      if (GL.currentContext === GL.contexts[contextHandle])
        GL.currentContext = null;
      if (typeof JSEvents === "object")
        JSEvents.removeAllHandlersOnTarget(
          GL.contexts[contextHandle].GLctx.canvas
        );
      if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas)
        GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
      GL.contexts[contextHandle] = null;
    },
    initExtensions: function (context) {
      if (!context) context = GL.currentContext;
      if (context.initExtensionsDone) return;
      context.initExtensionsDone = true;
      var GLctx = context.GLctx;
      __webgl_enable_ANGLE_instanced_arrays(GLctx);
      __webgl_enable_OES_vertex_array_object(GLctx);
      __webgl_enable_WEBGL_draw_buffers(GLctx);
      __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
      __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
        GLctx
      );
      if (context.version >= 2) {
        GLctx.disjointTimerQueryExt = GLctx.getExtension(
          "EXT_disjoint_timer_query_webgl2"
        );
      }
      if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
        GLctx.disjointTimerQueryExt = GLctx.getExtension(
          "EXT_disjoint_timer_query"
        );
      }
      __webgl_enable_WEBGL_multi_draw(GLctx);
      var exts = GLctx.getSupportedExtensions() || [];
      exts.forEach(function (ext) {
        if (!ext.includes("lose_context") && !ext.includes("debug")) {
          GLctx.getExtension(ext);
        }
      });
    },
  };
  var __emscripten_webgl_power_preferences = [
    "default",
    "low-power",
    "high-performance",
  ];
  function _emscripten_webgl_do_create_context(target, attributes) {
    var a = attributes >> 2;
    var powerPreference = HEAP32[a + (24 >> 2)];
    var contextAttributes = {
      alpha: !!HEAP32[a + (0 >> 2)],
      depth: !!HEAP32[a + (4 >> 2)],
      stencil: !!HEAP32[a + (8 >> 2)],
      antialias: !!HEAP32[a + (12 >> 2)],
      premultipliedAlpha: !!HEAP32[a + (16 >> 2)],
      preserveDrawingBuffer: !!HEAP32[a + (20 >> 2)],
      powerPreference: __emscripten_webgl_power_preferences[powerPreference],
      failIfMajorPerformanceCaveat: !!HEAP32[a + (28 >> 2)],
      majorVersion: HEAP32[a + (32 >> 2)],
      minorVersion: HEAP32[a + (36 >> 2)],
      enableExtensionsByDefault: HEAP32[a + (40 >> 2)],
      explicitSwapControl: HEAP32[a + (44 >> 2)],
      proxyContextToMainThread: HEAP32[a + (48 >> 2)],
      renderViaOffscreenBackBuffer: HEAP32[a + (52 >> 2)],
    };
    var canvas = findCanvasEventTarget(target);
    if (!canvas) {
      return 0;
    }
    if (contextAttributes.explicitSwapControl) {
      return 0;
    }
    var contextHandle = GL.createContext(canvas, contextAttributes);
    return contextHandle;
  }
  function _emscripten_webgl_create_context(a0, a1) {
    return _emscripten_webgl_do_create_context(a0, a1);
  }
  function _emscripten_webgl_do_get_current_context() {
    return GL.currentContext ? GL.currentContext.handle : 0;
  }
  function _emscripten_webgl_get_current_context() {
    return _emscripten_webgl_do_get_current_context();
  }
  Module["_emscripten_webgl_get_current_context"] =
    _emscripten_webgl_get_current_context;
  function _emscripten_webgl_make_context_current(contextHandle) {
    var success = GL.makeContextCurrent(contextHandle);
    return success ? 0 : -5;
  }
  Module["_emscripten_webgl_make_context_current"] =
    _emscripten_webgl_make_context_current;
  function _emscripten_webgl_destroy_context(contextHandle) {
    if (GL.currentContext == contextHandle) GL.currentContext = 0;
    GL.deleteContext(contextHandle);
  }
  function _emscripten_webgl_enable_extension(contextHandle, extension) {
    var context = GL.getContext(contextHandle);
    var extString = UTF8ToString(extension);
    if (extString.startsWith("GL_")) extString = extString.substr(3);
    if (extString == "ANGLE_instanced_arrays")
      __webgl_enable_ANGLE_instanced_arrays(GLctx);
    if (extString == "OES_vertex_array_object")
      __webgl_enable_OES_vertex_array_object(GLctx);
    if (extString == "WEBGL_draw_buffers")
      __webgl_enable_WEBGL_draw_buffers(GLctx);
    if (extString == "WEBGL_draw_instanced_base_vertex_base_instance")
      __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    if (extString == "WEBGL_multi_draw_instanced_base_vertex_base_instance")
      __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
        GLctx
      );
    if (extString == "WEBGL_multi_draw") __webgl_enable_WEBGL_multi_draw(GLctx);
    var ext = context.GLctx.getExtension(extString);
    return !!ext;
  }
  function _emscripten_webgl_init_context_attributes(attributes) {
    var a = attributes >> 2;
    for (var i = 0; i < 56 >> 2; ++i) {
      HEAP32[a + i] = 0;
    }
    HEAP32[a + (0 >> 2)] =
      HEAP32[a + (4 >> 2)] =
      HEAP32[a + (12 >> 2)] =
      HEAP32[a + (16 >> 2)] =
      HEAP32[a + (32 >> 2)] =
      HEAP32[a + (40 >> 2)] =
        1;
  }
  var ENV = {};
  function getExecutableName() {
    return thisProgram || "./this.program";
  }
  function getEnvStrings() {
    if (!getEnvStrings.strings) {
      var lang =
        (
          (typeof navigator === "object" &&
            navigator.languages &&
            navigator.languages[0]) ||
          "C"
        ).replace("-", "_") + ".UTF-8";
      var env = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: lang,
        _: getExecutableName(),
      };
      for (var x in ENV) {
        env[x] = ENV[x];
      }
      var strings = [];
      for (var x in env) {
        strings.push(x + "=" + env[x]);
      }
      getEnvStrings.strings = strings;
    }
    return getEnvStrings.strings;
  }
  function _environ_get(__environ, environ_buf) {
    try {
      var bufSize = 0;
      getEnvStrings().forEach(function (string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(__environ + i * 4) >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _environ_sizes_get(penviron_count, penviron_buf_size) {
    try {
      var strings = getEnvStrings();
      HEAP32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(function (string) {
        bufSize += string.length + 1;
      });
      HEAP32[penviron_buf_size >> 2] = bufSize;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _fd_close(fd) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _fd_fdstat_get(fd, pbuf) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var type = stream.tty
        ? 2
        : FS.isDir(stream.mode)
        ? 3
        : FS.isLink(stream.mode)
        ? 7
        : 4;
      HEAP8[pbuf >> 0] = type;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _fd_read(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      HEAP32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var HIGH_OFFSET = 4294967296;
      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
      var DOUBLE_LIMIT = 9007199254740992;
      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
        return -61;
      }
      FS.llseek(stream, offset, whence);
      (tempI64 = [
        stream.position >>> 0,
        ((tempDouble = stream.position),
        +Math.abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math.ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[newOffset >> 2] = tempI64[0]),
        (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0)
        stream.getdents = null;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _fd_write(fd, iov, iovcnt, pnum) {
    try {
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
      HEAP32[pnum >> 2] = num;
      return 0;
    } catch (e) {
      if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
      return e.errno;
    }
  }
  function _flock(fd, operation) {
    return 0;
  }
  function _getTempRet0() {
    return getTempRet0();
  }
  function _getpwuid() {
    throw "getpwuid: TODO";
  }
  function _gettimeofday(ptr) {
    var now = Date.now();
    HEAP32[ptr >> 2] = (now / 1e3) | 0;
    HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0;
    return 0;
  }
  function _glActiveTexture(x0) {
    GLctx["activeTexture"](x0);
  }
  function _glAttachShader(program, shader) {
    program = GL.programs[program];
    shader = GL.shaders[shader];
    program[shader.shaderType] = shader;
    GLctx.attachShader(program, shader);
  }
  function _glBeginQuery(target, id) {
    GLctx["beginQuery"](target, GL.queries[id]);
  }
  function _glBindAttribLocation(program, index, name) {
    GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
  }
  function _glBindBuffer(target, buffer) {
    if (target == 34962) {
      GLctx.currentArrayBufferBinding = buffer;
    } else if (target == 34963) {
      GLctx.currentElementArrayBufferBinding = buffer;
    }
    if (target == 35051) {
      GLctx.currentPixelPackBufferBinding = buffer;
    } else if (target == 35052) {
      GLctx.currentPixelUnpackBufferBinding = buffer;
    }
    GLctx.bindBuffer(target, GL.buffers[buffer]);
  }
  function _glBindBufferBase(target, index, buffer) {
    GLctx["bindBufferBase"](target, index, GL.buffers[buffer]);
  }
  function _glBindBufferRange(target, index, buffer, offset, ptrsize) {
    GLctx["bindBufferRange"](
      target,
      index,
      GL.buffers[buffer],
      offset,
      ptrsize
    );
  }
  function _glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
  }
  function _glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
  }
  function _glBindSampler(unit, sampler) {
    GLctx["bindSampler"](unit, GL.samplers[sampler]);
  }
  function _glBindTexture(target, texture) {
    GLctx.bindTexture(target, GL.textures[texture]);
  }
  function _glBindVertexArray(vao) {
    GLctx["bindVertexArray"](GL.vaos[vao]);
    var ibo = GLctx.getParameter(34965);
    GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0;
  }
  function _glBlendEquation(x0) {
    GLctx["blendEquation"](x0);
  }
  function _glBlendEquationSeparate(x0, x1) {
    GLctx["blendEquationSeparate"](x0, x1);
  }
  function _glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx["blendFuncSeparate"](x0, x1, x2, x3);
  }
  function _glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
    GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
  }
  function _glBufferData(target, size, data, usage) {
    if (GL.currentContext.version >= 2) {
      if (data) {
        GLctx.bufferData(target, HEAPU8, usage, data, size);
      } else {
        GLctx.bufferData(target, size, usage);
      }
    } else {
      GLctx.bufferData(
        target,
        data ? HEAPU8.subarray(data, data + size) : size,
        usage
      );
    }
  }
  function _glBufferSubData(target, offset, size, data) {
    if (GL.currentContext.version >= 2) {
      GLctx.bufferSubData(target, offset, HEAPU8, data, size);
      return;
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
  }
  function _glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0);
  }
  function _glClear(x0) {
    GLctx["clear"](x0);
  }
  function _glClearBufferfi(x0, x1, x2, x3) {
    GLctx["clearBufferfi"](x0, x1, x2, x3);
  }
  function _glClearBufferfv(buffer, drawbuffer, value) {
    GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2);
  }
  function _glClearBufferuiv(buffer, drawbuffer, value) {
    GLctx["clearBufferuiv"](buffer, drawbuffer, HEAPU32, value >> 2);
  }
  function _glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3);
  }
  function _glClearDepthf(x0) {
    GLctx["clearDepth"](x0);
  }
  function _glClearStencil(x0) {
    GLctx["clearStencil"](x0);
  }
  function _glClientWaitSync(sync, flags, timeoutLo, timeoutHi) {
    return GLctx.clientWaitSync(
      GL.syncs[sync],
      flags,
      convertI32PairToI53(timeoutLo, timeoutHi)
    );
  }
  function _glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
  }
  function _glCompileShader(shader) {
    GLctx.compileShader(GL.shaders[shader]);
  }
  function _glCompressedTexImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    imageSize,
    data
  ) {
    if (GL.currentContext.version >= 2) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexImage2D"](
          target,
          level,
          internalFormat,
          width,
          height,
          border,
          imageSize,
          data
        );
      } else {
        GLctx["compressedTexImage2D"](
          target,
          level,
          internalFormat,
          width,
          height,
          border,
          HEAPU8,
          data,
          imageSize
        );
      }
      return;
    }
    GLctx["compressedTexImage2D"](
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      data ? HEAPU8.subarray(data, data + imageSize) : null
    );
  }
  function _glCompressedTexImage3D(
    target,
    level,
    internalFormat,
    width,
    height,
    depth,
    border,
    imageSize,
    data
  ) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["compressedTexImage3D"](
        target,
        level,
        internalFormat,
        width,
        height,
        depth,
        border,
        imageSize,
        data
      );
    } else {
      GLctx["compressedTexImage3D"](
        target,
        level,
        internalFormat,
        width,
        height,
        depth,
        border,
        HEAPU8,
        data,
        imageSize
      );
    }
  }
  function _glCompressedTexSubImage2D(
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    imageSize,
    data
  ) {
    if (GL.currentContext.version >= 2) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexSubImage2D"](
          target,
          level,
          xoffset,
          yoffset,
          width,
          height,
          format,
          imageSize,
          data
        );
      } else {
        GLctx["compressedTexSubImage2D"](
          target,
          level,
          xoffset,
          yoffset,
          width,
          height,
          format,
          HEAPU8,
          data,
          imageSize
        );
      }
      return;
    }
    GLctx["compressedTexSubImage2D"](
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      data ? HEAPU8.subarray(data, data + imageSize) : null
    );
  }
  function _glCompressedTexSubImage3D(
    target,
    level,
    xoffset,
    yoffset,
    zoffset,
    width,
    height,
    depth,
    format,
    imageSize,
    data
  ) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["compressedTexSubImage3D"](
        target,
        level,
        xoffset,
        yoffset,
        zoffset,
        width,
        height,
        depth,
        format,
        imageSize,
        data
      );
    } else {
      GLctx["compressedTexSubImage3D"](
        target,
        level,
        xoffset,
        yoffset,
        zoffset,
        width,
        height,
        depth,
        format,
        HEAPU8,
        data,
        imageSize
      );
    }
  }
  function _glCopyBufferSubData(x0, x1, x2, x3, x4) {
    GLctx["copyBufferSubData"](x0, x1, x2, x3, x4);
  }
  function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
  }
  function _glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
  }
  function _glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    program.maxUniformLength =
      program.maxAttributeLength =
      program.maxUniformBlockNameLength =
        0;
    program.uniformIdCounter = 1;
    GL.programs[id] = program;
    return id;
  }
  function _glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = GLctx.createShader(shaderType);
    GL.shaders[id].shaderType = shaderType & 1 ? "vs" : "fs";
    return id;
  }
  function _glCullFace(x0) {
    GLctx["cullFace"](x0);
  }
  function _glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(buffers + i * 4) >> 2];
      var buffer = GL.buffers[id];
      if (!buffer) continue;
      GLctx.deleteBuffer(buffer);
      buffer.name = 0;
      GL.buffers[id] = null;
      if (id == GLctx.currentArrayBufferBinding)
        GLctx.currentArrayBufferBinding = 0;
      if (id == GLctx.currentElementArrayBufferBinding)
        GLctx.currentElementArrayBufferBinding = 0;
      if (id == GLctx.currentPixelPackBufferBinding)
        GLctx.currentPixelPackBufferBinding = 0;
      if (id == GLctx.currentPixelUnpackBufferBinding)
        GLctx.currentPixelUnpackBufferBinding = 0;
    }
  }
  function _glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
      var id = HEAP32[(framebuffers + i * 4) >> 2];
      var framebuffer = GL.framebuffers[id];
      if (!framebuffer) continue;
      GLctx.deleteFramebuffer(framebuffer);
      framebuffer.name = 0;
      GL.framebuffers[id] = null;
    }
  }
  function _glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
      GL.recordError(1281);
      return;
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null;
  }
  function _glDeleteQueries(n, ids) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(ids + i * 4) >> 2];
      var query = GL.queries[id];
      if (!query) continue;
      GLctx["deleteQuery"](query);
      GL.queries[id] = null;
    }
  }
  function _glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(renderbuffers + i * 4) >> 2];
      var renderbuffer = GL.renderbuffers[id];
      if (!renderbuffer) continue;
      GLctx.deleteRenderbuffer(renderbuffer);
      renderbuffer.name = 0;
      GL.renderbuffers[id] = null;
    }
  }
  function _glDeleteSamplers(n, samplers) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(samplers + i * 4) >> 2];
      var sampler = GL.samplers[id];
      if (!sampler) continue;
      GLctx["deleteSampler"](sampler);
      sampler.name = 0;
      GL.samplers[id] = null;
    }
  }
  function _glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
      GL.recordError(1281);
      return;
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null;
  }
  function _glDeleteSync(id) {
    if (!id) return;
    var sync = GL.syncs[id];
    if (!sync) {
      GL.recordError(1281);
      return;
    }
    GLctx.deleteSync(sync);
    sync.name = 0;
    GL.syncs[id] = null;
  }
  function _glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(textures + i * 4) >> 2];
      var texture = GL.textures[id];
      if (!texture) continue;
      GLctx.deleteTexture(texture);
      texture.name = 0;
      GL.textures[id] = null;
    }
  }
  function _glDeleteVertexArrays(n, vaos) {
    for (var i = 0; i < n; i++) {
      var id = HEAP32[(vaos + i * 4) >> 2];
      GLctx["deleteVertexArray"](GL.vaos[id]);
      GL.vaos[id] = null;
    }
  }
  function _glDepthFunc(x0) {
    GLctx["depthFunc"](x0);
  }
  function _glDepthMask(flag) {
    GLctx.depthMask(!!flag);
  }
  function _glDetachShader(program, shader) {
    GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
  }
  function _glDisable(x0) {
    GLctx["disable"](x0);
  }
  function _glDisableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = false;
    GLctx.disableVertexAttribArray(index);
  }
  function _glDrawArrays(mode, first, count) {
    GL.preDrawHandleClientVertexAttribBindings(first + count);
    GLctx.drawArrays(mode, first, count);
    GL.postDrawHandleClientVertexAttribBindings();
  }
  function _glDrawArraysInstanced(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount);
  }
  var tempFixedLengthArray = [];
  function _glDrawBuffers(n, bufs) {
    var bufArray = tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
      bufArray[i] = HEAP32[(bufs + i * 4) >> 2];
    }
    GLctx["drawBuffers"](bufArray);
  }
  function _glDrawElements(mode, count, type, indices) {
    var buf;
    if (!GLctx.currentElementArrayBufferBinding) {
      var size = GL.calcBufLength(1, type, 0, count);
      buf = GL.getTempIndexBuffer(size);
      GLctx.bindBuffer(34963, buf);
      GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
      indices = 0;
    }
    GL.preDrawHandleClientVertexAttribBindings(count);
    GLctx.drawElements(mode, count, type, indices);
    GL.postDrawHandleClientVertexAttribBindings(count);
    if (!GLctx.currentElementArrayBufferBinding) {
      GLctx.bindBuffer(34963, null);
    }
  }
  function _glDrawElementsInstanced(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
  }
  function _glEnable(x0) {
    GLctx["enable"](x0);
  }
  function _glEnableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = true;
    GLctx.enableVertexAttribArray(index);
  }
  function _glEndQuery(x0) {
    GLctx["endQuery"](x0);
  }
  function _glFenceSync(condition, flags) {
    var sync = GLctx.fenceSync(condition, flags);
    if (sync) {
      var id = GL.getNewId(GL.syncs);
      sync.name = id;
      GL.syncs[id] = sync;
      return id;
    } else {
      return 0;
    }
  }
  function _glFinish() {
    GLctx["finish"]();
  }
  function _glFlush() {
    GLctx["flush"]();
  }
  function emscriptenWebGLGetBufferBinding(target) {
    switch (target) {
      case 34962:
        target = 34964;
        break;
      case 34963:
        target = 34965;
        break;
      case 35051:
        target = 35053;
        break;
      case 35052:
        target = 35055;
        break;
      case 35982:
        target = 35983;
        break;
      case 36662:
        target = 36662;
        break;
      case 36663:
        target = 36663;
        break;
      case 35345:
        target = 35368;
        break;
    }
    var buffer = GLctx.getParameter(target);
    if (buffer) return buffer.name | 0;
    else return 0;
  }
  function emscriptenWebGLValidateMapBufferTarget(target) {
    switch (target) {
      case 34962:
      case 34963:
      case 36662:
      case 36663:
      case 35051:
      case 35052:
      case 35882:
      case 35982:
      case 35345:
        return true;
      default:
        return false;
    }
  }
  function _glFlushMappedBufferRange(target, offset, length) {
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
      GL.recordError(1280);
      err("GL_INVALID_ENUM in glFlushMappedBufferRange");
      return;
    }
    var mapping = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
    if (!mapping) {
      GL.recordError(1282);
      err("buffer was never mapped in glFlushMappedBufferRange");
      return;
    }
    if (!(mapping.access & 16)) {
      GL.recordError(1282);
      err(
        "buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange"
      );
      return;
    }
    if (offset < 0 || length < 0 || offset + length > mapping.length) {
      GL.recordError(1281);
      err("invalid range in glFlushMappedBufferRange");
      return;
    }
    GLctx.bufferSubData(
      target,
      mapping.offset,
      HEAPU8.subarray(mapping.mem + offset, mapping.mem + offset + length)
    );
  }
  function _glFramebufferRenderbuffer(
    target,
    attachment,
    renderbuffertarget,
    renderbuffer
  ) {
    GLctx.framebufferRenderbuffer(
      target,
      attachment,
      renderbuffertarget,
      GL.renderbuffers[renderbuffer]
    );
  }
  function _glFramebufferTexture2D(
    target,
    attachment,
    textarget,
    texture,
    level
  ) {
    GLctx.framebufferTexture2D(
      target,
      attachment,
      textarget,
      GL.textures[texture],
      level
    );
  }
  function _glFramebufferTextureLayer(
    target,
    attachment,
    texture,
    level,
    layer
  ) {
    GLctx.framebufferTextureLayer(
      target,
      attachment,
      GL.textures[texture],
      level,
      layer
    );
  }
  function _glFrontFace(x0) {
    GLctx["frontFace"](x0);
  }
  function __glGenObject(n, buffers, createFunction, objectTable) {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      HEAP32[(buffers + i * 4) >> 2] = id;
    }
  }
  function _glGenBuffers(n, buffers) {
    __glGenObject(n, buffers, "createBuffer", GL.buffers);
  }
  function _glGenFramebuffers(n, ids) {
    __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
  }
  function _glGenQueries(n, ids) {
    __glGenObject(n, ids, "createQuery", GL.queries);
  }
  function _glGenRenderbuffers(n, renderbuffers) {
    __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
  }
  function _glGenSamplers(n, samplers) {
    __glGenObject(n, samplers, "createSampler", GL.samplers);
  }
  function _glGenTextures(n, textures) {
    __glGenObject(n, textures, "createTexture", GL.textures);
  }
  function _glGenVertexArrays(n, arrays) {
    __glGenObject(n, arrays, "createVertexArray", GL.vaos);
  }
  function _glGenerateMipmap(x0) {
    GLctx["generateMipmap"](x0);
  }
  function __glGetActiveAttribOrUniform(
    funcName,
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  ) {
    program = GL.programs[program];
    var info = GLctx[funcName](program, index);
    if (info) {
      var numBytesWrittenExclNull =
        name && stringToUTF8(info.name, name, bufSize);
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
      if (size) HEAP32[size >> 2] = info.size;
      if (type) HEAP32[type >> 2] = info.type;
    }
  }
  function _glGetActiveAttrib(
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  ) {
    __glGetActiveAttribOrUniform(
      "getActiveAttrib",
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    );
  }
  function _glGetActiveUniform(
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  ) {
    __glGetActiveAttribOrUniform(
      "getActiveUniform",
      program,
      index,
      bufSize,
      length,
      size,
      type,
      name
    );
  }
  function _glGetActiveUniformBlockName(
    program,
    uniformBlockIndex,
    bufSize,
    length,
    uniformBlockName
  ) {
    program = GL.programs[program];
    var result = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
    if (!result) return;
    if (uniformBlockName && bufSize > 0) {
      var numBytesWrittenExclNull = stringToUTF8(
        result,
        uniformBlockName,
        bufSize
      );
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    } else {
      if (length) HEAP32[length >> 2] = 0;
    }
  }
  function _glGetActiveUniformBlockiv(
    program,
    uniformBlockIndex,
    pname,
    params
  ) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    program = GL.programs[program];
    if (pname == 35393) {
      var name = GLctx["getActiveUniformBlockName"](program, uniformBlockIndex);
      HEAP32[params >> 2] = name.length + 1;
      return;
    }
    var result = GLctx["getActiveUniformBlockParameter"](
      program,
      uniformBlockIndex,
      pname
    );
    if (result === null) return;
    if (pname == 35395) {
      for (var i = 0; i < result.length; i++) {
        HEAP32[(params + i * 4) >> 2] = result[i];
      }
    } else {
      HEAP32[params >> 2] = result;
    }
  }
  function _glGetActiveUniformsiv(
    program,
    uniformCount,
    uniformIndices,
    pname,
    params
  ) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    if (uniformCount > 0 && uniformIndices == 0) {
      GL.recordError(1281);
      return;
    }
    program = GL.programs[program];
    var ids = [];
    for (var i = 0; i < uniformCount; i++) {
      ids.push(HEAP32[(uniformIndices + i * 4) >> 2]);
    }
    var result = GLctx["getActiveUniforms"](program, ids, pname);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
      HEAP32[(params + i * 4) >> 2] = result[i];
    }
  }
  function _glGetAttribLocation(program, name) {
    return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
  }
  function _glGetError() {
    var error = GLctx.getError() || GL.lastError;
    GL.lastError = 0;
    return error;
  }
  function _glGetFramebufferAttachmentParameteriv(
    target,
    attachment,
    pname,
    params
  ) {
    var result = GLctx.getFramebufferAttachmentParameter(
      target,
      attachment,
      pname
    );
    if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
      result = result.name | 0;
    }
    HEAP32[params >> 2] = result;
  }
  function writeI53ToI64(ptr, num) {
    HEAPU32[ptr >> 2] = num;
    HEAPU32[(ptr + 4) >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296;
  }
  function emscriptenWebGLGetIndexed(target, index, data, type) {
    if (!data) {
      GL.recordError(1281);
      return;
    }
    var result = GLctx["getIndexedParameter"](target, index);
    var ret;
    switch (typeof result) {
      case "boolean":
        ret = result ? 1 : 0;
        break;
      case "number":
        ret = result;
        break;
      case "object":
        if (result === null) {
          switch (target) {
            case 35983:
            case 35368:
              ret = 0;
              break;
            default: {
              GL.recordError(1280);
              return;
            }
          }
        } else if (result instanceof WebGLBuffer) {
          ret = result.name | 0;
        } else {
          GL.recordError(1280);
          return;
        }
        break;
      default:
        GL.recordError(1280);
        return;
    }
    switch (type) {
      case 1:
        writeI53ToI64(data, ret);
        break;
      case 0:
        HEAP32[data >> 2] = ret;
        break;
      case 2:
        HEAPF32[data >> 2] = ret;
        break;
      case 4:
        HEAP8[data >> 0] = ret ? 1 : 0;
        break;
      default:
        throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type;
    }
  }
  function _glGetIntegeri_v(target, index, data) {
    emscriptenWebGLGetIndexed(target, index, data, 0);
  }
  function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
      GL.recordError(1281);
      return;
    }
    var ret = undefined;
    switch (name_) {
      case 36346:
        ret = 1;
        break;
      case 36344:
        if (type != 0 && type != 1) {
          GL.recordError(1280);
        }
        return;
      case 34814:
      case 36345:
        ret = 0;
        break;
      case 34466:
        var formats = GLctx.getParameter(34467);
        ret = formats ? formats.length : 0;
        break;
      case 33390:
        ret = 1048576;
        break;
      case 33309:
        if (GL.currentContext.version < 2) {
          GL.recordError(1282);
          return;
        }
        var exts = GLctx.getSupportedExtensions() || [];
        ret = 2 * exts.length;
        break;
      case 33307:
      case 33308:
        if (GL.currentContext.version < 2) {
          GL.recordError(1280);
          return;
        }
        ret = name_ == 33307 ? 3 : 0;
        break;
    }
    if (ret === undefined) {
      var result = GLctx.getParameter(name_);
      switch (typeof result) {
        case "number":
          ret = result;
          break;
        case "boolean":
          ret = result ? 1 : 0;
          break;
        case "string":
          GL.recordError(1280);
          return;
        case "object":
          if (result === null) {
            switch (name_) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 36662:
              case 36663:
              case 35053:
              case 35055:
              case 36010:
              case 35097:
              case 35869:
              case 32874:
              case 36389:
              case 35983:
              case 35368:
              case 34068: {
                ret = 0;
                break;
              }
              default: {
                GL.recordError(1280);
                return;
              }
            }
          } else if (
            result instanceof Float32Array ||
            result instanceof Uint32Array ||
            result instanceof Int32Array ||
            result instanceof Array
          ) {
            for (var i = 0; i < result.length; ++i) {
              switch (type) {
                case 0:
                  HEAP32[(p + i * 4) >> 2] = result[i];
                  break;
                case 2:
                  HEAPF32[(p + i * 4) >> 2] = result[i];
                  break;
                case 4:
                  HEAP8[(p + i) >> 0] = result[i] ? 1 : 0;
                  break;
              }
            }
            return;
          } else {
            try {
              ret = result.name | 0;
            } catch (e) {
              GL.recordError(1280);
              err(
                "GL_INVALID_ENUM in glGet" +
                  type +
                  "v: Unknown object returned from WebGL getParameter(" +
                  name_ +
                  ")! (error: " +
                  e +
                  ")"
              );
              return;
            }
          }
          break;
        default:
          GL.recordError(1280);
          err(
            "GL_INVALID_ENUM in glGet" +
              type +
              "v: Native code calling glGet" +
              type +
              "v(" +
              name_ +
              ") and it returns " +
              result +
              " of type " +
              typeof result +
              "!"
          );
          return;
      }
    }
    switch (type) {
      case 1:
        writeI53ToI64(p, ret);
        break;
      case 0:
        HEAP32[p >> 2] = ret;
        break;
      case 2:
        HEAPF32[p >> 2] = ret;
        break;
      case 4:
        HEAP8[p >> 0] = ret ? 1 : 0;
        break;
    }
  }
  function _glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, 0);
  }
  function _glGetInternalformativ(
    target,
    internalformat,
    pname,
    bufSize,
    params
  ) {
    if (bufSize < 0) {
      GL.recordError(1281);
      return;
    }
    if (!params) {
      GL.recordError(1281);
      return;
    }
    var ret = GLctx["getInternalformatParameter"](
      target,
      internalformat,
      pname
    );
    if (ret === null) return;
    for (var i = 0; i < ret.length && i < bufSize; ++i) {
      HEAP32[(params + i * 4) >> 2] = ret[i];
    }
  }
  function _glGetProgramBinary(program, bufSize, length, binaryFormat, binary) {
    GL.recordError(1282);
  }
  function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull =
      maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
  }
  function _glGetProgramiv(program, pname, p) {
    if (!p) {
      GL.recordError(1281);
      return;
    }
    if (program >= GL.counter) {
      GL.recordError(1281);
      return;
    }
    program = GL.programs[program];
    if (pname == 35716) {
      var log = GLctx.getProgramInfoLog(program);
      if (log === null) log = "(unknown error)";
      HEAP32[p >> 2] = log.length + 1;
    } else if (pname == 35719) {
      if (!program.maxUniformLength) {
        for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
          program.maxUniformLength = Math.max(
            program.maxUniformLength,
            GLctx.getActiveUniform(program, i).name.length + 1
          );
        }
      }
      HEAP32[p >> 2] = program.maxUniformLength;
    } else if (pname == 35722) {
      if (!program.maxAttributeLength) {
        for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
          program.maxAttributeLength = Math.max(
            program.maxAttributeLength,
            GLctx.getActiveAttrib(program, i).name.length + 1
          );
        }
      }
      HEAP32[p >> 2] = program.maxAttributeLength;
    } else if (pname == 35381) {
      if (!program.maxUniformBlockNameLength) {
        for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
          program.maxUniformBlockNameLength = Math.max(
            program.maxUniformBlockNameLength,
            GLctx.getActiveUniformBlockName(program, i).length + 1
          );
        }
      }
      HEAP32[p >> 2] = program.maxUniformBlockNameLength;
    } else {
      HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
    }
  }
  function _glGetQueryObjectuiv(id, pname, params) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    var query = GL.queries[id];
    var param = GLctx["getQueryParameter"](query, pname);
    var ret;
    if (typeof param == "boolean") {
      ret = param ? 1 : 0;
    } else {
      ret = param;
    }
    HEAP32[params >> 2] = ret;
  }
  function _glGetQueryiv(target, pname, params) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    HEAP32[params >> 2] = GLctx["getQuery"](target, pname);
  }
  function _glGetRenderbufferParameteriv(target, pname, params) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
  }
  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull =
      maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
  }
  function _glGetShaderPrecisionFormat(
    shaderType,
    precisionType,
    range,
    precision
  ) {
    var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
    HEAP32[range >> 2] = result.rangeMin;
    HEAP32[(range + 4) >> 2] = result.rangeMax;
    HEAP32[precision >> 2] = result.precision;
  }
  function _glGetShaderSource(shader, bufSize, length, source) {
    var result = GLctx.getShaderSource(GL.shaders[shader]);
    if (!result) return;
    var numBytesWrittenExclNull =
      bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
  }
  function _glGetShaderiv(shader, pname, p) {
    if (!p) {
      GL.recordError(1281);
      return;
    }
    if (pname == 35716) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = "(unknown error)";
      var logLength = log ? log.length + 1 : 0;
      HEAP32[p >> 2] = logLength;
    } else if (pname == 35720) {
      var source = GLctx.getShaderSource(GL.shaders[shader]);
      var sourceLength = source ? source.length + 1 : 0;
      HEAP32[p >> 2] = sourceLength;
    } else {
      HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
    }
  }
  function _glGetString(name_) {
    var ret = GL.stringCache[name_];
    if (!ret) {
      switch (name_) {
        case 7939:
          var exts = GLctx.getSupportedExtensions() || [];
          exts = exts.concat(
            exts.map(function (e) {
              return "GL_" + e;
            })
          );
          ret = stringToNewUTF8(exts.join(" "));
          break;
        case 7936:
        case 7937:
        case 37445:
        case 37446:
          var s = GLctx.getParameter(name_);
          if (!s) {
            GL.recordError(1280);
          }
          ret = s && stringToNewUTF8(s);
          break;
        case 7938:
          var glVersion = GLctx.getParameter(7938);
          if (GL.currentContext.version >= 2)
            glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
          else {
            glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
          }
          ret = stringToNewUTF8(glVersion);
          break;
        case 35724:
          var glslVersion = GLctx.getParameter(35724);
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
            glslVersion =
              "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
          }
          ret = stringToNewUTF8(glslVersion);
          break;
        default:
          GL.recordError(1280);
      }
      GL.stringCache[name_] = ret;
    }
    return ret;
  }
  function _glGetStringi(name, index) {
    if (GL.currentContext.version < 2) {
      GL.recordError(1282);
      return 0;
    }
    var stringiCache = GL.stringiCache[name];
    if (stringiCache) {
      if (index < 0 || index >= stringiCache.length) {
        GL.recordError(1281);
        return 0;
      }
      return stringiCache[index];
    }
    switch (name) {
      case 7939:
        var exts = GLctx.getSupportedExtensions() || [];
        exts = exts.concat(
          exts.map(function (e) {
            return "GL_" + e;
          })
        );
        exts = exts.map(function (e) {
          return stringToNewUTF8(e);
        });
        stringiCache = GL.stringiCache[name] = exts;
        if (index < 0 || index >= stringiCache.length) {
          GL.recordError(1281);
          return 0;
        }
        return stringiCache[index];
      default:
        GL.recordError(1280);
        return 0;
    }
  }
  function _glGetTexParameteriv(target, pname, params) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    HEAP32[params >> 2] = GLctx.getTexParameter(target, pname);
  }
  function _glGetUniformBlockIndex(program, uniformBlockName) {
    return GLctx["getUniformBlockIndex"](
      GL.programs[program],
      UTF8ToString(uniformBlockName)
    );
  }
  function _glGetUniformIndices(
    program,
    uniformCount,
    uniformNames,
    uniformIndices
  ) {
    if (!uniformIndices) {
      GL.recordError(1281);
      return;
    }
    if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
      GL.recordError(1281);
      return;
    }
    program = GL.programs[program];
    var names = [];
    for (var i = 0; i < uniformCount; i++)
      names.push(UTF8ToString(HEAP32[(uniformNames + i * 4) >> 2]));
    var result = GLctx["getUniformIndices"](program, names);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
      HEAP32[(uniformIndices + i * 4) >> 2] = result[i];
    }
  }
  function jstoi_q(str) {
    return parseInt(str);
  }
  function _glGetUniformLocation(program, name) {
    function getLeftBracePos(name) {
      return name.slice(-1) == "]" && name.lastIndexOf("[");
    }
    name = UTF8ToString(name);
    if ((program = GL.programs[program])) {
      var uniformLocsById = program.uniformLocsById;
      var uniformSizeAndIdsByName = program.uniformSizeAndIdsByName;
      var i, j;
      var arrayIndex = 0;
      var uniformBaseName = name;
      var leftBrace = getLeftBracePos(name);
      if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = getLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
          var id = uniformSizeAndIdsByName[arrayName]
            ? uniformSizeAndIdsByName[arrayName][1]
            : program.uniformIdCounter;
          program.uniformIdCounter = Math.max(
            id + sz,
            program.uniformIdCounter
          );
          uniformSizeAndIdsByName[arrayName] = [sz, id];
          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
      if (leftBrace > 0) {
        arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
        uniformBaseName = name.slice(0, leftBrace);
      }
      var sizeAndId = uniformSizeAndIdsByName[uniformBaseName];
      if (sizeAndId && arrayIndex < sizeAndId[0]) {
        arrayIndex += sizeAndId[1];
        if (
          (uniformLocsById[arrayIndex] =
            uniformLocsById[arrayIndex] ||
            GLctx.getUniformLocation(program, name))
        ) {
          return arrayIndex;
        }
      }
    } else {
      GL.recordError(1281);
    }
    return -1;
  }
  function webglGetUniformLocation(location) {
    var p = GLctx.currentProgram;
    if (p) {
      var webglLoc = p.uniformLocsById[location];
      if (typeof webglLoc === "number") {
        p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(
          p,
          p.uniformArrayNamesById[location] +
            (webglLoc > 0 ? "[" + webglLoc + "]" : "")
        );
      }
      return webglLoc;
    } else {
      GL.recordError(1282);
    }
  }
  function emscriptenWebGLGetUniform(program, location, params, type) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    program = GL.programs[program];
    var data = GLctx.getUniform(program, webglGetUniformLocation(location));
    if (typeof data == "number" || typeof data == "boolean") {
      switch (type) {
        case 0:
          HEAP32[params >> 2] = data;
          break;
        case 2:
          HEAPF32[params >> 2] = data;
          break;
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        switch (type) {
          case 0:
            HEAP32[(params + i * 4) >> 2] = data[i];
            break;
          case 2:
            HEAPF32[(params + i * 4) >> 2] = data[i];
            break;
        }
      }
    }
  }
  function _glGetUniformiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 0);
  }
  function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
    if (!params) {
      GL.recordError(1281);
      return;
    }
    if (GL.currentContext.clientBuffers[index].enabled) {
      err(
        "glGetVertexAttrib*v on client-side array: not supported, bad data returned"
      );
    }
    var data = GLctx.getVertexAttrib(index, pname);
    if (pname == 34975) {
      HEAP32[params >> 2] = data && data["name"];
    } else if (typeof data == "number" || typeof data == "boolean") {
      switch (type) {
        case 0:
          HEAP32[params >> 2] = data;
          break;
        case 2:
          HEAPF32[params >> 2] = data;
          break;
        case 5:
          HEAP32[params >> 2] = Math.fround(data);
          break;
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        switch (type) {
          case 0:
            HEAP32[(params + i * 4) >> 2] = data[i];
            break;
          case 2:
            HEAPF32[(params + i * 4) >> 2] = data[i];
            break;
          case 5:
            HEAP32[(params + i * 4) >> 2] = Math.fround(data[i]);
            break;
        }
      }
    }
  }
  function _glGetVertexAttribiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
  }
  function _glInvalidateFramebuffer(target, numAttachments, attachments) {
    var list = tempFixedLengthArray[numAttachments];
    for (var i = 0; i < numAttachments; i++) {
      list[i] = HEAP32[(attachments + i * 4) >> 2];
    }
    GLctx["invalidateFramebuffer"](target, list);
  }
  function _glIsEnabled(x0) {
    return GLctx["isEnabled"](x0);
  }
  function _glIsVertexArray(array) {
    var vao = GL.vaos[array];
    if (!vao) return 0;
    return GLctx["isVertexArray"](vao);
  }
  function _glLinkProgram(program) {
    program = GL.programs[program];
    GLctx.linkProgram(program);
    program.uniformLocsById = 0;
    program.uniformSizeAndIdsByName = {};
    [program["vs"], program["fs"]].forEach(function (s) {
      Object.keys(s.explicitUniformLocations).forEach(function (
        shaderLocation
      ) {
        var loc = s.explicitUniformLocations[shaderLocation];
        program.uniformSizeAndIdsByName[shaderLocation] = [1, loc];
        program.uniformIdCounter = Math.max(program.uniformIdCounter, loc + 1);
      });
    });
    function copyKeys(dst, src) {
      Object.keys(src).forEach(function (key) {
        dst[key] = src[key];
      });
    }
    program.explicitUniformBindings = {};
    program.explicitSamplerBindings = {};
    [program["vs"], program["fs"]].forEach(function (s) {
      copyKeys(program.explicitUniformBindings, s.explicitUniformBindings);
      copyKeys(program.explicitSamplerBindings, s.explicitSamplerBindings);
    });
    program.explicitProgramBindingsApplied = 0;
  }
  function _glMapBufferRange(target, offset, length, access) {
    if (access != 26 && access != 10) {
      err(
        "glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER"
      );
      return 0;
    }
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
      GL.recordError(1280);
      err("GL_INVALID_ENUM in glMapBufferRange");
      return 0;
    }
    var mem = _malloc(length);
    if (!mem) return 0;
    GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)] = {
      offset: offset,
      length: length,
      mem: mem,
      access: access,
    };
    return mem;
  }
  function _glPixelStorei(pname, param) {
    if (pname == 3317) {
      GL.unpackAlignment = param;
    }
    GLctx.pixelStorei(pname, param);
  }
  function _glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1);
  }
  function _glProgramBinary(program, binaryFormat, binary, length) {
    GL.recordError(1280);
  }
  function _glProgramParameteri(program, pname, value) {
    GL.recordError(1280);
  }
  function _glReadBuffer(x0) {
    GLctx["readBuffer"](x0);
  }
  function computeUnpackAlignedImageSize(
    width,
    height,
    sizePerPixel,
    alignment
  ) {
    function roundedToNextMultipleOf(x, y) {
      return (x + y - 1) & -y;
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height * alignedRowSize;
  }
  function __colorChannelsInGlTextureFormat(format) {
    var colorChannels = {
      5: 3,
      6: 4,
      8: 2,
      29502: 3,
      29504: 4,
      26917: 2,
      26918: 2,
      29846: 3,
      29847: 4,
    };
    return colorChannels[format - 6402] || 1;
  }
  function heapObjectForWebGLType(type) {
    type -= 5120;
    if (type == 0) return HEAP8;
    if (type == 1) return HEAPU8;
    if (type == 2) return HEAP16;
    if (type == 4) return HEAP32;
    if (type == 6) return HEAPF32;
    if (
      type == 5 ||
      type == 28922 ||
      type == 28520 ||
      type == 30779 ||
      type == 30782
    )
      return HEAPU32;
    return HEAPU16;
  }
  function heapAccessShiftForWebGLHeap(heap) {
    return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
  }
  function emscriptenWebGLGetTexPixelData(
    type,
    format,
    width,
    height,
    pixels,
    internalFormat
  ) {
    var heap = heapObjectForWebGLType(type);
    var shift = heapAccessShiftForWebGLHeap(heap);
    var byteSize = 1 << shift;
    var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
    var bytes = computeUnpackAlignedImageSize(
      width,
      height,
      sizePerPixel,
      GL.unpackAlignment
    );
    return heap.subarray(pixels >> shift, (pixels + bytes) >> shift);
  }
  function _glReadPixels(x, y, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
      if (GLctx.currentPixelPackBufferBinding) {
        GLctx.readPixels(x, y, width, height, format, type, pixels);
      } else {
        var heap = heapObjectForWebGLType(type);
        GLctx.readPixels(
          x,
          y,
          width,
          height,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        );
      }
      return;
    }
    var pixelData = emscriptenWebGLGetTexPixelData(
      type,
      format,
      width,
      height,
      pixels,
      format
    );
    if (!pixelData) {
      GL.recordError(1280);
      return;
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData);
  }
  function _glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3);
  }
  function _glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
    GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4);
  }
  function _glSamplerParameteri(sampler, pname, param) {
    GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
  }
  function _glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3);
  }
  function find_closing_parens_index(arr, i, opening = "(", closing = ")") {
    for (var nesting = 0; i < arr.length; ++i) {
      if (arr[i] == opening) ++nesting;
      if (arr[i] == closing && --nesting == 0) {
        return i;
      }
    }
  }
  function preprocess_c_code(code) {
    var i = 0,
      len = code.length,
      out = "",
      stack = [1],
      defs = {
        defined: function (args) {
          return defs[args[0]] ? 1 : 0;
        },
        GL_FRAGMENT_PRECISION_HIGH: function () {
          return 1;
        },
      };
    function isWhitespace(str, i) {
      return !(str.charCodeAt(i) > 32);
    }
    function nextWhitespace(str, i) {
      while (!isWhitespace(str, i)) ++i;
      return i;
    }
    function classifyChar(str, idx) {
      var cc = str.charCodeAt(idx);
      if (cc > 32) {
        if (cc < 48) return 1;
        if (cc < 58) return 2;
        if (cc < 65) return 1;
        if (cc < 91 || cc == 95) return 3;
        if (cc < 97) return 1;
        if (cc < 123) return 3;
        return 1;
      }
      return cc < 33 ? 0 : 4;
    }
    function tokenize(exprString, keepWhitespace) {
      var out = [],
        len = exprString.length;
      for (var i = 0; i <= len; ++i) {
        var kind = classifyChar(exprString, i);
        if (kind == 2 || kind == 3) {
          for (var j = i + 1; j <= len; ++j) {
            var kind2 = classifyChar(exprString, j);
            if (kind2 != kind && (kind2 != 2 || kind != 3)) {
              out.push(exprString.substring(i, j));
              i = j - 1;
              break;
            }
          }
        } else if (kind == 1) {
          var op2 = exprString.substr(i, 2);
          if (["<=", ">=", "==", "!=", "&&", "||"].includes(op2)) {
            out.push(op2);
            ++i;
          } else {
            out.push(exprString[i]);
          }
        }
      }
      return out;
    }
    function expandMacros(str, lineStart, lineEnd) {
      if (lineEnd === undefined) lineEnd = str.length;
      var len = str.length;
      var out = "";
      for (var i = lineStart; i < lineEnd; ++i) {
        var kind = classifyChar(str, i);
        if (kind == 3) {
          for (var j = i + 1; j <= lineEnd; ++j) {
            var kind2 = classifyChar(str, j);
            if (kind2 != 2 && kind2 != 3) {
              var symbol = str.substring(i, j);
              var pp = defs[symbol];
              if (pp) {
                var expanded = str.substring(lineStart, i);
                if (pp.length && str[j] == "(") {
                  var closeParens = find_closing_parens_index(str, j);
                  expanded +=
                    pp(str.substring(j + 1, closeParens).split(",")) +
                    str.substring(closeParens + 1, lineEnd);
                } else {
                  expanded += pp() + str.substring(j, lineEnd);
                }
                return expandMacros(expanded, 0);
              } else {
                out += symbol;
                i = j - 1;
                break;
              }
            }
          }
        } else {
          out += str[i];
        }
      }
      return out;
    }
    function buildExprTree(tokens) {
      while (tokens.length > 1 || typeof tokens[0] != "function") {
        tokens = (function (tokens) {
          var i,
            j,
            p,
            operatorAndPriority = -2;
          for (j = 0; j < tokens.length; ++j) {
            if (
              (p = [
                "*",
                "/",
                "+",
                "-",
                "!",
                "<",
                "<=",
                ">",
                ">=",
                "==",
                "!=",
                "&&",
                "||",
                "(",
              ].indexOf(tokens[j])) > operatorAndPriority
            ) {
              i = j;
              operatorAndPriority = p;
            }
          }
          if (operatorAndPriority == 13) {
            var j = find_closing_parens_index(tokens, i);
            if (j) {
              tokens.splice(
                i,
                j + 1 - i,
                buildExprTree(tokens.slice(i + 1, j))
              );
              return tokens;
            }
          }
          if (operatorAndPriority == 4) {
            i = tokens.lastIndexOf("!");
            var innerExpr = buildExprTree(tokens.slice(i + 1, i + 2));
            tokens.splice(i, 2, function () {
              return !innerExpr();
            });
            return tokens;
          }
          if (operatorAndPriority >= 0) {
            var left = buildExprTree(tokens.slice(0, i));
            var right = buildExprTree(tokens.slice(i + 1));
            switch (tokens[i]) {
              case "&&":
                return [
                  function () {
                    return left() && right();
                  },
                ];
              case "||":
                return [
                  function () {
                    return left() || right();
                  },
                ];
              case "==":
                return [
                  function () {
                    return left() == right();
                  },
                ];
              case "!=":
                return [
                  function () {
                    return left() != right();
                  },
                ];
              case "<":
                return [
                  function () {
                    return left() < right();
                  },
                ];
              case "<=":
                return [
                  function () {
                    return left() <= right();
                  },
                ];
              case ">":
                return [
                  function () {
                    return left() > right();
                  },
                ];
              case ">=":
                return [
                  function () {
                    return left() >= right();
                  },
                ];
              case "+":
                return [
                  function () {
                    return left() + right();
                  },
                ];
              case "-":
                return [
                  function () {
                    return left() - right();
                  },
                ];
              case "*":
                return [
                  function () {
                    return left() * right();
                  },
                ];
              case "/":
                return [
                  function () {
                    return Math.floor(left() / right());
                  },
                ];
            }
          }
          var num = jstoi_q(tokens[i]);
          return [
            function () {
              return num;
            },
          ];
        })(tokens);
      }
      return tokens[0];
    }
    for (; i < len; ++i) {
      var lineStart = i;
      i = code.indexOf("\n", i);
      if (i < 0) i = len;
      for (var j = lineStart; j < i && isWhitespace(code, j); ++j);
      var thisLineIsInActivePreprocessingBlock = stack[stack.length - 1];
      if (code[j] != "#") {
        if (thisLineIsInActivePreprocessingBlock) {
          out += expandMacros(code, lineStart, i) + "\n";
        }
        continue;
      }
      var space = nextWhitespace(code, j);
      var directive = code.substring(j + 1, space);
      var expression = code.substring(space, i).trim();
      switch (directive) {
        case "if":
          var tokens = tokenize(expandMacros(expression, 0));
          var exprTree = buildExprTree(tokens);
          var evaluated = exprTree();
          stack.push(!!evaluated * stack[stack.length - 1]);
          break;
        case "ifdef":
          stack.push(!!defs[expression] * stack[stack.length - 1]);
          break;
        case "ifndef":
          stack.push(!defs[expression] * stack[stack.length - 1]);
          break;
        case "else":
          stack[stack.length - 1] = 1 - stack[stack.length - 1];
          break;
        case "endif":
          stack.pop();
          break;
        case "define":
          if (thisLineIsInActivePreprocessingBlock) {
            var macroStart = expression.indexOf("(");
            var firstWs = nextWhitespace(expression, 0);
            if (firstWs < macroStart) macroStart = 0;
            if (macroStart > 0) {
              var macroEnd = expression.indexOf(")", macroStart);
              let params = expression
                .substring(macroStart + 1, macroEnd)
                .split(",")
                .map((x) => x.trim());
              let value = tokenize(expression.substring(macroEnd + 1).trim());
              defs[expression.substring(0, macroStart)] = function (args) {
                var ret = "";
                value.forEach((x) => {
                  var argIndex = params.indexOf(x);
                  ret += argIndex >= 0 ? args[argIndex] : x;
                });
                return ret;
              };
            } else {
              let value = expandMacros(
                expression.substring(firstWs + 1).trim(),
                0
              );
              defs[expression.substring(0, firstWs)] = function () {
                return value;
              };
            }
          }
          break;
        case "undef":
          if (thisLineIsInActivePreprocessingBlock) delete defs[expression];
          break;
        default:
          if (
            directive != "version" &&
            directive != "pragma" &&
            directive != "extension"
          ) {
          }
          out += expandMacros(code, lineStart, i) + "\n";
      }
    }
    return out;
  }
  function remove_cpp_comments_in_shaders(code) {
    var i = 0,
      out = "",
      ch,
      next,
      len = code.length;
    for (; i < len; ++i) {
      ch = code[i];
      if (ch == "/") {
        next = code[i + 1];
        if (next == "/") {
          while (i < len && code[i + 1] != "\n") ++i;
        } else if (next == "*") {
          while (i < len && (code[i - 1] != "*" || code[i] != "/")) ++i;
        } else {
          out += ch;
        }
      } else {
        out += ch;
      }
    }
    return out;
  }
  function _glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    source = preprocess_c_code(remove_cpp_comments_in_shaders(source));
    var regex =
        /layout\s*\(\s*location\s*=\s*(-?\d+)\s*\)\s*(uniform\s+((lowp|mediump|highp)\s+)?\w+\s+(\w+))/g,
      explicitUniformLocations = {},
      match;
    while ((match = regex.exec(source))) {
      explicitUniformLocations[match[5]] = jstoi_q(match[1]);
      if (
        !(
          explicitUniformLocations[match[5]] >= 0 &&
          explicitUniformLocations[match[5]] < 1048576
        )
      ) {
        console.error(
          'Specified an out of range layout(location=x) directive "' +
            explicitUniformLocations[match[5]] +
            '"! (' +
            match[0] +
            ")"
        );
        GL.recordError(1281);
        return;
      }
    }
    source = source.replace(regex, "$2");
    GL.shaders[shader].explicitUniformLocations = explicitUniformLocations;
    var bindingRegex =
        /layout\s*\(.*?binding\s*=\s*(-?\d+).*?\)\s*uniform\s+(\w+)\s+(\w+)?/g,
      samplerBindings = {},
      uniformBindings = {},
      bindingMatch;
    while ((bindingMatch = bindingRegex.exec(source))) {
      var arrayLength = 1;
      for (
        var i = bindingMatch.index;
        i < source.length && source[i] != ";";
        ++i
      ) {
        if (source[i] == "[") {
          arrayLength = jstoi_q(source.slice(i + 1));
          break;
        }
        if (source[i] == "{")
          i = find_closing_parens_index(source, i, "{", "}") - 1;
      }
      var binding = jstoi_q(bindingMatch[1]);
      var bindingsType = 34930;
      if (bindingMatch[3] && bindingMatch[2].indexOf("sampler") != -1) {
        samplerBindings[bindingMatch[3]] = [binding, arrayLength];
      } else {
        bindingsType = 35374;
        uniformBindings[bindingMatch[2]] = [binding, arrayLength];
      }
      var numBindingPoints = GLctx.getParameter(bindingsType);
      if (!(binding >= 0 && binding + arrayLength <= numBindingPoints)) {
        console.error(
          'Specified an out of range layout(binding=x) directive "' +
            binding +
            '"! (' +
            bindingMatch[0] +
            "). Valid range is [0, " +
            numBindingPoints +
            "-1]"
        );
        GL.recordError(1281);
        return;
      }
    }
    source = source.replace(/layout\s*\(.*?binding\s*=\s*([-\d]+).*?\)/g, "");
    source = source.replace(
      /(layout\s*\((.*?)),\s*binding\s*=\s*([-\d]+)\)/g,
      "$1)"
    );
    source = source.replace(
      /layout\s*\(\s*binding\s*=\s*([-\d]+)\s*,(.*?)\)/g,
      "layout($2)"
    );
    GL.shaders[shader].explicitSamplerBindings = samplerBindings;
    GL.shaders[shader].explicitUniformBindings = uniformBindings;
    GLctx.shaderSource(GL.shaders[shader], source);
  }
  function _glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
  }
  function _glStencilMask(x0) {
    GLctx["stencilMask"](x0);
  }
  function _glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3);
  }
  function _glTexImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    pixels
  ) {
    if (GL.currentContext.version >= 2) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.texImage2D(
          target,
          level,
          internalFormat,
          width,
          height,
          border,
          format,
          type,
          pixels
        );
      } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx.texImage2D(
          target,
          level,
          internalFormat,
          width,
          height,
          border,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        );
      } else {
        GLctx.texImage2D(
          target,
          level,
          internalFormat,
          width,
          height,
          border,
          format,
          type,
          null
        );
      }
      return;
    }
    GLctx.texImage2D(
      target,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      pixels
        ? emscriptenWebGLGetTexPixelData(
            type,
            format,
            width,
            height,
            pixels,
            internalFormat
          )
        : null
    );
  }
  function _glTexImage3D(
    target,
    level,
    internalFormat,
    width,
    height,
    depth,
    border,
    format,
    type,
    pixels
  ) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["texImage3D"](
        target,
        level,
        internalFormat,
        width,
        height,
        depth,
        border,
        format,
        type,
        pixels
      );
    } else if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx["texImage3D"](
        target,
        level,
        internalFormat,
        width,
        height,
        depth,
        border,
        format,
        type,
        heap,
        pixels >> heapAccessShiftForWebGLHeap(heap)
      );
    } else {
      GLctx["texImage3D"](
        target,
        level,
        internalFormat,
        width,
        height,
        depth,
        border,
        format,
        type,
        null
      );
    }
  }
  function _glTexParameterf(x0, x1, x2) {
    GLctx["texParameterf"](x0, x1, x2);
  }
  function _glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2);
  }
  function _glTexParameteriv(target, pname, params) {
    var param = HEAP32[params >> 2];
    GLctx.texParameteri(target, pname, param);
  }
  function _glTexStorage2D(x0, x1, x2, x3, x4) {
    GLctx["texStorage2D"](x0, x1, x2, x3, x4);
  }
  function _glTexStorage3D(x0, x1, x2, x3, x4, x5) {
    GLctx["texStorage3D"](x0, x1, x2, x3, x4, x5);
  }
  function _glTexSubImage2D(
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    type,
    pixels
  ) {
    if (GL.currentContext.version >= 2) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.texSubImage2D(
          target,
          level,
          xoffset,
          yoffset,
          width,
          height,
          format,
          type,
          pixels
        );
      } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx.texSubImage2D(
          target,
          level,
          xoffset,
          yoffset,
          width,
          height,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        );
      } else {
        GLctx.texSubImage2D(
          target,
          level,
          xoffset,
          yoffset,
          width,
          height,
          format,
          type,
          null
        );
      }
      return;
    }
    var pixelData = null;
    if (pixels)
      pixelData = emscriptenWebGLGetTexPixelData(
        type,
        format,
        width,
        height,
        pixels,
        0
      );
    GLctx.texSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      pixelData
    );
  }
  function _glTexSubImage3D(
    target,
    level,
    xoffset,
    yoffset,
    zoffset,
    width,
    height,
    depth,
    format,
    type,
    pixels
  ) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx["texSubImage3D"](
        target,
        level,
        xoffset,
        yoffset,
        zoffset,
        width,
        height,
        depth,
        format,
        type,
        pixels
      );
    } else if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx["texSubImage3D"](
        target,
        level,
        xoffset,
        yoffset,
        zoffset,
        width,
        height,
        depth,
        format,
        type,
        heap,
        pixels >> heapAccessShiftForWebGLHeap(heap)
      );
    } else {
      GLctx["texSubImage3D"](
        target,
        level,
        xoffset,
        yoffset,
        zoffset,
        width,
        height,
        depth,
        format,
        type,
        null
      );
    }
  }
  var miniTempWebGLFloatBuffers = [];
  function _glUniform1fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform1fv(
        webglGetUniformLocation(location),
        HEAPF32,
        value >> 2,
        count
      );
      return;
    }
    if (count <= 288) {
      var view = miniTempWebGLFloatBuffers[count - 1];
      for (var i = 0; i < count; ++i) {
        view[i] = HEAPF32[(value + 4 * i) >> 2];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 4) >> 2);
    }
    GLctx.uniform1fv(webglGetUniformLocation(location), view);
  }
  function _glUniform1i(location, v0) {
    GLctx.uniform1i(webglGetUniformLocation(location), v0);
  }
  var __miniTempWebGLIntBuffers = [];
  function _glUniform1iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform1iv(
        webglGetUniformLocation(location),
        HEAP32,
        value >> 2,
        count
      );
      return;
    }
    if (count <= 288) {
      var view = __miniTempWebGLIntBuffers[count - 1];
      for (var i = 0; i < count; ++i) {
        view[i] = HEAP32[(value + 4 * i) >> 2];
      }
    } else {
      var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2);
    }
    GLctx.uniform1iv(webglGetUniformLocation(location), view);
  }
  function _glUniform1uiv(location, count, value) {
    GLctx.uniform1uiv(
      webglGetUniformLocation(location),
      HEAPU32,
      value >> 2,
      count
    );
  }
  function _glUniform2fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform2fv(
        webglGetUniformLocation(location),
        HEAPF32,
        value >> 2,
        count * 2
      );
      return;
    }
    if (count <= 144) {
      var view = miniTempWebGLFloatBuffers[2 * count - 1];
      for (var i = 0; i < 2 * count; i += 2) {
        view[i] = HEAPF32[(value + 4 * i) >> 2];
        view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 8) >> 2);
    }
    GLctx.uniform2fv(webglGetUniformLocation(location), view);
  }
  function _glUniform2iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform2iv(
        webglGetUniformLocation(location),
        HEAP32,
        value >> 2,
        count * 2
      );
      return;
    }
    if (count <= 144) {
      var view = __miniTempWebGLIntBuffers[2 * count - 1];
      for (var i = 0; i < 2 * count; i += 2) {
        view[i] = HEAP32[(value + 4 * i) >> 2];
        view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
      }
    } else {
      var view = HEAP32.subarray(value >> 2, (value + count * 8) >> 2);
    }
    GLctx.uniform2iv(webglGetUniformLocation(location), view);
  }
  function _glUniform2uiv(location, count, value) {
    GLctx.uniform2uiv(
      webglGetUniformLocation(location),
      HEAPU32,
      value >> 2,
      count * 2
    );
  }
  function _glUniform3fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform3fv(
        webglGetUniformLocation(location),
        HEAPF32,
        value >> 2,
        count * 3
      );
      return;
    }
    if (count <= 96) {
      var view = miniTempWebGLFloatBuffers[3 * count - 1];
      for (var i = 0; i < 3 * count; i += 3) {
        view[i] = HEAPF32[(value + 4 * i) >> 2];
        view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
        view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 12) >> 2);
    }
    GLctx.uniform3fv(webglGetUniformLocation(location), view);
  }
  function _glUniform3iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform3iv(
        webglGetUniformLocation(location),
        HEAP32,
        value >> 2,
        count * 3
      );
      return;
    }
    if (count <= 96) {
      var view = __miniTempWebGLIntBuffers[3 * count - 1];
      for (var i = 0; i < 3 * count; i += 3) {
        view[i] = HEAP32[(value + 4 * i) >> 2];
        view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
        view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
      }
    } else {
      var view = HEAP32.subarray(value >> 2, (value + count * 12) >> 2);
    }
    GLctx.uniform3iv(webglGetUniformLocation(location), view);
  }
  function _glUniform3uiv(location, count, value) {
    GLctx.uniform3uiv(
      webglGetUniformLocation(location),
      HEAPU32,
      value >> 2,
      count * 3
    );
  }
  function _glUniform4fv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform4fv(
        webglGetUniformLocation(location),
        HEAPF32,
        value >> 2,
        count * 4
      );
      return;
    }
    if (count <= 72) {
      var view = miniTempWebGLFloatBuffers[4 * count - 1];
      var heap = HEAPF32;
      value >>= 2;
      for (var i = 0; i < 4 * count; i += 4) {
        var dst = value + i;
        view[i] = heap[dst];
        view[i + 1] = heap[dst + 1];
        view[i + 2] = heap[dst + 2];
        view[i + 3] = heap[dst + 3];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2);
    }
    GLctx.uniform4fv(webglGetUniformLocation(location), view);
  }
  function _glUniform4iv(location, count, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniform4iv(
        webglGetUniformLocation(location),
        HEAP32,
        value >> 2,
        count * 4
      );
      return;
    }
    if (count <= 72) {
      var view = __miniTempWebGLIntBuffers[4 * count - 1];
      for (var i = 0; i < 4 * count; i += 4) {
        view[i] = HEAP32[(value + 4 * i) >> 2];
        view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
        view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
        view[i + 3] = HEAP32[(value + (4 * i + 12)) >> 2];
      }
    } else {
      var view = HEAP32.subarray(value >> 2, (value + count * 16) >> 2);
    }
    GLctx.uniform4iv(webglGetUniformLocation(location), view);
  }
  function _glUniform4uiv(location, count, value) {
    GLctx.uniform4uiv(
      webglGetUniformLocation(location),
      HEAPU32,
      value >> 2,
      count * 4
    );
  }
  function _glUniformBlockBinding(
    program,
    uniformBlockIndex,
    uniformBlockBinding
  ) {
    program = GL.programs[program];
    GLctx["uniformBlockBinding"](
      program,
      uniformBlockIndex,
      uniformBlockBinding
    );
  }
  function _glUniformMatrix3fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniformMatrix3fv(
        webglGetUniformLocation(location),
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 9
      );
      return;
    }
    if (count <= 32) {
      var view = miniTempWebGLFloatBuffers[9 * count - 1];
      for (var i = 0; i < 9 * count; i += 9) {
        view[i] = HEAPF32[(value + 4 * i) >> 2];
        view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
        view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
        view[i + 3] = HEAPF32[(value + (4 * i + 12)) >> 2];
        view[i + 4] = HEAPF32[(value + (4 * i + 16)) >> 2];
        view[i + 5] = HEAPF32[(value + (4 * i + 20)) >> 2];
        view[i + 6] = HEAPF32[(value + (4 * i + 24)) >> 2];
        view[i + 7] = HEAPF32[(value + (4 * i + 28)) >> 2];
        view[i + 8] = HEAPF32[(value + (4 * i + 32)) >> 2];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 36) >> 2);
    }
    GLctx.uniformMatrix3fv(
      webglGetUniformLocation(location),
      !!transpose,
      view
    );
  }
  function _glUniformMatrix4fv(location, count, transpose, value) {
    if (GL.currentContext.version >= 2) {
      GLctx.uniformMatrix4fv(
        webglGetUniformLocation(location),
        !!transpose,
        HEAPF32,
        value >> 2,
        count * 16
      );
      return;
    }
    if (count <= 18) {
      var view = miniTempWebGLFloatBuffers[16 * count - 1];
      var heap = HEAPF32;
      value >>= 2;
      for (var i = 0; i < 16 * count; i += 16) {
        var dst = value + i;
        view[i] = heap[dst];
        view[i + 1] = heap[dst + 1];
        view[i + 2] = heap[dst + 2];
        view[i + 3] = heap[dst + 3];
        view[i + 4] = heap[dst + 4];
        view[i + 5] = heap[dst + 5];
        view[i + 6] = heap[dst + 6];
        view[i + 7] = heap[dst + 7];
        view[i + 8] = heap[dst + 8];
        view[i + 9] = heap[dst + 9];
        view[i + 10] = heap[dst + 10];
        view[i + 11] = heap[dst + 11];
        view[i + 12] = heap[dst + 12];
        view[i + 13] = heap[dst + 13];
        view[i + 14] = heap[dst + 14];
        view[i + 15] = heap[dst + 15];
      }
    } else {
      var view = HEAPF32.subarray(value >> 2, (value + count * 64) >> 2);
    }
    GLctx.uniformMatrix4fv(
      webglGetUniformLocation(location),
      !!transpose,
      view
    );
  }
  function _glUnmapBuffer(target) {
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
      GL.recordError(1280);
      err("GL_INVALID_ENUM in glUnmapBuffer");
      return 0;
    }
    var buffer = emscriptenWebGLGetBufferBinding(target);
    var mapping = GL.mappedBuffers[buffer];
    if (!mapping) {
      GL.recordError(1282);
      err("buffer was never mapped in glUnmapBuffer");
      return 0;
    }
    GL.mappedBuffers[buffer] = null;
    if (!(mapping.access & 16))
      if (GL.currentContext.version >= 2) {
        GLctx.bufferSubData(
          target,
          mapping.offset,
          HEAPU8,
          mapping.mem,
          mapping.length
        );
      } else {
        GLctx.bufferSubData(
          target,
          mapping.offset,
          HEAPU8.subarray(mapping.mem, mapping.mem + mapping.length)
        );
      }
    _free(mapping.mem);
    return 1;
  }
  function webglApplyExplicitProgramBindings() {
    var p = GLctx.currentProgram;
    if (!p.explicitProgramBindingsApplied) {
      if (GL.currentContext.version >= 2) {
        Object.keys(p.explicitUniformBindings).forEach(function (ubo) {
          var bindings = p.explicitUniformBindings[ubo];
          for (var i = 0; i < bindings[1]; ++i) {
            var blockIndex = GLctx.getUniformBlockIndex(
              p,
              ubo + (bindings[1] > 1 ? "[" + i + "]" : "")
            );
            GLctx.uniformBlockBinding(p, blockIndex, bindings[0] + i);
          }
        });
      }
      Object.keys(p.explicitSamplerBindings).forEach(function (sampler) {
        var bindings = p.explicitSamplerBindings[sampler];
        for (var i = 0; i < bindings[1]; ++i) {
          GLctx.uniform1i(
            GLctx.getUniformLocation(p, sampler + (i ? "[" + i + "]" : "")),
            bindings[0] + i
          );
        }
      });
      p.explicitProgramBindingsApplied = 1;
    }
  }
  function _glUseProgram(program) {
    program = GL.programs[program];
    GLctx.useProgram(program);
    if ((GLctx.currentProgram = program)) {
      webglApplyExplicitProgramBindings();
    }
  }
  function _glValidateProgram(program) {
    GLctx.validateProgram(GL.programs[program]);
  }
  function _glVertexAttrib4f(x0, x1, x2, x3, x4) {
    GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4);
  }
  function _glVertexAttrib4fv(index, v) {
    GLctx.vertexAttrib4f(
      index,
      HEAPF32[v >> 2],
      HEAPF32[(v + 4) >> 2],
      HEAPF32[(v + 8) >> 2],
      HEAPF32[(v + 12) >> 2]
    );
  }
  function _glVertexAttribIPointer(index, size, type, stride, ptr) {
    var cb = GL.currentContext.clientBuffers[index];
    if (!GLctx.currentArrayBufferBinding) {
      cb.size = size;
      cb.type = type;
      cb.normalized = false;
      cb.stride = stride;
      cb.ptr = ptr;
      cb.clientside = true;
      cb.vertexAttribPointerAdaptor = function (
        index,
        size,
        type,
        normalized,
        stride,
        ptr
      ) {
        this.vertexAttribIPointer(index, size, type, stride, ptr);
      };
      return;
    }
    cb.clientside = false;
    GLctx["vertexAttribIPointer"](index, size, type, stride, ptr);
  }
  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    var cb = GL.currentContext.clientBuffers[index];
    if (!GLctx.currentArrayBufferBinding) {
      cb.size = size;
      cb.type = type;
      cb.normalized = normalized;
      cb.stride = stride;
      cb.ptr = ptr;
      cb.clientside = true;
      cb.vertexAttribPointerAdaptor = function (
        index,
        size,
        type,
        normalized,
        stride,
        ptr
      ) {
        this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
      };
      return;
    }
    cb.clientside = false;
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
  }
  function _glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3);
  }
  function _llvm_eh_typeid_for(type) {
    return type;
  }
  function _mktime(tmPtr) {
    _tzset();
    var date = new Date(
      HEAP32[(tmPtr + 20) >> 2] + 1900,
      HEAP32[(tmPtr + 16) >> 2],
      HEAP32[(tmPtr + 12) >> 2],
      HEAP32[(tmPtr + 8) >> 2],
      HEAP32[(tmPtr + 4) >> 2],
      HEAP32[tmPtr >> 2],
      0
    );
    var dst = HEAP32[(tmPtr + 32) >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    if (dst < 0) {
      HEAP32[(tmPtr + 32) >> 2] = Number(
        summerOffset != winterOffset && dstOffset == guessedOffset
      );
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
      var nonDstOffset = Math.max(winterOffset, summerOffset);
      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
    }
    HEAP32[(tmPtr + 24) >> 2] = date.getDay();
    var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
    HEAP32[(tmPtr + 28) >> 2] = yday;
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
    HEAP32[(tmPtr + 8) >> 2] = date.getHours();
    HEAP32[(tmPtr + 12) >> 2] = date.getDate();
    HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
    return (date.getTime() / 1e3) | 0;
  }
  function _setTempRet0(val) {
    setTempRet0(val);
  }
  function _sigaction(signum, act, oldact) {
    return 0;
  }
  function _sigemptyset(set) {
    HEAP32[set >> 2] = 0;
    return 0;
  }
  function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
  function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum;
  }
  var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
      var leap = __isLeapYear(newDate.getFullYear());
      var currentMonth = newDate.getMonth();
      var daysInCurrentMonth = (
        leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR
      )[currentMonth];
      if (days > daysInCurrentMonth - newDate.getDate()) {
        days -= daysInCurrentMonth - newDate.getDate() + 1;
        newDate.setDate(1);
        if (currentMonth < 11) {
          newDate.setMonth(currentMonth + 1);
        } else {
          newDate.setMonth(0);
          newDate.setFullYear(newDate.getFullYear() + 1);
        }
      } else {
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      }
    }
    return newDate;
  }
  function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[(tm + 40) >> 2];
    var date = {
      tm_sec: HEAP32[tm >> 2],
      tm_min: HEAP32[(tm + 4) >> 2],
      tm_hour: HEAP32[(tm + 8) >> 2],
      tm_mday: HEAP32[(tm + 12) >> 2],
      tm_mon: HEAP32[(tm + 16) >> 2],
      tm_year: HEAP32[(tm + 20) >> 2],
      tm_wday: HEAP32[(tm + 24) >> 2],
      tm_yday: HEAP32[(tm + 28) >> 2],
      tm_isdst: HEAP32[(tm + 32) >> 2],
      tm_gmtoff: HEAP32[(tm + 36) >> 2],
      tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
      "%c": "%a %b %d %H:%M:%S %Y",
      "%D": "%m/%d/%y",
      "%F": "%Y-%m-%d",
      "%h": "%b",
      "%r": "%I:%M:%S %p",
      "%R": "%H:%M",
      "%T": "%H:%M:%S",
      "%x": "%m/%d/%y",
      "%X": "%H:%M:%S",
      "%Ec": "%c",
      "%EC": "%C",
      "%Ex": "%m/%d/%y",
      "%EX": "%H:%M:%S",
      "%Ey": "%y",
      "%EY": "%Y",
      "%Od": "%d",
      "%Oe": "%e",
      "%OH": "%H",
      "%OI": "%I",
      "%Om": "%m",
      "%OM": "%M",
      "%OS": "%S",
      "%Ou": "%u",
      "%OU": "%U",
      "%OV": "%V",
      "%Ow": "%w",
      "%OW": "%W",
      "%Oy": "%y",
    };
    for (var rule in EXPANSION_RULES_1) {
      pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
    }
    var WEEKDAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    function leadingSomething(value, digits, character) {
      var str = typeof value === "number" ? value.toString() : value || "";
      while (str.length < digits) {
        str = character[0] + str;
      }
      return str;
    }
    function leadingNulls(value, digits) {
      return leadingSomething(value, digits, "0");
    }
    function compareByDay(date1, date2) {
      function sgn(value) {
        return value < 0 ? -1 : value > 0 ? 1 : 0;
      }
      var compare;
      if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
        if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
          compare = sgn(date1.getDate() - date2.getDate());
        }
      }
      return compare;
    }
    function getFirstWeekStartDate(janFourth) {
      switch (janFourth.getDay()) {
        case 0:
          return new Date(janFourth.getFullYear() - 1, 11, 29);
        case 1:
          return janFourth;
        case 2:
          return new Date(janFourth.getFullYear(), 0, 3);
        case 3:
          return new Date(janFourth.getFullYear(), 0, 2);
        case 4:
          return new Date(janFourth.getFullYear(), 0, 1);
        case 5:
          return new Date(janFourth.getFullYear() - 1, 11, 31);
        case 6:
          return new Date(janFourth.getFullYear() - 1, 11, 30);
      }
    }
    function getWeekBasedYear(date) {
      var thisDate = __addDays(
        new Date(date.tm_year + 1900, 0, 1),
        date.tm_yday
      );
      var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
      var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
      var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
      var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
      if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
        if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
          return thisDate.getFullYear() + 1;
        } else {
          return thisDate.getFullYear();
        }
      } else {
        return thisDate.getFullYear() - 1;
      }
    }
    var EXPANSION_RULES_2 = {
      "%a": function (date) {
        return WEEKDAYS[date.tm_wday].substring(0, 3);
      },
      "%A": function (date) {
        return WEEKDAYS[date.tm_wday];
      },
      "%b": function (date) {
        return MONTHS[date.tm_mon].substring(0, 3);
      },
      "%B": function (date) {
        return MONTHS[date.tm_mon];
      },
      "%C": function (date) {
        var year = date.tm_year + 1900;
        return leadingNulls((year / 100) | 0, 2);
      },
      "%d": function (date) {
        return leadingNulls(date.tm_mday, 2);
      },
      "%e": function (date) {
        return leadingSomething(date.tm_mday, 2, " ");
      },
      "%g": function (date) {
        return getWeekBasedYear(date).toString().substring(2);
      },
      "%G": function (date) {
        return getWeekBasedYear(date);
      },
      "%H": function (date) {
        return leadingNulls(date.tm_hour, 2);
      },
      "%I": function (date) {
        var twelveHour = date.tm_hour;
        if (twelveHour == 0) twelveHour = 12;
        else if (twelveHour > 12) twelveHour -= 12;
        return leadingNulls(twelveHour, 2);
      },
      "%j": function (date) {
        return leadingNulls(
          date.tm_mday +
            __arraySum(
              __isLeapYear(date.tm_year + 1900)
                ? __MONTH_DAYS_LEAP
                : __MONTH_DAYS_REGULAR,
              date.tm_mon - 1
            ),
          3
        );
      },
      "%m": function (date) {
        return leadingNulls(date.tm_mon + 1, 2);
      },
      "%M": function (date) {
        return leadingNulls(date.tm_min, 2);
      },
      "%n": function () {
        return "\n";
      },
      "%p": function (date) {
        if (date.tm_hour >= 0 && date.tm_hour < 12) {
          return "AM";
        } else {
          return "PM";
        }
      },
      "%S": function (date) {
        return leadingNulls(date.tm_sec, 2);
      },
      "%t": function () {
        return "\t";
      },
      "%u": function (date) {
        return date.tm_wday || 7;
      },
      "%U": function (date) {
        var janFirst = new Date(date.tm_year + 1900, 0, 1);
        var firstSunday =
          janFirst.getDay() === 0
            ? janFirst
            : __addDays(janFirst, 7 - janFirst.getDay());
        var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
        if (compareByDay(firstSunday, endDate) < 0) {
          var februaryFirstUntilEndMonth =
            __arraySum(
              __isLeapYear(endDate.getFullYear())
                ? __MONTH_DAYS_LEAP
                : __MONTH_DAYS_REGULAR,
              endDate.getMonth() - 1
            ) - 31;
          var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
          var days =
            firstSundayUntilEndJanuary +
            februaryFirstUntilEndMonth +
            endDate.getDate();
          return leadingNulls(Math.ceil(days / 7), 2);
        }
        return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
      },
      "%V": function (date) {
        var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
        var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        var endDate = __addDays(
          new Date(date.tm_year + 1900, 0, 1),
          date.tm_yday
        );
        if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
          return "53";
        }
        if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
          return "01";
        }
        var daysDifference;
        if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
          daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
        } else {
          daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
        }
        return leadingNulls(Math.ceil(daysDifference / 7), 2);
      },
      "%w": function (date) {
        return date.tm_wday;
      },
      "%W": function (date) {
        var janFirst = new Date(date.tm_year, 0, 1);
        var firstMonday =
          janFirst.getDay() === 1
            ? janFirst
            : __addDays(
                janFirst,
                janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1
              );
        var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
        if (compareByDay(firstMonday, endDate) < 0) {
          var februaryFirstUntilEndMonth =
            __arraySum(
              __isLeapYear(endDate.getFullYear())
                ? __MONTH_DAYS_LEAP
                : __MONTH_DAYS_REGULAR,
              endDate.getMonth() - 1
            ) - 31;
          var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
          var days =
            firstMondayUntilEndJanuary +
            februaryFirstUntilEndMonth +
            endDate.getDate();
          return leadingNulls(Math.ceil(days / 7), 2);
        }
        return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
      },
      "%y": function (date) {
        return (date.tm_year + 1900).toString().substring(2);
      },
      "%Y": function (date) {
        return date.tm_year + 1900;
      },
      "%z": function (date) {
        var off = date.tm_gmtoff;
        var ahead = off >= 0;
        off = Math.abs(off) / 60;
        off = (off / 60) * 100 + (off % 60);
        return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
      },
      "%Z": function (date) {
        return date.tm_zone;
      },
      "%%": function () {
        return "%";
      },
    };
    for (var rule in EXPANSION_RULES_2) {
      if (pattern.includes(rule)) {
        pattern = pattern.replace(
          new RegExp(rule, "g"),
          EXPANSION_RULES_2[rule](date)
        );
      }
    }
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
      return 0;
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1;
  }
  function _time(ptr) {
    var ret = (Date.now() / 1e3) | 0;
    if (ptr) {
      HEAP32[ptr >> 2] = ret;
    }
    return ret;
  }
  function setFileTime(path, time) {
    path = UTF8ToString(path);
    try {
      FS.utime(path, time, time);
      return 0;
    } catch (e) {
      if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
      setErrNo(e.errno);
      return -1;
    }
  }
  function _utime(path, times) {
    var time;
    if (times) {
      time = HEAP32[(times + 4) >> 2] * 1e3;
    } else {
      time = Date.now();
    }
    return setFileTime(path, time);
  }
  var FSNode = function (parent, name, mode, rdev) {
    if (!parent) {
      parent = this;
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292 | 73;
  var writeMode = 146;
  Object.defineProperties(FSNode.prototype, {
    read: {
      get: function () {
        return (this.mode & readMode) === readMode;
      },
      set: function (val) {
        val ? (this.mode |= readMode) : (this.mode &= ~readMode);
      },
    },
    write: {
      get: function () {
        return (this.mode & writeMode) === writeMode;
      },
      set: function (val) {
        val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
      },
    },
    isFolder: {
      get: function () {
        return FS.isDir(this.mode);
      },
    },
    isDevice: {
      get: function () {
        return FS.isChrdev(this.mode);
      },
    },
  });
  FS.FSNode = FSNode;
  FS.staticInit();
  Module["FS_createPath"] = FS.createPath;
  Module["FS_createDataFile"] = FS.createDataFile;
  Module["requestFullscreen"] = function Module_requestFullscreen(
    lockPointer,
    resizeCanvas
  ) {
    Browser.requestFullscreen(lockPointer, resizeCanvas);
  };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(
    func
  ) {
    Browser.requestAnimationFrame(func);
  };
  Module["setCanvasSize"] = function Module_setCanvasSize(
    width,
    height,
    noUpdates
  ) {
    Browser.setCanvasSize(width, height, noUpdates);
  };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause();
  };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume();
  };
  Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia();
  };
  Module["createContext"] = function Module_createContext(
    canvas,
    useWebGL,
    setInModule,
    webGLContextAttributes
  ) {
    return Browser.createContext(
      canvas,
      useWebGL,
      setInModule,
      webGLContextAttributes
    );
  };
  var GLctx;
  for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
  var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
  for (var i = 0; i < 288; ++i) {
    miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(
      0,
      i + 1
    );
  }
  var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
  for (var i = 0; i < 288; ++i) {
    __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(
      0,
      i + 1
    );
  }
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(
      stringy,
      u8array,
      0,
      u8array.length
    );
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var asmLibraryArg = {
    Ma: _ClickedBoolTestButton,
    Na: _ClickedNumberTestButton,
    mc: _ClickedNumbersTestButton,
    lc: _ClickedObjectTestButton,
    nc: _ClickedStringTestButton,
    Oa: _ClickedTestButton,
    $d: _JS_Accelerometer_IsRunning,
    nb: _JS_Accelerometer_Start,
    mb: _JS_Accelerometer_Stop,
    de: _JS_Cursor_SetImage,
    Ga: _JS_Cursor_SetShow,
    sa: _JS_DOM_MapViewportCoordinateToElementLocalCoordinate,
    Ed: _JS_DOM_UnityCanvasSelector,
    xd: _JS_FileSystem_Initialize,
    T: _JS_FileSystem_Sync,
    be: _JS_Focus_Window,
    Zd: _JS_GravitySensor_IsRunning,
    jb: _JS_GravitySensor_Start,
    ib: _JS_GravitySensor_Stop,
    Xd: _JS_Gyroscope_IsRunning,
    hb: _JS_Gyroscope_Start,
    gb: _JS_Gyroscope_Stop,
    _d: _JS_LinearAccelerationSensor_IsRunning,
    lb: _JS_LinearAccelerationSensor_Start,
    kb: _JS_LinearAccelerationSensor_Stop,
    og: _JS_Log_Dump,
    Jd: _JS_Log_StackTrace,
    Qd: _JS_MobileKeybard_GetIgnoreBlurEvent,
    R: _JS_MobileKeyboard_GetKeyboardStatus,
    _a: _JS_MobileKeyboard_GetText,
    Gd: _JS_MobileKeyboard_GetTextSelection,
    X: _JS_MobileKeyboard_Hide,
    Hd: _JS_MobileKeyboard_SetCharacterLimit,
    Id: _JS_MobileKeyboard_SetText,
    Fd: _JS_MobileKeyboard_SetTextSelection,
    $a: _JS_MobileKeyboard_Show,
    ae: _JS_OrientationSensor_IsRunning,
    qb: _JS_OrientationSensor_Start,
    pb: _JS_OrientationSensor_Stop,
    ub: _JS_RequestDeviceSensorPermissionsOnTouch,
    Ad: _JS_RunQuitCallbacks,
    Wd: _JS_ScreenOrientation_DeInit,
    ce: _JS_ScreenOrientation_Init,
    S: _JS_ScreenOrientation_Lock,
    vb: _JS_Sound_ResumeIfNeeded,
    Y: _JS_SystemInfo_GetCanvasClientSize,
    Hb: _JS_SystemInfo_GetDocumentURL,
    Za: _JS_SystemInfo_GetGPUInfo,
    fb: _JS_SystemInfo_GetMatchWebGLToCanvasSize,
    ab: _JS_SystemInfo_GetMemory,
    bb: _JS_SystemInfo_GetOS,
    db: _JS_SystemInfo_GetPreferredDevicePixelRatio,
    Ld: _JS_SystemInfo_GetScreenSize,
    ee: _JS_SystemInfo_HasAstcHdr,
    cb: _JS_SystemInfo_HasCursorLock,
    Vd: _JS_SystemInfo_HasFullscreen,
    ba: _JS_SystemInfo_HasWebGL,
    Dd: _JS_UnityEngineShouldQuit,
    m: ___cxa_allocate_exception,
    i: ___cxa_begin_catch,
    l: ___cxa_end_catch,
    e: ___cxa_find_matching_catch_2,
    a: ___cxa_find_matching_catch_3,
    oc: ___cxa_find_matching_catch_4,
    za: ___cxa_free_exception,
    pc: ___cxa_rethrow,
    K: ___cxa_throw,
    Dc: ___gmtime_r,
    Ec: ___localtime_r,
    f: ___resumeException,
    Jc: ___sys__newselect,
    Ac: ___sys_access,
    yc: ___sys_chmod,
    Va: ___sys_fcntl64,
    pd: ___sys_fstat64,
    vc: ___sys_getcwd,
    sc: ___sys_getdents64,
    Kc: ___sys_getrusage,
    ne: ___sys_getuid32,
    Ua: ___sys_ioctl,
    zc: ___sys_lstat64,
    uc: ___sys_mkdir,
    Ic: ___sys_mmap2,
    Bc: ___sys_munmap,
    qa: ___sys_open,
    rg: ___sys_readlink,
    wc: ___sys_rename,
    tc: ___sys_rmdir,
    Ya: ___sys_stat64,
    ke: ___sys_statfs64,
    le: ___sys_truncate64,
    xc: ___sys_unlink,
    t: _abort,
    D: _clock,
    Gc: _clock_getres,
    Fc: _clock_gettime,
    Cc: _difftime,
    Lc: _dlclose,
    W: _dlerror,
    Xa: _dlopen,
    Mc: _dlsym,
    Gb: _emscripten_asm_const_int_sync_on_main_thread,
    Bd: _emscripten_cancel_main_loop,
    zd: _emscripten_clear_interval,
    Td: _emscripten_exit_fullscreen,
    Md: _emscripten_exit_pointerlock,
    Kd: _emscripten_get_canvas_element_size,
    Sd: _emscripten_get_fullscreen_status,
    rb: _emscripten_get_gamepad_status,
    Hc: _emscripten_get_heap_max,
    B: _emscripten_get_now,
    sb: _emscripten_get_num_gamepads,
    Cd: _emscripten_html5_remove_all_event_listeners,
    ge: _emscripten_is_webgl_context_lost,
    y: _emscripten_log,
    vg: _emscripten_memcpy_big,
    Ud: _emscripten_request_fullscreen,
    Nd: _emscripten_request_pointerlock,
    wg: _emscripten_resize_heap,
    tb: _emscripten_sample_gamepad_data,
    eb: _emscripten_set_blur_callback_on_thread,
    ra: _emscripten_set_canvas_element_size,
    Od: _emscripten_set_focus_callback_on_thread,
    Pd: _emscripten_set_fullscreenchange_callback_on_thread,
    xb: _emscripten_set_gamepadconnected_callback_on_thread,
    wb: _emscripten_set_gamepaddisconnected_callback_on_thread,
    wd: _emscripten_set_interval,
    _: _emscripten_set_keydown_callback_on_thread,
    Z: _emscripten_set_keypress_callback_on_thread,
    ua: _emscripten_set_keyup_callback_on_thread,
    vd: _emscripten_set_main_loop,
    yd: _emscripten_set_main_loop_timing,
    Eb: _emscripten_set_mousedown_callback_on_thread,
    Db: _emscripten_set_mousemove_callback_on_thread,
    Fb: _emscripten_set_mouseup_callback_on_thread,
    yb: _emscripten_set_touchcancel_callback_on_thread,
    Ab: _emscripten_set_touchend_callback_on_thread,
    zb: _emscripten_set_touchmove_callback_on_thread,
    Bb: _emscripten_set_touchstart_callback_on_thread,
    Cb: _emscripten_set_wheel_callback_on_thread,
    pg: _emscripten_thread_sleep,
    ie: _emscripten_webgl_create_context,
    he: _emscripten_webgl_destroy_context,
    $: _emscripten_webgl_enable_extension,
    fe: _emscripten_webgl_get_current_context,
    je: _emscripten_webgl_init_context_attributes,
    aa: _emscripten_webgl_make_context_current,
    uf: _environ_get,
    Cf: _environ_sizes_get,
    w: _exit,
    P: _fd_close,
    Wa: _fd_fdstat_get,
    Ta: _fd_read,
    ud: _fd_seek,
    ta: _fd_write,
    ca: _flock,
    b: _getTempRet0,
    me: _getpwuid,
    pa: _gettimeofday,
    hg: _glActiveTexture,
    eg: _glAttachShader,
    Ob: _glBeginQuery,
    ja: _glBindAttribLocation,
    dg: _glBindBuffer,
    Be: _glBindBufferBase,
    ye: _glBindBufferRange,
    ag: _glBindFramebuffer,
    bg: _glBindRenderbuffer,
    ue: _glBindSampler,
    cg: _glBindTexture,
    Se: _glBindVertexArray,
    ec: _glBlendEquation,
    fc: _glBlendEquationSeparate,
    gc: _glBlendFuncSeparate,
    Je: _glBlitFramebuffer,
    _f: _glBufferData,
    $f: _glBufferSubData,
    Zf: _glCheckFramebufferStatus,
    Vf: _glClear,
    qe: _glClearBufferfi,
    pe: _glClearBufferfv,
    oe: _glClearBufferuiv,
    Wf: _glClearColor,
    Xf: _glClearDepthf,
    Yf: _glClearStencil,
    Nc: _glClientWaitSync,
    Fa: _glColorMask,
    Uf: _glCompileShader,
    Sf: _glCompressedTexImage2D,
    Oe: _glCompressedTexImage3D,
    Tf: _glCompressedTexSubImage2D,
    Re: _glCompressedTexSubImage3D,
    De: _glCopyBufferSubData,
    Rf: _glCopyTexImage2D,
    dc: _glCopyTexSubImage2D,
    Qf: _glCreateProgram,
    Pf: _glCreateShader,
    Of: _glCullFace,
    Nf: _glDeleteBuffers,
    Mf: _glDeleteFramebuffers,
    Lf: _glDeleteProgram,
    Nb: _glDeleteQueries,
    Kf: _glDeleteRenderbuffers,
    te: _glDeleteSamplers,
    Jf: _glDeleteShader,
    Jb: _glDeleteSync,
    If: _glDeleteTextures,
    Ue: _glDeleteVertexArrays,
    ia: _glDepthFunc,
    ha: _glDepthMask,
    Hf: _glDetachShader,
    Gf: _glDisable,
    Ff: _glDisableVertexAttribArray,
    Bf: _glDrawArrays,
    Fe: _glDrawArraysInstanced,
    Ce: _glDrawBuffers,
    Df: _glDrawElements,
    Ee: _glDrawElementsInstanced,
    Ef: _glEnable,
    Af: _glEnableVertexAttribArray,
    Pb: _glEndQuery,
    Ib: _glFenceSync,
    xf: _glFinish,
    yf: _glFlush,
    Ie: _glFlushMappedBufferRange,
    F: _glFramebufferRenderbuffer,
    E: _glFramebufferTexture2D,
    da: _glFramebufferTextureLayer,
    ga: _glFrontFace,
    wf: _glGenBuffers,
    rf: _glGenFramebuffers,
    Mb: _glGenQueries,
    sf: _glGenRenderbuffers,
    se: _glGenSamplers,
    vf: _glGenTextures,
    Ve: _glGenVertexArrays,
    tf: _glGenerateMipmap,
    ng: _glGetActiveAttrib,
    Ea: _glGetActiveUniform,
    wa: _glGetActiveUniformBlockName,
    N: _glGetActiveUniformBlockiv,
    M: _glGetActiveUniformsiv,
    mg: _glGetAttribLocation,
    qf: _glGetError,
    pf: _glGetFramebufferAttachmentParameteriv,
    gg: _glGetIntegeri_v,
    ka: _glGetIntegerv,
    we: _glGetInternalformativ,
    Kb: _glGetProgramBinary,
    jg: _glGetProgramInfoLog,
    I: _glGetProgramiv,
    Qb: _glGetQueryObjectuiv,
    We: _glGetQueryiv,
    zf: _glGetRenderbufferParameteriv,
    nf: _glGetShaderInfoLog,
    cc: _glGetShaderPrecisionFormat,
    of: _glGetShaderSource,
    ig: _glGetShaderiv,
    mf: _glGetString,
    Le: _glGetStringi,
    lf: _glGetTexParameteriv,
    xe: _glGetUniformBlockIndex,
    va: _glGetUniformIndices,
    U: _glGetUniformLocation,
    bc: _glGetUniformiv,
    lg: _glGetVertexAttribiv,
    ya: _glInvalidateFramebuffer,
    fg: _glIsEnabled,
    Te: _glIsVertexArray,
    jf: _glLinkProgram,
    Ge: _glMapBufferRange,
    kf: _glPixelStorei,
    ac: _glPolygonOffset,
    Lb: _glProgramBinary,
    re: _glProgramParameteri,
    Ae: _glReadBuffer,
    Q: _glReadPixels,
    hf: _glRenderbufferStorage,
    Ke: _glRenderbufferStorageMultisample,
    ve: _glSamplerParameteri,
    Da: _glScissor,
    ff: _glShaderSource,
    gf: _glStencilFuncSeparate,
    df: _glStencilMask,
    ef: _glStencilOpSeparate,
    bf: _glTexImage2D,
    Pe: _glTexImage3D,
    cf: _glTexParameterf,
    Ca: _glTexParameteri,
    af: _glTexParameteriv,
    Me: _glTexStorage2D,
    Ne: _glTexStorage3D,
    $e: _glTexSubImage2D,
    Qe: _glTexSubImage3D,
    Rb: _glUniform1fv,
    ea: _glUniform1i,
    Sb: _glUniform1iv,
    Tb: _glUniform1uiv,
    Ub: _glUniform2fv,
    Vb: _glUniform2iv,
    Wb: _glUniform2uiv,
    Ba: _glUniform3fv,
    Xb: _glUniform3iv,
    Yb: _glUniform3uiv,
    O: _glUniform4fv,
    Zb: _glUniform4iv,
    _b: _glUniform4uiv,
    xa: _glUniformBlockBinding,
    $b: _glUniformMatrix3fv,
    fa: _glUniformMatrix4fv,
    He: _glUnmapBuffer,
    Xe: _glUseProgram,
    kg: _glValidateProgram,
    Ye: _glVertexAttrib4f,
    Ze: _glVertexAttrib4fv,
    ze: _glVertexAttribIPointer,
    _e: _glVertexAttribPointer,
    Aa: _glViewport,
    tg: invoke_ddiii,
    qg: invoke_dii,
    ob: invoke_diii,
    Ia: invoke_fffi,
    Ka: invoke_fi,
    z: invoke_fiii,
    sg: invoke_fiiii,
    x: invoke_i,
    d: invoke_ii,
    c: invoke_iii,
    Ja: invoke_iiifi,
    k: invoke_iiii,
    ug: invoke_iiiidii,
    r: invoke_iiiii,
    s: invoke_iiiiii,
    u: invoke_iiiiiii,
    L: invoke_iiiiiiii,
    La: invoke_iiiiiiiii,
    Ha: invoke_iiiiiiiiii,
    Pa: invoke_iiiiiiiiiii,
    rc: invoke_iiiiiiiiiiii,
    ed: invoke_iiiiiiiiiji,
    gd: invoke_iiiijii,
    td: invoke_iiij,
    rd: invoke_iiijiii,
    sd: invoke_iij,
    Pc: invoke_iiji,
    Wc: invoke_iijii,
    jd: invoke_iijji,
    id: invoke_iji,
    ld: invoke_ijji,
    nd: invoke_j,
    od: invoke_ji,
    qd: invoke_jii,
    md: invoke_jiii,
    Zc: invoke_jiiiii,
    Yc: invoke_jiiiiiiiiii,
    Oc: invoke_jiiji,
    kd: invoke_jiji,
    _c: invoke_jijiii,
    Xc: invoke_jijj,
    hd: invoke_jjji,
    g: invoke_v,
    o: invoke_vi,
    kc: invoke_vidi,
    A: invoke_vifi,
    p: invoke_vii,
    Rd: invoke_viid,
    la: invoke_viidi,
    Yd: invoke_viif,
    H: invoke_viiff,
    jc: invoke_viiffi,
    J: invoke_viifi,
    ic: invoke_viifii,
    h: invoke_viii,
    n: invoke_viiii,
    hc: invoke_viiiifi,
    q: invoke_viiiii,
    v: invoke_viiiiii,
    C: invoke_viiiiiii,
    V: invoke_viiiiiiii,
    qc: invoke_viiiiiiiiii,
    cd: invoke_viiiiij,
    bd: invoke_viiij,
    fd: invoke_viiiji,
    $c: invoke_viij,
    Qc: invoke_viiji,
    Sc: invoke_viijiiiiii,
    Rc: invoke_viji,
    ad: invoke_vijii,
    Vc: invoke_vijiii,
    dd: invoke_vji,
    Tc: invoke_vjiiiii,
    Uc: invoke_vjjjiiii,
    j: _llvm_eh_typeid_for,
    Sa: _mktime,
    G: _setTempRet0,
    na: _sigaction,
    oa: _sigemptyset,
    ma: _strftime,
    Ra: _time,
    Qa: _utime,
  };
  var asm = createWasm();
  var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
    return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
      Module["asm"]["yg"]).apply(null, arguments);
  });
  var _SendMessageFloat = (Module["_SendMessageFloat"] = function () {
    return (_SendMessageFloat = Module["_SendMessageFloat"] =
      Module["asm"]["zg"]).apply(null, arguments);
  });
  var _SendMessageString = (Module["_SendMessageString"] = function () {
    return (_SendMessageString = Module["_SendMessageString"] =
      Module["asm"]["Ag"]).apply(null, arguments);
  });
  var _SendMessage = (Module["_SendMessage"] = function () {
    return (_SendMessage = Module["_SendMessage"] = Module["asm"]["Bg"]).apply(
      null,
      arguments
    );
  });
  var _SetFullscreen = (Module["_SetFullscreen"] = function () {
    return (_SetFullscreen = Module["_SetFullscreen"] =
      Module["asm"]["Cg"]).apply(null, arguments);
  });
  var _main = (Module["_main"] = function () {
    return (_main = Module["_main"] = Module["asm"]["Dg"]).apply(
      null,
      arguments
    );
  });
  var ___errno_location = (Module["___errno_location"] = function () {
    return (___errno_location = Module["___errno_location"] =
      Module["asm"]["Eg"]).apply(null, arguments);
  });
  var __get_tzname = (Module["__get_tzname"] = function () {
    return (__get_tzname = Module["__get_tzname"] = Module["asm"]["Fg"]).apply(
      null,
      arguments
    );
  });
  var __get_daylight = (Module["__get_daylight"] = function () {
    return (__get_daylight = Module["__get_daylight"] =
      Module["asm"]["Gg"]).apply(null, arguments);
  });
  var __get_timezone = (Module["__get_timezone"] = function () {
    return (__get_timezone = Module["__get_timezone"] =
      Module["asm"]["Hg"]).apply(null, arguments);
  });
  var stackSave = (Module["stackSave"] = function () {
    return (stackSave = Module["stackSave"] = Module["asm"]["Ig"]).apply(
      null,
      arguments
    );
  });
  var stackRestore = (Module["stackRestore"] = function () {
    return (stackRestore = Module["stackRestore"] = Module["asm"]["Jg"]).apply(
      null,
      arguments
    );
  });
  var stackAlloc = (Module["stackAlloc"] = function () {
    return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Kg"]).apply(
      null,
      arguments
    );
  });
  var _setThrew = (Module["_setThrew"] = function () {
    return (_setThrew = Module["_setThrew"] = Module["asm"]["Lg"]).apply(
      null,
      arguments
    );
  });
  var ___cxa_can_catch = (Module["___cxa_can_catch"] = function () {
    return (___cxa_can_catch = Module["___cxa_can_catch"] =
      Module["asm"]["Mg"]).apply(null, arguments);
  });
  var ___cxa_is_pointer_type = (Module["___cxa_is_pointer_type"] = function () {
    return (___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] =
      Module["asm"]["Ng"]).apply(null, arguments);
  });
  var _malloc = (Module["_malloc"] = function () {
    return (_malloc = Module["_malloc"] = Module["asm"]["Og"]).apply(
      null,
      arguments
    );
  });
  var _free = (Module["_free"] = function () {
    return (_free = Module["_free"] = Module["asm"]["Pg"]).apply(
      null,
      arguments
    );
  });
  var _memalign = (Module["_memalign"] = function () {
    return (_memalign = Module["_memalign"] = Module["asm"]["Qg"]).apply(
      null,
      arguments
    );
  });
  var _memset = (Module["_memset"] = function () {
    return (_memset = Module["_memset"] = Module["asm"]["Rg"]).apply(
      null,
      arguments
    );
  });
  var _strlen = (Module["_strlen"] = function () {
    return (_strlen = Module["_strlen"] = Module["asm"]["Sg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_vii = (Module["dynCall_vii"] = function () {
    return (dynCall_vii = Module["dynCall_vii"] = Module["asm"]["Ug"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iii = (Module["dynCall_iii"] = function () {
    return (dynCall_iii = Module["dynCall_iii"] = Module["asm"]["Vg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_ii = (Module["dynCall_ii"] = function () {
    return (dynCall_ii = Module["dynCall_ii"] = Module["asm"]["Wg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiii = (Module["dynCall_iiii"] = function () {
    return (dynCall_iiii = Module["dynCall_iiii"] = Module["asm"]["Xg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jiji = (Module["dynCall_jiji"] = function () {
    return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["Yg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_vi = (Module["dynCall_vi"] = function () {
    return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["Zg"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiiii = (Module["dynCall_iiiii"] = function () {
    return (dynCall_iiiii = Module["dynCall_iiiii"] =
      Module["asm"]["_g"]).apply(null, arguments);
  });
  var dynCall_viii = (Module["dynCall_viii"] = function () {
    return (dynCall_viii = Module["dynCall_viii"] = Module["asm"]["$g"]).apply(
      null,
      arguments
    );
  });
  var dynCall_i = (Module["dynCall_i"] = function () {
    return (dynCall_i = Module["dynCall_i"] = Module["asm"]["ah"]).apply(
      null,
      arguments
    );
  });
  var dynCall_v = (Module["dynCall_v"] = function () {
    return (dynCall_v = Module["dynCall_v"] = Module["asm"]["bh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viiiiii = (Module["dynCall_viiiiii"] = function () {
    return (dynCall_viiiiii = Module["dynCall_viiiiii"] =
      Module["asm"]["ch"]).apply(null, arguments);
  });
  var dynCall_viiiii = (Module["dynCall_viiiii"] = function () {
    return (dynCall_viiiii = Module["dynCall_viiiii"] =
      Module["asm"]["dh"]).apply(null, arguments);
  });
  var dynCall_viiii = (Module["dynCall_viiii"] = function () {
    return (dynCall_viiii = Module["dynCall_viiii"] =
      Module["asm"]["eh"]).apply(null, arguments);
  });
  var dynCall_iiiiii = (Module["dynCall_iiiiii"] = function () {
    return (dynCall_iiiiii = Module["dynCall_iiiiii"] =
      Module["asm"]["fh"]).apply(null, arguments);
  });
  var dynCall_iiij = (Module["dynCall_iiij"] = function () {
    return (dynCall_iiij = Module["dynCall_iiij"] = Module["asm"]["gh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiiiiiii = (Module["dynCall_iiiiiiii"] = function () {
    return (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] =
      Module["asm"]["hh"]).apply(null, arguments);
  });
  var dynCall_iiijiii = (Module["dynCall_iiijiii"] = function () {
    return (dynCall_iiijiii = Module["dynCall_iiijiii"] =
      Module["asm"]["ih"]).apply(null, arguments);
  });
  var dynCall_iij = (Module["dynCall_iij"] = function () {
    return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["jh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiiiiii = (Module["dynCall_iiiiiii"] = function () {
    return (dynCall_iiiiiii = Module["dynCall_iiiiiii"] =
      Module["asm"]["kh"]).apply(null, arguments);
  });
  var dynCall_jii = (Module["dynCall_jii"] = function () {
    return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["lh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viiiiiii = (Module["dynCall_viiiiiii"] = function () {
    return (dynCall_viiiiiii = Module["dynCall_viiiiiii"] =
      Module["asm"]["mh"]).apply(null, arguments);
  });
  var dynCall_iiiijii = (Module["dynCall_iiiijii"] = function () {
    return (dynCall_iiiijii = Module["dynCall_iiiijii"] =
      Module["asm"]["nh"]).apply(null, arguments);
  });
  var dynCall_iiiiiiiii = (Module["dynCall_iiiiiiiii"] = function () {
    return (dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] =
      Module["asm"]["oh"]).apply(null, arguments);
  });
  var dynCall_diii = (Module["dynCall_diii"] = function () {
    return (dynCall_diii = Module["dynCall_diii"] = Module["asm"]["ph"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viidi = (Module["dynCall_viidi"] = function () {
    return (dynCall_viidi = Module["dynCall_viidi"] =
      Module["asm"]["qh"]).apply(null, arguments);
  });
  var dynCall_vidi = (Module["dynCall_vidi"] = function () {
    return (dynCall_vidi = Module["dynCall_vidi"] = Module["asm"]["rh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_ji = (Module["dynCall_ji"] = function () {
    return (dynCall_ji = Module["dynCall_ji"] = Module["asm"]["sh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viiffi = (Module["dynCall_viiffi"] = function () {
    return (dynCall_viiffi = Module["dynCall_viiffi"] =
      Module["asm"]["th"]).apply(null, arguments);
  });
  var dynCall_vifi = (Module["dynCall_vifi"] = function () {
    return (dynCall_vifi = Module["dynCall_vifi"] = Module["asm"]["uh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viifi = (Module["dynCall_viifi"] = function () {
    return (dynCall_viifi = Module["dynCall_viifi"] =
      Module["asm"]["vh"]).apply(null, arguments);
  });
  var dynCall_viiiji = (Module["dynCall_viiiji"] = function () {
    return (dynCall_viiiji = Module["dynCall_viiiji"] =
      Module["asm"]["wh"]).apply(null, arguments);
  });
  var dynCall_viiiiiiiiii = (Module["dynCall_viiiiiiiiii"] = function () {
    return (dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] =
      Module["asm"]["xh"]).apply(null, arguments);
  });
  var dynCall_iiiiiiiiiji = (Module["dynCall_iiiiiiiiiji"] = function () {
    return (dynCall_iiiiiiiiiji = Module["dynCall_iiiiiiiiiji"] =
      Module["asm"]["yh"]).apply(null, arguments);
  });
  var dynCall_vji = (Module["dynCall_vji"] = function () {
    return (dynCall_vji = Module["dynCall_vji"] = Module["asm"]["zh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiii"] = function () {
    return (dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] =
      Module["asm"]["Ah"]).apply(null, arguments);
  });
  var dynCall_fiii = (Module["dynCall_fiii"] = function () {
    return (dynCall_fiii = Module["dynCall_fiii"] = Module["asm"]["Bh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_fi = (Module["dynCall_fi"] = function () {
    return (dynCall_fi = Module["dynCall_fi"] = Module["asm"]["Ch"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iiifi = (Module["dynCall_iiifi"] = function () {
    return (dynCall_iiifi = Module["dynCall_iiifi"] =
      Module["asm"]["Dh"]).apply(null, arguments);
  });
  var dynCall_fffi = (Module["dynCall_fffi"] = function () {
    return (dynCall_fffi = Module["dynCall_fffi"] = Module["asm"]["Eh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viifii = (Module["dynCall_viifii"] = function () {
    return (dynCall_viifii = Module["dynCall_viifii"] =
      Module["asm"]["Fh"]).apply(null, arguments);
  });
  var dynCall_viiiiij = (Module["dynCall_viiiiij"] = function () {
    return (dynCall_viiiiij = Module["dynCall_viiiiij"] =
      Module["asm"]["Gh"]).apply(null, arguments);
  });
  var dynCall_viiij = (Module["dynCall_viiij"] = function () {
    return (dynCall_viiij = Module["dynCall_viiij"] =
      Module["asm"]["Hh"]).apply(null, arguments);
  });
  var dynCall_viiiifi = (Module["dynCall_viiiifi"] = function () {
    return (dynCall_viiiifi = Module["dynCall_viiiifi"] =
      Module["asm"]["Ih"]).apply(null, arguments);
  });
  var dynCall_iiiidii = (Module["dynCall_iiiidii"] = function () {
    return (dynCall_iiiidii = Module["dynCall_iiiidii"] =
      Module["asm"]["Jh"]).apply(null, arguments);
  });
  var dynCall_iijji = (Module["dynCall_iijji"] = function () {
    return (dynCall_iijji = Module["dynCall_iijji"] =
      Module["asm"]["Kh"]).apply(null, arguments);
  });
  var dynCall_iiiiiiiiii = (Module["dynCall_iiiiiiiiii"] = function () {
    return (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] =
      Module["asm"]["Lh"]).apply(null, arguments);
  });
  var dynCall_viiiiiiii = (Module["dynCall_viiiiiiii"] = function () {
    return (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] =
      Module["asm"]["Mh"]).apply(null, arguments);
  });
  var dynCall_vijii = (Module["dynCall_vijii"] = function () {
    return (dynCall_vijii = Module["dynCall_vijii"] =
      Module["asm"]["Nh"]).apply(null, arguments);
  });
  var dynCall_viiff = (Module["dynCall_viiff"] = function () {
    return (dynCall_viiff = Module["dynCall_viiff"] =
      Module["asm"]["Oh"]).apply(null, arguments);
  });
  var dynCall_viid = (Module["dynCall_viid"] = function () {
    return (dynCall_viid = Module["dynCall_viid"] = Module["asm"]["Ph"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viij = (Module["dynCall_viij"] = function () {
    return (dynCall_viij = Module["dynCall_viij"] = Module["asm"]["Qh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viif = (Module["dynCall_viif"] = function () {
    return (dynCall_viif = Module["dynCall_viif"] = Module["asm"]["Rh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jijiii = (Module["dynCall_jijiii"] = function () {
    return (dynCall_jijiii = Module["dynCall_jijiii"] =
      Module["asm"]["Sh"]).apply(null, arguments);
  });
  var dynCall_jiii = (Module["dynCall_jiii"] = function () {
    return (dynCall_jiii = Module["dynCall_jiii"] = Module["asm"]["Th"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iji = (Module["dynCall_iji"] = function () {
    return (dynCall_iji = Module["dynCall_iji"] = Module["asm"]["Uh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jjji = (Module["dynCall_jjji"] = function () {
    return (dynCall_jjji = Module["dynCall_jjji"] = Module["asm"]["Vh"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jiiiii = (Module["dynCall_jiiiii"] = function () {
    return (dynCall_jiiiii = Module["dynCall_jiiiii"] =
      Module["asm"]["Wh"]).apply(null, arguments);
  });
  var dynCall_ddiii = (Module["dynCall_ddiii"] = function () {
    return (dynCall_ddiii = Module["dynCall_ddiii"] =
      Module["asm"]["Xh"]).apply(null, arguments);
  });
  var dynCall_fiiii = (Module["dynCall_fiiii"] = function () {
    return (dynCall_fiiii = Module["dynCall_fiiii"] =
      Module["asm"]["Yh"]).apply(null, arguments);
  });
  var dynCall_jiiji = (Module["dynCall_jiiji"] = function () {
    return (dynCall_jiiji = Module["dynCall_jiiji"] =
      Module["asm"]["Zh"]).apply(null, arguments);
  });
  var dynCall_ijji = (Module["dynCall_ijji"] = function () {
    return (dynCall_ijji = Module["dynCall_ijji"] = Module["asm"]["_h"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jiiiiiiiiii = (Module["dynCall_jiiiiiiiiii"] = function () {
    return (dynCall_jiiiiiiiiii = Module["dynCall_jiiiiiiiiii"] =
      Module["asm"]["$h"]).apply(null, arguments);
  });
  var dynCall_j = (Module["dynCall_j"] = function () {
    return (dynCall_j = Module["dynCall_j"] = Module["asm"]["ai"]).apply(
      null,
      arguments
    );
  });
  var dynCall_jijj = (Module["dynCall_jijj"] = function () {
    return (dynCall_jijj = Module["dynCall_jijj"] = Module["asm"]["bi"]).apply(
      null,
      arguments
    );
  });
  var dynCall_iijii = (Module["dynCall_iijii"] = function () {
    return (dynCall_iijii = Module["dynCall_iijii"] =
      Module["asm"]["ci"]).apply(null, arguments);
  });
  var dynCall_iiiiiiiiiii = (Module["dynCall_iiiiiiiiiii"] = function () {
    return (dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] =
      Module["asm"]["di"]).apply(null, arguments);
  });
  var dynCall_dii = (Module["dynCall_dii"] = function () {
    return (dynCall_dii = Module["dynCall_dii"] = Module["asm"]["ei"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viijiiiiii = (Module["dynCall_viijiiiiii"] = function () {
    return (dynCall_viijiiiiii = Module["dynCall_viijiiiiii"] =
      Module["asm"]["fi"]).apply(null, arguments);
  });
  var dynCall_vijiii = (Module["dynCall_vijiii"] = function () {
    return (dynCall_vijiii = Module["dynCall_vijiii"] =
      Module["asm"]["gi"]).apply(null, arguments);
  });
  var dynCall_vjjjiiii = (Module["dynCall_vjjjiiii"] = function () {
    return (dynCall_vjjjiiii = Module["dynCall_vjjjiiii"] =
      Module["asm"]["hi"]).apply(null, arguments);
  });
  var dynCall_vjiiiii = (Module["dynCall_vjiiiii"] = function () {
    return (dynCall_vjiiiii = Module["dynCall_vjiiiii"] =
      Module["asm"]["ii"]).apply(null, arguments);
  });
  var dynCall_viji = (Module["dynCall_viji"] = function () {
    return (dynCall_viji = Module["dynCall_viji"] = Module["asm"]["ji"]).apply(
      null,
      arguments
    );
  });
  var dynCall_viiji = (Module["dynCall_viiji"] = function () {
    return (dynCall_viiji = Module["dynCall_viiji"] =
      Module["asm"]["ki"]).apply(null, arguments);
  });
  var dynCall_iiji = (Module["dynCall_iiji"] = function () {
    return (dynCall_iiji = Module["dynCall_iiji"] = Module["asm"]["li"]).apply(
      null,
      arguments
    );
  });
  var dynCall_vffff = (Module["dynCall_vffff"] = function () {
    return (dynCall_vffff = Module["dynCall_vffff"] =
      Module["asm"]["mi"]).apply(null, arguments);
  });
  var dynCall_vfff = (Module["dynCall_vfff"] = function () {
    return (dynCall_vfff = Module["dynCall_vfff"] = Module["asm"]["ni"]).apply(
      null,
      arguments
    );
  });
  function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_iiiiii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vii(index, a1, a2) {
    var sp = stackSave();
    try {
      dynCall_vii(index, a1, a2);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iii(index, a1, a2) {
    var sp = stackSave();
    try {
      return dynCall_iii(index, a1, a2);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_viii(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_iiii(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viiii(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_iiiii(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_fiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_fiii(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_diii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_diii(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viif(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_viif(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viid(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_viid(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vi(index, a1) {
    var sp = stackSave();
    try {
      dynCall_vi(index, a1);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_ii(index, a1) {
    var sp = stackSave();
    try {
      return dynCall_ii(index, a1);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_v(index) {
    var sp = stackSave();
    try {
      dynCall_v(index);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_i(index) {
    var sp = stackSave();
    try {
      return dynCall_i(index);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_viiiii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiiiiii(
        index,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a8,
        a9,
        a10
      );
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      dynCall_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiiiiiii(
    index,
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
    a10,
    a11
  ) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiiiiiii(
        index,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a8,
        a9,
        a10,
        a11
      );
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
      dynCall_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      dynCall_viiiiii(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viidi(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viidi(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vidi(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_vidi(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiffi(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_viiffi(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viifi(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viifi(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_fi(index, a1) {
    var sp = stackSave();
    try {
      return dynCall_fi(index, a1);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiifi(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_iiifi(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vifi(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_vifi(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_fffi(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_fffi(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viifii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_viifii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiifi(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      dynCall_viiiifi(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiidii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      return dynCall_iiiidii(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    var sp = stackSave();
    try {
      dynCall_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiff(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viiff(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_ddiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_ddiii(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_fiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_fiiii(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_dii(index, a1, a2) {
    var sp = stackSave();
    try {
      return dynCall_dii(index, a1, a2);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiij(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_iiij(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iij(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_iij(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiijiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      return dynCall_iiijiii(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jii(index, a1, a2) {
    var sp = stackSave();
    try {
      return dynCall_jii(index, a1, a2);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_ji(index, a1) {
    var sp = stackSave();
    try {
      return dynCall_ji(index, a1);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_j(index) {
    var sp = stackSave();
    try {
      return dynCall_j(index);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_jiii(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_ijji(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_ijji(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jiji(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_jiji(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iijji(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      return dynCall_iijji(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iji(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      return dynCall_iji(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jjji(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_jjji(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiijii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      return dynCall_iiiijii(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiji(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      dynCall_viiiji(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiiiiiiiiji(
    index,
    a1,
    a2,
    a3,
    a4,
    a5,
    a6,
    a7,
    a8,
    a9,
    a10,
    a11
  ) {
    var sp = stackSave();
    try {
      return dynCall_iiiiiiiiiji(
        index,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a8,
        a9,
        a10,
        a11
      );
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vji(index, a1, a2, a3) {
    var sp = stackSave();
    try {
      dynCall_vji(index, a1, a2, a3);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiiiij(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      dynCall_viiiiij(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiij(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_viiij(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vijii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_vijii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viij(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viij(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jijiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      return dynCall_jijiii(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jiiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_jiiiii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
      return dynCall_jiiiiiiiiii(
        index,
        a1,
        a2,
        a3,
        a4,
        a5,
        a6,
        a7,
        a8,
        a9,
        a10
      );
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jijj(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_jijj(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iijii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_iijii(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vijiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
      dynCall_vijiii(index, a1, a2, a3, a4, a5, a6);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vjjjiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
      dynCall_vjjjiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_vjiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
      dynCall_vjiiiii(index, a1, a2, a3, a4, a5, a6, a7);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viijiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
      dynCall_viijiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viji(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      dynCall_viji(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_viiji(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      dynCall_viiji(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_iiji(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
      return dynCall_iiji(index, a1, a2, a3, a4);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  function invoke_jiiji(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
      return dynCall_jiiji(index, a1, a2, a3, a4, a5);
    } catch (e) {
      stackRestore(sp);
      if (e !== e + 0 && e !== "longjmp") throw e;
      _setThrew(1, 0);
    }
  }
  Module["ccall"] = ccall;
  Module["cwrap"] = cwrap;
  Module["stackTrace"] = stackTrace;
  Module["addRunDependency"] = addRunDependency;
  Module["removeRunDependency"] = removeRunDependency;
  Module["FS_createPath"] = FS.createPath;
  Module["FS_createDataFile"] = FS.createDataFile;
  Module["stackTrace"] = stackTrace;
  var calledRun;
  function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status;
  }
  var calledMain = false;
  dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller;
  };
  function callMain(args) {
    var entryFunction = Module["_main"];
    args = args || [];
    var argc = args.length + 1;
    var argv = stackAlloc((argc + 1) * 4);
    HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
    for (var i = 1; i < argc; i++) {
      HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
    }
    HEAP32[(argv >> 2) + argc] = 0;
    try {
      var ret = entryFunction(argc, argv);
      exit(ret, true);
    } catch (e) {
      if (e instanceof ExitStatus) {
        return;
      } else if (e == "unwind") {
        return;
      } else {
        var toLog = e;
        if (e && typeof e === "object" && e.stack) {
          toLog = [e, e.stack];
        }
        err("exception thrown: " + toLog);
        quit_(1, e);
      }
    } finally {
      calledMain = true;
    }
  }
  function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
      return;
    }
    preRun();
    if (runDependencies > 0) {
      return;
    }
    function doRun() {
      if (calledRun) return;
      calledRun = true;
      Module["calledRun"] = true;
      if (ABORT) return;
      initRuntime();
      preMain();
      if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
      if (shouldRunNow) callMain(args);
      postRun();
    }
    if (Module["setStatus"]) {
      Module["setStatus"]("Running...");
      setTimeout(function () {
        setTimeout(function () {
          Module["setStatus"]("");
        }, 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
  }
  Module["run"] = run;
  function exit(status, implicit) {
    EXITSTATUS = status;
    if (implicit && keepRuntimeAlive() && status === 0) {
      return;
    }
    if (keepRuntimeAlive()) {
    } else {
      exitRuntime();
      if (Module["onExit"]) Module["onExit"](status);
      ABORT = true;
    }
    quit_(status, new ExitStatus(status));
  }
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
      Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
      Module["preInit"].pop()();
    }
  }
  var shouldRunNow = true;
  if (Module["noInitialRun"]) shouldRunNow = false;
  run();
}
