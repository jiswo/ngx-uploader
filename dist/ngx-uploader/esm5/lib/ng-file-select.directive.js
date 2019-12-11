/**
 * @fileoverview added by tsickle
 * Generated from: lib/ng-file-select.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { NgUploaderService } from './ngx-uploader.class';
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
        this.uploadOutput = new EventEmitter();
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
        if (this.uploadInput instanceof EventEmitter) {
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
        { type: Directive, args: [{
                    selector: '[ngFileSelect]'
                },] }
    ];
    /** @nocollapse */
    NgFileSelectDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    NgFileSelectDirective.propDecorators = {
        options: [{ type: Input }],
        uploadInput: [{ type: Input }],
        uploadOutput: [{ type: Output }]
    };
    return NgFileSelectDirective;
}());
export { NgFileSelectDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZmlsZS1zZWxlY3QuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZGVyLyIsInNvdXJjZXMiOlsibGliL25nLWZpbGUtc2VsZWN0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUV0RyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUd6RDtJQWFFLCtCQUFtQixVQUFzQjtRQUF6QyxpQkFFQztRQUZrQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBaUN6QyxpQkFBWTs7O1FBQUc7WUFDYixJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO2dCQUNqQixLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxFQUFBO1FBcENDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWdCLENBQUM7SUFDdkQsQ0FBQzs7OztJQUVELHdDQUFROzs7SUFBUjtRQUFBLGlCQW9CQztRQW5CQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7WUFDVCxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsaUJBQWlCOztZQUNsRixtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLElBQUksQ0FBQyxHQUFHLENBQUM7O1lBQy9FLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUI7O1lBQ2hGLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUI7UUFDeEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFL0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFDLEtBQW1CO1lBQ3RELEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsRUFBQyxDQUNILENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxXQUFXLFlBQVksWUFBWSxFQUFFO1lBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQy9EO0lBQ0gsQ0FBQzs7OztJQUVELDJDQUFXOzs7SUFBWDtRQUNFLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBQztZQUNWLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPOzs7O1lBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQWpCLENBQWlCLEVBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7O2dCQTVDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtpQkFDM0I7Ozs7Z0JBUG1CLFVBQVU7OzswQkFTM0IsS0FBSzs4QkFDTCxLQUFLOytCQUNMLE1BQU07O0lBNkNULDRCQUFDO0NBQUEsQUFuREQsSUFtREM7U0FoRFkscUJBQXFCOzs7SUFDaEMsd0NBQWtDOztJQUNsQyw0Q0FBd0M7O0lBQ3hDLDZDQUFtRDs7SUFFbkQsdUNBQTBCOztJQUMxQixtQ0FBcUI7O0lBRXJCLHFDQUFxQjs7SUFtQ3JCLDZDQUlDOztJQXJDVywyQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVXBsb2FkT3V0cHV0LCBVcGxvYWRlck9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBOZ1VwbG9hZGVyU2VydmljZSB9IGZyb20gJy4vbmd4LXVwbG9hZGVyLmNsYXNzJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tuZ0ZpbGVTZWxlY3RdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdGaWxlU2VsZWN0RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpIG9wdGlvbnM6IFVwbG9hZGVyT3B0aW9ucztcclxuICBASW5wdXQoKSB1cGxvYWRJbnB1dDogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIHVwbG9hZE91dHB1dDogRXZlbnRFbWl0dGVyPFVwbG9hZE91dHB1dD47XHJcblxyXG4gIHVwbG9hZDogTmdVcGxvYWRlclNlcnZpY2U7XHJcbiAgZWw6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gIF9zdWI6IFN1YnNjcmlwdGlvbltdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy51cGxvYWRPdXRwdXQgPSBuZXcgRXZlbnRFbWl0dGVyPFVwbG9hZE91dHB1dD4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5fc3ViID0gW107XHJcbiAgICBjb25zdCBjb25jdXJyZW5jeSA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY29uY3VycmVuY3kgfHwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xyXG4gICAgY29uc3QgYWxsb3dlZENvbnRlbnRUeXBlcyA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYWxsb3dlZENvbnRlbnRUeXBlcyB8fCBbJyonXTtcclxuICAgIGNvbnN0IG1heFVwbG9hZHMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heFVwbG9hZHMgfHwgTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xyXG4gICAgY29uc3QgbWF4RmlsZVNpemUgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heEZpbGVTaXplIHx8IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcclxuICAgIHRoaXMudXBsb2FkID0gbmV3IE5nVXBsb2FkZXJTZXJ2aWNlKGNvbmN1cnJlbmN5LCBhbGxvd2VkQ29udGVudFR5cGVzLCBtYXhVcGxvYWRzLCBtYXhGaWxlU2l6ZSk7XHJcblxyXG4gICAgdGhpcy5lbCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmZpbGVMaXN0ZW5lciwgZmFsc2UpO1xyXG5cclxuICAgIHRoaXMuX3N1Yi5wdXNoKFxyXG4gICAgICB0aGlzLnVwbG9hZC5zZXJ2aWNlRXZlbnRzLnN1YnNjcmliZSgoZXZlbnQ6IFVwbG9hZE91dHB1dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBsb2FkT3V0cHV0LmVtaXQoZXZlbnQpO1xyXG4gICAgICB9KVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAodGhpcy51cGxvYWRJbnB1dCBpbnN0YW5jZW9mIEV2ZW50RW1pdHRlcikge1xyXG4gICAgICB0aGlzLl9zdWIucHVzaCh0aGlzLnVwbG9hZC5pbml0SW5wdXRFdmVudHModGhpcy51cGxvYWRJbnB1dCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5lbCl7XHJcbiAgICAgIHRoaXMuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5maWxlTGlzdGVuZXIsIGZhbHNlKTtcclxuICAgICAgdGhpcy5fc3ViLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZpbGVMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGlmICh0aGlzLmVsLmZpbGVzKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkLmhhbmRsZUZpbGVzKHRoaXMuZWwuZmlsZXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=