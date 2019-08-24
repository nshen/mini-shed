import { IFileSystemManager } from "../IFileSystemManager";

declare var qq: any;

export class QQFileSystemManager implements IFileSystemManager {
    root: string = "";

    // appendFile(object)

    // download(path: string, name: string, progressCallback?: () => void): Promise<string>;
    // unzip(path: string): Promise<void>;
    // access(path: string): Promise<void>;


    protected fs: any;

    constructor() {
        this.fs = qq.getFileSystemManager();
    }

    get USER_DATA_PATH(): string {
        return qq.env.USER_DATA_PATH + '/';
    }

    /**
     * 判断文件目录是否存在
     * @param path 
     */
    access(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.access({
                path: path,
                success: () => {
                    resolve()
                },
                fail: () => {
                    reject()
                }
            })
        })
    }

    readdir(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.readdir({
                dirPath: path,
                success: (res: any) => {
                    resolve(res.files);
                },
                fail: () => {
                    reject();
                }
            })
        })
    }



    getFileInfo(filePath: string) {
        return new Promise((resolve, reject) => {
            this.fs.getFileInfo({
                filePath: filePath,
                success: (res: any) => {
                    resolve(res);
                    console.log('getFileInfo:', JSON.stringify(res));
                },
                fail: function () {
                    console.log('getFileInfo fial');
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

    unzip(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.fs.unzip({
                zipFilePath: path,
                targetPath: qq.env.USER_DATA_PATH,
                success() {
                    console.log('解压成功')
                    resolve()
                },
                fail(res: any) {
                    console.log('解压失败', JSON.stringify(res));
                    reject();
                }
            })
        })
    }

    download(path: string, name: string, progressCallback: (v: number) => void) {
        return new Promise<string>((resolve, reject) => {
            let tempFilePath = this.root + "/" + name;
            let task = qq.downloadFile({
                url: path,
                filePath: tempFilePath,
                success: (msg: any) => {
                    console.log('下载成功');
                    console.log(tempFilePath)
                    resolve(tempFilePath);
                },
                fail(msg: any) {
                    console.log('下载失败 ', JSON.stringify(msg))
                    reject(msg);
                }
            });
            task.onProgressUpdate((res: any) => {
                progressCallback(res.progress);
                console.log('下载zip', res.progress);
            });
        })




    }



}