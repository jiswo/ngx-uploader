/**
 * @fileoverview added by tsickle
 * Generated from: lib/ngx-uploader.class.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    const k = 1024;
    /** @type {?} */
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    /** @type {?} */
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
export class NgUploaderService {
    /**
     * @param {?=} concurrency
     * @param {?=} contentTypes
     * @param {?=} maxUploads
     * @param {?=} maxFileSize
     */
    constructor(concurrency = Number.POSITIVE_INFINITY, contentTypes = ['*'], maxUploads = Number.POSITIVE_INFINITY, maxFileSize = Number.POSITIVE_INFINITY) {
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
        upload => this.startUpload(upload)), concurrency))
            .subscribe((/**
         * @param {?} uploadOutput
         * @return {?}
         */
        uploadOutput => this.serviceEvents.emit(uploadOutput)));
    }
    /**
     * @param {?} incomingFiles
     * @return {?}
     */
    handleFiles(incomingFiles) {
        /** @type {?} */
        const allowedIncomingFiles = [].reduce.call(incomingFiles, (/**
         * @param {?} acc
         * @param {?} checkFile
         * @param {?} i
         * @return {?}
         */
        (acc, checkFile, i) => {
            /** @type {?} */
            const futureQueueLength = acc.length + this.queue.length + 1;
            if (this.isContentTypeAllowed(checkFile.type) && futureQueueLength <= this.maxUploads && this.isFileSizeAllowed(checkFile.size)) {
                acc = acc.concat(checkFile);
            }
            else {
                /** @type {?} */
                const rejectedFile = this.makeUploadFile(checkFile, i);
                this.serviceEvents.emit({ type: 'rejected', file: rejectedFile });
            }
            return acc;
        }), []);
        this.queue.push(...[].map.call(allowedIncomingFiles, (/**
         * @param {?} file
         * @param {?} i
         * @return {?}
         */
        (file, i) => {
            /** @type {?} */
            const uploadFile = this.makeUploadFile(file, i);
            this.serviceEvents.emit({ type: 'addedToQueue', file: uploadFile });
            return uploadFile;
        })));
        this.serviceEvents.emit({ type: 'allAddedToQueue' });
    }
    /**
     * @param {?} input
     * @return {?}
     */
    initInputEvents(input) {
        return input.subscribe((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            switch (event.type) {
                case 'uploadFile':
                    /** @type {?} */
                    const uploadFileIndex = this.queue.findIndex((/**
                     * @param {?} file
                     * @return {?}
                     */
                    file => file === event.file));
                    if (uploadFileIndex !== -1 && event.file) {
                        this.uploadScheduler.next({ file: this.queue[uploadFileIndex], event: event });
                    }
                    break;
                case 'uploadAll':
                    /** @type {?} */
                    const files = this.queue.filter((/**
                     * @param {?} file
                     * @return {?}
                     */
                    file => file.progress.status === UploadStatus.Queue));
                    files.forEach((/**
                     * @param {?} file
                     * @return {?}
                     */
                    file => this.uploadScheduler.next({ file: file, event: event })));
                    break;
                case 'cancel':
                    /** @type {?} */
                    const id = event.id || null;
                    if (!id) {
                        return;
                    }
                    /** @type {?} */
                    const subs = this.subs.filter((/**
                     * @param {?} sub
                     * @return {?}
                     */
                    sub => sub.id === id));
                    subs.forEach((/**
                     * @param {?} sub
                     * @return {?}
                     */
                    sub => {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                            /** @type {?} */
                            const fileIndex = this.queue.findIndex((/**
                             * @param {?} file
                             * @return {?}
                             */
                            file => file.id === id));
                            if (fileIndex !== -1) {
                                this.queue[fileIndex].progress.status = UploadStatus.Cancelled;
                                this.serviceEvents.emit({ type: 'cancelled', file: this.queue[fileIndex] });
                            }
                        }
                    }));
                    break;
                case 'cancelAll':
                    this.subs.forEach((/**
                     * @param {?} sub
                     * @return {?}
                     */
                    sub => {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                        }
                        /** @type {?} */
                        const file = this.queue.find((/**
                         * @param {?} uploadFile
                         * @return {?}
                         */
                        uploadFile => uploadFile.id === sub.id));
                        if (file) {
                            file.progress.status = UploadStatus.Cancelled;
                            this.serviceEvents.emit({ type: 'cancelled', file: file });
                        }
                    }));
                    break;
                case 'remove':
                    if (!event.id) {
                        return;
                    }
                    /** @type {?} */
                    const i = this.queue.findIndex((/**
                     * @param {?} file
                     * @return {?}
                     */
                    file => file.id === event.id));
                    if (i !== -1) {
                        /** @type {?} */
                        const file = this.queue[i];
                        this.queue.splice(i, 1);
                        this.serviceEvents.emit({ type: 'removed', file: file });
                    }
                    break;
                case 'removeAll':
                    if (this.queue.length) {
                        this.queue = [];
                        this.serviceEvents.emit({ type: 'removedAll' });
                    }
                    break;
            }
        }));
    }
    /**
     * @param {?} upload
     * @return {?}
     */
    startUpload(upload) {
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            /** @type {?} */
            const sub = this.uploadFile(upload.file, upload.event)
                .pipe(finalize((/**
             * @return {?}
             */
            () => {
                if (!observer.closed) {
                    observer.complete();
                }
            })))
                .subscribe((/**
             * @param {?} output
             * @return {?}
             */
            output => {
                observer.next(output);
            }), (/**
             * @param {?} err
             * @return {?}
             */
            err => {
                observer.error(err);
                observer.complete();
            }), (/**
             * @return {?}
             */
            () => {
                observer.complete();
            }));
            this.subs.push({ id: upload.file.id, sub: sub });
        }));
    }
    /**
     * @param {?} file
     * @param {?} event
     * @return {?}
     */
    uploadFile(file, event) {
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            /** @type {?} */
            const url = event.url || '';
            /** @type {?} */
            const method = event.method || 'POST';
            /** @type {?} */
            const data = event.data || {};
            /** @type {?} */
            const headers = event.headers || {};
            /** @type {?} */
            const xhr = new XMLHttpRequest();
            /** @type {?} */
            const time = new Date().getTime();
            /** @type {?} */
            let progressStartTime = (file.progress.data && file.progress.data.startTime) || time;
            /** @type {?} */
            let speed = 0;
            /** @type {?} */
            let eta = null;
            xhr.upload.addEventListener('progress', (/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                if (e.lengthComputable) {
                    /** @type {?} */
                    const percentage = Math.round((e.loaded * 100) / e.total);
                    /** @type {?} */
                    const diff = new Date().getTime() - time;
                    speed = Math.round(e.loaded / diff * 1000);
                    progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                    eta = Math.ceil((e.total - e.loaded) / speed);
                    file.progress = {
                        status: UploadStatus.Uploading,
                        data: {
                            percentage: percentage,
                            speed: speed,
                            speedHuman: `${humanizeBytes(speed)}/s`,
                            startTime: progressStartTime,
                            endTime: null,
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta)
                        }
                    };
                    observer.next({ type: 'uploading', file: file });
                }
            }), false);
            xhr.upload.addEventListener('error', (/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                observer.error(e);
                observer.complete();
            }));
            xhr.onreadystatechange = (/**
             * @return {?}
             */
            () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    /** @type {?} */
                    const speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                    file.progress = {
                        status: UploadStatus.Done,
                        data: {
                            percentage: 100,
                            speed: speedAverage,
                            speedHuman: `${humanizeBytes(speedAverage)}/s`,
                            startTime: progressStartTime,
                            endTime: new Date().getTime(),
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta || 0)
                        }
                    };
                    file.responseStatus = xhr.status;
                    try {
                        file.response = JSON.parse(xhr.response);
                    }
                    catch (e) {
                        file.response = xhr.response;
                    }
                    file.responseHeaders = this.parseResponseHeaders(xhr.getAllResponseHeaders());
                    observer.next({ type: 'done', file: file });
                    observer.complete();
                }
            });
            xhr.open(method, url, true);
            xhr.withCredentials = event.withCredentials ? true : false;
            try {
                /** @type {?} */
                const uploadFile = (/** @type {?} */ (file.nativeFile));
                /** @type {?} */
                const uploadIndex = this.queue.findIndex((/**
                 * @param {?} outFile
                 * @return {?}
                 */
                outFile => outFile.nativeFile === uploadFile));
                if (this.queue[uploadIndex].progress.status === UploadStatus.Cancelled) {
                    observer.complete();
                }
                Object.keys(headers).forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                key => xhr.setRequestHeader(key, headers[key])));
                /** @type {?} */
                let bodyToSend;
                if (event.includeWebKitFormBoundary !== false) {
                    Object.keys(data).forEach((/**
                     * @param {?} key
                     * @return {?}
                     */
                    key => file.form.append(key, data[key])));
                    file.form.append(event.fieldName || 'file', uploadFile, uploadFile.name);
                    bodyToSend = file.form;
                }
                else {
                    bodyToSend = uploadFile;
                }
                this.serviceEvents.emit({ type: 'start', file: file });
                xhr.send(bodyToSend);
            }
            catch (e) {
                observer.complete();
            }
            return (/**
             * @return {?}
             */
            () => {
                xhr.abort();
            });
        }));
    }
    /**
     * @param {?} sec
     * @return {?}
     */
    secondsToHuman(sec) {
        return new Date(sec * 1000).toISOString().substr(11, 8);
    }
    /**
     * @return {?}
     */
    generateId() {
        return Math.random().toString(36).substring(7);
    }
    /**
     * @param {?} contentTypes
     * @return {?}
     */
    setContentTypes(contentTypes) {
        if (typeof contentTypes !== 'undefined' && contentTypes instanceof Array) {
            if (contentTypes.find((/**
             * @param {?} type
             * @return {?}
             */
            (type) => type === '*')) !== undefined) {
                this.contentTypes = ['*'];
            }
            else {
                this.contentTypes = contentTypes;
            }
            return;
        }
        this.contentTypes = ['*'];
    }
    /**
     * @return {?}
     */
    allContentTypesAllowed() {
        return this.contentTypes.find((/**
         * @param {?} type
         * @return {?}
         */
        (type) => type === '*')) !== undefined;
    }
    /**
     * @param {?} mimetype
     * @return {?}
     */
    isContentTypeAllowed(mimetype) {
        if (this.allContentTypesAllowed()) {
            return true;
        }
        return this.contentTypes.find((/**
         * @param {?} type
         * @return {?}
         */
        (type) => type === mimetype)) !== undefined;
    }
    /**
     * @param {?} fileSize
     * @return {?}
     */
    isFileSizeAllowed(fileSize) {
        if (!this.maxFileSize) {
            return true;
        }
        return fileSize <= this.maxFileSize;
    }
    /**
     * @param {?} file
     * @param {?} index
     * @return {?}
     */
    makeUploadFile(file, index) {
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
                    speedHuman: `${humanizeBytes(0)}/s`,
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
    }
    /**
     * @private
     * @param {?} httpHeaders
     * @return {?}
     */
    parseResponseHeaders(httpHeaders) {
        if (!httpHeaders) {
            return;
        }
        return httpHeaders.split('\n')
            .map((/**
         * @param {?} x
         * @return {?}
         */
        (x) => x.split(/: */, 2)))
            .filter((/**
         * @param {?} x
         * @return {?}
         */
        (x) => x[0]))
            .reduce((/**
         * @param {?} acc
         * @param {?} x
         * @return {?}
         */
        (acc, x) => {
            acc[x[0]] = x[1];
            return acc;
        }), {});
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXVwbG9hZGVyLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZGVyLyIsInNvdXJjZXMiOlsibGliL25neC11cGxvYWRlci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUF5QyxZQUFZLEVBQVksTUFBTSxjQUFjLENBQUM7Ozs7O0FBRTdGLE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYTtJQUN6QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFDZixPQUFPLFFBQVEsQ0FBQztLQUNqQjs7VUFFSyxDQUFDLEdBQUcsSUFBSTs7VUFDUixLQUFLLEdBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQzs7VUFDekQsQ0FBQyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNELE9BQU8sVUFBVSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRUQsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQVM1QixZQUNFLGNBQXNCLE1BQU0sQ0FBQyxpQkFBaUIsRUFDOUMsZUFBeUIsQ0FBQyxHQUFHLENBQUMsRUFDOUIsYUFBcUIsTUFB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OztJQUMxQyx5Q0FBdUI7O0lBQ3ZCLHVDQUFtQjs7SUFDbkIsd0NBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtZXJnZU1hcCwgZmluYWxpemUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFVwbG9hZEZpbGUsIFVwbG9hZE91dHB1dCwgVXBsb2FkSW5wdXQsIFVwbG9hZFN0YXR1cywgQmxvYkZpbGUgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuaXplQnl0ZXMoYnl0ZXM6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgaWYgKGJ5dGVzID09PSAwKSB7XHJcbiAgICByZXR1cm4gJzAgQnl0ZSc7XHJcbiAgfVxyXG5cclxuICBjb25zdCBrID0gMTAyNDtcclxuICBjb25zdCBzaXplczogc3RyaW5nW10gPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJ107XHJcbiAgY29uc3QgaTogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XHJcblxyXG4gIHJldHVybiBwYXJzZUZsb2F0KChieXRlcyAvIE1hdGgucG93KGssIGkpKS50b0ZpeGVkKDIpKSArICcgJyArIHNpemVzW2ldO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmdVcGxvYWRlclNlcnZpY2Uge1xyXG4gIHF1ZXVlOiBVcGxvYWRGaWxlW107XHJcbiAgc2VydmljZUV2ZW50czogRXZlbnRFbWl0dGVyPFVwbG9hZE91dHB1dD47XHJcbiAgdXBsb2FkU2NoZWR1bGVyOiBTdWJqZWN0PHsgZmlsZTogVXBsb2FkRmlsZSwgZXZlbnQ6IFVwbG9hZElucHV0IH0+O1xyXG4gIHN1YnM6IHsgaWQ6IHN0cmluZywgc3ViOiBTdWJzY3JpcHRpb24gfVtdO1xyXG4gIGNvbnRlbnRUeXBlczogc3RyaW5nW107XHJcbiAgbWF4VXBsb2FkczogbnVtYmVyO1xyXG4gIG1heEZpbGVTaXplOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29uY3VycmVuY3k6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcclxuICAgIGNvbnRlbnRUeXBlczogc3RyaW5nW10gPSBbJyonXSxcclxuICAgIG1heFVwbG9hZHM6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcclxuICAgIG1heEZpbGVTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFlcclxuICApIHtcclxuICAgIHRoaXMucXVldWUgPSBbXTtcclxuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PigpO1xyXG4gICAgdGhpcy51cGxvYWRTY2hlZHVsZXIgPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgdGhpcy5zdWJzID0gW107XHJcbiAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IGNvbnRlbnRUeXBlcztcclxuICAgIHRoaXMubWF4VXBsb2FkcyA9IG1heFVwbG9hZHM7XHJcbiAgICB0aGlzLm1heEZpbGVTaXplID0gbWF4RmlsZVNpemU7XHJcblxyXG4gICAgdGhpcy51cGxvYWRTY2hlZHVsZXJcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgbWVyZ2VNYXAodXBsb2FkID0+IHRoaXMuc3RhcnRVcGxvYWQodXBsb2FkKSwgY29uY3VycmVuY3kpXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSh1cGxvYWRPdXRwdXQgPT4gdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQodXBsb2FkT3V0cHV0KSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlcyhpbmNvbWluZ0ZpbGVzOiBGaWxlTGlzdCk6IHZvaWQge1xyXG4gICAgY29uc3QgYWxsb3dlZEluY29taW5nRmlsZXM6IEZpbGVbXSA9IFtdLnJlZHVjZS5jYWxsKGluY29taW5nRmlsZXMsIChhY2M6IEZpbGVbXSwgY2hlY2tGaWxlOiBGaWxlLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgZnV0dXJlUXVldWVMZW5ndGggPSBhY2MubGVuZ3RoICsgdGhpcy5xdWV1ZS5sZW5ndGggKyAxO1xyXG4gICAgICBpZiAodGhpcy5pc0NvbnRlbnRUeXBlQWxsb3dlZChjaGVja0ZpbGUudHlwZSkgJiYgZnV0dXJlUXVldWVMZW5ndGggPD0gdGhpcy5tYXhVcGxvYWRzICYmIHRoaXMuaXNGaWxlU2l6ZUFsbG93ZWQoY2hlY2tGaWxlLnNpemUpKSB7XHJcbiAgICAgICAgYWNjID0gYWNjLmNvbmNhdChjaGVja0ZpbGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJlamVjdGVkRmlsZTogVXBsb2FkRmlsZSA9IHRoaXMubWFrZVVwbG9hZEZpbGUoY2hlY2tGaWxlLCBpKTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdyZWplY3RlZCcsIGZpbGU6IHJlamVjdGVkRmlsZSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICB0aGlzLnF1ZXVlLnB1c2goLi4uW10ubWFwLmNhbGwoYWxsb3dlZEluY29taW5nRmlsZXMsIChmaWxlOiBGaWxlLCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgdXBsb2FkRmlsZTogVXBsb2FkRmlsZSA9IHRoaXMubWFrZVVwbG9hZEZpbGUoZmlsZSwgaSk7XHJcbiAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2FkZGVkVG9RdWV1ZScsIGZpbGU6IHVwbG9hZEZpbGUgfSk7XHJcbiAgICAgIHJldHVybiB1cGxvYWRGaWxlO1xyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2FsbEFkZGVkVG9RdWV1ZScgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0SW5wdXRFdmVudHMoaW5wdXQ6IEV2ZW50RW1pdHRlcjxVcGxvYWRJbnB1dD4pOiBTdWJzY3JpcHRpb24ge1xyXG4gICAgcmV0dXJuIGlucHV0LnN1YnNjcmliZSgoZXZlbnQ6IFVwbG9hZElucHV0KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3VwbG9hZEZpbGUnOlxyXG4gICAgICAgICAgY29uc3QgdXBsb2FkRmlsZUluZGV4ID0gdGhpcy5xdWV1ZS5maW5kSW5kZXgoZmlsZSA9PiBmaWxlID09PSBldmVudC5maWxlKTtcclxuICAgICAgICAgIGlmICh1cGxvYWRGaWxlSW5kZXggIT09IC0xICYmIGV2ZW50LmZpbGUpIHtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRTY2hlZHVsZXIubmV4dCh7IGZpbGU6IHRoaXMucXVldWVbdXBsb2FkRmlsZUluZGV4XSwgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAndXBsb2FkQWxsJzpcclxuICAgICAgICAgIGNvbnN0IGZpbGVzID0gdGhpcy5xdWV1ZS5maWx0ZXIoZmlsZSA9PiBmaWxlLnByb2dyZXNzLnN0YXR1cyA9PT0gVXBsb2FkU3RhdHVzLlF1ZXVlKTtcclxuICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB0aGlzLnVwbG9hZFNjaGVkdWxlci5uZXh0KHsgZmlsZTogZmlsZSwgZXZlbnQ6IGV2ZW50IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICBjb25zdCBpZCA9IGV2ZW50LmlkIHx8IG51bGw7XHJcbiAgICAgICAgICBpZiAoIWlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YnMuZmlsdGVyKHN1YiA9PiBzdWIuaWQgPT09IGlkKTtcclxuICAgICAgICAgIHN1YnMuZm9yRWFjaChzdWIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3ViLnN1Yikge1xyXG4gICAgICAgICAgICAgIHN1Yi5zdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICBjb25zdCBmaWxlSW5kZXggPSB0aGlzLnF1ZXVlLmZpbmRJbmRleChmaWxlID0+IGZpbGUuaWQgPT09IGlkKTtcclxuICAgICAgICAgICAgICBpZiAoZmlsZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZVtmaWxlSW5kZXhdLnByb2dyZXNzLnN0YXR1cyA9IFVwbG9hZFN0YXR1cy5DYW5jZWxsZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMuZW1pdCh7IHR5cGU6ICdjYW5jZWxsZWQnLCBmaWxlOiB0aGlzLnF1ZXVlW2ZpbGVJbmRleF0gfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2NhbmNlbEFsbCc6XHJcbiAgICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3ViLnN1Yikge1xyXG4gICAgICAgICAgICAgIHN1Yi5zdWIudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMucXVldWUuZmluZCh1cGxvYWRGaWxlID0+IHVwbG9hZEZpbGUuaWQgPT09IHN1Yi5pZCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgZmlsZS5wcm9ncmVzcy5zdGF0dXMgPSBVcGxvYWRTdGF0dXMuQ2FuY2VsbGVkO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ2NhbmNlbGxlZCcsIGZpbGU6IGZpbGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICAgIGlmICghZXZlbnQuaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLnF1ZXVlLmZpbmRJbmRleChmaWxlID0+IGZpbGUuaWQgPT09IGV2ZW50LmlkKTtcclxuICAgICAgICAgIGlmIChpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5xdWV1ZVtpXTtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ3JlbW92ZWQnLCBmaWxlOiBmaWxlIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmVtb3ZlQWxsJzpcclxuICAgICAgICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUV2ZW50cy5lbWl0KHsgdHlwZTogJ3JlbW92ZWRBbGwnIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRVcGxvYWQodXBsb2FkOiB7IGZpbGU6IFVwbG9hZEZpbGUsIGV2ZW50OiBVcGxvYWRJbnB1dCB9KTogT2JzZXJ2YWJsZTxVcGxvYWRPdXRwdXQ+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMudXBsb2FkRmlsZSh1cGxvYWQuZmlsZSwgdXBsb2FkLmV2ZW50KVxyXG4gICAgICAgIC5waXBlKGZpbmFsaXplKCgpID0+IHtcclxuICAgICAgICAgIGlmICghb2JzZXJ2ZXIuY2xvc2VkKSB7XHJcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgLnN1YnNjcmliZShvdXRwdXQgPT4ge1xyXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChvdXRwdXQpO1xyXG4gICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zdWJzLnB1c2goeyBpZDogdXBsb2FkLmZpbGUuaWQsIHN1Yjogc3ViIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlKGZpbGU6IFVwbG9hZEZpbGUsIGV2ZW50OiBVcGxvYWRJbnB1dCk6IE9ic2VydmFibGU8VXBsb2FkT3V0cHV0PiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBldmVudC51cmwgfHwgJyc7XHJcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGV2ZW50Lm1ldGhvZCB8fCAnUE9TVCc7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhIHx8IHt9O1xyXG4gICAgICBjb25zdCBoZWFkZXJzID0gZXZlbnQuaGVhZGVycyB8fCB7fTtcclxuXHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICBjb25zdCB0aW1lOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgbGV0IHByb2dyZXNzU3RhcnRUaW1lOiBudW1iZXIgPSAoZmlsZS5wcm9ncmVzcy5kYXRhICYmIGZpbGUucHJvZ3Jlc3MuZGF0YS5zdGFydFRpbWUpIHx8IHRpbWU7XHJcbiAgICAgIGxldCBzcGVlZCA9IDA7XHJcbiAgICAgIGxldCBldGE6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChlOiBQcm9ncmVzc0V2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG4gICAgICAgICAgY29uc3QgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoKGUubG9hZGVkICogMTAwKSAvIGUudG90YWwpO1xyXG4gICAgICAgICAgY29uc3QgZGlmZiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGltZTtcclxuICAgICAgICAgIHNwZWVkID0gTWF0aC5yb3VuZChlLmxvYWRlZCAvIGRpZmYgKiAxMDAwKTtcclxuICAgICAgICAgIHByb2dyZXNzU3RhcnRUaW1lID0gKGZpbGUucHJvZ3Jlc3MuZGF0YSAmJiBmaWxlLnByb2dyZXNzLmRhdGEuc3RhcnRUaW1lKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgIGV0YSA9IE1hdGguY2VpbCgoZS50b3RhbCAtIGUubG9hZGVkKSAvIHNwZWVkKTtcclxuXHJcbiAgICAgICAgICBmaWxlLnByb2dyZXNzID0ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IFVwbG9hZFN0YXR1cy5VcGxvYWRpbmcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBwZXJjZW50YWdlOiBwZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgIHNwZWVkOiBzcGVlZCxcclxuICAgICAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKHNwZWVkKX0vc2AsXHJcbiAgICAgICAgICAgICAgc3RhcnRUaW1lOiBwcm9ncmVzc1N0YXJ0VGltZSxcclxuICAgICAgICAgICAgICBlbmRUaW1lOiBudWxsLFxyXG4gICAgICAgICAgICAgIGV0YTogZXRhLFxyXG4gICAgICAgICAgICAgIGV0YUh1bWFuOiB0aGlzLnNlY29uZHNUb0h1bWFuKGV0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHsgdHlwZTogJ3VwbG9hZGluZycsIGZpbGU6IGZpbGUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xyXG4gICAgICAgICAgY29uc3Qgc3BlZWRBdmVyYWdlID0gTWF0aC5yb3VuZChmaWxlLnNpemUgLyAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwcm9ncmVzc1N0YXJ0VGltZSkgKiAxMDAwKTtcclxuICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1czogVXBsb2FkU3RhdHVzLkRvbmUsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBwZXJjZW50YWdlOiAxMDAsXHJcbiAgICAgICAgICAgICAgc3BlZWQ6IHNwZWVkQXZlcmFnZSxcclxuICAgICAgICAgICAgICBzcGVlZEh1bWFuOiBgJHtodW1hbml6ZUJ5dGVzKHNwZWVkQXZlcmFnZSl9L3NgLFxyXG4gICAgICAgICAgICAgIHN0YXJ0VGltZTogcHJvZ3Jlc3NTdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgZW5kVGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgICAgZXRhOiBldGEsXHJcbiAgICAgICAgICAgICAgZXRhSHVtYW46IHRoaXMuc2Vjb25kc1RvSHVtYW4oZXRhIHx8IDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgZmlsZS5yZXNwb25zZVN0YXR1cyA9IHhoci5zdGF0dXM7XHJcblxyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZmlsZS5yZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgZmlsZS5yZXNwb25zZSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmaWxlLnJlc3BvbnNlSGVhZGVycyA9IHRoaXMucGFyc2VSZXNwb25zZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcclxuXHJcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHsgdHlwZTogJ2RvbmUnLCBmaWxlOiBmaWxlIH0pO1xyXG5cclxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gZXZlbnQud2l0aENyZWRlbnRpYWxzID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB1cGxvYWRGaWxlID0gPEJsb2JGaWxlPmZpbGUubmF0aXZlRmlsZTtcclxuICAgICAgICBjb25zdCB1cGxvYWRJbmRleCA9IHRoaXMucXVldWUuZmluZEluZGV4KG91dEZpbGUgPT4gb3V0RmlsZS5uYXRpdmVGaWxlID09PSB1cGxvYWRGaWxlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucXVldWVbdXBsb2FkSW5kZXhdLnByb2dyZXNzLnN0YXR1cyA9PT0gVXBsb2FkU3RhdHVzLkNhbmNlbGxlZCkge1xyXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goa2V5ID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKSk7XHJcblxyXG4gICAgICAgIGxldCBib2R5VG9TZW5kOiBGb3JtRGF0YSB8IEJsb2JGaWxlO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnQuaW5jbHVkZVdlYktpdEZvcm1Cb3VuZGFyeSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IGZpbGUuZm9ybS5hcHBlbmQoa2V5LCBkYXRhW2tleV0pKTtcclxuICAgICAgICAgIGZpbGUuZm9ybS5hcHBlbmQoZXZlbnQuZmllbGROYW1lIHx8ICdmaWxlJywgdXBsb2FkRmlsZSwgdXBsb2FkRmlsZS5uYW1lKTtcclxuICAgICAgICAgIGJvZHlUb1NlbmQgPSBmaWxlLmZvcm07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJvZHlUb1NlbmQgPSB1cGxvYWRGaWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzLmVtaXQoeyB0eXBlOiAnc3RhcnQnLCBmaWxlOiBmaWxlIH0pO1xyXG4gICAgICAgIHhoci5zZW5kKGJvZHlUb1NlbmQpO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2Vjb25kc1RvSHVtYW4oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKHNlYyAqIDEwMDApLnRvSVNPU3RyaW5nKCkuc3Vic3RyKDExLCA4KTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyk7XHJcbiAgfVxyXG5cclxuICBzZXRDb250ZW50VHlwZXMoY29udGVudFR5cGVzOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgaWYgKHR5cGVvZiBjb250ZW50VHlwZXMgIT09ICd1bmRlZmluZWQnICYmIGNvbnRlbnRUeXBlcyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGlmIChjb250ZW50VHlwZXMuZmluZCgodHlwZTogc3RyaW5nKSA9PiB0eXBlID09PSAnKicpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRUeXBlcyA9IFsnKiddO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGVudFR5cGVzID0gY29udGVudFR5cGVzO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuY29udGVudFR5cGVzID0gWycqJ107XHJcbiAgfVxyXG5cclxuICBhbGxDb250ZW50VHlwZXNBbGxvd2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLmZpbmQoKHR5cGU6IHN0cmluZykgPT4gdHlwZSA9PT0gJyonKSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgaXNDb250ZW50VHlwZUFsbG93ZWQobWltZXR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuYWxsQ29udGVudFR5cGVzQWxsb3dlZCgpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudFR5cGVzLmZpbmQoKHR5cGU6IHN0cmluZykgPT4gdHlwZSA9PT0gbWltZXR5cGUpICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBpc0ZpbGVTaXplQWxsb3dlZChmaWxlU2l6ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMubWF4RmlsZVNpemUpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZVNpemUgPD0gdGhpcy5tYXhGaWxlU2l6ZTtcclxuICB9XHJcblxyXG4gIG1ha2VVcGxvYWRGaWxlKGZpbGU6IEZpbGUsIGluZGV4OiBudW1iZXIpOiBVcGxvYWRGaWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZpbGVJbmRleDogaW5kZXgsXHJcbiAgICAgIGlkOiB0aGlzLmdlbmVyYXRlSWQoKSxcclxuICAgICAgbmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICBzaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIHR5cGU6IGZpbGUudHlwZSxcclxuICAgICAgZm9ybTogbmV3IEZvcm1EYXRhKCksXHJcbiAgICAgIHByb2dyZXNzOiB7XHJcbiAgICAgICAgc3RhdHVzOiBVcGxvYWRTdGF0dXMuUXVldWUsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcGVyY2VudGFnZTogMCxcclxuICAgICAgICAgIHNwZWVkOiAwLFxyXG4gICAgICAgICAgc3BlZWRIdW1hbjogYCR7aHVtYW5pemVCeXRlcygwKX0vc2AsXHJcbiAgICAgICAgICBzdGFydFRpbWU6IG51bGwsXHJcbiAgICAgICAgICBlbmRUaW1lOiBudWxsLFxyXG4gICAgICAgICAgZXRhOiBudWxsLFxyXG4gICAgICAgICAgZXRhSHVtYW46IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3RNb2RpZmllZERhdGU6IG5ldyBEYXRlKGZpbGUubGFzdE1vZGlmaWVkKSxcclxuICAgICAgc3ViOiB1bmRlZmluZWQsXHJcbiAgICAgIG5hdGl2ZUZpbGU6IGZpbGVcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlUmVzcG9uc2VIZWFkZXJzKGh0dHBIZWFkZXJzOiBzdHJpbmcpIHtcclxuICAgIGlmICghaHR0cEhlYWRlcnMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBodHRwSGVhZGVycy5zcGxpdCgnXFxuJylcclxuICAgICAgLm1hcCgoeDogc3RyaW5nKSA9PiB4LnNwbGl0KC86ICovLCAyKSlcclxuICAgICAgLmZpbHRlcigoeDogc3RyaW5nW10pID0+IHhbMF0pXHJcbiAgICAgIC5yZWR1Y2UoKGFjYzogT2JqZWN0LCB4OiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgICAgIGFjY1t4WzBdXSA9IHhbMV07XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgfSwge30pO1xyXG4gIH1cclxufVxyXG4iXX0=