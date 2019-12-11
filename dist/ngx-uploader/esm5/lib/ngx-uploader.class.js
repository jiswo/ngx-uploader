/**
 * @fileoverview added by tsickle
 * Generated from: lib/ngx-uploader.class.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mergeMap, finalize } from 'rxjs/operators';
import { UploadStatus } from './interfaces';
/**
 * @param {?} bytes
 * @return {?}
 */
export function humanizeBytes(bytes) {
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
        this.serviceEvents = new EventEmitter();
        this.uploadScheduler = new Subject();
        this.subs = [];
        this.contentTypes = contentTypes;
        this.maxUploads = maxUploads;
        this.maxFileSize = maxFileSize;
        this.uploadScheduler
            .pipe(mergeMap((/**
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
        (_a = this.queue).push.apply(_a, tslib_1.__spread([].map.call(allowedIncomingFiles, (/**
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
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            /** @type {?} */
            var sub = _this.uploadFile(upload.file, upload.event)
                .pipe(finalize((/**
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
        return new Observable((/**
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
export { NgUploaderService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVwbG9hZGVyLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZGVyLyIsInNvdXJjZXMiOlsibGliL25neC11cGxvYWRlci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBeUMsWUFBWSxFQUFZLE1BQU0sY0FBYyxDQUFDOzs7OztBQUU3RixNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQWE7SUFDekMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQ2YsT0FBTyxRQUFRLENBQUM7S0FDakI7O1FBRUssQ0FBQyxHQUFHLElBQUk7O1FBQ1IsS0FBSyxHQUFhLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7O1FBQ3pELENBQUMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRCxPQUFPLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVEO0lBU0UsMkJBQ0UsV0FBOEMsRUFDOUMsWUFBOEIsRUFDOUIsVUFBNkMsRUFDN0MsV0FBOEM7UUFKaEQsaUJBbUJDO1FBbEJDLDRCQUFBLEVBQUEsY0FBc0IsTUFBTSxDQUFD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QUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFKLENBQUksRUFBQzthQUM3QixNQUFNOzs7OztRQUFDLFVBQUMsR0FBVyxFQUFFLENBQVc7WUFDL0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFyVUQsSUFxVUM7Ozs7SUFwVUMsa0NBQW9COztJQUNwQiwwQ0FBMEM7O0lBQzFDLDRDQUFtRTs7SUFDbkUsaUNBQTBDOztJQUMxQyx5Q0FBdUI7O0lBQ3ZCLHVDQUFtQjs7SUFDbkIsd0NBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtZXJnZU1hcCwgZmluYWxpemUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFVwbG9hZEZpbGUsIFVwbG9hZE91dHB1dCwgVXBsb2FkSW5wdXQsIFVwbG9hZFN0YXR1cywgQmxvYkZpbGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuaXplQnl0ZXMoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgaWYgKGJ5dGVzID09PSAwKSB7XHJcbiAgICByZXR1cm4gJzAgQnl0ZSc7XHJcbiAgfVxyXG5cclxuICBjb25zdCBrID0gMTAyNDtcclxuICBjb25zdCBzaXplczogc3RyaW5nW10gPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ107XHJcbiAgY29uc3QgaTogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XHJcblxyXG4gIHJldHVybiBwYXJzZUZsb2F0KChieXRlcyAvIE1hdGgucG93KGssIGkpKS50b0ZpeGVkKDIpKSArICcgJyArIHNpemVzW2ldO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmdVcGxvYWRlclNlcnZpY2Uge1xyXG4gIHF1ZXVlOiBVcGxvYWRGaWxlW107XHJcbiAgc2VydmljZUV2ZW50czogRXZlbnRFbWl0dGVyPFVwbG9hZE91dHB1dD47XHJcbiAgdXBsb2FkU2NoZWR1bGVyOiBTdWJqZWN0PHsgZmlsZTogVXBsb2FkRmlsZSwgZXZlbnQ6IFVwbG9hZElucHV0IH0+O1xyXG4gIHN1YnM6IHsgaWQ6IHN0cmluZywgc3ViOiBTdWJzY3JpcHRpb24gfVtdO1xyXG4gIGNvbnRlbnRUeXBlczogc3RyaW5nW107XHJcbiAgbWF4VXBsb2FkczogbnVtYmVyO1xyXG4gIG1heEZpbGVTaXplOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29uY3VycmVuY3k6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcclxuICAgIGNvbnRlbnRUeXBlczogc3RyaW5nW10gPSBbJyonXSxcclxuICAgIG1heFVwbG9hZHM6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcclxuICAgIG1heEZpbGVTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFlcclxuICApIHtcclxuICAgIHRoaXMucXVldWUgPSBbXTtcclxuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PigpO1xyXG4gICAgdGhpcy51cGxvYWRTY2hlZHVsZXIgPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgdGhpcy5zdWJzID0gW107XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IGNvbnRlbnRUeXBlcztcclxuICAgIHRoaXMubWF4VXBsb2FkcyA9IG1heFVwbG9hZHM7XHJcbiAgICB0aGlzLm1heEZpbGVTaXplID0gbWF4RmlsZVNpemU7XHJcblxyXG4gICAgdGhpcy51cGxvYWRTY2hlZHVsZXJcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWVyZ2VNYXAodXBsb2FkID0+IHRoaXMuc3RhcnRVcGxvYWQodXBsb2FkKSwgY29uY3VycmVuY3kpXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSh1cGxvYWRPdXRwdXQgPT4gdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQodXBsb2FkT3V0cHV0KSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlcyhpbmNvbWluZ0ZpbGVzOiBGaWxlTGlzdCk6IHZvaWQge1xyXG4gICAgY29uc3QgYWxsb3dlZEluY29taW5nRmlsZXM6IEZpbGVbXSA9IFtdLnJlZHVjZS5jYWxsKGluY29taW5nRmlsZXMsIChhY2M6IEZpbGVbXSwgY2hlY2tGaWxlOiBGaWxlLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgZnV0dXJlUXVldWVMZW5ndGggPSBhY2MubGVuZ3RoICsgdGhpcy5xdWV1ZS5sZW5ndGggKyAxO1xyXG4gICAgICBpZiAodGhpcy5pc0NvbnRlbnRUeXBlQWxsb3dlZChjaGVja0ZpbGUudHlwZSkgJiYgZnV0dXJlUXVldWVMZW5ndGggPD0gdGhpcy5tYXhVcGxvYWRzICYmIHRoaXMuaXNGaWxlU2l6ZUFsbG93ZWQoY2hlY2tGaWxlLnNpemUpKSB7XHJcbiAgICAgICAgYWNjID0gYWNjLmNvbmNhdChjaGVja0ZpbGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJlamVjdGVkRmlsZTogVXBsb2FkRmlsZSA9IHRoaXMubWFrZVVwbG9hZEZpbGUoY2hlY2tGaWxlLCBpKTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdyZWplY3RlZCcsIGZpbGU6IHJlamVjdGVkRmlsZSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICB0aGlzLnF1ZXVlLnB1c2goLi4uW10ubWFwLmNhbGwoYWxsb3dlZEluY29taW5nRmlsZXMsIChmaWxlOiBGaWxlLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgdXBsb2FkRmlsZTogVXBsb2FkRmlsZSA9IHRoaXMubWFrZVVwbG9hZEZpbGUoZmlsZSwgaSk7XHJcbiAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2FkZGVkVG9RdWV1ZScsIGZpbGU6IHVwbG9hZEZpbGUgfSk7XHJcbiAgICAgIHJldHVybiB1cGxvYWRGaWxlO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2FsbEFkZGVkVG9RdWV1ZScgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0SW5wdXRFdmVudHMoaW5wdXQ6IEV2ZW50RW1pdHRlcjxVcGxvYWRJbnB1dD4pOiBTdWJzY3JpcHRpb24ge1xyXG4gICAgcmV0dXJuIGlucHV0LnN1YnNjcmliZSgoZXZlbnQ6IFVwbG9hZElucHV0KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3VwbG9hZEZpbGUnOlxyXG4gICAgICAgICAgY29uc3QgdXBsb2FkRmlsZUluZGV4ID0gdGhpcy5xdWV1ZS5maW5kSW5kZXgoZmlsZSA9PiBmaWxlID09PSBldmVudC5maWxlKTtcclxuICAgICAgICAgIGlmICh1cGxvYWRGaWxlSW5kZXggIT09IC0xICYmIGV2ZW50LmZpbGUpIHtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRTY2hlZHVsZXIubmV4dCh7IGZpbGU6IHRoaXMucXVldWVbdXBsb2FkRmlsZUluZGV4XSwgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAndXBsb2FkQWxsJzpcclxuICAgICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5xdWV1ZS5maWx0ZXIoZmlsZSA9PiBmaWxlLnByb2dyZXNzLnN0YXR1cyA9PT0gVXBsb2FkU3RhdHVzLlF1ZXVlKTtcclxuICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB0aGlzLnVwbG9hZFNjaGVkdWxlci5uZXh0KHsgZmlsZTogZmlsZSwgZXZlbnQ6IGV2ZW50IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICBjb25zdCBpZCA9IGV2ZW50LmlkIHx8IG51bGw7XHJcbiAgICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YnMuZmlsdGVyKHN1YiA9PiBzdWIuaWQgPT09IGlkKTtcclxuICAgICAgICAgIHN1YnMuZm9yRWFjaChzdWIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3ViLnN1Yikge1xyXG4gICAgICAgICAgICAgIHN1Yi5zdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICBjb25zdCBmaWxlSW5kZXggPSB0aGlzLnF1ZXVlLmZpbmRJbmRleChmaWxlID0+IGZpbGUuaWQgPT09IGlkKTtcclxuICAgICAgICAgICAgICBpZiAoZmlsZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZVtmaWxlSW5kZXhdLnByb2dyZXNzLnN0YXR1cyA9IFVwbG9hZFN0YXR1cy5DYW5jZWxsZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdjYW5jZWxsZWQnLCBmaWxlOiB0aGlzLnF1ZXVlW2ZpbGVJbmRleF0gfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2NhbmNlbEFsbCc6XHJcbiAgICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3ViLnN1Yikge1xyXG4gICAgICAgICAgICAgIHN1Yi5zdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMucXVldWUuZmluZCh1cGxvYWRGaWxlID0+IHVwbG9hZEZpbGUuaWQgPT09IHN1Yi5pZCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcy5zdGF0dXMgPSBVcGxvYWRTdGF0dXMuQ2FuY2VsbGVkO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2NhbmNlbGxlZCcsIGZpbGU6IGZpbGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICAgIGlmICghZXZlbnQuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnF1ZXVlLmZpbmRJbmRleChmaWxlID0+IGZpbGUuaWQgPT09IGV2ZW50LmlkKTtcclxuICAgICAgICAgIGlmIChpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5xdWV1ZVtpXTtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ3JlbW92ZWQnLCBmaWxlOiBmaWxlIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmVtb3ZlQWxsJzpcclxuICAgICAgICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ3JlbW92ZWRBbGwnIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRVcGxvYWQodXBsb2FkOiB7IGZpbGU6IFVwbG9hZEZpbGUsIGV2ZW50OiBVcGxvYWRJbnB1dCB9KTogT2JzZXJ2YWJsZTxVcGxvYWRPdXRwdXQ+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMudXBsb2FkRmlsZSh1cGxvYWQuZmlsZSwgdXBsb2FkLmV2ZW50KVxyXG4gICAgICAgIC5waXBlKGZpbmFsaXplKCgpID0+IHtcclxuICAgICAgICAgIGlmICghb2JzZXJ2ZXIuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgLnN1YnNjcmliZShvdXRwdXQgPT4ge1xyXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChvdXRwdXQpO1xyXG4gICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zdWJzLnB1c2goeyBpZDogdXBsb2FkLmZpbGUuaWQsIHN1Yjogc3ViIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlKGZpbGU6IFVwbG9hZEZpbGUsIGV2ZW50OiBVcGxvYWRJbnB1dCk6IE9ic2VydmFibGU8VXBsb2FkT3V0cHV0PiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBldmVudC51cmwgfHwgJyc7XHJcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGV2ZW50Lm1ldGhvZCB8fCAnUE9TVCc7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhIHx8IHt9O1xyXG4gICAgICBjb25zdCBoZWFkZXJzID0gZXZlbnQuaGVhZGVycyB8fCB7fTtcclxuXHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICBjb25zdCB0aW1lOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgbGV0IHByb2dyZXNzU3RhcnRUaW1lOiBudW1iZXIgPSAoZmlsZS5wcm9ncmVzcy5kYXRhICYmIGZpbGUucHJvZ3Jlc3MuZGF0YS5zdGFydFRpbWUpIHx8IHRpbWU7XHJcbiAgICAgIGxldCBzcGVlZCA9IDA7XHJcbiAgICAgIGxldCBldGE6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChlOiBQcm9ncmVzc0V2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoKGUubG9hZGVkICogMTAwKSAvIGUudG90YWwpO1xyXG4gICAgICAgICAgY29uc3QgZGlmZiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGltZTtcclxuICAgICAgICAgIHNwZWVkID0gTWF0aC5yb3VuZChlLmxvYWRlZCAvIGRpZmYgKiAxMDAwKTtcclxuICAgICAgICAgIHByb2dyZXNzU3RhcnRUaW1lID0gKGZpbGUucHJvZ3Jlc3MuZGF0YSAmJiBmaWxlLnByb2dyZXNzLmRhdGEuc3RhcnRUaW1lKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgIGV0YSA9IE1hdGguY2VpbCgoZS50b3RhbCAtIGUubG9hZGVkKSAvIHNwZWVkKTtcclxuXHJcbiAgICAgICAgICBmaWxlLnByb2dyZXNzID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IFVwbG9hZFN0YXR1cy5VcGxvYWRpbmcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBwZXJjZW50YWdlOiBwZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgIHNwZWVkOiBzcGVlZCxcclxuICAgICAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKHNwZWVkKX0vc2AsXHJcbiAgICAgICAgICAgICAgc3RhcnRUaW1lOiBwcm9ncmVzc1N0YXJ0VGltZSxcclxuICAgICAgICAgICAgICBlbmRUaW1lOiBudWxsLFxyXG4gICAgICAgICAgICAgIGV0YTogZXRhLFxyXG4gICAgICAgICAgICAgIGV0YUh1bWFuOiB0aGlzLnNlY29uZHNUb0h1bWFuKGV0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHsgdHlwZTogJ3VwbG9hZGluZycsIGZpbGU6IGZpbGUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xyXG4gICAgICAgICAgY29uc3Qgc3BlZWRBdmVyYWdlID0gTWF0aC5yb3VuZChmaWxlLnNpemUgLyAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwcm9ncmVzc1N0YXJ0VGltZSkgKiAxMDAwKTtcclxuICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogVXBsb2FkU3RhdHVzLkRvbmUsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBwZXJjZW50YWdlOiAxMDAsXHJcbiAgICAgICAgICAgICAgc3BlZWQ6IHNwZWVkQXZlcmFnZSxcclxuICAgICAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKHNwZWVkQXZlcmFnZSl9L3NgLFxyXG4gICAgICAgICAgICAgIHN0YXJ0VGltZTogcHJvZ3Jlc3NTdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgZW5kVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgICAgZXRhOiBldGEsXHJcbiAgICAgICAgICAgICAgZXRhSHVtYW46IHRoaXMuc2Vjb25kc1RvSHVtYW4oZXRhIHx8IDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgZmlsZS5yZXNwb25zZVN0YXR1cyA9IHhoci5zdGF0dXM7XHJcblxyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZmlsZS5yZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgZmlsZS5yZXNwb25zZSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmaWxlLnJlc3BvbnNlSGVhZGVycyA9IHRoaXMucGFyc2VSZXNwb25zZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHsgdHlwZTogJ2RvbmUnLCBmaWxlOiBmaWxlIH0pO1xyXG5cclxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZXZlbnQud2l0aENyZWRlbnRpYWxzID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB1cGxvYWRGaWxlID0gPEJsb2JGaWxlPmZpbGUubmF0aXZlRmlsZTtcclxuICAgICAgICBjb25zdCB1cGxvYWRJbmRleCA9IHRoaXMucXVldWUuZmluZEluZGV4KG91dEZpbGUgPT4gb3V0RmlsZS5uYXRpdmVGaWxlID09PSB1cGxvYWRGaWxlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucXVldWVbdXBsb2FkSW5kZXhdLnByb2dyZXNzLnN0YXR1cyA9PT0gVXBsb2FkU3RhdHVzLkNhbmNlbGxlZCkge1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKSk7XHJcblxyXG4gICAgICAgIGxldCBib2R5VG9TZW5kOiBGb3JtRGF0YSB8IEJsb2JGaWxlO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuaW5jbHVkZVdlYktpdEZvcm1Cb3VuZGFyeSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IGZpbGUuZm9ybS5hcHBlbmQoa2V5LCBkYXRhW2tleV0pKTtcclxuICAgICAgICAgIGZpbGUuZm9ybS5hcHBlbmQoZXZlbnQuZmllbGROYW1lIHx8ICdmaWxlJywgdXBsb2FkRmlsZSwgdXBsb2FkRmlsZS5uYW1lKTtcclxuICAgICAgICAgIGJvZHlUb1NlbmQgPSBmaWxlLmZvcm07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJvZHlUb1NlbmQgPSB1cGxvYWRGaWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQoeyB0eXBlOiAnc3RhcnQnLCBmaWxlOiBmaWxlIH0pO1xyXG4gICAgICAgIHhoci5zZW5kKGJvZHlUb1NlbmQpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2Vjb25kc1RvSHVtYW4oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHNlYyAqIDEwMDApLnRvSVNPU3RyaW5nKCkuc3Vic3RyKDExLCA4KTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyk7XHJcbiAgfVxyXG5cclxuICBzZXRDb250ZW50VHlwZXMoY29udGVudFR5cGVzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgaWYgKHR5cGVvZiBjb250ZW50VHlwZXMgIT09ICd1bmRlZmluZWQnICYmIGNvbnRlbnRUeXBlcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGlmIChjb250ZW50VHlwZXMuZmluZCgodHlwZTogc3RyaW5nKSA9PiB0eXBlID09PSAnKicpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IFsnKiddO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGVudFR5cGVzID0gY29udGVudFR5cGVzO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuY29udGVudFR5cGVzID0gWycqJ107XHJcbiAgfVxyXG5cclxuICBhbGxDb250ZW50VHlwZXNBbGxvd2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLmZpbmQoKHR5cGU6IHN0cmluZykgPT4gdHlwZSA9PT0gJyonKSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgaXNDb250ZW50VHlwZUFsbG93ZWQobWltZXR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuYWxsQ29udGVudFR5cGVzQWxsb3dlZCgpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLmZpbmQoKHR5cGU6IHN0cmluZykgPT4gdHlwZSA9PT0gbWltZXR5cGUpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBpc0ZpbGVTaXplQWxsb3dlZChmaWxlU2l6ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMubWF4RmlsZVNpemUpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZVNpemUgPD0gdGhpcy5tYXhGaWxlU2l6ZTtcclxuICB9XHJcblxyXG4gIG1ha2VVcGxvYWRGaWxlKGZpbGU6IEZpbGUsIGluZGV4OiBudW1iZXIpOiBVcGxvYWRGaWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZpbGVJbmRleDogaW5kZXgsXHJcbiAgICAgIGlkOiB0aGlzLmdlbmVyYXRlSWQoKSxcclxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICBzaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIHR5cGU6IGZpbGUudHlwZSxcclxuICAgICAgZm9ybTogbmV3IEZvcm1EYXRhKCksXHJcbiAgICAgIHByb2dyZXNzOiB7XHJcbiAgICAgICAgc3RhdHVzOiBVcGxvYWRTdGF0dXMuUXVldWUsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcGVyY2VudGFnZTogMCxcclxuICAgICAgICAgIHNwZWVkOiAwLFxyXG4gICAgICAgICAgc3BlZWRIdW1hbjogYCR7aHVtYW5pemVCeXRlcygwKX0vc2AsXHJcbiAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXHJcbiAgICAgICAgICBlbmRUaW1lOiBudWxsLFxyXG4gICAgICAgICAgZXRhOiBudWxsLFxyXG4gICAgICAgICAgZXRhSHVtYW46IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RNb2RpZmllZERhdGU6IG5ldyBEYXRlKGZpbGUubGFzdE1vZGlmaWVkKSxcclxuICAgICAgc3ViOiB1bmRlZmluZWQsXHJcbiAgICAgIG5hdGl2ZUZpbGU6IGZpbGVcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlUmVzcG9uc2VIZWFkZXJzKGh0dHBIZWFkZXJzOiBzdHJpbmcpIHtcclxuICAgIGlmICghaHR0cEhlYWRlcnMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBodHRwSGVhZGVycy5zcGxpdCgnXFxuJylcclxuICAgICAgLm1hcCgoeDogc3RyaW5nKSA9PiB4LnNwbGl0KC86ICovLCAyKSlcclxuICAgICAgLmZpbHRlcigoeDogc3RyaW5nW10pID0+IHhbMF0pXHJcbiAgICAgIC5yZWR1Y2UoKGFjYzogT2JqZWN0LCB4OiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgICAgIGFjY1t4WzBdXSA9IHhbMV07XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgfSwge30pO1xyXG4gIH1cclxufVxyXG4iXX0=