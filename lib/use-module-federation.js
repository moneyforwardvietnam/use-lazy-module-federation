"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModuleFederation = void 0;
var react_1 = require("react");
var componentCache = new Map();
var useModuleFederation = function (remoteUrl, scope, module) {
    var key = "".concat(remoteUrl, "-").concat(scope, "-").concat(module);
    var _a = (0, react_1.useState)(null), Component = _a[0], setComponent = _a[1];
    var _b = useDynamicScript(remoteUrl), ready = _b.ready, errorLoading = _b.errorLoading;
    (0, react_1.useEffect)(function () {
        if (Component)
            setComponent(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]); // Only recalculate when key changes
    (0, react_1.useEffect)(function () {
        if (ready && !Component) {
            var Comp = (0, react_1.lazy)(loadComponent(scope, module));
            componentCache.set(key, Comp);
            setComponent(Comp);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Component, ready, key]); // key includes all dependencies (scope/module)
    return { errorLoading: errorLoading, Component: Component };
};
exports.useModuleFederation = useModuleFederation;
var urlCache = new Set();
var useDynamicScript = function (url) {
    var _a = (0, react_1.useState)(false), ready = _a[0], setReady = _a[1];
    var _b = (0, react_1.useState)(false), errorLoading = _b[0], setErrorLoading = _b[1];
    (0, react_1.useEffect)(function () {
        if (!url)
            return;
        if (urlCache.has(url)) {
            setReady(true);
            setErrorLoading(false);
            return;
        }
        setReady(false);
        setErrorLoading(false);
        var element = document.createElement('script');
        element.src = url;
        element.type = 'text/javascript';
        element.async = true;
        element.onload = function () {
            urlCache.add(url);
            setReady(true);
        };
        element.onerror = function () {
            setReady(false);
            setErrorLoading(true);
        };
        document.head.appendChild(element);
        return function () {
            urlCache.delete(url);
            document.head.removeChild(element);
        };
    }, [url]);
    return {
        errorLoading: errorLoading,
        ready: ready,
    };
};
// @ts-ignore
function loadComponent(scope, module) {
    var _this = this;
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var container, factory, Module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // @ts-ignore
                return [4 /*yield*/, __webpack_init_sharing__('default')];
                case 1:
                    // @ts-ignore
                    _a.sent(); // Initializes the share scope. This fills it with known provided modules from this build and all remotes
                    container = window[scope];
                    // @ts-ignore
                    return [4 /*yield*/, container.init(__webpack_share_scopes__.default)];
                case 2:
                    // @ts-ignore
                    _a.sent(); // Initialize the container, it may provide shared modules
                    return [4 /*yield*/, window[scope].get(module)];
                case 3:
                    factory = _a.sent();
                    Module = factory();
                    return [2 /*return*/, Module];
            }
        });
    }); };
}
