"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i2 = 0; i2 < list.length; i2++) {
    map[list[i2]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i2 = 0; i2 < value.length; i2++) {
      const item = value[i2];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      const normalized = normalizeClass(value[i2]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$2(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$2(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i2 = arr.indexOf(el);
  if (i2 > -1) {
    arr.splice(i2, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn$1 = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return isObject$2(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn2) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn2(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i2 = 0; i2 < fns.length; i2++) {
    fns[i2](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
const LINEFEED = "\n";
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i2 = 0; i2 < fns.length; i2++) {
    ret = fns[i2](arg);
  }
  return ret;
};
function once(fn2, ctx = null) {
  let res;
  return (...args) => {
    if (fn2) {
      res = fn2.apply(ctx, args);
      fn2 = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x2) => x2.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const E$1 = function() {
};
E$1.prototype = {
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx
    });
    return this;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i2 = 0;
    var len = evtArr.length;
    for (i2; i2 < len; i2++) {
      evtArr[i2].fn.apply(evtArr[i2].ctx, data);
    }
    return this;
  },
  off: function(name, callback) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && callback) {
      for (var i2 = 0, len = evts.length; i2 < len; i2++) {
        if (evts[i2].fn !== callback && evts[i2].fn._ !== callback)
          liveEvents.push(evts[i2]);
      }
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1$1 = E$1;
const isObject$1 = (val) => val !== null && typeof val === "object";
const defaultDelimiters = ["{", "}"];
class BaseFormatter {
  constructor() {
    this._caches = /* @__PURE__ */ Object.create(null);
  }
  interpolate(message, values, delimiters = defaultDelimiters) {
    if (!values) {
      return [message];
    }
    let tokens = this._caches[message];
    if (!tokens) {
      tokens = parse(message, delimiters);
      this._caches[message] = tokens;
    }
    return compile$1(tokens, values);
  }
}
const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, [startDelimiter, endDelimiter]) {
  const tokens = [];
  let position = 0;
  let text = "";
  while (position < format.length) {
    let char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({ type: "text", value: text });
      }
      text = "";
      let sub = "";
      char = format[position++];
      while (char !== void 0 && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      const isClosed = char === endDelimiter;
      const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
      tokens.push({ value: sub, type });
    } else {
      text += char;
    }
  }
  text && tokens.push({ type: "text", value: text });
  return tokens;
}
function compile$1(tokens, values) {
  const compiled = [];
  let index2 = 0;
  const mode = Array.isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
  if (mode === "unknown") {
    return compiled;
  }
  while (index2 < tokens.length) {
    const token = tokens[index2];
    switch (token.type) {
      case "text":
        compiled.push(token.value);
        break;
      case "list":
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case "named":
        if (mode === "named") {
          compiled.push(values[token.value]);
        } else {
          {
            console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
          }
        }
        break;
      case "unknown":
        {
          console.warn(`Detect 'unknown' type of token!`);
        }
        break;
    }
    index2++;
  }
  return compiled;
}
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  const lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
class I18n {
  constructor({ locale, fallbackLocale, messages, watcher, formater }) {
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  setLocale(locale) {
    const oldLocale = this.locale;
    this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
    if (!this.messages[this.locale]) {
      this.messages[this.locale] = {};
    }
    this.message = this.messages[this.locale];
    if (oldLocale !== this.locale) {
      this.watchers.forEach((watcher) => {
        watcher(this.locale, oldLocale);
      });
    }
  }
  getLocale() {
    return this.locale;
  }
  watchLocale(fn2) {
    const index2 = this.watchers.push(fn2) - 1;
    return () => {
      this.watchers.splice(index2, 1);
    };
  }
  add(locale, message, override = true) {
    const curMessages = this.messages[locale];
    if (curMessages) {
      if (override) {
        Object.assign(curMessages, message);
      } else {
        Object.keys(message).forEach((key) => {
          if (!hasOwn(curMessages, key)) {
            curMessages[key] = message[key];
          }
        });
      }
    } else {
      this.messages[locale] = message;
    }
  }
  f(message, values, delimiters) {
    return this.formater.interpolate(message, values, delimiters).join("");
  }
  t(key, locale, values) {
    let message = this.message;
    if (typeof locale === "string") {
      locale = normalizeLocale(locale, this.messages);
      locale && (message = this.messages[locale]);
    } else {
      values = locale;
    }
    if (!hasOwn(message, key)) {
      console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
      return key;
    }
    return this.formater.interpolate(message[key], values).join("");
  }
}
function watchAppLocale(appVm, i18n) {
  if (appVm.$watchLocale) {
    appVm.$watchLocale((newLocale) => {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(() => appVm.$locale, (newLocale) => {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof index !== "undefined" && index.getLocale) {
    return index.getLocale();
  }
  if (typeof global !== "undefined" && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
  if (typeof locale !== "string") {
    [locale, messages] = [
      messages,
      locale
    ];
  }
  if (typeof locale !== "string") {
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== "string") {
    fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  const i18n = new I18n({
    locale,
    fallbackLocale,
    messages,
    watcher
  });
  let t2 = (key, values) => {
    if (typeof getApp !== "function") {
      t2 = function(key2, values2) {
        return i18n.t(key2, values2);
      };
    } else {
      let isWatchedAppLocale = false;
      t2 = function(key2, values2) {
        const appVm = getApp().$vm;
        if (appVm) {
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key2, values2);
      };
    }
    return t2(key, values);
  };
  return {
    i18n,
    f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t(key, values) {
      return t2(key, values);
    },
    add(locale2, message, override = true) {
      return i18n.add(locale2, message, override);
    },
    watch(fn2) {
      return i18n.watchLocale(fn2);
    },
    getLocale() {
      return i18n.getLocale();
    },
    setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
function getBaseSystemInfo() {
  return wx.getSystemInfoSync();
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp$1(key, data[key], protocol[key], !hasOwn$1(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i2 = 0; i2 < len; i2++) {
    const opts = protocol[i2];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i2) {
      data[opts.name] = args[i2];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp$1(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType$1(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage$1(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType$1(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn2) {
  return function() {
    try {
      return fn2.apply(fn2, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn2 = args[name];
    if (isFunction(fn2)) {
      apiCallbacks[name] = tryCatch(fn2);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg$1(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg$1(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook) {
  return function(data) {
    return hook(data) || data;
  };
}
function queue$1(hooks, data) {
  let promise = false;
  for (let i2 = 0; i2 < hooks.length; i2++) {
    const hook = hooks[i2];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook));
    } else {
      const res = hook(data);
      if (isPromise$1(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue$1(hooks, res).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method2, returnValue) {
  const returnValueHooks = [];
  if (isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method2];
  if (interceptor && isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method2) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method2];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method2, api, options, params) {
  const interceptor = getApiInterceptorHooks(method2);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray(interceptor.invoke)) {
      const res = queue$1(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(interceptor, options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn2) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn2, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn2, extend(args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  const params = args[0];
  if (!options || !isPlainObject(options.formatArgs) && isPlainObject(params)) {
    return;
  }
  const formatArgs = options.formatArgs;
  const keys = Object.keys(formatArgs);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const name = keys[i2];
    const formatterOrDefaultValue = formatArgs[name];
    if (isFunction(formatterOrDefaultValue)) {
      const errMsg = formatterOrDefaultValue(args[0][name], params);
      if (isString(errMsg)) {
        return errMsg;
      }
    } else {
      if (!hasOwn$1(params, name)) {
        params[name] = formatterOrDefaultValue;
      }
    }
  }
}
function invokeSuccess(id, name, res) {
  return invokeCallback(id, extend(res || {}, { errMsg: name + ":ok" }));
}
function invokeFail(id, name, errMsg, errRes) {
  return invokeCallback(id, extend({ errMsg: name + ":fail" + (errMsg ? " " + errMsg : "") }, errRes));
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  if (options && options.beforeInvoke) {
    const errMsg2 = options.beforeInvoke(args);
    if (isString(errMsg2)) {
      return errMsg2;
    }
  }
  const errMsg = formatApiArgs(args, options);
  if (errMsg) {
    return errMsg;
  }
}
function normalizeErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    console.error(errMsg.message + LINEFEED + errMsg.stack);
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn2, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol, options);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn2(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, normalizeErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn2, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol, options);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn2.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn2, protocol, options) {
  return wrapperTaskApi(name, fn2, protocol, options);
}
function defineSyncApi(name, fn2, protocol, options) {
  return wrapperSyncApi(name, fn2, protocol, options);
}
function defineAsyncApi(name, fn2, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn2, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  const { platform, pixelRatio, windowWidth } = getBaseSystemInfo();
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i2 = 0; i2 < hooks.length; i2++) {
    if (res.indexOf(hooks[i2]) === -1) {
      res.push(hooks[i2]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method2, interceptor) => {
  if (isString(method2) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method2] || (scopedInterceptors[method2] = {}), interceptor);
  } else if (isPlainObject(method2)) {
    mergeInterceptorHook(globalInterceptors, method2);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method2, interceptor) => {
  if (isString(method2)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method2], interceptor);
    } else {
      delete scopedInterceptors[method2];
    }
  } else if (isPlainObject(method2)) {
    removeInterceptorHook(globalInterceptors, method2);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: Function
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
const emitter = new E$1$1();
const $on = defineSyncApi(API_ON, (name, callback) => {
  emitter.on(name, callback);
  return () => emitter.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  emitter.once(name, callback);
  return () => emitter.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!name) {
    emitter.e = {};
    return;
  }
  if (!isArray(name))
    name = [name];
  name.forEach((n2) => emitter.off(n2, callback));
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  emitter.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i2 = 0; i2 < onPushMessageCallbacks.length; i2++) {
      const callback = onPushMessageCallbacks[i2];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_2, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn2) => {
  if (onPushMessageCallbacks.indexOf(fn2) === -1) {
    onPushMessageCallbacks.push(fn2);
  }
};
const offPushMessage = (fn2) => {
  if (!fn2) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn2);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method2, returnValue) {
    return function(res) {
      return method2(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn$1(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ${methodName} \u6682\u4E0D\u652F\u6301 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn$1(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    return processArgs(methodName, res, returnValue, {}, keepReturnValue);
  }
  return function wrapper(methodName, method2) {
    if (!hasOwn$1(protocols2, methodName)) {
      return method2;
    }
    const protocol = protocols2[methodName];
    if (!protocol) {
      return function() {
        console.error(`\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301${methodName}`);
      };
    }
    return function(arg1, arg2) {
      let options = protocol;
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
};
const setLocale = (locale) => {
  const app = getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn2) => fn2({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn2) => {
  if (onLocaleChangeCallbacks.indexOf(fn2) === -1) {
    onLocaleChangeCallbacks.push(fn2);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback
};
function initUni(api, protocols2) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn$1(target, key)) {
        return target[key];
      }
      if (hasOwn$1(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn$1(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, wx[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:\u670D\u52A1[" + service + "]\u4E0D\u5B58\u5728"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_2, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  let osName = "";
  let osVersion = "";
  {
    osName = system.split(" ")[0] || "";
    osVersion = system.split(" ")[1] || "";
  }
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = language.replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__E8C0685",
    appName: "bugu-star-uniapp",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "3.6.1",
    uniRuntimeVersion: "3.6.1",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = language.replace(/_/g, "-");
    toRes = sortObject(extend(toRes, {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "__UNI__E8C0685",
      appName: "bugu-star-uniapp",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage)
    }));
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getProvider,
  createSelectorQuery
});
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  redirectTo,
  previewImage,
  getSystemInfo,
  getSystemInfoSync,
  showActionSheet,
  getDeviceInfo,
  getAppBaseInfo,
  getWindowInfo,
  getAppAuthorizeSetting
});
var index = initUni(shims, protocols);
function warn(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn2) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn2();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn(`cannot run an inactive effect scope.`);
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i2, l2;
      for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
        this.effects[i2].stop();
      }
      for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
        this.cleanups[i2]();
      }
      if (this.scopes) {
        for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
          this.scopes[i2].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i2 = 0; i2 < deps.length; i2++) {
      const dep = deps[i2];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
class ReactiveEffect {
  constructor(fn2, scheduler = null, scope) {
    this.fn = fn2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i2 = 0; i2 < deps.length; i2++) {
      deps[i2].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    const eventInfo = { effect: activeEffect, target, type, key };
    trackEffects(dep, eventInfo);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.onTrack) {
      activeEffect.onTrack(Object.assign({ effect: activeEffect }, debuggerEventExtraInfo));
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const eventInfo = { target, type, key, newValue, oldValue, oldTarget };
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0], eventInfo);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects), eventInfo);
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.onTrigger) {
      effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
    }
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
        track(arr, "get", i2 + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2 && targetIsArray && hasOwn$1(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn$1(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn$1(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set: set$1,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    {
      warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    {
      warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const shallowReadonlyHandlers = /* @__PURE__ */ extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method2, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method2 === "entries" || method2 === Symbol.iterator && targetIsMap;
    const isKeyOnly = method2 === "keys" && targetIsMap;
    const innerIterator = target[method2](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method2) => {
    mutableInstrumentations2[method2] = createIterableMethod(method2, false, false);
    readonlyInstrumentations2[method2] = createIterableMethod(method2, true, false);
    shallowInstrumentations2[method2] = createIterableMethod(method2, false, true);
    shallowReadonlyInstrumentations2[method2] = createIterableMethod(method2, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn$1(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target)) {
    {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()), {
        target: ref2,
        type: "get",
        key: "value"
      });
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep, {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      });
    }
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  if (!isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`);
  }
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      console.warn("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11, [
      msg + args.join(""),
      instance && instance.proxy,
      trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
      trace
    ]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i2) => {
    logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function callWithErrorHandling(fn2, instance, type, args) {
  let res;
  try {
    res = args ? fn2(...args) : fn2();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn2, instance, type, args) {
  if (isFunction(fn2)) {
    const res = callWithErrorHandling(fn2, instance, type, args);
    if (res && isPromise$1(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i2 = 0; i2 < fn2.length; i2++) {
    values.push(callWithAsyncErrorHandling(fn2[i2], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
          if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
const RECURSION_LIMIT = 100;
function nextTick(fn2) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i2 = queue.indexOf(job);
  if (i2 > flushIndex) {
    queue.splice(i2, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePreFlushCbs[preFlushIndex])) {
        continue;
      }
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  flushPreFlushCbs();
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    activePostFlushCbs.sort((a2, b2) => getId(a2) - getId(b2));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  flushPreFlushCbs(seen);
  queue.sort((a2, b2) => getId(a2) - getId(b2));
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn2) {
  if (!seen.has(fn2)) {
    seen.set(fn2, 1);
  } else {
    const count = seen.get(fn2);
    if (count > RECURSION_LIMIT) {
      const instance = fn2.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      warn$1(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`);
      return true;
    } else {
      seen.set(fn2, count + 1);
    }
  }
}
function emit(event, ...args) {
}
function devtoolsComponentEmit(component, event, params) {
  emit("component:emit", component.appContext.app, component, event, params);
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const { emitsOptions, propsOptions: [propsOptions] } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(`Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`);
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(`Invalid event arguments: event validation failed for event "${event}".`);
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => a2.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(`Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(instance, instance.type)} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(event)}" instead of "${event}".`);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn$1(options, key[0].toLowerCase() + key.slice(1)) || hasOwn$1(options, hyphenate(key)) || hasOwn$1(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(`\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`);
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(`watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`);
    }
    if (deep !== void 0) {
      warn$1(`watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`);
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(`Invalid watch source: `, s2, `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`);
  };
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return traverse(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn2) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn2, instance, 4);
    };
  };
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const effect = new ReactiveEffect(getter, scheduler);
  {
    effect.onTrack = onTrack;
    effect.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i2 = 0; i2 < segments.length && cur; i2++) {
      cur = cur[segments[i2]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i2 = 0; i2 < value.length; i2++) {
      traverse(value[i2], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey((ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, ""));
    warn$1(`${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`);
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component2, false);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = resolve(instance[type] || Component2[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(`resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`);
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const getPublicInstance = (i2) => {
  if (!i2)
    return null;
  if (isStatefulComponent(i2))
    return getExposeProxy(i2) || i2.proxy;
  return getPublicInstance(i2.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i2) => i2,
  $el: (i2) => i2.__$el || (i2.__$el = {}),
  $data: (i2) => i2.data,
  $props: (i2) => shallowReadonly(i2.props),
  $attrs: (i2) => shallowReadonly(i2.attrs),
  $slots: (i2) => shallowReadonly(i2.slots),
  $refs: (i2) => shallowReadonly(i2.refs),
  $parent: (i2) => getPublicInstance(i2.parent),
  $root: (i2) => getPublicInstance(i2.root),
  $emit: (i2) => i2.emit,
  $options: (i2) => resolveMergedOptions(i2),
  $forceUpdate: (i2) => i2.f || (i2.f = () => queueJob(i2.update)),
  $watch: (i2) => instanceWatch.bind(i2)
});
const isReservedPrefix = (key) => key === "_" || key === "$";
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    if (setupState !== EMPTY_OBJ && setupState.__isScriptSetup && hasOwn$1(setupState, key)) {
      return setupState[key];
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn$1(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn$1(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn$1(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn$1(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn$1(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn$1(data, key)) {
        warn$1(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`);
      } else if (instance === currentRenderingInstance) {
        warn$1(`Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`);
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn$1(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn$1(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn$1(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(`Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`, instance);
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn$1(data, key) || setupState !== EMPTY_OBJ && hasOwn$1(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn$1(normalizedProps, key) || hasOwn$1(ctx, key) || hasOwn$1(publicPropertiesMap, key) || hasOwn$1(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn$1(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(`Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`);
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const { ctx, propsOptions: [propsOptions] } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(`setup() return property ${JSON.stringify(key)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(`Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`);
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(`The data option must be a function. Plain object usage is no longer supported.`);
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise$1(data)) {
      warn$1(`data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`);
    }
    if (!isObject$2(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get3 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get3 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(`Write operation failed: computed property "${key}" is readonly.`);
      };
      const c2 = computed$1({
        get: get3,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v2) => c2.value = v2
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v2) => injected.value = v2
        });
      } else {
        {
          warn$1(`injected property "${key}" is a ref and will be auto-unwrapped and no longer needs \`.value\` in the next minor release. To opt-in to the new behavior now, set \`app.config.unwrapInjectedRef = true\` (this config is temporary and will not be needed in the future.)`);
        }
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$2(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m2) => mergeOptions(resolved, m2, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m2) => mergeOptions(to, m2, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(`"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`);
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i2 = 0; i2 < raw.length; i2++) {
      res[raw[i2]] = raw[i2];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (!(instance.type.__hmrId || instance.parent && instance.parent.type.__hmrId) && (optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
        let key = propsToUpdate[i2];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn$1(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn$1(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn$1(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn$1(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn$1(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i2 = 0; i2 < needCastKeys.length; i2++) {
      const key = needCastKeys[i2];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn$1(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn$1(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i2 = 0; i2 < raw.length; i2++) {
      if (!isString(raw[i2])) {
        warn$1(`props must be strings when using array syntax.`, raw[i2]);
      }
      const normalizedKey = camelize(raw[i2]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$2(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn$1(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a2, b2) {
  return getType(a2) === getType(b2);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp(key, resolvedValues[key], opt, !hasOwn$1(rawProps, key) && !hasOwn$1(rawProps, hyphenate(key)));
  }
}
function validateProp(name, value, prop, isAbsent) {
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  if (type != null && type !== true) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i2 = 0; i2 < types.length && !isValid; i2++) {
      const { valid, expectedType } = assertType(value, types[i2]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol,BigInt");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    const app = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
        {
          warn$1(`app.config cannot be replaced. Modify individual options instead.`);
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(`A plugin must either be a function or an object with an "install" function.`);
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1("Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : ""));
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      mount() {
      },
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(`App already provides property with key "${String(key)}". It will be overwritten with the new value.`);
        }
        context.provides[key] = value;
        return app;
      }
    };
    return app;
  };
}
const queuePostRenderEffect = queuePostFlushCb;
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, config) {
  const appIsNativeTag = config.isNativeTag || NO;
  if (isBuiltInTag(name) || appIsNativeTag(name)) {
    warn$1("Do not use built-in or reserved HTML elements as component id: " + name);
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateComponentName(names[i2], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i2 = 0; i2 < names.length; i2++) {
        validateDirectiveName(names[i2]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(`"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`);
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [shallowReadonly(instance.props), setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise$1(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(`setup() returned a Promise, but the version of Vue you are using does not support it yet.`);
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(`setup() should not return VNodes directly - return a render function instead.`);
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(`setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`);
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions$1(instance);
    resetTracking();
    unsetCurrentInstance();
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(`Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`);
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    },
    set() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    },
    deleteProperty() {
      warn$1(`setupContext.attrs is readonly.`);
      return false;
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    if (instance.exposed) {
      warn$1(`expose() should be called only once per setup().`);
    }
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return Object.freeze({
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      get slots() {
        return shallowReadonly(instance.slots);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed$1 = (getterOrOptions, debugOptions) => {
  return computed(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
const version = "3.2.37";
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(result, (path == "" ? "" : path + ".") + key, currentValue);
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(result, (path == "" ? "" : path + ".") + key, currentValue);
          } else {
            if (currentValue.length < preValue.length) {
              setResult(result, (path == "" ? "" : path + ".") + key, currentValue);
            } else {
              currentValue.forEach((item, index2) => {
                _diff(item, preValue[index2], (path == "" ? "" : path + ".") + key + "[" + index2 + "]", result);
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(result, (path == "" ? "" : path + ".") + key, currentValue);
          } else {
            for (let subKey in currentValue) {
              _diff(currentValue[subKey], preValue[subKey], (path == "" ? "" : path + ".") + key + "." + subKey, result);
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k2, v2) {
  result[k2] = v2;
}
function hasComponentEffect(instance) {
  return queue.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i2 = 0; i2 < copies.length; i2++) {
      copies[i2]();
    }
  }
}
function nextTick$1(instance, fn2) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick(fn2 && fn2.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn2) {
      callWithErrorHandling(fn2.bind(instance.proxy), instance, 14);
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i2 = 0; i2 < len; i2++) {
        copy[i2] = clone(src[i2], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn$1(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs(void 0, instance.update);
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn2) {
    return nextTick$1(this.$, fn2);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(options, instance, publicThis);
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const { setupState, $templateRefs, ctx: { $scope, $mpPlatform } } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$templateRefs || !$scope) {
    return;
  }
  if (isUnmount) {
    return $templateRefs.forEach((templateRef) => setTemplateRef(templateRef, null, setupState));
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    const mpComponents = $scope.selectAllComponents(".r").concat($scope.selectAllComponents(".r-i-f"));
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    const refs = doSetByRefs($templateRefs);
    if (refs.length && instance.proxy && instance.proxy.$scope) {
      instance.proxy.$scope.setData({ r1: 1 }, () => {
        doSetByRefs(refs);
      });
    }
  };
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick$1(instance, doSet);
  }
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find((com) => com && (com.properties || com.props).uI === id);
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return mpInstance;
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          onBeforeUnmount(() => remove(existing, refValue), refValue.$);
        }
      } else if (_isString) {
        if (hasOwn$1(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn$1("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
var MPType;
(function(MPType2) {
  MPType2["APP"] = "app";
  MPType2["PAGE"] = "page";
  MPType2["COMPONENT"] = "component";
})(MPType || (MPType = {}));
const queuePostRenderEffect$1 = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
  }
  setupComponent(instance);
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const { type: Component2, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, data, setupState, ctx, uid: uid2, appContext: { app: { config: { globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 } } } }, inheritAttrs } = instance;
  instance.$templateRefs = [];
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx);
    } else {
      fallthroughAttrs(inheritAttrs, props, propsOptions, Component2.props ? attrs : getFunctionalFallthrough(attrs));
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(props, null);
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter((key) => key !== "class" && key !== "style");
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs(void 0, instance.update);
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(data, oldScopedSlotData[index2]);
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect, update: update3 }, allowed) {
  effect.allowRecurse = update3.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(instance);
  instance.$updateScopedSlots = () => nextTick(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      patch(instance, renderComponentRoot(instance));
    } else {
      const { bu, u: u2 } = instance;
      toggleRecurse(instance, false);
      updateComponentPreRender(instance);
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      patch(instance, renderComponentRoot(instance));
      if (u2) {
        queuePostRenderEffect$1(u2);
      }
    }
  };
  const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope);
  const update3 = instance.update = effect.run.bind(effect);
  update3.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update3.ownerInstance = instance;
  }
  update3();
}
function unmountComponent(instance) {
  const { bum, scope, update: update3, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  scope.stop();
  if (update3) {
    update3.active = false;
  }
  if (um) {
    queuePostRenderEffect$1(um);
  }
  queuePostRenderEffect$1(() => {
    instance.isUnmounted = true;
  });
}
const oldCreateApp = createAppAPI();
function createVueApp(rootComponent, rootProps = null) {
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent3(initialVNode, options) {
    return mountComponent(createVNode(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(createVNode({ type: rootComponent }), {
      mpType: MPType.APP,
      mpInstance: null,
      parentComponent: null,
      slots: [],
      props: null
    });
    app._instance = instance.$;
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn$1(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType) {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (name.indexOf("on") === 0) {
      const hooks = options[name];
      if (isArray(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function createErrorHandler(app) {
  return function errorHandler(err, instance, _info) {
    if (!instance) {
      throw err;
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    {
      appInstance.proxy.$callHook(ON_ERROR, err);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i2 = 0;
    for (; i2 < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i2++)) << 18 | b64.indexOf(str.charAt(i2++)) << 12 | (r1 = b64.indexOf(str.charAt(i2++))) << 6 | (r2 = b64.indexOf(str.charAt(i2++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app._context.config;
  if (isFunction(app._component.onError)) {
    appConfig.errorHandler = createErrorHandler(app);
  }
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method2 = "createApp";
  if (typeof global !== "undefined") {
    return global[method2];
  } else if (typeof my !== "undefined") {
    return my[method2];
  }
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? eventTarget.dataset.eventsync === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray(res) || isPromise$1(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn$1(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn$1(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn$1(event.detail, "checked") && !hasOwn$1(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn2) => (e3) => !e3._stopped && fn2(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
      ret[i2] = renderItem(source[i2], i2, i2);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn$1(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i2 = 0; i2 < source; i2++) {
      ret[i2] = renderItem(i2 + 1, i2, i2);
    }
  } else if (isObject$2(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i2) => renderItem(item, i2, i2));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
        const key = keys[i2];
        ret[i2] = renderItem(source[key], key, i2);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(name, props = {}, key) {
  const instance = getCurrentInstance();
  const { parent, isMounted, ctx: { $scope } } = instance;
  const vueIds = ($scope.properties || $scope.props).uI;
  if (!vueIds) {
    return;
  }
  if (!parent && !isMounted) {
    onMounted(() => {
      renderSlot(name, props, key);
    }, instance);
    return;
  }
  const invoker = findScopedSlotInvoker(vueIds, instance);
  if (invoker) {
    invoker(name, props, key);
  }
}
function findScopedSlotInvoker(vueId, instance) {
  let parent = instance.parent;
  while (parent) {
    const invokers = parent.$ssi;
    if (invokers && invokers[vueId]) {
      return invokers[vueId];
    }
    parent = parent.parent;
  }
}
function withScopedSlot(fn2, { name, path, vueId }) {
  const instance = getCurrentInstance();
  fn2.path = path;
  const scopedSlots = instance.$ssi || (instance.$ssi = {});
  const invoker = scopedSlots[vueId] || (scopedSlots[vueId] = createScopedSlotInvoker(instance));
  if (!invoker.slots[name]) {
    invoker.slots[name] = {
      fn: fn2
    };
  } else {
    invoker.slots[name].fn = fn2;
  }
  return getValueByDataPath(instance.ctx.$scope.data, path);
}
function createScopedSlotInvoker(instance) {
  const invoker = (slotName, args, index2) => {
    const slot = invoker.slots[slotName];
    if (!slot) {
      return;
    }
    const hasIndex = typeof index2 !== "undefined";
    index2 = index2 || 0;
    const prevInstance = setCurrentRenderingInstance(instance);
    const data = slot.fn(args, slotName + (hasIndex ? "-" + index2 : ""), index2);
    const path = slot.fn.path;
    setCurrentRenderingInstance(prevInstance);
    (instance.$scopedSlotsData || (instance.$scopedSlotsData = [])).push({
      path,
      index: index2,
      data
    });
    instance.$updateScopedSlots();
  };
  invoker.slots = {};
  return invoker;
}
function stringifyStyle(value) {
  if (isString(value)) {
    return value;
  }
  return stringify(normalizeStyle(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate(key)}:${styles[key]};`;
  }
  return ret;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o$1 = (value, key) => vOn(value, key);
const f$1 = (source, renderItem) => vFor(source, renderItem);
const r$1 = (name, props, key) => renderSlot(name, props, key);
const w$1 = (fn2, options) => withScopedSlot(fn2, options);
const s$1 = (value) => stringifyStyle(value);
const e = (target, ...sources) => extend(target, ...sources);
const n$1 = (value) => normalizeClass(value);
const t$1 = (val) => toDisplayString(val);
const p$1 = (props) => renderProps(props);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
const eventChannels = {};
const eventChannelStack = [];
function getEventChannel(id) {
  if (id) {
    const eventChannel = eventChannels[id];
    delete eventChannels[id];
    return eventChannel;
  }
  return eventChannelStack.shift();
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method2) => {
    ctx[method2] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method2]) {
        return mpInstance[method2].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn$1(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  } else if (name === "onLoad" && args && args.__id__) {
    this.__eventChannel__ = getEventChannel(args.__id__);
    delete args.__id__;
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (name.indexOf("on") === 0 && isFunction(vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn$1(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn$1(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  if (parseAppOptions) {
    parseAppOptions.parse(appOptions);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm, parseAppOptions));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm, parseAppOptions);
    const app = getApp({
      allowDefault: true
    });
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn$1(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn$1(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN);
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v2) {
      locale.value = v2;
    }
  });
}
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn$1(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    const childVm = $children[i2];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i2 = $children.length - 1; i2 >= 0; i2--) {
    parentVm = findVmByVueId($children[i2], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
const builtInProps = [
  "eO",
  "uR",
  "uRIF",
  "uI",
  "uT",
  "uP",
  "uS"
];
function initDefaultProps(isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: [],
      observer: function(newVal) {
        const $slots = /* @__PURE__ */ Object.create(null);
        newVal && newVal.forEach((slotName) => {
          $slots[slotName] = true;
        });
        this.setData({
          $slots
        });
      }
    };
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties.virtualHostStyle = {
        type: null,
        value: ""
      };
      properties.virtualHostClass = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(properties.uP)) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = properties[name];
      }
    });
  }
  return propsData;
}
function initData(_2) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(up, this.$vm.$);
    } else if (this.properties.uT === "m") {
      updateMiniProgramComponentProperties(up, this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i2 = 0; i2 < nextKeys.length; i2++) {
    const key = nextKeys[i2];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray(vueProps)) {
          vueProps.push("name");
          vueProps.push("value");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse: parse2, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  if (parse2) {
    parse2(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getApp().$vm.$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse: parse2, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    this.options = query;
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse2 && parse2(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm, parseAppOptions), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [customizeEvent(event), ...args]);
  };
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  mocks,
  isPage,
  initRelation,
  handleLink,
  initLifetimes
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
/*!
 * vuex v4.0.2
 * (c) 2021 Evan You
 * @license MIT
 */
var storeKey = "store";
function forEachValue(obj, fn2) {
  Object.keys(obj).forEach(function(key) {
    return fn2(obj[key], key);
  });
}
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
function isPromise(val) {
  return val && typeof val.then === "function";
}
function assert(condition, msg) {
  if (!condition) {
    throw new Error("[vuex] " + msg);
  }
}
function partial(fn2, arg) {
  return function() {
    return fn2(arg);
  };
}
function genericSubscribe(fn2, subs, options) {
  if (subs.indexOf(fn2) < 0) {
    options && options.prepend ? subs.unshift(fn2) : subs.push(fn2);
  }
  return function() {
    var i2 = subs.indexOf(fn2);
    if (i2 > -1) {
      subs.splice(i2, 1);
    }
  };
}
function resetStore(store, hot) {
  store._actions = /* @__PURE__ */ Object.create(null);
  store._mutations = /* @__PURE__ */ Object.create(null);
  store._wrappedGetters = /* @__PURE__ */ Object.create(null);
  store._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  var state = store.state;
  installModule(store, state, [], store._modules.root, true);
  resetStoreState(store, state, hot);
}
function resetStoreState(store, state, hot) {
  var oldState = store._state;
  store.getters = {};
  store._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computedObj = {};
  forEachValue(wrappedGetters, function(fn2, key) {
    computedObj[key] = partial(fn2, store);
    Object.defineProperty(store.getters, key, {
      get: function() {
        return computedObj[key]();
      },
      enumerable: true
    });
  });
  store._state = reactive({
    data: state
  });
  if (store.strict) {
    enableStrictMode(store);
  }
  if (oldState) {
    if (hot) {
      store._withCommit(function() {
        oldState.data = null;
      });
    }
  }
}
function installModule(store, rootState, path, module2, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);
  if (module2.namespaced) {
    if (store._modulesNamespaceMap[namespace] && true) {
      console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
    }
    store._modulesNamespaceMap[namespace] = module2;
  }
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function() {
      {
        if (moduleName in parentState) {
          console.warn('[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"');
        }
      }
      parentState[moduleName] = module2.state;
    });
  }
  var local = module2.context = makeLocalContext(store, namespace, path);
  module2.forEachMutation(function(mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });
  module2.forEachAction(function(action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });
  module2.forEachGetter(function(getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });
  module2.forEachChild(function(child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}
function makeLocalContext(store, namespace, path) {
  var noNamespace = namespace === "";
  var local = {
    dispatch: noNamespace ? store.dispatch : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;
      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
          return;
        }
      }
      return store.dispatch(type, payload);
    },
    commit: noNamespace ? store.commit : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;
      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
          return;
        }
      }
      store.commit(type, payload, options);
    }
  };
  Object.defineProperties(local, {
    getters: {
      get: noNamespace ? function() {
        return store.getters;
      } : function() {
        return makeLocalGetters(store, namespace);
      }
    },
    state: {
      get: function() {
        return getNestedState(store.state, path);
      }
    }
  });
  return local;
}
function makeLocalGetters(store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function(type) {
      if (type.slice(0, splitPos) !== namespace) {
        return;
      }
      var localType = type.slice(splitPos);
      Object.defineProperty(gettersProxy, localType, {
        get: function() {
          return store.getters[type];
        },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }
  return store._makeLocalGettersCache[namespace];
}
function registerMutation(store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}
function registerAction(store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler(payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function(err) {
        store._devtoolHook.emit("vuex:error", err);
        throw err;
      });
    } else {
      return res;
    }
  });
}
function registerGetter(store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    {
      console.error("[vuex] duplicate getter key: " + type);
    }
    return;
  }
  store._wrappedGetters[type] = function wrappedGetter(store2) {
    return rawGetter(local.state, local.getters, store2.state, store2.getters);
  };
}
function enableStrictMode(store) {
  watch(function() {
    return store._state.data;
  }, function() {
    {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, flush: "sync" });
}
function getNestedState(state, path) {
  return path.reduce(function(state2, key) {
    return state2[key];
  }, state);
}
function unifyObjectStyle(type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }
  {
    assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
  }
  return { type, payload, options };
}
var Module = function Module2(rawModule, runtime) {
  this.runtime = runtime;
  this._children = /* @__PURE__ */ Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
};
var prototypeAccessors$1 = { namespaced: { configurable: true } };
prototypeAccessors$1.namespaced.get = function() {
  return !!this._rawModule.namespaced;
};
Module.prototype.addChild = function addChild(key, module2) {
  this._children[key] = module2;
};
Module.prototype.removeChild = function removeChild(key) {
  delete this._children[key];
};
Module.prototype.getChild = function getChild(key) {
  return this._children[key];
};
Module.prototype.hasChild = function hasChild(key) {
  return key in this._children;
};
Module.prototype.update = function update2(rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};
Module.prototype.forEachChild = function forEachChild(fn2) {
  forEachValue(this._children, fn2);
};
Module.prototype.forEachGetter = function forEachGetter(fn2) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn2);
  }
};
Module.prototype.forEachAction = function forEachAction(fn2) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn2);
  }
};
Module.prototype.forEachMutation = function forEachMutation(fn2) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn2);
  }
};
Object.defineProperties(Module.prototype, prototypeAccessors$1);
var ModuleCollection = function ModuleCollection2(rawRootModule) {
  this.register([], rawRootModule, false);
};
ModuleCollection.prototype.get = function get2(path) {
  return path.reduce(function(module2, key) {
    return module2.getChild(key);
  }, this.root);
};
ModuleCollection.prototype.getNamespace = function getNamespace(path) {
  var module2 = this.root;
  return path.reduce(function(namespace, key) {
    module2 = module2.getChild(key);
    return namespace + (module2.namespaced ? key + "/" : "");
  }, "");
};
ModuleCollection.prototype.update = function update$1(rawRootModule) {
  update([], this.root, rawRootModule);
};
ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
  var this$1$1 = this;
  if (runtime === void 0)
    runtime = true;
  {
    assertRawModule(path, rawModule);
  }
  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function(rawChildModule, key) {
      this$1$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};
ModuleCollection.prototype.unregister = function unregister(path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  var child = parent.getChild(key);
  if (!child) {
    {
      console.warn("[vuex] trying to unregister module '" + key + "', which is not registered");
    }
    return;
  }
  if (!child.runtime) {
    return;
  }
  parent.removeChild(key);
};
ModuleCollection.prototype.isRegistered = function isRegistered(path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (parent) {
    return parent.hasChild(key);
  }
  return false;
};
function update(path, targetModule, newModule) {
  {
    assertRawModule(path, newModule);
  }
  targetModule.update(newModule);
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        {
          console.warn("[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed");
        }
        return;
      }
      update(path.concat(key), targetModule.getChild(key), newModule.modules[key]);
    }
  }
}
var functionAssert = {
  assert: function(value) {
    return typeof value === "function";
  },
  expected: "function"
};
var objectAssert = {
  assert: function(value) {
    return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
  },
  expected: 'function or object with "handler" function'
};
var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};
function assertRawModule(path, rawModule) {
  Object.keys(assertTypes).forEach(function(key) {
    if (!rawModule[key]) {
      return;
    }
    var assertOptions = assertTypes[key];
    forEachValue(rawModule[key], function(value, type) {
      assert(assertOptions.assert(value), makeAssertionMessage(path, key, type, value, assertOptions.expected));
    });
  });
}
function makeAssertionMessage(path, key, type, value, expected) {
  var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
  if (path.length > 0) {
    buf += ' in module "' + path.join(".") + '"';
  }
  buf += " is " + JSON.stringify(value) + ".";
  return buf;
}
function createStore(options) {
  return new Store(options);
}
var Store = function Store2(options) {
  var this$1$1 = this;
  if (options === void 0)
    options = {};
  {
    assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store2, "store must be called with the new operator.");
  }
  var plugins = options.plugins;
  if (plugins === void 0)
    plugins = [];
  var strict = options.strict;
  if (strict === void 0)
    strict = false;
  var devtools = options.devtools;
  this._committing = false;
  this._actions = /* @__PURE__ */ Object.create(null);
  this._actionSubscribers = [];
  this._mutations = /* @__PURE__ */ Object.create(null);
  this._wrappedGetters = /* @__PURE__ */ Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  this._subscribers = [];
  this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  this._devtools = devtools;
  var store = this;
  var ref2 = this;
  var dispatch2 = ref2.dispatch;
  var commit2 = ref2.commit;
  this.dispatch = function boundDispatch(type, payload) {
    return dispatch2.call(store, type, payload);
  };
  this.commit = function boundCommit(type, payload, options2) {
    return commit2.call(store, type, payload, options2);
  };
  this.strict = strict;
  var state = this._modules.root.state;
  installModule(this, state, [], this._modules.root);
  resetStoreState(this, state);
  plugins.forEach(function(plugin2) {
    return plugin2(this$1$1);
  });
};
var prototypeAccessors = { state: { configurable: true } };
Store.prototype.install = function install(app, injectKey) {
  app.provide(injectKey || storeKey, this);
  app.config.globalProperties.$store = this;
  this._devtools !== void 0 ? this._devtools : true;
};
prototypeAccessors.state.get = function() {
  return this._state.data;
};
prototypeAccessors.state.set = function(v2) {
  {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};
Store.prototype.commit = function commit(_type, _payload, _options) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload, _options);
  var type = ref2.type;
  var payload = ref2.payload;
  var options = ref2.options;
  var mutation = { type, payload };
  var entry = this._mutations[type];
  if (!entry) {
    {
      console.error("[vuex] unknown mutation type: " + type);
    }
    return;
  }
  this._withCommit(function() {
    entry.forEach(function commitIterator(handler) {
      handler(payload);
    });
  });
  this._subscribers.slice().forEach(function(sub) {
    return sub(mutation, this$1$1.state);
  });
  if (options && options.silent) {
    console.warn("[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools");
  }
};
Store.prototype.dispatch = function dispatch(_type, _payload) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload);
  var type = ref2.type;
  var payload = ref2.payload;
  var action = { type, payload };
  var entry = this._actions[type];
  if (!entry) {
    {
      console.error("[vuex] unknown action type: " + type);
    }
    return;
  }
  try {
    this._actionSubscribers.slice().filter(function(sub) {
      return sub.before;
    }).forEach(function(sub) {
      return sub.before(action, this$1$1.state);
    });
  } catch (e2) {
    {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e2);
    }
  }
  var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
    return handler(payload);
  })) : entry[0](payload);
  return new Promise(function(resolve2, reject) {
    result.then(function(res) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.after;
        }).forEach(function(sub) {
          return sub.after(action, this$1$1.state);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in after action subscribers: ");
          console.error(e2);
        }
      }
      resolve2(res);
    }, function(error) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.error;
        }).forEach(function(sub) {
          return sub.error(action, this$1$1.state, error);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in error action subscribers: ");
          console.error(e2);
        }
      }
      reject(error);
    });
  });
};
Store.prototype.subscribe = function subscribe(fn2, options) {
  return genericSubscribe(fn2, this._subscribers, options);
};
Store.prototype.subscribeAction = function subscribeAction(fn2, options) {
  var subs = typeof fn2 === "function" ? { before: fn2 } : fn2;
  return genericSubscribe(subs, this._actionSubscribers, options);
};
Store.prototype.watch = function watch$1(getter, cb, options) {
  var this$1$1 = this;
  {
    assert(typeof getter === "function", "store.watch only accepts a function.");
  }
  return watch(function() {
    return getter(this$1$1.state, this$1$1.getters);
  }, cb, Object.assign({}, options));
};
Store.prototype.replaceState = function replaceState(state) {
  var this$1$1 = this;
  this._withCommit(function() {
    this$1$1._state.data = state;
  });
};
Store.prototype.registerModule = function registerModule(path, rawModule, options) {
  if (options === void 0)
    options = {};
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, "cannot register the root module by using registerModule.");
  }
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  resetStoreState(this, this.state);
};
Store.prototype.unregisterModule = function unregisterModule(path) {
  var this$1$1 = this;
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  this._modules.unregister(path);
  this._withCommit(function() {
    var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
    delete parentState[path[path.length - 1]];
  });
  resetStore(this);
};
Store.prototype.hasModule = function hasModule(path) {
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  return this._modules.isRegistered(path);
};
Store.prototype.hotUpdate = function hotUpdate(newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};
Store.prototype._withCommit = function _withCommit(fn2) {
  var committing = this._committing;
  this._committing = true;
  fn2();
  this._committing = committing;
};
Object.defineProperties(Store.prototype, prototypeAccessors);
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var md5$2 = { exports: {} };
/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
(function(module) {
  (function() {
    var ERROR = "input is invalid type";
    var WINDOW = typeof window === "object";
    var root = WINDOW ? window : {};
    if (root.JS_MD5_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === "object";
    var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
    if (NODE_JS) {
      root = commonjsGlobal;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && true && module.exports;
    var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
    var HEX_CHARS = "0123456789abcdef".split("");
    var EXTRA = [128, 32768, 8388608, -2147483648];
    var SHIFT = [0, 8, 16, 24];
    var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
    var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var blocks = [], buffer8;
    if (ARRAY_BUFFER) {
      var buffer = new ArrayBuffer(68);
      buffer8 = new Uint8Array(buffer);
      blocks = new Uint32Array(buffer);
    }
    if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      };
    }
    if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function(obj) {
        return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
    var createOutputMethod = function(outputType) {
      return function(message) {
        return new Md5(true).update(message)[outputType]();
      };
    };
    var createMethod = function() {
      var method2 = createOutputMethod("hex");
      if (NODE_JS) {
        method2 = nodeWrap(method2);
      }
      method2.create = function() {
        return new Md5();
      };
      method2.update = function(message) {
        return method2.create().update(message);
      };
      for (var i2 = 0; i2 < OUTPUT_TYPES.length; ++i2) {
        var type = OUTPUT_TYPES[i2];
        method2[type] = createOutputMethod(type);
      }
      return method2;
    };
    var nodeWrap = function(method) {
      var crypto = eval("require('crypto')");
      var Buffer = eval("require('buffer').Buffer");
      var nodeMethod = function(message) {
        if (typeof message === "string") {
          return crypto.createHash("md5").update(message, "utf8").digest("hex");
        } else {
          if (message === null || message === void 0) {
            throw ERROR;
          } else if (message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          }
        }
        if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer) {
          return crypto.createHash("md5").update(new Buffer(message)).digest("hex");
        } else {
          return method(message);
        }
      };
      return nodeMethod;
    };
    function Md5(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          var buffer2 = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer2);
          this.blocks = new Uint32Array(buffer2);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
      this.first = true;
    }
    Md5.prototype.update = function(message) {
      if (this.finalized) {
        return;
      }
      var notString, type = typeof message;
      if (type !== "string") {
        if (type === "object") {
          if (message === null) {
            throw ERROR;
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw ERROR;
            }
          }
        } else {
          throw ERROR;
        }
        notString = true;
      }
      var code, index2 = 0, i2, length = message.length, blocks2 = this.blocks;
      var buffer82 = this.buffer8;
      while (index2 < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        if (notString) {
          if (ARRAY_BUFFER) {
            for (i2 = this.start; index2 < length && i2 < 64; ++index2) {
              buffer82[i2++] = message[index2];
            }
          } else {
            for (i2 = this.start; index2 < length && i2 < 64; ++index2) {
              blocks2[i2 >> 2] |= message[index2] << SHIFT[i2++ & 3];
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i2 = this.start; index2 < length && i2 < 64; ++index2) {
              code = message.charCodeAt(index2);
              if (code < 128) {
                buffer82[i2++] = code;
              } else if (code < 2048) {
                buffer82[i2++] = 192 | code >> 6;
                buffer82[i2++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                buffer82[i2++] = 224 | code >> 12;
                buffer82[i2++] = 128 | code >> 6 & 63;
                buffer82[i2++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index2) & 1023);
                buffer82[i2++] = 240 | code >> 18;
                buffer82[i2++] = 128 | code >> 12 & 63;
                buffer82[i2++] = 128 | code >> 6 & 63;
                buffer82[i2++] = 128 | code & 63;
              }
            }
          } else {
            for (i2 = this.start; index2 < length && i2 < 64; ++index2) {
              code = message.charCodeAt(index2);
              if (code < 128) {
                blocks2[i2 >> 2] |= code << SHIFT[i2++ & 3];
              } else if (code < 2048) {
                blocks2[i2 >> 2] |= (192 | code >> 6) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i2 >> 2] |= (224 | code >> 12) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index2) & 1023);
                blocks2[i2 >> 2] |= (240 | code >> 18) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code >> 12 & 63) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                blocks2[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
              }
            }
          }
        }
        this.lastByteIndex = i2;
        this.bytes += i2 - this.start;
        if (i2 >= 64) {
          this.start = i2 - 64;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i2;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };
    Md5.prototype.finalize = function() {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks2 = this.blocks, i2 = this.lastByteIndex;
      blocks2[i2 >> 2] |= EXTRA[i2 & 3];
      if (i2 >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks2[0] = blocks2[16];
        blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
      }
      blocks2[14] = this.bytes << 3;
      blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    };
    Md5.prototype.hash = function() {
      var a2, b2, c2, d2, bc, da, blocks2 = this.blocks;
      if (this.first) {
        a2 = blocks2[0] - 680876937;
        a2 = (a2 << 7 | a2 >>> 25) - 271733879 << 0;
        d2 = (-1732584194 ^ a2 & 2004318071) + blocks2[1] - 117830708;
        d2 = (d2 << 12 | d2 >>> 20) + a2 << 0;
        c2 = (-271733879 ^ d2 & (a2 ^ -271733879)) + blocks2[2] - 1126478375;
        c2 = (c2 << 17 | c2 >>> 15) + d2 << 0;
        b2 = (a2 ^ c2 & (d2 ^ a2)) + blocks2[3] - 1316259209;
        b2 = (b2 << 22 | b2 >>> 10) + c2 << 0;
      } else {
        a2 = this.h0;
        b2 = this.h1;
        c2 = this.h2;
        d2 = this.h3;
        a2 += (d2 ^ b2 & (c2 ^ d2)) + blocks2[0] - 680876936;
        a2 = (a2 << 7 | a2 >>> 25) + b2 << 0;
        d2 += (c2 ^ a2 & (b2 ^ c2)) + blocks2[1] - 389564586;
        d2 = (d2 << 12 | d2 >>> 20) + a2 << 0;
        c2 += (b2 ^ d2 & (a2 ^ b2)) + blocks2[2] + 606105819;
        c2 = (c2 << 17 | c2 >>> 15) + d2 << 0;
        b2 += (a2 ^ c2 & (d2 ^ a2)) + blocks2[3] - 1044525330;
        b2 = (b2 << 22 | b2 >>> 10) + c2 << 0;
      }
      a2 += (d2 ^ b2 & (c2 ^ d2)) + blocks2[4] - 176418897;
      a2 = (a2 << 7 | a2 >>> 25) + b2 << 0;
      d2 += (c2 ^ a2 & (b2 ^ c2)) + blocks2[5] + 1200080426;
      d2 = (d2 << 12 | d2 >>> 20) + a2 << 0;
      c2 += (b2 ^ d2 & (a2 ^ b2)) + blocks2[6] - 1473231341;
      c2 = (c2 << 17 | c2 >>> 15) + d2 << 0;
      b2 += (a2 ^ c2 & (d2 ^ a2)) + blocks2[7] - 45705983;
      b2 = (b2 << 22 | b2 >>> 10) + c2 << 0;
      a2 += (d2 ^ b2 & (c2 ^ d2)) + blocks2[8] + 1770035416;
      a2 = (a2 << 7 | a2 >>> 25) + b2 << 0;
      d2 += (c2 ^ a2 & (b2 ^ c2)) + blocks2[9] - 1958414417;
      d2 = (d2 << 12 | d2 >>> 20) + a2 << 0;
      c2 += (b2 ^ d2 & (a2 ^ b2)) + blocks2[10] - 42063;
      c2 = (c2 << 17 | c2 >>> 15) + d2 << 0;
      b2 += (a2 ^ c2 & (d2 ^ a2)) + blocks2[11] - 1990404162;
      b2 = (b2 << 22 | b2 >>> 10) + c2 << 0;
      a2 += (d2 ^ b2 & (c2 ^ d2)) + blocks2[12] + 1804603682;
      a2 = (a2 << 7 | a2 >>> 25) + b2 << 0;
      d2 += (c2 ^ a2 & (b2 ^ c2)) + blocks2[13] - 40341101;
      d2 = (d2 << 12 | d2 >>> 20) + a2 << 0;
      c2 += (b2 ^ d2 & (a2 ^ b2)) + blocks2[14] - 1502002290;
      c2 = (c2 << 17 | c2 >>> 15) + d2 << 0;
      b2 += (a2 ^ c2 & (d2 ^ a2)) + blocks2[15] + 1236535329;
      b2 = (b2 << 22 | b2 >>> 10) + c2 << 0;
      a2 += (c2 ^ d2 & (b2 ^ c2)) + blocks2[1] - 165796510;
      a2 = (a2 << 5 | a2 >>> 27) + b2 << 0;
      d2 += (b2 ^ c2 & (a2 ^ b2)) + blocks2[6] - 1069501632;
      d2 = (d2 << 9 | d2 >>> 23) + a2 << 0;
      c2 += (a2 ^ b2 & (d2 ^ a2)) + blocks2[11] + 643717713;
      c2 = (c2 << 14 | c2 >>> 18) + d2 << 0;
      b2 += (d2 ^ a2 & (c2 ^ d2)) + blocks2[0] - 373897302;
      b2 = (b2 << 20 | b2 >>> 12) + c2 << 0;
      a2 += (c2 ^ d2 & (b2 ^ c2)) + blocks2[5] - 701558691;
      a2 = (a2 << 5 | a2 >>> 27) + b2 << 0;
      d2 += (b2 ^ c2 & (a2 ^ b2)) + blocks2[10] + 38016083;
      d2 = (d2 << 9 | d2 >>> 23) + a2 << 0;
      c2 += (a2 ^ b2 & (d2 ^ a2)) + blocks2[15] - 660478335;
      c2 = (c2 << 14 | c2 >>> 18) + d2 << 0;
      b2 += (d2 ^ a2 & (c2 ^ d2)) + blocks2[4] - 405537848;
      b2 = (b2 << 20 | b2 >>> 12) + c2 << 0;
      a2 += (c2 ^ d2 & (b2 ^ c2)) + blocks2[9] + 568446438;
      a2 = (a2 << 5 | a2 >>> 27) + b2 << 0;
      d2 += (b2 ^ c2 & (a2 ^ b2)) + blocks2[14] - 1019803690;
      d2 = (d2 << 9 | d2 >>> 23) + a2 << 0;
      c2 += (a2 ^ b2 & (d2 ^ a2)) + blocks2[3] - 187363961;
      c2 = (c2 << 14 | c2 >>> 18) + d2 << 0;
      b2 += (d2 ^ a2 & (c2 ^ d2)) + blocks2[8] + 1163531501;
      b2 = (b2 << 20 | b2 >>> 12) + c2 << 0;
      a2 += (c2 ^ d2 & (b2 ^ c2)) + blocks2[13] - 1444681467;
      a2 = (a2 << 5 | a2 >>> 27) + b2 << 0;
      d2 += (b2 ^ c2 & (a2 ^ b2)) + blocks2[2] - 51403784;
      d2 = (d2 << 9 | d2 >>> 23) + a2 << 0;
      c2 += (a2 ^ b2 & (d2 ^ a2)) + blocks2[7] + 1735328473;
      c2 = (c2 << 14 | c2 >>> 18) + d2 << 0;
      b2 += (d2 ^ a2 & (c2 ^ d2)) + blocks2[12] - 1926607734;
      b2 = (b2 << 20 | b2 >>> 12) + c2 << 0;
      bc = b2 ^ c2;
      a2 += (bc ^ d2) + blocks2[5] - 378558;
      a2 = (a2 << 4 | a2 >>> 28) + b2 << 0;
      d2 += (bc ^ a2) + blocks2[8] - 2022574463;
      d2 = (d2 << 11 | d2 >>> 21) + a2 << 0;
      da = d2 ^ a2;
      c2 += (da ^ b2) + blocks2[11] + 1839030562;
      c2 = (c2 << 16 | c2 >>> 16) + d2 << 0;
      b2 += (da ^ c2) + blocks2[14] - 35309556;
      b2 = (b2 << 23 | b2 >>> 9) + c2 << 0;
      bc = b2 ^ c2;
      a2 += (bc ^ d2) + blocks2[1] - 1530992060;
      a2 = (a2 << 4 | a2 >>> 28) + b2 << 0;
      d2 += (bc ^ a2) + blocks2[4] + 1272893353;
      d2 = (d2 << 11 | d2 >>> 21) + a2 << 0;
      da = d2 ^ a2;
      c2 += (da ^ b2) + blocks2[7] - 155497632;
      c2 = (c2 << 16 | c2 >>> 16) + d2 << 0;
      b2 += (da ^ c2) + blocks2[10] - 1094730640;
      b2 = (b2 << 23 | b2 >>> 9) + c2 << 0;
      bc = b2 ^ c2;
      a2 += (bc ^ d2) + blocks2[13] + 681279174;
      a2 = (a2 << 4 | a2 >>> 28) + b2 << 0;
      d2 += (bc ^ a2) + blocks2[0] - 358537222;
      d2 = (d2 << 11 | d2 >>> 21) + a2 << 0;
      da = d2 ^ a2;
      c2 += (da ^ b2) + blocks2[3] - 722521979;
      c2 = (c2 << 16 | c2 >>> 16) + d2 << 0;
      b2 += (da ^ c2) + blocks2[6] + 76029189;
      b2 = (b2 << 23 | b2 >>> 9) + c2 << 0;
      bc = b2 ^ c2;
      a2 += (bc ^ d2) + blocks2[9] - 640364487;
      a2 = (a2 << 4 | a2 >>> 28) + b2 << 0;
      d2 += (bc ^ a2) + blocks2[12] - 421815835;
      d2 = (d2 << 11 | d2 >>> 21) + a2 << 0;
      da = d2 ^ a2;
      c2 += (da ^ b2) + blocks2[15] + 530742520;
      c2 = (c2 << 16 | c2 >>> 16) + d2 << 0;
      b2 += (da ^ c2) + blocks2[2] - 995338651;
      b2 = (b2 << 23 | b2 >>> 9) + c2 << 0;
      a2 += (c2 ^ (b2 | ~d2)) + blocks2[0] - 198630844;
      a2 = (a2 << 6 | a2 >>> 26) + b2 << 0;
      d2 += (b2 ^ (a2 | ~c2)) + blocks2[7] + 1126891415;
      d2 = (d2 << 10 | d2 >>> 22) + a2 << 0;
      c2 += (a2 ^ (d2 | ~b2)) + blocks2[14] - 1416354905;
      c2 = (c2 << 15 | c2 >>> 17) + d2 << 0;
      b2 += (d2 ^ (c2 | ~a2)) + blocks2[5] - 57434055;
      b2 = (b2 << 21 | b2 >>> 11) + c2 << 0;
      a2 += (c2 ^ (b2 | ~d2)) + blocks2[12] + 1700485571;
      a2 = (a2 << 6 | a2 >>> 26) + b2 << 0;
      d2 += (b2 ^ (a2 | ~c2)) + blocks2[3] - 1894986606;
      d2 = (d2 << 10 | d2 >>> 22) + a2 << 0;
      c2 += (a2 ^ (d2 | ~b2)) + blocks2[10] - 1051523;
      c2 = (c2 << 15 | c2 >>> 17) + d2 << 0;
      b2 += (d2 ^ (c2 | ~a2)) + blocks2[1] - 2054922799;
      b2 = (b2 << 21 | b2 >>> 11) + c2 << 0;
      a2 += (c2 ^ (b2 | ~d2)) + blocks2[8] + 1873313359;
      a2 = (a2 << 6 | a2 >>> 26) + b2 << 0;
      d2 += (b2 ^ (a2 | ~c2)) + blocks2[15] - 30611744;
      d2 = (d2 << 10 | d2 >>> 22) + a2 << 0;
      c2 += (a2 ^ (d2 | ~b2)) + blocks2[6] - 1560198380;
      c2 = (c2 << 15 | c2 >>> 17) + d2 << 0;
      b2 += (d2 ^ (c2 | ~a2)) + blocks2[13] + 1309151649;
      b2 = (b2 << 21 | b2 >>> 11) + c2 << 0;
      a2 += (c2 ^ (b2 | ~d2)) + blocks2[4] - 145523070;
      a2 = (a2 << 6 | a2 >>> 26) + b2 << 0;
      d2 += (b2 ^ (a2 | ~c2)) + blocks2[11] - 1120210379;
      d2 = (d2 << 10 | d2 >>> 22) + a2 << 0;
      c2 += (a2 ^ (d2 | ~b2)) + blocks2[2] + 718787259;
      c2 = (c2 << 15 | c2 >>> 17) + d2 << 0;
      b2 += (d2 ^ (c2 | ~a2)) + blocks2[9] - 343485551;
      b2 = (b2 << 21 | b2 >>> 11) + c2 << 0;
      if (this.first) {
        this.h0 = a2 + 1732584193 << 0;
        this.h1 = b2 - 271733879 << 0;
        this.h2 = c2 - 1732584194 << 0;
        this.h3 = d2 + 271733878 << 0;
        this.first = false;
      } else {
        this.h0 = this.h0 + a2 << 0;
        this.h1 = this.h1 + b2 << 0;
        this.h2 = this.h2 + c2 << 0;
        this.h3 = this.h3 + d2 << 0;
      }
    };
    Md5.prototype.hex = function() {
      this.finalize();
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15];
    };
    Md5.prototype.toString = Md5.prototype.hex;
    Md5.prototype.digest = function() {
      this.finalize();
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 255,
        h0 >> 8 & 255,
        h0 >> 16 & 255,
        h0 >> 24 & 255,
        h1 & 255,
        h1 >> 8 & 255,
        h1 >> 16 & 255,
        h1 >> 24 & 255,
        h2 & 255,
        h2 >> 8 & 255,
        h2 >> 16 & 255,
        h2 >> 24 & 255,
        h3 & 255,
        h3 >> 8 & 255,
        h3 >> 16 & 255,
        h3 >> 24 & 255
      ];
    };
    Md5.prototype.array = Md5.prototype.digest;
    Md5.prototype.arrayBuffer = function() {
      this.finalize();
      var buffer2 = new ArrayBuffer(16);
      var blocks2 = new Uint32Array(buffer2);
      blocks2[0] = this.h0;
      blocks2[1] = this.h1;
      blocks2[2] = this.h2;
      blocks2[3] = this.h3;
      return buffer2;
    };
    Md5.prototype.buffer = Md5.prototype.arrayBuffer;
    Md5.prototype.base64 = function() {
      var v1, v2, v3, base64Str = "", bytes = this.array();
      for (var i2 = 0; i2 < 15; ) {
        v1 = bytes[i2++];
        v2 = bytes[i2++];
        v3 = bytes[i2++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i2];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
      return base64Str;
    };
    var exports = createMethod();
    if (COMMON_JS) {
      module.exports = exports;
    } else {
      root.md5 = exports;
    }
  })();
})(md5$2);
var md5$1 = md5$2.exports;
var cryptoJs = { exports: {} };
var core = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory();
    }
  })(commonjsGlobal, function() {
    var CryptoJS = CryptoJS || function(Math2, undefined$1) {
      var crypto2;
      if (typeof window !== "undefined" && window.crypto) {
        crypto2 = window.crypto;
      }
      if (typeof self !== "undefined" && self.crypto) {
        crypto2 = self.crypto;
      }
      if (typeof globalThis !== "undefined" && globalThis.crypto) {
        crypto2 = globalThis.crypto;
      }
      if (!crypto2 && typeof window !== "undefined" && window.msCrypto) {
        crypto2 = window.msCrypto;
      }
      if (!crypto2 && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
        crypto2 = commonjsGlobal.crypto;
      }
      if (!crypto2 && typeof commonjsRequire === "function") {
        try {
          crypto2 = require("crypto");
        } catch (err) {
        }
      }
      var cryptoSecureRandomInt = function() {
        if (crypto2) {
          if (typeof crypto2.getRandomValues === "function") {
            try {
              return crypto2.getRandomValues(new Uint32Array(1))[0];
            } catch (err) {
            }
          }
          if (typeof crypto2.randomBytes === "function") {
            try {
              return crypto2.randomBytes(4).readInt32LE();
            } catch (err) {
            }
          }
        }
        throw new Error("Native crypto module could not be used to get secure random number.");
      };
      var create = Object.create || function() {
        function F2() {
        }
        return function(obj) {
          var subtype;
          F2.prototype = obj;
          subtype = new F2();
          F2.prototype = null;
          return subtype;
        };
      }();
      var C2 = {};
      var C_lib = C2.lib = {};
      var Base = C_lib.Base = function() {
        return {
          extend: function(overrides) {
            var subtype = create(this);
            if (overrides) {
              subtype.mixIn(overrides);
            }
            if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
              subtype.init = function() {
                subtype.$super.init.apply(this, arguments);
              };
            }
            subtype.init.prototype = subtype;
            subtype.$super = this;
            return subtype;
          },
          create: function() {
            var instance = this.extend();
            instance.init.apply(instance, arguments);
            return instance;
          },
          init: function() {
          },
          mixIn: function(properties) {
            for (var propertyName in properties) {
              if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
              }
            }
            if (properties.hasOwnProperty("toString")) {
              this.toString = properties.toString;
            }
          },
          clone: function() {
            return this.init.prototype.extend(this);
          }
        };
      }();
      var WordArray = C_lib.WordArray = Base.extend({
        init: function(words, sigBytes) {
          words = this.words = words || [];
          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 4;
          }
        },
        toString: function(encoder) {
          return (encoder || Hex).stringify(this);
        },
        concat: function(wordArray) {
          var thisWords = this.words;
          var thatWords = wordArray.words;
          var thisSigBytes = this.sigBytes;
          var thatSigBytes = wordArray.sigBytes;
          this.clamp();
          if (thisSigBytes % 4) {
            for (var i2 = 0; i2 < thatSigBytes; i2++) {
              var thatByte = thatWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
              thisWords[thisSigBytes + i2 >>> 2] |= thatByte << 24 - (thisSigBytes + i2) % 4 * 8;
            }
          } else {
            for (var j2 = 0; j2 < thatSigBytes; j2 += 4) {
              thisWords[thisSigBytes + j2 >>> 2] = thatWords[j2 >>> 2];
            }
          }
          this.sigBytes += thatSigBytes;
          return this;
        },
        clamp: function() {
          var words = this.words;
          var sigBytes = this.sigBytes;
          words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
          words.length = Math2.ceil(sigBytes / 4);
        },
        clone: function() {
          var clone2 = Base.clone.call(this);
          clone2.words = this.words.slice(0);
          return clone2;
        },
        random: function(nBytes) {
          var words = [];
          for (var i2 = 0; i2 < nBytes; i2 += 4) {
            words.push(cryptoSecureRandomInt());
          }
          return new WordArray.init(words, nBytes);
        }
      });
      var C_enc = C2.enc = {};
      var Hex = C_enc.Hex = {
        stringify: function(wordArray) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var hexChars = [];
          for (var i2 = 0; i2 < sigBytes; i2++) {
            var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 15).toString(16));
          }
          return hexChars.join("");
        },
        parse: function(hexStr) {
          var hexStrLength = hexStr.length;
          var words = [];
          for (var i2 = 0; i2 < hexStrLength; i2 += 2) {
            words[i2 >>> 3] |= parseInt(hexStr.substr(i2, 2), 16) << 24 - i2 % 8 * 4;
          }
          return new WordArray.init(words, hexStrLength / 2);
        }
      };
      var Latin1 = C_enc.Latin1 = {
        stringify: function(wordArray) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var latin1Chars = [];
          for (var i2 = 0; i2 < sigBytes; i2++) {
            var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
            latin1Chars.push(String.fromCharCode(bite));
          }
          return latin1Chars.join("");
        },
        parse: function(latin1Str) {
          var latin1StrLength = latin1Str.length;
          var words = [];
          for (var i2 = 0; i2 < latin1StrLength; i2++) {
            words[i2 >>> 2] |= (latin1Str.charCodeAt(i2) & 255) << 24 - i2 % 4 * 8;
          }
          return new WordArray.init(words, latin1StrLength);
        }
      };
      var Utf8 = C_enc.Utf8 = {
        stringify: function(wordArray) {
          try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
          } catch (e2) {
            throw new Error("Malformed UTF-8 data");
          }
        },
        parse: function(utf8Str) {
          return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
      };
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        reset: function() {
          this._data = new WordArray.init();
          this._nDataBytes = 0;
        },
        _append: function(data) {
          if (typeof data == "string") {
            data = Utf8.parse(data);
          }
          this._data.concat(data);
          this._nDataBytes += data.sigBytes;
        },
        _process: function(doFlush) {
          var processedWords;
          var data = this._data;
          var dataWords = data.words;
          var dataSigBytes = data.sigBytes;
          var blockSize = this.blockSize;
          var blockSizeBytes = blockSize * 4;
          var nBlocksReady = dataSigBytes / blockSizeBytes;
          if (doFlush) {
            nBlocksReady = Math2.ceil(nBlocksReady);
          } else {
            nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
          }
          var nWordsReady = nBlocksReady * blockSize;
          var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
          if (nWordsReady) {
            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
              this._doProcessBlock(dataWords, offset);
            }
            processedWords = dataWords.splice(0, nWordsReady);
            data.sigBytes -= nBytesReady;
          }
          return new WordArray.init(processedWords, nBytesReady);
        },
        clone: function() {
          var clone2 = Base.clone.call(this);
          clone2._data = this._data.clone();
          return clone2;
        },
        _minBufferSize: 0
      });
      C_lib.Hasher = BufferedBlockAlgorithm.extend({
        cfg: Base.extend(),
        init: function(cfg) {
          this.cfg = this.cfg.extend(cfg);
          this.reset();
        },
        reset: function() {
          BufferedBlockAlgorithm.reset.call(this);
          this._doReset();
        },
        update: function(messageUpdate) {
          this._append(messageUpdate);
          this._process();
          return this;
        },
        finalize: function(messageUpdate) {
          if (messageUpdate) {
            this._append(messageUpdate);
          }
          var hash = this._doFinalize();
          return hash;
        },
        blockSize: 512 / 32,
        _createHelper: function(hasher) {
          return function(message, cfg) {
            return new hasher.init(cfg).finalize(message);
          };
        },
        _createHmacHelper: function(hasher) {
          return function(message, key) {
            return new C_algo.HMAC.init(hasher, key).finalize(message);
          };
        }
      });
      var C_algo = C2.algo = {};
      return C2;
    }(Math);
    return CryptoJS;
  });
})(core);
var x64Core = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(undefined$1) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Base = C_lib.Base;
      var X32WordArray = C_lib.WordArray;
      var C_x64 = C2.x64 = {};
      C_x64.Word = Base.extend({
        init: function(high, low) {
          this.high = high;
          this.low = low;
        }
      });
      C_x64.WordArray = Base.extend({
        init: function(words, sigBytes) {
          words = this.words = words || [];
          if (sigBytes != undefined$1) {
            this.sigBytes = sigBytes;
          } else {
            this.sigBytes = words.length * 8;
          }
        },
        toX32: function() {
          var x64Words = this.words;
          var x64WordsLength = x64Words.length;
          var x32Words = [];
          for (var i2 = 0; i2 < x64WordsLength; i2++) {
            var x64Word = x64Words[i2];
            x32Words.push(x64Word.high);
            x32Words.push(x64Word.low);
          }
          return X32WordArray.create(x32Words, this.sigBytes);
        },
        clone: function() {
          var clone2 = Base.clone.call(this);
          var words = clone2.words = this.words.slice(0);
          var wordsLength = words.length;
          for (var i2 = 0; i2 < wordsLength; i2++) {
            words[i2] = words[i2].clone();
          }
          return clone2;
        }
      });
    })();
    return CryptoJS;
  });
})(x64Core);
var libTypedarrays = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      if (typeof ArrayBuffer != "function") {
        return;
      }
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var superInit = WordArray.init;
      var subInit = WordArray.init = function(typedArray) {
        if (typedArray instanceof ArrayBuffer) {
          typedArray = new Uint8Array(typedArray);
        }
        if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
          typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        }
        if (typedArray instanceof Uint8Array) {
          var typedArrayByteLength = typedArray.byteLength;
          var words = [];
          for (var i2 = 0; i2 < typedArrayByteLength; i2++) {
            words[i2 >>> 2] |= typedArray[i2] << 24 - i2 % 4 * 8;
          }
          superInit.call(this, words, typedArrayByteLength);
        } else {
          superInit.apply(this, arguments);
        }
      };
      subInit.prototype = WordArray;
    })();
    return CryptoJS.lib.WordArray;
  });
})(libTypedarrays);
var encUtf16 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C2.enc;
      C_enc.Utf16 = C_enc.Utf16BE = {
        stringify: function(wordArray) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var utf16Chars = [];
          for (var i2 = 0; i2 < sigBytes; i2 += 2) {
            var codePoint = words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535;
            utf16Chars.push(String.fromCharCode(codePoint));
          }
          return utf16Chars.join("");
        },
        parse: function(utf16Str) {
          var utf16StrLength = utf16Str.length;
          var words = [];
          for (var i2 = 0; i2 < utf16StrLength; i2++) {
            words[i2 >>> 1] |= utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16;
          }
          return WordArray.create(words, utf16StrLength * 2);
        }
      };
      C_enc.Utf16LE = {
        stringify: function(wordArray) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var utf16Chars = [];
          for (var i2 = 0; i2 < sigBytes; i2 += 2) {
            var codePoint = swapEndian(words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535);
            utf16Chars.push(String.fromCharCode(codePoint));
          }
          return utf16Chars.join("");
        },
        parse: function(utf16Str) {
          var utf16StrLength = utf16Str.length;
          var words = [];
          for (var i2 = 0; i2 < utf16StrLength; i2++) {
            words[i2 >>> 1] |= swapEndian(utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16);
          }
          return WordArray.create(words, utf16StrLength * 2);
        }
      };
      function swapEndian(word) {
        return word << 8 & 4278255360 | word >>> 8 & 16711935;
      }
    })();
    return CryptoJS.enc.Utf16;
  });
})(encUtf16);
var encBase64 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C2.enc;
      C_enc.Base64 = {
        stringify: function(wordArray) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var map = this._map;
          wordArray.clamp();
          var base64Chars = [];
          for (var i2 = 0; i2 < sigBytes; i2 += 3) {
            var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
            var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
            var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
            var triplet = byte1 << 16 | byte2 << 8 | byte3;
            for (var j2 = 0; j2 < 4 && i2 + j2 * 0.75 < sigBytes; j2++) {
              base64Chars.push(map.charAt(triplet >>> 6 * (3 - j2) & 63));
            }
          }
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            while (base64Chars.length % 4) {
              base64Chars.push(paddingChar);
            }
          }
          return base64Chars.join("");
        },
        parse: function(base64Str) {
          var base64StrLength = base64Str.length;
          var map = this._map;
          var reverseMap = this._reverseMap;
          if (!reverseMap) {
            reverseMap = this._reverseMap = [];
            for (var j2 = 0; j2 < map.length; j2++) {
              reverseMap[map.charCodeAt(j2)] = j2;
            }
          }
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
              base64StrLength = paddingIndex;
            }
          }
          return parseLoop(base64Str, base64StrLength, reverseMap);
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      };
      function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;
        for (var i2 = 0; i2 < base64StrLength; i2++) {
          if (i2 % 4) {
            var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
            var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
            var bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
            nBytes++;
          }
        }
        return WordArray.create(words, nBytes);
      }
    })();
    return CryptoJS.enc.Base64;
  });
})(encBase64);
var encBase64url = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var C_enc = C2.enc;
      C_enc.Base64url = {
        stringify: function(wordArray, urlSafe = true) {
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;
          var map = urlSafe ? this._safe_map : this._map;
          wordArray.clamp();
          var base64Chars = [];
          for (var i2 = 0; i2 < sigBytes; i2 += 3) {
            var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
            var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
            var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
            var triplet = byte1 << 16 | byte2 << 8 | byte3;
            for (var j2 = 0; j2 < 4 && i2 + j2 * 0.75 < sigBytes; j2++) {
              base64Chars.push(map.charAt(triplet >>> 6 * (3 - j2) & 63));
            }
          }
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            while (base64Chars.length % 4) {
              base64Chars.push(paddingChar);
            }
          }
          return base64Chars.join("");
        },
        parse: function(base64Str, urlSafe = true) {
          var base64StrLength = base64Str.length;
          var map = urlSafe ? this._safe_map : this._map;
          var reverseMap = this._reverseMap;
          if (!reverseMap) {
            reverseMap = this._reverseMap = [];
            for (var j2 = 0; j2 < map.length; j2++) {
              reverseMap[map.charCodeAt(j2)] = j2;
            }
          }
          var paddingChar = map.charAt(64);
          if (paddingChar) {
            var paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
              base64StrLength = paddingIndex;
            }
          }
          return parseLoop(base64Str, base64StrLength, reverseMap);
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
      };
      function parseLoop(base64Str, base64StrLength, reverseMap) {
        var words = [];
        var nBytes = 0;
        for (var i2 = 0; i2 < base64StrLength; i2++) {
          if (i2 % 4) {
            var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
            var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
            var bitsCombined = bits1 | bits2;
            words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
            nBytes++;
          }
        }
        return WordArray.create(words, nBytes);
      }
    })();
    return CryptoJS.enc.Base64url;
  });
})(encBase64url);
var md5 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(Math2) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C2.algo;
      var T2 = [];
      (function() {
        for (var i2 = 0; i2 < 64; i2++) {
          T2[i2] = Math2.abs(Math2.sin(i2 + 1)) * 4294967296 | 0;
        }
      })();
      var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function() {
          this._hash = new WordArray.init([
            1732584193,
            4023233417,
            2562383102,
            271733878
          ]);
        },
        _doProcessBlock: function(M2, offset) {
          for (var i2 = 0; i2 < 16; i2++) {
            var offset_i = offset + i2;
            var M_offset_i = M2[offset_i];
            M2[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
          }
          var H2 = this._hash.words;
          var M_offset_0 = M2[offset + 0];
          var M_offset_1 = M2[offset + 1];
          var M_offset_2 = M2[offset + 2];
          var M_offset_3 = M2[offset + 3];
          var M_offset_4 = M2[offset + 4];
          var M_offset_5 = M2[offset + 5];
          var M_offset_6 = M2[offset + 6];
          var M_offset_7 = M2[offset + 7];
          var M_offset_8 = M2[offset + 8];
          var M_offset_9 = M2[offset + 9];
          var M_offset_10 = M2[offset + 10];
          var M_offset_11 = M2[offset + 11];
          var M_offset_12 = M2[offset + 12];
          var M_offset_13 = M2[offset + 13];
          var M_offset_14 = M2[offset + 14];
          var M_offset_15 = M2[offset + 15];
          var a2 = H2[0];
          var b2 = H2[1];
          var c2 = H2[2];
          var d2 = H2[3];
          a2 = FF(a2, b2, c2, d2, M_offset_0, 7, T2[0]);
          d2 = FF(d2, a2, b2, c2, M_offset_1, 12, T2[1]);
          c2 = FF(c2, d2, a2, b2, M_offset_2, 17, T2[2]);
          b2 = FF(b2, c2, d2, a2, M_offset_3, 22, T2[3]);
          a2 = FF(a2, b2, c2, d2, M_offset_4, 7, T2[4]);
          d2 = FF(d2, a2, b2, c2, M_offset_5, 12, T2[5]);
          c2 = FF(c2, d2, a2, b2, M_offset_6, 17, T2[6]);
          b2 = FF(b2, c2, d2, a2, M_offset_7, 22, T2[7]);
          a2 = FF(a2, b2, c2, d2, M_offset_8, 7, T2[8]);
          d2 = FF(d2, a2, b2, c2, M_offset_9, 12, T2[9]);
          c2 = FF(c2, d2, a2, b2, M_offset_10, 17, T2[10]);
          b2 = FF(b2, c2, d2, a2, M_offset_11, 22, T2[11]);
          a2 = FF(a2, b2, c2, d2, M_offset_12, 7, T2[12]);
          d2 = FF(d2, a2, b2, c2, M_offset_13, 12, T2[13]);
          c2 = FF(c2, d2, a2, b2, M_offset_14, 17, T2[14]);
          b2 = FF(b2, c2, d2, a2, M_offset_15, 22, T2[15]);
          a2 = GG(a2, b2, c2, d2, M_offset_1, 5, T2[16]);
          d2 = GG(d2, a2, b2, c2, M_offset_6, 9, T2[17]);
          c2 = GG(c2, d2, a2, b2, M_offset_11, 14, T2[18]);
          b2 = GG(b2, c2, d2, a2, M_offset_0, 20, T2[19]);
          a2 = GG(a2, b2, c2, d2, M_offset_5, 5, T2[20]);
          d2 = GG(d2, a2, b2, c2, M_offset_10, 9, T2[21]);
          c2 = GG(c2, d2, a2, b2, M_offset_15, 14, T2[22]);
          b2 = GG(b2, c2, d2, a2, M_offset_4, 20, T2[23]);
          a2 = GG(a2, b2, c2, d2, M_offset_9, 5, T2[24]);
          d2 = GG(d2, a2, b2, c2, M_offset_14, 9, T2[25]);
          c2 = GG(c2, d2, a2, b2, M_offset_3, 14, T2[26]);
          b2 = GG(b2, c2, d2, a2, M_offset_8, 20, T2[27]);
          a2 = GG(a2, b2, c2, d2, M_offset_13, 5, T2[28]);
          d2 = GG(d2, a2, b2, c2, M_offset_2, 9, T2[29]);
          c2 = GG(c2, d2, a2, b2, M_offset_7, 14, T2[30]);
          b2 = GG(b2, c2, d2, a2, M_offset_12, 20, T2[31]);
          a2 = HH(a2, b2, c2, d2, M_offset_5, 4, T2[32]);
          d2 = HH(d2, a2, b2, c2, M_offset_8, 11, T2[33]);
          c2 = HH(c2, d2, a2, b2, M_offset_11, 16, T2[34]);
          b2 = HH(b2, c2, d2, a2, M_offset_14, 23, T2[35]);
          a2 = HH(a2, b2, c2, d2, M_offset_1, 4, T2[36]);
          d2 = HH(d2, a2, b2, c2, M_offset_4, 11, T2[37]);
          c2 = HH(c2, d2, a2, b2, M_offset_7, 16, T2[38]);
          b2 = HH(b2, c2, d2, a2, M_offset_10, 23, T2[39]);
          a2 = HH(a2, b2, c2, d2, M_offset_13, 4, T2[40]);
          d2 = HH(d2, a2, b2, c2, M_offset_0, 11, T2[41]);
          c2 = HH(c2, d2, a2, b2, M_offset_3, 16, T2[42]);
          b2 = HH(b2, c2, d2, a2, M_offset_6, 23, T2[43]);
          a2 = HH(a2, b2, c2, d2, M_offset_9, 4, T2[44]);
          d2 = HH(d2, a2, b2, c2, M_offset_12, 11, T2[45]);
          c2 = HH(c2, d2, a2, b2, M_offset_15, 16, T2[46]);
          b2 = HH(b2, c2, d2, a2, M_offset_2, 23, T2[47]);
          a2 = II(a2, b2, c2, d2, M_offset_0, 6, T2[48]);
          d2 = II(d2, a2, b2, c2, M_offset_7, 10, T2[49]);
          c2 = II(c2, d2, a2, b2, M_offset_14, 15, T2[50]);
          b2 = II(b2, c2, d2, a2, M_offset_5, 21, T2[51]);
          a2 = II(a2, b2, c2, d2, M_offset_12, 6, T2[52]);
          d2 = II(d2, a2, b2, c2, M_offset_3, 10, T2[53]);
          c2 = II(c2, d2, a2, b2, M_offset_10, 15, T2[54]);
          b2 = II(b2, c2, d2, a2, M_offset_1, 21, T2[55]);
          a2 = II(a2, b2, c2, d2, M_offset_8, 6, T2[56]);
          d2 = II(d2, a2, b2, c2, M_offset_15, 10, T2[57]);
          c2 = II(c2, d2, a2, b2, M_offset_6, 15, T2[58]);
          b2 = II(b2, c2, d2, a2, M_offset_13, 21, T2[59]);
          a2 = II(a2, b2, c2, d2, M_offset_4, 6, T2[60]);
          d2 = II(d2, a2, b2, c2, M_offset_11, 10, T2[61]);
          c2 = II(c2, d2, a2, b2, M_offset_2, 15, T2[62]);
          b2 = II(b2, c2, d2, a2, M_offset_9, 21, T2[63]);
          H2[0] = H2[0] + a2 | 0;
          H2[1] = H2[1] + b2 | 0;
          H2[2] = H2[2] + c2 | 0;
          H2[3] = H2[3] + d2 | 0;
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
          var nBitsTotalL = nBitsTotal;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
          data.sigBytes = (dataWords.length + 1) * 4;
          this._process();
          var hash = this._hash;
          var H2 = hash.words;
          for (var i2 = 0; i2 < 4; i2++) {
            var H_i = H2[i2];
            H2[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
          }
          return hash;
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          clone2._hash = this._hash.clone();
          return clone2;
        }
      });
      function FF(a2, b2, c2, d2, x2, s2, t2) {
        var n2 = a2 + (b2 & c2 | ~b2 & d2) + x2 + t2;
        return (n2 << s2 | n2 >>> 32 - s2) + b2;
      }
      function GG(a2, b2, c2, d2, x2, s2, t2) {
        var n2 = a2 + (b2 & d2 | c2 & ~d2) + x2 + t2;
        return (n2 << s2 | n2 >>> 32 - s2) + b2;
      }
      function HH(a2, b2, c2, d2, x2, s2, t2) {
        var n2 = a2 + (b2 ^ c2 ^ d2) + x2 + t2;
        return (n2 << s2 | n2 >>> 32 - s2) + b2;
      }
      function II(a2, b2, c2, d2, x2, s2, t2) {
        var n2 = a2 + (c2 ^ (b2 | ~d2)) + x2 + t2;
        return (n2 << s2 | n2 >>> 32 - s2) + b2;
      }
      C2.MD5 = Hasher._createHelper(MD5);
      C2.HmacMD5 = Hasher._createHmacHelper(MD5);
    })(Math);
    return CryptoJS.MD5;
  });
})(md5);
var sha1 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C2.algo;
      var W2 = [];
      var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function() {
          this._hash = new WordArray.init([
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520
          ]);
        },
        _doProcessBlock: function(M2, offset) {
          var H2 = this._hash.words;
          var a2 = H2[0];
          var b2 = H2[1];
          var c2 = H2[2];
          var d2 = H2[3];
          var e2 = H2[4];
          for (var i2 = 0; i2 < 80; i2++) {
            if (i2 < 16) {
              W2[i2] = M2[offset + i2] | 0;
            } else {
              var n2 = W2[i2 - 3] ^ W2[i2 - 8] ^ W2[i2 - 14] ^ W2[i2 - 16];
              W2[i2] = n2 << 1 | n2 >>> 31;
            }
            var t2 = (a2 << 5 | a2 >>> 27) + e2 + W2[i2];
            if (i2 < 20) {
              t2 += (b2 & c2 | ~b2 & d2) + 1518500249;
            } else if (i2 < 40) {
              t2 += (b2 ^ c2 ^ d2) + 1859775393;
            } else if (i2 < 60) {
              t2 += (b2 & c2 | b2 & d2 | c2 & d2) - 1894007588;
            } else {
              t2 += (b2 ^ c2 ^ d2) - 899497514;
            }
            e2 = d2;
            d2 = c2;
            c2 = b2 << 30 | b2 >>> 2;
            b2 = a2;
            a2 = t2;
          }
          H2[0] = H2[0] + a2 | 0;
          H2[1] = H2[1] + b2 | 0;
          H2[2] = H2[2] + c2 | 0;
          H2[3] = H2[3] + d2 | 0;
          H2[4] = H2[4] + e2 | 0;
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;
          this._process();
          return this._hash;
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          clone2._hash = this._hash.clone();
          return clone2;
        }
      });
      C2.SHA1 = Hasher._createHelper(SHA1);
      C2.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    })();
    return CryptoJS.SHA1;
  });
})(sha1);
var sha256 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(Math2) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C2.algo;
      var H2 = [];
      var K2 = [];
      (function() {
        function isPrime(n3) {
          var sqrtN = Math2.sqrt(n3);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n3 % factor)) {
              return false;
            }
          }
          return true;
        }
        function getFractionalBits(n3) {
          return (n3 - (n3 | 0)) * 4294967296 | 0;
        }
        var n2 = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n2)) {
            if (nPrime < 8) {
              H2[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 2));
            }
            K2[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 3));
            nPrime++;
          }
          n2++;
        }
      })();
      var W2 = [];
      var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function() {
          this._hash = new WordArray.init(H2.slice(0));
        },
        _doProcessBlock: function(M2, offset) {
          var H3 = this._hash.words;
          var a2 = H3[0];
          var b2 = H3[1];
          var c2 = H3[2];
          var d2 = H3[3];
          var e2 = H3[4];
          var f2 = H3[5];
          var g2 = H3[6];
          var h2 = H3[7];
          for (var i2 = 0; i2 < 64; i2++) {
            if (i2 < 16) {
              W2[i2] = M2[offset + i2] | 0;
            } else {
              var gamma0x = W2[i2 - 15];
              var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
              var gamma1x = W2[i2 - 2];
              var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
              W2[i2] = gamma0 + W2[i2 - 7] + gamma1 + W2[i2 - 16];
            }
            var ch = e2 & f2 ^ ~e2 & g2;
            var maj = a2 & b2 ^ a2 & c2 ^ b2 & c2;
            var sigma0 = (a2 << 30 | a2 >>> 2) ^ (a2 << 19 | a2 >>> 13) ^ (a2 << 10 | a2 >>> 22);
            var sigma1 = (e2 << 26 | e2 >>> 6) ^ (e2 << 21 | e2 >>> 11) ^ (e2 << 7 | e2 >>> 25);
            var t1 = h2 + sigma1 + ch + K2[i2] + W2[i2];
            var t2 = sigma0 + maj;
            h2 = g2;
            g2 = f2;
            f2 = e2;
            e2 = d2 + t1 | 0;
            d2 = c2;
            c2 = b2;
            b2 = a2;
            a2 = t1 + t2 | 0;
          }
          H3[0] = H3[0] + a2 | 0;
          H3[1] = H3[1] + b2 | 0;
          H3[2] = H3[2] + c2 | 0;
          H3[3] = H3[3] + d2 | 0;
          H3[4] = H3[4] + e2 | 0;
          H3[5] = H3[5] + f2 | 0;
          H3[6] = H3[6] + g2 | 0;
          H3[7] = H3[7] + h2 | 0;
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;
          this._process();
          return this._hash;
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          clone2._hash = this._hash.clone();
          return clone2;
        }
      });
      C2.SHA256 = Hasher._createHelper(SHA256);
      C2.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    })(Math);
    return CryptoJS.SHA256;
  });
})(sha256);
var sha224 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, sha256.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var C_algo = C2.algo;
      var SHA256 = C_algo.SHA256;
      var SHA224 = C_algo.SHA224 = SHA256.extend({
        _doReset: function() {
          this._hash = new WordArray.init([
            3238371032,
            914150663,
            812702999,
            4144912697,
            4290775857,
            1750603025,
            1694076839,
            3204075428
          ]);
        },
        _doFinalize: function() {
          var hash = SHA256._doFinalize.call(this);
          hash.sigBytes -= 4;
          return hash;
        }
      });
      C2.SHA224 = SHA256._createHelper(SHA224);
      C2.HmacSHA224 = SHA256._createHmacHelper(SHA224);
    })();
    return CryptoJS.SHA224;
  });
})(sha224);
var sha512 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, x64Core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Hasher = C_lib.Hasher;
      var C_x64 = C2.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C2.algo;
      function X64Word_create() {
        return X64Word.create.apply(X64Word, arguments);
      }
      var K2 = [
        X64Word_create(1116352408, 3609767458),
        X64Word_create(1899447441, 602891725),
        X64Word_create(3049323471, 3964484399),
        X64Word_create(3921009573, 2173295548),
        X64Word_create(961987163, 4081628472),
        X64Word_create(1508970993, 3053834265),
        X64Word_create(2453635748, 2937671579),
        X64Word_create(2870763221, 3664609560),
        X64Word_create(3624381080, 2734883394),
        X64Word_create(310598401, 1164996542),
        X64Word_create(607225278, 1323610764),
        X64Word_create(1426881987, 3590304994),
        X64Word_create(1925078388, 4068182383),
        X64Word_create(2162078206, 991336113),
        X64Word_create(2614888103, 633803317),
        X64Word_create(3248222580, 3479774868),
        X64Word_create(3835390401, 2666613458),
        X64Word_create(4022224774, 944711139),
        X64Word_create(264347078, 2341262773),
        X64Word_create(604807628, 2007800933),
        X64Word_create(770255983, 1495990901),
        X64Word_create(1249150122, 1856431235),
        X64Word_create(1555081692, 3175218132),
        X64Word_create(1996064986, 2198950837),
        X64Word_create(2554220882, 3999719339),
        X64Word_create(2821834349, 766784016),
        X64Word_create(2952996808, 2566594879),
        X64Word_create(3210313671, 3203337956),
        X64Word_create(3336571891, 1034457026),
        X64Word_create(3584528711, 2466948901),
        X64Word_create(113926993, 3758326383),
        X64Word_create(338241895, 168717936),
        X64Word_create(666307205, 1188179964),
        X64Word_create(773529912, 1546045734),
        X64Word_create(1294757372, 1522805485),
        X64Word_create(1396182291, 2643833823),
        X64Word_create(1695183700, 2343527390),
        X64Word_create(1986661051, 1014477480),
        X64Word_create(2177026350, 1206759142),
        X64Word_create(2456956037, 344077627),
        X64Word_create(2730485921, 1290863460),
        X64Word_create(2820302411, 3158454273),
        X64Word_create(3259730800, 3505952657),
        X64Word_create(3345764771, 106217008),
        X64Word_create(3516065817, 3606008344),
        X64Word_create(3600352804, 1432725776),
        X64Word_create(4094571909, 1467031594),
        X64Word_create(275423344, 851169720),
        X64Word_create(430227734, 3100823752),
        X64Word_create(506948616, 1363258195),
        X64Word_create(659060556, 3750685593),
        X64Word_create(883997877, 3785050280),
        X64Word_create(958139571, 3318307427),
        X64Word_create(1322822218, 3812723403),
        X64Word_create(1537002063, 2003034995),
        X64Word_create(1747873779, 3602036899),
        X64Word_create(1955562222, 1575990012),
        X64Word_create(2024104815, 1125592928),
        X64Word_create(2227730452, 2716904306),
        X64Word_create(2361852424, 442776044),
        X64Word_create(2428436474, 593698344),
        X64Word_create(2756734187, 3733110249),
        X64Word_create(3204031479, 2999351573),
        X64Word_create(3329325298, 3815920427),
        X64Word_create(3391569614, 3928383900),
        X64Word_create(3515267271, 566280711),
        X64Word_create(3940187606, 3454069534),
        X64Word_create(4118630271, 4000239992),
        X64Word_create(116418474, 1914138554),
        X64Word_create(174292421, 2731055270),
        X64Word_create(289380356, 3203993006),
        X64Word_create(460393269, 320620315),
        X64Word_create(685471733, 587496836),
        X64Word_create(852142971, 1086792851),
        X64Word_create(1017036298, 365543100),
        X64Word_create(1126000580, 2618297676),
        X64Word_create(1288033470, 3409855158),
        X64Word_create(1501505948, 4234509866),
        X64Word_create(1607167915, 987167468),
        X64Word_create(1816402316, 1246189591)
      ];
      var W2 = [];
      (function() {
        for (var i2 = 0; i2 < 80; i2++) {
          W2[i2] = X64Word_create();
        }
      })();
      var SHA512 = C_algo.SHA512 = Hasher.extend({
        _doReset: function() {
          this._hash = new X64WordArray.init([
            new X64Word.init(1779033703, 4089235720),
            new X64Word.init(3144134277, 2227873595),
            new X64Word.init(1013904242, 4271175723),
            new X64Word.init(2773480762, 1595750129),
            new X64Word.init(1359893119, 2917565137),
            new X64Word.init(2600822924, 725511199),
            new X64Word.init(528734635, 4215389547),
            new X64Word.init(1541459225, 327033209)
          ]);
        },
        _doProcessBlock: function(M2, offset) {
          var H2 = this._hash.words;
          var H0 = H2[0];
          var H1 = H2[1];
          var H22 = H2[2];
          var H3 = H2[3];
          var H4 = H2[4];
          var H5 = H2[5];
          var H6 = H2[6];
          var H7 = H2[7];
          var H0h = H0.high;
          var H0l = H0.low;
          var H1h = H1.high;
          var H1l = H1.low;
          var H2h = H22.high;
          var H2l = H22.low;
          var H3h = H3.high;
          var H3l = H3.low;
          var H4h = H4.high;
          var H4l = H4.low;
          var H5h = H5.high;
          var H5l = H5.low;
          var H6h = H6.high;
          var H6l = H6.low;
          var H7h = H7.high;
          var H7l = H7.low;
          var ah = H0h;
          var al = H0l;
          var bh = H1h;
          var bl = H1l;
          var ch = H2h;
          var cl = H2l;
          var dh = H3h;
          var dl = H3l;
          var eh = H4h;
          var el = H4l;
          var fh = H5h;
          var fl = H5l;
          var gh = H6h;
          var gl = H6l;
          var hh = H7h;
          var hl = H7l;
          for (var i2 = 0; i2 < 80; i2++) {
            var Wil;
            var Wih;
            var Wi = W2[i2];
            if (i2 < 16) {
              Wih = Wi.high = M2[offset + i2 * 2] | 0;
              Wil = Wi.low = M2[offset + i2 * 2 + 1] | 0;
            } else {
              var gamma0x = W2[i2 - 15];
              var gamma0xh = gamma0x.high;
              var gamma0xl = gamma0x.low;
              var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
              var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
              var gamma1x = W2[i2 - 2];
              var gamma1xh = gamma1x.high;
              var gamma1xl = gamma1x.low;
              var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
              var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
              var Wi7 = W2[i2 - 7];
              var Wi7h = Wi7.high;
              var Wi7l = Wi7.low;
              var Wi16 = W2[i2 - 16];
              var Wi16h = Wi16.high;
              var Wi16l = Wi16.low;
              Wil = gamma0l + Wi7l;
              Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
              Wil = Wil + gamma1l;
              Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
              Wil = Wil + Wi16l;
              Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
              Wi.high = Wih;
              Wi.low = Wil;
            }
            var chh = eh & fh ^ ~eh & gh;
            var chl = el & fl ^ ~el & gl;
            var majh = ah & bh ^ ah & ch ^ bh & ch;
            var majl = al & bl ^ al & cl ^ bl & cl;
            var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
            var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
            var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
            var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
            var Ki = K2[i2];
            var Kih = Ki.high;
            var Kil = Ki.low;
            var t1l = hl + sigma1l;
            var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
            var t1l = t1l + chl;
            var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
            var t1l = t1l + Kil;
            var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
            var t1l = t1l + Wil;
            var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
            var t2l = sigma0l + majl;
            var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            el = dl + t1l | 0;
            eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            al = t1l + t2l | 0;
            ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
          }
          H0l = H0.low = H0l + al;
          H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
          H1l = H1.low = H1l + bl;
          H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
          H2l = H22.low = H2l + cl;
          H22.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
          H3l = H3.low = H3l + dl;
          H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
          H4l = H4.low = H4l + el;
          H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
          H5l = H5.low = H5l + fl;
          H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
          H6l = H6.low = H6l + gl;
          H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
          H7l = H7.low = H7l + hl;
          H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
          dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
          data.sigBytes = dataWords.length * 4;
          this._process();
          var hash = this._hash.toX32();
          return hash;
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          clone2._hash = this._hash.clone();
          return clone2;
        },
        blockSize: 1024 / 32
      });
      C2.SHA512 = Hasher._createHelper(SHA512);
      C2.HmacSHA512 = Hasher._createHmacHelper(SHA512);
    })();
    return CryptoJS.SHA512;
  });
})(sha512);
var sha384 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, x64Core.exports, sha512.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_x64 = C2.x64;
      var X64Word = C_x64.Word;
      var X64WordArray = C_x64.WordArray;
      var C_algo = C2.algo;
      var SHA512 = C_algo.SHA512;
      var SHA384 = C_algo.SHA384 = SHA512.extend({
        _doReset: function() {
          this._hash = new X64WordArray.init([
            new X64Word.init(3418070365, 3238371032),
            new X64Word.init(1654270250, 914150663),
            new X64Word.init(2438529370, 812702999),
            new X64Word.init(355462360, 4144912697),
            new X64Word.init(1731405415, 4290775857),
            new X64Word.init(2394180231, 1750603025),
            new X64Word.init(3675008525, 1694076839),
            new X64Word.init(1203062813, 3204075428)
          ]);
        },
        _doFinalize: function() {
          var hash = SHA512._doFinalize.call(this);
          hash.sigBytes -= 16;
          return hash;
        }
      });
      C2.SHA384 = SHA512._createHelper(SHA384);
      C2.HmacSHA384 = SHA512._createHmacHelper(SHA384);
    })();
    return CryptoJS.SHA384;
  });
})(sha384);
var sha3 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, x64Core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(Math2) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_x64 = C2.x64;
      var X64Word = C_x64.Word;
      var C_algo = C2.algo;
      var RHO_OFFSETS = [];
      var PI_INDEXES = [];
      var ROUND_CONSTANTS = [];
      (function() {
        var x2 = 1, y = 0;
        for (var t2 = 0; t2 < 24; t2++) {
          RHO_OFFSETS[x2 + 5 * y] = (t2 + 1) * (t2 + 2) / 2 % 64;
          var newX = y % 5;
          var newY = (2 * x2 + 3 * y) % 5;
          x2 = newX;
          y = newY;
        }
        for (var x2 = 0; x2 < 5; x2++) {
          for (var y = 0; y < 5; y++) {
            PI_INDEXES[x2 + 5 * y] = y + (2 * x2 + 3 * y) % 5 * 5;
          }
        }
        var LFSR = 1;
        for (var i2 = 0; i2 < 24; i2++) {
          var roundConstantMsw = 0;
          var roundConstantLsw = 0;
          for (var j2 = 0; j2 < 7; j2++) {
            if (LFSR & 1) {
              var bitPosition = (1 << j2) - 1;
              if (bitPosition < 32) {
                roundConstantLsw ^= 1 << bitPosition;
              } else {
                roundConstantMsw ^= 1 << bitPosition - 32;
              }
            }
            if (LFSR & 128) {
              LFSR = LFSR << 1 ^ 113;
            } else {
              LFSR <<= 1;
            }
          }
          ROUND_CONSTANTS[i2] = X64Word.create(roundConstantMsw, roundConstantLsw);
        }
      })();
      var T2 = [];
      (function() {
        for (var i2 = 0; i2 < 25; i2++) {
          T2[i2] = X64Word.create();
        }
      })();
      var SHA3 = C_algo.SHA3 = Hasher.extend({
        cfg: Hasher.cfg.extend({
          outputLength: 512
        }),
        _doReset: function() {
          var state = this._state = [];
          for (var i2 = 0; i2 < 25; i2++) {
            state[i2] = new X64Word.init();
          }
          this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
        },
        _doProcessBlock: function(M2, offset) {
          var state = this._state;
          var nBlockSizeLanes = this.blockSize / 2;
          for (var i2 = 0; i2 < nBlockSizeLanes; i2++) {
            var M2i = M2[offset + 2 * i2];
            var M2i1 = M2[offset + 2 * i2 + 1];
            M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
            M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
            var lane = state[i2];
            lane.high ^= M2i1;
            lane.low ^= M2i;
          }
          for (var round = 0; round < 24; round++) {
            for (var x2 = 0; x2 < 5; x2++) {
              var tMsw = 0, tLsw = 0;
              for (var y = 0; y < 5; y++) {
                var lane = state[x2 + 5 * y];
                tMsw ^= lane.high;
                tLsw ^= lane.low;
              }
              var Tx = T2[x2];
              Tx.high = tMsw;
              Tx.low = tLsw;
            }
            for (var x2 = 0; x2 < 5; x2++) {
              var Tx4 = T2[(x2 + 4) % 5];
              var Tx1 = T2[(x2 + 1) % 5];
              var Tx1Msw = Tx1.high;
              var Tx1Lsw = Tx1.low;
              var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
              var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
              for (var y = 0; y < 5; y++) {
                var lane = state[x2 + 5 * y];
                lane.high ^= tMsw;
                lane.low ^= tLsw;
              }
            }
            for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
              var tMsw;
              var tLsw;
              var lane = state[laneIndex];
              var laneMsw = lane.high;
              var laneLsw = lane.low;
              var rhoOffset = RHO_OFFSETS[laneIndex];
              if (rhoOffset < 32) {
                tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
              } else {
                tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
              }
              var TPiLane = T2[PI_INDEXES[laneIndex]];
              TPiLane.high = tMsw;
              TPiLane.low = tLsw;
            }
            var T0 = T2[0];
            var state0 = state[0];
            T0.high = state0.high;
            T0.low = state0.low;
            for (var x2 = 0; x2 < 5; x2++) {
              for (var y = 0; y < 5; y++) {
                var laneIndex = x2 + 5 * y;
                var lane = state[laneIndex];
                var TLane = T2[laneIndex];
                var Tx1Lane = T2[(x2 + 1) % 5 + 5 * y];
                var Tx2Lane = T2[(x2 + 2) % 5 + 5 * y];
                lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
              }
            }
            var lane = state[0];
            var roundConstant = ROUND_CONSTANTS[round];
            lane.high ^= roundConstant.high;
            lane.low ^= roundConstant.low;
          }
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          var blockSizeBits = this.blockSize * 32;
          dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
          dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
          data.sigBytes = dataWords.length * 4;
          this._process();
          var state = this._state;
          var outputLengthBytes = this.cfg.outputLength / 8;
          var outputLengthLanes = outputLengthBytes / 8;
          var hashWords = [];
          for (var i2 = 0; i2 < outputLengthLanes; i2++) {
            var lane = state[i2];
            var laneMsw = lane.high;
            var laneLsw = lane.low;
            laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
            laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
            hashWords.push(laneLsw);
            hashWords.push(laneMsw);
          }
          return new WordArray.init(hashWords, outputLengthBytes);
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          var state = clone2._state = this._state.slice(0);
          for (var i2 = 0; i2 < 25; i2++) {
            state[i2] = state[i2].clone();
          }
          return clone2;
        }
      });
      C2.SHA3 = Hasher._createHelper(SHA3);
      C2.HmacSHA3 = Hasher._createHmacHelper(SHA3);
    })(Math);
    return CryptoJS.SHA3;
  });
})(sha3);
var ripemd160 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    /** @preserve
    	(c) 2012 by Cédric Mesnil. All rights reserved.
    
    	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
    
    	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    
    	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    	*/
    (function(Math2) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var Hasher = C_lib.Hasher;
      var C_algo = C2.algo;
      var _zl = WordArray.create([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        7,
        4,
        13,
        1,
        10,
        6,
        15,
        3,
        12,
        0,
        9,
        5,
        2,
        14,
        11,
        8,
        3,
        10,
        14,
        4,
        9,
        15,
        8,
        1,
        2,
        7,
        0,
        6,
        13,
        11,
        5,
        12,
        1,
        9,
        11,
        10,
        0,
        8,
        12,
        4,
        13,
        3,
        7,
        15,
        14,
        5,
        6,
        2,
        4,
        0,
        5,
        9,
        7,
        12,
        2,
        10,
        14,
        1,
        3,
        8,
        11,
        6,
        15,
        13
      ]);
      var _zr = WordArray.create([
        5,
        14,
        7,
        0,
        9,
        2,
        11,
        4,
        13,
        6,
        15,
        8,
        1,
        10,
        3,
        12,
        6,
        11,
        3,
        7,
        0,
        13,
        5,
        10,
        14,
        15,
        8,
        12,
        4,
        9,
        1,
        2,
        15,
        5,
        1,
        3,
        7,
        14,
        6,
        9,
        11,
        8,
        12,
        2,
        10,
        0,
        4,
        13,
        8,
        6,
        4,
        1,
        3,
        11,
        15,
        0,
        5,
        12,
        2,
        13,
        9,
        7,
        10,
        14,
        12,
        15,
        10,
        4,
        1,
        5,
        8,
        7,
        6,
        2,
        13,
        14,
        0,
        3,
        9,
        11
      ]);
      var _sl = WordArray.create([
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6
      ]);
      var _sr = WordArray.create([
        8,
        9,
        9,
        11,
        13,
        15,
        15,
        5,
        7,
        7,
        8,
        11,
        14,
        14,
        12,
        6,
        9,
        13,
        15,
        7,
        12,
        8,
        9,
        11,
        7,
        7,
        12,
        7,
        6,
        15,
        13,
        11,
        9,
        7,
        15,
        11,
        8,
        6,
        6,
        14,
        12,
        13,
        5,
        14,
        13,
        13,
        7,
        5,
        15,
        5,
        8,
        11,
        14,
        14,
        6,
        14,
        6,
        9,
        12,
        9,
        12,
        5,
        15,
        8,
        8,
        5,
        12,
        9,
        12,
        5,
        14,
        6,
        8,
        13,
        6,
        5,
        15,
        13,
        11,
        11
      ]);
      var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
      var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
      var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
        _doReset: function() {
          this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
        },
        _doProcessBlock: function(M2, offset) {
          for (var i2 = 0; i2 < 16; i2++) {
            var offset_i = offset + i2;
            var M_offset_i = M2[offset_i];
            M2[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
          }
          var H2 = this._hash.words;
          var hl = _hl.words;
          var hr = _hr.words;
          var zl = _zl.words;
          var zr = _zr.words;
          var sl = _sl.words;
          var sr2 = _sr.words;
          var al, bl, cl, dl, el;
          var ar, br, cr, dr, er;
          ar = al = H2[0];
          br = bl = H2[1];
          cr = cl = H2[2];
          dr = dl = H2[3];
          er = el = H2[4];
          var t2;
          for (var i2 = 0; i2 < 80; i2 += 1) {
            t2 = al + M2[offset + zl[i2]] | 0;
            if (i2 < 16) {
              t2 += f1(bl, cl, dl) + hl[0];
            } else if (i2 < 32) {
              t2 += f2(bl, cl, dl) + hl[1];
            } else if (i2 < 48) {
              t2 += f3(bl, cl, dl) + hl[2];
            } else if (i2 < 64) {
              t2 += f4(bl, cl, dl) + hl[3];
            } else {
              t2 += f5(bl, cl, dl) + hl[4];
            }
            t2 = t2 | 0;
            t2 = rotl(t2, sl[i2]);
            t2 = t2 + el | 0;
            al = el;
            el = dl;
            dl = rotl(cl, 10);
            cl = bl;
            bl = t2;
            t2 = ar + M2[offset + zr[i2]] | 0;
            if (i2 < 16) {
              t2 += f5(br, cr, dr) + hr[0];
            } else if (i2 < 32) {
              t2 += f4(br, cr, dr) + hr[1];
            } else if (i2 < 48) {
              t2 += f3(br, cr, dr) + hr[2];
            } else if (i2 < 64) {
              t2 += f2(br, cr, dr) + hr[3];
            } else {
              t2 += f1(br, cr, dr) + hr[4];
            }
            t2 = t2 | 0;
            t2 = rotl(t2, sr2[i2]);
            t2 = t2 + er | 0;
            ar = er;
            er = dr;
            dr = rotl(cr, 10);
            cr = br;
            br = t2;
          }
          t2 = H2[1] + cl + dr | 0;
          H2[1] = H2[2] + dl + er | 0;
          H2[2] = H2[3] + el + ar | 0;
          H2[3] = H2[4] + al + br | 0;
          H2[4] = H2[0] + bl + cr | 0;
          H2[0] = t2;
        },
        _doFinalize: function() {
          var data = this._data;
          var dataWords = data.words;
          var nBitsTotal = this._nDataBytes * 8;
          var nBitsLeft = data.sigBytes * 8;
          dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
          dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
          data.sigBytes = (dataWords.length + 1) * 4;
          this._process();
          var hash = this._hash;
          var H2 = hash.words;
          for (var i2 = 0; i2 < 5; i2++) {
            var H_i = H2[i2];
            H2[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
          }
          return hash;
        },
        clone: function() {
          var clone2 = Hasher.clone.call(this);
          clone2._hash = this._hash.clone();
          return clone2;
        }
      });
      function f1(x2, y, z2) {
        return x2 ^ y ^ z2;
      }
      function f2(x2, y, z2) {
        return x2 & y | ~x2 & z2;
      }
      function f3(x2, y, z2) {
        return (x2 | ~y) ^ z2;
      }
      function f4(x2, y, z2) {
        return x2 & z2 | y & ~z2;
      }
      function f5(x2, y, z2) {
        return x2 ^ (y | ~z2);
      }
      function rotl(x2, n2) {
        return x2 << n2 | x2 >>> 32 - n2;
      }
      C2.RIPEMD160 = Hasher._createHelper(RIPEMD160);
      C2.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
    })();
    return CryptoJS.RIPEMD160;
  });
})(ripemd160);
var hmac = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory) {
    {
      module2.exports = factory(core.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Base = C_lib.Base;
      var C_enc = C2.enc;
      var Utf8 = C_enc.Utf8;
      var C_algo = C2.algo;
      C_algo.HMAC = Base.extend({
        init: function(hasher, key) {
          hasher = this._hasher = new hasher.init();
          if (typeof key == "string") {
            key = Utf8.parse(key);
          }
          var hasherBlockSize = hasher.blockSize;
          var hasherBlockSizeBytes = hasherBlockSize * 4;
          if (key.sigBytes > hasherBlockSizeBytes) {
            key = hasher.finalize(key);
          }
          key.clamp();
          var oKey = this._oKey = key.clone();
          var iKey = this._iKey = key.clone();
          var oKeyWords = oKey.words;
          var iKeyWords = iKey.words;
          for (var i2 = 0; i2 < hasherBlockSize; i2++) {
            oKeyWords[i2] ^= 1549556828;
            iKeyWords[i2] ^= 909522486;
          }
          oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
          this.reset();
        },
        reset: function() {
          var hasher = this._hasher;
          hasher.reset();
          hasher.update(this._iKey);
        },
        update: function(messageUpdate) {
          this._hasher.update(messageUpdate);
          return this;
        },
        finalize: function(messageUpdate) {
          var hasher = this._hasher;
          var innerHash = hasher.finalize(messageUpdate);
          hasher.reset();
          var hmac2 = hasher.finalize(this._oKey.clone().concat(innerHash));
          return hmac2;
        }
      });
    })();
  });
})(hmac);
var pbkdf2 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, sha1.exports, hmac.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C2.algo;
      var SHA1 = C_algo.SHA1;
      var HMAC = C_algo.HMAC;
      var PBKDF2 = C_algo.PBKDF2 = Base.extend({
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: SHA1,
          iterations: 1
        }),
        init: function(cfg) {
          this.cfg = this.cfg.extend(cfg);
        },
        compute: function(password, salt) {
          var cfg = this.cfg;
          var hmac2 = HMAC.create(cfg.hasher, password);
          var derivedKey = WordArray.create();
          var blockIndex = WordArray.create([1]);
          var derivedKeyWords = derivedKey.words;
          var blockIndexWords = blockIndex.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations;
          while (derivedKeyWords.length < keySize) {
            var block = hmac2.update(salt).finalize(blockIndex);
            hmac2.reset();
            var blockWords = block.words;
            var blockWordsLength = blockWords.length;
            var intermediate = block;
            for (var i2 = 1; i2 < iterations; i2++) {
              intermediate = hmac2.finalize(intermediate);
              hmac2.reset();
              var intermediateWords = intermediate.words;
              for (var j2 = 0; j2 < blockWordsLength; j2++) {
                blockWords[j2] ^= intermediateWords[j2];
              }
            }
            derivedKey.concat(block);
            blockIndexWords[0]++;
          }
          derivedKey.sigBytes = keySize * 4;
          return derivedKey;
        }
      });
      C2.PBKDF2 = function(password, salt, cfg) {
        return PBKDF2.create(cfg).compute(password, salt);
      };
    })();
    return CryptoJS.PBKDF2;
  });
})(pbkdf2);
var evpkdf = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, sha1.exports, hmac.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var C_algo = C2.algo;
      var MD5 = C_algo.MD5;
      var EvpKDF = C_algo.EvpKDF = Base.extend({
        cfg: Base.extend({
          keySize: 128 / 32,
          hasher: MD5,
          iterations: 1
        }),
        init: function(cfg) {
          this.cfg = this.cfg.extend(cfg);
        },
        compute: function(password, salt) {
          var block;
          var cfg = this.cfg;
          var hasher = cfg.hasher.create();
          var derivedKey = WordArray.create();
          var derivedKeyWords = derivedKey.words;
          var keySize = cfg.keySize;
          var iterations = cfg.iterations;
          while (derivedKeyWords.length < keySize) {
            if (block) {
              hasher.update(block);
            }
            block = hasher.update(password).finalize(salt);
            hasher.reset();
            for (var i2 = 1; i2 < iterations; i2++) {
              block = hasher.finalize(block);
              hasher.reset();
            }
            derivedKey.concat(block);
          }
          derivedKey.sigBytes = keySize * 4;
          return derivedKey;
        }
      });
      C2.EvpKDF = function(password, salt, cfg) {
        return EvpKDF.create(cfg).compute(password, salt);
      };
    })();
    return CryptoJS.EvpKDF;
  });
})(evpkdf);
var cipherCore = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, evpkdf.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.lib.Cipher || function(undefined$1) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var Base = C_lib.Base;
      var WordArray = C_lib.WordArray;
      var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
      var C_enc = C2.enc;
      C_enc.Utf8;
      var Base64 = C_enc.Base64;
      var C_algo = C2.algo;
      var EvpKDF = C_algo.EvpKDF;
      var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        cfg: Base.extend(),
        createEncryptor: function(key, cfg) {
          return this.create(this._ENC_XFORM_MODE, key, cfg);
        },
        createDecryptor: function(key, cfg) {
          return this.create(this._DEC_XFORM_MODE, key, cfg);
        },
        init: function(xformMode, key, cfg) {
          this.cfg = this.cfg.extend(cfg);
          this._xformMode = xformMode;
          this._key = key;
          this.reset();
        },
        reset: function() {
          BufferedBlockAlgorithm.reset.call(this);
          this._doReset();
        },
        process: function(dataUpdate) {
          this._append(dataUpdate);
          return this._process();
        },
        finalize: function(dataUpdate) {
          if (dataUpdate) {
            this._append(dataUpdate);
          }
          var finalProcessedData = this._doFinalize();
          return finalProcessedData;
        },
        keySize: 128 / 32,
        ivSize: 128 / 32,
        _ENC_XFORM_MODE: 1,
        _DEC_XFORM_MODE: 2,
        _createHelper: function() {
          function selectCipherStrategy(key) {
            if (typeof key == "string") {
              return PasswordBasedCipher;
            } else {
              return SerializableCipher;
            }
          }
          return function(cipher) {
            return {
              encrypt: function(message, key, cfg) {
                return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
              },
              decrypt: function(ciphertext, key, cfg) {
                return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
              }
            };
          };
        }()
      });
      C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function() {
          var finalProcessedBlocks = this._process(true);
          return finalProcessedBlocks;
        },
        blockSize: 1
      });
      var C_mode = C2.mode = {};
      var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        createEncryptor: function(cipher, iv) {
          return this.Encryptor.create(cipher, iv);
        },
        createDecryptor: function(cipher, iv) {
          return this.Decryptor.create(cipher, iv);
        },
        init: function(cipher, iv) {
          this._cipher = cipher;
          this._iv = iv;
        }
      });
      var CBC = C_mode.CBC = function() {
        var CBC2 = BlockCipherMode.extend();
        CBC2.Encryptor = CBC2.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            xorBlock.call(this, words, offset, blockSize);
            cipher.encryptBlock(words, offset);
            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });
        CBC2.Decryptor = CBC2.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var thisBlock = words.slice(offset, offset + blockSize);
            cipher.decryptBlock(words, offset);
            xorBlock.call(this, words, offset, blockSize);
            this._prevBlock = thisBlock;
          }
        });
        function xorBlock(words, offset, blockSize) {
          var block;
          var iv = this._iv;
          if (iv) {
            block = iv;
            this._iv = undefined$1;
          } else {
            block = this._prevBlock;
          }
          for (var i2 = 0; i2 < blockSize; i2++) {
            words[offset + i2] ^= block[i2];
          }
        }
        return CBC2;
      }();
      var C_pad = C2.pad = {};
      var Pkcs7 = C_pad.Pkcs7 = {
        pad: function(data, blockSize) {
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
          var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
          var paddingWords = [];
          for (var i2 = 0; i2 < nPaddingBytes; i2 += 4) {
            paddingWords.push(paddingWord);
          }
          var padding = WordArray.create(paddingWords, nPaddingBytes);
          data.concat(padding);
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      C_lib.BlockCipher = Cipher.extend({
        cfg: Cipher.cfg.extend({
          mode: CBC,
          padding: Pkcs7
        }),
        reset: function() {
          var modeCreator;
          Cipher.reset.call(this);
          var cfg = this.cfg;
          var iv = cfg.iv;
          var mode = cfg.mode;
          if (this._xformMode == this._ENC_XFORM_MODE) {
            modeCreator = mode.createEncryptor;
          } else {
            modeCreator = mode.createDecryptor;
            this._minBufferSize = 1;
          }
          if (this._mode && this._mode.__creator == modeCreator) {
            this._mode.init(this, iv && iv.words);
          } else {
            this._mode = modeCreator.call(mode, this, iv && iv.words);
            this._mode.__creator = modeCreator;
          }
        },
        _doProcessBlock: function(words, offset) {
          this._mode.processBlock(words, offset);
        },
        _doFinalize: function() {
          var finalProcessedBlocks;
          var padding = this.cfg.padding;
          if (this._xformMode == this._ENC_XFORM_MODE) {
            padding.pad(this._data, this.blockSize);
            finalProcessedBlocks = this._process(true);
          } else {
            finalProcessedBlocks = this._process(true);
            padding.unpad(finalProcessedBlocks);
          }
          return finalProcessedBlocks;
        },
        blockSize: 128 / 32
      });
      var CipherParams = C_lib.CipherParams = Base.extend({
        init: function(cipherParams) {
          this.mixIn(cipherParams);
        },
        toString: function(formatter) {
          return (formatter || this.formatter).stringify(this);
        }
      });
      var C_format = C2.format = {};
      var OpenSSLFormatter = C_format.OpenSSL = {
        stringify: function(cipherParams) {
          var wordArray;
          var ciphertext = cipherParams.ciphertext;
          var salt = cipherParams.salt;
          if (salt) {
            wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
          } else {
            wordArray = ciphertext;
          }
          return wordArray.toString(Base64);
        },
        parse: function(openSSLStr) {
          var salt;
          var ciphertext = Base64.parse(openSSLStr);
          var ciphertextWords = ciphertext.words;
          if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
            salt = WordArray.create(ciphertextWords.slice(2, 4));
            ciphertextWords.splice(0, 4);
            ciphertext.sigBytes -= 16;
          }
          return CipherParams.create({ ciphertext, salt });
        }
      };
      var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        cfg: Base.extend({
          format: OpenSSLFormatter
        }),
        encrypt: function(cipher, message, key, cfg) {
          cfg = this.cfg.extend(cfg);
          var encryptor = cipher.createEncryptor(key, cfg);
          var ciphertext = encryptor.finalize(message);
          var cipherCfg = encryptor.cfg;
          return CipherParams.create({
            ciphertext,
            key,
            iv: cipherCfg.iv,
            algorithm: cipher,
            mode: cipherCfg.mode,
            padding: cipherCfg.padding,
            blockSize: cipher.blockSize,
            formatter: cfg.format
          });
        },
        decrypt: function(cipher, ciphertext, key, cfg) {
          cfg = this.cfg.extend(cfg);
          ciphertext = this._parse(ciphertext, cfg.format);
          var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
          return plaintext;
        },
        _parse: function(ciphertext, format) {
          if (typeof ciphertext == "string") {
            return format.parse(ciphertext, this);
          } else {
            return ciphertext;
          }
        }
      });
      var C_kdf = C2.kdf = {};
      var OpenSSLKdf = C_kdf.OpenSSL = {
        execute: function(password, keySize, ivSize, salt) {
          if (!salt) {
            salt = WordArray.random(64 / 8);
          }
          var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
          var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
          key.sigBytes = keySize * 4;
          return CipherParams.create({ key, iv, salt });
        }
      };
      var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        cfg: SerializableCipher.cfg.extend({
          kdf: OpenSSLKdf
        }),
        encrypt: function(cipher, message, password, cfg) {
          cfg = this.cfg.extend(cfg);
          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
          cfg.iv = derivedParams.iv;
          var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
          ciphertext.mixIn(derivedParams);
          return ciphertext;
        },
        decrypt: function(cipher, ciphertext, password, cfg) {
          cfg = this.cfg.extend(cfg);
          ciphertext = this._parse(ciphertext, cfg.format);
          var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
          cfg.iv = derivedParams.iv;
          var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
          return plaintext;
        }
      });
    }();
  });
})(cipherCore);
var modeCfb = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.mode.CFB = function() {
      var CFB = CryptoJS.lib.BlockCipherMode.extend();
      CFB.Encryptor = CFB.extend({
        processBlock: function(words, offset) {
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
          this._prevBlock = words.slice(offset, offset + blockSize);
        }
      });
      CFB.Decryptor = CFB.extend({
        processBlock: function(words, offset) {
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var thisBlock = words.slice(offset, offset + blockSize);
          generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
          this._prevBlock = thisBlock;
        }
      });
      function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
        var keystream;
        var iv = this._iv;
        if (iv) {
          keystream = iv.slice(0);
          this._iv = void 0;
        } else {
          keystream = this._prevBlock;
        }
        cipher.encryptBlock(keystream, 0);
        for (var i2 = 0; i2 < blockSize; i2++) {
          words[offset + i2] ^= keystream[i2];
        }
      }
      return CFB;
    }();
    return CryptoJS.mode.CFB;
  });
})(modeCfb);
var modeCtr = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.mode.CTR = function() {
      var CTR = CryptoJS.lib.BlockCipherMode.extend();
      var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function(words, offset) {
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter;
          if (iv) {
            counter = this._counter = iv.slice(0);
            this._iv = void 0;
          }
          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0);
          counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
          for (var i2 = 0; i2 < blockSize; i2++) {
            words[offset + i2] ^= keystream[i2];
          }
        }
      });
      CTR.Decryptor = Encryptor;
      return CTR;
    }();
    return CryptoJS.mode.CTR;
  });
})(modeCtr);
var modeCtrGladman = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    /** @preserve
     * Counter block mode compatible with  Dr Brian Gladman fileenc.c
     * derived from CryptoJS.mode.CTR
     * Jan Hruby jhruby.web@gmail.com
     */
    CryptoJS.mode.CTRGladman = function() {
      var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
      function incWord(word) {
        if ((word >> 24 & 255) === 255) {
          var b1 = word >> 16 & 255;
          var b2 = word >> 8 & 255;
          var b3 = word & 255;
          if (b1 === 255) {
            b1 = 0;
            if (b2 === 255) {
              b2 = 0;
              if (b3 === 255) {
                b3 = 0;
              } else {
                ++b3;
              }
            } else {
              ++b2;
            }
          } else {
            ++b1;
          }
          word = 0;
          word += b1 << 16;
          word += b2 << 8;
          word += b3;
        } else {
          word += 1 << 24;
        }
        return word;
      }
      function incCounter(counter) {
        if ((counter[0] = incWord(counter[0])) === 0) {
          counter[1] = incWord(counter[1]);
        }
        return counter;
      }
      var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
        processBlock: function(words, offset) {
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var counter = this._counter;
          if (iv) {
            counter = this._counter = iv.slice(0);
            this._iv = void 0;
          }
          incCounter(counter);
          var keystream = counter.slice(0);
          cipher.encryptBlock(keystream, 0);
          for (var i2 = 0; i2 < blockSize; i2++) {
            words[offset + i2] ^= keystream[i2];
          }
        }
      });
      CTRGladman.Decryptor = Encryptor;
      return CTRGladman;
    }();
    return CryptoJS.mode.CTRGladman;
  });
})(modeCtrGladman);
var modeOfb = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.mode.OFB = function() {
      var OFB = CryptoJS.lib.BlockCipherMode.extend();
      var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function(words, offset) {
          var cipher = this._cipher;
          var blockSize = cipher.blockSize;
          var iv = this._iv;
          var keystream = this._keystream;
          if (iv) {
            keystream = this._keystream = iv.slice(0);
            this._iv = void 0;
          }
          cipher.encryptBlock(keystream, 0);
          for (var i2 = 0; i2 < blockSize; i2++) {
            words[offset + i2] ^= keystream[i2];
          }
        }
      });
      OFB.Decryptor = Encryptor;
      return OFB;
    }();
    return CryptoJS.mode.OFB;
  });
})(modeOfb);
var modeEcb = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.mode.ECB = function() {
      var ECB = CryptoJS.lib.BlockCipherMode.extend();
      ECB.Encryptor = ECB.extend({
        processBlock: function(words, offset) {
          this._cipher.encryptBlock(words, offset);
        }
      });
      ECB.Decryptor = ECB.extend({
        processBlock: function(words, offset) {
          this._cipher.decryptBlock(words, offset);
        }
      });
      return ECB;
    }();
    return CryptoJS.mode.ECB;
  });
})(modeEcb);
var padAnsix923 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.pad.AnsiX923 = {
      pad: function(data, blockSize) {
        var dataSigBytes = data.sigBytes;
        var blockSizeBytes = blockSize * 4;
        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
        var lastBytePos = dataSigBytes + nPaddingBytes - 1;
        data.clamp();
        data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
        data.sigBytes += nPaddingBytes;
      },
      unpad: function(data) {
        var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
        data.sigBytes -= nPaddingBytes;
      }
    };
    return CryptoJS.pad.Ansix923;
  });
})(padAnsix923);
var padIso10126 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.pad.Iso10126 = {
      pad: function(data, blockSize) {
        var blockSizeBytes = blockSize * 4;
        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
      },
      unpad: function(data) {
        var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
        data.sigBytes -= nPaddingBytes;
      }
    };
    return CryptoJS.pad.Iso10126;
  });
})(padIso10126);
var padIso97971 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.pad.Iso97971 = {
      pad: function(data, blockSize) {
        data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
      },
      unpad: function(data) {
        CryptoJS.pad.ZeroPadding.unpad(data);
        data.sigBytes--;
      }
    };
    return CryptoJS.pad.Iso97971;
  });
})(padIso97971);
var padZeropadding = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.pad.ZeroPadding = {
      pad: function(data, blockSize) {
        var blockSizeBytes = blockSize * 4;
        data.clamp();
        data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
      },
      unpad: function(data) {
        var dataWords = data.words;
        var i2 = data.sigBytes - 1;
        for (var i2 = data.sigBytes - 1; i2 >= 0; i2--) {
          if (dataWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) {
            data.sigBytes = i2 + 1;
            break;
          }
        }
      }
    };
    return CryptoJS.pad.ZeroPadding;
  });
})(padZeropadding);
var padNopadding = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    CryptoJS.pad.NoPadding = {
      pad: function() {
      },
      unpad: function() {
      }
    };
    return CryptoJS.pad.NoPadding;
  });
})(padNopadding);
var formatHex = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function(undefined$1) {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var CipherParams = C_lib.CipherParams;
      var C_enc = C2.enc;
      var Hex = C_enc.Hex;
      var C_format = C2.format;
      C_format.Hex = {
        stringify: function(cipherParams) {
          return cipherParams.ciphertext.toString(Hex);
        },
        parse: function(input) {
          var ciphertext = Hex.parse(input);
          return CipherParams.create({ ciphertext });
        }
      };
    })();
    return CryptoJS.format.Hex;
  });
})(formatHex);
var aes = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, encBase64.exports, md5.exports, evpkdf.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C2.algo;
      var SBOX = [];
      var INV_SBOX = [];
      var SUB_MIX_0 = [];
      var SUB_MIX_1 = [];
      var SUB_MIX_2 = [];
      var SUB_MIX_3 = [];
      var INV_SUB_MIX_0 = [];
      var INV_SUB_MIX_1 = [];
      var INV_SUB_MIX_2 = [];
      var INV_SUB_MIX_3 = [];
      (function() {
        var d2 = [];
        for (var i2 = 0; i2 < 256; i2++) {
          if (i2 < 128) {
            d2[i2] = i2 << 1;
          } else {
            d2[i2] = i2 << 1 ^ 283;
          }
        }
        var x2 = 0;
        var xi = 0;
        for (var i2 = 0; i2 < 256; i2++) {
          var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
          sx = sx >>> 8 ^ sx & 255 ^ 99;
          SBOX[x2] = sx;
          INV_SBOX[sx] = x2;
          var x22 = d2[x2];
          var x4 = d2[x22];
          var x8 = d2[x4];
          var t2 = d2[sx] * 257 ^ sx * 16843008;
          SUB_MIX_0[x2] = t2 << 24 | t2 >>> 8;
          SUB_MIX_1[x2] = t2 << 16 | t2 >>> 16;
          SUB_MIX_2[x2] = t2 << 8 | t2 >>> 24;
          SUB_MIX_3[x2] = t2;
          var t2 = x8 * 16843009 ^ x4 * 65537 ^ x22 * 257 ^ x2 * 16843008;
          INV_SUB_MIX_0[sx] = t2 << 24 | t2 >>> 8;
          INV_SUB_MIX_1[sx] = t2 << 16 | t2 >>> 16;
          INV_SUB_MIX_2[sx] = t2 << 8 | t2 >>> 24;
          INV_SUB_MIX_3[sx] = t2;
          if (!x2) {
            x2 = xi = 1;
          } else {
            x2 = x22 ^ d2[d2[d2[x8 ^ x22]]];
            xi ^= d2[d2[xi]];
          }
        }
      })();
      var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
      var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function() {
          var t2;
          if (this._nRounds && this._keyPriorReset === this._key) {
            return;
          }
          var key = this._keyPriorReset = this._key;
          var keyWords = key.words;
          var keySize = key.sigBytes / 4;
          var nRounds = this._nRounds = keySize + 6;
          var ksRows = (nRounds + 1) * 4;
          var keySchedule = this._keySchedule = [];
          for (var ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keySize) {
              keySchedule[ksRow] = keyWords[ksRow];
            } else {
              t2 = keySchedule[ksRow - 1];
              if (!(ksRow % keySize)) {
                t2 = t2 << 8 | t2 >>> 24;
                t2 = SBOX[t2 >>> 24] << 24 | SBOX[t2 >>> 16 & 255] << 16 | SBOX[t2 >>> 8 & 255] << 8 | SBOX[t2 & 255];
                t2 ^= RCON[ksRow / keySize | 0] << 24;
              } else if (keySize > 6 && ksRow % keySize == 4) {
                t2 = SBOX[t2 >>> 24] << 24 | SBOX[t2 >>> 16 & 255] << 16 | SBOX[t2 >>> 8 & 255] << 8 | SBOX[t2 & 255];
              }
              keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t2;
            }
          }
          var invKeySchedule = this._invKeySchedule = [];
          for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
            var ksRow = ksRows - invKsRow;
            if (invKsRow % 4) {
              var t2 = keySchedule[ksRow];
            } else {
              var t2 = keySchedule[ksRow - 4];
            }
            if (invKsRow < 4 || ksRow <= 4) {
              invKeySchedule[invKsRow] = t2;
            } else {
              invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t2 >>> 24]] ^ INV_SUB_MIX_1[SBOX[t2 >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t2 >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t2 & 255]];
            }
          }
        },
        encryptBlock: function(M2, offset) {
          this._doCryptBlock(M2, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },
        decryptBlock: function(M2, offset) {
          var t2 = M2[offset + 1];
          M2[offset + 1] = M2[offset + 3];
          M2[offset + 3] = t2;
          this._doCryptBlock(M2, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
          var t2 = M2[offset + 1];
          M2[offset + 1] = M2[offset + 3];
          M2[offset + 3] = t2;
        },
        _doCryptBlock: function(M2, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
          var nRounds = this._nRounds;
          var s0 = M2[offset] ^ keySchedule[0];
          var s1 = M2[offset + 1] ^ keySchedule[1];
          var s2 = M2[offset + 2] ^ keySchedule[2];
          var s3 = M2[offset + 3] ^ keySchedule[3];
          var ksRow = 4;
          for (var round = 1; round < nRounds; round++) {
            var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
            var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
            var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
            var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
          }
          var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
          var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
          var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
          var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
          M2[offset] = t0;
          M2[offset + 1] = t1;
          M2[offset + 2] = t2;
          M2[offset + 3] = t3;
        },
        keySize: 256 / 32
      });
      C2.AES = BlockCipher._createHelper(AES);
    })();
    return CryptoJS.AES;
  });
})(aes);
var tripledes = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, encBase64.exports, md5.exports, evpkdf.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var WordArray = C_lib.WordArray;
      var BlockCipher = C_lib.BlockCipher;
      var C_algo = C2.algo;
      var PC1 = [
        57,
        49,
        41,
        33,
        25,
        17,
        9,
        1,
        58,
        50,
        42,
        34,
        26,
        18,
        10,
        2,
        59,
        51,
        43,
        35,
        27,
        19,
        11,
        3,
        60,
        52,
        44,
        36,
        63,
        55,
        47,
        39,
        31,
        23,
        15,
        7,
        62,
        54,
        46,
        38,
        30,
        22,
        14,
        6,
        61,
        53,
        45,
        37,
        29,
        21,
        13,
        5,
        28,
        20,
        12,
        4
      ];
      var PC2 = [
        14,
        17,
        11,
        24,
        1,
        5,
        3,
        28,
        15,
        6,
        21,
        10,
        23,
        19,
        12,
        4,
        26,
        8,
        16,
        7,
        27,
        20,
        13,
        2,
        41,
        52,
        31,
        37,
        47,
        55,
        30,
        40,
        51,
        45,
        33,
        48,
        44,
        49,
        39,
        56,
        34,
        53,
        46,
        42,
        50,
        36,
        29,
        32
      ];
      var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
      var SBOX_P = [
        {
          0: 8421888,
          268435456: 32768,
          536870912: 8421378,
          805306368: 2,
          1073741824: 512,
          1342177280: 8421890,
          1610612736: 8389122,
          1879048192: 8388608,
          2147483648: 514,
          2415919104: 8389120,
          2684354560: 33280,
          2952790016: 8421376,
          3221225472: 32770,
          3489660928: 8388610,
          3758096384: 0,
          4026531840: 33282,
          134217728: 0,
          402653184: 8421890,
          671088640: 33282,
          939524096: 32768,
          1207959552: 8421888,
          1476395008: 512,
          1744830464: 8421378,
          2013265920: 2,
          2281701376: 8389120,
          2550136832: 33280,
          2818572288: 8421376,
          3087007744: 8389122,
          3355443200: 8388610,
          3623878656: 32770,
          3892314112: 514,
          4160749568: 8388608,
          1: 32768,
          268435457: 2,
          536870913: 8421888,
          805306369: 8388608,
          1073741825: 8421378,
          1342177281: 33280,
          1610612737: 512,
          1879048193: 8389122,
          2147483649: 8421890,
          2415919105: 8421376,
          2684354561: 8388610,
          2952790017: 33282,
          3221225473: 514,
          3489660929: 8389120,
          3758096385: 32770,
          4026531841: 0,
          134217729: 8421890,
          402653185: 8421376,
          671088641: 8388608,
          939524097: 512,
          1207959553: 32768,
          1476395009: 8388610,
          1744830465: 2,
          2013265921: 33282,
          2281701377: 32770,
          2550136833: 8389122,
          2818572289: 514,
          3087007745: 8421888,
          3355443201: 8389120,
          3623878657: 0,
          3892314113: 33280,
          4160749569: 8421378
        },
        {
          0: 1074282512,
          16777216: 16384,
          33554432: 524288,
          50331648: 1074266128,
          67108864: 1073741840,
          83886080: 1074282496,
          100663296: 1073758208,
          117440512: 16,
          134217728: 540672,
          150994944: 1073758224,
          167772160: 1073741824,
          184549376: 540688,
          201326592: 524304,
          218103808: 0,
          234881024: 16400,
          251658240: 1074266112,
          8388608: 1073758208,
          25165824: 540688,
          41943040: 16,
          58720256: 1073758224,
          75497472: 1074282512,
          92274688: 1073741824,
          109051904: 524288,
          125829120: 1074266128,
          142606336: 524304,
          159383552: 0,
          176160768: 16384,
          192937984: 1074266112,
          209715200: 1073741840,
          226492416: 540672,
          243269632: 1074282496,
          260046848: 16400,
          268435456: 0,
          285212672: 1074266128,
          301989888: 1073758224,
          318767104: 1074282496,
          335544320: 1074266112,
          352321536: 16,
          369098752: 540688,
          385875968: 16384,
          402653184: 16400,
          419430400: 524288,
          436207616: 524304,
          452984832: 1073741840,
          469762048: 540672,
          486539264: 1073758208,
          503316480: 1073741824,
          520093696: 1074282512,
          276824064: 540688,
          293601280: 524288,
          310378496: 1074266112,
          327155712: 16384,
          343932928: 1073758208,
          360710144: 1074282512,
          377487360: 16,
          394264576: 1073741824,
          411041792: 1074282496,
          427819008: 1073741840,
          444596224: 1073758224,
          461373440: 524304,
          478150656: 0,
          494927872: 16400,
          511705088: 1074266128,
          528482304: 540672
        },
        {
          0: 260,
          1048576: 0,
          2097152: 67109120,
          3145728: 65796,
          4194304: 65540,
          5242880: 67108868,
          6291456: 67174660,
          7340032: 67174400,
          8388608: 67108864,
          9437184: 67174656,
          10485760: 65792,
          11534336: 67174404,
          12582912: 67109124,
          13631488: 65536,
          14680064: 4,
          15728640: 256,
          524288: 67174656,
          1572864: 67174404,
          2621440: 0,
          3670016: 67109120,
          4718592: 67108868,
          5767168: 65536,
          6815744: 65540,
          7864320: 260,
          8912896: 4,
          9961472: 256,
          11010048: 67174400,
          12058624: 65796,
          13107200: 65792,
          14155776: 67109124,
          15204352: 67174660,
          16252928: 67108864,
          16777216: 67174656,
          17825792: 65540,
          18874368: 65536,
          19922944: 67109120,
          20971520: 256,
          22020096: 67174660,
          23068672: 67108868,
          24117248: 0,
          25165824: 67109124,
          26214400: 67108864,
          27262976: 4,
          28311552: 65792,
          29360128: 67174400,
          30408704: 260,
          31457280: 65796,
          32505856: 67174404,
          17301504: 67108864,
          18350080: 260,
          19398656: 67174656,
          20447232: 0,
          21495808: 65540,
          22544384: 67109120,
          23592960: 256,
          24641536: 67174404,
          25690112: 65536,
          26738688: 67174660,
          27787264: 65796,
          28835840: 67108868,
          29884416: 67109124,
          30932992: 67174400,
          31981568: 4,
          33030144: 65792
        },
        {
          0: 2151682048,
          65536: 2147487808,
          131072: 4198464,
          196608: 2151677952,
          262144: 0,
          327680: 4198400,
          393216: 2147483712,
          458752: 4194368,
          524288: 2147483648,
          589824: 4194304,
          655360: 64,
          720896: 2147487744,
          786432: 2151678016,
          851968: 4160,
          917504: 4096,
          983040: 2151682112,
          32768: 2147487808,
          98304: 64,
          163840: 2151678016,
          229376: 2147487744,
          294912: 4198400,
          360448: 2151682112,
          425984: 0,
          491520: 2151677952,
          557056: 4096,
          622592: 2151682048,
          688128: 4194304,
          753664: 4160,
          819200: 2147483648,
          884736: 4194368,
          950272: 4198464,
          1015808: 2147483712,
          1048576: 4194368,
          1114112: 4198400,
          1179648: 2147483712,
          1245184: 0,
          1310720: 4160,
          1376256: 2151678016,
          1441792: 2151682048,
          1507328: 2147487808,
          1572864: 2151682112,
          1638400: 2147483648,
          1703936: 2151677952,
          1769472: 4198464,
          1835008: 2147487744,
          1900544: 4194304,
          1966080: 64,
          2031616: 4096,
          1081344: 2151677952,
          1146880: 2151682112,
          1212416: 0,
          1277952: 4198400,
          1343488: 4194368,
          1409024: 2147483648,
          1474560: 2147487808,
          1540096: 64,
          1605632: 2147483712,
          1671168: 4096,
          1736704: 2147487744,
          1802240: 2151678016,
          1867776: 4160,
          1933312: 2151682048,
          1998848: 4194304,
          2064384: 4198464
        },
        {
          0: 128,
          4096: 17039360,
          8192: 262144,
          12288: 536870912,
          16384: 537133184,
          20480: 16777344,
          24576: 553648256,
          28672: 262272,
          32768: 16777216,
          36864: 537133056,
          40960: 536871040,
          45056: 553910400,
          49152: 553910272,
          53248: 0,
          57344: 17039488,
          61440: 553648128,
          2048: 17039488,
          6144: 553648256,
          10240: 128,
          14336: 17039360,
          18432: 262144,
          22528: 537133184,
          26624: 553910272,
          30720: 536870912,
          34816: 537133056,
          38912: 0,
          43008: 553910400,
          47104: 16777344,
          51200: 536871040,
          55296: 553648128,
          59392: 16777216,
          63488: 262272,
          65536: 262144,
          69632: 128,
          73728: 536870912,
          77824: 553648256,
          81920: 16777344,
          86016: 553910272,
          90112: 537133184,
          94208: 16777216,
          98304: 553910400,
          102400: 553648128,
          106496: 17039360,
          110592: 537133056,
          114688: 262272,
          118784: 536871040,
          122880: 0,
          126976: 17039488,
          67584: 553648256,
          71680: 16777216,
          75776: 17039360,
          79872: 537133184,
          83968: 536870912,
          88064: 17039488,
          92160: 128,
          96256: 553910272,
          100352: 262272,
          104448: 553910400,
          108544: 0,
          112640: 553648128,
          116736: 16777344,
          120832: 262144,
          124928: 537133056,
          129024: 536871040
        },
        {
          0: 268435464,
          256: 8192,
          512: 270532608,
          768: 270540808,
          1024: 268443648,
          1280: 2097152,
          1536: 2097160,
          1792: 268435456,
          2048: 0,
          2304: 268443656,
          2560: 2105344,
          2816: 8,
          3072: 270532616,
          3328: 2105352,
          3584: 8200,
          3840: 270540800,
          128: 270532608,
          384: 270540808,
          640: 8,
          896: 2097152,
          1152: 2105352,
          1408: 268435464,
          1664: 268443648,
          1920: 8200,
          2176: 2097160,
          2432: 8192,
          2688: 268443656,
          2944: 270532616,
          3200: 0,
          3456: 270540800,
          3712: 2105344,
          3968: 268435456,
          4096: 268443648,
          4352: 270532616,
          4608: 270540808,
          4864: 8200,
          5120: 2097152,
          5376: 268435456,
          5632: 268435464,
          5888: 2105344,
          6144: 2105352,
          6400: 0,
          6656: 8,
          6912: 270532608,
          7168: 8192,
          7424: 268443656,
          7680: 270540800,
          7936: 2097160,
          4224: 8,
          4480: 2105344,
          4736: 2097152,
          4992: 268435464,
          5248: 268443648,
          5504: 8200,
          5760: 270540808,
          6016: 270532608,
          6272: 270540800,
          6528: 270532616,
          6784: 8192,
          7040: 2105352,
          7296: 2097160,
          7552: 0,
          7808: 268435456,
          8064: 268443656
        },
        {
          0: 1048576,
          16: 33555457,
          32: 1024,
          48: 1049601,
          64: 34604033,
          80: 0,
          96: 1,
          112: 34603009,
          128: 33555456,
          144: 1048577,
          160: 33554433,
          176: 34604032,
          192: 34603008,
          208: 1025,
          224: 1049600,
          240: 33554432,
          8: 34603009,
          24: 0,
          40: 33555457,
          56: 34604032,
          72: 1048576,
          88: 33554433,
          104: 33554432,
          120: 1025,
          136: 1049601,
          152: 33555456,
          168: 34603008,
          184: 1048577,
          200: 1024,
          216: 34604033,
          232: 1,
          248: 1049600,
          256: 33554432,
          272: 1048576,
          288: 33555457,
          304: 34603009,
          320: 1048577,
          336: 33555456,
          352: 34604032,
          368: 1049601,
          384: 1025,
          400: 34604033,
          416: 1049600,
          432: 1,
          448: 0,
          464: 34603008,
          480: 33554433,
          496: 1024,
          264: 1049600,
          280: 33555457,
          296: 34603009,
          312: 1,
          328: 33554432,
          344: 1048576,
          360: 1025,
          376: 34604032,
          392: 33554433,
          408: 34603008,
          424: 0,
          440: 34604033,
          456: 1049601,
          472: 1024,
          488: 33555456,
          504: 1048577
        },
        {
          0: 134219808,
          1: 131072,
          2: 134217728,
          3: 32,
          4: 131104,
          5: 134350880,
          6: 134350848,
          7: 2048,
          8: 134348800,
          9: 134219776,
          10: 133120,
          11: 134348832,
          12: 2080,
          13: 0,
          14: 134217760,
          15: 133152,
          2147483648: 2048,
          2147483649: 134350880,
          2147483650: 134219808,
          2147483651: 134217728,
          2147483652: 134348800,
          2147483653: 133120,
          2147483654: 133152,
          2147483655: 32,
          2147483656: 134217760,
          2147483657: 2080,
          2147483658: 131104,
          2147483659: 134350848,
          2147483660: 0,
          2147483661: 134348832,
          2147483662: 134219776,
          2147483663: 131072,
          16: 133152,
          17: 134350848,
          18: 32,
          19: 2048,
          20: 134219776,
          21: 134217760,
          22: 134348832,
          23: 131072,
          24: 0,
          25: 131104,
          26: 134348800,
          27: 134219808,
          28: 134350880,
          29: 133120,
          30: 2080,
          31: 134217728,
          2147483664: 131072,
          2147483665: 2048,
          2147483666: 134348832,
          2147483667: 133152,
          2147483668: 32,
          2147483669: 134348800,
          2147483670: 134217728,
          2147483671: 134219808,
          2147483672: 134350880,
          2147483673: 134217760,
          2147483674: 134219776,
          2147483675: 0,
          2147483676: 133120,
          2147483677: 2080,
          2147483678: 131104,
          2147483679: 134350848
        }
      ];
      var SBOX_MASK = [
        4160749569,
        528482304,
        33030144,
        2064384,
        129024,
        8064,
        504,
        2147483679
      ];
      var DES = C_algo.DES = BlockCipher.extend({
        _doReset: function() {
          var key = this._key;
          var keyWords = key.words;
          var keyBits = [];
          for (var i2 = 0; i2 < 56; i2++) {
            var keyBitPos = PC1[i2] - 1;
            keyBits[i2] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
          }
          var subKeys = this._subKeys = [];
          for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
            var subKey = subKeys[nSubKey] = [];
            var bitShift = BIT_SHIFTS[nSubKey];
            for (var i2 = 0; i2 < 24; i2++) {
              subKey[i2 / 6 | 0] |= keyBits[(PC2[i2] - 1 + bitShift) % 28] << 31 - i2 % 6;
              subKey[4 + (i2 / 6 | 0)] |= keyBits[28 + (PC2[i2 + 24] - 1 + bitShift) % 28] << 31 - i2 % 6;
            }
            subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
            for (var i2 = 1; i2 < 7; i2++) {
              subKey[i2] = subKey[i2] >>> (i2 - 1) * 4 + 3;
            }
            subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
          }
          var invSubKeys = this._invSubKeys = [];
          for (var i2 = 0; i2 < 16; i2++) {
            invSubKeys[i2] = subKeys[15 - i2];
          }
        },
        encryptBlock: function(M2, offset) {
          this._doCryptBlock(M2, offset, this._subKeys);
        },
        decryptBlock: function(M2, offset) {
          this._doCryptBlock(M2, offset, this._invSubKeys);
        },
        _doCryptBlock: function(M2, offset, subKeys) {
          this._lBlock = M2[offset];
          this._rBlock = M2[offset + 1];
          exchangeLR.call(this, 4, 252645135);
          exchangeLR.call(this, 16, 65535);
          exchangeRL.call(this, 2, 858993459);
          exchangeRL.call(this, 8, 16711935);
          exchangeLR.call(this, 1, 1431655765);
          for (var round = 0; round < 16; round++) {
            var subKey = subKeys[round];
            var lBlock = this._lBlock;
            var rBlock = this._rBlock;
            var f2 = 0;
            for (var i2 = 0; i2 < 8; i2++) {
              f2 |= SBOX_P[i2][((rBlock ^ subKey[i2]) & SBOX_MASK[i2]) >>> 0];
            }
            this._lBlock = rBlock;
            this._rBlock = lBlock ^ f2;
          }
          var t2 = this._lBlock;
          this._lBlock = this._rBlock;
          this._rBlock = t2;
          exchangeLR.call(this, 1, 1431655765);
          exchangeRL.call(this, 8, 16711935);
          exchangeRL.call(this, 2, 858993459);
          exchangeLR.call(this, 16, 65535);
          exchangeLR.call(this, 4, 252645135);
          M2[offset] = this._lBlock;
          M2[offset + 1] = this._rBlock;
        },
        keySize: 64 / 32,
        ivSize: 64 / 32,
        blockSize: 64 / 32
      });
      function exchangeLR(offset, mask) {
        var t2 = (this._lBlock >>> offset ^ this._rBlock) & mask;
        this._rBlock ^= t2;
        this._lBlock ^= t2 << offset;
      }
      function exchangeRL(offset, mask) {
        var t2 = (this._rBlock >>> offset ^ this._lBlock) & mask;
        this._lBlock ^= t2;
        this._rBlock ^= t2 << offset;
      }
      C2.DES = BlockCipher._createHelper(DES);
      var TripleDES = C_algo.TripleDES = BlockCipher.extend({
        _doReset: function() {
          var key = this._key;
          var keyWords = key.words;
          if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
            throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
          }
          var key1 = keyWords.slice(0, 2);
          var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
          var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
          this._des1 = DES.createEncryptor(WordArray.create(key1));
          this._des2 = DES.createEncryptor(WordArray.create(key2));
          this._des3 = DES.createEncryptor(WordArray.create(key3));
        },
        encryptBlock: function(M2, offset) {
          this._des1.encryptBlock(M2, offset);
          this._des2.decryptBlock(M2, offset);
          this._des3.encryptBlock(M2, offset);
        },
        decryptBlock: function(M2, offset) {
          this._des3.decryptBlock(M2, offset);
          this._des2.encryptBlock(M2, offset);
          this._des1.decryptBlock(M2, offset);
        },
        keySize: 192 / 32,
        ivSize: 64 / 32,
        blockSize: 64 / 32
      });
      C2.TripleDES = BlockCipher._createHelper(TripleDES);
    })();
    return CryptoJS.TripleDES;
  });
})(tripledes);
var rc4 = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, encBase64.exports, md5.exports, evpkdf.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C2.algo;
      var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function() {
          var key = this._key;
          var keyWords = key.words;
          var keySigBytes = key.sigBytes;
          var S2 = this._S = [];
          for (var i2 = 0; i2 < 256; i2++) {
            S2[i2] = i2;
          }
          for (var i2 = 0, j2 = 0; i2 < 256; i2++) {
            var keyByteIndex = i2 % keySigBytes;
            var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
            j2 = (j2 + S2[i2] + keyByte) % 256;
            var t2 = S2[i2];
            S2[i2] = S2[j2];
            S2[j2] = t2;
          }
          this._i = this._j = 0;
        },
        _doProcessBlock: function(M2, offset) {
          M2[offset] ^= generateKeystreamWord.call(this);
        },
        keySize: 256 / 32,
        ivSize: 0
      });
      function generateKeystreamWord() {
        var S2 = this._S;
        var i2 = this._i;
        var j2 = this._j;
        var keystreamWord = 0;
        for (var n2 = 0; n2 < 4; n2++) {
          i2 = (i2 + 1) % 256;
          j2 = (j2 + S2[i2]) % 256;
          var t2 = S2[i2];
          S2[i2] = S2[j2];
          S2[j2] = t2;
          keystreamWord |= S2[(S2[i2] + S2[j2]) % 256] << 24 - n2 * 8;
        }
        this._i = i2;
        this._j = j2;
        return keystreamWord;
      }
      C2.RC4 = StreamCipher._createHelper(RC4);
      var RC4Drop = C_algo.RC4Drop = RC4.extend({
        cfg: RC4.cfg.extend({
          drop: 192
        }),
        _doReset: function() {
          RC4._doReset.call(this);
          for (var i2 = this.cfg.drop; i2 > 0; i2--) {
            generateKeystreamWord.call(this);
          }
        }
      });
      C2.RC4Drop = StreamCipher._createHelper(RC4Drop);
    })();
    return CryptoJS.RC4;
  });
})(rc4);
var rabbit = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, encBase64.exports, md5.exports, evpkdf.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C2.algo;
      var S2 = [];
      var C_ = [];
      var G2 = [];
      var Rabbit = C_algo.Rabbit = StreamCipher.extend({
        _doReset: function() {
          var K2 = this._key.words;
          var iv = this.cfg.iv;
          for (var i2 = 0; i2 < 4; i2++) {
            K2[i2] = (K2[i2] << 8 | K2[i2] >>> 24) & 16711935 | (K2[i2] << 24 | K2[i2] >>> 8) & 4278255360;
          }
          var X2 = this._X = [
            K2[0],
            K2[3] << 16 | K2[2] >>> 16,
            K2[1],
            K2[0] << 16 | K2[3] >>> 16,
            K2[2],
            K2[1] << 16 | K2[0] >>> 16,
            K2[3],
            K2[2] << 16 | K2[1] >>> 16
          ];
          var C3 = this._C = [
            K2[2] << 16 | K2[2] >>> 16,
            K2[0] & 4294901760 | K2[1] & 65535,
            K2[3] << 16 | K2[3] >>> 16,
            K2[1] & 4294901760 | K2[2] & 65535,
            K2[0] << 16 | K2[0] >>> 16,
            K2[2] & 4294901760 | K2[3] & 65535,
            K2[1] << 16 | K2[1] >>> 16,
            K2[3] & 4294901760 | K2[0] & 65535
          ];
          this._b = 0;
          for (var i2 = 0; i2 < 4; i2++) {
            nextState.call(this);
          }
          for (var i2 = 0; i2 < 8; i2++) {
            C3[i2] ^= X2[i2 + 4 & 7];
          }
          if (iv) {
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1];
            var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
            var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
            var i1 = i0 >>> 16 | i22 & 4294901760;
            var i3 = i22 << 16 | i0 & 65535;
            C3[0] ^= i0;
            C3[1] ^= i1;
            C3[2] ^= i22;
            C3[3] ^= i3;
            C3[4] ^= i0;
            C3[5] ^= i1;
            C3[6] ^= i22;
            C3[7] ^= i3;
            for (var i2 = 0; i2 < 4; i2++) {
              nextState.call(this);
            }
          }
        },
        _doProcessBlock: function(M2, offset) {
          var X2 = this._X;
          nextState.call(this);
          S2[0] = X2[0] ^ X2[5] >>> 16 ^ X2[3] << 16;
          S2[1] = X2[2] ^ X2[7] >>> 16 ^ X2[5] << 16;
          S2[2] = X2[4] ^ X2[1] >>> 16 ^ X2[7] << 16;
          S2[3] = X2[6] ^ X2[3] >>> 16 ^ X2[1] << 16;
          for (var i2 = 0; i2 < 4; i2++) {
            S2[i2] = (S2[i2] << 8 | S2[i2] >>> 24) & 16711935 | (S2[i2] << 24 | S2[i2] >>> 8) & 4278255360;
            M2[offset + i2] ^= S2[i2];
          }
        },
        blockSize: 128 / 32,
        ivSize: 64 / 32
      });
      function nextState() {
        var X2 = this._X;
        var C3 = this._C;
        for (var i2 = 0; i2 < 8; i2++) {
          C_[i2] = C3[i2];
        }
        C3[0] = C3[0] + 1295307597 + this._b | 0;
        C3[1] = C3[1] + 3545052371 + (C3[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
        C3[2] = C3[2] + 886263092 + (C3[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
        C3[3] = C3[3] + 1295307597 + (C3[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
        C3[4] = C3[4] + 3545052371 + (C3[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
        C3[5] = C3[5] + 886263092 + (C3[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
        C3[6] = C3[6] + 1295307597 + (C3[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
        C3[7] = C3[7] + 3545052371 + (C3[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
        this._b = C3[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
        for (var i2 = 0; i2 < 8; i2++) {
          var gx = X2[i2] + C3[i2];
          var ga = gx & 65535;
          var gb = gx >>> 16;
          var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
          var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
          G2[i2] = gh ^ gl;
        }
        X2[0] = G2[0] + (G2[7] << 16 | G2[7] >>> 16) + (G2[6] << 16 | G2[6] >>> 16) | 0;
        X2[1] = G2[1] + (G2[0] << 8 | G2[0] >>> 24) + G2[7] | 0;
        X2[2] = G2[2] + (G2[1] << 16 | G2[1] >>> 16) + (G2[0] << 16 | G2[0] >>> 16) | 0;
        X2[3] = G2[3] + (G2[2] << 8 | G2[2] >>> 24) + G2[1] | 0;
        X2[4] = G2[4] + (G2[3] << 16 | G2[3] >>> 16) + (G2[2] << 16 | G2[2] >>> 16) | 0;
        X2[5] = G2[5] + (G2[4] << 8 | G2[4] >>> 24) + G2[3] | 0;
        X2[6] = G2[6] + (G2[5] << 16 | G2[5] >>> 16) + (G2[4] << 16 | G2[4] >>> 16) | 0;
        X2[7] = G2[7] + (G2[6] << 8 | G2[6] >>> 24) + G2[5] | 0;
      }
      C2.Rabbit = StreamCipher._createHelper(Rabbit);
    })();
    return CryptoJS.Rabbit;
  });
})(rabbit);
var rabbitLegacy = { exports: {} };
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, encBase64.exports, md5.exports, evpkdf.exports, cipherCore.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    (function() {
      var C2 = CryptoJS;
      var C_lib = C2.lib;
      var StreamCipher = C_lib.StreamCipher;
      var C_algo = C2.algo;
      var S2 = [];
      var C_ = [];
      var G2 = [];
      var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
        _doReset: function() {
          var K2 = this._key.words;
          var iv = this.cfg.iv;
          var X2 = this._X = [
            K2[0],
            K2[3] << 16 | K2[2] >>> 16,
            K2[1],
            K2[0] << 16 | K2[3] >>> 16,
            K2[2],
            K2[1] << 16 | K2[0] >>> 16,
            K2[3],
            K2[2] << 16 | K2[1] >>> 16
          ];
          var C3 = this._C = [
            K2[2] << 16 | K2[2] >>> 16,
            K2[0] & 4294901760 | K2[1] & 65535,
            K2[3] << 16 | K2[3] >>> 16,
            K2[1] & 4294901760 | K2[2] & 65535,
            K2[0] << 16 | K2[0] >>> 16,
            K2[2] & 4294901760 | K2[3] & 65535,
            K2[1] << 16 | K2[1] >>> 16,
            K2[3] & 4294901760 | K2[0] & 65535
          ];
          this._b = 0;
          for (var i2 = 0; i2 < 4; i2++) {
            nextState.call(this);
          }
          for (var i2 = 0; i2 < 8; i2++) {
            C3[i2] ^= X2[i2 + 4 & 7];
          }
          if (iv) {
            var IV = iv.words;
            var IV_0 = IV[0];
            var IV_1 = IV[1];
            var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
            var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
            var i1 = i0 >>> 16 | i22 & 4294901760;
            var i3 = i22 << 16 | i0 & 65535;
            C3[0] ^= i0;
            C3[1] ^= i1;
            C3[2] ^= i22;
            C3[3] ^= i3;
            C3[4] ^= i0;
            C3[5] ^= i1;
            C3[6] ^= i22;
            C3[7] ^= i3;
            for (var i2 = 0; i2 < 4; i2++) {
              nextState.call(this);
            }
          }
        },
        _doProcessBlock: function(M2, offset) {
          var X2 = this._X;
          nextState.call(this);
          S2[0] = X2[0] ^ X2[5] >>> 16 ^ X2[3] << 16;
          S2[1] = X2[2] ^ X2[7] >>> 16 ^ X2[5] << 16;
          S2[2] = X2[4] ^ X2[1] >>> 16 ^ X2[7] << 16;
          S2[3] = X2[6] ^ X2[3] >>> 16 ^ X2[1] << 16;
          for (var i2 = 0; i2 < 4; i2++) {
            S2[i2] = (S2[i2] << 8 | S2[i2] >>> 24) & 16711935 | (S2[i2] << 24 | S2[i2] >>> 8) & 4278255360;
            M2[offset + i2] ^= S2[i2];
          }
        },
        blockSize: 128 / 32,
        ivSize: 64 / 32
      });
      function nextState() {
        var X2 = this._X;
        var C3 = this._C;
        for (var i2 = 0; i2 < 8; i2++) {
          C_[i2] = C3[i2];
        }
        C3[0] = C3[0] + 1295307597 + this._b | 0;
        C3[1] = C3[1] + 3545052371 + (C3[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
        C3[2] = C3[2] + 886263092 + (C3[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
        C3[3] = C3[3] + 1295307597 + (C3[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
        C3[4] = C3[4] + 3545052371 + (C3[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
        C3[5] = C3[5] + 886263092 + (C3[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
        C3[6] = C3[6] + 1295307597 + (C3[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
        C3[7] = C3[7] + 3545052371 + (C3[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
        this._b = C3[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
        for (var i2 = 0; i2 < 8; i2++) {
          var gx = X2[i2] + C3[i2];
          var ga = gx & 65535;
          var gb = gx >>> 16;
          var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
          var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
          G2[i2] = gh ^ gl;
        }
        X2[0] = G2[0] + (G2[7] << 16 | G2[7] >>> 16) + (G2[6] << 16 | G2[6] >>> 16) | 0;
        X2[1] = G2[1] + (G2[0] << 8 | G2[0] >>> 24) + G2[7] | 0;
        X2[2] = G2[2] + (G2[1] << 16 | G2[1] >>> 16) + (G2[0] << 16 | G2[0] >>> 16) | 0;
        X2[3] = G2[3] + (G2[2] << 8 | G2[2] >>> 24) + G2[1] | 0;
        X2[4] = G2[4] + (G2[3] << 16 | G2[3] >>> 16) + (G2[2] << 16 | G2[2] >>> 16) | 0;
        X2[5] = G2[5] + (G2[4] << 8 | G2[4] >>> 24) + G2[3] | 0;
        X2[6] = G2[6] + (G2[5] << 16 | G2[5] >>> 16) + (G2[4] << 16 | G2[4] >>> 16) | 0;
        X2[7] = G2[7] + (G2[6] << 8 | G2[6] >>> 24) + G2[5] | 0;
      }
      C2.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
    })();
    return CryptoJS.RabbitLegacy;
  });
})(rabbitLegacy);
(function(module2, exports2) {
  (function(root2, factory, undef) {
    {
      module2.exports = factory(core.exports, x64Core.exports, libTypedarrays.exports, encUtf16.exports, encBase64.exports, encBase64url.exports, md5.exports, sha1.exports, sha256.exports, sha224.exports, sha512.exports, sha384.exports, sha3.exports, ripemd160.exports, hmac.exports, pbkdf2.exports, evpkdf.exports, cipherCore.exports, modeCfb.exports, modeCtr.exports, modeCtrGladman.exports, modeOfb.exports, modeEcb.exports, padAnsix923.exports, padIso10126.exports, padIso97971.exports, padZeropadding.exports, padNopadding.exports, formatHex.exports, aes.exports, tripledes.exports, rc4.exports, rabbit.exports, rabbitLegacy.exports);
    }
  })(commonjsGlobal, function(CryptoJS) {
    return CryptoJS;
  });
})(cryptoJs);
const pages = [
  {
    path: "pages/index/index",
    style: {
      navigationBarTitleText: "uni-app"
    }
  },
  {
    path: "pages/bugu/bugu",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message/message",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/mine/mine",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/publish/publish",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/login/login",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/login/account-login",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/label-activity/label-activity",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/label-activity/search-activity",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/user-home-page/user-home-page",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/activity-info/activity-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/activity-info/comment-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/setting",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/report-user/report-user",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/personal_information/personal_information",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/personal_information/change-username",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/bugu-vip/bugu-vip",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/real-name-authentication/real-name-authentication",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/school-login/school-login",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/sound-setting/sound-setting",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/help/help",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/about-bugu/about-bugu",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/setting/about-bugu/update-log",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/bugu-secondary-page/blind-box/blind-box",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/bugu-secondary-page/blind-box/my-box",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/bugu-secondary-page/blind-box/box-tickets",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message-secondary-page/chat-content/chat-content",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message-secondary-page/chat-history/chat-history",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message-secondary-page/official-news-info/official-news-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/mine-secondary-page/fan-list/fan-list",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/mine-secondary-page/follow-list/follow-list",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/mine-secondary-page/visitor-list/visitor-list",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message-secondary-page/search-user/search-user",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/login/bugu-privacy-policy/bugu-privacy-policy",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/login/bugu-use-protocol/bugu-use-protocol",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/message-secondary-page/interactive-message/interactive-message",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/publish/ask-questions/ask-questions",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/publish/sell-goods/sell-goods",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/activity-info/question-info/question-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/activity-info/goods-info/goods-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/publish/write-answers/write-answers",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/activity-info/answer-info/answer-info",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/label-activity/search-question/search-question",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/my-acticity/my-acticity",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/my-acticity/my-questions/my-questions",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/my-acticity/my-answers/my-answers",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/my-acticity/my-collected-question/my-collected-question",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  },
  {
    path: "pages/label-activity/label-question/label-question",
    style: {
      navigationBarTitleText: "",
      enablePullDownRefresh: false
    }
  }
];
const globalStyle = {
  navigationStyle: "custom",
  navigationBarTextStyle: "black",
  navigationBarTitleText: "uni-app",
  navigationBarBackgroundColor: "#F8F8F8",
  backgroundColor: "#F8F8F8"
};
const tabBar = {
  color: "#a0a0a0",
  selectedColor: "#000000",
  backgroundColor: "#ffffff",
  borderStyle: "white",
  list: [
    {
      pagePath: "pages/bugu/bugu",
      text: "\u5E03\u5495",
      iconPath: "/static/icons/bugu.png",
      selectedIconPath: "/static/icons/bugu-select.png"
    },
    {
      pagePath: "pages/index/index",
      text: "\u5E7F\u573A",
      iconPath: "/static/icons/index.png",
      selectedIconPath: "/static/icons/index-select.png"
    },
    {
      pagePath: "pages/message/message",
      text: "\u5173\u6CE8",
      iconPath: "/static/icons/message.png",
      selectedIconPath: "/static/icons/message-select.png"
    },
    {
      pagePath: "pages/mine/mine",
      text: "\u6211\u7684",
      iconPath: "/static/icons/mine.png",
      selectedIconPath: "/static/icons/mine-select.png"
    }
  ]
};
var t = {
  pages,
  globalStyle,
  tabBar
};
function n(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function s(e2, t2, n2) {
  return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
    return function() {
      throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
    }(t3 == null && n2.path);
  } }, n2.exports), n2.exports;
}
var o = s(function(e2, t2) {
  var n2;
  e2.exports = (n2 = n2 || function(e3, t3) {
    var n3 = Object.create || function() {
      function e4() {
      }
      return function(t4) {
        var n4;
        return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
      };
    }(), s2 = {}, o2 = s2.lib = {}, r2 = o2.Base = { extend: function(e4) {
      var t4 = n3(this);
      return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
        t4.$super.init.apply(this, arguments);
      }), t4.init.prototype = t4, t4.$super = this, t4;
    }, create: function() {
      var e4 = this.extend();
      return e4.init.apply(e4, arguments), e4;
    }, init: function() {
    }, mixIn: function(e4) {
      for (var t4 in e4)
        e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
      e4.hasOwnProperty("toString") && (this.toString = e4.toString);
    }, clone: function() {
      return this.init.prototype.extend(this);
    } }, i2 = o2.WordArray = r2.extend({ init: function(e4, n4) {
      e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
    }, toString: function(e4) {
      return (e4 || c2).stringify(this);
    }, concat: function(e4) {
      var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, o3 = e4.sigBytes;
      if (this.clamp(), s3 % 4)
        for (var r3 = 0; r3 < o3; r3++) {
          var i3 = n4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          t4[s3 + r3 >>> 2] |= i3 << 24 - (s3 + r3) % 4 * 8;
        }
      else
        for (r3 = 0; r3 < o3; r3 += 4)
          t4[s3 + r3 >>> 2] = n4[r3 >>> 2];
      return this.sigBytes += o3, this;
    }, clamp: function() {
      var t4 = this.words, n4 = this.sigBytes;
      t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
    }, clone: function() {
      var e4 = r2.clone.call(this);
      return e4.words = this.words.slice(0), e4;
    }, random: function(t4) {
      for (var n4, s3 = [], o3 = function(t5) {
        t5 = t5;
        var n5 = 987654321, s4 = 4294967295;
        return function() {
          var o4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
          return o4 /= 4294967296, (o4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
        };
      }, r3 = 0; r3 < t4; r3 += 4) {
        var a3 = o3(4294967296 * (n4 || e3.random()));
        n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
      }
      return new i2.init(s3, t4);
    } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
        var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
        s3.push((r3 >>> 4).toString(16)), s3.push((15 & r3).toString(16));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
        n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
      return new i2.init(n4, t4 / 2);
    } }, u2 = a2.Latin1 = { stringify: function(e4) {
      for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
        var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
        s3.push(String.fromCharCode(r3));
      }
      return s3.join("");
    }, parse: function(e4) {
      for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
        n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
      return new i2.init(n4, t4);
    } }, l2 = a2.Utf8 = { stringify: function(e4) {
      try {
        return decodeURIComponent(escape(u2.stringify(e4)));
      } catch (e5) {
        throw new Error("Malformed UTF-8 data");
      }
    }, parse: function(e4) {
      return u2.parse(unescape(encodeURIComponent(e4)));
    } }, h2 = o2.BufferedBlockAlgorithm = r2.extend({ reset: function() {
      this._data = new i2.init(), this._nDataBytes = 0;
    }, _append: function(e4) {
      typeof e4 == "string" && (e4 = l2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
    }, _process: function(t4) {
      var n4 = this._data, s3 = n4.words, o3 = n4.sigBytes, r3 = this.blockSize, a3 = o3 / (4 * r3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * r3, u3 = e3.min(4 * c3, o3);
      if (c3) {
        for (var l3 = 0; l3 < c3; l3 += r3)
          this._doProcessBlock(s3, l3);
        var h3 = s3.splice(0, c3);
        n4.sigBytes -= u3;
      }
      return new i2.init(h3, u3);
    }, clone: function() {
      var e4 = r2.clone.call(this);
      return e4._data = this._data.clone(), e4;
    }, _minBufferSize: 0 });
    o2.Hasher = h2.extend({ cfg: r2.extend(), init: function(e4) {
      this.cfg = this.cfg.extend(e4), this.reset();
    }, reset: function() {
      h2.reset.call(this), this._doReset();
    }, update: function(e4) {
      return this._append(e4), this._process(), this;
    }, finalize: function(e4) {
      return e4 && this._append(e4), this._doFinalize();
    }, blockSize: 16, _createHelper: function(e4) {
      return function(t4, n4) {
        return new e4.init(n4).finalize(t4);
      };
    }, _createHmacHelper: function(e4) {
      return function(t4, n4) {
        return new d2.HMAC.init(e4, n4).finalize(t4);
      };
    } });
    var d2 = s2.algo = {};
    return s2;
  }(Math), n2);
}), r = (s(function(e2, t2) {
  var n2;
  e2.exports = (n2 = o, function(e3) {
    var t3 = n2, s2 = t3.lib, o2 = s2.WordArray, r2 = s2.Hasher, i2 = t3.algo, a2 = [];
    !function() {
      for (var t4 = 0; t4 < 64; t4++)
        a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
    }();
    var c2 = i2.MD5 = r2.extend({ _doReset: function() {
      this._hash = new o2.init([1732584193, 4023233417, 2562383102, 271733878]);
    }, _doProcessBlock: function(e4, t4) {
      for (var n3 = 0; n3 < 16; n3++) {
        var s3 = t4 + n3, o3 = e4[s3];
        e4[s3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
      }
      var r3 = this._hash.words, i3 = e4[t4 + 0], c3 = e4[t4 + 1], f2 = e4[t4 + 2], g2 = e4[t4 + 3], p2 = e4[t4 + 4], m2 = e4[t4 + 5], y = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], k2 = e4[t4 + 9], v2 = e4[t4 + 10], T2 = e4[t4 + 11], S2 = e4[t4 + 12], P2 = e4[t4 + 13], A2 = e4[t4 + 14], I2 = e4[t4 + 15], b2 = r3[0], O2 = r3[1], C2 = r3[2], E2 = r3[3];
      b2 = u2(b2, O2, C2, E2, i3, 7, a2[0]), E2 = u2(E2, b2, O2, C2, c3, 12, a2[1]), C2 = u2(C2, E2, b2, O2, f2, 17, a2[2]), O2 = u2(O2, C2, E2, b2, g2, 22, a2[3]), b2 = u2(b2, O2, C2, E2, p2, 7, a2[4]), E2 = u2(E2, b2, O2, C2, m2, 12, a2[5]), C2 = u2(C2, E2, b2, O2, y, 17, a2[6]), O2 = u2(O2, C2, E2, b2, _2, 22, a2[7]), b2 = u2(b2, O2, C2, E2, w2, 7, a2[8]), E2 = u2(E2, b2, O2, C2, k2, 12, a2[9]), C2 = u2(C2, E2, b2, O2, v2, 17, a2[10]), O2 = u2(O2, C2, E2, b2, T2, 22, a2[11]), b2 = u2(b2, O2, C2, E2, S2, 7, a2[12]), E2 = u2(E2, b2, O2, C2, P2, 12, a2[13]), C2 = u2(C2, E2, b2, O2, A2, 17, a2[14]), b2 = l2(b2, O2 = u2(O2, C2, E2, b2, I2, 22, a2[15]), C2, E2, c3, 5, a2[16]), E2 = l2(E2, b2, O2, C2, y, 9, a2[17]), C2 = l2(C2, E2, b2, O2, T2, 14, a2[18]), O2 = l2(O2, C2, E2, b2, i3, 20, a2[19]), b2 = l2(b2, O2, C2, E2, m2, 5, a2[20]), E2 = l2(E2, b2, O2, C2, v2, 9, a2[21]), C2 = l2(C2, E2, b2, O2, I2, 14, a2[22]), O2 = l2(O2, C2, E2, b2, p2, 20, a2[23]), b2 = l2(b2, O2, C2, E2, k2, 5, a2[24]), E2 = l2(E2, b2, O2, C2, A2, 9, a2[25]), C2 = l2(C2, E2, b2, O2, g2, 14, a2[26]), O2 = l2(O2, C2, E2, b2, w2, 20, a2[27]), b2 = l2(b2, O2, C2, E2, P2, 5, a2[28]), E2 = l2(E2, b2, O2, C2, f2, 9, a2[29]), C2 = l2(C2, E2, b2, O2, _2, 14, a2[30]), b2 = h2(b2, O2 = l2(O2, C2, E2, b2, S2, 20, a2[31]), C2, E2, m2, 4, a2[32]), E2 = h2(E2, b2, O2, C2, w2, 11, a2[33]), C2 = h2(C2, E2, b2, O2, T2, 16, a2[34]), O2 = h2(O2, C2, E2, b2, A2, 23, a2[35]), b2 = h2(b2, O2, C2, E2, c3, 4, a2[36]), E2 = h2(E2, b2, O2, C2, p2, 11, a2[37]), C2 = h2(C2, E2, b2, O2, _2, 16, a2[38]), O2 = h2(O2, C2, E2, b2, v2, 23, a2[39]), b2 = h2(b2, O2, C2, E2, P2, 4, a2[40]), E2 = h2(E2, b2, O2, C2, i3, 11, a2[41]), C2 = h2(C2, E2, b2, O2, g2, 16, a2[42]), O2 = h2(O2, C2, E2, b2, y, 23, a2[43]), b2 = h2(b2, O2, C2, E2, k2, 4, a2[44]), E2 = h2(E2, b2, O2, C2, S2, 11, a2[45]), C2 = h2(C2, E2, b2, O2, I2, 16, a2[46]), b2 = d2(b2, O2 = h2(O2, C2, E2, b2, f2, 23, a2[47]), C2, E2, i3, 6, a2[48]), E2 = d2(E2, b2, O2, C2, _2, 10, a2[49]), C2 = d2(C2, E2, b2, O2, A2, 15, a2[50]), O2 = d2(O2, C2, E2, b2, m2, 21, a2[51]), b2 = d2(b2, O2, C2, E2, S2, 6, a2[52]), E2 = d2(E2, b2, O2, C2, g2, 10, a2[53]), C2 = d2(C2, E2, b2, O2, v2, 15, a2[54]), O2 = d2(O2, C2, E2, b2, c3, 21, a2[55]), b2 = d2(b2, O2, C2, E2, w2, 6, a2[56]), E2 = d2(E2, b2, O2, C2, I2, 10, a2[57]), C2 = d2(C2, E2, b2, O2, y, 15, a2[58]), O2 = d2(O2, C2, E2, b2, P2, 21, a2[59]), b2 = d2(b2, O2, C2, E2, p2, 6, a2[60]), E2 = d2(E2, b2, O2, C2, T2, 10, a2[61]), C2 = d2(C2, E2, b2, O2, f2, 15, a2[62]), O2 = d2(O2, C2, E2, b2, k2, 21, a2[63]), r3[0] = r3[0] + b2 | 0, r3[1] = r3[1] + O2 | 0, r3[2] = r3[2] + C2 | 0, r3[3] = r3[3] + E2 | 0;
    }, _doFinalize: function() {
      var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, o3 = 8 * t4.sigBytes;
      n3[o3 >>> 5] |= 128 << 24 - o3 % 32;
      var r3 = e3.floor(s3 / 4294967296), i3 = s3;
      n3[15 + (o3 + 64 >>> 9 << 4)] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8), n3[14 + (o3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
      for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
        var l3 = c3[u3];
        c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
      }
      return a3;
    }, clone: function() {
      var e4 = r2.clone.call(this);
      return e4._hash = this._hash.clone(), e4;
    } });
    function u2(e4, t4, n3, s3, o3, r3, i3) {
      var a3 = e4 + (t4 & n3 | ~t4 & s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function l2(e4, t4, n3, s3, o3, r3, i3) {
      var a3 = e4 + (t4 & s3 | n3 & ~s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function h2(e4, t4, n3, s3, o3, r3, i3) {
      var a3 = e4 + (t4 ^ n3 ^ s3) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    function d2(e4, t4, n3, s3, o3, r3, i3) {
      var a3 = e4 + (n3 ^ (t4 | ~s3)) + o3 + i3;
      return (a3 << r3 | a3 >>> 32 - r3) + t4;
    }
    t3.MD5 = r2._createHelper(c2), t3.HmacMD5 = r2._createHmacHelper(c2);
  }(Math), n2.MD5);
}), s(function(e2, t2) {
  var n2, s2, r2;
  e2.exports = (s2 = (n2 = o).lib.Base, r2 = n2.enc.Utf8, void (n2.algo.HMAC = s2.extend({ init: function(e3, t3) {
    e3 = this._hasher = new e3.init(), typeof t3 == "string" && (t3 = r2.parse(t3));
    var n3 = e3.blockSize, s3 = 4 * n3;
    t3.sigBytes > s3 && (t3 = e3.finalize(t3)), t3.clamp();
    for (var o2 = this._oKey = t3.clone(), i2 = this._iKey = t3.clone(), a2 = o2.words, c2 = i2.words, u2 = 0; u2 < n3; u2++)
      a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
    o2.sigBytes = i2.sigBytes = s3, this.reset();
  }, reset: function() {
    var e3 = this._hasher;
    e3.reset(), e3.update(this._iKey);
  }, update: function(e3) {
    return this._hasher.update(e3), this;
  }, finalize: function(e3) {
    var t3 = this._hasher, n3 = t3.finalize(e3);
    return t3.reset(), t3.finalize(this._oKey.clone().concat(n3));
  } })));
}), s(function(e2, t2) {
  e2.exports = o.HmacMD5;
}));
const i = "FUNCTION", a = "OBJECT", c = "CLIENT_DB";
function u(e2) {
  return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
}
function l(e2) {
  return u(e2) === "object";
}
function h(e2) {
  return e2 && typeof e2 == "string" ? JSON.parse(e2) : e2;
}
const d = true, f = "mp-weixin";
let g;
switch (f) {
  case "h5":
    g = "web";
    break;
  case "app-plus":
    g = "app";
    break;
  default:
    g = f;
}
const p = h({}.UNICLOUD_DEBUG), m = h("[]") || [];
let _ = "";
try {
  _ = "__UNI__E8C0685";
} catch (e2) {
}
let w = {};
function k(e2, t2 = {}) {
  var n2, s2;
  return n2 = w, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (w[e2] = t2), w[e2];
}
g === "app" && (w = index._globalUniCloudObj ? index._globalUniCloudObj : index._globalUniCloudObj = {});
const v = ["invoke", "success", "fail", "complete"], T = k("_globalUniCloudInterceptor");
function S(e2, t2) {
  T[e2] || (T[e2] = {}), l(t2) && Object.keys(t2).forEach((n2) => {
    v.indexOf(n2) > -1 && function(e3, t3, n3) {
      let s2 = T[e3][t3];
      s2 || (s2 = T[e3][t3] = []), s2.indexOf(n3) === -1 && typeof n3 == "function" && s2.push(n3);
    }(e2, n2, t2[n2]);
  });
}
function P(e2, t2) {
  T[e2] || (T[e2] = {}), l(t2) ? Object.keys(t2).forEach((n2) => {
    v.indexOf(n2) > -1 && function(e3, t3, n3) {
      const s2 = T[e3][t3];
      if (!s2)
        return;
      const o2 = s2.indexOf(n3);
      o2 > -1 && s2.splice(o2, 1);
    }(e2, n2, t2[n2]);
  }) : delete T[e2];
}
function A(e2, t2) {
  return e2 && e2.length !== 0 ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
}
function I(e2, t2) {
  return T[e2] && T[e2][t2] || [];
}
function b(e2) {
  S("callObject", e2);
}
const O = k("_globalUniCloudListener"), C = "response", E = "needLogin", R = "refreshToken", U = "clientdb", x = "cloudfunction", L = "cloudobject";
function D(e2) {
  return O[e2] || (O[e2] = []), O[e2];
}
function N(e2, t2) {
  const n2 = D(e2);
  n2.includes(t2) || n2.push(t2);
}
function q(e2, t2) {
  const n2 = D(e2), s2 = n2.indexOf(t2);
  s2 !== -1 && n2.splice(s2, 1);
}
function F(e2, t2) {
  const n2 = D(e2);
  for (let e3 = 0; e3 < n2.length; e3++) {
    (0, n2[e3])(t2);
  }
}
let M = false;
const j = new Promise((e2) => {
  M && e2(), function t2() {
    if (typeof getCurrentPages == "function") {
      const t3 = getCurrentPages();
      t3 && t3[0] && (M = true, e2());
    }
    M || setTimeout(() => {
      t2();
    }, 30);
  }();
});
function $() {
  return j;
}
function K(e2, t2) {
  return t2 ? function(n2) {
    let s2 = false;
    if (t2 === "callFunction") {
      const e3 = n2 && n2.type || i;
      s2 = e3 !== i;
    }
    const o2 = t2 === "callFunction" && !s2;
    let r2;
    r2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
    const a2 = r2.then(() => s2 ? Promise.resolve() : A(I(t2, "invoke"), n2)).then(() => e2.call(this, n2)).then((e3) => s2 ? Promise.resolve(e3) : A(I(t2, "success"), e3).then(() => A(I(t2, "complete"), e3)).then(() => (o2 && F(C, { type: x, content: e3 }), Promise.resolve(e3))), (e3) => s2 ? Promise.reject(e3) : A(I(t2, "fail"), e3).then(() => A(I(t2, "complete"), e3)).then(() => (F(C, { type: x, content: e3 }), Promise.reject(e3))));
    if (!(n2.success || n2.fail || n2.complete))
      return a2;
    a2.then((e3) => {
      n2.success && n2.success(e3), n2.complete && n2.complete(e3), o2 && F(C, { type: x, content: e3 });
    }, (e3) => {
      n2.fail && n2.fail(e3), n2.complete && n2.complete(e3), o2 && F(C, { type: x, content: e3 });
    });
  } : function(t3) {
    if (!((t3 = t3 || {}).success || t3.fail || t3.complete))
      return e2.call(this, t3);
    e2.call(this, t3).then((e3) => {
      t3.success && t3.success(e3), t3.complete && t3.complete(e3);
    }, (e3) => {
      t3.fail && t3.fail(e3), t3.complete && t3.complete(e3);
    });
  };
}
class B extends Error {
  constructor(e2) {
    super(e2.message), this.errMsg = e2.message || "", this.errCode = this.code = e2.code || "SYSTEM_ERROR", this.requestId = e2.requestId;
  }
}
function H() {
  let e2, t2;
  try {
    if (index.getLaunchOptionsSync) {
      if (index.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
        return;
      const { scene: n2, channel: s2 } = index.getLaunchOptionsSync();
      e2 = s2, t2 = n2;
    }
  } catch (e3) {
  }
  return { channel: e2, scene: t2 };
}
let W;
function z() {
  const e2 = index.getLocale && index.getLocale() || "en";
  if (W)
    return __spreadProps(__spreadValues({}, W), { locale: e2, LOCALE: e2 });
  const t2 = index.getSystemInfoSync(), { deviceId: n2, osName: s2, uniPlatform: o2, appId: r2 } = t2, i2 = ["pixelRatio", "brand", "model", "system", "language", "version", "platform", "host", "SDKVersion", "swanNativeVersion", "app", "AppPlatform", "fontSizeSetting"];
  for (let e3 = 0; e3 < i2.length; e3++) {
    delete t2[i2[e3]];
  }
  return W = __spreadValues(__spreadValues({ PLATFORM: o2, OS: s2, APPID: r2, DEVICEID: n2 }, H()), t2), __spreadProps(__spreadValues({}, W), { locale: e2, LOCALE: e2 });
}
var J = { sign: function(e2, t2) {
  let n2 = "";
  return Object.keys(e2).sort().forEach(function(t3) {
    e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
  }), n2 = n2.slice(1), r(n2, t2).toString();
}, wrappedRequest: function(e2, t2) {
  return new Promise((n2, s2) => {
    t2(Object.assign(e2, { complete(e3) {
      e3 || (e3 = {}), g === "web" && e3.errMsg && e3.errMsg.indexOf("request:fail") === 0 && console.warn("\u53D1\u5E03H5\uFF0C\u9700\u8981\u5728uniCloud\u540E\u53F0\u64CD\u4F5C\uFF0C\u7ED1\u5B9A\u5B89\u5168\u57DF\u540D\uFF0C\u5426\u5219\u4F1A\u56E0\u4E3A\u8DE8\u57DF\u95EE\u9898\u800C\u65E0\u6CD5\u8BBF\u95EE\u3002\u6559\u7A0B\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.io/uniCloud/quickstart?id=useinh5");
      const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
      if (!e3.statusCode || e3.statusCode >= 400)
        return s2(new B({ code: "SYS_ERR", message: e3.errMsg || "request:fail", requestId: t3 }));
      const o2 = e3.data;
      if (o2.error)
        return s2(new B({ code: o2.error.code, message: o2.error.message, requestId: t3 }));
      o2.result = o2.data, o2.requestId = t3, delete o2.data, n2(o2);
    } }));
  });
} };
var V = { request: (e2) => index.request(e2), uploadFile: (e2) => index.uploadFile(e2), setStorageSync: (e2, t2) => index.setStorageSync(e2, t2), getStorageSync: (e2) => index.getStorageSync(e2), removeStorageSync: (e2) => index.removeStorageSync(e2), clearStorageSync: () => index.clearStorageSync() }, Y = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
const { t: X } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: Y, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: Y }, "zh-Hans");
var G = class {
  constructor(e2) {
    ["spaceId", "clientSecret"].forEach((t2) => {
      if (!Object.prototype.hasOwnProperty.call(e2, t2))
        throw new Error(X("uniCloud.init.paramRequired", { param: t2 }));
    }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = V, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
  }
  get hasAccessToken() {
    return !!this.accessToken;
  }
  setAccessToken(e2) {
    this.accessToken = e2;
  }
  requestWrapped(e2) {
    return J.wrappedRequest(e2, this.adapter.request);
  }
  requestAuth(e2) {
    return this.requestWrapped(e2);
  }
  request(e2, t2) {
    return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
      !t3 || t3.code !== "GATEWAY_INVALID_TOKEN" && t3.code !== "InvalidParameter.InvalidToken" ? n2(t3) : e3();
    }).then(() => this.getAccessToken()).then(() => {
      const t4 = this.rebuildRequest(e2);
      return this.request(t4, true);
    })) : this.getAccessToken().then(() => {
      const t3 = this.rebuildRequest(e2);
      return this.request(t3, true);
    }));
  }
  rebuildRequest(e2) {
    const t2 = Object.assign({}, e2);
    return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = J.sign(t2.data, this.config.clientSecret), t2;
  }
  setupRequest(e2, t2) {
    const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    return t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = J.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
  }
  getAccessToken() {
    if (this._getAccessTokenPromiseStatus === "pending")
      return this._getAccessTokenPromise;
    this._getAccessTokenPromiseStatus = "pending";
    return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e2) => new Promise((t2, n2) => {
      e2.result && e2.result.accessToken ? (this.setAccessToken(e2.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new B({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
    }), (e2) => (this._getAccessTokenPromiseStatus = "rejected", Promise.reject(e2))), this._getAccessTokenPromise;
  }
  authorize() {
    this.getAccessToken();
  }
  callFunction(e2) {
    const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
    return this.request(this.setupRequest(t2));
  }
  getOSSUploadOptionsFromPath(e2) {
    const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
    return new Promise((i2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: o2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
        e3 && e3.statusCode < 400 ? i2(e3) : a2(new B({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }, fail(e3) {
        a2(new B({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      } });
      typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e3) => {
        r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  reportOSSUpload(e2) {
    const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
    return this.request(this.setupRequest(t2));
  }
  uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: o2 }) {
    if (u(t2) !== "string")
      throw new B({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
    if (!(t2 = t2.trim()))
      throw new B({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
    if (/:\/\//.test(t2))
      throw new B({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
    const r2 = o2 && o2.envType || this.config.envType;
    let i2, a2;
    return this.getOSSUploadOptionsFromPath({ env: r2, filename: t2 }).then((t3) => {
      const o3 = t3.result;
      i2 = o3.id, a2 = "https://" + o3.cdnDomain + "/" + o3.ossPath;
      const r3 = { url: "https://" + o3.host, formData: { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: o3.accessKeyId, Signature: o3.signature, host: o3.host, id: i2, key: o3.ossPath, policy: o3.policy, success_action_status: 200 }, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      return this.uploadFileToOSS(Object.assign({}, r3, { onUploadProgress: s2 }));
    }).then(() => this.reportOSSUpload({ id: i2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e2, fileID: a2 }) : s3(new B({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
    }));
  }
  deleteFile({ fileList: e2 }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ id: e2[0] }) };
    return this.request(this.setupRequest(t2));
  }
  getTempFileURL({ fileList: e2 } = {}) {
    return new Promise((t2, n2) => {
      Array.isArray(e2) && e2.length !== 0 || n2(new B({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e2.map((e3) => ({ fileID: e3, tempFileURL: e3 })) });
    });
  }
};
var Q = { init(e2) {
  const t2 = new G(e2), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
const Z = typeof location != "undefined" && location.protocol === "http:" ? "http:" : "https:";
var ee;
!function(e2) {
  e2.local = "local", e2.none = "none", e2.session = "session";
}(ee || (ee = {}));
var te = function() {
};
const ne = () => {
  let e2;
  if (!Promise) {
    e2 = () => {
    }, e2.promise = {};
    const t3 = () => {
      throw new B({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
    };
    return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
  }
  const t2 = new Promise((t3, n2) => {
    e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
  });
  return e2.promise = t2, e2;
};
function se(e2) {
  return e2 === void 0;
}
function oe(e2) {
  return Object.prototype.toString.call(e2) === "[object Null]";
}
var re;
function ie(e2) {
  const t2 = (n2 = e2, Object.prototype.toString.call(n2) === "[object Array]" ? e2 : [e2]);
  var n2;
  for (const e3 of t2) {
    const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
    if (t3())
      return { adapter: n3(), runtime: s2 };
  }
}
!function(e2) {
  e2.WEB = "web", e2.WX_MP = "wx_mp";
}(re || (re = {}));
const ae = { adapter: null, runtime: void 0 }, ce = ["anonymousUuidKey"];
class ue extends te {
  constructor() {
    super(), ae.adapter.root.tcbObject || (ae.adapter.root.tcbObject = {});
  }
  setItem(e2, t2) {
    ae.adapter.root.tcbObject[e2] = t2;
  }
  getItem(e2) {
    return ae.adapter.root.tcbObject[e2];
  }
  removeItem(e2) {
    delete ae.adapter.root.tcbObject[e2];
  }
  clear() {
    delete ae.adapter.root.tcbObject;
  }
}
function le(e2, t2) {
  switch (e2) {
    case "local":
      return t2.localStorage || new ue();
    case "none":
      return new ue();
    default:
      return t2.sessionStorage || new ue();
  }
}
class he {
  constructor(e2) {
    if (!this._storage) {
      this._persistence = ae.adapter.primaryStorage || e2.persistence, this._storage = le(this._persistence, ae.adapter);
      const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, o2 = `anonymous_uuid_${e2.env}`, r2 = `login_type_${e2.env}`, i2 = `user_info_${e2.env}`;
      this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: o2, loginTypeKey: r2, userInfoKey: i2 };
    }
  }
  updatePersistence(e2) {
    if (e2 === this._persistence)
      return;
    const t2 = this._persistence === "local";
    this._persistence = e2;
    const n2 = le(e2, ae.adapter);
    for (const e3 in this.keys) {
      const s2 = this.keys[e3];
      if (t2 && ce.includes(e3))
        continue;
      const o2 = this._storage.getItem(s2);
      se(o2) || oe(o2) || (n2.setItem(s2, o2), this._storage.removeItem(s2));
    }
    this._storage = n2;
  }
  setStore(e2, t2, n2) {
    if (!this._storage)
      return;
    const s2 = { version: n2 || "localCachev1", content: t2 }, o2 = JSON.stringify(s2);
    try {
      this._storage.setItem(e2, o2);
    } catch (e3) {
      throw e3;
    }
  }
  getStore(e2, t2) {
    try {
      if (!this._storage)
        return;
    } catch (e3) {
      return "";
    }
    t2 = t2 || "localCachev1";
    const n2 = this._storage.getItem(e2);
    if (!n2)
      return "";
    if (n2.indexOf(t2) >= 0) {
      return JSON.parse(n2).content;
    }
    return "";
  }
  removeStore(e2) {
    this._storage.removeItem(e2);
  }
}
const de = {}, fe = {};
function ge(e2) {
  return de[e2];
}
class pe {
  constructor(e2, t2) {
    this.data = t2 || null, this.name = e2;
  }
}
class me extends pe {
  constructor(e2, t2) {
    super("error", { error: e2, data: t2 }), this.error = e2;
  }
}
const ye = new class {
  constructor() {
    this._listeners = {};
  }
  on(e2, t2) {
    return function(e3, t3, n2) {
      n2[e3] = n2[e3] || [], n2[e3].push(t3);
    }(e2, t2, this._listeners), this;
  }
  off(e2, t2) {
    return function(e3, t3, n2) {
      if (n2 && n2[e3]) {
        const s2 = n2[e3].indexOf(t3);
        s2 !== -1 && n2[e3].splice(s2, 1);
      }
    }(e2, t2, this._listeners), this;
  }
  fire(e2, t2) {
    if (e2 instanceof me)
      return console.error(e2.error), this;
    const n2 = typeof e2 == "string" ? new pe(e2, t2 || {}) : e2;
    const s2 = n2.name;
    if (this._listens(s2)) {
      n2.target = this;
      const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
      for (const t3 of e3)
        t3.call(this, n2);
    }
    return this;
  }
  _listens(e2) {
    return this._listeners[e2] && this._listeners[e2].length > 0;
  }
}();
function _e(e2, t2) {
  ye.on(e2, t2);
}
function we(e2, t2 = {}) {
  ye.fire(e2, t2);
}
function ke(e2, t2) {
  ye.off(e2, t2);
}
const ve = "loginStateChanged", Te = "loginStateExpire", Se = "loginTypeChanged", Pe = "anonymousConverted", Ae = "refreshAccessToken";
var Ie;
!function(e2) {
  e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
}(Ie || (Ie = {}));
const be = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Oe = { "X-SDK-Version": "1.3.5" };
function Ce(e2, t2, n2) {
  const s2 = e2[t2];
  e2[t2] = function(t3) {
    const o2 = {}, r2 = {};
    n2.forEach((n3) => {
      const { data: s3, headers: i3 } = n3.call(e2, t3);
      Object.assign(o2, s3), Object.assign(r2, i3);
    });
    const i2 = t3.data;
    return i2 && (() => {
      var e3;
      if (e3 = i2, Object.prototype.toString.call(e3) !== "[object FormData]")
        t3.data = __spreadValues(__spreadValues({}, i2), o2);
      else
        for (const e4 in o2)
          i2.append(e4, o2[e4]);
    })(), t3.headers = __spreadValues(__spreadValues({}, t3.headers || {}), r2), s2.call(e2, t3);
  };
}
function Ee() {
  const e2 = Math.random().toString(16).slice(2);
  return { data: { seqId: e2 }, headers: __spreadProps(__spreadValues({}, Oe), { "x-seqid": e2 }) };
}
class Re {
  constructor(e2 = {}) {
    var t2;
    this.config = e2, this._reqClass = new ae.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = ge(this.config.env), this._localCache = (t2 = this.config.env, fe[t2]), Ce(this._reqClass, "post", [Ee]), Ce(this._reqClass, "upload", [Ee]), Ce(this._reqClass, "download", [Ee]);
  }
  async post(e2) {
    return await this._reqClass.post(e2);
  }
  async upload(e2) {
    return await this._reqClass.upload(e2);
  }
  async download(e2) {
    return await this._reqClass.download(e2);
  }
  async refreshAccessToken() {
    let e2, t2;
    this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
    try {
      e2 = await this._refreshAccessTokenPromise;
    } catch (e3) {
      t2 = e3;
    }
    if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
      throw t2;
    return e2;
  }
  async _refreshAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: o2 } = this._cache.keys;
    this._cache.removeStore(e2), this._cache.removeStore(t2);
    let r2 = this._cache.getStore(n2);
    if (!r2)
      throw new B({ message: "\u672A\u767B\u5F55CloudBase" });
    const i2 = { refresh_token: r2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", i2);
    if (a2.data.code) {
      const { code: e3 } = a2.data;
      if (e3 === "SIGN_PARAM_INVALID" || e3 === "REFRESH_TOKEN_EXPIRED" || e3 === "INVALID_REFRESH_TOKEN") {
        if (this._cache.getStore(s2) === Ie.ANONYMOUS && e3 === "INVALID_REFRESH_TOKEN") {
          const e4 = this._cache.getStore(o2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
          return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
        }
        we(Te), this._cache.removeStore(n2);
      }
      throw new B({ code: a2.data.code, message: `\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}` });
    }
    if (a2.data.access_token)
      return we(Ae), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
    a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
  }
  async getAccessToken() {
    const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
    if (!this._cache.getStore(n2))
      throw new B({ message: "refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38" });
    let s2 = this._cache.getStore(e2), o2 = this._cache.getStore(t2), r2 = true;
    return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, o2) && (r2 = false), (!s2 || !o2 || o2 < Date.now()) && r2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: o2 };
  }
  async request(e2, t2, n2) {
    const s2 = `x-tcb-trace_${this.config.env}`;
    let o2 = "application/x-www-form-urlencoded";
    const r2 = __spreadValues({ action: e2, env: this.config.env, dataVersion: "2019-08-16" }, t2);
    if (be.indexOf(e2) === -1) {
      const { refreshTokenKey: e3 } = this._cache.keys;
      this._cache.getStore(e3) && (r2.access_token = (await this.getAccessToken()).accessToken);
    }
    let i2;
    if (e2 === "storage.uploadFile") {
      i2 = new FormData();
      for (let e3 in i2)
        i2.hasOwnProperty(e3) && i2[e3] !== void 0 && i2.append(e3, r2[e3]);
      o2 = "multipart/form-data";
    } else {
      o2 = "application/json", i2 = {};
      for (let e3 in r2)
        r2[e3] !== void 0 && (i2[e3] = r2[e3]);
    }
    let a2 = { headers: { "content-type": o2 } };
    n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
    const c2 = this._localCache.getStore(s2);
    c2 && (a2.headers["X-TCB-Trace"] = c2);
    const { parse: u2, inQuery: l2, search: h2 } = t2;
    let d2 = { env: this.config.env };
    u2 && (d2.parse = true), l2 && (d2 = __spreadValues(__spreadValues({}, l2), d2));
    let f2 = function(e3, t3, n3 = {}) {
      const s3 = /\?/.test(t3);
      let o3 = "";
      for (let e4 in n3)
        o3 === "" ? !s3 && (t3 += "?") : o3 += "&", o3 += `${e4}=${encodeURIComponent(n3[e4])}`;
      return /^http(s)?\:\/\//.test(t3 += o3) ? t3 : `${e3}${t3}`;
    }(Z, "//tcb-api.tencentcloudapi.com/web", d2);
    h2 && (f2 += h2);
    const g2 = await this.post(__spreadValues({ url: f2, data: i2 }, a2)), p2 = g2.header && g2.header["x-tcb-trace"];
    if (p2 && this._localCache.setStore(s2, p2), Number(g2.status) !== 200 && Number(g2.statusCode) !== 200 || !g2.data)
      throw new B({ code: "NETWORK_ERROR", message: "network request error" });
    return g2;
  }
  async send(e2, t2 = {}) {
    const n2 = await this.request(e2, t2, { onUploadProgress: t2.onUploadProgress });
    if (n2.data.code === "ACCESS_TOKEN_EXPIRED" && be.indexOf(e2) === -1) {
      await this.refreshAccessToken();
      const n3 = await this.request(e2, t2, { onUploadProgress: t2.onUploadProgress });
      if (n3.data.code)
        throw new B({ code: n3.data.code, message: n3.data.message });
      return n3.data;
    }
    if (n2.data.code)
      throw new B({ code: n2.data.code, message: n2.data.message });
    return n2.data;
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
}
const Ue = {};
function xe(e2) {
  return Ue[e2];
}
class Le {
  constructor(e2) {
    this.config = e2, this._cache = ge(e2.env), this._request = xe(e2.env);
  }
  setRefreshToken(e2) {
    const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
  }
  setAccessToken(e2, t2) {
    const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
    this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
  }
  async refreshUserInfo() {
    const { data: e2 } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e2), e2;
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2);
  }
}
class De {
  constructor(e2) {
    if (!e2)
      throw new B({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._envId = e2, this._cache = ge(this._envId), this._request = xe(this._envId), this.setUserInfo();
  }
  linkWithTicket(e2) {
    if (typeof e2 != "string")
      throw new B({ code: "PARAM_ERROR", message: "ticket must be string" });
    return this._request.send("auth.linkWithTicket", { ticket: e2 });
  }
  linkWithRedirect(e2) {
    e2.signInWithRedirect();
  }
  updatePassword(e2, t2) {
    return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
  }
  updateEmail(e2) {
    return this._request.send("auth.updateEmail", { newEmail: e2 });
  }
  updateUsername(e2) {
    if (typeof e2 != "string")
      throw new B({ code: "PARAM_ERROR", message: "username must be a string" });
    return this._request.send("auth.updateUsername", { username: e2 });
  }
  async getLinkedUidList() {
    const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
    let t2 = false;
    const { users: n2 } = e2;
    return n2.forEach((e3) => {
      e3.wxOpenId && e3.wxPublicId && (t2 = true);
    }), { users: n2, hasPrimaryUid: t2 };
  }
  setPrimaryUid(e2) {
    return this._request.send("auth.setPrimaryUid", { uid: e2 });
  }
  unlink(e2) {
    return this._request.send("auth.unlink", { platform: e2 });
  }
  async update(e2) {
    const { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 });
    this.setLocalUserInfo(a2);
  }
  async refresh() {
    const { data: e2 } = await this._request.send("auth.getUserInfo", {});
    return this.setLocalUserInfo(e2), e2;
  }
  setUserInfo() {
    const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
    ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
      this[e3] = t2[e3];
    }), this.location = { country: t2.country, province: t2.province, city: t2.city };
  }
  setLocalUserInfo(e2) {
    const { userInfoKey: t2 } = this._cache.keys;
    this._cache.setStore(t2, e2), this.setUserInfo();
  }
}
class Ne {
  constructor(e2) {
    if (!e2)
      throw new B({ code: "PARAM_ERROR", message: "envId is not defined" });
    this._cache = ge(e2);
    const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, o2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = this._cache.getStore(s2);
    this.credential = { refreshToken: o2, accessToken: r2, accessTokenExpire: i2 }, this.user = new De(e2);
  }
  get isAnonymousAuth() {
    return this.loginType === Ie.ANONYMOUS;
  }
  get isCustomAuth() {
    return this.loginType === Ie.CUSTOM;
  }
  get isWeixinAuth() {
    return this.loginType === Ie.WECHAT || this.loginType === Ie.WECHAT_OPEN || this.loginType === Ie.WECHAT_PUBLIC;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
}
class qe extends Le {
  async signIn() {
    this._cache.updatePersistence("local");
    const { anonymousUuidKey: e2, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2) || void 0, s2 = this._cache.getStore(t2) || void 0, o2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
    if (o2.uuid && o2.refresh_token) {
      this._setAnonymousUUID(o2.uuid), this.setRefreshToken(o2.refresh_token), await this._request.refreshAccessToken(), we(ve), we(Se, { env: this.config.env, loginType: Ie.ANONYMOUS, persistence: "local" });
      const e3 = new Ne(this.config.env);
      return await e3.user.refresh(), e3;
    }
    throw new B({ message: "\u533F\u540D\u767B\u5F55\u5931\u8D25" });
  }
  async linkAndRetrieveDataWithTicket(e2) {
    const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), o2 = this._cache.getStore(n2), r2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: o2, ticket: e2 });
    if (r2.refresh_token)
      return this._clearAnonymousUUID(), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), we(Pe, { env: this.config.env }), we(Se, { loginType: Ie.CUSTOM, persistence: "local" }), { credential: { refreshToken: r2.refresh_token } };
    throw new B({ message: "\u533F\u540D\u8F6C\u5316\u5931\u8D25" });
  }
  _setAnonymousUUID(e2) {
    const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
    this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, Ie.ANONYMOUS);
  }
  _clearAnonymousUUID() {
    this._cache.removeStore(this._cache.keys.anonymousUuidKey);
  }
}
class Fe extends Le {
  async signIn(e2) {
    if (typeof e2 != "string")
      throw new B({ param: "PARAM_ERROR", message: "ticket must be a string" });
    const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
    if (n2.refresh_token)
      return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), we(ve), we(Se, { env: this.config.env, loginType: Ie.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new Ne(this.config.env);
    throw new B({ message: "\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25" });
  }
}
class Me extends Le {
  async signIn(e2, t2) {
    if (typeof e2 != "string")
      throw new B({ code: "PARAM_ERROR", message: "email must be a string" });
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token: r2, access_token_expire: i2 } = s2;
    if (o2)
      return this.setRefreshToken(o2), r2 && i2 ? this.setAccessToken(r2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), we(ve), we(Se, { env: this.config.env, loginType: Ie.EMAIL, persistence: this.config.persistence }), new Ne(this.config.env);
    throw s2.code ? new B({ code: s2.code, message: `\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new B({ message: "\u90AE\u7BB1\u767B\u5F55\u5931\u8D25" });
  }
  async activate(e2) {
    return this._request.send("auth.activateEndUserMail", { token: e2 });
  }
  async resetPasswordWithToken(e2, t2) {
    return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
  }
}
class je extends Le {
  async signIn(e2, t2) {
    if (typeof e2 != "string")
      throw new B({ code: "PARAM_ERROR", message: "username must be a string" });
    typeof t2 != "string" && (t2 = "", console.warn("password is empty"));
    const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Ie.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token_expire: r2, access_token: i2 } = s2;
    if (o2)
      return this.setRefreshToken(o2), i2 && r2 ? this.setAccessToken(i2, r2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), we(ve), we(Se, { env: this.config.env, loginType: Ie.USERNAME, persistence: this.config.persistence }), new Ne(this.config.env);
    throw s2.code ? new B({ code: s2.code, message: `\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new B({ message: "\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25" });
  }
}
class $e {
  constructor(e2) {
    this.config = e2, this._cache = ge(e2.env), this._request = xe(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), _e(Se, this._onLoginTypeChanged);
  }
  get currentUser() {
    const e2 = this.hasLoginState();
    return e2 && e2.user || null;
  }
  get loginType() {
    return this._cache.getStore(this._cache.keys.loginTypeKey);
  }
  anonymousAuthProvider() {
    return new qe(this.config);
  }
  customAuthProvider() {
    return new Fe(this.config);
  }
  emailAuthProvider() {
    return new Me(this.config);
  }
  usernameAuthProvider() {
    return new je(this.config);
  }
  async signInAnonymously() {
    return new qe(this.config).signIn();
  }
  async signInWithEmailAndPassword(e2, t2) {
    return new Me(this.config).signIn(e2, t2);
  }
  signInWithUsernameAndPassword(e2, t2) {
    return new je(this.config).signIn(e2, t2);
  }
  async linkAndRetrieveDataWithTicket(e2) {
    this._anonymousAuthProvider || (this._anonymousAuthProvider = new qe(this.config)), _e(Pe, this._onAnonymousConverted);
    return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
  }
  async signOut() {
    if (this.loginType === Ie.ANONYMOUS)
      throw new B({ message: "\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C" });
    const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
    if (!s2)
      return;
    const o2 = await this._request.send("auth.logout", { refresh_token: s2 });
    return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), we(ve), we(Se, { env: this.config.env, loginType: Ie.NULL, persistence: this.config.persistence }), o2;
  }
  async signUpWithEmailAndPassword(e2, t2) {
    return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
  }
  async sendPasswordResetEmail(e2) {
    return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
  }
  onLoginStateChanged(e2) {
    _e(ve, () => {
      const t3 = this.hasLoginState();
      e2.call(this, t3);
    });
    const t2 = this.hasLoginState();
    e2.call(this, t2);
  }
  onLoginStateExpired(e2) {
    _e(Te, e2.bind(this));
  }
  onAccessTokenRefreshed(e2) {
    _e(Ae, e2.bind(this));
  }
  onAnonymousConverted(e2) {
    _e(Pe, e2.bind(this));
  }
  onLoginTypeChanged(e2) {
    _e(Se, () => {
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    });
  }
  async getAccessToken() {
    return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
  }
  hasLoginState() {
    const { refreshTokenKey: e2 } = this._cache.keys;
    return this._cache.getStore(e2) ? new Ne(this.config.env) : null;
  }
  async isUsernameRegistered(e2) {
    if (typeof e2 != "string")
      throw new B({ code: "PARAM_ERROR", message: "username must be a string" });
    const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
    return t2 && t2.isRegistered;
  }
  getLoginState() {
    return Promise.resolve(this.hasLoginState());
  }
  async signInWithTicket(e2) {
    return new Fe(this.config).signIn(e2);
  }
  shouldRefreshAccessToken(e2) {
    this._request._shouldRefreshAccessTokenHook = e2.bind(this);
  }
  getUserInfo() {
    return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : __spreadProps(__spreadValues({}, e2.data), { requestId: e2.seqId }));
  }
  getAuthHeader() {
    const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
    return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
  }
  _onAnonymousConverted(e2) {
    const { env: t2 } = e2.data;
    t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
  }
  _onLoginTypeChanged(e2) {
    const { loginType: t2, persistence: n2, env: s2 } = e2.data;
    s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
  }
}
const Ke = function(e2, t2) {
  t2 = t2 || ne();
  const n2 = xe(this.config.env), { cloudPath: s2, filePath: o2, onUploadProgress: r2, fileType: i2 = "image" } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e3, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
    n2.upload({ url: a2, data: f2, file: o2, name: s2, fileType: i2, onUploadProgress: r2 }).then((e4) => {
      e4.statusCode === 201 ? t2(null, { fileID: l2, requestId: d2 }) : t2(new B({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
    }).catch((e4) => {
      t2(e4);
    });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, Be = function(e2, t2) {
  t2 = t2 || ne();
  const n2 = xe(this.config.env), { cloudPath: s2 } = e2;
  return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
    t2(null, e3);
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, He = function({ fileList: e2 }, t2) {
  if (t2 = t2 || ne(), !e2 || !Array.isArray(e2))
    return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
  for (let t3 of e2)
    if (!t3 || typeof t3 != "string")
      return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
  const n2 = { fileid_list: e2 };
  return xe(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, We = function({ fileList: e2 }, t2) {
  t2 = t2 || ne(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
  let n2 = [];
  for (let s3 of e2)
    typeof s3 == "object" ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : typeof s3 == "string" ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
  const s2 = { file_list: n2 };
  return xe(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
    e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
  }).catch((e3) => {
    t2(e3);
  }), t2.promise;
}, ze = async function({ fileID: e2 }, t2) {
  const n2 = (await We.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
  if (n2.code !== "SUCCESS")
    return t2 ? t2(n2) : new Promise((e3) => {
      e3(n2);
    });
  const s2 = xe(this.config.env);
  let o2 = n2.download_url;
  if (o2 = encodeURI(o2), !t2)
    return s2.download({ url: o2 });
  t2(await s2.download({ url: o2 }));
}, Je = function({ name: e2, data: t2, query: n2, parse: s2, search: o2 }, r2) {
  const i2 = r2 || ne();
  let a2;
  try {
    a2 = t2 ? JSON.stringify(t2) : "";
  } catch (e3) {
    return Promise.reject(e3);
  }
  if (!e2)
    return Promise.reject(new B({ code: "PARAM_ERROR", message: "\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A" }));
  const c2 = { inQuery: n2, parse: s2, search: o2, function_name: e2, request_data: a2 };
  return xe(this.config.env).send("functions.invokeFunction", c2).then((e3) => {
    if (e3.code)
      i2(null, e3);
    else {
      let t3 = e3.data.response_data;
      if (s2)
        i2(null, { result: t3, requestId: e3.requestId });
      else
        try {
          t3 = JSON.parse(e3.data.response_data), i2(null, { result: t3, requestId: e3.requestId });
        } catch (e4) {
          i2(new B({ message: "response data must be json" }));
        }
    }
    return i2.promise;
  }).catch((e3) => {
    i2(e3);
  }), i2.promise;
}, Ve = { timeout: 15e3, persistence: "session" }, Ye = {};
class Xe {
  constructor(e2) {
    this.config = e2 || this.config, this.authObj = void 0;
  }
  init(e2) {
    switch (ae.adapter || (this.requestClient = new ae.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e2.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = __spreadValues(__spreadValues({}, Ve), e2), true) {
      case this.config.timeout > 6e5:
        console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
        break;
      case this.config.timeout < 100:
        console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
    }
    return new Xe(this.config);
  }
  auth({ persistence: e2 } = {}) {
    if (this.authObj)
      return this.authObj;
    const t2 = e2 || ae.adapter.primaryStorage || Ve.persistence;
    var n2;
    return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
      const { env: t3 } = e3;
      de[t3] = new he(e3), fe[t3] = new he(__spreadProps(__spreadValues({}, e3), { persistence: "local" }));
    }(this.config), n2 = this.config, Ue[n2.env] = new Re(n2), this.authObj = new $e(this.config), this.authObj;
  }
  on(e2, t2) {
    return _e.apply(this, [e2, t2]);
  }
  off(e2, t2) {
    return ke.apply(this, [e2, t2]);
  }
  callFunction(e2, t2) {
    return Je.apply(this, [e2, t2]);
  }
  deleteFile(e2, t2) {
    return He.apply(this, [e2, t2]);
  }
  getTempFileURL(e2, t2) {
    return We.apply(this, [e2, t2]);
  }
  downloadFile(e2, t2) {
    return ze.apply(this, [e2, t2]);
  }
  uploadFile(e2, t2) {
    return Ke.apply(this, [e2, t2]);
  }
  getUploadMetadata(e2, t2) {
    return Be.apply(this, [e2, t2]);
  }
  registerExtension(e2) {
    Ye[e2.name] = e2;
  }
  async invokeExtension(e2, t2) {
    const n2 = Ye[e2];
    if (!n2)
      throw new B({ message: `\u6269\u5C55${e2} \u5FC5\u987B\u5148\u6CE8\u518C` });
    return await n2.invoke(t2, this);
  }
  useAdapters(e2) {
    const { adapter: t2, runtime: n2 } = ie(e2) || {};
    t2 && (ae.adapter = t2), n2 && (ae.runtime = n2);
  }
}
var Ge = new Xe();
function Qe(e2, t2, n2) {
  n2 === void 0 && (n2 = {});
  var s2 = /\?/.test(t2), o2 = "";
  for (var r2 in n2)
    o2 === "" ? !s2 && (t2 += "?") : o2 += "&", o2 += r2 + "=" + encodeURIComponent(n2[r2]);
  return /^http(s)?:\/\//.test(t2 += o2) ? t2 : "" + e2 + t2;
}
class Ze {
  post(e2) {
    const { url: t2, data: n2, headers: s2 } = e2;
    return new Promise((e3, o2) => {
      V.request({ url: Qe("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
        e3(t3);
      }, fail(e4) {
        o2(e4);
      } });
    });
  }
  upload(e2) {
    return new Promise((t2, n2) => {
      const { url: s2, file: o2, data: r2, headers: i2, fileType: a2 } = e2, c2 = V.uploadFile({ url: Qe("https:", s2), name: "file", formData: Object.assign({}, r2), filePath: o2, fileType: a2, header: i2, success(e3) {
        const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
        e3.statusCode === 200 && r2.success_action_status && (n3.statusCode = parseInt(r2.success_action_status, 10)), t2(n3);
      }, fail(e3) {
        n2(new Error(e3.errMsg || "uploadFile:fail"));
      } });
      typeof e2.onUploadProgress == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((t3) => {
        e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
      });
    });
  }
}
const et = { setItem(e2, t2) {
  V.setStorageSync(e2, t2);
}, getItem: (e2) => V.getStorageSync(e2), removeItem(e2) {
  V.removeStorageSync(e2);
}, clear() {
  V.clearStorageSync();
} };
var tt = { genAdapter: function() {
  return { root: {}, reqClass: Ze, localStorage: et, primaryStorage: "local" };
}, isMatch: function() {
  return true;
}, runtime: "uni_app" };
Ge.useAdapters(tt);
const nt = Ge, st = nt.init;
nt.init = function(e2) {
  e2.env = e2.spaceId;
  const t2 = st.call(this, e2);
  t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
  const n2 = t2.auth;
  return t2.auth = function(e3) {
    const t3 = n2.call(this, e3);
    return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
      t3[e4] = K(t3[e4]).bind(t3);
    }), t3;
  }, t2.customAuth = t2.auth, t2;
};
var ot = nt;
function rt(e2) {
  return e2 && rt(e2.__v_raw) || e2;
}
function it() {
  return { token: V.getStorageSync("uni_id_token") || V.getStorageSync("uniIdToken"), tokenExpired: V.getStorageSync("uni_id_token_expired") };
}
function at({ token: e2, tokenExpired: t2 } = {}) {
  e2 && V.setStorageSync("uni_id_token", e2), t2 && V.setStorageSync("uni_id_token_expired", t2);
}
function ct() {
  if (g !== "web")
    return;
  index.getStorageSync("__LAST_DCLOUD_APPID") !== _ && (index.setStorageSync("__LAST_DCLOUD_APPID", _), console.warn("\u68C0\u6D4B\u5230\u5F53\u524D\u9879\u76EE\u4E0E\u4E0A\u6B21\u8FD0\u884C\u5230\u6B64\u7AEF\u53E3\u7684\u9879\u76EE\u4E0D\u4E00\u81F4\uFF0C\u81EA\u52A8\u6E05\u7406uni-id\u4FDD\u5B58\u7684token\u4FE1\u606F\uFF08\u4EC5\u5F00\u53D1\u8C03\u8BD5\u65F6\u751F\u6548\uFF09"), V.removeStorageSync("uni_id_token"), V.removeStorageSync("uniIdToken"), V.removeStorageSync("uni_id_token_expired"));
}
var ut = class extends G {
  getAccessToken() {
    return new Promise((e2, t2) => {
      const n2 = "Anonymous_Access_token";
      this.setAccessToken(n2), e2(n2);
    });
  }
  setupRequest(e2, t2) {
    const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
    t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = J.sign(n2, this.config.clientSecret);
    const o2 = z();
    s2["x-client-info"] = encodeURIComponent(JSON.stringify(o2));
    const { token: r2 } = it();
    return s2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
  }
  uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
    return new Promise((i2, a2) => {
      const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: o2, success(e3) {
        e3 && e3.statusCode < 400 ? i2(e3) : a2(new B({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }, fail(e3) {
        a2(new B({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      } });
      typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e3) => {
        r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
      });
    });
  }
  uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
    if (!t2)
      throw new B({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
    let o2;
    return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
      const { url: r2, formData: i2, name: a2 } = t3.result;
      o2 = t3.result.fileUrl;
      const c2 = { url: r2, formData: i2, name: a2, filePath: e2, fileType: n2 };
      return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
    }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
      t3.success ? n3({ success: true, filePath: e2, fileID: o2 }) : s3(new B({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
    }));
  }
  deleteFile({ fileList: e2 }) {
    const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
    return this.request(this.setupRequest(t2));
  }
  getTempFileURL({ fileList: e2 } = {}) {
    const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2 }) };
    return this.request(this.setupRequest(t2));
  }
};
var lt = { init(e2) {
  const t2 = new ut(e2), n2 = { signInAnonymously: function() {
    return t2.authorize();
  }, getLoginState: function() {
    return Promise.resolve(false);
  } };
  return t2.auth = function() {
    return n2;
  }, t2.customAuth = t2.auth, t2;
} };
function ht({ data: e2 }) {
  let t2;
  t2 = z();
  const n2 = JSON.parse(JSON.stringify(e2 || {}));
  if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
    const { token: e3 } = it();
    e3 && (n2.uniIdToken = e3);
  }
  return n2;
}
function dt({ name: e2, data: t2 } = {}) {
  const { localAddress: n2, localPort: s2 } = this.__dev__, o2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${n2}:${s2}/system/check-function`, a2 = `http://${n2}:${s2}/cloudfunctions/${e2}`;
  return new Promise((t3, n3) => {
    V.request({ method: "POST", url: i2, data: { name: e2, platform: g, provider: o2, spaceId: r2 }, timeout: 3e3, success(e3) {
      t3(e3);
    }, fail() {
      t3({ data: { code: "NETWORK_ERROR", message: "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570\u3002" } });
    } });
  }).then(({ data: e3 } = {}) => {
    const { code: t3, message: n3 } = e3 || {};
    return { code: t3 === 0 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
  }).then(({ code: n3, message: s3 }) => {
    if (n3 !== 0) {
      switch (n3) {
        case "MODULE_ENCRYPTED":
          console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e2}\uFF09\u4F9D\u8D56\u52A0\u5BC6\u516C\u5171\u6A21\u5757\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
          break;
        case "FUNCTION_ENCRYPTED":
          console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e2}\uFF09\u5DF2\u52A0\u5BC6\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
          break;
        case "ACTION_ENCRYPTED":
          console.error(s3 || "\u9700\u8981\u8BBF\u95EE\u52A0\u5BC6\u7684uni-clientDB-action\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u73AF\u5883");
          break;
        case "NETWORK_ERROR": {
          const e3 = "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B";
          throw console.error(e3), new Error(e3);
        }
        case "SWITCH_TO_CLOUD":
          break;
        default: {
          const e3 = `\u68C0\u6D4B\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u51FA\u73B0\u9519\u8BEF\uFF1A${s3}\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u73AF\u5883\u6216\u91CD\u542F\u5BA2\u6237\u7AEF\u518D\u8BD5`;
          throw console.error(e3), new Error(e3);
        }
      }
      return this._callCloudFunction({ name: e2, data: t2 });
    }
    return new Promise((e3, n4) => {
      const s4 = ht.call(this, { data: t2 });
      V.request({ method: "POST", url: a2, data: { provider: o2, platform: g, param: s4 }, success: ({ statusCode: t3, data: s5 } = {}) => !t3 || t3 >= 400 ? n4(new B({ code: s5.code || "SYS_ERR", message: s5.message || "request:fail" })) : e3({ result: s5 }), fail(e4) {
        n4(new B({ code: e4.code || e4.errCode || "SYS_ERR", message: e4.message || e4.errMsg || "request:fail" }));
      } });
    });
  });
}
const ft = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
var gt = /[\\^$.*+?()[\]{}|]/g, pt = RegExp(gt.source);
function mt(e2, t2, n2) {
  return e2.replace(new RegExp((s2 = t2) && pt.test(s2) ? s2.replace(gt, "\\$&") : s2, "g"), n2);
  var s2;
}
function yt({ functionName: e2, result: t2, logPvd: n2 }) {
  if (this.__dev__.debugLog && t2 && t2.requestId) {
    const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
    console.log(`[${n2}-request]${s2}[/${n2}-request]`);
  }
}
function _t(e2) {
  const t2 = e2.callFunction, n2 = function(n3) {
    const s2 = n3.name;
    n3.data = ht.call(e2, { data: n3.data });
    const o2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb" }[this.config.provider];
    return t2.call(this, n3).then((e3) => (e3.errCode = 0, yt.call(this, { functionName: s2, result: e3, logPvd: o2 }), Promise.resolve(e3)), (e3) => (yt.call(this, { functionName: s2, result: e3, logPvd: o2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
      for (let s3 = 0; s3 < n4.length; s3++) {
        const { rule: o3, content: r2, mode: i2 } = n4[s3], a2 = e4.match(o3);
        if (!a2)
          continue;
        let c2 = r2;
        for (let e5 = 1; e5 < a2.length; e5++)
          c2 = mt(c2, `{$${e5}}`, a2[e5]);
        for (const e5 in t3)
          c2 = mt(c2, `{${e5}}`, t3[e5]);
        return i2 === "replace" ? c2 : e4 + c2;
      }
      return e4;
    }({ message: `[${n3.name}]: ${e3.message}`, formatter: ft, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
  };
  e2.callFunction = function(t3) {
    let s2;
    e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && m ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = dt), s2 = dt) : s2 = n2;
    const o2 = s2.call(this, t3);
    return Object.defineProperty(o2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), o2;
  };
}
const wt = Symbol("CLIENT_DB_INTERNAL");
function kt(e2, t2) {
  return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = wt, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
    if (n2 === "_uniClient")
      return null;
    if (n2 in e3 || typeof n2 != "string") {
      const t3 = e3[n2];
      return typeof t3 == "function" ? t3.bind(e3) : t3;
    }
    return t2.get(e3, n2, s2);
  } });
}
function vt(e2) {
  return { on: (t2, n2) => {
    e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
  }, off: (t2, n2) => {
    e2[t2] = e2[t2] || [];
    const s2 = e2[t2].indexOf(n2);
    s2 !== -1 && e2[t2].splice(s2, 1);
  } };
}
const Tt = ["db.Geo", "db.command", "command.aggregate"];
function St(e2, t2) {
  return Tt.indexOf(`${e2}.${t2}`) > -1;
}
function Pt(e2) {
  switch (u(e2 = rt(e2))) {
    case "array":
      return e2.map((e3) => Pt(e3));
    case "object":
      return e2._internalType === wt || Object.keys(e2).forEach((t2) => {
        e2[t2] = Pt(e2[t2]);
      }), e2;
    case "regexp":
      return { $regexp: { source: e2.source, flags: e2.flags } };
    case "date":
      return { $date: e2.toISOString() };
    default:
      return e2;
  }
}
function At(e2) {
  return e2 && e2.content && e2.content.$method;
}
class It {
  constructor(e2, t2, n2) {
    this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
  }
  toJSON() {
    let e2 = this;
    const t2 = [e2.content];
    for (; e2.prevStage; )
      e2 = e2.prevStage, t2.push(e2.content);
    return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: Pt(e3.$param) })) };
  }
  getAction() {
    const e2 = this.toJSON().$db.find((e3) => e3.$method === "action");
    return e2 && e2.$param && e2.$param[0];
  }
  getCommand() {
    return { $db: this.toJSON().$db.filter((e2) => e2.$method !== "action") };
  }
  get isAggregate() {
    let e2 = this;
    for (; e2; ) {
      const t2 = At(e2), n2 = At(e2.prevStage);
      if (t2 === "aggregate" && n2 === "collection" || t2 === "pipeline")
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isCommand() {
    let e2 = this;
    for (; e2; ) {
      if (At(e2) === "command")
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get isAggregateCommand() {
    let e2 = this;
    for (; e2; ) {
      const t2 = At(e2), n2 = At(e2.prevStage);
      if (t2 === "aggregate" && n2 === "command")
        return true;
      e2 = e2.prevStage;
    }
    return false;
  }
  get count() {
    if (!this.isAggregate)
      return function() {
        return this._send("count", Array.from(arguments));
      };
    const e2 = this;
    return function() {
      return bt({ $method: "count", $param: Pt(Array.from(arguments)) }, e2, this._database);
    };
  }
  get remove() {
    if (!this.isCommand)
      return function() {
        return this._send("remove", Array.from(arguments));
      };
    const e2 = this;
    return function() {
      return bt({ $method: "remove", $param: Pt(Array.from(arguments)) }, e2, this._database);
    };
  }
  get() {
    return this._send("get", Array.from(arguments));
  }
  add() {
    return this._send("add", Array.from(arguments));
  }
  update() {
    return this._send("update", Array.from(arguments));
  }
  end() {
    return this._send("end", Array.from(arguments));
  }
  get set() {
    if (!this.isCommand)
      return function() {
        throw new Error("JQL\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
      };
    const e2 = this;
    return function() {
      return bt({ $method: "set", $param: Pt(Array.from(arguments)) }, e2, this._database);
    };
  }
  _send(e2, t2) {
    const n2 = this.getAction(), s2 = this.getCommand();
    if (s2.$db.push({ $method: e2, $param: Pt(t2) }), d) {
      const e3 = s2.$db.find((e4) => e4.$method === "collection"), t3 = e3 && e3.$param;
      t3 && t3.length === 1 && typeof e3.$param[0] == "string" && e3.$param[0].indexOf(",") > -1 && console.warn("\u68C0\u6D4B\u5230\u4F7F\u7528JQL\u8BED\u6CD5\u8054\u8868\u67E5\u8BE2\u65F6\uFF0C\u672A\u4F7F\u7528getTemp\u5148\u8FC7\u6EE4\u4E3B\u8868\u6570\u636E\uFF0C\u5728\u4E3B\u8868\u6570\u636E\u91CF\u5927\u7684\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u67E5\u8BE2\u7F13\u6162\u3002\n- \u5982\u4F55\u4F18\u5316\u8BF7\u53C2\u8003\u6B64\u6587\u6863\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- \u5982\u679C\u4E3B\u8868\u6570\u636E\u91CF\u5F88\u5C0F\u8BF7\u5FFD\u7565\u6B64\u4FE1\u606F\uFF0C\u9879\u76EE\u53D1\u884C\u65F6\u4E0D\u4F1A\u51FA\u73B0\u6B64\u63D0\u793A\u3002");
    }
    return this._database._callCloudFunction({ action: n2, command: s2 });
  }
}
function bt(e2, t2, n2) {
  return kt(new It(e2, t2, n2), { get(e3, t3) {
    let s2 = "db";
    return e3 && e3.content && (s2 = e3.content.$method), St(s2, t3) ? bt({ $method: t3 }, e3, n2) : function() {
      return bt({ $method: t3, $param: Pt(Array.from(arguments)) }, e3, n2);
    };
  } });
}
function Ot({ path: e2, method: t2 }) {
  return class {
    constructor() {
      this.param = Array.from(arguments);
    }
    toJSON() {
      return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
    }
  };
}
class Ct extends class {
  constructor({ uniClient: e2 = {} } = {}) {
    this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2.isDefault && (this._dbCallBacks = k("_globalUniCloudDatabaseCallback")), this.auth = vt(this._authCallBacks), Object.assign(this, vt(this._dbCallBacks)), this.env = kt({}, { get: (e3, t2) => ({ $env: t2 }) }), this.Geo = kt({}, { get: (e3, t2) => Ot({ path: ["Geo"], method: t2 }) }), this.serverDate = Ot({ path: [], method: "serverDate" }), this.RegExp = Ot({ path: [], method: "RegExp" });
  }
  getCloudEnv(e2) {
    if (typeof e2 != "string" || !e2.trim())
      throw new Error("getCloudEnv\u53C2\u6570\u9519\u8BEF");
    return { $env: e2.replace("$cloudEnv_", "") };
  }
  _callback(e2, t2) {
    const n2 = this._dbCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  _callbackAuth(e2, t2) {
    const n2 = this._authCallBacks;
    n2[e2] && n2[e2].forEach((e3) => {
      e3(...t2);
    });
  }
  multiSend() {
    const e2 = Array.from(arguments), t2 = e2.map((e3) => {
      const t3 = e3.getAction(), n2 = e3.getCommand();
      if (n2.$db[n2.$db.length - 1].$method !== "getTemp")
        throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
      return { action: t3, command: n2 };
    });
    return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
  }
} {
  _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
    function o2(e3, t3) {
      if (n2 && s2)
        for (let n3 = 0; n3 < s2.length; n3++) {
          const o3 = s2[n3];
          o3.udb && typeof o3.udb.setResult == "function" && (t3 ? o3.udb.setResult(t3) : o3.udb.setResult(e3.result.dataList[n3]));
        }
    }
    const r2 = this;
    function i2(e3) {
      return r2._callback("error", [e3]), A(I("database", "fail"), e3).then(() => A(I("database", "complete"), e3)).then(() => (o2(null, e3), F(C, { type: U, content: e3 }), Promise.reject(e3)));
    }
    const a2 = A(I("database", "invoke")), u2 = this._uniClient;
    return a2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: c, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
      const { code: t3, message: n3, token: s3, tokenExpired: r3, systemInfo: a3 = [] } = e3.result;
      if (a3)
        for (let e4 = 0; e4 < a3.length; e4++) {
          const { level: t4, message: n4, detail: s4 } = a3[e4], o3 = console[g === "app" && t4 === "warn" ? "error" : t4] || console.log;
          let r4 = "[System Info]" + n4;
          s4 && (r4 = `${r4}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), o3(r4);
        }
      if (t3) {
        return i2(new B({ code: t3, message: n3, requestId: e3.requestId }));
      }
      e3.result.errCode = e3.result.code, e3.result.errMsg = e3.result.message, s3 && r3 && (at({ token: s3, tokenExpired: r3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: r3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: r3 }]), F(R, { token: s3, tokenExpired: r3 }));
      const c2 = [{ prop: "affectedDocs", tips: "affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3" }, { prop: "code", tips: "code\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errCode\u66FF\u4EE3" }, { prop: "message", tips: "message\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errMsg\u66FF\u4EE3" }];
      for (let t4 = 0; t4 < c2.length; t4++) {
        const { prop: n4, tips: s4 } = c2[t4];
        if (n4 in e3.result) {
          const t5 = e3.result[n4];
          Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
        }
      }
      return function(e4) {
        return A(I("database", "success"), e4).then(() => A(I("database", "complete"), e4)).then(() => (o2(e4, null), F(C, { type: U, content: e4 }), Promise.resolve(e4)));
      }(e3);
    }, (e3) => {
      /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB");
      return i2(new B({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
    });
  }
}
function Et(e2) {
  e2.database = function(t2) {
    if (t2 && Object.keys(t2).length > 0)
      return e2.init(t2).database();
    if (this._database)
      return this._database;
    const n2 = function(e3, t3 = {}) {
      return kt(new e3(t3), { get: (e4, t4) => St("db", t4) ? bt({ $method: t4 }, null, e4) : function() {
        return bt({ $method: t4, $param: Pt(Array.from(arguments)) }, null, e4);
      } });
    }(Ct, { uniClient: e2 });
    return this._database = n2, n2;
  };
}
const Rt = "token\u65E0\u6548\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Ut = "token\u8FC7\u671F\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", xt = { TOKEN_INVALID_TOKEN_EXPIRED: Ut, TOKEN_INVALID_INVALID_CLIENTID: Rt, TOKEN_INVALID: Rt, TOKEN_INVALID_WRONG_TOKEN: Rt, TOKEN_INVALID_ANONYMOUS_USER: Rt }, Lt = { "uni-id-token-expired": Ut, "uni-id-check-token-failed": Rt, "uni-id-token-not-exist": Rt, "uni-id-check-device-feature-failed": Rt };
function Dt(e2, t2) {
  let n2 = "";
  return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
}
function Nt(e2 = [], t2 = "") {
  const n2 = [], s2 = [];
  return e2.forEach((e3) => {
    e3.needLogin === true ? n2.push(Dt(t2, e3.path)) : e3.needLogin === false && s2.push(Dt(t2, e3.path));
  }), { needLoginPage: n2, notNeedLoginPage: s2 };
}
function qt(e2) {
  return e2.split("?")[0].replace(/^\//, "");
}
function Ft() {
  return function(e2) {
    let t2 = e2 && e2.$page && e2.$page.fullPath || "";
    return t2 ? (t2.charAt(0) !== "/" && (t2 = "/" + t2), t2) : t2;
  }(function() {
    const e2 = getCurrentPages();
    return e2[e2.length - 1];
  }());
}
function Mt() {
  return qt(Ft());
}
function jt(e2 = "", t2 = {}) {
  if (!e2)
    return false;
  if (!(t2 && t2.list && t2.list.length))
    return false;
  const n2 = t2.list, s2 = qt(e2);
  return n2.some((e3) => e3.pagePath === s2);
}
const $t = !!t.uniIdRouter;
const { loginPage: Kt, routerNeedLogin: Bt, resToLogin: Ht, needLoginPage: Wt, notNeedLoginPage: zt, loginPageInTabBar: Jt } = function({ pages: e2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: o2 = {} } = t) {
  const { loginPage: r2, needLogin: i2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = Nt(e2), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e3 = []) {
    const t2 = [], n3 = [];
    return e3.forEach((e4) => {
      const { root: s3, pages: o3 = [] } = e4, { needLoginPage: r3, notNeedLoginPage: i3 } = Nt(o3, s3);
      t2.push(...r3), n3.push(...i3);
    }), { needLoginPage: t2, notNeedLoginPage: n3 };
  }(n2);
  return { loginPage: r2, routerNeedLogin: i2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: jt(r2, o2) };
}();
if (Wt.indexOf(Kt) > -1)
  throw new Error(`Login page [${Kt}] should not be "needLogin", please check your pages.json`);
function Vt(e2) {
  const t2 = qt(function(e3) {
    const t3 = Mt(), n2 = e3.charAt(0), s2 = e3.split("?")[0];
    if (n2 === "/")
      return s2;
    const o2 = s2.replace(/^\//, "").split("/"), r2 = t3.split("/");
    r2.pop();
    for (let e4 = 0; e4 < o2.length; e4++) {
      const t4 = o2[e4];
      t4 === ".." ? r2.pop() : t4 !== "." && r2.push(t4);
    }
    return r2[0] === "" && r2.shift(), r2.join("/");
  }(e2));
  return !(zt.indexOf(t2) > -1) && (Wt.indexOf(t2) > -1 || Bt.some((t3) => function(e3, t4) {
    return new RegExp(t4).test(e3);
  }(e2, t3)));
}
function Yt({ redirect: e2 }) {
  const t2 = qt(e2), n2 = qt(Kt);
  return Mt() !== n2 && t2 !== n2;
}
function Xt({ api: e2, redirect: t2 } = {}) {
  if (!t2 || !Yt({ redirect: t2 }))
    return;
  const n2 = function(e3, t3) {
    return e3.charAt(0) !== "/" && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
  }(Kt, t2);
  Jt ? e2 !== "navigateTo" && e2 !== "redirectTo" || (e2 = "switchTab") : e2 === "switchTab" && (e2 = "navigateTo"), setTimeout(() => {
    index[e2]({ url: n2 });
  });
}
function Gt({ url: e2 } = {}) {
  const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
    const { token: e3, tokenExpired: t3 } = it();
    let n3;
    if (e3) {
      if (t3 < Date.now()) {
        const e4 = "uni-id-token-expired";
        n3 = { errCode: e4, errMsg: Lt[e4] };
      }
    } else {
      const e4 = "uni-id-check-token-failed";
      n3 = { errCode: e4, errMsg: Lt[e4] };
    }
    return n3;
  }();
  if (Vt(e2) && n2) {
    n2.uniIdRedirectUrl = e2;
    if (D(E).length > 0)
      return setTimeout(() => {
        F(E, n2);
      }, 0), t2.abortLoginPageJump = true, t2;
    t2.autoToLoginPage = true;
  }
  return t2;
}
function Qt() {
  !function() {
    const e3 = Ft(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Gt({ url: e3 });
    t2 || n2 && Xt({ api: "redirectTo", redirect: e3 });
  }();
  const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
  for (let t2 = 0; t2 < e2.length; t2++) {
    const n2 = e2[t2];
    index.addInterceptor(n2, { invoke(e3) {
      const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Gt({ url: e3.url });
      return t3 ? e3 : s2 ? (Xt({ api: n2, redirect: e3.url }), false) : e3;
    } });
  }
}
function Zt() {
  this.onResponse((e2) => {
    const { type: t2, content: n2 } = e2;
    let s2 = false;
    switch (t2) {
      case "cloudobject":
        s2 = function(e3) {
          const { errCode: t3 } = e3;
          return t3 in Lt;
        }(n2);
        break;
      case "clientdb":
        s2 = function(e3) {
          const { errCode: t3 } = e3;
          return t3 in xt;
        }(n2);
    }
    s2 && function(e3 = {}) {
      const t3 = D(E);
      $().then(() => {
        const n3 = Ft();
        if (n3 && Yt({ redirect: n3 }))
          return t3.length > 0 ? F(E, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (Kt && Xt({ api: "navigateTo", redirect: n3 }));
      });
    }(n2);
  });
}
function en(e2) {
  !function(e3) {
    e3.onResponse = function(e4) {
      N(C, e4);
    }, e3.offResponse = function(e4) {
      q(C, e4);
    };
  }(e2), function(e3) {
    e3.onNeedLogin = function(e4) {
      N(E, e4);
    }, e3.offNeedLogin = function(e4) {
      q(E, e4);
    }, $t && (k("uni-cloud-status").needLoginInit || (k("uni-cloud-status").needLoginInit = true, $().then(() => {
      Qt.call(e3);
    }), Ht && Zt.call(e3)));
  }(e2), function(e3) {
    e3.onRefreshToken = function(e4) {
      N(R, e4);
    }, e3.offRefreshToken = function(e4) {
      q(R, e4);
    };
  }(e2);
}
let tn;
const nn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", sn = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
function on() {
  const e2 = it().token || "", t2 = e2.split(".");
  if (!e2 || t2.length !== 3)
    return { uid: null, role: [], permission: [], tokenExpired: 0 };
  let n2;
  try {
    n2 = JSON.parse((s2 = t2[1], decodeURIComponent(tn(s2).split("").map(function(e3) {
      return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
    }).join(""))));
  } catch (e3) {
    throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e3.message);
  }
  var s2;
  return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
}
tn = typeof atob != "function" ? function(e2) {
  if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !sn.test(e2))
    throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
  var t2;
  e2 += "==".slice(2 - (3 & e2.length));
  for (var n2, s2, o2 = "", r2 = 0; r2 < e2.length; )
    t2 = nn.indexOf(e2.charAt(r2++)) << 18 | nn.indexOf(e2.charAt(r2++)) << 12 | (n2 = nn.indexOf(e2.charAt(r2++))) << 6 | (s2 = nn.indexOf(e2.charAt(r2++))), o2 += n2 === 64 ? String.fromCharCode(t2 >> 16 & 255) : s2 === 64 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
  return o2;
} : atob;
var rn = s(function(e2, t2) {
  Object.defineProperty(t2, "__esModule", { value: true });
  const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
  function o2(e3, t3) {
    return e3.tempFiles.forEach((e4, n3) => {
      e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
    }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
  }
  function r2(e3, t3, { onChooseFile: s3, onUploadProgress: o3 }) {
    return t3.then((e4) => {
      if (s3) {
        const t4 = s3(e4);
        if (t4 !== void 0)
          return Promise.resolve(t4).then((t5) => t5 === void 0 ? e4 : t5);
      }
      return e4;
    }).then((t4) => t4 === false ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, o4) {
      (t5 = Object.assign({}, t5)).errMsg = n2;
      const r3 = t5.tempFiles, i2 = r3.length;
      let a2 = 0;
      return new Promise((n3) => {
        for (; a2 < s4; )
          c2();
        function c2() {
          const s5 = a2++;
          if (s5 >= i2)
            return void (!r3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
          const u2 = r3[s5];
          e4.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e5) {
            e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, o4 && o4(e5);
          } }).then((e5) => {
            u2.url = e5.fileID, s5 < i2 && c2();
          }).catch((e5) => {
            u2.errMsg = e5.errMsg || e5.message, s5 < i2 && c2();
          });
        }
      });
    }(e3, t4, 5, o3));
  }
  t2.initChooseAndUploadFile = function(e3) {
    return function(t3 = { type: "all" }) {
      return t3.type === "image" ? r2(e3, function(e4) {
        const { count: t4, sizeType: n3, sourceType: r3 = ["album", "camera"], extension: i2 } = e4;
        return new Promise((e5, a2) => {
          index.chooseImage({ count: t4, sizeType: n3, sourceType: r3, extension: i2, success(t5) {
            e5(o2(t5, "image"));
          }, fail(e6) {
            a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
          } });
        });
      }(t3), t3) : t3.type === "video" ? r2(e3, function(e4) {
        const { camera: t4, compressed: n3, maxDuration: r3, sourceType: i2 = ["album", "camera"], extension: a2 } = e4;
        return new Promise((e5, c2) => {
          index.chooseVideo({ camera: t4, compressed: n3, maxDuration: r3, sourceType: i2, extension: a2, success(t5) {
            const { tempFilePath: n4, duration: s3, size: r4, height: i3, width: a3 } = t5;
            e5(o2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: r4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: i3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
          }, fail(e6) {
            c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
          } });
        });
      }(t3), t3) : r2(e3, function(e4) {
        const { count: t4, extension: n3 } = e4;
        return new Promise((e5, r3) => {
          let i2 = index.chooseFile;
          if (typeof wx != "undefined" && typeof wx.chooseMessageFile == "function" && (i2 = wx.chooseMessageFile), typeof i2 != "function")
            return r3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
          i2({ type: "all", count: t4, extension: n3, success(t5) {
            e5(o2(t5));
          }, fail(e6) {
            r3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
          } });
        });
      }(t3), t3);
    };
  };
}), an = n(rn);
const cn = "manual";
function un(e2) {
  return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
    this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
      var e3 = [];
      return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
        e3.push(this[t2]);
      }), e3;
    }, (e3, t2) => {
      if (this.loadtime === cn)
        return;
      let n2 = false;
      const s2 = [];
      for (let o2 = 2; o2 < e3.length; o2++)
        e3[o2] !== t2[o2] && (s2.push(e3[o2]), n2 = true);
      e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
    });
  }, methods: { onMixinDatacomPropsChange(e3, t2) {
  }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
    this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
      this.mixinDatacomLoading = false;
      const { data: s2, count: o2 } = n3.result;
      this.getcount && (this.mixinDatacomPage.count = o2), this.mixinDatacomHasMore = s2.length < this.pageSize;
      const r2 = e3 ? s2.length ? s2[0] : void 0 : s2;
      this.mixinDatacomResData = r2, t2 && t2(r2);
    }).catch((e4) => {
      this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, n2 && n2(e4);
    }));
  }, mixinDatacomGet(t2 = {}) {
    let n2 = e2.database(this.spaceInfo);
    const s2 = t2.action || this.action;
    s2 && (n2 = n2.action(s2));
    const o2 = t2.collection || this.collection;
    n2 = Array.isArray(o2) ? n2.collection(...o2) : n2.collection(o2);
    const r2 = t2.where || this.where;
    r2 && Object.keys(r2).length && (n2 = n2.where(r2));
    const i2 = t2.field || this.field;
    i2 && (n2 = n2.field(i2));
    const a2 = t2.foreignKey || this.foreignKey;
    a2 && (n2 = n2.foreignKey(a2));
    const c2 = t2.groupby || this.groupby;
    c2 && (n2 = n2.groupBy(c2));
    const u2 = t2.groupField || this.groupField;
    u2 && (n2 = n2.groupField(u2));
    (t2.distinct !== void 0 ? t2.distinct : this.distinct) === true && (n2 = n2.distinct());
    const l2 = t2.orderby || this.orderby;
    l2 && (n2 = n2.orderBy(l2));
    const h2 = t2.pageCurrent !== void 0 ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = t2.pageSize !== void 0 ? t2.pageSize : this.mixinDatacomPage.size, f2 = t2.getcount !== void 0 ? t2.getcount : this.getcount, g2 = t2.gettree !== void 0 ? t2.gettree : this.gettree, p2 = t2.gettreepath !== void 0 ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y = { limitLevel: t2.limitlevel !== void 0 ? t2.limitlevel : this.limitlevel, startWith: t2.startwith !== void 0 ? t2.startwith : this.startwith };
    return g2 && (m2.getTree = y), p2 && (m2.getTreePath = y), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
  } } };
}
function ln(e2) {
  return function(t2, n2 = {}) {
    n2 = function(e3, t3 = {}) {
      return e3.customUI = t3.customUI || e3.customUI, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), typeof t3.secretMethods == "object" && (e3.secretMethods = t3.secretMethods), e3;
    }({ customUI: false, loadingOptions: { title: "\u52A0\u8F7D\u4E2D...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
    const { customUI: s2, loadingOptions: o2, errorOptions: r2 } = n2, i2 = !s2;
    return new Proxy({}, { get: (s3, c2) => function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
      return async function(...s4) {
        const o3 = n3 ? n3({ params: s4 }) : {};
        let r3, i3;
        try {
          return await A(I(t3, "invoke"), __spreadValues({}, o3)), r3 = await e3(...s4), await A(I(t3, "success"), __spreadProps(__spreadValues({}, o3), { result: r3 })), r3;
        } catch (e4) {
          throw i3 = e4, await A(I(t3, "fail"), __spreadProps(__spreadValues({}, o3), { error: i3 })), i3;
        } finally {
          await A(I(t3, "complete"), i3 ? __spreadProps(__spreadValues({}, o3), { error: i3 }) : __spreadProps(__spreadValues({}, o3), { result: r3 }));
        }
      };
    }({ fn: async function s4(...u2) {
      let l2;
      i2 && index.showLoading({ title: o2.title, mask: o2.mask });
      const h2 = { name: t2, type: a, data: { method: c2, params: u2 } };
      typeof n2.secretMethods == "object" && function(e3, t3) {
        const n3 = t3.data.method, s5 = e3.secretMethods[n3];
        s5 && (t3.secret = s5);
      }(n2, h2);
      try {
        l2 = await e2.callFunction(h2);
      } catch (e3) {
        l2 = { result: e3 };
      }
      const { errCode: d2, errMsg: f2, newToken: g2 } = l2.result || {};
      if (i2 && index.hideLoading(), g2 && g2.token && g2.tokenExpired && (at(g2), F(R, __spreadValues({}, g2))), d2) {
        if (i2)
          if (r2.type === "toast")
            index.showToast({ title: f2, icon: "none" });
          else {
            if (r2.type !== "modal")
              throw new Error(`Invalid errorOptions.type: ${r2.type}`);
            {
              const { confirm: e4 } = await async function({ title: e5, content: t3, showCancel: n3, cancelText: s5, confirmText: o3 } = {}) {
                return new Promise((r3, i3) => {
                  index.showModal({ title: e5, content: t3, showCancel: n3, cancelText: s5, confirmText: o3, success(e6) {
                    r3(e6);
                  }, fail() {
                    r3({ confirm: false, cancel: true });
                  } });
                });
              }({ title: "\u63D0\u793A", content: f2, showCancel: r2.retry, cancelText: "\u53D6\u6D88", confirmText: r2.retry ? "\u91CD\u8BD5" : "\u786E\u5B9A" });
              if (r2.retry && e4)
                return s4(...u2);
            }
          }
        const e3 = new B({ code: d2, message: f2, requestId: l2.requestId });
        throw e3.detail = l2.result, F(C, { type: L, content: e3 }), e3;
      }
      return F(C, { type: L, content: l2.result }), l2.result;
    }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
      return { objectName: t2, methodName: c2, params: e3 };
    } }) });
  };
}
async function hn(e2, t2) {
  const n2 = `http://${e2}:${t2}/system/ping`;
  try {
    const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
      V.request(__spreadProps(__spreadValues({}, s2), { success(t4) {
        e4(t4);
      }, fail(e5) {
        t3(e5);
      } }));
    }));
    return !(!e3.data || e3.data.code !== 0);
  } catch (e3) {
    return false;
  }
  var s2;
}
function dn(e2) {
  if (e2.initUniCloudStatus && e2.initUniCloudStatus !== "rejected")
    return;
  let t2 = Promise.resolve();
  var n2;
  n2 = 1, t2 = new Promise((e3, t3) => {
    setTimeout(() => {
      e3();
    }, n2);
  }), e2.isReady = false, e2.isDefault = false;
  const s2 = e2.auth();
  e2.initUniCloudStatus = "pending", e2.initUniCloud = t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
    if (g === "app") {
      const { osName: e3, osVersion: t3 } = index.getSystemInfoSync();
      e3 === "ios" && function(e4) {
        if (!e4 || typeof e4 != "string")
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14\u53CA\u4EE5\u4E0A\u7248\u672C\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u9700\u8981\u5141\u8BB8\u5BA2\u6237\u7AEF\u67E5\u627E\u5E76\u8FDE\u63A5\u5230\u672C\u5730\u7F51\u7EDC\u4E0A\u7684\u8BBE\u5907\uFF08\u4EC5\u5F00\u53D1\u6A21\u5F0F\u751F\u6548\uFF0C\u53D1\u884C\u6A21\u5F0F\u4F1A\u8FDE\u63A5uniCloud\u4E91\u7AEF\u670D\u52A1\uFF09");
    }
    if (e2.__dev__.debugInfo) {
      const { address: t3, servePort: n3 } = e2.__dev__.debugInfo;
      return async function(e3, t4) {
        let n4;
        for (let s3 = 0; s3 < e3.length; s3++) {
          const o2 = e3[s3];
          if (await hn(o2, t4)) {
            n4 = o2;
            break;
          }
        }
        return { address: n4, port: t4 };
      }(t3, n3);
    }
  }).then(({ address: t3, port: n3 } = {}) => {
    const s3 = console[g === "app" ? "error" : "warn"];
    if (t3)
      e2.__dev__.localAddress = t3, e2.__dev__.localPort = n3;
    else if (e2.__dev__.debugInfo) {
      let t4 = "";
      e2.__dev__.debugInfo.initialLaunchType === "remote" ? (e2.__dev__.debugInfo.forceRemote = true, t4 = "\u5F53\u524D\u5BA2\u6237\u7AEF\u548CHBuilderX\u4E0D\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF08\u6216\u5176\u4ED6\u7F51\u7EDC\u539F\u56E0\u65E0\u6CD5\u8FDE\u63A5HBuilderX\uFF09\uFF0CuniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u4E0D\u5BF9\u5F53\u524D\u5BA2\u6237\u7AEF\u751F\u6548\u3002\n- \u5982\u679C\u4E0D\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u76F4\u63A5\u5FFD\u7565\u6B64\u4FE1\u606F\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs") : t4 = "\u65E0\u6CD5\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u5BA2\u6237\u7AEF\u662F\u5426\u4E0E\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs", g === "web" && (t4 += "\n- \u90E8\u5206\u6D4F\u89C8\u5668\u5F00\u542F\u8282\u6D41\u6A21\u5F0F\u4E4B\u540E\u8BBF\u95EE\u672C\u5730\u5730\u5740\u53D7\u9650\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u542F\u7528\u4E86\u8282\u6D41\u6A21\u5F0F"), g.indexOf("mp-") === 0 && (t4 += "\n- \u5C0F\u7A0B\u5E8F\u4E2D\u5982\u4F55\u4F7F\u7528uniCloud\uFF0C\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), s3(t4);
    }
  }).then(() => {
    ct(), e2.isReady = true, e2.initUniCloudStatus = "fulfilled";
  }).catch((t3) => {
    console.error(t3), e2.initUniCloudStatus = "rejected";
  });
}
const fn = { tcb: ot, tencent: ot, aliyun: Q, private: lt };
let gn = new class {
  init(e2) {
    let t2 = {};
    const n2 = fn[e2.provider];
    if (!n2)
      throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
    t2 = n2.init(e2), t2.__dev__ = {}, t2.__dev__.debugLog = g === "web" && navigator.userAgent.indexOf("HBuilderX") > 0 || g === "app";
    const s2 = p;
    s2 && !s2.code && (t2.__dev__.debugInfo = s2), dn(t2), t2.reInit = function() {
      dn(this);
    }, _t(t2), function(e3) {
      const t3 = e3.uploadFile;
      e3.uploadFile = function(e4) {
        return t3.call(this, e4);
      };
    }(t2), Et(t2), function(e3) {
      e3.getCurrentUserInfo = on, e3.chooseAndUploadFile = an.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
        return un(e3);
      } }), e3.importObject = ln(e3);
    }(t2);
    return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
      if (!t2[e3])
        return;
      const n3 = t2[e3];
      t2[e3] = function() {
        return t2.reInit(), n3.apply(t2, Array.from(arguments));
      }, t2[e3] = K(t2[e3], e3).bind(t2);
    }), t2.init = this.init, t2;
  }
}();
(() => {
  const e2 = m;
  let t2 = {};
  if (e2 && e2.length === 1)
    t2 = e2[0], gn = gn.init(t2), gn.isDefault = true;
  else {
    const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
    let n2;
    n2 = e2 && e2.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e3) => {
      gn[e3] = function() {
        return console.error(n2), Promise.reject(new B({ code: "SYS_ERR", message: n2 }));
      };
    });
  }
  Object.assign(gn, { get mixinDatacom() {
    return un(gn);
  } }), en(gn), gn.addInterceptor = S, gn.removeInterceptor = P, gn.interceptObject = b, g === "web" && (window.uniCloud = gn);
})();
var pn = gn;
exports._export_sfc = _export_sfc;
exports.createSSRApp = createSSRApp;
exports.createStore = createStore;
exports.cryptoJs = cryptoJs;
exports.e = e;
exports.f = f$1;
exports.index = index;
exports.md5 = md5$1;
exports.n = n$1;
exports.o = o$1;
exports.p = p$1;
exports.pn = pn;
exports.r = r$1;
exports.reactive = reactive;
exports.resolveComponent = resolveComponent;
exports.s = s$1;
exports.sr = sr;
exports.t = t$1;
exports.toRefs = toRefs;
exports.w = w$1;
