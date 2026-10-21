#!/usr/bin/env node
import { createRequire as __telopkitCreateRequire } from 'node:module';
const require = __telopkitCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports, module) {
    "use strict";
    if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
      module.exports = { nextTick };
    } else {
      module.exports = process;
    }
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn !== "function") {
        throw new TypeError('"callback" argument must be a function');
      }
      var len = arguments.length;
      var args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) {
            args[i++] = arguments[i];
          }
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports, module) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module) {
    module.exports = __require("stream");
  }
});

// node_modules/readable-stream/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/readable-stream/node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key2 in src) {
        dst[key2] = src[key2];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = __require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function") throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var Buffer2 = require_safe_buffer().Buffer;
    var util = __require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = { data: v, next: null };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = { data: v, next: this.head };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (this.length === 0) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) {
          ret += s + p.data;
        }
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        var ret = Buffer2.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    }();
    if (util && util.inspect && util.inspect.custom) {
      module.exports.prototype[util.inspect.custom] = function() {
        var obj = util.inspect({ length: this.length });
        return this.constructor.name + " " + obj;
      };
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            pna.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            pna.nextTick(emitErrorNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            pna.nextTick(emitErrorNT, _this, err2);
          }
        } else if (cb) {
          cb(err2);
        }
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports, module) {
    module.exports = __require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
    var Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      var hwm = options.highWaterMark;
      var writableHwm = options.writableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
      }
      this._writableState = new WritableState(options, this);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      var er = false;
      if (chunk === null) {
        er = new TypeError("May not write null values to stream");
      } else if (typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      if (er) {
        stream.emit("error", er);
        pna.nextTick(cb, er);
        valid = false;
      }
      return valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ended) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (writev) stream._writev(chunk, state.onwrite);
      else stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        pna.nextTick(cb, er);
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit("error", er);
        finishMaybe(stream, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          asyncWrite(afterWrite, stream, state, finished, cb);
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished) onwriteDrain(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          stream.emit("error", err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function") {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
        }
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished) pna.nextTick(cb);
        else stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end();
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key2 in obj) {
        keys2.push(key2);
      }
      return keys2;
    };
    module.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    util.inherits(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      if (options && options.readable === false) this.readable = false;
      if (options && options.writable === false) this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }
});

// node_modules/readable-stream/node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/readable-stream/node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var isEncoding = Buffer2.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      else if (byte >> 5 === 6) return 2;
      else if (byte >> 4 === 14) return 3;
      else if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2) nb = 0;
          else self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Readable;
    var isArray = require_isarray();
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter;
    var EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream();
    var Buffer2 = require_safe_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = __require("util");
    var debug = void 0;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function() {
      };
    }
    var BufferList = require_BufferList();
    var destroyImpl = require_destroy();
    var StringDecoder;
    util.inherits(Readable, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      var hwm = options.highWaterMark;
      var readableHwm = options.readableHighWaterMark;
      var defaultHwm = this.objectMode ? 16 : 16 * 1024;
      if (hwm || hwm === 0) this.highWaterMark = hwm;
      else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
      else this.highWaterMark = defaultHwm;
      this.highWaterMark = Math.floor(this.highWaterMark);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      get: function() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      this.push(null);
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          stream.emit("error", er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) stream.emit("error", new Error("stream.unshift() after end event"));
            else addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            stream.emit("error", new Error("stream.push() after EOF"));
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
              else maybeReadMore(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
        }
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit("data", chunk);
        stream.read(0);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
      }
      maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream, state) {
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      emitReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        if (state.sync) pna.nextTick(emitReadable_, stream);
        else emitReadable_(stream);
      }
    }
    function emitReadable_(stream) {
      debug("emit readable");
      stream.emit("readable");
      flow(stream);
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
        else len = state.length;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) pna.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = { hasUnpiped: false };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, { hasUnpiped: false });
        }
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false) this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            pna.nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    function resume(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
      }
    }
    function resume_(stream, state) {
      if (!state.reading) {
        debug("resume read 0");
        stream.read(0);
      }
      state.resumeScheduled = false;
      state.awaitDrain = 0;
      stream.emit("resume");
      flow(stream);
      if (state.flowing && !state.reading) stream.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    function flow(stream) {
      var state = stream._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
      }
    }
    Readable.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = /* @__PURE__ */ function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.head.data;
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = fromListPartial(n, state.buffer, state.decoder);
      }
      return ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      if (n < list.head.data.length) {
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
      } else if (n === list.head.data.length) {
        ret = list.shift();
      } else {
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
      }
      return ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;
      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;
        else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = str.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n);
      var p = list.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;
      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) list.head = p.next;
            else list.head = list.tail = null;
          } else {
            list.head = p;
            p.data = buf.slice(nb);
          }
          break;
        }
        ++c;
      }
      list.length -= c;
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
      }
    }
    function endReadableNT(state, stream) {
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
      }
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    module.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) {
        return this.emit("error", new Error("write callback called multiple times"));
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function") {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports, module) {
    var Stream = __require("stream");
    if (process.env.READABLE_STREAM === "disable" && Stream) {
      module.exports = Stream;
      exports = module.exports = Stream.Readable;
      exports.Readable = Stream.Readable;
      exports.Writable = Stream.Writable;
      exports.Duplex = Stream.Duplex;
      exports.Transform = Stream.Transform;
      exports.PassThrough = Stream.PassThrough;
      exports.Stream = Stream;
    } else {
      exports = module.exports = require_stream_readable();
      exports.Stream = Stream || exports;
      exports.Readable = exports;
      exports.Writable = require_stream_writable();
      exports.Duplex = require_stream_duplex();
      exports.Transform = require_stream_transform();
      exports.PassThrough = require_stream_passthrough();
    }
  }
});

// node_modules/jszip/lib/support.js
var require_support = __commonJS({
  "node_modules/jszip/lib/support.js"(exports) {
    "use strict";
    exports.base64 = true;
    exports.array = true;
    exports.string = true;
    exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    exports.nodebuffer = typeof Buffer !== "undefined";
    exports.uint8array = typeof Uint8Array !== "undefined";
    if (typeof ArrayBuffer === "undefined") {
      exports.blob = false;
    } else {
      buffer = new ArrayBuffer(0);
      try {
        exports.blob = new Blob([buffer], {
          type: "application/zip"
        }).size === 0;
      } catch (e) {
        try {
          Builder2 = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          builder = new Builder2();
          builder.append(buffer);
          exports.blob = builder.getBlob("application/zip").size === 0;
        } catch (e2) {
          exports.blob = false;
        }
      }
    }
    var buffer;
    var Builder2;
    var builder;
    try {
      exports.nodestream = !!require_readable().Readable;
    } catch (e) {
      exports.nodestream = false;
    }
  }
});

// node_modules/jszip/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/jszip/lib/base64.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    exports.encode = function(input) {
      var output = [];
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0, len = input.length, remainingBytes = len;
      var isArray = utils.getTypeOf(input) !== "string";
      while (i < input.length) {
        remainingBytes = len - i;
        if (!isArray) {
          chr1 = input.charCodeAt(i++);
          chr2 = i < len ? input.charCodeAt(i++) : 0;
          chr3 = i < len ? input.charCodeAt(i++) : 0;
        } else {
          chr1 = input[i++];
          chr2 = i < len ? input[i++] : 0;
          chr3 = i < len ? input[i++] : 0;
        }
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64;
        enc4 = remainingBytes > 2 ? chr3 & 63 : 64;
        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
      }
      return output.join("");
    };
    exports.decode = function(input) {
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0, resultIndex = 0;
      var dataUrlPrefix = "data:";
      if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix) {
        throw new Error("Invalid base64 input, it looks like a data url.");
      }
      input = input.replace(/[^A-Za-z0-9+/=]/g, "");
      var totalLength = input.length * 3 / 4;
      if (input.charAt(input.length - 1) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (input.charAt(input.length - 2) === _keyStr.charAt(64)) {
        totalLength--;
      }
      if (totalLength % 1 !== 0) {
        throw new Error("Invalid base64 input, bad content length.");
      }
      var output;
      if (support.uint8array) {
        output = new Uint8Array(totalLength | 0);
      } else {
        output = new Array(totalLength | 0);
      }
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output[resultIndex++] = chr1;
        if (enc3 !== 64) {
          output[resultIndex++] = chr2;
        }
        if (enc4 !== 64) {
          output[resultIndex++] = chr3;
        }
      }
      return output;
    };
  }
});

// node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = __commonJS({
  "node_modules/jszip/lib/nodejsUtils.js"(exports, module) {
    "use strict";
    module.exports = {
      /**
       * True if this is running in Nodejs, will be undefined in a browser.
       * In a browser, browserify won't include this file and the whole module
       * will be resolved an empty object.
       */
      isNode: typeof Buffer !== "undefined",
      /**
       * Create a new nodejs Buffer from an existing content.
       * @param {Object} data the data to pass to the constructor.
       * @param {String} encoding the encoding to use.
       * @return {Buffer} a new Buffer.
       */
      newBufferFrom: function(data, encoding) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) {
          return Buffer.from(data, encoding);
        } else {
          if (typeof data === "number") {
            throw new Error('The "data" argument must not be a number');
          }
          return new Buffer(data, encoding);
        }
      },
      /**
       * Create a new nodejs Buffer with the specified size.
       * @param {Integer} size the size of the buffer.
       * @return {Buffer} a new Buffer.
       */
      allocBuffer: function(size) {
        if (Buffer.alloc) {
          return Buffer.alloc(size);
        } else {
          var buf = new Buffer(size);
          buf.fill(0);
          return buf;
        }
      },
      /**
       * Find out if an object is a Buffer.
       * @param {Object} b the object to test.
       * @return {Boolean} true if the object is a Buffer, false otherwise.
       */
      isBuffer: function(b) {
        return Buffer.isBuffer(b);
      },
      isStream: function(obj) {
        return obj && typeof obj.on === "function" && typeof obj.pause === "function" && typeof obj.resume === "function";
      }
    };
  }
});

// node_modules/immediate/lib/index.js
var require_lib = __commonJS({
  "node_modules/immediate/lib/index.js"(exports, module) {
    "use strict";
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;
    var scheduleDrain;
    if (process.browser) {
      if (Mutation) {
        called = 0;
        observer = new Mutation(nextTick);
        element = global.document.createTextNode("");
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function() {
          element.data = called = ++called % 2;
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== "undefined") {
        channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function() {
          channel.port2.postMessage(0);
        };
      } else if ("document" in global && "onreadystatechange" in global.document.createElement("script")) {
        scheduleDrain = function() {
          var scriptEl = global.document.createElement("script");
          scriptEl.onreadystatechange = function() {
            nextTick();
            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function() {
          setTimeout(nextTick, 0);
        };
      }
    } else {
      scheduleDrain = function() {
        process.nextTick(nextTick);
      };
    }
    var called;
    var observer;
    var element;
    var channel;
    var draining;
    var queue = [];
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }
    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }
  }
});

// node_modules/lie/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/lie/lib/index.js"(exports, module) {
    "use strict";
    var immediate = require_lib();
    function INTERNAL() {
    }
    var handlers = {};
    var REJECTED = ["REJECTED"];
    var FULFILLED = ["FULFILLED"];
    var PENDING = ["PENDING"];
    if (!process.browser) {
      UNHANDLED = ["UNHANDLED"];
    }
    var UNHANDLED;
    module.exports = Promise2;
    function Promise2(resolver) {
      if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function");
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (!process.browser) {
        this.handled = UNHANDLED;
      }
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }
    Promise2.prototype.finally = function(callback) {
      if (typeof callback !== "function") {
        return this;
      }
      var p = this.constructor;
      return this.then(resolve2, reject2);
      function resolve2(value) {
        function yes() {
          return value;
        }
        return p.resolve(callback()).then(yes);
      }
      function reject2(reason) {
        function no() {
          throw reason;
        }
        return p.resolve(callback()).then(no);
      }
    };
    Promise2.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };
    Promise2.prototype.then = function(onFulfilled, onRejected) {
      if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (!process.browser) {
        if (this.handled === UNHANDLED) {
          this.handled = null;
        }
      }
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }
      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === "function") {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === "function") {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function(value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function(value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function(value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function(value) {
      unwrap(this.promise, this.onRejected, value);
    };
    function unwrap(promise, func, value) {
      immediate(function() {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }
    handlers.resolve = function(self2, value) {
      var result = tryCatch(getThen, value);
      if (result.status === "error") {
        return handlers.reject(self2, result.value);
      }
      var thenable = result.value;
      if (thenable) {
        safelyResolveThenable(self2, thenable);
      } else {
        self2.state = FULFILLED;
        self2.outcome = value;
        var i = -1;
        var len = self2.queue.length;
        while (++i < len) {
          self2.queue[i].callFulfilled(value);
        }
      }
      return self2;
    };
    handlers.reject = function(self2, error) {
      self2.state = REJECTED;
      self2.outcome = error;
      if (!process.browser) {
        if (self2.handled === UNHANDLED) {
          immediate(function() {
            if (self2.handled === UNHANDLED) {
              process.emit("unhandledRejection", error, self2);
            }
          });
        }
      }
      var i = -1;
      var len = self2.queue.length;
      while (++i < len) {
        self2.queue[i].callRejected(error);
      }
      return self2;
    };
    function getThen(obj) {
      var then = obj && obj.then;
      if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }
    function safelyResolveThenable(self2, thenable) {
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self2, value);
      }
      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self2, value);
      }
      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }
      var result = tryCatch(tryToUnwrap);
      if (result.status === "error") {
        onError(result.value);
      }
    }
    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = "success";
      } catch (e) {
        out.status = "error";
        out.value = e;
      }
      return out;
    }
    Promise2.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }
    Promise2.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }
    Promise2.all = all;
    function all(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i2) {
        self2.resolve(value).then(resolveFromAll, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i2] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }
    Promise2.race = race;
    function race(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]") {
        return this.reject(new TypeError("must be an array"));
      }
      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }
      var i = -1;
      var promise = new this(INTERNAL);
      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self2.resolve(value).then(function(response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function(error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }
  }
});

// node_modules/jszip/lib/external.js
var require_external = __commonJS({
  "node_modules/jszip/lib/external.js"(exports, module) {
    "use strict";
    var ES6Promise = null;
    if (typeof Promise !== "undefined") {
      ES6Promise = Promise;
    } else {
      ES6Promise = require_lib2();
    }
    module.exports = {
      Promise: ES6Promise
    };
  }
});

// node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/setimmediate/setImmediate.js"(exports) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate) {
        return;
      }
      var nextHandle = 1;
      var tasksByHandle = {};
      var currentlyRunningATask = false;
      var doc = global2.document;
      var registerImmediate;
      function setImmediate2(callback) {
        if (typeof callback !== "function") {
          callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
        }
        var task = { callback, args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(runIfPresent, 0, handle);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              run(task);
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global2.onmessage;
          global2.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global2.postMessage("", "*");
          global2.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
          if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global2.addEventListener) {
          global2.addEventListener("message", onGlobalMessage, false);
        } else {
          global2.attachEvent("onmessage", onGlobalMessage);
        }
        registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        registerImmediate = function(handle) {
          channel.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
      if ({}.toString.call(global2.process) === "[object process]") {
        installNextTickImplementation();
      } else if (canUsePostMessage()) {
        installPostMessageImplementation();
      } else if (global2.MessageChannel) {
        installMessageChannelImplementation();
      } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
      } else {
        installSetTimeoutImplementation();
      }
      attachTo.setImmediate = setImmediate2;
      attachTo.clearImmediate = clearImmediate;
    })(typeof self === "undefined" ? typeof global === "undefined" ? exports : global : self);
  }
});

// node_modules/jszip/lib/utils.js
var require_utils = __commonJS({
  "node_modules/jszip/lib/utils.js"(exports) {
    "use strict";
    var support = require_support();
    var base64 = require_base64();
    var nodejsUtils = require_nodejsUtils();
    var external = require_external();
    require_setImmediate();
    function string2binary(str) {
      var result = null;
      if (support.uint8array) {
        result = new Uint8Array(str.length);
      } else {
        result = new Array(str.length);
      }
      return stringToArrayLike(str, result);
    }
    exports.newBlob = function(part, type) {
      exports.checkSupport("blob");
      try {
        return new Blob([part], {
          type
        });
      } catch (e) {
        try {
          var Builder2 = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder;
          var builder = new Builder2();
          builder.append(part);
          return builder.getBlob(type);
        } catch (e2) {
          throw new Error("Bug : can't construct the Blob.");
        }
      }
    };
    function identity(input) {
      return input;
    }
    function stringToArrayLike(str, array) {
      for (var i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i) & 255;
      }
      return array;
    }
    var arrayToStringHelper = {
      /**
       * Transform an array of int into a string, chunk by chunk.
       * See the performances notes on arrayLikeToString.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @param {String} type the type of the array.
       * @param {Integer} chunk the chunk size.
       * @return {String} the resulting string.
       * @throws Error if the chunk is too big for the stack.
       */
      stringifyByChunk: function(array, type, chunk) {
        var result = [], k8 = 0, len = array.length;
        if (len <= chunk) {
          return String.fromCharCode.apply(null, array);
        }
        while (k8 < len) {
          if (type === "array" || type === "nodebuffer") {
            result.push(String.fromCharCode.apply(null, array.slice(k8, Math.min(k8 + chunk, len))));
          } else {
            result.push(String.fromCharCode.apply(null, array.subarray(k8, Math.min(k8 + chunk, len))));
          }
          k8 += chunk;
        }
        return result.join("");
      },
      /**
       * Call String.fromCharCode on every item in the array.
       * This is the naive implementation, which generate A LOT of intermediate string.
       * This should be used when everything else fail.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      stringifyByChar: function(array) {
        var resultStr = "";
        for (var i = 0; i < array.length; i++) {
          resultStr += String.fromCharCode(array[i]);
        }
        return resultStr;
      },
      applyCanBeUsed: {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array: function() {
          try {
            return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch (e) {
            return false;
          }
        }(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer: function() {
          try {
            return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
          } catch (e) {
            return false;
          }
        }()
      }
    };
    function arrayLikeToString(array) {
      var chunk = 65536, type = exports.getTypeOf(array), canUseApply = true;
      if (type === "uint8array") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
      } else if (type === "nodebuffer") {
        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
      }
      if (canUseApply) {
        while (chunk > 1) {
          try {
            return arrayToStringHelper.stringifyByChunk(array, type, chunk);
          } catch (e) {
            chunk = Math.floor(chunk / 2);
          }
        }
      }
      return arrayToStringHelper.stringifyByChar(array);
    }
    exports.applyFromCharCode = arrayLikeToString;
    function arrayLikeToArrayLike(arrayFrom, arrayTo) {
      for (var i = 0; i < arrayFrom.length; i++) {
        arrayTo[i] = arrayFrom[i];
      }
      return arrayTo;
    }
    var transform = {};
    transform["string"] = {
      "string": identity,
      "array": function(input) {
        return stringToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["string"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": function(input) {
        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
      }
    };
    transform["array"] = {
      "string": arrayLikeToString,
      "array": identity,
      "arraybuffer": function(input) {
        return new Uint8Array(input).buffer;
      },
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["arraybuffer"] = {
      "string": function(input) {
        return arrayLikeToString(new Uint8Array(input));
      },
      "array": function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
      },
      "arraybuffer": identity,
      "uint8array": function(input) {
        return new Uint8Array(input);
      },
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(new Uint8Array(input));
      }
    };
    transform["uint8array"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return input.buffer;
      },
      "uint8array": identity,
      "nodebuffer": function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform["nodebuffer"] = {
      "string": arrayLikeToString,
      "array": function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      "arraybuffer": function(input) {
        return transform["nodebuffer"]["uint8array"](input).buffer;
      },
      "uint8array": function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
      },
      "nodebuffer": identity
    };
    exports.transformTo = function(outputType, input) {
      if (!input) {
        input = "";
      }
      if (!outputType) {
        return input;
      }
      exports.checkSupport(outputType);
      var inputType = exports.getTypeOf(input);
      var result = transform[inputType][outputType](input);
      return result;
    };
    exports.resolve = function(path6) {
      var parts = path6.split("/");
      var result = [];
      for (var index = 0; index < parts.length; index++) {
        var part = parts[index];
        if (part === "." || part === "" && index !== 0 && index !== parts.length - 1) {
          continue;
        } else if (part === "..") {
          result.pop();
        } else {
          result.push(part);
        }
      }
      return result.join("/");
    };
    exports.getTypeOf = function(input) {
      if (typeof input === "string") {
        return "string";
      }
      if (Object.prototype.toString.call(input) === "[object Array]") {
        return "array";
      }
      if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
        return "nodebuffer";
      }
      if (support.uint8array && input instanceof Uint8Array) {
        return "uint8array";
      }
      if (support.arraybuffer && input instanceof ArrayBuffer) {
        return "arraybuffer";
      }
    };
    exports.checkSupport = function(type) {
      var supported = support[type.toLowerCase()];
      if (!supported) {
        throw new Error(type + " is not supported by this platform");
      }
    };
    exports.MAX_VALUE_16BITS = 65535;
    exports.MAX_VALUE_32BITS = -1;
    exports.pretty = function(str) {
      var res = "", code, i;
      for (i = 0; i < (str || "").length; i++) {
        code = str.charCodeAt(i);
        res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
      }
      return res;
    };
    exports.delay = function(callback, args, self2) {
      setImmediate(function() {
        callback.apply(self2 || null, args || []);
      });
    };
    exports.inherits = function(ctor, superCtor) {
      var Obj = function() {
      };
      Obj.prototype = superCtor.prototype;
      ctor.prototype = new Obj();
    };
    exports.extend = function() {
      var result = {}, i, attr;
      for (i = 0; i < arguments.length; i++) {
        for (attr in arguments[i]) {
          if (Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] === "undefined") {
            result[attr] = arguments[i][attr];
          }
        }
      }
      return result;
    };
    exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
      var promise = external.Promise.resolve(inputData).then(function(data) {
        var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);
        if (isBlob && typeof FileReader !== "undefined") {
          return new external.Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) {
              resolve(e.target.result);
            };
            reader.onerror = function(e) {
              reject(e.target.error);
            };
            reader.readAsArrayBuffer(data);
          });
        } else {
          return data;
        }
      });
      return promise.then(function(data) {
        var dataType = exports.getTypeOf(data);
        if (!dataType) {
          return external.Promise.reject(
            new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
          );
        }
        if (dataType === "arraybuffer") {
          data = exports.transformTo("uint8array", data);
        } else if (dataType === "string") {
          if (isBase64) {
            data = base64.decode(data);
          } else if (isBinary) {
            if (isOptimizedBinaryString !== true) {
              data = string2binary(data);
            }
          }
        }
        return data;
      });
    };
  }
});

// node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = __commonJS({
  "node_modules/jszip/lib/stream/GenericWorker.js"(exports, module) {
    "use strict";
    function GenericWorker(name) {
      this.name = name || "default";
      this.streamInfo = {};
      this.generatedError = null;
      this.extraStreamInfo = {};
      this.isPaused = true;
      this.isFinished = false;
      this.isLocked = false;
      this._listeners = {
        "data": [],
        "end": [],
        "error": []
      };
      this.previous = null;
    }
    GenericWorker.prototype = {
      /**
       * Push a chunk to the next workers.
       * @param {Object} chunk the chunk to push
       */
      push: function(chunk) {
        this.emit("data", chunk);
      },
      /**
       * End the stream.
       * @return {Boolean} true if this call ended the worker, false otherwise.
       */
      end: function() {
        if (this.isFinished) {
          return false;
        }
        this.flush();
        try {
          this.emit("end");
          this.cleanUp();
          this.isFinished = true;
        } catch (e) {
          this.emit("error", e);
        }
        return true;
      },
      /**
       * End the stream with an error.
       * @param {Error} e the error which caused the premature end.
       * @return {Boolean} true if this call ended the worker with an error, false otherwise.
       */
      error: function(e) {
        if (this.isFinished) {
          return false;
        }
        if (this.isPaused) {
          this.generatedError = e;
        } else {
          this.isFinished = true;
          this.emit("error", e);
          if (this.previous) {
            this.previous.error(e);
          }
          this.cleanUp();
        }
        return true;
      },
      /**
       * Add a callback on an event.
       * @param {String} name the name of the event (data, end, error)
       * @param {Function} listener the function to call when the event is triggered
       * @return {GenericWorker} the current object for chainability
       */
      on: function(name, listener) {
        this._listeners[name].push(listener);
        return this;
      },
      /**
       * Clean any references when a worker is ending.
       */
      cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
        this._listeners = [];
      },
      /**
       * Trigger an event. This will call registered callback with the provided arg.
       * @param {String} name the name of the event (data, end, error)
       * @param {Object} arg the argument to call the callback with.
       */
      emit: function(name, arg) {
        if (this._listeners[name]) {
          for (var i = 0; i < this._listeners[name].length; i++) {
            this._listeners[name][i].call(this, arg);
          }
        }
      },
      /**
       * Chain a worker with an other.
       * @param {Worker} next the worker receiving events from the current one.
       * @return {worker} the next worker for chainability
       */
      pipe: function(next) {
        return next.registerPrevious(this);
      },
      /**
       * Same as `pipe` in the other direction.
       * Using an API with `pipe(next)` is very easy.
       * Implementing the API with the point of view of the next one registering
       * a source is easier, see the ZipFileWorker.
       * @param {Worker} previous the previous worker, sending events to this one
       * @return {Worker} the current worker for chainability
       */
      registerPrevious: function(previous) {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.streamInfo = previous.streamInfo;
        this.mergeStreamInfo();
        this.previous = previous;
        var self2 = this;
        previous.on("data", function(chunk) {
          self2.processChunk(chunk);
        });
        previous.on("end", function() {
          self2.end();
        });
        previous.on("error", function(e) {
          self2.error(e);
        });
        return this;
      },
      /**
       * Pause the stream so it doesn't send events anymore.
       * @return {Boolean} true if this call paused the worker, false otherwise.
       */
      pause: function() {
        if (this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = true;
        if (this.previous) {
          this.previous.pause();
        }
        return true;
      },
      /**
       * Resume a paused stream.
       * @return {Boolean} true if this call resumed the worker, false otherwise.
       */
      resume: function() {
        if (!this.isPaused || this.isFinished) {
          return false;
        }
        this.isPaused = false;
        var withError = false;
        if (this.generatedError) {
          this.error(this.generatedError);
          withError = true;
        }
        if (this.previous) {
          this.previous.resume();
        }
        return !withError;
      },
      /**
       * Flush any remaining bytes as the stream is ending.
       */
      flush: function() {
      },
      /**
       * Process a chunk. This is usually the method overridden.
       * @param {Object} chunk the chunk to process.
       */
      processChunk: function(chunk) {
        this.push(chunk);
      },
      /**
       * Add a key/value to be added in the workers chain streamInfo once activated.
       * @param {String} key the key to use
       * @param {Object} value the associated value
       * @return {Worker} the current worker for chainability
       */
      withStreamInfo: function(key2, value) {
        this.extraStreamInfo[key2] = value;
        this.mergeStreamInfo();
        return this;
      },
      /**
       * Merge this worker's streamInfo into the chain's streamInfo.
       */
      mergeStreamInfo: function() {
        for (var key2 in this.extraStreamInfo) {
          if (!Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key2)) {
            continue;
          }
          this.streamInfo[key2] = this.extraStreamInfo[key2];
        }
      },
      /**
       * Lock the stream to prevent further updates on the workers chain.
       * After calling this method, all calls to pipe will fail.
       */
      lock: function() {
        if (this.isLocked) {
          throw new Error("The stream '" + this + "' has already been used.");
        }
        this.isLocked = true;
        if (this.previous) {
          this.previous.lock();
        }
      },
      /**
       *
       * Pretty print the workers chain.
       */
      toString: function() {
        var me = "Worker " + this.name;
        if (this.previous) {
          return this.previous + " -> " + me;
        } else {
          return me;
        }
      }
    };
    module.exports = GenericWorker;
  }
});

// node_modules/jszip/lib/utf8.js
var require_utf8 = __commonJS({
  "node_modules/jszip/lib/utf8.js"(exports) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var nodejsUtils = require_nodejsUtils();
    var GenericWorker = require_GenericWorker();
    var _utf8len = new Array(256);
    for (i = 0; i < 256; i++) {
      _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
    }
    var i;
    _utf8len[254] = _utf8len[254] = 1;
    var string2buf = function(str) {
      var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      if (support.uint8array) {
        buf = new Uint8Array(buf_len);
      } else {
        buf = new Array(buf_len);
      }
      for (i2 = 0, m_pos = 0; i2 < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i2++] = c;
        } else if (c < 2048) {
          buf[i2++] = 192 | c >>> 6;
          buf[i2++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i2++] = 224 | c >>> 12;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        } else {
          buf[i2++] = 240 | c >>> 18;
          buf[i2++] = 128 | c >>> 12 & 63;
          buf[i2++] = 128 | c >>> 6 & 63;
          buf[i2++] = 128 | c & 63;
        }
      }
      return buf;
    };
    var utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
    var buf2string = function(buf) {
      var i2, out, c, c_len;
      var len = buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i2 = 0; i2 < len; ) {
        c = buf[i2++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i2 += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i2 < len) {
          c = c << 6 | buf[i2++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      if (utf16buf.length !== out) {
        if (utf16buf.subarray) {
          utf16buf = utf16buf.subarray(0, out);
        } else {
          utf16buf.length = out;
        }
      }
      return utils.applyFromCharCode(utf16buf);
    };
    exports.utf8encode = function utf8encode(str) {
      if (support.nodebuffer) {
        return nodejsUtils.newBufferFrom(str, "utf-8");
      }
      return string2buf(str);
    };
    exports.utf8decode = function utf8decode(buf) {
      if (support.nodebuffer) {
        return utils.transformTo("nodebuffer", buf).toString("utf-8");
      }
      buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
      return buf2string(buf);
    };
    function Utf8DecodeWorker() {
      GenericWorker.call(this, "utf-8 decode");
      this.leftOver = null;
    }
    utils.inherits(Utf8DecodeWorker, GenericWorker);
    Utf8DecodeWorker.prototype.processChunk = function(chunk) {
      var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
      if (this.leftOver && this.leftOver.length) {
        if (support.uint8array) {
          var previousData = data;
          data = new Uint8Array(previousData.length + this.leftOver.length);
          data.set(this.leftOver, 0);
          data.set(previousData, this.leftOver.length);
        } else {
          data = this.leftOver.concat(data);
        }
        this.leftOver = null;
      }
      var nextBoundary = utf8border(data);
      var usableData = data;
      if (nextBoundary !== data.length) {
        if (support.uint8array) {
          usableData = data.subarray(0, nextBoundary);
          this.leftOver = data.subarray(nextBoundary, data.length);
        } else {
          usableData = data.slice(0, nextBoundary);
          this.leftOver = data.slice(nextBoundary, data.length);
        }
      }
      this.push({
        data: exports.utf8decode(usableData),
        meta: chunk.meta
      });
    };
    Utf8DecodeWorker.prototype.flush = function() {
      if (this.leftOver && this.leftOver.length) {
        this.push({
          data: exports.utf8decode(this.leftOver),
          meta: {}
        });
        this.leftOver = null;
      }
    };
    exports.Utf8DecodeWorker = Utf8DecodeWorker;
    function Utf8EncodeWorker() {
      GenericWorker.call(this, "utf-8 encode");
    }
    utils.inherits(Utf8EncodeWorker, GenericWorker);
    Utf8EncodeWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: exports.utf8encode(chunk.data),
        meta: chunk.meta
      });
    };
    exports.Utf8EncodeWorker = Utf8EncodeWorker;
  }
});

// node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = __commonJS({
  "node_modules/jszip/lib/stream/ConvertWorker.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var utils = require_utils();
    function ConvertWorker(destType) {
      GenericWorker.call(this, "ConvertWorker to " + destType);
      this.destType = destType;
    }
    utils.inherits(ConvertWorker, GenericWorker);
    ConvertWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: utils.transformTo(this.destType, chunk.data),
        meta: chunk.meta
      });
    };
    module.exports = ConvertWorker;
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js"(exports, module) {
    "use strict";
    var Readable = require_readable().Readable;
    var utils = require_utils();
    utils.inherits(NodejsStreamOutputAdapter, Readable);
    function NodejsStreamOutputAdapter(helper, options, updateCb) {
      Readable.call(this, options);
      this._helper = helper;
      var self2 = this;
      helper.on("data", function(data, meta) {
        if (!self2.push(data)) {
          self2._helper.pause();
        }
        if (updateCb) {
          updateCb(meta);
        }
      }).on("error", function(e) {
        self2.emit("error", e);
      }).on("end", function() {
        self2.push(null);
      });
    }
    NodejsStreamOutputAdapter.prototype._read = function() {
      this._helper.resume();
    };
    module.exports = NodejsStreamOutputAdapter;
  }
});

// node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = __commonJS({
  "node_modules/jszip/lib/stream/StreamHelper.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var ConvertWorker = require_ConvertWorker();
    var GenericWorker = require_GenericWorker();
    var base64 = require_base64();
    var support = require_support();
    var external = require_external();
    var NodejsStreamOutputAdapter = null;
    if (support.nodestream) {
      try {
        NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
      } catch (e) {
      }
    }
    function transformZipOutput(type, content, mimeType) {
      switch (type) {
        case "blob":
          return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
        case "base64":
          return base64.encode(content);
        default:
          return utils.transformTo(type, content);
      }
    }
    function concat(type, dataArray) {
      var i, index = 0, res = null, totalLength = 0;
      for (i = 0; i < dataArray.length; i++) {
        totalLength += dataArray[i].length;
      }
      switch (type) {
        case "string":
          return dataArray.join("");
        case "array":
          return Array.prototype.concat.apply([], dataArray);
        case "uint8array":
          res = new Uint8Array(totalLength);
          for (i = 0; i < dataArray.length; i++) {
            res.set(dataArray[i], index);
            index += dataArray[i].length;
          }
          return res;
        case "nodebuffer":
          return Buffer.concat(dataArray);
        default:
          throw new Error("concat : unsupported type '" + type + "'");
      }
    }
    function accumulate(helper, updateCallback) {
      return new external.Promise(function(resolve, reject) {
        var dataArray = [];
        var chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
        helper.on("data", function(data, meta) {
          dataArray.push(data);
          if (updateCallback) {
            updateCallback(meta);
          }
        }).on("error", function(err) {
          dataArray = [];
          reject(err);
        }).on("end", function() {
          try {
            var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
            resolve(result);
          } catch (e) {
            reject(e);
          }
          dataArray = [];
        }).resume();
      });
    }
    function StreamHelper(worker, outputType, mimeType) {
      var internalType = outputType;
      switch (outputType) {
        case "blob":
        case "arraybuffer":
          internalType = "uint8array";
          break;
        case "base64":
          internalType = "string";
          break;
      }
      try {
        this._internalType = internalType;
        this._outputType = outputType;
        this._mimeType = mimeType;
        utils.checkSupport(internalType);
        this._worker = worker.pipe(new ConvertWorker(internalType));
        worker.lock();
      } catch (e) {
        this._worker = new GenericWorker("error");
        this._worker.error(e);
      }
    }
    StreamHelper.prototype = {
      /**
       * Listen a StreamHelper, accumulate its content and concatenate it into a
       * complete block.
       * @param {Function} updateCb the update callback.
       * @return Promise the promise for the accumulation.
       */
      accumulate: function(updateCb) {
        return accumulate(this, updateCb);
      },
      /**
       * Add a listener on an event triggered on a stream.
       * @param {String} evt the name of the event
       * @param {Function} fn the listener
       * @return {StreamHelper} the current helper.
       */
      on: function(evt, fn) {
        var self2 = this;
        if (evt === "data") {
          this._worker.on(evt, function(chunk) {
            fn.call(self2, chunk.data, chunk.meta);
          });
        } else {
          this._worker.on(evt, function() {
            utils.delay(fn, arguments, self2);
          });
        }
        return this;
      },
      /**
       * Resume the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      resume: function() {
        utils.delay(this._worker.resume, [], this._worker);
        return this;
      },
      /**
       * Pause the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      pause: function() {
        this._worker.pause();
        return this;
      },
      /**
       * Return a nodejs stream for this helper.
       * @param {Function} updateCb the update callback.
       * @return {NodejsStreamOutputAdapter} the nodejs stream.
       */
      toNodejsStream: function(updateCb) {
        utils.checkSupport("nodestream");
        if (this._outputType !== "nodebuffer") {
          throw new Error(this._outputType + " is not supported by this method");
        }
        return new NodejsStreamOutputAdapter(this, {
          objectMode: this._outputType !== "nodebuffer"
        }, updateCb);
      }
    };
    module.exports = StreamHelper;
  }
});

// node_modules/jszip/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/jszip/lib/defaults.js"(exports) {
    "use strict";
    exports.base64 = false;
    exports.binary = false;
    exports.dir = false;
    exports.createFolders = true;
    exports.date = null;
    exports.compression = null;
    exports.compressionOptions = null;
    exports.comment = null;
    exports.unixPermissions = null;
    exports.dosPermissions = null;
  }
});

// node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = __commonJS({
  "node_modules/jszip/lib/stream/DataWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var DEFAULT_BLOCK_SIZE = 16 * 1024;
    function DataWorker(dataP) {
      GenericWorker.call(this, "DataWorker");
      var self2 = this;
      this.dataIsReady = false;
      this.index = 0;
      this.max = 0;
      this.data = null;
      this.type = "";
      this._tickScheduled = false;
      dataP.then(function(data) {
        self2.dataIsReady = true;
        self2.data = data;
        self2.max = data && data.length || 0;
        self2.type = utils.getTypeOf(data);
        if (!self2.isPaused) {
          self2._tickAndRepeat();
        }
      }, function(e) {
        self2.error(e);
      });
    }
    utils.inherits(DataWorker, GenericWorker);
    DataWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this.data = null;
    };
    DataWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this._tickScheduled && this.dataIsReady) {
        this._tickScheduled = true;
        utils.delay(this._tickAndRepeat, [], this);
      }
      return true;
    };
    DataWorker.prototype._tickAndRepeat = function() {
      this._tickScheduled = false;
      if (this.isPaused || this.isFinished) {
        return;
      }
      this._tick();
      if (!this.isFinished) {
        utils.delay(this._tickAndRepeat, [], this);
        this._tickScheduled = true;
      }
    };
    DataWorker.prototype._tick = function() {
      if (this.isPaused || this.isFinished) {
        return false;
      }
      var size = DEFAULT_BLOCK_SIZE;
      var data = null, nextIndex = Math.min(this.max, this.index + size);
      if (this.index >= this.max) {
        return this.end();
      } else {
        switch (this.type) {
          case "string":
            data = this.data.substring(this.index, nextIndex);
            break;
          case "uint8array":
            data = this.data.subarray(this.index, nextIndex);
            break;
          case "array":
          case "nodebuffer":
            data = this.data.slice(this.index, nextIndex);
            break;
        }
        this.index = nextIndex;
        return this.push({
          data,
          meta: {
            percent: this.max ? this.index / this.max * 100 : 0
          }
        });
      }
    };
    module.exports = DataWorker;
  }
});

// node_modules/jszip/lib/crc32.js
var require_crc32 = __commonJS({
  "node_modules/jszip/lib/crc32.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k8 = 0; k8 < 8; k8++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    function crc32str(crc, str, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
      }
      return crc ^ -1;
    }
    module.exports = function crc32wrapper(input, crc) {
      if (typeof input === "undefined" || !input.length) {
        return 0;
      }
      var isArray = utils.getTypeOf(input) !== "string";
      if (isArray) {
        return crc32(crc | 0, input, input.length, 0);
      } else {
        return crc32str(crc | 0, input, input.length, 0);
      }
    };
  }
});

// node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = __commonJS({
  "node_modules/jszip/lib/stream/Crc32Probe.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    var crc32 = require_crc32();
    var utils = require_utils();
    function Crc32Probe() {
      GenericWorker.call(this, "Crc32Probe");
      this.withStreamInfo("crc32", 0);
    }
    utils.inherits(Crc32Probe, GenericWorker);
    Crc32Probe.prototype.processChunk = function(chunk) {
      this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
      this.push(chunk);
    };
    module.exports = Crc32Probe;
  }
});

// node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = __commonJS({
  "node_modules/jszip/lib/stream/DataLengthProbe.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function DataLengthProbe(propName) {
      GenericWorker.call(this, "DataLengthProbe for " + propName);
      this.propName = propName;
      this.withStreamInfo(propName, 0);
    }
    utils.inherits(DataLengthProbe, GenericWorker);
    DataLengthProbe.prototype.processChunk = function(chunk) {
      if (chunk) {
        var length = this.streamInfo[this.propName] || 0;
        this.streamInfo[this.propName] = length + chunk.data.length;
      }
      GenericWorker.prototype.processChunk.call(this, chunk);
    };
    module.exports = DataLengthProbe;
  }
});

// node_modules/jszip/lib/compressedObject.js
var require_compressedObject = __commonJS({
  "node_modules/jszip/lib/compressedObject.js"(exports, module) {
    "use strict";
    var external = require_external();
    var DataWorker = require_DataWorker();
    var Crc32Probe = require_Crc32Probe();
    var DataLengthProbe = require_DataLengthProbe();
    function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
      this.compressedSize = compressedSize;
      this.uncompressedSize = uncompressedSize;
      this.crc32 = crc32;
      this.compression = compression;
      this.compressedContent = data;
    }
    CompressedObject.prototype = {
      /**
       * Create a worker to get the uncompressed content.
       * @return {GenericWorker} the worker.
       */
      getContentWorker: function() {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));
        var that = this;
        worker.on("end", function() {
          if (this.streamInfo["data_length"] !== that.uncompressedSize) {
            throw new Error("Bug : uncompressed data size mismatch");
          }
        });
        return worker;
      },
      /**
       * Create a worker to get the compressed content.
       * @return {GenericWorker} the worker.
       */
      getCompressedWorker: function() {
        return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      }
    };
    CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
      return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
    };
    module.exports = CompressedObject;
  }
});

// node_modules/jszip/lib/zipObject.js
var require_zipObject = __commonJS({
  "node_modules/jszip/lib/zipObject.js"(exports, module) {
    "use strict";
    var StreamHelper = require_StreamHelper();
    var DataWorker = require_DataWorker();
    var utf8 = require_utf8();
    var CompressedObject = require_compressedObject();
    var GenericWorker = require_GenericWorker();
    var ZipObject = function(name, data, options) {
      this.name = name;
      this.dir = options.dir;
      this.date = options.date;
      this.comment = options.comment;
      this.unixPermissions = options.unixPermissions;
      this.dosPermissions = options.dosPermissions;
      this._data = data;
      this._dataBinary = options.binary;
      this.options = {
        compression: options.compression,
        compressionOptions: options.compressionOptions
      };
    };
    ZipObject.prototype = {
      /**
       * Create an internal stream for the content of this object.
       * @param {String} type the type of each chunk.
       * @return StreamHelper the stream.
       */
      internalStream: function(type) {
        var result = null, outputType = "string";
        try {
          if (!type) {
            throw new Error("No output type specified.");
          }
          outputType = type.toLowerCase();
          var askUnicodeString = outputType === "string" || outputType === "text";
          if (outputType === "binarystring" || outputType === "text") {
            outputType = "string";
          }
          result = this._decompressWorker();
          var isUnicodeString = !this._dataBinary;
          if (isUnicodeString && !askUnicodeString) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          if (!isUnicodeString && askUnicodeString) {
            result = result.pipe(new utf8.Utf8DecodeWorker());
          }
        } catch (e) {
          result = new GenericWorker("error");
          result.error(e);
        }
        return new StreamHelper(result, outputType, "");
      },
      /**
       * Prepare the content in the asked type.
       * @param {String} type the type of the result.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Promise the promise of the result.
       */
      async: function(type, onUpdate) {
        return this.internalStream(type).accumulate(onUpdate);
      },
      /**
       * Prepare the content as a nodejs stream.
       * @param {String} type the type of each chunk.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Stream the stream.
       */
      nodeStream: function(type, onUpdate) {
        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
      },
      /**
       * Return a worker for the compressed content.
       * @private
       * @param {Object} compression the compression object to use.
       * @param {Object} compressionOptions the options to use when compressing.
       * @return Worker the worker.
       */
      _compressWorker: function(compression, compressionOptions) {
        if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) {
          return this._data.getCompressedWorker();
        } else {
          var result = this._decompressWorker();
          if (!this._dataBinary) {
            result = result.pipe(new utf8.Utf8EncodeWorker());
          }
          return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
        }
      },
      /**
       * Return a worker for the decompressed content.
       * @private
       * @return Worker the worker.
       */
      _decompressWorker: function() {
        if (this._data instanceof CompressedObject) {
          return this._data.getContentWorker();
        } else if (this._data instanceof GenericWorker) {
          return this._data;
        } else {
          return new DataWorker(this._data);
        }
      }
    };
    var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
    var removedFn = function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    };
    for (i = 0; i < removedMethods.length; i++) {
      ZipObject.prototype[removedMethods[i]] = removedFn;
    }
    var i;
    module.exports = ZipObject;
  }
});

// node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "node_modules/pako/lib/utils/common.js"(exports) {
    "use strict";
    var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
    function _has(obj, key2) {
      return Object.prototype.hasOwnProperty.call(obj, key2);
    }
    exports.assign = function(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        var source = sources.shift();
        if (!source) {
          continue;
        }
        if (typeof source !== "object") {
          throw new TypeError(source + "must be non-object");
        }
        for (var p in source) {
          if (_has(source, p)) {
            obj[p] = source[p];
          }
        }
      }
      return obj;
    };
    exports.shrinkBuf = function(buf, size) {
      if (buf.length === size) {
        return buf;
      }
      if (buf.subarray) {
        return buf.subarray(0, size);
      }
      buf.length = size;
      return buf;
    };
    var fnTyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
          return;
        }
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
        len = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          len += chunks[i].length;
        }
        result = new Uint8Array(len);
        pos = 0;
        for (i = 0, l = chunks.length; i < l; i++) {
          chunk = chunks[i];
          result.set(chunk, pos);
          pos += chunk.length;
        }
        return result;
      }
    };
    var fnUntyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    exports.setTyped = function(on) {
      if (on) {
        exports.Buf8 = Uint8Array;
        exports.Buf16 = Uint16Array;
        exports.Buf32 = Int32Array;
        exports.assign(exports, fnTyped);
      } else {
        exports.Buf8 = Array;
        exports.Buf16 = Array;
        exports.Buf32 = Array;
        exports.assign(exports, fnUntyped);
      }
    };
    exports.setTyped(TYPED_OK);
  }
});

// node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "node_modules/pako/lib/zlib/trees.js"(exports) {
    "use strict";
    var utils = require_common();
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = (
      /* extra bits for each length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    );
    var extra_dbits = (
      /* extra bits for each distance code */
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    );
    var extra_blbits = (
      /* extra bits for each bit length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    );
    var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value, length) {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }
    function send_code(s, c, tree) {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree;
      var max_code = desc.max_code;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var extra = desc.stat_desc.extra_bits;
      var base = desc.stat_desc.extra_base;
      var max_length = desc.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1);
      var code = 0;
      var bits;
      var n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    function tr_static_init() {
      var n;
      var bits;
      var length;
      var code;
      var dist;
      var bl_count = new Array(MAX_BITS + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s);
      if (header) {
        put_short(s, len);
        put_short(s, ~len);
      }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
      s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2;
      var _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k8) {
      var v = s.heap[k8];
      var j = k8 << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k8] = s.heap[j];
        k8 = j;
        j <<= 1;
      }
      s.heap[k8] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (s.last_lit !== 0) {
        do {
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
          lc = s.pending_buf[s.l_buf + lx];
          lx++;
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (lx < s.last_lit);
      }
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var elems = desc.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree(s) {
      var max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447;
      var n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }
    var static_init_done = false;
    function _tr_init(s) {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      copy_block(s, buf, stored_len, true);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }
    function _tr_tally(s, dist, lc) {
      s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
      s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
      s.last_lit++;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.last_lit === s.lit_bufsize - 1;
    }
    exports._tr_init = _tr_init;
    exports._tr_stored_block = _tr_stored_block;
    exports._tr_flush_block = _tr_flush_block;
    exports._tr_tally = _tr_tally;
    exports._tr_align = _tr_align;
  }
});

// node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "node_modules/pako/lib/zlib/adler32.js"(exports, module) {
    "use strict";
    function adler32(adler, buf, len, pos) {
      var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    module.exports = adler32;
  }
});

// node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS({
  "node_modules/pako/lib/zlib/crc32.js"(exports, module) {
    "use strict";
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k8 = 0; k8 < 8; k8++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    module.exports = crc32;
  }
});

// node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "node_modules/pako/lib/zlib/messages.js"(exports, module) {
    "use strict";
    module.exports = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
  }
});

// node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "node_modules/pako/lib/zlib/deflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var trees = require_trees();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var msg = require_messages();
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED = 4;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_UNKNOWN = 2;
    var Z_DEFLATED = 8;
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    function err(strm, errorCode) {
      strm.msg = msg[errorCode];
      return errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    function flush_pending(strm) {
      var s = strm.state;
      var len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }
    function flush_block_only(s, last) {
      trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      utils.arraySet(buf, strm.input, strm.next_in, len, start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length;
      var scan = s.strstart;
      var match;
      var len;
      var best_len = s.prev_length;
      var nice_match = s.nice_match;
      var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      var _win = s.window;
      var wmask = s.w_mask;
      var prev = s.prev;
      var strend = s.strstart + MAX_MATCH;
      var scan_end1 = _win[scan + best_len - 1];
      var scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size;
      var p, n, m, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          n = s.hash_size;
          p = n;
          do {
            m = s.head[--p];
            s.head[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          n = _w_size;
          p = n;
          do {
            m = s.prev[--p];
            s.prev[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
          while (s.insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5;
      }
      for (; ; ) {
        if (s.lookahead <= 1) {
          fill_window(s);
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.strstart += s.lookahead;
        s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
          s.lookahead = s.strstart - max_start;
          s.strstart = max_start;
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.strstart > s.block_start) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_NEED_MORE;
    }
    function deflate_fast(s, flush) {
      var hash_head;
      var bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
          }
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      var hash_head;
      var bflush;
      var max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      var bflush;
      var prev;
      var scan, strend;
      var _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      var bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table;
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new utils.Buf16(MAX_BITS + 1);
      this.heap = new utils.Buf16(2 * L_CODES + 1);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new utils.Buf16(2 * L_CODES + 1);
      zero(this.depth);
      this.l_buf = 0;
      this.lit_bufsize = 0;
      this.last_lit = 0;
      this.d_buf = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = s.wrap ? INIT_STATE : BUSY_STATE;
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = Z_NO_FLUSH;
      trees._tr_init(s);
      return Z_OK;
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    }
    function deflateSetHeader(strm, head) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      if (strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      var wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      var s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.wrap = wrap;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new utils.Buf8(s.w_size * 2);
      s.head = new utils.Buf16(s.hash_size);
      s.prev = new utils.Buf16(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new utils.Buf8(s.pending_buf_size);
      s.d_buf = 1 * s.lit_bufsize;
      s.l_buf = (1 + 2) * s.lit_bufsize;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate(strm, flush) {
      var old_flush, s;
      var beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      s = strm.state;
      if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      s.strm = strm;
      old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
          } else {
            put_byte(
              s,
              (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
            );
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        } else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          var level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          s.status = BUSY_STATE;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          beg = s.pending;
          while (s.gzindex < (s.gzhead.extra.length & 65535)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                break;
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
            s.gzindex++;
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0;
            s.status = NAME_STATE;
          }
        } else {
          s.status = NAME_STATE;
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.gzindex = 0;
            s.status = COMMENT_STATE;
          }
        } else {
          s.status = COMMENT_STATE;
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.status = HCRC_STATE;
          }
        } else {
          s.status = HCRC_STATE;
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
            s.status = BUSY_STATE;
          }
        } else {
          s.status = BUSY_STATE;
        }
      }
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees._tr_align(s);
          } else if (flush !== Z_BLOCK) {
            trees._tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }
    function deflateEnd(strm) {
      var status;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      status = strm.state.status;
      if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var s;
      var str, n;
      var wrap;
      var avail;
      var next;
      var input;
      var tmpDict;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      s = strm.state;
      wrap = s.wrap;
      if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        tmpDict = new utils.Buf8(s.w_size);
        utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      avail = strm.avail_in;
      next = strm.next_in;
      input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        str = s.strstart;
        n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap;
      return Z_OK;
    }
    exports.deflateInit = deflateInit;
    exports.deflateInit2 = deflateInit2;
    exports.deflateReset = deflateReset;
    exports.deflateResetKeep = deflateResetKeep;
    exports.deflateSetHeader = deflateSetHeader;
    exports.deflate = deflate;
    exports.deflateEnd = deflateEnd;
    exports.deflateSetDictionary = deflateSetDictionary;
    exports.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "node_modules/pako/lib/utils/strings.js"(exports) {
    "use strict";
    var utils = require_common();
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (__) {
      STR_APPLY_OK = false;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new utils.Buf8(256);
    for (q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    var q;
    _utf8len[254] = _utf8len[254] = 1;
    exports.string2buf = function(str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new utils.Buf8(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
      var result = "";
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }
    exports.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    exports.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i = 0, len = buf.length; i < len; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    };
    exports.buf2string = function(buf, max) {
      var i, out, c, c_len;
      var len = max || buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    exports.utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
  }
});

// node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "node_modules/pako/lib/zlib/zstream.js"(exports, module) {
    "use strict";
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    module.exports = ZStream;
  }
});

// node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "node_modules/pako/lib/deflate.js"(exports) {
    "use strict";
    var zlib_deflate = require_deflate();
    var utils = require_common();
    var strings = require_strings();
    var msg = require_messages();
    var ZStream = require_zstream();
    var toString = Object.prototype.toString;
    var Z_NO_FLUSH = 0;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_SYNC_FLUSH = 2;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate)) return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        var dict;
        if (typeof opt.dictionary === "string") {
          dict = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.string2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_deflate.deflate(strm, _mode);
        if (status !== Z_STREAM_END && status !== Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      if (_mode === Z_FINISH) {
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }
      if (_mode === Z_SYNC_FLUSH) {
        this.onEnd(Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      var deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate(input, options);
    }
    exports.Deflate = Deflate;
    exports.deflate = deflate;
    exports.deflateRaw = deflateRaw;
    exports.gzip = gzip;
  }
});

// node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "node_modules/pako/lib/zlib/inffast.js"(exports, module) {
    "use strict";
    var BAD = 30;
    var TYPE = 12;
    module.exports = function inflate_fast(strm, start) {
      var state;
      var _in;
      var last;
      var _out;
      var beg;
      var end;
      var dmax;
      var wsize;
      var whave;
      var wnext;
      var s_window;
      var hold;
      var bits;
      var lcode;
      var dcode;
      var lmask;
      var dmask;
      var here;
      var op;
      var len;
      var dist;
      var from;
      var from_source;
      var input, output;
      state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
  }
});

// node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
    "use strict";
    var utils = require_common();
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = [
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ];
    var lext = [
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ];
    var dbase = [
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ];
    var dext = [
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits;
      var len = 0;
      var sym = 0;
      var min = 0, max = 0;
      var root = 0;
      var curr = 0;
      var drop = 0;
      var left = 0;
      var used = 0;
      var huff = 0;
      var incr;
      var fill;
      var low;
      var mask;
      var next;
      var base = null;
      var base_index = 0;
      var end;
      var count = new utils.Buf16(MAXBITS + 1);
      var offs = new utils.Buf16(MAXBITS + 1);
      var extra = null;
      var extra_index = 0;
      var here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root < min) {
        root = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base = extra = work;
        end = 19;
      } else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
      } else {
        base = dbase;
        extra = dext;
        end = -1;
      }
      huff = 0;
      sym = 0;
      len = min;
      next = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base[base_index + work[sym]];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    };
  }
});

// node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "node_modules/pako/lib/zlib/inflate.js"(exports) {
    "use strict";
    var utils = require_common();
    var adler32 = require_adler32();
    var crc32 = require_crc322();
    var inflate_fast = require_inffast();
    var inflate_table = require_inftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_TREES = 6;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR = -5;
    var Z_DEFLATED = 8;
    var HEAD = 1;
    var FLAGS = 2;
    var TIME = 3;
    var OS = 4;
    var EXLEN = 5;
    var EXTRA = 6;
    var NAME = 7;
    var COMMENT = 8;
    var HCRC = 9;
    var DICTID = 10;
    var DICT = 11;
    var TYPE = 12;
    var TYPEDO = 13;
    var STORED = 14;
    var COPY_ = 15;
    var COPY = 16;
    var TABLE = 17;
    var LENLENS = 18;
    var CODELENS = 19;
    var LEN_ = 20;
    var LEN = 21;
    var LENEXT = 22;
    var DIST = 23;
    var DISTEXT = 24;
    var MATCH = 25;
    var LIT = 26;
    var CHECK = 27;
    var LENGTH = 28;
    var DONE = 29;
    var BAD = 30;
    var MEM = 31;
    var SYNC = 32;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new utils.Buf16(320);
      this.work = new utils.Buf16(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    }
    function inflateReset(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }
    function inflateReset2(strm, windowBits) {
      var wrap;
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      } else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      state = new InflateState();
      strm.state = state;
      state.window = null;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = true;
    var lenfix;
    var distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy) {
      var dist;
      var state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new utils.Buf8(state.wsize);
      }
      if (copy >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        utils.arraySet(state.window, src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
          utils.arraySet(state.window, src, end - copy, copy, 0);
          state.wnext = copy;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }
    function inflate(strm, flush) {
      var state;
      var input, output;
      var next;
      var put;
      var have, left;
      var hold;
      var bits;
      var _in, _out;
      var copy;
      var from;
      var from_source;
      var here = 0;
      var here_bits, here_op, here_val;
      var last_bits, last_op, last_val;
      var len;
      var ret;
      var hbuf = new utils.Buf8(4);
      var opts;
      var n;
      var order = (
        /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
      );
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              } else if (len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case COPY_:
              state.mode = COPY;
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                utils.arraySet(output, input, next, copy, put);
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            case LEN_:
              state.mode = LEN;
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                  state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var state;
      var dictid;
      var ret;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    }
    exports.inflateReset = inflateReset;
    exports.inflateReset2 = inflateReset2;
    exports.inflateResetKeep = inflateResetKeep;
    exports.inflateInit = inflateInit;
    exports.inflateInit2 = inflateInit2;
    exports.inflate = inflate;
    exports.inflateEnd = inflateEnd;
    exports.inflateGetHeader = inflateGetHeader;
    exports.inflateSetDictionary = inflateSetDictionary;
    exports.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "node_modules/pako/lib/zlib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
  }
});

// node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "node_modules/pako/lib/zlib/gzheader.js"(exports, module) {
    "use strict";
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    module.exports = GZheader;
  }
});

// node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "node_modules/pako/lib/inflate.js"(exports) {
    "use strict";
    var zlib_inflate = require_inflate();
    var utils = require_common();
    var strings = require_strings();
    var c = require_constants();
    var msg = require_messages();
    var ZStream = require_zstream();
    var GZheader = require_gzheader();
    var toString = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate)) return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== c.Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var dictionary = this.options.dictionary;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
      var allowBufError = false;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings.binstring2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
        if (status === c.Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
        }
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
            if (this.options.to === "string") {
              next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
              tail = strm.next_out - next_out_utf8;
              utf8str = strings.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) {
                utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
              }
              this.onData(utf8str);
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === c.Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      var inflator = new Inflate(options);
      inflator.push(input, true);
      if (inflator.err) {
        throw inflator.msg || msg[inflator.err];
      }
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    exports.Inflate = Inflate;
    exports.inflate = inflate;
    exports.inflateRaw = inflateRaw;
    exports.ungzip = inflate;
  }
});

// node_modules/pako/index.js
var require_pako = __commonJS({
  "node_modules/pako/index.js"(exports, module) {
    "use strict";
    var assign = require_common().assign;
    var deflate = require_deflate2();
    var inflate = require_inflate2();
    var constants = require_constants();
    var pako = {};
    assign(pako, deflate, inflate, constants);
    module.exports = pako;
  }
});

// node_modules/jszip/lib/flate.js
var require_flate = __commonJS({
  "node_modules/jszip/lib/flate.js"(exports) {
    "use strict";
    var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
    var pako = require_pako();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
    exports.magic = "\b\0";
    function FlateWorker(action, options) {
      GenericWorker.call(this, "FlateWorker/" + action);
      this._pako = null;
      this._pakoAction = action;
      this._pakoOptions = options;
      this.meta = {};
    }
    utils.inherits(FlateWorker, GenericWorker);
    FlateWorker.prototype.processChunk = function(chunk) {
      this.meta = chunk.meta;
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
    };
    FlateWorker.prototype.flush = function() {
      GenericWorker.prototype.flush.call(this);
      if (this._pako === null) {
        this._createPako();
      }
      this._pako.push([], true);
    };
    FlateWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this);
      this._pako = null;
    };
    FlateWorker.prototype._createPako = function() {
      this._pako = new pako[this._pakoAction]({
        raw: true,
        level: this._pakoOptions.level || -1
        // default compression
      });
      var self2 = this;
      this._pako.onData = function(data) {
        self2.push({
          data,
          meta: self2.meta
        });
      };
    };
    exports.compressWorker = function(compressionOptions) {
      return new FlateWorker("Deflate", compressionOptions);
    };
    exports.uncompressWorker = function() {
      return new FlateWorker("Inflate", {});
    };
  }
});

// node_modules/jszip/lib/compressions.js
var require_compressions = __commonJS({
  "node_modules/jszip/lib/compressions.js"(exports) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    exports.STORE = {
      magic: "\0\0",
      compressWorker: function() {
        return new GenericWorker("STORE compression");
      },
      uncompressWorker: function() {
        return new GenericWorker("STORE decompression");
      }
    };
    exports.DEFLATE = require_flate();
  }
});

// node_modules/jszip/lib/signature.js
var require_signature = __commonJS({
  "node_modules/jszip/lib/signature.js"(exports) {
    "use strict";
    exports.LOCAL_FILE_HEADER = "PK";
    exports.CENTRAL_FILE_HEADER = "PK";
    exports.CENTRAL_DIRECTORY_END = "PK";
    exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
    exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
    exports.DATA_DESCRIPTOR = "PK\x07\b";
  }
});

// node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = __commonJS({
  "node_modules/jszip/lib/generate/ZipFileWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var utf8 = require_utf8();
    var crc32 = require_crc32();
    var signature = require_signature();
    var decToHex = function(dec, bytes) {
      var hex = "", i;
      for (i = 0; i < bytes; i++) {
        hex += String.fromCharCode(dec & 255);
        dec = dec >>> 8;
      }
      return hex;
    };
    var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
      var result = unixPermissions;
      if (!unixPermissions) {
        result = isDir ? 16893 : 33204;
      }
      return (result & 65535) << 16;
    };
    var generateDosExternalFileAttr = function(dosPermissions) {
      return (dosPermissions || 0) & 63;
    };
    var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
      var file = streamInfo["file"], compression = streamInfo["compression"], useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date;
      var dataInfo = {
        crc32: 0,
        compressedSize: 0,
        uncompressedSize: 0
      };
      if (!streamedContent || streamingEnded) {
        dataInfo.crc32 = streamInfo["crc32"];
        dataInfo.compressedSize = streamInfo["compressedSize"];
        dataInfo.uncompressedSize = streamInfo["uncompressedSize"];
      }
      var bitflag = 0;
      if (streamedContent) {
        bitflag |= 8;
      }
      if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
        bitflag |= 2048;
      }
      var extFileAttr = 0;
      var versionMadeBy = 0;
      if (dir) {
        extFileAttr |= 16;
      }
      if (platform === "UNIX") {
        versionMadeBy = 798;
        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
      } else {
        versionMadeBy = 20;
        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
      }
      dosTime = date.getUTCHours();
      dosTime = dosTime << 6;
      dosTime = dosTime | date.getUTCMinutes();
      dosTime = dosTime << 5;
      dosTime = dosTime | date.getUTCSeconds() / 2;
      dosDate = date.getUTCFullYear() - 1980;
      dosDate = dosDate << 4;
      dosDate = dosDate | date.getUTCMonth() + 1;
      dosDate = dosDate << 5;
      dosDate = dosDate | date.getUTCDate();
      if (useUTF8ForFileName) {
        unicodePathExtraField = // Version
        decToHex(1, 1) + // NameCRC32
        decToHex(crc32(encodedFileName), 4) + // UnicodeName
        utfEncodedFileName;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "up" + // size
        decToHex(unicodePathExtraField.length, 2) + // content
        unicodePathExtraField;
      }
      if (useUTF8ForComment) {
        unicodeCommentExtraField = // Version
        decToHex(1, 1) + // CommentCRC32
        decToHex(crc32(encodedComment), 4) + // UnicodeName
        utfEncodedComment;
        extraFields += // Info-ZIP Unicode Path Extra Field
        "uc" + // size
        decToHex(unicodeCommentExtraField.length, 2) + // content
        unicodeCommentExtraField;
      }
      var header = "";
      header += "\n\0";
      header += decToHex(bitflag, 2);
      header += compression.magic;
      header += decToHex(dosTime, 2);
      header += decToHex(dosDate, 2);
      header += decToHex(dataInfo.crc32, 4);
      header += decToHex(dataInfo.compressedSize, 4);
      header += decToHex(dataInfo.uncompressedSize, 4);
      header += decToHex(encodedFileName.length, 2);
      header += decToHex(extraFields.length, 2);
      var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
      var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
      decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
      header + // file comment length
      decToHex(encodedComment.length, 2) + // disk number start
      "\0\0\0\0" + // external file attributes
      decToHex(extFileAttr, 4) + // relative offset of local header
      decToHex(offset, 4) + // file name
      encodedFileName + // extra field
      extraFields + // file comment
      encodedComment;
      return {
        fileRecord,
        dirRecord
      };
    };
    var generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
      var dirEnd = "";
      var encodedComment = utils.transformTo("string", encodeFileName(comment));
      dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
      "\0\0\0\0" + // total number of entries in the central directory on this disk
      decToHex(entriesCount, 2) + // total number of entries in the central directory
      decToHex(entriesCount, 2) + // size of the central directory   4 bytes
      decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
      decToHex(localDirLength, 4) + // .ZIP file comment length
      decToHex(encodedComment.length, 2) + // .ZIP file comment
      encodedComment;
      return dirEnd;
    };
    var generateDataDescriptors = function(streamInfo) {
      var descriptor = "";
      descriptor = signature.DATA_DESCRIPTOR + // crc-32                          4 bytes
      decToHex(streamInfo["crc32"], 4) + // compressed size                 4 bytes
      decToHex(streamInfo["compressedSize"], 4) + // uncompressed size               4 bytes
      decToHex(streamInfo["uncompressedSize"], 4);
      return descriptor;
    };
    function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
      GenericWorker.call(this, "ZipFileWorker");
      this.bytesWritten = 0;
      this.zipComment = comment;
      this.zipPlatform = platform;
      this.encodeFileName = encodeFileName;
      this.streamFiles = streamFiles;
      this.accumulate = false;
      this.contentBuffer = [];
      this.dirRecords = [];
      this.currentSourceOffset = 0;
      this.entriesCount = 0;
      this.currentFile = null;
      this._sources = [];
    }
    utils.inherits(ZipFileWorker, GenericWorker);
    ZipFileWorker.prototype.push = function(chunk) {
      var currentFilePercent = chunk.meta.percent || 0;
      var entriesCount = this.entriesCount;
      var remainingFiles = this._sources.length;
      if (this.accumulate) {
        this.contentBuffer.push(chunk);
      } else {
        this.bytesWritten += chunk.data.length;
        GenericWorker.prototype.push.call(this, {
          data: chunk.data,
          meta: {
            currentFile: this.currentFile,
            percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
          }
        });
      }
    };
    ZipFileWorker.prototype.openedSource = function(streamInfo) {
      this.currentSourceOffset = this.bytesWritten;
      this.currentFile = streamInfo["file"].name;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      if (streamedContent) {
        var record = generateZipParts(streamInfo, streamedContent, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
      } else {
        this.accumulate = true;
      }
    };
    ZipFileWorker.prototype.closedSource = function(streamInfo) {
      this.accumulate = false;
      var streamedContent = this.streamFiles && !streamInfo["file"].dir;
      var record = generateZipParts(streamInfo, streamedContent, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
      this.dirRecords.push(record.dirRecord);
      if (streamedContent) {
        this.push({
          data: generateDataDescriptors(streamInfo),
          meta: { percent: 100 }
        });
      } else {
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
        while (this.contentBuffer.length) {
          this.push(this.contentBuffer.shift());
        }
      }
      this.currentFile = null;
    };
    ZipFileWorker.prototype.flush = function() {
      var localDirLength = this.bytesWritten;
      for (var i = 0; i < this.dirRecords.length; i++) {
        this.push({
          data: this.dirRecords[i],
          meta: { percent: 100 }
        });
      }
      var centralDirLength = this.bytesWritten - localDirLength;
      var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
      this.push({
        data: dirEnd,
        meta: { percent: 100 }
      });
    };
    ZipFileWorker.prototype.prepareNextSource = function() {
      this.previous = this._sources.shift();
      this.openedSource(this.previous.streamInfo);
      if (this.isPaused) {
        this.previous.pause();
      } else {
        this.previous.resume();
      }
    };
    ZipFileWorker.prototype.registerPrevious = function(previous) {
      this._sources.push(previous);
      var self2 = this;
      previous.on("data", function(chunk) {
        self2.processChunk(chunk);
      });
      previous.on("end", function() {
        self2.closedSource(self2.previous.streamInfo);
        if (self2._sources.length) {
          self2.prepareNextSource();
        } else {
          self2.end();
        }
      });
      previous.on("error", function(e) {
        self2.error(e);
      });
      return this;
    };
    ZipFileWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (!this.previous && this._sources.length) {
        this.prepareNextSource();
        return true;
      }
      if (!this.previous && !this._sources.length && !this.generatedError) {
        this.end();
        return true;
      }
    };
    ZipFileWorker.prototype.error = function(e) {
      var sources = this._sources;
      if (!GenericWorker.prototype.error.call(this, e)) {
        return false;
      }
      for (var i = 0; i < sources.length; i++) {
        try {
          sources[i].error(e);
        } catch (e2) {
        }
      }
      return true;
    };
    ZipFileWorker.prototype.lock = function() {
      GenericWorker.prototype.lock.call(this);
      var sources = this._sources;
      for (var i = 0; i < sources.length; i++) {
        sources[i].lock();
      }
    };
    module.exports = ZipFileWorker;
  }
});

// node_modules/jszip/lib/generate/index.js
var require_generate = __commonJS({
  "node_modules/jszip/lib/generate/index.js"(exports) {
    "use strict";
    var compressions = require_compressions();
    var ZipFileWorker = require_ZipFileWorker();
    var getCompression = function(fileCompression, zipCompression) {
      var compressionName = fileCompression || zipCompression;
      var compression = compressions[compressionName];
      if (!compression) {
        throw new Error(compressionName + " is not a valid compression method !");
      }
      return compression;
    };
    exports.generateWorker = function(zip, options, comment) {
      var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
      var entriesCount = 0;
      try {
        zip.forEach(function(relativePath, file) {
          entriesCount++;
          var compression = getCompression(file.options.compression, options.compression);
          var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
          var dir = file.dir, date = file.date;
          file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
            name: relativePath,
            dir,
            date,
            comment: file.comment || "",
            unixPermissions: file.unixPermissions,
            dosPermissions: file.dosPermissions
          }).pipe(zipFileWorker);
        });
        zipFileWorker.entriesCount = entriesCount;
      } catch (e) {
        zipFileWorker.error(e);
      }
      return zipFileWorker;
    };
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    function NodejsStreamInputAdapter(filename, stream) {
      GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
      this._upstreamEnded = false;
      this._bindStream(stream);
    }
    utils.inherits(NodejsStreamInputAdapter, GenericWorker);
    NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
      var self2 = this;
      this._stream = stream;
      stream.pause();
      stream.on("data", function(chunk) {
        self2.push({
          data: chunk,
          meta: {
            percent: 0
          }
        });
      }).on("error", function(e) {
        if (self2.isPaused) {
          this.generatedError = e;
        } else {
          self2.error(e);
        }
      }).on("end", function() {
        if (self2.isPaused) {
          self2._upstreamEnded = true;
        } else {
          self2.end();
        }
      });
    };
    NodejsStreamInputAdapter.prototype.pause = function() {
      if (!GenericWorker.prototype.pause.call(this)) {
        return false;
      }
      this._stream.pause();
      return true;
    };
    NodejsStreamInputAdapter.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this)) {
        return false;
      }
      if (this._upstreamEnded) {
        this.end();
      } else {
        this._stream.resume();
      }
      return true;
    };
    module.exports = NodejsStreamInputAdapter;
  }
});

// node_modules/jszip/lib/object.js
var require_object = __commonJS({
  "node_modules/jszip/lib/object.js"(exports, module) {
    "use strict";
    var utf8 = require_utf8();
    var utils = require_utils();
    var GenericWorker = require_GenericWorker();
    var StreamHelper = require_StreamHelper();
    var defaults = require_defaults();
    var CompressedObject = require_compressedObject();
    var ZipObject = require_zipObject();
    var generate2 = require_generate();
    var nodejsUtils = require_nodejsUtils();
    var NodejsStreamInputAdapter = require_NodejsStreamInputAdapter();
    var fileAdd = function(name, data, originalOptions) {
      var dataType = utils.getTypeOf(data), parent;
      var o = utils.extend(originalOptions || {}, defaults);
      o.date = o.date || /* @__PURE__ */ new Date();
      if (o.compression !== null) {
        o.compression = o.compression.toUpperCase();
      }
      if (typeof o.unixPermissions === "string") {
        o.unixPermissions = parseInt(o.unixPermissions, 8);
      }
      if (o.unixPermissions && o.unixPermissions & 16384) {
        o.dir = true;
      }
      if (o.dosPermissions && o.dosPermissions & 16) {
        o.dir = true;
      }
      if (o.dir) {
        name = forceTrailingSlash(name);
      }
      if (o.createFolders && (parent = parentFolder(name))) {
        folderAdd.call(this, parent, true);
      }
      var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
      if (!originalOptions || typeof originalOptions.binary === "undefined") {
        o.binary = !isUnicodeString;
      }
      var isCompressedEmpty = data instanceof CompressedObject && data.uncompressedSize === 0;
      if (isCompressedEmpty || o.dir || !data || data.length === 0) {
        o.base64 = false;
        o.binary = true;
        data = "";
        o.compression = "STORE";
        dataType = "string";
      }
      var zipObjectContent = null;
      if (data instanceof CompressedObject || data instanceof GenericWorker) {
        zipObjectContent = data;
      } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        zipObjectContent = new NodejsStreamInputAdapter(name, data);
      } else {
        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
      }
      var object = new ZipObject(name, zipObjectContent, o);
      this.files[name] = object;
    };
    var parentFolder = function(path6) {
      if (path6.slice(-1) === "/") {
        path6 = path6.substring(0, path6.length - 1);
      }
      var lastSlash = path6.lastIndexOf("/");
      return lastSlash > 0 ? path6.substring(0, lastSlash) : "";
    };
    var forceTrailingSlash = function(path6) {
      if (path6.slice(-1) !== "/") {
        path6 += "/";
      }
      return path6;
    };
    var folderAdd = function(name, createFolders) {
      createFolders = typeof createFolders !== "undefined" ? createFolders : defaults.createFolders;
      name = forceTrailingSlash(name);
      if (!this.files[name]) {
        fileAdd.call(this, name, null, {
          dir: true,
          createFolders
        });
      }
      return this.files[name];
    };
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    var out = {
      /**
       * @see loadAsync
       */
      load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Call a callback function for each entry at this folder level.
       * @param {Function} cb the callback function:
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       */
      forEach: function(cb) {
        var filename, relativePath, file;
        for (filename in this.files) {
          file = this.files[filename];
          relativePath = filename.slice(this.root.length, filename.length);
          if (relativePath && filename.slice(0, this.root.length) === this.root) {
            cb(relativePath, file);
          }
        }
      },
      /**
       * Filter nested files/folders with the specified function.
       * @param {Function} search the predicate to use :
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       * @return {Array} An array of matching elements.
       */
      filter: function(search) {
        var result = [];
        this.forEach(function(relativePath, entry) {
          if (search(relativePath, entry)) {
            result.push(entry);
          }
        });
        return result;
      },
      /**
       * Add a file to the zip file, or search a file.
       * @param   {string|RegExp} name The name of the file to add (if data is defined),
       * the name of the file to find (if no data) or a regex to match files.
       * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
       * @param   {Object} o     File options
       * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
       * a file (when searching by string) or an array of files (when searching by regex).
       */
      file: function(name, data, o) {
        if (arguments.length === 1) {
          if (isRegExp(name)) {
            var regexp = name;
            return this.filter(function(relativePath, file) {
              return !file.dir && regexp.test(relativePath);
            });
          } else {
            var obj = this.files[this.root + name];
            if (obj && !obj.dir) {
              return obj;
            } else {
              return null;
            }
          }
        } else {
          name = this.root + name;
          fileAdd.call(this, name, data, o);
        }
        return this;
      },
      /**
       * Add a directory to the zip file, or search.
       * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
       * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
       */
      folder: function(arg) {
        if (!arg) {
          return this;
        }
        if (isRegExp(arg)) {
          return this.filter(function(relativePath, file) {
            return file.dir && arg.test(relativePath);
          });
        }
        var name = this.root + arg;
        var newFolder = folderAdd.call(this, name);
        var ret = this.clone();
        ret.root = newFolder.name;
        return ret;
      },
      /**
       * Delete a file, or a directory and all sub-files, from the zip
       * @param {string} name the name of the file to delete
       * @return {JSZip} this JSZip object
       */
      remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (!file) {
          if (name.slice(-1) !== "/") {
            name += "/";
          }
          file = this.files[name];
        }
        if (file && !file.dir) {
          delete this.files[name];
        } else {
          var kids = this.filter(function(relativePath, file2) {
            return file2.name.slice(0, name.length) === name;
          });
          for (var i = 0; i < kids.length; i++) {
            delete this.files[kids[i].name];
          }
        }
        return this;
      },
      /**
       * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
       */
      generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Generate the complete zip file as an internal stream.
       * @param {Object} options the options to generate the zip file :
       * - compression, "STORE" by default.
       * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
       * @return {StreamHelper} the streamed zip file.
       */
      generateInternalStream: function(options) {
        var worker, opts = {};
        try {
          opts = utils.extend(options || {}, {
            streamFiles: false,
            compression: "STORE",
            compressionOptions: null,
            type: "",
            platform: "DOS",
            comment: null,
            mimeType: "application/zip",
            encodeFileName: utf8.utf8encode
          });
          opts.type = opts.type.toLowerCase();
          opts.compression = opts.compression.toUpperCase();
          if (opts.type === "binarystring") {
            opts.type = "string";
          }
          if (!opts.type) {
            throw new Error("No output type specified.");
          }
          utils.checkSupport(opts.type);
          if (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") {
            opts.platform = "UNIX";
          }
          if (opts.platform === "win32") {
            opts.platform = "DOS";
          }
          var comment = opts.comment || this.comment || "";
          worker = generate2.generateWorker(this, opts, comment);
        } catch (e) {
          worker = new GenericWorker("error");
          worker.error(e);
        }
        return new StreamHelper(worker, opts.type || "string", opts.mimeType);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateAsync: function(options, onUpdate) {
        return this.generateInternalStream(options).accumulate(onUpdate);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateNodeStream: function(options, onUpdate) {
        options = options || {};
        if (!options.type) {
          options.type = "nodebuffer";
        }
        return this.generateInternalStream(options).toNodejsStream(onUpdate);
      }
    };
    module.exports = out;
  }
});

// node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = __commonJS({
  "node_modules/jszip/lib/reader/DataReader.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function DataReader(data) {
      this.data = data;
      this.length = data.length;
      this.index = 0;
      this.zero = 0;
    }
    DataReader.prototype = {
      /**
       * Check that the offset will not go too far.
       * @param {string} offset the additional offset to check.
       * @throws {Error} an Error if the offset is out of bounds.
       */
      checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
      },
      /**
       * Check that the specified index will not be too far.
       * @param {string} newIndex the index to check.
       * @throws {Error} an Error if the index is out of bounds.
       */
      checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0) {
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
        }
      },
      /**
       * Change the index.
       * @param {number} newIndex The new index.
       * @throws {Error} if the new index is out of the data.
       */
      setIndex: function(newIndex) {
        this.checkIndex(newIndex);
        this.index = newIndex;
      },
      /**
       * Skip the next n bytes.
       * @param {number} n the number of bytes to skip.
       * @throws {Error} if the new index is out of the data.
       */
      skip: function(n) {
        this.setIndex(this.index + n);
      },
      /**
       * Get the byte at the specified index.
       * @param {number} i the index to use.
       * @return {number} a byte.
       */
      byteAt: function() {
      },
      /**
       * Get the next number with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {number} the corresponding number.
       */
      readInt: function(size) {
        var result = 0, i;
        this.checkOffset(size);
        for (i = this.index + size - 1; i >= this.index; i--) {
          result = (result << 8) + this.byteAt(i);
        }
        this.index += size;
        return result;
      },
      /**
       * Get the next string with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {string} the corresponding string.
       */
      readString: function(size) {
        return utils.transformTo("string", this.readData(size));
      },
      /**
       * Get raw data without conversion, <size> bytes.
       * @param {number} size the number of bytes to read.
       * @return {Object} the raw data, implementation specific.
       */
      readData: function() {
      },
      /**
       * Find the last occurrence of a zip signature (4 bytes).
       * @param {string} sig the signature to find.
       * @return {number} the index of the last occurrence, -1 if not found.
       */
      lastIndexOfSignature: function() {
      },
      /**
       * Read the signature (4 bytes) at the current position and compare it with sig.
       * @param {string} sig the expected signature
       * @return {boolean} true if the signature matches, false otherwise.
       */
      readAndCheckSignature: function() {
      },
      /**
       * Get the next date.
       * @return {Date} the date.
       */
      readDate: function() {
        var dostime = this.readInt(4);
        return new Date(Date.UTC(
          (dostime >> 25 & 127) + 1980,
          // year
          (dostime >> 21 & 15) - 1,
          // month
          dostime >> 16 & 31,
          // day
          dostime >> 11 & 31,
          // hour
          dostime >> 5 & 63,
          // minute
          (dostime & 31) << 1
        ));
      }
    };
    module.exports = DataReader;
  }
});

// node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/ArrayReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function ArrayReader(data) {
      DataReader.call(this, data);
      for (var i = 0; i < this.data.length; i++) {
        data[i] = data[i] & 255;
      }
    }
    utils.inherits(ArrayReader, DataReader);
    ArrayReader.prototype.byteAt = function(i) {
      return this.data[this.zero + i];
    };
    ArrayReader.prototype.lastIndexOfSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
      for (var i = this.length - 4; i >= 0; --i) {
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
          return i - this.zero;
        }
      }
      return -1;
    };
    ArrayReader.prototype.readAndCheckSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
      return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
    };
    ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return [];
      }
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = ArrayReader;
  }
});

// node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = __commonJS({
  "node_modules/jszip/lib/reader/StringReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader();
    var utils = require_utils();
    function StringReader(data) {
      DataReader.call(this, data);
    }
    utils.inherits(StringReader, DataReader);
    StringReader.prototype.byteAt = function(i) {
      return this.data.charCodeAt(this.zero + i);
    };
    StringReader.prototype.lastIndexOfSignature = function(sig) {
      return this.data.lastIndexOf(sig) - this.zero;
    };
    StringReader.prototype.readAndCheckSignature = function(sig) {
      var data = this.readData(4);
      return sig === data;
    };
    StringReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = StringReader;
  }
});

// node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/Uint8ArrayReader.js"(exports, module) {
    "use strict";
    var ArrayReader = require_ArrayReader();
    var utils = require_utils();
    function Uint8ArrayReader(data) {
      ArrayReader.call(this, data);
    }
    utils.inherits(Uint8ArrayReader, ArrayReader);
    Uint8ArrayReader.prototype.readData = function(size) {
      this.checkOffset(size);
      if (size === 0) {
        return new Uint8Array(0);
      }
      var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = Uint8ArrayReader;
  }
});

// node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = __commonJS({
  "node_modules/jszip/lib/reader/NodeBufferReader.js"(exports, module) {
    "use strict";
    var Uint8ArrayReader = require_Uint8ArrayReader();
    var utils = require_utils();
    function NodeBufferReader(data) {
      Uint8ArrayReader.call(this, data);
    }
    utils.inherits(NodeBufferReader, Uint8ArrayReader);
    NodeBufferReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      this.index += size;
      return result;
    };
    module.exports = NodeBufferReader;
  }
});

// node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = __commonJS({
  "node_modules/jszip/lib/reader/readerFor.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var support = require_support();
    var ArrayReader = require_ArrayReader();
    var StringReader = require_StringReader();
    var NodeBufferReader = require_NodeBufferReader();
    var Uint8ArrayReader = require_Uint8ArrayReader();
    module.exports = function(data) {
      var type = utils.getTypeOf(data);
      utils.checkSupport(type);
      if (type === "string" && !support.uint8array) {
        return new StringReader(data);
      }
      if (type === "nodebuffer") {
        return new NodeBufferReader(data);
      }
      if (support.uint8array) {
        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
      }
      return new ArrayReader(utils.transformTo("array", data));
    };
  }
});

// node_modules/jszip/lib/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/jszip/lib/zipEntry.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var CompressedObject = require_compressedObject();
    var crc32fn = require_crc32();
    var utf8 = require_utf8();
    var compressions = require_compressions();
    var support = require_support();
    var MADE_BY_DOS = 0;
    var MADE_BY_UNIX = 3;
    var findCompression = function(compressionMethod) {
      for (var method in compressions) {
        if (!Object.prototype.hasOwnProperty.call(compressions, method)) {
          continue;
        }
        if (compressions[method].magic === compressionMethod) {
          return compressions[method];
        }
      }
      return null;
    };
    function ZipEntry(options, loadOptions) {
      this.options = options;
      this.loadOptions = loadOptions;
    }
    ZipEntry.prototype = {
      /**
       * say if the file is encrypted.
       * @return {boolean} true if the file is encrypted, false otherwise.
       */
      isEncrypted: function() {
        return (this.bitFlag & 1) === 1;
      },
      /**
       * say if the file has utf-8 filename/comment.
       * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
       */
      useUTF8: function() {
        return (this.bitFlag & 2048) === 2048;
      },
      /**
       * Read the local part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;
        reader.skip(22);
        this.fileNameLength = reader.readInt(2);
        localExtraFieldsLength = reader.readInt(2);
        this.fileName = reader.readData(this.fileNameLength);
        reader.skip(localExtraFieldsLength);
        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        }
        compression = findCompression(this.compressionMethod);
        if (compression === null) {
          throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
        }
        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2);
        reader.skip(2);
        this.bitFlag = reader.readInt(2);
        this.compressionMethod = reader.readString(2);
        this.date = reader.readDate();
        this.crc32 = reader.readInt(4);
        this.compressedSize = reader.readInt(4);
        this.uncompressedSize = reader.readInt(4);
        var fileNameLength = reader.readInt(2);
        this.extraFieldsLength = reader.readInt(2);
        this.fileCommentLength = reader.readInt(2);
        this.diskNumberStart = reader.readInt(2);
        this.internalFileAttributes = reader.readInt(2);
        this.externalFileAttributes = reader.readInt(4);
        this.localHeaderOffset = reader.readInt(4);
        if (this.isEncrypted()) {
          throw new Error("Encrypted zip are not supported");
        }
        reader.skip(fileNameLength);
        this.readExtraFields(reader);
        this.parseZIP64ExtraField(reader);
        this.fileComment = reader.readData(this.fileCommentLength);
      },
      /**
       * Parse the external file attributes and get the unix/dos permissions.
       */
      processAttributes: function() {
        this.unixPermissions = null;
        this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;
        this.dir = this.externalFileAttributes & 16 ? true : false;
        if (madeBy === MADE_BY_DOS) {
          this.dosPermissions = this.externalFileAttributes & 63;
        }
        if (madeBy === MADE_BY_UNIX) {
          this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
        }
        if (!this.dir && this.fileNameStr.slice(-1) === "/") {
          this.dir = true;
        }
      },
      /**
       * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
       * @param {DataReader} reader the reader to use.
       */
      parseZIP64ExtraField: function() {
        if (!this.extraFields[1]) {
          return;
        }
        var extraReader = readerFor(this.extraFields[1].value);
        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
          this.uncompressedSize = extraReader.readInt(8);
        }
        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
          this.compressedSize = extraReader.readInt(8);
        }
        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
          this.localHeaderOffset = extraReader.readInt(8);
        }
        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
          this.diskNumberStart = extraReader.readInt(4);
        }
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readExtraFields: function(reader) {
        var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
        if (!this.extraFields) {
          this.extraFields = {};
        }
        while (reader.index + 4 < end) {
          extraFieldId = reader.readInt(2);
          extraFieldLength = reader.readInt(2);
          extraFieldValue = reader.readData(extraFieldLength);
          this.extraFields[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
        reader.setIndex(end);
      },
      /**
       * Apply an UTF8 transformation if needed.
       */
      handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) {
          this.fileNameStr = utf8.utf8decode(this.fileName);
          this.fileCommentStr = utf8.utf8decode(this.fileComment);
        } else {
          var upath = this.findExtraFieldUnicodePath();
          if (upath !== null) {
            this.fileNameStr = upath;
          } else {
            var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
          }
          var ucomment = this.findExtraFieldUnicodeComment();
          if (ucomment !== null) {
            this.fileCommentStr = ucomment;
          } else {
            var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
          }
        }
      },
      /**
       * Find the unicode path declared in the extra field, if any.
       * @return {String} the unicode path, null otherwise.
       */
      findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[28789];
        if (upathField) {
          var extraReader = readerFor(upathField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(upathField.length - 5));
        }
        return null;
      },
      /**
       * Find the unicode comment declared in the extra field, if any.
       * @return {String} the unicode comment, null otherwise.
       */
      findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[25461];
        if (ucommentField) {
          var extraReader = readerFor(ucommentField.value);
          if (extraReader.readInt(1) !== 1) {
            return null;
          }
          if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
            return null;
          }
          return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
        }
        return null;
      }
    };
    module.exports = ZipEntry;
  }
});

// node_modules/jszip/lib/zipEntries.js
var require_zipEntries = __commonJS({
  "node_modules/jszip/lib/zipEntries.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor();
    var utils = require_utils();
    var sig = require_signature();
    var ZipEntry = require_zipEntry();
    var support = require_support();
    function ZipEntries(loadOptions) {
      this.files = [];
      this.loadOptions = loadOptions;
    }
    ZipEntries.prototype = {
      /**
       * Check that the reader is on the specified signature.
       * @param {string} expectedSignature the expected signature.
       * @throws {Error} if it is an other signature.
       */
      checkSignature: function(expectedSignature) {
        if (!this.reader.readAndCheckSignature(expectedSignature)) {
          this.reader.index -= 4;
          var signature = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
      },
      /**
       * Check if the given signature is at the given index.
       * @param {number} askedIndex the index to check.
       * @param {string} expectedSignature the signature to expect.
       * @return {boolean} true if the signature is here, false otherwise.
       */
      isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4);
        var result = signature === expectedSignature;
        this.reader.setIndex(currentIndex);
        return result;
      },
      /**
       * Read the end of the central directory.
       */
      readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2);
        this.diskWithCentralDirStart = this.reader.readInt(2);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
        this.centralDirRecords = this.reader.readInt(2);
        this.centralDirSize = this.reader.readInt(4);
        this.centralDirOffset = this.reader.readInt(4);
        this.zipCommentLength = this.reader.readInt(2);
        var zipComment = this.reader.readData(this.zipCommentLength);
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        var decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
      },
      /**
       * Read the end of the Zip 64 central directory.
       * Not merged with the method readEndOfCentral :
       * The end of central can coexist with its Zip64 brother,
       * I don't want to read the wrong number of bytes !
       */
      readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8);
        this.reader.skip(4);
        this.diskNumber = this.reader.readInt(4);
        this.diskWithCentralDirStart = this.reader.readInt(4);
        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
        this.centralDirRecords = this.reader.readInt(8);
        this.centralDirSize = this.reader.readInt(8);
        this.centralDirOffset = this.reader.readInt(8);
        this.zip64ExtensibleData = {};
        var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue;
        while (index < extraDataSize) {
          extraFieldId = this.reader.readInt(2);
          extraFieldLength = this.reader.readInt(4);
          extraFieldValue = this.reader.readData(extraFieldLength);
          this.zip64ExtensibleData[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        }
      },
      /**
       * Read the end of the Zip 64 central directory locator.
       */
      readBlockZip64EndOfCentralLocator: function() {
        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
        this.disksCount = this.reader.readInt(4);
        if (this.disksCount > 1) {
          throw new Error("Multi-volumes zip are not supported");
        }
      },
      /**
       * Read the local files, based on the offset read in the central part.
       */
      readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++) {
          file = this.files[i];
          this.reader.setIndex(file.localHeaderOffset);
          this.checkSignature(sig.LOCAL_FILE_HEADER);
          file.readLocalPart(this.reader);
          file.handleUTF8();
          file.processAttributes();
        }
      },
      /**
       * Read the central directory.
       */
      readCentralDir: function() {
        var file;
        this.reader.setIndex(this.centralDirOffset);
        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
          file = new ZipEntry({
            zip64: this.zip64
          }, this.loadOptions);
          file.readCentralPart(this.reader);
          this.files.push(file);
        }
        if (this.centralDirRecords !== this.files.length) {
          if (this.centralDirRecords !== 0 && this.files.length === 0) {
            throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          } else {
          }
        }
      },
      /**
       * Read the end of central directory.
       */
      readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
          var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
          if (isGarbage) {
            throw new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          } else {
            throw new Error("Corrupted zip: can't find end of central directory");
          }
        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
        this.readBlockEndOfCentral();
        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
          this.zip64 = true;
          offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          if (offset < 0) {
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          }
          this.reader.setIndex(offset);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
          this.readBlockZip64EndOfCentralLocator();
          if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
            this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
            if (this.relativeOffsetEndOfZip64CentralDir < 0) {
              throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            }
          }
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
          this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
          this.readBlockZip64EndOfCentral();
        }
        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        if (this.zip64) {
          expectedEndOfCentralDirOffset += 20;
          expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
        }
        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
        if (extraBytes > 0) {
          if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
          } else {
            this.reader.zero = extraBytes;
          }
        } else if (extraBytes < 0) {
          throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
        }
      },
      prepareReader: function(data) {
        this.reader = readerFor(data);
      },
      /**
       * Read a zip file and create ZipEntries.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
       */
      load: function(data) {
        this.prepareReader(data);
        this.readEndOfCentral();
        this.readCentralDir();
        this.readLocalFiles();
      }
    };
    module.exports = ZipEntries;
  }
});

// node_modules/jszip/lib/load.js
var require_load = __commonJS({
  "node_modules/jszip/lib/load.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var external = require_external();
    var utf8 = require_utf8();
    var ZipEntries = require_zipEntries();
    var Crc32Probe = require_Crc32Probe();
    var nodejsUtils = require_nodejsUtils();
    function checkEntryCRC32(zipEntry) {
      return new external.Promise(function(resolve, reject) {
        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
        worker.on("error", function(e) {
          reject(e);
        }).on("end", function() {
          if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
            reject(new Error("Corrupted zip : CRC32 mismatch"));
          } else {
            resolve();
          }
        }).resume();
      });
    }
    module.exports = function(data, options) {
      var zip = this;
      options = utils.extend(options || {}, {
        base64: false,
        checkCRC32: false,
        optimizedBinaryString: false,
        createFolders: false,
        decodeFileName: utf8.utf8decode
      });
      if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
      }
      return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function(data2) {
        var zipEntries = new ZipEntries(options);
        zipEntries.load(data2);
        return zipEntries;
      }).then(function checkCRC32(zipEntries) {
        var promises = [external.Promise.resolve(zipEntries)];
        var files = zipEntries.files;
        if (options.checkCRC32) {
          for (var i = 0; i < files.length; i++) {
            promises.push(checkEntryCRC32(files[i]));
          }
        }
        return external.Promise.all(promises);
      }).then(function addFiles(results) {
        var zipEntries = results.shift();
        var files = zipEntries.files;
        for (var i = 0; i < files.length; i++) {
          var input = files[i];
          var unsafeName = input.fileNameStr;
          var safeName = utils.resolve(input.fileNameStr);
          zip.file(safeName, input.decompressed, {
            binary: true,
            optimizedBinaryString: true,
            date: input.date,
            dir: input.dir,
            comment: input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
          });
          if (!input.dir) {
            zip.file(safeName).unsafeOriginalName = unsafeName;
          }
        }
        if (zipEntries.zipComment.length) {
          zip.comment = zipEntries.zipComment;
        }
        return zip;
      });
    };
  }
});

// node_modules/jszip/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/jszip/lib/index.js"(exports, module) {
    "use strict";
    function JSZip4() {
      if (!(this instanceof JSZip4)) {
        return new JSZip4();
      }
      if (arguments.length) {
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
      }
      this.files = /* @__PURE__ */ Object.create(null);
      this.comment = null;
      this.root = "";
      this.clone = function() {
        var newObj = new JSZip4();
        for (var i in this) {
          if (typeof this[i] !== "function") {
            newObj[i] = this[i];
          }
        }
        return newObj;
      };
    }
    JSZip4.prototype = require_object();
    JSZip4.prototype.loadAsync = require_load();
    JSZip4.support = require_support();
    JSZip4.defaults = require_defaults();
    JSZip4.version = "3.10.1";
    JSZip4.loadAsync = function(content, options) {
      return new JSZip4().loadAsync(content, options);
    };
    JSZip4.external = require_external();
    module.exports = JSZip4;
  }
});

// vendor/TelopEditor/tools/telopkit/src/cli.ts
import fs5 from "node:fs";
import path5 from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// vendor/TelopEditor/tools/telopkit/src/build.ts
var import_jszip2 = __toESM(require_lib3(), 1);
import fs2 from "node:fs";
import path2 from "node:path";

// vendor/TelopEditor/src/domain/ids/idRegex.ts
var NODE_ID_REGEX = /^n1_[a-z0-9]{12}$/;
var ASSET_ID_REGEX = /^a1_[a-z0-9]{12}$/;

// vendor/TelopEditor/src/domain/ids/idFactory.ts
function randomBase36(len) {
  let out = "";
  while (out.length < len) {
    out += Math.random().toString(36).slice(2);
  }
  return out.slice(0, len);
}
function generate(prefix, regex) {
  while (true) {
    const id = `${prefix}${randomBase36(12)}`;
    if (regex.test(id)) return id;
  }
}
function newAnyNodeId() {
  return generate("n1_", NODE_ID_REGEX);
}
function newPlaneNodeId() {
  return newAnyNodeId();
}
function newNodeId() {
  return newAnyNodeId();
}
function newAssetId() {
  return generate("a1_", ASSET_ID_REGEX);
}

// vendor/TelopEditor/src/domain/projectdoc/createInitialProjectDoc.ts
function createInitialProjectDoc(title = "New Project") {
  const rootId = newPlaneNodeId();
  return {
    meta: {
      title,
      version: 1,
      canvas: { width: 1920, height: 1080 }
    },
    rootId,
    nodesById: {
      [rootId]: {
        id: rootId,
        type: "plane",
        parentId: null,
        children: [],
        name: "Root",
        visible: true,
        locked: false,
        // TransformProps
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        pivotX: 0,
        pivotY: 0,
        skewX: 0,
        skewY: 0,
        opacity: 1,
        blendMode: "normal",
        effects: []
      }
    },
    assets: {},
    assetGroups: {}
  };
}

// vendor/TelopEditor/src/domain/projectdoc/errors.ts
var ProjectDocError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "ProjectDocError";
    this.code = code;
  }
};

// vendor/TelopEditor/src/domain/projectdoc/invariants.ts
function allowedChildTypes(parentType) {
  switch (parentType) {
    case "plane":
      return /* @__PURE__ */ new Set(["telop"]);
    case "telop":
      return /* @__PURE__ */ new Set(["group", "text", "image", "rect"]);
    case "group":
      return /* @__PURE__ */ new Set(["group", "text", "image", "rect"]);
    default:
      return /* @__PURE__ */ new Set();
  }
}
function isLeafType(t) {
  return t === "text" || t === "image" || t === "rect";
}
function hasOwn(obj, key2) {
  return Object.prototype.hasOwnProperty.call(obj, key2);
}
function asNodeId(s) {
  return s;
}
function asAssetId(s) {
  return s;
}
function nodeKey(id) {
  return id;
}
function assertProjectDoc(doc) {
  const rootId = doc.rootId;
  const root = doc.nodesById[rootId];
  if (!root) {
    throw new ProjectDocError("INVALID_ROOT", `rootId not found: ${nodeKey(rootId)}`);
  }
  if (root.type !== "plane") {
    throw new ProjectDocError("INVALID_ROOT", `root node must be plane. actual=${root.type}`);
  }
  if (root.parentId !== null) {
    throw new ProjectDocError("INVALID_ROOT", `root parentId must be null: ${nodeKey(rootId)}`);
  }
  for (const [idStr, node] of Object.entries(doc.nodesById)) {
    const id = asNodeId(idStr);
    if (isLeafType(node.type)) {
      if (hasOwn(node, "children")) {
        throw new ProjectDocError("INVALID_LEAF_CHILDREN", `leaf node must not have children: ${nodeKey(id)}`);
      }
    } else {
      if (!hasOwn(node, "children")) {
        throw new ProjectDocError("PLACEMENT_RULE", `container node missing children: ${nodeKey(id)}`);
      }
      const children = node.children;
      if (!Array.isArray(children)) {
        throw new ProjectDocError("PLACEMENT_RULE", `children must be array: ${nodeKey(id)}`);
      }
      const seen = /* @__PURE__ */ new Set();
      for (const childId of children) {
        const cidStr = String(childId);
        if (seen.has(cidStr)) {
          throw new ProjectDocError("DUPLICATE_CHILD", `duplicate child ${cidStr} in parent ${nodeKey(id)}`);
        }
        seen.add(cidStr);
      }
    }
    if (!hasOwn(node, "parentId")) {
      throw new ProjectDocError("MISSING_PARENT", `node missing parentId: ${nodeKey(id)}`);
    }
    if (node.type === "image") {
      const aid = asAssetId(String(node.assetId));
      if (!doc.assets[aid]) {
        console.warn(
          `[ProjectDoc] Image node references missing asset: ${aid} (node ${nodeKey(id)})`
        );
      }
    }
  }
  const parentFromChildren = /* @__PURE__ */ new Map();
  for (const [pidStr, pnode] of Object.entries(doc.nodesById)) {
    const pid = asNodeId(pidStr);
    if (isLeafType(pnode.type)) continue;
    const children = pnode.children;
    if (!Array.isArray(children)) continue;
    const allow = allowedChildTypes(pnode.type);
    for (const childRaw of children) {
      const cid = asNodeId(String(childRaw));
      const child = doc.nodesById[cid];
      if (!child) {
        throw new ProjectDocError("MISSING_NODE", `missing child node: ${nodeKey(cid)} (parent ${nodeKey(pid)})`);
      }
      if (!allow.has(child.type)) {
        throw new ProjectDocError(
          "PLACEMENT_RULE",
          `illegal child type ${child.type} under ${pnode.type}: child=${nodeKey(cid)} parent=${nodeKey(pid)}`
        );
      }
      const existing = parentFromChildren.get(cid);
      if (existing && existing !== pid) {
        throw new ProjectDocError(
          "MULTI_PARENT",
          `node has multiple parents: ${nodeKey(cid)} (${nodeKey(existing)}, ${nodeKey(pid)})`
        );
      }
      parentFromChildren.set(cid, pid);
      const declaredParent = child.parentId;
      if (declaredParent === null) {
        throw new ProjectDocError("MISSING_PARENT", `non-root node parentId must not be null: ${nodeKey(cid)}`);
      }
      if (declaredParent !== pid) {
        throw new ProjectDocError(
          "PARENT_MISMATCH",
          `child.parentId mismatch: child=${nodeKey(cid)} declared=${nodeKey(declaredParent)} actual=${nodeKey(pid)}`
        );
      }
    }
  }
  for (const [idStr, node] of Object.entries(doc.nodesById)) {
    const id = asNodeId(idStr);
    if (id === rootId) continue;
    const declaredParent = node.parentId;
    if (declaredParent === null) {
      throw new ProjectDocError("MISSING_PARENT", `non-root node parentId must not be null: ${nodeKey(id)}`);
    }
    const parent = doc.nodesById[declaredParent];
    if (!parent) {
      throw new ProjectDocError(
        "MISSING_NODE",
        `missing parent node: ${nodeKey(declaredParent)} (child ${nodeKey(id)})`
      );
    }
    if (isLeafType(parent.type)) {
      throw new ProjectDocError(
        "PLACEMENT_RULE",
        `leaf node cannot be a parent: parent=${nodeKey(declaredParent)} child=${nodeKey(id)}`
      );
    }
    const actual = parentFromChildren.get(id);
    if (!actual) {
      throw new ProjectDocError("UNREACHABLE_NODE", `unreachable node (not in any children list): ${nodeKey(id)}`);
    }
  }
  const visited = /* @__PURE__ */ new Set();
  const visiting = /* @__PURE__ */ new Set();
  const dfs = (id) => {
    if (visiting.has(id)) throw new ProjectDocError("CYCLE", `cycle detected at ${nodeKey(id)}`);
    if (visited.has(id)) return;
    const node = doc.nodesById[id];
    if (!node) throw new ProjectDocError("MISSING_NODE", `missing node: ${nodeKey(id)}`);
    visiting.add(id);
    if (!isLeafType(node.type)) {
      const children = node.children;
      if (Array.isArray(children)) {
        for (const childRaw of children) {
          dfs(asNodeId(String(childRaw)));
        }
      }
    }
    visiting.delete(id);
    visited.add(id);
  };
  dfs(rootId);
  for (const idStr of Object.keys(doc.nodesById)) {
    const id = asNodeId(idStr);
    if (!visited.has(id)) {
      throw new ProjectDocError("UNREACHABLE_NODE", `unreachable node: ${nodeKey(id)}`);
    }
  }
}

// vendor/TelopEditor/src/domain/commands/errors.ts
var CommandPreconditionError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "CommandPreconditionError";
    this.code = code;
  }
};
var CommandApplyError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "CommandApplyError";
    this.code = code;
  }
};
var CommandInvertError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "CommandInvertError";
    this.code = code;
  }
};

// vendor/TelopEditor/src/domain/commands/ops/addNode.ts
var addNode_exports = {};
__export(addNode_exports, {
  apply: () => apply,
  invert: () => invert,
  kind: () => kind,
  preconditions: () => preconditions
});

// vendor/TelopEditor/src/domain/commands/preconditions.ts
function key(id) {
  return String(id);
}
function getNodeOrThrow(doc, nodeId) {
  const id = key(nodeId);
  const node = doc.nodesById[id];
  if (!node) throw new CommandPreconditionError("MISSING_NODE", `node not found: ${id} `);
  return node;
}
function getParentIdOrThrow(doc, childId) {
  const cid = key(childId);
  if (cid === key(doc.rootId)) {
    throw new CommandPreconditionError("NO_PARENT", `root has no parent: ${cid} `);
  }
  for (const [pid, node] of Object.entries(doc.nodesById)) {
    if (hasChildren(node) && node.children.some((x) => key(x) === cid)) return pid;
  }
  throw new CommandPreconditionError("NO_PARENT", `parent not found for: ${cid} `);
}
function hasChildren(node) {
  const allowed = allowedChildTypes(node.type);
  return allowed.size > 0;
}
function allowedChildTypes2(parentType) {
  return allowedChildTypes(parentType);
}
function isTransformableType(t) {
  return t !== "plane" && t !== "telop";
}
function keyOf(id) {
  return key(id);
}

// vendor/TelopEditor/src/domain/projectdoc/utils/nameUtils.ts
function generateUniqueName(doc, baseName) {
  const escapedBase = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedBase} (\\d+)$`);
  let maxNum = 0;
  for (const id in doc.nodesById) {
    const node = doc.nodesById[id];
    if (!node) continue;
    if (node.name) {
      const match = node.name.match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }
  return `${baseName} ${maxNum + 1}`;
}

// vendor/TelopEditor/src/domain/projectdoc/tree.ts
function ensureMutableNode(doc, id) {
  const node = doc.nodesById[id];
  if (!node) throw new ProjectDocError("MISSING_NODE", `Node not found: ${id}`);
  const clone = { ...node };
  if ("children" in clone && Array.isArray(clone.children)) {
    clone.children = [...clone.children];
  }
  doc.nodesById[id] = clone;
  return clone;
}
function attachChild(doc, parentId, childId, index) {
  const parent = ensureMutableNode(doc, parentId);
  const child = ensureMutableNode(doc, childId);
  if (isLeafType(parent.type)) {
    throw new ProjectDocError("PLACEMENT_RULE", `Cannot attach child to leaf node: ${parentId}`);
  }
  const allowed = allowedChildTypes(parent.type);
  if (!allowed.has(child.type)) {
    throw new ProjectDocError("PLACEMENT_RULE", `Cannot attach ${child.type} to ${parent.type}`);
  }
  const parentContainer = parent;
  if (parentContainer.children.includes(childId)) {
    throw new ProjectDocError("DUPLICATE_CHILD", `Child ${childId} is already in parent ${parentId}`);
  }
  if (typeof index === "number") {
    parentContainer.children.splice(index, 0, childId);
  } else {
    parentContainer.children.push(childId);
  }
  child.parentId = parentId;
}
function detachChild(doc, parentId, childId) {
  const parent = ensureMutableNode(doc, parentId);
  const parentContainer = parent;
  const idx = parentContainer.children.indexOf(childId);
  if (idx === -1) {
    console.warn(`[Tree] detachChild: Child ${childId} not found in parent ${parentId}. Skipping.`);
    return;
  }
  parentContainer.children.splice(idx, 1);
}
function moveChild(doc, fromParentId, toParentId, childId, index) {
  if (fromParentId === toParentId) {
    const parent = ensureMutableNode(doc, fromParentId);
    const oldIndex = parent.children.indexOf(childId);
    if (oldIndex === -1) throw new ProjectDocError("MISSING_NODE", `Child ${childId} not in ${fromParentId}`);
    parent.children.splice(oldIndex, 1);
    let newIndex;
    if (typeof index !== "number") {
      newIndex = parent.children.length;
    } else {
      newIndex = index;
      if (oldIndex < newIndex) {
        newIndex -= 1;
      }
    }
    if (newIndex > parent.children.length) newIndex = parent.children.length;
    if (newIndex < 0) newIndex = 0;
    parent.children.splice(newIndex, 0, childId);
    return;
  }
  detachChild(doc, fromParentId, childId);
  attachChild(doc, toParentId, childId, index);
}
function deleteSubtree(doc, rootId) {
  const node = doc.nodesById[rootId];
  if (!node) return;
  if (!isLeafType(node.type)) {
    const children = node.children;
    if (Array.isArray(children)) {
      for (const cid of children) {
        deleteSubtree(doc, cid);
      }
    }
  }
  delete doc.nodesById[rootId];
}

// vendor/TelopEditor/src/domain/commands/ops/addNode.ts
function k(id) {
  return String(id);
}
function cloneDoc(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
function replaceNode(doc, node) {
  doc.nodesById[k(node.id)] = node;
}
var kind = "AddNode";
function preconditions(doc, cmd) {
  const parent = getNodeOrThrow(doc, cmd.parentId);
  if (!hasChildren(parent)) {
    throw new CommandPreconditionError(
      "INVALID_PARENT",
      `parent must be container. parent=${keyOf(cmd.parentId)} type=${parent.type}`
    );
  }
  const newId = keyOf(cmd.node.id);
  if (doc.nodesById[newId]) {
    throw new CommandPreconditionError("DUPLICATE_ID", `node id already exists: ${newId}`);
  }
  const allow = allowedChildTypes2(parent.type);
  if (!allow.has(cmd.node.type)) {
    throw new CommandPreconditionError(
      "PLACEMENT_RULE",
      `cannot add child type ${cmd.node.type} under ${parent.type}`
    );
  }
  if (cmd.node.type === "telop" || cmd.node.type === "group") {
    if (!Array.isArray(cmd.node.children)) {
      throw new CommandPreconditionError("INVALID_NODE", `new ${cmd.node.type} must have children array`);
    }
  }
  if (cmd.node.type === "text" || cmd.node.type === "image" || cmd.node.type === "rect") {
    if (cmd.node.children !== void 0) {
      throw new CommandPreconditionError("INVALID_NODE", `leaf node must not have children`);
    }
  }
  if (cmd.node.type === "telop") {
    if (cmd.node.transform !== void 0) {
      throw new CommandPreconditionError("INVALID_NODE", `telop must not have transform`);
    }
  } else {
    if (!isTransformableType(cmd.node.type)) {
      throw new CommandPreconditionError("INVALID_NODE", `unexpected node type: ${cmd.node.type}`);
    }
    if (cmd.node.x === void 0) {
      throw new CommandPreconditionError("INVALID_NODE", `${cmd.node.type} must have transform properties (x)`);
    }
  }
  if (cmd.node.type === "image") {
    const aid = keyOf(cmd.node.assetId);
    if (!doc.assets[aid]) {
      throw new CommandPreconditionError("INVALID_ASSET_REF", `missing asset: ${aid}`);
    }
  }
  if (cmd.index !== void 0) {
    const len = parent.children.length;
    if (!Number.isInteger(cmd.index) || cmd.index < 0 || cmd.index > len) {
      throw new CommandPreconditionError(
        "INDEX_OUT_OF_RANGE",
        `index out of range: ${cmd.index} (len=${len})`
      );
    }
  }
}
function apply(doc, cmd) {
  const next = cloneDoc(doc);
  const parentId = k(cmd.parentId);
  const newNode = { ...cmd.node };
  let baseName = null;
  if (newNode.name === "New Telop" || newNode.name === "Telop") baseName = "Telop";
  else if (newNode.name === "New Text" || newNode.name === "Text") baseName = "Text";
  else if (newNode.name === "Group") baseName = "Group";
  else if (newNode.name === "Image") baseName = "Image";
  if (baseName) {
    newNode.name = generateUniqueName(doc, baseName);
  }
  newNode.parentId = parentId;
  replaceNode(next, newNode);
  try {
    attachChild(next, parentId, newNode.id, cmd.index);
  } catch (e) {
    throw e;
  }
  assertProjectDoc(next);
  return next;
}
function invert(_docBefore, cmd) {
  return { kind: "RemoveNode", nodeId: cmd.node.id };
}

// vendor/TelopEditor/src/domain/commands/ops/removeNode.ts
var removeNode_exports = {};
__export(removeNode_exports, {
  apply: () => apply2,
  invert: () => invert2,
  kind: () => kind2,
  preconditions: () => preconditions2
});
function k2(id) {
  return String(id);
}
function cloneDoc2(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
function collectSubtreeNodes(doc, rootId) {
  const out = {};
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop();
    const node = doc.nodesById[id];
    if (!node) throw new CommandInvertError("MISSING_NODE", `missing node while collecting subtree: ${id}`);
    out[id] = node;
    const anyNode = node;
    if (Array.isArray(anyNode.children)) {
      for (const c of anyNode.children) stack.push(k2(c));
    }
  }
  return out;
}
function findParentAndIndex(doc, childId) {
  for (const [pid, node] of Object.entries(doc.nodesById)) {
    const anyNode = node;
    if (Array.isArray(anyNode.children)) {
      const idx = anyNode.children.findIndex((x) => k2(x) === childId);
      if (idx >= 0) return { parentId: pid, index: idx };
    }
  }
  throw new CommandInvertError("NO_PARENT", `parent not found for: ${childId}`);
}
var kind2 = "RemoveNode";
function preconditions2(doc, cmd) {
  const id = keyOf(cmd.nodeId);
  if (id === keyOf(doc.rootId)) {
    throw new CommandPreconditionError("INVALID_TARGET", `cannot remove root: ${id}`);
  }
  if (!doc.nodesById[id]) {
    throw new CommandPreconditionError("MISSING_NODE", `node not found: ${id}`);
  }
  getParentIdOrThrow(doc, cmd.nodeId);
}
function apply2(doc, cmd) {
  const next = cloneDoc2(doc);
  const targetId = k2(cmd.nodeId);
  const parentId = getParentIdOrThrow(next, cmd.nodeId);
  detachChild(next, parentId, targetId);
  deleteSubtree(next, targetId);
  assertProjectDoc(next);
  return next;
}
function invert2(docBefore, cmd) {
  const targetId = k2(cmd.nodeId);
  const { parentId, index } = findParentAndIndex(docBefore, targetId);
  const nodesById = collectSubtreeNodes(docBefore, targetId);
  const inv = {
    kind: "RestoreSubtree",
    parentId,
    index,
    rootId: targetId,
    nodesById
  };
  return inv;
}

// vendor/TelopEditor/src/domain/commands/ops/setProps.ts
var setProps_exports = {};
__export(setProps_exports, {
  apply: () => apply3,
  invert: () => invert3,
  kind: () => kind3,
  preconditions: () => preconditions3
});
function k3(id) {
  return String(id);
}
function cloneDoc3(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
var kind3 = "SetProps";
function preconditions3(doc, cmd) {
  const id = keyOf(cmd.nodeId);
  if (!doc.nodesById[id]) {
    throw new CommandPreconditionError("MISSING_NODE", `node not found: ${id}`);
  }
  if (!cmd.patch || typeof cmd.patch !== "object") {
    throw new CommandPreconditionError("INVALID_PATCH", `patch must be object`);
  }
}
function apply3(doc, cmd) {
  const next = cloneDoc3(doc);
  const id = k3(cmd.nodeId);
  const node = getNodeOrThrow(next, cmd.nodeId);
  if (cmd.patch && Object.prototype.hasOwnProperty.call(cmd.patch, "type")) {
    throw new CommandApplyError("INVALID_PATCH", `cannot patch 'type': ${id}`);
  }
  if (cmd.patch && Object.prototype.hasOwnProperty.call(cmd.patch, "id")) {
    throw new CommandApplyError("INVALID_PATCH", `cannot patch 'id': ${id}`);
  }
  const patch = { ...cmd.patch };
  if (typeof patch.x === "number") patch.x = Math.round(patch.x);
  if (typeof patch.y === "number") patch.y = Math.round(patch.y);
  if (typeof patch.width === "number") patch.width = Math.round(patch.width);
  if (typeof patch.height === "number") patch.height = Math.round(patch.height);
  next.nodesById[id] = { ...node, ...patch };
  return next;
}
function invert3(docBefore, cmd) {
  const id = k3(cmd.nodeId);
  const node = docBefore.nodesById[id];
  if (!node) {
    throw new CommandInvertError("MISSING_NODE", `missing node for SetProps invert: ${id}`);
  }
  const patch = {};
  for (const prop of Object.keys(cmd.patch ?? {})) {
    if (prop === "id" || prop === "type") continue;
    patch[prop] = node[prop];
  }
  return { kind: "SetProps", nodeId: cmd.nodeId, patch };
}

// vendor/TelopEditor/src/domain/commands/ops/setTransform.ts
var setTransform_exports = {};
__export(setTransform_exports, {
  apply: () => apply4,
  invert: () => invert4,
  kind: () => kind4,
  preconditions: () => preconditions4
});
function k4(id) {
  return String(id);
}
function cloneDoc4(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
var kind4 = "SetTransform";
function preconditions4(doc, cmd) {
  const id = keyOf(cmd.nodeId);
  const node = doc.nodesById[id];
  if (!node) {
    throw new CommandPreconditionError("MISSING_NODE", `node not found: ${id}`);
  }
  if (!isTransformableType(node.type)) {
    throw new CommandPreconditionError(
      "INVALID_TARGET",
      `SetTransform target must be group/text/image. actual=${node.type} id=${id}`
    );
  }
  const t = cmd.transform;
  if (!t || typeof t !== "object") {
    throw new CommandPreconditionError("INVALID_TRANSFORM", "transform must be object");
  }
  for (const kk of ["x", "y", "scaleX", "scaleY", "rotation", "skewX", "skewY"]) {
    if (t[kk] !== void 0 && (typeof t[kk] !== "number" || !Number.isFinite(t[kk]))) {
      throw new CommandPreconditionError("INVALID_TRANSFORM", `transform.${kk} must be finite number`);
    }
  }
}
function apply4(doc, cmd) {
  const next = cloneDoc4(doc);
  const id = k4(cmd.nodeId);
  const node = getNodeOrThrow(next, cmd.nodeId);
  const t = { ...cmd.transform };
  if (typeof t.x === "number") t.x = Math.round(t.x);
  if (typeof t.y === "number") t.y = Math.round(t.y);
  if (typeof t.width === "number") t.width = Math.round(t.width);
  if (typeof t.height === "number") t.height = Math.round(t.height);
  next.nodesById[id] = {
    skewX: 0,
    skewY: 0,
    ...node,
    ...t
  };
  return next;
}
function invert4(docBefore, cmd) {
  const id = k4(cmd.nodeId);
  const node = docBefore.nodesById[id];
  if (!node) {
    throw new CommandInvertError("MISSING_NODE", `missing transform source node: ${id}`);
  }
  const prevTransform = {
    x: node.x,
    y: node.y,
    scaleX: node.scaleX,
    scaleY: node.scaleY,
    rotation: node.rotation,
    pivotX: node.pivotX,
    pivotY: node.pivotY,
    skewX: node.skewX || 0,
    skewY: node.skewY || 0,
    opacity: node.opacity
  };
  return { kind: "SetTransform", nodeId: cmd.nodeId, transform: prevTransform };
}

// vendor/TelopEditor/src/domain/commands/ops/restoreSubtree.ts
var restoreSubtree_exports = {};
__export(restoreSubtree_exports, {
  apply: () => apply5,
  invert: () => invert5,
  kind: () => kind5,
  preconditions: () => preconditions5
});
function k5(id) {
  return String(id);
}
function cloneDoc5(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
var kind5 = "RestoreSubtree";
function preconditions5(doc, cmd) {
  const parent = getNodeOrThrow(doc, cmd.parentId);
  if (!hasChildren(parent)) {
    throw new CommandPreconditionError(
      "INVALID_PARENT",
      `parent must be container. parent=${keyOf(cmd.parentId)} type=${parent.type}`
    );
  }
  const rootId = keyOf(cmd.rootId);
  const subtree = cmd.nodesById;
  if (!subtree || typeof subtree !== "object") {
    throw new CommandPreconditionError("INVALID_NODE", "nodesById must be object");
  }
  if (!subtree[rootId]) {
    throw new CommandPreconditionError("INVALID_NODE", `nodesById missing rootId: ${rootId}`);
  }
  for (const id of Object.keys(subtree)) {
    if (doc.nodesById[id]) {
      throw new CommandPreconditionError("DUPLICATE_ID", `node id already exists: ${id}`);
    }
  }
  const allow = allowedChildTypes2(parent.type);
  const rootNode = subtree[rootId];
  if (!allow.has(rootNode.type)) {
    throw new CommandPreconditionError(
      "PLACEMENT_RULE",
      `cannot restore root type ${rootNode.type} under ${parent.type}`
    );
  }
  if (cmd.index !== void 0) {
    const len = parent.children.length;
    if (!Number.isInteger(cmd.index) || cmd.index < 0 || cmd.index > len) {
      throw new CommandPreconditionError(
        "INDEX_OUT_OF_RANGE",
        `index out of range: ${cmd.index} (len=${len})`
      );
    }
  }
  for (const node of Object.values(subtree)) {
    if (node.type === "image") {
      const aid = keyOf(node.assetId);
      if (!doc.assets[aid]) {
        throw new CommandPreconditionError("INVALID_ASSET_REF", `missing asset: ${aid}`);
      }
    }
  }
}
function apply5(doc, cmd) {
  const next = cloneDoc5(doc);
  const parentId = k5(cmd.parentId);
  for (const [id, node] of Object.entries(cmd.nodesById)) {
    next.nodesById[id] = node;
  }
  attachChild(next, parentId, cmd.rootId, cmd.index);
  assertProjectDoc(next);
  return next;
}
function invert5(_docBefore, cmd) {
  return { kind: "RemoveNode", nodeId: cmd.rootId };
}

// vendor/TelopEditor/src/domain/commands/ops/moveNode.ts
var moveNode_exports = {};
__export(moveNode_exports, {
  apply: () => apply6,
  invert: () => invert6,
  kind: () => kind6,
  preconditions: () => preconditions6
});
function k6(id) {
  return String(id);
}
function cloneDoc6(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
function collectSubtreeIds(doc, rootId) {
  const out = /* @__PURE__ */ new Set();
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop();
    out.add(id);
    const node = doc.nodesById[id];
    if (node && Array.isArray(node.children)) {
      for (const c of node.children) stack.push(k6(c));
    }
  }
  return out;
}
function findParentAndIndex2(doc, childId) {
  for (const [pid, node] of Object.entries(doc.nodesById)) {
    const anyNode = node;
    if (Array.isArray(anyNode.children)) {
      const idx = anyNode.children.findIndex((x) => k6(x) === childId);
      if (idx >= 0) return { parentId: pid, index: idx };
    }
  }
  throw new CommandInvertError("NO_PARENT", `parent not found for: ${childId}`);
}
var kind6 = "MoveNode";
function preconditions6(doc, cmd) {
  const nodeId = keyOf(cmd.nodeId);
  const toParentId = keyOf(cmd.toParentId);
  if (nodeId === keyOf(doc.rootId)) {
    throw new CommandPreconditionError("INVALID_TARGET", `cannot move root`);
  }
  const node = getNodeOrThrow(doc, cmd.nodeId);
  const toParent = getNodeOrThrow(doc, cmd.toParentId);
  if (!hasChildren(toParent)) {
    throw new CommandPreconditionError("INVALID_PARENT", `destination must be container`);
  }
  const allow = allowedChildTypes2(toParent.type);
  if (!allow.has(node.type)) {
    throw new CommandPreconditionError("PLACEMENT_RULE", `cannot move ${node.type} under ${toParent.type}`);
  }
  const subtree = collectSubtreeIds(doc, nodeId);
  if (subtree.has(toParentId)) {
    throw new CommandPreconditionError("PLACEMENT_RULE", `cannot move under own subtree`);
  }
  getParentIdOrThrow(doc, cmd.nodeId);
  if (cmd.toIndex !== void 0) {
    const len = toParent.children.length;
    if (!Number.isInteger(cmd.toIndex) || cmd.toIndex < 0 || cmd.toIndex > len) {
      throw new CommandPreconditionError("INDEX_OUT_OF_RANGE", `index out of range`);
    }
  }
}
function apply6(doc, cmd) {
  const next = cloneDoc6(doc);
  const fromParentId = getParentIdOrThrow(next, cmd.nodeId);
  const toParentId = k6(cmd.toParentId);
  moveChild(next, fromParentId, toParentId, cmd.nodeId, cmd.toIndex);
  assertProjectDoc(next);
  return next;
}
function invert6(docBefore, cmd) {
  const nodeId = k6(cmd.nodeId);
  const { parentId, index } = findParentAndIndex2(docBefore, nodeId);
  return {
    kind: "MoveNode",
    nodeId: cmd.nodeId,
    toParentId: parentId,
    toIndex: index
  };
}

// vendor/TelopEditor/src/domain/commands/ops/moveMultipleNodes.ts
var moveMultipleNodes_exports = {};
__export(moveMultipleNodes_exports, {
  apply: () => apply7,
  invert: () => invert7,
  kind: () => kind7,
  preconditions: () => preconditions7
});
var kind7 = "MoveMultipleNodes";
function k7(id) {
  return String(id);
}
function cloneDocShallow(doc) {
  return {
    meta: { ...doc.meta },
    rootId: doc.rootId,
    nodesById: { ...doc.nodesById },
    assets: { ...doc.assets },
    assetGroups: { ...doc.assetGroups }
  };
}
function ensureClonedContainer(doc, id) {
  const node = getNodeOrThrow(doc, id);
  if (!Array.isArray(node.children)) return node;
  const cloned = { ...node, children: [...node.children] };
  doc.nodesById[id] = cloned;
  return cloned;
}
function collectSubtreeIds2(doc, rootId) {
  const out = /* @__PURE__ */ new Set();
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop();
    if (out.has(id)) continue;
    out.add(id);
    const node = doc.nodesById[id];
    if (node && Array.isArray(node.children)) {
      for (const c of node.children) stack.push(k7(c));
    }
  }
  return out;
}
function buildParentIndexMap(doc) {
  const map = /* @__PURE__ */ new Map();
  for (const [pid, node] of Object.entries(doc.nodesById)) {
    const anyNode = node;
    if (!Array.isArray(anyNode.children)) continue;
    for (let i = 0; i < anyNode.children.length; i++) {
      map.set(k7(anyNode.children[i]), { parentId: pid, index: i });
    }
  }
  return map;
}
function normalizeNodeIds(doc, rawIds) {
  const ids = Array.from(new Set(rawIds.map(k7)));
  const rootId = k7(doc.rootId);
  const filtered = ids.filter((id) => id !== rootId);
  const selected = new Set(filtered);
  const toRemove = /* @__PURE__ */ new Set();
  for (const id of filtered) {
    const subtree = collectSubtreeIds2(doc, id);
    for (const sub of subtree) {
      if (sub !== id && selected.has(sub)) toRemove.add(sub);
    }
  }
  const minimal = filtered.filter((id) => !toRemove.has(id));
  const parentMap = buildParentIndexMap(doc);
  minimal.sort((a, b) => {
    const pa = parentMap.get(a);
    const pb = parentMap.get(b);
    if (pa && pb && pa.parentId === pb.parentId) return pa.index - pb.index;
    return a.localeCompare(b);
  });
  return minimal;
}
function preconditions7(doc, cmd) {
  const toParentId = keyOf(cmd.toParentId);
  const toParent = getNodeOrThrow(doc, cmd.toParentId);
  if (!hasChildren(toParent)) {
    throw new CommandPreconditionError("INVALID_PARENT", "destination must be container");
  }
  const nodeIds = normalizeNodeIds(doc, cmd.nodeIds);
  if (nodeIds.length === 0) {
    throw new CommandPreconditionError("INVALID_TARGET", "no movable nodes");
  }
  const rootId = k7(doc.rootId);
  for (const id of nodeIds) {
    if (id === rootId) {
      throw new CommandPreconditionError("INVALID_TARGET", "cannot move root");
    }
    getNodeOrThrow(doc, id);
  }
  const allow = allowedChildTypes2(toParent.type);
  for (const id of nodeIds) {
    const node = getNodeOrThrow(doc, id);
    if (!allow.has(node.type)) {
      throw new CommandPreconditionError("PLACEMENT_RULE", `cannot move ${node.type} under ${toParent.type}`);
    }
    const subtree = collectSubtreeIds2(doc, id);
    if (subtree.has(toParentId)) {
      throw new CommandPreconditionError("PLACEMENT_RULE", "cannot move under own subtree");
    }
  }
  const parentMap = buildParentIndexMap(doc);
  const removedFromToParentIds = nodeIds.filter((id) => parentMap.get(id)?.parentId === toParentId);
  const totalRemovedCount = removedFromToParentIds.length;
  const removedBeforeCount = removedFromToParentIds.filter((id) => parentMap.get(id).index < cmd.toIndex).length;
  const effectiveLen = toParent.children.length - totalRemovedCount;
  const effectiveIndex = cmd.toIndex - removedBeforeCount;
  if (!Number.isInteger(cmd.toIndex) || effectiveIndex < 0 || effectiveIndex > effectiveLen) {
    throw new CommandPreconditionError("INDEX_OUT_OF_RANGE", `index out of range`);
  }
}
function apply7(doc, cmd) {
  const docBefore = doc;
  const next = cloneDocShallow(docBefore);
  const toParentId = k7(cmd.toParentId);
  const nodeIds = normalizeNodeIds(docBefore, cmd.nodeIds);
  const parentMapBefore = buildParentIndexMap(docBefore);
  const affectedParents = /* @__PURE__ */ new Set();
  affectedParents.add(toParentId);
  for (const id of nodeIds) {
    const pi = parentMapBefore.get(id);
    if (!pi) throw new CommandApplyError("INTERNAL", `parent not found for: ${id}`);
    affectedParents.add(pi.parentId);
  }
  for (const pid of affectedParents) {
    ensureClonedContainer(next, pid);
  }
  const removalsByParent = /* @__PURE__ */ new Map();
  for (const id of nodeIds) {
    const pi = parentMapBefore.get(id);
    const list = removalsByParent.get(pi.parentId) ?? [];
    list.push({ childId: id, index: pi.index });
    removalsByParent.set(pi.parentId, list);
  }
  for (const [pid, list] of removalsByParent.entries()) {
    const parent = getNodeOrThrow(next, pid);
    if (!Array.isArray(parent.children)) {
      throw new CommandApplyError("INTERNAL", `parent has no children: ${pid}`);
    }
    list.sort((a, b) => b.index - a.index);
    for (const r of list) {
      const idx = parent.children.findIndex((x) => k7(x) === r.childId);
      if (idx < 0) throw new CommandApplyError("INTERNAL", `node not found in parent: ${r.childId}`);
      parent.children.splice(idx, 1);
    }
  }
  let insertAt = cmd.toIndex;
  const removedBeforeInToParent = nodeIds.map((id) => parentMapBefore.get(id)).filter((pi) => pi.parentId === toParentId && pi.index < cmd.toIndex).length;
  insertAt -= removedBeforeInToParent;
  if (insertAt < 0) insertAt = 0;
  const toParent = getNodeOrThrow(next, toParentId);
  if (!Array.isArray(toParent.children)) {
    throw new CommandApplyError("INTERNAL", "destination must be container");
  }
  toParent.children.splice(insertAt, 0, ...nodeIds);
  for (const id of nodeIds) {
    const node = ensureMutableNode(next, id);
    node.parentId = toParentId;
  }
  assertProjectDoc(next);
  return next;
}
function invert7(docBefore, cmd) {
  const nodeIds = normalizeNodeIds(docBefore, cmd.nodeIds);
  const parentMapBefore = buildParentIndexMap(docBefore);
  const moves = nodeIds.map((id) => {
    const pi = parentMapBefore.get(id);
    if (!pi) throw new CommandInvertError("NO_PARENT", `parent not found for: ${id}`);
    return {
      kind: "MoveNode",
      nodeId: id,
      toParentId: pi.parentId,
      toIndex: pi.index
    };
  });
  moves.sort((a, b) => {
    const ap = k7(a.toParentId);
    const bp = k7(b.toParentId);
    if (ap === bp) return (b.toIndex ?? 0) - (a.toIndex ?? 0);
    return ap.localeCompare(bp);
  });
  return {
    kind: "Batch",
    commands: moves
  };
}

// vendor/TelopEditor/src/domain/commands/ops/addAsset.ts
var addAsset_exports = {};
__export(addAsset_exports, {
  apply: () => apply8,
  invert: () => invert8,
  preconditions: () => preconditions8
});
function preconditions8(doc, cmd) {
  if (doc.assets[cmd.asset.id]) {
    throw new CommandPreconditionError("DUPLICATE_ID", "Asset ID already exists");
  }
}
function apply8(doc, cmd) {
  return {
    ...doc,
    assets: {
      ...doc.assets,
      [cmd.asset.id]: cmd.asset
    }
  };
}
function invert8(doc, cmd) {
  return { kind: "RemoveAsset", assetId: cmd.asset.id };
}

// vendor/TelopEditor/src/domain/commands/ops/removeAsset.ts
var removeAsset_exports = {};
__export(removeAsset_exports, {
  apply: () => apply9,
  invert: () => invert9,
  preconditions: () => preconditions9
});
function preconditions9(doc, cmd) {
  if (!doc.assets[cmd.assetId]) {
    throw new CommandPreconditionError("INVALID_ASSET_REF", "Asset ID does not exist");
  }
}
function apply9(doc, cmd) {
  const { [cmd.assetId]: removed, ...rest } = doc.assets;
  return {
    ...doc,
    assets: rest
  };
}
function invert9(doc, cmd) {
  const asset = doc.assets[cmd.assetId];
  return {
    kind: "AddAsset",
    asset
  };
}

// vendor/TelopEditor/src/domain/commands/ops/addAssetGroup.ts
var addAssetGroup_exports = {};
__export(addAssetGroup_exports, {
  apply: () => apply10,
  invert: () => invert10,
  preconditions: () => preconditions10
});
function preconditions10(doc, cmd) {
  if (doc.assetGroups[cmd.group.id]) {
    throw new CommandPreconditionError("DUPLICATE_ID", "Asset Group ID already exists");
  }
}
function apply10(doc, cmd) {
  return {
    ...doc,
    assetGroups: {
      ...doc.assetGroups || {},
      [cmd.group.id]: cmd.group
    }
  };
}
function invert10(doc, cmd) {
  return { kind: "RemoveAssetGroup", groupId: cmd.group.id };
}

// vendor/TelopEditor/src/domain/commands/ops/removeAssetGroup.ts
var removeAssetGroup_exports = {};
__export(removeAssetGroup_exports, {
  apply: () => apply11,
  invert: () => invert11,
  preconditions: () => preconditions11
});
function preconditions11(doc, cmd) {
  if (!doc.assetGroups[cmd.groupId]) {
    throw new CommandPreconditionError("INVALID_GROUP", "Asset Group ID does not exist");
  }
}
function apply11(doc, cmd) {
  const groups = doc.assetGroups || {};
  const { [cmd.groupId]: removed, ...restGroups } = groups;
  const nextAssets = { ...doc.assets };
  for (const assetId in nextAssets) {
    if (nextAssets[assetId].groupId === cmd.groupId) {
      nextAssets[assetId] = {
        ...nextAssets[assetId],
        groupId: null
      };
    }
  }
  return {
    ...doc,
    assetGroups: restGroups,
    assets: nextAssets
  };
}
function invert11(doc, cmd) {
  const group = doc.assetGroups[cmd.groupId];
  return { kind: "AddAssetGroup", group };
}

// vendor/TelopEditor/src/domain/commands/ops/renameAssetGroup.ts
var renameAssetGroup_exports = {};
__export(renameAssetGroup_exports, {
  apply: () => apply12,
  invert: () => invert12,
  preconditions: () => preconditions12
});
function preconditions12(doc, cmd) {
  if (!doc.assetGroups[cmd.groupId]) {
    throw new CommandPreconditionError("INVALID_GROUP", "Asset Group ID does not exist");
  }
}
function apply12(doc, cmd) {
  const groups = doc.assetGroups || {};
  return {
    ...doc,
    assetGroups: {
      ...groups,
      [cmd.groupId]: {
        ...groups[cmd.groupId],
        name: cmd.newName
      }
    }
  };
}
function invert12(doc, cmd) {
  return {
    kind: "RenameAssetGroup",
    groupId: cmd.groupId,
    newName: doc.assetGroups[cmd.groupId].name
  };
}

// vendor/TelopEditor/src/domain/commands/ops/moveAssetsToGroup.ts
var moveAssetsToGroup_exports = {};
__export(moveAssetsToGroup_exports, {
  apply: () => apply13,
  invert: () => invert13,
  preconditions: () => preconditions13
});
function preconditions13(doc, cmd) {
  for (const aid of cmd.assetIds) {
    if (!doc.assets[aid]) {
      throw new CommandPreconditionError("INVALID_ASSET", `Asset ${aid} does not exist`);
    }
  }
  if (cmd.toGroupId !== null && !doc.assetGroups[cmd.toGroupId]) {
    throw new CommandPreconditionError("INVALID_GROUP", `Group ${cmd.toGroupId} does not exist`);
  }
}
function apply13(doc, cmd) {
  const nextAssets = { ...doc.assets };
  for (const aid of cmd.assetIds) {
    nextAssets[aid] = {
      ...nextAssets[aid],
      groupId: cmd.toGroupId
    };
  }
  return {
    ...doc,
    assets: nextAssets
  };
}
function invert13(doc, cmd) {
  const commands = cmd.assetIds.map((aid) => ({
    kind: "MoveAssetsToGroup",
    assetIds: [aid],
    toGroupId: doc.assets[aid].groupId
  }));
  return {
    kind: "Batch",
    commands
  };
}

// vendor/TelopEditor/src/domain/commands/ops/duplicateSubtree.ts
var duplicateSubtree_exports = {};
__export(duplicateSubtree_exports, {
  apply: () => apply14,
  invert: () => invert14,
  kind: () => kind8,
  preconditions: () => preconditions14
});
var kind8 = "DuplicateSubtree";
function preconditions14(doc, cmd) {
  getNodeOrThrow(doc, cmd.nodeId);
  if (doc.nodesById[cmd.newRootId]) {
    throw new CommandPreconditionError("DUPLICATE_ID", `newRootId already exists: ${cmd.newRootId}`);
  }
}
function apply14(doc, cmd) {
  const original = doc.nodesById[cmd.nodeId];
  if (!original) throw new CommandPreconditionError("MISSING_NODE", `Node ${cmd.nodeId} not found`);
  let parentId = null;
  if (original.parentId) {
    parentId = original.parentId;
  } else {
    throw new CommandPreconditionError("INVALID_TARGET", `Cannot duplicate root`);
  }
  const next = {
    ...doc,
    nodesById: { ...doc.nodesById }
    // Shallow copy to mutate safely (assuming CoW is enough for top level)
    // Note: tree utils need mutable nodes. explicit cloning in loop below
  };
  const newNodes = {};
  function clone(id, newId) {
    const src = doc.nodesById[id];
    if (!src) throw new CommandPreconditionError("MISSING_NODE", `Subtree node ${id} missing`);
    const dst = { ...src, id: newId };
    const anySrc = src;
    if (Array.isArray(anySrc.children)) {
      dst.children = anySrc.children.map((childId) => {
        const mappedId = cmd.mapping[childId];
        if (!mappedId) {
          throw new CommandPreconditionError("MISSING_MAPPING", `No mapping for child ${childId}`);
        }
        const childNode = clone(childId, mappedId);
        childNode.parentId = newId;
        newNodes[mappedId] = childNode;
        return mappedId;
      });
    }
    return dst;
  }
  const newRoot = clone(cmd.nodeId, cmd.newRootId);
  newNodes[cmd.newRootId] = newRoot;
  Object.assign(next.nodesById, newNodes);
  const parent = doc.nodesById[parentId];
  const idx = parent.children.indexOf(cmd.nodeId);
  const insertIndex = idx === -1 ? void 0 : idx + 1;
  attachChild(next, parentId, cmd.newRootId, insertIndex);
  assertProjectDoc(next);
  return next;
}
function invert14(_docBefore, cmd) {
  return {
    kind: "RemoveNode",
    nodeId: cmd.newRootId
  };
}

// vendor/TelopEditor/src/domain/commands/ops/setProjectMeta.ts
var setProjectMeta_exports = {};
__export(setProjectMeta_exports, {
  apply: () => apply15,
  invert: () => invert15,
  preconditions: () => preconditions15
});
var preconditions15 = (doc, cmd) => {
};
var apply15 = (doc, cmd) => {
  return {
    ...doc,
    meta: {
      ...doc.meta,
      ...cmd.meta
    }
  };
};
var invert15 = (doc, cmd) => {
  const inverseMeta = {};
  for (const key2 of Object.keys(cmd.meta)) {
    inverseMeta[key2] = doc.meta[key2];
  }
  return {
    kind: "SetProjectMeta",
    meta: inverseMeta
  };
};

// vendor/TelopEditor/src/domain/commands/registry.ts
var documentOps = {
  AddNode: addNode_exports,
  RemoveNode: removeNode_exports,
  MoveNode: moveNode_exports,
  MoveMultipleNodes: moveMultipleNodes_exports,
  SetProps: setProps_exports,
  SetTransform: setTransform_exports,
  RestoreSubtree: restoreSubtree_exports,
  Batch: {
    // Batch is special, handeled in apply
    preconditions: () => {
    },
    apply: () => {
      throw new Error("Batch should be handled in apply");
    },
    invert: () => {
      throw new Error("Batch invert should be handled implicitly or we need logic");
    }
  },
  DuplicateSubtree: duplicateSubtree_exports,
  AddAsset: addAsset_exports,
  RemoveAsset: removeAsset_exports,
  AddAssetGroup: addAssetGroup_exports,
  RemoveAssetGroup: removeAssetGroup_exports,
  RenameAssetGroup: renameAssetGroup_exports,
  MoveAssetsToGroup: moveAssetsToGroup_exports,
  SetProjectMeta: setProjectMeta_exports
};

// vendor/TelopEditor/src/domain/commands/apply.ts
function applyDocumentCommand(doc, cmd) {
  if (cmd.kind === "Batch") {
    let current = doc;
    for (const sub of cmd.commands) {
      current = documentOps[sub.kind].apply(current, sub);
    }
    if (true) assertProjectDoc(current);
    return current;
  }
  documentOps[cmd.kind].preconditions(doc, cmd);
  const next = documentOps[cmd.kind].apply(doc, cmd);
  if (true) assertProjectDoc(next);
  return next;
}

// vendor/TelopEditor/src/persistence/ProjectExporter.ts
var import_jszip = __toESM(require_lib3(), 1);

// stub:file-saver
function saveAs() {
}

// vendor/TelopEditor/src/persistence/SVGRendererCode.ts
var SVGRendererCoreCode = `/**
 * Shared SVG rendering core.
 * This file is imported as ESM in the Editor and injected as a raw string in the Player.
 */
function setAttributes(el, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
        if (value === undefined)
            return;
        const sVal = String(value);
        if (sVal === "NaN" || sVal.includes("undefined")) {
            return;
        }
        if (key === "xml:space") {
            el.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", sVal);
        }
        else {
            el.setAttribute(key, sVal);
        }
    });
}
function parseHex8(hex) {
    if (Array.isArray(hex))
        hex = hex[0] || "#ffffff";
    if (!hex || typeof hex !== 'string' || !hex.startsWith("#") || hex === "undefined") {
        return { color: (hex && hex !== "undefined") ? hex : '#ffffff', alpha: 1 };
    }
    const h = hex.replace("#", "");
    if (h.length === 8) {
        return { color: "#" + h.substring(0, 6), alpha: parseInt(h.substring(6, 8), 16) / 255 };
    }
    return { color: hex, alpha: 1 };
}
function applyCommonProps(el, node) {
    const px = Number(node.pivotX ?? 0);
    const py = Number(node.pivotY ?? 0);
    const x = Number(node.x ?? 0);
    const y = Number(node.y ?? 0);
    const rotation = Number(node.rotation ?? 0);
    const skewX = Number(node.skewX ?? 0) || 0;
    const skewY = Number(node.skewY ?? 0) || 0;
    const scaleX = node.scaleX !== undefined ? Number(node.scaleX) : 1;
    const scaleY = node.scaleY !== undefined ? Number(node.scaleY) : 1;
    const opacity = node.opacity !== undefined ? Number(node.opacity) : 1;
    const visibility = node.visible === false ? "hidden" : "inherit";
    const sX = isFinite(scaleX) ? scaleX : 1;
    const sY = isFinite(scaleY) ? scaleY : 1;
    const skX = isFinite(skewX) ? skewX : 0;
    const skY = isFinite(skewY) ? skewY : 0;
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tX = Math.tan((skX * Math.PI) / 180);
    const tY = Math.tan((skY * Math.PI) / 180);
    // Konva's order: T * R * Sk * Sc * Toffset
    // Matrix: [a c e]
    //         [b d f]
    // 1. Toffset: [1 0 -px]
    //             [0 1 -py]
    // 2. Sc: [sX 0 0]
    //        [0 sY 0]
    // 3. Sk: [1 tX 0]
    //        [tY 1 0]
    // 4. R: [cos -sin 0]
    //       [sin  cos 0]
    // 5. T: [1 0 x]
    //       [0 1 y]
    // Combined Sk * Sc * Toffset:
    // [sX   tX*sY   -sX*px - tX*sY*py]
    // [tY*sX  sY    -tY*sX*px - sY*py]
    const m11 = sX;
    const m12 = tX * sY;
    const m21 = tY * sX;
    const m22 = sY;
    const m13 = -sX * px - tX * sY * py;
    const m23 = -tY * sX * px - sY * py;
    // Now apply R:
    // [cos -sin] * [m11 m12 m13]
    // [sin  cos]   [m21 m22 m23]
    const r11 = cos * m11 - sin * m21;
    const r12 = cos * m12 - sin * m22;
    const r13 = cos * m13 - sin * m23;
    const r21 = sin * m11 + cos * m21;
    const r22 = sin * m12 + cos * m22;
    const r23 = sin * m13 + cos * m23;
    // Finally apply T:
    const a = r11;
    const b = r21;
    const c = r12;
    const d = r22;
    const e = r13 + x;
    const f = r23 + y;
    const transform = \`matrix(\${a}, \${b}, \${c}, \${d}, \${e}, \${f})\`;
    setAttributes(el, {
        transform,
        opacity,
        visibility,
        "data-node-id": node.id
    });
    if (node.visible === false) {
        el.setAttribute("display", "none");
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("animation", "none", "important");
        el.classList.add("is-invisible");
    }
    else {
        el.removeAttribute("display");
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.style.removeProperty("opacity");
        el.style.removeProperty("animation");
        el.classList.remove("is-invisible");
    }
}
function setupTextBase(text, node, measuredW, measuredH) {
    const fontSize = Number(node.style?.fontSize || 24);
    const targetWidth = Number(node.width || 0);
    const align = (targetWidth > 0 && (node.align === 'right' || node.align === 'center')) ? node.align : 'left';
    let textAnchor = 'start';
    if (align === 'right')
        textAnchor = 'end';
    else if (align === 'center')
        textAnchor = 'middle';
    const attrs = {
        "font-family": node.style?.fontFamily || "sans-serif",
        "font-size": fontSize,
        "font-weight": (node.style?.fontWeight === 'bold' || node.style?.fontWeight === '700' || node.style?.fontWeight === 700) ? 'bold' : 'normal',
        "font-style": (node.style?.fontStyle === 'italic') ? 'italic' : 'normal',
        "text-anchor": textAnchor,
        "dominant-baseline": "hanging",
        "alignment-baseline": "hanging",
        "text-rendering": "geometricPrecision",
        "xml:space": "preserve",
        "style": "white-space: pre;",
        x: 0,
        y: 0
    };
    if (node.style?.letterSpacing !== undefined) {
        attrs["letter-spacing"] = \`\${node.style.letterSpacing}px\`;
    }
    setAttributes(text, attrs);
    text.textContent = node.text || "";
}
/**
 * Draws the content of an appearance layer (shadow, stroke, or fill)
 */
function drawAppearanceContent(target, app, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement) {
    const rawW = measuredW !== undefined ? measuredW : (isRect ? node.width : undefined);
    const rawH = measuredH !== undefined ? measuredH : (isRect ? node.height : undefined);
    // Fallback to node top-level width/height if not passed
    const w = Number(rawW ?? (node.width || (isRect ? 100 : 0)));
    const h = Number(rawH ?? (node.height || (isRect ? 100 : 0)));
    const safeW = isFinite(w) ? w : 100;
    const safeH = isFinite(h) ? h : 100;
    const fillColors = Array.isArray(app.fill) ? app.fill : [app.fill];
    const firstFillColor = parseHex8(String(fillColors[0] || "#ffffff"));
    // Punching is used for Stroke and Shadow to avoid them bleeding behind semi-transparent fill.
    const mainNeedsPunch = app.strokeEnabled && (!app.fillEnabled || firstFillColor.alpha < 1);
    const shadowNeedsPunch = app.shadowEnabled && !app.fillEnabled;
    const createMask = (id) => {
        const mask = createSVGElement("mask");
        mask.setAttribute("id", id);
        setAttributes(mask, { maskUnits: "userSpaceOnUse", maskContentUnits: "userSpaceOnUse" });
        const whiteBg = createSVGElement("rect");
        setAttributes(whiteBg, { x: -5000, y: -5000, width: 10000, height: 10000, fill: "white" });
        mask.appendChild(whiteBg);
        const punchShape = createSVGElement(isRect ? "rect" : "text");
        if (!isRect) {
            setupTextBase(punchShape, node, measuredW, measuredH);
        }
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(punchShape, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        punchShape.setAttribute("fill", "black");
        mask.appendChild(punchShape);
        registerDef(mask);
    };
    let mainMaskId = mainNeedsPunch ? \`mask-main-\${node.id}-\${appIdx}\` : null;
    if (mainMaskId)
        createMask(mainMaskId);
    let shadowMaskId = shadowNeedsPunch ? \`mask-shadow-\${node.id}-\${appIdx}\` : null;
    if (shadowMaskId)
        createMask(shadowMaskId);
    // 1. Shadow
    if (app.shadowEnabled) {
        const shadowEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(shadowEl, node, measuredW, measuredH);
        const { color: sc, alpha: sa } = parseHex8(String(app.shadowColor || "#000000"));
        const blur = Number(app.shadowBlur || 0);
        const dx = Number(app.shadowOffsetX || 0);
        const dy = Number(app.shadowOffsetY || 0);
        const filterId = \`shadow-blur-\${node.id}-\${appIdx}\`;
        const filter = createSVGElement("filter");
        filter.setAttribute("id", filterId);
        setAttributes(filter, { x: "-50%", y: "-50%", width: "200%", height: "200%" });
        const feGaussianBlur = createSVGElement("feGaussianBlur");
        setAttributes(feGaussianBlur, { stdDeviation: (blur / 2) });
        filter.appendChild(feGaussianBlur);
        registerDef(filter);
        if (isRect) {
            setAttributes(shadowEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: Number(node.style?.cornerRadius || 0),
                ry: Number(node.style?.cornerRadius || 0),
            });
        }
        shadowEl.setAttribute("transform", \`translate(\${dx}, \${dy})\`);
        shadowEl.setAttribute("filter", \`url(#\${filterId})\`);
        const shadowAlpha = app.shadowAlpha ?? sa;
        setAttributes(shadowEl, { fill: sc, "fill-opacity": shadowAlpha });
        if (app.strokeEnabled) {
            setAttributes(shadowEl, {
                stroke: sc, "stroke-opacity": shadowAlpha,
                "stroke-width": (Number(app.thickness || 0)) * 2,
                "stroke-linejoin": app.lineJoin || "miter",
                "stroke-miterlimit": app.miterLimit !== undefined ? app.miterLimit : 10
            });
        }
        if (shadowMaskId)
            shadowEl.setAttribute("mask", \`url(#\${shadowMaskId})\`);
        target.appendChild(shadowEl);
    }
    // 2. Stroke
    if (app.strokeEnabled) {
        const strokeEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(strokeEl, node, measuredW, measuredH);
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(strokeEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        const { color, alpha } = parseHex8(app.color || "#000000");
        setAttributes(strokeEl, {
            fill: "none", stroke: color, "stroke-opacity": alpha,
            "stroke-width": (Number(app.thickness || 0)) * 2,
            "stroke-linejoin": app.lineJoin || "miter",
            "stroke-miterlimit": app.miterLimit !== undefined ? app.miterLimit : 10
        });
        if (mainMaskId)
            strokeEl.setAttribute("mask", \`url(#\${mainMaskId})\`);
        target.appendChild(strokeEl);
    }
    // 3. Fill
    if (app.fillEnabled) {
        const fillEl = createSVGElement(isRect ? "rect" : "text");
        if (!isRect)
            setupTextBase(fillEl, node, measuredW, measuredH);
        else {
            const cr = Number(node.style?.cornerRadius ?? node.background?.cornerRadius ?? 0);
            setAttributes(fillEl, {
                x: 0, y: 0, width: safeW, height: safeH,
                rx: cr,
                ry: cr,
            });
        }
        const gradientConfig = app.gradientConfig || node.style?.gradientConfig;
        if (gradientConfig && Array.isArray(gradientConfig.stops) && gradientConfig.stops.length > 0) {
            const gradId = \`fill-grad-\${node.id}-\${appIdx}\`;
            const type = gradientConfig.type || "linear";
            const units = gradientConfig.units || "objectBoundingBox";
            if (type === "radial") {
                const grad = createSVGElement("radialGradient");
                grad.setAttribute("id", gradId);
                const cx = gradientConfig.centerX ?? 0.5;
                const cy = gradientConfig.centerY ?? 0.5;
                const r = gradientConfig.radius ?? 0.5;
                setAttributes(grad, {
                    gradientUnits: units,
                    cx: units === "objectBoundingBox" ? \`\${cx * 100}%\` : cx * safeW,
                    cy: units === "objectBoundingBox" ? \`\${cy * 100}%\` : cy * safeH,
                    r: units === "objectBoundingBox" ? \`\${r * 100}%\` : r * Math.max(safeW, safeH),
                    fx: units === "objectBoundingBox" ? \`\${cx * 100}%\` : cx * safeW,
                    fy: units === "objectBoundingBox" ? \`\${cy * 100}%\` : cy * safeH,
                });
                gradientConfig.stops.forEach((s) => {
                    const stop = createSVGElement("stop");
                    const { color, alpha } = parseHex8(s.color || "#000000");
                    setAttributes(stop, { offset: \`\${(Number(s.offset || 0)) * 100}%\`, "stop-color": color, "stop-opacity": alpha });
                    grad.appendChild(stop);
                });
                registerDef(grad);
                fillEl.setAttribute("fill", \`url(#\${gradId})\`);
            }
            else {
                const grad = createSVGElement("linearGradient");
                grad.setAttribute("id", gradId);
                const angle = Number(gradientConfig.angle ?? 90);
                const rad = (angle * Math.PI) / 180;
                const x1 = 0.5 - 0.5 * Math.cos(rad), y1 = 0.5 - 0.5 * Math.sin(rad);
                const x2 = 0.5 + 0.5 * Math.cos(rad), y2 = 0.5 + 0.5 * Math.sin(rad);
                setAttributes(grad, {
                    gradientUnits: units,
                    x1: units === "objectBoundingBox" ? \`\${x1 * 100}%\` : x1 * safeW,
                    y1: units === "objectBoundingBox" ? \`\${y1 * 100}%\` : y1 * safeH,
                    x2: units === "objectBoundingBox" ? \`\${x2 * 100}%\` : x2 * safeW,
                    y2: units === "objectBoundingBox" ? \`\${y2 * 100}%\` : y2 * safeH
                });
                gradientConfig.stops.forEach((s) => {
                    const stop = createSVGElement("stop");
                    const { color, alpha } = parseHex8(s.color || "#000000");
                    setAttributes(stop, { offset: \`\${(Number(s.offset || 0)) * 100}%\`, "stop-color": color, "stop-opacity": alpha });
                    grad.appendChild(stop);
                });
                registerDef(grad);
                fillEl.setAttribute("fill", \`url(#\${gradId})\`);
            }
        }
        else {
            const { color, alpha } = parseHex8(String(fillColors[0] || "#ffffff"));
            setAttributes(fillEl, { fill: color, "fill-opacity": alpha });
        }
        target.appendChild(fillEl);
    }
    // Note: Alpha Gradient and other effects are applied to appearance layers and nodes via applyEffects()
}
const FilterFactory = {
    createFilter(effects, id, registerDef, createSVGElement) {
        const enabled = (effects || []).filter(e => e && e.enabled && e.type !== "alpha-gradient");
        if (enabled.length === 0)
            return null;
        const filter = createSVGElement("filter");
        setAttributes(filter, { id, x: "-50%", y: "-50%", width: "200%", height: "200%", filterUnits: "userSpaceOnUse" });
        let currentIn = "SourceGraphic";
        const hasPulse = enabled.some(e => e.type === "glow" && e.params?.pulseEnabled);
        if (hasPulse) {
            const style = createSVGElement("style");
            style.textContent = \`
                @keyframes glow-pulse-opacity { 0%, 100% { flood-opacity: var(--pulse-min, 0); } 50% { flood-opacity: var(--pulse-max, 1); } }
                .animate-glow-pulse { animation: glow-pulse-opacity var(--pulse-period, 1s) ease-in-out var(--pulse-delay, 0s) var(--pulse-count, infinite) both; }
            \`;
            filter.appendChild(style);
        }
        enabled.forEach((eff, idx) => {
            const res = \`eff-\${idx}\`;
            if (eff.type === 'blur') {
                const blur = createSVGElement("feGaussianBlur");
                setAttributes(blur, { in: currentIn, stdDeviation: eff.params?.strength || 4, result: res });
                filter.appendChild(blur);
                currentIn = res;
            }
            else if (eff.type === 'glow') {
                const dist = eff.params?.blur || 10;
                const { color, alpha } = parseHex8(eff.params?.color || "#ffffff");
                const outerStr = eff.params?.outerStrength ?? 2;
                const innerStr = eff.params?.innerStrength ?? 0;
                const knockout = !!eff.params?.knockout;
                const outerRes = \`\${res}-outer\`;
                const innerRes = \`\${res}-inner\`;
                if (outerStr > 0 || dist > 0) {
                    const dilate = createSVGElement("feMorphology");
                    setAttributes(dilate, { in: "SourceAlpha", operator: "dilate", radius: 1, result: \`\${res}-dil\` });
                    filter.appendChild(dilate);
                    const bl = createSVGElement("feGaussianBlur");
                    setAttributes(bl, { in: \`\${res}-dil\`, stdDeviation: dist, result: \`\${res}-bl\` });
                    filter.appendChild(bl);
                    const trans = createSVGElement("feComponentTransfer");
                    setAttributes(trans, { result: \`\${res}-int\` });
                    const funcA = createSVGElement("feFuncA");
                    setAttributes(funcA, { type: "linear", slope: outerStr });
                    trans.appendChild(funcA);
                    filter.appendChild(trans);
                    const flood = createSVGElement("feFlood");
                    setAttributes(flood, { "flood-color": color, "flood-opacity": eff.params?.pulseEnabled ? (eff.params?.pulseMin ?? 0) : alpha, result: \`\${res}-fl\` });
                    if (eff.params?.pulseEnabled) {
                        flood.classList.add("animate-glow-pulse");
                        flood.style.setProperty("--pulse-period", \`\${eff.params.pulsePeriod || 1}s\`);
                        flood.style.setProperty("--pulse-min", \`\${eff.params.pulseMin ?? 0}\`);
                        flood.style.setProperty("--pulse-max", \`\${eff.params.pulseMax ?? alpha}\`);
                        flood.style.setProperty("--pulse-count", (eff.params.pulseCount || 0) === 0 ? "infinite" : \`\${eff.params.pulseCount}\`);
                        flood.style.setProperty("--pulse-delay", \`\${eff.params.pulseDelay || 0}s\`);
                    }
                    filter.appendChild(flood);
                    const comp = createSVGElement("feComposite");
                    setAttributes(comp, { in: \`\${res}-fl\`, in2: \`\${res}-int\`, operator: "in", result: outerRes });
                    filter.appendChild(comp);
                }
                if (innerStr > 0 || dist > 0) {
                    const bl = createSVGElement("feGaussianBlur");
                    setAttributes(bl, { in: "SourceAlpha", stdDeviation: dist, result: \`\${res}-in-bl\` });
                    filter.appendChild(bl);
                    const trans = createSVGElement("feComponentTransfer");
                    setAttributes(trans, { result: \`\${res}-int\` });
                    const funcA1 = createSVGElement("feFuncA");
                    setAttributes(funcA1, { type: "gamma", amplitude: innerStr, exponent: 1.5, offset: 0 });
                    trans.appendChild(funcA1);
                    filter.appendChild(trans);
                    const comp1 = createSVGElement("feComposite");
                    setAttributes(comp1, { in: \`\${res}-int\`, in2: "SourceAlpha", operator: "in", result: \`\${res}-in-mask\` });
                    filter.appendChild(comp1);
                    const flood = createSVGElement("feFlood");
                    setAttributes(flood, { "flood-color": color, "flood-opacity": eff.params?.pulseEnabled ? (eff.params?.pulseMin ?? 0) : alpha, result: \`\${res}-in-fl\` });
                    if (eff.params?.pulseEnabled) {
                        flood.classList.add("animate-glow-pulse");
                        flood.style.setProperty("--pulse-period", \`\${eff.params.pulsePeriod || 1}s\`);
                        flood.style.setProperty("--pulse-min", \`\${eff.params.pulseMin ?? 0}\`);
                        flood.style.setProperty("--pulse-max", \`\${eff.params.pulseMax ?? alpha}\`);
                        flood.style.setProperty("--pulse-count", (eff.params.pulseCount || 0) === 0 ? "infinite" : \`\${eff.params.pulseCount}\`);
                        flood.style.setProperty("--pulse-delay", \`\${eff.params.pulseDelay || 0}s\`);
                    }
                    filter.appendChild(flood);
                    const comp2 = createSVGElement("feComposite");
                    setAttributes(comp2, { in: \`\${res}-in-fl\`, in2: \`\${res}-in-mask\`, operator: "in", result: innerRes });
                    filter.appendChild(comp2);
                }
                if (knockout) {
                    const outerPunchedName = \`\${res}-outer-punched\`;
                    if (outerStr > 0 || dist > 0) {
                        const punch = createSVGElement("feComposite");
                        setAttributes(punch, { in: outerRes, in2: "SourceAlpha", operator: "out", result: outerPunchedName });
                        filter.appendChild(punch);
                    }
                    const merge = createSVGElement("feMerge");
                    if (outerStr > 0 || dist > 0) {
                        const nO = createSVGElement("feMergeNode");
                        setAttributes(nO, { in: outerPunchedName });
                        merge.appendChild(nO);
                    }
                    if (innerStr > 0 || dist > 0) {
                        const nI = createSVGElement("feMergeNode");
                        setAttributes(nI, { in: innerRes });
                        merge.appendChild(nI);
                    }
                    setAttributes(merge, { result: res });
                    filter.appendChild(merge);
                }
                else {
                    const merge = createSVGElement("feMerge");
                    if (outerStr > 0 || dist > 0) {
                        const nO = createSVGElement("feMergeNode");
                        setAttributes(nO, { in: outerRes });
                        merge.appendChild(nO);
                    }
                    const nS = createSVGElement("feMergeNode");
                    setAttributes(nS, { in: currentIn });
                    merge.appendChild(nS);
                    if (innerStr > 0 || dist > 0) {
                        const nI = createSVGElement("feMergeNode");
                        setAttributes(nI, { in: innerRes });
                        merge.appendChild(nI);
                    }
                    setAttributes(merge, { result: res });
                    filter.appendChild(merge);
                }
                currentIn = res;
            }
            else if (eff.type === 'outline') {
                const thick = eff.params?.thickness || 2;
                const { color, alpha } = parseHex8(eff.params?.color || "#010101");
                const dil = createSVGElement("feMorphology");
                setAttributes(dil, { in: "SourceAlpha", operator: "dilate", radius: thick, result: \`\${res}-dil\` });
                filter.appendChild(dil);
                const fl = createSVGElement("feFlood");
                setAttributes(fl, { "flood-color": color, "flood-opacity": alpha, result: \`\${res}-fl\` });
                filter.appendChild(fl);
                const cp = createSVGElement("feComposite");
                setAttributes(cp, { in: \`\${res}-fl\`, in2: \`\${res}-dil\`, operator: "in", result: \`\${res}-out\` });
                filter.appendChild(cp);
                const merge = createSVGElement("feMerge");
                const n1 = createSVGElement("feMergeNode");
                setAttributes(n1, { in: \`\${res}-out\` });
                merge.appendChild(n1);
                const n2 = createSVGElement("feMergeNode");
                setAttributes(n2, { in: currentIn });
                merge.appendChild(n2);
                setAttributes(merge, { result: res });
                filter.appendChild(merge);
                currentIn = res;
            }
        });
        const primitiveCount = filter.querySelectorAll("feGaussianBlur, feMorphology, feFlood, feComposite, feMerge, feComponentTransfer").length;
        if (primitiveCount === 0)
            return null;
        registerDef(filter);
        return \`url(#\${id})\`;
    }
};
function createAlphaGradientMask(maskId, effect, node, registerDef, createSVGElement) {
    const mask = createSVGElement("mask");
    setAttributes(mask, { id: maskId, maskUnits: "objectBoundingBox", maskContentUnits: "objectBoundingBox" });
    const gradId = \`grad-mask-\${maskId}\`;
    const params = effect.params || {};
    const type = params.type || "linear";
    if (type === "radial") {
        const grad = createSVGElement("radialGradient");
        grad.setAttribute("id", gradId);
        const cx = params.centerX ?? 0.5;
        const cy = params.centerY ?? 0.5;
        const r = params.radius ?? 0.5;
        setAttributes(grad, {
            gradientUnits: "objectBoundingBox",
            cx: cx, cy: cy, r: r,
            fx: cx, fy: cy
        });
        const stops = params.stops || [];
        stops.forEach((s) => {
            const stop = createSVGElement("stop");
            const { alpha } = parseHex8(s.color || "#ffffff");
            setAttributes(stop, { offset: \`\${(Number(s.offset || 0)) * 100}%\`, "stop-color": "white", "stop-opacity": alpha });
            grad.appendChild(stop);
        });
        registerDef(grad);
    }
    else {
        const grad = createSVGElement("linearGradient");
        grad.setAttribute("id", gradId);
        const angle = Number(params.angle ?? 90);
        const r = (angle * Math.PI) / 180;
        const x1 = 0.5 - 0.5 * Math.cos(r), y1 = 0.5 - 0.5 * Math.sin(r);
        const x2 = 0.5 + 0.5 * Math.cos(r), y2 = 0.5 + 0.5 * Math.sin(r);
        setAttributes(grad, {
            gradientUnits: params.units ?? "objectBoundingBox",
            x1: x1, y1: y1, x2: x2, y2: y2
        });
        const stops = params.stops || [{ offset: 0, color: "#ffffffff" }, { offset: 1, color: "#ffffff00" }];
        stops.forEach((s) => {
            const stop = createSVGElement("stop");
            const { alpha } = parseHex8(s.color || "#ffffff");
            setAttributes(stop, { offset: \`\${(Number(s.offset || 0)) * 100}%\`, "stop-color": "white", "stop-opacity": alpha });
            grad.appendChild(stop);
        });
        registerDef(grad);
    }
    const rect = createSVGElement("rect");
    setAttributes(rect, { x: "0", y: "0", width: "1", height: "1", fill: \`url(#\${gradId})\` });
    mask.appendChild(rect);
    registerDef(mask);
}
function applyEffects(target, effects, nodeId, suffix, registerDef, createSVGElement) {
    if (!effects || !effects.some(e => e && e.enabled))
        return target;
    const enabledEffects = effects.filter(e => e && e.enabled);
    let currentTarget = target;
    const filterable = enabledEffects.filter(e => e.type !== 'alpha-gradient');
    if (filterable.length > 0) {
        const filterId = \`filter-\${nodeId}-\${suffix}\`;
        const fUrl = FilterFactory.createFilter(filterable, filterId, registerDef, createSVGElement);
        if (fUrl) {
            currentTarget.setAttribute("filter", fUrl);
        }
    }
    const gradients = enabledEffects.filter(e => e.type === 'alpha-gradient');
    gradients.forEach((eff, idx) => {
        if (currentTarget.getAttribute("mask")) {
            const wrapper = createSVGElement("g");
            if (currentTarget.parentElement) {
                currentTarget.parentElement.replaceChild(wrapper, currentTarget);
                wrapper.appendChild(currentTarget);
            }
            else {
                wrapper.appendChild(currentTarget);
            }
            currentTarget = wrapper;
        }
        const maskId = \`mask-grad-\${nodeId}-\${suffix}-\${idx}\`;
        createAlphaGradientMask(maskId, eff, { id: nodeId }, registerDef, createSVGElement);
        currentTarget.setAttribute("mask", \`url(#\${maskId})\`);
    });
    return currentTarget;
}
function createAppearanceMask(maskId, app, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement) {
    const mask = createSVGElement("mask");
    mask.setAttribute("id", maskId);
    setAttributes(mask, { maskUnits: "userSpaceOnUse", maskContentUnits: "userSpaceOnUse" });
    const bg = createSVGElement("rect");
    setAttributes(bg, { x: -5000, y: -5000, width: 10000, height: 10000 });
    bg.setAttribute("fill", app.maskMode === 'clipping' ? "black" : "white");
    mask.appendChild(bg);
    const shapeGroup = createSVGElement("g");
    const maskColor = app.maskMode === 'clipping' ? "white" : "black";
    const maskApp = { ...app, fill: maskColor, color: maskColor, shadowEnabled: false };
    drawAppearanceContent(shapeGroup, maskApp, node, appIdx, isRect, measuredW, measuredH, registerDef, createSVGElement);
    mask.appendChild(shapeGroup);
    return mask;
}
`;
var LayoutUtilsCoreCode = `class SimpleTransform {
    m;
    constructor() {
        this.m = [1, 0, 0, 1, 0, 0];
    }
    translate(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    rotate(rad) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const m11 = this.m[0] * c + this.m[2] * s;
        const m12 = this.m[1] * c + this.m[3] * s;
        const m21 = this.m[0] * -s + this.m[2] * c;
        const m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    scale(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    point(p) {
        return {
            x: p.x * this.m[0] + p.y * this.m[2] + this.m[4],
            y: p.x * this.m[1] + p.y * this.m[3] + this.m[5]
        };
    }
}
function getPaddingValues(padding) {
    if (typeof padding === "number") {
        return { top: padding, right: padding, bottom: padding, left: padding };
    }
    if (padding && typeof padding === "object") {
        return {
            top: padding.top || 0,
            right: padding.right || 0,
            bottom: padding.bottom || 0,
            left: padding.left || 0
        };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
}
// Children that take part in a group's bounds / AutoLayout flow.
// ignoreInLayout children are still rendered (at their own position) but don't affect the size.
function isLayoutChild(child) {
    return !!child && child.visible !== false && child.ignoreInLayout !== true;
}
// Computes the visual bounds of a node (recursive for groups without autolayout)
function calculateNodeBounds(nodeId, doc) {
    const node = doc.nodesById[nodeId];
    if (!node)
        return { x: 0, y: 0, width: 0, height: 0 };
    if (node.type === "group" && !node.clip) {
        const group = node;
        if (group.autoLayout?.enabled) {
            const layout = calculateAutoLayout(group, doc);
            return layout.bounds;
        }
        // Recursive union for unclipped group
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const children = group.children || [];
        const visibleChildren = children.filter(childId => isLayoutChild(doc.nodesById[childId]));
        if (visibleChildren.length === 0)
            return { x: 0, y: 0, width: 0, height: 0 };
        visibleChildren.forEach((childId) => {
            const childBounds = calculateNodeBounds(childId, doc);
            const child = doc.nodesById[childId];
            if (!child)
                return;
            // Transform child bounds to Group space
            const m = new SimpleTransform();
            const rot = Number(child.rotation || 0);
            const sx = child.scaleX !== undefined ? Number(child.scaleX) : 1;
            const sy = child.scaleY !== undefined ? Number(child.scaleY) : 1;
            const px = Number(child.pivotX || 0);
            const py = Number(child.pivotY || 0);
            m.translate(Number(child.x || 0), Number(child.y || 0));
            m.rotate(rot * Math.PI / 180);
            m.scale(sx, sy);
            m.translate(-px, -py);
            const points = [
                { x: childBounds.x, y: childBounds.y },
                { x: childBounds.x + childBounds.width, y: childBounds.y },
                { x: childBounds.x + childBounds.width, y: childBounds.y + childBounds.height },
                { x: childBounds.x, y: childBounds.y + childBounds.height }
            ];
            points.forEach(p => {
                const tp = m.point(p);
                minX = Math.min(minX, tp.x);
                minY = Math.min(minY, tp.y);
                maxX = Math.max(maxX, tp.x);
                maxY = Math.max(maxY, tp.y);
            });
        });
        if (minX === Infinity)
            return { x: 0, y: 0, width: 0, height: 0 };
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
    else {
        if (node.type === "group" && node.clipRect) {
            const clip = node.clipRect;
            return {
                x: clip.x || 0,
                y: clip.y || 0,
                width: clip.width || 0,
                height: clip.height || 0
            };
        }
        return {
            x: 0,
            y: 0,
            width: node.width || 0,
            height: node.height || 0
        };
    }
}
function calculateAutoLayout(group, doc) {
    if (!group.autoLayout || !group.autoLayout.enabled) {
        return { childrenPositions: {}, bounds: { x: 0, y: 0, width: 0, height: 0 } };
    }
    const direction = group.autoLayout.direction || "horizontal";
    const gap = group.autoLayout.gap || 0;
    const padding = group.autoLayout.padding || 0;
    const alignItems = group.autoLayout.alignItems || "start";
    const justifyContent = group.autoLayout.justifyContent || "start";
    const pad = getPaddingValues(padding);
    const childrenPositions = {};
    const children = group.children || [];
    // Filter visible children
    const visibleChildren = children.filter(childId => isLayoutChild(doc.nodesById[childId]));
    let currentX = pad.left;
    let currentY = pad.top;
    let maxChildWidth = 0;
    let maxChildHeight = 0;
    let totalContentWidth = 0;
    let totalContentHeight = 0;
    const childSizes = visibleChildren.map(childId => {
        const bounds = calculateNodeBounds(childId, doc);
        const child = doc.nodesById[childId];
        // We consider the scale and rotation? AutoLayout usually ignores rotation or treats the bounding box as the size.
        // Let's use the local visual bounds size. We can apply child scale to the bounds.
        // Actually calculateNodeBounds already returns the unscaled local bounds (e.g. width/height for text/rect, or inner union for group).
        // Wait, for text, node.width is logical. It is scaled by scaleX.
        // In Konva/Figma, AutoLayout uses the unscaled bounds or the scaled bounding box? Figma uses scaled bounding box.
        const m = new SimpleTransform();
        if (child) {
            const rot = Number(child.rotation || 0);
            const sx = child.scaleX !== undefined ? Number(child.scaleX) : 1;
            const sy = child.scaleY !== undefined ? Number(child.scaleY) : 1;
            m.rotate(rot * Math.PI / 180);
            m.scale(sx, sy);
        }
        const points = [
            { x: bounds.x, y: bounds.y },
            { x: bounds.x + bounds.width, y: bounds.y },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
            { x: bounds.x, y: bounds.y + bounds.height }
        ];
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(p => {
            const tp = m.point(p);
            minX = Math.min(minX, tp.x);
            minY = Math.min(minY, tp.y);
            maxX = Math.max(maxX, tp.x);
            maxY = Math.max(maxY, tp.y);
        });
        const scaledWidth = maxX - minX;
        const scaledHeight = maxY - minY;
        return { id: childId, bounds, scaledWidth, scaledHeight, child };
    });
    childSizes.forEach(info => {
        maxChildWidth = Math.max(maxChildWidth, info.scaledWidth);
        maxChildHeight = Math.max(maxChildHeight, info.scaledHeight);
        totalContentWidth += info.scaledWidth;
        totalContentHeight += info.scaledHeight;
    });
    totalContentWidth += gap * Math.max(0, visibleChildren.length - 1);
    totalContentHeight += gap * Math.max(0, visibleChildren.length - 1);
    const groupWidth = direction === "horizontal"
        ? totalContentWidth + pad.left + pad.right
        : (direction === "vertical" ? maxChildWidth + pad.left + pad.right : 0);
    const groupHeight = direction === "vertical"
        ? totalContentHeight + pad.top + pad.bottom
        : (direction === "horizontal" ? maxChildHeight + pad.top + pad.bottom : 0);
    // Now place children
    visibleChildren.forEach((childId, index) => {
        const info = childSizes[index];
        let x = 0;
        let y = 0;
        if (direction === "horizontal") {
            x = currentX;
            if (alignItems === "center") {
                y = pad.top + (maxChildHeight - info.scaledHeight) / 2;
            }
            else if (alignItems === "end") {
                y = pad.top + (maxChildHeight - info.scaledHeight);
            }
            else {
                y = pad.top;
            }
            currentX += info.scaledWidth + gap;
        }
        else if (direction === "vertical") {
            y = currentY;
            if (alignItems === "center") {
                x = pad.left + (maxChildWidth - info.scaledWidth) / 2;
            }
            else if (alignItems === "end") {
                x = pad.left + (maxChildWidth - info.scaledWidth);
            }
            else {
                x = pad.left;
            }
            currentY += info.scaledHeight + gap;
        }
        // Compensate for child's own local bounds origin and pivot
        // so that the child's bounding box top-left lands exactly at (x, y)
        const cx = info.child?.scaleX !== undefined ? Number(info.child.scaleX) : 1;
        const cy = info.child?.scaleY !== undefined ? Number(info.child.scaleY) : 1;
        const px = Number(info.child?.pivotX || 0);
        const py = Number(info.child?.pivotY || 0);
        const pivotOffsetX = info.child ? px * cx : 0;
        const pivotOffsetY = info.child ? py * cy : 0;
        childrenPositions[childId] = {
            x: x - (info.bounds.x * cx) + pivotOffsetX,
            y: y - (info.bounds.y * cy) + pivotOffsetY
        };
    });
    let offsetX = 0;
    let offsetY = 0;
    if (direction === "horizontal") {
        if (justifyContent === "end") {
            offsetX = groupWidth;
        }
        else if (justifyContent === "center") {
            offsetX = groupWidth / 2;
        }
    }
    else if (direction === "vertical") {
        if (justifyContent === "end") {
            offsetY = groupHeight;
        }
        else if (justifyContent === "center") {
            offsetY = groupHeight / 2;
        }
    }
    if (offsetX !== 0 || offsetY !== 0) {
        visibleChildren.forEach((childId) => {
            childrenPositions[childId].x -= offsetX;
            childrenPositions[childId].y -= offsetY;
        });
    }
    return {
        childrenPositions,
        bounds: { x: -offsetX, y: -offsetY, width: groupWidth, height: groupHeight }
    };
}

const expressionCache = new Map();
function getValueByPath(obj, path) {
    if (!obj || !path)
        return undefined;
    if (path in obj)
        return obj[path];
    const parts = path.split('.');
    let curr = obj;
    for (const part of parts) {
        if (curr === null || curr === undefined)
            return undefined;
        curr = curr[part];
    }
    return curr;
}
// Stable-reference cache for resolveDynamicVisibility.
// Prevents unnecessary Konva/SVG full rebuilds when doc reference hasn't changed
// (e.g. during zoom/pan operations that trigger render() via React re-renders).
let _rdv_lastInputDoc = null;
let _rdv_lastOutputDoc = null;
let _rdv_lastKeyexpSummary = "";
/**
 * The text a condition on \`targetKeyexp\` compares against, or undefined when the key resolves to nothing.
 * Lookup order: external values, the node itself, text nodes in the same telop, then text nodes anywhere.
 */
function resolveConditionText(targetKeyexp, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    let textValue = undefined;
    // 1. External key values
    if (externalKeyValues) {
        if (targetKeyexp) {
            const externalVal = getValueByPath(externalKeyValues, targetKeyexp);
            if (externalVal !== undefined && externalVal !== null) {
                textValue = String(externalVal).trim();
            }
        }
        else if (node && node.keyexp) {
            const externalVal = getValueByPath(externalKeyValues, node.keyexp);
            if (externalVal !== undefined && externalVal !== null) {
                textValue = String(externalVal).trim();
            }
        }
    }
    // 2. Self node context resolution (priority over remote map when rule targets this node)
    // If targetKeyexp is empty, or matches node.keyexp, node.name, "this", "self"
    if (textValue === undefined && node) {
        const isSelf = !targetKeyexp
            || targetKeyexp === node.keyexp
            || targetKeyexp === node.name
            || targetKeyexp.toLowerCase() === "this"
            || targetKeyexp.toLowerCase() === "self";
        if (isSelf) {
            if (node.type === "text" && node.text !== undefined && node.text !== null && String(node.text).trim() !== "") {
                textValue = String(node.text).trim();
            }
            else if (node.keyexp) {
                textValue = String(node.keyexp).trim();
            }
        }
    }
    // 3. Telop scope text node mappings
    if (textValue === undefined && telopId && telopToKeyexpMap[telopId] && targetKeyexp) {
        if (telopToKeyexpMap[telopId][targetKeyexp] !== undefined) {
            textValue = String(telopToKeyexpMap[telopId][targetKeyexp] ?? "").trim();
        }
    }
    // 4. Global text node mappings
    if (textValue === undefined && globalKeyexpMap && targetKeyexp) {
        if (globalKeyexpMap[targetKeyexp] !== undefined) {
            textValue = String(globalKeyexpMap[targetKeyexp] ?? "").trim();
        }
    }
    return textValue;
}
function evaluateConditionLogic(condition, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (condition.useExpression && condition.expression) {
        try {
            const context = {
                ...(globalKeyexpMap || {}),
                ...(telopId && telopToKeyexpMap[telopId] ? telopToKeyexpMap[telopId] : {}),
                ...(externalKeyValues || {}),
                ...(node && node.type === 'text' && node.text !== undefined ? { [node.keyexp || node.name || 'self']: node.text } : {})
            };
            const customFunctions = {
                isEmpty: (val) => val === null || val === undefined || val === '',
                contains: (str, search) => String(str).includes(String(search))
            };
            let fn = expressionCache.get(condition.expression);
            if (!fn) {
                fn = new Function('context', 'customFunctions', \`
                    with (customFunctions) {
                        with (context) {
                            return !!(\${condition.expression});
                        }
                    }
                \`);
                expressionCache.set(condition.expression, fn);
            }
            return !!fn(context, customFunctions);
        }
        catch (e) {
            console.warn("Expression evaluation error", e);
            return false;
        }
    }
    else {
        const textValue = resolveConditionText((condition.targetKeyexp || "").trim(), telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        const resolvedText = textValue ?? "";
        const compVal = String(condition.value ?? "").trim();
        const matchVal = (v) => {
            switch (condition.operator) {
                case "empty":
                    return !v || v === "";
                case "not_empty":
                    return !!v && v !== "";
                case "equals":
                    return v === compVal;
                case "not_equals":
                    return v !== compVal;
                case "contains":
                    if (!compVal)
                        return true;
                    return v.includes(compVal) || v.toLowerCase().includes(compVal.toLowerCase());
                case "not_contains":
                    if (!compVal)
                        return true;
                    return !v.includes(compVal) && !v.toLowerCase().includes(compVal.toLowerCase());
                case "gt":
                case "gte":
                case "lt":
                case "lte": {
                    const numVal = parseFloat(v);
                    const compValNum = parseFloat(compVal);
                    if (isNaN(numVal) || isNaN(compValNum)) {
                        return false;
                    }
                    else if (condition.operator === "gt") {
                        return numVal > compValNum;
                    }
                    else if (condition.operator === "gte") {
                        return numVal >= compValNum;
                    }
                    else if (condition.operator === "lt") {
                        return numVal < compValNum;
                    }
                    else if (condition.operator === "lte") {
                        return numVal <= compValNum;
                    }
                    return false;
                }
                default:
                    return true;
            }
        };
        return matchVal(resolvedText);
    }
}
function resolveConditionalColor(defaultColor, rules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        return defaultColor;
    }
    for (const rule of rules) {
        if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node)) {
            if (rule.color !== undefined && rule.color !== "") {
                return rule.color;
            }
        }
    }
    return defaultColor;
}
function evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node) {
    if (!app)
        return app;
    let currentApp = app;
    // 1. Per-property color rules (fillColorRules, strokeColorRules, shadowColorRules)
    if (Array.isArray(app.fillColorRules) && app.fillColorRules.length > 0) {
        const newFill = resolveConditionalColor(currentApp.fill, app.fillColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newFill !== currentApp.fill) {
            currentApp = { ...currentApp, fill: newFill };
        }
    }
    if (Array.isArray(app.strokeColorRules) && app.strokeColorRules.length > 0) {
        const newStroke = resolveConditionalColor(currentApp.color, app.strokeColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newStroke !== currentApp.color) {
            currentApp = { ...currentApp, color: newStroke };
        }
    }
    if (Array.isArray(app.shadowColorRules) && app.shadowColorRules.length > 0) {
        const newShadow = resolveConditionalColor(currentApp.shadowColor, app.shadowColorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
        if (newShadow !== currentApp.shadowColor) {
            currentApp = { ...currentApp, shadowColor: newShadow };
        }
    }
    // 2. Gradient stops per-stop color rules
    if (currentApp.gradientConfig?.stops && Array.isArray(currentApp.gradientConfig.stops)) {
        let stopsChanged = false;
        const newStops = currentApp.gradientConfig.stops.map((stop) => {
            if (Array.isArray(stop.colorRules) && stop.colorRules.length > 0) {
                const newC = resolveConditionalColor(stop.color, stop.colorRules, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (newC !== stop.color) {
                    stopsChanged = true;
                    return { ...stop, color: newC };
                }
            }
            return stop;
        });
        if (stopsChanged) {
            currentApp = {
                ...currentApp,
                gradientConfig: { ...currentApp.gradientConfig, stops: newStops },
                fill: newStops.map((s) => s.color)
            };
        }
    }
    // 3. Top-level colorRules (legacy / composite support)
    if (Array.isArray(app.colorRules) && app.colorRules.length > 0) {
        for (const rule of app.colorRules) {
            if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node)) {
                let fill = currentApp.fill;
                let color = currentApp.color;
                let shadowColor = currentApp.shadowColor;
                let hasChange = false;
                if ((rule.overrideFill || rule.fill !== undefined) && rule.fill !== undefined && rule.fill !== "") {
                    fill = rule.fill;
                    hasChange = true;
                }
                if ((rule.overrideStrokeColor || rule.color !== undefined) && rule.color !== undefined && rule.color !== "") {
                    color = rule.color;
                    hasChange = true;
                }
                if ((rule.overrideShadowColor || rule.shadowColor !== undefined) && rule.shadowColor !== undefined && rule.shadowColor !== "") {
                    shadowColor = rule.shadowColor;
                    hasChange = true;
                }
                if (hasChange) {
                    currentApp = { ...currentApp, fill, color, shadowColor };
                }
                break;
            }
        }
    }
    return currentApp;
}
/** keyexp / name -> text content of every text node, per telop and globally */
function collectKeyexpMaps(doc) {
    let currentKeyexpSummary = "";
    const telopToKeyexpMap = {};
    const globalKeyexpMap = {};
    const telopIdCache = new Map();
    // Helper to find the parent Telop node's ID with memoization
    const getTelopId = (nodeId) => {
        if (telopIdCache.has(nodeId)) {
            return telopIdCache.get(nodeId);
        }
        let curr = doc.nodesById[nodeId];
        while (curr) {
            if (curr.type === "telop") {
                telopIdCache.set(nodeId, curr.id);
                return curr.id;
            }
            if (!curr.parentId)
                break;
            curr = doc.nodesById[curr.parentId];
        }
        telopIdCache.set(nodeId, null);
        return null;
    };
    // 1st pass: Collect keyexp -> text content mappings for each telop and globally
    for (const node of Object.values(doc.nodesById)) {
        if (node.type === "text") {
            const textVal = node.text || "";
            const keyexpVal = (node.keyexp || "").trim();
            currentKeyexpSummary += node.id + ":" + keyexpVal + ":" + textVal + ";";
            if (keyexpVal) {
                if (!globalKeyexpMap[keyexpVal] || node.name === keyexpVal) {
                    globalKeyexpMap[keyexpVal] = textVal;
                }
            }
            if (node.name && !globalKeyexpMap[node.name]) {
                globalKeyexpMap[node.name] = textVal;
            }
            const telopId = getTelopId(node.id);
            if (telopId) {
                if (!telopToKeyexpMap[telopId]) {
                    telopToKeyexpMap[telopId] = {};
                }
                if (keyexpVal) {
                    if (!telopToKeyexpMap[telopId][keyexpVal] || node.name === keyexpVal) {
                        telopToKeyexpMap[telopId][keyexpVal] = textVal;
                    }
                }
                if (node.name && telopToKeyexpMap[telopId][node.name] === undefined) {
                    telopToKeyexpMap[telopId][node.name] = textVal;
                }
            }
        }
    }
    return { telopToKeyexpMap, globalKeyexpMap, getTelopId, summary: currentKeyexpSummary };
}
/**
 * Editor diagnostics: how \`condition\` evaluates for \`nodeId\` in an (already repeat-expanded) doc.
 * Uses the same lookup as resolveDynamicVisibility (without external values).
 * \`selfAware: false\` matches image-switch evaluation, which does not resolve keys against the node itself.
 */
function traceCondition(doc, nodeId, condition, selfAware = true) {
    const { telopToKeyexpMap, globalKeyexpMap, getTelopId } = collectKeyexpMaps(doc);
    const node = selfAware ? doc.nodesById[nodeId] : undefined;
    const telopId = getTelopId(nodeId);
    const result = evaluateConditionLogic(condition, telopId, telopToKeyexpMap, undefined, globalKeyexpMap, node);
    if (condition.useExpression && condition.expression) {
        return { key: String(condition.expression), value: undefined, result };
    }
    const key = (condition.targetKeyexp || "").trim();
    return { key, value: resolveConditionText(key, telopId, telopToKeyexpMap, undefined, globalKeyexpMap, node), result };
}
function resolveDynamicVisibility(doc, externalKeyValues) {
    // 0. Immediate short-circuit: If externalKeyValues is not passed and doc reference has not changed,
    // nothing inside has changed (vital for 60fps pan/zoom performance in editor).
    if (!externalKeyValues && doc === _rdv_lastInputDoc && _rdv_lastOutputDoc !== null) {
        return _rdv_lastOutputDoc;
    }
    const { telopToKeyexpMap, globalKeyexpMap, getTelopId, summary: currentKeyexpSummary } = collectKeyexpMaps(doc);
    // 2nd pass: Resolve visibility, image reference, and color condition rules
    const visibilityOverrides = {};
    const assetOverrides = {};
    const appearanceOverrides = {};
    let hasAnyChange = false;
    for (const node of Object.values(doc.nodesById)) {
        const telopId = getTelopId(node.id);
        // 1. Visibility Condition
        // Preserve original tree visibility state
        const originalVisible = node._originalVisible !== undefined
            ? node._originalVisible
            : (node.visible !== false);
        if (node.visibilityCondition && node.visibilityCondition.enabled) {
            const conditionResult = evaluateConditionLogic(node.visibilityCondition, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
            // User requirement:
            // - If tree is hidden (originalVisible === false), condition CANNOT force it visible (must stay false)
            // - If tree is visible (originalVisible === true), follow condition result
            const targetVisible = originalVisible ? conditionResult : false;
            if (targetVisible !== node.visible || node._originalVisible !== originalVisible) {
                visibilityOverrides[node.id] = {
                    visible: targetVisible,
                    _originalVisible: originalVisible
                };
                hasAnyChange = true;
            }
        }
        else if (node._originalVisible !== undefined && node.visible !== node._originalVisible) {
            // Restore original tree visibility if condition was disabled
            visibilityOverrides[node.id] = {
                visible: node._originalVisible,
                _originalVisible: undefined
            };
            hasAnyChange = true;
        }
        // 2. Image Reference Condition (Only active when node's own keyexp is not set)
        if (node.type === "image") {
            const imgNode = node;
            const hasOwnKeyexp = !!imgNode.keyexp && String(imgNode.keyexp).trim() !== "";
            const refCond = imgNode.imageReferenceCondition;
            // Preserve original assetId if not already stored
            const originalAssetId = imgNode._originalAssetId || imgNode.assetId;
            if (!hasOwnKeyexp && refCond && refCond.enabled) {
                let matchedAssetId = null;
                // Priority 1: Value mappings for targetKeyexp
                if (refCond.targetKeyexp && Array.isArray(refCond.mappings) && refCond.mappings.length > 0) {
                    for (const m of refCond.mappings) {
                        if (m.assetId) {
                            const isMatch = evaluateConditionLogic({
                                enabled: true,
                                targetKeyexp: refCond.targetKeyexp,
                                operator: m.operator || "equals",
                                value: m.value
                            }, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap);
                            if (isMatch) {
                                matchedAssetId = m.assetId;
                                break;
                            }
                        }
                    }
                }
                // Priority 2: Multi-rule evaluation if rules exist
                if (!matchedAssetId && Array.isArray(refCond.rules) && refCond.rules.length > 0) {
                    for (const rule of refCond.rules) {
                        if (rule.enabled !== false && evaluateConditionLogic(rule, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap)) {
                            if (rule.assetId) {
                                matchedAssetId = rule.assetId;
                                break;
                            }
                        }
                    }
                }
                // Priority 3: Single-condition evaluation if no rule matched
                if (!matchedAssetId && evaluateConditionLogic(refCond, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap)) {
                    if (refCond.assetId) {
                        matchedAssetId = refCond.assetId;
                    }
                }
                const targetAssetId = matchedAssetId || originalAssetId;
                if (targetAssetId && targetAssetId !== imgNode.assetId) {
                    assetOverrides[node.id] = {
                        assetId: targetAssetId,
                        _originalAssetId: (targetAssetId !== originalAssetId) ? originalAssetId : undefined
                    };
                    hasAnyChange = true;
                }
            }
            else if (imgNode._originalAssetId && imgNode.assetId !== originalAssetId) {
                // If condition was disabled or keyexp was specified, restore original asset
                assetOverrides[node.id] = {
                    assetId: originalAssetId,
                    _originalAssetId: undefined
                };
                hasAnyChange = true;
            }
        }
        // 3. Appearance Color Condition Rules
        const nodeAny = node;
        const origStyleApps = nodeAny._originalStyleAppearances || (nodeAny.style?.appearances ? JSON.parse(JSON.stringify(nodeAny.style.appearances)) : undefined);
        const origBgApps = nodeAny._originalBgAppearances || (nodeAny.background?.appearances ? JSON.parse(JSON.stringify(nodeAny.background.appearances)) : undefined);
        if (origStyleApps && Array.isArray(origStyleApps)) {
            let styleAppChanged = false;
            const newApps = origStyleApps.map((app) => {
                const evalApp = evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (evalApp !== app)
                    styleAppChanged = true;
                return evalApp;
            });
            const currentStyleAppsStr = JSON.stringify(nodeAny.style?.appearances);
            const newAppsStr = JSON.stringify(newApps);
            const origStyleAppsStr = JSON.stringify(origStyleApps);
            if (styleAppChanged) {
                if (currentStyleAppsStr !== newAppsStr || !nodeAny._originalStyleAppearances) {
                    appearanceOverrides[node.id] = {
                        ...(appearanceOverrides[node.id] || {}),
                        style: { ...nodeAny.style, appearances: newApps },
                        _originalStyleAppearances: origStyleApps
                    };
                    hasAnyChange = true;
                }
            }
            else if (nodeAny._originalStyleAppearances && currentStyleAppsStr !== origStyleAppsStr) {
                appearanceOverrides[node.id] = {
                    ...(appearanceOverrides[node.id] || {}),
                    style: { ...nodeAny.style, appearances: origStyleApps },
                    _originalStyleAppearances: undefined
                };
                hasAnyChange = true;
            }
        }
        if (origBgApps && Array.isArray(origBgApps)) {
            let bgAppChanged = false;
            const newBgApps = origBgApps.map((app) => {
                const evalApp = evaluateAppearanceColorRules(app, telopId, telopToKeyexpMap, externalKeyValues, globalKeyexpMap, node);
                if (evalApp !== app)
                    bgAppChanged = true;
                return evalApp;
            });
            const currentBgAppsStr = JSON.stringify(nodeAny.background?.appearances);
            const newBgAppsStr = JSON.stringify(newBgApps);
            const origBgAppsStr = JSON.stringify(origBgApps);
            if (bgAppChanged) {
                if (currentBgAppsStr !== newBgAppsStr || !nodeAny._originalBgAppearances) {
                    appearanceOverrides[node.id] = {
                        ...(appearanceOverrides[node.id] || {}),
                        background: { ...nodeAny.background, appearances: newBgApps },
                        _originalBgAppearances: origBgApps
                    };
                    hasAnyChange = true;
                }
            }
            else if (nodeAny._originalBgAppearances && currentBgAppsStr !== origBgAppsStr) {
                appearanceOverrides[node.id] = {
                    ...(appearanceOverrides[node.id] || {}),
                    background: { ...nodeAny.background, appearances: origBgApps },
                    _originalBgAppearances: undefined
                };
                hasAnyChange = true;
            }
        }
    }
    if (!hasAnyChange) {
        if (!externalKeyValues) {
            _rdv_lastInputDoc = doc;
            _rdv_lastOutputDoc = doc;
            _rdv_lastKeyexpSummary = currentKeyexpSummary;
        }
        return doc;
    }
    const updatedNodes = { ...doc.nodesById };
    Object.entries(visibilityOverrides).forEach(([id, visData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            visible: visData.visible,
            ...(visData._originalVisible !== undefined ? { _originalVisible: visData._originalVisible } : {})
        };
        if (visData._originalVisible === undefined && updatedNodes[id]._originalVisible !== undefined) {
            delete updatedNodes[id]._originalVisible;
        }
    });
    Object.entries(assetOverrides).forEach(([id, assetData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            assetId: assetData.assetId,
            ...(assetData._originalAssetId ? { _originalAssetId: assetData._originalAssetId } : {})
        };
        if (assetData._originalAssetId === undefined && updatedNodes[id]._originalAssetId) {
            delete updatedNodes[id]._originalAssetId;
        }
    });
    Object.entries(appearanceOverrides).forEach(([id, appData]) => {
        updatedNodes[id] = {
            ...updatedNodes[id],
            ...(appData.style ? { style: appData.style } : {}),
            ...(appData.background ? { background: appData.background } : {}),
            ...(appData._originalStyleAppearances ? { _originalStyleAppearances: appData._originalStyleAppearances } : {}),
            ...(appData._originalBgAppearances ? { _originalBgAppearances: appData._originalBgAppearances } : {})
        };
        if (appData._originalStyleAppearances === undefined && updatedNodes[id]._originalStyleAppearances) {
            delete updatedNodes[id]._originalStyleAppearances;
        }
        if (appData._originalBgAppearances === undefined && updatedNodes[id]._originalBgAppearances) {
            delete updatedNodes[id]._originalBgAppearances;
        }
    });
    const result = {
        ...doc,
        nodesById: updatedNodes
    };
    if (!externalKeyValues) {
        _rdv_lastInputDoc = doc;
        _rdv_lastOutputDoc = result;
        _rdv_lastKeyexpSummary = currentKeyexpSummary;
    }
    return result;
}

/**
 * Repeat expansion for AutoLayout groups.
 *
 * A group with \`autoLayout.enabled && repeat.enabled\` holds exactly one child (the template).
 * At render / export time the template subtree is deep-copied \`repeat.count\` times:
 * - node ids become \`{originalId}~{n}\` (1-based, deterministic)
 * - every string value containing \`{var}\` gets the row number, except \`id\` / \`parentId\` / \`children\` / \`assetId\`.
 *   \`var\` is the group's \`repeat.var\` (default "i")
 *
 * Repeat groups can be nested (a list of lists). Each group's variable works anywhere inside its template,
 * including nested templates, so \`score{player}_{hole}\` works regardless of depth.
 * Ids get one \`~{n}\` per level, outermost first: \`n1_cell~2~3\` = outer row 2, inner row 3.
 *
 * The saved doc always keeps the template form; only the rendered doc is expanded.
 * This file is dependency-free (type imports only) because scripts/sync-logic.cjs embeds it into the player.
 */
const REPEAT_ID_SEPARATOR = "~";
const DEFAULT_REPEAT_VAR = "i";
const REPEAT_VAR_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const REPEAT_VAR_TOKEN = /\\{([A-Za-z_][A-Za-z0-9_]*)\\}/g;
const NON_SUBSTITUTED_KEYS = new Set(["id", "parentId", "children", "assetId"]);
const REPEAT_ID_SUFFIX = /(~\\d+)+$/;
function isRepeatGroup(node) {
    return !!node && node.type === "group" && !!node.autoLayout?.enabled && !!node.repeat?.enabled;
}
function isValidRepeatVar(name) {
    return typeof name === "string" && REPEAT_VAR_NAME.test(name);
}
/** The group's row-number variable name, e.g. "i" or "player" */
function getRepeatVar(group) {
    const name = group?.repeat?.var;
    return isValidRepeatVar(name) ? name : DEFAULT_REPEAT_VAR;
}
/** \`n1_card~12\` / \`n1_cell~2~3\` -> template id. Ids without a repeat suffix are returned unchanged. */
function toTemplateNodeId(nodeId) {
    return nodeId.replace(REPEAT_ID_SUFFIX, "");
}
/** Row numbers encoded in an expanded id, outermost first (\`n1_cell~2~3\` -> [2, 3]), or null for template / ordinary ids. */
function getRepeatRowIndices(nodeId) {
    const m = REPEAT_ID_SUFFIX.exec(nodeId);
    return m ? m[0].split(REPEAT_ID_SEPARATOR).slice(1).map(Number) : null;
}
/** Innermost row number encoded in an expanded id, or null for template / ordinary ids. */
function getRepeatRowIndex(nodeId) {
    const rows = getRepeatRowIndices(nodeId);
    return rows ? rows[rows.length - 1] : null;
}
/** Repeat groups above the node, outermost first (the node is part of each one's template). Empty when none. */
function findRepeatAncestors(doc, nodeId) {
    const out = [];
    let parentId = doc.nodesById[nodeId]?.parentId;
    while (parentId) {
        const parent = doc.nodesById[parentId];
        if (!parent)
            break;
        if (isRepeatGroup(parent))
            out.unshift(parent);
        parentId = parent.parentId;
    }
    return out;
}
/** Nearest repeat group above the node (the node is then part of a repeat template), or null. */
function findRepeatAncestor(doc, nodeId) {
    const ancestors = findRepeatAncestors(doc, nodeId);
    return ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
}
function collectSubtree(doc, rootId, out) {
    const node = doc.nodesById[rootId];
    if (!node)
        return;
    out.push(rootId);
    if (Array.isArray(node.children)) {
        node.children.forEach((childId) => collectSubtree(doc, childId, out));
    }
}
function analyzeRepeatGroup(doc, group) {
    const warnings = [];
    const rawCount = Math.floor(Number(group.repeat?.count));
    const count = isFinite(rawCount) && rawCount > 0 ? rawCount : 0;
    const children = Array.isArray(group.children) ? group.children : [];
    const ancestors = findRepeatAncestors(doc, group.id);
    const depth = ancestors.length;
    const varName = getRepeatVar(group);
    const rawVar = group.repeat?.var;
    if (rawVar !== undefined && rawVar !== "" && !isValidRepeatVar(rawVar)) {
        warnings.push(\`Invalid variable name "\${rawVar}" (letters, digits and _ only, not starting with a digit). Using {\${DEFAULT_REPEAT_VAR}}\`);
    }
    const shadowed = ancestors.find(a => getRepeatVar(a) === varName);
    if (shadowed) {
        warnings.push(\`Variable {\${varName}} is also used by the outer repeat (\${shadowed.name || shadowed.id}). Inside this template it means this group's row\`);
    }
    if (children.length === 0) {
        return { templateId: null, count, depth, varName, expandable: false, warnings: [...warnings, "Repeat group has no child (template)"] };
    }
    if (children.length > 1) {
        warnings.push(\`Repeat group has \${children.length} children. Only the first one is used as the template\`);
    }
    return { templateId: children[0], count, depth, varName, expandable: true, warnings };
}
/** Replaces \`{name}\` with vars[name]; unknown names are left as-is */
function substituteRowVars(value, vars) {
    if (typeof value === "string") {
        if (!value.includes("{"))
            return value;
        return value.replace(REPEAT_VAR_TOKEN, (token, name) => Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : token);
    }
    if (Array.isArray(value)) {
        return value.map(v => substituteRowVars(v, vars));
    }
    if (value && typeof value === "object") {
        const out = {};
        for (const key of Object.keys(value)) {
            out[key] = NON_SUBSTITUTED_KEYS.has(key) ? value[key] : substituteRowVars(value[key], vars);
        }
        return out;
    }
    return value;
}
/**
 * Returns a new doc with every repeat group expanded. The input doc is never mutated,
 * and it is returned as-is when it contains no repeat group.
 */
function expandRepeats(doc, options = {}) {
    if (!doc || !doc.nodesById)
        return doc;
    const groups = Object.values(doc.nodesById).filter(isRepeatGroup);
    if (groups.length === 0)
        return doc;
    const warn = options.onWarning || ((groupId, message) => {
        console.warn(\`[repeat] \${groupId}: \${message}\`);
    });
    const nodesById = { ...doc.nodesById };
    const infoById = new Map();
    for (const group of groups) {
        const info = analyzeRepeatGroup(doc, group);
        info.warnings.forEach(message => warn(group.id, message));
        infoById.set(group.id, info);
    }
    const rowCountOf = (info) => options.maxCount !== undefined ? Math.min(info.count, Math.max(0, options.maxCount)) : info.count;
    // \`rows\` is the row number per enclosing repeat level, outermost first.
    // Only the editor's all-row-1 path keeps the template's own ids.
    const idFor = (id, rows) => rows.length === 0 || (options.keepFirstRowIds === true && rows.every(r => r === 1))
        ? id
        : \`\${id}\${REPEAT_ID_SEPARATOR}\${rows.join(REPEAT_ID_SEPARATOR)}\`;
    // Children of a (copied) node: a repeat group gets one template copy per row, others are copied 1:1
    const expandChildren = (source, newId, rows, vars) => {
        const info = infoById.get(source.id);
        if (info && info.expandable && info.templateId) {
            const out = [];
            const count = rowCountOf(info);
            for (let r = 1; r <= count; r++) {
                out.push(copySubtree(info.templateId, newId, [...rows, r], { ...vars, [info.varName]: String(r) }));
            }
            return out;
        }
        return source.children
            .filter((childId) => doc.nodesById[childId])
            .map((childId) => copySubtree(childId, newId, rows, vars));
    };
    // Copies the source node \`id\` (and its subtree) for the given row path; returns the copy's id
    const copySubtree = (id, parentId, rows, vars) => {
        const source = doc.nodesById[id];
        const copy = substituteRowVars(source, vars);
        copy.id = idFor(id, rows);
        copy.parentId = parentId;
        if (Array.isArray(source.children)) {
            copy.children = expandChildren(source, copy.id, rows, vars);
        }
        nodesById[copy.id] = copy;
        return copy.id;
    };
    // Start from the outermost repeat groups; nested ones are expanded while their outer template is copied
    for (const group of groups) {
        const info = infoById.get(group.id);
        if (info.depth !== 0 || !info.expandable || !info.templateId)
            continue;
        // The template subtree is replaced by its copies (the editor's all-row-1 path rewrites it with the same ids)
        const subtree = [];
        collectSubtree(doc, info.templateId, subtree);
        subtree.forEach(id => { delete nodesById[id]; });
        nodesById[group.id] = { ...group, children: expandChildren(group, group.id, [], {}) };
    }
    return { ...doc, nodesById };
}
`;

// vendor/TelopEditor/src/persistence/player_template_source.ts
var PLAYER_JS_CONTENT = `
(function () {
    // ==========================================
    // Standalone SVG Renderer Logic (Unified Core)
    // ==========================================

    const SVG_NS = "http://www.w3.org/2000/svg";

    function createSVGElement(tagName) {
        return document.createElementNS(SVG_NS, tagName);
    }

    // Inject shared logic core (stripped of exports for standalone use)
    ${SVGRendererCoreCode}

    // Inject layout utilities (for AutoLayout support in player)
    ${LayoutUtilsCoreCode}

    // Text Measurement Utility (Standalone Canvas-based)
    const fontSpecOf = (style) => \`\${style.fontStyle || 'normal'} \${style.fontWeight || 'normal'} \${style.fontSize || 24}px "\${style.fontFamily || 'Arial'}"\`;

    const TextMeasurer = {
        canvas: document.createElement('canvas'),
        measure(text, style) {
            const ctx = this.canvas.getContext('2d');
            const fontSize = style.fontSize || 24;
            ctx.font = fontSpecOf(style);
            const metrics = ctx.measureText(text);
            let width = metrics.width;
            if (style.letterSpacing && text.length > 0) {
                width += style.letterSpacing * (text.length - 1);
            }
            return { width, height: fontSize * 1.25 };
        }
    };

    // Canvas \u306E measureText \u306F\u8AAD\u307F\u8FBC\u307F\u524D\u306E Web \u30D5\u30A9\u30F3\u30C8\u3092\u5F85\u305F\u305A\u3001\u4EE3\u308F\u308A\u306E\u30D5\u30A9\u30F3\u30C8\u3067\u6E2C\u3063\u3066\u3057\u307E\u3046\u3002
    // @font-face \u306F\u6587\u5B57\u3092\u63CF\u304F\u307E\u3067\u8AAD\u307F\u8FBC\u307E\u308C\u306A\u3044\u306E\u3067\u3001fitMode \u306E\u7E2E\u5C0F\u7387\u3092\u6E2C\u308B\u524D\u306B\u30C6\u30AD\u30B9\u30C8\u304C\u4F7F\u3046\u30D5\u30A9\u30F3\u30C8\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u304A\u304F\u3002
    // \u8AAD\u307F\u8FBC\u3080\u3082\u306E\u304C\u306A\u3051\u308C\u3070 null \u3092\u8FD4\u3059\uFF08\u547C\u3073\u51FA\u3057\u5074\u306F\u540C\u671F\u306E\u307E\u307E\u9032\u3081\u308B\uFF09\u3002
    const FONT_LOAD_TIMEOUT_MS = 3000;
    window.ensureFontsLoaded = function (doc) {
        if (typeof document === 'undefined' || !document.fonts || !doc || !doc.nodesById) return null;
        const specs = new Set();
        Object.keys(doc.nodesById).forEach(id => {
            const n = doc.nodesById[id];
            if (n && n.type === 'text') specs.add(fontSpecOf(n.style || {}));
        });
        const pending = [];
        specs.forEach(spec => {
            try {
                if (!document.fonts.check(spec)) pending.push(document.fonts.load(spec).catch(() => {}));
            } catch (e) { /* \u4E0D\u6B63\u306A\u30D5\u30A9\u30F3\u30C8\u6307\u5B9A\u306F\u7121\u8996 */ }
        });
        if (pending.length === 0) return null;
        return Promise.race([
            Promise.all(pending),
            new Promise(resolve => setTimeout(resolve, FONT_LOAD_TIMEOUT_MS))
        ]).then(() => {});
    };

    // \u30C6\u30AD\u30B9\u30C8\u306E\u7E2E\u5C0F\u7387\u3068\u914D\u7F6E\uFF08wrapper \u306E transform\uFF09\u3092\u8A08\u7B97\u3059\u308B
    function layoutTextFit(node) {
        const fitMode = node.fitMode || "none";
        const targetWidth = node.width || 0;
        const targetHeight = node.height || 0;
        const pad = node.padding || 0;
        const availW = Math.max(0, (targetWidth || 0) - pad * 2);
        const availH = Math.max(0, (targetHeight || 0) - pad * 2);

        const { width: contentW, height: contentH } = TextMeasurer.measure(node.text || "", node.style || {});

        let sx = 1, sy = 1;
        if (fitMode === 'shrink_x' && contentW > availW && availW > 0) sx = availW / contentW;
        else if (fitMode === 'shrink_font' && contentW > availW && availW > 0) { sx = sy = availW / contentW; }
        else if (fitMode === 'expand_xy' && availW > 0 && availH > 0) { sx = availW / (contentW || 1); sy = availH / (contentH || 1); }
        else if (fitMode === 'scale_to_fit' && availW > 0 && availH > 0) { const s = Math.min(availW / (contentW || 1), availH / (contentH || 1)); sx = sy = s; }

        const effH = contentH * sy;
        const align = node.align || 'left';
        const vAlign = node.verticalAlign || 'top';
        const effectivePadX = (targetWidth > 0) ? Math.min(pad, targetWidth / 2) : pad;
        const effectivePadY = (targetHeight > 0) ? Math.min(pad, targetHeight / 2) : pad;

        let tx = effectivePadX, ty = effectivePadY;
        if (targetWidth > 0) {
            if (align === 'center') tx = targetWidth / 2;
            else if (align === 'right') tx = targetWidth - effectivePadX;
        }
        if (targetHeight > 0) {
            if (vAlign === 'middle') ty = targetHeight / 2 - effH / 2;
            else if (vAlign === 'bottom') ty = targetHeight - effectivePadY - effH;
        }

        return { fitMode, contentW, contentH, transform: \`translate(\${tx}, \${ty}) scale(\${sx}, \${sy})\` };
    }

    // \u305D\u308C\u3067\u3082\u6E2C\u3063\u305F\u5F8C\u306B\u30D5\u30A9\u30F3\u30C8\u304C\u5C4A\u3044\u305F\u5834\u5408\uFF08\u30AB\u30B9\u30BF\u30E0 JS \u306E updateTelop \u306A\u3069\uFF09\u306F\u3001\u7E2E\u5C0F\u7387\u3092\u6E2C\u308A\u76F4\u3057\u3066 transform \u3060\u3051\u5DEE\u3057\u66FF\u3048\u308B\u3002
    // \u8981\u7D20\u306F\u4F5C\u308A\u76F4\u3055\u306A\u3044\u306E\u3067\u3001\u8868\u793A\u4E2D\u306E\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306F\u9014\u5207\u308C\u306A\u3044\u3002
    window.refitTextNodes = function () {
        const doc = window.telopDoc;
        if (!doc || !doc.nodesById || !window.nodeElementMap) return;
        window.nodeElementMap.forEach((el, id) => {
            const node = doc.nodesById[id];
            if (!node || node.type !== 'text' || (node.fitMode || 'none') === 'none') return;
            if (!el || !el.isConnected) return;
            const wrapper = el.querySelector('.text-fit-wrapper');
            if (!wrapper) return;
            const { transform } = layoutTextFit(node);
            if (wrapper.getAttribute('transform') !== transform) wrapper.setAttribute('transform', transform);
        });
    };
    if (typeof document !== 'undefined' && document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener('loadingdone', () => window.refitTextNodes());
    }

    // 9-slice SVG Image Generator for background
    function createNineSliceImage(src, width, height, ns, assetWidth, assetHeight) {
        const group = createSVGElement("g");
        
        const t = ns.top || 0;
        const b = ns.bottom || 0;
        const l = ns.left || 0;
        const r = ns.right || 0;
        
        const iw = assetWidth || 100;
        const ih = assetHeight || 100;
        
        const mw = Math.max(0, width - l - r);
        const mh = Math.max(0, height - t - b);
        
        const imw = Math.max(0, iw - l - r);
        const imh = Math.max(0, ih - t - b);

        const drawSlice = (sx, sy, sw, sh, dx, dy, dw, dh) => {
            if (sw <= 0 || sh <= 0 || dw <= 0 || dh <= 0) return;
            const svg = createSVGElement("svg");
            setAttributes(svg, { x: dx, y: dy, width: dw, height: dh, viewBox: \`\${sx} \${sy} \${sw} \${sh}\`, preserveAspectRatio: "none" });
            const image = createSVGElement("image");
            setAttributes(image, { x: 0, y: 0, width: iw, height: ih, href: src, preserveAspectRatio: "none" });
            svg.appendChild(image);
            group.appendChild(svg);
        };

        // Top Row
        drawSlice(0, 0, l, t, 0, 0, l, t);
        drawSlice(l, 0, imw, t, l, 0, mw, t);
        drawSlice(iw - r, 0, r, t, width - r, 0, r, t);
        
        // Middle Row
        drawSlice(0, t, l, imh, 0, t, l, mh);
        drawSlice(l, t, imw, imh, l, t, mw, mh);
        drawSlice(iw - r, t, r, imh, width - r, t, r, mh);
        
        // Bottom Row
        drawSlice(0, ih - b, l, b, 0, height - b, l, b);
        drawSlice(l, ih - b, imw, b, l, height - b, mw, b);
        drawSlice(iw - r, ih - b, r, b, width - r, height - b, r, b);

        return group;
    }

    // Initialization Logic
    window.resolveDynamicVisibility = resolveDynamicVisibility;
    window.initPlayer = async function (containerId, projectData, assetCache) {
        window.containerId = containerId;

        // \u7E2E\u5C0F\u7387\u3092\u6B63\u3057\u304F\u6E2C\u308B\u305F\u3081\u3001\u6700\u521D\u306E\u63CF\u753B\u306E\u524D\u306B\u30D5\u30A9\u30F3\u30C8\u3092\u8AAD\u307F\u8FBC\u3080\u3002
        // createNode \u306A\u3069\u306E\u30B0\u30ED\u30FC\u30D0\u30EB\u3092\u516C\u958B\u3059\u308B\u524D\u306B\u5F85\u3064\u306E\u3067\u3001\u5F85\u3063\u3066\u3044\u308B\u9593\u306B Hub \u306E updateTelop \u304C\u52D5\u304D\u51FA\u3059\u3053\u3068\u306F\u306A\u3044\u3002
        const fontsLoading = window.ensureFontsLoaded(projectData);
        if (fontsLoading) await fontsLoading;

        // Fallback for asset mapping (backwards compatibility for custom JS)
        if (!projectData.assets && window.assetMapping) {
            projectData.assets = window.assetMapping;
        }

        // Repeat groups are expanded into ordinary nodes here; everything after works on the expanded doc
        projectData = expandRepeats(projectData);

        window.telopDoc = projectData;
        window.assetCache = assetCache;
        window.keyExpMap = new Map();

        const container = document.getElementById(containerId);
        const svg = createSVGElement("svg");
        const defs = createSVGElement("defs");
        svg.appendChild(defs);
        window.telopApp = svg; // SVG root

        const width = projectData.meta.width || 1920;
        const height = projectData.meta.height || 1080;
        setAttributes(svg, { width, height, viewBox: \`0 0 \${width} \${height}\`, visibility: "visible" });
        svg.style.display = "block";
        if (container) {
            container.innerHTML = '';
            container.appendChild(svg);
        }

        const registerDef = (def) => defs.appendChild(def);

        window.createNode = function (nodeId, autoLayoutOverride, isTelopChild) {
            // resolveDynamicVisibility \u306E\u7D50\u679C\u304C\u53CD\u6620\u3055\u308C\u305F doc \u3092\u4F7F\u3046
            // initPlayer/updateTelop \u306F createNode \u547C\u3073\u51FA\u3057\u524D\u306B window.telopDoc = evaluatedDoc \u306B\u30BB\u30C3\u30C8\u3059\u308B
            const activeDoc = window.telopDoc || projectData;
            const node = activeDoc.nodesById[nodeId];
            if (!node) return null;

            const root = createSVGElement("g");
            const content = createSVGElement("g");
            content.classList.add("content-wrapper");

            root.setAttribute("data-node-id", node.id);

            // Check recursive visibility to prevent invisible nodes or descendants from animating/showing
            let isEffectivelyVisible = true;
            let checkNode = node;
            while (checkNode) {
                if (checkNode.visible === false) {
                    isEffectivelyVisible = false;
                    break;
                }
                checkNode = checkNode.parentId ? activeDoc.nodesById[checkNode.parentId] : null;
            }

            // Animation targeting:
            // When an element is a direct child of a telop:
            // If it has clipRect, the frame (root) stays static at fixed position, and its content (.content-wrapper) animates.
            // If it does not have clipRect, the element (root) animates.
            // IMPORTANT: Invisible nodes MUST NOT receive anim-target to prevent animation from forcing them visible!
            const shouldBeAnimTarget = isTelopChild && isEffectivelyVisible;

            if (node.clipRect) {
                root.classList.add("has-clip-rect");
                if (shouldBeAnimTarget) {
                    content.classList.add("anim-target");
                }
                if (node.domId) content.setAttribute("id", node.domId);
                if (node.domClass) {
                    const classes = node.domClass.trim().split(/\\s+/).filter(Boolean);
                    if (classes.length) content.classList.add(...classes);
                }
            } else {
                if (shouldBeAnimTarget) {
                    root.classList.add("anim-target");
                }
                if (node.domId) root.setAttribute("id", node.domId);
                if (node.domClass) {
                    const classes = node.domClass.trim().split(/\\s+/).filter(Boolean);
                    if (classes.length) root.classList.add(...classes);
                }
            }

            if (!isEffectivelyVisible) {
                root.classList.add("is-invisible");
                content.classList.add("is-invisible");
                root.setAttribute("display", "none");
                root.setAttribute("visibility", "hidden");
                root.style.setProperty("display", "none", "important");
                root.style.setProperty("visibility", "hidden", "important");
                root.style.setProperty("opacity", "0", "important");
                root.style.setProperty("animation", "none", "important");
                root.style.setProperty("pointer-events", "none", "important");
            }
            
            // If parent group applied an AutoLayout override, clone node and override positions
            let nodeToRender = node;
            if (autoLayoutOverride) {
                nodeToRender = { 
                    ...node, 
                    x: autoLayoutOverride.x, 
                    y: autoLayoutOverride.y 
                };
            }

            root.appendChild(content);

            if (node.clipRect) {
                const clip = node.clipRect;
                const cpId = \`clip-\${node.id}\`;
                const cp = createSVGElement("clipPath");
                setAttributes(cp, { id: cpId, clipPathUnits: "userSpaceOnUse" });
                const cr = createSVGElement("rect"); setAttributes(cr, { 
                    x: clip.x || 0, 
                    y: clip.y || 0, 
                    width: clip.width || 0, 
                    height: clip.height || 0, 
                    rx: clip.cornerRadius || 0, 
                    ry: clip.cornerRadius || 0 
                });
                cp.appendChild(cr); registerDef(cp);
                root.setAttribute("clip-path", \`url(#\${cpId})\`);
            }

            // Shared Logic: applyCommonProps handles pivot, transform, visibility, opacity
            applyCommonProps(root, nodeToRender);

            if (node.type === 'text') {
                const wrapper = createSVGElement("g");
                wrapper.classList.add("text-fit-wrapper");
                content.appendChild(wrapper);

                const { fitMode, contentW, contentH, transform } = layoutTextFit(node);
                wrapper.setAttribute("transform", transform);

                const apps = (node.style?.appearances || []).filter(a => a.enabled);
                
                if (apps.length === 0) {
                    const text = createSVGElement("text");
                    setupTextBase(text, node, contentW, contentH);
                    setAttributes(text, { fill: parseHex8(node.style?.fill).color });
                    wrapper.appendChild(text);
                } else {
                    [...apps].reverse().forEach((a, k) => {
                        const appIdx = apps.length - 1 - k;
                        if (a.isMask) {
                            const maskId = \`mask-app-text-\${node.id}-\${appIdx}\`;
                            const maskEl = createAppearanceMask(maskId, a, node, appIdx, false, contentW, contentH, registerDef, createSVGElement);
                            registerDef(maskEl);
                            const subWrapper = createSVGElement("g");
                            subWrapper.setAttribute("mask", \`url(#\${maskId})\`);
                            while (wrapper.firstChild) {
                                subWrapper.appendChild(wrapper.firstChild);
                            }
                            wrapper.appendChild(subWrapper);
                        } else {
                            let g = createSVGElement("g");
                            g.classList.add("appearance-layer");
                            g = applyEffects(g, a.effects, node.id, \`app-\${appIdx}\`, registerDef, createSVGElement);
                            drawAppearanceContent(g, a, node, appIdx, false, contentW, contentH, registerDef, createSVGElement);
                            wrapper.appendChild(g);
                        }
                    });
                }

                if (fitMode === 'none' && (node.width || node.height)) {
                    const cpId = \`clip-t-\${node.id}\`;
                    const cp = createSVGElement("clipPath"); cp.setAttribute("id", cpId);
                    const cr = createSVGElement("rect"); setAttributes(cr, { width: node.width || 5000, height: node.height || 5000 });
                    cp.appendChild(cr); registerDef(cp);
                    content.setAttribute("clip-path", \`url(#\${cpId})\`);
                }
            } else if (node.type === 'rect') {
                const w = node.width || 100, h = node.height || 100;
                let apps = (node.style?.appearances || []).filter(a => a.enabled);
                if (apps.length === 0) {
                    const style = node.style || {};
                    apps = [{
                        enabled: true,
                        fillEnabled: true,
                        fill: style.fill || "#000000",
                        gradientConfig: style.gradientConfig,
                        strokeEnabled: !!(style.stroke && style.stroke !== "none"),
                        color: style.stroke || "#000000",
                        thickness: style.strokeThickness || 0,
                        lineJoin: "miter",
                        miterLimit: 10
                    }];
                }
                
                [...apps].reverse().forEach((a, i) => {
                    const appIdx = apps.length - 1 - i;
                    if (a.isMask) {
                        const maskId = \`mask-app-rect-\${node.id}-\${appIdx}\`;
                        const maskEl = createAppearanceMask(maskId, a, node, appIdx, true, undefined, undefined, registerDef, createSVGElement);
                        registerDef(maskEl);
                        const subWrapper = createSVGElement("g");
                        subWrapper.setAttribute("mask", \`url(#\${maskId})\`);
                        while (content.firstChild) {
                            subWrapper.appendChild(content.firstChild);
                        }
                        content.appendChild(subWrapper);
                    } else {
                        let g = createSVGElement("g");
                        g.classList.add("appearance-layer");
                        g = applyEffects(g, a.effects, node.id, \`app-\${appIdx}\`, registerDef, createSVGElement);
                        drawAppearanceContent(g, a, node, appIdx, true, undefined, undefined, registerDef, createSVGElement);
                        content.appendChild(g);
                    }
                });
            } else if (node.type === 'image') {
                const img = createSVGElement("image");
                const asset = (activeDoc.assets && activeDoc.assets[node.assetId]) || (projectData.assets ? projectData.assets[node.assetId] : null);
                const src = asset ? asset.src : null;
                setAttributes(img, { 
                    width: node.width || 100, 
                    height: node.height || 100, 
                    href: (src && assetCache[src]) ? assetCache[src] : (src || ""), 
                    preserveAspectRatio: "none" 
                });
                content.appendChild(img);
            } else if (node.type === 'group' || node.type === 'telop' || node.type === 'plane') {
                if (node.type === 'group' && node.background && node.background.enabled) {
                    const children = node.children || [];
                    const visibleChildren = children.filter(cid => {
                        const child = activeDoc.nodesById[cid];
                        return child && child.visible !== false;
                    });
                    if (children.length === 0 || visibleChildren.length > 0) {
                        const bounds = calculateNodeBounds(node.id, activeDoc, TextMeasurer);
                        const bgContainer = createSVGElement("g");
                        bgContainer.setAttribute("class", "group-background");

                        const bgW = bounds.width;
                        const bgH = bounds.height;
                        bgContainer.setAttribute("transform", \`translate(\${bounds.x}, \${bounds.y})\`);

                        const activeAppearances = (node.background.appearances || []).filter(a => a.enabled);
                        if (activeAppearances.length > 0) {
                            [...activeAppearances].reverse().forEach((app, idx) => {
                                const appIdx = activeAppearances.length - 1 - idx;
                                if (app.isMask) {
                                    const maskId = \`mask-app-bg-\${node.id}-\${appIdx}\`;
                                    const maskEl = createAppearanceMask(maskId, app, node, appIdx, true, bgW, bgH, registerDef, createSVGElement);
                                    registerDef(maskEl);
                                    const subWrapper = createSVGElement("g");
                                    subWrapper.setAttribute("mask", \`url(#\${maskId})\`);
                                    while (bgContainer.firstChild) {
                                        subWrapper.appendChild(bgContainer.firstChild);
                                    }
                                    bgContainer.appendChild(subWrapper);
                                } else {
                                    let layer = createSVGElement("g");
                                    layer.setAttribute("class", "appearance-layer");
                                    layer = applyEffects(layer, app.effects, node.id, \`bg-\${appIdx}\`, registerDef, createSVGElement);
                                    drawAppearanceContent(layer, app, node, appIdx, true, bgW, bgH, registerDef, createSVGElement);
                                    bgContainer.appendChild(layer);
                                }
                            });
                        }

                        if (node.background.assetId) {
                            const asset = projectData.assets ? projectData.assets[node.background.assetId] : null;
                            const src = asset ? asset.src : null;
                            const resolvedHref = (src && assetCache[src]) ? assetCache[src] : (src || "");
                            if (resolvedHref) {
                                if (node.background.nineSlice) {
                                    const ns = node.background.nineSlice;
                                    const iw = asset ? asset.width : 100;
                                    const ih = asset ? asset.height : 100;
                                    const nsGroup = createNineSliceImage(resolvedHref, bgW, bgH, ns, iw, ih);
                                    bgContainer.appendChild(nsGroup);
                                } else {
                                    const image = createSVGElement("image");
                                    setAttributes(image, {
                                        x: 0, y: 0, width: bgW, height: bgH,
                                        href: resolvedHref,
                                        preserveAspectRatio: "none"
                                    });
                                    bgContainer.appendChild(image);
                                }
                            }
                        }
                        const insertTarget = content;
                        if (insertTarget && insertTarget.parentNode === root) {
                            root.insertBefore(bgContainer, insertTarget);
                        } else {
                            root.appendChild(bgContainer);
                        }
                    }
                }
            }

            const finalRoot = applyEffects(root, node.effects, node.id, "node", registerDef, createSVGElement);

            let autoLayoutPositions = null;
            // AutoLayout\u30B0\u30EB\u30FC\u30D7\u306F transform \u5C02\u7528\u306E\u30E9\u30C3\u30D1\u30FC <g> \u3067\u5305\u307F\u3001\u5916\u90E8JS\uFF08\u30B9\u30AF\u30ED\u30FC\u30EB\u7B49\uFF09\u306E transform \u306F\u30E9\u30C3\u30D1\u30FC\u306B\u304B\u3051\u308B\u3002
            // \u30B0\u30EB\u30FC\u30D7\u81EA\u8EAB\u306E\u914D\u7F6E\uFF08x/y\u30FBAutoLayout \u306E\u4F4D\u7F6E\uFF09\u306F\u4E2D\u306E\u8981\u7D20\u306B\u6B8B\u308B\u306E\u3067\u3001JS \u306E transform \u3068\u53D6\u308A\u5408\u308F\u306A\u3044\u3002
            // data-node-id \u3068 domId \u306F\u30E9\u30C3\u30D1\u30FC\u306B\u4ED8\u3051\u308B\u305F\u3081\u3001Hub \u306E\u5DEE\u3057\u66FF\u3048\u3084 JS \u306E querySelector \u306F\u30E9\u30C3\u30D1\u30FC\u3092\u5BFE\u8C61\u306B\u3059\u308B\u3002
            let outerEl = finalRoot;
            if (node.type === 'group' && node.autoLayout && node.autoLayout.enabled) {
                const layout = calculateAutoLayout(node, activeDoc, TextMeasurer);
                autoLayoutPositions = layout.childrenPositions;

                const transformHost = createSVGElement("g");
                transformHost.classList.add("autolayout-transform-host");
                transformHost.setAttribute("data-node-id", node.id);
                root.removeAttribute("data-node-id");
                if (!node.clipRect && node.domId) {
                    root.removeAttribute("id");
                    transformHost.setAttribute("id", node.domId);
                }

                // \u518D\u751F\u6210\u6642\u306F\u3001\u53E4\u3044\u30E9\u30C3\u30D1\u30FC\u306B\u5916\u90E8JS\u304C\u4ED8\u3051\u305F transform \u3092\u5F15\u304D\u7D99\u3050\uFF08\u30E9\u30C3\u30D1\u30FC\u306E transform \u306F\u30EC\u30F3\u30C0\u30E9\u30FC\u304C\u66F8\u304B\u306A\u3044\u306E\u3067\u3001\u4E38\u3054\u3068\u30B3\u30D4\u30FC\u3057\u3066\u3088\u3044\uFF09
                if (typeof document !== 'undefined') {
                    const existingEl = document.querySelector(\`[data-node-id="\${node.id}"]\`);
                    if (existingEl && existingEl.classList.contains("autolayout-transform-host")) {
                        const existingTransformStyle = existingEl.style.transform;
                        if (existingTransformStyle) {
                            transformHost.style.transform = existingTransformStyle;
                            transformHost.style.transformBox = existingEl.style.transformBox || 'fill-box';
                            transformHost.style.transformOrigin = existingEl.style.transformOrigin || '0 0';
                        }
                        const existingTransformAttr = existingEl.getAttribute('transform');
                        if (existingTransformAttr) {
                            transformHost.setAttribute('transform', existingTransformAttr);
                        }
                    }
                }

                transformHost.appendChild(finalRoot);
                outerEl = transformHost;
            }

            if (node.children) {
                const targetWrapper = (node.type === 'group')
                    ? (root.querySelector(".content-wrapper") || root)
                    : finalRoot;
                const childrenAreTelopChildren = (node.type === 'telop');
                node.children.forEach(cid => {
                    const override = autoLayoutPositions ? autoLayoutPositions[cid] : null;
                    const c = window.createNode(cid, override, childrenAreTelopChildren);
                    if (c) targetWrapper.appendChild(c);
                });
            }

            const registerKeyExp = (key, targetObj) => {
                if (!window.keyExpMap.has(key)) {
                    window.keyExpMap.set(key, []);
                }
                window.keyExpMap.get(key).push(targetObj);
            };

            if (!window.nodeElementMap) window.nodeElementMap = new Map();
            window.nodeElementMap.set(node.id, outerEl);

            if (node.keyexp) registerKeyExp(node.keyexp, { type: node.type, nodeData: node, element: outerEl });
            if (node.visibilityCondition && node.visibilityCondition.targetKeyexp) {
                registerKeyExp(node.visibilityCondition.targetKeyexp, { type: 'visibility_condition', nodeData: node, element: outerEl });
            }
            if (node.imageReferenceCondition && node.imageReferenceCondition.targetKeyexp) {
                registerKeyExp(node.imageReferenceCondition.targetKeyexp, { type: 'image_reference_condition', nodeData: node, element: outerEl });
            }
            
            const registerAppKeyExps = (apps, isBg) => {
                (apps || []).forEach((app, idx) => {
                    if (app.fillKeyexp) {
                        registerKeyExp(app.fillKeyexp, { type: isBg ? 'bg_appearance_fill' : 'appearance_fill', nodeData: node, appearanceIndex: idx, element: outerEl });
                    }
                    if (app.strokeKeyexp) {
                        registerKeyExp(app.strokeKeyexp, { type: isBg ? 'bg_appearance_stroke' : 'appearance_stroke', nodeData: node, appearanceIndex: idx, element: outerEl });
                    }
                    const registerRuleList = (ruleList) => {
                        if (!Array.isArray(ruleList)) return;
                        ruleList.forEach((rule) => {
                            if (rule && rule.targetKeyexp) {
                                registerKeyExp(rule.targetKeyexp, { type: isBg ? 'bg_appearance_color_rule' : 'appearance_color_rule', nodeData: node, appearanceIndex: idx, element: outerEl });
                            }
                        });
                    };
                    registerRuleList(app.fillColorRules);
                    registerRuleList(app.strokeColorRules);
                    registerRuleList(app.shadowColorRules);
                    registerRuleList(app.colorRules);
                    if (app.gradientConfig?.stops && Array.isArray(app.gradientConfig.stops)) {
                        app.gradientConfig.stops.forEach((s) => registerRuleList(s.colorRules));
                    }
                });
            };
            registerAppKeyExps(node.style?.appearances, false);
            registerAppKeyExps(node.background?.appearances, true);

            return outerEl;
        };

        const evaluatedDoc = resolveDynamicVisibility(projectData);
        window.telopDoc = evaluatedDoc;
        try {
            const rootNode = window.createNode(projectData.rootId);
            if (rootNode) svg.appendChild(rootNode);
        } catch (e) {
            console.error("Error creating initial root node in initPlayer", e);
        }
        
        window.dispatchEvent(new CustomEvent('telopRendered'));
    };
})();
`;

// vendor/TelopEditor/src/persistence/ProjectConstants.ts
var HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>{{TITLE}}</title>
    <link rel="stylesheet" href="/fonts/fonts.css">
    <link rel="stylesheet" href="./{{CSS_FILENAME}}">
    <script src="../viewer/renderer.js{{RENDERER_VERSION}}"></script>
    <script src="./{{JS_FILENAME}}"></script>
</head>
<body>
    <div id="player-container"></div>
</body>
</html>`;
var PLAYER_JS = PLAYER_JS_CONTENT;
var CONTROLLER_CODE = `// @telop-editor-default-template: If you modify this file, remove this line to prevent TelopEditor from overwriting your changes.

// --- External Control API ---
window._pendingRenderableObject = null;
window._pendingShow = false;

/**
 * \u30C6\u30ED\u30C3\u30D7\u3092\u8868\u793A\u3059\u308B\u95A2\u6570
 * @param {Object} rendarableObject - \u30EC\u30F3\u30C0\u30EA\u30F3\u30B0\u53EF\u80FD\u306A\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u3002
 */
window.showTelop = function (rendarableObject) {
    if (rendarableObject !== undefined) {
        window.updateTelop(rendarableObject);
    }

    if (!window.initialized) {
        window._pendingShow = true;
        return;
    }

    // containerId is exposed by initPlayer
    const divElement = document.getElementById(window.containerId || 'player-container');
    if (divElement) {
        if (!divElement.classList.contains("in_animation")) {
            divElement.classList.remove(...divElement.classList);
            divElement.style.opacity = "0";
            
            const triggerShow = () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        divElement.style.opacity = "";
                        divElement.classList.add("in_animation");
                        document.body.style.display = "block";
                    });
                });
            };

            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(triggerShow).catch(triggerShow);
            } else {
                triggerShow();
            }
        }
    }
};

/**
 * \u30C6\u30ED\u30C3\u30D7\u306E\u5185\u5BB9\u3092\u66F4\u65B0\u3059\u308B\u95A2\u6570
 * @param {Object} rendarableObject - \u30EC\u30F3\u30C0\u30EA\u30F3\u30B0\u53EF\u80FD\u306A\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u3002
 */
window.updateTelop = function (rendarableObject) {
    console.log("updateTelop called", rendarableObject);
    if (!rendarableObject) return;

    // Globals exposed by renderer.js
    const app = window.telopApp;
    const doc = window.telopDoc;
    const keyExpMap = window.keyExpMap;
    const createNode = window.createNode;

    if (!app || !doc || !keyExpMap || !createNode) {
        console.error("updateTelop early return: Missing required globals:", { app: !!app, doc: !!doc, keyExpMap: !!keyExpMap, createNode: !!createNode });
        console.warn("Player not fully initialized yet. Caching update...");
        window._pendingRenderableObject = rendarableObject;
        return;
    }

    let hasUpdates = false;

    Object.keys(rendarableObject).forEach(key => {
        const val = rendarableObject[key];
        const targets = keyExpMap.get(key);
        console.log("Processing key: " + key + ", targets found: " + (targets ? targets.length : 0) + ", val: " + val);

        if (targets && Array.isArray(targets) && (val || val === "")) {
            targets.forEach((target) => {
                if (target.type === 'text') {
                    // Update Doc
                    const strVal = String(val);
                    if (target.nodeData.text !== strVal) {
                        target.nodeData.text = strVal;
                        const nodeInDoc = doc.nodesById[target.nodeData.id];
                        if (nodeInDoc) {
                            nodeInDoc.text = strVal;
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'image') {
                    // Update Doc (Asset)
                    const node = target.nodeData;
                    if (node.assetId && doc.assets[node.assetId]) {
                        if (doc.assets[node.assetId].src !== String(val)) {
                            // Clone asset to avoid clobbering shared assetId entries
                            var uniqueAssetId = node.assetId + '__keyexp_' + key;
                            doc.assets[uniqueAssetId] = Object.assign({}, doc.assets[node.assetId], { src: String(val) });
                            node.assetId = uniqueAssetId;
                            
                            // Also mutate the node inside the active document to persist the change
                            const nodeInDoc = doc.nodesById[node.id];
                            if (nodeInDoc) {
                                nodeInDoc.assetId = uniqueAssetId;
                            }
                            
                            hasUpdates = true;
                        }
                    }
                } else if (target.type === 'appearance_fill') {
                    const apps = target.nodeData.style?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];
                    if (app && (app.fill !== String(val) || app.gradientConfig)) {
                        console.log("Updating appearance_fill for " + target.nodeData.id + " to " + val);
                        app.fill = String(val);
                        if (app.gradientConfig) { delete app.gradientConfig; }
                        if (docApp) {
                            docApp.fill = String(val);
                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'appearance_stroke') {
                    const apps = target.nodeData.style?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.style?.appearances?.[target.appearanceIndex];
                    if (app && app.color !== String(val)) {
                        console.log("Updating appearance_stroke for " + target.nodeData.id + " to " + val);
                        app.color = String(val);
                        if (docApp) {
                            docApp.color = String(val);
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'bg_appearance_fill') {
                    const apps = target.nodeData.background?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];
                    if (app && (app.fill !== String(val) || app.gradientConfig)) {
                        console.log("Updating bg_appearance_fill for " + target.nodeData.id + " to " + val);
                        app.fill = String(val);
                        if (app.gradientConfig) { delete app.gradientConfig; }
                        if (docApp) {
                            docApp.fill = String(val);
                            if (docApp.gradientConfig) { delete docApp.gradientConfig; }
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'bg_appearance_stroke') {
                    const apps = target.nodeData.background?.appearances || [];
                    const app = apps[target.appearanceIndex];
                    const docNode = doc.nodesById[target.nodeData.id];
                    const docApp = docNode?.background?.appearances?.[target.appearanceIndex];
                    if (app && app.color !== String(val)) {
                        console.log("Updating bg_appearance_stroke for " + target.nodeData.id + " to " + val);
                        app.color = String(val);
                        if (docApp) {
                            docApp.color = String(val);
                        }
                        hasUpdates = true;
                    }
                } else if (target.type === 'appearance_color_rule' || target.type === 'bg_appearance_color_rule' || target.type === 'visibility_condition' || target.type === 'image_reference_condition') {
                    hasUpdates = true;
                }
            });
        }
    });

    if (rendarableObject.highliteNum !== undefined || rendarableObject.barNum !== undefined) {
        hasUpdates = true;
    }

    if (hasUpdates) {
        const evaluatedDoc = resolveDynamicVisibility(doc, rendarableObject);

        // In-place image reference & visibility condition updates (zero-flicker)
        for (const nodeId in evaluatedDoc.nodesById) {
            const prevNode = doc.nodesById[nodeId];
            const nextNode = evaluatedDoc.nodesById[nodeId];
            if (prevNode && nextNode && nextNode.type === 'image') {
                if (prevNode.assetId !== nextNode.assetId) {
                    const nextAsset = (evaluatedDoc.assets && evaluatedDoc.assets[nextNode.assetId]) ||
                                      (projectData.assets && projectData.assets[nextNode.assetId]);
                    if (nextAsset && nextAsset.src) {
                        const nodeEl = app.querySelector('[data-node-id="' + nodeId + '"]');
                        const imgEl = nodeEl ? nodeEl.querySelector("image") : null;
                        if (imgEl) {
                            const targetSrc = (assetCache && assetCache[nextAsset.src]) ? assetCache[nextAsset.src] : nextAsset.src;
                            imgEl.setAttribute("href", targetSrc);
                        }
                    }
                    prevNode.assetId = nextNode.assetId;
                }
            }
            if (prevNode && nextNode && prevNode.visible !== nextNode.visible) {
                const nodeEl = app.querySelector('[data-node-id="' + nodeId + '"]');
                if (nodeEl) {
                    nodeEl.style.display = nextNode.visible === false ? 'none' : '';
                }
                prevNode.visible = nextNode.visible;
            }
        }

        window.telopDoc = evaluatedDoc;

        keyExpMap.clear();

        try {
            const oldDefs = app.firstChild;
            if (oldDefs) oldDefs.innerHTML = '';

            const newRootNode = createNode(evaluatedDoc.rootId || doc.rootId);
            if (newRootNode) {
                if (app.childNodes.length > 1) {
                    app.replaceChild(newRootNode, app.childNodes[1]);
                } else {
                    app.appendChild(newRootNode);
                }

                while (app.childNodes.length > 2) {
                    app.removeChild(app.lastChild);
                }
            }
        } catch (e) {
            console.error("Error creating new root node in updateTelop:", e);
        }

        window.dispatchEvent(new CustomEvent('telopRendered'));
    }
};

/**
 * \u30C6\u30ED\u30C3\u30D7\u3092\u975E\u8868\u793A\u306B\u3059\u308B\u95A2\u6570
 */
window.hideTelop = function () {
    const divElement = document.getElementById(window.containerId || 'player-container');
    if (divElement) {
        divElement.classList.remove(...divElement.classList);

        let finished = false;
        const completeHide = () => {
            if (finished) return;
            finished = true;
            divElement.style.opacity = '0';
            divElement.classList.remove("out_animation");
            if (window.animationFinishedCallback) {
                window.animationFinishedCallback();
            }
            divElement.removeEventListener('animationend', onAnimationEnd);
        };

        const onAnimationEnd = (e) => {
            if (!divElement.classList.contains("out_animation")) return;
            completeHide();
        };

        divElement.addEventListener('animationend', onAnimationEnd);
        divElement.classList.add("out_animation");

        // Safety fallback: if no animation or animationend doesn't fire, complete after duration or max 1s
        const animTarget = divElement.querySelector('.anim-target') || divElement;
        const animDuration = parseFloat(getComputedStyle(animTarget).animationDuration || '0');
        const animDelay = parseFloat(getComputedStyle(animTarget).animationDelay || '0');
        const timeoutMs = Math.max(1000, (animDuration + animDelay + 0.5) * 1000);
        setTimeout(() => {
            if (!finished && divElement.classList.contains("out_animation")) {
                completeHide();
            }
        }, timeoutMs);
    }
};
`;
var CSS_CONTENT = `/* @telop-editor-default-template: If you modify this file, remove this line to prevent TelopEditor from overwriting your changes. */
body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
svg { width: 100%; height: 100%; display: block; }
#player-container { opacity: 0; width: 1920px; height: 1080px; }
.in_animation, #player-container.in_animation { opacity: 1; }
.out_animation, #player-container.out_animation { opacity: 1; }
#player-container.in_animation .anim-target, .in_animation:not(#player-container) { animation: fadeIn 0s forwards; opacity: 1; }
#player-container.out_animation .anim-target, .out_animation:not(#player-container) { animation: fadeOut 0s forwards; }
#player-container.in_animation:not(:has(.anim-target)) { animation: fadeIn 0s forwards; opacity: 1; }
#player-container.out_animation:not(:has(.anim-target)) { animation: fadeOut 0s forwards; }
/* Invisible node guard: never display or animate invisible nodes */
svg [visibility="hidden"],
.is-invisible,
.is-invisible * {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    animation: none !important;
    transform: none !important;
    pointer-events: none !important;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`;

// vendor/TelopEditor/src/persistence/ProjectRepair.ts
var ProjectRepair = class {
  /**
   * Internal utility to repair the ProjectDoc hierarchy.
   * Enforces the Root -> Plane -> Telop structure and repairs broken links.
   */
  static repairProjectDoc(doc) {
    const nodes = doc.nodesById;
    if (!nodes) return;
    let rootPlane = nodes[doc.rootId];
    if (!rootPlane || rootPlane.type !== "plane") {
      const otherPlaneId = Object.keys(nodes).find((id) => nodes[id].type === "plane");
      if (otherPlaneId) {
        rootPlane = nodes[otherPlaneId];
        doc.rootId = otherPlaneId;
        console.log(`[ProjectRepair] Hierarchy Repair: rootId updated to existing plane: ${otherPlaneId}`);
      } else {
        console.warn("[ProjectRepair] Hierarchy Repair: No plane node found in document.");
        return;
      }
    }
    const planeId = doc.rootId;
    for (const [id, node] of Object.entries(nodes)) {
      const n = node;
      if (n.children && Array.isArray(n.children)) {
        const originalCount = n.children.length;
        n.children = n.children.filter((cid) => nodes[cid] !== void 0);
        if (n.children.length !== originalCount) {
          console.warn(`[ProjectRepair] Pruned ${originalCount - n.children.length} missing children from node ${id}`);
        }
      }
    }
    if (!Array.isArray(rootPlane.children)) {
      rootPlane.children = [];
    }
    const planeChildren = new Set(rootPlane.children);
    for (const [idStr, node] of Object.entries(nodes)) {
      const id = idStr;
      if (id === planeId) {
        node.parentId = null;
        continue;
      }
      if (node.type === "telop") {
        if (!planeChildren.has(id)) {
          rootPlane.children.push(id);
          planeChildren.add(id);
          console.log(`[ProjectRepair] Hierarchy Repair: Recovered orphaned telop: ${id}`);
        }
        node.parentId = planeId;
      }
      if (node.visible === void 0) node.visible = true;
      if (node.locked === void 0) node.locked = false;
      if (!node.effects) node.effects = [];
    }
    const reachable = /* @__PURE__ */ new Set();
    const walk2 = (id) => {
      if (reachable.has(id)) return;
      const n = nodes[id];
      if (!n) return;
      reachable.add(id);
      if (n.children && Array.isArray(n.children)) {
        n.children.forEach((cid) => walk2(String(cid)));
      }
    };
    walk2(doc.rootId);
    for (const id of Object.keys(nodes)) {
      if (!reachable.has(id)) {
        console.warn(`[ProjectRepair] Hierarchy Repair: Pruning unreachable node: ${id}`);
        delete nodes[id];
      }
    }
    if (!doc.assetGroups) doc.assetGroups = {};
    if (!doc.assets) doc.assets = {};
    for (const asset of Object.values(doc.assets)) {
      if (asset.groupId === void 0) asset.groupId = null;
    }
    const srcToAssetIdsMap = {};
    Object.entries(doc.assets).forEach(([id, asset]) => {
      if (!asset || !asset.src) return;
      const ownerKey = (asset.ownerId || "global") + ":" + asset.src.normalize("NFC").replace(/\\/g, "/").toLowerCase();
      if (!srcToAssetIdsMap[ownerKey]) srcToAssetIdsMap[ownerKey] = [];
      srcToAssetIdsMap[ownerKey].push(id);
    });
    Object.values(srcToAssetIdsMap).forEach((ids) => {
      if (ids.length <= 1) return;
      let canonicalId = ids.find((id) => id.startsWith("a1_"));
      if (!canonicalId) {
        ids.sort();
        canonicalId = ids[0];
      }
      const redundantIds = ids.filter((id) => id !== canonicalId);
      redundantIds.forEach((oldId) => {
        delete doc.assets[oldId];
        Object.values(doc.nodesById).forEach((node) => {
          if (node && node.type === "image" && node.assetId === oldId) {
            node.assetId = canonicalId;
          }
        });
      });
    });
    Object.values(doc.nodesById).forEach((node) => {
      if (node && node.type === "image") {
        const targetAsset = node.assetId ? doc.assets[node.assetId] : null;
        if (!node.width || node.width <= 0) {
          node.width = targetAsset && targetAsset.width > 0 ? targetAsset.width : 200;
        }
        if (!node.height || node.height <= 0) {
          node.height = targetAsset && targetAsset.height > 0 ? targetAsset.height : 200;
        }
        if (node.assetId && !doc.assets[node.assetId]) {
          const matchedAsset = Object.values(doc.assets).find(
            (a) => a.name === node.name || a.ownerId && a.ownerId === node.parentId
          );
          if (matchedAsset) {
            console.log(`[ProjectRepair] Healed ImageNode ${node.id} assetId link -> ${matchedAsset.id}`);
            node.assetId = matchedAsset.id;
          }
        }
      }
    });
  }
};

// vendor/TelopEditor/src/domain/projectdoc/repeatUtils.ts
var REPEAT_ID_SEPARATOR = "~";
var DEFAULT_REPEAT_VAR = "i";
var REPEAT_VAR_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
var REPEAT_VAR_TOKEN = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
var NON_SUBSTITUTED_KEYS = /* @__PURE__ */ new Set(["id", "parentId", "children", "assetId"]);
function isRepeatGroup(node) {
  return !!node && node.type === "group" && !!node.autoLayout?.enabled && !!node.repeat?.enabled;
}
function isValidRepeatVar(name) {
  return typeof name === "string" && REPEAT_VAR_NAME.test(name);
}
function getRepeatVar(group) {
  const name = group?.repeat?.var;
  return isValidRepeatVar(name) ? name : DEFAULT_REPEAT_VAR;
}
function findRepeatAncestors(doc, nodeId) {
  const out = [];
  let parentId = doc.nodesById[nodeId]?.parentId;
  while (parentId) {
    const parent = doc.nodesById[parentId];
    if (!parent) break;
    if (isRepeatGroup(parent)) out.unshift(parent);
    parentId = parent.parentId;
  }
  return out;
}
function collectSubtree(doc, rootId, out) {
  const node = doc.nodesById[rootId];
  if (!node) return;
  out.push(rootId);
  if (Array.isArray(node.children)) {
    node.children.forEach((childId) => collectSubtree(doc, childId, out));
  }
}
function analyzeRepeatGroup(doc, group) {
  const warnings = [];
  const rawCount = Math.floor(Number(group.repeat?.count));
  const count = isFinite(rawCount) && rawCount > 0 ? rawCount : 0;
  const children = Array.isArray(group.children) ? group.children : [];
  const ancestors = findRepeatAncestors(doc, group.id);
  const depth = ancestors.length;
  const varName = getRepeatVar(group);
  const rawVar = group.repeat?.var;
  if (rawVar !== void 0 && rawVar !== "" && !isValidRepeatVar(rawVar)) {
    warnings.push(`Invalid variable name "${rawVar}" (letters, digits and _ only, not starting with a digit). Using {${DEFAULT_REPEAT_VAR}}`);
  }
  const shadowed = ancestors.find((a) => getRepeatVar(a) === varName);
  if (shadowed) {
    warnings.push(`Variable {${varName}} is also used by the outer repeat (${shadowed.name || shadowed.id}). Inside this template it means this group's row`);
  }
  if (children.length === 0) {
    return { templateId: null, count, depth, varName, expandable: false, warnings: [...warnings, "Repeat group has no child (template)"] };
  }
  if (children.length > 1) {
    warnings.push(`Repeat group has ${children.length} children. Only the first one is used as the template`);
  }
  return { templateId: children[0], count, depth, varName, expandable: true, warnings };
}
function substituteRowVars(value, vars) {
  if (typeof value === "string") {
    if (!value.includes("{")) return value;
    return value.replace(REPEAT_VAR_TOKEN, (token, name) => Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : token);
  }
  if (Array.isArray(value)) {
    return value.map((v) => substituteRowVars(v, vars));
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const key2 of Object.keys(value)) {
      out[key2] = NON_SUBSTITUTED_KEYS.has(key2) ? value[key2] : substituteRowVars(value[key2], vars);
    }
    return out;
  }
  return value;
}
function expandRepeats(doc, options = {}) {
  if (!doc || !doc.nodesById) return doc;
  const groups = Object.values(doc.nodesById).filter(isRepeatGroup);
  if (groups.length === 0) return doc;
  const warn = options.onWarning || ((groupId, message) => {
    console.warn(`[repeat] ${groupId}: ${message}`);
  });
  const nodesById = { ...doc.nodesById };
  const infoById = /* @__PURE__ */ new Map();
  for (const group of groups) {
    const info = analyzeRepeatGroup(doc, group);
    info.warnings.forEach((message) => warn(group.id, message));
    infoById.set(group.id, info);
  }
  const rowCountOf = (info) => options.maxCount !== void 0 ? Math.min(info.count, Math.max(0, options.maxCount)) : info.count;
  const idFor = (id, rows) => rows.length === 0 || options.keepFirstRowIds === true && rows.every((r) => r === 1) ? id : `${id}${REPEAT_ID_SEPARATOR}${rows.join(REPEAT_ID_SEPARATOR)}`;
  const expandChildren = (source, newId, rows, vars) => {
    const info = infoById.get(source.id);
    if (info && info.expandable && info.templateId) {
      const out = [];
      const count = rowCountOf(info);
      for (let r = 1; r <= count; r++) {
        out.push(copySubtree(info.templateId, newId, [...rows, r], { ...vars, [info.varName]: String(r) }));
      }
      return out;
    }
    return source.children.filter((childId) => doc.nodesById[childId]).map((childId) => copySubtree(childId, newId, rows, vars));
  };
  const copySubtree = (id, parentId, rows, vars) => {
    const source = doc.nodesById[id];
    const copy = substituteRowVars(source, vars);
    copy.id = idFor(id, rows);
    copy.parentId = parentId;
    if (Array.isArray(source.children)) {
      copy.children = expandChildren(source, copy.id, rows, vars);
    }
    nodesById[copy.id] = copy;
    return copy.id;
  };
  for (const group of groups) {
    const info = infoById.get(group.id);
    if (info.depth !== 0 || !info.expandable || !info.templateId) continue;
    const subtree = [];
    collectSubtree(doc, info.templateId, subtree);
    subtree.forEach((id) => {
      delete nodesById[id];
    });
    nodesById[group.id] = { ...group, children: expandChildren(group, group.id, [], {}) };
  }
  return { ...doc, nodesById };
}

// vendor/TelopEditor/src/persistence/ProjectExporter.ts
var FONT_FILE_REGEX = /\.(ttf|otf|woff2?)$/i;
var GENERATED_FONT_FACE_REGEX = /@font-face\s*\{[^{}]*?url\(\s*['"]?\/\.hub\/fonts\/[^{}]*\}\s*/g;
var ProjectExporter = class _ProjectExporter {
  /**
   * Remove previously generated @font-face blocks so re-saving custom CSS stays idempotent
   * (custom CSS is loaded back from the saved file, which already contains them).
   */
  static stripGeneratedFontFaces(css) {
    return css.replace(GENERATED_FONT_FACE_REGEX, "").trimStart();
  }
  /**
   * Helper to convert Blob to Base64 Data URL
   */
  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  /**
   * Generate project files as an array of path and content
   */
  /**
   * @param prevTelopNames - Telop folder names from the *previous* save.
   *   Used to compute which telops were deleted so the caller can skip the
   *   expensive full-prune scan in SyncManager.
   *   If omitted, deletedTelops in the result will be undefined (legacy).
   * @param includeRenderer - When false, viewer/renderer.js is omitted from the
   *   output (caller must ensure it was already written). Defaults to true.
   */
  static async generateProjectFiles(docIn, assetRegistry, prevTelopNames, includeRenderer = true, customFonts2) {
    const doc = JSON.parse(JSON.stringify(docIn));
    ProjectRepair.repairProjectDoc(doc);
    const expandedDoc = expandRepeats(doc);
    const files = [];
    const safeTitle = (doc.meta.title || "project").replace(/[\\/:*?"<>|]/g, "_").trim();
    const currentTelopNames = [];
    const rootDoc = {
      meta: doc.meta,
      rootId: doc.rootId,
      nodesById: {},
      assets: {},
      assetGroups: {}
    };
    const planeNode = doc.nodesById[doc.rootId];
    if (planeNode) {
      rootDoc.nodesById[doc.rootId] = planeNode;
    }
    files.push({ path: "project.json", content: JSON.stringify(rootDoc, null, 2) });
    if (includeRenderer) {
      files.push({ path: "viewer/renderer.js", content: PLAYER_JS });
    }
    if (planeNode && planeNode.type === "plane") {
      for (const telopId of planeNode.children) {
        const telopNode = doc.nodesById[telopId];
        if (telopNode && telopNode.type === "telop") {
          const telopName = (telopNode.name || telopId).replace(/[\\/:*?"<>|]/g, "_").trim();
          currentTelopNames.push(telopName);
          files.push({ path: `${telopName}/.telop_editor`, content: "" });
          const subNodes = {};
          const collect = (id) => {
            const node = doc.nodesById[id];
            if (!node) return;
            if (id === telopId) {
              const cleanNode = { ...node };
              delete cleanNode.customJs;
              delete cleanNode.customCss;
              subNodes[id] = cleanNode;
            } else {
              subNodes[id] = node;
            }
            if ("children" in node) {
              node.children.forEach(collect);
            }
          };
          collect(telopId);
          const telopAssets = Object.values(doc.assets).filter((a) => a.ownerId === telopId).sort((a, b) => a.id.localeCompare(b.id));
          const exportAssetsTelop = {};
          const usedNames = /* @__PURE__ */ new Set();
          for (const asset of telopAssets) {
            const assetId = asset.id;
            let filename;
            const isTempUrl = asset.src && (asset.src.startsWith("blob:") || asset.src.startsWith("data:"));
            if (asset.src && !isTempUrl) {
              const srcParts = asset.src.replace(/\\/g, "/").split("/");
              const srcFilename = srcParts[srcParts.length - 1];
              filename = srcFilename || asset.name || "asset";
            } else {
              filename = asset.name || "asset";
            }
            let baseName = filename.replace(/[\\/:*?"<>|]/g, "_");
            if (!baseName.includes(".")) baseName += ".png";
            filename = baseName;
            const groupName = asset.groupId && doc.assetGroups[asset.groupId] ? doc.assetGroups[asset.groupId].name.replace(/[\\/:*?"<>|]/g, "_").trim() : null;
            const subPath = groupName ? `img/${groupName}/` : "img/";
            const relativePath = subPath + filename;
            const fullExportPath = `${telopName}/${relativePath}`;
            const blob = await assetRegistry.getAssetBlob(assetId);
            if (blob) {
              const existingIndex = files.findIndex((f) => f.path === fullExportPath);
              if (existingIndex >= 0) {
                files[existingIndex].content = blob;
              } else {
                files.push({ path: fullExportPath, content: blob });
              }
              exportAssetsTelop[assetId] = { ...asset, src: relativePath };
            } else {
              console.warn(`[ProjectExporter] Asset blob unavailable for ${assetId} (${asset.name}). Preserving metadata.`);
              exportAssetsTelop[assetId] = { ...asset, src: relativePath };
            }
          }
          const keySourceNodes = [];
          const collectExpanded = (id) => {
            const node = expandedDoc.nodesById[id];
            if (!node) return;
            keySourceNodes.push(node);
            if (Array.isArray(node.children)) node.children.forEach(collectExpanded);
          };
          collectExpanded(telopId);
          const keyexpMap = {};
          keySourceNodes.forEach((node) => {
            if (node.keyexp) {
              if (node.type === "text") {
                keyexpMap[node.keyexp] = node.text || "";
              } else if (node.type === "image") {
                const asset = exportAssetsTelop[node.assetId];
                if (asset) {
                  keyexpMap[node.keyexp] = asset.src;
                }
              }
            }
            const extractApps = (apps) => {
              if (!apps) return;
              apps.forEach((app) => {
                if (app.fillKeyexp) {
                  keyexpMap[app.fillKeyexp] = String(Array.isArray(app.fill) ? app.fill[0] : app.fill);
                }
                if (app.strokeKeyexp) {
                  keyexpMap[app.strokeKeyexp] = app.color || "";
                }
                const extractRuleList = (ruleList) => {
                  if (!Array.isArray(ruleList)) return;
                  ruleList.forEach((rule) => {
                    if (rule && rule.targetKeyexp && !(rule.targetKeyexp in keyexpMap)) {
                      keyexpMap[rule.targetKeyexp] = rule.value || "";
                    }
                  });
                };
                extractRuleList(app.fillColorRules);
                extractRuleList(app.strokeColorRules);
                extractRuleList(app.shadowColorRules);
                extractRuleList(app.colorRules);
                if (app.gradientConfig?.stops && Array.isArray(app.gradientConfig.stops)) {
                  app.gradientConfig.stops.forEach((s) => extractRuleList(s.colorRules));
                }
              });
            };
            extractApps(node.style?.appearances);
            extractApps(node.background?.appearances);
          });
          const addConditionKey = (cond) => {
            if (cond && !cond.useExpression && cond.targetKeyexp && !(cond.targetKeyexp in keyexpMap)) {
              keyexpMap[cond.targetKeyexp] = "";
            }
          };
          keySourceNodes.forEach((node) => {
            if (node.visibilityCondition?.enabled) addConditionKey(node.visibilityCondition);
            if (node.imageReferenceCondition?.enabled) {
              addConditionKey(node.imageReferenceCondition);
              (node.imageReferenceCondition.rules || []).forEach(addConditionKey);
            }
          });
          const sortedAssetGroups = {};
          Object.keys(doc.assetGroups || {}).sort().forEach((k8) => {
            sortedAssetGroups[k8] = doc.assetGroups[k8];
          });
          const { commonKeys: _commonKeys, ...telopMeta } = doc.meta;
          const subDoc = {
            meta: { ...telopMeta, creator: "TelopEditor" },
            rootId: telopId,
            nodesById: subNodes,
            assets: exportAssetsTelop,
            assetGroups: sortedAssetGroups
          };
          if (Object.keys(keyexpMap).length > 0) {
            files.push({ path: `${telopName}/${telopName}.json`, content: JSON.stringify(keyexpMap, null, 2) });
          }
          const telopDataFile = telopName + ".telop";
          files.push({ path: `${telopName}/${telopDataFile}`, content: JSON.stringify(subDoc, null, 2) });
          const jsFileName = telopName + ".js";
          const cssFileName = telopName + ".css";
          const finalJs = telopNode.customJs || `
// 1. Data Loading (Auto-generated)
let projectData = null;
let assetCache = {};

// 2. Controller Logic (Editable)
${CONTROLLER_CODE}

// 3. Initialization
window.addEventListener('load', async () => {
    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        const dataUrl = './${telopName}.telop';
        const dataResp = await fetch(dataUrl);
        if (dataResp.ok) {
            projectData = await dataResp.json();
            console.log("[Player] Loaded project data from:", dataUrl);
        }
        assetCache = {};
        if (window.initPlayer) {
            window.initPlayer('player-container', projectData, assetCache).then(() => {
                window.initialized = true;
                if (window._pendingRenderableObject) {
                    window.updateTelop(window._pendingRenderableObject);
                    window._pendingRenderableObject = null;
                }
                if (window._pendingShow) {
                    window.showTelop();
                    window._pendingShow = false;
                }
            });
        }
    } catch (e) {
        console.error("[Player] Failed to initialize project data:", e);
    }
});
`;
          let fontFaceRules = "";
          const fontFiles = (customFonts2 || []).filter((f) => FONT_FILE_REGEX.test(f));
          if (fontFiles.length > 0) {
            const sortedFonts = [...new Set(fontFiles)].sort();
            fontFaceRules = sortedFonts.map((fontFile) => {
              const fontName = fontFile.substring(0, fontFile.lastIndexOf("."));
              const ext = fontFile.toLowerCase();
              let format = "truetype";
              if (ext.endsWith(".woff2")) format = "woff2";
              else if (ext.endsWith(".woff")) format = "woff";
              else if (ext.endsWith(".otf")) format = "opentype";
              return `@font-face {
    font-family: '${fontName}';
    src: url('/.hub/fonts/${fontFile}') format('${format}');
}`;
            }).join("\n") + "\n\n";
          }
          const customCss = telopNode.customCss;
          const cssContent = fontFaceRules + (customCss ? _ProjectExporter.stripGeneratedFontFaces(customCss) : CSS_CONTENT);
          files.push({ path: `${telopName}/${jsFileName}`, content: finalJs });
          files.push({ path: `${telopName}/${cssFileName}`, content: cssContent });
          const getStringHash = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
              const chr = str.charCodeAt(i);
              hash = (hash << 5) - hash + chr;
              hash |= 0;
            }
            return Math.abs(hash).toString(36);
          };
          const jsHash = getStringHash(finalJs);
          const cssHash = getStringHash(cssContent);
          const rendererHash = getStringHash(PLAYER_JS);
          const html = HTML_TEMPLATE.replace("{{TITLE}}", telopNode.name || telopName).replace("{{CSS_FILENAME}}", `${cssFileName}?v=${cssHash}`).replace("{{JS_FILENAME}}", `${jsFileName}?v=${jsHash}`).replace("{{RENDERER_VERSION}}", `?v=${rendererHash}`);
          files.push({ path: `${telopName}/${telopName}.html`, content: html });
        }
      }
    }
    const deletedTelops = prevTelopNames !== void 0 ? prevTelopNames.filter((name) => !currentTelopNames.includes(name)) : void 0;
    return { files, safeTitle, currentTelopNames, deletedTelops };
  }
  /**
   * Generate the project ZIP blob and metadata
   */
  static async generateProjectZip(doc, assetRegistry) {
    const { files, safeTitle } = await this.generateProjectFiles(doc, assetRegistry);
    const zip = new import_jszip.default();
    const rootFolder = zip.folder(safeTitle);
    if (!rootFolder) throw new Error("Failed to create root folder in ZIP");
    for (const file of files) {
      rootFolder.file(file.path, file.content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    return { blob, safeTitle };
  }
  /**
   * Save project and assets as a partitioned .zip file
   */
  static async saveProject(doc, assetRegistry) {
    const { blob, safeTitle } = await this.generateProjectZip(doc, assetRegistry);
    saveAs(blob, safeTitle + ".zip");
  }
};

// vendor/TelopEditor/src/domain/projectdoc/commonKeys.ts
function getCommonKeys(doc) {
  return doc.meta.commonKeys ?? [];
}
function flagNodeCommand(telopId, keyexp, value) {
  return {
    kind: "AddNode",
    parentId: telopId,
    node: {
      id: newNodeId(),
      type: "text",
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      pivotX: 0,
      pivotY: 0,
      skewX: 0,
      skewY: 0,
      opacity: 1,
      width: 200,
      height: 40,
      text: value,
      style: { fontFamily: "Noto Sans JP", fontSize: 24, appearances: [] },
      align: "left",
      verticalAlign: "top",
      fitMode: "none",
      name: keyexp,
      keyexp,
      visible: false,
      locked: true,
      blendMode: "normal",
      effects: []
    }
  };
}
function buildEnsureCommonKeysCommands(doc, telopId) {
  return getCommonKeys(doc).map((key2) => flagNodeCommand(telopId, key2.keyexp, key2.value));
}

// vendor/TelopEditor/tools/telopkit/src/imageSize.ts
function readImageSize(b) {
  if (b.length >= 24 && b.readUInt32BE(0) === 2303741511) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.length >= 10 && b.toString("ascii", 0, 3) === "GIF") {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  if (b.length >= 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 16383, height: b.readUInt16LE(28) & 16383 };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 16383) + 1, height: (bits >> 14 & 16383) + 1 };
    }
  }
  if (b.length >= 4 && b[0] === 255 && b[1] === 216) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 255) {
        i++;
        continue;
      }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 192 && marker <= 207 && marker !== 196 && marker !== 200 && marker !== 204) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

// vendor/TelopEditor/tools/telopkit/src/fsSafe.ts
import fs from "node:fs";
import path from "node:path";
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}
function removePath(p) {
  let st;
  try {
    st = fs.lstatSync(p);
  } catch {
    return;
  }
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(p)) removePath(path.join(p, name));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}

// vendor/TelopEditor/tools/telopkit/src/build.ts
var ASSET_REF = "@asset:";
var HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
var TEMPLATE_MARKER_LINE = /^\/\* @telop-editor-default-template[^\n]*\n/;
var Builder = class {
  constructor(spec, baseDir, base) {
    this.spec = spec;
    this.baseDir = baseDir;
    this.doc = createInitialProjectDoc(spec.title);
    if (spec.canvas) this.doc.meta.canvas = { ...spec.canvas };
    if (base) {
      const plane = { ...this.doc.nodesById[this.doc.rootId], id: base.rootId };
      this.doc = { ...this.doc, meta: { ...base.meta }, rootId: base.rootId, nodesById: { [base.rootId]: plane } };
    }
  }
  commands = [];
  warnings = [];
  /** assetId -> file bytes */
  blobs = /* @__PURE__ */ new Map();
  assetCache = /* @__PURE__ */ new Map();
  doc;
  build() {
    const names = /* @__PURE__ */ new Set();
    for (const telop of this.spec.telops) {
      if (!telop.name) throw new Error("telop.name is required");
      if (names.has(telop.name)) throw new Error(`duplicate telop name: ${telop.name}`);
      names.add(telop.name);
      this.addTelop(telop);
    }
    let doc = this.doc;
    for (const cmd of this.commands) doc = applyDocumentCommand(doc, cmd);
    return doc;
  }
  addTelop(spec) {
    const id = newNodeId();
    const customCss = spec.css ? CSS_CONTENT.replace(TEMPLATE_MARKER_LINE, "") + "\n\n/* telop css */\n" + spec.css.trim() + "\n" : void 0;
    this.commands.push({
      kind: "AddNode",
      parentId: this.doc.rootId,
      node: {
        id,
        type: "telop",
        ...transformOf({}),
        children: [],
        name: spec.name,
        visible: true,
        locked: false,
        blendMode: "normal",
        effects: [],
        ...customCss ? { customCss } : {},
        ...spec.raw ? this.resolveAssetRefs(spec.raw, id, spec.name) : {}
      }
    });
    if (!spec.raw) this.commands.push(...buildEnsureCommonKeysCommands(this.doc, id));
    for (const child of spec.children || []) this.addNode(child, id, id, spec.name);
  }
  /** Replaces "@asset:<path>" strings (written by `telopkit pull`) with asset ids registered for this telop */
  resolveAssetRefs(value, telopId, label) {
    if (typeof value === "string" && value.startsWith(ASSET_REF)) {
      return this.addAsset(value.slice(ASSET_REF.length), telopId, label).assetId;
    }
    if (Array.isArray(value)) return value.map((v) => this.resolveAssetRefs(v, telopId, label));
    if (value && typeof value === "object") {
      const out = {};
      for (const [k8, v] of Object.entries(value)) out[k8] = this.resolveAssetRefs(v, telopId, label);
      return out;
    }
    return value;
  }
  addNode(spec, parentId, telopId, where) {
    const label = `${where} > ${spec.name || spec.type}`;
    const id = newNodeId();
    const base = {
      id,
      type: spec.type,
      ...transformOf(spec),
      name: spec.name || defaultName(spec),
      visible: spec.visible ?? true,
      locked: spec.locked ?? false,
      blendMode: spec.blend || "normal",
      effects: (spec.effects || []).map(effectOf)
    };
    if (spec.class) base.domClass = spec.class;
    if (spec.domId) base.domId = spec.domId;
    if (spec.ignoreInLayout) base.ignoreInLayout = true;
    if (spec.showIf !== void 0) base.visibilityCondition = conditionOf(spec.showIf);
    let node;
    switch (spec.type) {
      case "text":
        node = { ...base, ...this.textProps(spec, label) };
        break;
      case "rect":
        node = { ...base, ...this.rectProps(spec, label) };
        break;
      case "image":
        node = { ...base, ...this.imageProps(spec, telopId, label) };
        break;
      case "group":
        node = { ...base, ...this.groupProps(spec, telopId, label), children: [] };
        break;
      default:
        throw new Error(`${label}: unknown node type ${spec.type}`);
    }
    if (spec.raw) Object.assign(node, this.resolveAssetRefs(spec.raw, telopId, label));
    this.commands.push({ kind: "AddNode", parentId, node });
    if (spec.type === "group") {
      if (spec.repeat && (spec.children || []).length !== 1) {
        this.warnings.push(`${label}: repeat expects exactly one template child (got ${(spec.children || []).length})`);
      }
      for (const child of spec.children || []) this.addNode(child, id, telopId, label);
    }
  }
  textProps(s, label) {
    if (typeof s.w !== "number") throw new Error(`${label}: text needs w`);
    if (s.weight !== void 0 && !["normal", "bold", 400, 700].includes(s.weight)) {
      this.warnings.push(`${label}: weight ${s.weight} renders as normal; the player only knows normal / bold (700)`);
    }
    const layers = s.layers ?? [s];
    return {
      text: s.text ?? "",
      ...s.key ? { keyexp: s.key } : {},
      width: s.w,
      ...s.h !== void 0 ? { height: s.h } : {},
      padding: s.padding ?? 0,
      align: s.align || "left",
      verticalAlign: s.valign || "top",
      fitMode: s.fit || "none",
      style: {
        fontFamily: s.font || "Noto Sans JP",
        fontSize: s.size ?? 48,
        ...s.weight !== void 0 ? { fontWeight: s.weight } : {},
        ...s.italic ? { fontStyle: "italic" } : {},
        ...s.letterSpacing !== void 0 ? { letterSpacing: s.letterSpacing } : {},
        ...s.lineHeight !== void 0 ? { lineHeight: s.lineHeight } : {},
        appearances: layers.map((p, i) => this.appearanceOf(p, `${label} layer${i}`, "#ffffff"))
      }
    };
  }
  rectProps(s, label) {
    if (typeof s.w !== "number" || typeof s.h !== "number") throw new Error(`${label}: rect needs w and h`);
    const layers = s.layers ?? [s];
    return {
      width: s.w,
      height: s.h,
      style: {
        cornerRadius: s.radius ?? 0,
        appearances: layers.map((p, i) => this.appearanceOf(p, `${label} layer${i}`, "#cccccc"))
      }
    };
  }
  imageProps(s, telopId, label) {
    const { assetId, width, height } = this.addAsset(s.src, telopId, label);
    let w = s.w, h = s.h;
    if (w === void 0 && h === void 0) {
      w = width;
      h = height;
    } else if (w === void 0) w = Math.round(h * width / height);
    else if (h === void 0) h = Math.round(w * height / width);
    return {
      assetId,
      width: w,
      height: h,
      ...s.key ? { keyexp: s.key } : {},
      ...s.keepRatio !== void 0 ? { keepRatio: s.keepRatio } : {}
    };
  }
  groupProps(s, telopId, label) {
    const out = {};
    if (s.clip) {
      out.clip = true;
      if (typeof s.clip === "object") {
        out.clipRect = { x: s.clip.x ?? 0, y: s.clip.y ?? 0, width: s.clip.w, height: s.clip.h, ...s.clip.radius ? { cornerRadius: s.clip.radius } : {} };
      }
    }
    if (s.layout) {
      out.autoLayout = {
        enabled: true,
        direction: s.layout.dir,
        gap: s.layout.gap ?? 0,
        padding: paddingOf(s.layout.padding),
        alignItems: s.layout.align || "start",
        justifyContent: s.layout.justify || "start"
      };
    }
    if (s.repeat) {
      if (!s.layout) this.warnings.push(`${label}: repeat only works with layout`);
      out.repeat = { enabled: true, count: s.repeat.count, ...s.repeat.var ? { var: s.repeat.var } : {} };
    }
    if (s.bg) {
      const bg = { enabled: true };
      const layers = s.bg.layers ?? (s.bg.fill !== void 0 || s.bg.stroke || s.bg.shadow ? [s.bg] : []);
      bg.appearances = layers.map((p, i) => this.appearanceOf(p, `${label} bg${i}`, "#000000"));
      if (s.bg.src) bg.assetId = this.addAsset(s.bg.src, telopId, label).assetId;
      if (s.bg.nineSlice) {
        const [top, right, bottom, left] = s.bg.nineSlice;
        bg.nineSlice = { top, right, bottom, left };
      }
      if (s.bg.radius !== void 0) bg.cornerRadius = s.bg.radius;
      out.background = bg;
    }
    return out;
  }
  appearanceOf(p, label, defaultFill) {
    const fill = p.fill === void 0 ? defaultFill : p.fill;
    const app = {
      enabled: true,
      fillEnabled: fill !== null,
      fill: "#ffffff",
      strokeEnabled: !!p.stroke,
      color: "#000000",
      thickness: 0,
      lineJoin: "round",
      miterLimit: 10
    };
    if (fill !== null) {
      if (typeof fill === "string") app.fill = this.color(fill, label);
      else {
        app.gradientConfig = this.gradientOf(fill, label);
        app.fill = app.gradientConfig.stops[0].color;
      }
    }
    if (p.fillKey) app.fillKeyexp = p.fillKey;
    if (p.stroke) {
      app.color = this.color(p.stroke.color, label);
      app.thickness = p.stroke.width;
      app.lineJoin = p.stroke.join || "round";
    }
    if (p.shadow) {
      app.shadowEnabled = true;
      app.shadowColor = this.color(p.shadow.color || "#000000", label);
      app.shadowBlur = p.shadow.blur ?? 8;
      app.shadowOffsetX = p.shadow.x ?? 0;
      app.shadowOffsetY = p.shadow.y ?? 4;
      app.shadowAlpha = p.shadow.alpha ?? 0.6;
    }
    if (p.effects) app.effects = p.effects.map(effectOf);
    return app;
  }
  gradientOf(g, label) {
    const n = g.stops.length;
    if (n < 2) throw new Error(`${label}: gradient needs at least 2 stops`);
    return {
      type: g.type || "linear",
      angle: g.angle ?? 0,
      units: "objectBoundingBox",
      ...g.centerX !== void 0 ? { centerX: g.centerX } : {},
      ...g.centerY !== void 0 ? { centerY: g.centerY } : {},
      ...g.radius !== void 0 ? { radius: g.radius } : {},
      stops: g.stops.map((s, i) => Array.isArray(s) ? { offset: s[0], color: this.color(s[1], label) } : { offset: i / (n - 1), color: this.color(s, label) })
    };
  }
  color(c, label) {
    if (!HEX_COLOR.test(c)) this.warnings.push(`${label}: color "${c}" is not hex; the player only reads #rgb/#rrggbb/#rrggbbaa`);
    return c;
  }
  addAsset(src, telopId, label) {
    const file = path2.resolve(this.baseDir, src);
    if (!fs2.existsSync(file)) throw new Error(`${label}: image not found: ${file}`);
    const cacheKey = `${telopId}:${file}`;
    const cached = this.assetCache.get(cacheKey);
    if (cached) return cached;
    const bytes = fs2.readFileSync(file);
    const size = readImageSize(bytes);
    if (!size) this.warnings.push(`${label}: could not read image size of ${src}; using 100x100`);
    const { width, height } = size || { width: 100, height: 100 };
    const assetId = newAssetId();
    const name = path2.basename(file);
    this.blobs.set(assetId, new Blob([bytes], { type: mimeOf(name) }));
    this.commands.push({
      kind: "AddAsset",
      asset: { id: assetId, kind: "image", name, src: name, width, height, groupId: null, ownerId: telopId }
    });
    const result = { assetId, width, height };
    this.assetCache.set(cacheKey, result);
    return result;
  }
};
function transformOf(s) {
  const scale = s.scale ?? 1;
  const [scaleX, scaleY] = Array.isArray(scale) ? scale : [scale, scale];
  const [pivotX, pivotY] = s.pivot ?? [0, 0];
  const [skewX, skewY] = s.skew ?? [0, 0];
  return { x: s.x ?? 0, y: s.y ?? 0, rotation: s.rotation ?? 0, scaleX, scaleY, pivotX, pivotY, skewX, skewY, opacity: s.opacity ?? 1 };
}
function paddingOf(p) {
  if (p === void 0) return 0;
  if (typeof p === "number") return p;
  if (p.length === 2) return { top: p[0], right: p[1], bottom: p[0], left: p[1] };
  return { top: p[0], right: p[1], bottom: p[2], left: p[3] };
}
function conditionOf(c) {
  if (typeof c === "string") return { enabled: true, useExpression: true, expression: c };
  return { enabled: true, targetKeyexp: c.key, operator: c.op || "not_empty", ...c.value !== void 0 ? { value: String(c.value) } : {} };
}
var effectSeq = 0;
function effectOf(e) {
  const { type, ...params } = e;
  return { id: `fx_${++effectSeq}`, type, enabled: true, params };
}
function defaultName(s) {
  if (s.type === "text") return s.key || s.text.slice(0, 16) || "Text";
  if (s.type === "image") return s.key || path2.basename(s.src);
  return s.type === "rect" ? "Rectangle" : "Group";
}
function mimeOf(name) {
  const ext = path2.extname(name).toLowerCase();
  return { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml" }[ext] || "application/octet-stream";
}
async function buildProject(spec, baseDir, base, customFonts2) {
  const builder = new Builder(spec, baseDir, base);
  const doc = builder.build();
  const assetRegistry = { getAssetBlob: async (id) => builder.blobs.get(id) ?? null };
  const { files, safeTitle } = await ProjectExporter.generateProjectFiles(doc, assetRegistry, void 0, true, customFonts2);
  return { doc, files, safeTitle, warnings: builder.warnings };
}
async function writeProject(result, outDir) {
  const folder = path2.join(outDir, result.safeTitle);
  removePath(folder);
  const zip = new import_jszip2.default();
  const root = zip.folder(result.safeTitle);
  for (const f of result.files) {
    const target = path2.join(folder, f.path);
    fs2.mkdirSync(path2.dirname(target), { recursive: true });
    const data = typeof f.content === "string" ? f.content : Buffer.from(await f.content.arrayBuffer());
    fs2.writeFileSync(target, data);
    root.file(f.path, data);
  }
  const zipPath = path2.join(outDir, result.safeTitle + ".zip");
  fs2.writeFileSync(zipPath, await zip.generateAsync({ type: "nodebuffer" }));
  return { folder, zip: zipPath };
}

// vendor/TelopEditor/tools/telopkit/src/preview.ts
import fs3 from "node:fs";
import os from "node:os";
import path3 from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".telop": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};
async function proxy(url, res) {
  try {
    const r = await fetch(url);
    if (!r.ok) {
      res.writeHead(r.status).end();
      return;
    }
    res.writeHead(200, { "Content-Type": r.headers.get("content-type") || "application/octet-stream" });
    res.end(Buffer.from(await r.arrayBuffer()));
  } catch {
    res.writeHead(502).end();
  }
}
function startServer(projectDir, fonts, extra) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (extra[urlPath]) {
      res.writeHead(200, { "Content-Type": MIME[path3.extname(extra[urlPath]).toLowerCase()] || "application/octet-stream" });
      fs3.createReadStream(extra[urlPath]).pipe(res);
      return;
    }
    let root = projectDir, rel = urlPath.slice(1);
    if (urlPath.startsWith("/fonts/")) {
      if (!fonts.fontsDir && fonts.hubOrigin) {
        void proxy(fonts.hubOrigin.replace(/\/$/, "") + urlPath, res);
        return;
      }
      [root, rel] = [fonts.fontsDir || "", urlPath.slice("/fonts/".length)];
    } else if (urlPath.startsWith("/.hub/fonts/")) {
      [root, rel] = [fonts.customFontsDir || "", urlPath.slice("/.hub/fonts/".length)];
    }
    if (!root) {
      res.writeHead(404).end();
      return;
    }
    const file = path3.resolve(root, rel);
    if (!file.startsWith(path3.resolve(root)) || !fs3.existsSync(file) || fs3.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path3.extname(file).toLowerCase()] || "application/octet-stream" });
    fs3.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port })));
}
function findChrome() {
  const env = process.env.TELOPKIT_CHROME;
  if (env && fs3.existsSync(env)) return env;
  const candidates = [];
  const pw = process.platform === "win32" ? path3.join(process.env.LOCALAPPDATA || "", "ms-playwright") : process.platform === "darwin" ? path3.join(os.homedir(), "Library/Caches/ms-playwright") : path3.join(os.homedir(), ".cache/ms-playwright");
  if (fs3.existsSync(pw)) {
    for (const dir of fs3.readdirSync(pw).sort().reverse()) {
      if (dir.startsWith("chromium_headless_shell-")) {
        candidates.push(path3.join(pw, dir, "chrome-headless-shell-win64", "chrome-headless-shell.exe"));
        candidates.push(path3.join(pw, dir, "chrome-headless-shell-linux64", "chrome-headless-shell"));
        candidates.push(path3.join(pw, dir, "chrome-headless-shell-mac-arm64", "chrome-headless-shell"));
      } else if (dir.startsWith("chromium-")) {
        candidates.push(path3.join(pw, dir, "chrome-win64", "chrome.exe"));
        candidates.push(path3.join(pw, dir, "chrome-win", "chrome.exe"));
        candidates.push(path3.join(pw, dir, "chrome-linux", "chrome"));
      }
    }
  }
  candidates.push(
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  );
  return candidates.find((c) => fs3.existsSync(c)) || null;
}
var Cdp = class _Cdp {
  constructor(ws) {
    this.ws = ws;
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id !== void 0 && this.pending.has(msg.id)) {
        const p = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error.message));
        else p.resolve(msg.result);
      } else {
        this.listeners.forEach((l) => l(msg));
      }
    });
  }
  seq = 0;
  pending = /* @__PURE__ */ new Map();
  listeners = [];
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => resolve(new _Cdp(ws)));
      ws.addEventListener("error", () => reject(new Error(`cannot connect to ${url}`)));
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, ...sessionId ? { sessionId } : {} }));
    });
  }
  on(fn) {
    this.listeners.push(fn);
  }
  close() {
    this.ws.close();
  }
};
async function launchChrome(exe) {
  const userDir = fs3.mkdtempSync(path3.join(os.tmpdir(), "telopkit-chrome-"));
  const proc = spawn(exe, [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--mute-audio",
    "--disable-gpu",
    "--force-color-profile=srgb",
    "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(() => reject(new Error("Chrome did not start (no DevTools URL within 15s)")), 15e3);
    proc.stderr.on("data", (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited (${code}): ${buf.slice(-500)}`));
    });
  });
  return { proc, wsUrl, userDir };
}
var BACKGROUNDS = {
  checker: "background-color:#8a8a8a;background-image:linear-gradient(45deg,#6e6e6e 25%,transparent 25%,transparent 75%,#6e6e6e 75%),linear-gradient(45deg,#6e6e6e 25%,transparent 25%,transparent 75%,#6e6e6e 75%);background-size:64px 64px;background-position:0 0,32px 32px;",
  black: "background:#000;",
  white: "background:#fff;",
  gray: "background:#808080;"
};
function overlayScript(bgCss, guides, w, h) {
  const guide = (pct, color) => {
    const mx = w * (1 - pct) / 2, my = h * (1 - pct) / 2;
    return `<div style="position:absolute;left:${mx}px;top:${my}px;width:${w - mx * 2}px;height:${h - my * 2}px;border:2px dashed ${color};box-sizing:border-box"></div>`;
  };
  const html = guides ? `<div id="__telopkit_guides" style="position:fixed;left:0;top:0;width:${w}px;height:${h}px;pointer-events:none;z-index:2147483647">${guide(0.9, "rgba(0,255,255,.7)")}${guide(0.8, "rgba(255,255,0,.7)")}</div>` : "";
  return `(() => {
        document.documentElement.style.cssText += ${JSON.stringify(bgCss)};
        document.body.style.background = "transparent";
        if (${JSON.stringify(html)}) document.body.insertAdjacentHTML("beforeend", ${JSON.stringify(html)});
    })()`;
}
async function waitFor(cdp, sessionId, expr, timeoutMs) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    const r = await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true }, sessionId);
    if (r.result?.value) return true;
    await new Promise((res) => setTimeout(res, 50));
  }
  return false;
}
async function preview(opts) {
  const exe = findChrome();
  if (!exe) throw new Error("Chrome not found. Set TELOPKIT_CHROME to a chrome / chrome-headless-shell executable.");
  fs3.mkdirSync(opts.outDir, { recursive: true });
  const telops = opts.telops && opts.telops.length > 0 ? opts.telops : fs3.readdirSync(opts.projectDir).filter((d) => fs3.existsSync(path3.join(opts.projectDir, d, ".telop_editor")));
  const scale = opts.scale ?? 0.5;
  const { width, height } = opts.canvas;
  const bgCss = BACKGROUNDS[opts.background || "checker"] ?? `background:${opts.background};`;
  const extra = opts.verify ? { "/__telopkit/verify.js": opts.verify.bundlePath, "/__telopkit/project.zip": opts.verify.zipPath } : {};
  const { server, port } = await startServer(opts.projectDir, opts, extra);
  const { proc, wsUrl, userDir } = await launchChrome(exe);
  const cdp = await Cdp.connect(wsUrl);
  const shots = [];
  const errors = [];
  let verified;
  try {
    if (opts.verify) verified = await verifyInEditorLoader(cdp, port, opts.verify, errors);
    for (const telop of telops) {
      const sampleFile = path3.join(opts.projectDir, telop, `${telop}.json`);
      const dataSets = [null, ...opts.samples?.[telop] || []];
      if (!fs3.existsSync(sampleFile) && dataSets.length === 1) dataSets[0] = {};
      for (let si = 0; si < dataSets.length; si++) {
        const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
        const tag = `[${telop}#${si}]`;
        cdp.on((msg) => {
          if (msg.sessionId !== sessionId) return;
          if (msg.method === "Runtime.exceptionThrown") {
            errors.push(`${tag} ${msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text}`);
          } else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
            errors.push(`${tag} console.error: ${msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ")}`);
          } else if (msg.method === "Network.loadingFailed" && !msg.params.canceled) {
            errors.push(`${tag} load failed: ${msg.params.errorText}`);
          } else if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400) {
            errors.push(`${tag} ${msg.params.response.status} ${msg.params.response.url}`);
          }
        });
        await cdp.send("Runtime.enable", {}, sessionId);
        await cdp.send("Network.enable", {}, sessionId);
        await cdp.send("Page.enable", {}, sessionId);
        await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile: false }, sessionId);
        await cdp.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } }, sessionId);
        const url = `http://127.0.0.1:${port}/${encodeURIComponent(telop)}/${encodeURIComponent(telop)}.html`;
        await cdp.send("Page.navigate", { url }, sessionId);
        if (!await waitFor(cdp, sessionId, "window.initialized === true", 15e3)) {
          errors.push(`${tag} player did not initialize within 15s`);
          await cdp.send("Target.closeTarget", { targetId });
          continue;
        }
        await cdp.send("Runtime.evaluate", { expression: overlayScript(bgCss, !!opts.guides, width, height) }, sessionId);
        const data = dataSets[si];
        await cdp.send("Runtime.evaluate", {
          expression: `window.showTelop(${data ? JSON.stringify(data) : "undefined"})`
        }, sessionId);
        await waitFor(cdp, sessionId, `document.getElementById(window.containerId || 'player-container')?.classList.contains('in_animation')`, 5e3);
        await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true }, sessionId);
        const capture = async (time) => {
          const expr = time === "final" ? `(() => { document.getAnimations().forEach(a => { try { a.finish(); } catch (e) { a.cancel(); } }); return true; })()` : `(() => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ${time * 1e3}; }); return true; })()`;
          await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true }, sessionId);
          await cdp.send("Runtime.evaluate", { expression: "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))", awaitPromise: true }, sessionId);
          const { data: png } = await cdp.send("Page.captureScreenshot", { format: "png" }, sessionId);
          const suffix = time === "final" ? "final" : `t${time.toFixed(2)}`;
          const file = path3.join(opts.outDir, `${telop}__s${si}__${suffix}.png`);
          fs3.writeFileSync(file, Buffer.from(png, "base64"));
          shots.push({ telop, sample: si, time, file });
        };
        for (const t of opts.frames || []) await capture(t);
        await capture("final");
        await cdp.send("Target.closeTarget", { targetId });
      }
    }
  } finally {
    cdp.close();
    proc.kill();
    server.close();
    try {
      fs3.rmSync(userDir, { recursive: true, force: true });
    } catch {
    }
  }
  return { shots, errors, verified };
}
async function verifyInEditorLoader(cdp, port, verify, errors) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const before = errors.length;
  try {
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/project.json` }, sessionId);
    await waitFor(cdp, sessionId, "document.readyState === 'complete'", 5e3);
    const src = fs3.readFileSync(verify.bundlePath, "utf8");
    const load = await cdp.send("Runtime.evaluate", { expression: src }, sessionId);
    if (load.exceptionDetails) throw new Error(load.exceptionDetails.exception?.description || "verify bundle failed");
    const r = await cdp.send("Runtime.evaluate", {
      expression: `window.__telopkitVerify("/__telopkit/project.zip")`,
      awaitPromise: true,
      returnByValue: true
    }, sessionId);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    const got = r.result.value;
    const gotNames = got.telops.map((t) => t.name).sort().join(",");
    const wantNames = verify.expected.map((t) => t.name).sort().join(",");
    if (gotNames !== wantNames) errors.push(`[verify] telops after load: ${gotNames} (expected ${wantNames})`);
    for (const want of verify.expected) {
      const t = got.telops.find((g) => g.name === want.name);
      if (!t) continue;
      if (t.nodes !== want.nodes) errors.push(`[verify] ${want.name}: ${t.nodes} nodes after load (expected ${want.nodes})`);
      const missing = want.keys.filter((k8) => !t.keys.includes(k8));
      if (missing.length) errors.push(`[verify] ${want.name}: keys lost on load: ${missing.join(", ")}`);
    }
    for (const a of got.assets) if (!a.hasBlob) errors.push(`[verify] asset ${a.name} has no image data after load`);
  } catch (e) {
    errors.push(`[verify] TelopEditor's ProjectLoader failed: ${e.message}`);
  } finally {
    await cdp.send("Target.closeTarget", { targetId });
  }
  return errors.length === before;
}

// vendor/TelopEditor/tools/telopkit/src/project.ts
var import_jszip3 = __toESM(require_lib3(), 1);
import fs4 from "node:fs";
import path4 from "node:path";
var KIT_DIR = ".telopkit";
var TEMPLATE_MARKER = "@telop-editor-default-template";
var FONT_FILE = /\.(ttf|otf|woff2?)$/i;
function readProject(dir) {
  const pjPath = path4.join(dir, "project.json");
  const projectJson = fs4.existsSync(pjPath) ? JSON.parse(fs4.readFileSync(pjPath, "utf8")) : null;
  const telops = [];
  for (const parent of [dir, path4.join(dir, "telops")]) {
    if (!fs4.existsSync(parent)) continue;
    for (const name of fs4.readdirSync(parent)) {
      const tdir = path4.join(parent, name);
      const telopFile = path4.join(tdir, `${name}.telop`);
      if (!fs4.existsSync(path4.join(tdir, ".telop_editor")) || !fs4.existsSync(telopFile)) continue;
      const sub = JSON.parse(fs4.readFileSync(telopFile, "utf8"));
      telops.push({ name, dir: tdir, id: sub.rootId, sub });
    }
  }
  return { dir, projectJson, telops };
}
function customFonts(projectDir) {
  const fontsDir = path4.join(path4.dirname(projectDir), ".hub", "fonts");
  return fs4.existsSync(fontsDir) ? fs4.readdirSync(fontsDir).filter((f) => FONT_FILE.test(f)) : [];
}
function walk(sub, id) {
  const n = sub.nodesById[id];
  if (!n) return { nodes: 0, keys: [] };
  let nodes = 1;
  const keys = n.keyexp ? [n.keyexp] : [];
  for (const c of n.children || []) {
    const r = walk(sub, c);
    nodes += r.nodes;
    keys.push(...r.keys);
  }
  return { nodes, keys };
}
function projectSummary(p) {
  return p.telops.map((t) => ({ name: t.name, ...walk(t.sub, t.id) }));
}
function describeNode(n) {
  const parts = [n.type, JSON.stringify(n.name ?? "")];
  if (n.keyexp) parts.push(`key=${n.keyexp}`);
  if (n.type === "text") parts.push(JSON.stringify(String(n.text ?? "").slice(0, 40)));
  parts.push(`@${Math.round(n.x ?? 0)},${Math.round(n.y ?? 0)}`);
  if (n.width !== void 0) parts.push(`${Math.round(n.width)}x${Math.round(n.height ?? 0)}`);
  if (n.type === "text") parts.push(`${n.style?.fontFamily ?? ""} ${n.style?.fontSize ?? ""}${n.fitMode && n.fitMode !== "none" ? ` fit=${n.fitMode}` : ""}`);
  if (n.autoLayout?.enabled) parts.push(`layout=${n.autoLayout.direction}`);
  if (n.repeat?.enabled) parts.push(`repeat=${n.repeat.count}`);
  if (n.clip) parts.push("clip");
  if (n.domClass) parts.push(`class=${n.domClass}`);
  if (n.visible === false) parts.push("hidden");
  const c = n.visibilityCondition;
  if (c?.enabled) parts.push(`showIf=${c.useExpression ? c.expression : `${c.targetKeyexp} ${c.operator} ${c.value ?? ""}`.trim()}`);
  return parts.join(" ");
}
function inspectProject(p) {
  const lines = [];
  const meta = p.projectJson?.meta;
  lines.push(`project: ${p.dir}`);
  lines.push(meta ? `canvas: ${meta.canvas?.width}x${meta.canvas?.height}${meta.commonKeys?.length ? `  commonKeys: ${meta.commonKeys.map((k8) => `${k8.keyexp}=${k8.value}`).join(", ")}` : ""}` : "project.json: none yet (push will create it)");
  for (const t of p.telops) {
    const sample = path4.join(t.dir, `${t.name}.json`);
    const data = fs4.existsSync(sample) ? JSON.parse(fs4.readFileSync(sample, "utf8")) : {};
    const css = path4.join(t.dir, `${t.name}.css`);
    const customCss = fs4.existsSync(css) && !fs4.readFileSync(css, "utf8").includes(TEMPLATE_MARKER);
    lines.push("");
    lines.push(`## ${t.name}  (${walk(t.sub, t.id).nodes} nodes${customCss ? ", custom css" : ""})`);
    lines.push(`data keys: ${Object.keys(data).length ? Object.entries(data).map(([k8, v]) => `${k8}=${JSON.stringify(v)}`).join("  ") : "(none)"}`);
    const tree = (id, depth) => {
      const n = t.sub.nodesById[id];
      if (!n) return;
      if (depth > 0) lines.push(`${"  ".repeat(depth)}${describeNode(n)}`);
      for (const c of n.children || []) tree(c, depth + 1);
    };
    tree(t.id, 0);
  }
  return lines.join("\n");
}
function pullTelop(p, telopName, outFile) {
  const t = p.telops.find((x) => x.name === telopName);
  if (!t) throw new Error(`telop not found: ${telopName} (have: ${p.telops.map((x) => x.name).join(", ") || "none"})`);
  const specDir = path4.dirname(path4.resolve(outFile));
  const assetRef = (assetId) => {
    const a = t.sub.assets?.[assetId];
    if (!a?.src) return void 0;
    const rel = path4.relative(specDir, path4.join(t.dir, a.src)).split(path4.sep).join("/");
    return ASSET_REF + rel;
  };
  const mapAssets = (v) => {
    if (Array.isArray(v)) return v.map(mapAssets);
    if (v && typeof v === "object") {
      const out = {};
      for (const [k8, x] of Object.entries(v)) out[k8] = k8 === "assetId" && typeof x === "string" ? assetRef(x) ?? x : mapAssets(x);
      return out;
    }
    return v;
  };
  const toSpec = (id) => {
    const n = t.sub.nodesById[id];
    const { id: _id2, parentId: _p2, children: children2, type, name, ...rest } = n;
    const spec2 = { type, name };
    if (type === "image") {
      const ref = assetRef(n.assetId);
      if (!ref) throw new Error(`${telopName} > ${name}: image asset ${n.assetId} has no file`);
      spec2.src = ref.slice(ASSET_REF.length);
      delete rest.assetId;
    }
    if (type === "text") {
      spec2.text = n.text ?? "";
      spec2.w = n.width ?? 0;
    }
    if (type === "rect") {
      spec2.w = n.width;
      spec2.h = n.height;
    }
    spec2.raw = mapAssets(rest);
    if (type === "group") spec2.children = (children2 || []).map(toSpec);
    return spec2;
  };
  const telopNode = t.sub.nodesById[t.id];
  const { id: _id, parentId: _p, children, type: _t, name: _n, customCss: _c, customJs: _j, ...telopRest } = telopNode;
  const raw = mapAssets(telopRest);
  for (const [ext, key2] of [["css", "customCss"], ["js", "customJs"]]) {
    const f = path4.join(t.dir, `${t.name}.${ext}`);
    if (fs4.existsSync(f)) {
      const content = fs4.readFileSync(f, "utf8");
      if (!content.includes(TEMPLATE_MARKER)) raw[key2] = content;
    }
  }
  const telop = { name: t.name, raw, children: (children || []).map(toSpec) };
  const spec = {
    title: p.projectJson?.meta?.title ?? path4.basename(p.dir),
    canvas: p.projectJson?.meta?.canvas,
    telops: [telop]
  };
  fs4.mkdirSync(specDir, { recursive: true });
  fs4.writeFileSync(outFile, [
    `// Pulled from telop "${t.name}" by telopkit. Every node keeps its full editor props in \`raw\`.`,
    `// Edit (or replace nodes with the short-hand), then: node .telopkit/telopkit.mjs push ${path4.relative(p.dir, outFile).split(path4.sep).join("/")}`,
    `export default ${JSON.stringify(spec, null, 2)};`,
    ""
  ].join("\n"));
  return outFile;
}
async function pushSpec(projectDir, spec, specDir) {
  const before = readProject(projectDir);
  const pj = before.projectJson;
  const names = spec.telops.map((t) => t.name);
  for (const name of names) {
    const folder = path4.join(projectDir, name);
    const managed = before.telops.some((t) => t.name === name);
    if (!managed && fs4.existsSync(folder)) {
      throw new Error(`"${name}" already exists in the project and is not a TelopEditor telop; pick another telop name`);
    }
  }
  const base = pj ? { rootId: pj.rootId, meta: pj.meta } : void 0;
  const result = await buildProject(pj ? spec : { ...spec, title: path4.basename(projectDir) }, specDir, base, customFonts(projectDir));
  const replaced = before.telops.filter((t) => names.includes(t.name));
  let backup;
  if (replaced.length) {
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    backup = path4.join(projectDir, KIT_DIR, "backup", stamp);
    for (const t of replaced) {
      copyDir(t.dir, path4.join(backup, t.name));
      removePath(t.dir);
    }
  }
  let generatedProjectJson = null;
  for (const f of result.files) {
    if (f.path === "project.json") {
      generatedProjectJson = f.content;
      continue;
    }
    const target = path4.join(projectDir, f.path);
    fs4.mkdirSync(path4.dirname(target), { recursive: true });
    fs4.writeFileSync(target, typeof f.content === "string" ? f.content : Buffer.from(await f.content.arrayBuffer()));
  }
  if (pj) {
    const plane = pj.nodesById[pj.rootId];
    const newRoot = result.doc.nodesById[result.doc.rootId];
    for (const newId of newRoot.children) {
      const name = result.doc.nodesById[newId].name;
      const old = replaced.find((t) => t.name === name);
      const idx = old ? plane.children.indexOf(old.id) : -1;
      if (idx >= 0) plane.children[idx] = newId;
      else plane.children.push(newId);
    }
    fs4.writeFileSync(path4.join(projectDir, "project.json"), JSON.stringify(pj, null, 2));
  } else if (generatedProjectJson) {
    fs4.writeFileSync(path4.join(projectDir, "project.json"), generatedProjectJson);
  }
  return {
    added: names.filter((n) => !replaced.some((t) => t.name === n)),
    replaced: replaced.map((t) => t.name),
    backup,
    warnings: result.warnings
  };
}
async function zipProjectForEditor(p, outFile) {
  const zip = new import_jszip3.default();
  const root = zip.folder(path4.basename(p.dir));
  const add = (abs, rel) => {
    if (fs4.statSync(abs).isDirectory()) {
      for (const name of fs4.readdirSync(abs)) add(path4.join(abs, name), `${rel}/${name}`);
    } else {
      root.file(rel, fs4.readFileSync(abs));
    }
  };
  add(path4.join(p.dir, "project.json"), "project.json");
  if (fs4.existsSync(path4.join(p.dir, "viewer"))) add(path4.join(p.dir, "viewer"), "viewer");
  for (const t of p.telops) add(t.dir, t.name);
  fs4.mkdirSync(path4.dirname(outFile), { recursive: true });
  fs4.writeFileSync(outFile, await zip.generateAsync({ type: "nodebuffer" }));
}

// vendor/TelopEditor/tools/telopkit/src/cli.ts
var USAGE = `telopkit \u2014 TelopEditor telops from a short spec (see .claude/skills/telop-design/SKILL.md)

In a TelopHub project (default project: the folder that holds .telopkit/telopkit.mjs):
  inspect [--project DIR] [--json]          telops, node trees and data keys
  pull <Telop> [--project DIR] [--out FILE]  existing telop -> spec file (.telopkit/specs/<Telop>.mjs)
  push <spec.mjs> [--project DIR] [--no-preview] [preview flags]
                                            add / replace the spec's telops in the project, then preview + check
  preview [--project DIR] [--telop NAME]... [preview flags]

Stand-alone (writes a separate project folder + zip):
  build <spec.mjs> [--out DIR]
  preview <spec.mjs | projectDir> [--out DIR] [preview flags]

Preview flags: --frames 0.1,0.3  --scale 0.5  --bg checker|black|white|gray|#hex  --guides  --preview-out DIR`;
function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k8, inline] = a.slice(2).split("=", 2);
      const next = argv[i + 1];
      const value = inline ?? (next !== void 0 && !next.startsWith("--") && !BOOLEAN_FLAGS.has(k8) ? (i++, next) : "true");
      (out.flags[k8] ||= []).push(value);
    } else {
      out._.push(a);
    }
  }
  return out;
}
var BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["guides", "json", "no-preview", "help"]);
var flag = (a, k8) => a.flags[k8]?.[a.flags[k8].length - 1];
var selfDir = path5.dirname(fileURLToPath(import.meta.url));
function kitProjectDir() {
  if (false) return null;
  return path5.basename(selfDir) === KIT_DIR ? path5.dirname(selfDir) : null;
}
function resolveProjectDir(args) {
  const explicit = flag(args, "project");
  const dir = explicit ? path5.resolve(explicit) : kitProjectDir() ?? process.cwd();
  if (!fs5.existsSync(dir)) throw new Error(`project folder not found: ${dir}`);
  return dir;
}
function verifyBundlePath() {
  return true ? path5.join(selfDir, "telopkit-verify.js") : path5.join("", "verify.js");
}
function fontSources(projectDir) {
  const customFontsDir = path5.join(path5.dirname(projectDir), ".hub", "fonts");
  const out = {
    customFontsDir: fs5.existsSync(customFontsDir) ? customFontsDir : void 0
  };
  if (false) {
    out.fontsDir = path5.join("", "public", "fonts");
  } else {
    const hubJson = path5.join(selfDir, "hub.json");
    if (fs5.existsSync(hubJson)) out.hubOrigin = JSON.parse(fs5.readFileSync(hubJson, "utf8")).origin;
    if (process.env.TELOPHUB_ORIGIN) out.hubOrigin = process.env.TELOPHUB_ORIGIN;
  }
  return out;
}
async function loadSpec(file) {
  const abs = path5.resolve(file);
  if (abs.endsWith(".json")) return JSON.parse(fs5.readFileSync(abs, "utf8"));
  const mod = await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
  const spec = mod.default ?? mod.spec;
  return typeof spec === "function" ? await spec() : spec;
}
function isSpecFile(p) {
  return !!p && /\.(mjs|js|json)$/i.test(p) && fs5.existsSync(p) && fs5.statSync(p).isFile();
}
function previewFlags(args) {
  return {
    frames: flag(args, "frames")?.split(",").map(Number).filter((n) => !isNaN(n)),
    scale: flag(args, "scale") ? Number(flag(args, "scale")) : void 0,
    background: flag(args, "bg"),
    guides: flag(args, "guides") === "true"
  };
}
function telopSummary(doc) {
  const walk2 = (id) => {
    const n = doc.nodesById[id];
    const keys = n.keyexp ? [n.keyexp] : [];
    let nodes = 1;
    for (const c of n.children || []) {
      const r = walk2(c);
      nodes += r.nodes;
      keys.push(...r.keys);
    }
    return { nodes, keys };
  };
  const root = doc.nodesById[doc.rootId];
  return root.children.map((id) => ({ name: doc.nodesById[id].name, ...walk2(id) }));
}
async function previewProject(args, projectDir, telops, samples) {
  const project = readProject(projectDir);
  if (!project.projectJson) throw new Error(`no project.json in ${projectDir}: push a spec first, or open and save the project in TelopEditor`);
  const aiDir = path5.join(projectDir, KIT_DIR);
  const outDir = path5.resolve(flag(args, "preview-out") || path5.join(aiDir, "preview"));
  removePath(outDir);
  const zipPath = path5.join(aiDir, "tmp", "project.zip");
  await zipProjectForEditor(project, zipPath);
  const report = await preview({
    projectDir,
    ...fontSources(projectDir),
    outDir,
    telops: telops && telops.length ? telops : project.telops.map((t) => t.name),
    samples,
    canvas: project.projectJson.meta.canvas,
    verify: { zipPath, bundlePath: verifyBundlePath(), expected: projectSummary(project) },
    ...previewFlags(args)
  });
  return report;
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [command, target] = args._;
  if (!command || flag(args, "help")) {
    console.log(USAGE);
    process.exit(command ? 0 : 1);
  }
  const print = (v) => console.log(JSON.stringify(v, null, 2));
  switch (command) {
    case "inspect": {
      const project = readProject(resolveProjectDir(args));
      if (flag(args, "json")) print({ project: project.dir, meta: project.projectJson?.meta ?? null, telops: projectSummary(project) });
      else console.log(inspectProject(project));
      return;
    }
    case "pull": {
      if (!target) throw new Error("usage: pull <TelopName>");
      const projectDir = resolveProjectDir(args);
      const out = path5.resolve(flag(args, "out") || path5.join(projectDir, KIT_DIR, "specs", `${target}.mjs`));
      print({ ok: true, spec: pullTelop(readProject(projectDir), target, out) });
      return;
    }
    case "push": {
      if (!isSpecFile(target)) throw new Error("usage: push <spec.mjs>");
      const projectDir = resolveProjectDir(args);
      const spec = await loadSpec(target);
      const pushed = await pushSpec(projectDir, spec, path5.dirname(path5.resolve(target)));
      if (flag(args, "no-preview") === "true") {
        print({ ok: true, project: projectDir, ...pushed });
        return;
      }
      const report = await previewProject(args, projectDir, spec.telops.map((t) => t.name), spec.samples);
      print({
        ok: report.errors.length === 0,
        opensInEditor: report.verified,
        project: projectDir,
        ...pushed,
        shots: report.shots.map((s) => s.file),
        errors: report.errors,
        note: "Reopen the project in TelopEditor (or reload the TelopHub page) to see the change."
      });
      return;
    }
    case "build": {
      if (!isSpecFile(target)) throw new Error("usage: build <spec.mjs>");
      const spec = await loadSpec(target);
      const outDir = path5.resolve(flag(args, "out") || path5.join(path5.dirname(target), "out"));
      const result = await buildProject(spec, path5.dirname(path5.resolve(target)));
      const written = await writeProject(result, outDir);
      print({ ok: true, ...written, telops: spec.telops.map((t) => t.name), warnings: result.warnings });
      return;
    }
    case "preview": {
      if (isSpecFile(target)) {
        const spec = await loadSpec(target);
        const outDir = path5.resolve(flag(args, "out") || path5.join(path5.dirname(target), "out"));
        const result = await buildProject(spec, path5.dirname(path5.resolve(target)));
        const written = await writeProject(result, outDir);
        const previewOut = path5.resolve(flag(args, "preview-out") || path5.join(outDir, "preview"));
        removePath(previewOut);
        const report2 = await preview({
          projectDir: written.folder,
          ...fontSources(written.folder),
          outDir: previewOut,
          telops: args.flags["telop"],
          samples: spec.samples,
          canvas: result.doc.meta.canvas,
          verify: { zipPath: written.zip, bundlePath: verifyBundlePath(), expected: telopSummary(result.doc) },
          ...previewFlags(args)
        });
        print({
          ok: report2.errors.length === 0,
          opensInEditor: report2.verified,
          project: written.folder,
          zip: written.zip,
          shots: report2.shots.map((s) => s.file),
          errors: report2.errors,
          warnings: result.warnings
        });
        return;
      }
      const projectDir = target ? path5.resolve(target) : resolveProjectDir(args);
      const report = await previewProject(args, projectDir, args.flags["telop"], void 0);
      print({
        ok: report.errors.length === 0,
        opensInEditor: report.verified,
        project: projectDir,
        shots: report.shots.map((s) => s.file),
        errors: report.errors
      });
      return;
    }
    default:
      throw new Error(`unknown command: ${command}

${USAGE}`);
  }
}
main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e?.message || e) }, null, 2));
  process.exit(1);
});
