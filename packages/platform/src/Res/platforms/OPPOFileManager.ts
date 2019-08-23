
import { IFileManager } from "../IFileManager";

declare var qg: any;

// https://developers.weixin.qq.com/minigame/dev/guide/base-ability/file-system.html



export class OPPOFileManager implements IFileManager {

    protected fs: any;

    constructor() {
        this.fs = qg.getFileSystemManager();
    }

    get root(): string {
        return qg.env.USER_DATA_PATH;
    }

    // promisiy(command: Function, object): Promise<any> {
    //     console.log('promisy', command, JSON.stringify(object));
    //     let o = {...object}
    //     console.log(o)
    //     return new Promise<any>((resolve, reject) => {
    //         let o = {
    //             ...object,
    //             success: resolve,
    //             fail: reject
    //         };

    //         console.log('!!!', o)
    //         command.call(this.fs, o)
    //     })
    // }


    access(path: string) {
        return new Promise<any>((resolve, reject) => {
            this.fs.access({
                path: path,
                success: resolve,
                fail: reject
            })
        })
    }

    // access(path: string) {
    //     return this.promisiy(this.fs.access, { path });
    // }

    appendFile(path: string, data: string | ArrayBuffer, encoding: string = 'utf8') {
        return new Promise<void>((resolve, reject) => {
            this.fs.appendFile({
                filePath: path,
                success: resolve,
                fail: reject
            })
        })
    }

    copyFile() {

    }

    getFileInfo(filePath: string) {
        return new Promise((resolve, reject) => {
            this.fs.getFileInfo({
                filePath: filePath,
                success: resolve,
                fail: reject
            })
        })
    }


    getSavedFileList() {
        return new Promise((resolve, reject) => {
            this.fs.getSavedFileList({
                success: resolve, fail: reject
            })
        })
    }

    mkdir() {

    }


    // readdir(dirPath: string) {
    //     return this.promisiy(this.fs.readdir, { dirPath: dirPath });
    // }
    readdir(dirPath: string) {
        return new Promise<any>((resolve, reject) => {
            this.fs.readdir({
                dirPath,
                success: resolve,
                fail: reject
            })
        })
    }

    readFile() {

    }

    removeSavedFile(filePath: string) {
        return new Promise((resolve, reject) => {
            this.fs.removeSavedFile({
                filePath,
                success: resolve,
                fail: reject
            })
        })
    }

    rename() {

    }

    rmdir(dirPath: string) {

        return new Promise((resolve, reject) => {
            this.fs.rmdir({
                dirPath,
                success: resolve,
                fail: reject
            })
        })

    }

    saveFile() {

    }

    stat(path: string, recursive: boolean = false) {
        return new Promise((resolve, reject) => {
            this.fs.stat({
                path,
                recursive,
                success: resolve,
                fail: reject

            })

        })
    }


    unzip(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.unzip({
                zipFilePath: path,
                targetPath: this.root,
                success() {
                    console.log('解压成功')
                    resolve()
                },
                fail() {
                    console.log('解压失败')
                    reject();
                }
            })
        })
    }

    unlink(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.unlink({
                filePath: path,
                success: resolve,
                fail: reject
            })

        })
    }

    download(path: string, name: string, progressCallback?: (number) => void) {
        return new Promise<string>((resolve, reject) => {
            let tempFilePath = this.root + "/" + name;
            let task = qg.downloadFile({
                url: path,
                filePath: tempFilePath,
                success: resolve,
                fail: reject
            });
            task.onProgressUpdate((res) => {
                progressCallback(res.progress);
                console.log('下载zip', res.progress);
            });
        })




    }

}
