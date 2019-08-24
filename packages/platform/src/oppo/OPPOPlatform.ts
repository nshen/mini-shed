import { IPlatform, TouchResult, IRequestOptions, IRequestResponse, IDownloadOptions } from "../IPlatform";
import { request } from "./request";
import { OPPOFileSystemManager } from "./OPPOFileSystemManager";

export class OPPOPlatform implements IPlatform {
    protected _mainCanvas: HTMLCanvasElement;
    // protected _dispatcher: EventDispatcher;


    constructor() {
        this._mainCanvas = document.getElementById('canvas') as HTMLCanvasElement;
    }

    // ------------------  IPlatform API --------------------

    getMainCanvas(): HTMLCanvasElement {
        return this._mainCanvas;
    }

    createCanvas(name: string = 'myCanvas'): HTMLCanvasElement {
        let canvas = document.createElement('canvas');
        canvas.id = name;
        canvas.width = this._mainCanvas.width;
        canvas.height = this._mainCanvas.height;
        return canvas;
    }

    createImage() {
        return new Image();
    }

    onTouchStart(callback: (res: TouchResult) => void): void {
        this._mainCanvas.addEventListener('touchstart', (event) => {
            // event.preventDefault();
            callback(event);
            event.preventDefault();
        }, false)
    }
    onTouchMove(callback: (res: TouchResult) => void): void {
        this._mainCanvas.addEventListener('touchmove', (event) => {
            // event.preventDefault();
            // console.log('move')
            callback(event)
            event.preventDefault();
        }, false);
    }
    onTouchEnd(callback: (res: TouchResult) => void): void {
        this._mainCanvas.addEventListener('touchend', (event) => {
            callback(event)
            event.preventDefault();
        }, false);
    }
    onTouchCancel(callback: (res: TouchResult) => void): void {
        this._mainCanvas.addEventListener('touchcancel', (event) => {
            callback(event);
            event.preventDefault();
        }, false)
    }

    // 网路
    request<T>(options: IRequestOptions): Promise<IRequestResponse<T>> {
        return request(options)
    }

    downloadFile(options: IDownloadOptions | string): Promise<unknown> {
        if (typeof options === 'string') {
            return fetch(options);
        }
        return fetch(options.url, {
            headers: options.header
        })
        // return downloadFile({ url, headers, filePath })
    }

    loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.onerror = () => {
                reject()
            }
            img.src = url;
        })
    }

    loadJSON(url: string): Promise<unknown> {
        return this.request({
            url: url,
            method: 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json'
            }
        })
    }

    protected _fileSystemManager: OPPOFileSystemManager | null = null;
    getFileSystemManager(): OPPOFileSystemManager {
        if (!this._fileSystemManager)
            this._fileSystemManager = new OPPOFileSystemManager();
        return this._fileSystemManager;
    }
    //-------------- html5 api ----------------------



}