import { IFileSystemManager, EncodingOption, Stats } from "../IFileSystemManager";

declare var wx: any;

export class WXFileSystemManager implements IFileSystemManager {

    // root: string = "";

    protected fs: any;

    constructor() {
        this.fs = wx.getFileSystemManager();
    }

    get USER_DATA_PATH(): string {
        return wx.env.USER_DATA_PATH;
    }

    access(path: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.fs.access({
                path,
                success: resolve(true),
                fail: resolve(false)
            })
        })
    }

    appendFile(filePath: string, data: string | ArrayBuffer, encoding: EncodingOption = 'utf8') {
        return new Promise<void>((resolve, reject) => {
            this.fs.appendFile({
                filePath,
                data,
                encoding,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    copyFile(srcPath: string, destPath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.fs.copyFile({
                srcPath,
                destPath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    getFileInfo(filePath: string) {
        return new Promise<number>((resolve, reject) => {
            this.fs.getFileInfo({
                filePath: filePath,
                success: res => resolve(res.size),
                fail: res => reject(res.errMsg)
            })
        })
    }

    getSavedFileList() {
        return new Promise<{ filePath: string, size: number, createTime: number }[]>((resolve, reject) => {
            this.fs.getSavedFileList({
                success: res => resolve(res.fileList),
                fail: res => reject(res.errMsg)
            })
        })
    }

    mkdir(dirPath: string, recursive: boolean = false) {
        return new Promise<void>((resolve, reject) => {
            this.fs.mkdir({
                dirPath,
                recursive,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    readdir(dirPath: string) {
        return new Promise<string[]>((resolve, reject) => {
            this.fs.readdir({
                dirPath,
                success: res => resolve(res.files),
                fail: res => reject(res.errMsg)
            })
        })
    }

    readFile(filePath: string, encoding: EncodingOption = 'binary') {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
            this.fs.readFile({
                filePath,
                encoding,
                success: res => resolve(res.data),
                fail: res => reject(res.errMsg)
            })
        })
    }

    removeSavedFile(filePath: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.removeSavedFile({
                filePath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    rename(oldPath: string, newPath: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.rename({
                oldPath,
                newPath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    rmdir(dirPath: string, recursive: boolean = false) {
        return new Promise<void>((resolve, reject) => {
            this.fs.rmdir({
                dirPath,
                recursive,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    saveFile(tempFilePath: string, filePath?: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.saveFile({
                tempFilePath,
                filePath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    stat(path: string, recursive: boolean = false): Promise<{ [key: string]: Stats } | Stats> {
        return new Promise<{ [key: string]: Stats } | Stats>((resolve, reject) => {
            this.fs.stat({
                path,
                recursive,
                success: res => resolve(res.stats),
                fail: res => reject(res.errMsg)
            })
        })
    }

    unlink(filePath: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.unlink({
                filePath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    unzip(zipFilePath: string, targetPath: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.unzip({
                zipFilePath,
                targetPath,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    /**
     * 写文件
     * @param filePath 
     * @param data 
     * @param encoding 
     */
    writeFile(filePath: string, data: string | ArrayBuffer, encoding: EncodingOption = 'utf8'): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.fs.writeFile({
                filePath,
                data,
                encoding,
                success: resolve,
                fail: res => reject(res.errMsg)
            })
        })
    }

    // download(path: string, name: string, progressCallback: (v: number) => void) {
    //     return new Promise<string>((resolve, reject) => {
    //         let tempFilePath = this.root + "/" + name;
    //         let task = wx.downloadFile({
    //             url: path,
    //             filePath: tempFilePath,
    //             success: resolve,
    //             fail: reject
    //         });
    //         task.onProgressUpdate((res: any) => {
    //             progressCallback(res.progress);
    //             console.log('下载zip', res.progress);
    //         });
    //     })
    // }


}