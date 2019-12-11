(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('ngx-uploader', ['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['ngx-uploader'] = {}, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
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

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
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
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
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

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
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
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/interfaces.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function UploaderOptions() { }
    if (false) {
        /** @type {?} */
        UploaderOptions.prototype.concurrency;
        /** @type {?|undefined} */
        UploaderOptions.prototype.allowedContentTypes;
        /** @type {?|undefined} */
        UploaderOptions.prototype.maxUploads;
        /** @type {?|undefined} */
        UploaderOptions.prototype.maxFileSize;
    }
    /**
     * @record
     */
    function BlobFile() { }
    if (false) {
        /** @type {?} */
        BlobFile.prototype.name;
    }
    /** @enum {number} */
    var UploadStatus = {
        Queue: 0,
        Uploading: 1,
        Done: 2,
        Cancelled: 3,
    };
    UploadStatus[UploadStatus.Queue] = 'Queue';
    UploadStatus[UploadStatus.Uploading] = 'Uploading';
    UploadStatus[UploadStatus.Done] = 'Done';
    UploadStatus[UploadStatus.Cancelled] = 'Cancelled';
    /**
     * @record
     */
    function UploadProgress() { }
    if (false) {
        /** @type {?} */
        UploadProgress.prototype.status;
        /** @type {?|undefined} */
        UploadProgress.prototype.data;
    }
    /**
     * @record
     */
    function UploadFile() { }
    if (false) {
        /** @type {?} */
        UploadFile.prototype.id;
        /** @type {?} */
        UploadFile.prototype.fileIndex;
        /** @type {?} */
        UploadFile.prototype.lastModifiedDate;
        /** @type {?} */
        UploadFile.prototype.name;
        /** @type {?} */
        UploadFile.prototype.size;
        /** @type {?} */
        UploadFile.prototype.type;
        /** @type {?} */
        UploadFile.prototype.form;
        /** @type {?} */
        UploadFile.prototype.progress;
        /** @type {?|undefined} */
        UploadFile.prototype.response;
        /** @type {?|undefined} */
        UploadFile.prototype.responseStatus;
        /** @type {?|undefined} */
        UploadFile.prototype.sub;
        /** @type {?|undefined} */
        UploadFile.prototype.nativeFile;
        /** @type {?|undefined} */
        UploadFile.prototype.responseHeaders;
    }
    /**
     * @record
     */
    function UploadOutput() { }
    if (false) {
        /** @type {?} */
        UploadOutput.prototype.type;
        /** @type {?|undefined} */
        UploadOutput.prototype.file;
        /** @type {?|undefined} */
        UploadOutput.prototype.nativeFile;
    }
    /**
     * @record
     */
    function UploadInput() { }
    if (false) {
        /** @type {?} */
        UploadInput.prototype.type;
        /** @type {?|undefined} */
        UploadInput.prototype.url;
        /** @type {?|undefined} */
        UploadInput.prototype.method;
        /** @type {?|undefined} */
        UploadInput.prototype.id;
        /** @type {?|undefined} */
        UploadInput.prototype.fieldName;
        /** @type {?|undefined} */
        UploadInput.prototype.fileIndex;
        /** @type {?|undefined} */
        UploadInput.prototype.file;
        /** @type {?|undefined} */
        UploadInput.prototype.data;
        /** @type {?|undefined} */
        UploadInput.prototype.headers;
        /** @type {?|undefined} */
        UploadInput.prototype.includeWebKitFormBoundary;
        /** @type {?|undefined} */
        UploadInput.prototype.withCredentials;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/ngx-uploader.class.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @param {?} bytes
     * @return {?}
     */
    function humanizeBytes(bytes) {
        if (bytes === 0) {
            return '0 Byte';
        }
        /** @type {?} */
        var k = 1024;
        /** @type {?} */
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        /** @type {?} */
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    var NgUploaderService = /** @class */ (function () {
        function NgUploaderService(concurrency, contentTypes, maxUploads, maxFileSize) {
            var _this = this;
            if (concurrency === void 0) { concurrency = Number.POSITIVE_INFINITY; }
            if (contentTypes === void 0) { contentTypes = ['*']; }
            if (maxUploads === void 0) { maxUploads = Number.POSITIVE_INFINITY; }
            if (maxFileSize === void 0) { maxFileSize = Number.POSITIVE_INFINITY; }
            this.queue = [];
            this.serviceEvents = new core.EventEmitter();
            this.uploadScheduler = new rxjs.Subject();
            this.subs = [];
            this.contentTypes = contentTypes;
            this.maxUploads = maxUploads;
            this.maxFileSize = maxFileSize;
            this.uploadScheduler
                .pipe(operators.mergeMap((/**
             * @param {?} upload
             * @return {?}
             */
            function (upload) { return _this.startUpload(upload); }), concurrency))
                .subscribe((/**
             * @param {?} uploadOutput
             * @return {?}
             */
            function (uploadOutput) { return _this.serviceEvents.emit(uploadOutput); }));
        }
        /**
         * @param {?} incomingFiles
         * @return {?}
         */
        NgUploaderService.prototype.handleFiles = /**
         * @param {?} incomingFiles
         * @return {?}
         */
        function (incomingFiles) {
            var _a;
            var _this = this;
            /** @type {?} */
            var allowedIncomingFiles = [].reduce.call(incomingFiles, (/**
             * @param {?} acc
             * @param {?} checkFile
             * @param {?} i
             * @return {?}
             */
            function (acc, checkFile, i) {
                /** @type {?} */
                var futureQueueLength = acc.length + _this.queue.length + 1;
                if (_this.isContentTypeAllowed(checkFile.type) && futureQueueLength <= _this.maxUploads && _this.isFileSizeAllowed(checkFile.size)) {
                    acc = acc.concat(checkFile);
                }
                else {
                    /** @type {?} */
                    var rejectedFile = _this.makeUploadFile(checkFile, i);
                    _this.serviceEvents.emit({ type: 'rejected', file: rejectedFile });
                }
                return acc;
            }), []);
            (_a = this.queue).push.apply(_a, __spread([].map.call(allowedIncomingFiles, (/**
             * @param {?} file
             * @param {?} i
             * @return {?}
             */
            function (file, i) {
                /** @type {?} */
                var uploadFile = _this.makeUploadFile(file, i);
                _this.serviceEvents.emit({ type: 'addedToQueue', file: uploadFile });
                return uploadFile;
            }))));
            this.serviceEvents.emit({ type: 'allAddedToQueue' });
        };
        /**
         * @param {?} input
         * @return {?}
         */
        NgUploaderService.prototype.initInputEvents = /**
         * @param {?} input
         * @return {?}
         */
        function (input) {
            var _this = this;
            return input.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                switch (event.type) {
                    case 'uploadFile':
                        /** @type {?} */
                        var uploadFileIndex = _this.queue.findIndex((/**
                         * @param {?} file
                         * @return {?}
                         */
                        function (file) { return file === event.file; }));
                        if (uploadFileIndex !== -1 && event.file) {
                            _this.uploadScheduler.next({ file: _this.queue[uploadFileIndex], event: event });
                        }
                        break;
                    case 'uploadAll':
                        /** @type {?} */
                        var files = _this.queue.filter((/**
                         * @param {?} file
                         * @return {?}
                         */
                        function (file) { return file.progress.status === UploadStatus.Queue; }));
                        files.forEach((/**
                         * @param {?} file
                         * @return {?}
                         */
                        function (file) { return _this.uploadScheduler.next({ file: file, event: event }); }));
                        break;
                    case 'cancel':
                        /** @type {?} */
                        var id_1 = event.id || null;
                        if (!id_1) {
                            return;
                        }
                        /** @type {?} */
                        var subs = _this.subs.filter((/**
                         * @param {?} sub
                         * @return {?}
                         */
                        function (sub) { return sub.id === id_1; }));
                        subs.forEach((/**
                         * @param {?} sub
                         * @return {?}
                         */
                        function (sub) {
                            if (sub.sub) {
                                sub.sub.unsubscribe();
                                /** @type {?} */
                                var fileIndex = _this.queue.findIndex((/**
                                 * @param {?} file
                                 * @return {?}
                                 */
                                function (file) { return file.id === id_1; }));
                                if (fileIndex !== -1) {
                                    _this.queue[fileIndex].progress.status = UploadStatus.Cancelled;
                                    _this.serviceEvents.emit({ type: 'cancelled', file: _this.queue[fileIndex] });
                                }
                            }
                        }));
                        break;
                    case 'cancelAll':
                        _this.subs.forEach((/**
                         * @param {?} sub
                         * @return {?}
                         */
                        function (sub) {
                            if (sub.sub) {
                                sub.sub.unsubscribe();
                            }
                            /** @type {?} */
                            var file = _this.queue.find((/**
                             * @param {?} uploadFile
                             * @return {?}
                             */
                            function (uploadFile) { return uploadFile.id === sub.id; }));
                            if (file) {
                                file.progress.status = UploadStatus.Cancelled;
                                _this.serviceEvents.emit({ type: 'cancelled', file: file });
                            }
                        }));
                        break;
                    case 'remove':
                        if (!event.id) {
                            return;
                        }
                        /** @type {?} */
                        var i = _this.queue.findIndex((/**
                         * @param {?} file
                         * @return {?}
                         */
                        function (file) { return file.id === event.id; }));
                        if (i !== -1) {
                            /** @type {?} */
                            var file = _this.queue[i];
                            _this.queue.splice(i, 1);
                            _this.serviceEvents.emit({ type: 'removed', file: file });
                        }
                        break;
                    case 'removeAll':
                        if (_this.queue.length) {
                            _this.queue = [];
                            _this.serviceEvents.emit({ type: 'removedAll' });
                        }
                        break;
                }
            }));
        };
        /**
         * @param {?} upload
         * @return {?}
         */
        NgUploaderService.prototype.startUpload = /**
         * @param {?} upload
         * @return {?}
         */
        function (upload) {
            var _this = this;
            return new rxjs.Observable((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                /** @type {?} */
                var sub = _this.uploadFile(upload.file, upload.event)
                    .pipe(operators.finalize((/**
                 * @return {?}
                 */
                function () {
                    if (!observer.closed) {
                        observer.complete();
                    }
                })))
                    .subscribe((/**
                 * @param {?} output
                 * @return {?}
                 */
                function (output) {
                    observer.next(output);
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    observer.error(err);
                    observer.complete();
                }), (/**
                 * @return {?}
                 */
                function () {
                    observer.complete();
                }));
                _this.subs.push({ id: upload.file.id, sub: sub });
            }));
        };
        /**
         * @param {?} file
         * @param {?} event
         * @return {?}
         */
        NgUploaderService.prototype.uploadFile = /**
         * @param {?} file
         * @param {?} event
         * @return {?}
         */
        function (file, event) {
            var _this = this;
            return new rxjs.Observable((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                /** @type {?} */
                var url = event.url || '';
                /** @type {?} */
                var method = event.method || 'POST';
                /** @type {?} */
                var data = event.data || {};
                /** @type {?} */
                var headers = event.headers || {};
                /** @type {?} */
                var xhr = new XMLHttpRequest();
                /** @type {?} */
                var time = new Date().getTime();
                /** @type {?} */
                var progressStartTime = (file.progress.data && file.progress.data.startTime) || time;
                /** @type {?} */
                var speed = 0;
                /** @type {?} */
                var eta = null;
                xhr.upload.addEventListener('progress', (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    if (e.lengthComputable) {
                        /** @type {?} */
                        var percentage = Math.round((e.loaded * 100) / e.total);
                        /** @type {?} */
                        var diff = new Date().getTime() - time;
                        speed = Math.round(e.loaded / diff * 1000);
                        progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                        eta = Math.ceil((e.total - e.loaded) / speed);
                        file.progress = {
                            status: UploadStatus.Uploading,
                            data: {
                                percentage: percentage,
                                speed: speed,
                                speedHuman: humanizeBytes(speed) + "/s",
                                startTime: progressStartTime,
                                endTime: null,
                                eta: eta,
                                etaHuman: _this.secondsToHuman(eta)
                            }
                        };
                        observer.next({ type: 'uploading', file: file });
                    }
                }), false);
                xhr.upload.addEventListener('error', (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    observer.error(e);
                    observer.complete();
                }));
                xhr.onreadystatechange = (/**
                 * @return {?}
                 */
                function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        /** @type {?} */
                        var speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                        file.progress = {
                            status: UploadStatus.Done,
                            data: {
                                percentage: 100,
                                speed: speedAverage,
                                speedHuman: humanizeBytes(speedAverage) + "/s",
                                startTime: progressStartTime,
                                endTime: new Date().getTime(),
                                eta: eta,
                                etaHuman: _this.secondsToHuman(eta || 0)
                            }
                        };
                        file.responseStatus = xhr.status;
                        try {
                            file.response = JSON.parse(xhr.response);
                        }
                        catch (e) {
                            file.response = xhr.response;
                        }
                        file.responseHeaders = _this.parseResponseHeaders(xhr.getAllResponseHeaders());
                        observer.next({ type: 'done', file: file });
                        observer.complete();
                    }
                });
                xhr.open(method, url, true);
                xhr.withCredentials = event.withCredentials ? true : false;
                try {
                    /** @type {?} */
                    var uploadFile_1 = (/** @type {?} */ (file.nativeFile));
                    /** @type {?} */
                    var uploadIndex = _this.queue.findIndex((/**
                     * @param {?} outFile
                     * @return {?}
                     */
                    function (outFile) { return outFile.nativeFile === uploadFile_1; }));
                    if (_this.queue[uploadIndex].progress.status === UploadStatus.Cancelled) {
                        observer.complete();
                    }
                    Object.keys(headers).forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) { return xhr.setRequestHeader(key, headers[key]); }));
                    /** @type {?} */
                    var bodyToSend = void 0;
                    if (event.includeWebKitFormBoundary !== false) {
                        Object.keys(data).forEach((/**
                         * @param {?} key
                         * @return {?}
                         */
                        function (key) { return file.form.append(key, data[key]); }));
                        file.form.append(event.fieldName || 'file', uploadFile_1, uploadFile_1.name);
                        bodyToSend = file.form;
                    }
                    else {
                        bodyToSend = uploadFile_1;
                    }
                    _this.serviceEvents.emit({ type: 'start', file: file });
                    xhr.send(bodyToSend);
                }
                catch (e) {
                    observer.complete();
                }
                return (/**
                 * @return {?}
                 */
                function () {
                    xhr.abort();
                });
            }));
        };
        /**
         * @param {?} sec
         * @return {?}
         */
        NgUploaderService.prototype.secondsToHuman = /**
         * @param {?} sec
         * @return {?}
         */
        function (sec) {
            return new Date(sec * 1000).toISOString().substr(11, 8);
        };
        /**
         * @return {?}
         */
        NgUploaderService.prototype.generateId = /**
         * @return {?}
         */
        function () {
            return Math.random().toString(36).substring(7);
        };
        /**
         * @param {?} contentTypes
         * @return {?}
         */
        NgUploaderService.prototype.setContentTypes = /**
         * @param {?} contentTypes
         * @return {?}
         */
        function (contentTypes) {
            if (typeof contentTypes !== 'undefined' && contentTypes instanceof Array) {
                if (contentTypes.find((/**
                 * @param {?} type
                 * @return {?}
                 */
                function (type) { return type === '*'; })) !== undefined) {
                    this.contentTypes = ['*'];
                }
                else {
                    this.contentTypes = contentTypes;
                }
                return;
            }
            this.contentTypes = ['*'];
        };
        /**
         * @return {?}
         */
        NgUploaderService.prototype.allContentTypesAllowed = /**
         * @return {?}
         */
        function () {
            return this.contentTypes.find((/**
             * @param {?} type
             * @return {?}
             */
            function (type) { return type === '*'; })) !== undefined;
        };
        /**
         * @param {?} mimetype
         * @return {?}
         */
        NgUploaderService.prototype.isContentTypeAllowed = /**
         * @param {?} mimetype
         * @return {?}
         */
        function (mimetype) {
            if (this.allContentTypesAllowed()) {
                return true;
            }
            return this.contentTypes.find((/**
             * @param {?} type
             * @return {?}
             */
            function (type) { return type === mimetype; })) !== undefined;
        };
        /**
         * @param {?} fileSize
         * @return {?}
         */
        NgUploaderService.prototype.isFileSizeAllowed = /**
         * @param {?} fileSize
         * @return {?}
         */
        function (fileSize) {
            if (!this.maxFileSize) {
                return true;
            }
            return fileSize <= this.maxFileSize;
        };
        /**
         * @param {?} file
         * @param {?} index
         * @return {?}
         */
        NgUploaderService.prototype.makeUploadFile = /**
         * @param {?} file
         * @param {?} index
         * @return {?}
         */
        function (file, index) {
            return {
                fileIndex: index,
                id: this.generateId(),
                name: file.name,
                size: file.size,
                type: file.type,
                form: new FormData(),
                progress: {
                    status: UploadStatus.Queue,
                    data: {
                        percentage: 0,
                        speed: 0,
                        speedHuman: humanizeBytes(0) + "/s",
                        startTime: null,
                        endTime: null,
                        eta: null,
                        etaHuman: null
                    }
                },
                lastModifiedDate: new Date(file.lastModified),
                sub: undefined,
                nativeFile: file
            };
        };
        /**
         * @private
         * @param {?} httpHeaders
         * @return {?}
         */
        NgUploaderService.prototype.parseResponseHeaders = /**
         * @private
         * @param {?} httpHeaders
         * @return {?}
         */
        function (httpHeaders) {
            if (!httpHeaders) {
                return;
            }
            return httpHeaders.split('\n')
                .map((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x.split(/: */, 2); }))
                .filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x[0]; }))
                .reduce((/**
             * @param {?} acc
             * @param {?} x
             * @return {?}
             */
            function (acc, x) {
                acc[x[0]] = x[1];
                return acc;
            }), {});
        };
        return NgUploaderService;
    }());
    if (false) {
        /** @type {?} */
        NgUploaderService.prototype.queue;
        /** @type {?} */
        NgUploaderService.prototype.serviceEvents;
        /** @type {?} */
        NgUploaderService.prototype.uploadScheduler;
        /** @type {?} */
        NgUploaderService.prototype.subs;
        /** @type {?} */
        NgUploaderService.prototype.contentTypes;
        /** @type {?} */
        NgUploaderService.prototype.maxUploads;
        /** @type {?} */
        NgUploaderService.prototype.maxFileSize;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/ng-file-drop.directive.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgFileDropDirective = /** @class */ (function () {
        function NgFileDropDirective(elementRef) {
            this.elementRef = elementRef;
            this.stopEvent = (/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            this.uploadOutput = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        NgFileDropDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this._sub = [];
            /** @type {?} */
            var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
            /** @type {?} */
            var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
            /** @type {?} */
            var maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
            /** @type {?} */
            var maxFileSize = this.options && this.options.maxFileSize || Number.POSITIVE_INFINITY;
            this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads, maxFileSize);
            this.el = this.elementRef.nativeElement;
            this._sub.push(this.upload.serviceEvents.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                _this.uploadOutput.emit(event);
            })));
            if (this.uploadInput instanceof core.EventEmitter) {
                this._sub.push(this.upload.initInputEvents(this.uploadInput));
            }
            this.el.addEventListener('drop', this.stopEvent, false);
            this.el.addEventListener('dragenter', this.stopEvent, false);
            this.el.addEventListener('dragover', this.stopEvent, false);
        };
        /**
         * @return {?}
         */
        NgFileDropDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            this._sub.forEach((/**
             * @param {?} sub
             * @return {?}
             */
            function (sub) { return sub.unsubscribe(); }));
        };
        /**
         * @param {?} e
         * @return {?}
         */
        NgFileDropDirective.prototype.onDrop = /**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            e.stopPropagation();
            e.preventDefault();
            /** @type {?} */
            var event = { type: 'drop' };
            this.uploadOutput.emit(event);
            this.upload.handleFiles(e.dataTransfer.files);
        };
        /**
         * @param {?} e
         * @return {?}
         */
        NgFileDropDirective.prototype.onDragOver = /**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (!e) {
                return;
            }
            /** @type {?} */
            var event = { type: 'dragOver' };
            this.uploadOutput.emit(event);
        };
        /**
         * @param {?} e
         * @return {?}
         */
        NgFileDropDirective.prototype.onDragLeave = /**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (!e) {
                return;
            }
            /** @type {?} */
            var event = { type: 'dragOut' };
            this.uploadOutput.emit(event);
        };
        NgFileDropDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngFileDrop]'
                    },] }
        ];
        /** @nocollapse */
        NgFileDropDirective.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        NgFileDropDirective.propDecorators = {
            options: [{ type: core.Input }],
            uploadInput: [{ type: core.Input }],
            uploadOutput: [{ type: core.Output }],
            onDrop: [{ type: core.HostListener, args: ['drop', ['$event'],] }],
            onDragOver: [{ type: core.HostListener, args: ['dragover', ['$event'],] }],
            onDragLeave: [{ type: core.HostListener, args: ['dragleave', ['$event'],] }]
        };
        return NgFileDropDirective;
    }());
    if (false) {
        /** @type {?} */
        NgFileDropDirective.prototype.options;
        /** @type {?} */
        NgFileDropDirective.prototype.uploadInput;
        /** @type {?} */
        NgFileDropDirective.prototype.uploadOutput;
        /** @type {?} */
        NgFileDropDirective.prototype.upload;
        /** @type {?} */
        NgFileDropDirective.prototype.el;
        /** @type {?} */
        NgFileDropDirective.prototype._sub;
        /** @type {?} */
        NgFileDropDirective.prototype.stopEvent;
        /** @type {?} */
        NgFileDropDirective.prototype.elementRef;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/ng-file-select.directive.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgFileSelectDirective = /** @class */ (function () {
        function NgFileSelectDirective(elementRef) {
            var _this = this;
            this.elementRef = elementRef;
            this.fileListener = (/**
             * @return {?}
             */
            function () {
                if (_this.el.files) {
                    _this.upload.handleFiles(_this.el.files);
                }
            });
            this.uploadOutput = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        NgFileSelectDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this._sub = [];
            /** @type {?} */
            var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
            /** @type {?} */
            var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
            /** @type {?} */
            var maxUploads = this.options && this.options.maxUploads || Number.POSITIVE_INFINITY;
            /** @type {?} */
            var maxFileSize = this.options && this.options.maxFileSize || Number.POSITIVE_INFINITY;
            this.upload = new NgUploaderService(concurrency, allowedContentTypes, maxUploads, maxFileSize);
            this.el = this.elementRef.nativeElement;
            this.el.addEventListener('change', this.fileListener, false);
            this._sub.push(this.upload.serviceEvents.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                _this.uploadOutput.emit(event);
            })));
            if (this.uploadInput instanceof core.EventEmitter) {
                this._sub.push(this.upload.initInputEvents(this.uploadInput));
            }
        };
        /**
         * @return {?}
         */
        NgFileSelectDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            if (this.el) {
                this.el.removeEventListener('change', this.fileListener, false);
                this._sub.forEach((/**
                 * @param {?} sub
                 * @return {?}
                 */
                function (sub) { return sub.unsubscribe(); }));
            }
        };
        NgFileSelectDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngFileSelect]'
                    },] }
        ];
        /** @nocollapse */
        NgFileSelectDirective.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        NgFileSelectDirective.propDecorators = {
            options: [{ type: core.Input }],
            uploadInput: [{ type: core.Input }],
            uploadOutput: [{ type: core.Output }]
        };
        return NgFileSelectDirective;
    }());
    if (false) {
        /** @type {?} */
        NgFileSelectDirective.prototype.options;
        /** @type {?} */
        NgFileSelectDirective.prototype.uploadInput;
        /** @type {?} */
        NgFileSelectDirective.prototype.uploadOutput;
        /** @type {?} */
        NgFileSelectDirective.prototype.upload;
        /** @type {?} */
        NgFileSelectDirective.prototype.el;
        /** @type {?} */
        NgFileSelectDirective.prototype._sub;
        /** @type {?} */
        NgFileSelectDirective.prototype.fileListener;
        /** @type {?} */
        NgFileSelectDirective.prototype.elementRef;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/ngx-uploader.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxUploaderModule = /** @class */ (function () {
        function NgxUploaderModule() {
        }
        NgxUploaderModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [NgFileDropDirective, NgFileSelectDirective],
                        exports: [NgFileDropDirective, NgFileSelectDirective]
                    },] }
        ];
        return NgxUploaderModule;
    }());

    exports.NgFileDropDirective = NgFileDropDirective;
    exports.NgFileSelectDirective = NgFileSelectDirective;
    exports.NgUploaderService = NgUploaderService;
    exports.NgxUploaderModule = NgxUploaderModule;
    exports.UploadStatus = UploadStatus;
    exports.humanizeBytes = humanizeBytes;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-uploader.umd.js.map
