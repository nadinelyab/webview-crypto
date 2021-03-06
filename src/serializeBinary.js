"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
var asyncSerialize_1 = require("./asyncSerialize");
var compat_1 = require("./compat");
function parse(text) {
    return __awaiter(this, void 0, void 0, function () {
        var deocodedText, objects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deocodedText = decodeURIComponent(text);
                    objects = JSON.parse(deocodedText);
                    return [4 /*yield*/, asyncSerialize_1.fromObjects(serializers(true), objects)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.parse = parse;
function stringify(value, waitForArrayBufferView) {
    if (waitForArrayBufferView === void 0) { waitForArrayBufferView = true; }
    return __awaiter(this, void 0, void 0, function () {
        var serialized, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncSerialize_1.toObjects(serializers(waitForArrayBufferView), value)];
                case 1:
                    serialized = _a.sent();
                    message = JSON.stringify(serialized);
                    return [2 /*return*/, encodeURIComponent(message)];
            }
        });
    });
}
exports.stringify = stringify;
function serializers(waitForArrayBufferView) {
    return [
        ArrayBufferSerializer,
        ArrayBufferViewSerializer(waitForArrayBufferView),
        CryptoKeySerializer
    ];
}
var ArrayBufferSerializer = {
    id: "ArrayBuffer",
    isType: function (o) { return o instanceof ArrayBuffer; },
    // from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
    // modified to use Int8Array so that we can hold odd number of bytes
    toObject: function (ab) { return __awaiter(_this, void 0, void 0, function () {
        var array, str, i;
        return __generator(this, function (_a) {
            array = new Int8Array(ab);
            str = "";
            for (i = 0; i < array.length; i++) {
                str += String.fromCharCode(array[i]);
            }
            return [2 /*return*/, str];
        });
    }); },
    fromObject: function (data) { return __awaiter(_this, void 0, void 0, function () {
        var buf, bufView, i, strLen;
        return __generator(this, function (_a) {
            buf = new ArrayBuffer(data.length);
            bufView = new Int8Array(buf);
            for (i = 0, strLen = data.length; i < strLen; i++) {
                bufView[i] = data.charCodeAt(i);
            }
            return [2 /*return*/, buf];
        });
    }); }
};
function isArrayBufferViewWithPromise(obj) {
    return obj.hasOwnProperty("_promise");
}
// Normally we could just do `abv.constructor.name`, but in
// JavaScriptCore, this wont work for some weird reason.
// list from https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView
function arrayBufferViewName(abv) {
    if (abv instanceof Int8Array) {
        return "Int8Array";
    }
    if (abv instanceof Uint8Array) {
        return "Uint8Array";
    }
    if (abv instanceof Uint8ClampedArray) {
        return "Uint8ClampedArray";
    }
    if (abv instanceof Int16Array) {
        return "Int16Array";
    }
    if (abv instanceof Uint16Array) {
        return "Uint16Array";
    }
    if (abv instanceof Int32Array) {
        return "Int32Array";
    }
    if (abv instanceof Uint32Array) {
        return "Uint32Array";
    }
    if (abv instanceof Float32Array) {
        return "Float32Array";
    }
    if (abv instanceof Float64Array) {
        return "Float64Array";
    }
    if (abv instanceof DataView) {
        return "DataView";
    }
}
function ArrayBufferViewSerializer(waitForPromise) {
    var _this = this;
    return {
        id: "ArrayBufferView",
        isType: ArrayBuffer.isView,
        toObject: function (abv) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!waitForPromise)
                            return [3 /*break*/, 2];
                        if (!isArrayBufferViewWithPromise(abv))
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, abv._promise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            name: arrayBufferViewName(abv),
                            buffer: abv.buffer
                        }];
                }
            });
        }); },
        fromObject: function (abvs) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, eval("new " + abvs.name + "(abvs.buffer)")];
            });
        }); }
    };
}
function hasData(ck) {
    return ck._import !== undefined;
}
var CryptoKeySerializer = {
    id: "CryptoKey",
    isType: function (o) {
        var localStr = o.toLocaleString();
        // can't use CryptoKey or constructor on WebView iOS
        var isCryptoKey = localStr === "[object CryptoKey]" || localStr === "[object Key]";
        var isCryptoKeyWithData = o._import && !o.serialized;
        return isCryptoKey || isCryptoKeyWithData;
    },
    toObject: function (ck) { return __awaiter(_this, void 0, void 0, function () {
        var jwk;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // if we already have the import serialized, just return that
                    if (hasData(ck)) {
                        return [2 /*return*/, {
                                serialized: true,
                                _import: ck._import,
                                type: ck.type,
                                extractable: ck.extractable,
                                algorithm: ck.algorithm,
                                usages: ck.usages
                            }];
                    }
                    return [4 /*yield*/, compat_1.subtle().exportKey("jwk", ck)];
                case 1:
                    jwk = _a.sent();
                    return [2 /*return*/, {
                            _import: {
                                format: "jwk",
                                keyData: jwk
                            },
                            serialized: true,
                            algorithm: ck.algorithm,
                            extractable: ck.extractable,
                            usages: ck.usages,
                            type: ck.type
                        }];
            }
        });
    }); },
    fromObject: function (cks) { return __awaiter(_this, void 0, void 0, function () {
        var newCks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // if we don't have access to to a real crypto implementation, just return
                    // the serialized crypto key
                    if (crypto.fake) {
                        newCks = __assign({}, cks);
                        delete newCks.serialized;
                        return [2 /*return*/, newCks];
                    }
                    return [4 /*yield*/, compat_1.subtle().importKey(cks._import.format, cks._import.keyData, cks.algorithm, cks.extractable, cks.usages)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }
};
//# sourceMappingURL=serializeBinary.js.map