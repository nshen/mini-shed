import { IPlatform, TouchResult, IRequestOptions, IRequestResponse, IDownloadOptions } from "../IPlatform";
import { WXFileSystemManager } from "./WXFileSystemManager";

declare var wx: any

export class WXPlatform implements IPlatform {

    protected _first: HTMLCanvasElement = wx.createCanvas() as any as HTMLCanvasElement;
    protected _fileSystemManager: WXFileSystemManager | null = null;

    // ------------------  IPlatform API --------------------

    getMainCanvas(): HTMLCanvasElement {
        return this._first;
    }

    createCanvas(): HTMLCanvasElement {
        return wx.createCanvas() as any as HTMLCanvasElement;
    }

    createImage(): HTMLImageElement {
        return wx.createImage() as any as HTMLImageElement;
    }

    onTouchStart(callback: (res: TouchResult) => void): void {
        return wx.onTouchStart(callback);
    }
    onTouchMove(callback: (res: TouchResult) => void): void {
        return wx.onTouchMove(callback);
    }
    onTouchEnd(callback: (res: TouchResult) => void): void {
        return wx.onTouchEnd(callback);
    }
    onTouchCancel(callback: (res: TouchResult) => void): void {
        return wx.onTouchCancel(callback);
    }

    // 网路
    request<T>(options: IRequestOptions): Promise<IRequestResponse<T>> {
        return wx.request(options)
        const p = new Promise((resolve, reject) => {

        })
    }

    downloadFile(options: IDownloadOptions) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
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
            let img = wx.createImage();
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


    getFileSystemManager() {
        return

    }
}