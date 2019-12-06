import { IPlatform, TouchResult, IRequestOptions, IRequestResponse, IDownloadOptions } from "../IPlatform";
import { request } from "./request";
import { H5FileSystemManager } from "./H5FileSystemManager";
// import { downloadFile } from "./downloadFile.js";
// declare var downloadFile: any;
// declare module 'downloadFile';


export class H5Platform implements IPlatform {
    protected _mainCanvas: HTMLCanvasElement;
    // protected _dispatcher: EventDispatcher;

    protected _adjectMainCanvasSize() {
        // Lookup the size the browser is displaying the canvas.
        let displayWidth = this._mainCanvas.clientWidth;
        let displayHeight = this._mainCanvas.clientHeight;

        // Check if the canvas is not the same size.
        if (this._mainCanvas.width != displayWidth ||
            this._mainCanvas.height != displayHeight) {

            // Make the canvas the same size
            this._mainCanvas.width = displayWidth;
            this._mainCanvas.height = displayHeight;
        }

    }

    constructor() {
        this._mainCanvas = document.getElementById('canvas') as HTMLCanvasElement;
        this._adjectMainCanvasSize();
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

    protected _fileSystemManager: H5FileSystemManager | null = null;
    getFileSystemManager(): H5FileSystemManager {
        if (!this._fileSystemManager)
            this._fileSystemManager = new H5FileSystemManager();
        return this._fileSystemManager;
    }

    //-------------- html5 api ----------------------



}