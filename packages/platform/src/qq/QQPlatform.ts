import { IPlatform, TouchResult, IRequestOptions, IRequestResponse, IDownloadOptions } from "../IPlatform";
import { QQFileSystemManager } from "./QQFileSystemManager";

declare var qq: any

export class QQPlatform implements IPlatform {

    protected _first: HTMLCanvasElement = qq.createCanvas() as any as HTMLCanvasElement;


    // ------------------  IPlatform API --------------------

    getMainCanvas(): HTMLCanvasElement {
        return this._first;
    }

    createCanvas(): HTMLCanvasElement {
        return qq.createCanvas() as any as HTMLCanvasElement;
    }

    createImage(): HTMLImageElement {
        return qq.createImage() as any as HTMLImageElement;
    }

    onTouchStart(callback: (res: TouchResult) => void): void {
        return qq.onTouchStart(callback);
    }

    onTouchMove(callback: (res: TouchResult) => void): void {
        return qq.onTouchMove(callback);
    }

    onTouchEnd(callback: (res: TouchResult) => void): void {
        return qq.onTouchEnd(callback);
    }

    onTouchCancel(callback: (res: TouchResult) => void): void {
        return qq.onTouchCancel(callback);
    }

    // 网路
    request<T>(options: IRequestOptions): Promise<IRequestResponse<T>> {
        return qq.request(options)
        const p = new Promise((resolve, reject) => {

        })
    }

    downloadFile(options: IDownloadOptions) {
        return new Promise((resolve, reject) => {
            qq.downloadFile({
                ...options,
                success(res: { tempFilePath: string, filePath: string, statusCode: number }) {
                    if (res && res.statusCode === 200)
                        resolve(res);
                    else
                        reject(res);
                },
                fail(err: any) {
                    reject(err);
                }
            })
        })
    }

    loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = qq.createImage();
            img.onload = () => {
                resolve(img as any as HTMLImageElement);
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

    protected _fileSystemManager: QQFileSystemManager | null = null;
    getFileSystemManager(): QQFileSystemManager {
        if (!this._fileSystemManager)
            this._fileSystemManager = new QQFileSystemManager();
        return this._fileSystemManager;
    }
}