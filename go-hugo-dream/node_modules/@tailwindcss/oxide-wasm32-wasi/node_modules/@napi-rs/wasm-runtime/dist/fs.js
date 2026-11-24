function _mergeNamespaces(n, m) {
	m.forEach(function (e) {
		e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
			if (k !== 'default' && !(k in n)) {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	});
	return Object.freeze(n);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof undefined !== 'undefined' ? undefined : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch (e) {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var lib$8 = {exports: {}};

var lib$7 = {};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* undefined Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
}
var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

var tslib_es6 = {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
};

var tslib_es6$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	__addDisposableResource: __addDisposableResource,
	get __assign () { return __assign; },
	__asyncDelegator: __asyncDelegator,
	__asyncGenerator: __asyncGenerator,
	__asyncValues: __asyncValues,
	__await: __await,
	__awaiter: __awaiter,
	__classPrivateFieldGet: __classPrivateFieldGet,
	__classPrivateFieldIn: __classPrivateFieldIn,
	__classPrivateFieldSet: __classPrivateFieldSet,
	__createBinding: __createBinding,
	__decorate: __decorate,
	__disposeResources: __disposeResources,
	__esDecorate: __esDecorate,
	__exportStar: __exportStar,
	__extends: __extends,
	__generator: __generator,
	__importDefault: __importDefault,
	__importStar: __importStar,
	__makeTemplateObject: __makeTemplateObject,
	__metadata: __metadata,
	__param: __param,
	__propKey: __propKey,
	__read: __read,
	__rest: __rest,
	__rewriteRelativeImportExtension: __rewriteRelativeImportExtension,
	__runInitializers: __runInitializers,
	__setFunctionName: __setFunctionName,
	__spread: __spread,
	__spreadArray: __spreadArray,
	__spreadArrays: __spreadArrays,
	__values: __values,
	default: tslib_es6
});

var require$$0$2 = /*@__PURE__*/getAugmentedNamespace(tslib_es6$1);

var volume = {};

var path$1 = {};

var browser$2 = {exports: {}};

var hasRequiredBrowser$2;

function requireBrowser$2 () {
	if (hasRequiredBrowser$2) return browser$2.exports;
	hasRequiredBrowser$2 = 1;
	// shim for using process in browser
	var process = browser$2.exports = {};

	// cached from whatever undefined is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ());
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the undefined object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the undefined object for 'this', hopfully our context correct otherwise it will throw a undefined error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the undefined object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the undefined object for 'this', hopfully our context correct otherwise it will throw a undefined error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] };

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };
	return browser$2.exports;
}

var browserExports = requireBrowser$2();
var process$1 = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

var pathBrowserify;
var hasRequiredPathBrowserify;

function requirePathBrowserify () {
	if (hasRequiredPathBrowserify) return pathBrowserify;
	hasRequiredPathBrowserify = 1;

	function assertPath(path) {
	  if (typeof path !== 'string') {
	    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
	  }
	}

	// Resolves . and .. elements in a path with directory names
	function normalizeStringPosix(path, allowAboveRoot) {
	  var res = '';
	  var lastSegmentLength = 0;
	  var lastSlash = -1;
	  var dots = 0;
	  var code;
	  for (var i = 0; i <= path.length; ++i) {
	    if (i < path.length)
	      code = path.charCodeAt(i);
	    else if (code === 47 /*/*/)
	      break;
	    else
	      code = 47 /*/*/;
	    if (code === 47 /*/*/) {
	      if (lastSlash === i - 1 || dots === 1) ; else if (lastSlash !== i - 1 && dots === 2) {
	        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
	          if (res.length > 2) {
	            var lastSlashIndex = res.lastIndexOf('/');
	            if (lastSlashIndex !== res.length - 1) {
	              if (lastSlashIndex === -1) {
	                res = '';
	                lastSegmentLength = 0;
	              } else {
	                res = res.slice(0, lastSlashIndex);
	                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
	              }
	              lastSlash = i;
	              dots = 0;
	              continue;
	            }
	          } else if (res.length === 2 || res.length === 1) {
	            res = '';
	            lastSegmentLength = 0;
	            lastSlash = i;
	            dots = 0;
	            continue;
	          }
	        }
	        if (allowAboveRoot) {
	          if (res.length > 0)
	            res += '/..';
	          else
	            res = '..';
	          lastSegmentLength = 2;
	        }
	      } else {
	        if (res.length > 0)
	          res += '/' + path.slice(lastSlash + 1, i);
	        else
	          res = path.slice(lastSlash + 1, i);
	        lastSegmentLength = i - lastSlash - 1;
	      }
	      lastSlash = i;
	      dots = 0;
	    } else if (code === 46 /*.*/ && dots !== -1) {
	      ++dots;
	    } else {
	      dots = -1;
	    }
	  }
	  return res;
	}

	function _format(sep, pathObject) {
	  var dir = pathObject.dir || pathObject.root;
	  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
	  if (!dir) {
	    return base;
	  }
	  if (dir === pathObject.root) {
	    return dir + base;
	  }
	  return dir + sep + base;
	}

	var posix = {
	  // path.resolve([from ...], to)
	  resolve: function resolve() {
	    var resolvedPath = '';
	    var resolvedAbsolute = false;
	    var cwd;

	    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	      var path;
	      if (i >= 0)
	        path = arguments[i];
	      else {
	        if (cwd === undefined)
	          cwd = process$1.cwd();
	        path = cwd;
	      }

	      assertPath(path);

	      // Skip empty entries
	      if (path.length === 0) {
	        continue;
	      }

	      resolvedPath = path + '/' + resolvedPath;
	      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
	    }

	    // At this point the path should be resolved to a full absolute path, but
	    // handle relative paths to be safe (might happen when process.cwd() fails)

	    // Normalize the path
	    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

	    if (resolvedAbsolute) {
	      if (resolvedPath.length > 0)
	        return '/' + resolvedPath;
	      else
	        return '/';
	    } else if (resolvedPath.length > 0) {
	      return resolvedPath;
	    } else {
	      return '.';
	    }
	  },

	  normalize: function normalize(path) {
	    assertPath(path);

	    if (path.length === 0) return '.';

	    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
	    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

	    // Normalize the path
	    path = normalizeStringPosix(path, !isAbsolute);

	    if (path.length === 0 && !isAbsolute) path = '.';
	    if (path.length > 0 && trailingSeparator) path += '/';

	    if (isAbsolute) return '/' + path;
	    return path;
	  },

	  isAbsolute: function isAbsolute(path) {
	    assertPath(path);
	    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
	  },

	  join: function join() {
	    if (arguments.length === 0)
	      return '.';
	    var joined;
	    for (var i = 0; i < arguments.length; ++i) {
	      var arg = arguments[i];
	      assertPath(arg);
	      if (arg.length > 0) {
	        if (joined === undefined)
	          joined = arg;
	        else
	          joined += '/' + arg;
	      }
	    }
	    if (joined === undefined)
	      return '.';
	    return posix.normalize(joined);
	  },

	  relative: function relative(from, to) {
	    assertPath(from);
	    assertPath(to);

	    if (from === to) return '';

	    from = posix.resolve(from);
	    to = posix.resolve(to);

	    if (from === to) return '';

	    // Trim any leading backslashes
	    var fromStart = 1;
	    for (; fromStart < from.length; ++fromStart) {
	      if (from.charCodeAt(fromStart) !== 47 /*/*/)
	        break;
	    }
	    var fromEnd = from.length;
	    var fromLen = fromEnd - fromStart;

	    // Trim any leading backslashes
	    var toStart = 1;
	    for (; toStart < to.length; ++toStart) {
	      if (to.charCodeAt(toStart) !== 47 /*/*/)
	        break;
	    }
	    var toEnd = to.length;
	    var toLen = toEnd - toStart;

	    // Compare paths to find the longest common path from root
	    var length = fromLen < toLen ? fromLen : toLen;
	    var lastCommonSep = -1;
	    var i = 0;
	    for (; i <= length; ++i) {
	      if (i === length) {
	        if (toLen > length) {
	          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
	            // We get here if `from` is the exact base path for `to`.
	            // For example: from='/foo/bar'; to='/foo/bar/baz'
	            return to.slice(toStart + i + 1);
	          } else if (i === 0) {
	            // We get here if `from` is the root
	            // For example: from='/'; to='/foo'
	            return to.slice(toStart + i);
	          }
	        } else if (fromLen > length) {
	          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
	            // We get here if `to` is the exact base path for `from`.
	            // For example: from='/foo/bar/baz'; to='/foo/bar'
	            lastCommonSep = i;
	          } else if (i === 0) {
	            // We get here if `to` is the root.
	            // For example: from='/foo'; to='/'
	            lastCommonSep = 0;
	          }
	        }
	        break;
	      }
	      var fromCode = from.charCodeAt(fromStart + i);
	      var toCode = to.charCodeAt(toStart + i);
	      if (fromCode !== toCode)
	        break;
	      else if (fromCode === 47 /*/*/)
	        lastCommonSep = i;
	    }

	    var out = '';
	    // Generate the relative path based on the path difference between `to`
	    // and `from`
	    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
	      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
	        if (out.length === 0)
	          out += '..';
	        else
	          out += '/..';
	      }
	    }

	    // Lastly, append the rest of the destination (`to`) path that comes after
	    // the common path parts
	    if (out.length > 0)
	      return out + to.slice(toStart + lastCommonSep);
	    else {
	      toStart += lastCommonSep;
	      if (to.charCodeAt(toStart) === 47 /*/*/)
	        ++toStart;
	      return to.slice(toStart);
	    }
	  },

	  _makeLong: function _makeLong(path) {
	    return path;
	  },

	  dirname: function dirname(path) {
	    assertPath(path);
	    if (path.length === 0) return '.';
	    var code = path.charCodeAt(0);
	    var hasRoot = code === 47 /*/*/;
	    var end = -1;
	    var matchedSlash = true;
	    for (var i = path.length - 1; i >= 1; --i) {
	      code = path.charCodeAt(i);
	      if (code === 47 /*/*/) {
	          if (!matchedSlash) {
	            end = i;
	            break;
	          }
	        } else {
	        // We saw the first non-path separator
	        matchedSlash = false;
	      }
	    }

	    if (end === -1) return hasRoot ? '/' : '.';
	    if (hasRoot && end === 1) return '//';
	    return path.slice(0, end);
	  },

	  basename: function basename(path, ext) {
	    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
	    assertPath(path);

	    var start = 0;
	    var end = -1;
	    var matchedSlash = true;
	    var i;

	    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
	      if (ext.length === path.length && ext === path) return '';
	      var extIdx = ext.length - 1;
	      var firstNonSlashEnd = -1;
	      for (i = path.length - 1; i >= 0; --i) {
	        var code = path.charCodeAt(i);
	        if (code === 47 /*/*/) {
	            // If we reached a path separator that was not part of a set of path
	            // separators at the end of the string, stop now
	            if (!matchedSlash) {
	              start = i + 1;
	              break;
	            }
	          } else {
	          if (firstNonSlashEnd === -1) {
	            // We saw the first non-path separator, remember this index in case
	            // we need it if the extension ends up not matching
	            matchedSlash = false;
	            firstNonSlashEnd = i + 1;
	          }
	          if (extIdx >= 0) {
	            // Try to match the explicit extension
	            if (code === ext.charCodeAt(extIdx)) {
	              if (--extIdx === -1) {
	                // We matched the extension, so mark this as the end of our path
	                // component
	                end = i;
	              }
	            } else {
	              // Extension does not match, so our result is the entire path
	              // component
	              extIdx = -1;
	              end = firstNonSlashEnd;
	            }
	          }
	        }
	      }

	      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
	      return path.slice(start, end);
	    } else {
	      for (i = path.length - 1; i >= 0; --i) {
	        if (path.charCodeAt(i) === 47 /*/*/) {
	            // If we reached a path separator that was not part of a set of path
	            // separators at the end of the string, stop now
	            if (!matchedSlash) {
	              start = i + 1;
	              break;
	            }
	          } else if (end === -1) {
	          // We saw the first non-path separator, mark this as the end of our
	          // path component
	          matchedSlash = false;
	          end = i + 1;
	        }
	      }

	      if (end === -1) return '';
	      return path.slice(start, end);
	    }
	  },

	  extname: function extname(path) {
	    assertPath(path);
	    var startDot = -1;
	    var startPart = 0;
	    var end = -1;
	    var matchedSlash = true;
	    // Track the state of characters (if any) we see before our first dot and
	    // after any path separator we find
	    var preDotState = 0;
	    for (var i = path.length - 1; i >= 0; --i) {
	      var code = path.charCodeAt(i);
	      if (code === 47 /*/*/) {
	          // If we reached a path separator that was not part of a set of path
	          // separators at the end of the string, stop now
	          if (!matchedSlash) {
	            startPart = i + 1;
	            break;
	          }
	          continue;
	        }
	      if (end === -1) {
	        // We saw the first non-path separator, mark this as the end of our
	        // extension
	        matchedSlash = false;
	        end = i + 1;
	      }
	      if (code === 46 /*.*/) {
	          // If this is our first dot, mark it as the start of our extension
	          if (startDot === -1)
	            startDot = i;
	          else if (preDotState !== 1)
	            preDotState = 1;
	      } else if (startDot !== -1) {
	        // We saw a non-dot and non-path separator before our dot, so we should
	        // have a good chance at having a non-empty extension
	        preDotState = -1;
	      }
	    }

	    if (startDot === -1 || end === -1 ||
	        // We saw a non-dot character immediately before the dot
	        preDotState === 0 ||
	        // The (right-most) trimmed path component is exactly '..'
	        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
	      return '';
	    }
	    return path.slice(startDot, end);
	  },

	  format: function format(pathObject) {
	    if (pathObject === null || typeof pathObject !== 'object') {
	      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
	    }
	    return _format('/', pathObject);
	  },

	  parse: function parse(path) {
	    assertPath(path);

	    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
	    if (path.length === 0) return ret;
	    var code = path.charCodeAt(0);
	    var isAbsolute = code === 47 /*/*/;
	    var start;
	    if (isAbsolute) {
	      ret.root = '/';
	      start = 1;
	    } else {
	      start = 0;
	    }
	    var startDot = -1;
	    var startPart = 0;
	    var end = -1;
	    var matchedSlash = true;
	    var i = path.length - 1;

	    // Track the state of characters (if any) we see before our first dot and
	    // after any path separator we find
	    var preDotState = 0;

	    // Get non-dir info
	    for (; i >= start; --i) {
	      code = path.charCodeAt(i);
	      if (code === 47 /*/*/) {
	          // If we reached a path separator that was not part of a set of path
	          // separators at the end of the string, stop now
	          if (!matchedSlash) {
	            startPart = i + 1;
	            break;
	          }
	          continue;
	        }
	      if (end === -1) {
	        // We saw the first non-path separator, mark this as the end of our
	        // extension
	        matchedSlash = false;
	        end = i + 1;
	      }
	      if (code === 46 /*.*/) {
	          // If this is our first dot, mark it as the start of our extension
	          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
	        } else if (startDot !== -1) {
	        // We saw a non-dot and non-path separator before our dot, so we should
	        // have a good chance at having a non-empty extension
	        preDotState = -1;
	      }
	    }

	    if (startDot === -1 || end === -1 ||
	    // We saw a non-dot character immediately before the dot
	    preDotState === 0 ||
	    // The (right-most) trimmed path component is exactly '..'
	    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
	      if (end !== -1) {
	        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
	      }
	    } else {
	      if (startPart === 0 && isAbsolute) {
	        ret.name = path.slice(1, startDot);
	        ret.base = path.slice(1, end);
	      } else {
	        ret.name = path.slice(startPart, startDot);
	        ret.base = path.slice(startPart, end);
	      }
	      ret.ext = path.slice(startDot, end);
	    }

	    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

	    return ret;
	  },

	  sep: '/',
	  delimiter: ':',
	  win32: null,
	  posix: null
	};

	posix.posix = posix;

	pathBrowserify = posix;
	return pathBrowserify;
}

var hasRequiredPath$1;

function requirePath$1 () {
	if (hasRequiredPath$1) return path$1;
	hasRequiredPath$1 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.basename = exports.isAbsolute = exports.normalize = exports.dirname = exports.relative = exports.join = exports.posix = exports.sep = exports.resolve = void 0;
		var node_path_1 = requirePathBrowserify();
		Object.defineProperty(exports, "resolve", { enumerable: true, get: function () { return node_path_1.resolve; } });
		Object.defineProperty(exports, "sep", { enumerable: true, get: function () { return node_path_1.sep; } });
		Object.defineProperty(exports, "posix", { enumerable: true, get: function () { return node_path_1.posix; } });
		Object.defineProperty(exports, "join", { enumerable: true, get: function () { return node_path_1.join; } });
		Object.defineProperty(exports, "relative", { enumerable: true, get: function () { return node_path_1.relative; } });
		Object.defineProperty(exports, "dirname", { enumerable: true, get: function () { return node_path_1.dirname; } });
		Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return node_path_1.normalize; } });
		Object.defineProperty(exports, "isAbsolute", { enumerable: true, get: function () { return node_path_1.isAbsolute; } });
		Object.defineProperty(exports, "basename", { enumerable: true, get: function () { return node_path_1.basename; } });
		
	} (path$1));
	return path$1;
}

var lib$6 = {};

var types$1 = {};

var hasRequiredTypes$1;

function requireTypes$1 () {
	if (hasRequiredTypes$1) return types$1;
	hasRequiredTypes$1 = 1;
	Object.defineProperty(types$1, "__esModule", { value: true });
	
	return types$1;
}

var json$1 = {};

var buffer$2 = {};

var buffer$1 = {};

var base64Js = {};

var hasRequiredBase64Js;

function requireBase64Js () {
	if (hasRequiredBase64Js) return base64Js;
	hasRequiredBase64Js = 1;

	base64Js.byteLength = byteLength;
	base64Js.toByteArray = toByteArray;
	base64Js.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i];
	  revLookup[code.charCodeAt(i)] = i;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  var i;
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}
	return base64Js;
}

var base64JsExports = requireBase64Js();

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredIeee754;

function requireIeee754 () {
	if (hasRequiredIeee754) return ieee754;
	hasRequiredIeee754 = 1;
	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};
	return ieee754;
}

var ieee754Exports = requireIeee754();

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null;

const INSPECT_MAX_BYTES = 50;

const K_MAX_LENGTH = 0x7fffffff;
const kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  );
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1);
    const proto = { foo: function () { return 42 } };
    Object.setPrototypeOf(proto, Uint8Array.prototype);
    Object.setPrototypeOf(arr, proto);
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
});

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
});

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf();
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value);
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
};

function allocUnsafe (size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
};

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0;
  let buf = createBuffer(length);

  const actual = buf.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0;
  const buf = createBuffer(length);
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView);
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf;
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype);

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0;
    const buf = createBuffer(len);

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len);
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length;
  let y = b.length;

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  const buffer = Buffer.allocUnsafe(length);
  let pos = 0;
  for (i = 0; i < list.length; ++i) {
    let buf = list[i];
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
        buf.copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        );
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos);
    }
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length;
  const mustMatch = (arguments.length > 2 && arguments[2] === true);
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  let loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  const i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  const length = this.length;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.toLocaleString = Buffer.prototype.toString;

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  let str = '';
  const max = INSPECT_MAX_BYTES;
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
  if (this.length > max) str += ' ... ';
  return '<Buffer ' + str + '>'
};
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength);
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  let x = thisEnd - thisStart;
  let y = end - start;
  const len = Math.min(x, y);

  const thisCopy = this.slice(thisStart, thisEnd);
  const targetCopy = target.slice(start, end);

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1;
  let arrLength = arr.length;
  let valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i;
  if (dir) {
    let foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      let found = true;
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  const remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  const strLen = string.length;

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  let i;
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  let loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64JsExports.fromByteArray(buf)
  } else {
    return base64JsExports.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  const res = [];

  let i = start;
  while (i < end) {
    const firstByte = buf[i];
    let codePoint = null;
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1;

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = '';
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = '';
  end = Math.min(buf.length, end);

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = '';
  end = Math.min(buf.length, end);

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  let out = '';
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]];
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end);
  let res = '';
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  const newBuf = this.subarray(start, end);
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype);

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  let val = this[offset];
  let mul = 1;
  let i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  let val = this[offset + --byteLength];
  let mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  const first = this[offset];
  const last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24;

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24;

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
});

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  const first = this[offset];
  const last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset];

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last;

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
});

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  let val = this[offset];
  let mul = 1;
  let i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  let i = byteLength;
  let mul = 1;
  let val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  const val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  const val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  const first = this[offset];
  const last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24); // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
});

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0;
  validateNumber(offset, 'offset');
  const first = this[offset];
  const last = this[offset + 7];
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8);
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset];

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
});

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754Exports.read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754Exports.read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754Exports.read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754Exports.read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  let mul = 1;
  let i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  let i = byteLength - 1;
  let mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  return offset + 2
};

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = (value >>> 8);
  this[offset + 1] = (value & 0xff);
  return offset + 2
};

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = (value >>> 24);
  this[offset + 2] = (value >>> 16);
  this[offset + 1] = (value >>> 8);
  this[offset] = (value & 0xff);
  return offset + 4
};

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = (value >>> 24);
  this[offset + 1] = (value >>> 16);
  this[offset + 2] = (value >>> 8);
  this[offset + 3] = (value & 0xff);
  return offset + 4
};

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);

  let lo = Number(value & BigInt(0xffffffff));
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);

  let lo = Number(value & BigInt(0xffffffff));
  buf[offset + 7] = lo;
  lo = lo >> 8;
  buf[offset + 6] = lo;
  lo = lo >> 8;
  buf[offset + 5] = lo;
  lo = lo >> 8;
  buf[offset + 4] = lo;
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
  buf[offset + 3] = hi;
  hi = hi >> 8;
  buf[offset + 2] = hi;
  hi = hi >> 8;
  buf[offset + 1] = hi;
  hi = hi >> 8;
  buf[offset] = hi;
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
});

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
});

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  let i = 0;
  let mul = 1;
  let sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  let i = byteLength - 1;
  let mul = 1;
  let sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
  this[offset] = (value >>> 8);
  this[offset + 1] = (value & 0xff);
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  this[offset + 2] = (value >>> 16);
  this[offset + 3] = (value >>> 24);
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = (value >>> 24);
  this[offset + 1] = (value >>> 16);
  this[offset + 2] = (value >>> 8);
  this[offset + 3] = (value & 0xff);
  return offset + 4
};

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
});

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
});

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  ieee754Exports.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  ieee754Exports.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  const len = end - start;

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0);
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } else if (typeof val === 'boolean') {
    val = Number(val);
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  let i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding);
    const len = bytes.length;
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors$2 = {};
function E (sym, getMessage, Base) {
  errors$2[sym] = class NodeError extends Base {
    constructor () {
      super();

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      });

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`;
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack; // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name;
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      });
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  };
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError);
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError);
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
      received = String(input);
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received);
      }
      received += 'n';
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg
  }, RangeError);

function addNumericalSeparator (val) {
  let res = '';
  let i = val.length;
  const start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`;
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset');
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1));
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : '';
    let range;
    {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`;
      }
    }
    throw new errors$2.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength);
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors$2.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type);
    throw new errors$2.ERR_OUT_OF_RANGE('offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors$2.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors$2.ERR_OUT_OF_RANGE('offset',
                                    `>= ${0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0];
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  let codePoint;
  const length = string.length;
  let leadSurrogate = null;
  const bytes = [];

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = [];
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo;
  const byteArray = [];
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64JsExports.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i;
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef';
  const table = new Array(256);
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16;
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }
  return table
})();

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}

var buffer = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Buffer: Buffer,
	INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
	SlowBuffer: SlowBuffer,
	kMaxLength: kMaxLength
});

var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(buffer);

var hasRequiredBuffer$1;

function requireBuffer$1 () {
	if (hasRequiredBuffer$1) return buffer$1;
	hasRequiredBuffer$1 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Buffer = void 0;
		var node_buffer_1 = require$$0$1;
		Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return node_buffer_1.Buffer; } });
		
	} (buffer$1));
	return buffer$1;
}

var hasRequiredBuffer;

function requireBuffer () {
	if (hasRequiredBuffer) return buffer$2;
	hasRequiredBuffer = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.bufferFrom = exports.bufferAllocUnsafe = exports.Buffer = void 0;
		const buffer_1 = requireBuffer$1();
		Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return buffer_1.Buffer; } });
		function bufferV0P12Ponyfill(arg0, ...args) {
		    return new buffer_1.Buffer(arg0, ...args);
		}
		const bufferAllocUnsafe = buffer_1.Buffer.allocUnsafe || bufferV0P12Ponyfill;
		exports.bufferAllocUnsafe = bufferAllocUnsafe;
		const bufferFrom = buffer_1.Buffer.from || bufferV0P12Ponyfill;
		exports.bufferFrom = bufferFrom;
		
	} (buffer$2));
	return buffer$2;
}

var hasRequiredJson$1;

function requireJson$1 () {
	if (hasRequiredJson$1) return json$1;
	hasRequiredJson$1 = 1;
	Object.defineProperty(json$1, "__esModule", { value: true });
	json$1.flattenJSON = void 0;
	const buffer_1 = requireBuffer();
	const path_1 = requirePath$1();
	const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
	const flattenJSON = (nestedJSON) => {
	    const flatJSON = {};
	    function flatten(pathPrefix, node) {
	        for (const path in node) {
	            const contentOrNode = node[path];
	            // TODO: Can we avoid using `join` here? Just concatenate?
	            const joinedPath = pathJoin(pathPrefix, path);
	            if (typeof contentOrNode === 'string' || contentOrNode instanceof buffer_1.Buffer) {
	                flatJSON[joinedPath] = contentOrNode;
	            }
	            else if (typeof contentOrNode === 'object' &&
	                contentOrNode !== null &&
	                !(contentOrNode instanceof buffer_1.Buffer) &&
	                Object.keys(contentOrNode).length > 0) {
	                // empty directories need an explicit entry and therefore get handled in `else`, non-empty ones are implicitly considered
	                flatten(joinedPath, contentOrNode);
	            }
	            else {
	                // without this branch null, empty-object or non-object entries would not be handled in the same way
	                // by both fromJSON() and fromNestedJSON()
	                flatJSON[joinedPath] = null;
	            }
	        }
	    }
	    flatten('', nestedJSON);
	    return flatJSON;
	};
	json$1.flattenJSON = flattenJSON;
	
	return json$1;
}

var constants$3 = {};

var hasRequiredConstants$3;

function requireConstants$3 () {
	if (hasRequiredConstants$3) return constants$3;
	hasRequiredConstants$3 = 1;
	Object.defineProperty(constants$3, "__esModule", { value: true });
	
	return constants$3;
}

var result = {};

var hasRequiredResult;

function requireResult () {
	if (hasRequiredResult) return result;
	hasRequiredResult = 1;
	Object.defineProperty(result, "__esModule", { value: true });
	result.Ok = Ok;
	result.Err = Err;
	function Ok(value) {
	    return { ok: true, value };
	}
	function Err(err) {
	    return { ok: false, err };
	}
	
	return result;
}

var Node = {};

var fanout = {};

var hasRequiredFanout;

function requireFanout () {
	if (hasRequiredFanout) return fanout;
	hasRequiredFanout = 1;
	Object.defineProperty(fanout, "__esModule", { value: true });
	fanout.FanOut = void 0;
	class FanOut {
	    constructor() {
	        this.listeners = new Set();
	    }
	    emit(data) {
	        this.listeners.forEach((listener) => listener(data));
	    }
	    listen(listener) {
	        const listeners = this.listeners;
	        listeners.add(listener);
	        return () => listeners.delete(listener);
	    }
	}
	fanout.FanOut = FanOut;
	return fanout;
}

var process = {};

var hasRequiredProcess;

function requireProcess () {
	if (hasRequiredProcess) return process;
	hasRequiredProcess = 1;
	// Here we mock the undefined `process` variable in case we are not in Node's environment.
	Object.defineProperty(process, "__esModule", { value: true });
	process.createProcess = createProcess;
	/**
	 * Looks to return a `process` object, if one is available.
	 *
	 * The undefined `process` is returned if defined;
	 * otherwise `require('process')` is attempted.
	 *
	 * If that fails, `undefined` is returned.
	 *
	 * @return {IProcess | undefined}
	 */
	const maybeReturnProcess = () => {
	    if (typeof process$1 !== 'undefined') {
	        return process$1;
	    }
	    try {
	        return requireBrowser$2();
	    }
	    catch {
	        return undefined;
	    }
	};
	function createProcess() {
	    const p = maybeReturnProcess() || {};
	    if (!p.cwd)
	        p.cwd = () => '/';
	    if (!p.emitWarning)
	        p.emitWarning = (message, type) => {
	            // tslint:disable-next-line:no-console
	            console.warn(`${type}${type ? ': ' : ''}${message}`);
	        };
	    if (!p.env)
	        p.env = {};
	    return p;
	}
	process.default = createProcess();
	
	return process;
}

var lib$5 = {};

var types = {};

var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types;
	hasRequiredTypes = 1;
	Object.defineProperty(types, "__esModule", { value: true });
	
	return types;
}

var constants$2 = {};

var hasRequiredConstants$2;

function requireConstants$2 () {
	if (hasRequiredConstants$2) return constants$2;
	hasRequiredConstants$2 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.FLAGS = exports.ERRSTR = exports.constants = exports.SEP = void 0;
		exports.SEP = '/';
		exports.constants = {
		    O_RDONLY: 0,
		    O_WRONLY: 1,
		    O_RDWR: 2,
		    S_IFMT: 61440,
		    S_IFREG: 32768,
		    S_IFDIR: 16384,
		    S_IFCHR: 8192,
		    S_IFBLK: 24576,
		    S_IFIFO: 4096,
		    S_IFLNK: 40960,
		    S_IFSOCK: 49152,
		    O_CREAT: 64,
		    O_EXCL: 128,
		    O_NOCTTY: 256,
		    O_TRUNC: 512,
		    O_APPEND: 1024,
		    O_DIRECTORY: 65536,
		    O_NOATIME: 262144,
		    O_NOFOLLOW: 131072,
		    O_SYNC: 1052672,
		    O_SYMLINK: 2097152,
		    O_DIRECT: 16384,
		    O_NONBLOCK: 2048,
		    S_IRWXU: 448,
		    S_IRUSR: 256,
		    S_IWUSR: 128,
		    S_IXUSR: 64,
		    S_IRWXG: 56,
		    S_IRGRP: 32,
		    S_IWGRP: 16,
		    S_IXGRP: 8,
		    S_IRWXO: 7,
		    S_IROTH: 4,
		    S_IWOTH: 2,
		    S_IXOTH: 1,
		    F_OK: 0,
		    R_OK: 4,
		    W_OK: 2,
		    X_OK: 1,
		    UV_FS_SYMLINK_DIR: 1,
		    UV_FS_SYMLINK_JUNCTION: 2,
		    UV_FS_COPYFILE_EXCL: 1,
		    UV_FS_COPYFILE_FICLONE: 2,
		    UV_FS_COPYFILE_FICLONE_FORCE: 4,
		    COPYFILE_EXCL: 1,
		    COPYFILE_FICLONE: 2,
		    COPYFILE_FICLONE_FORCE: 4,
		};
		exports.ERRSTR = {
		    PATH_STR: 'path must be a string, Buffer, or Uint8Array',
		    // FD:             'file descriptor must be a unsigned 32-bit integer',
		    FD: 'fd must be a file descriptor',
		    MODE_INT: 'mode must be an int',
		    CB: 'callback must be a function',
		    UID: 'uid must be an unsigned int',
		    GID: 'gid must be an unsigned int',
		    LEN: 'len must be an integer',
		    ATIME: 'atime must be an integer',
		    MTIME: 'mtime must be an integer',
		    PREFIX: 'filename prefix is required',
		    BUFFER: 'buffer must be an instance of Buffer or StaticBuffer',
		    OFFSET: 'offset must be an integer',
		    LENGTH: 'length must be an integer',
		    POSITION: 'position must be an integer',
		};
		const { O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL, O_TRUNC, O_APPEND, O_SYNC } = exports.constants;
		// List of file `flags` as defined by Node.
		var FLAGS;
		(function (FLAGS) {
		    // Open file for reading. An exception occurs if the file does not exist.
		    FLAGS[FLAGS["r"] = O_RDONLY] = "r";
		    // Open file for reading and writing. An exception occurs if the file does not exist.
		    FLAGS[FLAGS["r+"] = O_RDWR] = "r+";
		    // Open file for reading in synchronous mode. Instructs the operating system to bypass the local file system cache.
		    FLAGS[FLAGS["rs"] = O_RDONLY | O_SYNC] = "rs";
		    FLAGS[FLAGS["sr"] = FLAGS.rs] = "sr";
		    // Open file for reading and writing, telling the OS to open it synchronously. See notes for 'rs' about using this with caution.
		    FLAGS[FLAGS["rs+"] = O_RDWR | O_SYNC] = "rs+";
		    FLAGS[FLAGS["sr+"] = FLAGS['rs+']] = "sr+";
		    // Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
		    FLAGS[FLAGS["w"] = O_WRONLY | O_CREAT | O_TRUNC] = "w";
		    // Like 'w' but fails if path exists.
		    FLAGS[FLAGS["wx"] = O_WRONLY | O_CREAT | O_TRUNC | O_EXCL] = "wx";
		    FLAGS[FLAGS["xw"] = FLAGS.wx] = "xw";
		    // Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
		    FLAGS[FLAGS["w+"] = O_RDWR | O_CREAT | O_TRUNC] = "w+";
		    // Like 'w+' but fails if path exists.
		    FLAGS[FLAGS["wx+"] = O_RDWR | O_CREAT | O_TRUNC | O_EXCL] = "wx+";
		    FLAGS[FLAGS["xw+"] = FLAGS['wx+']] = "xw+";
		    // Open file for appending. The file is created if it does not exist.
		    FLAGS[FLAGS["a"] = O_WRONLY | O_APPEND | O_CREAT] = "a";
		    // Like 'a' but fails if path exists.
		    FLAGS[FLAGS["ax"] = O_WRONLY | O_APPEND | O_CREAT | O_EXCL] = "ax";
		    FLAGS[FLAGS["xa"] = FLAGS.ax] = "xa";
		    // Open file for reading and appending. The file is created if it does not exist.
		    FLAGS[FLAGS["a+"] = O_RDWR | O_APPEND | O_CREAT] = "a+";
		    // Like 'a+' but fails if path exists.
		    FLAGS[FLAGS["ax+"] = O_RDWR | O_APPEND | O_CREAT | O_EXCL] = "ax+";
		    FLAGS[FLAGS["xa+"] = FLAGS['ax+']] = "xa+";
		})(FLAGS || (exports.FLAGS = FLAGS = {}));
		
	} (constants$2));
	return constants$2;
}

var AMODE = {};

var hasRequiredAMODE;

function requireAMODE () {
	if (hasRequiredAMODE) return AMODE;
	hasRequiredAMODE = 1;
	Object.defineProperty(AMODE, "__esModule", { value: true });
	
	return AMODE;
}

var FLAG = {};

var hasRequiredFLAG;

function requireFLAG () {
	if (hasRequiredFLAG) return FLAG;
	hasRequiredFLAG = 1;
	Object.defineProperty(FLAG, "__esModule", { value: true });
	FLAG.FLAG = void 0;
	/**
	 * Constants used in `open` system calls, see [open(2)](http://man7.org/linux/man-pages/man2/open.2.html).
	 *
	 * These constants are compatible with Node.js fs constants and can be used with both
	 * memfs and native Node.js fs.promises.open().
	 *
	 * @see http://man7.org/linux/man-pages/man2/open.2.html
	 * @see https://www.gnu.org/software/libc/manual/html_node/Open_002dtime-Flags.html
	 */
	var FLAG$1;
	(function (FLAG) {
	    FLAG[FLAG["O_RDONLY"] = 0] = "O_RDONLY";
	    FLAG[FLAG["O_WRONLY"] = 1] = "O_WRONLY";
	    FLAG[FLAG["O_RDWR"] = 2] = "O_RDWR";
	    FLAG[FLAG["O_ACCMODE"] = 3] = "O_ACCMODE";
	    FLAG[FLAG["O_CREAT"] = 64] = "O_CREAT";
	    FLAG[FLAG["O_EXCL"] = 128] = "O_EXCL";
	    FLAG[FLAG["O_NOCTTY"] = 256] = "O_NOCTTY";
	    FLAG[FLAG["O_TRUNC"] = 512] = "O_TRUNC";
	    FLAG[FLAG["O_APPEND"] = 1024] = "O_APPEND";
	    FLAG[FLAG["O_NONBLOCK"] = 2048] = "O_NONBLOCK";
	    FLAG[FLAG["O_DSYNC"] = 4096] = "O_DSYNC";
	    FLAG[FLAG["FASYNC"] = 8192] = "FASYNC";
	    FLAG[FLAG["O_DIRECT"] = 16384] = "O_DIRECT";
	    FLAG[FLAG["O_LARGEFILE"] = 0] = "O_LARGEFILE";
	    FLAG[FLAG["O_DIRECTORY"] = 65536] = "O_DIRECTORY";
	    FLAG[FLAG["O_NOFOLLOW"] = 131072] = "O_NOFOLLOW";
	    FLAG[FLAG["O_NOATIME"] = 262144] = "O_NOATIME";
	    FLAG[FLAG["O_CLOEXEC"] = 524288] = "O_CLOEXEC";
	    FLAG[FLAG["O_SYNC"] = 1052672] = "O_SYNC";
	    FLAG[FLAG["O_NDELAY"] = 2048] = "O_NDELAY";
	})(FLAG$1 || (FLAG.FLAG = FLAG$1 = {}));
	
	return FLAG;
}

var path = {};

var hasRequiredPath;

function requirePath () {
	if (hasRequiredPath) return path;
	hasRequiredPath = 1;
	Object.defineProperty(path, "__esModule", { value: true });
	path.basename = void 0;
	const basename = (path, separator) => {
	    if (path[path.length - 1] === separator)
	        path = path.slice(0, -1);
	    const lastSlashIndex = path.lastIndexOf(separator);
	    return lastSlashIndex === -1 ? path : path.slice(lastSlashIndex + 1);
	};
	path.basename = basename;
	
	return path;
}

var encoding$1 = {};

var errors$1 = {};

var util$4 = {};

var hasRequiredUtil$4;

function requireUtil$4 () {
	if (hasRequiredUtil$4) return util$4;
	hasRequiredUtil$4 = 1;
	Object.defineProperty(util$4, "__esModule", { value: true });
	util$4.inherits = inherits;
	util$4.promisify = promisify;
	util$4.inspect = inspect;
	util$4.format = format;
	/**
	 * Minimal implementation of Node.js util.inherits function.
	 * Sets up prototype inheritance between constructor functions.
	 */
	function inherits(ctor, superCtor) {
	    if (ctor === undefined || ctor === null) {
	        throw new TypeError('The constructor to inherit from is not defined');
	    }
	    if (superCtor === undefined || superCtor === null) {
	        throw new TypeError('The super constructor to inherit from is not defined');
	    }
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	            value: ctor,
	            enumerable: false,
	            writable: true,
	            configurable: true,
	        },
	    });
	}
	/**
	 * Minimal implementation of Node.js util.promisify function.
	 * Converts callback-based functions to Promise-based functions.
	 */
	function promisify(fn) {
	    if (typeof fn !== 'function') {
	        throw new TypeError('The "original" argument must be of type function');
	    }
	    return function (...args) {
	        return new Promise((resolve, reject) => {
	            fn.call(this, ...args, (err, result) => {
	                if (err) {
	                    reject(err);
	                }
	                else {
	                    resolve(result);
	                }
	            });
	        });
	    };
	}
	/**
	 * Minimal implementation of Node.js util.inspect function.
	 * Converts a value to a string representation for debugging.
	 */
	function inspect(value) {
	    if (value === null)
	        return 'null';
	    if (value === undefined)
	        return 'undefined';
	    if (typeof value === 'string')
	        return `'${value}'`;
	    if (typeof value === 'number' || typeof value === 'boolean')
	        return String(value);
	    if (Array.isArray(value)) {
	        const items = value.map(item => inspect(item)).join(', ');
	        return `[ ${items} ]`;
	    }
	    if (typeof value === 'object') {
	        const entries = Object.entries(value)
	            .map(([key, val]) => `${key}: ${inspect(val)}`)
	            .join(', ');
	        return `{ ${entries} }`;
	    }
	    return String(value);
	}
	/**
	 * Minimal implementation of Node.js util.format function.
	 * Provides printf-style string formatting with basic placeholder support.
	 */
	function format(template, ...args) {
	    if (args.length === 0)
	        return template;
	    let result = template;
	    let argIndex = 0;
	    // Replace %s (string), %d (number), %j (JSON) placeholders
	    result = result.replace(/%[sdj%]/g, match => {
	        if (argIndex >= args.length)
	            return match;
	        const arg = args[argIndex++];
	        switch (match) {
	            case '%s':
	                return String(arg);
	            case '%d':
	                return Number(arg).toString();
	            case '%j':
	                try {
	                    return JSON.stringify(arg);
	                }
	                catch {
	                    return '[Circular]';
	                }
	            case '%%':
	                return '%';
	            default:
	                return match;
	        }
	    });
	    // Append remaining arguments
	    while (argIndex < args.length) {
	        result += ' ' + String(args[argIndex++]);
	    }
	    return result;
	}
	
	return util$4;
}

var hasRequiredErrors$1;

function requireErrors$1 () {
	if (hasRequiredErrors$1) return errors$1;
	hasRequiredErrors$1 = 1;
	(function (exports) {
		// Adapted from Node.js ../internal/errors.js, used for throwing similar errors to Node.js.
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.AssertionError = exports.RangeError = exports.TypeError = exports.Error = void 0;
		exports.message = message;
		exports.E = E;
		const util_1 = requireUtil$4();
		const kCode = typeof Symbol === 'undefined' ? '_kCode' : Symbol('code');
		const messages = {};
		function makeNodeError(Base) {
		    return class NodeError extends Base {
		        constructor(key, ...args) {
		            super(message(key, args));
		            this.code = key;
		            this[kCode] = key;
		            this.name = `${super.name} [${this[kCode]}]`;
		        }
		    };
		}
		const g = typeof globalThis !== 'undefined' ? globalThis : commonjsGlobal;
		class AssertionError extends g.Error {
		    constructor(options) {
		        if (typeof options !== 'object' || options === null) {
		            throw new exports.TypeError('ERR_INVALID_ARG_TYPE', 'options', 'object');
		        }
		        if (options.message) {
		            super(options.message);
		        }
		        else {
		            super(`${(0, util_1.inspect)(options.actual).slice(0, 128)} ` + `${options.operator} ${(0, util_1.inspect)(options.expected).slice(0, 128)}`);
		        }
		        this.generatedMessage = !options.message;
		        this.name = 'AssertionError [ERR_ASSERTION]';
		        this.code = 'ERR_ASSERTION';
		        this.actual = options.actual;
		        this.expected = options.expected;
		        this.operator = options.operator;
		        exports.Error.captureStackTrace(this, options.stackStartFunction);
		    }
		}
		exports.AssertionError = AssertionError;
		function message(key, args) {
		    if (typeof key !== 'string')
		        throw new exports.Error('Error message key must be a string');
		    const msg = messages[key];
		    if (!msg)
		        throw new exports.Error(`An invalid error message key was used: ${key}.`);
		    let fmt;
		    if (typeof msg === 'function') {
		        fmt = msg;
		    }
		    else {
		        fmt = util_1.format;
		        if (args === undefined || args.length === 0)
		            return msg;
		        args.unshift(msg);
		    }
		    return String(fmt.apply(null, args));
		}
		// Utility function for registering the error codes. Only used here. Exported
		// *only* to allow for testing.
		function E(sym, val) {
		    messages[sym] = typeof val === 'function' ? val : String(val);
		}
		exports.Error = makeNodeError(g.Error);
		exports.TypeError = makeNodeError(g.TypeError);
		exports.RangeError = makeNodeError(g.RangeError);
		E('ERR_DIR_CLOSED', 'Directory handle was closed');
		E('ERR_DIR_CONCURRENT_OPERATION', 'Cannot do synchronous work on directory handle with concurrent asynchronous operations');
		E('ERR_INVALID_FILE_URL_HOST', 'File URL host must be "localhost" or empty on %s');
		E('ERR_INVALID_FILE_URL_PATH', 'File URL path %s');
		E('ERR_INVALID_OPT_VALUE', (name, value) => {
		    return `The value "${String(value)}" is invalid for option "${name}"`;
		});
		E('ERR_INVALID_OPT_VALUE_ENCODING', value => `The value "${String(value)}" is invalid for option "encoding"`);
		E('ERR_INVALID_ARG_VALUE', 'Unable to open file as blob');
		
	} (errors$1));
	return errors$1;
}

var hasRequiredEncoding$1;

function requireEncoding$1 () {
	if (hasRequiredEncoding$1) return encoding$1;
	hasRequiredEncoding$1 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ENCODING_UTF8 = void 0;
		exports.assertEncoding = assertEncoding;
		exports.strToEncoding = strToEncoding;
		const buffer_1 = requireBuffer();
		const errors = requireErrors$1();
		exports.ENCODING_UTF8 = 'utf8';
		function assertEncoding(encoding) {
		    if (encoding && !buffer_1.Buffer.isEncoding(encoding))
		        throw new errors.TypeError('ERR_INVALID_OPT_VALUE_ENCODING', encoding);
		}
		function strToEncoding(str, encoding) {
		    if (!encoding || encoding === exports.ENCODING_UTF8)
		        return str; // UTF-8
		    if (encoding === 'buffer')
		        return new buffer_1.Buffer(str); // `buffer` encoding
		    return new buffer_1.Buffer(str).toString(encoding); // Custom encoding
		}
		
	} (encoding$1));
	return encoding$1;
}

var watchIgnore = {};

var lib$4 = {};

var hasRequiredLib$8;

function requireLib$8 () {
	if (hasRequiredLib$8) return lib$4;
	hasRequiredLib$8 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.toMatcher = exports.toRegex = void 0;
		const escapeRe = (ch) => (/[.^$+{}()|\\]/.test(ch) ? `\\${ch}` : ch);
		/**
		 * Parse an extended glob pattern like ?(a|b|c)
		 * Returns the regex string equivalent and the new index position
		 */
		const parseExtGlob = (pattern, startIdx, prefix, options) => {
		    let i = startIdx; // startIdx should be pointing at the character after '('
		    const parts = [];
		    let cur = '';
		    let depth = 1; // Track parenthesis depth for nested patterns
		    while (i < pattern.length && depth > 0) {
		        const ch = pattern[i];
		        if (ch === '(') {
		            depth++;
		            cur += ch;
		            i++;
		        }
		        else if (ch === ')') {
		            depth--;
		            if (depth === 0) {
		                // Found the closing parenthesis
		                parts.push(cur);
		                i++; // consume ')'
		                break;
		            }
		            else {
		                cur += ch;
		                i++;
		            }
		        }
		        else if (ch === '|' && depth === 1) {
		            // Pipe separator at top level of this extglob
		            parts.push(cur);
		            cur = '';
		            i++;
		        }
		        else {
		            cur += ch;
		            i++;
		        }
		    }
		    if (depth !== 0)
		        return; // Unclosed parenthesis
		    let alternatives = '';
		    const length = parts.length;
		    for (let j = 0; j < length; j++)
		        alternatives += (alternatives ? '|' : '') + (0, exports.toRegex)(parts[j], options).source.replace(/^\^/, '').replace(/\$$/, '');
		    switch (prefix) {
		        case '?': // zero or one
		            return [`(?:${alternatives})?`, i];
		        case '*': // zero or more
		            return [`(?:${alternatives})*`, i];
		        case '+': // one or more
		            return [`(?:${alternatives})+`, i];
		        case '@': // exactly one
		            return [`(?:${alternatives})`, i];
		        case '!': // none of (negative match)
		            // For negation, we need to match anything that doesn't match the pattern
		            // Use negative lookahead without consuming characters after
		            return [`(?!${alternatives})[^/]*`, i];
		    }
		    return;
		};
		/**
		 * Convert a glob pattern to a regular expression
		 *
		 * Supports:
		 * - `/` to separate path segments
		 * - `*` to match zero or more characters in a path segment
		 * - `?` to match one character in a path segment
		 * - `**` to match any number of path segments, including none
		 * - `{}` to group conditions (e.g. `{html,txt}`)
		 * - `[abc]`, `[a-z]`, `[!a-z]`, `[!abc]` character classes
		 * - Extended globbing (when `extglob: true` option is set):
		 *   - `?(pattern-list)` zero or one occurrence
		 *   - `*(pattern-list)` zero or more occurrences
		 *   - `+(pattern-list)` one or more occurrences
		 *   - `@(pattern-list)` exactly one of the patterns
		 *   - `!(pattern-list)` anything except the patterns
		 */
		const toRegex = (pattern, options) => {
		    let regexStr = '';
		    let i = 0;
		    // Helper to parse a brace group like {a,b,c}. No nesting support.
		    const parseBraceGroup = () => {
		        // Assume current char is '{'
		        i++; // skip '{'
		        const parts = [];
		        let cur = '';
		        let closed = false;
		        while (i < pattern.length) {
		            const ch = pattern[i];
		            if (ch === '}') {
		                parts.push(cur);
		                i++; // consume '}'
		                closed = true;
		                break;
		            }
		            if (ch === ',') {
		                parts.push(cur);
		                cur = '';
		                i++;
		                continue;
		            }
		            cur += ch;
		            i++;
		        }
		        if (!closed) {
		            // treat as literal '{...'
		            return '\\{' + escapeRe(cur);
		        }
		        // Convert each part recursively to support globs inside braces
		        const alt = parts.map((p) => (0, exports.toRegex)(p, options).source.replace(/^\^/, '').replace(/\$$/, '')).join('|');
		        return `(?:${alt})`;
		    };
		    const extglob = !!options?.extglob;
		    while (i < pattern.length) {
		        const char = pattern[i];
		        // Check for extended glob patterns when extglob is enabled
		        if (extglob && pattern[i + 1] === '(') {
		            if (char === '?' || char === '*' || char === '+' || char === '@' || char === '!') {
		                const result = parseExtGlob(pattern, i + 2, char, options);
		                if (result) {
		                    regexStr += result[0];
		                    i = result[1];
		                    continue;
		                }
		                // If parse failed, fall through to normal handling
		            }
		        }
		        switch (char) {
		            case '*': {
		                // Check for double star **
		                if (pattern[i + 1] === '*') {
		                    // Collapse consecutive * beyond two (e.g., *** -> **)
		                    let j = i + 2;
		                    while (pattern[j] === '*')
		                        j++;
		                    // If followed by a slash, make it optional to allow zero segments
		                    if (pattern[j] === '/') {
		                        regexStr += '(?:.*/)?';
		                        i = j + 1; // consume **/
		                    }
		                    else {
		                        regexStr += '.*';
		                        i = j; // consume **
		                    }
		                }
		                else {
		                    regexStr += '[^/]*';
		                    i++;
		                }
		                break;
		            }
		            case '?':
		                regexStr += '[^/]';
		                i++;
		                break;
		            case '[': {
		                // Copy character class as-is with support for leading '!'
		                let cls = '[';
		                i++;
		                if (i < pattern.length && pattern[i] === '!') {
		                    cls += '^';
		                    i++;
		                }
		                // if first after [ or [^ is ']' include it literally
		                if (i < pattern.length && pattern[i] === ']') {
		                    cls += ']';
		                    i++;
		                }
		                while (i < pattern.length && pattern[i] !== ']') {
		                    const ch = pattern[i];
		                    // Escape backslash inside class
		                    cls += ch === '\\' ? '\\\\' : ch;
		                    i++;
		                }
		                if (i < pattern.length && pattern[i] === ']') {
		                    cls += ']';
		                    i++;
		                }
		                else {
		                    // Unclosed class -> treat '[' literally
		                    regexStr += '\\[';
		                    continue;
		                }
		                regexStr += cls;
		                break;
		            }
		            case '{': {
		                regexStr += parseBraceGroup();
		                break;
		            }
		            case '/':
		                regexStr += '/';
		                i++;
		                break;
		            case '.':
		            case '^':
		            case '$':
		            case '+':
		            case '(':
		            case ')':
		            case '|':
		            case '\\':
		                regexStr += `\\${char}`;
		                i++;
		                break;
		            default:
		                regexStr += char;
		                i++;
		                break;
		        }
		    }
		    const flags = options?.nocase ? 'i' : '';
		    return new RegExp('^' + regexStr + '$', flags);
		};
		exports.toRegex = toRegex;
		const isRegExp = /^\/(.{1,4096})\/([gimsuy]{0,6})$/;
		const toMatcher = (pattern, options) => {
		    const regexes = [];
		    const patterns = Array.isArray(pattern) ? pattern : [pattern];
		    for (const pat of patterns) {
		        if (typeof pat === 'string') {
		            const match = isRegExp.exec(pat);
		            if (match) {
		                const [, expr, flags] = match;
		                regexes.push(new RegExp(expr, flags));
		            }
		            else {
		                regexes.push((0, exports.toRegex)(pat, options));
		            }
		        }
		        else {
		            regexes.push(pat);
		        }
		    }
		    return regexes.length
		        ? new Function('p', 'return ' + regexes.map((r) => r + '.test(p)').join('||'))
		        : () => false;
		};
		exports.toMatcher = toMatcher; 
	} (lib$4));
	return lib$4;
}

var hasRequiredWatchIgnore;

function requireWatchIgnore () {
	if (hasRequiredWatchIgnore) return watchIgnore;
	hasRequiredWatchIgnore = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.watchIgnoreToMatcher = exports.watchIgnorePatternToMatcher = void 0;
		const glob_to_regex_js_1 = requireLib$8();
		/** Converts a single `watch()` `ignore` pattern into a filename predicate. */
		const watchIgnorePatternToMatcher = (pattern) => {
		    if (typeof pattern === 'function')
		        return pattern;
		    if (pattern instanceof RegExp)
		        return filename => pattern.test(filename);
		    if (typeof pattern === 'string') {
		        const regex = (0, glob_to_regex_js_1.toRegex)(pattern);
		        return filename => regex.test(filename);
		    }
		    throw new TypeError('The "options.ignore" property must be of type string, RegExp, function, or an array thereof. ' +
		        `Received ${typeof pattern}`);
		};
		exports.watchIgnorePatternToMatcher = watchIgnorePatternToMatcher;
		/** Converts the `watch()` `ignore` option (pattern or array of patterns) into a filename predicate. */
		const watchIgnoreToMatcher = (ignore) => {
		    if (Array.isArray(ignore)) {
		        const matchers = ignore.map(exports.watchIgnorePatternToMatcher);
		        return filename => matchers.some(matcher => matcher(filename));
		    }
		    return (0, exports.watchIgnorePatternToMatcher)(ignore);
		};
		exports.watchIgnoreToMatcher = watchIgnoreToMatcher;
		
	} (watchIgnore));
	return watchIgnore;
}

var hasRequiredLib$7;

function requireLib$7 () {
	if (hasRequiredLib$7) return lib$5;
	hasRequiredLib$7 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		const tslib_1 = require$$0$2;
		tslib_1.__exportStar(requireTypes(), exports);
		tslib_1.__exportStar(requireConstants$2(), exports);
		tslib_1.__exportStar(requireAMODE(), exports);
		tslib_1.__exportStar(requireFLAG(), exports);
		tslib_1.__exportStar(requirePath(), exports);
		tslib_1.__exportStar(requireEncoding$1(), exports);
		tslib_1.__exportStar(requireWatchIgnore(), exports);
		
	} (lib$5));
	return lib$5;
}

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return Node;
	hasRequiredNode = 1;
	Object.defineProperty(Node, "__esModule", { value: true });
	Node.Node = void 0;
	const fanout_1 = requireFanout();
	const process_1 = requireProcess();
	const buffer_1 = requireBuffer();
	const fs_node_utils_1 = requireLib$7();
	const { S_IFMT, S_IFDIR, S_IFREG, S_IFLNK, S_IFCHR } = fs_node_utils_1.constants;
	const getuid = () => process_1.default.getuid?.() ?? 0;
	const getgid = () => process_1.default.getgid?.() ?? 0;
	const EMPTY_BUFFER = (0, buffer_1.bufferAllocUnsafe)(0);
	/**
	 * Node in a file system (like i-node, v-node).
	 */
	let Node$1 = class Node {
	    constructor(ino, mode = 0o666, uid = getuid(), gid = getgid()) {
	        /**
	         * @deprecated Subscribe to the volume-level `Superblock.changes` bus or use
	         * `CoreWatcher` instead.
	         */
	        this.changes = new fanout_1.FanOut();
	        // User ID and group ID.
	        this._uid = getuid();
	        this._gid = getgid();
	        this._atime = new Date();
	        this._mtime = new Date();
	        this._ctime = new Date();
	        this.buf = EMPTY_BUFFER;
	        /** Total allocated memory capacity for this node. */
	        this.capacity = 0;
	        /** Actually used bytes to store content. */
	        this.size = 0;
	        this.rdev = 0;
	        // Number of hard links pointing at this Node.
	        this._nlink = 1;
	        this.mode = mode;
	        this.ino = ino;
	        this._uid = uid;
	        this._gid = gid;
	    }
	    set ctime(ctime) {
	        this._ctime = ctime;
	    }
	    get ctime() {
	        return this._ctime;
	    }
	    set uid(uid) {
	        this._uid = uid;
	        this.ctime = new Date();
	    }
	    get uid() {
	        return this._uid;
	    }
	    set gid(gid) {
	        this._gid = gid;
	        this.ctime = new Date();
	    }
	    get gid() {
	        return this._gid;
	    }
	    set atime(atime) {
	        this._atime = atime;
	    }
	    get atime() {
	        return this._atime;
	    }
	    set mtime(mtime) {
	        this._mtime = mtime;
	        this.ctime = new Date();
	    }
	    get mtime() {
	        return this._mtime;
	    }
	    get perm() {
	        return this.mode & ~S_IFMT;
	    }
	    set perm(perm) {
	        this.mode = (this.mode & S_IFMT) | (perm & ~S_IFMT);
	        this.ctime = new Date();
	    }
	    set nlink(nlink) {
	        this._nlink = nlink;
	        this.ctime = new Date();
	    }
	    get nlink() {
	        return this._nlink;
	    }
	    getString(encoding = 'utf8') {
	        this.atime = new Date();
	        return this.getBuffer().toString(encoding);
	    }
	    setString(str) {
	        this._setBuf((0, buffer_1.bufferFrom)(str, 'utf8'));
	    }
	    getBuffer() {
	        this.atime = new Date();
	        if (!this.buf)
	            this.buf = (0, buffer_1.bufferAllocUnsafe)(0);
	        return (0, buffer_1.bufferFrom)(this.buf.subarray(0, this.size)); // Return a copy of used portion.
	    }
	    setBuffer(buf) {
	        const copy = (0, buffer_1.bufferFrom)(buf); // Creates a copy of data.
	        this._setBuf(copy);
	    }
	    _setBuf(buf) {
	        const size = buf.length;
	        this.buf = buf;
	        this.capacity = size;
	        this.size = size;
	        this.touch();
	    }
	    getSize() {
	        return this.size;
	    }
	    setModeProperty(property) {
	        this.mode = property;
	    }
	    isFile() {
	        return (this.mode & S_IFMT) === S_IFREG;
	    }
	    isDirectory() {
	        return (this.mode & S_IFMT) === S_IFDIR;
	    }
	    isSymlink() {
	        // return !!this.symlink;
	        return (this.mode & S_IFMT) === S_IFLNK;
	    }
	    isCharacterDevice() {
	        return (this.mode & S_IFMT) === S_IFCHR;
	    }
	    makeSymlink(symlink) {
	        this.mode = S_IFLNK | 0o666;
	        this.symlink = symlink;
	    }
	    write(buf, off = 0, len = buf.length, pos = 0) {
	        const bufLength = buf.length;
	        if (off + len > bufLength)
	            len = bufLength - off;
	        if (len <= 0)
	            return 0;
	        const requiredSize = pos + len;
	        if (requiredSize > this.capacity) {
	            let newCapacity = Math.max(this.capacity * 2, 64);
	            while (newCapacity < requiredSize)
	                newCapacity *= 2;
	            const newBuf = (0, buffer_1.bufferAllocUnsafe)(newCapacity);
	            if (this.size > 0)
	                this.buf.copy(newBuf, 0, 0, this.size);
	            this.buf = newBuf;
	            this.capacity = newCapacity;
	        }
	        if (pos > this.size)
	            this.buf.fill(0, this.size, pos);
	        buf.copy(this.buf, pos, off, off + len);
	        if (requiredSize > this.size)
	            this.size = requiredSize;
	        this.touch();
	        return len;
	    }
	    /**
	     * Read data from the file.
	     *
	     * @param buf Buffer to read data into.
	     * @param off Offset int the `buf` where to start writing data.
	     * @param len How many bytes to read. Equals to `buf.byteLength` by default.
	     * @param pos Position offset in file where to start reading. Defaults to `0`.
	     * @returns Returns the number of bytes read.
	     */
	    read(buf, off = 0, len = buf.byteLength, pos = 0) {
	        this.atime = new Date();
	        if (pos >= this.size)
	            return 0;
	        let actualLen = len;
	        if (actualLen > buf.byteLength)
	            actualLen = buf.byteLength;
	        if (actualLen + pos > this.size)
	            actualLen = this.size - pos;
	        if (actualLen <= 0)
	            return 0;
	        const buf2 = buf instanceof buffer_1.Buffer ? buf : buffer_1.Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
	        this.buf.copy(buf2, off, pos, pos + actualLen);
	        return actualLen;
	    }
	    truncate(len = 0) {
	        // A negative length is clamped to zero, matching Node.js `fs.truncate`,
	        // which truncates to an empty file rather than producing a negative size.
	        // Without this, `this.size` becomes negative and `getBuffer()`'s
	        // `subarray(0, this.size)` reads past the used region, exposing
	        // uninitialized heap memory from the unsafe-allocated backing buffer.
	        if (len <= 0) {
	            this.buf = EMPTY_BUFFER;
	            this.capacity = 0;
	            this.size = 0;
	            this.touch();
	            return;
	        }
	        if (len <= this.size)
	            this.size = len;
	        else {
	            if (len > this.capacity) {
	                let newCapacity = Math.max(this.capacity * 2, 64);
	                while (newCapacity < len)
	                    newCapacity *= 2;
	                const buf = (0, buffer_1.bufferAllocUnsafe)(newCapacity);
	                if (this.size > 0)
	                    this.buf.copy(buf, 0, 0, this.size);
	                buf.fill(0, this.size, len);
	                this.buf = buf;
	                this.capacity = newCapacity;
	            }
	            else
	                this.buf.fill(0, this.size, len);
	            this.size = len;
	        }
	        this.touch();
	    }
	    chmod(perm) {
	        this.mode = (this.mode & S_IFMT) | (perm & ~S_IFMT);
	        this.touch();
	    }
	    chown(uid, gid) {
	        this.uid = uid;
	        this.gid = gid;
	        this.touch();
	    }
	    touch() {
	        this.mtime = new Date();
	        this.changes.emit(['modify']);
	    }
	    canRead(uid = getuid(), gid = getgid()) {
	        if (this.perm & 4 /* S.IROTH */) {
	            return true;
	        }
	        if (gid === this.gid) {
	            if (this.perm & 32 /* S.IRGRP */) {
	                return true;
	            }
	        }
	        if (uid === this.uid) {
	            if (this.perm & 256 /* S.IRUSR */) {
	                return true;
	            }
	        }
	        return false;
	    }
	    canWrite(uid = getuid(), gid = getgid()) {
	        if (this.perm & 2 /* S.IWOTH */) {
	            return true;
	        }
	        if (gid === this.gid) {
	            if (this.perm & 16 /* S.IWGRP */) {
	                return true;
	            }
	        }
	        if (uid === this.uid) {
	            if (this.perm & 128 /* S.IWUSR */) {
	                return true;
	            }
	        }
	        return false;
	    }
	    canExecute(uid = getuid(), gid = getgid()) {
	        if (this.perm & 1 /* S.IXOTH */) {
	            return true;
	        }
	        if (gid === this.gid) {
	            if (this.perm & 8 /* S.IXGRP */) {
	                return true;
	            }
	        }
	        if (uid === this.uid) {
	            if (this.perm & 64 /* S.IXUSR */) {
	                return true;
	            }
	        }
	        return false;
	    }
	    del() {
	        this.changes.emit(['delete']);
	    }
	    toJSON() {
	        return {
	            ino: this.ino,
	            uid: this.uid,
	            gid: this.gid,
	            atime: this.atime.getTime(),
	            mtime: this.mtime.getTime(),
	            ctime: this.ctime.getTime(),
	            perm: this.perm,
	            mode: this.mode,
	            nlink: this.nlink,
	            symlink: this.symlink,
	            data: this.getString(),
	        };
	    }
	};
	Node.Node = Node$1;
	
	return Node;
}

var Link = {};

var hasRequiredLink;

function requireLink () {
	if (hasRequiredLink) return Link;
	hasRequiredLink = 1;
	Object.defineProperty(Link, "__esModule", { value: true });
	Link.Link = void 0;
	const fs_node_utils_1 = requireLib$7();
	const fanout_1 = requireFanout();
	const { S_IFREG } = fs_node_utils_1.constants;
	/**
	 * Represents a hard link that points to an i-node `node`.
	 */
	let Link$1 = class Link {
	    get steps() {
	        return this._steps;
	    }
	    // Recursively sync children steps, e.g. in case of dir rename
	    set steps(val) {
	        this._steps = val;
	        for (const [child, link] of this.children.entries()) {
	            if (child === '.' || child === '..') {
	                continue;
	            }
	            link?.syncSteps();
	        }
	    }
	    constructor(vol, parent, name) {
	        /**
	         * @deprecated Subscribe to the volume-level `Superblock.changes` bus or use
	         * `CoreWatcher` instead.
	         */
	        this.changes = new fanout_1.FanOut();
	        this.children = new Map();
	        // Path to this node as Array: ['usr', 'bin', 'node'].
	        this._steps = [];
	        // "i-node" number of the node.
	        this.ino = 0;
	        // Number of children.
	        this.length = 0;
	        this.vol = vol;
	        this.parent = parent;
	        this.name = name;
	        this.syncSteps();
	    }
	    setNode(node) {
	        this.node = node;
	        this.ino = node.ino;
	    }
	    getNode() {
	        return this.node;
	    }
	    createChild(name, node = this.vol.createNode(S_IFREG | 0o666)) {
	        const link = new Link(this.vol, this, name);
	        link.setNode(node);
	        if (node.isDirectory()) {
	            link.children.set('.', link);
	            link.getNode().nlink++;
	        }
	        this.setChild(name, link);
	        return link;
	    }
	    setChild(name, link = new Link(this.vol, this, name)) {
	        this.children.set(name, link);
	        link.parent = this;
	        this.length++;
	        const node = link.getNode();
	        if (node.isDirectory()) {
	            link.children.set('..', this);
	            this.getNode().nlink++;
	        }
	        this.getNode().mtime = new Date();
	        this.changes.emit(['child:add', link, this]);
	        return link;
	    }
	    deleteChild(link) {
	        const node = link.getNode();
	        if (node.isDirectory()) {
	            link.children.delete('..');
	            this.getNode().nlink--;
	        }
	        this.children.delete(link.getName());
	        this.length--;
	        this.getNode().mtime = new Date();
	        this.changes.emit(['child:del', link, this]);
	    }
	    getChild(name) {
	        this.getNode().atime = new Date();
	        return this.children.get(name);
	    }
	    getPath() {
	        return this.steps.join("/" /* PATH.SEP */);
	    }
	    getParentPath() {
	        const parent = this.steps.slice(0, -1).join("/" /* PATH.SEP */);
	        return parent ? parent : "/" /* PATH.SEP */;
	    }
	    getName() {
	        return this.steps[this.steps.length - 1];
	    }
	    toJSON() {
	        return {
	            steps: this.steps,
	            ino: this.ino,
	            children: Array.from(this.children.keys()),
	        };
	    }
	    syncSteps() {
	        this.steps = this.parent ? this.parent.steps.concat([this.name]) : [this.name];
	    }
	};
	Link.Link = Link$1;
	
	return Link;
}

var File = {};

var hasRequiredFile;

function requireFile () {
	if (hasRequiredFile) return File;
	hasRequiredFile = 1;
	Object.defineProperty(File, "__esModule", { value: true });
	File.File = void 0;
	const fs_node_utils_1 = requireLib$7();
	const { O_APPEND } = fs_node_utils_1.constants;
	/**
	 * Represents an open file (file descriptor) that points to a `Link` (Hard-link) and a `Node`.
	 *
	 * @todo Rename to `OpenFile`.
	 */
	let File$1 = class File {
	    /**
	     * Open a Link-Node pair. `node` is provided separately as that might be a different node
	     * rather the one `link` points to, because it might be a symlink.
	     * @param link
	     * @param node
	     * @param flags
	     * @param fd
	     */
	    constructor(link, node, flags, fd) {
	        this.link = link;
	        this.node = node;
	        this.flags = flags;
	        this.fd = fd;
	        this.position = 0;
	        if (this.flags & O_APPEND)
	            this.position = this.getSize();
	    }
	    getString(encoding = 'utf8') {
	        return this.node.getString();
	    }
	    setString(str) {
	        this.node.setString(str);
	    }
	    getBuffer() {
	        return this.node.getBuffer();
	    }
	    setBuffer(buf) {
	        this.node.setBuffer(buf);
	    }
	    getSize() {
	        return this.node.getSize();
	    }
	    truncate(len) {
	        this.node.truncate(len);
	    }
	    seekTo(position) {
	        this.position = position;
	    }
	    write(buf, offset = 0, length = buf.length, position) {
	        if (typeof position !== 'number')
	            position = this.position;
	        const bytes = this.node.write(buf, offset, length, position);
	        this.position = position + bytes;
	        return bytes;
	    }
	    read(buf, offset = 0, length = buf.byteLength, position) {
	        if (typeof position !== 'number')
	            position = this.position;
	        const bytes = this.node.read(buf, offset, length, position);
	        this.position = position + bytes;
	        return bytes;
	    }
	    chmod(perm) {
	        this.node.chmod(perm);
	    }
	    chown(uid, gid) {
	        this.node.chown(uid, gid);
	    }
	};
	File.File = File$1;
	
	return File;
}

var Superblock = {};

var util$3 = {};

var encoding = {};

var hasRequiredEncoding;

function requireEncoding () {
	if (hasRequiredEncoding) return encoding;
	hasRequiredEncoding = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ENCODING_UTF8 = void 0;
		exports.assertEncoding = assertEncoding;
		exports.strToEncoding = strToEncoding;
		const buffer_1 = requireBuffer();
		const errors = requireErrors$1();
		exports.ENCODING_UTF8 = 'utf8';
		function assertEncoding(encoding) {
		    if (encoding && !buffer_1.Buffer.isEncoding(encoding))
		        throw new errors.TypeError('ERR_INVALID_OPT_VALUE_ENCODING', encoding);
		}
		function strToEncoding(str, encoding) {
		    if (!encoding || encoding === exports.ENCODING_UTF8)
		        return str; // UTF-8
		    if (encoding === 'buffer')
		        return new buffer_1.Buffer(str); // `buffer` encoding
		    return new buffer_1.Buffer(str).toString(encoding); // Custom encoding
		}
		
	} (encoding));
	return encoding;
}

var url = {};

var punycode$1 = {exports: {}};

/*! https://mths.be/punycode v1.4.1 by @mathias */
var punycode = punycode$1.exports;

var hasRequiredPunycode;

function requirePunycode () {
	if (hasRequiredPunycode) return punycode$1.exports;
	hasRequiredPunycode = 1;
	(function (module, exports) {
(function(root) {

			/** Detect free variables */
			var freeExports = exports &&
				!exports.nodeType && exports;
			var freeModule = module &&
				!module.nodeType && module;
			var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
			if (
				freeGlobal.undefined === freeGlobal ||
				freeGlobal.window === freeGlobal ||
				freeGlobal.self === freeGlobal
			) {
				root = freeGlobal;
			}

			/**
			 * The `punycode` object.
			 * @name punycode
			 * @type Object
			 */
			var punycode,

			/** Highest positive signed 32-bit float value */
			maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

			/** Bootstring parameters */
			base = 36,
			tMin = 1,
			tMax = 26,
			skew = 38,
			damp = 700,
			initialBias = 72,
			initialN = 128, // 0x80
			delimiter = '-', // '\x2D'

			/** Regular expressions */
			regexPunycode = /^xn--/,
			regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
			regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

			/** Error messages */
			errors = {
				'overflow': 'Overflow: input needs wider integers to process',
				'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
				'invalid-input': 'Invalid input'
			},

			/** Convenience shortcuts */
			baseMinusTMin = base - tMin,
			floor = Math.floor,
			stringFromCharCode = String.fromCharCode,

			/** Temporary variable */
			key;

			/*--------------------------------------------------------------------------*/

			/**
			 * A generic error utility function.
			 * @private
			 * @param {String} type The error type.
			 * @returns {Error} Throws a `RangeError` with the applicable error message.
			 */
			function error(type) {
				throw new RangeError(errors[type]);
			}

			/**
			 * A generic `Array#map` utility function.
			 * @private
			 * @param {Array} array The array to iterate over.
			 * @param {Function} callback The function that gets called for every array
			 * item.
			 * @returns {Array} A new array of values returned by the callback function.
			 */
			function map(array, fn) {
				var length = array.length;
				var result = [];
				while (length--) {
					result[length] = fn(array[length]);
				}
				return result;
			}

			/**
			 * A simple `Array#map`-like wrapper to work with domain name strings or email
			 * addresses.
			 * @private
			 * @param {String} domain The domain name or email address.
			 * @param {Function} callback The function that gets called for every
			 * character.
			 * @returns {Array} A new string of characters returned by the callback
			 * function.
			 */
			function mapDomain(string, fn) {
				var parts = string.split('@');
				var result = '';
				if (parts.length > 1) {
					// In email addresses, only the domain name should be punycoded. Leave
					// the local part (i.e. everything up to `@`) intact.
					result = parts[0] + '@';
					string = parts[1];
				}
				// Avoid `split(regex)` for IE8 compatibility. See #17.
				string = string.replace(regexSeparators, '\x2E');
				var labels = string.split('.');
				var encoded = map(labels, fn).join('.');
				return result + encoded;
			}

			/**
			 * Creates an array containing the numeric code points of each Unicode
			 * character in the string. While JavaScript uses UCS-2 internally,
			 * this function will convert a pair of surrogate halves (each of which
			 * UCS-2 exposes as separate characters) into a single code point,
			 * matching UTF-16.
			 * @see `punycode.ucs2.encode`
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode.ucs2
			 * @name decode
			 * @param {String} string The Unicode input string (UCS-2).
			 * @returns {Array} The new array of code points.
			 */
			function ucs2decode(string) {
				var output = [],
				    counter = 0,
				    length = string.length,
				    value,
				    extra;
				while (counter < length) {
					value = string.charCodeAt(counter++);
					if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
						// high surrogate, and there is a next character
						extra = string.charCodeAt(counter++);
						if ((extra & 0xFC00) == 0xDC00) { // low surrogate
							output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
						} else {
							// unmatched surrogate; only append this code unit, in case the next
							// code unit is the high surrogate of a surrogate pair
							output.push(value);
							counter--;
						}
					} else {
						output.push(value);
					}
				}
				return output;
			}

			/**
			 * Creates a string based on an array of numeric code points.
			 * @see `punycode.ucs2.decode`
			 * @memberOf punycode.ucs2
			 * @name encode
			 * @param {Array} codePoints The array of numeric code points.
			 * @returns {String} The new Unicode string (UCS-2).
			 */
			function ucs2encode(array) {
				return map(array, function(value) {
					var output = '';
					if (value > 0xFFFF) {
						value -= 0x10000;
						output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
						value = 0xDC00 | value & 0x3FF;
					}
					output += stringFromCharCode(value);
					return output;
				}).join('');
			}

			/**
			 * Converts a basic code point into a digit/integer.
			 * @see `digitToBasic()`
			 * @private
			 * @param {Number} codePoint The basic numeric code point value.
			 * @returns {Number} The numeric value of a basic code point (for use in
			 * representing integers) in the range `0` to `base - 1`, or `base` if
			 * the code point does not represent a value.
			 */
			function basicToDigit(codePoint) {
				if (codePoint - 48 < 10) {
					return codePoint - 22;
				}
				if (codePoint - 65 < 26) {
					return codePoint - 65;
				}
				if (codePoint - 97 < 26) {
					return codePoint - 97;
				}
				return base;
			}

			/**
			 * Converts a digit/integer into a basic code point.
			 * @see `basicToDigit()`
			 * @private
			 * @param {Number} digit The numeric value of a basic code point.
			 * @returns {Number} The basic code point whose value (when used for
			 * representing integers) is `digit`, which needs to be in the range
			 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
			 * used; else, the lowercase form is used. The behavior is undefined
			 * if `flag` is non-zero and `digit` has no uppercase form.
			 */
			function digitToBasic(digit, flag) {
				//  0..25 map to ASCII a..z or A..Z
				// 26..35 map to ASCII 0..9
				return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
			}

			/**
			 * Bias adaptation function as per section 3.4 of RFC 3492.
			 * https://tools.ietf.org/html/rfc3492#section-3.4
			 * @private
			 */
			function adapt(delta, numPoints, firstTime) {
				var k = 0;
				delta = firstTime ? floor(delta / damp) : delta >> 1;
				delta += floor(delta / numPoints);
				for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
					delta = floor(delta / baseMinusTMin);
				}
				return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
			}

			/**
			 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
			 * symbols.
			 * @memberOf punycode
			 * @param {String} input The Punycode string of ASCII-only symbols.
			 * @returns {String} The resulting string of Unicode symbols.
			 */
			function decode(input) {
				// Don't use UCS-2
				var output = [],
				    inputLength = input.length,
				    out,
				    i = 0,
				    n = initialN,
				    bias = initialBias,
				    basic,
				    j,
				    index,
				    oldi,
				    w,
				    k,
				    digit,
				    t,
				    /** Cached calculation results */
				    baseMinusT;

				// Handle the basic code points: let `basic` be the number of input code
				// points before the last delimiter, or `0` if there is none, then copy
				// the first basic code points to the output.

				basic = input.lastIndexOf(delimiter);
				if (basic < 0) {
					basic = 0;
				}

				for (j = 0; j < basic; ++j) {
					// if it's not a basic code point
					if (input.charCodeAt(j) >= 0x80) {
						error('not-basic');
					}
					output.push(input.charCodeAt(j));
				}

				// Main decoding loop: start just after the last delimiter if any basic code
				// points were copied; start at the beginning otherwise.

				for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

					// `index` is the index of the next character to be consumed.
					// Decode a generalized variable-length integer into `delta`,
					// which gets added to `i`. The overflow checking is easier
					// if we increase `i` as we go, then subtract off its starting
					// value at the end to obtain `delta`.
					for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

						if (index >= inputLength) {
							error('invalid-input');
						}

						digit = basicToDigit(input.charCodeAt(index++));

						if (digit >= base || digit > floor((maxInt - i) / w)) {
							error('overflow');
						}

						i += digit * w;
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

						if (digit < t) {
							break;
						}

						baseMinusT = base - t;
						if (w > floor(maxInt / baseMinusT)) {
							error('overflow');
						}

						w *= baseMinusT;

					}

					out = output.length + 1;
					bias = adapt(i - oldi, out, oldi == 0);

					// `i` was supposed to wrap around from `out` to `0`,
					// incrementing `n` each time, so we'll fix that now:
					if (floor(i / out) > maxInt - n) {
						error('overflow');
					}

					n += floor(i / out);
					i %= out;

					// Insert `n` at position `i` of the output
					output.splice(i++, 0, n);

				}

				return ucs2encode(output);
			}

			/**
			 * Converts a string of Unicode symbols (e.g. a domain name label) to a
			 * Punycode string of ASCII-only symbols.
			 * @memberOf punycode
			 * @param {String} input The string of Unicode symbols.
			 * @returns {String} The resulting Punycode string of ASCII-only symbols.
			 */
			function encode(input) {
				var n,
				    delta,
				    handledCPCount,
				    basicLength,
				    bias,
				    j,
				    m,
				    q,
				    k,
				    t,
				    currentValue,
				    output = [],
				    /** `inputLength` will hold the number of code points in `input`. */
				    inputLength,
				    /** Cached calculation results */
				    handledCPCountPlusOne,
				    baseMinusT,
				    qMinusT;

				// Convert the input in UCS-2 to Unicode
				input = ucs2decode(input);

				// Cache the length
				inputLength = input.length;

				// Initialize the state
				n = initialN;
				delta = 0;
				bias = initialBias;

				// Handle the basic code points
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue < 0x80) {
						output.push(stringFromCharCode(currentValue));
					}
				}

				handledCPCount = basicLength = output.length;

				// `handledCPCount` is the number of code points that have been handled;
				// `basicLength` is the number of basic code points.

				// Finish the basic string - if it is not empty - with a delimiter
				if (basicLength) {
					output.push(delimiter);
				}

				// Main encoding loop:
				while (handledCPCount < inputLength) {

					// All non-basic code points < n have been handled already. Find the next
					// larger one:
					for (m = maxInt, j = 0; j < inputLength; ++j) {
						currentValue = input[j];
						if (currentValue >= n && currentValue < m) {
							m = currentValue;
						}
					}

					// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
					// but guard against overflow
					handledCPCountPlusOne = handledCPCount + 1;
					if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
						error('overflow');
					}

					delta += (m - n) * handledCPCountPlusOne;
					n = m;

					for (j = 0; j < inputLength; ++j) {
						currentValue = input[j];

						if (currentValue < n && ++delta > maxInt) {
							error('overflow');
						}

						if (currentValue == n) {
							// Represent delta as a generalized variable-length integer
							for (q = delta, k = base; /* no condition */; k += base) {
								t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
								if (q < t) {
									break;
								}
								qMinusT = q - t;
								baseMinusT = base - t;
								output.push(
									stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
								);
								q = floor(qMinusT / baseMinusT);
							}

							output.push(stringFromCharCode(digitToBasic(q, 0)));
							bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
							delta = 0;
							++handledCPCount;
						}
					}

					++delta;
					++n;

				}
				return output.join('');
			}

			/**
			 * Converts a Punycode string representing a domain name or an email address
			 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
			 * it doesn't matter if you call it on a string that has already been
			 * converted to Unicode.
			 * @memberOf punycode
			 * @param {String} input The Punycoded domain name or email address to
			 * convert to Unicode.
			 * @returns {String} The Unicode representation of the given Punycode
			 * string.
			 */
			function toUnicode(input) {
				return mapDomain(input, function(string) {
					return regexPunycode.test(string)
						? decode(string.slice(4).toLowerCase())
						: string;
				});
			}

			/**
			 * Converts a Unicode string representing a domain name or an email address to
			 * Punycode. Only the non-ASCII parts of the domain name will be converted,
			 * i.e. it doesn't matter if you call it with a domain that's already in
			 * ASCII.
			 * @memberOf punycode
			 * @param {String} input The domain name or email address to convert, as a
			 * Unicode string.
			 * @returns {String} The Punycode representation of the given domain name or
			 * email address.
			 */
			function toASCII(input) {
				return mapDomain(input, function(string) {
					return regexNonASCII.test(string)
						? 'xn--' + encode(string)
						: string;
				});
			}

			/*--------------------------------------------------------------------------*/

			/** Define the public API */
			punycode = {
				/**
				 * A string representing the current Punycode.js version number.
				 * @memberOf punycode
				 * @type String
				 */
				'version': '1.4.1',
				/**
				 * An object of methods to convert from JavaScript's internal character
				 * representation (UCS-2) to Unicode code points, and back.
				 * @see <https://mathiasbynens.be/notes/javascript-encoding>
				 * @memberOf punycode
				 * @type Object
				 */
				'ucs2': {
					'decode': ucs2decode,
					'encode': ucs2encode
				},
				'decode': decode,
				'encode': encode,
				'toASCII': toASCII,
				'toUnicode': toUnicode
			};

			/** Expose `punycode` */
			// Some AMD build optimizers, like r.js, check for specific condition patterns
			// like the following:
			if (freeExports && freeModule) {
				if (module.exports == freeExports) {
					// in Node.js, io.js, or RingoJS v0.8.0+
					freeModule.exports = punycode;
				} else {
					// in Narwhal or RingoJS v0.7.0-
					for (key in punycode) {
						punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
					}
				}
			} else {
				// in Rhino or a web browser
				root.punycode = punycode;
			}

		}(punycode)); 
	} (punycode$1, punycode$1.exports));
	return punycode$1.exports;
}

var type;
var hasRequiredType;

function requireType () {
	if (hasRequiredType) return type;
	hasRequiredType = 1;

	/** @type {import('./type')} */
	type = TypeError;
	return type;
}

var _nodeResolve_empty = {};

var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	default: _nodeResolve_empty
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

var objectInspect;
var hasRequiredObjectInspect;

function requireObjectInspect () {
	if (hasRequiredObjectInspect) return objectInspect;
	hasRequiredObjectInspect = 1;
	var hasMap = typeof Map === 'function' && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === 'function' && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
	var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
	var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
	var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
	var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
	var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
	// ie, `has-tostringtag/shams
	var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
	    ? Symbol.toStringTag
	    : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;

	var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
	    [].__proto__ === Array.prototype // eslint-disable-line no-proto
	        ? function (O) {
	            return O.__proto__; // eslint-disable-line no-proto
	        }
	        : null
	);

	function addNumericSeparator(num, str) {
	    if (
	        num === Infinity
	        || num === -Infinity
	        || num !== num
	        || (num && num > -1e3 && num < 1000)
	        || $test.call(/e/, str)
	    ) {
	        return str;
	    }
	    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
	    if (typeof num === 'number') {
	        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
	        if (int !== num) {
	            var intStr = String(int);
	            var dec = $slice.call(str, intStr.length + 1);
	            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
	        }
	    }
	    return $replace.call(str, sepRegex, '$&_');
	}

	var utilInspect = require$$0;
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

	var quotes = {
	    __proto__: null,
	    'double': '"',
	    single: "'"
	};
	var quoteREs = {
	    __proto__: null,
	    'double': /(["\\])/g,
	    single: /(['\\])/g
	};

	objectInspect = function inspect_(obj, options, depth, seen) {
	    var opts = options || {};

	    if (has(opts, 'quoteStyle') && !has(quotes, opts.quoteStyle)) {
	        throw new TypeError('option "quoteStyle" must be "single" or "double"');
	    }
	    if (
	        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
	            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
	            : opts.maxStringLength !== null
	        )
	    ) {
	        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
	    }
	    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
	    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
	        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
	    }

	    if (
	        has(opts, 'indent')
	        && opts.indent !== null
	        && opts.indent !== '\t'
	        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
	    ) {
	        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
	    }
	    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
	        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
	    }
	    var numericSeparator = opts.numericSeparator;

	    if (typeof obj === 'undefined') {
	        return 'undefined';
	    }
	    if (obj === null) {
	        return 'null';
	    }
	    if (typeof obj === 'boolean') {
	        return obj ? 'true' : 'false';
	    }

	    if (typeof obj === 'string') {
	        return inspectString(obj, opts);
	    }
	    if (typeof obj === 'number') {
	        if (obj === 0) {
	            return Infinity / obj > 0 ? '0' : '-0';
	        }
	        var str = String(obj);
	        return numericSeparator ? addNumericSeparator(obj, str) : str;
	    }
	    if (typeof obj === 'bigint') {
	        var bigIntStr = String(obj) + 'n';
	        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
	    }

	    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
	    if (typeof depth === 'undefined') { depth = 0; }
	    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
	        return isArray(obj) ? '[Array]' : '[Object]';
	    }

	    var indent = getIndent(opts, depth);

	    if (typeof seen === 'undefined') {
	        seen = [];
	    } else if (indexOf(seen, obj) >= 0) {
	        return '[Circular]';
	    }

	    function inspect(value, from, noIndent) {
	        if (from) {
	            seen = $arrSlice.call(seen);
	            seen.push(from);
	        }
	        if (noIndent) {
	            var newOpts = {
	                depth: opts.depth
	            };
	            if (has(opts, 'quoteStyle')) {
	                newOpts.quoteStyle = opts.quoteStyle;
	            }
	            return inspect_(value, newOpts, depth + 1, seen);
	        }
	        return inspect_(value, opts, depth + 1, seen);
	    }

	    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
	        var name = nameOf(obj);
	        var keys = arrObjKeys(obj, inspect);
	        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
	    }
	    if (isSymbol(obj)) {
	        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
	        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
	    }
	    if (isElement(obj)) {
	        var s = '<' + $toLowerCase.call(String(obj.nodeName));
	        var attrs = obj.attributes || [];
	        for (var i = 0; i < attrs.length; i++) {
	            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
	        }
	        s += '>';
	        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
	        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
	        return s;
	    }
	    if (isArray(obj)) {
	        if (obj.length === 0) { return '[]'; }
	        var xs = arrObjKeys(obj, inspect);
	        if (indent && !singleLineValues(xs)) {
	            return '[' + indentedJoin(xs, indent) + ']';
	        }
	        return '[ ' + $join.call(xs, ', ') + ' ]';
	    }
	    if (isError(obj)) {
	        var parts = arrObjKeys(obj, inspect);
	        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
	            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
	        }
	        if (parts.length === 0) { return '[' + String(obj) + ']'; }
	        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
	    }
	    if (typeof obj === 'object' && customInspect) {
	        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
	            return utilInspect(obj, { depth: maxDepth - depth });
	        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
	            return obj.inspect();
	        }
	    }
	    if (isMap(obj)) {
	        var mapParts = [];
	        if (mapForEach) {
	            mapForEach.call(obj, function (value, key) {
	                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
	            });
	        }
	        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
	    }
	    if (isSet(obj)) {
	        var setParts = [];
	        if (setForEach) {
	            setForEach.call(obj, function (value) {
	                setParts.push(inspect(value, obj));
	            });
	        }
	        return collectionOf('Set', setSize.call(obj), setParts, indent);
	    }
	    if (isWeakMap(obj)) {
	        return weakCollectionOf('WeakMap');
	    }
	    if (isWeakSet(obj)) {
	        return weakCollectionOf('WeakSet');
	    }
	    if (isWeakRef(obj)) {
	        return weakCollectionOf('WeakRef');
	    }
	    if (isNumber(obj)) {
	        return markBoxed(inspect(Number(obj)));
	    }
	    if (isBigInt(obj)) {
	        return markBoxed(inspect(bigIntValueOf.call(obj)));
	    }
	    if (isBoolean(obj)) {
	        return markBoxed(booleanValueOf.call(obj));
	    }
	    if (isString(obj)) {
	        return markBoxed(inspect(String(obj)));
	    }
	    // note: in IE 8, sometimes `undefined !== window` but both are the prototypes of each other
	    /* eslint-env browser */
	    if (typeof window !== 'undefined' && obj === window) {
	        return '{ [object Window] }';
	    }
	    if (
	        (typeof globalThis !== 'undefined' && obj === globalThis)
	        || (typeof commonjsGlobal !== 'undefined' && obj === commonjsGlobal)
	    ) {
	        return '{ [object globalThis] }';
	    }
	    if (!isDate(obj) && !isRegExp(obj)) {
	        var ys = arrObjKeys(obj, inspect);
	        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
	        var protoTag = obj instanceof Object ? '' : 'null prototype';
	        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
	        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
	        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
	        if (ys.length === 0) { return tag + '{}'; }
	        if (indent) {
	            return tag + '{' + indentedJoin(ys, indent) + '}';
	        }
	        return tag + '{ ' + $join.call(ys, ', ') + ' }';
	    }
	    return String(obj);
	};

	function wrapQuotes(s, defaultStyle, opts) {
	    var style = opts.quoteStyle || defaultStyle;
	    var quoteChar = quotes[style];
	    return quoteChar + s + quoteChar;
	}

	function quote(s) {
	    return $replace.call(String(s), /"/g, '&quot;');
	}

	function canTrustToString(obj) {
	    return !toStringTag || !(typeof obj === 'object' && (toStringTag in obj || typeof obj[toStringTag] !== 'undefined'));
	}
	function isArray(obj) { return toStr(obj) === '[object Array]' && canTrustToString(obj); }
	function isDate(obj) { return toStr(obj) === '[object Date]' && canTrustToString(obj); }
	function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && canTrustToString(obj); }
	function isError(obj) { return toStr(obj) === '[object Error]' && canTrustToString(obj); }
	function isString(obj) { return toStr(obj) === '[object String]' && canTrustToString(obj); }
	function isNumber(obj) { return toStr(obj) === '[object Number]' && canTrustToString(obj); }
	function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && canTrustToString(obj); }

	// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
	function isSymbol(obj) {
	    if (hasShammedSymbols) {
	        return obj && typeof obj === 'object' && obj instanceof Symbol;
	    }
	    if (typeof obj === 'symbol') {
	        return true;
	    }
	    if (!obj || typeof obj !== 'object' || !symToString) {
	        return false;
	    }
	    try {
	        symToString.call(obj);
	        return true;
	    } catch (e) {}
	    return false;
	}

	function isBigInt(obj) {
	    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
	        return false;
	    }
	    try {
	        bigIntValueOf.call(obj);
	        return true;
	    } catch (e) {}
	    return false;
	}

	var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
	function has(obj, key) {
	    return hasOwn.call(obj, key);
	}

	function toStr(obj) {
	    return objectToString.call(obj);
	}

	function nameOf(f) {
	    if (f.name) { return f.name; }
	    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
	    if (m) { return m[1]; }
	    return null;
	}

	function indexOf(xs, x) {
	    if (xs.indexOf) { return xs.indexOf(x); }
	    for (var i = 0, l = xs.length; i < l; i++) {
	        if (xs[i] === x) { return i; }
	    }
	    return -1;
	}

	function isMap(x) {
	    if (!mapSize || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        mapSize.call(x);
	        try {
	            setSize.call(x);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof Map; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isWeakMap(x) {
	    if (!weakMapHas || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakMapHas.call(x, weakMapHas);
	        try {
	            weakSetHas.call(x, weakSetHas);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isWeakRef(x) {
	    if (!weakRefDeref || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakRefDeref.call(x);
	        return true;
	    } catch (e) {}
	    return false;
	}

	function isSet(x) {
	    if (!setSize || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        setSize.call(x);
	        try {
	            mapSize.call(x);
	        } catch (m) {
	            return true;
	        }
	        return x instanceof Set; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isWeakSet(x) {
	    if (!weakSetHas || !x || typeof x !== 'object') {
	        return false;
	    }
	    try {
	        weakSetHas.call(x, weakSetHas);
	        try {
	            weakMapHas.call(x, weakMapHas);
	        } catch (s) {
	            return true;
	        }
	        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
	    } catch (e) {}
	    return false;
	}

	function isElement(x) {
	    if (!x || typeof x !== 'object') { return false; }
	    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
	        return true;
	    }
	    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
	}

	function inspectString(str, opts) {
	    if (str.length > opts.maxStringLength) {
	        var remaining = str.length - opts.maxStringLength;
	        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
	        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
	    }
	    var quoteRE = quoteREs[opts.quoteStyle || 'single'];
	    quoteRE.lastIndex = 0;
	    // eslint-disable-next-line no-control-regex
	    var s = $replace.call($replace.call(str, quoteRE, '\\$1'), /[\x00-\x1f]/g, lowbyte);
	    return wrapQuotes(s, 'single', opts);
	}

	function lowbyte(c) {
	    var n = c.charCodeAt(0);
	    var x = {
	        8: 'b',
	        9: 't',
	        10: 'n',
	        12: 'f',
	        13: 'r'
	    }[n];
	    if (x) { return '\\' + x; }
	    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
	}

	function markBoxed(str) {
	    return 'Object(' + str + ')';
	}

	function weakCollectionOf(type) {
	    return type + ' { ? }';
	}

	function collectionOf(type, size, entries, indent) {
	    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
	    return type + ' (' + size + ') {' + joinedEntries + '}';
	}

	function singleLineValues(xs) {
	    for (var i = 0; i < xs.length; i++) {
	        if (indexOf(xs[i], '\n') >= 0) {
	            return false;
	        }
	    }
	    return true;
	}

	function getIndent(opts, depth) {
	    var baseIndent;
	    if (opts.indent === '\t') {
	        baseIndent = '\t';
	    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
	        baseIndent = $join.call(Array(opts.indent + 1), ' ');
	    } else {
	        return null;
	    }
	    return {
	        base: baseIndent,
	        prev: $join.call(Array(depth + 1), baseIndent)
	    };
	}

	function indentedJoin(xs, indent) {
	    if (xs.length === 0) { return ''; }
	    var lineJoiner = '\n' + indent.prev + indent.base;
	    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
	}

	function arrObjKeys(obj, inspect) {
	    var isArr = isArray(obj);
	    var xs = [];
	    if (isArr) {
	        xs.length = obj.length;
	        for (var i = 0; i < obj.length; i++) {
	            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
	        }
	    }
	    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
	    var symMap;
	    if (hasShammedSymbols) {
	        symMap = {};
	        for (var k = 0; k < syms.length; k++) {
	            symMap['$' + syms[k]] = syms[k];
	        }
	    }

	    for (var key in obj) { // eslint-disable-line no-restricted-syntax
	        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
	        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
	        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
	            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
	            continue; // eslint-disable-line no-restricted-syntax, no-continue
	        } else if ($test.call(/[^\w$]/, key)) {
	            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
	        } else {
	            xs.push(key + ': ' + inspect(obj[key], obj));
	        }
	    }
	    if (typeof gOPS === 'function') {
	        for (var j = 0; j < syms.length; j++) {
	            if (isEnumerable.call(obj, syms[j])) {
	                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
	            }
	        }
	    }
	    return xs;
	}
	return objectInspect;
}

var sideChannelList;
var hasRequiredSideChannelList;

function requireSideChannelList () {
	if (hasRequiredSideChannelList) return sideChannelList;
	hasRequiredSideChannelList = 1;

	var inspect = /*@__PURE__*/ requireObjectInspect();

	var $TypeError = /*@__PURE__*/ requireType();

	/*
	* This function traverses the list returning the node corresponding to the given key.
	*
	* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list.
	* By doing so, all the recently used nodes can be accessed relatively quickly.
	*/
	/** @type {import('./list.d.ts').listGetNode} */
	// eslint-disable-next-line consistent-return
	var listGetNode = function (list, key, isDelete) {
		/** @type {typeof list | NonNullable<(typeof list)['next']>} */
		var prev = list;
		/** @type {(typeof list)['next']} */
		var curr;
		// eslint-disable-next-line eqeqeq
		for (; (curr = prev.next) != null; prev = curr) {
			if (curr.key === key) {
				prev.next = curr.next;
				if (!isDelete) {
					// eslint-disable-next-line no-extra-parens
					curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
					list.next = curr; // eslint-disable-line no-param-reassign
				}
				return curr;
			}
		}
	};

	/** @type {import('./list.d.ts').listGet} */
	var listGet = function (objects, key) {
		if (!objects) {
			return void undefined;
		}
		var node = listGetNode(objects, key);
		return node && node.value;
	};
	/** @type {import('./list.d.ts').listSet} */
	var listSet = function (objects, key, value) {
		var node = listGetNode(objects, key);
		if (node) {
			node.value = value;
		} else {
			// Prepend the new node to the beginning of the list
			objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
				key: key,
				next: objects.next,
				value: value
			});
		}
	};
	/** @type {import('./list.d.ts').listHas} */
	var listHas = function (objects, key) {
		if (!objects) {
			return false;
		}
		return !!listGetNode(objects, key);
	};
	/** @type {import('./list.d.ts').listDelete} */
	// eslint-disable-next-line consistent-return
	var listDelete = function (objects, key) {
		if (objects) {
			return listGetNode(objects, key, true);
		}
	};

	/** @type {import('.')} */
	sideChannelList = function getSideChannelList() {
		/** @typedef {ReturnType<typeof getSideChannelList>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */

		/** @type {import('./list.d.ts').RootNode<V, K> | undefined} */ var $o;

		/** @type {Channel} */
		var channel = {
			assert: function (key) {
				if (!channel.has(key)) {
					throw new $TypeError('Side channel does not contain ' + inspect(key));
				}
			},
			'delete': function (key) {
				var deletedNode = listDelete($o, key);
				if (deletedNode && $o && !$o.next) {
					$o = void undefined;
				}
				return !!deletedNode;
			},
			get: function (key) {
				return listGet($o, key);
			},
			has: function (key) {
				return listHas($o, key);
			},
			set: function (key, value) {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = {
						next: void undefined
					};
				}
				// eslint-disable-next-line no-extra-parens
				listSet(/** @type {NonNullable<typeof $o>} */ ($o), key, value);
			}
		};
		return channel;
	};
	return sideChannelList;
}

var esObjectAtoms;
var hasRequiredEsObjectAtoms;

function requireEsObjectAtoms () {
	if (hasRequiredEsObjectAtoms) return esObjectAtoms;
	hasRequiredEsObjectAtoms = 1;

	/** @type {import('.')} */
	esObjectAtoms = Object;
	return esObjectAtoms;
}

var esErrors;
var hasRequiredEsErrors;

function requireEsErrors () {
	if (hasRequiredEsErrors) return esErrors;
	hasRequiredEsErrors = 1;

	/** @type {import('.')} */
	esErrors = Error;
	return esErrors;
}

var _eval;
var hasRequired_eval;

function require_eval () {
	if (hasRequired_eval) return _eval;
	hasRequired_eval = 1;

	/** @type {import('./eval')} */
	_eval = EvalError;
	return _eval;
}

var range;
var hasRequiredRange;

function requireRange () {
	if (hasRequiredRange) return range;
	hasRequiredRange = 1;

	/** @type {import('./range')} */
	range = RangeError;
	return range;
}

var ref;
var hasRequiredRef;

function requireRef () {
	if (hasRequiredRef) return ref;
	hasRequiredRef = 1;

	/** @type {import('./ref')} */
	ref = ReferenceError;
	return ref;
}

var syntax;
var hasRequiredSyntax;

function requireSyntax () {
	if (hasRequiredSyntax) return syntax;
	hasRequiredSyntax = 1;

	/** @type {import('./syntax')} */
	syntax = SyntaxError;
	return syntax;
}

var uri;
var hasRequiredUri;

function requireUri () {
	if (hasRequiredUri) return uri;
	hasRequiredUri = 1;

	/** @type {import('./uri')} */
	uri = URIError;
	return uri;
}

var abs;
var hasRequiredAbs;

function requireAbs () {
	if (hasRequiredAbs) return abs;
	hasRequiredAbs = 1;

	/** @type {import('./abs')} */
	abs = Math.abs;
	return abs;
}

var floor;
var hasRequiredFloor;

function requireFloor () {
	if (hasRequiredFloor) return floor;
	hasRequiredFloor = 1;

	/** @type {import('./floor')} */
	floor = Math.floor;
	return floor;
}

var max;
var hasRequiredMax;

function requireMax () {
	if (hasRequiredMax) return max;
	hasRequiredMax = 1;

	/** @type {import('./max')} */
	max = Math.max;
	return max;
}

var min;
var hasRequiredMin;

function requireMin () {
	if (hasRequiredMin) return min;
	hasRequiredMin = 1;

	/** @type {import('./min')} */
	min = Math.min;
	return min;
}

var pow;
var hasRequiredPow;

function requirePow () {
	if (hasRequiredPow) return pow;
	hasRequiredPow = 1;

	/** @type {import('./pow')} */
	pow = Math.pow;
	return pow;
}

var round;
var hasRequiredRound;

function requireRound () {
	if (hasRequiredRound) return round;
	hasRequiredRound = 1;

	/** @type {import('./round')} */
	round = Math.round;
	return round;
}

var _isNaN;
var hasRequired_isNaN;

function require_isNaN () {
	if (hasRequired_isNaN) return _isNaN;
	hasRequired_isNaN = 1;

	/** @type {import('./isNaN')} */
	_isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
	return _isNaN;
}

var sign;
var hasRequiredSign;

function requireSign () {
	if (hasRequiredSign) return sign;
	hasRequiredSign = 1;

	var $isNaN = /*@__PURE__*/ require_isNaN();

	/** @type {import('./sign')} */
	sign = function sign(number) {
		if ($isNaN(number) || number === 0) {
			return number;
		}
		return number < 0 ? -1 : 1;
	};
	return sign;
}

var gOPD;
var hasRequiredGOPD;

function requireGOPD () {
	if (hasRequiredGOPD) return gOPD;
	hasRequiredGOPD = 1;

	/** @type {import('./gOPD')} */
	gOPD = Object.getOwnPropertyDescriptor;
	return gOPD;
}

var gopd;
var hasRequiredGopd;

function requireGopd () {
	if (hasRequiredGopd) return gopd;
	hasRequiredGopd = 1;

	/** @type {import('.')} */
	var $gOPD = /*@__PURE__*/ requireGOPD();

	if ($gOPD) {
		try {
			$gOPD([], 'length');
		} catch (e) {
			// IE 8 has a broken gOPD
			$gOPD = null;
		}
	}

	gopd = $gOPD;
	return gopd;
}

var esDefineProperty;
var hasRequiredEsDefineProperty;

function requireEsDefineProperty () {
	if (hasRequiredEsDefineProperty) return esDefineProperty;
	hasRequiredEsDefineProperty = 1;

	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) {
		try {
			$defineProperty({}, 'a', { value: 1 });
		} catch (e) {
			// IE 8 has a broken defineProperty
			$defineProperty = false;
		}
	}

	esDefineProperty = $defineProperty;
	return esDefineProperty;
}

var shams;
var hasRequiredShams;

function requireShams () {
	if (hasRequiredShams) return shams;
	hasRequiredShams = 1;

	/** @type {import('./shams')} */
	/* eslint complexity: [2, 18], max-statements: [2, 33] */
	shams = function hasSymbols() {
		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
		if (typeof Symbol.iterator === 'symbol') { return true; }

		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol('test');
		var symObj = Object(sym);
		if (typeof sym === 'string') { return false; }

		if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
		if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

		// temp disabled per https://github.com/ljharb/object.assign/issues/17
		// if (sym instanceof Symbol) { return false; }
		// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
		// if (!(symObj instanceof Symbol)) { return false; }

		// if (typeof Symbol.prototype.toString !== 'function') { return false; }
		// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) { return false; }

		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

		if (typeof Object.getOwnPropertyDescriptor === 'function') {
			// eslint-disable-next-line no-extra-parens
			var descriptor = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(obj, sym));
			if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
		}

		return true;
	};
	return shams;
}

var hasSymbols;
var hasRequiredHasSymbols;

function requireHasSymbols () {
	if (hasRequiredHasSymbols) return hasSymbols;
	hasRequiredHasSymbols = 1;

	var origSymbol = typeof Symbol !== 'undefined' && Symbol;
	var hasSymbolSham = requireShams();

	/** @type {import('.')} */
	hasSymbols = function hasNativeSymbols() {
		if (typeof origSymbol !== 'function') { return false; }
		if (typeof Symbol !== 'function') { return false; }
		if (typeof origSymbol('foo') !== 'symbol') { return false; }
		if (typeof Symbol('bar') !== 'symbol') { return false; }

		return hasSymbolSham();
	};
	return hasSymbols;
}

var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;

function requireReflect_getPrototypeOf () {
	if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
	hasRequiredReflect_getPrototypeOf = 1;

	/** @type {import('./Reflect.getPrototypeOf')} */
	Reflect_getPrototypeOf = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;
	return Reflect_getPrototypeOf;
}

var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;

function requireObject_getPrototypeOf () {
	if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
	hasRequiredObject_getPrototypeOf = 1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	/** @type {import('./Object.getPrototypeOf')} */
	Object_getPrototypeOf = $Object.getPrototypeOf || null;
	return Object_getPrototypeOf;
}

var implementation;
var hasRequiredImplementation;

function requireImplementation () {
	if (hasRequiredImplementation) return implementation;
	hasRequiredImplementation = 1;

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = '[object Function]';

	var concatty = function concatty(a, b) {
	    var arr = [];

	    for (var i = 0; i < a.length; i += 1) {
	        arr[i] = a[i];
	    }
	    for (var j = 0; j < b.length; j += 1) {
	        arr[j + a.length] = b[j];
	    }

	    return arr;
	};

	var slicy = function slicy(arrLike, offset) {
	    var arr = [];
	    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
	        arr[j] = arrLike[i];
	    }
	    return arr;
	};

	var joiny = function (arr, joiner) {
	    var str = '';
	    for (var i = 0; i < arr.length; i += 1) {
	        str += arr[i];
	        if (i + 1 < arr.length) {
	            str += joiner;
	        }
	    }
	    return str;
	};

	implementation = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slicy(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                concatty(args, arguments)
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        }
	        return target.apply(
	            that,
	            concatty(args, arguments)
	        );

	    };

	    var boundLength = max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs[i] = '$' + i;
	    }

	    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};
	return implementation;
}

var functionBind;
var hasRequiredFunctionBind;

function requireFunctionBind () {
	if (hasRequiredFunctionBind) return functionBind;
	hasRequiredFunctionBind = 1;

	var implementation = requireImplementation();

	functionBind = Function.prototype.bind || implementation;
	return functionBind;
}

var functionCall;
var hasRequiredFunctionCall;

function requireFunctionCall () {
	if (hasRequiredFunctionCall) return functionCall;
	hasRequiredFunctionCall = 1;

	/** @type {import('./functionCall')} */
	functionCall = Function.prototype.call;
	return functionCall;
}

var functionApply;
var hasRequiredFunctionApply;

function requireFunctionApply () {
	if (hasRequiredFunctionApply) return functionApply;
	hasRequiredFunctionApply = 1;

	/** @type {import('./functionApply')} */
	functionApply = Function.prototype.apply;
	return functionApply;
}

var reflectApply;
var hasRequiredReflectApply;

function requireReflectApply () {
	if (hasRequiredReflectApply) return reflectApply;
	hasRequiredReflectApply = 1;

	/** @type {import('./reflectApply')} */
	reflectApply = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
	return reflectApply;
}

var actualApply;
var hasRequiredActualApply;

function requireActualApply () {
	if (hasRequiredActualApply) return actualApply;
	hasRequiredActualApply = 1;

	var bind = requireFunctionBind();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();
	var $reflectApply = requireReflectApply();

	/** @type {import('./actualApply')} */
	actualApply = $reflectApply || bind.call($call, $apply);
	return actualApply;
}

var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;

function requireCallBindApplyHelpers () {
	if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
	hasRequiredCallBindApplyHelpers = 1;

	var bind = requireFunctionBind();
	var $TypeError = /*@__PURE__*/ requireType();

	var $call = requireFunctionCall();
	var $actualApply = requireActualApply();

	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	callBindApplyHelpers = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== 'function') {
			throw new $TypeError('a function is required');
		}
		return $actualApply(bind, $call, args);
	};
	return callBindApplyHelpers;
}

var get;
var hasRequiredGet;

function requireGet () {
	if (hasRequiredGet) return get;
	hasRequiredGet = 1;

	var callBind = requireCallBindApplyHelpers();
	var gOPD = /*@__PURE__*/ requireGopd();

	var hasProtoAccessor;
	try {
		// eslint-disable-next-line no-extra-parens, no-proto
		hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
			throw e;
		}
	}

	// eslint-disable-next-line no-extra-parens
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));

	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;

	/** @type {import('./get')} */
	get = desc && typeof desc.get === 'function'
		? callBind([desc.get])
		: typeof $getPrototypeOf === 'function'
			? /** @type {import('./get')} */ function getDunder(value) {
				// eslint-disable-next-line eqeqeq
				return $getPrototypeOf(value == null ? value : $Object(value));
			}
			: false;
	return get;
}

var getProto;
var hasRequiredGetProto;

function requireGetProto () {
	if (hasRequiredGetProto) return getProto;
	hasRequiredGetProto = 1;

	var reflectGetProto = requireReflect_getPrototypeOf();
	var originalGetProto = requireObject_getPrototypeOf();

	var getDunderProto = /*@__PURE__*/ requireGet();

	/** @type {import('.')} */
	getProto = reflectGetProto
		? function getProto(O) {
			// @ts-expect-error TS can't narrow inside a closure, for some reason
			return reflectGetProto(O);
		}
		: originalGetProto
			? function getProto(O) {
				if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
					throw new TypeError('getProto: not an object');
				}
				// @ts-expect-error TS can't narrow inside a closure, for some reason
				return originalGetProto(O);
			}
			: getDunderProto
				? function getProto(O) {
					// @ts-expect-error TS can't narrow inside a closure, for some reason
					return getDunderProto(O);
				}
				: null;
	return getProto;
}

var asyncFunction;
var hasRequiredAsyncFunction;

function requireAsyncFunction () {
	if (hasRequiredAsyncFunction) return asyncFunction;
	hasRequiredAsyncFunction = 1;

	// eslint-disable-next-line no-extra-parens, no-empty-function
	const cached = /** @type {import('.').AsyncFunctionConstructor} */ (async function () {}.constructor);

	/** @type {import('.')} */
	asyncFunction = () => cached;
	return asyncFunction;
}

var generatorFunction;
var hasRequiredGeneratorFunction;

function requireGeneratorFunction () {
	if (hasRequiredGeneratorFunction) return generatorFunction;
	hasRequiredGeneratorFunction = 1;

	// eslint-disable-next-line no-extra-parens, no-empty-function
	const cached = /** @type {GeneratorFunctionConstructor} */ (function* () {}.constructor);

	/** @type {import('.')} */
	generatorFunction = () => cached;
	return generatorFunction;
}

var asyncGeneratorFunction;
var hasRequiredAsyncGeneratorFunction;

function requireAsyncGeneratorFunction () {
	if (hasRequiredAsyncGeneratorFunction) return asyncGeneratorFunction;
	hasRequiredAsyncGeneratorFunction = 1;

	// eslint-disable-next-line no-extra-parens, no-empty-function
	const cached = /** @type {import('.').AsyncGeneratorFunctionConstructor} */ (async function* () {}.constructor);

	/** @type {import('.')} */
	asyncGeneratorFunction = () => cached;
	return asyncGeneratorFunction;
}

var hasown;
var hasRequiredHasown;

function requireHasown () {
	if (hasRequiredHasown) return hasown;
	hasRequiredHasown = 1;

	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	var bind = requireFunctionBind();

	/** @type {import('.')} */
	hasown = bind.call(call, $hasOwn);
	return hasown;
}

var getIntrinsic;
var hasRequiredGetIntrinsic;

function requireGetIntrinsic () {
	if (hasRequiredGetIntrinsic) return getIntrinsic;
	hasRequiredGetIntrinsic = 1;

	var undefined$1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	var $Error = /*@__PURE__*/ requireEsErrors();
	var $EvalError = /*@__PURE__*/ require_eval();
	var $RangeError = /*@__PURE__*/ requireRange();
	var $ReferenceError = /*@__PURE__*/ requireRef();
	var $SyntaxError = /*@__PURE__*/ requireSyntax();
	var $TypeError = /*@__PURE__*/ requireType();
	var $URIError = /*@__PURE__*/ requireUri();

	var abs = /*@__PURE__*/ requireAbs();
	var floor = /*@__PURE__*/ requireFloor();
	var max = /*@__PURE__*/ requireMax();
	var min = /*@__PURE__*/ requireMin();
	var pow = /*@__PURE__*/ requirePow();
	var round = /*@__PURE__*/ requireRound();
	var sign = /*@__PURE__*/ requireSign();

	var $gOPD = /*@__PURE__*/ requireGopd();
	var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var throwTypeError = function () {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD
		? (function () {
			try {
				// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
				arguments.callee; // IE 8 does not throw here
				return throwTypeError;
			} catch (calleeThrows) {
				try {
					// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
					return $gOPD(arguments, 'callee').get;
				} catch (gOPDthrows) {
					return throwTypeError;
				}
			}
		}())
		: throwTypeError;

	var hasSymbols = requireHasSymbols()();

	var getProto = requireGetProto();
	var $ObjectGPO = requireObject_getPrototypeOf();
	var $ReflectGPO = requireReflect_getPrototypeOf();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();

	var needsEval = {};

	var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined$1 : getProto(Uint8Array);

	var INTRINSICS = {
		__proto__: null,
		'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
		'%Array%': Array,
		'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
		'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
		'%AsyncFromSyncIteratorPrototype%': undefined$1,
		'%AsyncFunction%': needsEval,
		'%AsyncGenerator%': needsEval,
		'%AsyncGeneratorFunction%': needsEval,
		'%AsyncIteratorPrototype%': needsEval,
		'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
		'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
		'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined$1 : BigInt64Array,
		'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined$1 : BigUint64Array,
		'%Boolean%': Boolean,
		'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
		'%Date%': Date,
		'%decodeURI%': decodeURI,
		'%decodeURIComponent%': decodeURIComponent,
		'%encodeURI%': encodeURI,
		'%encodeURIComponent%': encodeURIComponent,
		'%Error%': $Error,
		'%eval%': eval, // eslint-disable-line no-eval
		'%EvalError%': $EvalError,
		'%Float16Array%': typeof Float16Array === 'undefined' ? undefined$1 : Float16Array,
		'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
		'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
		'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
		'%Function%': Function,
		'%GeneratorFunction%': needsEval,
		'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
		'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
		'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
		'%isFinite%': isFinite,
		'%isNaN%': isNaN,
		'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
		'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
		'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
		'%Math%': Math,
		'%Number%': Number,
		'%Object%': $Object,
		'%Object.getOwnPropertyDescriptor%': $gOPD,
		'%parseFloat%': parseFloat,
		'%parseInt%': parseInt,
		'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
		'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
		'%RangeError%': $RangeError,
		'%ReferenceError%': $ReferenceError,
		'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'%RegExp%': RegExp,
		'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'%String%': String,
		'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined$1,
		'%Symbol%': hasSymbols ? Symbol : undefined$1,
		'%SyntaxError%': $SyntaxError,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError,
		'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'%URIError%': $URIError,
		'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
		'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
		'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet,

		'%Function.prototype.call%': $call,
		'%Function.prototype.apply%': $apply,
		'%Object.defineProperty%': $defineProperty,
		'%Object.getPrototypeOf%': $ObjectGPO,
		'%Math.abs%': abs,
		'%Math.floor%': floor,
		'%Math.max%': max,
		'%Math.min%': min,
		'%Math.pow%': pow,
		'%Math.round%': round,
		'%Math.sign%': sign,
		'%Reflect.getPrototypeOf%': $ReflectGPO
	};

	if (getProto) {
		try {
			null.error; // eslint-disable-line no-unused-expressions
		} catch (e) {
			// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
			var errorProto = getProto(getProto(e));
			INTRINSICS['%Error.prototype%'] = errorProto;
		}
	}

	var getAsyncFunction = requireAsyncFunction();
	var getGeneratorFunction = /*@__PURE__*/ requireGeneratorFunction();
	var getAsyncGeneratorFunction = requireAsyncGeneratorFunction();

	var doEval = function doEval(name) {
		var value;
		if (name === '%AsyncFunction%') {
			value = getAsyncFunction() || void undefined$1;
		} else if (name === '%GeneratorFunction%') {
			value = getGeneratorFunction() || void undefined$1;
		} else if (name === '%AsyncGeneratorFunction%') {
			value = getAsyncGeneratorFunction() || void undefined$1;
		} else if (name === '%AsyncGenerator%') {
			var fn = doEval('%AsyncGeneratorFunction%');
			if (fn) {
				value = fn.prototype;
			}
		} else if (name === '%AsyncIteratorPrototype%') {
			var gen = doEval('%AsyncGenerator%');
			if (gen && getProto) {
				value = getProto(gen.prototype);
			}
		}

		INTRINSICS[name] = value;

		return value;
	};

	var LEGACY_ALIASES = {
		__proto__: null,
		'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
		'%ArrayPrototype%': ['Array', 'prototype'],
		'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
		'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
		'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
		'%ArrayProto_values%': ['Array', 'prototype', 'values'],
		'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
		'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
		'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
		'%BooleanPrototype%': ['Boolean', 'prototype'],
		'%DataViewPrototype%': ['DataView', 'prototype'],
		'%DatePrototype%': ['Date', 'prototype'],
		'%ErrorPrototype%': ['Error', 'prototype'],
		'%EvalErrorPrototype%': ['EvalError', 'prototype'],
		'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
		'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
		'%FunctionPrototype%': ['Function', 'prototype'],
		'%Generator%': ['GeneratorFunction', 'prototype'],
		'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
		'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
		'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
		'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
		'%JSONParse%': ['JSON', 'parse'],
		'%JSONStringify%': ['JSON', 'stringify'],
		'%MapPrototype%': ['Map', 'prototype'],
		'%NumberPrototype%': ['Number', 'prototype'],
		'%ObjectPrototype%': ['Object', 'prototype'],
		'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
		'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
		'%PromisePrototype%': ['Promise', 'prototype'],
		'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
		'%Promise_all%': ['Promise', 'all'],
		'%Promise_reject%': ['Promise', 'reject'],
		'%Promise_resolve%': ['Promise', 'resolve'],
		'%RangeErrorPrototype%': ['RangeError', 'prototype'],
		'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
		'%RegExpPrototype%': ['RegExp', 'prototype'],
		'%SetPrototype%': ['Set', 'prototype'],
		'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
		'%StringPrototype%': ['String', 'prototype'],
		'%SymbolPrototype%': ['Symbol', 'prototype'],
		'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
		'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
		'%TypeErrorPrototype%': ['TypeError', 'prototype'],
		'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
		'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
		'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
		'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
		'%URIErrorPrototype%': ['URIError', 'prototype'],
		'%WeakMapPrototype%': ['WeakMap', 'prototype'],
		'%WeakSetPrototype%': ['WeakSet', 'prototype']
	};

	var bind = requireFunctionBind();
	var hasOwn = /*@__PURE__*/ requireHasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);

	/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === '%' && last !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
		}
		var result = [];
		$replace(string, rePropName, function (match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
		});
		return result;
	};
	/* end adaptation */

	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
	};

	getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
		}
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

		var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;

		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}

		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if (
				(
					(first === '"' || first === "'" || first === '`')
					|| (last === '"' || last === "'" || last === '`')
				)
				&& first !== last
			) {
				throw new $SyntaxError('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn(INTRINSICS, intrinsicRealName)) {
				value = INTRINSICS[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
					}
					return void undefined$1;
				}
				if ($gOPD && (i + 1) >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;

					// By convention, when a data property is converted to an accessor
					// property to emulate a data property that does not suffer from
					// the override mistake, that accessor's getter is marked with
					// an `originalValue` property. Here, when we detect this, we
					// uphold the illusion by pretending to see that original data
					// property, i.e., returning the value rather than the getter
					// itself.
					if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
						value = desc.get;
					} else {
						value = value[part];
					}
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}

				if (isOwn && !skipFurtherCaching) {
					INTRINSICS[intrinsicRealName] = value;
				}
			}
		}
		return value;
	};
	return getIntrinsic;
}

var callBound;
var hasRequiredCallBound;

function requireCallBound () {
	if (hasRequiredCallBound) return callBound;
	hasRequiredCallBound = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();

	var callBindBasic = requireCallBindApplyHelpers();

	/** @type {(thisArg: string, searchString: string, position?: number) => number} */
	var $indexOf = callBindBasic([GetIntrinsic('%String.prototype.indexOf%')]);

	/** @type {import('.')} */
	callBound = function callBoundIntrinsic(name, allowMissing) {
		/* eslint no-extra-parens: 0 */

		var intrinsic = /** @type {(this: unknown, ...args: unknown[]) => unknown} */ (GetIntrinsic(name, !!allowMissing));
		if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
			return callBindBasic(/** @type {const} */ ([intrinsic]));
		}
		return intrinsic;
	};
	return callBound;
}

var sideChannelMap;
var hasRequiredSideChannelMap;

function requireSideChannelMap () {
	if (hasRequiredSideChannelMap) return sideChannelMap;
	hasRequiredSideChannelMap = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();
	var callBound = /*@__PURE__*/ requireCallBound();
	var inspect = /*@__PURE__*/ requireObjectInspect();

	var $TypeError = /*@__PURE__*/ requireType();
	var $Map = GetIntrinsic('%Map%', true);

	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
	var $mapGet = callBound('Map.prototype.get', true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
	var $mapSet = callBound('Map.prototype.set', true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapHas = callBound('Map.prototype.has', true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapDelete = callBound('Map.prototype.delete', true);
	/** @type {<K, V>(thisArg: Map<K, V>) => number} */
	var $mapSize = callBound('Map.prototype.size', true);

	/** @type {import('.')} */
	sideChannelMap = !!$Map && /** @type {Exclude<import('.'), false>} */ function getSideChannelMap() {
		/** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */

		/** @type {Map<K, V> | undefined} */ var $m;

		/** @type {Channel} */
		var channel = {
			assert: function (key) {
				if (!channel.has(key)) {
					throw new $TypeError('Side channel does not contain ' + inspect(key));
				}
			},
			'delete': function (key) {
				if ($m) {
					var result = $mapDelete($m, key);
					if ($mapSize($m) === 0) {
						$m = void undefined;
					}
					return result;
				}
				return false;
			},
			get: function (key) { // eslint-disable-line consistent-return
				if ($m) {
					return $mapGet($m, key);
				}
			},
			has: function (key) {
				if ($m) {
					return $mapHas($m, key);
				}
				return false;
			},
			set: function (key, value) {
				if (!$m) {
					// @ts-expect-error TS can't handle narrowing a variable inside a closure
					$m = new $Map();
				}
				$mapSet($m, key, value);
			}
		};

		// @ts-expect-error TODO: figure out why TS is erroring here
		return channel;
	};
	return sideChannelMap;
}

var sideChannelWeakmap;
var hasRequiredSideChannelWeakmap;

function requireSideChannelWeakmap () {
	if (hasRequiredSideChannelWeakmap) return sideChannelWeakmap;
	hasRequiredSideChannelWeakmap = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();
	var callBound = /*@__PURE__*/ requireCallBound();
	var inspect = /*@__PURE__*/ requireObjectInspect();
	var getSideChannelMap = requireSideChannelMap();

	var $TypeError = /*@__PURE__*/ requireType();
	var $WeakMap = GetIntrinsic('%WeakMap%', true);

	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
	var $weakMapGet = callBound('WeakMap.prototype.get', true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
	var $weakMapSet = callBound('WeakMap.prototype.set', true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapHas = callBound('WeakMap.prototype.has', true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapDelete = callBound('WeakMap.prototype.delete', true);

	/** @type {import('.')} */
	sideChannelWeakmap = $WeakMap
		? /** @type {Exclude<import('.'), false>} */ function getSideChannelWeakMap() {
			/** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
			/** @typedef {Parameters<Channel['get']>[0]} K */
			/** @typedef {Parameters<Channel['set']>[1]} V */

			/** @type {WeakMap<K & object, V> | undefined} */ var $wm;
			/** @type {Channel | undefined} */ var $m;

			/** @type {Channel} */
			var channel = {
				assert: function (key) {
					if (!channel.has(key)) {
						throw new $TypeError('Side channel does not contain ' + inspect(key));
					}
				},
				'delete': function (key) {
					if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
						if ($wm) {
							return $weakMapDelete($wm, key);
						}
					} else if (getSideChannelMap) {
						if ($m) {
							return $m['delete'](key);
						}
					}
					return false;
				},
				get: function (key) {
					if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
						if ($wm) {
							return $weakMapGet($wm, key);
						}
					}
					return $m && $m.get(key);
				},
				has: function (key) {
					if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
						if ($wm) {
							return $weakMapHas($wm, key);
						}
					}
					return !!$m && $m.has(key);
				},
				set: function (key, value) {
					if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
						if (!$wm) {
							$wm = new $WeakMap();
						}
						$weakMapSet($wm, key, value);
					} else if (getSideChannelMap) {
						if (!$m) {
							$m = getSideChannelMap();
						}
						// eslint-disable-next-line no-extra-parens
						/** @type {NonNullable<typeof $m>} */ ($m).set(key, value);
					}
				}
			};

			// @ts-expect-error TODO: figure out why this is erroring
			return channel;
		}
		: getSideChannelMap;
	return sideChannelWeakmap;
}

var sideChannel;
var hasRequiredSideChannel;

function requireSideChannel () {
	if (hasRequiredSideChannel) return sideChannel;
	hasRequiredSideChannel = 1;

	var $TypeError = /*@__PURE__*/ requireType();
	var inspect = /*@__PURE__*/ requireObjectInspect();
	var getSideChannelList = requireSideChannelList();
	var getSideChannelMap = requireSideChannelMap();
	var getSideChannelWeakMap = requireSideChannelWeakmap();

	var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;

	/** @type {import('.')} */
	sideChannel = function getSideChannel() {
		/** @typedef {ReturnType<typeof getSideChannel>} Channel */

		/** @type {Channel | undefined} */ var $channelData;

		/** @type {Channel} */
		var channel = {
			assert: function (key) {
				if (!channel.has(key)) {
					var keyDesc = key && Object(key) === key
						? 'the given object key'
						: inspect(key);
					throw new $TypeError('Side channel does not contain ' + keyDesc);
				}
			},
			'delete': function (key) {
				return !!$channelData && $channelData['delete'](key);
			},
			get: function (key) {
				return $channelData && $channelData.get(key);
			},
			has: function (key) {
				return !!$channelData && $channelData.has(key);
			},
			set: function (key, value) {
				if (!$channelData) {
					$channelData = makeChannel();
				}

				$channelData.set(key, value);
			}
		};

		return channel;
	};
	return sideChannel;
}

var formats;
var hasRequiredFormats;

function requireFormats () {
	if (hasRequiredFormats) return formats;
	hasRequiredFormats = 1;

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	var Format = {
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};

	formats = {
	    'default': Format.RFC3986,
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return String(value);
	        }
	    },
	    RFC1738: Format.RFC1738,
	    RFC3986: Format.RFC3986
	};
	return formats;
}

var utils$1;
var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$1;
	hasRequiredUtils$1 = 1;

	var formats = /*@__PURE__*/ requireFormats();
	var getSideChannel = requireSideChannel();
	var defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;

	// Track objects created from arrayLimit overflow using side-channel
	// Stores the current max numeric index for O(1) lookup
	var overflowChannel = getSideChannel();

	var markOverflow = function markOverflow(obj, maxIndex) {
	    overflowChannel.set(obj, maxIndex);
	    return obj;
	};

	var isOverflow = function isOverflow(obj) {
	    return overflowChannel.has(obj);
	};

	var getMaxIndex = function getMaxIndex(obj) {
	    return overflowChannel.get(obj);
	};

	var setMaxIndex = function setMaxIndex(obj, maxIndex) {
	    overflowChannel.set(obj, maxIndex);
	};

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array[array.length] = '%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase();
	    }

	    return array;
	}());

	var compactQueue = function compactQueue(queue) {
	    while (queue.length > 1) {
	        var item = queue.pop();
	        var obj = item.obj[item.prop];

	        if (isArray(obj)) {
	            var compacted = [];

	            for (var j = 0; j < obj.length; ++j) {
	                if (typeof obj[j] !== 'undefined') {
	                    compacted[compacted.length] = obj[j];
	                }
	            }

	            item.obj[item.prop] = compacted;
	        }
	    }
	};

	var arrayToObject = function arrayToObject(source, options) {
	    var obj = options && options.plainObjects ? { __proto__: null } : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	var setProperty = function setProperty(obj, key, value) {
	    if (key === '__proto__' && defineProperty) {
	        defineProperty(obj, key, {
	            configurable: true,
	            enumerable: true,
	            value: value,
	            writable: true
	        });
	    } else {
	        obj[key] = value;
	    }
	};

	var merge = function merge(target, source, options) {
	    /* eslint no-param-reassign: 0 */
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object' && typeof source !== 'function') {
	        if (isArray(target)) {
	            var nextIndex = target.length;
	            if (options && typeof options.arrayLimit === 'number' && nextIndex >= options.arrayLimit) {
	                if (options.throwOnLimitExceeded) {
	                    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	                }
	                return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
	            }
	            target[nextIndex] = source;
	        } else if (target && typeof target === 'object') {
	            if (isOverflow(target)) {
	                // Add at next numeric index for overflow objects
	                var newIndex = getMaxIndex(target) + 1;
	                target[newIndex] = source;
	                setMaxIndex(target, newIndex);
	            } else if (options && options.strictMerge) {
	                return [target, source];
	            } else if (
	                (options && (options.plainObjects || options.allowPrototypes))
	                || !has.call(Object.prototype, source)
	            ) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (!target || typeof target !== 'object') {
	        if (isOverflow(source)) {
	            // Create new object with target at 0, source values shifted by 1
	            var sourceKeys = Object.keys(source);
	            var result = options && options.plainObjects
	                ? { __proto__: null, 0: target }
	                : { 0: target };
	            for (var m = 0; m < sourceKeys.length; m++) {
	                var oldKey = parseInt(sourceKeys[m], 10);
	                result[oldKey + 1] = source[sourceKeys[m]];
	            }
	            return markOverflow(result, getMaxIndex(source) + 1);
	        }
	        var combined = [target].concat(source);
	        if (options && typeof options.arrayLimit === 'number' && combined.length > options.arrayLimit) {
	            if (options.throwOnLimitExceeded) {
	                throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	            }
	            return markOverflow(arrayToObject(combined, options), combined.length - 1);
	        }
	        return combined;
	    }

	    var mergeTarget = target;
	    if (isArray(target) && !isArray(source)) {
	        mergeTarget = arrayToObject(target, options);
	    }

	    if (isArray(target) && isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                var targetItem = target[i];
	                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
	                    target[i] = merge(targetItem, item, options);
	                } else {
	                    target[target.length] = item;
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        if (options && typeof options.arrayLimit === 'number' && target.length > options.arrayLimit) {
	            if (options.throwOnLimitExceeded) {
	                throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	            }
	            return markOverflow(arrayToObject(target, options), target.length - 1);
	        }
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (has.call(acc, key)) {
	            setProperty(acc, key, merge(acc[key], value, options));
	        } else {
	            setProperty(acc, key, value);
	        }

	        if (isOverflow(source) && !isOverflow(acc)) {
	            markOverflow(acc, getMaxIndex(source));
	        }
	        if (isOverflow(acc)) {
	            var keyNum = parseInt(key, 10);
	            if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
	                setMaxIndex(acc, keyNum);
	            }
	        }

	        return acc;
	    }, mergeTarget);
	};

	var assign = function assignSingleSource(target, source) {
	    return Object.keys(source).reduce(function (acc, key) {
	        setProperty(acc, key, source[key]);
	        return acc;
	    }, target);
	};

	var decode = function (str, defaultDecoder, charset) {
	    var strWithoutPlus = str.replace(/\+/g, ' ');
	    if (charset === 'iso-8859-1') {
	        // unescape never throws, no try...catch needed:
	        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
	    }
	    // utf-8
	    try {
	        return decodeURIComponent(strWithoutPlus);
	    } catch (e) {
	        return strWithoutPlus;
	    }
	};

	var limit = 1024;

	/* eslint operator-linebreak: [2, "before"] */

	var encode = function encode(str, defaultEncoder, charset, kind, format) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = str;
	    if (typeof str === 'symbol') {
	        string = Symbol.prototype.toString.call(str);
	    } else if (typeof str !== 'string') {
	        string = String(str);
	    }

	    if (charset === 'iso-8859-1') {
	        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
	            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
	        });
	    }

	    var out = '';
	    for (var j = 0; j < string.length; j += limit) {
	        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
	        if (j + limit < string.length) {
	            var last = segment.charCodeAt(segment.length - 1);
	            if (last >= 0xD800 && last <= 0xDBFF) {
	                segment = segment.slice(0, -1);
	                j -= 1;
	            }
	        }
	        var arr = [];

	        for (var i = 0; i < segment.length; ++i) {
	            var c = segment.charCodeAt(i);
	            if (
	                c === 0x2D // -
	                || c === 0x2E // .
	                || c === 0x5F // _
	                || c === 0x7E // ~
	                || (c >= 0x30 && c <= 0x39) // 0-9
	                || (c >= 0x41 && c <= 0x5A) // a-z
	                || (c >= 0x61 && c <= 0x7A) // A-Z
	                || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
	            ) {
	                arr[arr.length] = segment.charAt(i);
	                continue;
	            }

	            if (c < 0x80) {
	                arr[arr.length] = hexTable[c];
	                continue;
	            }

	            if (c < 0x800) {
	                arr[arr.length] = hexTable[0xC0 | (c >> 6)]
	                    + hexTable[0x80 | (c & 0x3F)];
	                continue;
	            }

	            if (c < 0xD800 || c >= 0xE000) {
	                arr[arr.length] = hexTable[0xE0 | (c >> 12)]
	                    + hexTable[0x80 | ((c >> 6) & 0x3F)]
	                    + hexTable[0x80 | (c & 0x3F)];
	                continue;
	            }

	            i += 1;
	            c = 0x10000 + (((c & 0x3FF) << 10) | (segment.charCodeAt(i) & 0x3FF));

	            arr[arr.length] = hexTable[0xF0 | (c >> 18)]
	                + hexTable[0x80 | ((c >> 12) & 0x3F)]
	                + hexTable[0x80 | ((c >> 6) & 0x3F)]
	                + hexTable[0x80 | (c & 0x3F)];
	        }

	        out += arr.join('');
	    }

	    return out;
	};

	var compact = function compact(value) {
	    var queue = [{ obj: { o: value }, prop: 'o' }];
	    var refs = getSideChannel();

	    for (var i = 0; i < queue.length; ++i) {
	        var item = queue[i];
	        var obj = item.obj[item.prop];

	        var keys = Object.keys(obj);
	        for (var j = 0; j < keys.length; ++j) {
	            var key = keys[j];
	            var val = obj[key];
	            if (typeof val === 'object' && val !== null && !refs.has(val)) {
	                queue[queue.length] = { obj: obj, prop: key };
	                refs.set(val, true);
	            }
	        }
	    }

	    compactQueue(queue);

	    return value;
	};

	var isRegExp = function isRegExp(obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var isBuffer = function isBuffer(obj) {
	    if (!obj || typeof obj !== 'object') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};

	var combine = function combine(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
	    // If 'a' is already an overflow object, add to it
	    if (isOverflow(a)) {
	        if (throwOnLimitExceeded) {
	            throw new RangeError('Array limit exceeded. Only ' + arrayLimit + ' element' + (arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	        }
	        var newIndex = getMaxIndex(a) + 1;
	        a[newIndex] = b;
	        setMaxIndex(a, newIndex);
	        return a;
	    }

	    var result = [].concat(a, b);
	    if (result.length > arrayLimit) {
	        if (throwOnLimitExceeded) {
	            throw new RangeError('Array limit exceeded. Only ' + arrayLimit + ' element' + (arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	        }
	        return markOverflow(arrayToObject(result, { plainObjects: plainObjects }), result.length - 1);
	    }
	    return result;
	};

	var maybeMap = function maybeMap(val, fn) {
	    if (isArray(val)) {
	        var mapped = [];
	        for (var i = 0; i < val.length; i += 1) {
	            mapped[mapped.length] = fn(val[i]);
	        }
	        return mapped;
	    }
	    return fn(val);
	};

	utils$1 = {
	    arrayToObject: arrayToObject,
	    assign: assign,
	    combine: combine,
	    compact: compact,
	    decode: decode,
	    encode: encode,
	    isBuffer: isBuffer,
	    isOverflow: isOverflow,
	    isRegExp: isRegExp,
	    markOverflow: markOverflow,
	    maybeMap: maybeMap,
	    merge: merge
	};
	return utils$1;
}

var stringify_1;
var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify_1;
	hasRequiredStringify = 1;

	var getSideChannel = requireSideChannel();
	var utils = /*@__PURE__*/ requireUtils$1();
	var formats = /*@__PURE__*/ requireFormats();
	var has = Object.prototype.hasOwnProperty;

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) {
	        return prefix + '[]';
	    },
	    comma: 'comma',
	    indices: function indices(prefix, key) {
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) {
	        return prefix;
	    }
	};

	var isArray = Array.isArray;
	var push = Array.prototype.push;
	var pushToArray = function (arr, valueOrArray) {
	    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
	};

	var toISO = Date.prototype.toISOString;

	var defaultFormat = formats['default'];
	var defaults = {
	    addQueryPrefix: false,
	    allowDots: false,
	    allowEmptyArrays: false,
	    arrayFormat: 'indices',
	    charset: 'utf-8',
	    charsetSentinel: false,
	    commaRoundTrip: false,
	    delimiter: '&',
	    encode: true,
	    encodeDotInKeys: false,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    filter: void undefined,
	    format: defaultFormat,
	    formatter: formats.formatters[defaultFormat],
	    // deprecated
	    indices: false,
	    serializeDate: function serializeDate(date) {
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
	    return typeof v === 'string'
	        || typeof v === 'number'
	        || typeof v === 'boolean'
	        || typeof v === 'symbol'
	        || typeof v === 'bigint';
	};

	var sentinel = {};

	var stringify = function stringify(
	    object,
	    prefix,
	    generateArrayPrefix,
	    commaRoundTrip,
	    allowEmptyArrays,
	    strictNullHandling,
	    skipNulls,
	    encodeDotInKeys,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    format,
	    formatter,
	    encodeValuesOnly,
	    charset,
	    sideChannel
	) {
	    var obj = object;

	    var tmpSc = sideChannel;
	    var step = 0;
	    var findFlag = false;
	    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
	        // Where object last appeared in the ref tree
	        var pos = tmpSc.get(object);
	        step += 1;
	        if (typeof pos !== 'undefined') {
	            if (pos === step) {
	                throw new RangeError('Cyclic object value');
	            } else {
	                findFlag = true; // Break while
	            }
	        }
	        if (typeof tmpSc.get(sentinel) === 'undefined') {
	            step = 0;
	        }
	    }

	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
	        obj = utils.maybeMap(obj, function (value) {
	            if (value instanceof Date) {
	                return serializeDate(value);
	            }
	            return value;
	        });
	    }

	    if (obj === null) {
	        if (strictNullHandling) {
	            return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix);
	        }

	        obj = '';
	    }

	    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (generateArrayPrefix === 'comma' && isArray(obj)) {
	        // we need to join elements in
	        if (encodeValuesOnly && encoder) {
	            obj = utils.maybeMap(obj, function (v) {
	                return v == null ? v : encoder(v);
	            });
	        }
	        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
	    } else if (isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, '%2E') : String(prefix);

	    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;

	    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
	        return adjustedPrefix + '[]';
	    }

	    for (var j = 0; j < objKeys.length; ++j) {
	        var key = objKeys[j];
	        var value = typeof key === 'object' && key && typeof key.value !== 'undefined'
	            ? key.value
	            : obj[key];

	        if (skipNulls && value === null) {
	            continue;
	        }

	        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, '%2E') : String(key);
	        var keyPrefix = isArray(obj)
	            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix
	            : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');

	        sideChannel.set(object, step);
	        var valueSideChannel = getSideChannel();
	        valueSideChannel.set(sentinel, sideChannel);
	        pushToArray(values, stringify(
	            value,
	            keyPrefix,
	            generateArrayPrefix,
	            commaRoundTrip,
	            allowEmptyArrays,
	            strictNullHandling,
	            skipNulls,
	            encodeDotInKeys,
	            generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            format,
	            formatter,
	            encodeValuesOnly,
	            charset,
	            valueSideChannel
	        ));
	    }

	    return values;
	};

	var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
	    if (!opts) {
	        return defaults;
	    }

	    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
	        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
	    }

	    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
	        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
	    }

	    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var charset = opts.charset || defaults.charset;
	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }

	    var format = formats['default'];
	    if (typeof opts.format !== 'undefined') {
	        if (!has.call(formats.formatters, opts.format)) {
	            throw new TypeError('Unknown format option provided.');
	        }
	        format = opts.format;
	    }
	    var formatter = formats.formatters[format];

	    var filter = defaults.filter;
	    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
	        filter = opts.filter;
	    }

	    var arrayFormat;
	    if (opts.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = opts.arrayFormat;
	    } else if ('indices' in opts) {
	        arrayFormat = opts.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = defaults.arrayFormat;
	    }

	    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
	        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
	    }

	    var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

	    return {
	        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
	        allowDots: allowDots,
	        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
	        arrayFormat: arrayFormat,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
	        commaRoundTrip: !!opts.commaRoundTrip,
	        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
	        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
	        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
	        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
	        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
	        filter: filter,
	        format: format,
	        formatter: formatter,
	        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
	        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
	        sort: typeof opts.sort === 'function' ? opts.sort : null,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
	    };
	};

	stringify_1 = function (object, opts) {
	    var obj = object;
	    var options = normalizeStringifyOptions(opts);

	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
	    var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (options.sort) {
	        objKeys.sort(options.sort);
	    }

	    var sideChannel = getSideChannel();
	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (typeof key === 'undefined' || key === null) {
	            continue;
	        }

	        var value = obj[key];

	        if (options.skipNulls && value === null) {
	            continue;
	        }
	        pushToArray(keys, stringify(
	            value,
	            key,
	            generateArrayPrefix,
	            commaRoundTrip,
	            options.allowEmptyArrays,
	            options.strictNullHandling,
	            options.skipNulls,
	            options.encodeDotInKeys,
	            options.encode ? options.encoder : null,
	            options.filter,
	            options.sort,
	            options.allowDots,
	            options.serializeDate,
	            options.format,
	            options.formatter,
	            options.encodeValuesOnly,
	            options.charset,
	            sideChannel
	        ));
	    }

	    var joined = keys.join(options.delimiter);
	    var prefix = options.addQueryPrefix === true ? '?' : '';

	    if (options.charsetSentinel) {
	        if (options.charset === 'iso-8859-1') {
	            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
	            prefix += 'utf8=%26%2310003%3B' + options.delimiter;
	        } else {
	            // encodeURIComponent('✓')
	            prefix += 'utf8=%E2%9C%93' + options.delimiter;
	        }
	    }

	    return joined.length > 0 ? prefix + joined : '';
	};
	return stringify_1;
}

var parse;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse;
	hasRequiredParse = 1;

	var utils = /*@__PURE__*/ requireUtils$1();

	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;

	var defaults = {
	    allowDots: false,
	    allowEmptyArrays: false,
	    allowPrototypes: false,
	    allowSparse: false,
	    arrayLimit: 20,
	    charset: 'utf-8',
	    charsetSentinel: false,
	    comma: false,
	    decodeDotInKeys: false,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    duplicates: 'combine',
	    ignoreQueryPrefix: false,
	    interpretNumericEntities: false,
	    parameterLimit: 1000,
	    parseArrays: true,
	    plainObjects: false,
	    strictDepth: false,
	    strictMerge: true,
	    strictNullHandling: false,
	    throwOnLimitExceeded: false
	};

	var interpretNumericEntities = function (str) {
	    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
	        return String.fromCharCode(parseInt(numberStr, 10));
	    });
	};

	var parseArrayValue = function (val, options, currentArrayLength, isFlatArrayValue) {
	    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
	        if (isFlatArrayValue && options.throwOnLimitExceeded) {
	            var commaCount = 0;
	            var commaIndex = val.indexOf(',');
	            while (commaIndex > -1) {
	                commaCount += 1;
	                if (commaCount >= options.arrayLimit) {
	                    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	                }
	                commaIndex = val.indexOf(',', commaIndex + 1);
	            }
	        }
	        return val.split(',');
	    }

	    if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
	        throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	    }

	    return val;
	};

	// This is what browsers will submit when the ✓ character occurs in an
	// application/x-www-form-urlencoded body and the encoding of the page containing
	// the form is iso-8859-1, or when the submitted form has an accept-charset
	// attribute of iso-8859-1. Presumably also with other charsets that do not contain
	// the ✓ character, such as us-ascii.
	var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

	// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
	var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = { __proto__: null };

	    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
	    cleanStr = cleanStr.replace(/%5B/gi, '[').replace(/%5D/gi, ']');

	    var limit = options.parameterLimit === Infinity ? void undefined : options.parameterLimit;
	    var parts = cleanStr.split(
	        options.delimiter,
	        options.throwOnLimitExceeded && typeof limit !== 'undefined' ? limit + 1 : limit
	    );

	    if (options.throwOnLimitExceeded && typeof limit !== 'undefined' && parts.length > limit) {
	        throw new RangeError('Parameter limit exceeded. Only ' + limit + ' parameter' + (limit === 1 ? '' : 's') + ' allowed.');
	    }

	    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
	    var i;

	    var charset = options.charset;
	    if (options.charsetSentinel) {
	        for (i = 0; i < parts.length; ++i) {
	            if (parts[i].indexOf('utf8=') === 0) {
	                if (parts[i] === charsetSentinel) {
	                    charset = 'utf-8';
	                } else if (parts[i] === isoSentinel) {
	                    charset = 'iso-8859-1';
	                }
	                skipIndex = i;
	                i = parts.length; // The eslint settings do not allow break;
	            }
	        }
	    }

	    for (i = 0; i < parts.length; ++i) {
	        if (i === skipIndex) {
	            continue;
	        }
	        var part = parts[i];

	        var bracketEqualsPos = part.indexOf(']=');
	        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

	        var key;
	        var val;
	        if (pos === -1) {
	            key = options.decoder(part, defaults.decoder, charset, 'key');
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');

	            if (key !== null) {
	                val = utils.maybeMap(
	                    parseArrayValue(
	                        part.slice(pos + 1),
	                        options,
	                        isArray(obj[key]) ? obj[key].length : 0,
	                        part.indexOf('[]=') === -1
	                    ),
	                    function (encodedVal) {
	                        return options.decoder(encodedVal, defaults.decoder, charset, 'value');
	                    }
	                );
	            }
	        }

	        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
	            val = interpretNumericEntities(String(val));
	        }

	        if (part.indexOf('[]=') > -1) {
	            val = isArray(val) ? [val] : val;
	        }

	        if (options.comma && isArray(val) && val.length > options.arrayLimit) {
	            val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
	        }

	        if (key !== null) {
	            var existing = has.call(obj, key);
	            if (existing && (options.duplicates === 'combine' || part.indexOf('[]=') > -1)) {
	                obj[key] = utils.combine(
	                    obj[key],
	                    val,
	                    options.arrayLimit,
	                    options.plainObjects,
	                    options.throwOnLimitExceeded
	                );
	            } else if (!existing || options.duplicates === 'last') {
	                obj[key] = val;
	            }
	        }
	    }

	    return obj;
	};

	var parseObject = function (chain, val, options, valuesParsed) {
	    var currentArrayLength = 0;
	    if (chain.length > 0 && chain[chain.length - 1] === '[]') {
	        var parentKey = chain.slice(0, -1).join('');
	        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
	    }

	    var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);

	    for (var i = chain.length - 1; i >= 0; --i) {
	        var obj;
	        var root = chain[i];

	        if (root === '[]' && options.parseArrays) {
	            if (utils.isOverflow(leaf)) {
	                // leaf is already an overflow object, preserve it
	                obj = leaf;
	            } else {
	                obj = options.allowEmptyArrays && (leaf === '' || (options.strictNullHandling && leaf === null))
	                    ? []
	                    : utils.combine(
	                        [],
	                        leaf,
	                        options.arrayLimit,
	                        options.plainObjects,
	                        options.throwOnLimitExceeded
	                    );
	            }
	        } else {
	            obj = options.plainObjects ? { __proto__: null } : {};
	            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
	            var index = parseInt(decodedRoot, 10);
	            var isValidArrayIndex = !isNaN(index)
	                && root !== decodedRoot
	                && String(index) === decodedRoot
	                && index >= 0
	                && options.parseArrays;
	            if (!options.parseArrays && decodedRoot === '') {
	                obj = { 0: leaf };
	            } else if (isValidArrayIndex && index < options.arrayLimit) {
	                obj = [];
	                obj[index] = leaf;
	            } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
	                throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
	            } else if (isValidArrayIndex) {
	                obj[index] = leaf;
	                utils.markOverflow(obj, index);
	            } else if (decodedRoot !== '__proto__') {
	                obj[decodedRoot] = leaf;
	            }
	        }

	        leaf = obj;
	    }

	    return leaf;
	};

	// Split a key like "a[b][c[]]" into ['a', '[b]', '[c[]]'] while preserving
	// qs parse semantics for depth/prototype guards.
	var splitKeyIntoSegments = function splitKeyIntoSegments(originalKey, options) {
	    var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, '[$1]') : originalKey;

	    // depth <= 0 keeps the whole key as one segment
	    if (options.depth <= 0) {
	        if (!options.plainObjects && has.call(Object.prototype, key)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        return [key];
	    }

	    var segments = [];

	    // parent before the first '[' (may be empty if key starts with '[')
	    var first = key.indexOf('[');
	    var parent = first >= 0 ? key.slice(0, first) : key;
	    if (parent) {
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        segments[segments.length] = parent;
	    }

	    var n = key.length;
	    var open = first;
	    var collected = 0;

	    while (open >= 0 && collected < options.depth) {
	        var level = 1;
	        var i = open + 1;
	        var close = -1;

	        // balance nested '[' and ']' inside this bracket group using a nesting level counter
	        while (i < n && close < 0) {
	            var cu = key.charCodeAt(i);
	            if (cu === 0x5B) { // '['
	                level += 1;
	            } else if (cu === 0x5D) { // ']'
	                level -= 1;
	                if (level === 0) {
	                    close = i; // found matching close; loop will exit by condition
	                }
	            }
	            i += 1;
	        }

	        if (close < 0) {
	            // Unterminated group: wrap the raw remainder in one bracket pair so it stays
	            // a single literal segment (e.g. "[[]b" -> "[[]b]"); we do not infer missing ']'.
	            segments[segments.length] = '[' + key.slice(open) + ']';
	            return segments;
	        }

	        var seg = key.slice(open, close + 1);
	        // prototype guard for the content of this group
	        var content = seg.slice(1, -1);
	        if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) {
	            return;
	        }

	        segments[segments.length] = seg;
	        collected += 1;

	        // find the next '[' after this balanced group
	        open = key.indexOf('[', close + 1);
	    }

	    if (open >= 0) {
	        if (options.strictDepth === true) {
	            throw new RangeError('Input depth exceeded depth option of ' + options.depth + ' and strictDepth is true');
	        }

	        segments[segments.length] = '[' + key.slice(open) + ']';
	    }

	    return segments;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
	    if (!givenKey) {
	        return;
	    }

	    var keys = splitKeyIntoSegments(givenKey, options);

	    if (!keys) {
	        return;
	    }

	    return parseObject(keys, val, options, valuesParsed);
	};

	var normalizeParseOptions = function normalizeParseOptions(opts) {
	    if (!opts) {
	        return defaults;
	    }

	    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
	        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
	    }

	    if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
	        throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
	    }

	    if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }

	    if (typeof opts.throwOnLimitExceeded !== 'undefined' && typeof opts.throwOnLimitExceeded !== 'boolean') {
	        throw new TypeError('`throwOnLimitExceeded` option must be a boolean');
	    }

	    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

	    var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;

	    if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
	        throw new TypeError('The duplicates option must be either combine, first, or last');
	    }

	    var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

	    return {
	        allowDots: allowDots,
	        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
	        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
	        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
	        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
	        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
	        decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
	        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
	        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
	        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
	        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
	        duplicates: duplicates,
	        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
	        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
	        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
	        parseArrays: opts.parseArrays !== false,
	        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
	        strictDepth: typeof opts.strictDepth === 'boolean' ? !!opts.strictDepth : defaults.strictDepth,
	        strictMerge: typeof opts.strictMerge === 'boolean' ? !!opts.strictMerge : defaults.strictMerge,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling,
	        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === 'boolean' ? opts.throwOnLimitExceeded : false
	    };
	};

	parse = function (str, opts) {
	    var options = normalizeParseOptions(opts);

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? { __proto__: null } : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? { __proto__: null } : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
	        obj = utils.merge(obj, newObj, options);
	    }

	    if (options.allowSparse === true) {
	        return obj;
	    }

	    return utils.compact(obj);
	};
	return parse;
}

var lib$3;
var hasRequiredLib$6;

function requireLib$6 () {
	if (hasRequiredLib$6) return lib$3;
	hasRequiredLib$6 = 1;

	var stringify = /*@__PURE__*/ requireStringify();
	var parse = /*@__PURE__*/ requireParse();
	var formats = /*@__PURE__*/ requireFormats();

	lib$3 = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};
	return lib$3;
}

/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var hasRequiredUrl;

function requireUrl () {
	if (hasRequiredUrl) return url;
	hasRequiredUrl = 1;

	var punycode = requirePunycode();

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	/*
	 * define these here so at least they only have to be
	 * compiled once on the first module load.
	 */
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	  portPattern = /:[0-9]*$/,

	  // Special case for a simple path URL
	  simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/,

	  /*
	   * RFC 2396: characters reserved for delimiting URLs.
	   * We actually just auto-escape these.
	   */
	  delims = [
	    '<', '>', '"', '`', ' ', '\r', '\n', '\t'
	  ],

	  // RFC 2396: characters not allowed for various reasons.
	  unwise = [
	    '{', '}', '|', '\\', '^', '`'
	  ].concat(delims),

	  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	  autoEscape = ['\''].concat(unwise),
	  /*
	   * Characters that are never ever allowed in a hostname.
	   * Note that any invalid chars are also handled, but these
	   * are the ones that are *expected* to be seen, so we fast-path
	   * them.
	   */
	  nonHostChars = [
	    '%', '/', '?', ';', '#'
	  ].concat(autoEscape),
	  hostEndingChars = [
	    '/', '?', '#'
	  ],
	  hostnameMaxLen = 255,
	  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	  // protocols that can allow "unsafe" and "unwise" chars.
	  unsafeProtocol = {
	    javascript: true,
	    'javascript:': true
	  },
	  // protocols that never have a hostname.
	  hostlessProtocol = {
	    javascript: true,
	    'javascript:': true
	  },
	  // protocols that always contain a // bit.
	  slashedProtocol = {
	    http: true,
	    https: true,
	    ftp: true,
	    gopher: true,
	    file: true,
	    'http:': true,
	    'https:': true,
	    'ftp:': true,
	    'gopher:': true,
	    'file:': true
	  },
	  querystring = /*@__PURE__*/ requireLib$6();

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && typeof url === 'object' && url instanceof Url) { return url; }

	  var u = new Url();
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
	  if (typeof url !== 'string') {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  /*
	   * Copy chrome, IE, opera backslash-handling behavior.
	   * Back slashes before the query string get converted to forward slashes
	   * See: https://code.google.com/p/chromium/issues/detail?id=25916
	   */
	  var queryIndex = url.indexOf('?'),
	    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
	    uSplit = url.split(splitter),
	    slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  /*
	   * trim before proceeding.
	   * This is to support parse stuff like "  http://foo.com  \n"
	   */
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  /*
	   * figure out if it's got a host
	   * user@server is *always* interpreted as a hostname, and url
	   * resolution will treat //foo/bar as host=foo,path=bar because that's
	   * how the browser resolves relative URLs.
	   */
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {

	    /*
	     * there's a hostname.
	     * the first instance of /, ?, ;, or # ends the host.
	     *
	     * If there is an @ in the hostname, then non-host chars *are* allowed
	     * to the left of the last @ sign, unless some host-ending character
	     * comes *before* the @-sign.
	     * URLs are obnoxious.
	     *
	     * ex:
	     * http://a@b@c/ => user:a@b host:c
	     * http://a@b?@c => user:a host:c path:/?@c
	     */

	    /*
	     * v0.12 TODO(isaacs): This is not quite how Chrome does things.
	     * Review our test case against browsers more comprehensively.
	     */

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) { hostEnd = hec; }
	    }

	    /*
	     * at this point, either we have an explicit point where the
	     * auth portion cannot go past, or the last @ char is the decider.
	     */
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      /*
	       * atSign must be in auth portion.
	       * http://a@b/c@d => host:b auth:a path:/c@d
	       */
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    /*
	     * Now we have a portion which is definitely the auth.
	     * Pull that off.
	     */
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) { hostEnd = hec; }
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1) { hostEnd = rest.length; }

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    /*
	     * we've indicated that there is a hostname,
	     * so even if it's empty, it has to be present.
	     */
	    this.hostname = this.hostname || '';

	    /*
	     * if hostname begins with [ and ends with ]
	     * assume that it's an IPv6 address.
	     */
	    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) { continue; }
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              /*
	               * we replace non-ASCII char with a temporary placeholder
	               * we need this to make sure size of hostname is not
	               * broken by replacing non-ASCII by nothing
	               */
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      /*
	       * IDNA Support: Returns a punycoded representation of "domain".
	       * It only converts parts of the domain name that
	       * have non-ASCII characters, i.e. it doesn't matter if
	       * you call it with a domain that already is ASCII-only.
	       */
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    /*
	     * strip [ and ] from the hostname
	     * the host field still retains them, though
	     */
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  /*
	   * now rest is set to the post-host stuff.
	   * chop off any delim chars.
	   */
	  if (!unsafeProtocol[lowerProto]) {

	    /*
	     * First, make 100% sure that any "autoEscape" chars get
	     * escaped, even if encodeURIComponent doesn't think they
	     * need to be.
	     */
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1) { continue; }
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }

	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) { this.pathname = rest; }
	  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  // to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  /*
	   * ensure it's an object, and not a string url.
	   * If it's an obj, this is a no-op.
	   * this way, you can call url_format() on strings
	   * to clean up potentially wonky urls.
	   */
	  if (typeof obj === 'string') { obj = urlParse(obj); }
	  if (!(obj instanceof Url)) { return Url.prototype.format.call(obj); }
	  return obj.format();
	}

	Url.prototype.format = function () {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	    pathname = this.pathname || '',
	    hash = this.hash || '',
	    host = false,
	    query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query && typeof this.query === 'object' && Object.keys(this.query).length) {
	    query = querystring.stringify(this.query, {
	      arrayFormat: 'repeat',
	      addQueryPrefix: false
	    });
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') { protocol += ':'; }

	  /*
	   * only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	   * unless they had them to begin with.
	   */
	  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') { pathname = '/' + pathname; }
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') { hash = '#' + hash; }
	  if (search && search.charAt(0) !== '?') { search = '?' + search; }

	  pathname = pathname.replace(/[?#]/g, function (match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function (relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) { return relative; }
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function (relative) {
	  if (typeof relative === 'string') {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  /*
	   * hash is always overridden, no matter what.
	   * even href="" will remove it.
	   */
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol') { result[rkey] = relative[rkey]; }
	    }

	    // urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
	      result.pathname = '/';
	      result.path = result.pathname;
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    /*
	     * if it's a known url protocol, then changing
	     * the protocol does weird things
	     * first, if it's not file:, then we MUST have a host,
	     * and if there was a path
	     * to begin with, then we MUST have a path.
	     * if it is file:, then the host is dropped,
	     * because that's known to be hostless.
	     * anything else is assumed to be absolute.
	     */
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift())) { }
	      if (!relative.host) { relative.host = ''; }
	      if (!relative.hostname) { relative.hostname = ''; }
	      if (relPath[0] !== '') { relPath.unshift(''); }
	      if (relPath.length < 2) { relPath.unshift(''); }
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
	    isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
	    mustEndAbs = isRelAbs || isSourceAbs || (result.host && relative.pathname),
	    removeAllDots = mustEndAbs,
	    srcPath = result.pathname && result.pathname.split('/') || [],
	    relPath = relative.pathname && relative.pathname.split('/') || [],
	    psychotic = result.protocol && !slashedProtocol[result.protocol];

	  /*
	   * if the url is a non-slashed url, then relative
	   * links like ../.. should be able
	   * to crawl up to the hostname, as well.  This is strange.
	   * result.protocol has already been set by now.
	   * Later on, put the first path part into the host field.
	   */
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') { srcPath[0] = result.host; } else { srcPath.unshift(result.host); }
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') { relPath[0] = relative.host; } else { relPath.unshift(relative.host); }
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = relative.host || relative.host === '' ? relative.host : result.host;
	    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    /*
	     * it's relative
	     * throw away the existing file, and take the new path instead.
	     */
	    if (!srcPath) { srcPath = []; }
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (relative.search != null) {
	    /*
	     * just pull out the search.
	     * like href='?foo'.
	     * Put this after the other two cases because it simplifies the booleans
	     */
	    if (psychotic) {
	      result.host = srcPath.shift();
	      result.hostname = result.host;
	      /*
	       * occationaly the auth can get stuck only in host
	       * this especially happens in cases like
	       * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	       */
	      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.hostname = authInHost.shift();
	        result.host = result.hostname;
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    // to support http.request
	    if (result.pathname !== null || result.search !== null) {
	      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    /*
	     * no path at all.  easy.
	     * we've already handled the other stuff above.
	     */
	    result.pathname = null;
	    // to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  /*
	   * if a url ENDs in . or .., then it must get a trailing slash.
	   * however, if it ends in anything else non-slashy,
	   * then it must NOT get a trailing slash.
	   */
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

	  /*
	   * strip single dots, resolve double dots to parent dir
	   * if the path tries to go above the root, `up` ends up > 0
	   */
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
	    result.host = result.hostname;
	    /*
	     * occationaly the auth can get stuck only in host
	     * this especially happens in cases like
	     * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	     */
	    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.hostname = authInHost.shift();
	      result.host = result.hostname;
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (srcPath.length > 0) {
	    result.pathname = srcPath.join('/');
	  } else {
	    result.pathname = null;
	    result.path = null;
	  }

	  // to support request.http
	  if (result.pathname !== null || result.search !== null) {
	    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function () {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) { this.hostname = host; }
	};

	url.parse = urlParse;
	url.resolve = urlResolve;
	url.resolveObject = urlResolveObject;
	url.format = urlFormat;

	url.Url = Url;
	return url;
}

var hasRequiredUtil$3;

function requireUtil$3 () {
	if (hasRequiredUtil$3) return util$3;
	hasRequiredUtil$3 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.filenameToSteps = exports.resolve = exports.unixify = exports.isWin = void 0;
		exports.isFd = isFd;
		exports.validateFd = validateFd;
		exports.dataToBuffer = dataToBuffer;
		exports.nullCheck = nullCheck;
		exports.pathToFilename = pathToFilename;
		exports.createError = createError;
		exports.createStatError = createStatError;
		const path_1 = requirePath$1();
		const buffer_1 = requireBuffer();
		const errors = requireErrors$1();
		const process_1 = requireProcess();
		const encoding_1 = requireEncoding();
		const fs_node_utils_1 = requireLib$7();
		exports.isWin = process_1.default.platform === 'win32';
		const resolveCrossPlatform = path_1.resolve;
		const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
		const isSeparator = (str, i) => {
		    let char = str[i];
		    return i > 0 && (char === '/' || (exports.isWin && char === '\\'));
		};
		const removeTrailingSeparator = (str) => {
		    let i = str.length - 1;
		    if (i < 2)
		        return str;
		    while (isSeparator(str, i))
		        i--;
		    return str.substr(0, i + 1);
		};
		const normalizePath = (str, stripTrailing) => {
		    if (typeof str !== 'string')
		        throw new TypeError('expected a string');
		    str = str.replace(/[\\\/]+/g, '/');
		    if (stripTrailing !== false)
		        str = removeTrailingSeparator(str);
		    return str;
		};
		const unixify = (filepath, stripTrailing = true) => {
		    if (exports.isWin) {
		        filepath = normalizePath(filepath, stripTrailing);
		        return filepath.replace(/^([a-zA-Z]+:|\.\/)/, '');
		    }
		    return filepath;
		};
		exports.unixify = unixify;
		let resolve = (filename, base = process_1.default.cwd()) => resolveCrossPlatform(base, filename);
		exports.resolve = resolve;
		if (exports.isWin) {
		    const _resolve = resolve;
		    exports.resolve = resolve = (filename, base) => (0, exports.unixify)(_resolve(filename, base));
		}
		const filenameToSteps = (filename, base) => {
		    const fullPath = resolve(filename, base);
		    const fullPathSansSlash = fullPath.substring(1);
		    if (!fullPathSansSlash)
		        return [];
		    return fullPathSansSlash.split(pathSep);
		};
		exports.filenameToSteps = filenameToSteps;
		function isFd(path) {
		    return path >>> 0 === path;
		}
		function validateFd(fd) {
		    if (!isFd(fd))
		        throw TypeError(fs_node_utils_1.ERRSTR.FD);
		}
		function dataToBuffer(data, encoding = encoding_1.ENCODING_UTF8) {
		    if (buffer_1.Buffer.isBuffer(data))
		        return data;
		    else if (data instanceof Uint8Array)
		        return (0, buffer_1.bufferFrom)(data);
		    else if (encoding === 'buffer')
		        return (0, buffer_1.bufferFrom)(String(data), 'utf8');
		    else
		        return (0, buffer_1.bufferFrom)(String(data), encoding);
		}
		function nullCheck(path, callback) {
		    if (('' + path).indexOf('\u0000') !== -1) {
		        const er = new Error('Path must be a string without null bytes');
		        er.code = 'ENOENT';
		        if (typeof callback !== 'function')
		            throw er;
		        Promise.resolve().then(() => callback(er));
		        return false;
		    }
		    return true;
		}
		function getPathFromURLPosix(url) {
		    if (url.hostname !== '') {
		        throw new errors.TypeError('ERR_INVALID_FILE_URL_HOST', process_1.default.platform);
		    }
		    const pathname = url.pathname;
		    for (let n = 0; n < pathname.length; n++) {
		        if (pathname[n] === '%') {
		            const third = pathname.codePointAt(n + 2) | 0x20;
		            if (pathname[n + 1] === '2' && third === 102) {
		                throw new errors.TypeError('ERR_INVALID_FILE_URL_PATH', 'must not include encoded / characters');
		            }
		        }
		    }
		    return decodeURIComponent(pathname);
		}
		function pathToFilename(path) {
		    if (path instanceof Uint8Array) {
		        path = (0, buffer_1.bufferFrom)(path);
		    }
		    if (typeof path !== 'string' && !buffer_1.Buffer.isBuffer(path)) {
		        try {
		            if (!(path instanceof requireUrl().URL))
		                throw new TypeError(fs_node_utils_1.ERRSTR.PATH_STR);
		        }
		        catch (err) {
		            throw new TypeError(fs_node_utils_1.ERRSTR.PATH_STR);
		        }
		        path = getPathFromURLPosix(path);
		    }
		    const pathString = String(path);
		    nullCheck(pathString);
		    return pathString;
		}
		const ENOENT = 'ENOENT';
		const EBADF = 'EBADF';
		const EINVAL = 'EINVAL';
		const EPERM = 'EPERM';
		const EPROTO = 'EPROTO';
		const EEXIST = 'EEXIST';
		const ENOTDIR = 'ENOTDIR';
		const EMFILE = 'EMFILE';
		const EACCES = 'EACCES';
		const EISDIR = 'EISDIR';
		const ENOTEMPTY = 'ENOTEMPTY';
		const ENOSYS = 'ENOSYS';
		const ERR_FS_EISDIR = 'ERR_FS_EISDIR';
		const ERR_OUT_OF_RANGE = 'ERR_OUT_OF_RANGE';
		function formatError(errorCode, func = '', path = '', path2 = '') {
		    let pathFormatted = '';
		    if (path)
		        pathFormatted = ` '${path}'`;
		    if (path2)
		        pathFormatted += ` -> '${path2}'`;
		    switch (errorCode) {
		        case ENOENT:
		            return `ENOENT: no such file or directory, ${func}${pathFormatted}`;
		        case EBADF:
		            return `EBADF: bad file descriptor, ${func}${pathFormatted}`;
		        case EINVAL:
		            return `EINVAL: invalid argument, ${func}${pathFormatted}`;
		        case EPERM:
		            return `EPERM: operation not permitted, ${func}${pathFormatted}`;
		        case EPROTO:
		            return `EPROTO: protocol error, ${func}${pathFormatted}`;
		        case EEXIST:
		            return `EEXIST: file already exists, ${func}${pathFormatted}`;
		        case ENOTDIR:
		            return `ENOTDIR: not a directory, ${func}${pathFormatted}`;
		        case EISDIR:
		            return `EISDIR: illegal operation on a directory, ${func}${pathFormatted}`;
		        case EACCES:
		            return `EACCES: permission denied, ${func}${pathFormatted}`;
		        case ENOTEMPTY:
		            return `ENOTEMPTY: directory not empty, ${func}${pathFormatted}`;
		        case EMFILE:
		            return `EMFILE: too many open files, ${func}${pathFormatted}`;
		        case ENOSYS:
		            return `ENOSYS: function not implemented, ${func}${pathFormatted}`;
		        case ERR_FS_EISDIR:
		            return `[ERR_FS_EISDIR]: Path is a directory: ${func} returned EISDIR (is a directory) ${path}`;
		        case ERR_OUT_OF_RANGE:
		            return `[ERR_OUT_OF_RANGE]: value out of range, ${func}${pathFormatted}`;
		        default:
		            return `${errorCode}: error occurred, ${func}${pathFormatted}`;
		    }
		}
		function createError(errorCode, func = '', path = '', path2 = '', Constructor = Error) {
		    const error = new Constructor(formatError(errorCode, func, path, path2));
		    error.code = errorCode;
		    if (path) {
		        error.path = path;
		    }
		    return error;
		}
		function createStatError(errorCode, func = '', path = '', path2 = '') {
		    return {
		        code: errorCode,
		        message: formatError(errorCode, func, path, path2),
		        path,
		        toError() {
		            const error = new Error(this.message);
		            error.code = this.code;
		            if (this.path) {
		                error.path = this.path;
		            }
		            return error;
		        },
		    };
		}
		
	} (util$3));
	return util$3;
}

var FsEvent = {};

var hasRequiredFsEvent;

function requireFsEvent () {
	if (hasRequiredFsEvent) return FsEvent;
	hasRequiredFsEvent = 1;
	Object.defineProperty(FsEvent, "__esModule", { value: true });
	FsEvent.FsEvent = void 0;
	let FsEvent$1 = class FsEvent {
	    constructor(type, steps, node, link, oldSteps = void 0) {
	        this.type = type;
	        this.steps = steps;
	        this.node = node;
	        this.link = link;
	        this.oldSteps = oldSteps;
	    }
	};
	FsEvent.FsEvent = FsEvent$1;
	
	return FsEvent;
}

var hasRequiredSuperblock;

function requireSuperblock () {
	if (hasRequiredSuperblock) return Superblock;
	hasRequiredSuperblock = 1;
	Object.defineProperty(Superblock, "__esModule", { value: true });
	Superblock.Superblock = void 0;
	const path_1 = requirePath$1();
	const Node_1 = requireNode();
	const Link_1 = requireLink();
	const File_1 = requireFile();
	const buffer_1 = requireBuffer();
	const process_1 = requireProcess();
	const fs_node_utils_1 = requireLib$7();
	const fs_node_utils_2 = requireLib$7();
	const util_1 = requireUtil$3();
	const json_1 = requireJson$1();
	const result_1 = requireResult();
	const fanout_1 = requireFanout();
	const FsEvent_1 = requireFsEvent();
	const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
	const pathRelative = path_1.posix ? path_1.posix.relative : path_1.relative;
	const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
	const { O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL, O_TRUNC, O_APPEND, O_DIRECTORY } = fs_node_utils_1.constants;
	/**
	 * Represents a filesystem superblock, which is the root of a virtual
	 * filesystem in Linux.
	 * @see https://lxr.linux.no/linux+v3.11.2/include/linux/fs.h#L1242
	 */
	let Superblock$1 = class Superblock {
	    static fromJSON(json, cwd, opts) {
	        const vol = new Superblock(opts);
	        vol.fromJSON(json, cwd);
	        return vol;
	    }
	    static fromNestedJSON(json, cwd, opts) {
	        const vol = new Superblock(opts);
	        vol.fromNestedJSON(json, cwd);
	        return vol;
	    }
	    constructor(opts = {}) {
	        // I-node number counter.
	        this.ino = 0;
	        // A mapping for i-node numbers to i-nodes (`Node`);
	        this.inodes = {};
	        // List of released i-node numbers, for reuse.
	        this.releasedInos = [];
	        // A mapping for file descriptors to `File`s.
	        this.fds = {};
	        // A list of reusable (opened and closed) file descriptors, that should be
	        // used first before creating a new file descriptor.
	        this.releasedFds = [];
	        // Max number of open files.
	        this.maxFiles = 10000;
	        // Current number of open files.
	        this.openFiles = 0;
	        /** Fan-out of file system change events. Multiple consumers may subscribe. */
	        this.changes = new fanout_1.FanOut();
	        this.open = (filename, flagsNum, modeNum, resolveSymlinks = true) => {
	            const file = this.openFile(filename, flagsNum, modeNum, resolveSymlinks);
	            if (!file)
	                throw (0, util_1.createError)("ENOENT" /* ERROR_CODE.ENOENT */, 'open', filename);
	            return file.fd;
	        };
	        this.writeFile = (id, buf, flagsNum, modeNum) => {
	            const isUserFd = typeof id === 'number';
	            let fd;
	            if (isUserFd)
	                fd = id;
	            else
	                fd = this.open((0, util_1.pathToFilename)(id), flagsNum, modeNum);
	            let offset = 0;
	            let length = buf.length;
	            let position = flagsNum & O_APPEND ? undefined : 0;
	            try {
	                while (length > 0) {
	                    const written = this.write(fd, buf, offset, length, position);
	                    offset += written;
	                    length -= written;
	                    if (position !== undefined)
	                        position += written;
	                }
	            }
	            finally {
	                if (!isUserFd)
	                    this.close(fd);
	            }
	        };
	        this.read = (fd, buffer, offset, length, position) => {
	            if (buffer.byteLength < length) {
	                throw (0, util_1.createError)("ERR_OUT_OF_RANGE" /* ERROR_CODE.ERR_OUT_OF_RANGE */, 'read', undefined, undefined, RangeError);
	            }
	            const file = this.getFileByFdOrThrow(fd);
	            if (file.node.isSymlink()) {
	                throw (0, util_1.createError)("EPERM" /* ERROR_CODE.EPERM */, 'read', file.link.getPath());
	            }
	            return file.read(buffer, Number(offset), Number(length), position === -1 || typeof position !== 'number' ? undefined : position);
	        };
	        this.readv = (fd, buffers, position) => {
	            const file = this.getFileByFdOrThrow(fd);
	            let p = position ?? undefined;
	            if (p === -1)
	                p = undefined;
	            let bytesRead = 0;
	            for (const buffer of buffers) {
	                const bytes = file.read(buffer, 0, buffer.byteLength, p);
	                p = undefined;
	                bytesRead += bytes;
	                if (bytes < buffer.byteLength)
	                    break;
	            }
	            return bytesRead;
	        };
	        this.link = (filename1, filename2) => {
	            let link1;
	            try {
	                link1 = this.getLinkOrThrow(filename1, 'link');
	            }
	            catch (err) {
	                if (err.code)
	                    err = (0, util_1.createError)(err.code, 'link', filename1, filename2);
	                throw err;
	            }
	            const dirname2 = (0, path_1.dirname)(filename2);
	            let dir2;
	            try {
	                dir2 = this.getLinkOrThrow(dirname2, 'link');
	            }
	            catch (err) {
	                // Augment error with filename1
	                if (err.code)
	                    err = (0, util_1.createError)(err.code, 'link', filename1, filename2);
	                throw err;
	            }
	            const name = (0, path_1.basename)(filename2);
	            if (dir2.getChild(name))
	                throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'link', filename1, filename2);
	            const node = link1.getNode();
	            node.nlink++;
	            const newLink = dir2.createChild(name, node);
	            this.emit(new FsEvent_1.FsEvent(0 /* FsEventType.CREATE */, newLink.steps, node, newLink));
	        };
	        this.unlink = (filename) => {
	            const link = this.getLinkOrThrow(filename, 'unlink');
	            // TODO: Check if it is file, dir, other...
	            if (link.length)
	                throw Error('Dir not empty...');
	            this._emitDeleteRecursive(link);
	            this.deleteLink(link);
	            const node = link.getNode();
	            node.nlink--;
	            // When all hard links to i-node are deleted, remove the i-node, too.
	            if (node.nlink <= 0) {
	                this.deleteNode(node);
	            }
	        };
	        this.symlink = (targetFilename, pathFilename) => {
	            const pathSteps = (0, util_1.filenameToSteps)(pathFilename);
	            // Check if directory exists, where we about to create a symlink.
	            let dirLink;
	            try {
	                dirLink = this.getLinkParentAsDirOrThrow(pathSteps);
	            }
	            catch (err) {
	                // Catch error to populate with the correct fields - getLinkParentAsDirOrThrow won't be aware of the second path
	                if (err.code)
	                    err = (0, util_1.createError)(err.code, 'symlink', targetFilename, pathFilename);
	                throw err;
	            }
	            const name = pathSteps[pathSteps.length - 1];
	            // Check if new file already exists.
	            if (dirLink.getChild(name))
	                throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'symlink', targetFilename, pathFilename);
	            // Check permissions on the path where we are creating the symlink.
	            // Note we're not checking permissions on the target path: It is not an error to create a symlink to a
	            // non-existent or inaccessible target
	            const node = dirLink.getNode();
	            if (!node.canExecute() || !node.canWrite())
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'symlink', targetFilename, pathFilename);
	            // Create symlink.
	            const symlink = dirLink.createChild(name);
	            symlink.getNode().makeSymlink(targetFilename);
	            this.emit(new FsEvent_1.FsEvent(0 /* FsEventType.CREATE */, symlink.steps, symlink.getNode(), symlink));
	            return symlink;
	        };
	        this.rename = (oldPathFilename, newPathFilename) => {
	            let link;
	            try {
	                link = this.getResolvedLinkOrThrow(oldPathFilename);
	            }
	            catch (err) {
	                // Augment err with newPathFilename
	                if (err.code)
	                    err = (0, util_1.createError)(err.code, 'rename', oldPathFilename, newPathFilename);
	                throw err;
	            }
	            // TODO: Check if it is directory, if non-empty, we cannot move it, right?
	            // Check directory exists for the new location.
	            let newPathDirLink;
	            try {
	                newPathDirLink = this.getLinkParentAsDirOrThrow(newPathFilename);
	            }
	            catch (err) {
	                // Augment error with oldPathFilename
	                if (err.code)
	                    err = (0, util_1.createError)(err.code, 'rename', oldPathFilename, newPathFilename);
	                throw err;
	            }
	            // TODO: Also treat cases with directories and symbolic links.
	            // TODO: See: http://man7.org/linux/man-pages/man2/rename.2.html
	            // Remove hard link from old folder.
	            const oldLinkParent = link.parent;
	            if (!oldLinkParent)
	                throw (0, util_1.createError)("EINVAL" /* ERROR_CODE.EINVAL */, 'rename', oldPathFilename, newPathFilename);
	            // Check we have access and write permissions in both places
	            const oldParentNode = oldLinkParent.getNode();
	            const newPathDirNode = newPathDirLink.getNode();
	            if (!oldParentNode.canExecute() ||
	                !oldParentNode.canWrite() ||
	                !newPathDirNode.canExecute() ||
	                !newPathDirNode.canWrite()) {
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'rename', oldPathFilename, newPathFilename);
	            }
	            oldLinkParent.deleteChild(link);
	            // Rename should overwrite the new path, if that exists.
	            const name = (0, path_1.basename)(newPathFilename);
	            const oldSteps = link.steps;
	            link.name = name;
	            link.steps = [...newPathDirLink.steps, name];
	            newPathDirLink.setChild(link.getName(), link);
	            this.emit(new FsEvent_1.FsEvent(4 /* FsEventType.MOVE */, link.steps, link.getNode(), link, oldSteps));
	        };
	        this.mkdir = (filename, modeNum) => {
	            const steps = (0, util_1.filenameToSteps)(filename);
	            // This will throw if user tries to create root dir `fs.mkdirSync('/')`.
	            if (!steps.length)
	                throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'mkdir', filename);
	            const dir = this.getLinkParentAsDirOrThrow(filename, 'mkdir');
	            // Check path already exists.
	            const name = steps[steps.length - 1];
	            if (dir.getChild(name))
	                throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'mkdir', filename);
	            const node = dir.getNode();
	            if (!node.canWrite() || !node.canExecute())
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'mkdir', filename);
	            const child = dir.createChild(name, this.createNode(fs_node_utils_1.constants.S_IFDIR | modeNum));
	            this.emit(new FsEvent_1.FsEvent(0 /* FsEventType.CREATE */, child.steps, child.getNode(), child));
	        };
	        /**
	         * Creates directory tree recursively.
	         */
	        this.mkdirp = (filename, modeNum) => {
	            let created = false;
	            const steps = (0, util_1.filenameToSteps)(filename);
	            let curr = null;
	            let i = steps.length;
	            // Find the longest subpath of filename that still exists:
	            for (i = steps.length; i >= 0; i--) {
	                curr = this.getResolvedLink(steps.slice(0, i));
	                if (curr)
	                    break;
	            }
	            if (!curr) {
	                curr = this.root;
	                i = 0;
	            }
	            // curr is now the last directory that still exists.
	            // (If none of them existed, curr is the root.)
	            // Check access the lazy way:
	            curr = this.getResolvedLinkOrThrow(path_1.sep + steps.slice(0, i).join(path_1.sep), 'mkdir');
	            // Start creating directories:
	            for (i; i < steps.length; i++) {
	                const node = curr.getNode();
	                if (node.isDirectory()) {
	                    // Check we have permissions
	                    if (!node.canExecute() || !node.canWrite())
	                        throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'mkdir', filename);
	                }
	                else {
	                    throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'mkdir', filename);
	                }
	                created = true;
	                curr = curr.createChild(steps[i], this.createNode(fs_node_utils_1.constants.S_IFDIR | modeNum));
	                this.emit(new FsEvent_1.FsEvent(0 /* FsEventType.CREATE */, curr.steps, curr.getNode(), curr));
	            }
	            return created ? filename : undefined;
	        };
	        this.rmdir = (filename, recursive = false) => {
	            const link = this.getLinkAsDirOrThrow(filename, 'rmdir');
	            if (link.length && !recursive)
	                throw (0, util_1.createError)("ENOTEMPTY" /* ERROR_CODE.ENOTEMPTY */, 'rmdir', filename);
	            this._emitDeleteRecursive(link);
	            this.deleteLink(link);
	        };
	        this.rm = (filename, force = false, recursive = false) => {
	            // "stat" is used to match Node's native error message.
	            let link;
	            try {
	                link = this.getResolvedLinkOrThrow(filename, 'stat');
	            }
	            catch (err) {
	                // Silently ignore missing paths if force option is true
	                if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */ && force)
	                    return;
	                else
	                    throw err;
	            }
	            if (link.getNode().isDirectory() && !recursive)
	                throw (0, util_1.createError)("ERR_FS_EISDIR" /* ERROR_CODE.ERR_FS_EISDIR */, 'rm', filename);
	            if (!link.parent?.getNode().canWrite())
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'rm', filename);
	            this._emitDeleteRecursive(link);
	            this.deleteLink(link);
	        };
	        this.close = (fd) => {
	            (0, util_1.validateFd)(fd);
	            const file = this.getFileByFdOrThrow(fd, 'close');
	            this.closeFile(file);
	        };
	        this.ftruncate = (fd, len) => {
	            const file = this.getFileByFdOrThrow(fd, 'ftruncate');
	            file.truncate(len);
	            this.emit(new FsEvent_1.FsEvent(2 /* FsEventType.MODIFY */, file.link.steps, file.node, file.link));
	        };
	        this.fchmod = (fd, modeNum) => {
	            const file = this.getFileByFdOrThrow(fd, 'fchmod');
	            file.chmod(modeNum);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, file.link.steps, file.node, file.link));
	        };
	        this.chmod = (filename, modeNum) => {
	            const link = this.getResolvedLinkOrThrow(filename, 'chmod');
	            link.getNode().chmod(modeNum);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, link.steps, link.getNode(), link));
	        };
	        this.lchmod = (filename, modeNum) => {
	            const link = this.getLinkOrThrow(filename, 'lchmod');
	            link.getNode().chmod(modeNum);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, link.steps, link.getNode(), link));
	        };
	        this.fchown = (fd, uid, gid) => {
	            const file = this.getFileByFdOrThrow(fd, 'fchown');
	            file.chown(uid, gid);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, file.link.steps, file.node, file.link));
	        };
	        this.chown = (filename, uid, gid) => {
	            const link = this.getResolvedLinkOrThrow(filename, 'chown');
	            link.getNode().chown(uid, gid);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, link.steps, link.getNode(), link));
	        };
	        this.lchown = (filename, uid, gid) => {
	            const link = this.getLinkOrThrow(filename, 'lchown');
	            link.getNode().chown(uid, gid);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, link.steps, link.getNode(), link));
	        };
	        this.futimes = (fd, atime, mtime) => {
	            const file = this.getFileByFdOrThrow(fd, 'futimes');
	            const node = file.node;
	            node.atime = new Date(atime * 1000);
	            node.mtime = new Date(mtime * 1000);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, file.link.steps, file.node, file.link));
	        };
	        this.utimes = (filename, atime, mtime, followSymlinks = true) => {
	            const link = followSymlinks
	                ? this.getResolvedLinkOrThrow(filename, 'utimes')
	                : this.getLinkOrThrow(filename, 'lutimes');
	            const node = link.getNode();
	            node.atime = new Date(atime * 1000);
	            node.mtime = new Date(mtime * 1000);
	            this.emit(new FsEvent_1.FsEvent(3 /* FsEventType.ATTRIB */, link.steps, node, link));
	        };
	        this.process = opts.process ?? process_1.default;
	        const root = this.createLink();
	        root.setNode(this.createNode(fs_node_utils_1.constants.S_IFDIR | 0o777));
	        root.setChild('.', root);
	        root.getNode().nlink++;
	        root.setChild('..', root);
	        root.getNode().nlink++;
	        this.root = root;
	    }
	    emit(change) {
	        this.changes.emit(change);
	    }
	    createLink(parent, name, isDirectory = false, mode) {
	        if (!parent) {
	            return new Link_1.Link(this, void 0, '');
	        }
	        if (!name) {
	            throw new Error('createLink: name cannot be empty');
	        }
	        // If no explicit permission is provided, use defaults based on type
	        const finalPerm = mode ?? (isDirectory ? 0o777 : 0o666);
	        // To prevent making a breaking change, `mode` can also just be a permission number
	        // and the file type is set based on `isDirectory`
	        const hasFileType = mode && mode & fs_node_utils_1.constants.S_IFMT;
	        const modeType = hasFileType ? mode & fs_node_utils_1.constants.S_IFMT : isDirectory ? fs_node_utils_1.constants.S_IFDIR : fs_node_utils_1.constants.S_IFREG;
	        const finalMode = (finalPerm & ~fs_node_utils_1.constants.S_IFMT) | modeType;
	        return parent.createChild(name, this.createNode(finalMode));
	    }
	    deleteLink(link) {
	        const parent = link.parent;
	        if (parent) {
	            parent.deleteChild(link);
	            return true;
	        }
	        return false;
	    }
	    _emitDeleteRecursive(link) {
	        if (link.getNode().isDirectory()) {
	            for (const [name, child] of link.children.entries()) {
	                if (child && name !== '.' && name !== '..') {
	                    this._emitDeleteRecursive(child);
	                }
	            }
	        }
	        this.emit(new FsEvent_1.FsEvent(1 /* FsEventType.DELETE */, link.steps, link.getNode(), link));
	    }
	    newInoNumber() {
	        const releasedFd = this.releasedInos.pop();
	        if (releasedFd)
	            return releasedFd;
	        else {
	            this.ino = (this.ino + 1) % 0xffffffff;
	            return this.ino;
	        }
	    }
	    newFdNumber() {
	        const releasedFd = this.releasedFds.pop();
	        return typeof releasedFd === 'number' ? releasedFd : Superblock.fd--;
	    }
	    createNode(mode) {
	        const uid = this.process.getuid?.() ?? 0;
	        const gid = this.process.getgid?.() ?? 0;
	        const node = new Node_1.Node(this.newInoNumber(), mode, uid, gid);
	        this.inodes[node.ino] = node;
	        return node;
	    }
	    deleteNode(node) {
	        node.del();
	        delete this.inodes[node.ino];
	        this.releasedInos.push(node.ino);
	    }
	    walk(stepsOrFilenameOrLink, resolveSymlinks = false, checkExistence = false, checkAccess = false, funcName) {
	        let steps;
	        let filename;
	        if (stepsOrFilenameOrLink instanceof Link_1.Link) {
	            steps = stepsOrFilenameOrLink.steps;
	            filename = pathSep + steps.join(pathSep);
	        }
	        else if (typeof stepsOrFilenameOrLink === 'string') {
	            steps = (0, util_1.filenameToSteps)(stepsOrFilenameOrLink);
	            filename = stepsOrFilenameOrLink;
	        }
	        else {
	            steps = stepsOrFilenameOrLink;
	            filename = pathSep + steps.join(pathSep);
	        }
	        let curr = this.root;
	        let i = 0;
	        const uid = this.process.getuid?.() ?? 0;
	        const gid = this.process.getgid?.() ?? 0;
	        while (i < steps.length) {
	            let node = curr.getNode();
	            // Check access permissions if current link is a directory
	            if (node.isDirectory()) {
	                if (checkAccess && !node.canExecute(uid, gid)) {
	                    return (0, result_1.Err)((0, util_1.createStatError)("EACCES" /* ERROR_CODE.EACCES */, funcName, filename));
	                }
	            }
	            else {
	                if (i < steps.length - 1) {
	                    return (0, result_1.Err)((0, util_1.createStatError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, funcName, filename));
	                }
	            }
	            curr = curr.getChild(steps[i]) ?? null;
	            // Check existence of current link
	            if (!curr)
	                if (checkExistence) {
	                    return (0, result_1.Err)((0, util_1.createStatError)("ENOENT" /* ERROR_CODE.ENOENT */, funcName, filename));
	                }
	                else {
	                    return (0, result_1.Ok)(null);
	                }
	            node = curr?.getNode();
	            // Resolve symlink if we're resolving all symlinks OR if this is an intermediate path component
	            // This allows lstat to traverse through symlinks in intermediate directories while not resolving the final component
	            if (node.isSymlink() && (resolveSymlinks || i < steps.length - 1)) {
	                const resolvedPath = (0, path_1.isAbsolute)(node.symlink) ? node.symlink : pathJoin((0, path_1.dirname)(curr.getPath()), node.symlink); // Relative to symlink's parent
	                steps = (0, util_1.filenameToSteps)(resolvedPath).concat(steps.slice(i + 1));
	                curr = this.root;
	                i = 0;
	                continue;
	            }
	            // After resolving symlinks, check if it's not a directory and we still have more steps
	            // This handles the case where we try to traverse through a file
	            // Only do this check when we're doing filesystem operations (checkExistence = true)
	            if (checkExistence && !node.isDirectory() && i < steps.length - 1) {
	                // On Windows, use ENOENT for consistency with Node.js behavior
	                // On other platforms, use ENOTDIR which is more semantically correct
	                const errorCode = this.process.platform === 'win32' ? "ENOENT" /* ERROR_CODE.ENOENT */ : "ENOTDIR" /* ERROR_CODE.ENOTDIR */;
	                return (0, result_1.Err)((0, util_1.createStatError)(errorCode, funcName, filename));
	            }
	            i++;
	        }
	        return (0, result_1.Ok)(curr);
	    }
	    // Returns a `Link` (hard link) referenced by path "split" into steps.
	    getLink(steps) {
	        const result = this.walk(steps, false, false, false);
	        if (result.ok) {
	            return result.value;
	        }
	        throw result.err.toError();
	    }
	    // Just link `getLink`, but throws a correct user error, if link to found.
	    getLinkOrThrow(filename, funcName) {
	        const result = this.walk(filename, false, true, true, funcName);
	        if (result.ok) {
	            return result.value;
	        }
	        throw result.err.toError();
	    }
	    // Just like `getLink`, but also dereference/resolves symbolic links.
	    getResolvedLink(filenameOrSteps) {
	        const result = this.walk(filenameOrSteps, true, false, false);
	        if (result.ok) {
	            return result.value;
	        }
	        throw result.err.toError();
	    }
	    /**
	     * Just like `getLinkOrThrow`, but also dereference/resolves symbolic links.
	     */
	    getResolvedLinkOrThrow(filename, funcName) {
	        const result = this.walk(filename, true, true, true, funcName);
	        if (result.ok) {
	            return result.value;
	        }
	        throw result.err.toError();
	    }
	    getResolvedLinkResult(filename, funcName) {
	        const result = this.walk(filename, true, true, true, funcName);
	        if (result.ok) {
	            return (0, result_1.Ok)(result.value);
	        }
	        return result;
	    }
	    resolveSymlinks(link) {
	        return this.getResolvedLink(link.steps.slice(1));
	    }
	    /**
	     * Just like `getLinkOrThrow`, but also verifies that the link is a directory.
	     */
	    getLinkAsDirOrThrow(filename, funcName) {
	        const link = this.getLinkOrThrow(filename, funcName);
	        if (!link.getNode().isDirectory())
	            throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, funcName, filename);
	        return link;
	    }
	    // Get the immediate parent directory of the link.
	    getLinkParent(steps) {
	        return this.getLink(steps.slice(0, -1));
	    }
	    getLinkParentAsDirOrThrow(filenameOrSteps, funcName) {
	        const steps = (filenameOrSteps instanceof Array ? filenameOrSteps : (0, util_1.filenameToSteps)(filenameOrSteps)).slice(0, -1);
	        const filename = pathSep + steps.join(pathSep);
	        const link = this.getLinkOrThrow(filename, funcName);
	        if (!link.getNode().isDirectory())
	            throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, funcName, filename);
	        return link;
	    }
	    getFileByFd(fd) {
	        return this.fds[String(fd)];
	    }
	    getFileByFdOrThrow(fd, funcName) {
	        if (!(0, util_1.isFd)(fd))
	            throw TypeError(fs_node_utils_2.ERRSTR.FD);
	        const file = this.getFileByFd(fd);
	        if (!file)
	            throw (0, util_1.createError)("EBADF" /* ERROR_CODE.EBADF */, funcName);
	        return file;
	    }
	    _toJSON(link = this.root, json = {}, path, asBuffer) {
	        let isEmpty = true;
	        let children = link.children;
	        if (link.getNode().isFile()) {
	            children = new Map([[link.getName(), link.parent.getChild(link.getName())]]);
	            link = link.parent;
	        }
	        for (const name of children.keys()) {
	            if (name === '.' || name === '..') {
	                continue;
	            }
	            isEmpty = false;
	            const child = link.getChild(name);
	            if (!child) {
	                throw new Error('_toJSON: unexpected undefined');
	            }
	            const node = child.getNode();
	            if (node.isFile()) {
	                let filename = child.getPath();
	                if (path)
	                    filename = pathRelative(path, filename);
	                json[filename] = asBuffer ? node.getBuffer() : node.getString();
	            }
	            else if (node.isDirectory()) {
	                this._toJSON(child, json, path, asBuffer);
	            }
	        }
	        let dirPath = link.getPath();
	        if (path)
	            dirPath = pathRelative(path, dirPath);
	        if (dirPath && isEmpty) {
	            json[dirPath] = null;
	        }
	        return json;
	    }
	    toJSON(paths, json = {}, isRelative = false, asBuffer = false) {
	        const links = [];
	        if (paths) {
	            if (!Array.isArray(paths))
	                paths = [paths];
	            for (const path of paths) {
	                const filename = (0, util_1.pathToFilename)(path);
	                const link = this.getResolvedLink(filename);
	                if (!link)
	                    continue;
	                links.push(link);
	            }
	        }
	        else {
	            links.push(this.root);
	        }
	        if (!links.length)
	            return json;
	        for (const link of links)
	            this._toJSON(link, json, isRelative ? link.getPath() : '', asBuffer);
	        return json;
	    }
	    fromJSON(json, cwd = this.process.cwd()) {
	        for (let filename in json) {
	            const data = json[filename];
	            filename = (0, util_1.resolve)(filename, cwd);
	            if (typeof data === 'string' || data instanceof buffer_1.Buffer) {
	                const dir = (0, path_1.dirname)(filename);
	                this.mkdirp(dir, 511 /* MODE.DIR */);
	                const buffer = (0, util_1.dataToBuffer)(data);
	                this.writeFile(filename, buffer, fs_node_utils_2.FLAGS.w, 438 /* MODE.DEFAULT */);
	            }
	            else {
	                this.mkdirp(filename, 511 /* MODE.DIR */);
	            }
	        }
	    }
	    fromNestedJSON(json, cwd) {
	        this.fromJSON((0, json_1.flattenJSON)(json), cwd);
	    }
	    reset() {
	        this.ino = 0;
	        this.inodes = {};
	        this.releasedInos = [];
	        this.fds = {};
	        this.releasedFds = [];
	        this.openFiles = 0;
	        this.root = this.createLink();
	        this.root.setNode(this.createNode(fs_node_utils_1.constants.S_IFDIR | 0o777));
	    }
	    // Legacy interface
	    mountSync(mountpoint, json) {
	        this.fromJSON(json, mountpoint);
	    }
	    openLink(link, flagsNum, resolveSymlinks = true) {
	        if (this.openFiles >= this.maxFiles) {
	            // Too many open files.
	            throw (0, util_1.createError)("EMFILE" /* ERROR_CODE.EMFILE */, 'open', link.getPath());
	        }
	        // Resolve symlinks.
	        //
	        // @TODO: This should be superfluous. This method is only ever called by openFile(), which does its own symlink resolution
	        // prior to calling.
	        let realLink = link;
	        if (resolveSymlinks)
	            realLink = this.getResolvedLinkOrThrow(link.getPath(), 'open');
	        const node = realLink.getNode();
	        // Check whether node is a directory
	        if (node.isDirectory()) {
	            if ((flagsNum & (O_RDONLY | O_RDWR | O_WRONLY)) !== O_RDONLY)
	                throw (0, util_1.createError)("EISDIR" /* ERROR_CODE.EISDIR */, 'open', link.getPath());
	        }
	        else {
	            if (flagsNum & O_DIRECTORY)
	                throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'open', link.getPath());
	        }
	        // Check node permissions
	        // For read access: check if flags are O_RDONLY or O_RDWR (i.e., not only O_WRONLY)
	        if ((flagsNum & (O_RDONLY | O_RDWR | O_WRONLY)) !== O_WRONLY) {
	            if (!node.canRead()) {
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'open', link.getPath());
	            }
	        }
	        // For write access: check if flags are O_WRONLY or O_RDWR
	        if (flagsNum & (O_WRONLY | O_RDWR)) {
	            if (!node.canWrite()) {
	                throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'open', link.getPath());
	            }
	        }
	        const file = new File_1.File(link, node, flagsNum, this.newFdNumber());
	        this.fds[file.fd] = file;
	        this.openFiles++;
	        if (flagsNum & O_TRUNC) {
	            const hadContent = file.node.getSize() > 0;
	            file.truncate();
	            if (hadContent)
	                this.emit(new FsEvent_1.FsEvent(2 /* FsEventType.MODIFY */, file.link.steps, file.node, file.link));
	        }
	        return file;
	    }
	    openFile(filename, flagsNum, modeNum, resolveSymlinks = true) {
	        const steps = (0, util_1.filenameToSteps)(filename);
	        let link;
	        try {
	            link = resolveSymlinks ? this.getResolvedLinkOrThrow(filename, 'open') : this.getLinkOrThrow(filename, 'open');
	            // Check if file already existed when trying to create it exclusively (O_CREAT and O_EXCL flags are set).
	            // This is an error, see https://pubs.opengroup.org/onlinepubs/009695399/functions/open.html:
	            // "If O_CREAT and O_EXCL are set, open() shall fail if the file exists."
	            if (link && flagsNum & O_CREAT && flagsNum & O_EXCL)
	                throw (0, util_1.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'open', filename);
	        }
	        catch (err) {
	            // Try creating a new file, if it does not exist and O_CREAT flag is set.
	            // Note that this will still throw if the ENOENT came from one of the
	            // intermediate directories instead of the file itself.
	            if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */ && flagsNum & O_CREAT) {
	                const dirName = (0, path_1.dirname)(filename);
	                const dirLink = this.getResolvedLinkOrThrow(dirName);
	                const dirNode = dirLink.getNode();
	                // Check that the place we create the new file is actually a directory and that we are allowed to do so:
	                if (!dirNode.isDirectory())
	                    throw (0, util_1.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'open', filename);
	                if (!dirNode.canExecute() || !dirNode.canWrite())
	                    throw (0, util_1.createError)("EACCES" /* ERROR_CODE.EACCES */, 'open', filename);
	                // This is a difference to the original implementation, which would simply not create a file unless modeNum was specified.
	                // However, current Node versions will default to 0o666.
	                modeNum ?? (modeNum = 0o666);
	                link = this.createLink(dirLink, steps[steps.length - 1], false, modeNum);
	                this.emit(new FsEvent_1.FsEvent(0 /* FsEventType.CREATE */, link.steps, link.getNode(), link));
	            }
	            else
	                throw err;
	        }
	        if (link)
	            return this.openLink(link, flagsNum, resolveSymlinks);
	        throw (0, util_1.createError)("ENOENT" /* ERROR_CODE.ENOENT */, 'open', filename);
	    }
	    closeFile(file) {
	        if (!this.fds[file.fd])
	            return;
	        this.openFiles--;
	        delete this.fds[file.fd];
	        this.releasedFds.push(file.fd);
	    }
	    write(fd, buf, offset, length, position) {
	        const file = this.getFileByFdOrThrow(fd, 'write');
	        if (file.node.isSymlink()) {
	            throw (0, util_1.createError)("EBADF" /* ERROR_CODE.EBADF */, 'write', file.link.getPath());
	        }
	        const bytes = file.write(buf, offset, length, position === -1 || typeof position !== 'number' ? undefined : position);
	        if (bytes > 0)
	            this.emit(new FsEvent_1.FsEvent(2 /* FsEventType.MODIFY */, file.link.steps, file.node, file.link));
	        return bytes;
	    }
	};
	Superblock.Superblock = Superblock$1;
	/**
	 * Global file descriptor counter. UNIX file descriptors start from 0 and go sequentially
	 * up, so here, in order not to conflict with them, we choose some big number and descrease
	 * the file descriptor of every new opened file.
	 * @type {number}
	 * @todo This should not be static, right?
	 */
	Superblock$1.fd = 0x7fffffff;
	
	return Superblock;
}

var CoreWatcher = {};

var hasRequiredCoreWatcher;

function requireCoreWatcher () {
	if (hasRequiredCoreWatcher) return CoreWatcher;
	hasRequiredCoreWatcher = 1;
	Object.defineProperty(CoreWatcher, "__esModule", { value: true });
	CoreWatcher.CoreWatcher = CoreWatcher.CoreWatchEvent = void 0;
	const fanout_1 = requireFanout();
	/**
	 * A change event scoped to a {@link CoreWatcher} watch root. Unlike the
	 * volume-undefined {@link FsEvent}, `steps` (and `oldSteps`) are relative to the
	 * watch root; an empty `steps` array means the watch target itself changed.
	 */
	class CoreWatchEvent {
	    constructor(type, 
	    /** Path relative to the watch root, empty for the watch target itself. */
	    steps, node, link, 
	    /** Former path relative to the watch root, set only for in-scope moves. */
	    oldSteps = void 0) {
	        this.type = type;
	        this.steps = steps;
	        this.node = node;
	        this.link = link;
	        this.oldSteps = oldSteps;
	    }
	}
	CoreWatcher.CoreWatchEvent = CoreWatchEvent;
	/**
	 * Subscribes to a {@link Superblock} change stream and re-emits only the
	 * events that fall within the scope of one watched file or directory, with
	 * paths rewritten to be relative to the watch root.
	 *
	 * Scope-boundary crossing moves are translated: a move into scope is emitted
	 * as `CREATE`, a move out of scope as `DELETE`, and a move within scope stays
	 * a `MOVE` carrying relative `oldSteps`. A `MOVE` with empty `steps` means the
	 * watch target itself was renamed; watching continues at the new location
	 * (the current absolute path is always `watcher.link.steps`). A `DELETE` with
	 * empty `steps` is terminal: the watch target is gone and the watcher closes
	 * itself after delivering it.
	 */
	let CoreWatcher$1 = class CoreWatcher {
	    /** @throws ENOENT-style error when the watch target does not exist. */
	    constructor(core, path, opts = {}) {
	        /** Fan-out of scoped change events. Multiple consumers may subscribe. */
	        this.changes = new fanout_1.FanOut();
	        this.link = (opts.follow ?? true) ? core.getResolvedLinkOrThrow(path, 'watch') : core.getLinkOrThrow(path, 'watch');
	        this.node = this.link.getNode();
	        this.recursive = !!opts.recursive;
	        this.unsub = core.changes.listen(event => this.onEvent(event));
	    }
	    get closed() {
	        return !this.unsub;
	    }
	    onEvent(event) {
	        const rootLength = this.link.steps.length;
	        const isSelf = event.link === this.link ||
	            (event.node === this.node && (event.type === 2 /* FsEventType.MODIFY */ || event.type === 3 /* FsEventType.ATTRIB */));
	        if (isSelf) {
	            this.changes.emit(new CoreWatchEvent(event.type, [], event.node, this.link));
	            if (event.type === 1 /* FsEventType.DELETE */)
	                this.close();
	            return;
	        }
	        if (event.type === 4 /* FsEventType.MOVE */) {
	            const from = event.oldSteps && this.inScope(event.oldSteps) ? event.oldSteps.slice(rootLength) : undefined;
	            const to = this.inScope(event.steps) ? event.steps.slice(rootLength) : undefined;
	            if (from && to)
	                this.changes.emit(new CoreWatchEvent(4 /* FsEventType.MOVE */, to, event.node, event.link, from));
	            else if (from)
	                this.changes.emit(new CoreWatchEvent(1 /* FsEventType.DELETE */, from, event.node, event.link));
	            else if (to)
	                this.changes.emit(new CoreWatchEvent(0 /* FsEventType.CREATE */, to, event.node, event.link));
	            return;
	        }
	        if (this.inScope(event.steps))
	            this.changes.emit(new CoreWatchEvent(event.type, event.steps.slice(rootLength), event.node, event.link));
	    }
	    inScope(steps) {
	        const root = this.link.steps;
	        if (steps.length <= root.length)
	            return false;
	        if (!this.recursive && steps.length !== root.length + 1)
	            return false;
	        for (let i = 0; i < root.length; i++)
	            if (steps[i] !== root[i])
	                return false;
	        return true;
	    }
	    /** Stop watching and unsubscribe from the volume change stream. */
	    close() {
	        this.unsub?.();
	        this.unsub = undefined;
	    }
	};
	CoreWatcher.CoreWatcher = CoreWatcher$1;
	
	return CoreWatcher;
}

var hasRequiredLib$5;

function requireLib$5 () {
	if (hasRequiredLib$5) return lib$6;
	hasRequiredLib$5 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.resolve = exports.pathToFilename = exports.createStatError = exports.createError = exports.validateFd = exports.isFd = exports.filenameToSteps = exports.dataToBuffer = exports.Superblock = exports.File = exports.Link = exports.Node = void 0;
		const tslib_1 = require$$0$2;
		tslib_1.__exportStar(requireTypes$1(), exports);
		tslib_1.__exportStar(requireJson$1(), exports);
		tslib_1.__exportStar(requireConstants$3(), exports);
		tslib_1.__exportStar(requireResult(), exports);
		var Node_1 = requireNode();
		Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return Node_1.Node; } });
		var Link_1 = requireLink();
		Object.defineProperty(exports, "Link", { enumerable: true, get: function () { return Link_1.Link; } });
		var File_1 = requireFile();
		Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_1.File; } });
		var Superblock_1 = requireSuperblock();
		Object.defineProperty(exports, "Superblock", { enumerable: true, get: function () { return Superblock_1.Superblock; } });
		tslib_1.__exportStar(requireFsEvent(), exports);
		tslib_1.__exportStar(requireCoreWatcher(), exports);
		var util_1 = requireUtil$3();
		Object.defineProperty(exports, "dataToBuffer", { enumerable: true, get: function () { return util_1.dataToBuffer; } });
		Object.defineProperty(exports, "filenameToSteps", { enumerable: true, get: function () { return util_1.filenameToSteps; } });
		Object.defineProperty(exports, "isFd", { enumerable: true, get: function () { return util_1.isFd; } });
		Object.defineProperty(exports, "validateFd", { enumerable: true, get: function () { return util_1.validateFd; } });
		Object.defineProperty(exports, "createError", { enumerable: true, get: function () { return util_1.createError; } });
		Object.defineProperty(exports, "createStatError", { enumerable: true, get: function () { return util_1.createStatError; } });
		Object.defineProperty(exports, "pathToFilename", { enumerable: true, get: function () { return util_1.pathToFilename; } });
		Object.defineProperty(exports, "resolve", { enumerable: true, get: function () { return util_1.resolve; } });
		
	} (lib$6));
	return lib$6;
}

var Stats = {};

var hasRequiredStats;

function requireStats () {
	if (hasRequiredStats) return Stats;
	hasRequiredStats = 1;
	Object.defineProperty(Stats, "__esModule", { value: true });
	Stats.Stats = void 0;
	const fs_node_utils_1 = requireLib$7();
	const { S_IFMT, S_IFDIR, S_IFREG, S_IFBLK, S_IFCHR, S_IFLNK, S_IFIFO, S_IFSOCK } = fs_node_utils_1.constants;
	/**
	 * Statistics about a file/directory, like `fs.Stats`.
	 */
	let Stats$1 = class Stats {
	    static build(node, bigint = false) {
	        const stats = new Stats();
	        const { uid, gid, atime, mtime, ctime } = node;
	        const getStatNumber = !bigint ? number => number : number => BigInt(number);
	        // Copy all values on Stats from Node, so that if Node values
	        // change, values on Stats would still be the old ones,
	        // just like in Node fs.
	        stats.uid = getStatNumber(uid);
	        stats.gid = getStatNumber(gid);
	        stats.rdev = getStatNumber(node.rdev);
	        stats.blksize = getStatNumber(4096);
	        stats.ino = getStatNumber(node.ino);
	        stats.size = getStatNumber(node.getSize());
	        stats.blocks = getStatNumber(1);
	        stats.atime = atime;
	        stats.mtime = mtime;
	        stats.ctime = ctime;
	        stats.birthtime = ctime;
	        stats.atimeMs = getStatNumber(atime.getTime());
	        stats.mtimeMs = getStatNumber(mtime.getTime());
	        const ctimeMs = getStatNumber(ctime.getTime());
	        stats.ctimeMs = ctimeMs;
	        stats.birthtimeMs = ctimeMs;
	        if (bigint) {
	            stats.atimeNs = BigInt(atime.getTime()) * BigInt(1000000);
	            stats.mtimeNs = BigInt(mtime.getTime()) * BigInt(1000000);
	            const ctimeNs = BigInt(ctime.getTime()) * BigInt(1000000);
	            stats.ctimeNs = ctimeNs;
	            stats.birthtimeNs = ctimeNs;
	        }
	        stats.dev = getStatNumber(0);
	        stats.mode = getStatNumber(node.mode);
	        stats.nlink = getStatNumber(node.nlink);
	        return stats;
	    }
	    _checkModeProperty(property) {
	        return (Number(this.mode) & S_IFMT) === property;
	    }
	    isDirectory() {
	        return this._checkModeProperty(S_IFDIR);
	    }
	    isFile() {
	        return this._checkModeProperty(S_IFREG);
	    }
	    isBlockDevice() {
	        return this._checkModeProperty(S_IFBLK);
	    }
	    isCharacterDevice() {
	        return this._checkModeProperty(S_IFCHR);
	    }
	    isSymbolicLink() {
	        return this._checkModeProperty(S_IFLNK);
	    }
	    isFIFO() {
	        return this._checkModeProperty(S_IFIFO);
	    }
	    isSocket() {
	        return this._checkModeProperty(S_IFSOCK);
	    }
	};
	Stats.Stats = Stats$1;
	Stats.default = Stats$1;
	
	return Stats;
}

var Dirent = {};

var hasRequiredDirent;

function requireDirent () {
	if (hasRequiredDirent) return Dirent;
	hasRequiredDirent = 1;
	Object.defineProperty(Dirent, "__esModule", { value: true });
	Dirent.Dirent = void 0;
	const fs_node_utils_1 = requireLib$7();
	const { S_IFMT, S_IFDIR, S_IFREG, S_IFBLK, S_IFCHR, S_IFLNK, S_IFIFO, S_IFSOCK } = fs_node_utils_1.constants;
	/**
	 * A directory entry, like `fs.Dirent`.
	 */
	let Dirent$1 = class Dirent {
	    constructor() {
	        this.name = '';
	        this.parentPath = '';
	        this.mode = 0;
	        /**
	         * @deprecated Will be removed at any time.
	         * @see https://nodejs.org/api/deprecations.html#DEP0178
	         */
	        this.path = '';
	    }
	    static build(link, encoding) {
	        const dirent = new Dirent();
	        const { mode } = link.getNode();
	        dirent.name = (0, fs_node_utils_1.strToEncoding)(link.getName(), encoding);
	        dirent.mode = mode;
	        dirent.parentPath = link.getParentPath();
	        dirent.path = dirent.parentPath;
	        return dirent;
	    }
	    _checkModeProperty(property) {
	        return (this.mode & S_IFMT) === property;
	    }
	    isDirectory() {
	        return this._checkModeProperty(S_IFDIR);
	    }
	    isFile() {
	        return this._checkModeProperty(S_IFREG);
	    }
	    isBlockDevice() {
	        return this._checkModeProperty(S_IFBLK);
	    }
	    isCharacterDevice() {
	        return this._checkModeProperty(S_IFCHR);
	    }
	    isSymbolicLink() {
	        return this._checkModeProperty(S_IFLNK);
	    }
	    isFIFO() {
	        return this._checkModeProperty(S_IFIFO);
	    }
	    isSocket() {
	        return this._checkModeProperty(S_IFSOCK);
	    }
	};
	Dirent.Dirent = Dirent$1;
	Dirent.default = Dirent$1;
	
	return Dirent;
}

var StatFs = {};

var hasRequiredStatFs;

function requireStatFs () {
	if (hasRequiredStatFs) return StatFs;
	hasRequiredStatFs = 1;
	Object.defineProperty(StatFs, "__esModule", { value: true });
	StatFs.StatFs = void 0;
	/**
	 * Statistics about a file system, like `fs.StatFs`.
	 */
	let StatFs$1 = class StatFs {
	    static build(superblock, bigint = false) {
	        const statfs = new StatFs();
	        const getStatNumber = !bigint ? number => number : number => BigInt(number);
	        // For in-memory filesystem, provide mock but reasonable values
	        // Magic number for in-memory filesystem type (similar to ramfs)
	        statfs.type = getStatNumber(0x858458f6);
	        // Optimal transfer block size - commonly 4096 bytes
	        statfs.bsize = getStatNumber(4096);
	        // Calculate filesystem stats based on current state
	        const totalInodes = Object.keys(superblock.inodes).length;
	        // Mock large filesystem capacity (appears as a large filesystem to applications)
	        const totalBlocks = 1000000;
	        const usedBlocks = Math.min(totalInodes * 2, totalBlocks); // Rough estimation
	        const freeBlocks = totalBlocks - usedBlocks;
	        statfs.blocks = getStatNumber(totalBlocks); // Total data blocks
	        statfs.bfree = getStatNumber(freeBlocks); // Free blocks in file system
	        statfs.bavail = getStatNumber(freeBlocks); // Free blocks available to unprivileged users
	        // File node statistics
	        const maxFiles = 1000000; // Mock large number of available inodes
	        statfs.files = getStatNumber(maxFiles); // Total file nodes in file system
	        statfs.ffree = getStatNumber(maxFiles - totalInodes); // Free file nodes
	        return statfs;
	    }
	};
	StatFs.StatFs = StatFs$1;
	StatFs.default = StatFs$1;
	
	return StatFs;
}

var setTimeoutUnref = {};

var hasRequiredSetTimeoutUnref;

function requireSetTimeoutUnref () {
	if (hasRequiredSetTimeoutUnref) return setTimeoutUnref;
	hasRequiredSetTimeoutUnref = 1;
	Object.defineProperty(setTimeoutUnref, "__esModule", { value: true });
	/**
	 * `setTimeoutUnref` is just like `setTimeout`,
	 * only in Node's environment it will "unref" its macro task.
	 */
	function setTimeoutUnref$1(callback, time, args) {
	    const ref = setTimeout.apply(typeof globalThis !== 'undefined' ? globalThis : commonjsGlobal, arguments);
	    if (ref && typeof ref === 'object' && typeof ref.unref === 'function')
	        ref.unref();
	    return ref;
	}
	setTimeoutUnref.default = setTimeoutUnref$1;
	
	return setTimeoutUnref;
}

var stream$1 = {};

var browser$1 = {exports: {}};

var stream = {exports: {}};

var primordials;
var hasRequiredPrimordials;

function requirePrimordials () {
	if (hasRequiredPrimordials) return primordials;
	hasRequiredPrimordials = 1;

	/*
	  This file is a reduced and adapted version of the main lib/internal/per_context/primordials.js file defined at

	  https://github.com/nodejs/node/blob/main/lib/internal/per_context/primordials.js

	  Don't try to replace with the original file and keep it up to date with the upstream file.
	*/

	// This is a simplified version of AggregateError
	class AggregateError extends Error {
	  constructor(errors) {
	    if (!Array.isArray(errors)) {
	      throw new TypeError(`Expected input to be an Array, got ${typeof errors}`)
	    }
	    let message = '';
	    for (let i = 0; i < errors.length; i++) {
	      message += `    ${errors[i].stack}\n`;
	    }
	    super(message);
	    this.name = 'AggregateError';
	    this.errors = errors;
	  }
	}
	primordials = {
	  AggregateError,
	  ArrayIsArray(self) {
	    return Array.isArray(self)
	  },
	  ArrayPrototypeIncludes(self, el) {
	    return self.includes(el)
	  },
	  ArrayPrototypeIndexOf(self, el) {
	    return self.indexOf(el)
	  },
	  ArrayPrototypeJoin(self, sep) {
	    return self.join(sep)
	  },
	  ArrayPrototypeMap(self, fn) {
	    return self.map(fn)
	  },
	  ArrayPrototypePop(self, el) {
	    return self.pop(el)
	  },
	  ArrayPrototypePush(self, el) {
	    return self.push(el)
	  },
	  ArrayPrototypeSlice(self, start, end) {
	    return self.slice(start, end)
	  },
	  Error,
	  FunctionPrototypeCall(fn, thisArgs, ...args) {
	    return fn.call(thisArgs, ...args)
	  },
	  FunctionPrototypeSymbolHasInstance(self, instance) {
	    return Function.prototype[Symbol.hasInstance].call(self, instance)
	  },
	  MathFloor: Math.floor,
	  Number,
	  NumberIsInteger: Number.isInteger,
	  NumberIsNaN: Number.isNaN,
	  NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
	  NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
	  NumberParseInt: Number.parseInt,
	  ObjectDefineProperties(self, props) {
	    return Object.defineProperties(self, props)
	  },
	  ObjectDefineProperty(self, name, prop) {
	    return Object.defineProperty(self, name, prop)
	  },
	  ObjectGetOwnPropertyDescriptor(self, name) {
	    return Object.getOwnPropertyDescriptor(self, name)
	  },
	  ObjectKeys(obj) {
	    return Object.keys(obj)
	  },
	  ObjectSetPrototypeOf(target, proto) {
	    return Object.setPrototypeOf(target, proto)
	  },
	  Promise,
	  PromisePrototypeCatch(self, fn) {
	    return self.catch(fn)
	  },
	  PromisePrototypeThen(self, thenFn, catchFn) {
	    return self.then(thenFn, catchFn)
	  },
	  PromiseReject(err) {
	    return Promise.reject(err)
	  },
	  PromiseResolve(val) {
	    return Promise.resolve(val)
	  },
	  ReflectApply: Reflect.apply,
	  RegExpPrototypeTest(self, value) {
	    return self.test(value)
	  },
	  SafeSet: Set,
	  String,
	  StringPrototypeSlice(self, start, end) {
	    return self.slice(start, end)
	  },
	  StringPrototypeToLowerCase(self) {
	    return self.toLowerCase()
	  },
	  StringPrototypeToUpperCase(self) {
	    return self.toUpperCase()
	  },
	  StringPrototypeTrim(self) {
	    return self.trim()
	  },
	  Symbol,
	  SymbolFor: Symbol.for,
	  SymbolAsyncIterator: Symbol.asyncIterator,
	  SymbolHasInstance: Symbol.hasInstance,
	  SymbolIterator: Symbol.iterator,
	  SymbolDispose: Symbol.dispose || Symbol('Symbol.dispose'),
	  SymbolAsyncDispose: Symbol.asyncDispose || Symbol('Symbol.asyncDispose'),
	  TypedArrayPrototypeSet(self, buf, len) {
	    return self.set(buf, len)
	  },
	  Boolean,
	  Uint8Array
	};
	return primordials;
}

var util$2 = {exports: {}};

var inspect;
var hasRequiredInspect;

function requireInspect () {
	if (hasRequiredInspect) return inspect;
	hasRequiredInspect = 1;

	/*
	  This file is a reduced and adapted version of the main lib/internal/util/inspect.js file defined at

	  https://github.com/nodejs/node/blob/main/lib/internal/util/inspect.js

	  Don't try to replace with the original file and keep it up to date with the upstream file.
	*/
	inspect = {
	  format(format, ...args) {
	    // Simplified version of https://nodejs.org/api/util.html#utilformatformat-args
	    return format.replace(/%([sdifj])/g, function (...[_unused, type]) {
	      const replacement = args.shift();
	      if (type === 'f') {
	        return replacement.toFixed(6)
	      } else if (type === 'j') {
	        return JSON.stringify(replacement)
	      } else if (type === 's' && typeof replacement === 'object') {
	        const ctor = replacement.constructor !== Object ? replacement.constructor.name : '';
	        return `${ctor} {}`.trim()
	      } else {
	        return replacement.toString()
	      }
	    })
	  },
	  inspect(value) {
	    // Vastly simplified version of https://nodejs.org/api/util.html#utilinspectobject-options
	    switch (typeof value) {
	      case 'string':
	        if (value.includes("'")) {
	          if (!value.includes('"')) {
	            return `"${value}"`
	          } else if (!value.includes('`') && !value.includes('${')) {
	            return `\`${value}\``
	          }
	        }
	        return `'${value}'`
	      case 'number':
	        if (isNaN(value)) {
	          return 'NaN'
	        } else if (Object.is(value, -0)) {
	          return String(value)
	        }
	        return value
	      case 'bigint':
	        return `${String(value)}n`
	      case 'boolean':
	      case 'undefined':
	        return String(value)
	      case 'object':
	        return '{}'
	    }
	  }
	};
	return inspect;
}

var errors;
var hasRequiredErrors;

function requireErrors () {
	if (hasRequiredErrors) return errors;
	hasRequiredErrors = 1;

	const { format, inspect } = requireInspect();
	const { AggregateError: CustomAggregateError } = requirePrimordials();

	/*
	  This file is a reduced and adapted version of the main lib/internal/errors.js file defined at

	  https://github.com/nodejs/node/blob/main/lib/internal/errors.js

	  Don't try to replace with the original file and keep it up to date (starting from E(...) definitions)
	  with the upstream file.
	*/

	const AggregateError = globalThis.AggregateError || CustomAggregateError;
	const kIsNodeError = Symbol('kIsNodeError');
	const kTypes = [
	  'string',
	  'function',
	  'number',
	  'object',
	  // Accept 'Function' and 'Object' as alternative to the lower cased version.
	  'Function',
	  'Object',
	  'boolean',
	  'bigint',
	  'symbol'
	];
	const classRegExp = /^([A-Z][a-z0-9]*)+$/;
	const nodeInternalPrefix = '__node_internal_';
	const codes = {};
	function assert(value, message) {
	  if (!value) {
	    throw new codes.ERR_INTERNAL_ASSERTION(message)
	  }
	}

	// Only use this for integers! Decimal numbers do not work with this function.
	function addNumericalSeparator(val) {
	  let res = '';
	  let i = val.length;
	  const start = val[0] === '-' ? 1 : 0;
	  for (; i >= start + 4; i -= 3) {
	    res = `_${val.slice(i - 3, i)}${res}`;
	  }
	  return `${val.slice(0, i)}${res}`
	}
	function getMessage(key, msg, args) {
	  if (typeof msg === 'function') {
	    assert(
	      msg.length <= args.length,
	      // Default options do not count.
	      `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
	    );
	    return msg(...args)
	  }
	  const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
	  assert(
	    expectedLength === args.length,
	    `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
	  );
	  if (args.length === 0) {
	    return msg
	  }
	  return format(msg, ...args)
	}
	function E(code, message, Base) {
	  if (!Base) {
	    Base = Error;
	  }
	  class NodeError extends Base {
	    constructor(...args) {
	      super(getMessage(code, message, args));
	    }
	    toString() {
	      return `${this.name} [${code}]: ${this.message}`
	    }
	  }
	  Object.defineProperties(NodeError.prototype, {
	    name: {
	      value: Base.name,
	      writable: true,
	      enumerable: false,
	      configurable: true
	    },
	    toString: {
	      value() {
	        return `${this.name} [${code}]: ${this.message}`
	      },
	      writable: true,
	      enumerable: false,
	      configurable: true
	    }
	  });
	  NodeError.prototype.code = code;
	  NodeError.prototype[kIsNodeError] = true;
	  codes[code] = NodeError;
	}
	function hideStackFrames(fn) {
	  // We rename the functions that will be hidden to cut off the stacktrace
	  // at the outermost one
	  const hidden = nodeInternalPrefix + fn.name;
	  Object.defineProperty(fn, 'name', {
	    value: hidden
	  });
	  return fn
	}
	function aggregateTwoErrors(innerError, outerError) {
	  if (innerError && outerError && innerError !== outerError) {
	    if (Array.isArray(outerError.errors)) {
	      // If `outerError` is already an `AggregateError`.
	      outerError.errors.push(innerError);
	      return outerError
	    }
	    const err = new AggregateError([outerError, innerError], outerError.message);
	    err.code = outerError.code;
	    return err
	  }
	  return innerError || outerError
	}
	class AbortError extends Error {
	  constructor(message = 'The operation was aborted', options = undefined) {
	    if (options !== undefined && typeof options !== 'object') {
	      throw new codes.ERR_INVALID_ARG_TYPE('options', 'Object', options)
	    }
	    super(message, options);
	    this.code = 'ABORT_ERR';
	    this.name = 'AbortError';
	  }
	}
	E('ERR_ASSERTION', '%s', Error);
	E(
	  'ERR_INVALID_ARG_TYPE',
	  (name, expected, actual) => {
	    assert(typeof name === 'string', "'name' must be a string");
	    if (!Array.isArray(expected)) {
	      expected = [expected];
	    }
	    let msg = 'The ';
	    if (name.endsWith(' argument')) {
	      // For cases like 'first argument'
	      msg += `${name} `;
	    } else {
	      msg += `"${name}" ${name.includes('.') ? 'property' : 'argument'} `;
	    }
	    msg += 'must be ';
	    const types = [];
	    const instances = [];
	    const other = [];
	    for (const value of expected) {
	      assert(typeof value === 'string', 'All expected entries have to be of type string');
	      if (kTypes.includes(value)) {
	        types.push(value.toLowerCase());
	      } else if (classRegExp.test(value)) {
	        instances.push(value);
	      } else {
	        assert(value !== 'object', 'The value "object" should be written as "Object"');
	        other.push(value);
	      }
	    }

	    // Special handle `object` in case other instances are allowed to outline
	    // the differences between each other.
	    if (instances.length > 0) {
	      const pos = types.indexOf('object');
	      if (pos !== -1) {
	        types.splice(types, pos, 1);
	        instances.push('Object');
	      }
	    }
	    if (types.length > 0) {
	      switch (types.length) {
	        case 1:
	          msg += `of type ${types[0]}`;
	          break
	        case 2:
	          msg += `one of type ${types[0]} or ${types[1]}`;
	          break
	        default: {
	          const last = types.pop();
	          msg += `one of type ${types.join(', ')}, or ${last}`;
	        }
	      }
	      if (instances.length > 0 || other.length > 0) {
	        msg += ' or ';
	      }
	    }
	    if (instances.length > 0) {
	      switch (instances.length) {
	        case 1:
	          msg += `an instance of ${instances[0]}`;
	          break
	        case 2:
	          msg += `an instance of ${instances[0]} or ${instances[1]}`;
	          break
	        default: {
	          const last = instances.pop();
	          msg += `an instance of ${instances.join(', ')}, or ${last}`;
	        }
	      }
	      if (other.length > 0) {
	        msg += ' or ';
	      }
	    }
	    switch (other.length) {
	      case 0:
	        break
	      case 1:
	        if (other[0].toLowerCase() !== other[0]) {
	          msg += 'an ';
	        }
	        msg += `${other[0]}`;
	        break
	      case 2:
	        msg += `one of ${other[0]} or ${other[1]}`;
	        break
	      default: {
	        const last = other.pop();
	        msg += `one of ${other.join(', ')}, or ${last}`;
	      }
	    }
	    if (actual == null) {
	      msg += `. Received ${actual}`;
	    } else if (typeof actual === 'function' && actual.name) {
	      msg += `. Received function ${actual.name}`;
	    } else if (typeof actual === 'object') {
	      var _actual$constructor;
	      if (
	        (_actual$constructor = actual.constructor) !== null &&
	        _actual$constructor !== undefined &&
	        _actual$constructor.name
	      ) {
	        msg += `. Received an instance of ${actual.constructor.name}`;
	      } else {
	        const inspected = inspect(actual, {
	          depth: -1
	        });
	        msg += `. Received ${inspected}`;
	      }
	    } else {
	      let inspected = inspect(actual, {
	        colors: false
	      });
	      if (inspected.length > 25) {
	        inspected = `${inspected.slice(0, 25)}...`;
	      }
	      msg += `. Received type ${typeof actual} (${inspected})`;
	    }
	    return msg
	  },
	  TypeError
	);
	E(
	  'ERR_INVALID_ARG_VALUE',
	  (name, value, reason = 'is invalid') => {
	    let inspected = inspect(value);
	    if (inspected.length > 128) {
	      inspected = inspected.slice(0, 128) + '...';
	    }
	    const type = name.includes('.') ? 'property' : 'argument';
	    return `The ${type} '${name}' ${reason}. Received ${inspected}`
	  },
	  TypeError
	);
	E(
	  'ERR_INVALID_RETURN_VALUE',
	  (input, name, value) => {
	    var _value$constructor;
	    const type =
	      value !== null &&
	      value !== undefined &&
	      (_value$constructor = value.constructor) !== null &&
	      _value$constructor !== undefined &&
	      _value$constructor.name
	        ? `instance of ${value.constructor.name}`
	        : `type ${typeof value}`;
	    return `Expected ${input} to be returned from the "${name}"` + ` function but got ${type}.`
	  },
	  TypeError
	);
	E(
	  'ERR_MISSING_ARGS',
	  (...args) => {
	    assert(args.length > 0, 'At least one arg needs to be specified');
	    let msg;
	    const len = args.length;
	    args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(' or ');
	    switch (len) {
	      case 1:
	        msg += `The ${args[0]} argument`;
	        break
	      case 2:
	        msg += `The ${args[0]} and ${args[1]} arguments`;
	        break
	      default:
	        {
	          const last = args.pop();
	          msg += `The ${args.join(', ')}, and ${last} arguments`;
	        }
	        break
	    }
	    return `${msg} must be specified`
	  },
	  TypeError
	);
	E(
	  'ERR_OUT_OF_RANGE',
	  (str, range, input) => {
	    assert(range, 'Missing "range" argument');
	    let received;
	    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
	      received = addNumericalSeparator(String(input));
	    } else if (typeof input === 'bigint') {
	      received = String(input);
	      const limit = BigInt(2) ** BigInt(32);
	      if (input > limit || input < -limit) {
	        received = addNumericalSeparator(received);
	      }
	      received += 'n';
	    } else {
	      received = inspect(input);
	    }
	    return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`
	  },
	  RangeError
	);
	E('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times', Error);
	E('ERR_METHOD_NOT_IMPLEMENTED', 'The %s method is not implemented', Error);
	E('ERR_STREAM_ALREADY_FINISHED', 'Cannot call %s after a stream was finished', Error);
	E('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable', Error);
	E('ERR_STREAM_DESTROYED', 'Cannot call %s after a stream was destroyed', Error);
	E('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
	E('ERR_STREAM_PREMATURE_CLOSE', 'Premature close', Error);
	E('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF', Error);
	E('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event', Error);
	E('ERR_STREAM_WRITE_AFTER_END', 'write after end', Error);
	E('ERR_UNKNOWN_ENCODING', 'Unknown encoding: %s', TypeError);
	errors = {
	  AbortError,
	  aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
	  hideStackFrames,
	  codes
	};
	return errors;
}

var browser = {exports: {}};

/*globals self, window */

var hasRequiredBrowser$1;

function requireBrowser$1 () {
	if (hasRequiredBrowser$1) return browser.exports;
	hasRequiredBrowser$1 = 1;

	/*eslint-disable @mysticatea/prettier */
	const { AbortController, AbortSignal } =
	    typeof self !== "undefined" ? self :
	    typeof window !== "undefined" ? window :
	    /* otherwise */ undefined;
	/*eslint-enable @mysticatea/prettier */

	browser.exports = AbortController;
	browser.exports.AbortSignal = AbortSignal;
	browser.exports.default = AbortController;
	return browser.exports;
}

var events$1 = {exports: {}};

var hasRequiredEvents$1;

function requireEvents$1 () {
	if (hasRequiredEvents$1) return events$1.exports;
	hasRequiredEvents$1 = 1;

	var R = typeof Reflect === 'object' ? Reflect : null;
	var ReflectApply = R && typeof R.apply === 'function'
	  ? R.apply
	  : function ReflectApply(target, receiver, args) {
	    return Function.prototype.apply.call(target, receiver, args);
	  };

	var ReflectOwnKeys;
	if (R && typeof R.ownKeys === 'function') {
	  ReflectOwnKeys = R.ownKeys;
	} else if (Object.getOwnPropertySymbols) {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target)
	      .concat(Object.getOwnPropertySymbols(target));
	  };
	} else {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target);
	  };
	}

	function ProcessEmitWarning(warning) {
	  if (console && console.warn) console.warn(warning);
	}

	var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
	  return value !== value;
	};

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}
	events$1.exports = EventEmitter;
	events$1.exports.once = once;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._eventsCount = 0;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	var defaultMaxListeners = 10;

	function checkListener(listener) {
	  if (typeof listener !== 'function') {
	    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	  }
	}

	Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
	  enumerable: true,
	  get: function() {
	    return defaultMaxListeners;
	  },
	  set: function(arg) {
	    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
	      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
	    }
	    defaultMaxListeners = arg;
	  }
	});

	EventEmitter.init = function() {

	  if (this._events === undefined ||
	      this._events === Object.getPrototypeOf(this)._events) {
	    this._events = Object.create(null);
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
	    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
	  }
	  this._maxListeners = n;
	  return this;
	};

	function _getMaxListeners(that) {
	  if (that._maxListeners === undefined)
	    return EventEmitter.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	  return _getMaxListeners(this);
	};

	EventEmitter.prototype.emit = function emit(type) {
	  var args = [];
	  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
	  var doError = (type === 'error');

	  var events = this._events;
	  if (events !== undefined)
	    doError = (doError && events.error === undefined);
	  else if (!doError)
	    return false;

	  // If there is no 'error' event listener then throw.
	  if (doError) {
	    var er;
	    if (args.length > 0)
	      er = args[0];
	    if (er instanceof Error) {
	      // Note: The comments on the `throw` lines are intentional, they show
	      // up in Node's output if this results in an unhandled exception.
	      throw er; // Unhandled 'error' event
	    }
	    // At least give some kind of context to the user
	    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
	    err.context = er;
	    throw err; // Unhandled 'error' event
	  }

	  var handler = events[type];

	  if (handler === undefined)
	    return false;

	  if (typeof handler === 'function') {
	    ReflectApply(handler, this, args);
	  } else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      ReflectApply(listeners[i], this, args);
	  }

	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;

	  checkListener(listener);

	  events = target._events;
	  if (events === undefined) {
	    events = target._events = Object.create(null);
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener !== undefined) {
	      target.emit('newListener', type,
	                  listener.listener ? listener.listener : listener);

	      // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object
	      events = target._events;
	    }
	    existing = events[type];
	  }

	  if (existing === undefined) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] =
	        prepend ? [listener, existing] : [existing, listener];
	      // If we've already got an array, just append.
	    } else if (prepend) {
	      existing.unshift(listener);
	    } else {
	      existing.push(listener);
	    }

	    // Check for listener leak
	    m = _getMaxListeners(target);
	    if (m > 0 && existing.length > m && !existing.warned) {
	      existing.warned = true;
	      // No error code for this since it is a Warning
	      // eslint-disable-next-line no-restricted-syntax
	      var w = new Error('Possible EventEmitter memory leak detected. ' +
	                          existing.length + ' ' + String(type) + ' listeners ' +
	                          'added. Use emitter.setMaxListeners() to ' +
	                          'increase limit');
	      w.name = 'MaxListenersExceededWarning';
	      w.emitter = target;
	      w.type = type;
	      w.count = existing.length;
	      ProcessEmitWarning(w);
	    }
	  }

	  return target;
	}

	EventEmitter.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener =
	    function prependListener(type, listener) {
	      return _addListener(this, type, listener, true);
	    };

	function onceWrapper() {
	  if (!this.fired) {
	    this.target.removeListener(this.type, this.wrapFn);
	    this.fired = true;
	    if (arguments.length === 0)
	      return this.listener.call(this.target);
	    return this.listener.apply(this.target, arguments);
	  }
	}

	function _onceWrap(target, type, listener) {
	  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
	  var wrapped = onceWrapper.bind(state);
	  wrapped.listener = listener;
	  state.wrapFn = wrapped;
	  return wrapped;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	  checkListener(listener);
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	      checkListener(listener);
	      this.prependListener(type, _onceWrap(this, type, listener));
	      return this;
	    };

	// Emits a 'removeListener' event if and only if the listener was removed.
	EventEmitter.prototype.removeListener =
	    function removeListener(type, listener) {
	      var list, events, position, i, originalListener;

	      checkListener(listener);

	      events = this._events;
	      if (events === undefined)
	        return this;

	      list = events[type];
	      if (list === undefined)
	        return this;

	      if (list === listener || list.listener === listener) {
	        if (--this._eventsCount === 0)
	          this._events = Object.create(null);
	        else {
	          delete events[type];
	          if (events.removeListener)
	            this.emit('removeListener', type, list.listener || listener);
	        }
	      } else if (typeof list !== 'function') {
	        position = -1;

	        for (i = list.length - 1; i >= 0; i--) {
	          if (list[i] === listener || list[i].listener === listener) {
	            originalListener = list[i].listener;
	            position = i;
	            break;
	          }
	        }

	        if (position < 0)
	          return this;

	        if (position === 0)
	          list.shift();
	        else {
	          spliceOne(list, position);
	        }

	        if (list.length === 1)
	          events[type] = list[0];

	        if (events.removeListener !== undefined)
	          this.emit('removeListener', type, originalListener || listener);
	      }

	      return this;
	    };

	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

	EventEmitter.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	      var listeners, events, i;

	      events = this._events;
	      if (events === undefined)
	        return this;

	      // not listening for removeListener, no need to emit
	      if (events.removeListener === undefined) {
	        if (arguments.length === 0) {
	          this._events = Object.create(null);
	          this._eventsCount = 0;
	        } else if (events[type] !== undefined) {
	          if (--this._eventsCount === 0)
	            this._events = Object.create(null);
	          else
	            delete events[type];
	        }
	        return this;
	      }

	      // emit removeListener for all listeners on all events
	      if (arguments.length === 0) {
	        var keys = Object.keys(events);
	        var key;
	        for (i = 0; i < keys.length; ++i) {
	          key = keys[i];
	          if (key === 'removeListener') continue;
	          this.removeAllListeners(key);
	        }
	        this.removeAllListeners('removeListener');
	        this._events = Object.create(null);
	        this._eventsCount = 0;
	        return this;
	      }

	      listeners = events[type];

	      if (typeof listeners === 'function') {
	        this.removeListener(type, listeners);
	      } else if (listeners !== undefined) {
	        // LIFO order
	        for (i = listeners.length - 1; i >= 0; i--) {
	          this.removeListener(type, listeners[i]);
	        }
	      }

	      return this;
	    };

	function _listeners(target, type, unwrap) {
	  var events = target._events;

	  if (events === undefined)
	    return [];

	  var evlistener = events[type];
	  if (evlistener === undefined)
	    return [];

	  if (typeof evlistener === 'function')
	    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

	  return unwrap ?
	    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
	}

	EventEmitter.prototype.listeners = function listeners(type) {
	  return _listeners(this, type, true);
	};

	EventEmitter.prototype.rawListeners = function rawListeners(type) {
	  return _listeners(this, type, false);
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount.call(emitter, type);
	  }
	};

	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
	  var events = this._events;

	  if (events !== undefined) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener !== undefined) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
	};

	function arrayClone(arr, n) {
	  var copy = new Array(n);
	  for (var i = 0; i < n; ++i)
	    copy[i] = arr[i];
	  return copy;
	}

	function spliceOne(list, index) {
	  for (; index + 1 < list.length; index++)
	    list[index] = list[index + 1];
	  list.pop();
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);
	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }
	  return ret;
	}

	function once(emitter, name) {
	  return new Promise(function (resolve, reject) {
	    function errorListener(err) {
	      emitter.removeListener(name, resolver);
	      reject(err);
	    }

	    function resolver() {
	      if (typeof emitter.removeListener === 'function') {
	        emitter.removeListener('error', errorListener);
	      }
	      resolve([].slice.call(arguments));
	    }
	    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
	    if (name !== 'error') {
	      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
	    }
	  });
	}

	function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
	  if (typeof emitter.on === 'function') {
	    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
	  }
	}

	function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
	  if (typeof emitter.on === 'function') {
	    if (flags.once) {
	      emitter.once(name, listener);
	    } else {
	      emitter.on(name, listener);
	    }
	  } else if (typeof emitter.addEventListener === 'function') {
	    // EventTarget does not have `error` event semantics like Node
	    // EventEmitters, we do not listen for `error` events here.
	    emitter.addEventListener(name, function wrapListener(arg) {
	      // IE does not have builtin `{ once: true }` support so we
	      // have to do it manually.
	      if (flags.once) {
	        emitter.removeEventListener(name, wrapListener);
	      }
	      listener(arg);
	    });
	  } else {
	    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
	  }
	}
	return events$1.exports;
}

var hasRequiredUtil$2;

function requireUtil$2 () {
	if (hasRequiredUtil$2) return util$2.exports;
	hasRequiredUtil$2 = 1;
	(function (module) {

		const bufferModule = require$$0$1;
		const { format, inspect } = requireInspect();
		const {
		  codes: { ERR_INVALID_ARG_TYPE }
		} = requireErrors();
		const { kResistStopPropagation, AggregateError, SymbolDispose } = requirePrimordials();
		const AbortSignal = globalThis.AbortSignal || requireBrowser$1().AbortSignal;
		const AbortController = globalThis.AbortController || requireBrowser$1().AbortController;
		const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
		const Blob = globalThis.Blob || bufferModule.Blob;
		/* eslint-disable indent */
		const isBlob =
		  typeof Blob !== 'undefined'
		    ? function isBlob(b) {
		        // eslint-disable-next-line indent
		        return b instanceof Blob
		      }
		    : function isBlob(b) {
		        return false
		      };
		/* eslint-enable indent */

		const validateAbortSignal = (signal, name) => {
		  if (signal !== undefined && (signal === null || typeof signal !== 'object' || !('aborted' in signal))) {
		    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
		  }
		};
		const validateFunction = (value, name) => {
		  if (typeof value !== 'function') {
		    throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
		  }
		};
		module.exports = {
		  AggregateError,
		  kEmptyObject: Object.freeze({}),
		  once(callback) {
		    let called = false;
		    return function (...args) {
		      if (called) {
		        return
		      }
		      called = true;
		      callback.apply(this, args);
		    }
		  },
		  createDeferredPromise: function () {
		    let resolve;
		    let reject;

		    // eslint-disable-next-line promise/param-names
		    const promise = new Promise((res, rej) => {
		      resolve = res;
		      reject = rej;
		    });
		    return {
		      promise,
		      resolve,
		      reject
		    }
		  },
		  promisify(fn) {
		    return new Promise((resolve, reject) => {
		      fn((err, ...args) => {
		        if (err) {
		          return reject(err)
		        }
		        return resolve(...args)
		      });
		    })
		  },
		  debuglog() {
		    return function () {}
		  },
		  format,
		  inspect,
		  types: {
		    isAsyncFunction(fn) {
		      return fn instanceof AsyncFunction
		    },
		    isArrayBufferView(arr) {
		      return ArrayBuffer.isView(arr)
		    }
		  },
		  isBlob,
		  deprecate(fn, message) {
		    return fn
		  },
		  addAbortListener:
		    requireEvents$1().addAbortListener ||
		    function addAbortListener(signal, listener) {
		      if (signal === undefined) {
		        throw new ERR_INVALID_ARG_TYPE('signal', 'AbortSignal', signal)
		      }
		      validateAbortSignal(signal, 'signal');
		      validateFunction(listener, 'listener');
		      let removeEventListener;
		      if (signal.aborted) {
		        queueMicrotask(() => listener());
		      } else {
		        signal.addEventListener('abort', listener, {
		          __proto__: null,
		          once: true,
		          [kResistStopPropagation]: true
		        });
		        removeEventListener = () => {
		          signal.removeEventListener('abort', listener);
		        };
		      }
		      return {
		        __proto__: null,
		        [SymbolDispose]() {
		          var _removeEventListener
		          ;(_removeEventListener = removeEventListener) === null || _removeEventListener === undefined
		            ? undefined
		            : _removeEventListener();
		        }
		      }
		    },
		  AbortSignalAny:
		    AbortSignal.any ||
		    function AbortSignalAny(signals) {
		      // Fast path if there is only one signal.
		      if (signals.length === 1) {
		        return signals[0]
		      }
		      const ac = new AbortController();
		      const abort = () => ac.abort();
		      signals.forEach((signal) => {
		        validateAbortSignal(signal, 'signals');
		        signal.addEventListener('abort', abort, {
		          once: true
		        });
		      });
		      ac.signal.addEventListener(
		        'abort',
		        () => {
		          signals.forEach((signal) => signal.removeEventListener('abort', abort));
		        },
		        {
		          once: true
		        }
		      );
		      return ac.signal
		    }
		};
		module.exports.promisify.custom = Symbol.for('nodejs.util.promisify.custom'); 
	} (util$2));
	return util$2.exports;
}

var operators = {};

/* eslint jsdoc/require-jsdoc: "error" */

var validators;
var hasRequiredValidators;

function requireValidators () {
	if (hasRequiredValidators) return validators;
	hasRequiredValidators = 1;

	const {
	  ArrayIsArray,
	  ArrayPrototypeIncludes,
	  ArrayPrototypeJoin,
	  ArrayPrototypeMap,
	  NumberIsInteger,
	  NumberIsNaN,
	  NumberMAX_SAFE_INTEGER,
	  NumberMIN_SAFE_INTEGER,
	  NumberParseInt,
	  ObjectPrototypeHasOwnProperty,
	  RegExpPrototypeExec,
	  String,
	  StringPrototypeToUpperCase,
	  StringPrototypeTrim
	} = requirePrimordials();
	const {
	  hideStackFrames,
	  codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
	} = requireErrors();
	const { normalizeEncoding } = requireUtil$2();
	const { isAsyncFunction, isArrayBufferView } = requireUtil$2().types;
	const signals = {};

	/**
	 * @param {*} value
	 * @returns {boolean}
	 */
	function isInt32(value) {
	  return value === (value | 0)
	}

	/**
	 * @param {*} value
	 * @returns {boolean}
	 */
	function isUint32(value) {
	  return value === value >>> 0
	}
	const octalReg = /^[0-7]+$/;
	const modeDesc = 'must be a 32-bit unsigned integer or an octal string';

	/**
	 * Parse and validate values that will be converted into mode_t (the S_*
	 * constants). Only valid numbers and octal strings are allowed. They could be
	 * converted to 32-bit unsigned integers or non-negative signed integers in the
	 * C++ land, but any value higher than 0o777 will result in platform-specific
	 * behaviors.
	 * @param {*} value Values to be validated
	 * @param {string} name Name of the argument
	 * @param {number} [def] If specified, will be returned for invalid values
	 * @returns {number}
	 */
	function parseFileMode(value, name, def) {
	  if (typeof value === 'undefined') {
	    value = def;
	  }
	  if (typeof value === 'string') {
	    if (RegExpPrototypeExec(octalReg, value) === null) {
	      throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc)
	    }
	    value = NumberParseInt(value, 8);
	  }
	  validateUint32(value, name);
	  return value
	}

	/**
	 * @callback validateInteger
	 * @param {*} value
	 * @param {string} name
	 * @param {number} [min]
	 * @param {number} [max]
	 * @returns {asserts value is number}
	 */

	/** @type {validateInteger} */
	const validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
	  if (typeof value !== 'number') throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
	  if (!NumberIsInteger(value)) throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
	  if (value < min || value > max) throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
	});

	/**
	 * @callback validateInt32
	 * @param {*} value
	 * @param {string} name
	 * @param {number} [min]
	 * @param {number} [max]
	 * @returns {asserts value is number}
	 */

	/** @type {validateInt32} */
	const validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
	  // The defaults for min and max correspond to the limits of 32-bit integers.
	  if (typeof value !== 'number') {
	    throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
	  }
	  if (!NumberIsInteger(value)) {
	    throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
	  }
	  if (value < min || value > max) {
	    throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
	  }
	});

	/**
	 * @callback validateUint32
	 * @param {*} value
	 * @param {string} name
	 * @param {number|boolean} [positive=false]
	 * @returns {asserts value is number}
	 */

	/** @type {validateUint32} */
	const validateUint32 = hideStackFrames((value, name, positive = false) => {
	  if (typeof value !== 'number') {
	    throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
	  }
	  if (!NumberIsInteger(value)) {
	    throw new ERR_OUT_OF_RANGE(name, 'an integer', value)
	  }
	  const min = positive ? 1 : 0;
	  // 2 ** 32 === 4294967296
	  const max = 4294967295;
	  if (value < min || value > max) {
	    throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value)
	  }
	});

	/**
	 * @callback validateString
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is string}
	 */

	/** @type {validateString} */
	function validateString(value, name) {
	  if (typeof value !== 'string') throw new ERR_INVALID_ARG_TYPE(name, 'string', value)
	}

	/**
	 * @callback validateNumber
	 * @param {*} value
	 * @param {string} name
	 * @param {number} [min]
	 * @param {number} [max]
	 * @returns {asserts value is number}
	 */

	/** @type {validateNumber} */
	function validateNumber(value, name, min = undefined, max) {
	  if (typeof value !== 'number') throw new ERR_INVALID_ARG_TYPE(name, 'number', value)
	  if (
	    (min != null && value < min) ||
	    (max != null && value > max) ||
	    ((min != null || max != null) && NumberIsNaN(value))
	  ) {
	    throw new ERR_OUT_OF_RANGE(
	      name,
	      `${min != null ? `>= ${min}` : ''}${min != null && max != null ? ' && ' : ''}${max != null ? `<= ${max}` : ''}`,
	      value
	    )
	  }
	}

	/**
	 * @callback validateOneOf
	 * @template T
	 * @param {T} value
	 * @param {string} name
	 * @param {T[]} oneOf
	 */

	/** @type {validateOneOf} */
	const validateOneOf = hideStackFrames((value, name, oneOf) => {
	  if (!ArrayPrototypeIncludes(oneOf, value)) {
	    const allowed = ArrayPrototypeJoin(
	      ArrayPrototypeMap(oneOf, (v) => (typeof v === 'string' ? `'${v}'` : String(v))),
	      ', '
	    );
	    const reason = 'must be one of: ' + allowed;
	    throw new ERR_INVALID_ARG_VALUE(name, value, reason)
	  }
	});

	/**
	 * @callback validateBoolean
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is boolean}
	 */

	/** @type {validateBoolean} */
	function validateBoolean(value, name) {
	  if (typeof value !== 'boolean') throw new ERR_INVALID_ARG_TYPE(name, 'boolean', value)
	}

	/**
	 * @param {any} options
	 * @param {string} key
	 * @param {boolean} defaultValue
	 * @returns {boolean}
	 */
	function getOwnPropertyValueOrDefault(options, key, defaultValue) {
	  return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key]
	}

	/**
	 * @callback validateObject
	 * @param {*} value
	 * @param {string} name
	 * @param {{
	 *   allowArray?: boolean,
	 *   allowFunction?: boolean,
	 *   nullable?: boolean
	 * }} [options]
	 */

	/** @type {validateObject} */
	const validateObject = hideStackFrames((value, name, options = null) => {
	  const allowArray = getOwnPropertyValueOrDefault(options, 'allowArray', false);
	  const allowFunction = getOwnPropertyValueOrDefault(options, 'allowFunction', false);
	  const nullable = getOwnPropertyValueOrDefault(options, 'nullable', false);
	  if (
	    (!nullable && value === null) ||
	    (!allowArray && ArrayIsArray(value)) ||
	    (typeof value !== 'object' && (!allowFunction || typeof value !== 'function'))
	  ) {
	    throw new ERR_INVALID_ARG_TYPE(name, 'Object', value)
	  }
	});

	/**
	 * @callback validateDictionary - We are using the Web IDL Standard definition
	 *                                of "dictionary" here, which means any value
	 *                                whose Type is either Undefined, Null, or
	 *                                Object (which includes functions).
	 * @param {*} value
	 * @param {string} name
	 * @see https://webidl.spec.whatwg.org/#es-dictionary
	 * @see https://tc39.es/ecma262/#table-typeof-operator-results
	 */

	/** @type {validateDictionary} */
	const validateDictionary = hideStackFrames((value, name) => {
	  if (value != null && typeof value !== 'object' && typeof value !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE(name, 'a dictionary', value)
	  }
	});

	/**
	 * @callback validateArray
	 * @param {*} value
	 * @param {string} name
	 * @param {number} [minLength]
	 * @returns {asserts value is any[]}
	 */

	/** @type {validateArray} */
	const validateArray = hideStackFrames((value, name, minLength = 0) => {
	  if (!ArrayIsArray(value)) {
	    throw new ERR_INVALID_ARG_TYPE(name, 'Array', value)
	  }
	  if (value.length < minLength) {
	    const reason = `must be longer than ${minLength}`;
	    throw new ERR_INVALID_ARG_VALUE(name, value, reason)
	  }
	});

	/**
	 * @callback validateStringArray
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is string[]}
	 */

	/** @type {validateStringArray} */
	function validateStringArray(value, name) {
	  validateArray(value, name);
	  for (let i = 0; i < value.length; i++) {
	    validateString(value[i], `${name}[${i}]`);
	  }
	}

	/**
	 * @callback validateBooleanArray
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is boolean[]}
	 */

	/** @type {validateBooleanArray} */
	function validateBooleanArray(value, name) {
	  validateArray(value, name);
	  for (let i = 0; i < value.length; i++) {
	    validateBoolean(value[i], `${name}[${i}]`);
	  }
	}

	/**
	 * @callback validateAbortSignalArray
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is AbortSignal[]}
	 */

	/** @type {validateAbortSignalArray} */
	function validateAbortSignalArray(value, name) {
	  validateArray(value, name);
	  for (let i = 0; i < value.length; i++) {
	    const signal = value[i];
	    const indexedName = `${name}[${i}]`;
	    if (signal == null) {
	      throw new ERR_INVALID_ARG_TYPE(indexedName, 'AbortSignal', signal)
	    }
	    validateAbortSignal(signal, indexedName);
	  }
	}

	/**
	 * @param {*} signal
	 * @param {string} [name='signal']
	 * @returns {asserts signal is keyof signals}
	 */
	function validateSignalName(signal, name = 'signal') {
	  validateString(signal, name);
	  if (signals[signal] === undefined) {
	    if (signals[StringPrototypeToUpperCase(signal)] !== undefined) {
	      throw new ERR_UNKNOWN_SIGNAL(signal + ' (signals must use all capital letters)')
	    }
	    throw new ERR_UNKNOWN_SIGNAL(signal)
	  }
	}

	/**
	 * @callback validateBuffer
	 * @param {*} buffer
	 * @param {string} [name='buffer']
	 * @returns {asserts buffer is ArrayBufferView}
	 */

	/** @type {validateBuffer} */
	const validateBuffer = hideStackFrames((buffer, name = 'buffer') => {
	  if (!isArrayBufferView(buffer)) {
	    throw new ERR_INVALID_ARG_TYPE(name, ['Buffer', 'TypedArray', 'DataView'], buffer)
	  }
	});

	/**
	 * @param {string} data
	 * @param {string} encoding
	 */
	function validateEncoding(data, encoding) {
	  const normalizedEncoding = normalizeEncoding(encoding);
	  const length = data.length;
	  if (normalizedEncoding === 'hex' && length % 2 !== 0) {
	    throw new ERR_INVALID_ARG_VALUE('encoding', encoding, `is invalid for data of length ${length}`)
	  }
	}

	/**
	 * Check that the port number is not NaN when coerced to a number,
	 * is an integer and that it falls within the legal range of port numbers.
	 * @param {*} port
	 * @param {string} [name='Port']
	 * @param {boolean} [allowZero=true]
	 * @returns {number}
	 */
	function validatePort(port, name = 'Port', allowZero = true) {
	  if (
	    (typeof port !== 'number' && typeof port !== 'string') ||
	    (typeof port === 'string' && StringPrototypeTrim(port).length === 0) ||
	    +port !== +port >>> 0 ||
	    port > 0xffff ||
	    (port === 0 && !allowZero)
	  ) {
	    throw new ERR_SOCKET_BAD_PORT(name, port, allowZero)
	  }
	  return port | 0
	}

	/**
	 * @callback validateAbortSignal
	 * @param {*} signal
	 * @param {string} name
	 */

	/** @type {validateAbortSignal} */
	const validateAbortSignal = hideStackFrames((signal, name) => {
	  if (signal !== undefined && (signal === null || typeof signal !== 'object' || !('aborted' in signal))) {
	    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
	  }
	});

	/**
	 * @callback validateFunction
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is Function}
	 */

	/** @type {validateFunction} */
	const validateFunction = hideStackFrames((value, name) => {
	  if (typeof value !== 'function') throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
	});

	/**
	 * @callback validatePlainFunction
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is Function}
	 */

	/** @type {validatePlainFunction} */
	const validatePlainFunction = hideStackFrames((value, name) => {
	  if (typeof value !== 'function' || isAsyncFunction(value)) throw new ERR_INVALID_ARG_TYPE(name, 'Function', value)
	});

	/**
	 * @callback validateUndefined
	 * @param {*} value
	 * @param {string} name
	 * @returns {asserts value is undefined}
	 */

	/** @type {validateUndefined} */
	const validateUndefined = hideStackFrames((value, name) => {
	  if (value !== undefined) throw new ERR_INVALID_ARG_TYPE(name, 'undefined', value)
	});

	/**
	 * @template T
	 * @param {T} value
	 * @param {string} name
	 * @param {T[]} union
	 */
	function validateUnion(value, name, union) {
	  if (!ArrayPrototypeIncludes(union, value)) {
	    throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, '|')}')`, value)
	  }
	}

	/*
	  The rules for the Link header field are described here:
	  https://www.rfc-editor.org/rfc/rfc8288.html#section-3

	  This regex validates any string surrounded by angle brackets
	  (not necessarily a valid URI reference) followed by zero or more
	  link-params separated by semicolons.
	*/
	const linkValueRegExp = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;

	/**
	 * @param {any} value
	 * @param {string} name
	 */
	function validateLinkHeaderFormat(value, name) {
	  if (typeof value === 'undefined' || !RegExpPrototypeExec(linkValueRegExp, value)) {
	    throw new ERR_INVALID_ARG_VALUE(
	      name,
	      value,
	      'must be an array or string of format "</styles.css>; rel=preload; as=style"'
	    )
	  }
	}

	/**
	 * @param {any} hints
	 * @return {string}
	 */
	function validateLinkHeaderValue(hints) {
	  if (typeof hints === 'string') {
	    validateLinkHeaderFormat(hints, 'hints');
	    return hints
	  } else if (ArrayIsArray(hints)) {
	    const hintsLength = hints.length;
	    let result = '';
	    if (hintsLength === 0) {
	      return result
	    }
	    for (let i = 0; i < hintsLength; i++) {
	      const link = hints[i];
	      validateLinkHeaderFormat(link, 'hints');
	      result += link;
	      if (i !== hintsLength - 1) {
	        result += ', ';
	      }
	    }
	    return result
	  }
	  throw new ERR_INVALID_ARG_VALUE(
	    'hints',
	    hints,
	    'must be an array or string of format "</styles.css>; rel=preload; as=style"'
	  )
	}
	validators = {
	  isInt32,
	  isUint32,
	  parseFileMode,
	  validateArray,
	  validateStringArray,
	  validateBooleanArray,
	  validateAbortSignalArray,
	  validateBoolean,
	  validateBuffer,
	  validateDictionary,
	  validateEncoding,
	  validateFunction,
	  validateInt32,
	  validateInteger,
	  validateNumber,
	  validateObject,
	  validateOneOf,
	  validatePlainFunction,
	  validatePort,
	  validateSignalName,
	  validateString,
	  validateUint32,
	  validateUndefined,
	  validateUnion,
	  validateAbortSignal,
	  validateLinkHeaderValue
	};
	return validators;
}

var endOfStream = {exports: {}};

var utils;
var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;

	const { SymbolAsyncIterator, SymbolIterator, SymbolFor } = requirePrimordials();

	// We need to use SymbolFor to make these globally available
	// for interopt with readable-stream, i.e. readable-stream
	// and node core needs to be able to read/write private state
	// from each other for proper interoperability.
	const kIsDestroyed = SymbolFor('nodejs.stream.destroyed');
	const kIsErrored = SymbolFor('nodejs.stream.errored');
	const kIsReadable = SymbolFor('nodejs.stream.readable');
	const kIsWritable = SymbolFor('nodejs.stream.writable');
	const kIsDisturbed = SymbolFor('nodejs.stream.disturbed');
	const kIsClosedPromise = SymbolFor('nodejs.webstream.isClosedPromise');
	const kControllerErrorFunction = SymbolFor('nodejs.webstream.controllerErrorFunction');
	function isReadableNodeStream(obj, strict = false) {
	  var _obj$_readableState;
	  return !!(
	    (
	      obj &&
	      typeof obj.pipe === 'function' &&
	      typeof obj.on === 'function' &&
	      (!strict || (typeof obj.pause === 'function' && typeof obj.resume === 'function')) &&
	      (!obj._writableState ||
	        ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === undefined
	          ? undefined
	          : _obj$_readableState.readable) !== false) &&
	      // Duplex
	      (!obj._writableState || obj._readableState)
	    ) // Writable has .pipe.
	  )
	}
	function isWritableNodeStream(obj) {
	  var _obj$_writableState;
	  return !!(
	    (
	      obj &&
	      typeof obj.write === 'function' &&
	      typeof obj.on === 'function' &&
	      (!obj._readableState ||
	        ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === undefined
	          ? undefined
	          : _obj$_writableState.writable) !== false)
	    ) // Duplex
	  )
	}
	function isDuplexNodeStream(obj) {
	  return !!(
	    obj &&
	    typeof obj.pipe === 'function' &&
	    obj._readableState &&
	    typeof obj.on === 'function' &&
	    typeof obj.write === 'function'
	  )
	}
	function isNodeStream(obj) {
	  return (
	    obj &&
	    (obj._readableState ||
	      obj._writableState ||
	      (typeof obj.write === 'function' && typeof obj.on === 'function') ||
	      (typeof obj.pipe === 'function' && typeof obj.on === 'function'))
	  )
	}
	function isReadableStream(obj) {
	  return !!(
	    obj &&
	    !isNodeStream(obj) &&
	    typeof obj.pipeThrough === 'function' &&
	    typeof obj.getReader === 'function' &&
	    typeof obj.cancel === 'function'
	  )
	}
	function isWritableStream(obj) {
	  return !!(obj && !isNodeStream(obj) && typeof obj.getWriter === 'function' && typeof obj.abort === 'function')
	}
	function isTransformStream(obj) {
	  return !!(obj && !isNodeStream(obj) && typeof obj.readable === 'object' && typeof obj.writable === 'object')
	}
	function isWebStream(obj) {
	  return isReadableStream(obj) || isWritableStream(obj) || isTransformStream(obj)
	}
	function isIterable(obj, isAsync) {
	  if (obj == null) return false
	  if (isAsync === true) return typeof obj[SymbolAsyncIterator] === 'function'
	  if (isAsync === false) return typeof obj[SymbolIterator] === 'function'
	  return typeof obj[SymbolAsyncIterator] === 'function' || typeof obj[SymbolIterator] === 'function'
	}
	function isDestroyed(stream) {
	  if (!isNodeStream(stream)) return null
	  const wState = stream._writableState;
	  const rState = stream._readableState;
	  const state = wState || rState;
	  return !!(stream.destroyed || stream[kIsDestroyed] || (state !== null && state !== undefined && state.destroyed))
	}

	// Have been end():d.
	function isWritableEnded(stream) {
	  if (!isWritableNodeStream(stream)) return null
	  if (stream.writableEnded === true) return true
	  const wState = stream._writableState;
	  if (wState !== null && wState !== undefined && wState.errored) return false
	  if (typeof (wState === null || wState === undefined ? undefined : wState.ended) !== 'boolean') return null
	  return wState.ended
	}

	// Have emitted 'finish'.
	function isWritableFinished(stream, strict) {
	  if (!isWritableNodeStream(stream)) return null
	  if (stream.writableFinished === true) return true
	  const wState = stream._writableState;
	  if (wState !== null && wState !== undefined && wState.errored) return false
	  if (typeof (wState === null || wState === undefined ? undefined : wState.finished) !== 'boolean') return null
	  return !!(wState.finished || (strict === false && wState.ended === true && wState.length === 0))
	}

	// Have been push(null):d.
	function isReadableEnded(stream) {
	  if (!isReadableNodeStream(stream)) return null
	  if (stream.readableEnded === true) return true
	  const rState = stream._readableState;
	  if (!rState || rState.errored) return false
	  if (typeof (rState === null || rState === undefined ? undefined : rState.ended) !== 'boolean') return null
	  return rState.ended
	}

	// Have emitted 'end'.
	function isReadableFinished(stream, strict) {
	  if (!isReadableNodeStream(stream)) return null
	  const rState = stream._readableState;
	  if (rState !== null && rState !== undefined && rState.errored) return false
	  if (typeof (rState === null || rState === undefined ? undefined : rState.endEmitted) !== 'boolean') return null
	  return !!(rState.endEmitted || (strict === false && rState.ended === true && rState.length === 0))
	}
	function isReadable(stream) {
	  if (stream && stream[kIsReadable] != null) return stream[kIsReadable]
	  if (typeof (stream === null || stream === undefined ? undefined : stream.readable) !== 'boolean') return null
	  if (isDestroyed(stream)) return false
	  return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream)
	}
	function isWritable(stream) {
	  if (stream && stream[kIsWritable] != null) return stream[kIsWritable]
	  if (typeof (stream === null || stream === undefined ? undefined : stream.writable) !== 'boolean') return null
	  if (isDestroyed(stream)) return false
	  return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream)
	}
	function isFinished(stream, opts) {
	  if (!isNodeStream(stream)) {
	    return null
	  }
	  if (isDestroyed(stream)) {
	    return true
	  }
	  if ((opts === null || opts === undefined ? undefined : opts.readable) !== false && isReadable(stream)) {
	    return false
	  }
	  if ((opts === null || opts === undefined ? undefined : opts.writable) !== false && isWritable(stream)) {
	    return false
	  }
	  return true
	}
	function isWritableErrored(stream) {
	  var _stream$_writableStat, _stream$_writableStat2;
	  if (!isNodeStream(stream)) {
	    return null
	  }
	  if (stream.writableErrored) {
	    return stream.writableErrored
	  }
	  return (_stream$_writableStat =
	    (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === undefined
	      ? undefined
	      : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== undefined
	    ? _stream$_writableStat
	    : null
	}
	function isReadableErrored(stream) {
	  var _stream$_readableStat, _stream$_readableStat2;
	  if (!isNodeStream(stream)) {
	    return null
	  }
	  if (stream.readableErrored) {
	    return stream.readableErrored
	  }
	  return (_stream$_readableStat =
	    (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === undefined
	      ? undefined
	      : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== undefined
	    ? _stream$_readableStat
	    : null
	}
	function isClosed(stream) {
	  if (!isNodeStream(stream)) {
	    return null
	  }
	  if (typeof stream.closed === 'boolean') {
	    return stream.closed
	  }
	  const wState = stream._writableState;
	  const rState = stream._readableState;
	  if (
	    typeof (wState === null || wState === undefined ? undefined : wState.closed) === 'boolean' ||
	    typeof (rState === null || rState === undefined ? undefined : rState.closed) === 'boolean'
	  ) {
	    return (
	      (wState === null || wState === undefined ? undefined : wState.closed) ||
	      (rState === null || rState === undefined ? undefined : rState.closed)
	    )
	  }
	  if (typeof stream._closed === 'boolean' && isOutgoingMessage(stream)) {
	    return stream._closed
	  }
	  return null
	}
	function isOutgoingMessage(stream) {
	  return (
	    typeof stream._closed === 'boolean' &&
	    typeof stream._defaultKeepAlive === 'boolean' &&
	    typeof stream._removedConnection === 'boolean' &&
	    typeof stream._removedContLen === 'boolean'
	  )
	}
	function isServerResponse(stream) {
	  return typeof stream._sent100 === 'boolean' && isOutgoingMessage(stream)
	}
	function isServerRequest(stream) {
	  var _stream$req;
	  return (
	    typeof stream._consuming === 'boolean' &&
	    typeof stream._dumped === 'boolean' &&
	    ((_stream$req = stream.req) === null || _stream$req === undefined ? undefined : _stream$req.upgradeOrConnect) ===
	      undefined
	  )
	}
	function willEmitClose(stream) {
	  if (!isNodeStream(stream)) return null
	  const wState = stream._writableState;
	  const rState = stream._readableState;
	  const state = wState || rState;
	  return (
	    (!state && isServerResponse(stream)) || !!(state && state.autoDestroy && state.emitClose && state.closed === false)
	  )
	}
	function isDisturbed(stream) {
	  var _stream$kIsDisturbed;
	  return !!(
	    stream &&
	    ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== undefined
	      ? _stream$kIsDisturbed
	      : stream.readableDidRead || stream.readableAborted)
	  )
	}
	function isErrored(stream) {
	  var _ref,
	    _ref2,
	    _ref3,
	    _ref4,
	    _ref5,
	    _stream$kIsErrored,
	    _stream$_readableStat3,
	    _stream$_writableStat3,
	    _stream$_readableStat4,
	    _stream$_writableStat4;
	  return !!(
	    stream &&
	    ((_ref =
	      (_ref2 =
	        (_ref3 =
	          (_ref4 =
	            (_ref5 =
	              (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== undefined
	                ? _stream$kIsErrored
	                : stream.readableErrored) !== null && _ref5 !== undefined
	              ? _ref5
	              : stream.writableErrored) !== null && _ref4 !== undefined
	            ? _ref4
	            : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === undefined
	            ? undefined
	            : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== undefined
	          ? _ref3
	          : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === undefined
	          ? undefined
	          : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== undefined
	        ? _ref2
	        : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === undefined
	        ? undefined
	        : _stream$_readableStat4.errored) !== null && _ref !== undefined
	      ? _ref
	      : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === undefined
	      ? undefined
	      : _stream$_writableStat4.errored)
	  )
	}
	utils = {
	  isDestroyed,
	  kIsDestroyed,
	  isDisturbed,
	  kIsDisturbed,
	  isErrored,
	  kIsErrored,
	  isReadable,
	  kIsReadable,
	  kIsClosedPromise,
	  kControllerErrorFunction,
	  kIsWritable,
	  isClosed,
	  isDuplexNodeStream,
	  isFinished,
	  isIterable,
	  isReadableNodeStream,
	  isReadableStream,
	  isReadableEnded,
	  isReadableFinished,
	  isReadableErrored,
	  isNodeStream,
	  isWebStream,
	  isWritable,
	  isWritableNodeStream,
	  isWritableStream,
	  isWritableEnded,
	  isWritableFinished,
	  isWritableErrored,
	  isServerRequest,
	  isServerResponse,
	  willEmitClose,
	  isTransformStream
	};
	return utils;
}

var hasRequiredEndOfStream;

function requireEndOfStream () {
	if (hasRequiredEndOfStream) return endOfStream.exports;
	hasRequiredEndOfStream = 1;

	/* replacement start */

	const process = requireBrowser$2();

	/* replacement end */

	const { AbortError, codes } = requireErrors();
	const { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
	const { kEmptyObject, once } = requireUtil$2();
	const { validateAbortSignal, validateFunction, validateObject, validateBoolean } = requireValidators();
	const { Promise, PromisePrototypeThen, SymbolDispose } = requirePrimordials();
	const {
	  isClosed,
	  isReadable,
	  isReadableNodeStream,
	  isReadableStream,
	  isReadableFinished,
	  isReadableErrored,
	  isWritable,
	  isWritableNodeStream,
	  isWritableStream,
	  isWritableFinished,
	  isWritableErrored,
	  isNodeStream,
	  willEmitClose: _willEmitClose,
	  kIsClosedPromise
	} = requireUtils();
	let addAbortListener;
	function isRequest(stream) {
	  return stream.setHeader && typeof stream.abort === 'function'
	}
	const nop = () => {};
	function eos(stream, options, callback) {
	  var _options$readable, _options$writable;
	  if (arguments.length === 2) {
	    callback = options;
	    options = kEmptyObject;
	  } else if (options == null) {
	    options = kEmptyObject;
	  } else {
	    validateObject(options, 'options');
	  }
	  validateFunction(callback, 'callback');
	  validateAbortSignal(options.signal, 'options.signal');
	  callback = once(callback);
	  if (isReadableStream(stream) || isWritableStream(stream)) {
	    return eosWeb(stream, options, callback)
	  }
	  if (!isNodeStream(stream)) {
	    throw new ERR_INVALID_ARG_TYPE('stream', ['ReadableStream', 'WritableStream', 'Stream'], stream)
	  }
	  const readable =
	    (_options$readable = options.readable) !== null && _options$readable !== undefined
	      ? _options$readable
	      : isReadableNodeStream(stream);
	  const writable =
	    (_options$writable = options.writable) !== null && _options$writable !== undefined
	      ? _options$writable
	      : isWritableNodeStream(stream);
	  const wState = stream._writableState;
	  const rState = stream._readableState;
	  const onlegacyfinish = () => {
	    if (!stream.writable) {
	      onfinish();
	    }
	  };

	  // TODO (ronag): Improve soft detection to include core modules and
	  // common ecosystem modules that do properly emit 'close' but fail
	  // this generic check.
	  let willEmitClose =
	    _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
	  let writableFinished = isWritableFinished(stream, false);
	  const onfinish = () => {
	    writableFinished = true;
	    // Stream should not be destroyed here. If it is that
	    // means that user space is doing something differently and
	    // we cannot trust willEmitClose.
	    if (stream.destroyed) {
	      willEmitClose = false;
	    }
	    if (willEmitClose && (!stream.readable || readable)) {
	      return
	    }
	    if (!readable || readableFinished) {
	      callback.call(stream);
	    }
	  };
	  let readableFinished = isReadableFinished(stream, false);
	  const onend = () => {
	    readableFinished = true;
	    // Stream should not be destroyed here. If it is that
	    // means that user space is doing something differently and
	    // we cannot trust willEmitClose.
	    if (stream.destroyed) {
	      willEmitClose = false;
	    }
	    if (willEmitClose && (!stream.writable || writable)) {
	      return
	    }
	    if (!writable || writableFinished) {
	      callback.call(stream);
	    }
	  };
	  const onerror = (err) => {
	    callback.call(stream, err);
	  };
	  let closed = isClosed(stream);
	  const onclose = () => {
	    closed = true;
	    const errored = isWritableErrored(stream) || isReadableErrored(stream);
	    if (errored && typeof errored !== 'boolean') {
	      return callback.call(stream, errored)
	    }
	    if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
	      if (!isReadableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
	    }
	    if (writable && !writableFinished) {
	      if (!isWritableFinished(stream, false)) return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE())
	    }
	    callback.call(stream);
	  };
	  const onclosed = () => {
	    closed = true;
	    const errored = isWritableErrored(stream) || isReadableErrored(stream);
	    if (errored && typeof errored !== 'boolean') {
	      return callback.call(stream, errored)
	    }
	    callback.call(stream);
	  };
	  const onrequest = () => {
	    stream.req.on('finish', onfinish);
	  };
	  if (isRequest(stream)) {
	    stream.on('complete', onfinish);
	    if (!willEmitClose) {
	      stream.on('abort', onclose);
	    }
	    if (stream.req) {
	      onrequest();
	    } else {
	      stream.on('request', onrequest);
	    }
	  } else if (writable && !wState) {
	    // legacy streams
	    stream.on('end', onlegacyfinish);
	    stream.on('close', onlegacyfinish);
	  }

	  // Not all streams will emit 'close' after 'aborted'.
	  if (!willEmitClose && typeof stream.aborted === 'boolean') {
	    stream.on('aborted', onclose);
	  }
	  stream.on('end', onend);
	  stream.on('finish', onfinish);
	  if (options.error !== false) {
	    stream.on('error', onerror);
	  }
	  stream.on('close', onclose);
	  if (closed) {
	    process.nextTick(onclose);
	  } else if (
	    (wState !== null && wState !== undefined && wState.errorEmitted) ||
	    (rState !== null && rState !== undefined && rState.errorEmitted)
	  ) {
	    if (!willEmitClose) {
	      process.nextTick(onclosed);
	    }
	  } else if (
	    !readable &&
	    (!willEmitClose || isReadable(stream)) &&
	    (writableFinished || isWritable(stream) === false)
	  ) {
	    process.nextTick(onclosed);
	  } else if (
	    !writable &&
	    (!willEmitClose || isWritable(stream)) &&
	    (readableFinished || isReadable(stream) === false)
	  ) {
	    process.nextTick(onclosed);
	  } else if (rState && stream.req && stream.aborted) {
	    process.nextTick(onclosed);
	  }
	  const cleanup = () => {
	    callback = nop;
	    stream.removeListener('aborted', onclose);
	    stream.removeListener('complete', onfinish);
	    stream.removeListener('abort', onclose);
	    stream.removeListener('request', onrequest);
	    if (stream.req) stream.req.removeListener('finish', onfinish);
	    stream.removeListener('end', onlegacyfinish);
	    stream.removeListener('close', onlegacyfinish);
	    stream.removeListener('finish', onfinish);
	    stream.removeListener('end', onend);
	    stream.removeListener('error', onerror);
	    stream.removeListener('close', onclose);
	  };
	  if (options.signal && !closed) {
	    const abort = () => {
	      // Keep it because cleanup removes it.
	      const endCallback = callback;
	      cleanup();
	      endCallback.call(
	        stream,
	        new AbortError(undefined, {
	          cause: options.signal.reason
	        })
	      );
	    };
	    if (options.signal.aborted) {
	      process.nextTick(abort);
	    } else {
	      addAbortListener = addAbortListener || requireUtil$2().addAbortListener;
	      const disposable = addAbortListener(options.signal, abort);
	      const originalCallback = callback;
	      callback = once((...args) => {
	        disposable[SymbolDispose]();
	        originalCallback.apply(stream, args);
	      });
	    }
	  }
	  return cleanup
	}
	function eosWeb(stream, options, callback) {
	  let isAborted = false;
	  let abort = nop;
	  if (options.signal) {
	    abort = () => {
	      isAborted = true;
	      callback.call(
	        stream,
	        new AbortError(undefined, {
	          cause: options.signal.reason
	        })
	      );
	    };
	    if (options.signal.aborted) {
	      process.nextTick(abort);
	    } else {
	      addAbortListener = addAbortListener || requireUtil$2().addAbortListener;
	      const disposable = addAbortListener(options.signal, abort);
	      const originalCallback = callback;
	      callback = once((...args) => {
	        disposable[SymbolDispose]();
	        originalCallback.apply(stream, args);
	      });
	    }
	  }
	  const resolverFn = (...args) => {
	    if (!isAborted) {
	      process.nextTick(() => callback.apply(stream, args));
	    }
	  };
	  PromisePrototypeThen(stream[kIsClosedPromise].promise, resolverFn, resolverFn);
	  return nop
	}
	function finished(stream, opts) {
	  var _opts;
	  let autoCleanup = false;
	  if (opts === null) {
	    opts = kEmptyObject;
	  }
	  if ((_opts = opts) !== null && _opts !== undefined && _opts.cleanup) {
	    validateBoolean(opts.cleanup, 'cleanup');
	    autoCleanup = opts.cleanup;
	  }
	  return new Promise((resolve, reject) => {
	    const cleanup = eos(stream, opts, (err) => {
	      if (autoCleanup) {
	        cleanup();
	      }
	      if (err) {
	        reject(err);
	      } else {
	        resolve();
	      }
	    });
	  })
	}
	endOfStream.exports = eos;
	endOfStream.exports.finished = finished;
	return endOfStream.exports;
}

var destroy_1;
var hasRequiredDestroy;

function requireDestroy () {
	if (hasRequiredDestroy) return destroy_1;
	hasRequiredDestroy = 1;

	/* replacement start */

	const process = requireBrowser$2();

	/* replacement end */

	const {
	  aggregateTwoErrors,
	  codes: { ERR_MULTIPLE_CALLBACK },
	  AbortError
	} = requireErrors();
	const { Symbol } = requirePrimordials();
	const { kIsDestroyed, isDestroyed, isFinished, isServerRequest } = requireUtils();
	const kDestroy = Symbol('kDestroy');
	const kConstruct = Symbol('kConstruct');
	function checkError(err, w, r) {
	  if (err) {
	    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
	    err.stack; // eslint-disable-line no-unused-expressions

	    if (w && !w.errored) {
	      w.errored = err;
	    }
	    if (r && !r.errored) {
	      r.errored = err;
	    }
	  }
	}

	// Backwards compat. cb() is undocumented and unused in core but
	// unfortunately might be used by modules.
	function destroy(err, cb) {
	  const r = this._readableState;
	  const w = this._writableState;
	  // With duplex streams we use the writable side for state.
	  const s = w || r;
	  if ((w !== null && w !== undefined && w.destroyed) || (r !== null && r !== undefined && r.destroyed)) {
	    if (typeof cb === 'function') {
	      cb();
	    }
	    return this
	  }

	  // We set destroyed to true before firing error callbacks in order
	  // to make it re-entrance safe in case destroy() is called within callbacks
	  checkError(err, w, r);
	  if (w) {
	    w.destroyed = true;
	  }
	  if (r) {
	    r.destroyed = true;
	  }

	  // If still constructing then defer calling _destroy.
	  if (!s.constructed) {
	    this.once(kDestroy, function (er) {
	      _destroy(this, aggregateTwoErrors(er, err), cb);
	    });
	  } else {
	    _destroy(this, err, cb);
	  }
	  return this
	}
	function _destroy(self, err, cb) {
	  let called = false;
	  function onDestroy(err) {
	    if (called) {
	      return
	    }
	    called = true;
	    const r = self._readableState;
	    const w = self._writableState;
	    checkError(err, w, r);
	    if (w) {
	      w.closed = true;
	    }
	    if (r) {
	      r.closed = true;
	    }
	    if (typeof cb === 'function') {
	      cb(err);
	    }
	    if (err) {
	      process.nextTick(emitErrorCloseNT, self, err);
	    } else {
	      process.nextTick(emitCloseNT, self);
	    }
	  }
	  try {
	    self._destroy(err || null, onDestroy);
	  } catch (err) {
	    onDestroy(err);
	  }
	}
	function emitErrorCloseNT(self, err) {
	  emitErrorNT(self, err);
	  emitCloseNT(self);
	}
	function emitCloseNT(self) {
	  const r = self._readableState;
	  const w = self._writableState;
	  if (w) {
	    w.closeEmitted = true;
	  }
	  if (r) {
	    r.closeEmitted = true;
	  }
	  if ((w !== null && w !== undefined && w.emitClose) || (r !== null && r !== undefined && r.emitClose)) {
	    self.emit('close');
	  }
	}
	function emitErrorNT(self, err) {
	  const r = self._readableState;
	  const w = self._writableState;
	  if ((w !== null && w !== undefined && w.errorEmitted) || (r !== null && r !== undefined && r.errorEmitted)) {
	    return
	  }
	  if (w) {
	    w.errorEmitted = true;
	  }
	  if (r) {
	    r.errorEmitted = true;
	  }
	  self.emit('error', err);
	}
	function undestroy() {
	  const r = this._readableState;
	  const w = this._writableState;
	  if (r) {
	    r.constructed = true;
	    r.closed = false;
	    r.closeEmitted = false;
	    r.destroyed = false;
	    r.errored = null;
	    r.errorEmitted = false;
	    r.reading = false;
	    r.ended = r.readable === false;
	    r.endEmitted = r.readable === false;
	  }
	  if (w) {
	    w.constructed = true;
	    w.destroyed = false;
	    w.closed = false;
	    w.closeEmitted = false;
	    w.errored = null;
	    w.errorEmitted = false;
	    w.finalCalled = false;
	    w.prefinished = false;
	    w.ended = w.writable === false;
	    w.ending = w.writable === false;
	    w.finished = w.writable === false;
	  }
	}
	function errorOrDestroy(stream, err, sync) {
	  // We have tests that rely on errors being emitted
	  // in the same tick, so changing this is semver major.
	  // For now when you opt-in to autoDestroy we allow
	  // the error to be emitted nextTick. In a future
	  // semver major update we should change the default to this.

	  const r = stream._readableState;
	  const w = stream._writableState;
	  if ((w !== null && w !== undefined && w.destroyed) || (r !== null && r !== undefined && r.destroyed)) {
	    return this
	  }
	  if ((r !== null && r !== undefined && r.autoDestroy) || (w !== null && w !== undefined && w.autoDestroy))
	    stream.destroy(err);
	  else if (err) {
	    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
	    err.stack; // eslint-disable-line no-unused-expressions

	    if (w && !w.errored) {
	      w.errored = err;
	    }
	    if (r && !r.errored) {
	      r.errored = err;
	    }
	    if (sync) {
	      process.nextTick(emitErrorNT, stream, err);
	    } else {
	      emitErrorNT(stream, err);
	    }
	  }
	}
	function construct(stream, cb) {
	  if (typeof stream._construct !== 'function') {
	    return
	  }
	  const r = stream._readableState;
	  const w = stream._writableState;
	  if (r) {
	    r.constructed = false;
	  }
	  if (w) {
	    w.constructed = false;
	  }
	  stream.once(kConstruct, cb);
	  if (stream.listenerCount(kConstruct) > 1) {
	    // Duplex
	    return
	  }
	  process.nextTick(constructNT, stream);
	}
	function constructNT(stream) {
	  let called = false;
	  function onConstruct(err) {
	    if (called) {
	      errorOrDestroy(stream, err !== null && err !== undefined ? err : new ERR_MULTIPLE_CALLBACK());
	      return
	    }
	    called = true;
	    const r = stream._readableState;
	    const w = stream._writableState;
	    const s = w || r;
	    if (r) {
	      r.constructed = true;
	    }
	    if (w) {
	      w.constructed = true;
	    }
	    if (s.destroyed) {
	      stream.emit(kDestroy, err);
	    } else if (err) {
	      errorOrDestroy(stream, err, true);
	    } else {
	      process.nextTick(emitConstructNT, stream);
	    }
	  }
	  try {
	    stream._construct((err) => {
	      process.nextTick(onConstruct, err);
	    });
	  } catch (err) {
	    process.nextTick(onConstruct, err);
	  }
	}
	function emitConstructNT(stream) {
	  stream.emit(kConstruct);
	}
	function isRequest(stream) {
	  return (stream === null || stream === undefined ? undefined : stream.setHeader) && typeof stream.abort === 'function'
	}
	function emitCloseLegacy(stream) {
	  stream.emit('close');
	}
	function emitErrorCloseLegacy(stream, err) {
	  stream.emit('error', err);
	  process.nextTick(emitCloseLegacy, stream);
	}

	// Normalize destroy for legacy.
	function destroyer(stream, err) {
	  if (!stream || isDestroyed(stream)) {
	    return
	  }
	  if (!err && !isFinished(stream)) {
	    err = new AbortError();
	  }

	  // TODO: Remove isRequest branches.
	  if (isServerRequest(stream)) {
	    stream.socket = null;
	    stream.destroy(err);
	  } else if (isRequest(stream)) {
	    stream.abort();
	  } else if (isRequest(stream.req)) {
	    stream.req.abort();
	  } else if (typeof stream.destroy === 'function') {
	    stream.destroy(err);
	  } else if (typeof stream.close === 'function') {
	    // TODO: Don't lose err?
	    stream.close();
	  } else if (err) {
	    process.nextTick(emitErrorCloseLegacy, stream, err);
	  } else {
	    process.nextTick(emitCloseLegacy, stream);
	  }
	  if (!stream.destroyed) {
	    stream[kIsDestroyed] = true;
	  }
	}
	destroy_1 = {
	  construct,
	  destroyer,
	  destroy,
	  undestroy,
	  errorOrDestroy
	};
	return destroy_1;
}

var legacy;
var hasRequiredLegacy;

function requireLegacy () {
	if (hasRequiredLegacy) return legacy;
	hasRequiredLegacy = 1;

	const { ArrayIsArray, ObjectSetPrototypeOf } = requirePrimordials();
	const { EventEmitter: EE } = requireEvents$1();
	function Stream(opts) {
	  EE.call(this, opts);
	}
	ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
	ObjectSetPrototypeOf(Stream, EE);
	Stream.prototype.pipe = function (dest, options) {
	  const source = this;
	  function ondata(chunk) {
	    if (dest.writable && dest.write(chunk) === false && source.pause) {
	      source.pause();
	    }
	  }
	  source.on('data', ondata);
	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }
	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }
	  let didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return
	    didOnEnd = true;
	    dest.end();
	  }
	  function onclose() {
	    if (didOnEnd) return
	    didOnEnd = true;
	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // Don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      this.emit('error', er);
	    }
	  }
	  prependListener(source, 'error', onerror);
	  prependListener(dest, 'error', onerror);

	  // Remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);
	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);
	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);
	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);
	    dest.removeListener('close', cleanup);
	  }
	  source.on('end', cleanup);
	  source.on('close', cleanup);
	  dest.on('close', cleanup);
	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest
	};
	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn)

	  // This is a hack to make sure that our error handler is attached before any
	  // userland ones.  NEVER DO THIS. This is here only because this code needs
	  // to continue to work with older versions of Node.js that do not include
	  // the prependListener() method. The goal is to eventually remove this hack.
	  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
	  else if (ArrayIsArray(emitter._events[event])) emitter._events[event].unshift(fn);
	  else emitter._events[event] = [fn, emitter._events[event]];
	}
	legacy = {
	  Stream,
	  prependListener
	};
	return legacy;
}

var addAbortSignal = {exports: {}};

var hasRequiredAddAbortSignal;

function requireAddAbortSignal () {
	if (hasRequiredAddAbortSignal) return addAbortSignal.exports;
	hasRequiredAddAbortSignal = 1;
	(function (module) {

		const { SymbolDispose } = requirePrimordials();
		const { AbortError, codes } = requireErrors();
		const { isNodeStream, isWebStream, kControllerErrorFunction } = requireUtils();
		const eos = requireEndOfStream();
		const { ERR_INVALID_ARG_TYPE } = codes;
		let addAbortListener;

		// This method is inlined here for readable-stream
		// It also does not allow for signal to not exist on the stream
		// https://github.com/nodejs/node/pull/36061#discussion_r533718029
		const validateAbortSignal = (signal, name) => {
		  if (typeof signal !== 'object' || !('aborted' in signal)) {
		    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal)
		  }
		};
		module.exports.addAbortSignal = function addAbortSignal(signal, stream) {
		  validateAbortSignal(signal, 'signal');
		  if (!isNodeStream(stream) && !isWebStream(stream)) {
		    throw new ERR_INVALID_ARG_TYPE('stream', ['ReadableStream', 'WritableStream', 'Stream'], stream)
		  }
		  return module.exports.addAbortSignalNoValidate(signal, stream)
		};
		module.exports.addAbortSignalNoValidate = function (signal, stream) {
		  if (typeof signal !== 'object' || !('aborted' in signal)) {
		    return stream
		  }
		  const onAbort = isNodeStream(stream)
		    ? () => {
		        stream.destroy(
		          new AbortError(undefined, {
		            cause: signal.reason
		          })
		        );
		      }
		    : () => {
		        stream[kControllerErrorFunction](
		          new AbortError(undefined, {
		            cause: signal.reason
		          })
		        );
		      };
		  if (signal.aborted) {
		    onAbort();
		  } else {
		    addAbortListener = addAbortListener || requireUtil$2().addAbortListener;
		    const disposable = addAbortListener(signal, onAbort);
		    eos(stream, disposable[SymbolDispose]);
		  }
		  return stream
		}; 
	} (addAbortSignal));
	return addAbortSignal.exports;
}

var buffer_list;
var hasRequiredBuffer_list;

function requireBuffer_list () {
	if (hasRequiredBuffer_list) return buffer_list;
	hasRequiredBuffer_list = 1;

	const { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array } = requirePrimordials();
	const { Buffer } = require$$0$1;
	const { inspect } = requireUtil$2();
	buffer_list = class BufferList {
	  constructor() {
	    this.head = null;
	    this.tail = null;
	    this.length = 0;
	  }
	  push(v) {
	    const entry = {
	      data: v,
	      next: null
	    };
	    if (this.length > 0) this.tail.next = entry;
	    else this.head = entry;
	    this.tail = entry;
	    ++this.length;
	  }
	  unshift(v) {
	    const entry = {
	      data: v,
	      next: this.head
	    };
	    if (this.length === 0) this.tail = entry;
	    this.head = entry;
	    ++this.length;
	  }
	  shift() {
	    if (this.length === 0) return
	    const ret = this.head.data;
	    if (this.length === 1) this.head = this.tail = null;
	    else this.head = this.head.next;
	    --this.length;
	    return ret
	  }
	  clear() {
	    this.head = this.tail = null;
	    this.length = 0;
	  }
	  join(s) {
	    if (this.length === 0) return ''
	    let p = this.head;
	    let ret = '' + p.data;
	    while ((p = p.next) !== null) ret += s + p.data;
	    return ret
	  }
	  concat(n) {
	    if (this.length === 0) return Buffer.alloc(0)
	    const ret = Buffer.allocUnsafe(n >>> 0);
	    let p = this.head;
	    let i = 0;
	    while (p) {
	      TypedArrayPrototypeSet(ret, p.data, i);
	      i += p.data.length;
	      p = p.next;
	    }
	    return ret
	  }

	  // Consumes a specified amount of bytes or characters from the buffered data.
	  consume(n, hasStrings) {
	    const data = this.head.data;
	    if (n < data.length) {
	      // `slice` is the same for buffers and strings.
	      const slice = data.slice(0, n);
	      this.head.data = data.slice(n);
	      return slice
	    }
	    if (n === data.length) {
	      // First chunk is a perfect match.
	      return this.shift()
	    }
	    // Result spans more than one buffer.
	    return hasStrings ? this._getString(n) : this._getBuffer(n)
	  }
	  first() {
	    return this.head.data
	  }
	  *[SymbolIterator]() {
	    for (let p = this.head; p; p = p.next) {
	      yield p.data;
	    }
	  }

	  // Consumes a specified amount of characters from the buffered data.
	  _getString(n) {
	    let ret = '';
	    let p = this.head;
	    let c = 0;
	    do {
	      const str = p.data;
	      if (n > str.length) {
	        ret += str;
	        n -= str.length;
	      } else {
	        if (n === str.length) {
	          ret += str;
	          ++c;
	          if (p.next) this.head = p.next;
	          else this.head = this.tail = null;
	        } else {
	          ret += StringPrototypeSlice(str, 0, n);
	          this.head = p;
	          p.data = StringPrototypeSlice(str, n);
	        }
	        break
	      }
	      ++c;
	    } while ((p = p.next) !== null)
	    this.length -= c;
	    return ret
	  }

	  // Consumes a specified amount of bytes from the buffered data.
	  _getBuffer(n) {
	    const ret = Buffer.allocUnsafe(n);
	    const retLen = n;
	    let p = this.head;
	    let c = 0;
	    do {
	      const buf = p.data;
	      if (n > buf.length) {
	        TypedArrayPrototypeSet(ret, buf, retLen - n);
	        n -= buf.length;
	      } else {
	        if (n === buf.length) {
	          TypedArrayPrototypeSet(ret, buf, retLen - n);
	          ++c;
	          if (p.next) this.head = p.next;
	          else this.head = this.tail = null;
	        } else {
	          TypedArrayPrototypeSet(ret, new Uint8Array(buf.buffer, buf.byteOffset, n), retLen - n);
	          this.head = p;
	          p.data = buf.slice(n);
	        }
	        break
	      }
	      ++c;
	    } while ((p = p.next) !== null)
	    this.length -= c;
	    return ret
	  }

	  // Make sure the linked list only shows the minimal necessary information.
	  [Symbol.for('nodejs.util.inspect.custom')](_, options) {
	    return inspect(this, {
	      ...options,
	      // Only inspect one level.
	      depth: 0,
	      // It should not recurse.
	      customInspect: false
	    })
	  }
	};
	return buffer_list;
}

var state;
var hasRequiredState;

function requireState () {
	if (hasRequiredState) return state;
	hasRequiredState = 1;

	const { MathFloor, NumberIsInteger } = requirePrimordials();
	const { validateInteger } = requireValidators();
	const { ERR_INVALID_ARG_VALUE } = requireErrors().codes;
	let defaultHighWaterMarkBytes = 16 * 1024;
	let defaultHighWaterMarkObjectMode = 16;
	function highWaterMarkFrom(options, isDuplex, duplexKey) {
	  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null
	}
	function getDefaultHighWaterMark(objectMode) {
	  return objectMode ? defaultHighWaterMarkObjectMode : defaultHighWaterMarkBytes
	}
	function setDefaultHighWaterMark(objectMode, value) {
	  validateInteger(value, 'value', 0);
	  if (objectMode) {
	    defaultHighWaterMarkObjectMode = value;
	  } else {
	    defaultHighWaterMarkBytes = value;
	  }
	}
	function getHighWaterMark(state, options, duplexKey, isDuplex) {
	  const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
	  if (hwm != null) {
	    if (!NumberIsInteger(hwm) || hwm < 0) {
	      const name = isDuplex ? `options.${duplexKey}` : 'options.highWaterMark';
	      throw new ERR_INVALID_ARG_VALUE(name, hwm)
	    }
	    return MathFloor(hwm)
	  }

	  // Default value
	  return getDefaultHighWaterMark(state.objectMode)
	}
	state = {
	  getHighWaterMark,
	  getDefaultHighWaterMark,
	  setDefaultHighWaterMark
	};
	return state;
}

var string_decoder = {};

var safeBuffer = {exports: {}};

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredSafeBuffer;

function requireSafeBuffer () {
	if (hasRequiredSafeBuffer) return safeBuffer.exports;
	hasRequiredSafeBuffer = 1;
	(function (module, exports) {
		/* eslint-disable node/no-deprecated-api */
		var buffer = require$$0$1;
		var Buffer = buffer.Buffer;

		// alternative to using Object.keys for old browsers
		function copyProps (src, dst) {
		  for (var key in src) {
		    dst[key] = src[key];
		  }
		}
		if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
		  module.exports = buffer;
		} else {
		  // Copy properties from require('buffer')
		  copyProps(buffer, exports);
		  exports.Buffer = SafeBuffer;
		}

		function SafeBuffer (arg, encodingOrOffset, length) {
		  return Buffer(arg, encodingOrOffset, length)
		}

		SafeBuffer.prototype = Object.create(Buffer.prototype);

		// Copy static methods from Buffer
		copyProps(Buffer, SafeBuffer);

		SafeBuffer.from = function (arg, encodingOrOffset, length) {
		  if (typeof arg === 'number') {
		    throw new TypeError('Argument must not be a number')
		  }
		  return Buffer(arg, encodingOrOffset, length)
		};

		SafeBuffer.alloc = function (size, fill, encoding) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  var buf = Buffer(size);
		  if (fill !== undefined) {
		    if (typeof encoding === 'string') {
		      buf.fill(fill, encoding);
		    } else {
		      buf.fill(fill);
		    }
		  } else {
		    buf.fill(0);
		  }
		  return buf
		};

		SafeBuffer.allocUnsafe = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return Buffer(size)
		};

		SafeBuffer.allocUnsafeSlow = function (size) {
		  if (typeof size !== 'number') {
		    throw new TypeError('Argument must be a number')
		  }
		  return buffer.SlowBuffer(size)
		}; 
	} (safeBuffer, safeBuffer.exports));
	return safeBuffer.exports;
}

var hasRequiredString_decoder;

function requireString_decoder () {
	if (hasRequiredString_decoder) return string_decoder;
	hasRequiredString_decoder = 1;

	/*<replacement>*/

	var Buffer = requireSafeBuffer().Buffer;
	/*</replacement>*/

	var isEncoding = Buffer.isEncoding || function (encoding) {
	  encoding = '' + encoding;
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};

	function _normalizeEncoding(enc) {
	  if (!enc) return 'utf8';
	  var retried;
	  while (true) {
	    switch (enc) {
	      case 'utf8':
	      case 'utf-8':
	        return 'utf8';
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return 'utf16le';
	      case 'latin1':
	      case 'binary':
	        return 'latin1';
	      case 'base64':
	      case 'ascii':
	      case 'hex':
	        return enc;
	      default:
	        if (retried) return; // undefined
	        enc = ('' + enc).toLowerCase();
	        retried = true;
	    }
	  }
	}
	// Do not cache `Buffer.isEncoding` when checking encoding names as some
	// modules monkey-patch it to support additional encodings
	function normalizeEncoding(enc) {
	  var nenc = _normalizeEncoding(enc);
	  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
	  return nenc || enc;
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters.
	string_decoder.StringDecoder = StringDecoder;
	function StringDecoder(encoding) {
	  this.encoding = normalizeEncoding(encoding);
	  var nb;
	  switch (this.encoding) {
	    case 'utf16le':
	      this.text = utf16Text;
	      this.end = utf16End;
	      nb = 4;
	      break;
	    case 'utf8':
	      this.fillLast = utf8FillLast;
	      nb = 4;
	      break;
	    case 'base64':
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
	  this.lastChar = Buffer.allocUnsafe(nb);
	}

	StringDecoder.prototype.write = function (buf) {
	  if (buf.length === 0) return '';
	  var r;
	  var i;
	  if (this.lastNeed) {
	    r = this.fillLast(buf);
	    if (r === undefined) return '';
	    i = this.lastNeed;
	    this.lastNeed = 0;
	  } else {
	    i = 0;
	  }
	  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
	  return r || '';
	};

	StringDecoder.prototype.end = utf8End;

	// Returns only complete characters in a Buffer
	StringDecoder.prototype.text = utf8Text;

	// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
	StringDecoder.prototype.fillLast = function (buf) {
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
	  this.lastNeed -= buf.length;
	};

	// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
	// continuation byte. If an invalid byte is detected, -2 is returned.
	function utf8CheckByte(byte) {
	  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
	  return byte >> 6 === 0x02 ? -1 : -2;
	}

	// Checks at most 3 bytes at the end of a Buffer in order to detect an
	// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
	// needed to complete the UTF-8 character (if applicable) are returned.
	function utf8CheckIncomplete(self, buf, i) {
	  var j = buf.length - 1;
	  if (j < i) return 0;
	  var nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 1;
	    return nb;
	  }
	  if (--j < i || nb === -2) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 2;
	    return nb;
	  }
	  if (--j < i || nb === -2) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) {
	      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
	    }
	    return nb;
	  }
	  return 0;
	}

	// Validates as many continuation bytes for a multi-byte UTF-8 character as
	// needed or are available. If we see a non-continuation byte where we expect
	// one, we "replace" the validated continuation bytes we've seen so far with
	// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
	// behavior. The continuation byte check is included three times in the case
	// where all of the continuation bytes for a character exist in the same buffer.
	// It is also done this way as a slight performance increase instead of using a
	// loop.
	function utf8CheckExtraBytes(self, buf, p) {
	  if ((buf[0] & 0xC0) !== 0x80) {
	    self.lastNeed = 0;
	    return '\ufffd';
	  }
	  if (self.lastNeed > 1 && buf.length > 1) {
	    if ((buf[1] & 0xC0) !== 0x80) {
	      self.lastNeed = 1;
	      return '\ufffd';
	    }
	    if (self.lastNeed > 2 && buf.length > 2) {
	      if ((buf[2] & 0xC0) !== 0x80) {
	        self.lastNeed = 2;
	        return '\ufffd';
	      }
	    }
	  }
	}

	// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
	function utf8FillLast(buf) {
	  var p = this.lastTotal - this.lastNeed;
	  var r = utf8CheckExtraBytes(this, buf);
	  if (r !== undefined) return r;
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, p, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, p, 0, buf.length);
	  this.lastNeed -= buf.length;
	}

	// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
	// partial character, the character's bytes are buffered until the required
	// number of bytes are available.
	function utf8Text(buf, i) {
	  var total = utf8CheckIncomplete(this, buf, i);
	  if (!this.lastNeed) return buf.toString('utf8', i);
	  this.lastTotal = total;
	  var end = buf.length - (total - this.lastNeed);
	  buf.copy(this.lastChar, 0, end);
	  return buf.toString('utf8', i, end);
	}

	// For UTF-8, a replacement character is added when ending on a partial
	// character.
	function utf8End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + '\ufffd';
	  return r;
	}

	// UTF-16LE typically needs two bytes per character, but even if we have an even
	// number of bytes available, we need to check if we end on a leading/high
	// surrogate. In that case, we need to wait for the next two bytes in order to
	// decode the last character properly.
	function utf16Text(buf, i) {
	  if ((buf.length - i) % 2 === 0) {
	    var r = buf.toString('utf16le', i);
	    if (r) {
	      var c = r.charCodeAt(r.length - 1);
	      if (c >= 0xD800 && c <= 0xDBFF) {
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
	  return buf.toString('utf16le', i, buf.length - 1);
	}

	// For UTF-16LE we do not explicitly append special replacement characters if we
	// end on a partial character, we simply let v8 handle that.
	function utf16End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) {
	    var end = this.lastTotal - this.lastNeed;
	    return r + this.lastChar.toString('utf16le', 0, end);
	  }
	  return r;
	}

	function base64Text(buf, i) {
	  var n = (buf.length - i) % 3;
	  if (n === 0) return buf.toString('base64', i);
	  this.lastNeed = 3 - n;
	  this.lastTotal = 3;
	  if (n === 1) {
	    this.lastChar[0] = buf[buf.length - 1];
	  } else {
	    this.lastChar[0] = buf[buf.length - 2];
	    this.lastChar[1] = buf[buf.length - 1];
	  }
	  return buf.toString('base64', i, buf.length - n);
	}

	function base64End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
	  return r;
	}

	// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
	function simpleWrite(buf) {
	  return buf.toString(this.encoding);
	}

	function simpleEnd(buf) {
	  return buf && buf.length ? this.write(buf) : '';
	}
	return string_decoder;
}

var from_1;
var hasRequiredFrom;

function requireFrom () {
	if (hasRequiredFrom) return from_1;
	hasRequiredFrom = 1;

	/* replacement start */

	const process = requireBrowser$2();

	/* replacement end */

	const { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = requirePrimordials();
	const { Buffer } = require$$0$1;
	const { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = requireErrors().codes;
	function from(Readable, iterable, opts) {
	  let iterator;
	  if (typeof iterable === 'string' || iterable instanceof Buffer) {
	    return new Readable({
	      objectMode: true,
	      ...opts,
	      read() {
	        this.push(iterable);
	        this.push(null);
	      }
	    })
	  }
	  let isAsync;
	  if (iterable && iterable[SymbolAsyncIterator]) {
	    isAsync = true;
	    iterator = iterable[SymbolAsyncIterator]();
	  } else if (iterable && iterable[SymbolIterator]) {
	    isAsync = false;
	    iterator = iterable[SymbolIterator]();
	  } else {
	    throw new ERR_INVALID_ARG_TYPE('iterable', ['Iterable'], iterable)
	  }
	  const readable = new Readable({
	    objectMode: true,
	    highWaterMark: 1,
	    // TODO(ronag): What options should be allowed?
	    ...opts
	  });

	  // Flag to protect against _read
	  // being called before last iteration completion.
	  let reading = false;
	  readable._read = function () {
	    if (!reading) {
	      reading = true;
	      next();
	    }
	  };
	  readable._destroy = function (error, cb) {
	    PromisePrototypeThen(
	      close(error),
	      () => process.nextTick(cb, error),
	      // nextTick is here in case cb throws
	      (e) => process.nextTick(cb, e || error)
	    );
	  };
	  async function close(error) {
	    const hadError = error !== undefined && error !== null;
	    const hasThrow = typeof iterator.throw === 'function';
	    if (hadError && hasThrow) {
	      const { value, done } = await iterator.throw(error);
	      await value;
	      if (done) {
	        return
	      }
	    }
	    if (typeof iterator.return === 'function') {
	      const { value } = await iterator.return();
	      await value;
	    }
	  }
	  async function next() {
	    for (;;) {
	      try {
	        const { value, done } = isAsync ? await iterator.next() : iterator.next();
	        if (done) {
	          readable.push(null);
	        } else {
	          const res = value && typeof value.then === 'function' ? await value : value;
	          if (res === null) {
	            reading = false;
	            throw new ERR_STREAM_NULL_VALUES()
	          } else if (readable.push(res)) {
	            continue
	          } else {
	            reading = false;
	          }
	        }
	      } catch (err) {
	        readable.destroy(err);
	      }
	      break
	    }
	  }
	  return readable
	}
	from_1 = from;
	return from_1;
}

var readable;
var hasRequiredReadable;

function requireReadable () {
	if (hasRequiredReadable) return readable;
	hasRequiredReadable = 1;

	/* replacement start */

	const process = requireBrowser$2();

	/* replacement end */

	const {
	  ArrayPrototypeIndexOf,
	  NumberIsInteger,
	  NumberIsNaN,
	  NumberParseInt,
	  ObjectDefineProperties,
	  ObjectKeys,
	  ObjectSetPrototypeOf,
	  Promise,
	  SafeSet,
	  SymbolAsyncDispose,
	  SymbolAsyncIterator,
	  Symbol
	} = requirePrimordials();
	readable = Readable;
	Readable.ReadableState = ReadableState;
	const { EventEmitter: EE } = requireEvents$1();
	const { Stream, prependListener } = requireLegacy();
	const { Buffer } = require$$0$1;
	const { addAbortSignal } = requireAddAbortSignal();
	const eos = requireEndOfStream();
	let debug = requireUtil$2().debuglog('stream', (fn) => {
	  debug = fn;
	});
	const BufferList = requireBuffer_list();
	const destroyImpl = requireDestroy();
	const { getHighWaterMark, getDefaultHighWaterMark } = requireState();
	const {
	  aggregateTwoErrors,
	  codes: {
	    ERR_INVALID_ARG_TYPE,
	    ERR_METHOD_NOT_IMPLEMENTED,
	    ERR_OUT_OF_RANGE,
	    ERR_STREAM_PUSH_AFTER_EOF,
	    ERR_STREAM_UNSHIFT_AFTER_END_EVENT
	  },
	  AbortError
	} = requireErrors();
	const { validateObject } = requireValidators();
	const kPaused = Symbol('kPaused');
	const { StringDecoder } = requireString_decoder();
	const from = requireFrom();
	ObjectSetPrototypeOf(Readable.prototype, Stream.prototype);
	ObjectSetPrototypeOf(Readable, Stream);
	const nop = () => {};
	const { errorOrDestroy } = destroyImpl;
	const kObjectMode = 1 << 0;
	const kEnded = 1 << 1;
	const kEndEmitted = 1 << 2;
	const kReading = 1 << 3;
	const kConstructed = 1 << 4;
	const kSync = 1 << 5;
	const kNeedReadable = 1 << 6;
	const kEmittedReadable = 1 << 7;
	const kReadableListening = 1 << 8;
	const kResumeScheduled = 1 << 9;
	const kErrorEmitted = 1 << 10;
	const kEmitClose = 1 << 11;
	const kAutoDestroy = 1 << 12;
	const kDestroyed = 1 << 13;
	const kClosed = 1 << 14;
	const kCloseEmitted = 1 << 15;
	const kMultiAwaitDrain = 1 << 16;
	const kReadingMore = 1 << 17;
	const kDataEmitted = 1 << 18;

	// TODO(benjamingr) it is likely slower to do it this way than with free functions
	function makeBitMapDescriptor(bit) {
	  return {
	    enumerable: false,
	    get() {
	      return (this.state & bit) !== 0
	    },
	    set(value) {
	      if (value) this.state |= bit;
	      else this.state &= ~bit;
	    }
	  }
	}
	ObjectDefineProperties(ReadableState.prototype, {
	  objectMode: makeBitMapDescriptor(kObjectMode),
	  ended: makeBitMapDescriptor(kEnded),
	  endEmitted: makeBitMapDescriptor(kEndEmitted),
	  reading: makeBitMapDescriptor(kReading),
	  // Stream is still being constructed and cannot be
	  // destroyed until construction finished or failed.
	  // Async construction is opt in, therefore we start as
	  // constructed.
	  constructed: makeBitMapDescriptor(kConstructed),
	  // A flag to be able to tell if the event 'readable'/'data' is emitted
	  // immediately, or on a later tick.  We set this to true at first, because
	  // any actions that shouldn't happen until "later" should generally also
	  // not happen before the first read call.
	  sync: makeBitMapDescriptor(kSync),
	  // Whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  needReadable: makeBitMapDescriptor(kNeedReadable),
	  emittedReadable: makeBitMapDescriptor(kEmittedReadable),
	  readableListening: makeBitMapDescriptor(kReadableListening),
	  resumeScheduled: makeBitMapDescriptor(kResumeScheduled),
	  // True if the error was already emitted and should not be thrown again.
	  errorEmitted: makeBitMapDescriptor(kErrorEmitted),
	  emitClose: makeBitMapDescriptor(kEmitClose),
	  autoDestroy: makeBitMapDescriptor(kAutoDestroy),
	  // Has it been destroyed.
	  destroyed: makeBitMapDescriptor(kDestroyed),
	  // Indicates whether the stream has finished destroying.
	  closed: makeBitMapDescriptor(kClosed),
	  // True if close has been emitted or would have been emitted
	  // depending on emitClose.
	  closeEmitted: makeBitMapDescriptor(kCloseEmitted),
	  multiAwaitDrain: makeBitMapDescriptor(kMultiAwaitDrain),
	  // If true, a maybeReadMore has been scheduled.
	  readingMore: makeBitMapDescriptor(kReadingMore),
	  dataEmitted: makeBitMapDescriptor(kDataEmitted)
	});
	function ReadableState(options, stream, isDuplex) {
	  // Duplex streams are both readable and writable, but share
	  // the same options object.
	  // However, some cases require setting options to different
	  // values for the readable and the writable sides of the duplex stream.
	  // These options can be provided separately as readableXXX and writableXXX.
	  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof requireDuplex();

	  // Bit map field to store ReadableState more effciently with 1 bit per field
	  // instead of a V8 slot per field.
	  this.state = kEmitClose | kAutoDestroy | kConstructed | kSync;
	  // Object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away.
	  if (options && options.objectMode) this.state |= kObjectMode;
	  if (isDuplex && options && options.readableObjectMode) this.state |= kObjectMode;

	  // The point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  this.highWaterMark = options
	    ? getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex)
	    : getDefaultHighWaterMark(false);

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift().
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = [];
	  this.flowing = null;
	  this[kPaused] = null;

	  // Should close be emitted on destroy. Defaults to true.
	  if (options && options.emitClose === false) this.state &= ~kEmitClose;

	  // Should .destroy() be called after 'end' (and potentially 'finish').
	  if (options && options.autoDestroy === false) this.state &= ~kAutoDestroy;

	  // Indicates whether the stream has errored. When true no further
	  // _read calls, 'data' or 'readable' events should occur. This is needed
	  // since when autoDestroy is disabled we need a way to tell whether the
	  // stream has failed.
	  this.errored = null;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = (options && options.defaultEncoding) || 'utf8';

	  // Ref the piped dest which we need a drain event on it
	  // type: null | Writable | Set<Writable>.
	  this.awaitDrainWriters = null;
	  this.decoder = null;
	  this.encoding = null;
	  if (options && options.encoding) {
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	function Readable(options) {
	  if (!(this instanceof Readable)) return new Readable(options)

	  // Checking for a Stream.Duplex instance is faster here instead of inside
	  // the ReadableState constructor, at least with V8 6.5.
	  const isDuplex = this instanceof requireDuplex();
	  this._readableState = new ReadableState(options, this, isDuplex);
	  if (options) {
	    if (typeof options.read === 'function') this._read = options.read;
	    if (typeof options.destroy === 'function') this._destroy = options.destroy;
	    if (typeof options.construct === 'function') this._construct = options.construct;
	    if (options.signal && !isDuplex) addAbortSignal(options.signal, this);
	  }
	  Stream.call(this, options);
	  destroyImpl.construct(this, () => {
	    if (this._readableState.needReadable) {
	      maybeReadMore(this, this._readableState);
	    }
	  });
	}
	Readable.prototype.destroy = destroyImpl.destroy;
	Readable.prototype._undestroy = destroyImpl.undestroy;
	Readable.prototype._destroy = function (err, cb) {
	  cb(err);
	};
	Readable.prototype[EE.captureRejectionSymbol] = function (err) {
	  this.destroy(err);
	};
	Readable.prototype[SymbolAsyncDispose] = function () {
	  let error;
	  if (!this.destroyed) {
	    error = this.readableEnded ? null : new AbortError();
	    this.destroy(error);
	  }
	  return new Promise((resolve, reject) => eos(this, (err) => (err && err !== error ? reject(err) : resolve(null))))
	};

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  return readableAddChunk(this, chunk, encoding, false)
	};

	// Unshift should *always* be something directly out of read().
	Readable.prototype.unshift = function (chunk, encoding) {
	  return readableAddChunk(this, chunk, encoding, true)
	};
	function readableAddChunk(stream, chunk, encoding, addToFront) {
	  debug('readableAddChunk', chunk);
	  const state = stream._readableState;
	  let err;
	  if ((state.state & kObjectMode) === 0) {
	    if (typeof chunk === 'string') {
	      encoding = encoding || state.defaultEncoding;
	      if (state.encoding !== encoding) {
	        if (addToFront && state.encoding) {
	          // When unshifting, if state.encoding is set, we have to save
	          // the string in the BufferList with the state encoding.
	          chunk = Buffer.from(chunk, encoding).toString(state.encoding);
	        } else {
	          chunk = Buffer.from(chunk, encoding);
	          encoding = '';
	        }
	      }
	    } else if (chunk instanceof Buffer) {
	      encoding = '';
	    } else if (Stream._isUint8Array(chunk)) {
	      chunk = Stream._uint8ArrayToBuffer(chunk);
	      encoding = '';
	    } else if (chunk != null) {
	      err = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
	    }
	  }
	  if (err) {
	    errorOrDestroy(stream, err);
	  } else if (chunk === null) {
	    state.state &= ~kReading;
	    onEofChunk(stream, state);
	  } else if ((state.state & kObjectMode) !== 0 || (chunk && chunk.length > 0)) {
	    if (addToFront) {
	      if ((state.state & kEndEmitted) !== 0) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
	      else if (state.destroyed || state.errored) return false
	      else addChunk(stream, state, chunk, true);
	    } else if (state.ended) {
	      errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
	    } else if (state.destroyed || state.errored) {
	      return false
	    } else {
	      state.state &= ~kReading;
	      if (state.decoder && !encoding) {
	        chunk = state.decoder.write(chunk);
	        if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
	        else maybeReadMore(stream, state);
	      } else {
	        addChunk(stream, state, chunk, false);
	      }
	    }
	  } else if (!addToFront) {
	    state.state &= ~kReading;
	    maybeReadMore(stream, state);
	  }

	  // We can push more data if we are below the highWaterMark.
	  // Also, if we have no data yet, we can stand some more bytes.
	  // This is to work around cases where hwm=0, such as the repl.
	  return !state.ended && (state.length < state.highWaterMark || state.length === 0)
	}
	function addChunk(stream, state, chunk, addToFront) {
	  if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount('data') > 0) {
	    // Use the guard to avoid creating `Set()` repeatedly
	    // when we have multiple pipes.
	    if ((state.state & kMultiAwaitDrain) !== 0) {
	      state.awaitDrainWriters.clear();
	    } else {
	      state.awaitDrainWriters = null;
	    }
	    state.dataEmitted = true;
	    stream.emit('data', chunk);
	  } else {
	    // Update the buffer info.
	    state.length += state.objectMode ? 1 : chunk.length;
	    if (addToFront) state.buffer.unshift(chunk);
	    else state.buffer.push(chunk);
	    if ((state.state & kNeedReadable) !== 0) emitReadable(stream);
	  }
	  maybeReadMore(stream, state);
	}
	Readable.prototype.isPaused = function () {
	  const state = this._readableState;
	  return state[kPaused] === true || state.flowing === false
	};

	// Backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  const decoder = new StringDecoder(enc);
	  this._readableState.decoder = decoder;
	  // If setEncoding(null), decoder.encoding equals utf8.
	  this._readableState.encoding = this._readableState.decoder.encoding;
	  const buffer = this._readableState.buffer;
	  // Iterate over current buffer to convert already stored Buffers:
	  let content = '';
	  for (const data of buffer) {
	    content += decoder.write(data);
	  }
	  buffer.clear();
	  if (content !== '') buffer.push(content);
	  this._readableState.length = content.length;
	  return this
	};

	// Don't raise the hwm > 1GB.
	const MAX_HWM = 0x40000000;
	function computeNewHighWaterMark(n) {
	  if (n > MAX_HWM) {
	    throw new ERR_OUT_OF_RANGE('size', '<= 1GiB', n)
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts.
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || (state.length === 0 && state.ended)) return 0
	  if ((state.state & kObjectMode) !== 0) return 1
	  if (NumberIsNaN(n)) {
	    // Only flow one buffer at a time.
	    if (state.flowing && state.length) return state.buffer.first().length
	    return state.length
	  }
	  if (n <= state.length) return n
	  return state.ended ? state.length : 0
	}

	// You can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  // Same as parseInt(undefined, 10), however V8 7.3 performance regressed
	  // in this scenario, so we are doing it manually.
	  if (n === undefined) {
	    n = NaN;
	  } else if (!NumberIsInteger(n)) {
	    n = NumberParseInt(n, 10);
	  }
	  const state = this._readableState;
	  const nOrig = n;

	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n !== 0) state.state &= ~kEmittedReadable;

	  // If we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (
	    n === 0 &&
	    state.needReadable &&
	    ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)
	  ) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);
	    else emitReadable(this);
	    return null
	  }
	  n = howMuchToRead(n, state);

	  // If we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  let doRead = (state.state & kNeedReadable) !== 0;
	  debug('need readable', doRead);

	  // If we currently have less than the highWaterMark, then also read some.
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // However, if we've ended, then there's no point, if we're already
	  // reading, then it's unnecessary, if we're constructing we have to wait,
	  // and if we're destroyed or errored, then it's not allowed,
	  if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
	    doRead = false;
	    debug('reading, ended or constructing', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.state |= kReading | kSync;
	    // If the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.state |= kNeedReadable;

	    // Call internal read method
	    try {
	      this._read(state.highWaterMark);
	    } catch (err) {
	      errorOrDestroy(this, err);
	    }
	    state.state &= ~kSync;

	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }
	  let ret;
	  if (n > 0) ret = fromList(n, state);
	  else ret = null;
	  if (ret === null) {
	    state.needReadable = state.length <= state.highWaterMark;
	    n = 0;
	  } else {
	    state.length -= n;
	    if (state.multiAwaitDrain) {
	      state.awaitDrainWriters.clear();
	    } else {
	      state.awaitDrainWriters = null;
	    }
	  }
	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }
	  if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
	    state.dataEmitted = true;
	    this.emit('data', ret);
	  }
	  return ret
	};
	function onEofChunk(stream, state) {
	  debug('onEofChunk');
	  if (state.ended) return
	  if (state.decoder) {
	    const chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;
	  if (state.sync) {
	    // If we are sync, wait until next tick to emit the data.
	    // Otherwise we risk emitting data in the flow()
	    // the readable code triggers during a read() call.
	    emitReadable(stream);
	  } else {
	    // Emit 'readable' now to make sure it gets picked up.
	    state.needReadable = false;
	    state.emittedReadable = true;
	    // We have to emit readable now that we are EOF. Modules
	    // in the ecosystem (e.g. dicer) rely on this event being sync.
	    emitReadable_(stream);
	  }
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  const state = stream._readableState;
	  debug('emitReadable', state.needReadable, state.emittedReadable);
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    process.nextTick(emitReadable_, stream);
	  }
	}
	function emitReadable_(stream) {
	  const state = stream._readableState;
	  debug('emitReadable_', state.destroyed, state.length, state.ended);
	  if (!state.destroyed && !state.errored && (state.length || state.ended)) {
	    stream.emit('readable');
	    state.emittedReadable = false;
	  }

	  // The stream needs another readable event if:
	  // 1. It is not flowing, as the flow mechanism will take
	  //    care of it.
	  // 2. It is not ended.
	  // 3. It is below the highWaterMark, so we can schedule
	  //    another readable later.
	  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
	  flow(stream);
	}

	// At this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore && state.constructed) {
	    state.readingMore = true;
	    process.nextTick(maybeReadMore_, stream, state);
	  }
	}
	function maybeReadMore_(stream, state) {
	  // Attempt to read more data if we should.
	  //
	  // The conditions for reading more data are (one of):
	  // - Not enough data buffered (state.length < state.highWaterMark). The loop
	  //   is responsible for filling the buffer with enough data if such data
	  //   is available. If highWaterMark is 0 and we are not in the flowing mode
	  //   we should _not_ attempt to buffer any extra data. We'll get more data
	  //   when the stream consumer calls read() instead.
	  // - No data in the buffer, and the stream is in flowing mode. In this mode
	  //   the loop below is responsible for ensuring read() is called. Failing to
	  //   call read here would abort the flow and there's no other mechanism for
	  //   continuing the flow if the stream consumer has just subscribed to the
	  //   'data' event.
	  //
	  // In addition to the above conditions to keep reading data, the following
	  // conditions prevent the data from being read:
	  // - The stream has ended (state.ended).
	  // - There is already a pending 'read' operation (state.reading). This is a
	  //   case where the stream has called the implementation defined _read()
	  //   method, but they are processing the call asynchronously and have _not_
	  //   called push() with new data. In this case we skip performing more
	  //   read()s. The execution ends in this method again after the _read() ends
	  //   up calling push() with more data.
	  while (
	    !state.reading &&
	    !state.ended &&
	    (state.length < state.highWaterMark || (state.flowing && state.length === 0))
	  ) {
	    const len = state.length;
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // Didn't get any data, stop spinning.
	      break
	  }
	  state.readingMore = false;
	}

	// Abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  throw new ERR_METHOD_NOT_IMPLEMENTED('_read()')
	};
	Readable.prototype.pipe = function (dest, pipeOpts) {
	  const src = this;
	  const state = this._readableState;
	  if (state.pipes.length === 1) {
	    if (!state.multiAwaitDrain) {
	      state.multiAwaitDrain = true;
	      state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
	    }
	  }
	  state.pipes.push(dest);
	  debug('pipe count=%d opts=%j', state.pipes.length, pipeOpts);
	  const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
	  const endFn = doEnd ? onend : unpipe;
	  if (state.endEmitted) process.nextTick(endFn);
	  else src.once('end', endFn);
	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable, unpipeInfo) {
	    debug('onunpipe');
	    if (readable === src) {
	      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
	        unpipeInfo.hasUnpiped = true;
	        cleanup();
	      }
	    }
	  }
	  function onend() {
	    debug('onend');
	    dest.end();
	  }
	  let ondrain;
	  let cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // Cleanup event handlers once the pipe is broken.
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    if (ondrain) {
	      dest.removeListener('drain', ondrain);
	    }
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', unpipe);
	    src.removeListener('data', ondata);
	    cleanedUp = true;

	    // If the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }
	  function pause() {
	    // If the user unpiped during `dest.write()`, it is possible
	    // to get stuck in a permanently paused state if that write
	    // also returned false.
	    // => Check whether `dest` is still a piping destination.
	    if (!cleanedUp) {
	      if (state.pipes.length === 1 && state.pipes[0] === dest) {
	        debug('false write response, pause', 0);
	        state.awaitDrainWriters = dest;
	        state.multiAwaitDrain = false;
	      } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
	        debug('false write response, pause', state.awaitDrainWriters.size);
	        state.awaitDrainWriters.add(dest);
	      }
	      src.pause();
	    }
	    if (!ondrain) {
	      // When the dest drains, it reduces the awaitDrain counter
	      // on the source.  This would be more elegant with a .once()
	      // handler in flow(), but adding and removing repeatedly is
	      // too slow.
	      ondrain = pipeOnDrain(src, dest);
	      dest.on('drain', ondrain);
	    }
	  }
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    const ret = dest.write(chunk);
	    debug('dest.write', ret);
	    if (ret === false) {
	      pause();
	    }
	  }

	  // If the dest has an error, then stop piping into it.
	  // However, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (dest.listenerCount('error') === 0) {
	      const s = dest._writableState || dest._readableState;
	      if (s && !s.errorEmitted) {
	        // User incorrectly emitted 'error' directly on the stream.
	        errorOrDestroy(dest, er);
	      } else {
	        dest.emit('error', er);
	      }
	    }
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);
	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // Tell the dest that it's being piped to.
	  dest.emit('pipe', src);

	  // Start the flow if it hasn't been started already.

	  if (dest.writableNeedDrain === true) {
	    pause();
	  } else if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }
	  return dest
	};
	function pipeOnDrain(src, dest) {
	  return function pipeOnDrainFunctionResult() {
	    const state = src._readableState;

	    // `ondrain` will call directly,
	    // `this` maybe not a reference to dest,
	    // so we use the real dest here.
	    if (state.awaitDrainWriters === dest) {
	      debug('pipeOnDrain', 1);
	      state.awaitDrainWriters = null;
	    } else if (state.multiAwaitDrain) {
	      debug('pipeOnDrain', state.awaitDrainWriters.size);
	      state.awaitDrainWriters.delete(dest);
	    }
	    if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount('data')) {
	      src.resume();
	    }
	  }
	}
	Readable.prototype.unpipe = function (dest) {
	  const state = this._readableState;
	  const unpipeInfo = {
	    hasUnpiped: false
	  };

	  // If we're not piping anywhere, then do nothing.
	  if (state.pipes.length === 0) return this
	  if (!dest) {
	    // remove all.
	    const dests = state.pipes;
	    state.pipes = [];
	    this.pause();
	    for (let i = 0; i < dests.length; i++)
	      dests[i].emit('unpipe', this, {
	        hasUnpiped: false
	      });
	    return this
	  }

	  // Try to find the right one.
	  const index = ArrayPrototypeIndexOf(state.pipes, dest);
	  if (index === -1) return this
	  state.pipes.splice(index, 1);
	  if (state.pipes.length === 0) this.pause();
	  dest.emit('unpipe', this, unpipeInfo);
	  return this
	};

	// Set up data events if they are asked for
	// Ensure readable listeners eventually get something.
	Readable.prototype.on = function (ev, fn) {
	  const res = Stream.prototype.on.call(this, ev, fn);
	  const state = this._readableState;
	  if (ev === 'data') {
	    // Update readableListening so that resume() may be a no-op
	    // a few lines down. This is needed to support once('readable').
	    state.readableListening = this.listenerCount('readable') > 0;

	    // Try start flowing on next tick if stream isn't explicitly paused.
	    if (state.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.flowing = false;
	      state.emittedReadable = false;
	      debug('on readable', state.length, state.reading);
	      if (state.length) {
	        emitReadable(this);
	      } else if (!state.reading) {
	        process.nextTick(nReadingNextTick, this);
	      }
	    }
	  }
	  return res
	};
	Readable.prototype.addListener = Readable.prototype.on;
	Readable.prototype.removeListener = function (ev, fn) {
	  const res = Stream.prototype.removeListener.call(this, ev, fn);
	  if (ev === 'readable') {
	    // We need to check if there is someone still listening to
	    // readable and reset the state. However this needs to happen
	    // after readable has been emitted but before I/O (nextTick) to
	    // support once('readable', fn) cycles. This means that calling
	    // resume within the same tick will have no
	    // effect.
	    process.nextTick(updateReadableListening, this);
	  }
	  return res
	};
	Readable.prototype.off = Readable.prototype.removeListener;
	Readable.prototype.removeAllListeners = function (ev) {
	  const res = Stream.prototype.removeAllListeners.apply(this, arguments);
	  if (ev === 'readable' || ev === undefined) {
	    // We need to check if there is someone still listening to
	    // readable and reset the state. However this needs to happen
	    // after readable has been emitted but before I/O (nextTick) to
	    // support once('readable', fn) cycles. This means that calling
	    // resume within the same tick will have no
	    // effect.
	    process.nextTick(updateReadableListening, this);
	  }
	  return res
	};
	function updateReadableListening(self) {
	  const state = self._readableState;
	  state.readableListening = self.listenerCount('readable') > 0;
	  if (state.resumeScheduled && state[kPaused] === false) {
	    // Flowing needs to be set to true now, otherwise
	    // the upcoming resume will not flow.
	    state.flowing = true;

	    // Crude way to check if we should resume.
	  } else if (self.listenerCount('data') > 0) {
	    self.resume();
	  } else if (!state.readableListening) {
	    state.flowing = null;
	  }
	}
	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  const state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    // We flow only if there is no one listening
	    // for readable, but we still have to call
	    // resume().
	    state.flowing = !state.readableListening;
	    resume(this, state);
	  }
	  state[kPaused] = false;
	  return this
	};
	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(resume_, stream, state);
	  }
	}
	function resume_(stream, state) {
	  debug('resume', state.reading);
	  if (!state.reading) {
	    stream.read(0);
	  }
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}
	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (this._readableState.flowing !== false) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  this._readableState[kPaused] = true;
	  return this
	};
	function flow(stream) {
	  const state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null);
	}

	// Wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  let paused = false;

	  // TODO (ronag): Should this.destroy(err) emit
	  // 'error' on the wrapped stream? Would require
	  // a static factory method, e.g. Readable.wrap(stream).

	  stream.on('data', (chunk) => {
	    if (!this.push(chunk) && stream.pause) {
	      paused = true;
	      stream.pause();
	    }
	  });
	  stream.on('end', () => {
	    this.push(null);
	  });
	  stream.on('error', (err) => {
	    errorOrDestroy(this, err);
	  });
	  stream.on('close', () => {
	    this.destroy();
	  });
	  stream.on('destroy', () => {
	    this.destroy();
	  });
	  this._read = () => {
	    if (paused && stream.resume) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  // Proxy all the other methods. Important when wrapping filters and duplexes.
	  const streamKeys = ObjectKeys(stream);
	  for (let j = 1; j < streamKeys.length; j++) {
	    const i = streamKeys[j];
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = stream[i].bind(stream);
	    }
	  }
	  return this
	};
	Readable.prototype[SymbolAsyncIterator] = function () {
	  return streamToAsyncIterator(this)
	};
	Readable.prototype.iterator = function (options) {
	  if (options !== undefined) {
	    validateObject(options, 'options');
	  }
	  return streamToAsyncIterator(this, options)
	};
	function streamToAsyncIterator(stream, options) {
	  if (typeof stream.read !== 'function') {
	    stream = Readable.wrap(stream, {
	      objectMode: true
	    });
	  }
	  const iter = createAsyncIterator(stream, options);
	  iter.stream = stream;
	  return iter
	}
	async function* createAsyncIterator(stream, options) {
	  let callback = nop;
	  function next(resolve) {
	    if (this === stream) {
	      callback();
	      callback = nop;
	    } else {
	      callback = resolve;
	    }
	  }
	  stream.on('readable', next);
	  let error;
	  const cleanup = eos(
	    stream,
	    {
	      writable: false
	    },
	    (err) => {
	      error = err ? aggregateTwoErrors(error, err) : null;
	      callback();
	      callback = nop;
	    }
	  );
	  try {
	    while (true) {
	      const chunk = stream.destroyed ? null : stream.read();
	      if (chunk !== null) {
	        yield chunk;
	      } else if (error) {
	        throw error
	      } else if (error === null) {
	        return
	      } else {
	        await new Promise(next);
	      }
	    }
	  } catch (err) {
	    error = aggregateTwoErrors(error, err);
	    throw error
	  } finally {
	    if (
	      (error || (options === null || options === undefined ? undefined : options.destroyOnReturn) !== false) &&
	      (error === undefined || stream._readableState.autoDestroy)
	    ) {
	      destroyImpl.destroyer(stream, null);
	    } else {
	      stream.off('readable', next);
	      cleanup();
	    }
	  }
	}

	// Making it explicit these properties are not enumerable
	// because otherwise some prototype manipulation in
	// userland will fail.
	ObjectDefineProperties(Readable.prototype, {
	  readable: {
	    __proto__: null,
	    get() {
	      const r = this._readableState;
	      // r.readable === false means that this is part of a Duplex stream
	      // where the readable side was disabled upon construction.
	      // Compat. The user might manually disable readable side through
	      // deprecated setter.
	      return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted
	    },
	    set(val) {
	      // Backwards compat.
	      if (this._readableState) {
	        this._readableState.readable = !!val;
	      }
	    }
	  },
	  readableDidRead: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return this._readableState.dataEmitted
	    }
	  },
	  readableAborted: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return !!(
	        this._readableState.readable !== false &&
	        (this._readableState.destroyed || this._readableState.errored) &&
	        !this._readableState.endEmitted
	      )
	    }
	  },
	  readableHighWaterMark: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return this._readableState.highWaterMark
	    }
	  },
	  readableBuffer: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return this._readableState && this._readableState.buffer
	    }
	  },
	  readableFlowing: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return this._readableState.flowing
	    },
	    set: function (state) {
	      if (this._readableState) {
	        this._readableState.flowing = state;
	      }
	    }
	  },
	  readableLength: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState.length
	    }
	  },
	  readableObjectMode: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState ? this._readableState.objectMode : false
	    }
	  },
	  readableEncoding: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState ? this._readableState.encoding : null
	    }
	  },
	  errored: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState ? this._readableState.errored : null
	    }
	  },
	  closed: {
	    __proto__: null,
	    get() {
	      return this._readableState ? this._readableState.closed : false
	    }
	  },
	  destroyed: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState ? this._readableState.destroyed : false
	    },
	    set(value) {
	      // We ignore the value if the stream
	      // has not been initialized yet.
	      if (!this._readableState) {
	        return
	      }

	      // Backward compatibility, the user is explicitly
	      // managing destroyed.
	      this._readableState.destroyed = value;
	    }
	  },
	  readableEnded: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._readableState ? this._readableState.endEmitted : false
	    }
	  }
	});
	ObjectDefineProperties(ReadableState.prototype, {
	  // Legacy getter for `pipesCount`.
	  pipesCount: {
	    __proto__: null,
	    get() {
	      return this.pipes.length
	    }
	  },
	  // Legacy property for `paused`.
	  paused: {
	    __proto__: null,
	    get() {
	      return this[kPaused] !== false
	    },
	    set(value) {
	      this[kPaused] = !!value;
	    }
	  }
	});

	// Exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered.
	  if (state.length === 0) return null
	  let ret;
	  if (state.objectMode) ret = state.buffer.shift();
	  else if (!n || n >= state.length) {
	    // Read it all, truncate the list.
	    if (state.decoder) ret = state.buffer.join('');
	    else if (state.buffer.length === 1) ret = state.buffer.first();
	    else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list.
	    ret = state.buffer.consume(n, state.decoder);
	  }
	  return ret
	}
	function endReadable(stream) {
	  const state = stream._readableState;
	  debug('endReadable', state.endEmitted);
	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(endReadableNT, state, stream);
	  }
	}
	function endReadableNT(state, stream) {
	  debug('endReadableNT', state.endEmitted, state.length);

	  // Check that we didn't get one last unshift.
	  if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.emit('end');
	    if (stream.writable && stream.allowHalfOpen === false) {
	      process.nextTick(endWritableNT, stream);
	    } else if (state.autoDestroy) {
	      // In case of duplex streams we need a way to detect
	      // if the writable side is ready for autoDestroy as well.
	      const wState = stream._writableState;
	      const autoDestroy =
	        !wState ||
	        (wState.autoDestroy &&
	          // We don't expect the writable to ever 'finish'
	          // if writable is explicitly set to false.
	          (wState.finished || wState.writable === false));
	      if (autoDestroy) {
	        stream.destroy();
	      }
	    }
	  }
	}
	function endWritableNT(stream) {
	  const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
	  if (writable) {
	    stream.end();
	  }
	}
	Readable.from = function (iterable, opts) {
	  return from(Readable, iterable, opts)
	};
	let webStreamsAdapters;

	// Lazy to avoid circular references
	function lazyWebStreams() {
	  if (webStreamsAdapters === undefined) webStreamsAdapters = {};
	  return webStreamsAdapters
	}
	Readable.fromWeb = function (readableStream, options) {
	  return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options)
	};
	Readable.toWeb = function (streamReadable, options) {
	  return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options)
	};
	Readable.wrap = function (src, options) {
	  var _ref, _src$readableObjectMo;
	  return new Readable({
	    objectMode:
	      (_ref =
	        (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== undefined
	          ? _src$readableObjectMo
	          : src.objectMode) !== null && _ref !== undefined
	        ? _ref
	        : true,
	    ...options,
	    destroy(err, callback) {
	      destroyImpl.destroyer(src, err);
	      callback(err);
	    }
	  }).wrap(src)
	};
	return readable;
}

var writable;
var hasRequiredWritable;

function requireWritable () {
	if (hasRequiredWritable) return writable;
	hasRequiredWritable = 1;

	/* replacement start */

	const process = requireBrowser$2();

	/* replacement end */

	const {
	  ArrayPrototypeSlice,
	  Error,
	  FunctionPrototypeSymbolHasInstance,
	  ObjectDefineProperty,
	  ObjectDefineProperties,
	  ObjectSetPrototypeOf,
	  StringPrototypeToLowerCase,
	  Symbol,
	  SymbolHasInstance
	} = requirePrimordials();
	writable = Writable;
	Writable.WritableState = WritableState;
	const { EventEmitter: EE } = requireEvents$1();
	const Stream = requireLegacy().Stream;
	const { Buffer } = require$$0$1;
	const destroyImpl = requireDestroy();
	const { addAbortSignal } = requireAddAbortSignal();
	const { getHighWaterMark, getDefaultHighWaterMark } = requireState();
	const {
	  ERR_INVALID_ARG_TYPE,
	  ERR_METHOD_NOT_IMPLEMENTED,
	  ERR_MULTIPLE_CALLBACK,
	  ERR_STREAM_CANNOT_PIPE,
	  ERR_STREAM_DESTROYED,
	  ERR_STREAM_ALREADY_FINISHED,
	  ERR_STREAM_NULL_VALUES,
	  ERR_STREAM_WRITE_AFTER_END,
	  ERR_UNKNOWN_ENCODING
	} = requireErrors().codes;
	const { errorOrDestroy } = destroyImpl;
	ObjectSetPrototypeOf(Writable.prototype, Stream.prototype);
	ObjectSetPrototypeOf(Writable, Stream);
	function nop() {}
	const kOnFinished = Symbol('kOnFinished');
	function WritableState(options, stream, isDuplex) {
	  // Duplex streams are both readable and writable, but share
	  // the same options object.
	  // However, some cases require setting options to different
	  // values for the readable and the writable sides of the duplex stream,
	  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
	  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof requireDuplex();

	  // Object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!(options && options.objectMode);
	  if (isDuplex) this.objectMode = this.objectMode || !!(options && options.writableObjectMode);

	  // The point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write().
	  this.highWaterMark = options
	    ? getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex)
	    : getDefaultHighWaterMark(false);

	  // if _final has been called.
	  this.finalCalled = false;

	  // drain event flag.
	  this.needDrain = false;
	  // At the start of calling end()
	  this.ending = false;
	  // When end() has been called, and returned.
	  this.ended = false;
	  // When 'finish' is emitted.
	  this.finished = false;

	  // Has it been destroyed
	  this.destroyed = false;

	  // Should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  const noDecode = !!(options && options.decodeStrings === false);
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = (options && options.defaultEncoding) || 'utf8';

	  // Not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // A flag to see when we're in the middle of a write.
	  this.writing = false;

	  // When true all writes will be buffered until .uncork() call.
	  this.corked = 0;

	  // A flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // A flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // The callback that's passed to _write(chunk, cb).
	  this.onwrite = onwrite.bind(undefined, stream);

	  // The callback that the user supplies to write(chunk, encoding, cb).
	  this.writecb = null;

	  // The amount that is being written when _write is called.
	  this.writelen = 0;

	  // Storage for data passed to the afterWrite() callback in case of
	  // synchronous _write() completion.
	  this.afterWriteTickInfo = null;
	  resetBuffer(this);

	  // Number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted.
	  this.pendingcb = 0;

	  // Stream is still being constructed and cannot be
	  // destroyed until construction finished or failed.
	  // Async construction is opt in, therefore we start as
	  // constructed.
	  this.constructed = true;

	  // Emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams.
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again.
	  this.errorEmitted = false;

	  // Should close be emitted on destroy. Defaults to true.
	  this.emitClose = !options || options.emitClose !== false;

	  // Should .destroy() be called after 'finish' (and potentially 'end').
	  this.autoDestroy = !options || options.autoDestroy !== false;

	  // Indicates whether the stream has errored. When true all write() calls
	  // should return false. This is needed since when autoDestroy
	  // is disabled we need a way to tell whether the stream has failed.
	  this.errored = null;

	  // Indicates whether the stream has finished destroying.
	  this.closed = false;

	  // True if close has been emitted or would have been emitted
	  // depending on emitClose.
	  this.closeEmitted = false;
	  this[kOnFinished] = [];
	}
	function resetBuffer(state) {
	  state.buffered = [];
	  state.bufferedIndex = 0;
	  state.allBuffers = true;
	  state.allNoop = true;
	}
	WritableState.prototype.getBuffer = function getBuffer() {
	  return ArrayPrototypeSlice(this.buffered, this.bufferedIndex)
	};
	ObjectDefineProperty(WritableState.prototype, 'bufferedRequestCount', {
	  __proto__: null,
	  get() {
	    return this.buffered.length - this.bufferedIndex
	  }
	});
	function Writable(options) {
	  // Writable ctor is applied to Duplexes, too.
	  // `realHasInstance` is necessary because using plain `instanceof`
	  // would return false, as no `_writableState` property is attached.

	  // Trying to use the custom `instanceof` for Writable here will also break the
	  // Node.js LazyTransform implementation, which has a non-trivial getter for
	  // `_writableState` that would lead to infinite recursion.

	  // Checking for a Stream.Duplex instance is faster here instead of inside
	  // the WritableState constructor, at least with V8 6.5.
	  const isDuplex = this instanceof requireDuplex();
	  if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable, this)) return new Writable(options)
	  this._writableState = new WritableState(options, this, isDuplex);
	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;
	    if (typeof options.writev === 'function') this._writev = options.writev;
	    if (typeof options.destroy === 'function') this._destroy = options.destroy;
	    if (typeof options.final === 'function') this._final = options.final;
	    if (typeof options.construct === 'function') this._construct = options.construct;
	    if (options.signal) addAbortSignal(options.signal, this);
	  }
	  Stream.call(this, options);
	  destroyImpl.construct(this, () => {
	    const state = this._writableState;
	    if (!state.writing) {
	      clearBuffer(this, state);
	    }
	    finishMaybe(this, state);
	  });
	}
	ObjectDefineProperty(Writable, SymbolHasInstance, {
	  __proto__: null,
	  value: function (object) {
	    if (FunctionPrototypeSymbolHasInstance(this, object)) return true
	    if (this !== Writable) return false
	    return object && object._writableState instanceof WritableState
	  }
	});

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
	};
	function _write(stream, chunk, encoding, cb) {
	  const state = stream._writableState;
	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = state.defaultEncoding;
	  } else {
	    if (!encoding) encoding = state.defaultEncoding;
	    else if (encoding !== 'buffer' && !Buffer.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding)
	    if (typeof cb !== 'function') cb = nop;
	  }
	  if (chunk === null) {
	    throw new ERR_STREAM_NULL_VALUES()
	  } else if (!state.objectMode) {
	    if (typeof chunk === 'string') {
	      if (state.decodeStrings !== false) {
	        chunk = Buffer.from(chunk, encoding);
	        encoding = 'buffer';
	      }
	    } else if (chunk instanceof Buffer) {
	      encoding = 'buffer';
	    } else if (Stream._isUint8Array(chunk)) {
	      chunk = Stream._uint8ArrayToBuffer(chunk);
	      encoding = 'buffer';
	    } else {
	      throw new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk)
	    }
	  }
	  let err;
	  if (state.ending) {
	    err = new ERR_STREAM_WRITE_AFTER_END();
	  } else if (state.destroyed) {
	    err = new ERR_STREAM_DESTROYED('write');
	  }
	  if (err) {
	    process.nextTick(cb, err);
	    errorOrDestroy(stream, err, true);
	    return err
	  }
	  state.pendingcb++;
	  return writeOrBuffer(stream, state, chunk, encoding, cb)
	}
	Writable.prototype.write = function (chunk, encoding, cb) {
	  return _write(this, chunk, encoding, cb) === true
	};
	Writable.prototype.cork = function () {
	  this._writableState.corked++;
	};
	Writable.prototype.uncork = function () {
	  const state = this._writableState;
	  if (state.corked) {
	    state.corked--;
	    if (!state.writing) clearBuffer(this, state);
	  }
	};
	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = StringPrototypeToLowerCase(encoding);
	  if (!Buffer.isEncoding(encoding)) throw new ERR_UNKNOWN_ENCODING(encoding)
	  this._writableState.defaultEncoding = encoding;
	  return this
	};

	// If we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, callback) {
	  const len = state.objectMode ? 1 : chunk.length;
	  state.length += len;

	  // stream._write resets state.length
	  const ret = state.length < state.highWaterMark;
	  // We must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;
	  if (state.writing || state.corked || state.errored || !state.constructed) {
	    state.buffered.push({
	      chunk,
	      encoding,
	      callback
	    });
	    if (state.allBuffers && encoding !== 'buffer') {
	      state.allBuffers = false;
	    }
	    if (state.allNoop && callback !== nop) {
	      state.allNoop = false;
	    }
	  } else {
	    state.writelen = len;
	    state.writecb = callback;
	    state.writing = true;
	    state.sync = true;
	    stream._write(chunk, encoding, state.onwrite);
	    state.sync = false;
	  }

	  // Return false if errored or destroyed in order to break
	  // any synchronous while(stream.write(data)) loops.
	  return ret && !state.errored && !state.destroyed
	}
	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));
	  else if (writev) stream._writev(chunk, state.onwrite);
	  else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}
	function onwriteError(stream, state, er, cb) {
	  --state.pendingcb;
	  cb(er);
	  // Ensure callbacks are invoked even when autoDestroy is
	  // not enabled. Passing `er` here doesn't make sense since
	  // it's related to one specific write, not to the buffered
	  // writes.
	  errorBuffer(state);
	  // This can emit error, but error must always follow cb.
	  errorOrDestroy(stream, er);
	}
	function onwrite(stream, er) {
	  const state = stream._writableState;
	  const sync = state.sync;
	  const cb = state.writecb;
	  if (typeof cb !== 'function') {
	    errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK());
	    return
	  }
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	  if (er) {
	    // Avoid V8 leak, https://github.com/nodejs/node/pull/34103#issuecomment-652002364
	    er.stack; // eslint-disable-line no-unused-expressions

	    if (!state.errored) {
	      state.errored = er;
	    }

	    // In case of duplex streams we need to notify the readable side of the
	    // error.
	    if (stream._readableState && !stream._readableState.errored) {
	      stream._readableState.errored = er;
	    }
	    if (sync) {
	      process.nextTick(onwriteError, stream, state, er, cb);
	    } else {
	      onwriteError(stream, state, er, cb);
	    }
	  } else {
	    if (state.buffered.length > state.bufferedIndex) {
	      clearBuffer(stream, state);
	    }
	    if (sync) {
	      // It is a common case that the callback passed to .write() is always
	      // the same. In that case, we do not schedule a new nextTick(), but
	      // rather just increase a counter, to improve performance and avoid
	      // memory allocations.
	      if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
	        state.afterWriteTickInfo.count++;
	      } else {
	        state.afterWriteTickInfo = {
	          count: 1,
	          cb,
	          stream,
	          state
	        };
	        process.nextTick(afterWriteTick, state.afterWriteTickInfo);
	      }
	    } else {
	      afterWrite(stream, state, 1, cb);
	    }
	  }
	}
	function afterWriteTick({ stream, state, count, cb }) {
	  state.afterWriteTickInfo = null;
	  return afterWrite(stream, state, count, cb)
	}
	function afterWrite(stream, state, count, cb) {
	  const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
	  if (needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	  while (count-- > 0) {
	    state.pendingcb--;
	    cb();
	  }
	  if (state.destroyed) {
	    errorBuffer(state);
	  }
	  finishMaybe(stream, state);
	}

	// If there's something in the buffer waiting, then invoke callbacks.
	function errorBuffer(state) {
	  if (state.writing) {
	    return
	  }
	  for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
	    var _state$errored;
	    const { chunk, callback } = state.buffered[n];
	    const len = state.objectMode ? 1 : chunk.length;
	    state.length -= len;
	    callback(
	      (_state$errored = state.errored) !== null && _state$errored !== undefined
	        ? _state$errored
	        : new ERR_STREAM_DESTROYED('write')
	    );
	  }
	  const onfinishCallbacks = state[kOnFinished].splice(0);
	  for (let i = 0; i < onfinishCallbacks.length; i++) {
	    var _state$errored2;
	    onfinishCallbacks[i](
	      (_state$errored2 = state.errored) !== null && _state$errored2 !== undefined
	        ? _state$errored2
	        : new ERR_STREAM_DESTROYED('end')
	    );
	  }
	  resetBuffer(state);
	}

	// If there's something in the buffer waiting, then process it.
	function clearBuffer(stream, state) {
	  if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
	    return
	  }
	  const { buffered, bufferedIndex, objectMode } = state;
	  const bufferedLength = buffered.length - bufferedIndex;
	  if (!bufferedLength) {
	    return
	  }
	  let i = bufferedIndex;
	  state.bufferProcessing = true;
	  if (bufferedLength > 1 && stream._writev) {
	    state.pendingcb -= bufferedLength - 1;
	    const callback = state.allNoop
	      ? nop
	      : (err) => {
	          for (let n = i; n < buffered.length; ++n) {
	            buffered[n].callback(err);
	          }
	        };
	    // Make a copy of `buffered` if it's going to be used by `callback` above,
	    // since `doWrite` will mutate the array.
	    const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
	    chunks.allBuffers = state.allBuffers;
	    doWrite(stream, state, true, state.length, chunks, '', callback);
	    resetBuffer(state);
	  } else {
	    do {
	      const { chunk, encoding, callback } = buffered[i];
	      buffered[i++] = null;
	      const len = objectMode ? 1 : chunk.length;
	      doWrite(stream, state, false, len, chunk, encoding, callback);
	    } while (i < buffered.length && !state.writing)
	    if (i === buffered.length) {
	      resetBuffer(state);
	    } else if (i > 256) {
	      buffered.splice(0, i);
	      state.bufferedIndex = 0;
	    } else {
	      state.bufferedIndex = i;
	    }
	  }
	  state.bufferProcessing = false;
	}
	Writable.prototype._write = function (chunk, encoding, cb) {
	  if (this._writev) {
	    this._writev(
	      [
	        {
	          chunk,
	          encoding
	        }
	      ],
	      cb
	    );
	  } else {
	    throw new ERR_METHOD_NOT_IMPLEMENTED('_write()')
	  }
	};
	Writable.prototype._writev = null;
	Writable.prototype.end = function (chunk, encoding, cb) {
	  const state = this._writableState;
	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }
	  let err;
	  if (chunk !== null && chunk !== undefined) {
	    const ret = _write(this, chunk, encoding);
	    if (ret instanceof Error) {
	      err = ret;
	    }
	  }

	  // .end() fully uncorks.
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }
	  if (err) ; else if (!state.errored && !state.ending) {
	    // This is forgiving in terms of unnecessary calls to end() and can hide
	    // logic errors. However, usually such errors are harmless and causing a
	    // hard error can be disproportionately destructive. It is not always
	    // trivial for the user to determine whether end() needs to be called
	    // or not.

	    state.ending = true;
	    finishMaybe(this, state, true);
	    state.ended = true;
	  } else if (state.finished) {
	    err = new ERR_STREAM_ALREADY_FINISHED('end');
	  } else if (state.destroyed) {
	    err = new ERR_STREAM_DESTROYED('end');
	  }
	  if (typeof cb === 'function') {
	    if (err || state.finished) {
	      process.nextTick(cb, err);
	    } else {
	      state[kOnFinished].push(cb);
	    }
	  }
	  return this
	};
	function needFinish(state) {
	  return (
	    state.ending &&
	    !state.destroyed &&
	    state.constructed &&
	    state.length === 0 &&
	    !state.errored &&
	    state.buffered.length === 0 &&
	    !state.finished &&
	    !state.writing &&
	    !state.errorEmitted &&
	    !state.closeEmitted
	  )
	}
	function callFinal(stream, state) {
	  let called = false;
	  function onFinish(err) {
	    if (called) {
	      errorOrDestroy(stream, err !== null && err !== undefined ? err : ERR_MULTIPLE_CALLBACK());
	      return
	    }
	    called = true;
	    state.pendingcb--;
	    if (err) {
	      const onfinishCallbacks = state[kOnFinished].splice(0);
	      for (let i = 0; i < onfinishCallbacks.length; i++) {
	        onfinishCallbacks[i](err);
	      }
	      errorOrDestroy(stream, err, state.sync);
	    } else if (needFinish(state)) {
	      state.prefinished = true;
	      stream.emit('prefinish');
	      // Backwards compat. Don't check state.sync here.
	      // Some streams assume 'finish' will be emitted
	      // asynchronously relative to _final callback.
	      state.pendingcb++;
	      process.nextTick(finish, stream, state);
	    }
	  }
	  state.sync = true;
	  state.pendingcb++;
	  try {
	    stream._final(onFinish);
	  } catch (err) {
	    onFinish(err);
	  }
	  state.sync = false;
	}
	function prefinish(stream, state) {
	  if (!state.prefinished && !state.finalCalled) {
	    if (typeof stream._final === 'function' && !state.destroyed) {
	      state.finalCalled = true;
	      callFinal(stream, state);
	    } else {
	      state.prefinished = true;
	      stream.emit('prefinish');
	    }
	  }
	}
	function finishMaybe(stream, state, sync) {
	  if (needFinish(state)) {
	    prefinish(stream, state);
	    if (state.pendingcb === 0) {
	      if (sync) {
	        state.pendingcb++;
	        process.nextTick(
	          (stream, state) => {
	            if (needFinish(state)) {
	              finish(stream, state);
	            } else {
	              state.pendingcb--;
	            }
	          },
	          stream,
	          state
	        );
	      } else if (needFinish(state)) {
	        state.pendingcb++;
	        finish(stream, state);
	      }
	    }
	  }
	}
	function finish(stream, state) {
	  state.pendingcb--;
	  state.finished = true;
	  const onfinishCallbacks = state[kOnFinished].splice(0);
	  for (let i = 0; i < onfinishCallbacks.length; i++) {
	    onfinishCallbacks[i]();
	  }
	  stream.emit('finish');
	  if (state.autoDestroy) {
	    // In case of duplex streams we need a way to detect
	    // if the readable side is ready for autoDestroy as well.
	    const rState = stream._readableState;
	    const autoDestroy =
	      !rState ||
	      (rState.autoDestroy &&
	        // We don't expect the readable to ever 'end'
	        // if readable is explicitly set to false.
	        (rState.endEmitted || rState.readable === false));
	    if (autoDestroy) {
	      stream.destroy();
	    }
	  }
	}
	ObjectDefineProperties(Writable.prototype, {
	  closed: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.closed : false
	    }
	  },
	  destroyed: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.destroyed : false
	    },
	    set(value) {
	      // Backward compatibility, the user is explicitly managing destroyed.
	      if (this._writableState) {
	        this._writableState.destroyed = value;
	      }
	    }
	  },
	  writable: {
	    __proto__: null,
	    get() {
	      const w = this._writableState;
	      // w.writable === false means that this is part of a Duplex stream
	      // where the writable side was disabled upon construction.
	      // Compat. The user might manually disable writable side through
	      // deprecated setter.
	      return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended
	    },
	    set(val) {
	      // Backwards compatible.
	      if (this._writableState) {
	        this._writableState.writable = !!val;
	      }
	    }
	  },
	  writableFinished: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.finished : false
	    }
	  },
	  writableObjectMode: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.objectMode : false
	    }
	  },
	  writableBuffer: {
	    __proto__: null,
	    get() {
	      return this._writableState && this._writableState.getBuffer()
	    }
	  },
	  writableEnded: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.ending : false
	    }
	  },
	  writableNeedDrain: {
	    __proto__: null,
	    get() {
	      const wState = this._writableState;
	      if (!wState) return false
	      return !wState.destroyed && !wState.ending && wState.needDrain
	    }
	  },
	  writableHighWaterMark: {
	    __proto__: null,
	    get() {
	      return this._writableState && this._writableState.highWaterMark
	    }
	  },
	  writableCorked: {
	    __proto__: null,
	    get() {
	      return this._writableState ? this._writableState.corked : 0
	    }
	  },
	  writableLength: {
	    __proto__: null,
	    get() {
	      return this._writableState && this._writableState.length
	    }
	  },
	  errored: {
	    __proto__: null,
	    enumerable: false,
	    get() {
	      return this._writableState ? this._writableState.errored : null
	    }
	  },
	  writableAborted: {
	    __proto__: null,
	    enumerable: false,
	    get: function () {
	      return !!(
	        this._writableState.writable !== false &&
	        (this._writableState.destroyed || this._writableState.errored) &&
	        !this._writableState.finished
	      )
	    }
	  }
	});
	const destroy = destroyImpl.destroy;
	Writable.prototype.destroy = function (err, cb) {
	  const state = this._writableState;

	  // Invoke pending callbacks.
	  if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
	    process.nextTick(errorBuffer, state);
	  }
	  destroy.call(this, err, cb);
	  return this
	};
	Writable.prototype._undestroy = destroyImpl.undestroy;
	Writable.prototype._destroy = function (err, cb) {
	  cb(err);
	};
	Writable.prototype[EE.captureRejectionSymbol] = function (err) {
	  this.destroy(err);
	};
	let webStreamsAdapters;

	// Lazy to avoid circular references
	function lazyWebStreams() {
	  if (webStreamsAdapters === undefined) webStreamsAdapters = {};
	  return webStreamsAdapters
	}
	Writable.fromWeb = function (writableStream, options) {
	  return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options)
	};
	Writable.toWeb = function (streamWritable) {
	  return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable)
	};
	return writable;
}

/* replacement start */

var duplexify;
var hasRequiredDuplexify;

function requireDuplexify () {
	if (hasRequiredDuplexify) return duplexify;
	hasRequiredDuplexify = 1;
	const process = requireBrowser$2()

	/* replacement end */

	;	const bufferModule = require$$0$1;
	const {
	  isReadable,
	  isWritable,
	  isIterable,
	  isNodeStream,
	  isReadableNodeStream,
	  isWritableNodeStream,
	  isDuplexNodeStream,
	  isReadableStream,
	  isWritableStream
	} = requireUtils();
	const eos = requireEndOfStream();
	const {
	  AbortError,
	  codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
	} = requireErrors();
	const { destroyer } = requireDestroy();
	const Duplex = requireDuplex();
	const Readable = requireReadable();
	const Writable = requireWritable();
	const { createDeferredPromise } = requireUtil$2();
	const from = requireFrom();
	const Blob = globalThis.Blob || bufferModule.Blob;
	const isBlob =
	  typeof Blob !== 'undefined'
	    ? function isBlob(b) {
	        return b instanceof Blob
	      }
	    : function isBlob(b) {
	        return false
	      };
	const AbortController = globalThis.AbortController || requireBrowser$1().AbortController;
	const { FunctionPrototypeCall } = requirePrimordials();

	// This is needed for pre node 17.
	class Duplexify extends Duplex {
	  constructor(options) {
	    super(options);

	    // https://github.com/nodejs/node/pull/34385

	    if ((options === null || options === undefined ? undefined : options.readable) === false) {
	      this._readableState.readable = false;
	      this._readableState.ended = true;
	      this._readableState.endEmitted = true;
	    }
	    if ((options === null || options === undefined ? undefined : options.writable) === false) {
	      this._writableState.writable = false;
	      this._writableState.ending = true;
	      this._writableState.ended = true;
	      this._writableState.finished = true;
	    }
	  }
	}
	duplexify = function duplexify(body, name) {
	  if (isDuplexNodeStream(body)) {
	    return body
	  }
	  if (isReadableNodeStream(body)) {
	    return _duplexify({
	      readable: body
	    })
	  }
	  if (isWritableNodeStream(body)) {
	    return _duplexify({
	      writable: body
	    })
	  }
	  if (isNodeStream(body)) {
	    return _duplexify({
	      writable: false,
	      readable: false
	    })
	  }
	  if (isReadableStream(body)) {
	    return _duplexify({
	      readable: Readable.fromWeb(body)
	    })
	  }
	  if (isWritableStream(body)) {
	    return _duplexify({
	      writable: Writable.fromWeb(body)
	    })
	  }
	  if (typeof body === 'function') {
	    const { value, write, final, destroy } = fromAsyncGen(body);
	    if (isIterable(value)) {
	      return from(Duplexify, value, {
	        // TODO (ronag): highWaterMark?
	        objectMode: true,
	        write,
	        final,
	        destroy
	      })
	    }
	    const then = value === null || value === undefined ? undefined : value.then;
	    if (typeof then === 'function') {
	      let d;
	      const promise = FunctionPrototypeCall(
	        then,
	        value,
	        (val) => {
	          if (val != null) {
	            throw new ERR_INVALID_RETURN_VALUE('nully', 'body', val)
	          }
	        },
	        (err) => {
	          destroyer(d, err);
	        }
	      );
	      return (d = new Duplexify({
	        // TODO (ronag): highWaterMark?
	        objectMode: true,
	        readable: false,
	        write,
	        final(cb) {
	          final(async () => {
	            try {
	              await promise;
	              process.nextTick(cb, null);
	            } catch (err) {
	              process.nextTick(cb, err);
	            }
	          });
	        },
	        destroy
	      }))
	    }
	    throw new ERR_INVALID_RETURN_VALUE('Iterable, AsyncIterable or AsyncFunction', name, value)
	  }
	  if (isBlob(body)) {
	    return duplexify(body.arrayBuffer())
	  }
	  if (isIterable(body)) {
	    return from(Duplexify, body, {
	      // TODO (ronag): highWaterMark?
	      objectMode: true,
	      writable: false
	    })
	  }
	  if (
	    isReadableStream(body === null || body === undefined ? undefined : body.readable) &&
	    isWritableStream(body === null || body === undefined ? undefined : body.writable)
	  ) {
	    return Duplexify.fromWeb(body)
	  }
	  if (
	    typeof (body === null || body === undefined ? undefined : body.writable) === 'object' ||
	    typeof (body === null || body === undefined ? undefined : body.readable) === 'object'
	  ) {
	    const readable =
	      body !== null && body !== undefined && body.readable
	        ? isReadableNodeStream(body === null || body === undefined ? undefined : body.readable)
	          ? body === null || body === undefined
	            ? undefined
	            : body.readable
	          : duplexify(body.readable)
	        : undefined;
	    const writable =
	      body !== null && body !== undefined && body.writable
	        ? isWritableNodeStream(body === null || body === undefined ? undefined : body.writable)
	          ? body === null || body === undefined
	            ? undefined
	            : body.writable
	          : duplexify(body.writable)
	        : undefined;
	    return _duplexify({
	      readable,
	      writable
	    })
	  }
	  const then = body === null || body === undefined ? undefined : body.then;
	  if (typeof then === 'function') {
	    let d;
	    FunctionPrototypeCall(
	      then,
	      body,
	      (val) => {
	        if (val != null) {
	          d.push(val);
	        }
	        d.push(null);
	      },
	      (err) => {
	        destroyer(d, err);
	      }
	    );
	    return (d = new Duplexify({
	      objectMode: true,
	      writable: false,
	      read() {}
	    }))
	  }
	  throw new ERR_INVALID_ARG_TYPE(
	    name,
	    [
	      'Blob',
	      'ReadableStream',
	      'WritableStream',
	      'Stream',
	      'Iterable',
	      'AsyncIterable',
	      'Function',
	      '{ readable, writable } pair',
	      'Promise'
	    ],
	    body
	  )
	};
	function fromAsyncGen(fn) {
	  let { promise, resolve } = createDeferredPromise();
	  const ac = new AbortController();
	  const signal = ac.signal;
	  const value = fn(
	    (async function* () {
	      while (true) {
	        const _promise = promise;
	        promise = null;
	        const { chunk, done, cb } = await _promise;
	        process.nextTick(cb);
	        if (done) return
	        if (signal.aborted)
	          throw new AbortError(undefined, {
	            cause: signal.reason
	          })
	        ;({ promise, resolve } = createDeferredPromise());
	        yield chunk;
	      }
	    })(),
	    {
	      signal
	    }
	  );
	  return {
	    value,
	    write(chunk, encoding, cb) {
	      const _resolve = resolve;
	      resolve = null;
	      _resolve({
	        chunk,
	        done: false,
	        cb
	      });
	    },
	    final(cb) {
	      const _resolve = resolve;
	      resolve = null;
	      _resolve({
	        done: true,
	        cb
	      });
	    },
	    destroy(err, cb) {
	      ac.abort();
	      cb(err);
	    }
	  }
	}
	function _duplexify(pair) {
	  const r = pair.readable && typeof pair.readable.read !== 'function' ? Readable.wrap(pair.readable) : pair.readable;
	  const w = pair.writable;
	  let readable = !!isReadable(r);
	  let writable = !!isWritable(w);
	  let ondrain;
	  let onfinish;
	  let onreadable;
	  let onclose;
	  let d;
	  function onfinished(err) {
	    const cb = onclose;
	    onclose = null;
	    if (cb) {
	      cb(err);
	    } else if (err) {
	      d.destroy(err);
	    }
	  }

	  // TODO(ronag): Avoid double buffering.
	  // Implement Writable/Readable/Duplex traits.
	  // See, https://github.com/nodejs/node/pull/33515.
	  d = new Duplexify({
	    // TODO (ronag): highWaterMark?
	    readableObjectMode: !!(r !== null && r !== undefined && r.readableObjectMode),
	    writableObjectMode: !!(w !== null && w !== undefined && w.writableObjectMode),
	    readable,
	    writable
	  });
	  if (writable) {
	    eos(w, (err) => {
	      writable = false;
	      if (err) {
	        destroyer(r, err);
	      }
	      onfinished(err);
	    });
	    d._write = function (chunk, encoding, callback) {
	      if (w.write(chunk, encoding)) {
	        callback();
	      } else {
	        ondrain = callback;
	      }
	    };
	    d._final = function (callback) {
	      w.end();
	      onfinish = callback;
	    };
	    w.on('drain', function () {
	      if (ondrain) {
	        const cb = ondrain;
	        ondrain = null;
	        cb();
	      }
	    });
	    w.on('finish', function () {
	      if (onfinish) {
	        const cb = onfinish;
	        onfinish = null;
	        cb();
	      }
	    });
	  }
	  if (readable) {
	    eos(r, (err) => {
	      readable = false;
	      if (err) {
	        destroyer(r, err);
	      }
	      onfinished(err);
	    });
	    r.on('readable', function () {
	      if (onreadable) {
	        const cb = onreadable;
	        onreadable = null;
	        cb();
	      }
	    });
	    r.on('end', function () {
	      d.push(null);
	    });
	    d._read = function () {
	      while (true) {
	        const buf = r.read();
	        if (buf === null) {
	          onreadable = d._read;
	          return
	        }
	        if (!d.push(buf)) {
	          return
	        }
	      }
	    };
	  }
	  d._destroy = function (err, callback) {
	    if (!err && onclose !== null) {
	      err = new AbortError();
	    }
	    onreadable = null;
	    ondrain = null;
	    onfinish = null;
	    if (onclose === null) {
	      callback(err);
	    } else {
	      onclose = callback;
	      destroyer(w, err);
	      destroyer(r, err);
	    }
	  };
	  return d
	}
	return duplexify;
}

var duplex;
var hasRequiredDuplex;

function requireDuplex () {
	if (hasRequiredDuplex) return duplex;
	hasRequiredDuplex = 1;

	const {
	  ObjectDefineProperties,
	  ObjectGetOwnPropertyDescriptor,
	  ObjectKeys,
	  ObjectSetPrototypeOf
	} = requirePrimordials();
	duplex = Duplex;
	const Readable = requireReadable();
	const Writable = requireWritable();
	ObjectSetPrototypeOf(Duplex.prototype, Readable.prototype);
	ObjectSetPrototypeOf(Duplex, Readable);
	{
	  const keys = ObjectKeys(Writable.prototype);
	  // Allow the keys array to be GC'ed.
	  for (let i = 0; i < keys.length; i++) {
	    const method = keys[i];
	    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	  }
	}
	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options)
	  Readable.call(this, options);
	  Writable.call(this, options);
	  if (options) {
	    this.allowHalfOpen = options.allowHalfOpen !== false;
	    if (options.readable === false) {
	      this._readableState.readable = false;
	      this._readableState.ended = true;
	      this._readableState.endEmitted = true;
	    }
	    if (options.writable === false) {
	      this._writableState.writable = false;
	      this._writableState.ending = true;
	      this._writableState.ended = true;
	      this._writableState.finished = true;
	    }
	  } else {
	    this.allowHalfOpen = true;
	  }
	}
	ObjectDefineProperties(Duplex.prototype, {
	  writable: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writable')
	  },
	  writableHighWaterMark: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableHighWaterMark')
	  },
	  writableObjectMode: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableObjectMode')
	  },
	  writableBuffer: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableBuffer')
	  },
	  writableLength: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableLength')
	  },
	  writableFinished: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableFinished')
	  },
	  writableCorked: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableCorked')
	  },
	  writableEnded: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableEnded')
	  },
	  writableNeedDrain: {
	    __proto__: null,
	    ...ObjectGetOwnPropertyDescriptor(Writable.prototype, 'writableNeedDrain')
	  },
	  destroyed: {
	    __proto__: null,
	    get() {
	      if (this._readableState === undefined || this._writableState === undefined) {
	        return false
	      }
	      return this._readableState.destroyed && this._writableState.destroyed
	    },
	    set(value) {
	      // Backward compatibility, the user is explicitly
	      // managing destroyed.
	      if (this._readableState && this._writableState) {
	        this._readableState.destroyed = value;
	        this._writableState.destroyed = value;
	      }
	    }
	  }
	});
	let webStreamsAdapters;

	// Lazy to avoid circular references
	function lazyWebStreams() {
	  if (webStreamsAdapters === undefined) webStreamsAdapters = {};
	  return webStreamsAdapters
	}
	Duplex.fromWeb = function (pair, options) {
	  return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options)
	};
	Duplex.toWeb = function (duplex) {
	  return lazyWebStreams().newReadableWritablePairFromDuplex(duplex)
	};
	let duplexify;
	Duplex.from = function (body) {
	  if (!duplexify) {
	    duplexify = requireDuplexify();
	  }
	  return duplexify(body, 'body')
	};
	return duplex;
}

var transform;
var hasRequiredTransform;

function requireTransform () {
	if (hasRequiredTransform) return transform;
	hasRequiredTransform = 1;

	const { ObjectSetPrototypeOf, Symbol } = requirePrimordials();
	transform = Transform;
	const { ERR_METHOD_NOT_IMPLEMENTED } = requireErrors().codes;
	const Duplex = requireDuplex();
	const { getHighWaterMark } = requireState();
	ObjectSetPrototypeOf(Transform.prototype, Duplex.prototype);
	ObjectSetPrototypeOf(Transform, Duplex);
	const kCallback = Symbol('kCallback');
	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options)

	  // TODO (ronag): This should preferably always be
	  // applied but would be semver-major. Or even better;
	  // make Transform a Readable with the Writable interface.
	  const readableHighWaterMark = options ? getHighWaterMark(this, options, 'readableHighWaterMark', true) : null;
	  if (readableHighWaterMark === 0) {
	    // A Duplex will buffer both on the writable and readable side while
	    // a Transform just wants to buffer hwm number of elements. To avoid
	    // buffering twice we disable buffering on the writable side.
	    options = {
	      ...options,
	      highWaterMark: null,
	      readableHighWaterMark,
	      // TODO (ronag): 0 is not optimal since we have
	      // a "bug" where we check needDrain before calling _write and not after.
	      // Refs: https://github.com/nodejs/node/pull/32887
	      // Refs: https://github.com/nodejs/node/pull/35941
	      writableHighWaterMark: options.writableHighWaterMark || 0
	    };
	  }
	  Duplex.call(this, options);

	  // We have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;
	  this[kCallback] = null;
	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;
	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  // When the writable side finishes, then flush out anything remaining.
	  // Backwards compat. Some Transform streams incorrectly implement _final
	  // instead of or in addition to _flush. By using 'prefinish' instead of
	  // implementing _final we continue supporting this unfortunate use case.
	  this.on('prefinish', prefinish);
	}
	function final(cb) {
	  if (typeof this._flush === 'function' && !this.destroyed) {
	    this._flush((er, data) => {
	      if (er) {
	        if (cb) {
	          cb(er);
	        } else {
	          this.destroy(er);
	        }
	        return
	      }
	      if (data != null) {
	        this.push(data);
	      }
	      this.push(null);
	      if (cb) {
	        cb();
	      }
	    });
	  } else {
	    this.push(null);
	    if (cb) {
	      cb();
	    }
	  }
	}
	function prefinish() {
	  if (this._final !== final) {
	    final.call(this);
	  }
	}
	Transform.prototype._final = final;
	Transform.prototype._transform = function (chunk, encoding, callback) {
	  throw new ERR_METHOD_NOT_IMPLEMENTED('_transform()')
	};
	Transform.prototype._write = function (chunk, encoding, callback) {
	  const rState = this._readableState;
	  const wState = this._writableState;
	  const length = rState.length;
	  this._transform(chunk, encoding, (err, val) => {
	    if (err) {
	      callback(err);
	      return
	    }
	    if (val != null) {
	      this.push(val);
	    }
	    if (
	      wState.ended ||
	      // Backwards compat.
	      length === rState.length ||
	      // Backwards compat.
	      rState.length < rState.highWaterMark
	    ) {
	      callback();
	    } else {
	      this[kCallback] = callback;
	    }
	  });
	};
	Transform.prototype._read = function () {
	  if (this[kCallback]) {
	    const callback = this[kCallback];
	    this[kCallback] = null;
	    callback();
	  }
	};
	return transform;
}

var passthrough;
var hasRequiredPassthrough;

function requirePassthrough () {
	if (hasRequiredPassthrough) return passthrough;
	hasRequiredPassthrough = 1;

	const { ObjectSetPrototypeOf } = requirePrimordials();
	passthrough = PassThrough;
	const Transform = requireTransform();
	ObjectSetPrototypeOf(PassThrough.prototype, Transform.prototype);
	ObjectSetPrototypeOf(PassThrough, Transform);
	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options)
	  Transform.call(this, options);
	}
	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};
	return passthrough;
}

/* replacement start */

var pipeline_1;
var hasRequiredPipeline;

function requirePipeline () {
	if (hasRequiredPipeline) return pipeline_1;
	hasRequiredPipeline = 1;
	const process = requireBrowser$2()

	/* replacement end */
	// Ported from https://github.com/mafintosh/pump with
	// permission from the author, Mathias Buus (@mafintosh).

	;	const { ArrayIsArray, Promise, SymbolAsyncIterator, SymbolDispose } = requirePrimordials();
	const eos = requireEndOfStream();
	const { once } = requireUtil$2();
	const destroyImpl = requireDestroy();
	const Duplex = requireDuplex();
	const {
	  aggregateTwoErrors,
	  codes: {
	    ERR_INVALID_ARG_TYPE,
	    ERR_INVALID_RETURN_VALUE,
	    ERR_MISSING_ARGS,
	    ERR_STREAM_DESTROYED,
	    ERR_STREAM_PREMATURE_CLOSE
	  },
	  AbortError
	} = requireErrors();
	const { validateFunction, validateAbortSignal } = requireValidators();
	const {
	  isIterable,
	  isReadable,
	  isReadableNodeStream,
	  isNodeStream,
	  isTransformStream,
	  isWebStream,
	  isReadableStream,
	  isReadableFinished
	} = requireUtils();
	const AbortController = globalThis.AbortController || requireBrowser$1().AbortController;
	let PassThrough;
	let Readable;
	let addAbortListener;
	function destroyer(stream, reading, writing) {
	  let finished = false;
	  stream.on('close', () => {
	    finished = true;
	  });
	  const cleanup = eos(
	    stream,
	    {
	      readable: reading,
	      writable: writing
	    },
	    (err) => {
	      finished = !err;
	    }
	  );
	  return {
	    destroy: (err) => {
	      if (finished) return
	      finished = true;
	      destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED('pipe'));
	    },
	    cleanup
	  }
	}
	function popCallback(streams) {
	  // Streams should never be an empty array. It should always contain at least
	  // a single stream. Therefore optimize for the average case instead of
	  // checking for length === 0 as well.
	  validateFunction(streams[streams.length - 1], 'streams[stream.length - 1]');
	  return streams.pop()
	}
	function makeAsyncIterable(val) {
	  if (isIterable(val)) {
	    return val
	  } else if (isReadableNodeStream(val)) {
	    // Legacy streams are not Iterable.
	    return fromReadable(val)
	  }
	  throw new ERR_INVALID_ARG_TYPE('val', ['Readable', 'Iterable', 'AsyncIterable'], val)
	}
	async function* fromReadable(val) {
	  if (!Readable) {
	    Readable = requireReadable();
	  }
	  yield* Readable.prototype[SymbolAsyncIterator].call(val);
	}
	async function pumpToNode(iterable, writable, finish, { end }) {
	  let error;
	  let onresolve = null;
	  const resume = (err) => {
	    if (err) {
	      error = err;
	    }
	    if (onresolve) {
	      const callback = onresolve;
	      onresolve = null;
	      callback();
	    }
	  };
	  const wait = () =>
	    new Promise((resolve, reject) => {
	      if (error) {
	        reject(error);
	      } else {
	        onresolve = () => {
	          if (error) {
	            reject(error);
	          } else {
	            resolve();
	          }
	        };
	      }
	    });
	  writable.on('drain', resume);
	  const cleanup = eos(
	    writable,
	    {
	      readable: false
	    },
	    resume
	  );
	  try {
	    if (writable.writableNeedDrain) {
	      await wait();
	    }
	    for await (const chunk of iterable) {
	      if (!writable.write(chunk)) {
	        await wait();
	      }
	    }
	    if (end) {
	      writable.end();
	      await wait();
	    }
	    finish();
	  } catch (err) {
	    finish(error !== err ? aggregateTwoErrors(error, err) : err);
	  } finally {
	    cleanup();
	    writable.off('drain', resume);
	  }
	}
	async function pumpToWeb(readable, writable, finish, { end }) {
	  if (isTransformStream(writable)) {
	    writable = writable.writable;
	  }
	  // https://streams.spec.whatwg.org/#example-manual-write-with-backpressure
	  const writer = writable.getWriter();
	  try {
	    for await (const chunk of readable) {
	      await writer.ready;
	      writer.write(chunk).catch(() => {});
	    }
	    await writer.ready;
	    if (end) {
	      await writer.close();
	    }
	    finish();
	  } catch (err) {
	    try {
	      await writer.abort(err);
	      finish(err);
	    } catch (err) {
	      finish(err);
	    }
	  }
	}
	function pipeline(...streams) {
	  return pipelineImpl(streams, once(popCallback(streams)))
	}
	function pipelineImpl(streams, callback, opts) {
	  if (streams.length === 1 && ArrayIsArray(streams[0])) {
	    streams = streams[0];
	  }
	  if (streams.length < 2) {
	    throw new ERR_MISSING_ARGS('streams')
	  }
	  const ac = new AbortController();
	  const signal = ac.signal;
	  const outerSignal = opts === null || opts === undefined ? undefined : opts.signal;

	  // Need to cleanup event listeners if last stream is readable
	  // https://github.com/nodejs/node/issues/35452
	  const lastStreamCleanup = [];
	  validateAbortSignal(outerSignal, 'options.signal');
	  function abort() {
	    finishImpl(new AbortError());
	  }
	  addAbortListener = addAbortListener || requireUtil$2().addAbortListener;
	  let disposable;
	  if (outerSignal) {
	    disposable = addAbortListener(outerSignal, abort);
	  }
	  let error;
	  let value;
	  const destroys = [];
	  let finishCount = 0;
	  function finish(err) {
	    finishImpl(err, --finishCount === 0);
	  }
	  function finishImpl(err, final) {
	    var _disposable;
	    if (err && (!error || error.code === 'ERR_STREAM_PREMATURE_CLOSE')) {
	      error = err;
	    }
	    if (!error && !final) {
	      return
	    }
	    while (destroys.length) {
	      destroys.shift()(error);
	    }
(_disposable = disposable) === null || _disposable === undefined ? undefined : _disposable[SymbolDispose]();
	    ac.abort();
	    if (final) {
	      if (!error) {
	        lastStreamCleanup.forEach((fn) => fn());
	      }
	      process.nextTick(callback, error, value);
	    }
	  }
	  let ret;
	  for (let i = 0; i < streams.length; i++) {
	    const stream = streams[i];
	    const reading = i < streams.length - 1;
	    const writing = i > 0;
	    const end = reading || (opts === null || opts === undefined ? undefined : opts.end) !== false;
	    const isLastStream = i === streams.length - 1;
	    if (isNodeStream(stream)) {
	      if (end) {
	        const { destroy, cleanup } = destroyer(stream, reading, writing);
	        destroys.push(destroy);
	        if (isReadable(stream) && isLastStream) {
	          lastStreamCleanup.push(cleanup);
	        }
	      }

	      // Catch stream errors that occur after pipe/pump has completed.
	      function onError(err) {
	        if (err && err.name !== 'AbortError' && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
	          finish(err);
	        }
	      }
	      stream.on('error', onError);
	      if (isReadable(stream) && isLastStream) {
	        lastStreamCleanup.push(() => {
	          stream.removeListener('error', onError);
	        });
	      }
	    }
	    if (i === 0) {
	      if (typeof stream === 'function') {
	        ret = stream({
	          signal
	        });
	        if (!isIterable(ret)) {
	          throw new ERR_INVALID_RETURN_VALUE('Iterable, AsyncIterable or Stream', 'source', ret)
	        }
	      } else if (isIterable(stream) || isReadableNodeStream(stream) || isTransformStream(stream)) {
	        ret = stream;
	      } else {
	        ret = Duplex.from(stream);
	      }
	    } else if (typeof stream === 'function') {
	      if (isTransformStream(ret)) {
	        var _ret;
	        ret = makeAsyncIterable((_ret = ret) === null || _ret === undefined ? undefined : _ret.readable);
	      } else {
	        ret = makeAsyncIterable(ret);
	      }
	      ret = stream(ret, {
	        signal
	      });
	      if (reading) {
	        if (!isIterable(ret, true)) {
	          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable', `transform[${i - 1}]`, ret)
	        }
	      } else {
	        var _ret2;
	        if (!PassThrough) {
	          PassThrough = requirePassthrough();
	        }

	        // If the last argument to pipeline is not a stream
	        // we must create a proxy stream so that pipeline(...)
	        // always returns a stream which can be further
	        // composed through `.pipe(stream)`.

	        const pt = new PassThrough({
	          objectMode: true
	        });

	        // Handle Promises/A+ spec, `then` could be a getter that throws on
	        // second use.
	        const then = (_ret2 = ret) === null || _ret2 === undefined ? undefined : _ret2.then;
	        if (typeof then === 'function') {
	          finishCount++;
	          then.call(
	            ret,
	            (val) => {
	              value = val;
	              if (val != null) {
	                pt.write(val);
	              }
	              if (end) {
	                pt.end();
	              }
	              process.nextTick(finish);
	            },
	            (err) => {
	              pt.destroy(err);
	              process.nextTick(finish, err);
	            }
	          );
	        } else if (isIterable(ret, true)) {
	          finishCount++;
	          pumpToNode(ret, pt, finish, {
	            end
	          });
	        } else if (isReadableStream(ret) || isTransformStream(ret)) {
	          const toRead = ret.readable || ret;
	          finishCount++;
	          pumpToNode(toRead, pt, finish, {
	            end
	          });
	        } else {
	          throw new ERR_INVALID_RETURN_VALUE('AsyncIterable or Promise', 'destination', ret)
	        }
	        ret = pt;
	        const { destroy, cleanup } = destroyer(ret, false, true);
	        destroys.push(destroy);
	        if (isLastStream) {
	          lastStreamCleanup.push(cleanup);
	        }
	      }
	    } else if (isNodeStream(stream)) {
	      if (isReadableNodeStream(ret)) {
	        finishCount += 2;
	        const cleanup = pipe(ret, stream, finish, {
	          end
	        });
	        if (isReadable(stream) && isLastStream) {
	          lastStreamCleanup.push(cleanup);
	        }
	      } else if (isTransformStream(ret) || isReadableStream(ret)) {
	        const toRead = ret.readable || ret;
	        finishCount++;
	        pumpToNode(toRead, stream, finish, {
	          end
	        });
	      } else if (isIterable(ret)) {
	        finishCount++;
	        pumpToNode(ret, stream, finish, {
	          end
	        });
	      } else {
	        throw new ERR_INVALID_ARG_TYPE(
	          'val',
	          ['Readable', 'Iterable', 'AsyncIterable', 'ReadableStream', 'TransformStream'],
	          ret
	        )
	      }
	      ret = stream;
	    } else if (isWebStream(stream)) {
	      if (isReadableNodeStream(ret)) {
	        finishCount++;
	        pumpToWeb(makeAsyncIterable(ret), stream, finish, {
	          end
	        });
	      } else if (isReadableStream(ret) || isIterable(ret)) {
	        finishCount++;
	        pumpToWeb(ret, stream, finish, {
	          end
	        });
	      } else if (isTransformStream(ret)) {
	        finishCount++;
	        pumpToWeb(ret.readable, stream, finish, {
	          end
	        });
	      } else {
	        throw new ERR_INVALID_ARG_TYPE(
	          'val',
	          ['Readable', 'Iterable', 'AsyncIterable', 'ReadableStream', 'TransformStream'],
	          ret
	        )
	      }
	      ret = stream;
	    } else {
	      ret = Duplex.from(stream);
	    }
	  }
	  if (
	    (signal !== null && signal !== undefined && signal.aborted) ||
	    (outerSignal !== null && outerSignal !== undefined && outerSignal.aborted)
	  ) {
	    process.nextTick(abort);
	  }
	  return ret
	}
	function pipe(src, dst, finish, { end }) {
	  let ended = false;
	  dst.on('close', () => {
	    if (!ended) {
	      // Finish if the destination closes before the source has completed.
	      finish(new ERR_STREAM_PREMATURE_CLOSE());
	    }
	  });
	  src.pipe(dst, {
	    end: false
	  }); // If end is true we already will have a listener to end dst.

	  if (end) {
	    // Compat. Before node v10.12.0 stdio used to throw an error so
	    // pipe() did/does not end() stdio destinations.
	    // Now they allow it but "secretly" don't close the underlying fd.

	    function endFn() {
	      ended = true;
	      dst.end();
	    }
	    if (isReadableFinished(src)) {
	      // End the destination if the source has already ended.
	      process.nextTick(endFn);
	    } else {
	      src.once('end', endFn);
	    }
	  } else {
	    finish();
	  }
	  eos(
	    src,
	    {
	      readable: true,
	      writable: false
	    },
	    (err) => {
	      const rState = src._readableState;
	      if (
	        err &&
	        err.code === 'ERR_STREAM_PREMATURE_CLOSE' &&
	        rState &&
	        rState.ended &&
	        !rState.errored &&
	        !rState.errorEmitted
	      ) {
	        // Some readable streams will emit 'close' before 'end'. However, since
	        // this is on the readable side 'end' should still be emitted if the
	        // stream has been ended and no error emitted. This should be allowed in
	        // favor of backwards compatibility. Since the stream is piped to a
	        // destination this should not result in any observable difference.
	        // We don't need to check if this is a writable premature close since
	        // eos will only fail with premature close on the reading side for
	        // duplex streams.
	        src.once('end', finish).once('error', finish);
	      } else {
	        finish(err);
	      }
	    }
	  );
	  return eos(
	    dst,
	    {
	      readable: false,
	      writable: true
	    },
	    finish
	  )
	}
	pipeline_1 = {
	  pipelineImpl,
	  pipeline
	};
	return pipeline_1;
}

var compose;
var hasRequiredCompose;

function requireCompose () {
	if (hasRequiredCompose) return compose;
	hasRequiredCompose = 1;

	const { pipeline } = requirePipeline();
	const Duplex = requireDuplex();
	const { destroyer } = requireDestroy();
	const {
	  isNodeStream,
	  isReadable,
	  isWritable,
	  isWebStream,
	  isTransformStream,
	  isWritableStream,
	  isReadableStream
	} = requireUtils();
	const {
	  AbortError,
	  codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
	} = requireErrors();
	const eos = requireEndOfStream();
	compose = function compose(...streams) {
	  if (streams.length === 0) {
	    throw new ERR_MISSING_ARGS('streams')
	  }
	  if (streams.length === 1) {
	    return Duplex.from(streams[0])
	  }
	  const orgStreams = [...streams];
	  if (typeof streams[0] === 'function') {
	    streams[0] = Duplex.from(streams[0]);
	  }
	  if (typeof streams[streams.length - 1] === 'function') {
	    const idx = streams.length - 1;
	    streams[idx] = Duplex.from(streams[idx]);
	  }
	  for (let n = 0; n < streams.length; ++n) {
	    if (!isNodeStream(streams[n]) && !isWebStream(streams[n])) {
	      // TODO(ronag): Add checks for non streams.
	      continue
	    }
	    if (
	      n < streams.length - 1 &&
	      !(isReadable(streams[n]) || isReadableStream(streams[n]) || isTransformStream(streams[n]))
	    ) {
	      throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], 'must be readable')
	    }
	    if (n > 0 && !(isWritable(streams[n]) || isWritableStream(streams[n]) || isTransformStream(streams[n]))) {
	      throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], 'must be writable')
	    }
	  }
	  let ondrain;
	  let onfinish;
	  let onreadable;
	  let onclose;
	  let d;
	  function onfinished(err) {
	    const cb = onclose;
	    onclose = null;
	    if (cb) {
	      cb(err);
	    } else if (err) {
	      d.destroy(err);
	    } else if (!readable && !writable) {
	      d.destroy();
	    }
	  }
	  const head = streams[0];
	  const tail = pipeline(streams, onfinished);
	  const writable = !!(isWritable(head) || isWritableStream(head) || isTransformStream(head));
	  const readable = !!(isReadable(tail) || isReadableStream(tail) || isTransformStream(tail));

	  // TODO(ronag): Avoid double buffering.
	  // Implement Writable/Readable/Duplex traits.
	  // See, https://github.com/nodejs/node/pull/33515.
	  d = new Duplex({
	    // TODO (ronag): highWaterMark?
	    writableObjectMode: !!(head !== null && head !== undefined && head.writableObjectMode),
	    readableObjectMode: !!(tail !== null && tail !== undefined && tail.readableObjectMode),
	    writable,
	    readable
	  });
	  if (writable) {
	    if (isNodeStream(head)) {
	      d._write = function (chunk, encoding, callback) {
	        if (head.write(chunk, encoding)) {
	          callback();
	        } else {
	          ondrain = callback;
	        }
	      };
	      d._final = function (callback) {
	        head.end();
	        onfinish = callback;
	      };
	      head.on('drain', function () {
	        if (ondrain) {
	          const cb = ondrain;
	          ondrain = null;
	          cb();
	        }
	      });
	    } else if (isWebStream(head)) {
	      const writable = isTransformStream(head) ? head.writable : head;
	      const writer = writable.getWriter();
	      d._write = async function (chunk, encoding, callback) {
	        try {
	          await writer.ready;
	          writer.write(chunk).catch(() => {});
	          callback();
	        } catch (err) {
	          callback(err);
	        }
	      };
	      d._final = async function (callback) {
	        try {
	          await writer.ready;
	          writer.close().catch(() => {});
	          onfinish = callback;
	        } catch (err) {
	          callback(err);
	        }
	      };
	    }
	    const toRead = isTransformStream(tail) ? tail.readable : tail;
	    eos(toRead, () => {
	      if (onfinish) {
	        const cb = onfinish;
	        onfinish = null;
	        cb();
	      }
	    });
	  }
	  if (readable) {
	    if (isNodeStream(tail)) {
	      tail.on('readable', function () {
	        if (onreadable) {
	          const cb = onreadable;
	          onreadable = null;
	          cb();
	        }
	      });
	      tail.on('end', function () {
	        d.push(null);
	      });
	      d._read = function () {
	        while (true) {
	          const buf = tail.read();
	          if (buf === null) {
	            onreadable = d._read;
	            return
	          }
	          if (!d.push(buf)) {
	            return
	          }
	        }
	      };
	    } else if (isWebStream(tail)) {
	      const readable = isTransformStream(tail) ? tail.readable : tail;
	      const reader = readable.getReader();
	      d._read = async function () {
	        while (true) {
	          try {
	            const { value, done } = await reader.read();
	            if (!d.push(value)) {
	              return
	            }
	            if (done) {
	              d.push(null);
	              return
	            }
	          } catch {
	            return
	          }
	        }
	      };
	    }
	  }
	  d._destroy = function (err, callback) {
	    if (!err && onclose !== null) {
	      err = new AbortError();
	    }
	    onreadable = null;
	    ondrain = null;
	    onfinish = null;
	    if (onclose === null) {
	      callback(err);
	    } else {
	      onclose = callback;
	      if (isNodeStream(tail)) {
	        destroyer(tail, err);
	      }
	    }
	  };
	  return d
	};
	return compose;
}

var hasRequiredOperators;

function requireOperators () {
	if (hasRequiredOperators) return operators;
	hasRequiredOperators = 1;

	const AbortController = globalThis.AbortController || requireBrowser$1().AbortController;
	const {
	  codes: { ERR_INVALID_ARG_VALUE, ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
	  AbortError
	} = requireErrors();
	const { validateAbortSignal, validateInteger, validateObject } = requireValidators();
	const kWeakHandler = requirePrimordials().Symbol('kWeak');
	const kResistStopPropagation = requirePrimordials().Symbol('kResistStopPropagation');
	const { finished } = requireEndOfStream();
	const staticCompose = requireCompose();
	const { addAbortSignalNoValidate } = requireAddAbortSignal();
	const { isWritable, isNodeStream } = requireUtils();
	const { deprecate } = requireUtil$2();
	const {
	  ArrayPrototypePush,
	  Boolean,
	  MathFloor,
	  Number,
	  NumberIsNaN,
	  Promise,
	  PromiseReject,
	  PromiseResolve,
	  PromisePrototypeThen,
	  Symbol
	} = requirePrimordials();
	const kEmpty = Symbol('kEmpty');
	const kEof = Symbol('kEof');
	function compose(stream, options) {
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  if (isNodeStream(stream) && !isWritable(stream)) {
	    throw new ERR_INVALID_ARG_VALUE('stream', stream, 'must be writable')
	  }
	  const composedStream = staticCompose(this, stream);
	  if (options !== null && options !== undefined && options.signal) {
	    // Not validating as we already validated before
	    addAbortSignalNoValidate(options.signal, composedStream);
	  }
	  return composedStream
	}
	function map(fn, options) {
	  if (typeof fn !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
	  }
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  let concurrency = 1;
	  if ((options === null || options === undefined ? undefined : options.concurrency) != null) {
	    concurrency = MathFloor(options.concurrency);
	  }
	  let highWaterMark = concurrency - 1;
	  if ((options === null || options === undefined ? undefined : options.highWaterMark) != null) {
	    highWaterMark = MathFloor(options.highWaterMark);
	  }
	  validateInteger(concurrency, 'options.concurrency', 1);
	  validateInteger(highWaterMark, 'options.highWaterMark', 0);
	  highWaterMark += concurrency;
	  return async function* map() {
	    const signal = requireUtil$2().AbortSignalAny(
	      [options === null || options === undefined ? undefined : options.signal].filter(Boolean)
	    );
	    const stream = this;
	    const queue = [];
	    const signalOpt = {
	      signal
	    };
	    let next;
	    let resume;
	    let done = false;
	    let cnt = 0;
	    function onCatch() {
	      done = true;
	      afterItemProcessed();
	    }
	    function afterItemProcessed() {
	      cnt -= 1;
	      maybeResume();
	    }
	    function maybeResume() {
	      if (resume && !done && cnt < concurrency && queue.length < highWaterMark) {
	        resume();
	        resume = null;
	      }
	    }
	    async function pump() {
	      try {
	        for await (let val of stream) {
	          if (done) {
	            return
	          }
	          if (signal.aborted) {
	            throw new AbortError()
	          }
	          try {
	            val = fn(val, signalOpt);
	            if (val === kEmpty) {
	              continue
	            }
	            val = PromiseResolve(val);
	          } catch (err) {
	            val = PromiseReject(err);
	          }
	          cnt += 1;
	          PromisePrototypeThen(val, afterItemProcessed, onCatch);
	          queue.push(val);
	          if (next) {
	            next();
	            next = null;
	          }
	          if (!done && (queue.length >= highWaterMark || cnt >= concurrency)) {
	            await new Promise((resolve) => {
	              resume = resolve;
	            });
	          }
	        }
	        queue.push(kEof);
	      } catch (err) {
	        const val = PromiseReject(err);
	        PromisePrototypeThen(val, afterItemProcessed, onCatch);
	        queue.push(val);
	      } finally {
	        done = true;
	        if (next) {
	          next();
	          next = null;
	        }
	      }
	    }
	    pump();
	    try {
	      while (true) {
	        while (queue.length > 0) {
	          const val = await queue[0];
	          if (val === kEof) {
	            return
	          }
	          if (signal.aborted) {
	            throw new AbortError()
	          }
	          if (val !== kEmpty) {
	            yield val;
	          }
	          queue.shift();
	          maybeResume();
	        }
	        await new Promise((resolve) => {
	          next = resolve;
	        });
	      }
	    } finally {
	      done = true;
	      if (resume) {
	        resume();
	        resume = null;
	      }
	    }
	  }.call(this)
	}
	function asIndexedPairs(options = undefined) {
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  return async function* asIndexedPairs() {
	    let index = 0;
	    for await (const val of this) {
	      var _options$signal;
	      if (
	        options !== null &&
	        options !== undefined &&
	        (_options$signal = options.signal) !== null &&
	        _options$signal !== undefined &&
	        _options$signal.aborted
	      ) {
	        throw new AbortError({
	          cause: options.signal.reason
	        })
	      }
	      yield [index++, val];
	    }
	  }.call(this)
	}
	async function some(fn, options = undefined) {
	  for await (const unused of filter.call(this, fn, options)) {
	    return true
	  }
	  return false
	}
	async function every(fn, options = undefined) {
	  if (typeof fn !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
	  }
	  // https://en.wikipedia.org/wiki/De_Morgan%27s_laws
	  return !(await some.call(
	    this,
	    async (...args) => {
	      return !(await fn(...args))
	    },
	    options
	  ))
	}
	async function find(fn, options) {
	  for await (const result of filter.call(this, fn, options)) {
	    return result
	  }
	  return undefined
	}
	async function forEach(fn, options) {
	  if (typeof fn !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
	  }
	  async function forEachFn(value, options) {
	    await fn(value, options);
	    return kEmpty
	  }
	  // eslint-disable-next-line no-unused-vars
	  for await (const unused of map.call(this, forEachFn, options));
	}
	function filter(fn, options) {
	  if (typeof fn !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE('fn', ['Function', 'AsyncFunction'], fn)
	  }
	  async function filterFn(value, options) {
	    if (await fn(value, options)) {
	      return value
	    }
	    return kEmpty
	  }
	  return map.call(this, filterFn, options)
	}

	// Specific to provide better error to reduce since the argument is only
	// missing if the stream has no items in it - but the code is still appropriate
	class ReduceAwareErrMissingArgs extends ERR_MISSING_ARGS {
	  constructor() {
	    super('reduce');
	    this.message = 'Reduce of an empty stream requires an initial value';
	  }
	}
	async function reduce(reducer, initialValue, options) {
	  var _options$signal2;
	  if (typeof reducer !== 'function') {
	    throw new ERR_INVALID_ARG_TYPE('reducer', ['Function', 'AsyncFunction'], reducer)
	  }
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  let hasInitialValue = arguments.length > 1;
	  if (
	    options !== null &&
	    options !== undefined &&
	    (_options$signal2 = options.signal) !== null &&
	    _options$signal2 !== undefined &&
	    _options$signal2.aborted
	  ) {
	    const err = new AbortError(undefined, {
	      cause: options.signal.reason
	    });
	    this.once('error', () => {}); // The error is already propagated
	    await finished(this.destroy(err));
	    throw err
	  }
	  const ac = new AbortController();
	  const signal = ac.signal;
	  if (options !== null && options !== undefined && options.signal) {
	    const opts = {
	      once: true,
	      [kWeakHandler]: this,
	      [kResistStopPropagation]: true
	    };
	    options.signal.addEventListener('abort', () => ac.abort(), opts);
	  }
	  let gotAnyItemFromStream = false;
	  try {
	    for await (const value of this) {
	      var _options$signal3;
	      gotAnyItemFromStream = true;
	      if (
	        options !== null &&
	        options !== undefined &&
	        (_options$signal3 = options.signal) !== null &&
	        _options$signal3 !== undefined &&
	        _options$signal3.aborted
	      ) {
	        throw new AbortError()
	      }
	      if (!hasInitialValue) {
	        initialValue = value;
	        hasInitialValue = true;
	      } else {
	        initialValue = await reducer(initialValue, value, {
	          signal
	        });
	      }
	    }
	    if (!gotAnyItemFromStream && !hasInitialValue) {
	      throw new ReduceAwareErrMissingArgs()
	    }
	  } finally {
	    ac.abort();
	  }
	  return initialValue
	}
	async function toArray(options) {
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  const result = [];
	  for await (const val of this) {
	    var _options$signal4;
	    if (
	      options !== null &&
	      options !== undefined &&
	      (_options$signal4 = options.signal) !== null &&
	      _options$signal4 !== undefined &&
	      _options$signal4.aborted
	    ) {
	      throw new AbortError(undefined, {
	        cause: options.signal.reason
	      })
	    }
	    ArrayPrototypePush(result, val);
	  }
	  return result
	}
	function flatMap(fn, options) {
	  const values = map.call(this, fn, options);
	  return async function* flatMap() {
	    for await (const val of values) {
	      yield* val;
	    }
	  }.call(this)
	}
	function toIntegerOrInfinity(number) {
	  // We coerce here to align with the spec
	  // https://github.com/tc39/proposal-iterator-helpers/issues/169
	  number = Number(number);
	  if (NumberIsNaN(number)) {
	    return 0
	  }
	  if (number < 0) {
	    throw new ERR_OUT_OF_RANGE('number', '>= 0', number)
	  }
	  return number
	}
	function drop(number, options = undefined) {
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  number = toIntegerOrInfinity(number);
	  return async function* drop() {
	    var _options$signal5;
	    if (
	      options !== null &&
	      options !== undefined &&
	      (_options$signal5 = options.signal) !== null &&
	      _options$signal5 !== undefined &&
	      _options$signal5.aborted
	    ) {
	      throw new AbortError()
	    }
	    for await (const val of this) {
	      var _options$signal6;
	      if (
	        options !== null &&
	        options !== undefined &&
	        (_options$signal6 = options.signal) !== null &&
	        _options$signal6 !== undefined &&
	        _options$signal6.aborted
	      ) {
	        throw new AbortError()
	      }
	      if (number-- <= 0) {
	        yield val;
	      }
	    }
	  }.call(this)
	}
	function take(number, options = undefined) {
	  if (options != null) {
	    validateObject(options, 'options');
	  }
	  if ((options === null || options === undefined ? undefined : options.signal) != null) {
	    validateAbortSignal(options.signal, 'options.signal');
	  }
	  number = toIntegerOrInfinity(number);
	  return async function* take() {
	    var _options$signal7;
	    if (
	      options !== null &&
	      options !== undefined &&
	      (_options$signal7 = options.signal) !== null &&
	      _options$signal7 !== undefined &&
	      _options$signal7.aborted
	    ) {
	      throw new AbortError()
	    }
	    for await (const val of this) {
	      var _options$signal8;
	      if (
	        options !== null &&
	        options !== undefined &&
	        (_options$signal8 = options.signal) !== null &&
	        _options$signal8 !== undefined &&
	        _options$signal8.aborted
	      ) {
	        throw new AbortError()
	      }
	      if (number-- > 0) {
	        yield val;
	      }

	      // Don't get another item from iterator in case we reached the end
	      if (number <= 0) {
	        return
	      }
	    }
	  }.call(this)
	}
	operators.streamReturningOperators = {
	  asIndexedPairs: deprecate(asIndexedPairs, 'readable.asIndexedPairs will be removed in a future version.'),
	  drop,
	  filter,
	  flatMap,
	  map,
	  take,
	  compose
	};
	operators.promiseReturningOperators = {
	  every,
	  forEach,
	  reduce,
	  toArray,
	  some,
	  find
	};
	return operators;
}

var promises;
var hasRequiredPromises;

function requirePromises () {
	if (hasRequiredPromises) return promises;
	hasRequiredPromises = 1;

	const { ArrayPrototypePop, Promise } = requirePrimordials();
	const { isIterable, isNodeStream, isWebStream } = requireUtils();
	const { pipelineImpl: pl } = requirePipeline();
	const { finished } = requireEndOfStream();
	requireStream$1();
	function pipeline(...streams) {
	  return new Promise((resolve, reject) => {
	    let signal;
	    let end;
	    const lastArg = streams[streams.length - 1];
	    if (
	      lastArg &&
	      typeof lastArg === 'object' &&
	      !isNodeStream(lastArg) &&
	      !isIterable(lastArg) &&
	      !isWebStream(lastArg)
	    ) {
	      const options = ArrayPrototypePop(streams);
	      signal = options.signal;
	      end = options.end;
	    }
	    pl(
	      streams,
	      (err, value) => {
	        if (err) {
	          reject(err);
	        } else {
	          resolve(value);
	        }
	      },
	      {
	        signal,
	        end
	      }
	    );
	  })
	}
	promises = {
	  finished,
	  pipeline
	};
	return promises;
}

var hasRequiredStream$1;

function requireStream$1 () {
	if (hasRequiredStream$1) return stream.exports;
	hasRequiredStream$1 = 1;

	/* replacement start */

	const { Buffer } = require$$0$1;

	/* replacement end */

	const { ObjectDefineProperty, ObjectKeys, ReflectApply } = requirePrimordials();
	const {
	  promisify: { custom: customPromisify }
	} = requireUtil$2();
	const { streamReturningOperators, promiseReturningOperators } = requireOperators();
	const {
	  codes: { ERR_ILLEGAL_CONSTRUCTOR }
	} = requireErrors();
	const compose = requireCompose();
	const { setDefaultHighWaterMark, getDefaultHighWaterMark } = requireState();
	const { pipeline } = requirePipeline();
	const { destroyer } = requireDestroy();
	const eos = requireEndOfStream();
	const promises = requirePromises();
	const utils = requireUtils();
	const Stream = (stream.exports = requireLegacy().Stream);
	Stream.isDestroyed = utils.isDestroyed;
	Stream.isDisturbed = utils.isDisturbed;
	Stream.isErrored = utils.isErrored;
	Stream.isReadable = utils.isReadable;
	Stream.isWritable = utils.isWritable;
	Stream.Readable = requireReadable();
	for (const key of ObjectKeys(streamReturningOperators)) {
	  const op = streamReturningOperators[key];
	  function fn(...args) {
	    if (new.target) {
	      throw ERR_ILLEGAL_CONSTRUCTOR()
	    }
	    return Stream.Readable.from(ReflectApply(op, this, args))
	  }
	  ObjectDefineProperty(fn, 'name', {
	    __proto__: null,
	    value: op.name
	  });
	  ObjectDefineProperty(fn, 'length', {
	    __proto__: null,
	    value: op.length
	  });
	  ObjectDefineProperty(Stream.Readable.prototype, key, {
	    __proto__: null,
	    value: fn,
	    enumerable: false,
	    configurable: true,
	    writable: true
	  });
	}
	for (const key of ObjectKeys(promiseReturningOperators)) {
	  const op = promiseReturningOperators[key];
	  function fn(...args) {
	    if (new.target) {
	      throw ERR_ILLEGAL_CONSTRUCTOR()
	    }
	    return ReflectApply(op, this, args)
	  }
	  ObjectDefineProperty(fn, 'name', {
	    __proto__: null,
	    value: op.name
	  });
	  ObjectDefineProperty(fn, 'length', {
	    __proto__: null,
	    value: op.length
	  });
	  ObjectDefineProperty(Stream.Readable.prototype, key, {
	    __proto__: null,
	    value: fn,
	    enumerable: false,
	    configurable: true,
	    writable: true
	  });
	}
	Stream.Writable = requireWritable();
	Stream.Duplex = requireDuplex();
	Stream.Transform = requireTransform();
	Stream.PassThrough = requirePassthrough();
	Stream.pipeline = pipeline;
	const { addAbortSignal } = requireAddAbortSignal();
	Stream.addAbortSignal = addAbortSignal;
	Stream.finished = eos;
	Stream.destroy = destroyer;
	Stream.compose = compose;
	Stream.setDefaultHighWaterMark = setDefaultHighWaterMark;
	Stream.getDefaultHighWaterMark = getDefaultHighWaterMark;
	ObjectDefineProperty(Stream, 'promises', {
	  __proto__: null,
	  configurable: true,
	  enumerable: true,
	  get() {
	    return promises
	  }
	});
	ObjectDefineProperty(pipeline, customPromisify, {
	  __proto__: null,
	  enumerable: true,
	  get() {
	    return promises.pipeline
	  }
	});
	ObjectDefineProperty(eos, customPromisify, {
	  __proto__: null,
	  enumerable: true,
	  get() {
	    return promises.finished
	  }
	});

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;
	Stream._isUint8Array = function isUint8Array(value) {
	  return value instanceof Uint8Array
	};
	Stream._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
	  return Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
	};
	return stream.exports;
}

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser$1.exports;
	hasRequiredBrowser = 1;
	(function (module) {

		const CustomStream = requireStream$1();
		const promises = requirePromises();
		const originalDestroy = CustomStream.Readable.destroy;
		module.exports = CustomStream.Readable;

		// Explicit export naming is needed for ESM
		module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
		module.exports._isUint8Array = CustomStream._isUint8Array;
		module.exports.isDisturbed = CustomStream.isDisturbed;
		module.exports.isErrored = CustomStream.isErrored;
		module.exports.isReadable = CustomStream.isReadable;
		module.exports.Readable = CustomStream.Readable;
		module.exports.Writable = CustomStream.Writable;
		module.exports.Duplex = CustomStream.Duplex;
		module.exports.Transform = CustomStream.Transform;
		module.exports.PassThrough = CustomStream.PassThrough;
		module.exports.addAbortSignal = CustomStream.addAbortSignal;
		module.exports.finished = CustomStream.finished;
		module.exports.destroy = CustomStream.destroy;
		module.exports.destroy = originalDestroy;
		module.exports.pipeline = CustomStream.pipeline;
		module.exports.compose = CustomStream.compose;
		Object.defineProperty(CustomStream, 'promises', {
		  configurable: true,
		  enumerable: true,
		  get() {
		    return promises
		  }
		});
		module.exports.Stream = CustomStream.Stream;

		// Allow default importing
		module.exports.default = module.exports; 
	} (browser$1));
	return browser$1.exports;
}

var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream$1;
	hasRequiredStream = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Writable = exports.Readable = void 0;
		var node_stream_1 = requireBrowser();
		Object.defineProperty(exports, "Readable", { enumerable: true, get: function () { return node_stream_1.Readable; } });
		Object.defineProperty(exports, "Writable", { enumerable: true, get: function () { return node_stream_1.Writable; } });
		
	} (stream$1));
	return stream$1;
}

var events = {};

var hasRequiredEvents;

function requireEvents () {
	if (hasRequiredEvents) return events;
	hasRequiredEvents = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.EventEmitter = void 0;
		var node_events_1 = requireEvents$1();
		Object.defineProperty(exports, "EventEmitter", { enumerable: true, get: function () { return node_events_1.EventEmitter; } });
		
	} (events));
	return events;
}

var FileHandle = {};

var util$1 = {};

var hasRequiredUtil$1;

function requireUtil$1 () {
	if (hasRequiredUtil$1) return util$1;
	hasRequiredUtil$1 = 1;
	Object.defineProperty(util$1, "__esModule", { value: true });
	util$1.getWriteSyncArgs = util$1.getWriteArgs = util$1.bufToUint8 = void 0;
	util$1.promisify = promisify;
	util$1.validateCallback = validateCallback;
	util$1.modeToNumber = modeToNumber;
	util$1.nullCheck = nullCheck;
	util$1.pathToFilename = pathToFilename;
	util$1.createError = createError;
	util$1.createStatError = createStatError;
	util$1.genRndStr6 = genRndStr6;
	util$1.flagsToNumber = flagsToNumber;
	util$1.streamToBuffer = streamToBuffer;
	util$1.bufferToEncoding = bufferToEncoding;
	util$1.isReadableStream = isReadableStream;
	const fs_node_utils_1 = requireLib$7();
	const errors = requireErrors$1();
	const buffer_1 = requireBuffer();
	const fs_core_1 = requireLib$5();
	function promisify(fs, fn, getResult = input => input) {
	    return (...args) => new Promise((resolve, reject) => {
	        fs[fn].bind(fs)(...args, (error, result) => {
	            if (error)
	                return reject(error);
	            return resolve(getResult(result));
	        });
	    });
	}
	function validateCallback(callback) {
	    if (typeof callback !== 'function')
	        throw TypeError(fs_node_utils_1.ERRSTR.CB);
	    return callback;
	}
	function _modeToNumber(mode, def) {
	    if (typeof mode === 'number')
	        return mode;
	    if (typeof mode === 'string')
	        return parseInt(mode, 8);
	    if (def)
	        return modeToNumber(def);
	    return undefined;
	}
	function modeToNumber(mode, def) {
	    const result = _modeToNumber(mode, def);
	    if (typeof result !== 'number' || isNaN(result))
	        throw new TypeError(fs_node_utils_1.ERRSTR.MODE_INT);
	    return result;
	}
	function nullCheck(path, callback) {
	    if (('' + path).indexOf('\u0000') !== -1) {
	        const er = new Error('Path must be a string without null bytes');
	        er.code = 'ENOENT';
	        if (typeof callback !== 'function')
	            throw er;
	        queueMicrotask(() => {
	            callback(er);
	        });
	        return false;
	    }
	    return true;
	}
	function getPathFromURLPosix(url) {
	    if (url.hostname !== '') {
	        throw new errors.TypeError('ERR_INVALID_FILE_URL_HOST', process$1.platform);
	    }
	    const pathname = url.pathname;
	    for (let n = 0; n < pathname.length; n++) {
	        if (pathname[n] === '%') {
	            const third = pathname.codePointAt(n + 2) | 0x20;
	            if (pathname[n + 1] === '2' && third === 102) {
	                throw new errors.TypeError('ERR_INVALID_FILE_URL_PATH', 'must not include encoded / characters');
	            }
	        }
	    }
	    return decodeURIComponent(pathname);
	}
	function pathToFilename(path) {
	    if (path instanceof Uint8Array) {
	        path = (0, buffer_1.bufferFrom)(path);
	    }
	    if (typeof path !== 'string' && !buffer_1.Buffer.isBuffer(path)) {
	        try {
	            if (!(path instanceof requireUrl().URL))
	                throw new TypeError(fs_node_utils_1.ERRSTR.PATH_STR);
	        }
	        catch (err) {
	            throw new TypeError(fs_node_utils_1.ERRSTR.PATH_STR);
	        }
	        path = getPathFromURLPosix(path);
	    }
	    const pathString = String(path);
	    nullCheck(pathString);
	    // return slash(pathString);
	    return pathString;
	}
	const ENOENT = 'ENOENT';
	const EBADF = 'EBADF';
	const EINVAL = 'EINVAL';
	const EPERM = 'EPERM';
	const EPROTO = 'EPROTO';
	const EEXIST = 'EEXIST';
	const ENOTDIR = 'ENOTDIR';
	const EMFILE = 'EMFILE';
	const EACCES = 'EACCES';
	const EISDIR = 'EISDIR';
	const ENOTEMPTY = 'ENOTEMPTY';
	const ENOSYS = 'ENOSYS';
	const ERR_FS_EISDIR = 'ERR_FS_EISDIR';
	const ERR_OUT_OF_RANGE = 'ERR_OUT_OF_RANGE';
	function formatError(errorCode, func = '', path = '', path2 = '') {
	    let pathFormatted = '';
	    if (path)
	        pathFormatted = ` '${path}'`;
	    if (path2)
	        pathFormatted += ` -> '${path2}'`;
	    switch (errorCode) {
	        case ENOENT:
	            return `ENOENT: no such file or directory, ${func}${pathFormatted}`;
	        case EBADF:
	            return `EBADF: bad file descriptor, ${func}${pathFormatted}`;
	        case EINVAL:
	            return `EINVAL: invalid argument, ${func}${pathFormatted}`;
	        case EPERM:
	            return `EPERM: operation not permitted, ${func}${pathFormatted}`;
	        case EPROTO:
	            return `EPROTO: protocol error, ${func}${pathFormatted}`;
	        case EEXIST:
	            return `EEXIST: file already exists, ${func}${pathFormatted}`;
	        case ENOTDIR:
	            return `ENOTDIR: not a directory, ${func}${pathFormatted}`;
	        case EISDIR:
	            return `EISDIR: illegal operation on a directory, ${func}${pathFormatted}`;
	        case EACCES:
	            return `EACCES: permission denied, ${func}${pathFormatted}`;
	        case ENOTEMPTY:
	            return `ENOTEMPTY: directory not empty, ${func}${pathFormatted}`;
	        case EMFILE:
	            return `EMFILE: too many open files, ${func}${pathFormatted}`;
	        case ENOSYS:
	            return `ENOSYS: function not implemented, ${func}${pathFormatted}`;
	        case ERR_FS_EISDIR:
	            return `[ERR_FS_EISDIR]: Path is a directory: ${func} returned EISDIR (is a directory) ${path}`;
	        case ERR_OUT_OF_RANGE:
	            return `[ERR_OUT_OF_RANGE]: value out of range, ${func}${pathFormatted}`;
	        default:
	            return `${errorCode}: error occurred, ${func}${pathFormatted}`;
	    }
	}
	function createError(errorCode, func = '', path = '', path2 = '', Constructor = Error) {
	    const error = new Constructor(formatError(errorCode, func, path, path2));
	    error.code = errorCode;
	    if (path) {
	        error.path = path;
	    }
	    return error;
	}
	function createStatError(errorCode, func = '', path = '', path2 = '') {
	    return {
	        code: errorCode,
	        message: formatError(errorCode, func, path, path2),
	        path,
	        toError() {
	            const error = new Error(this.message);
	            error.code = this.code;
	            if (this.path) {
	                error.path = this.path;
	            }
	            return error;
	        },
	    };
	}
	function genRndStr6() {
	    return Math.random().toString(36).slice(2, 8).padEnd(6, '0');
	}
	function flagsToNumber(flags) {
	    if (typeof flags === 'number')
	        return flags;
	    if (typeof flags === 'string') {
	        const flagsNum = fs_node_utils_1.FLAGS[flags];
	        if (typeof flagsNum !== 'undefined')
	            return flagsNum;
	    }
	    // throw new TypeError(formatError(ERRSTR_FLAG(flags)));
	    throw new errors.TypeError('ERR_INVALID_OPT_VALUE', 'flags', flags);
	}
	function streamToBuffer(stream) {
	    const chunks = [];
	    return new Promise((resolve, reject) => {
	        stream.on('data', chunk => chunks.push(chunk));
	        stream.on('end', () => resolve(buffer_1.Buffer.concat(chunks)));
	        stream.on('error', reject);
	    });
	}
	const bufToUint8 = (buf) => new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	util$1.bufToUint8 = bufToUint8;
	const getWriteArgs = (fd, a, b, c, d, e) => {
	    (0, fs_core_1.validateFd)(fd);
	    let offset = 0;
	    let length;
	    let position = null;
	    let encoding;
	    let callback;
	    const tipa = typeof a;
	    const tipb = typeof b;
	    const tipc = typeof c;
	    const tipd = typeof d;
	    if (tipa !== 'string') {
	        if (tipb === 'function') {
	            callback = b;
	        }
	        else if (tipc === 'function') {
	            offset = b | 0;
	            callback = c;
	        }
	        else if (tipd === 'function') {
	            offset = b | 0;
	            length = c;
	            callback = d;
	        }
	        else {
	            offset = b | 0;
	            length = c;
	            position = d;
	            callback = e;
	        }
	    }
	    else {
	        if (tipb === 'function') {
	            callback = b;
	        }
	        else if (tipc === 'function') {
	            position = b;
	            callback = c;
	        }
	        else if (tipd === 'function') {
	            position = b;
	            encoding = c;
	            callback = d;
	        }
	    }
	    const buf = (0, fs_core_1.dataToBuffer)(a, encoding);
	    if (tipa !== 'string') {
	        if (typeof length === 'undefined')
	            length = buf.length;
	    }
	    else {
	        offset = 0;
	        length = buf.length;
	    }
	    const cb = validateCallback(callback);
	    return [fd, tipa === 'string', buf, offset, length, position, cb];
	};
	util$1.getWriteArgs = getWriteArgs;
	const getWriteSyncArgs = (fd, a, b, c, d) => {
	    (0, fs_core_1.validateFd)(fd);
	    let encoding;
	    let offset;
	    let length;
	    let position;
	    const isBuffer = typeof a !== 'string';
	    if (isBuffer) {
	        offset = (b || 0) | 0;
	        length = c;
	        position = d;
	    }
	    else {
	        position = b;
	        encoding = c;
	    }
	    const buf = (0, fs_core_1.dataToBuffer)(a, encoding);
	    if (isBuffer) {
	        if (typeof length === 'undefined') {
	            length = buf.length;
	        }
	    }
	    else {
	        offset = 0;
	        length = buf.length;
	    }
	    return [fd, buf, offset || 0, length, position];
	};
	util$1.getWriteSyncArgs = getWriteSyncArgs;
	function bufferToEncoding(buffer, encoding) {
	    if (!encoding || encoding === 'buffer')
	        return buffer;
	    else
	        return buffer.toString(encoding);
	}
	function isReadableStream(stream) {
	    return (stream !== null &&
	        typeof stream === 'object' &&
	        typeof stream.pipe === 'function' &&
	        typeof stream.on === 'function' &&
	        stream.readable === true);
	}
	
	return util$1;
}

var hasRequiredFileHandle;

function requireFileHandle () {
	if (hasRequiredFileHandle) return FileHandle;
	hasRequiredFileHandle = 1;
	Object.defineProperty(FileHandle, "__esModule", { value: true });
	FileHandle.FileHandle = void 0;
	const util_1 = requireUtil$1();
	const events_1 = requireEvents();
	let FileHandle$1 = class FileHandle extends events_1.EventEmitter {
	    constructor(fs, fd) {
	        super();
	        this.refs = 1;
	        this.closePromise = null;
	        this.position = 0;
	        this.readableWebStreamLocked = false;
	        this.fs = fs;
	        this.fd = fd;
	    }
	    getAsyncId() {
	        // Return a unique async ID for this file handle
	        // In a real implementation, this would be provided by the underlying system
	        return this.fd;
	    }
	    appendFile(data, options) {
	        return (0, util_1.promisify)(this.fs, 'appendFile')(this.fd, data, options);
	    }
	    chmod(mode) {
	        return (0, util_1.promisify)(this.fs, 'fchmod')(this.fd, mode);
	    }
	    chown(uid, gid) {
	        return (0, util_1.promisify)(this.fs, 'fchown')(this.fd, uid, gid);
	    }
	    close() {
	        if (this.fd === -1) {
	            return Promise.resolve();
	        }
	        if (this.closePromise) {
	            return this.closePromise;
	        }
	        this.refs--;
	        if (this.refs === 0) {
	            const currentFd = this.fd;
	            this.fd = -1;
	            this.closePromise = (0, util_1.promisify)(this.fs, 'close')(currentFd).finally(() => {
	                this.closePromise = null;
	            });
	        }
	        else {
	            this.closePromise = new Promise((resolve, reject) => {
	                this.closeResolve = resolve;
	                this.closeReject = reject;
	            }).finally(() => {
	                this.closePromise = null;
	                this.closeReject = undefined;
	                this.closeResolve = undefined;
	            });
	        }
	        this.emit('close');
	        return this.closePromise;
	    }
	    datasync() {
	        return (0, util_1.promisify)(this.fs, 'fdatasync')(this.fd);
	    }
	    createReadStream(options) {
	        return this.fs.createReadStream('', { ...options, fd: this });
	    }
	    createWriteStream(options) {
	        return this.fs.createWriteStream('', { ...options, fd: this });
	    }
	    readableWebStream(options = {}) {
	        const { type = 'bytes', autoClose = false } = options;
	        let position = 0;
	        if (this.fd === -1) {
	            throw new Error('The FileHandle is closed');
	        }
	        if (this.closePromise) {
	            throw new Error('The FileHandle is closing');
	        }
	        if (this.readableWebStreamLocked) {
	            throw new Error('An error will be thrown if this method is called more than once or is called after the FileHandle is closed or closing.');
	        }
	        this.readableWebStreamLocked = true;
	        this.ref();
	        const unlockAndCleanup = () => {
	            this.readableWebStreamLocked = false;
	            this.unref();
	            if (autoClose) {
	                this.close().catch(() => {
	                    // Ignore close errors in cleanup
	                });
	            }
	        };
	        return new ReadableStream({
	            type: type === 'bytes' ? 'bytes' : undefined,
	            autoAllocateChunkSize: 16384,
	            pull: async (controller) => {
	                try {
	                    const view = controller.byobRequest?.view;
	                    if (!view) {
	                        // Fallback for when BYOB is not available
	                        const buffer = new Uint8Array(16384);
	                        const result = await this.read(buffer, 0, buffer.length, position);
	                        if (result.bytesRead === 0) {
	                            controller.close();
	                            unlockAndCleanup();
	                            return;
	                        }
	                        position += result.bytesRead;
	                        controller.enqueue(buffer.slice(0, result.bytesRead));
	                        return;
	                    }
	                    const result = await this.read(view, view.byteOffset, view.byteLength, position);
	                    if (result.bytesRead === 0) {
	                        controller.close();
	                        unlockAndCleanup();
	                        return;
	                    }
	                    position += result.bytesRead;
	                    controller.byobRequest.respond(result.bytesRead);
	                }
	                catch (error) {
	                    controller.error(error);
	                    unlockAndCleanup();
	                }
	            },
	            cancel: async () => {
	                unlockAndCleanup();
	            },
	        });
	    }
	    async read(buffer, offset, length, position) {
	        const readPosition = position !== null && position !== undefined ? position : this.position;
	        const result = await (0, util_1.promisify)(this.fs, 'read', bytesRead => ({ bytesRead, buffer }))(this.fd, buffer, offset, length, readPosition);
	        // Update internal position only if position was null/undefined
	        if (position === null || position === undefined) {
	            this.position += result.bytesRead;
	        }
	        return result;
	    }
	    readv(buffers, position) {
	        return (0, util_1.promisify)(this.fs, 'readv', bytesRead => ({ bytesRead, buffers }))(this.fd, buffers, position);
	    }
	    readFile(options) {
	        return (0, util_1.promisify)(this.fs, 'readFile')(this.fd, options);
	    }
	    stat(options) {
	        return (0, util_1.promisify)(this.fs, 'fstat')(this.fd, options);
	    }
	    sync() {
	        return (0, util_1.promisify)(this.fs, 'fsync')(this.fd);
	    }
	    truncate(len) {
	        return (0, util_1.promisify)(this.fs, 'ftruncate')(this.fd, len);
	    }
	    utimes(atime, mtime) {
	        return (0, util_1.promisify)(this.fs, 'futimes')(this.fd, atime, mtime);
	    }
	    async write(buffer, offset, length, position) {
	        const useInternalPosition = typeof position !== 'number';
	        const writePosition = useInternalPosition ? this.position : position;
	        const result = await (0, util_1.promisify)(this.fs, 'write', bytesWritten => ({ bytesWritten, buffer }))(this.fd, buffer, offset, length, writePosition);
	        // Update internal position only if position was null/undefined
	        if (useInternalPosition) {
	            this.position += result.bytesWritten;
	        }
	        return result;
	    }
	    writev(buffers, position) {
	        return (0, util_1.promisify)(this.fs, 'writev', bytesWritten => ({ bytesWritten, buffers }))(this.fd, buffers, position);
	    }
	    writeFile(data, options) {
	        return (0, util_1.promisify)(this.fs, 'writeFile')(this.fd, data, options);
	    }
	    // Implement Symbol.asyncDispose if available (ES2023+)
	    async [Symbol.asyncDispose]() {
	        await this.close();
	    }
	    ref() {
	        this.refs++;
	    }
	    unref() {
	        this.refs--;
	        if (this.refs === 0) {
	            this.fd = -1;
	            if (this.closeResolve) {
	                (0, util_1.promisify)(this.fs, 'close')(this.fd).then(this.closeResolve, this.closeReject);
	            }
	        }
	    }
	};
	FileHandle.FileHandle = FileHandle$1;
	
	return FileHandle;
}

var FsPromises = {};

var hasRequiredFsPromises;

function requireFsPromises () {
	if (hasRequiredFsPromises) return FsPromises;
	hasRequiredFsPromises = 1;
	Object.defineProperty(FsPromises, "__esModule", { value: true });
	FsPromises.FsPromises = void 0;
	const util_1 = requireUtil$1();
	const fs_node_utils_1 = requireLib$7();
	const newAbortError = (signal) => {
	    const error = new Error('The operation was aborted');
	    error.name = 'AbortError';
	    error.code = 'ABORT_ERR';
	    error.cause = signal.reason;
	    return error;
	};
	// AsyncIterator implementation for promises.watch
	class FSWatchAsyncIterator {
	    constructor(fs, path, options = {}) {
	        this.fs = fs;
	        this.path = path;
	        this.options = options;
	        this.eventQueue = [];
	        this.resolveQueue = [];
	        this.finished = false;
	        this.maxQueue = options.maxQueue || 2048;
	        const overflow = options.overflow || 'ignore';
	        if (overflow !== 'ignore' && overflow !== 'error' && overflow !== 'throw')
	            throw new TypeError(`The argument 'options.overflow' must be one of: 'ignore', 'error'. Received '${overflow}'`);
	        // Node's docs name the value 'throw' while its implementation validates
	        // 'error', both are accepted here with the same semantics.
	        this.overflow = overflow === 'throw' ? 'error' : overflow;
	        const signal = options.signal;
	        if (signal) {
	            if (signal.aborted) {
	                this.finish(newAbortError(signal));
	                return;
	            }
	            this.onAbort = () => this.finish(newAbortError(signal));
	            signal.addEventListener('abort', this.onAbort);
	        }
	        this.startWatching();
	    }
	    startWatching() {
	        const { signal, ...watchOptions } = this.options;
	        try {
	            this.watcher = this.fs.watch(this.path, watchOptions, (eventType, filename) => {
	                this.enqueueEvent({ eventType, filename });
	            });
	        }
	        catch (error) {
	            // If we can't start watching, finish immediately
	            this.finish();
	            throw error;
	        }
	    }
	    enqueueEvent(event) {
	        if (this.finished)
	            return;
	        // Handle queue overflow: the incoming event is dropped, the queue keeps
	        // the oldest `maxQueue` events, matching Node.js.
	        if (this.eventQueue.length >= this.maxQueue) {
	            if (this.overflow === 'error') {
	                const error = new Error(`Watch queue overflow: more than ${this.maxQueue} events queued`);
	                error.code = 'ERR_FS_WATCH_QUEUE_OVERFLOW';
	                this.finish(error);
	            }
	            else if (typeof process$1 !== 'undefined' && typeof process$1.emitWarning === 'function') {
	                process$1.emitWarning('fs.watch maxQueue exceeded');
	            }
	            return;
	        }
	        this.eventQueue.push(event);
	        // If there's a waiting promise, resolve it
	        if (this.resolveQueue.length > 0) {
	            const { resolve } = this.resolveQueue.shift();
	            const nextEvent = this.eventQueue.shift();
	            resolve({ value: nextEvent, done: false });
	        }
	    }
	    finish(error) {
	        if (this.finished)
	            return;
	        this.finished = true;
	        this.error = error;
	        if (error)
	            this.eventQueue.length = 0;
	        if (this.onAbort) {
	            this.options.signal.removeEventListener('abort', this.onAbort);
	            this.onAbort = undefined;
	        }
	        if (this.watcher) {
	            this.watcher.close();
	            this.watcher = null;
	        }
	        // Resolve or reject all pending promises - a rejected error is considered
	        // delivered and is not thrown again from a later next() call.
	        const delivered = error && this.resolveQueue.length > 0;
	        while (this.resolveQueue.length > 0) {
	            const { resolve, reject } = this.resolveQueue.shift();
	            if (error) {
	                reject(error);
	            }
	            else {
	                resolve({ value: undefined, done: true });
	            }
	        }
	        if (delivered)
	            this.error = undefined;
	    }
	    async next() {
	        if (this.error) {
	            const error = this.error;
	            this.error = undefined;
	            throw error;
	        }
	        if (this.finished) {
	            return { value: undefined, done: true };
	        }
	        // If we have queued events, return one
	        if (this.eventQueue.length > 0) {
	            const event = this.eventQueue.shift();
	            return { value: event, done: false };
	        }
	        // Otherwise, wait for the next event
	        return new Promise((resolve, reject) => {
	            this.resolveQueue.push({ resolve, reject });
	        });
	    }
	    async return() {
	        this.finish();
	        return { value: undefined, done: true };
	    }
	    async throw(error) {
	        this.finish(error);
	        throw error;
	    }
	    [Symbol.asyncIterator]() {
	        return this;
	    }
	}
	let FsPromises$1 = class FsPromises {
	    constructor(fs, FileHandle) {
	        this.fs = fs;
	        this.FileHandle = FileHandle;
	        this.constants = fs_node_utils_1.constants;
	        this.cp = (0, util_1.promisify)(this.fs, 'cp');
	        this.opendir = (0, util_1.promisify)(this.fs, 'opendir');
	        this.statfs = (0, util_1.promisify)(this.fs, 'statfs');
	        this.lutimes = (0, util_1.promisify)(this.fs, 'lutimes');
	        this.glob = (0, util_1.promisify)(this.fs, 'glob');
	        this.access = (0, util_1.promisify)(this.fs, 'access');
	        this.chmod = (0, util_1.promisify)(this.fs, 'chmod');
	        this.chown = (0, util_1.promisify)(this.fs, 'chown');
	        this.copyFile = (0, util_1.promisify)(this.fs, 'copyFile');
	        this.lchmod = (0, util_1.promisify)(this.fs, 'lchmod');
	        this.lchown = (0, util_1.promisify)(this.fs, 'lchown');
	        this.link = (0, util_1.promisify)(this.fs, 'link');
	        this.lstat = (0, util_1.promisify)(this.fs, 'lstat');
	        this.mkdir = (0, util_1.promisify)(this.fs, 'mkdir');
	        this.mkdtemp = (0, util_1.promisify)(this.fs, 'mkdtemp');
	        this.readdir = (0, util_1.promisify)(this.fs, 'readdir');
	        this.readlink = (0, util_1.promisify)(this.fs, 'readlink');
	        this.realpath = (0, util_1.promisify)(this.fs, 'realpath');
	        this.rename = (0, util_1.promisify)(this.fs, 'rename');
	        this.rmdir = (0, util_1.promisify)(this.fs, 'rmdir');
	        this.rm = (0, util_1.promisify)(this.fs, 'rm');
	        this.stat = (0, util_1.promisify)(this.fs, 'stat');
	        this.symlink = (0, util_1.promisify)(this.fs, 'symlink');
	        this.truncate = (0, util_1.promisify)(this.fs, 'truncate');
	        this.unlink = (0, util_1.promisify)(this.fs, 'unlink');
	        this.utimes = (0, util_1.promisify)(this.fs, 'utimes');
	        this.readFile = (id, options) => {
	            return (0, util_1.promisify)(this.fs, 'readFile')(id instanceof this.FileHandle ? id.fd : id, options);
	        };
	        this.appendFile = (path, data, options) => {
	            return (0, util_1.promisify)(this.fs, 'appendFile')(path instanceof this.FileHandle ? path.fd : path, data, options);
	        };
	        this.open = (path, flags = 'r', mode) => {
	            return (0, util_1.promisify)(this.fs, 'open', fd => new this.FileHandle(this.fs, fd))(path, flags, mode);
	        };
	        this.writeFile = (id, data, options) => {
	            const dataPromise = (0, util_1.isReadableStream)(data) ? (0, util_1.streamToBuffer)(data) : Promise.resolve(data);
	            return dataPromise.then(data => (0, util_1.promisify)(this.fs, 'writeFile')(id instanceof this.FileHandle ? id.fd : id, data, options));
	        };
	        this.watch = (filename, options) => {
	            const watchOptions = typeof options === 'string' ? { encoding: options } : options || {};
	            return new FSWatchAsyncIterator(this.fs, filename, watchOptions);
	        };
	    }
	};
	FsPromises.FsPromises = FsPromises$1;
	
	return FsPromises;
}

var lib$2 = {};

var lib$1 = {};

var printTree = {};

var hasRequiredPrintTree;

function requirePrintTree () {
	if (hasRequiredPrintTree) return printTree;
	hasRequiredPrintTree = 1;
	Object.defineProperty(printTree, "__esModule", { value: true });
	printTree.printTree = void 0;
	const printTree$1 = (tab = '', children) => {
	    let str = '';
	    let last = children.length - 1;
	    for (; last >= 0; last--)
	        if (children[last])
	            break;
	    for (let i = 0; i <= last; i++) {
	        const fn = children[i];
	        if (!fn)
	            continue;
	        const isLast = i === last;
	        const child = fn(tab + (isLast ? ' ' : '│') + '  ');
	        const branch = child ? (isLast ? '└─' : '├─') : '│';
	        str += '\n' + tab + branch + (child ? ' ' + child : '');
	    }
	    return str;
	};
	printTree.printTree = printTree$1;
	return printTree;
}

var printBinary = {};

var hasRequiredPrintBinary;

function requirePrintBinary () {
	if (hasRequiredPrintBinary) return printBinary;
	hasRequiredPrintBinary = 1;
	Object.defineProperty(printBinary, "__esModule", { value: true });
	printBinary.printBinary = void 0;
	const printBinary$1 = (tab = '', children) => {
	    const left = children[0], right = children[1];
	    let str = '';
	    if (left)
	        str += '\n' + tab + '← ' + left(tab + '  ');
	    if (right)
	        str += '\n' + tab + '→ ' + right(tab + '  ');
	    return str;
	};
	printBinary.printBinary = printBinary$1;
	return printBinary;
}

var printJson = {};

var hasRequiredPrintJson;

function requirePrintJson () {
	if (hasRequiredPrintJson) return printJson;
	hasRequiredPrintJson = 1;
	Object.defineProperty(printJson, "__esModule", { value: true });
	printJson.printJson = void 0;
	const printJson$1 = (tab = '', json, space = 2) => (JSON.stringify(json, null, space) || 'nil').split('\n').join('\n' + tab);
	printJson.printJson = printJson$1;
	return printJson;
}

var hasRequiredLib$4;

function requireLib$4 () {
	if (hasRequiredLib$4) return lib$1;
	hasRequiredLib$4 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		const tslib_1 = require$$0$2;
		tslib_1.__exportStar(requirePrintTree(), exports);
		tslib_1.__exportStar(requirePrintBinary(), exports);
		tslib_1.__exportStar(requirePrintJson(), exports); 
	} (lib$1));
	return lib$1;
}

var hasRequiredLib$3;

function requireLib$3 () {
	if (hasRequiredLib$3) return lib$2;
	hasRequiredLib$3 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.toTreeSync = void 0;
		const tree_dump_1 = requireLib$4();
		const fs_node_utils_1 = requireLib$7();
		const toTreeSync = (fs, opts = {}) => {
		    const separator = opts.separator || '/';
		    let dir = opts.dir || separator;
		    if (dir[dir.length - 1] !== separator)
		        dir += separator;
		    const tab = opts.tab || '';
		    const depth = opts.depth ?? 10;
		    const sort = opts.sort ?? true;
		    let subtree = ' (...)';
		    if (depth > 0) {
		        const list = fs.readdirSync(dir, { withFileTypes: true });
		        if (sort) {
		            list.sort((a, b) => {
		                if (a.isDirectory() && b.isDirectory()) {
		                    return a.name.toString().localeCompare(b.name.toString());
		                }
		                else if (a.isDirectory()) {
		                    return -1;
		                }
		                else if (b.isDirectory()) {
		                    return 1;
		                }
		                else {
		                    return a.name.toString().localeCompare(b.name.toString());
		                }
		            });
		        }
		        subtree = (0, tree_dump_1.printTree)(tab, list.map(entry => tab => {
		            if (entry.isDirectory()) {
		                return (0, exports.toTreeSync)(fs, { dir: dir + entry.name, depth: depth - 1, tab });
		            }
		            else if (entry.isSymbolicLink()) {
		                return '' + entry.name + ' → ' + fs.readlinkSync(dir + entry.name);
		            }
		            else {
		                return '' + entry.name;
		            }
		        }));
		    }
		    const base = (0, fs_node_utils_1.basename)(dir, separator) + separator;
		    return base + subtree;
		};
		exports.toTreeSync = toTreeSync;
		
	} (lib$2));
	return lib$2;
}

var lib = {};

var constants$1 = {};

var hasRequiredConstants$1;

function requireConstants$1 () {
	if (hasRequiredConstants$1) return constants$1;
	hasRequiredConstants$1 = 1;
	Object.defineProperty(constants$1, "__esModule", { value: true });
	
	return constants$1;
}

var sync = {};

var shared = {};

var Writer = {};

var Slice = {};

var hasRequiredSlice;

function requireSlice () {
	if (hasRequiredSlice) return Slice;
	hasRequiredSlice = 1;
	Object.defineProperty(Slice, "__esModule", { value: true });
	Slice.Slice = void 0;
	/**
	 * @deprecated Use {@link Reader} instead.
	 */
	let Slice$1 = class Slice {
	    constructor(uint8, view, start, end) {
	        this.uint8 = uint8;
	        this.view = view;
	        this.start = start;
	        this.end = end;
	    }
	    subarray() {
	        return this.uint8.subarray(this.start, this.end);
	    }
	};
	Slice.Slice = Slice$1;
	
	return Slice;
}

var hasRequiredWriter;

function requireWriter () {
	if (hasRequiredWriter) return Writer;
	hasRequiredWriter = 1;
	Object.defineProperty(Writer, "__esModule", { value: true });
	Writer.Writer = void 0;
	const Slice_1 = requireSlice();
	const EMPTY_UINT8 = new Uint8Array([]);
	const EMPTY_VIEW = new DataView(EMPTY_UINT8.buffer);
	const hasBuffer = typeof Buffer === 'function';
	const utf8Write = hasBuffer
	    ? Buffer.prototype.utf8Write
	    : null;
	const from = hasBuffer ? Buffer.from : null;
	const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
	/**
	 * Writer class provides an efficient way to encode binary data. It grows the
	 * internal memory buffer automatically as more space is required. It is useful
	 * in cases when it is not known in advance the size of memory needed.
	 */
	let Writer$1 = class Writer {
	    /**
	     * @param allocSize Number of bytes to allocate at a time when buffer ends.
	     */
	    constructor(allocSize = 64 * 1024) {
	        this.allocSize = allocSize;
	        /** @ignore */
	        this.view = EMPTY_VIEW;
	        /** @ignore */
	        this.x0 = 0;
	        /** @ignore */
	        this.x = 0;
	        this.uint8 = new Uint8Array(allocSize);
	        this.size = allocSize;
	        this.view = new DataView(this.uint8.buffer);
	    }
	    /** @ignore */
	    grow(size) {
	        const x0 = this.x0;
	        const x = this.x;
	        const oldUint8 = this.uint8;
	        const newUint8 = new Uint8Array(size);
	        const view = new DataView(newUint8.buffer);
	        const activeSlice = oldUint8.subarray(x0, x);
	        newUint8.set(activeSlice, 0);
	        this.x = x - x0;
	        this.x0 = 0;
	        this.uint8 = newUint8;
	        this.size = size;
	        this.view = view;
	    }
	    /**
	     * Make sure the internal buffer has enough space to write the specified number
	     * of bytes, otherwise resize the internal buffer to accommodate for more size.
	     *
	     * @param capacity Number of bytes.
	     */
	    ensureCapacity(capacity) {
	        const byteLength = this.size;
	        const remaining = byteLength - this.x;
	        if (remaining < capacity) {
	            const total = byteLength - this.x0;
	            const required = capacity - remaining;
	            const totalRequired = total + required;
	            this.grow(totalRequired <= this.allocSize ? this.allocSize : totalRequired * 2);
	        }
	    }
	    /** @todo Consider renaming to "skip"? */
	    move(capacity) {
	        this.ensureCapacity(capacity);
	        this.x += capacity;
	    }
	    reset() {
	        this.x0 = this.x;
	    }
	    /**
	     * Allocates a new {@link ArrayBuffer}, useful when the underlying
	     * {@link ArrayBuffer} cannot be shared between threads.
	     *
	     * @param size Size of memory to allocate.
	     */
	    newBuffer(size) {
	        const uint8 = (this.uint8 = new Uint8Array(size));
	        this.size = size;
	        this.view = new DataView(uint8.buffer);
	        this.x = this.x0 = 0;
	    }
	    /**
	     * @returns Encoded memory buffer contents.
	     */
	    flush() {
	        const result = this.uint8.subarray(this.x0, this.x);
	        this.x0 = this.x;
	        return result;
	    }
	    flushSlice() {
	        const slice = new Slice_1.Slice(this.uint8, this.view, this.x0, this.x);
	        this.x0 = this.x;
	        return slice;
	    }
	    u8(char) {
	        this.ensureCapacity(1);
	        this.uint8[this.x++] = char;
	    }
	    u16(word) {
	        this.ensureCapacity(2);
	        this.view.setUint16(this.x, word);
	        this.x += 2;
	    }
	    u32(dword) {
	        this.ensureCapacity(4);
	        this.view.setUint32(this.x, dword);
	        this.x += 4;
	    }
	    i32(dword) {
	        this.ensureCapacity(4);
	        this.view.setInt32(this.x, dword);
	        this.x += 4;
	    }
	    u64(qword) {
	        this.ensureCapacity(8);
	        this.view.setBigUint64(this.x, BigInt(qword));
	        this.x += 8;
	    }
	    f64(float) {
	        this.ensureCapacity(8);
	        this.view.setFloat64(this.x, float);
	        this.x += 8;
	    }
	    u8u16(u8, u16) {
	        this.ensureCapacity(3);
	        let x = this.x;
	        this.uint8[x++] = u8;
	        this.uint8[x++] = u16 >>> 8;
	        this.uint8[x++] = u16 & 0xff;
	        this.x = x;
	    }
	    u8u32(u8, u32) {
	        this.ensureCapacity(5);
	        let x = this.x;
	        this.uint8[x++] = u8;
	        this.view.setUint32(x, u32);
	        this.x = x + 4;
	    }
	    u8u64(u8, u64) {
	        this.ensureCapacity(9);
	        let x = this.x;
	        this.uint8[x++] = u8;
	        this.view.setBigUint64(x, BigInt(u64));
	        this.x = x + 8;
	    }
	    u8f32(u8, f32) {
	        this.ensureCapacity(5);
	        let x = this.x;
	        this.uint8[x++] = u8;
	        this.view.setFloat32(x, f32);
	        this.x = x + 4;
	    }
	    u8f64(u8, f64) {
	        this.ensureCapacity(9);
	        let x = this.x;
	        this.uint8[x++] = u8;
	        this.view.setFloat64(x, f64);
	        this.x = x + 8;
	    }
	    buf(buf, length) {
	        this.ensureCapacity(length);
	        const x = this.x;
	        this.uint8.set(buf, x);
	        this.x = x + length;
	    }
	    /**
	     * Encodes string as UTF-8. You need to call .ensureCapacity(str.length * 4)
	     * before calling
	     *
	     * @param str String to encode as UTF-8.
	     * @returns The number of bytes written
	     */
	    utf8(str) {
	        const theoreticalMaxLength = str.length * 4;
	        if (theoreticalMaxLength < 168)
	            return this.utf8Native(str);
	        this.ensureCapacity(theoreticalMaxLength);
	        const maxLength = this.size - this.x;
	        if (utf8Write) {
	            const writeLength = utf8Write.call(this.uint8, str, this.x, maxLength);
	            this.x += writeLength;
	            return writeLength;
	        }
	        else if (from) {
	            const uint8 = this.uint8;
	            const offset = uint8.byteOffset + this.x;
	            const buf = from(uint8.buffer).subarray(offset, offset + maxLength);
	            const writeLength = buf.write(str, 0, maxLength, 'utf8');
	            this.x += writeLength;
	            return writeLength;
	        }
	        else if (theoreticalMaxLength > 1024 && textEncoder) {
	            const writeLength = textEncoder.encodeInto(str, this.uint8.subarray(this.x, this.x + maxLength)).written;
	            this.x += writeLength;
	            return writeLength;
	        }
	        return this.utf8Native(str);
	    }
	    utf8Native(str) {
	        const length = str.length;
	        const uint8 = this.uint8;
	        let offset = this.x;
	        let pos = 0;
	        while (pos < length) {
	            let value = str.charCodeAt(pos++);
	            if ((value & 0xffffff80) === 0) {
	                uint8[offset++] = value;
	                continue;
	            }
	            else if ((value & 0xfffff800) === 0) {
	                uint8[offset++] = ((value >> 6) & 0x1f) | 0xc0;
	            }
	            else {
	                if (value >= 0xd800 && value <= 0xdbff) {
	                    if (pos < length) {
	                        const extra = str.charCodeAt(pos);
	                        if ((extra & 0xfc00) === 0xdc00) {
	                            pos++;
	                            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
	                        }
	                    }
	                }
	                if ((value & 0xffff0000) === 0) {
	                    uint8[offset++] = ((value >> 12) & 0x0f) | 0xe0;
	                    uint8[offset++] = ((value >> 6) & 0x3f) | 0x80;
	                }
	                else {
	                    uint8[offset++] = ((value >> 18) & 0x07) | 0xf0;
	                    uint8[offset++] = ((value >> 12) & 0x3f) | 0x80;
	                    uint8[offset++] = ((value >> 6) & 0x3f) | 0x80;
	                }
	            }
	            uint8[offset++] = (value & 0x3f) | 0x80;
	        }
	        const writeLength = offset - this.x;
	        this.x = offset;
	        return writeLength;
	    }
	    ascii(str) {
	        const length = str.length;
	        this.ensureCapacity(length);
	        const uint8 = this.uint8;
	        let x = this.x;
	        let pos = 0;
	        while (pos < length)
	            uint8[x++] = str.charCodeAt(pos++);
	        this.x = x;
	    }
	};
	Writer.Writer = Writer$1;
	
	return Writer;
}

var hasRequiredShared;

function requireShared () {
	if (hasRequiredShared) return shared;
	hasRequiredShared = 1;
	Object.defineProperty(shared, "__esModule", { value: true });
	shared.validateEntryName = shared.writer = void 0;
	const Writer_1 = requireWriter();
	shared.writer = new Writer_1.Writer(1024 * 32);
	const validateEntryName = (name) => {
	    if (!name || name === '.' || name === '..' || name.indexOf('/') !== -1 || name.indexOf('\\') !== -1)
	        throw new Error(`Invalid snapshot entry name: ${JSON.stringify(name)}`);
	};
	shared.validateEntryName = validateEntryName;
	
	return shared;
}

var hasRequiredSync;

function requireSync () {
	if (hasRequiredSync) return sync;
	hasRequiredSync = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.fromSnapshotSync = exports.toSnapshotSync = void 0;
		const shared_1 = requireShared();
		const toSnapshotSync = ({ fs, path = '/', separator = '/' }) => {
		    const stats = fs.lstatSync(path);
		    if (stats.isDirectory()) {
		        const list = fs.readdirSync(path);
		        const entries = {};
		        const dir = path.endsWith(separator) ? path : path + separator;
		        for (const child of list) {
		            const childSnapshot = (0, exports.toSnapshotSync)({ fs, path: `${dir}${child}`, separator });
		            if (childSnapshot)
		                entries['' + child] = childSnapshot;
		        }
		        return [0 /* SnapshotNodeType.Folder */, {}, entries];
		    }
		    else if (stats.isFile()) {
		        const buf = fs.readFileSync(path);
		        const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
		        return [1 /* SnapshotNodeType.File */, {}, uint8];
		    }
		    else if (stats.isSymbolicLink()) {
		        return [
		            2 /* SnapshotNodeType.Symlink */,
		            {
		                target: fs.readlinkSync(path).toString(),
		            },
		        ];
		    }
		    return null;
		};
		exports.toSnapshotSync = toSnapshotSync;
		const fromSnapshotSync = (snapshot, { fs, path = '/', separator = '/' }) => {
		    if (!snapshot)
		        return;
		    switch (snapshot[0]) {
		        case 0 /* SnapshotNodeType.Folder */: {
		            if (!path.endsWith(separator))
		                path = path + separator;
		            const [, , entries] = snapshot;
		            fs.mkdirSync(path, { recursive: true });
		            for (const [name, child] of Object.entries(entries)) {
		                (0, shared_1.validateEntryName)(name);
		                (0, exports.fromSnapshotSync)(child, { fs, path: `${path}${name}`, separator });
		            }
		            break;
		        }
		        case 1 /* SnapshotNodeType.File */: {
		            const [, , data] = snapshot;
		            fs.writeFileSync(path, data);
		            break;
		        }
		        case 2 /* SnapshotNodeType.Symlink */: {
		            const [, { target }] = snapshot;
		            fs.symlinkSync(target, path);
		            break;
		        }
		    }
		};
		exports.fromSnapshotSync = fromSnapshotSync;
		
	} (sync));
	return sync;
}

var binary = {};

var CborEncoder = {};

var isFloat32 = {};

var hasRequiredIsFloat32;

function requireIsFloat32 () {
	if (hasRequiredIsFloat32) return isFloat32;
	hasRequiredIsFloat32 = 1;
	Object.defineProperty(isFloat32, "__esModule", { value: true });
	isFloat32.isFloat32 = void 0;
	const view = new DataView(new ArrayBuffer(4));
	const isFloat32$1 = (n) => {
	    view.setFloat32(0, n);
	    return n === view.getFloat32(0);
	};
	isFloat32.isFloat32 = isFloat32$1;
	
	return isFloat32;
}

var JsonPackExtension = {};

var hasRequiredJsonPackExtension;

function requireJsonPackExtension () {
	if (hasRequiredJsonPackExtension) return JsonPackExtension;
	hasRequiredJsonPackExtension = 1;
	Object.defineProperty(JsonPackExtension, "__esModule", { value: true });
	JsonPackExtension.JsonPackExtension = void 0;
	/**
	 * A wrapping for MessagePack extension or CBOR tag value. When encoder
	 * encounters {@link JsonPackExtension} it will encode it as a MessagePack
	 * extension or CBOR tag. Likewise, the decoder will
	 * decode extensions into {@link JsonPackExtension}.
	 *
	 * @category Value
	 */
	let JsonPackExtension$1 = class JsonPackExtension {
	    constructor(tag, val) {
	        this.tag = tag;
	        this.val = val;
	    }
	};
	JsonPackExtension.JsonPackExtension = JsonPackExtension$1;
	
	return JsonPackExtension;
}

var CborEncoderFast = {};

var hasRequiredCborEncoderFast;

function requireCborEncoderFast () {
	if (hasRequiredCborEncoderFast) return CborEncoderFast;
	hasRequiredCborEncoderFast = 1;
	Object.defineProperty(CborEncoderFast, "__esModule", { value: true });
	CborEncoderFast.CborEncoderFast = void 0;
	const Writer_1 = requireWriter();
	const isSafeInteger = Number.isSafeInteger;
	/**
	 * Fast CBOR encoder supports only JSON values. Use regular `CborEncoder` if
	 * you need ability to encode all CBOR value types.
	 */
	let CborEncoderFast$1 = class CborEncoderFast {
	    constructor(writer = new Writer_1.Writer()) {
	        this.writer = writer;
	    }
	    encode(value) {
	        this.writeAny(value);
	        return this.writer.flush();
	    }
	    writeAny(value) {
	        switch (typeof value) {
	            case 'number':
	                return this.writeNumber(value);
	            case 'string':
	                return this.writeStr(value);
	            case 'boolean':
	                return this.writer.u8(0xf4 + +value);
	            case 'object': {
	                if (!value)
	                    return this.writer.u8(0xf6);
	                const constr = value.constructor;
	                switch (constr) {
	                    case Array:
	                        return this.writeArr(value);
	                    default:
	                        return this.writeObj(value);
	                }
	            }
	        }
	    }
	    writeCbor() {
	        this.writer.u8u16(0xd9, 0xd9f7);
	    }
	    writeEnd() {
	        this.writer.u8(255 /* CONST.END */);
	    }
	    writeNull() {
	        this.writer.u8(0xf6);
	    }
	    writeBoolean(bool) {
	        if (bool)
	            this.writer.u8(0xf5);
	        else
	            this.writer.u8(0xf4);
	    }
	    writeNumber(num) {
	        if (isSafeInteger(num))
	            this.writeInteger(num);
	        else if (typeof num === 'bigint')
	            this.writeBigInt(num);
	        else
	            this.writeFloat(num);
	    }
	    writeBigInt(int) {
	        if (int >= 0)
	            this.writeBigUint(int);
	        else
	            this.writeBigSint(int);
	    }
	    writeBigUint(uint) {
	        if (uint <= Number.MAX_SAFE_INTEGER)
	            return this.writeUInteger(Number(uint));
	        this.writer.u8u64(0x1b, uint);
	    }
	    writeBigSint(int) {
	        if (int >= Number.MIN_SAFE_INTEGER)
	            return this.encodeNint(Number(int));
	        const uint = -BigInt(1) - int;
	        this.writer.u8u64(0x3b, uint);
	    }
	    writeInteger(int) {
	        if (int >= 0)
	            this.writeUInteger(int);
	        else
	            this.encodeNint(int);
	    }
	    writeUInteger(uint) {
	        const writer = this.writer;
	        writer.ensureCapacity(9);
	        const uint8 = writer.uint8;
	        let x = writer.x;
	        if (uint <= 23) {
	            uint8[x++] = 0 /* MAJOR_OVERLAY.UIN */ + uint;
	        }
	        else if (uint <= 0xff) {
	            uint8[x++] = 0x18;
	            uint8[x++] = uint;
	        }
	        else if (uint <= 0xffff) {
	            uint8[x++] = 0x19;
	            writer.view.setUint16(x, uint);
	            x += 2;
	        }
	        else if (uint <= 0xffffffff) {
	            uint8[x++] = 0x1a;
	            writer.view.setUint32(x, uint);
	            x += 4;
	        }
	        else {
	            uint8[x++] = 0x1b;
	            writer.view.setBigUint64(x, BigInt(uint));
	            x += 8;
	        }
	        writer.x = x;
	    }
	    /** @deprecated Remove and use `writeNumber` instead. */
	    encodeNumber(num) {
	        this.writeNumber(num);
	    }
	    /** @deprecated Remove and use `writeInteger` instead. */
	    encodeInteger(int) {
	        this.writeInteger(int);
	    }
	    /** @deprecated */
	    encodeUint(uint) {
	        this.writeUInteger(uint);
	    }
	    encodeNint(int) {
	        const uint = -1 - int;
	        const writer = this.writer;
	        writer.ensureCapacity(9);
	        const uint8 = writer.uint8;
	        let x = writer.x;
	        if (uint < 24) {
	            uint8[x++] = 32 /* MAJOR_OVERLAY.NIN */ + uint;
	        }
	        else if (uint <= 0xff) {
	            uint8[x++] = 0x38;
	            uint8[x++] = uint;
	        }
	        else if (uint <= 0xffff) {
	            uint8[x++] = 0x39;
	            writer.view.setUint16(x, uint);
	            x += 2;
	        }
	        else if (uint <= 0xffffffff) {
	            uint8[x++] = 0x3a;
	            writer.view.setUint32(x, uint);
	            x += 4;
	        }
	        else {
	            uint8[x++] = 0x3b;
	            writer.view.setBigUint64(x, BigInt(uint));
	            x += 8;
	        }
	        writer.x = x;
	    }
	    writeFloat(float) {
	        this.writer.u8f64(0xfb, float);
	    }
	    writeBin(buf) {
	        const length = buf.length;
	        this.writeBinHdr(length);
	        this.writer.buf(buf, length);
	    }
	    writeBinHdr(length) {
	        const writer = this.writer;
	        if (length <= 23)
	            writer.u8(64 /* MAJOR_OVERLAY.BIN */ + length);
	        else if (length <= 0xff)
	            writer.u16((0x58 << 8) + length);
	        else if (length <= 0xffff)
	            writer.u8u16(0x59, length);
	        else if (length <= 0xffffffff)
	            writer.u8u32(0x5a, length);
	        else
	            writer.u8u64(0x5b, length);
	    }
	    writeStr(str) {
	        const writer = this.writer;
	        const length = str.length;
	        const maxSize = length * 4;
	        writer.ensureCapacity(5 + maxSize);
	        const uint8 = writer.uint8;
	        let lengthOffset = writer.x;
	        if (maxSize <= 23)
	            writer.x++;
	        else if (maxSize <= 0xff) {
	            uint8[writer.x++] = 0x78;
	            lengthOffset = writer.x;
	            writer.x++;
	        }
	        else if (maxSize <= 0xffff) {
	            uint8[writer.x++] = 0x79;
	            lengthOffset = writer.x;
	            writer.x += 2;
	        }
	        else {
	            uint8[writer.x++] = 0x7a;
	            lengthOffset = writer.x;
	            writer.x += 4;
	        }
	        const bytesWritten = writer.utf8(str);
	        if (maxSize <= 23)
	            uint8[lengthOffset] = 96 /* MAJOR_OVERLAY.STR */ + bytesWritten;
	        else if (maxSize <= 0xff)
	            uint8[lengthOffset] = bytesWritten;
	        else if (maxSize <= 0xffff)
	            writer.view.setUint16(lengthOffset, bytesWritten);
	        else
	            writer.view.setUint32(lengthOffset, bytesWritten);
	    }
	    writeStrHdr(length) {
	        const writer = this.writer;
	        if (length <= 23)
	            writer.u8(96 /* MAJOR_OVERLAY.STR */ + length);
	        else if (length <= 0xff)
	            writer.u16((0x78 << 8) + length);
	        else if (length <= 0xffff)
	            writer.u8u16(0x79, length);
	        else
	            writer.u8u32(0x7a, length);
	    }
	    writeAsciiStr(str) {
	        this.writeStrHdr(str.length);
	        this.writer.ascii(str);
	    }
	    writeArr(arr) {
	        const length = arr.length;
	        this.writeArrHdr(length);
	        for (let i = 0; i < length; i++)
	            this.writeAny(arr[i]);
	    }
	    writeArrHdr(length) {
	        const writer = this.writer;
	        if (length <= 23)
	            writer.u8(128 /* MAJOR_OVERLAY.ARR */ + length);
	        else if (length <= 0xff)
	            writer.u16((0x98 << 8) + length);
	        else if (length <= 0xffff)
	            writer.u8u16(0x99, length);
	        else if (length <= 0xffffffff)
	            writer.u8u32(0x9a, length);
	        else
	            writer.u8u64(0x9b, length);
	    }
	    writeObj(obj) {
	        const keys = Object.keys(obj);
	        const length = keys.length;
	        this.writeObjHdr(length);
	        for (let i = 0; i < length; i++) {
	            const key = keys[i];
	            this.writeStr(key);
	            this.writeAny(obj[key]);
	        }
	    }
	    writeObjHdr(length) {
	        const writer = this.writer;
	        if (length <= 23)
	            writer.u8(160 /* MAJOR_OVERLAY.MAP */ + length);
	        else if (length <= 0xff)
	            writer.u16((0xb8 << 8) + length);
	        else if (length <= 0xffff)
	            writer.u8u16(0xb9, length);
	        else if (length <= 0xffffffff)
	            writer.u8u32(0xba, length);
	        else
	            writer.u8u64(0xbb, length);
	    }
	    writeMapHdr(length) {
	        this.writeObjHdr(length);
	    }
	    writeStartMap() {
	        this.writer.u8(0xbf);
	    }
	    writeTag(tag, value) {
	        this.writeTagHdr(tag);
	        this.writeAny(value);
	    }
	    writeTagHdr(tag) {
	        const writer = this.writer;
	        if (tag <= 23)
	            writer.u8(192 /* MAJOR_OVERLAY.TAG */ + tag);
	        else if (tag <= 0xff)
	            writer.u16((0xd8 << 8) + tag);
	        else if (tag <= 0xffff)
	            writer.u8u16(0xd9, tag);
	        else if (tag <= 0xffffffff)
	            writer.u8u32(0xda, tag);
	        else
	            writer.u8u64(0xdb, tag);
	    }
	    writeTkn(value) {
	        const writer = this.writer;
	        if (value <= 23)
	            writer.u8(224 /* MAJOR_OVERLAY.TKN */ + value);
	        else if (value <= 0xff)
	            writer.u16((0xf8 << 8) + value);
	    }
	    // ------------------------------------------------------- Streaming encoding
	    writeStartStr() {
	        this.writer.u8(0x7f);
	    }
	    writeStrChunk(str) {
	        throw new Error('Not implemented');
	    }
	    writeEndStr() {
	        throw new Error('Not implemented');
	    }
	    writeStartBin() {
	        this.writer.u8(0x5f);
	    }
	    writeBinChunk(buf) {
	        throw new Error('Not implemented');
	    }
	    writeEndBin() {
	        throw new Error('Not implemented');
	    }
	    writeStartArr() {
	        this.writer.u8(0x9f);
	    }
	    writeArrChunk(item) {
	        throw new Error('Not implemented');
	    }
	    writeEndArr() {
	        this.writer.u8(255 /* CONST.END */);
	    }
	    writeStartObj() {
	        this.writer.u8(0xbf);
	    }
	    writeObjChunk(key, value) {
	        throw new Error('Not implemented');
	    }
	    writeEndObj() {
	        this.writer.u8(255 /* CONST.END */);
	    }
	};
	CborEncoderFast.CborEncoderFast = CborEncoderFast$1;
	
	return CborEncoderFast;
}

var JsonPackValue = {};

var hasRequiredJsonPackValue;

function requireJsonPackValue () {
	if (hasRequiredJsonPackValue) return JsonPackValue;
	hasRequiredJsonPackValue = 1;
	Object.defineProperty(JsonPackValue, "__esModule", { value: true });
	JsonPackValue.JsonPackValue = void 0;
	/**
	 * Use this wrapper is you have a pre-encoded MessagePack or CBOR value and you would
	 * like to dump it into a the document as-is. The contents of `buf` will
	 * be written as is to the document.
	 *
	 * It also serves as CBOR simple value container. In which case the type of value
	 * `val` field is "number".
	 *
	 * @category Value
	 */
	let JsonPackValue$1 = class JsonPackValue {
	    constructor(val) {
	        this.val = val;
	    }
	};
	JsonPackValue.JsonPackValue = JsonPackValue$1;
	
	return JsonPackValue;
}

var hasRequiredCborEncoder;

function requireCborEncoder () {
	if (hasRequiredCborEncoder) return CborEncoder;
	hasRequiredCborEncoder = 1;
	Object.defineProperty(CborEncoder, "__esModule", { value: true });
	CborEncoder.CborEncoder = void 0;
	const isFloat32_1 = requireIsFloat32();
	const JsonPackExtension_1 = requireJsonPackExtension();
	const CborEncoderFast_1 = requireCborEncoderFast();
	const JsonPackValue_1 = requireJsonPackValue();
	let CborEncoder$1 = class CborEncoder extends CborEncoderFast_1.CborEncoderFast {
	    /**
	     * Called when the encoder encounters a value that it does not know how to encode.
	     *
	     * @param value Some JavaScript value.
	     */
	    writeUnknown(value) {
	        this.writeNull();
	    }
	    writeAny(value) {
	        switch (typeof value) {
	            case 'number':
	                return this.writeNumber(value);
	            case 'string':
	                return this.writeStr(value);
	            case 'boolean':
	                return this.writer.u8(0xf4 + +value);
	            case 'object': {
	                if (!value)
	                    return this.writer.u8(0xf6);
	                const constr = value.constructor;
	                switch (constr) {
	                    case Object:
	                        return this.writeObj(value);
	                    case Array:
	                        return this.writeArr(value);
	                    case Uint8Array:
	                        return this.writeBin(value);
	                    case Map:
	                        return this.writeMap(value);
	                    case JsonPackExtension_1.JsonPackExtension:
	                        return this.writeTag(value.tag, value.val);
	                    case JsonPackValue_1.JsonPackValue: {
	                        const buf = value.val;
	                        return this.writer.buf(buf, buf.length);
	                    }
	                    default:
	                        if (value instanceof Uint8Array)
	                            return this.writeBin(value);
	                        if (Array.isArray(value))
	                            return this.writeArr(value);
	                        if (value instanceof Map)
	                            return this.writeMap(value);
	                        return this.writeUnknown(value);
	                }
	            }
	            case 'undefined':
	                return this.writeUndef();
	            case 'bigint':
	                return this.writeBigInt(value);
	            default:
	                return this.writeUnknown(value);
	        }
	    }
	    writeFloat(float) {
	        if ((0, isFloat32_1.isFloat32)(float))
	            this.writer.u8f32(0xfa, float);
	        else
	            this.writer.u8f64(0xfb, float);
	    }
	    writeMap(map) {
	        this.writeMapHdr(map.size);
	        map.forEach((value, key) => {
	            this.writeAny(key);
	            this.writeAny(value);
	        });
	    }
	    writeUndef() {
	        this.writer.u8(0xf7);
	    }
	};
	CborEncoder.CborEncoder = CborEncoder$1;
	
	return CborEncoder;
}

var CborDecoder = {};

var CborDecoderBase = {};

var f16 = {};

var hasRequiredF16;

function requireF16 () {
	if (hasRequiredF16) return f16;
	hasRequiredF16 = 1;
	Object.defineProperty(f16, "__esModule", { value: true });
	f16.decodeF16 = void 0;
	const pow = Math.pow;
	const decodeF16 = (binary) => {
	    const exponent = (binary & 0x7c00) >> 10;
	    const fraction = binary & 0x03ff;
	    return ((binary >> 15 ? -1 : 1) *
	        (exponent
	            ? exponent === 0x1f
	                ? fraction
	                    ? NaN
	                    : Infinity
	                : pow(2, exponent - 15) * (1 + fraction / 0x400)
	            : 6.103515625e-5 * (fraction / 0x400)));
	};
	f16.decodeF16 = decodeF16;
	
	return f16;
}

var Reader = {};

var decodeUtf8 = {};

var v16 = {};

var decodeAscii = {};

var hasRequiredDecodeAscii;

function requireDecodeAscii () {
	if (hasRequiredDecodeAscii) return decodeAscii;
	hasRequiredDecodeAscii = 1;
	Object.defineProperty(decodeAscii, "__esModule", { value: true });
	decodeAscii.decodeAsciiMax15 = decodeAscii.decodeAscii = void 0;
	const fromCharCode = String.fromCharCode;
	/** This code was borrowed form cbor-x under the MIT license. */
	// MIT License
	// Copyright (c) 2020 Kris Zyp
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the "Software"), to deal
	// in the Software without restriction, including without limitation the rights
	// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	// The above copyright notice and this permission notice shall be included in all
	// copies or substantial portions of the Software.
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	// SOFTWARE.
	const decodeAscii$1 = (src, position, length) => {
	    const bytes = [];
	    for (let i = 0; i < length; i++) {
	        const byte = src[position++];
	        if (byte & 0x80)
	            return;
	        bytes.push(byte);
	    }
	    return fromCharCode.apply(String, bytes);
	};
	decodeAscii.decodeAscii = decodeAscii$1;
	const decodeAsciiMax15 = (src, position, length) => {
	    if (length < 4) {
	        if (length < 2) {
	            if (length === 0)
	                return '';
	            else {
	                const a = src[position++];
	                if ((a & 0x80) > 1) {
	                    position -= 1;
	                    return;
	                }
	                return fromCharCode(a);
	            }
	        }
	        else {
	            const a = src[position++];
	            const b = src[position++];
	            if ((a & 0x80) > 0 || (b & 0x80) > 0) {
	                position -= 2;
	                return;
	            }
	            if (length < 3)
	                return fromCharCode(a, b);
	            const c = src[position++];
	            if ((c & 0x80) > 0) {
	                position -= 3;
	                return;
	            }
	            return fromCharCode(a, b, c);
	        }
	    }
	    else {
	        const a = src[position++];
	        const b = src[position++];
	        const c = src[position++];
	        const d = src[position++];
	        if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
	            position -= 4;
	            return;
	        }
	        if (length < 6) {
	            if (length === 4)
	                return fromCharCode(a, b, c, d);
	            else {
	                const e = src[position++];
	                if ((e & 0x80) > 0) {
	                    position -= 5;
	                    return;
	                }
	                return fromCharCode(a, b, c, d, e);
	            }
	        }
	        else if (length < 8) {
	            const e = src[position++];
	            const f = src[position++];
	            if ((e & 0x80) > 0 || (f & 0x80) > 0) {
	                position -= 6;
	                return;
	            }
	            if (length < 7)
	                return fromCharCode(a, b, c, d, e, f);
	            const g = src[position++];
	            if ((g & 0x80) > 0) {
	                position -= 7;
	                return;
	            }
	            return fromCharCode(a, b, c, d, e, f, g);
	        }
	        else {
	            const e = src[position++];
	            const f = src[position++];
	            const g = src[position++];
	            const h = src[position++];
	            if ((e & 0x80) > 0 || (f & 0x80) > 0 || (g & 0x80) > 0 || (h & 0x80) > 0) {
	                position -= 8;
	                return;
	            }
	            if (length < 10) {
	                if (length === 8)
	                    return fromCharCode(a, b, c, d, e, f, g, h);
	                else {
	                    const i = src[position++];
	                    if ((i & 0x80) > 0) {
	                        position -= 9;
	                        return;
	                    }
	                    return fromCharCode(a, b, c, d, e, f, g, h, i);
	                }
	            }
	            else if (length < 12) {
	                const i = src[position++];
	                const j = src[position++];
	                if ((i & 0x80) > 0 || (j & 0x80) > 0) {
	                    position -= 10;
	                    return;
	                }
	                if (length < 11)
	                    return fromCharCode(a, b, c, d, e, f, g, h, i, j);
	                const k = src[position++];
	                if ((k & 0x80) > 0) {
	                    position -= 11;
	                    return;
	                }
	                return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
	            }
	            else {
	                const i = src[position++];
	                const j = src[position++];
	                const k = src[position++];
	                const l = src[position++];
	                if ((i & 0x80) > 0 || (j & 0x80) > 0 || (k & 0x80) > 0 || (l & 0x80) > 0) {
	                    position -= 12;
	                    return;
	                }
	                if (length < 14) {
	                    if (length === 12)
	                        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
	                    else {
	                        const m = src[position++];
	                        if ((m & 0x80) > 0) {
	                            position -= 13;
	                            return;
	                        }
	                        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
	                    }
	                }
	                else {
	                    const m = src[position++];
	                    const n = src[position++];
	                    if ((m & 0x80) > 0 || (n & 0x80) > 0) {
	                        position -= 14;
	                        return;
	                    }
	                    if (length < 15)
	                        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
	                    const o = src[position++];
	                    if ((o & 0x80) > 0) {
	                        position -= 15;
	                        return;
	                    }
	                    return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
	                }
	            }
	        }
	    }
	};
	decodeAscii.decodeAsciiMax15 = decodeAsciiMax15;
	
	return decodeAscii;
}

var v18 = {};

var hasRequiredV18;

function requireV18 () {
	if (hasRequiredV18) return v18;
	hasRequiredV18 = 1;
	Object.defineProperty(v18, "__esModule", { value: true });
	const fromCharCode = String.fromCharCode;
	v18.default = (buf, start, length) => {
	    let offset = start;
	    const end = offset + length;
	    const points = [];
	    while (offset < end) {
	        let code = buf[offset++];
	        if ((code & 0x80) !== 0) {
	            const octet2 = buf[offset++] & 0x3f;
	            if ((code & 0xe0) === 0xc0) {
	                code = ((code & 0x1f) << 6) | octet2;
	            }
	            else {
	                const octet3 = buf[offset++] & 0x3f;
	                if ((code & 0xf0) === 0xe0) {
	                    code = ((code & 0x1f) << 12) | (octet2 << 6) | octet3;
	                }
	                else {
	                    if ((code & 0xf8) === 0xf0) {
	                        const octet4 = buf[offset++] & 0x3f;
	                        let unit = ((code & 0x07) << 0x12) | (octet2 << 0x0c) | (octet3 << 0x06) | octet4;
	                        if (unit > 0xffff) {
	                            unit -= 0x10000;
	                            const unit0 = ((unit >>> 10) & 0x3ff) | 0xd800;
	                            code = 0xdc00 | (unit & 0x3ff);
	                            points.push(unit0);
	                        }
	                        else {
	                            code = unit;
	                        }
	                    }
	                }
	            }
	        }
	        points.push(code);
	    }
	    return fromCharCode.apply(String, points);
	};
	
	return v18;
}

var hasRequiredV16;

function requireV16 () {
	if (hasRequiredV16) return v16;
	hasRequiredV16 = 1;
	Object.defineProperty(v16, "__esModule", { value: true });
	const tslib_1 = require$$0$2;
	const decodeAscii_1 = requireDecodeAscii();
	const v18_1 = tslib_1.__importDefault(requireV18());
	const hasBuffer = typeof Buffer !== 'undefined';
	const utf8Slice = hasBuffer ? Buffer.prototype.utf8Slice : null;
	const from = hasBuffer ? Buffer.from : null;
	const shortDecoder = (buf, start, length) => (0, decodeAscii_1.decodeAsciiMax15)(buf, start, length) ?? (0, v18_1.default)(buf, start, length);
	const midDecoder = (buf, start, length) => (0, decodeAscii_1.decodeAscii)(buf, start, length) ?? (0, v18_1.default)(buf, start, length);
	const longDecoder = utf8Slice
	    ? (buf, start, length) => utf8Slice.call(buf, start, start + length)
	    : from
	        ? (buf, start, length) => from(buf)
	            .subarray(start, start + length)
	            .toString('utf8')
	        : v18_1.default;
	const decoder = (buf, start, length) => {
	    if (length < 16)
	        return shortDecoder(buf, start, length);
	    if (length < 32)
	        return midDecoder(buf, start, length);
	    return longDecoder(buf, start, length);
	};
	v16.default = decoder;
	
	return v16;
}

var hasRequiredDecodeUtf8;

function requireDecodeUtf8 () {
	if (hasRequiredDecodeUtf8) return decodeUtf8;
	hasRequiredDecodeUtf8 = 1;
	Object.defineProperty(decodeUtf8, "__esModule", { value: true });
	decodeUtf8.decodeUtf8 = void 0;
	const tslib_1 = require$$0$2;
	const v16_1 = tslib_1.__importDefault(requireV16());
	decodeUtf8.decodeUtf8 = v16_1.default;
	
	return decodeUtf8;
}

var hasRequiredReader;

function requireReader () {
	if (hasRequiredReader) return Reader;
	hasRequiredReader = 1;
	Object.defineProperty(Reader, "__esModule", { value: true });
	Reader.Reader = void 0;
	const decodeUtf8_1 = requireDecodeUtf8();
	let Reader$1 = class Reader {
	    constructor(uint8 = new Uint8Array([]), view = new DataView(uint8.buffer, uint8.byteOffset, uint8.length), x = 0, end = uint8.length) {
	        this.uint8 = uint8;
	        this.view = view;
	        this.x = x;
	        this.end = end;
	    }
	    reset(uint8) {
	        this.x = 0;
	        this.uint8 = uint8;
	        this.view = new DataView(uint8.buffer, uint8.byteOffset, uint8.length);
	    }
	    size() {
	        return this.end - this.x;
	    }
	    /**
	     * Get current byte value without advancing the cursor.
	     */
	    peek() {
	        return this.view.getUint8(this.x);
	    }
	    /**
	     * @deprecated Use peek() instead.
	     */
	    peak() {
	        return this.peek();
	    }
	    skip(length) {
	        this.x += length;
	    }
	    buf(size = this.size()) {
	        const x = this.x;
	        const end = x + size;
	        const bin = this.uint8.subarray(x, end);
	        this.x = end;
	        return bin;
	    }
	    subarray(start = 0, end) {
	        const x = this.x;
	        const actualStart = x + start;
	        const actualEnd = typeof end === 'number' ? x + end : this.end;
	        return this.uint8.subarray(actualStart, actualEnd);
	    }
	    /**
	     * Creates a new {@link Reader} that references the same underlying memory
	     * buffer. But with independent cursor and end.
	     *
	     * Preferred over {@link buf} since it also provides a DataView and is much
	     * faster to allocate a new {@link Slice} than a new {@link Uint8Array}.
	     *
	     * @param start Start offset relative to the current cursor position.
	     * @param end End offset relative to the current cursor position.
	     * @returns A new {@link Reader} instance.
	     */
	    slice(start = 0, end) {
	        const x = this.x;
	        const actualStart = x + start;
	        const actualEnd = typeof end === 'number' ? x + end : this.end;
	        return new Reader(this.uint8, this.view, actualStart, actualEnd);
	    }
	    /**
	     * Similar to {@link slice} but also advances the cursor. Returns a new
	     * {@link Reader} that references the same underlying memory buffer, starting
	     * from the current cursor position.
	     *
	     * @param size Number of bytes to cut from the current position.
	     * @returns A new {@link Reader} instance.
	     */
	    cut(size = this.size()) {
	        const slice = this.slice(0, size);
	        this.skip(size);
	        return slice;
	    }
	    u8() {
	        return this.uint8[this.x++];
	        // return this.view.getUint8(this.x++);
	    }
	    i8() {
	        return this.view.getInt8(this.x++);
	    }
	    u16() {
	        // const num = this.view.getUint16(this.x);
	        // this.x += 2;
	        // return num;
	        let x = this.x;
	        const num = (this.uint8[x++] << 8) + this.uint8[x++];
	        this.x = x;
	        return num;
	    }
	    i16() {
	        const num = this.view.getInt16(this.x);
	        this.x += 2;
	        return num;
	    }
	    u32() {
	        const num = this.view.getUint32(this.x);
	        this.x += 4;
	        return num;
	    }
	    i32() {
	        const num = this.view.getInt32(this.x);
	        this.x += 4;
	        return num;
	    }
	    u64() {
	        const num = this.view.getBigUint64(this.x);
	        this.x += 8;
	        return num;
	    }
	    i64() {
	        const num = this.view.getBigInt64(this.x);
	        this.x += 8;
	        return num;
	    }
	    f32() {
	        const pos = this.x;
	        this.x += 4;
	        return this.view.getFloat32(pos);
	    }
	    f64() {
	        const pos = this.x;
	        this.x += 8;
	        return this.view.getFloat64(pos);
	    }
	    utf8(size) {
	        const start = this.x;
	        this.x += size;
	        return (0, decodeUtf8_1.decodeUtf8)(this.uint8, start, size);
	    }
	    ascii(length) {
	        const uint8 = this.uint8;
	        let str = '';
	        const end = this.x + length;
	        for (let i = this.x; i < end; i++)
	            str += String.fromCharCode(uint8[i]);
	        this.x = end;
	        return str;
	    }
	};
	Reader.Reader = Reader$1;
	
	return Reader;
}

var sharedCachedUtf8Decoder = {};

var CachedUtf8Decoder = {};

var v10 = {};

var hasRequiredV10;

function requireV10 () {
	if (hasRequiredV10) return v10;
	hasRequiredV10 = 1;
	Object.defineProperty(v10, "__esModule", { value: true });
	const fromCharCode = String.fromCharCode;
	v10.default = (buf, start, length) => {
	    let offset = start;
	    const end = offset + length;
	    let str = '';
	    while (offset < end) {
	        const octet1 = buf[offset++];
	        if ((octet1 & 0x80) === 0) {
	            str += fromCharCode(octet1);
	            continue;
	        }
	        const octet2 = buf[offset++] & 0x3f;
	        if ((octet1 & 0xe0) === 0xc0) {
	            str += fromCharCode(((octet1 & 0x1f) << 6) | octet2);
	            continue;
	        }
	        const octet3 = buf[offset++] & 0x3f;
	        if ((octet1 & 0xf0) === 0xe0) {
	            str += fromCharCode(((octet1 & 0x1f) << 12) | (octet2 << 6) | octet3);
	            continue;
	        }
	        if ((octet1 & 0xf8) === 0xf0) {
	            const octet4 = buf[offset++] & 0x3f;
	            let unit = ((octet1 & 0x07) << 0x12) | (octet2 << 0x0c) | (octet3 << 0x06) | octet4;
	            if (unit > 0xffff) {
	                unit -= 0x10000;
	                const unit0 = ((unit >>> 10) & 0x3ff) | 0xd800;
	                unit = 0xdc00 | (unit & 0x3ff);
	                str += fromCharCode(unit0, unit);
	            }
	            else {
	                str += fromCharCode(unit);
	            }
	        }
	        else {
	            str += fromCharCode(octet1);
	        }
	    }
	    return str;
	};
	
	return v10;
}

var hasRequiredCachedUtf8Decoder;

function requireCachedUtf8Decoder () {
	if (hasRequiredCachedUtf8Decoder) return CachedUtf8Decoder;
	hasRequiredCachedUtf8Decoder = 1;
	Object.defineProperty(CachedUtf8Decoder, "__esModule", { value: true });
	CachedUtf8Decoder.CachedUtf8Decoder = void 0;
	const tslib_1 = require$$0$2;
	const v10_1 = tslib_1.__importDefault(requireV10());
	let x = 1 + Math.round(Math.random() * ((-1 >>> 0) - 1));
	/** Generate a random 32-bit unsigned integer in the specified [min, max] range. */
	function randomU32(min, max) {
	    x ^= x << 13;
	    x ^= x >>> 17;
	    x ^= x << 5;
	    return ((x >>> 0) % (max - min + 1)) + min;
	}
	class CacheItem {
	    constructor(bytes, value) {
	        this.bytes = bytes;
	        this.value = value;
	    }
	}
	let CachedUtf8Decoder$1 = class CachedUtf8Decoder {
	    constructor() {
	        this.caches = [];
	        for (let i = 0; i < 31 /* CONST.MAX_CACHED_STR_LEN */; i++)
	            this.caches.push([]);
	    }
	    get(bytes, offset, size) {
	        const records = this.caches[size - 1];
	        const len = records.length;
	        FIND_CHUNK: for (let i = 0; i < len; i++) {
	            const record = records[i];
	            const recordBytes = record.bytes;
	            for (let j = 0; j < size; j++)
	                if (recordBytes[j] !== bytes[offset + j])
	                    continue FIND_CHUNK;
	            return record.value;
	        }
	        return null;
	    }
	    store(bytes, value) {
	        const records = this.caches[bytes.length - 1];
	        const record = new CacheItem(bytes, value);
	        const length = records.length;
	        if (length >= 16 /* CONST.MAX_RECORDS_PER_SIZE */)
	            records[randomU32(0, 16 /* CONST.MAX_RECORDS_PER_SIZE */ - 1)] = record;
	        else
	            records.push(record);
	    }
	    decode(bytes, offset, size) {
	        if (!size)
	            return '';
	        const cachedValue = this.get(bytes, offset, size);
	        if (cachedValue !== null)
	            return cachedValue;
	        const value = (0, v10_1.default)(bytes, offset, size);
	        // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
	        const copy = Uint8Array.prototype.slice.call(bytes, offset, offset + size);
	        this.store(copy, value);
	        return value;
	    }
	};
	CachedUtf8Decoder.CachedUtf8Decoder = CachedUtf8Decoder$1;
	
	return CachedUtf8Decoder;
}

var hasRequiredSharedCachedUtf8Decoder;

function requireSharedCachedUtf8Decoder () {
	if (hasRequiredSharedCachedUtf8Decoder) return sharedCachedUtf8Decoder;
	hasRequiredSharedCachedUtf8Decoder = 1;
	Object.defineProperty(sharedCachedUtf8Decoder, "__esModule", { value: true });
	const CachedUtf8Decoder_1 = requireCachedUtf8Decoder();
	sharedCachedUtf8Decoder.default = new CachedUtf8Decoder_1.CachedUtf8Decoder();
	
	return sharedCachedUtf8Decoder;
}

var hasRequiredCborDecoderBase;

function requireCborDecoderBase () {
	if (hasRequiredCborDecoderBase) return CborDecoderBase;
	hasRequiredCborDecoderBase = 1;
	Object.defineProperty(CborDecoderBase, "__esModule", { value: true });
	CborDecoderBase.CborDecoderBase = void 0;
	const tslib_1 = require$$0$2;
	const f16_1 = requireF16();
	const JsonPackExtension_1 = requireJsonPackExtension();
	const JsonPackValue_1 = requireJsonPackValue();
	const Reader_1 = requireReader();
	const sharedCachedUtf8Decoder_1 = tslib_1.__importDefault(requireSharedCachedUtf8Decoder());
	let CborDecoderBase$1 = class CborDecoderBase {
	    constructor(reader = new Reader_1.Reader(), keyDecoder = sharedCachedUtf8Decoder_1.default) {
	        this.reader = reader;
	        this.keyDecoder = keyDecoder;
	    }
	    read(uint8) {
	        this.reader.reset(uint8);
	        return this.readAny();
	    }
	    decode(uint8) {
	        this.reader.reset(uint8);
	        return this.readAny();
	    }
	    // -------------------------------------------------------- Any value reading
	    val() {
	        return this.readAny();
	    }
	    readAny() {
	        const reader = this.reader;
	        const octet = reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major < 4 /* MAJOR.ARR */) {
	            if (major < 2 /* MAJOR.BIN */)
	                return major === 0 /* MAJOR.UIN */ ? this.readUint(minor) : this.readNint(minor);
	            else
	                return major === 2 /* MAJOR.BIN */ ? this.readBin(minor) : this.readStr(minor);
	        }
	        else {
	            if (major < 6 /* MAJOR.TAG */)
	                return major === 4 /* MAJOR.ARR */ ? this.readArr(minor) : this.readObj(minor);
	            else
	                return major === 6 /* MAJOR.TAG */ ? this.readTag(minor) : this.readTkn(minor);
	        }
	    }
	    readAnyRaw(octet) {
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major < 4 /* MAJOR.ARR */) {
	            if (major < 2 /* MAJOR.BIN */)
	                return major === 0 /* MAJOR.UIN */ ? this.readUint(minor) : this.readNint(minor);
	            else
	                return major === 2 /* MAJOR.BIN */ ? this.readBin(minor) : this.readStr(minor);
	        }
	        else {
	            if (major < 6 /* MAJOR.TAG */)
	                return major === 4 /* MAJOR.ARR */ ? this.readArr(minor) : this.readObj(minor);
	            else
	                return major === 6 /* MAJOR.TAG */ ? this.readTag(minor) : this.readTkn(minor);
	        }
	    }
	    readMinorLen(minor) {
	        if (minor < 24)
	            return minor;
	        switch (minor) {
	            case 24:
	                return this.reader.u8();
	            case 25:
	                return this.reader.u16();
	            case 26:
	                return this.reader.u32();
	            case 27:
	                return Number(this.reader.u64());
	            case 31:
	                return -1;
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    // ----------------------------------------------------- Unsigned int reading
	    readUint(minor) {
	        if (minor < 25) {
	            return minor === 24 ? this.reader.u8() : minor;
	        }
	        else {
	            if (minor < 27) {
	                return minor === 25 ? this.reader.u16() : this.reader.u32();
	            }
	            else {
	                const num = this.reader.u64();
	                return num > 9007199254740991 /* CONST.MAX_UINT */ ? num : Number(num);
	            }
	        }
	    }
	    // ----------------------------------------------------- Negative int reading
	    readNint(minor) {
	        if (minor < 25) {
	            return minor === 24 ? -this.reader.u8() - 1 : -minor - 1;
	        }
	        else {
	            if (minor < 27) {
	                return minor === 25 ? -this.reader.u16() - 1 : -this.reader.u32() - 1;
	            }
	            else {
	                const num = this.reader.u64();
	                return num > 9007199254740991 /* CONST.MAX_UINT */ - 1 ? -num - BigInt(1) : -Number(num) - 1;
	            }
	        }
	    }
	    // ----------------------------------------------------------- Binary reading
	    readBin(minor) {
	        const reader = this.reader;
	        if (minor <= 23)
	            return reader.buf(minor);
	        switch (minor) {
	            case 24:
	                return reader.buf(reader.u8());
	            case 25:
	                return reader.buf(reader.u16());
	            case 26:
	                return reader.buf(reader.u32());
	            case 27:
	                return reader.buf(Number(reader.u64()));
	            case 31: {
	                let size = 0;
	                const list = [];
	                while (this.reader.peak() !== 255 /* CONST.END */) {
	                    const uint8 = this.readBinChunk();
	                    size += uint8.length;
	                    list.push(uint8);
	                }
	                this.reader.x++;
	                const res = new Uint8Array(size);
	                let offset = 0;
	                const length = list.length;
	                for (let i = 0; i < length; i++) {
	                    const arr = list[i];
	                    res.set(arr, offset);
	                    offset += arr.length;
	                }
	                return res;
	            }
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    readBinChunk() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 2 /* MAJOR.BIN */)
	            throw 2 /* ERROR.UNEXPECTED_BIN_CHUNK_MAJOR */;
	        if (minor > 27)
	            throw 3 /* ERROR.UNEXPECTED_BIN_CHUNK_MINOR */;
	        return this.readBin(minor);
	    }
	    // ----------------------------------------------------------- String reading
	    readAsStr() {
	        const reader = this.reader;
	        const octet = reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 3 /* MAJOR.STR */)
	            throw 11 /* ERROR.UNEXPECTED_STR_MAJOR */;
	        return this.readStr(minor);
	    }
	    readStr(minor) {
	        const reader = this.reader;
	        if (minor <= 23)
	            return reader.utf8(minor);
	        switch (minor) {
	            case 24:
	                return reader.utf8(reader.u8());
	            case 25:
	                return reader.utf8(reader.u16());
	            case 26:
	                return reader.utf8(reader.u32());
	            case 27:
	                return reader.utf8(Number(reader.u64()));
	            case 31: {
	                let str = '';
	                while (reader.peak() !== 255 /* CONST.END */)
	                    str += this.readStrChunk();
	                this.reader.x++;
	                return str;
	            }
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    readStrLen(minor) {
	        if (minor <= 23)
	            return minor;
	        switch (minor) {
	            case 24:
	                return this.reader.u8();
	            case 25:
	                return this.reader.u16();
	            case 26:
	                return this.reader.u32();
	            case 27:
	                return Number(this.reader.u64());
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    readStrChunk() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 3 /* MAJOR.STR */)
	            throw 4 /* ERROR.UNEXPECTED_STR_CHUNK_MAJOR */;
	        if (minor > 27)
	            throw 5 /* ERROR.UNEXPECTED_STR_CHUNK_MINOR */;
	        return this.readStr(minor);
	    }
	    // ------------------------------------------------------------ Array reading
	    readArr(minor) {
	        const length = this.readMinorLen(minor);
	        if (length >= 0)
	            return this.readArrRaw(length);
	        return this.readArrIndef();
	    }
	    readArrRaw(length) {
	        const arr = [];
	        for (let i = 0; i < length; i++)
	            arr.push(this.readAny());
	        return arr;
	    }
	    readArrIndef() {
	        const arr = [];
	        while (this.reader.peak() !== 255 /* CONST.END */)
	            arr.push(this.readAny());
	        this.reader.x++;
	        return arr;
	    }
	    // ----------------------------------------------------------- Object reading
	    readObj(minor) {
	        if (minor < 28) {
	            let length = minor;
	            switch (minor) {
	                case 24:
	                    length = this.reader.u8();
	                    break;
	                case 25:
	                    length = this.reader.u16();
	                    break;
	                case 26:
	                    length = this.reader.u32();
	                    break;
	                case 27:
	                    length = Number(this.reader.u64());
	                    break;
	            }
	            const obj = {};
	            for (let i = 0; i < length; i++) {
	                const key = this.key();
	                if (key === '__proto__')
	                    throw 6 /* ERROR.UNEXPECTED_OBJ_KEY */;
	                const value = this.readAny();
	                obj[key] = value;
	            }
	            return obj;
	        }
	        else if (minor === 31)
	            return this.readObjIndef();
	        else
	            throw 1 /* ERROR.UNEXPECTED_MINOR */;
	    }
	    /** Remove this? */
	    readObjRaw(length) {
	        const obj = {};
	        for (let i = 0; i < length; i++) {
	            const key = this.key();
	            const value = this.readAny();
	            obj[key] = value;
	        }
	        return obj;
	    }
	    readObjIndef() {
	        const obj = {};
	        while (this.reader.peak() !== 255 /* CONST.END */) {
	            const key = this.key();
	            if (this.reader.peak() === 255 /* CONST.END */)
	                throw 7 /* ERROR.UNEXPECTED_OBJ_BREAK */;
	            const value = this.readAny();
	            obj[key] = value;
	        }
	        this.reader.x++;
	        return obj;
	    }
	    key() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 3 /* MAJOR.STR */)
	            return String(this.readAnyRaw(octet));
	        const length = this.readStrLen(minor);
	        if (length > 31)
	            return this.reader.utf8(length);
	        const key = this.keyDecoder.decode(this.reader.uint8, this.reader.x, length);
	        this.reader.skip(length);
	        return key;
	    }
	    // -------------------------------------------------------------- Tag reading
	    readTag(minor) {
	        if (minor <= 23)
	            return this.readTagRaw(minor);
	        switch (minor) {
	            case 24:
	                return this.readTagRaw(this.reader.u8());
	            case 25:
	                return this.readTagRaw(this.reader.u16());
	            case 26:
	                return this.readTagRaw(this.reader.u32());
	            case 27:
	                return this.readTagRaw(Number(this.reader.u64()));
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    readTagRaw(tag) {
	        return new JsonPackExtension_1.JsonPackExtension(tag, this.readAny());
	    }
	    // ------------------------------------------------------------ Token reading
	    readTkn(minor) {
	        switch (minor) {
	            case 0xf4 & 31 /* CONST.MINOR_MASK */:
	                return false;
	            case 0xf5 & 31 /* CONST.MINOR_MASK */:
	                return true;
	            case 0xf6 & 31 /* CONST.MINOR_MASK */:
	                return null;
	            case 0xf7 & 31 /* CONST.MINOR_MASK */:
	                return undefined;
	            case 0xf8 & 31 /* CONST.MINOR_MASK */:
	                return new JsonPackValue_1.JsonPackValue(this.reader.u8());
	            case 0xf9 & 31 /* CONST.MINOR_MASK */:
	                return this.f16();
	            case 0xfa & 31 /* CONST.MINOR_MASK */:
	                return this.reader.f32();
	            case 0xfb & 31 /* CONST.MINOR_MASK */:
	                return this.reader.f64();
	        }
	        if (minor <= 23)
	            return new JsonPackValue_1.JsonPackValue(minor);
	        throw 1 /* ERROR.UNEXPECTED_MINOR */;
	    }
	    f16() {
	        return (0, f16_1.decodeF16)(this.reader.u16());
	    }
	};
	CborDecoderBase.CborDecoderBase = CborDecoderBase$1;
	
	return CborDecoderBase;
}

var hasRequiredCborDecoder;

function requireCborDecoder () {
	if (hasRequiredCborDecoder) return CborDecoder;
	hasRequiredCborDecoder = 1;
	Object.defineProperty(CborDecoder, "__esModule", { value: true });
	CborDecoder.CborDecoder = void 0;
	const CborDecoderBase_1 = requireCborDecoderBase();
	const JsonPackValue_1 = requireJsonPackValue();
	let CborDecoder$1 = class CborDecoder extends CborDecoderBase_1.CborDecoderBase {
	    // -------------------------------------------------------------- Map reading
	    readAsMap() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        switch (major) {
	            case 5 /* MAJOR.MAP */:
	                return this.readMap(minor);
	            default:
	                throw 0 /* ERROR.UNEXPECTED_MAJOR */;
	        }
	    }
	    readMap(minor) {
	        const length = this.readMinorLen(minor);
	        if (length >= 0)
	            return this.readMapRaw(length);
	        else
	            return this.readMapIndef();
	    }
	    readMapRaw(length) {
	        const map = new Map();
	        for (let i = 0; i < length; i++) {
	            const key = this.readAny();
	            const value = this.readAny();
	            map.set(key, value);
	        }
	        return map;
	    }
	    readMapIndef() {
	        const map = new Map();
	        while (this.reader.peak() !== 255 /* CONST.END */) {
	            const key = this.readAny();
	            if (this.reader.peak() === 255 /* CONST.END */)
	                throw 7 /* ERROR.UNEXPECTED_OBJ_BREAK */;
	            const value = this.readAny();
	            map.set(key, value);
	        }
	        this.reader.x++;
	        return map;
	    }
	    // ----------------------------------------------------------- Value skipping
	    skipN(n) {
	        for (let i = 0; i < n; i++)
	            this.skipAny();
	    }
	    skipAny() {
	        this.skipAnyRaw(this.reader.u8());
	    }
	    skipAnyRaw(octet) {
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        switch (major) {
	            case 0 /* MAJOR.UIN */:
	            case 1 /* MAJOR.NIN */:
	                this.skipUNint(minor);
	                break;
	            case 2 /* MAJOR.BIN */:
	                this.skipBin(minor);
	                break;
	            case 3 /* MAJOR.STR */:
	                this.skipStr(minor);
	                break;
	            case 4 /* MAJOR.ARR */:
	                this.skipArr(minor);
	                break;
	            case 5 /* MAJOR.MAP */:
	                this.skipObj(minor);
	                break;
	            case 7 /* MAJOR.TKN */:
	                this.skipTkn(minor);
	                break;
	            case 6 /* MAJOR.TAG */:
	                this.skipTag(minor);
	                break;
	        }
	    }
	    skipMinorLen(minor) {
	        if (minor <= 23)
	            return minor;
	        switch (minor) {
	            case 24:
	                return this.reader.u8();
	            case 25:
	                return this.reader.u16();
	            case 26:
	                return this.reader.u32();
	            case 27:
	                return Number(this.reader.u64());
	            case 31:
	                return -1;
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    // --------------------------------------------------------- Integer skipping
	    skipUNint(minor) {
	        if (minor <= 23)
	            return;
	        switch (minor) {
	            case 24:
	                return this.reader.skip(1);
	            case 25:
	                return this.reader.skip(2);
	            case 26:
	                return this.reader.skip(4);
	            case 27:
	                return this.reader.skip(8);
	            default:
	                throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        }
	    }
	    // ---------------------------------------------------------- Binary skipping
	    skipBin(minor) {
	        const length = this.skipMinorLen(minor);
	        if (length >= 0)
	            this.reader.skip(length);
	        else {
	            while (this.reader.peak() !== 255 /* CONST.END */)
	                this.skipBinChunk();
	            this.reader.x++;
	        }
	    }
	    skipBinChunk() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 2 /* MAJOR.BIN */)
	            throw 2 /* ERROR.UNEXPECTED_BIN_CHUNK_MAJOR */;
	        if (minor > 27)
	            throw 3 /* ERROR.UNEXPECTED_BIN_CHUNK_MINOR */;
	        this.skipBin(minor);
	    }
	    // ---------------------------------------------------------- String skipping
	    skipStr(minor) {
	        const length = this.skipMinorLen(minor);
	        if (length >= 0)
	            this.reader.skip(length);
	        else {
	            while (this.reader.peak() !== 255 /* CONST.END */)
	                this.skipStrChunk();
	            this.reader.x++;
	        }
	    }
	    skipStrChunk() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (major !== 3 /* MAJOR.STR */)
	            throw 4 /* ERROR.UNEXPECTED_STR_CHUNK_MAJOR */;
	        if (minor > 27)
	            throw 5 /* ERROR.UNEXPECTED_STR_CHUNK_MINOR */;
	        this.skipStr(minor);
	    }
	    // ----------------------------------------------------------- Array skipping
	    skipArr(minor) {
	        const length = this.skipMinorLen(minor);
	        if (length >= 0)
	            this.skipN(length);
	        else {
	            while (this.reader.peak() !== 255 /* CONST.END */)
	                this.skipAny();
	            this.reader.x++;
	        }
	    }
	    // ---------------------------------------------------------- Object skipping
	    skipObj(minor) {
	        const length = this.readMinorLen(minor);
	        if (length >= 0)
	            return this.skipN(length * 2);
	        else {
	            while (this.reader.peak() !== 255 /* CONST.END */) {
	                this.skipAny();
	                if (this.reader.peak() === 255 /* CONST.END */)
	                    throw 7 /* ERROR.UNEXPECTED_OBJ_BREAK */;
	                this.skipAny();
	            }
	            this.reader.x++;
	        }
	    }
	    // ------------------------------------------------------------- Tag skipping
	    skipTag(minor) {
	        const length = this.skipMinorLen(minor);
	        if (length < 0)
	            throw 1 /* ERROR.UNEXPECTED_MINOR */;
	        this.skipAny();
	    }
	    // ----------------------------------------------------------- Token skipping
	    skipTkn(minor) {
	        switch (minor) {
	            case 0xf8 & 31 /* CONST.MINOR_MASK */:
	                this.reader.skip(1);
	                return;
	            case 0xf9 & 31 /* CONST.MINOR_MASK */:
	                this.reader.skip(2);
	                return;
	            case 0xfa & 31 /* CONST.MINOR_MASK */:
	                this.reader.skip(4);
	                return;
	            case 0xfb & 31 /* CONST.MINOR_MASK */:
	                this.reader.skip(8);
	                return;
	        }
	        if (minor <= 23)
	            return;
	        throw 1 /* ERROR.UNEXPECTED_MINOR */;
	    }
	    // --------------------------------------------------------------- Validation
	    /**
	     * Throws if at given offset in a buffer there is an invalid CBOR value, or
	     * if the value does not span the exact length specified in `size`. I.e.
	     * throws if:
	     *
	     * - The value is not a valid CBOR value.
	     * - The value is shorter than `size`.
	     * - The value is longer than `size`.
	     *
	     * @param value Buffer in which to validate CBOR value.
	     * @param offset Offset at which the value starts.
	     * @param size Expected size of the value.
	     */
	    validate(value, offset = 0, size = value.length) {
	        this.reader.reset(value);
	        this.reader.x = offset;
	        const start = offset;
	        this.skipAny();
	        const end = this.reader.x;
	        if (end - start !== size)
	            throw 8 /* ERROR.INVALID_SIZE */;
	    }
	    // -------------------------------------------- One level reading - any value
	    decodeLevel(value) {
	        this.reader.reset(value);
	        return this.readLevel();
	    }
	    /**
	     * Decodes only one level of objects and arrays. Other values are decoded
	     * completely.
	     *
	     * @returns One level of decoded CBOR value.
	     */
	    readLevel() {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        switch (major) {
	            case 4 /* MAJOR.ARR */:
	                return this.readArrLevel(minor);
	            case 5 /* MAJOR.MAP */:
	                return this.readObjLevel(minor);
	            default:
	                return super.readAnyRaw(octet);
	        }
	    }
	    /**
	     * Decodes primitive values, returns container values as `JsonPackValue`.
	     *
	     * @returns A primitive value, or CBOR container value as a blob.
	     */
	    readPrimitiveOrVal() {
	        const octet = this.reader.peak();
	        const major = octet >> 5;
	        switch (major) {
	            case 4 /* MAJOR.ARR */:
	            case 5 /* MAJOR.MAP */:
	                return this.readAsValue();
	            default:
	                return this.readAny();
	        }
	    }
	    readAsValue() {
	        const reader = this.reader;
	        const start = reader.x;
	        this.skipAny();
	        const end = reader.x;
	        return new JsonPackValue_1.JsonPackValue(reader.uint8.subarray(start, end));
	    }
	    // ----------------------------------------------- One level reading - object
	    readObjLevel(minor) {
	        const length = this.readMinorLen(minor);
	        if (length >= 0)
	            return this.readObjRawLevel(length);
	        else
	            return this.readObjIndefLevel();
	    }
	    readObjRawLevel(length) {
	        const obj = {};
	        for (let i = 0; i < length; i++) {
	            const key = this.key();
	            const value = this.readPrimitiveOrVal();
	            obj[key] = value;
	        }
	        return obj;
	    }
	    readObjIndefLevel() {
	        const obj = {};
	        while (this.reader.peak() !== 255 /* CONST.END */) {
	            const key = this.key();
	            if (this.reader.peak() === 255 /* CONST.END */)
	                throw 7 /* ERROR.UNEXPECTED_OBJ_BREAK */;
	            const value = this.readPrimitiveOrVal();
	            obj[key] = value;
	        }
	        this.reader.x++;
	        return obj;
	    }
	    // ------------------------------------------------ One level reading - array
	    readArrLevel(minor) {
	        const length = this.readMinorLen(minor);
	        if (length >= 0)
	            return this.readArrRawLevel(length);
	        return this.readArrIndefLevel();
	    }
	    readArrRawLevel(length) {
	        const arr = [];
	        for (let i = 0; i < length; i++)
	            arr.push(this.readPrimitiveOrVal());
	        return arr;
	    }
	    readArrIndefLevel() {
	        const arr = [];
	        while (this.reader.peak() !== 255 /* CONST.END */)
	            arr.push(this.readPrimitiveOrVal());
	        this.reader.x++;
	        return arr;
	    }
	    // ---------------------------------------------------------- Shallow reading
	    readHdr(expectedMajor) {
	        const octet = this.reader.u8();
	        const major = octet >> 5;
	        if (major !== expectedMajor)
	            throw 0 /* ERROR.UNEXPECTED_MAJOR */;
	        const minor = octet & 31 /* CONST.MINOR_MASK */;
	        if (minor < 24)
	            return minor;
	        switch (minor) {
	            case 24:
	                return this.reader.u8();
	            case 25:
	                return this.reader.u16();
	            case 26:
	                return this.reader.u32();
	            case 27:
	                return Number(this.reader.u64());
	            case 31:
	                return -1;
	        }
	        throw 1 /* ERROR.UNEXPECTED_MINOR */;
	    }
	    readStrHdr() {
	        return this.readHdr(3 /* MAJOR.STR */);
	    }
	    readObjHdr() {
	        return this.readHdr(5 /* MAJOR.MAP */);
	    }
	    readArrHdr() {
	        return this.readHdr(4 /* MAJOR.ARR */);
	    }
	    findKey(key) {
	        const size = this.readObjHdr();
	        for (let i = 0; i < size; i++) {
	            const k = this.key();
	            if (k === key)
	                return this;
	            this.skipAny();
	        }
	        throw 9 /* ERROR.KEY_NOT_FOUND */;
	    }
	    findIndex(index) {
	        const size = this.readArrHdr();
	        if (index >= size)
	            throw 10 /* ERROR.INDEX_OUT_OF_BOUNDS */;
	        for (let i = 0; i < index; i++)
	            this.skipAny();
	        return this;
	    }
	    find(path) {
	        for (let i = 0; i < path.length; i++) {
	            const segment = path[i];
	            if (typeof segment === 'string')
	                this.findKey(segment);
	            else
	                this.findIndex(segment);
	        }
	        return this;
	    }
	};
	CborDecoder.CborDecoder = CborDecoder$1;
	
	return CborDecoder;
}

var async = {};

var hasRequiredAsync;

function requireAsync () {
	if (hasRequiredAsync) return async;
	hasRequiredAsync = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.fromSnapshot = exports.toSnapshot = void 0;
		const shared_1 = requireShared();
		const toSnapshot = async ({ fs, path = '/', separator = '/' }) => {
		    const stats = await fs.lstat(path);
		    if (stats.isDirectory()) {
		        const list = await fs.readdir(path);
		        const entries = {};
		        const dir = path.endsWith(separator) ? path : path + separator;
		        const snapshots = await Promise.all(list.map(child => (0, exports.toSnapshot)({ fs, path: `${dir}${child}`, separator })));
		        for (let i = 0; i < list.length; i++) {
		            if (snapshots[i])
		                entries['' + list[i]] = snapshots[i];
		        }
		        return [0 /* SnapshotNodeType.Folder */, {}, entries];
		    }
		    else if (stats.isFile()) {
		        const buf = (await fs.readFile(path));
		        const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
		        return [1 /* SnapshotNodeType.File */, {}, uint8];
		    }
		    else if (stats.isSymbolicLink()) {
		        return [
		            2 /* SnapshotNodeType.Symlink */,
		            {
		                target: (await fs.readlink(path, { encoding: 'utf8' })),
		            },
		        ];
		    }
		    return null;
		};
		exports.toSnapshot = toSnapshot;
		const fromSnapshot = async (snapshot, { fs, path = '/', separator = '/' }) => {
		    if (!snapshot)
		        return;
		    switch (snapshot[0]) {
		        case 0 /* SnapshotNodeType.Folder */: {
		            if (!path.endsWith(separator))
		                path = path + separator;
		            const [, , entries] = snapshot;
		            await fs.mkdir(path, { recursive: true });
		            for (const [name, child] of Object.entries(entries)) {
		                (0, shared_1.validateEntryName)(name);
		                await (0, exports.fromSnapshot)(child, { fs, path: `${path}${name}`, separator });
		            }
		            break;
		        }
		        case 1 /* SnapshotNodeType.File */: {
		            const [, , data] = snapshot;
		            await fs.writeFile(path, data);
		            break;
		        }
		        case 2 /* SnapshotNodeType.Symlink */: {
		            const [, { target }] = snapshot;
		            await fs.symlink(target, path);
		            break;
		        }
		    }
		};
		exports.fromSnapshot = fromSnapshot;
		
	} (async));
	return async;
}

var hasRequiredBinary;

function requireBinary () {
	if (hasRequiredBinary) return binary;
	hasRequiredBinary = 1;
	Object.defineProperty(binary, "__esModule", { value: true });
	binary.fromBinarySnapshot = binary.toBinarySnapshot = binary.fromBinarySnapshotSync = binary.toBinarySnapshotSync = void 0;
	const CborEncoder_1 = requireCborEncoder();
	const CborDecoder_1 = requireCborDecoder();
	const sync_1 = requireSync();
	const async_1 = requireAsync();
	const shared_1 = requireShared();
	const encoder = new CborEncoder_1.CborEncoder(shared_1.writer);
	const decoder = new CborDecoder_1.CborDecoder();
	const toBinarySnapshotSync = (options) => {
	    const snapshot = (0, sync_1.toSnapshotSync)(options);
	    return encoder.encode(snapshot);
	};
	binary.toBinarySnapshotSync = toBinarySnapshotSync;
	const fromBinarySnapshotSync = (uint8, options) => {
	    const snapshot = decoder.decode(uint8);
	    (0, sync_1.fromSnapshotSync)(snapshot, options);
	};
	binary.fromBinarySnapshotSync = fromBinarySnapshotSync;
	const toBinarySnapshot = async (options) => {
	    const snapshot = await (0, async_1.toSnapshot)(options);
	    return encoder.encode(snapshot);
	};
	binary.toBinarySnapshot = toBinarySnapshot;
	const fromBinarySnapshot = async (uint8, options) => {
	    const snapshot = decoder.decode(uint8);
	    await (0, async_1.fromSnapshot)(snapshot, options);
	};
	binary.fromBinarySnapshot = fromBinarySnapshot;
	
	return binary;
}

var json = {};

var JsonEncoder = {};

var toBase64Bin = {};

var createToBase64Bin = {};

var constants = {};

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;
	Object.defineProperty(constants, "__esModule", { value: true });
	constants.hasBuffer = constants.alphabet = void 0;
	constants.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	constants.hasBuffer = typeof Buffer === 'function' && typeof Buffer.from === 'function';
	
	return constants;
}

var hasRequiredCreateToBase64Bin;

function requireCreateToBase64Bin () {
	if (hasRequiredCreateToBase64Bin) return createToBase64Bin;
	hasRequiredCreateToBase64Bin = 1;
	Object.defineProperty(createToBase64Bin, "__esModule", { value: true });
	createToBase64Bin.createToBase64Bin = void 0;
	const constants_1 = requireConstants();
	const createToBase64Bin$1 = (chars = constants_1.alphabet, pad = '=') => {
	    if (chars.length !== 64)
	        throw new Error('chars must be 64 characters long');
	    const table = chars.split('').map((c) => c.charCodeAt(0));
	    const table2 = [];
	    for (const c1 of table) {
	        for (const c2 of table) {
	            const two = (c1 << 8) + c2;
	            table2.push(two);
	        }
	    }
	    const doAddPadding = pad.length === 1;
	    const E = doAddPadding ? pad.charCodeAt(0) : 0;
	    const EE = doAddPadding ? (E << 8) | E : 0;
	    return (uint8, start, length, dest, offset) => {
	        const extraLength = length % 3;
	        const baseLength = length - extraLength;
	        for (; start < baseLength; start += 3) {
	            const o1 = uint8[start];
	            const o2 = uint8[start + 1];
	            const o3 = uint8[start + 2];
	            const v1 = (o1 << 4) | (o2 >> 4);
	            const v2 = ((o2 & 0b1111) << 8) | o3;
	            dest.setInt32(offset, (table2[v1] << 16) + table2[v2]);
	            offset += 4;
	        }
	        if (extraLength === 1) {
	            const o1 = uint8[baseLength];
	            if (doAddPadding) {
	                dest.setInt32(offset, (table2[o1 << 4] << 16) + EE);
	                offset += 4;
	            }
	            else {
	                dest.setInt16(offset, table2[o1 << 4]);
	                offset += 2;
	            }
	        }
	        else if (extraLength) {
	            const o1 = uint8[baseLength];
	            const o2 = uint8[baseLength + 1];
	            const v1 = (o1 << 4) | (o2 >> 4);
	            const v2 = (o2 & 0b1111) << 2;
	            if (doAddPadding) {
	                dest.setInt32(offset, (table2[v1] << 16) + (table[v2] << 8) + E);
	                offset += 4;
	            }
	            else {
	                dest.setInt16(offset, table2[v1]);
	                offset += 2;
	                dest.setInt8(offset, table[v2]);
	                offset += 1;
	            }
	        }
	        return offset;
	    };
	};
	createToBase64Bin.createToBase64Bin = createToBase64Bin$1;
	
	return createToBase64Bin;
}

var hasRequiredToBase64Bin;

function requireToBase64Bin () {
	if (hasRequiredToBase64Bin) return toBase64Bin;
	hasRequiredToBase64Bin = 1;
	Object.defineProperty(toBase64Bin, "__esModule", { value: true });
	toBase64Bin.toBase64Bin = void 0;
	const createToBase64Bin_1 = requireCreateToBase64Bin();
	toBase64Bin.toBase64Bin = (0, createToBase64Bin_1.createToBase64Bin)();
	
	return toBase64Bin;
}

var hasRequiredJsonEncoder;

function requireJsonEncoder () {
	if (hasRequiredJsonEncoder) return JsonEncoder;
	hasRequiredJsonEncoder = 1;
	Object.defineProperty(JsonEncoder, "__esModule", { value: true });
	JsonEncoder.JsonEncoder = void 0;
	const toBase64Bin_1 = requireToBase64Bin();
	let JsonEncoder$1 = class JsonEncoder {
	    constructor(writer) {
	        this.writer = writer;
	    }
	    encode(value) {
	        const writer = this.writer;
	        writer.reset();
	        this.writeAny(value);
	        return writer.flush();
	    }
	    /**
	     * Called when the encoder encounters a value that it does not know how to encode.
	     *
	     * @param value Some JavaScript value.
	     */
	    writeUnknown(value) {
	        this.writeNull();
	    }
	    writeAny(value) {
	        switch (typeof value) {
	            case 'boolean':
	                return this.writeBoolean(value);
	            case 'number':
	                return this.writeNumber(value);
	            case 'string':
	                return this.writeStr(value);
	            case 'object': {
	                if (value === null)
	                    return this.writeNull();
	                const constr = value.constructor;
	                switch (constr) {
	                    case Object:
	                        return this.writeObj(value);
	                    case Array:
	                        return this.writeArr(value);
	                    case Uint8Array:
	                        return this.writeBin(value);
	                    default:
	                        if (value instanceof Uint8Array)
	                            return this.writeBin(value);
	                        if (Array.isArray(value))
	                            return this.writeArr(value);
	                        return this.writeUnknown(value);
	                }
	            }
	            case 'undefined': {
	                return this.writeUndef();
	            }
	            default:
	                return this.writeUnknown(value);
	        }
	    }
	    writeNull() {
	        this.writer.u32(0x6e756c6c); // null
	    }
	    writeUndef() {
	        const writer = this.writer;
	        const length = 35;
	        writer.ensureCapacity(length);
	        // Write: "data:application/cbor,base64;9w=="
	        const view = writer.view;
	        let x = writer.x;
	        view.setUint32(x, 577003892); // "dat
	        x += 4;
	        view.setUint32(x, 1631215984); // a:ap
	        x += 4;
	        view.setUint32(x, 1886153059); // plic
	        x += 4;
	        view.setUint32(x, 1635019119); // atio
	        x += 4;
	        view.setUint32(x, 1848599394); // n/cb
	        x += 4;
	        view.setUint32(x, 1869753442); // or,b
	        x += 4;
	        view.setUint32(x, 1634952502); // ase6
	        x += 4;
	        view.setUint32(x, 876296567); // 4;9w
	        x += 4;
	        view.setUint16(x, 15677); // ==
	        x += 2;
	        writer.uint8[x++] = 0x22; // "
	        writer.x = x;
	    }
	    writeBoolean(bool) {
	        if (bool)
	            this.writer.u32(0x74727565); // true
	        else
	            this.writer.u8u32(0x66, 0x616c7365); // false
	    }
	    writeNumber(num) {
	        const str = num.toString();
	        this.writer.ascii(str);
	    }
	    writeInteger(int) {
	        this.writeNumber(int >> 0 === int ? int : Math.trunc(int));
	    }
	    writeUInteger(uint) {
	        this.writeInteger(uint < 0 ? -uint : uint);
	    }
	    writeFloat(float) {
	        this.writeNumber(float);
	    }
	    writeBin(buf) {
	        const writer = this.writer;
	        const length = buf.length;
	        writer.ensureCapacity(38 + 3 + (length << 1));
	        // Write: "data:application/octet-stream;base64, - 22 64 61 74 61 3a 61 70 70 6c 69 63 61 74 69 6f 6e 2f 6f 63 74 65 74 2d 73 74 72 65 61 6d 3b 62 61 73 65 36 34 2c
	        const view = writer.view;
	        let x = writer.x;
	        view.setUint32(x, 577003892); // "dat
	        x += 4;
	        view.setUint32(x, 1631215984); // a:ap
	        x += 4;
	        view.setUint32(x, 1886153059); // plic
	        x += 4;
	        view.setUint32(x, 1635019119); // atio
	        x += 4;
	        view.setUint32(x, 1848602467); // n/oc
	        x += 4;
	        view.setUint32(x, 1952805933); // tet-
	        x += 4;
	        view.setUint32(x, 1937011301); // stre
	        x += 4;
	        view.setUint32(x, 1634548578); // am;b
	        x += 4;
	        view.setUint32(x, 1634952502); // ase6
	        x += 4;
	        view.setUint16(x, 13356); // 4,
	        x += 2;
	        x = (0, toBase64Bin_1.toBase64Bin)(buf, 0, length, view, x);
	        writer.uint8[x++] = 0x22; // "
	        writer.x = x;
	    }
	    writeStr(str) {
	        const writer = this.writer;
	        const length = str.length;
	        writer.ensureCapacity(length * 4 + 2);
	        if (length < 256) {
	            const startX = writer.x;
	            let x = startX;
	            const uint8 = writer.uint8;
	            uint8[x++] = 0x22; // "
	            for (let i = 0; i < length; i++) {
	                const code = str.charCodeAt(i);
	                switch (code) {
	                    case 34: // "
	                    case 92: // \
	                        uint8[x++] = 0x5c; // \
	                        break;
	                }
	                if (code < 32 || code > 126) {
	                    writer.x = startX;
	                    const jsonStr = JSON.stringify(str);
	                    writer.ensureCapacity(jsonStr.length * 4 + 4);
	                    writer.utf8(jsonStr);
	                    return;
	                }
	                else
	                    uint8[x++] = code;
	            }
	            uint8[x++] = 0x22; // "
	            writer.x = x;
	            return;
	        }
	        const jsonStr = JSON.stringify(str);
	        writer.ensureCapacity(jsonStr.length * 4 + 4);
	        writer.utf8(jsonStr);
	    }
	    writeAsciiStr(str) {
	        const length = str.length;
	        const writer = this.writer;
	        writer.ensureCapacity(length * 2 + 2);
	        const uint8 = writer.uint8;
	        let x = writer.x;
	        uint8[x++] = 0x22; // "
	        for (let i = 0; i < length; i++) {
	            const code = str.charCodeAt(i);
	            switch (code) {
	                case 34: // "
	                case 92: // \
	                    uint8[x++] = 0x5c; // \
	                    break;
	            }
	            uint8[x++] = code;
	        }
	        uint8[x++] = 0x22; // "
	        writer.x = x;
	    }
	    writeArr(arr) {
	        const writer = this.writer;
	        writer.u8(0x5b); // [
	        const length = arr.length;
	        const last = length - 1;
	        for (let i = 0; i < last; i++) {
	            this.writeAny(arr[i]);
	            writer.u8(0x2c); // ,
	        }
	        if (last >= 0)
	            this.writeAny(arr[last]);
	        writer.u8(0x5d); // ]
	    }
	    writeArrSeparator() {
	        this.writer.u8(0x2c); // ,
	    }
	    writeObj(obj) {
	        const writer = this.writer;
	        const keys = Object.keys(obj);
	        const length = keys.length;
	        if (!length)
	            return writer.u16(0x7b7d); // {}
	        writer.u8(0x7b); // {
	        for (let i = 0; i < length; i++) {
	            const key = keys[i];
	            const value = obj[key];
	            this.writeStr(key);
	            writer.u8(0x3a); // :
	            this.writeAny(value);
	            writer.u8(0x2c); // ,
	        }
	        writer.uint8[writer.x - 1] = 0x7d; // }
	    }
	    writeObjSeparator() {
	        this.writer.u8(0x2c); // ,
	    }
	    writeObjKeySeparator() {
	        this.writer.u8(0x3a); // :
	    }
	    // ------------------------------------------------------- Streaming encoding
	    writeStartStr() {
	        throw new Error('Method not implemented.');
	    }
	    writeStrChunk(str) {
	        throw new Error('Method not implemented.');
	    }
	    writeEndStr() {
	        throw new Error('Method not implemented.');
	    }
	    writeStartBin() {
	        throw new Error('Method not implemented.');
	    }
	    writeBinChunk(buf) {
	        throw new Error('Method not implemented.');
	    }
	    writeEndBin() {
	        throw new Error('Method not implemented.');
	    }
	    writeStartArr() {
	        this.writer.u8(0x5b); // [
	    }
	    writeArrChunk(item) {
	        throw new Error('Method not implemented.');
	    }
	    writeEndArr() {
	        this.writer.u8(0x5d); // ]
	    }
	    writeStartObj() {
	        this.writer.u8(0x7b); // {
	    }
	    writeObjChunk(key, value) {
	        throw new Error('Method not implemented.');
	    }
	    writeEndObj() {
	        this.writer.u8(0x7d); // }
	    }
	};
	JsonEncoder.JsonEncoder = JsonEncoder$1;
	
	return JsonEncoder;
}

var JsonDecoder = {};

var fromBase64Bin = {};

var createFromBase64Bin = {};

var hasRequiredCreateFromBase64Bin;

function requireCreateFromBase64Bin () {
	if (hasRequiredCreateFromBase64Bin) return createFromBase64Bin;
	hasRequiredCreateFromBase64Bin = 1;
	Object.defineProperty(createFromBase64Bin, "__esModule", { value: true });
	createFromBase64Bin.createFromBase64Bin = void 0;
	const constants_1 = requireConstants();
	const createFromBase64Bin$1 = (chars = constants_1.alphabet, pad = '=') => {
	    if (chars.length !== 64)
	        throw new Error('chars must be 64 characters long');
	    let max = 0;
	    for (let i = 0; i < chars.length; i++)
	        max = Math.max(max, chars.charCodeAt(i));
	    const table = [];
	    for (let i = 0; i <= max; i += 1)
	        table[i] = -1;
	    for (let i = 0; i < chars.length; i++)
	        table[chars.charCodeAt(i)] = i;
	    const doExpectPadding = pad.length === 1;
	    const PAD = doExpectPadding ? pad.charCodeAt(0) : 0;
	    return (view, offset, length) => {
	        if (!length)
	            return new Uint8Array(0);
	        let padding = 0;
	        if (length % 4 !== 0) {
	            padding = 4 - (length % 4);
	            length += padding;
	        }
	        else {
	            const end = offset + length;
	            const last = end - 1;
	            if (view.getUint8(last) === PAD) {
	                padding = 1;
	                if (length > 1 && view.getUint8(last - 1) === PAD)
	                    padding = 2;
	            }
	        }
	        if (length % 4 !== 0)
	            throw new Error('Base64 string length must be a multiple of 4');
	        const mainEnd = offset + length - (padding ? 4 : 0);
	        const bufferLength = (length >> 2) * 3 - padding;
	        const buf = new Uint8Array(bufferLength);
	        let j = 0;
	        let i = offset;
	        for (; i < mainEnd; i += 4) {
	            const word = view.getUint32(i);
	            const octet0 = word >>> 24;
	            const octet1 = (word >>> 16) & 0xff;
	            const octet2 = (word >>> 8) & 0xff;
	            const octet3 = word & 0xff;
	            const sextet0 = table[octet0];
	            const sextet1 = table[octet1];
	            const sextet2 = table[octet2];
	            const sextet3 = table[octet3];
	            if (sextet0 < 0 || sextet1 < 0 || sextet2 < 0 || sextet3 < 0)
	                throw new Error('INVALID_BASE64_SEQ');
	            buf[j] = (sextet0 << 2) | (sextet1 >> 4);
	            buf[j + 1] = (sextet1 << 4) | (sextet2 >> 2);
	            buf[j + 2] = (sextet2 << 6) | sextet3;
	            j += 3;
	        }
	        if (!padding)
	            return buf;
	        if (padding === 1) {
	            const word = view.getUint16(mainEnd);
	            const octet0 = word >> 8;
	            const octet1 = word & 0xff;
	            const octet2 = view.getUint8(mainEnd + 2);
	            const sextet0 = table[octet0];
	            const sextet1 = table[octet1];
	            const sextet2 = table[octet2];
	            if (sextet0 < 0 || sextet1 < 0 || sextet2 < 0)
	                throw new Error('INVALID_BASE64_SEQ');
	            buf[j] = (sextet0 << 2) | (sextet1 >> 4);
	            buf[j + 1] = (sextet1 << 4) | (sextet2 >> 2);
	            return buf;
	        }
	        const word = view.getUint16(mainEnd);
	        const octet0 = word >> 8;
	        const octet1 = word & 0xff;
	        const sextet0 = table[octet0];
	        const sextet1 = table[octet1];
	        if (sextet0 < 0 || sextet1 < 0)
	            throw new Error('INVALID_BASE64_SEQ');
	        buf[j] = (sextet0 << 2) | (sextet1 >> 4);
	        return buf;
	    };
	};
	createFromBase64Bin.createFromBase64Bin = createFromBase64Bin$1;
	
	return createFromBase64Bin;
}

var hasRequiredFromBase64Bin;

function requireFromBase64Bin () {
	if (hasRequiredFromBase64Bin) return fromBase64Bin;
	hasRequiredFromBase64Bin = 1;
	Object.defineProperty(fromBase64Bin, "__esModule", { value: true });
	fromBase64Bin.fromBase64Bin = void 0;
	const createFromBase64Bin_1 = requireCreateFromBase64Bin();
	fromBase64Bin.fromBase64Bin = (0, createFromBase64Bin_1.createFromBase64Bin)();
	
	return fromBase64Bin;
}

var util = {};

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	Object.defineProperty(util, "__esModule", { value: true });
	util.findEndingQuote = void 0;
	const findEndingQuote = (uint8, x) => {
	    const len = uint8.length;
	    let char = uint8[x];
	    let prev = 0;
	    while (x < len) {
	        if (char === 34 && prev !== 92)
	            break;
	        if (char === 92 && prev === 92)
	            prev = 0;
	        else
	            prev = char;
	        char = uint8[++x];
	    }
	    if (x === len)
	        throw new Error('Invalid JSON');
	    return x;
	};
	util.findEndingQuote = findEndingQuote;
	
	return util;
}

var hasRequiredJsonDecoder;

function requireJsonDecoder () {
	if (hasRequiredJsonDecoder) return JsonDecoder;
	hasRequiredJsonDecoder = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.JsonDecoder = exports.readKey = void 0;
		const decodeUtf8_1 = requireDecodeUtf8();
		const Reader_1 = requireReader();
		const fromBase64Bin_1 = requireFromBase64Bin();
		const util_1 = requireUtil();
		const REGEX_REPLACE_ESCAPED_CHARS = /\\(b|f|n|r|t|"|\/|\\)/g;
		const escapedCharReplacer = (char) => {
		    switch (char) {
		        case '\\b':
		            return '\b';
		        case '\\f':
		            return '\f';
		        case '\\n':
		            return '\n';
		        case '\\r':
		            return '\r';
		        case '\\t':
		            return '\t';
		        case '\\"':
		            return '"';
		        case '\\/':
		            return '/';
		        case '\\\\':
		            return '\\';
		    }
		    return char;
		};
		// Starts with data:application/octet-stream;base64, - 64 61 74 61 3a 61 70 70 6c 69 63 61 74 69 6f 6e 2f 6f 63 74 65 74 2d 73 74 72 65 61 6d 3b 62 61 73 65 36 34 2c
		const hasBinaryPrefix = (u8, x) => u8[x] === 0x64 &&
		    u8[x + 1] === 0x61 &&
		    u8[x + 2] === 0x74 &&
		    u8[x + 3] === 0x61 &&
		    u8[x + 4] === 0x3a &&
		    u8[x + 5] === 0x61 &&
		    u8[x + 6] === 0x70 &&
		    u8[x + 7] === 0x70 &&
		    u8[x + 8] === 0x6c &&
		    u8[x + 9] === 0x69 &&
		    u8[x + 10] === 0x63 &&
		    u8[x + 11] === 0x61 &&
		    u8[x + 12] === 0x74 &&
		    u8[x + 13] === 0x69 &&
		    u8[x + 14] === 0x6f &&
		    u8[x + 15] === 0x6e &&
		    u8[x + 16] === 0x2f &&
		    u8[x + 17] === 0x6f &&
		    u8[x + 18] === 0x63 &&
		    u8[x + 19] === 0x74 &&
		    u8[x + 20] === 0x65 &&
		    u8[x + 21] === 0x74 &&
		    u8[x + 22] === 0x2d &&
		    u8[x + 23] === 0x73 &&
		    u8[x + 24] === 0x74 &&
		    u8[x + 25] === 0x72 &&
		    u8[x + 26] === 0x65 &&
		    u8[x + 27] === 0x61 &&
		    u8[x + 28] === 0x6d &&
		    u8[x + 29] === 0x3b &&
		    u8[x + 30] === 0x62 &&
		    u8[x + 31] === 0x61 &&
		    u8[x + 32] === 0x73 &&
		    u8[x + 33] === 0x65 &&
		    u8[x + 34] === 0x36 &&
		    u8[x + 35] === 0x34 &&
		    u8[x + 36] === 0x2c;
		// Matches "data:application/cbor,base64;9w=="
		const isUndefined = (u8, x) => 
		// u8[x++] === 0x22 &&  // "
		// u8[x++] === 0x64 &&  // d
		u8[x++] === 0x61 && // a
		    u8[x++] === 0x74 && // t
		    u8[x++] === 0x61 && // a
		    u8[x++] === 0x3a && // :
		    u8[x++] === 0x61 && // a
		    u8[x++] === 0x70 && // p
		    u8[x++] === 0x70 && // p
		    u8[x++] === 0x6c && // l
		    u8[x++] === 0x69 && // i
		    u8[x++] === 0x63 && // c
		    u8[x++] === 0x61 && // a
		    u8[x++] === 0x74 && // t
		    u8[x++] === 0x69 && // i
		    u8[x++] === 0x6f && // o
		    u8[x++] === 0x6e && // n
		    u8[x++] === 0x2f && // /
		    u8[x++] === 0x63 && // c
		    u8[x++] === 0x62 && // b
		    u8[x++] === 0x6f && // o
		    u8[x++] === 0x72 && // r
		    u8[x++] === 0x2c && // ,
		    u8[x++] === 0x62 && // b
		    u8[x++] === 0x61 && // a
		    u8[x++] === 0x73 && // s
		    u8[x++] === 0x65 && // e
		    u8[x++] === 0x36 && // 6
		    u8[x++] === 0x34 && // 4
		    u8[x++] === 0x3b && // ;
		    u8[x++] === 0x39 && // 9
		    u8[x++] === 0x77 && // w
		    u8[x++] === 0x3d && // =
		    u8[x++] === 0x3d && // =
		    u8[x++] === 0x22; // "
		const fromCharCode = String.fromCharCode;
		const readKey = (reader) => {
		    const buf = reader.uint8;
		    const len = buf.length;
		    const points = [];
		    let x = reader.x;
		    let prev = 0;
		    while (x < len) {
		        let code = buf[x++];
		        if ((code & 0x80) === 0) {
		            if (prev === 92) {
		                switch (code) {
		                    case 98: // \b
		                        code = 8;
		                        break;
		                    case 102: // \f
		                        code = 12;
		                        break;
		                    case 110: // \n
		                        code = 10;
		                        break;
		                    case 114: // \r
		                        code = 13;
		                        break;
		                    case 116: // \t
		                        code = 9;
		                        break;
		                    case 34: // \"
		                        code = 34;
		                        break;
		                    case 47: // \/
		                        code = 47;
		                        break;
		                    case 92: // \\
		                        code = 92;
		                        break;
		                    default:
		                        throw new Error('Invalid JSON');
		                }
		                prev = 0;
		            }
		            else {
		                if (code === 34)
		                    break;
		                prev = code;
		                if (prev === 92)
		                    continue;
		            }
		        }
		        else {
		            const octet2 = buf[x++] & 0x3f;
		            if ((code & 0xe0) === 0xc0) {
		                code = ((code & 0x1f) << 6) | octet2;
		            }
		            else {
		                const octet3 = buf[x++] & 0x3f;
		                if ((code & 0xf0) === 0xe0) {
		                    code = ((code & 0x1f) << 12) | (octet2 << 6) | octet3;
		                }
		                else {
		                    if ((code & 0xf8) === 0xf0) {
		                        const octet4 = buf[x++] & 0x3f;
		                        let unit = ((code & 0x07) << 0x12) | (octet2 << 0x0c) | (octet3 << 0x06) | octet4;
		                        if (unit > 0xffff) {
		                            unit -= 0x10000;
		                            const unit0 = ((unit >>> 10) & 0x3ff) | 0xd800;
		                            unit = 0xdc00 | (unit & 0x3ff);
		                            points.push(unit0);
		                            code = unit;
		                        }
		                        else {
		                            code = unit;
		                        }
		                    }
		                }
		            }
		        }
		        points.push(code);
		    }
		    reader.x = x;
		    return fromCharCode.apply(String, points);
		};
		exports.readKey = readKey;
		class JsonDecoder {
		    constructor() {
		        this.reader = new Reader_1.Reader();
		    }
		    read(uint8) {
		        this.reader.reset(uint8);
		        return this.readAny();
		    }
		    decode(uint8) {
		        this.reader.reset(uint8);
		        return this.readAny();
		    }
		    readAny() {
		        this.skipWhitespace();
		        const reader = this.reader;
		        const x = reader.x;
		        const uint8 = reader.uint8;
		        const char = uint8[x];
		        switch (char) {
		            case 34 /* " */: {
		                if (uint8[x + 1] === 0x64 /* d */) {
		                    const bin = this.tryReadBin();
		                    if (bin)
		                        return bin;
		                    if (isUndefined(uint8, x + 2)) {
		                        reader.x = x + 35;
		                        return undefined;
		                    }
		                }
		                return this.readStr();
		            }
		            case 91 /* [ */:
		                return this.readArr();
		            case 102 /* f */:
		                return this.readFalse();
		            case 110 /* n */:
		                return this.readNull();
		            case 116 /* t */:
		                return this.readTrue();
		            case 123 /* { */:
		                return this.readObj();
		            default:
		                if ((char >= 48 /* 0 */ && char <= 57) /* 9 */ || char === 45 /* - */)
		                    return this.readNum();
		                throw new Error('Invalid JSON');
		        }
		    }
		    skipWhitespace() {
		        const reader = this.reader;
		        const uint8 = reader.uint8;
		        let x = reader.x;
		        let char = 0;
		        while (true) {
		            char = uint8[x];
		            switch (char) {
		                case 32 /* <space> */:
		                case 9 /* <tab> */:
		                case 10 /* <line feed> */:
		                case 13 /* <carriage return> */:
		                    x++;
		                    continue;
		                default:
		                    reader.x = x;
		                    return;
		            }
		        }
		    }
		    readNull() {
		        if (this.reader.u32() !== 0x6e756c6c /* null */)
		            throw new Error('Invalid JSON');
		        return null;
		    }
		    readTrue() {
		        if (this.reader.u32() !== 0x74727565 /* true */)
		            throw new Error('Invalid JSON');
		        return true;
		    }
		    readFalse() {
		        const reader = this.reader;
		        if (reader.u8() !== 0x66 /* f */ || reader.u32() !== 0x616c7365 /* alse */)
		            throw new Error('Invalid JSON');
		        return false;
		    }
		    readBool() {
		        const reader = this.reader;
		        switch (reader.uint8[reader.x]) {
		            case 102 /* f */:
		                return this.readFalse();
		            case 116 /* t */:
		                return this.readTrue();
		            default:
		                throw new Error('Invalid JSON');
		        }
		    }
		    readNum() {
		        const reader = this.reader;
		        const uint8 = reader.uint8;
		        let x = reader.x;
		        let c = uint8[x++];
		        const c1 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c2 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c3 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c4 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c5 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c6 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c7 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c8 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c9 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c10 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c11 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c12 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c13 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c14 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c15 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c16 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c17 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c18 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c19 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c20 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c21 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c22 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c23 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        const c24 = c;
		        c = uint8[x++];
		        if (!c || ((c < 45 || c > 57) && c !== 43 && c !== 69 && c !== 101)) {
		            reader.x = x - 1;
		            const num = +fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24);
		            if (num !== num)
		                throw new Error('Invalid JSON');
		            return num;
		        }
		        throw new Error('Invalid JSON');
		    }
		    readStr() {
		        const reader = this.reader;
		        const uint8 = reader.uint8;
		        const char = uint8[reader.x++];
		        if (char !== 0x22)
		            throw new Error('Invalid JSON');
		        const x0 = reader.x;
		        const x1 = (0, util_1.findEndingQuote)(uint8, x0);
		        let str = (0, decodeUtf8_1.decodeUtf8)(uint8, x0, x1 - x0);
		        /** @todo perf: maybe faster is to first check if there are any escaped chars. */
		        str = str.replace(REGEX_REPLACE_ESCAPED_CHARS, escapedCharReplacer);
		        reader.x = x1 + 1;
		        return str;
		    }
		    tryReadBin() {
		        const reader = this.reader;
		        const u8 = reader.uint8;
		        let x = reader.x;
		        if (u8[x++] !== 0x22)
		            return undefined;
		        const hasDataUrlPrefix = hasBinaryPrefix(u8, x);
		        if (!hasDataUrlPrefix)
		            return undefined;
		        x += 37;
		        const x0 = x;
		        x = (0, util_1.findEndingQuote)(u8, x);
		        reader.x = x0;
		        const bin = (0, fromBase64Bin_1.fromBase64Bin)(reader.view, x0, x - x0);
		        reader.x = x + 1;
		        return bin;
		    }
		    readBin() {
		        const reader = this.reader;
		        const u8 = reader.uint8;
		        let x = reader.x;
		        if (u8[x++] !== 0x22)
		            throw new Error('Invalid JSON');
		        const hasDataUrlPrefix = hasBinaryPrefix(u8, x);
		        if (!hasDataUrlPrefix)
		            throw new Error('Invalid JSON');
		        x += 37;
		        const x0 = x;
		        x = (0, util_1.findEndingQuote)(u8, x);
		        reader.x = x0;
		        const bin = (0, fromBase64Bin_1.fromBase64Bin)(reader.view, x0, x - x0);
		        reader.x = x + 1;
		        return bin;
		    }
		    readArr() {
		        const reader = this.reader;
		        if (reader.u8() !== 0x5b /* [ */)
		            throw new Error('Invalid JSON');
		        const arr = [];
		        const uint8 = reader.uint8;
		        let first = true;
		        while (true) {
		            this.skipWhitespace();
		            const char = uint8[reader.x];
		            if (char === 0x5d /* ] */)
		                return reader.x++, arr;
		            if (char === 0x2c /* , */)
		                reader.x++;
		            else if (!first)
		                throw new Error('Invalid JSON');
		            this.skipWhitespace();
		            arr.push(this.readAny());
		            first = false;
		        }
		    }
		    readObj() {
		        const reader = this.reader;
		        if (reader.u8() !== 0x7b /* { */)
		            throw new Error('Invalid JSON');
		        const obj = {};
		        const uint8 = reader.uint8;
		        let first = true;
		        while (true) {
		            this.skipWhitespace();
		            let char = uint8[reader.x];
		            if (char === 0x7d /* } */)
		                return reader.x++, obj;
		            if (char === 0x2c /* , */)
		                reader.x++;
		            else if (!first)
		                throw new Error('Invalid JSON');
		            this.skipWhitespace();
		            char = uint8[reader.x++];
		            if (char !== 0x22 /* " */)
		                throw new Error('Invalid JSON');
		            const key = (0, exports.readKey)(reader);
		            if (key === '__proto__')
		                throw new Error('Invalid JSON');
		            this.skipWhitespace();
		            if (reader.u8() !== 0x3a /* : */)
		                throw new Error('Invalid JSON');
		            this.skipWhitespace();
		            obj[key] = this.readAny();
		            first = false;
		        }
		    }
		}
		exports.JsonDecoder = JsonDecoder;
		
	} (JsonDecoder));
	return JsonDecoder;
}

var hasRequiredJson;

function requireJson () {
	if (hasRequiredJson) return json;
	hasRequiredJson = 1;
	Object.defineProperty(json, "__esModule", { value: true });
	json.fromJsonSnapshot = json.toJsonSnapshot = json.fromJsonSnapshotSync = json.toJsonSnapshotSync = void 0;
	const JsonEncoder_1 = requireJsonEncoder();
	const JsonDecoder_1 = requireJsonDecoder();
	const sync_1 = requireSync();
	const async_1 = requireAsync();
	const shared_1 = requireShared();
	const encoder = new JsonEncoder_1.JsonEncoder(shared_1.writer);
	const decoder = new JsonDecoder_1.JsonDecoder();
	const toJsonSnapshotSync = (options) => {
	    const snapshot = (0, sync_1.toSnapshotSync)(options);
	    return encoder.encode(snapshot);
	};
	json.toJsonSnapshotSync = toJsonSnapshotSync;
	const fromJsonSnapshotSync = (uint8, options) => {
	    const snapshot = decoder.read(uint8);
	    (0, sync_1.fromSnapshotSync)(snapshot, options);
	};
	json.fromJsonSnapshotSync = fromJsonSnapshotSync;
	const toJsonSnapshot = async (options) => {
	    const snapshot = await (0, async_1.toSnapshot)(options);
	    return encoder.encode(snapshot);
	};
	json.toJsonSnapshot = toJsonSnapshot;
	const fromJsonSnapshot = async (uint8, options) => {
	    const snapshot = decoder.read(uint8);
	    await (0, async_1.fromSnapshot)(snapshot, options);
	};
	json.fromJsonSnapshot = fromJsonSnapshot;
	
	return json;
}

var hasRequiredLib$2;

function requireLib$2 () {
	if (hasRequiredLib$2) return lib;
	hasRequiredLib$2 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		const tslib_1 = require$$0$2;
		tslib_1.__exportStar(requireConstants$1(), exports);
		tslib_1.__exportStar(requireSync(), exports);
		tslib_1.__exportStar(requireBinary(), exports);
		tslib_1.__exportStar(requireJson(), exports);
		
	} (lib));
	return lib;
}

var options = {};

var hasRequiredOptions;

function requireOptions () {
	if (hasRequiredOptions) return options;
	hasRequiredOptions = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.getWriteFileOptions = exports.writeFileDefaults = exports.getRealpathOptsAndCb = exports.getRealpathOptions = exports.getStatfsOptsAndCb = exports.getStatfsOptions = exports.getStatOptsAndCb = exports.getStatOptions = exports.getAppendFileOptsAndCb = exports.getAppendFileOpts = exports.getOpendirOptsAndCb = exports.getOpendirOptions = exports.getReaddirOptsAndCb = exports.getReaddirOptions = exports.getReadFileOptions = exports.getRmOptsAndCb = exports.getRmdirOptions = exports.getDefaultOptsAndCb = exports.getDefaultOpts = exports.optsDefaults = exports.getMkdirOptions = void 0;
		exports.getOptions = getOptions;
		exports.optsGenerator = optsGenerator;
		exports.optsAndCbGenerator = optsAndCbGenerator;
		const fs_node_utils_1 = requireLib$7();
		const util_1 = requireUtil$1();
		const mkdirDefaults = {
		    mode: 511 /* MODE.DIR */,
		    recursive: false,
		};
		const getMkdirOptions = (options) => {
		    if (typeof options === 'number')
		        return Object.assign({}, mkdirDefaults, { mode: options });
		    return Object.assign({}, mkdirDefaults, options);
		};
		exports.getMkdirOptions = getMkdirOptions;
		const ERRSTR_OPTS = tipeof => `Expected options to be either an object or a string, but got ${tipeof} instead`;
		function getOptions(defaults, options) {
		    let opts;
		    if (!options)
		        return defaults;
		    else {
		        const tipeof = typeof options;
		        switch (tipeof) {
		            case 'string':
		                opts = Object.assign({}, defaults, { encoding: options });
		                break;
		            case 'object':
		                opts = Object.assign({}, defaults, options);
		                break;
		            default:
		                throw TypeError(ERRSTR_OPTS(tipeof));
		        }
		    }
		    if (opts.encoding !== 'buffer')
		        (0, fs_node_utils_1.assertEncoding)(opts.encoding);
		    return opts;
		}
		function optsGenerator(defaults) {
		    return options => getOptions(defaults, options);
		}
		function optsAndCbGenerator(getOpts) {
		    return (options, callback) => typeof options === 'function' ? [getOpts(), options] : [getOpts(options), (0, util_1.validateCallback)(callback)];
		}
		exports.optsDefaults = {
		    encoding: 'utf8',
		};
		exports.getDefaultOpts = optsGenerator(exports.optsDefaults);
		exports.getDefaultOptsAndCb = optsAndCbGenerator(exports.getDefaultOpts);
		const rmdirDefaults = {
		    recursive: false,
		};
		const getRmdirOptions = (options) => {
		    return Object.assign({}, rmdirDefaults, options);
		};
		exports.getRmdirOptions = getRmdirOptions;
		const getRmOpts = optsGenerator(exports.optsDefaults);
		exports.getRmOptsAndCb = optsAndCbGenerator(getRmOpts);
		const readFileOptsDefaults = {
		    flag: 'r',
		};
		exports.getReadFileOptions = optsGenerator(readFileOptsDefaults);
		const readdirDefaults = {
		    encoding: 'utf8',
		    recursive: false,
		    withFileTypes: false,
		};
		exports.getReaddirOptions = optsGenerator(readdirDefaults);
		exports.getReaddirOptsAndCb = optsAndCbGenerator(exports.getReaddirOptions);
		const opendirDefaults = {
		    encoding: 'utf8',
		    bufferSize: 32,
		    recursive: false,
		};
		exports.getOpendirOptions = optsGenerator(opendirDefaults);
		exports.getOpendirOptsAndCb = optsAndCbGenerator(exports.getOpendirOptions);
		const appendFileDefaults = {
		    encoding: 'utf8',
		    mode: 438 /* MODE.DEFAULT */,
		    flag: fs_node_utils_1.FLAGS[fs_node_utils_1.FLAGS.a],
		};
		exports.getAppendFileOpts = optsGenerator(appendFileDefaults);
		exports.getAppendFileOptsAndCb = optsAndCbGenerator(exports.getAppendFileOpts);
		const statDefaults = {
		    bigint: false,
		};
		const getStatOptions = (options = {}) => Object.assign({}, statDefaults, options);
		exports.getStatOptions = getStatOptions;
		const getStatOptsAndCb = (options, callback) => typeof options === 'function' ? [(0, exports.getStatOptions)(), options] : [(0, exports.getStatOptions)(options), (0, util_1.validateCallback)(callback)];
		exports.getStatOptsAndCb = getStatOptsAndCb;
		const statfsDefaults = {
		    bigint: false,
		};
		const getStatfsOptions = (options = {}) => Object.assign({}, statfsDefaults, options);
		exports.getStatfsOptions = getStatfsOptions;
		const getStatfsOptsAndCb = (options, callback) => typeof options === 'function'
		    ? [(0, exports.getStatfsOptions)(), options]
		    : [(0, exports.getStatfsOptions)(options), (0, util_1.validateCallback)(callback)];
		exports.getStatfsOptsAndCb = getStatfsOptsAndCb;
		const realpathDefaults = exports.optsDefaults;
		exports.getRealpathOptions = optsGenerator(realpathDefaults);
		exports.getRealpathOptsAndCb = optsAndCbGenerator(exports.getRealpathOptions);
		exports.writeFileDefaults = {
		    encoding: 'utf8',
		    mode: 438 /* MODE.DEFAULT */,
		    flag: fs_node_utils_1.FLAGS[fs_node_utils_1.FLAGS.w],
		};
		exports.getWriteFileOptions = optsGenerator(exports.writeFileDefaults);
		
	} (options));
	return options;
}

var Dir = {};

var hasRequiredDir;

function requireDir () {
	if (hasRequiredDir) return Dir;
	hasRequiredDir = 1;
	Object.defineProperty(Dir, "__esModule", { value: true });
	Dir.Dir = void 0;
	const util_1 = requireUtil$1();
	const Dirent_1 = requireDirent();
	const errors = requireErrors$1();
	/**
	 * A directory stream, like `fs.Dir`.
	 */
	let Dir$1 = class Dir {
	    constructor(link, options) {
	        this.link = link;
	        this.options = options;
	        this.iteratorInfo = [];
	        this.closed = false;
	        this.operationQueue = null;
	        this.path = link.getPath();
	        this.iteratorInfo.push(link.children[Symbol.iterator]());
	    }
	    closeBase() {
	        // In a real filesystem implementation, this would close file descriptors
	        // For memfs, we just need to mark as closed
	    }
	    readBase(iteratorInfo) {
	        let done;
	        let value;
	        let name;
	        let link;
	        do {
	            do {
	                ({ done, value } = iteratorInfo[iteratorInfo.length - 1].next());
	                if (!done) {
	                    [name, link] = value;
	                }
	                else {
	                    break;
	                }
	            } while (name === '.' || name === '..');
	            if (done) {
	                iteratorInfo.pop();
	                if (iteratorInfo.length === 0) {
	                    break;
	                }
	                else {
	                    done = false;
	                }
	            }
	            else {
	                if (this.options.recursive && link.children.size) {
	                    iteratorInfo.push(link.children[Symbol.iterator]());
	                }
	                return Dirent_1.default.build(link, this.options.encoding);
	            }
	        } while (!done);
	        return null;
	    }
	    close(callback) {
	        // Promise-based close
	        if (callback === undefined) {
	            if (this.closed) {
	                return Promise.reject(new errors.Error('ERR_DIR_CLOSED'));
	            }
	            return new Promise((resolve, reject) => {
	                this.close(err => {
	                    if (err)
	                        reject(err);
	                    else
	                        resolve();
	                });
	            });
	        }
	        // Callback-based close
	        (0, util_1.validateCallback)(callback);
	        if (this.closed) {
	            process$1.nextTick(callback, new errors.Error('ERR_DIR_CLOSED'));
	            return;
	        }
	        if (this.operationQueue !== null) {
	            this.operationQueue.push(() => {
	                this.close(callback);
	            });
	            return;
	        }
	        this.closed = true;
	        try {
	            this.closeBase();
	            process$1.nextTick(callback);
	        }
	        catch (err) {
	            process$1.nextTick(callback, err);
	        }
	    }
	    closeSync() {
	        if (this.closed) {
	            throw new errors.Error('ERR_DIR_CLOSED');
	        }
	        if (this.operationQueue !== null) {
	            throw new errors.Error('ERR_DIR_CONCURRENT_OPERATION');
	        }
	        this.closed = true;
	        this.closeBase();
	    }
	    read(callback) {
	        // Promise-based read
	        if (callback === undefined) {
	            return new Promise((resolve, reject) => {
	                this.read((err, result) => {
	                    if (err)
	                        reject(err);
	                    else
	                        resolve(result ?? null);
	                });
	            });
	        }
	        // Callback-based read
	        (0, util_1.validateCallback)(callback);
	        if (this.closed) {
	            process$1.nextTick(callback, new errors.Error('ERR_DIR_CLOSED'));
	            return;
	        }
	        if (this.operationQueue !== null) {
	            this.operationQueue.push(() => {
	                this.read(callback);
	            });
	            return;
	        }
	        this.operationQueue = [];
	        try {
	            const result = this.readBase(this.iteratorInfo);
	            process$1.nextTick(() => {
	                const queue = this.operationQueue;
	                this.operationQueue = null;
	                for (const op of queue)
	                    op();
	                callback(null, result);
	            });
	        }
	        catch (err) {
	            process$1.nextTick(() => {
	                const queue = this.operationQueue;
	                this.operationQueue = null;
	                for (const op of queue)
	                    op();
	                callback(err);
	            });
	        }
	    }
	    readSync() {
	        if (this.closed) {
	            throw new errors.Error('ERR_DIR_CLOSED');
	        }
	        if (this.operationQueue !== null) {
	            throw new errors.Error('ERR_DIR_CONCURRENT_OPERATION');
	        }
	        return this.readBase(this.iteratorInfo);
	    }
	    [Symbol.asyncIterator]() {
	        return {
	            next: async () => {
	                try {
	                    const dirEnt = await this.read();
	                    if (dirEnt !== null) {
	                        return { done: false, value: dirEnt };
	                    }
	                    else {
	                        return { done: true, value: undefined };
	                    }
	                }
	                catch (err) {
	                    throw err;
	                }
	            },
	            [Symbol.asyncIterator]() {
	                return this;
	            },
	        };
	    }
	    [Symbol.asyncDispose]() {
	        return this.close();
	    }
	    [Symbol.dispose]() {
	        this.closeSync();
	    }
	};
	Dir.Dir = Dir$1;
	
	return Dir;
}

var glob = {};

var hasRequiredGlob;

function requireGlob () {
	if (hasRequiredGlob) return glob;
	hasRequiredGlob = 1;
	Object.defineProperty(glob, "__esModule", { value: true });
	glob.globSync = globSync;
	const path_1 = requirePath$1();
	const glob_to_regex_js_1 = requireLib$8();
	const util_1 = requireUtil$1();
	const pathJoin = path_1.posix.join;
	const pathRelative = path_1.posix.relative;
	const pathResolve = path_1.posix.resolve;
	/**
	 * Check if a path matches a glob pattern
	 */
	function matchesPattern(path, pattern) {
	    const regex = (0, glob_to_regex_js_1.toRegex)(pattern);
	    return regex.test(path);
	}
	/**
	 * Check if a path should be excluded based on exclude patterns
	 */
	function isExcluded(path, exclude) {
	    if (!exclude)
	        return false;
	    if (typeof exclude === 'function') {
	        return exclude(path);
	    }
	    const patterns = Array.isArray(exclude) ? exclude : [exclude];
	    return patterns.some(pattern => matchesPattern(path, pattern));
	}
	/**
	 * Walk directory tree and collect matching paths
	 */
	function walkDirectory(fs, dir, patterns, options, currentDepth = 0) {
	    const results = [];
	    const maxDepth = options.maxdepth ?? Infinity;
	    const baseCwd = options.cwd ? (0, util_1.pathToFilename)(options.cwd) : process$1.cwd();
	    if (currentDepth > maxDepth) {
	        return results;
	    }
	    try {
	        const entries = fs.readdirSync(dir, { withFileTypes: true });
	        for (const entry of entries) {
	            const fullPath = pathJoin(dir, entry.name.toString());
	            const relativePath = pathRelative(baseCwd, fullPath);
	            // Skip if excluded
	            if (isExcluded(relativePath, options.exclude)) {
	                continue;
	            }
	            // Check if this path matches any pattern
	            const matches = patterns.some(pattern => matchesPattern(relativePath, pattern));
	            if (matches) {
	                results.push(relativePath);
	            }
	            // Recurse into directories
	            if (entry.isDirectory() && currentDepth < maxDepth) {
	                const subResults = walkDirectory(fs, fullPath, patterns, options, currentDepth + 1);
	                results.push(...subResults);
	            }
	        }
	    }
	    catch (err) {
	        // Skip directories we can't read
	    }
	    return results;
	}
	/**
	 * Main glob implementation
	 */
	function globSync(fs, pattern, options = {}) {
	    const cwd = options.cwd ? (0, util_1.pathToFilename)(options.cwd) : process$1.cwd();
	    const resolvedCwd = pathResolve(cwd);
	    const globOptions = {
	        cwd: resolvedCwd,
	        exclude: options.exclude,
	        maxdepth: options.maxdepth,
	        withFileTypes: options.withFileTypes || false,
	    };
	    let results = [];
	    // Handle absolute patterns
	    if (path_1.posix.isAbsolute(pattern)) {
	        const dir = path_1.posix.dirname(pattern);
	        const patternBasename = path_1.posix.basename(pattern);
	        const dirResults = walkDirectory(fs, dir, [patternBasename], { ...globOptions, cwd: dir });
	        results.push(...dirResults.map(r => path_1.posix.resolve(dir, r)));
	    }
	    else {
	        // Handle relative patterns - normalize by stripping leading './'
	        const normalizedPattern = pattern.replace(/^\.\//, '');
	        const dirResults = walkDirectory(fs, resolvedCwd, [normalizedPattern], globOptions);
	        results.push(...dirResults);
	    }
	    // Remove duplicates and sort
	    results = [...new Set(results)].sort();
	    return results;
	}
	
	return glob;
}

var hasRequiredVolume;

function requireVolume () {
	if (hasRequiredVolume) return volume;
	hasRequiredVolume = 1;
	Object.defineProperty(volume, "__esModule", { value: true });
	volume.FSWatcher = volume.StatWatcher = volume.Volume = void 0;
	volume.pathToSteps = pathToSteps;
	volume.dataToStr = dataToStr;
	volume.toUnixTimestamp = toUnixTimestamp;
	const path_1 = requirePath$1();
	const fs_core_1 = requireLib$5();
	const util_1 = requireUtil$3();
	const Stats_1 = requireStats();
	const Dirent_1 = requireDirent();
	const StatFs_1 = requireStatFs();
	const buffer_1 = requireBuffer();
	const setTimeoutUnref_1 = requireSetTimeoutUnref();
	const stream_1 = requireStream();
	const fs_node_utils_1 = requireLib$7();
	const events_1 = requireEvents();
	const FileHandle_1 = requireFileHandle();
	const util_2 = requireUtil$4();
	const FsPromises_1 = requireFsPromises();
	const fs_print_1 = requireLib$3();
	const fsSnapshot = requireLib$2();
	const fs_node_utils_2 = requireLib$7();
	const errors = requireErrors$1();
	const options_1 = requireOptions();
	const util_3 = requireUtil$1();
	const Dir_1 = requireDir();
	const resolveCrossPlatform = path_1.resolve;
	const { O_SYMLINK, F_OK, R_OK, W_OK, X_OK, COPYFILE_EXCL, COPYFILE_FICLONE_FORCE } = fs_node_utils_1.constants;
	const pathSep = path_1.posix ? path_1.posix.sep : path_1.sep;
	const pathRelative = path_1.posix ? path_1.posix.relative : path_1.relative;
	const pathJoin = path_1.posix ? path_1.posix.join : path_1.join;
	const pathDirname = path_1.posix ? path_1.posix.dirname : path_1.dirname;
	const pathNormalize = path_1.posix ? path_1.posix.normalize : path_1.normalize;
	// ------------------------------------------------------------------ Constants
	const kMinPoolSpace = 128;
	// ---------------------------------------------------------- Utility functions
	function pathToSteps(path) {
	    return (0, fs_core_1.filenameToSteps)((0, util_3.pathToFilename)(path));
	}
	function dataToStr(data, encoding = fs_node_utils_1.ENCODING_UTF8) {
	    if (buffer_1.Buffer.isBuffer(data))
	        return data.toString(encoding);
	    else if (data instanceof Uint8Array)
	        return (0, buffer_1.bufferFrom)(data).toString(encoding);
	    else
	        return String(data);
	}
	// converts Date or number to a fractional UNIX timestamp
	function toUnixTimestamp(time) {
	    // tslint:disable-next-line triple-equals
	    if (typeof time === 'string' && +time == time) {
	        return +time;
	    }
	    if (time instanceof Date) {
	        return time.getTime() / 1000;
	    }
	    if (isFinite(time)) {
	        if (time < 0) {
	            return Date.now() / 1000;
	        }
	        return time;
	    }
	    throw new Error('Cannot parse time: ' + time);
	}
	function validateUid(uid) {
	    if (typeof uid !== 'number')
	        throw TypeError(fs_node_utils_2.ERRSTR.UID);
	}
	function validateGid(gid) {
	    if (typeof gid !== 'number')
	        throw TypeError(fs_node_utils_2.ERRSTR.GID);
	}
	/**
	 * `Volume` represents a file system.
	 */
	class Volume {
	    get promises() {
	        if (this.promisesApi === null)
	            throw new Error('Promise is not supported in this environment.');
	        return this.promisesApi;
	    }
	    constructor(_core = new fs_core_1.Superblock()) {
	        this._core = _core;
	        this.promisesApi = new FsPromises_1.FsPromises(this, FileHandle_1.FileHandle);
	        this.openSync = (path, flags, mode = 438 /* MODE.DEFAULT */) => {
	            // Validate (1) mode; (2) path; (3) flags - in that order.
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const fileName = (0, util_3.pathToFilename)(path);
	            const flagsNum = (0, util_3.flagsToNumber)(flags);
	            return this._core.open(fileName, flagsNum, modeNum, !(flagsNum & O_SYMLINK));
	        };
	        this.open = (path, flags, a, b) => {
	            let mode = a;
	            let callback = b;
	            if (typeof a === 'function') {
	                mode = 438 /* MODE.DEFAULT */;
	                callback = a;
	            }
	            mode = mode || 438 /* MODE.DEFAULT */;
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const fileName = (0, util_3.pathToFilename)(path);
	            const flagsNum = (0, util_3.flagsToNumber)(flags);
	            this.wrapAsync(this._core.open, [fileName, flagsNum, modeNum, !(flagsNum & O_SYMLINK)], callback);
	        };
	        this.closeSync = (fd) => {
	            this._core.close(fd);
	        };
	        this.close = (fd, callback) => {
	            (0, fs_core_1.validateFd)(fd);
	            const file = this._core.getFileByFdOrThrow(fd, 'close');
	            this.wrapAsync(this._core.close, [file.fd], callback);
	        };
	        this.readSync = (fd, buffer, offset, length, position) => {
	            (0, fs_core_1.validateFd)(fd);
	            return this._core.read(fd, buffer, offset, length, position);
	        };
	        this.read = (fd, buffer, offset, length, position, callback) => {
	            (0, util_3.validateCallback)(callback);
	            if (length === 0) {
	                // This `if` branch is from Node.js
	                return queueMicrotask(() => {
	                    if (callback)
	                        callback(null, 0, buffer);
	                });
	            }
	            Promise.resolve().then(() => {
	                try {
	                    const bytes = this._core.read(fd, buffer, offset, length, position);
	                    callback(null, bytes, buffer);
	                }
	                catch (err) {
	                    callback(err);
	                }
	            });
	        };
	        this.readv = (fd, buffers, a, b) => {
	            let position = a;
	            let callback = b;
	            if (typeof a === 'function')
	                [position, callback] = [null, a];
	            (0, util_3.validateCallback)(callback);
	            Promise.resolve().then(() => {
	                try {
	                    const bytes = this._core.readv(fd, buffers, position);
	                    callback(null, bytes, buffers);
	                }
	                catch (err) {
	                    callback(err);
	                }
	            });
	        };
	        this.readvSync = (fd, buffers, position) => {
	            (0, fs_core_1.validateFd)(fd);
	            return this._core.readv(fd, buffers, position ?? null);
	        };
	        this._readfile = (id, flagsNum, encoding) => {
	            let result;
	            const isUserFd = typeof id === 'number';
	            const userOwnsFd = isUserFd && (0, fs_core_1.isFd)(id);
	            let fd;
	            if (userOwnsFd)
	                fd = id;
	            else {
	                const filename = (0, util_3.pathToFilename)(id);
	                // Check if original path had trailing slash (indicates directory intent)
	                const originalPath = String(id);
	                const hasTrailingSlash = originalPath.length > 1 && originalPath.endsWith('/');
	                const link = this._core.getResolvedLinkOrThrow(filename, 'open');
	                const node = link.getNode();
	                if (node.isDirectory())
	                    throw (0, util_3.createError)("EISDIR" /* ERROR_CODE.EISDIR */, 'open', link.getPath());
	                // If path had trailing slash but resolved to a file, throw ENOTDIR
	                if (hasTrailingSlash && node.isFile()) {
	                    throw (0, util_3.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'open', originalPath);
	                }
	                fd = this.openSync(id, flagsNum);
	            }
	            try {
	                result = (0, util_3.bufferToEncoding)(this._core.getFileByFdOrThrow(fd).getBuffer(), encoding);
	            }
	            finally {
	                if (!userOwnsFd) {
	                    this.closeSync(fd);
	                }
	            }
	            return result;
	        };
	        this.readFileSync = (file, options) => {
	            const opts = (0, options_1.getReadFileOptions)(options);
	            const flagsNum = (0, util_3.flagsToNumber)(opts.flag);
	            return this._readfile(file, flagsNum, opts.encoding);
	        };
	        this.readFile = (id, a, b) => {
	            const [opts, callback] = (0, options_1.optsAndCbGenerator)(options_1.getReadFileOptions)(a, b);
	            const flagsNum = (0, util_3.flagsToNumber)(opts.flag);
	            this.wrapAsync(this._readfile, [id, flagsNum, opts.encoding], callback);
	        };
	        this.writeSync = (fd, a, b, c, d) => {
	            const [, buf, offset, length, position] = (0, util_3.getWriteSyncArgs)(fd, a, b, c, d);
	            return this._write(fd, buf, offset, length, position);
	        };
	        this.write = (fd, a, b, c, d, e) => {
	            const [, asStr, buf, offset, length, position, cb] = (0, util_3.getWriteArgs)(fd, a, b, c, d, e);
	            Promise.resolve().then(() => {
	                try {
	                    const bytes = this._write(fd, buf, offset, length, position);
	                    if (!asStr) {
	                        cb(null, bytes, buf);
	                    }
	                    else {
	                        cb(null, bytes, a);
	                    }
	                }
	                catch (err) {
	                    cb(err);
	                }
	            });
	        };
	        this.writev = (fd, buffers, a, b) => {
	            let position = a;
	            let callback = b;
	            if (typeof a === 'function')
	                [position, callback] = [null, a];
	            (0, util_3.validateCallback)(callback);
	            Promise.resolve().then(() => {
	                try {
	                    const bytes = this.writevBase(fd, buffers, position);
	                    callback(null, bytes, buffers);
	                }
	                catch (err) {
	                    callback(err);
	                }
	            });
	        };
	        this.writevSync = (fd, buffers, position) => {
	            (0, fs_core_1.validateFd)(fd);
	            return this.writevBase(fd, buffers, position ?? null);
	        };
	        this.writeFileSync = (id, data, options) => {
	            const opts = (0, options_1.getWriteFileOptions)(options);
	            const flagsNum = (0, util_3.flagsToNumber)(opts.flag);
	            const modeNum = (0, util_3.modeToNumber)(opts.mode);
	            const buf = (0, fs_core_1.dataToBuffer)(data, opts.encoding);
	            this._core.writeFile(id, buf, flagsNum, modeNum);
	        };
	        this.writeFile = (id, data, a, b) => {
	            let options = a;
	            let callback = b;
	            if (typeof a === 'function')
	                [options, callback] = [options_1.writeFileDefaults, a];
	            const cb = (0, util_3.validateCallback)(callback);
	            const opts = (0, options_1.getWriteFileOptions)(options);
	            const flagsNum = (0, util_3.flagsToNumber)(opts.flag);
	            const modeNum = (0, util_3.modeToNumber)(opts.mode);
	            const buf = (0, fs_core_1.dataToBuffer)(data, opts.encoding);
	            this.wrapAsync(this._core.writeFile, [id, buf, flagsNum, modeNum], cb);
	        };
	        this.copyFileSync = (src, dest, flags) => {
	            const srcFilename = (0, util_3.pathToFilename)(src);
	            const destFilename = (0, util_3.pathToFilename)(dest);
	            return this._copyFile(srcFilename, destFilename, (flags || 0) | 0);
	        };
	        this.copyFile = (src, dest, a, b) => {
	            const srcFilename = (0, util_3.pathToFilename)(src);
	            const destFilename = (0, util_3.pathToFilename)(dest);
	            let flags;
	            let callback;
	            if (typeof a === 'function')
	                [flags, callback] = [0, a];
	            else
	                [flags, callback] = [a, b];
	            (0, util_3.validateCallback)(callback);
	            this.wrapAsync(this._copyFile, [srcFilename, destFilename, flags], callback);
	        };
	        this._cp = (src, dest, options) => {
	            if (options.filter && !options.filter(src, dest))
	                return;
	            const srcStat = options.dereference ? this.statSync(src) : this.lstatSync(src);
	            let destStat = null;
	            try {
	                destStat = this.lstatSync(dest);
	            }
	            catch (err) {
	                if (err.code !== 'ENOENT') {
	                    throw err;
	                }
	            }
	            // Check if src and dest are the same (both exist and have same inode)
	            if (destStat && srcStat.ino === destStat.ino && srcStat.dev === destStat.dev)
	                throw (0, util_3.createError)("EINVAL" /* ERROR_CODE.EINVAL */, 'cp', src, dest);
	            // Check type compatibility
	            if (destStat) {
	                if (srcStat.isDirectory() && !destStat.isDirectory())
	                    throw (0, util_3.createError)("EISDIR" /* ERROR_CODE.EISDIR */, 'cp', src, dest);
	                if (!srcStat.isDirectory() && destStat.isDirectory())
	                    throw (0, util_3.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'cp', src, dest);
	            }
	            // Check if trying to copy directory to subdirectory of itself
	            if (srcStat.isDirectory() && this.isSrcSubdir(src, dest))
	                throw (0, util_3.createError)("EINVAL" /* ERROR_CODE.EINVAL */, 'cp', src, dest);
	            {
	                const parent = pathDirname(dest);
	                if (!this.existsSync(parent))
	                    this.mkdirSync(parent, { recursive: true });
	            }
	            // Handle different file types
	            if (srcStat.isDirectory()) {
	                if (!options.recursive)
	                    throw (0, util_3.createError)("EISDIR" /* ERROR_CODE.EISDIR */, 'cp', src);
	                this.cpDirSync(srcStat, destStat, src, dest, options);
	            }
	            else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) {
	                this.cpFileSync(srcStat, destStat, src, dest, options);
	            }
	            else if (srcStat.isSymbolicLink() && !options.dereference) {
	                // Only handle as symlink if not dereferencing
	                this.cpSymlinkSync(destStat, src, dest, options);
	            }
	            else {
	                throw (0, util_3.createError)("EINVAL" /* ERROR_CODE.EINVAL */, 'cp', src);
	            }
	        };
	        this.linkSync = (existingPath, newPath) => {
	            const existingPathFilename = (0, util_3.pathToFilename)(existingPath);
	            const newPathFilename = (0, util_3.pathToFilename)(newPath);
	            this._core.link(existingPathFilename, newPathFilename);
	        };
	        this.link = (existingPath, newPath, callback) => {
	            const existingPathFilename = (0, util_3.pathToFilename)(existingPath);
	            const newPathFilename = (0, util_3.pathToFilename)(newPath);
	            this.wrapAsync(this._core.link, [existingPathFilename, newPathFilename], callback);
	        };
	        this.unlinkSync = (path) => {
	            const filename = (0, util_3.pathToFilename)(path);
	            this._core.unlink(filename);
	        };
	        this.unlink = (path, callback) => {
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._core.unlink, [filename], callback);
	        };
	        /**
	         * `type` argument works only on Windows.
	         * @param target
	         * @param path
	         * @param type
	         */
	        this.symlinkSync = (target, path, type) => {
	            const targetFilename = (0, util_3.pathToFilename)(target);
	            const pathFilename = (0, util_3.pathToFilename)(path);
	            this._core.symlink(targetFilename, pathFilename);
	        };
	        this.symlink = (target, path, a, b) => {
	            const callback = (0, util_3.validateCallback)(typeof a === 'function' ? a : b);
	            const targetFilename = (0, util_3.pathToFilename)(target);
	            const pathFilename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._core.symlink, [targetFilename, pathFilename], callback);
	        };
	        this._lstat = (filename, bigint = false, throwIfNoEntry = false) => {
	            let link;
	            try {
	                link = this._core.getLinkOrThrow(filename, 'lstat');
	            }
	            catch (err) {
	                if (err.code === "ENOENT" /* ERROR_CODE.ENOENT */ && !throwIfNoEntry)
	                    return undefined;
	                else
	                    throw err;
	            }
	            return Stats_1.default.build(link.getNode(), bigint);
	        };
	        this.lstatSync = (path, options) => {
	            const { throwIfNoEntry = true, bigint = false } = (0, options_1.getStatOptions)(options);
	            return this._lstat((0, util_3.pathToFilename)(path), bigint, throwIfNoEntry);
	        };
	        this.renameSync = (oldPath, newPath) => {
	            const oldPathFilename = (0, util_3.pathToFilename)(oldPath);
	            const newPathFilename = (0, util_3.pathToFilename)(newPath);
	            this._core.rename(oldPathFilename, newPathFilename);
	        };
	        this.rename = (oldPath, newPath, callback) => {
	            const oldPathFilename = (0, util_3.pathToFilename)(oldPath);
	            const newPathFilename = (0, util_3.pathToFilename)(newPath);
	            this.wrapAsync(this._core.rename, [oldPathFilename, newPathFilename], callback);
	        };
	        this.existsSync = (path) => {
	            try {
	                return this._exists((0, util_3.pathToFilename)(path)).ok;
	            }
	            catch (err) {
	                return false;
	            }
	        };
	        this.exists = (path, callback) => {
	            const filename = (0, util_3.pathToFilename)(path);
	            if (typeof callback !== 'function')
	                throw Error(fs_node_utils_2.ERRSTR.CB);
	            Promise.resolve().then(() => {
	                try {
	                    callback(this._exists(filename).ok);
	                }
	                catch (err) {
	                    callback(false);
	                }
	            });
	        };
	        this.accessSync = (path, mode = F_OK) => {
	            const filename = (0, util_3.pathToFilename)(path);
	            mode = mode | 0;
	            this._access(filename, mode);
	        };
	        this.access = (path, a, b) => {
	            let mode = F_OK;
	            let callback;
	            if (typeof a !== 'function')
	                [mode, callback] = [a | 0, (0, util_3.validateCallback)(b)];
	            else
	                callback = a;
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._access, [filename, mode], callback);
	        };
	        this.appendFileSync = (id, data, options) => {
	            const opts = (0, options_1.getAppendFileOpts)(options);
	            // Force append behavior when using a supplied file descriptor.
	            if (!opts.flag || (0, fs_core_1.isFd)(id))
	                opts.flag = 'a';
	            this.writeFileSync(id, data, opts);
	        };
	        this.appendFile = (id, data, a, b) => {
	            const [opts, callback] = (0, options_1.getAppendFileOptsAndCb)(a, b);
	            // Force append behavior when using a supplied file descriptor.
	            if (!opts.flag || (0, fs_core_1.isFd)(id))
	                opts.flag = 'a';
	            this.writeFile(id, data, opts, callback);
	        };
	        this._readdir = (filename, options) => {
	            (0, fs_core_1.filenameToSteps)(filename);
	            const link = this._core.getResolvedLinkOrThrow(filename, 'scandir');
	            const node = link.getNode();
	            if (!node.isDirectory())
	                throw (0, util_3.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'scandir', filename);
	            // Check we have permissions
	            if (!node.canRead())
	                throw (0, util_3.createError)("EACCES" /* ERROR_CODE.EACCES */, 'scandir', filename);
	            const list = []; // output list
	            for (const name of link.children.keys()) {
	                const child = link.getChild(name);
	                if (!child || name === '.' || name === '..')
	                    continue;
	                list.push(Dirent_1.default.build(child, options.encoding));
	                // recursion
	                if (options.recursive && child.children.size) {
	                    const recurseOptions = { ...options, recursive: true, withFileTypes: true };
	                    const childList = this._readdir(child.getPath(), recurseOptions);
	                    list.push(...childList);
	                }
	            }
	            if (!util_1.isWin && options.encoding !== 'buffer')
	                list.sort((a, b) => {
	                    if (a.name < b.name)
	                        return -1;
	                    if (a.name > b.name)
	                        return 1;
	                    return 0;
	                });
	            if (options.withFileTypes)
	                return list;
	            let filename2 = filename;
	            if (util_1.isWin)
	                filename2 = filename2.replace(/\\/g, '/');
	            return list.map(dirent => {
	                if (options.recursive) {
	                    let fullPath = pathJoin(dirent.parentPath, dirent.name.toString());
	                    if (util_1.isWin) {
	                        fullPath = fullPath.replace(/\\/g, '/');
	                    }
	                    return fullPath.replace(filename2 + path_1.posix.sep, '');
	                }
	                return dirent.name;
	            });
	        };
	        this.readdirSync = (path, options) => {
	            const opts = (0, options_1.getReaddirOptions)(options);
	            const filename = (0, util_3.pathToFilename)(path);
	            return this._readdir(filename, opts);
	        };
	        this.readdir = (path, a, b) => {
	            const [options, callback] = (0, options_1.getReaddirOptsAndCb)(a, b);
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._readdir, [filename, options], callback);
	        };
	        this._readlink = (filename, encoding) => {
	            const link = this._core.getLinkOrThrow(filename, 'readlink');
	            const node = link.getNode();
	            if (!node.isSymlink())
	                throw (0, util_3.createError)("EINVAL" /* ERROR_CODE.EINVAL */, 'readlink', filename);
	            return (0, fs_node_utils_1.strToEncoding)(node.symlink, encoding);
	        };
	        this.readlinkSync = (path, options) => {
	            const opts = (0, options_1.getDefaultOpts)(options);
	            const filename = (0, util_3.pathToFilename)(path);
	            return this._readlink(filename, opts.encoding);
	        };
	        this.readlink = (path, a, b) => {
	            const [opts, callback] = (0, options_1.getDefaultOptsAndCb)(a, b);
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._readlink, [filename, opts.encoding], callback);
	        };
	        this._fsync = (fd) => {
	            this._core.getFileByFdOrThrow(fd, 'fsync');
	        };
	        this.fsyncSync = (fd) => {
	            this._fsync(fd);
	        };
	        this.fsync = (fd, callback) => {
	            this.wrapAsync(this._fsync, [fd], callback);
	        };
	        this._fdatasync = (fd) => {
	            this._core.getFileByFdOrThrow(fd, 'fdatasync');
	        };
	        this.fdatasyncSync = (fd) => {
	            this._fdatasync(fd);
	        };
	        this.fdatasync = (fd, callback) => {
	            this.wrapAsync(this._fdatasync, [fd], callback);
	        };
	        this._ftruncate = (fd, len) => {
	            this._core.ftruncate(fd, len);
	        };
	        this.ftruncateSync = (fd, len) => {
	            this._ftruncate(fd, len);
	        };
	        this.ftruncate = (fd, a, b) => {
	            const len = typeof a === 'number' ? a : 0;
	            const callback = (0, util_3.validateCallback)(typeof a === 'number' ? b : a);
	            this.wrapAsync(this._ftruncate, [fd, len], callback);
	        };
	        this._truncate = (path, len) => {
	            const fd = this.openSync(path, 'r+');
	            try {
	                this.ftruncateSync(fd, len);
	            }
	            finally {
	                this.closeSync(fd);
	            }
	        };
	        /**
	         * `id` should be a file descriptor or a path. `id` as file descriptor will
	         * not be supported soon.
	         */
	        this.truncateSync = (id, len) => {
	            if ((0, fs_core_1.isFd)(id))
	                return this.ftruncateSync(id, len);
	            this._truncate(id, len);
	        };
	        this.truncate = (id, a, b) => {
	            const len = typeof a === 'number' ? a : 0;
	            const callback = (0, util_3.validateCallback)(typeof a === 'number' ? b : a);
	            if ((0, fs_core_1.isFd)(id))
	                return this.ftruncate(id, len, callback);
	            this.wrapAsync(this._truncate, [id, len], callback);
	        };
	        this._futimes = (fd, atime, mtime) => {
	            this._core.futimes(fd, atime, mtime);
	        };
	        this.futimesSync = (fd, atime, mtime) => {
	            this._futimes(fd, toUnixTimestamp(atime), toUnixTimestamp(mtime));
	        };
	        this.futimes = (fd, atime, mtime, callback) => {
	            this.wrapAsync(this._futimes, [fd, toUnixTimestamp(atime), toUnixTimestamp(mtime)], callback);
	        };
	        this._utimes = (filename, atime, mtime, followSymlinks = true) => {
	            this._core.utimes(filename, atime, mtime, followSymlinks);
	        };
	        this.utimesSync = (path, atime, mtime) => {
	            this._utimes((0, util_3.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), true);
	        };
	        this.utimes = (path, atime, mtime, callback) => {
	            this.wrapAsync(this._utimes, [(0, util_3.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), true], callback);
	        };
	        this.lutimesSync = (path, atime, mtime) => {
	            this._utimes((0, util_3.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), false);
	        };
	        this.lutimes = (path, atime, mtime, callback) => {
	            this.wrapAsync(this._utimes, [(0, util_3.pathToFilename)(path), toUnixTimestamp(atime), toUnixTimestamp(mtime), false], callback);
	        };
	        this.mkdirSync = (path, options) => {
	            const opts = (0, options_1.getMkdirOptions)(options);
	            const modeNum = (0, util_3.modeToNumber)(opts.mode, 0o777);
	            const filename = (0, util_3.pathToFilename)(path);
	            if (opts.recursive)
	                return this._core.mkdirp(filename, modeNum);
	            this._core.mkdir(filename, modeNum);
	        };
	        this.mkdir = (path, a, b) => {
	            const opts = (0, options_1.getMkdirOptions)(a);
	            const callback = (0, util_3.validateCallback)(typeof a === 'function' ? a : b);
	            const modeNum = (0, util_3.modeToNumber)(opts.mode, 0o777);
	            const filename = (0, util_3.pathToFilename)(path);
	            if (opts.recursive)
	                this.wrapAsync(this._core.mkdirp, [filename, modeNum], callback);
	            else
	                this.wrapAsync(this._core.mkdir, [filename, modeNum], callback);
	        };
	        this._mkdtemp = (prefix, encoding, retry = 5) => {
	            const filename = prefix + (0, util_3.genRndStr6)();
	            try {
	                this._core.mkdir(filename, 511 /* MODE.DIR */);
	                return (0, fs_node_utils_1.strToEncoding)(filename, encoding);
	            }
	            catch (err) {
	                if (err.code === "EEXIST" /* ERROR_CODE.EEXIST */) {
	                    if (retry > 1)
	                        return this._mkdtemp(prefix, encoding, retry - 1);
	                    else
	                        throw Error('Could not create temp dir.');
	                }
	                else
	                    throw err;
	            }
	        };
	        this.mkdtempSync = (prefix, options) => {
	            const { encoding } = (0, options_1.getDefaultOpts)(options);
	            if (!prefix || typeof prefix !== 'string')
	                throw new TypeError('filename prefix is required');
	            (0, util_3.nullCheck)(prefix);
	            return this._mkdtemp(prefix, encoding);
	        };
	        this.mkdtemp = (prefix, a, b) => {
	            const [{ encoding }, callback] = (0, options_1.getDefaultOptsAndCb)(a, b);
	            if (!prefix || typeof prefix !== 'string')
	                throw new TypeError('filename prefix is required');
	            if (!(0, util_3.nullCheck)(prefix))
	                return;
	            this.wrapAsync(this._mkdtemp, [prefix, encoding], callback);
	        };
	        this.rmdirSync = (path, options) => {
	            const opts = (0, options_1.getRmdirOptions)(options);
	            this._core.rmdir((0, util_3.pathToFilename)(path), opts.recursive);
	        };
	        this.rmdir = (path, a, b) => {
	            const opts = (0, options_1.getRmdirOptions)(a);
	            const callback = (0, util_3.validateCallback)(typeof a === 'function' ? a : b);
	            this.wrapAsync(this._core.rmdir, [(0, util_3.pathToFilename)(path), opts.recursive], callback);
	        };
	        this.rmSync = (path, options) => {
	            this._core.rm((0, util_3.pathToFilename)(path), options?.force, options?.recursive);
	        };
	        this.rm = (path, a, b) => {
	            const [opts, callback] = (0, options_1.getRmOptsAndCb)(a, b);
	            this.wrapAsync(this._core.rm, [(0, util_3.pathToFilename)(path), opts?.force, opts?.recursive], callback);
	        };
	        this._fchmod = (fd, modeNum) => {
	            this._core.fchmod(fd, modeNum);
	        };
	        this.fchmodSync = (fd, mode) => {
	            this._fchmod(fd, (0, util_3.modeToNumber)(mode));
	        };
	        this.fchmod = (fd, mode, callback) => {
	            this.wrapAsync(this._fchmod, [fd, (0, util_3.modeToNumber)(mode)], callback);
	        };
	        this._chmod = (filename, modeNum, followSymlinks = true) => {
	            if (followSymlinks) {
	                this._core.chmod(filename, modeNum);
	            }
	            else {
	                this._core.lchmod(filename, modeNum);
	            }
	        };
	        this.chmodSync = (path, mode) => {
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const filename = (0, util_3.pathToFilename)(path);
	            this._chmod(filename, modeNum, true);
	        };
	        this.chmod = (path, mode, callback) => {
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._chmod, [filename, modeNum], callback);
	        };
	        this._lchmod = (filename, modeNum) => {
	            this._core.lchmod(filename, modeNum);
	        };
	        this.lchmodSync = (path, mode) => {
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const filename = (0, util_3.pathToFilename)(path);
	            this._lchmod(filename, modeNum);
	        };
	        this.lchmod = (path, mode, callback) => {
	            const modeNum = (0, util_3.modeToNumber)(mode);
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._lchmod, [filename, modeNum], callback);
	        };
	        this._fchown = (fd, uid, gid) => {
	            this._core.fchown(fd, uid, gid);
	        };
	        this.fchownSync = (fd, uid, gid) => {
	            validateUid(uid);
	            validateGid(gid);
	            this._fchown(fd, uid, gid);
	        };
	        this.fchown = (fd, uid, gid, callback) => {
	            validateUid(uid);
	            validateGid(gid);
	            this.wrapAsync(this._fchown, [fd, uid, gid], callback);
	        };
	        this._chown = (filename, uid, gid) => {
	            this._core.chown(filename, uid, gid);
	        };
	        this.chownSync = (path, uid, gid) => {
	            validateUid(uid);
	            validateGid(gid);
	            this._chown((0, util_3.pathToFilename)(path), uid, gid);
	        };
	        this.chown = (path, uid, gid, callback) => {
	            validateUid(uid);
	            validateGid(gid);
	            this.wrapAsync(this._chown, [(0, util_3.pathToFilename)(path), uid, gid], callback);
	        };
	        this._lchown = (filename, uid, gid) => {
	            this._core.lchown(filename, uid, gid);
	        };
	        this.lchownSync = (path, uid, gid) => {
	            validateUid(uid);
	            validateGid(gid);
	            this._lchown((0, util_3.pathToFilename)(path), uid, gid);
	        };
	        this.lchown = (path, uid, gid, callback) => {
	            validateUid(uid);
	            validateGid(gid);
	            this.wrapAsync(this._lchown, [(0, util_3.pathToFilename)(path), uid, gid], callback);
	        };
	        this.statWatchers = {};
	        this.cpSync = (src, dest, options) => {
	            const srcFilename = (0, util_3.pathToFilename)(src);
	            const destFilename = (0, util_3.pathToFilename)(dest);
	            const opts_ = {
	                dereference: options?.dereference ?? false,
	                errorOnExist: options?.errorOnExist ?? false,
	                filter: options?.filter,
	                force: options?.force ?? true,
	                mode: options?.mode ?? 0,
	                preserveTimestamps: options?.preserveTimestamps ?? false,
	                recursive: options?.recursive ?? false,
	                verbatimSymlinks: options?.verbatimSymlinks ?? false,
	            };
	            return this._cp(srcFilename, destFilename, opts_);
	        };
	        this.cp = (src, dest, a, b) => {
	            const srcFilename = (0, util_3.pathToFilename)(src);
	            const destFilename = (0, util_3.pathToFilename)(dest);
	            let options;
	            let callback;
	            if (typeof a === 'function')
	                [options, callback] = [{}, a];
	            else
	                [options, callback] = [a || {}, b];
	            (0, util_3.validateCallback)(callback);
	            const opts_ = {
	                dereference: options?.dereference ?? false,
	                errorOnExist: options?.errorOnExist ?? false,
	                filter: options?.filter,
	                force: options?.force ?? true,
	                mode: options?.mode ?? 0,
	                preserveTimestamps: options?.preserveTimestamps ?? false,
	                recursive: options?.recursive ?? false,
	                verbatimSymlinks: options?.verbatimSymlinks ?? false,
	            };
	            this.wrapAsync(this._cp, [srcFilename, destFilename, opts_], callback);
	        };
	        this.openAsBlob = async (path, options) => {
	            const filename = (0, util_3.pathToFilename)(path);
	            let link;
	            try {
	                link = this._core.getResolvedLinkOrThrow(filename, 'open');
	            }
	            catch (error) {
	                // Convert ENOENT to Node.js-compatible error for openAsBlob
	                if (error && typeof error === 'object' && error.code === 'ENOENT') {
	                    const nodeError = new errors.TypeError('ERR_INVALID_ARG_VALUE');
	                    throw nodeError;
	                }
	                throw error;
	            }
	            const node = link.getNode();
	            // Note: Node.js allows opening directories as blobs, so we don't throw EISDIR
	            const buffer = node.getBuffer();
	            const type = options?.type || '';
	            return new Blob([buffer], { type });
	        };
	        this.glob = (pattern, ...args) => {
	            const [options, callback] = args.length === 1 ? [{}, args[0]] : [args[0], args[1]];
	            this.wrapAsync(this._globSync, [pattern, options || {}], callback);
	        };
	        this.globSync = (pattern, options = {}) => {
	            return this._globSync(pattern, options);
	        };
	        this._globSync = (pattern, options = {}) => {
	            const { globSync } = requireGlob();
	            return globSync(this, pattern, options);
	        };
	        this._opendir = (filename, options) => {
	            const link = this._core.getResolvedLinkOrThrow(filename, 'scandir');
	            const node = link.getNode();
	            if (!node.isDirectory())
	                throw (0, util_3.createError)("ENOTDIR" /* ERROR_CODE.ENOTDIR */, 'scandir', filename);
	            return new Dir_1.Dir(link, options);
	        };
	        this.opendirSync = (path, options) => {
	            const opts = (0, options_1.getOpendirOptions)(options);
	            const filename = (0, util_3.pathToFilename)(path);
	            return this._opendir(filename, opts);
	        };
	        this.opendir = (path, a, b) => {
	            const [options, callback] = (0, options_1.getOpendirOptsAndCb)(a, b);
	            const filename = (0, util_3.pathToFilename)(path);
	            this.wrapAsync(this._opendir, [filename, options], callback);
	        };
	        const self = this; // tslint:disable-line no-this-assignment
	        this.StatWatcher = class extends StatWatcher {
	            constructor() {
	                super(self);
	            }
	        };
	        const _ReadStream = FsReadStream;
	        this.ReadStream = class extends _ReadStream {
	            constructor(...args) {
	                super(self, ...args);
	            }
	        };
	        const _WriteStream = FsWriteStream;
	        this.WriteStream = class extends _WriteStream {
	            constructor(...args) {
	                super(self, ...args);
	            }
	        };
	        this.FSWatcher = class extends FSWatcher {
	            constructor() {
	                super(self);
	            }
	        };
	        const _realpath = (filename, encoding) => {
	            const realLink = this._core.getResolvedLinkOrThrow(filename, 'realpath');
	            return (0, fs_node_utils_1.strToEncoding)(realLink.getPath() || '/', encoding);
	        };
	        const realpathImpl = (path, a, b) => {
	            const [opts, callback] = (0, options_1.getRealpathOptsAndCb)(a, b);
	            const pathFilename = (0, util_3.pathToFilename)(path);
	            self.wrapAsync(_realpath, [pathFilename, opts.encoding], callback);
	        };
	        const realpathSyncImpl = (path, options) => _realpath((0, util_3.pathToFilename)(path), (0, options_1.getRealpathOptions)(options).encoding);
	        this.realpath = realpathImpl;
	        this.realpath.native = realpathImpl;
	        this.realpathSync = realpathSyncImpl;
	        this.realpathSync.native = realpathSyncImpl;
	    }
	    wrapAsync(method, args, callback) {
	        (0, util_3.validateCallback)(callback);
	        Promise.resolve().then(() => {
	            let result;
	            try {
	                result = method.apply(this, args);
	            }
	            catch (err) {
	                callback(err);
	                return;
	            }
	            callback(null, result);
	        });
	    }
	    reset() {
	        this._core.reset();
	    }
	    toJSON(paths, json = {}, isRelative = false, asBuffer = false) {
	        return this._core.toJSON(paths, json, isRelative, asBuffer);
	    }
	    fromJSON(json, cwd) {
	        return this._core.fromJSON(json, cwd);
	    }
	    fromNestedJSON(json, cwd) {
	        return this._core.fromNestedJSON(json, cwd);
	    }
	    // Legacy interface
	    mountSync(mountpoint, json) {
	        this._core.fromJSON(json, mountpoint);
	    }
	    _write(fd, buf, offset, length, position) {
	        return this._core.write(fd, buf, offset, length, position);
	    }
	    writevBase(fd, buffers, position) {
	        this._core.getFileByFdOrThrow(fd);
	        let p = position ?? undefined;
	        if (p === -1) {
	            p = undefined;
	        }
	        let bytesWritten = 0;
	        for (const buffer of buffers) {
	            const nodeBuf = buffer_1.Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	            const bytes = this._core.write(fd, nodeBuf, 0, nodeBuf.byteLength, p ?? null);
	            p = undefined;
	            bytesWritten += bytes;
	            if (bytes < nodeBuf.byteLength)
	                break;
	        }
	        return bytesWritten;
	    }
	    _copyFile(src, dest, flags) {
	        const buf = this.readFileSync(src);
	        if (flags & COPYFILE_EXCL && this.existsSync(dest))
	            throw (0, util_3.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'copyFile', src, dest);
	        if (flags & COPYFILE_FICLONE_FORCE)
	            throw (0, util_3.createError)("ENOSYS" /* ERROR_CODE.ENOSYS */, 'copyFile', src, dest);
	        this._core.writeFile(dest, buf, fs_node_utils_2.FLAGS.w, 438 /* MODE.DEFAULT */);
	    }
	    isSrcSubdir(src, dest) {
	        try {
	            const normalizedSrc = pathNormalize(src.startsWith('/') ? src : '/' + src);
	            const normalizedDest = pathNormalize(dest.startsWith('/') ? dest : '/' + dest);
	            if (normalizedSrc === normalizedDest)
	                return true;
	            // Check if dest is under src by using relative path
	            // If dest is under src, the relative path from src to dest won't start with '..'
	            const relativePath = pathRelative(normalizedSrc, normalizedDest);
	            // If relative path is empty or doesn't start with '..', dest is under src
	            return relativePath === '' || (!relativePath.startsWith('..') && !(0, path_1.isAbsolute)(relativePath));
	        }
	        catch (error) {
	            // If path operations fail, assume it's safe (don't block the copy)
	            return false;
	        }
	    }
	    cpFileSync(srcStat, destStat, src, dest, options) {
	        if (destStat) {
	            if (options.errorOnExist)
	                throw (0, util_3.createError)("EEXIST" /* ERROR_CODE.EEXIST */, 'cp', dest);
	            if (!options.force)
	                return;
	            this.unlinkSync(dest);
	        }
	        // Copy the file
	        this.copyFileSync(src, dest, options.mode);
	        // Preserve timestamps if requested
	        if (options.preserveTimestamps)
	            this.utimesSync(dest, srcStat.atime, srcStat.mtime);
	        // Set file mode
	        this.chmodSync(dest, Number(srcStat.mode));
	    }
	    cpDirSync(srcStat, destStat, src, dest, options) {
	        if (!destStat) {
	            this.mkdirSync(dest);
	        }
	        // Read directory contents
	        const entries = this.readdirSync(src);
	        for (const entry of entries) {
	            const srcItem = pathJoin(src, String(entry));
	            const destItem = pathJoin(dest, String(entry));
	            // Apply filter to each item
	            if (options.filter && !options.filter(srcItem, destItem)) {
	                continue;
	            }
	            this._cp(srcItem, destItem, options);
	        }
	        // Set directory mode
	        this.chmodSync(dest, Number(srcStat.mode));
	    }
	    cpSymlinkSync(destStat, src, dest, options) {
	        let linkTarget = String(this.readlinkSync(src));
	        if (!options.verbatimSymlinks && !(0, path_1.isAbsolute)(linkTarget))
	            linkTarget = resolveCrossPlatform(pathDirname(src), linkTarget);
	        if (destStat)
	            this.unlinkSync(dest);
	        this.symlinkSync(linkTarget, dest);
	    }
	    lstat(path, a, b) {
	        const [{ throwIfNoEntry = true, bigint = false }, callback] = (0, options_1.getStatOptsAndCb)(a, b);
	        this.wrapAsync(this._lstat, [(0, util_3.pathToFilename)(path), bigint, throwIfNoEntry], callback);
	    }
	    _stat(filename, bigint = false, throwIfNoEntry = true) {
	        const result = this._core.getResolvedLinkResult(filename, 'stat');
	        if (result.ok) {
	            return (0, fs_core_1.Ok)(Stats_1.default.build(result.value.getNode(), bigint));
	        }
	        if (result.err.code === "ENOENT" /* ERROR_CODE.ENOENT */ && !throwIfNoEntry) {
	            return (0, fs_core_1.Ok)(undefined);
	        }
	        else {
	            return result;
	        }
	    }
	    _statOrThrow(filename, bigint = false, throwIfNoEntry = true) {
	        const result = this._stat(filename, bigint, throwIfNoEntry);
	        if (result.ok) {
	            return result.value;
	        }
	        else {
	            throw result.err.toError();
	        }
	    }
	    statSync(path, options) {
	        const { bigint = true, throwIfNoEntry = true } = (0, options_1.getStatOptions)(options);
	        const result = this._stat((0, util_3.pathToFilename)(path), bigint, throwIfNoEntry);
	        if (result.ok) {
	            return result.value;
	        }
	        else {
	            throw result.err.toError();
	        }
	    }
	    stat(path, a, b) {
	        const [{ bigint = false, throwIfNoEntry = true }, callback] = (0, options_1.getStatOptsAndCb)(a, b);
	        this.wrapAsync(this._statOrThrow, [(0, util_3.pathToFilename)(path), bigint, throwIfNoEntry], callback);
	    }
	    fstatBase(fd, bigint = false) {
	        const file = this._core.getFileByFd(fd);
	        if (!file)
	            throw (0, util_3.createError)("EBADF" /* ERROR_CODE.EBADF */, 'fstat');
	        return Stats_1.default.build(file.node, bigint);
	    }
	    fstatSync(fd, options) {
	        return this.fstatBase(fd, (0, options_1.getStatOptions)(options).bigint);
	    }
	    fstat(fd, a, b) {
	        const [opts, callback] = (0, options_1.getStatOptsAndCb)(a, b);
	        this.wrapAsync(this.fstatBase, [fd, opts.bigint], callback);
	    }
	    _exists(filename) {
	        const result = this._stat(filename);
	        return result.ok ? (0, fs_core_1.Ok)(true) : result;
	    }
	    _access(filename, mode) {
	        const link = this._core.getResolvedLinkOrThrow(filename, 'access');
	        const node = link.getNode();
	        // F_OK (0) just checks for existence, which we already confirmed above
	        if (mode === F_OK) {
	            return;
	        }
	        // Check read permission
	        if (mode & R_OK && !node.canRead()) {
	            throw (0, util_3.createError)("EACCES" /* ERROR_CODE.EACCES */, 'access', filename);
	        }
	        // Check write permission
	        if (mode & W_OK && !node.canWrite()) {
	            throw (0, util_3.createError)("EACCES" /* ERROR_CODE.EACCES */, 'access', filename);
	        }
	        // Check execute permission
	        if (mode & X_OK && !node.canExecute()) {
	            throw (0, util_3.createError)("EACCES" /* ERROR_CODE.EACCES */, 'access', filename);
	        }
	    }
	    watchFile(path, a, b) {
	        const filename = (0, util_3.pathToFilename)(path);
	        let options = a;
	        let listener = b;
	        if (typeof options === 'function') {
	            listener = a;
	            options = null;
	        }
	        if (typeof listener !== 'function') {
	            throw new TypeError('The "listener" argument must be of type function. Received ' + typeof listener);
	        }
	        let interval = 5007;
	        let persistent = true;
	        let bigint = false;
	        if (options && typeof options === 'object') {
	            if (options.interval !== undefined) {
	                if (typeof options.interval !== 'number')
	                    throw new TypeError('The "options.interval" property must be of type number. Received ' + typeof options.interval);
	                if (!Number.isInteger(options.interval) || options.interval < 0 || options.interval > 0xffffffff)
	                    throw new RangeError('The value of "options.interval" is out of range. ' +
	                        `It must be an integer >= 0 && <= 4294967295. Received ${options.interval}`);
	                interval = options.interval;
	            }
	            if (typeof options.persistent === 'boolean')
	                persistent = options.persistent;
	            if (typeof options.bigint === 'boolean')
	                bigint = options.bigint;
	        }
	        let watcher = this.statWatchers[filename];
	        if (!watcher) {
	            watcher = new this.StatWatcher();
	            watcher.start(filename, persistent, interval, bigint);
	            this.statWatchers[filename] = watcher;
	        }
	        watcher.addListener('change', listener);
	        return watcher;
	    }
	    unwatchFile(path, listener) {
	        const filename = (0, util_3.pathToFilename)(path);
	        const watcher = this.statWatchers[filename];
	        if (!watcher)
	            return;
	        if (typeof listener === 'function') {
	            watcher.removeListener('change', listener);
	        }
	        else {
	            watcher.removeAllListeners('change');
	        }
	        if (watcher.listenerCount('change') === 0) {
	            watcher.stop();
	            delete this.statWatchers[filename];
	        }
	    }
	    createReadStream(path, options) {
	        return new this.ReadStream(path, options);
	    }
	    createWriteStream(path, options) {
	        return new this.WriteStream(path, options);
	    }
	    watch(path, options, listener) {
	        const filename = (0, util_3.pathToFilename)(path);
	        let givenOptions = options;
	        if (typeof options === 'function') {
	            listener = options;
	            givenOptions = null;
	        }
	        // tslint:disable-next-line prefer-const
	        let { persistent, recursive, encoding, signal, throwIfNoEntry, ignore } = (0, options_1.getDefaultOpts)(givenOptions);
	        if (persistent === undefined)
	            persistent = true;
	        if (recursive === undefined)
	            recursive = false;
	        const watcher = new this.FSWatcher();
	        try {
	            watcher.start(filename, persistent, recursive, encoding, ignore);
	        }
	        catch (err) {
	            if (throwIfNoEntry === false && err.code === 'ENOENT')
	                return watcher;
	            throw err;
	        }
	        if (listener) {
	            watcher.addListener('change', listener);
	        }
	        if (signal) {
	            if (signal.aborted) {
	                watcher.close();
	            }
	            else {
	                const onAbort = () => watcher.close();
	                signal.addEventListener('abort', onAbort, { once: true });
	                watcher.once('close', () => signal.removeEventListener('abort', onAbort));
	            }
	        }
	        return watcher;
	    }
	    _statfs(filename, bigint = false) {
	        // Verify the path exists to match Node.js behavior
	        this._core.getResolvedLinkOrThrow(filename, 'statfs');
	        return StatFs_1.default.build(this._core, bigint);
	    }
	    statfsSync(path, options) {
	        const { bigint = false } = (0, options_1.getStatfsOptions)(options);
	        return this._statfs((0, util_3.pathToFilename)(path), bigint);
	    }
	    statfs(path, a, b) {
	        const [{ bigint = false }, callback] = (0, options_1.getStatfsOptsAndCb)(a, b);
	        this.wrapAsync(this._statfs, [(0, util_3.pathToFilename)(path), bigint], callback);
	    }
	    // ---------------------------------------------------------------- Tree View
	    toTree(opts = { separator: path_1.sep }) {
	        return (0, fs_print_1.toTreeSync)(this, opts);
	    }
	    // ---------------------------------------------------------------- Snapshots
	    toSnapshot(path = '/') {
	        return fsSnapshot.toSnapshotSync({ fs: this, path });
	    }
	    fromSnapshot(snapshot, path = '/') {
	        return fsSnapshot.fromSnapshotSync(snapshot, { fs: this, path });
	    }
	    toBinarySnapshot(path = '/') {
	        return fsSnapshot.toBinarySnapshotSync({ fs: this, path });
	    }
	    fromBinarySnapshot(binary, path = '/') {
	        return fsSnapshot.fromBinarySnapshotSync(binary, { fs: this, path });
	    }
	    toJsonSnapshot(path = '/') {
	        const uint8 = fsSnapshot.toJsonSnapshotSync({ fs: this, path });
	        return buffer_1.Buffer.from(uint8).toString('utf8');
	    }
	    fromJsonSnapshot(json, path = '/') {
	        const uint8 = new Uint8Array(buffer_1.Buffer.from(json, 'utf8'));
	        return fsSnapshot.fromJsonSnapshotSync(uint8, { fs: this, path });
	    }
	}
	volume.Volume = Volume;
	Volume.fromJSON = (json, cwd, opts) => new Volume(fs_core_1.Superblock.fromJSON(json, cwd, opts));
	Volume.fromNestedJSON = (json, cwd, opts) => new Volume(fs_core_1.Superblock.fromNestedJSON(json, cwd, opts));
	function emitStop(self) {
	    self.emit('stop');
	}
	/** All-zero stats passed to `watchFile` listeners when the file is missing, like in Node.js. */
	function buildZeroStats(bigint) {
	    const stats = new Stats_1.default();
	    const zero = bigint ? BigInt(0) : 0;
	    const epoch = new Date(0);
	    stats.uid = zero;
	    stats.gid = zero;
	    stats.rdev = zero;
	    stats.blksize = zero;
	    stats.ino = zero;
	    stats.size = zero;
	    stats.blocks = zero;
	    stats.atime = epoch;
	    stats.mtime = epoch;
	    stats.ctime = epoch;
	    stats.birthtime = epoch;
	    stats.atimeMs = zero;
	    stats.mtimeMs = zero;
	    stats.ctimeMs = zero;
	    stats.birthtimeMs = zero;
	    if (bigint) {
	        stats.atimeNs = zero;
	        stats.mtimeNs = zero;
	        stats.ctimeNs = zero;
	        stats.birthtimeNs = zero;
	    }
	    stats.dev = zero;
	    stats.mode = zero;
	    stats.nlink = zero;
	    return stats;
	}
	class StatWatcher extends events_1.EventEmitter {
	    constructor(vol) {
	        super();
	        this.bigint = false;
	        this.fileExists = false;
	        this.stopped = false;
	        this.onInterval = () => {
	            if (this.stopped)
	                return;
	            const stats = this.statSafe();
	            if (stats) {
	                if (!this.fileExists) {
	                    // Reappearance: `prev` is the stats from before the file disappeared, not the zeroed stats.
	                    this.fileExists = true;
	                    const prev = this.prev;
	                    this.prev = stats;
	                    this.emit('change', stats, prev);
	                }
	                else if (this.hasChanged(stats)) {
	                    const prev = this.prev;
	                    this.prev = stats;
	                    this.emit('change', stats, prev);
	                }
	            }
	            else if (this.fileExists) {
	                // Disappearance is reported once, with zeroed current stats, `prev`
	                // keeps the last real stats for the eventual reappearance event.
	                this.fileExists = false;
	                this.emit('change', buildZeroStats(this.bigint), this.prev);
	            }
	            this.loop();
	        };
	        this.vol = vol;
	    }
	    loop() {
	        clearTimeout(this.timeoutRef);
	        this.timeoutRef = this.setTimeout(this.onInterval, this.interval);
	    }
	    hasChanged(stats) {
	        const prev = this.prev;
	        return (stats.mtimeMs !== prev.mtimeMs ||
	            stats.ctimeMs !== prev.ctimeMs ||
	            stats.size !== prev.size ||
	            stats.ino !== prev.ino ||
	            stats.mode !== prev.mode ||
	            stats.uid !== prev.uid ||
	            stats.gid !== prev.gid ||
	            stats.nlink !== prev.nlink);
	    }
	    statSafe() {
	        try {
	            return (this.bigint ? this.vol.statSync(this.filename, { bigint: true }) : this.vol.statSync(this.filename));
	        }
	        catch {
	            return null;
	        }
	    }
	    start(path, persistent = true, interval = 5007, bigint = false) {
	        this.filename = (0, util_3.pathToFilename)(path);
	        this.setTimeout = persistent
	            ? setTimeout.bind(typeof globalThis !== 'undefined' ? globalThis : commonjsGlobal)
	            : setTimeoutUnref_1.default;
	        this.interval = interval;
	        this.bigint = bigint;
	        const stats = this.statSafe();
	        if (stats) {
	            this.prev = stats;
	            this.fileExists = true;
	        }
	        else {
	            // Watching a missing path does not throw, the listener is called once
	            // with zeroed stats, then again when the file is created.
	            this.prev = buildZeroStats(bigint);
	            this.fileExists = false;
	            queueMicrotask(() => {
	                if (!this.stopped)
	                    this.emit('change', this.prev, this.prev);
	            });
	        }
	        this.loop();
	    }
	    stop() {
	        this.stopped = true;
	        clearTimeout(this.timeoutRef);
	        queueMicrotask(() => {
	            emitStop.call(this, this);
	        });
	    }
	    /**
	     * Keep the event loop alive while the watcher is active. Polling continues
	     * either way; this only controls whether the process is kept running.
	     */
	    ref() {
	        this.setTimeout = setTimeout.bind(typeof globalThis !== 'undefined' ? globalThis : commonjsGlobal);
	        const ref = this.timeoutRef;
	        if (ref && typeof ref === 'object' && typeof ref.ref === 'function')
	            ref.ref();
	        return this;
	    }
	    /** Let the process exit while the watcher is active. Polling continues. */
	    unref() {
	        this.setTimeout = setTimeoutUnref_1.default;
	        const ref = this.timeoutRef;
	        if (ref && typeof ref === 'object' && typeof ref.unref === 'function')
	            ref.unref();
	        return this;
	    }
	}
	volume.StatWatcher = StatWatcher;
	/* tslint:disable no-var-keyword prefer-const */
	// ---------------------------------------- ReadStream
	var pool;
	function allocNewPool(poolSize) {
	    pool = (0, buffer_1.bufferAllocUnsafe)(poolSize);
	    pool.used = 0;
	}
	(0, util_2.inherits)(FsReadStream, stream_1.Readable);
	volume.ReadStream = FsReadStream;
	function FsReadStream(vol, path, options) {
	    if (!(this instanceof FsReadStream))
	        return new FsReadStream(vol, path, options);
	    this._vol = vol;
	    // a little bit bigger buffer and water marks by default
	    options = Object.assign({}, (0, options_1.getOptions)(options, {}));
	    if (options.highWaterMark === undefined)
	        options.highWaterMark = 64 * 1024;
	    stream_1.Readable.call(this, options);
	    this.path = (0, util_3.pathToFilename)(path);
	    this._fileHandle = options.fd && typeof options.fd !== 'number' ? options.fd : null;
	    this.fd = options.fd === undefined ? null : typeof options.fd !== 'number' ? options.fd.fd : options.fd;
	    this.flags = options.flags === undefined ? 'r' : options.flags;
	    this.mode = options.mode === undefined ? 0o666 : options.mode;
	    this.start = options.start;
	    this.end = options.end;
	    this.autoClose = options.autoClose === undefined ? true : options.autoClose;
	    this.pos = undefined;
	    this.bytesRead = 0;
	    if (this.start !== undefined) {
	        if (typeof this.start !== 'number') {
	            throw new TypeError('"start" option must be a Number');
	        }
	        if (this.end === undefined) {
	            this.end = Infinity;
	        }
	        else if (typeof this.end !== 'number') {
	            throw new TypeError('"end" option must be a Number');
	        }
	        if (this.start > this.end) {
	            throw new Error('"start" option must be <= "end" option');
	        }
	        this.pos = this.start;
	    }
	    if (typeof this.fd !== 'number')
	        this.open();
	    this.on('end', function () {
	        if (this.autoClose) {
	            if (this.destroy)
	                this.destroy();
	        }
	    });
	}
	FsReadStream.prototype.open = function () {
	    var self = this; // tslint:disable-line no-this-assignment
	    this._vol.open(this.path, this.flags, this.mode, (er, fd) => {
	        if (er) {
	            if (self.autoClose) {
	                if (self.destroy)
	                    self.destroy();
	            }
	            self.emit('error', er);
	            return;
	        }
	        self.fd = fd;
	        self.emit('open', fd);
	        // start the flow of data.
	        self.read();
	    });
	};
	FsReadStream.prototype._read = function (n) {
	    if (typeof this.fd !== 'number') {
	        return this.once('open', function () {
	            this._read(n);
	        });
	    }
	    if (this.destroyed)
	        return;
	    if (!pool || pool.length - pool.used < kMinPoolSpace) {
	        // discard the old pool.
	        allocNewPool(this._readableState.highWaterMark);
	    }
	    // Grab another reference to the pool in the case that while we're
	    // in the thread pool another read() finishes up the pool, and
	    // allocates a new one.
	    var thisPool = pool;
	    var toRead = Math.min(pool.length - pool.used, n);
	    var start = pool.used;
	    if (this.pos !== undefined)
	        toRead = Math.min(this.end - this.pos + 1, toRead);
	    // already read everything we were supposed to read!
	    // treat as EOF.
	    if (toRead <= 0)
	        return this.push(null);
	    // the actual read.
	    var self = this; // tslint:disable-line no-this-assignment
	    this._vol.read(this.fd, pool, pool.used, toRead, this.pos, onread);
	    // move the pool positions, and internal position for reading.
	    if (this.pos !== undefined)
	        this.pos += toRead;
	    pool.used += toRead;
	    function onread(er, bytesRead) {
	        if (er) {
	            if (self.autoClose && self.destroy) {
	                self.destroy();
	            }
	            self.emit('error', er);
	        }
	        else {
	            var b = null;
	            if (bytesRead > 0) {
	                self.bytesRead += bytesRead;
	                b = thisPool.slice(start, start + bytesRead);
	            }
	            self.push(b);
	        }
	    }
	};
	FsReadStream.prototype._destroy = function (err, cb) {
	    this.close(err2 => {
	        cb(err || err2);
	    });
	};
	FsReadStream.prototype.close = function (cb) {
	    if (cb)
	        this.once('close', cb);
	    if (this.closed || typeof this.fd !== 'number') {
	        if (typeof this.fd !== 'number') {
	            this.once('open', closeOnOpen);
	            return;
	        }
	        return queueMicrotask(() => this.emit('close'));
	    }
	    // Since Node 18, there is only a getter for '.closed'.
	    // The first branch mimics other setters from Readable.
	    // See https://github.com/nodejs/node/blob/v18.0.0/lib/internal/streams/readable.js#L1243
	    if (typeof this._readableState?.closed === 'boolean') {
	        this._readableState.closed = true;
	    }
	    else {
	        this.closed = true;
	    }
	    if (this._fileHandle) {
	        this._fileHandle.close().then(() => this.emit('close'), er => this.emit('error', er));
	    }
	    else {
	        this._vol.close(this.fd, er => {
	            if (er)
	                this.emit('error', er);
	            else
	                this.emit('close');
	        });
	    }
	    this.fd = null;
	};
	// needed because as it will be called with arguments
	// that does not match this.close() signature
	function closeOnOpen(fd) {
	    this.close();
	}
	(0, util_2.inherits)(FsWriteStream, stream_1.Writable);
	volume.WriteStream = FsWriteStream;
	function FsWriteStream(vol, path, options) {
	    if (!(this instanceof FsWriteStream))
	        return new FsWriteStream(vol, path, options);
	    this._vol = vol;
	    options = Object.assign({}, (0, options_1.getOptions)(options, {}));
	    stream_1.Writable.call(this, options);
	    this.path = (0, util_3.pathToFilename)(path);
	    this._fileHandle = options.fd && typeof options.fd !== 'number' ? options.fd : null;
	    this.fd = options.fd === undefined ? null : typeof options.fd !== 'number' ? options.fd.fd : options.fd;
	    this.flags = options.flags === undefined ? 'w' : options.flags;
	    this.mode = options.mode === undefined ? 0o666 : options.mode;
	    this.start = options.start;
	    this.autoClose = options.autoClose === undefined ? true : !!options.autoClose;
	    this.pos = undefined;
	    this.bytesWritten = 0;
	    this.pending = true;
	    if (this.start !== undefined) {
	        if (typeof this.start !== 'number') {
	            throw new TypeError('"start" option must be a Number');
	        }
	        if (this.start < 0) {
	            throw new Error('"start" must be >= zero');
	        }
	        this.pos = this.start;
	    }
	    if (options.encoding)
	        this.setDefaultEncoding(options.encoding);
	    if (typeof this.fd !== 'number')
	        this.open();
	    // dispose on finish.
	    this.once('finish', function () {
	        if (this.autoClose) {
	            this.close();
	        }
	    });
	}
	FsWriteStream.prototype.open = function () {
	    this._vol.open(this.path, this.flags, this.mode, function (er, fd) {
	        if (er) {
	            if (this.autoClose && this.destroy) {
	                this.destroy();
	            }
	            this.emit('error', er);
	            return;
	        }
	        this.fd = fd;
	        this.pending = false;
	        this.emit('open', fd);
	    }.bind(this));
	};
	FsWriteStream.prototype._write = function (data, encoding, cb) {
	    if (!(data instanceof buffer_1.Buffer || data instanceof Uint8Array))
	        return this.emit('error', new Error('Invalid data'));
	    if (typeof this.fd !== 'number') {
	        return this.once('open', function () {
	            this._write(data, encoding, cb);
	        });
	    }
	    var self = this; // tslint:disable-line no-this-assignment
	    this._vol.write(this.fd, data, 0, data.length, this.pos, (er, bytes) => {
	        if (er) {
	            if (self.autoClose && self.destroy) {
	                self.destroy();
	            }
	            return cb(er);
	        }
	        self.bytesWritten += bytes;
	        cb();
	    });
	    if (this.pos !== undefined)
	        this.pos += data.length;
	};
	FsWriteStream.prototype._writev = function (data, cb) {
	    if (typeof this.fd !== 'number') {
	        return this.once('open', function () {
	            this._writev(data, cb);
	        });
	    }
	    const self = this; // tslint:disable-line no-this-assignment
	    const len = data.length;
	    const chunks = new Array(len);
	    var size = 0;
	    for (var i = 0; i < len; i++) {
	        var chunk = data[i].chunk;
	        chunks[i] = chunk;
	        size += chunk.length;
	    }
	    const buf = buffer_1.Buffer.concat(chunks);
	    this._vol.write(this.fd, buf, 0, buf.length, this.pos, (er, bytes) => {
	        if (er) {
	            if (self.destroy)
	                self.destroy();
	            return cb(er);
	        }
	        self.bytesWritten += bytes;
	        cb();
	    });
	    if (this.pos !== undefined)
	        this.pos += size;
	};
	FsWriteStream.prototype.close = function (cb) {
	    if (cb)
	        this.once('close', cb);
	    if (this.closed || typeof this.fd !== 'number') {
	        if (typeof this.fd !== 'number') {
	            this.once('open', closeOnOpen);
	            return;
	        }
	        return queueMicrotask(() => this.emit('close'));
	    }
	    // Since Node 18, there is only a getter for '.closed'.
	    // The first branch mimics other setters from Writable.
	    // See https://github.com/nodejs/node/blob/v18.0.0/lib/internal/streams/writable.js#L766
	    if (typeof this._writableState?.closed === 'boolean') {
	        this._writableState.closed = true;
	    }
	    else {
	        this.closed = true;
	    }
	    if (this._fileHandle) {
	        this._fileHandle.close().then(() => this.emit('close'), er => this.emit('error', er));
	    }
	    else {
	        this._vol.close(this.fd, er => {
	            if (er)
	                this.emit('error', er);
	            else
	                this.emit('close');
	        });
	    }
	    this.fd = null;
	};
	FsWriteStream.prototype._destroy = FsReadStream.prototype._destroy;
	// There is no shutdown() for files.
	FsWriteStream.prototype.destroySoon = FsWriteStream.prototype.end;
	// ---------------------------------------- FSWatcher
	class FSWatcher extends events_1.EventEmitter {
	    constructor(vol) {
	        super();
	        this._filename = '';
	        this._filenameEncoded = '';
	        this._recursive = false;
	        this._encoding = fs_node_utils_1.ENCODING_UTF8;
	        this._closed = false;
	        this._onEvent = (event) => {
	            switch (event.type) {
	                case 0 /* FsEventType.CREATE */:
	                case 1 /* FsEventType.DELETE */:
	                    this._emit('rename', event.steps);
	                    break;
	                case 4 /* FsEventType.MOVE */:
	                    if (event.oldSteps)
	                        this._emit('rename', event.oldSteps);
	                    this._emit('rename', event.steps);
	                    break;
	                case 2 /* FsEventType.MODIFY */:
	                case 3 /* FsEventType.ATTRIB */:
	                    this._emit('change', event.steps);
	                    break;
	            }
	        };
	        this._persist = () => {
	            this._timer = setTimeout(this._persist, 1e6);
	        };
	        this._vol = vol;
	    }
	    _emit(type, relativeSteps) {
	        const filename = relativeSteps.length ? relativeSteps.join(pathSep) : this._watcher.link.getName();
	        if (this._ignore && this._ignore(filename))
	            return;
	        this.emit('change', type, (0, fs_node_utils_1.strToEncoding)(filename, this._encoding));
	    }
	    /**
	     * Keep the event loop alive while the watcher is active. All watchers are
	     * ref'ed by default (unless started with `persistent: false`). No-op when
	     * already ref'ed, closed, or never started.
	     */
	    ref() {
	        if (this._watcher && !this._closed && !this._timer)
	            this._persist();
	        return this;
	    }
	    /**
	     * Let the process exit while the watcher is active. Events are still
	     * delivered. No-op when already unref'ed.
	     */
	    unref() {
	        clearTimeout(this._timer);
	        this._timer = undefined;
	        return this;
	    }
	    start(path, persistent = true, recursive = false, encoding = fs_node_utils_1.ENCODING_UTF8, ignore) {
	        this._filename = (0, util_3.pathToFilename)(path);
	        this._steps = (0, fs_core_1.filenameToSteps)(this._filename);
	        this._filenameEncoded = (0, fs_node_utils_1.strToEncoding)(this._filename);
	        this._recursive = recursive;
	        this._encoding = encoding;
	        this._ignore = ignore === undefined ? undefined : (0, fs_node_utils_1.watchIgnoreToMatcher)(ignore);
	        try {
	            this._watcher = new fs_core_1.CoreWatcher(this._vol._core, this._filename, { recursive });
	        }
	        catch (err) {
	            const error = new Error(`watch ${this._filename} ${err.code}`);
	            error.code = err.code;
	            error.errno = err.code;
	            throw error;
	        }
	        this._link = this._watcher.link;
	        this._watcher.changes.listen(this._onEvent);
	        if (persistent)
	            this._persist();
	    }
	    close() {
	        clearTimeout(this._timer);
	        this._timer = undefined;
	        if (!this._watcher || this._closed)
	            return;
	        this._closed = true;
	        this._watcher.close();
	        queueMicrotask(() => this.emit('close'));
	    }
	}
	volume.FSWatcher = FSWatcher;
	
	return volume;
}

var fsCallbackApiList = {};

var hasRequiredFsCallbackApiList;

function requireFsCallbackApiList () {
	if (hasRequiredFsCallbackApiList) return fsCallbackApiList;
	hasRequiredFsCallbackApiList = 1;
	Object.defineProperty(fsCallbackApiList, "__esModule", { value: true });
	fsCallbackApiList.fsCallbackApiList = void 0;
	fsCallbackApiList.fsCallbackApiList = [
	    'access',
	    'appendFile',
	    'chmod',
	    'chown',
	    'close',
	    'copyFile',
	    'cp',
	    'createReadStream',
	    'createWriteStream',
	    'exists',
	    'fchmod',
	    'fchown',
	    'fdatasync',
	    'fstat',
	    'fsync',
	    'ftruncate',
	    'futimes',
	    'glob',
	    'lchmod',
	    'lchown',
	    'link',
	    'lstat',
	    'mkdir',
	    'mkdtemp',
	    'open',
	    'openAsBlob',
	    'opendir',
	    'read',
	    'readv',
	    'readdir',
	    'readFile',
	    'readlink',
	    'realpath',
	    'rename',
	    'rm',
	    'rmdir',
	    'stat',
	    'statfs',
	    'symlink',
	    'truncate',
	    'unlink',
	    'unwatchFile',
	    'utimes',
	    'lutimes',
	    'watch',
	    'watchFile',
	    'write',
	    'writev',
	    'writeFile',
	];
	
	return fsCallbackApiList;
}

var fsSynchronousApiList = {};

var hasRequiredFsSynchronousApiList;

function requireFsSynchronousApiList () {
	if (hasRequiredFsSynchronousApiList) return fsSynchronousApiList;
	hasRequiredFsSynchronousApiList = 1;
	Object.defineProperty(fsSynchronousApiList, "__esModule", { value: true });
	fsSynchronousApiList.fsSynchronousApiList = void 0;
	fsSynchronousApiList.fsSynchronousApiList = [
	    'accessSync',
	    'appendFileSync',
	    'chmodSync',
	    'chownSync',
	    'closeSync',
	    'copyFileSync',
	    'cpSync',
	    'existsSync',
	    'fchmodSync',
	    'fchownSync',
	    'fdatasyncSync',
	    'fstatSync',
	    'fsyncSync',
	    'ftruncateSync',
	    'futimesSync',
	    'globSync',
	    'lchmodSync',
	    'lchownSync',
	    'linkSync',
	    'lstatSync',
	    'mkdirSync',
	    'mkdtempSync',
	    'openSync',
	    'opendirSync',
	    'readdirSync',
	    'readFileSync',
	    'readlinkSync',
	    'readSync',
	    'readvSync',
	    'realpathSync',
	    'renameSync',
	    'rmdirSync',
	    'rmSync',
	    'statfsSync',
	    'statSync',
	    'symlinkSync',
	    'truncateSync',
	    'unlinkSync',
	    'utimesSync',
	    'lutimesSync',
	    'writeFileSync',
	    'writeSync',
	    'writevSync',
	];
	
	return fsSynchronousApiList;
}

var fsCommonObjectsList = {};

var hasRequiredFsCommonObjectsList;

function requireFsCommonObjectsList () {
	if (hasRequiredFsCommonObjectsList) return fsCommonObjectsList;
	hasRequiredFsCommonObjectsList = 1;
	Object.defineProperty(fsCommonObjectsList, "__esModule", { value: true });
	fsCommonObjectsList.fsCommonObjectsList = void 0;
	fsCommonObjectsList.fsCommonObjectsList = [
	    'F_OK',
	    'R_OK',
	    'W_OK',
	    'X_OK',
	    'constants',
	    'Stats',
	    'StatFs',
	    'Dir',
	    'Dirent',
	    'StatWatcher',
	    'FSWatcher',
	    'ReadStream',
	    'WriteStream',
	];
	
	return fsCommonObjectsList;
}

var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$7;
	hasRequiredLib$1 = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.fsCommonObjectsList = exports.fsSynchronousApiList = exports.fsCallbackApiList = exports.FsPromises = exports.Dir = exports.FileHandle = exports.StatFs = exports.Dirent = exports.Stats = exports.toUnixTimestamp = exports.FSWatcher = exports.StatWatcher = exports.Volume = void 0;
		const tslib_1 = require$$0$2;
		var volume_1 = requireVolume();
		Object.defineProperty(exports, "Volume", { enumerable: true, get: function () { return volume_1.Volume; } });
		Object.defineProperty(exports, "StatWatcher", { enumerable: true, get: function () { return volume_1.StatWatcher; } });
		Object.defineProperty(exports, "FSWatcher", { enumerable: true, get: function () { return volume_1.FSWatcher; } });
		Object.defineProperty(exports, "toUnixTimestamp", { enumerable: true, get: function () { return volume_1.toUnixTimestamp; } });
		var Stats_1 = requireStats();
		Object.defineProperty(exports, "Stats", { enumerable: true, get: function () { return Stats_1.default; } });
		var Dirent_1 = requireDirent();
		Object.defineProperty(exports, "Dirent", { enumerable: true, get: function () { return Dirent_1.default; } });
		var StatFs_1 = requireStatFs();
		Object.defineProperty(exports, "StatFs", { enumerable: true, get: function () { return StatFs_1.default; } });
		var FileHandle_1 = requireFileHandle();
		Object.defineProperty(exports, "FileHandle", { enumerable: true, get: function () { return FileHandle_1.FileHandle; } });
		var Dir_1 = requireDir();
		Object.defineProperty(exports, "Dir", { enumerable: true, get: function () { return Dir_1.Dir; } });
		var FsPromises_1 = requireFsPromises();
		Object.defineProperty(exports, "FsPromises", { enumerable: true, get: function () { return FsPromises_1.FsPromises; } });
		tslib_1.__exportStar(requireOptions(), exports);
		tslib_1.__exportStar(requireUtil$1(), exports);
		tslib_1.__exportStar(requireGlob(), exports);
		var fsCallbackApiList_1 = requireFsCallbackApiList();
		Object.defineProperty(exports, "fsCallbackApiList", { enumerable: true, get: function () { return fsCallbackApiList_1.fsCallbackApiList; } });
		var fsSynchronousApiList_1 = requireFsSynchronousApiList();
		Object.defineProperty(exports, "fsSynchronousApiList", { enumerable: true, get: function () { return fsSynchronousApiList_1.fsSynchronousApiList; } });
		var fsCommonObjectsList_1 = requireFsCommonObjectsList();
		Object.defineProperty(exports, "fsCommonObjectsList", { enumerable: true, get: function () { return fsCommonObjectsList_1.fsCommonObjectsList; } });
		
	} (lib$7));
	return lib$7;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib$8.exports;
	hasRequiredLib = 1;
	(function (module, exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.memfs = exports.fs = exports.vol = exports.Volume = void 0;
		exports.createFsFromVolume = createFsFromVolume;
		const fs_node_1 = requireLib$1();
		Object.defineProperty(exports, "Volume", { enumerable: true, get: function () { return fs_node_1.Volume; } });
		const fs_node_utils_1 = requireLib$7();
		const { F_OK, R_OK, W_OK, X_OK } = fs_node_utils_1.constants;
		// Default volume.
		exports.vol = new fs_node_1.Volume();
		function createFsFromVolume(vol) {
		    const fs = { F_OK, R_OK, W_OK, X_OK, constants: fs_node_utils_1.constants, Stats: fs_node_1.Stats, Dirent: fs_node_1.Dirent };
		    // Bind FS methods.
		    for (const method of fs_node_1.fsSynchronousApiList)
		        if (typeof vol[method] === 'function')
		            fs[method] = vol[method].bind(vol);
		    for (const method of fs_node_1.fsCallbackApiList)
		        if (typeof vol[method] === 'function')
		            fs[method] = vol[method].bind(vol);
		    fs.StatWatcher = vol.StatWatcher;
		    fs.FSWatcher = vol.FSWatcher;
		    fs.WriteStream = vol.WriteStream;
		    fs.ReadStream = vol.ReadStream;
		    fs.promises = vol.promises;
		    // Handle realpath and realpathSync with their .native properties
		    if (typeof vol.realpath === 'function') {
		        fs.realpath = vol.realpath.bind(vol);
		        if (typeof vol.realpath.native === 'function') {
		            fs.realpath.native = vol.realpath.native.bind(vol);
		        }
		    }
		    if (typeof vol.realpathSync === 'function') {
		        fs.realpathSync = vol.realpathSync.bind(vol);
		        if (typeof vol.realpathSync.native === 'function') {
		            fs.realpathSync.native = vol.realpathSync.native.bind(vol);
		        }
		    }
		    fs._toUnixTimestamp = fs_node_1.toUnixTimestamp;
		    fs.__vol = vol;
		    return fs;
		}
		exports.fs = createFsFromVolume(exports.vol);
		/**
		 * Creates a new file system instance.
		 *
		 * @param json File system structure expressed as a JSON object.
		 *        Use `null` for empty directories and empty string for empty files.
		 * @param cwdOrOpts Current working directory (string) or options object.
		 *        The JSON structure will be created relative to the cwd path.
		 * @returns A `memfs` file system instance, which is a drop-in replacement for
		 *          the `fs` module.
		 */
		const memfs = (json = {}, cwdOrOpts = '/') => {
		    const opts = typeof cwdOrOpts === 'string' ? { cwd: cwdOrOpts } : cwdOrOpts;
		    // When no explicit cwd is given but a custom process is provided, let the
		    // Superblock use that process's cwd(). Otherwise default to '/' so the
		    // convenience function keeps its opinionated virtual-root default.
		    const cwd = opts.cwd ?? (opts.process ? undefined : '/');
		    const vol = fs_node_1.Volume.fromNestedJSON(json, cwd, { process: opts.process });
		    const fs = createFsFromVolume(vol);
		    return { fs, vol };
		};
		exports.memfs = memfs;
		module.exports = { ...module.exports, ...exports.fs };
		module.exports.semantic = true;
		
	} (lib$8, lib$8.exports));
	return lib$8.exports;
}

var libExports = requireLib();
var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

var memfsExported = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: index
}, [libExports]);

const { createFsFromVolume, Volume, fs, memfs } = memfsExported;

export { Buffer, Volume, createFsFromVolume, fs, memfs, memfsExported };
