import { IPlatform, TouchResult, IRequestOptions, IRequestResponse, IDownloadOptions } from "../IPlatform";

declare var tt: any

export class TTPlatform implements IPlatform {

    protected _first: HTMLCanvasElement = tt.createCanvas() as any as HTMLCanvasElement;

    // ------------------  IPlatform API --------------------

    getMainCanvas(): HTMLCanvasElement {
        return this._first;
    }

    createCanvas(): HTMLCanvasElement {
        return tt.createCanvas() as any as HTMLCanvasElement;
    }

    createImage(): HTMLImageElement {
        return tt.createImage() as any as HTMLImageElement;
    }

    onTouchStart(callback: (res: TouchResult) => void): void {
        return tt.onTouchStart(callback);
    }

    onTouchMove(callback: (res: TouchResult) => void): void {
        return tt.onTouchMove(callback);
    }

    onTouchEnd(callback: (res: TouchResult) => void): void {
        return tt.onTouchEnd(callback);
    }

    onTouchCancel(callback: (res: TouchResult) => void): void {
        return tt.onTouchCancel(callback);
    }

    // 网路
    request<T>(options: IRequestOptions): Promise<IRequestResponse<T>> {
        return tt.request(options)
        const p = new Promise((resolve, reject) => {

        })
    }

    downloadFile(options: IDownloadOptions) {
        return new Promise((resolve, reject) => {
            tt.downloadFile({
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
            let img = tt.createImage();
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
}