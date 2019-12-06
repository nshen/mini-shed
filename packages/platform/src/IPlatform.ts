import { IFileSystemManager } from "./IFileSystemManager";

export interface IPlatform {

    getMainCanvas(): HTMLCanvasElement;
    createCanvas(): HTMLCanvasElement;
    createImage(): HTMLImageElement;

    // touch
    onTouchStart(callback: (res: TouchResult) => void): void;
    onTouchMove(callback: (res: TouchResult) => void): void;
    onTouchEnd(callback: (res: TouchResult) => void): void;
    onTouchCancel(callback: (res: TouchResult) => void): void;


    // 网络
    request<T>(options: IRequestOptions): Promise<IRequestResponse<T>>;
    // downloadFile(url: string, header?: object, filePath?: string): Promise<unknown>;

    downloadFile(options: IDownloadOptions | string): Promise<unknown>;

    // 文件
    getFileSystemManager(): IFileSystemManager;
}

// 没实现
export interface DownloadTask {
    abort(): void;
    onProgressUpdate(fn: (progress: number, totalBytesWritten: number, totalBytesExpectedToWrite: number) => void): void;
    offProgressUpdate(fn: Function): void;
    onHeadersReceived(fn: (header: object) => void): void;
    offHeadersReceived(fn: Function): void;
}

export interface IDownloadOptions {
    url: string;
    header?: { [key: string]: string };
    filePath?: string;
}

export interface IRequestOptions {
    url: string,
    data?: object | string | ArrayBuffer,
    header?: { [key: string]: string },
    method?: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
    dataType?: string | 'json',
    responseType?: 'text' | 'arraybuffer',
    mode?: 'no-cors' | 'cors' | 'same-origin' //webonly
}

export interface IRequestResponse<T> {
    data: object | string | ArrayBuffer | T,
    statusCode: number,
    header: { [k: string]: string }
}


export interface Touch {
    identifier: number;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number
}

export interface TouchResult {
    touches: TouchList;
    changedTouches: TouchList;
    timeStamp: number;
}