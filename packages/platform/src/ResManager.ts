// import { IFileManager } from "./IFileManager";

declare var qg: any;

export class RESManager {

    // // fs: IFileManager;
    // fs: WXFileManager;
    // constructor() {
    //     // this.fs = new OPPOFileManager();
    //     this.fs = new WXFileManager();
    //     // this.fs = new QQFileManager();
    // }

    // get root() {
    //     return this.fs.root;
    // }

    // size() {
    //     // this.fs.getFileInfo(this.root).then((res)=>{
    //     //     console.log(res)
    //     // })

    //     // this.fs.getSavedFileList().then((res)=>{
    //     //     console.log(res)
    //     // })

    //     console.log('!!!')
    //     this.fs.stat(this.root, true).then((res) => {
    //         console.log(JSON.stringify(res))
    //     })
    // }



    // exist(path: string) {
    //     return new Promise((resolve, reject) => {
    //         this.fs.access(this.root + '/' + path).then(() => {
    //             resolve(true);
    //         }).catch((err) => {
    //             resolve(false);
    //         })
    //     })
    // }

    // removeDir(path: string) {
    //     return this.fs.rmdir(this.root + '/' + path);
    // }

    // list() {
    //     return this.fs.readdir(this.root).then((res) => {
    //         console.log("列表：", JSON.stringify(res));
    //         // if (res.files.length > 0) {
    //         //     res.files.forEach(file => {
    //         //         this.fs.stat(this.root + '/' + file).then

    //         //     });
    //         // }
    //         return res.files;
    //     }).catch((res) => {
    //         console.log('list fail', JSON.stringify(res));
    //         return [];
    //     })
    // }

    // downloadZip(path: string, name: string, progress: (n: number) => void) {
    //     return this.fs.download(path, name, progress)
    //         .then((tempPath) => {
    //             return this.fs.unzip(tempPath as string);
    //         }).then(() => {
    //             console.log('解压成功');
    //         }).catch((err) => {
    //             console.log('下载失败', err)
    //         })
    // }

    // unzip(path: string) {
    //     return this.fs.unzip(this.root + '/' + path)
    // }

    // unlink(path: string) {
    //     return this.fs.unlink(this.root + '/' + path);

    // }

    // // async downloadZip(path: string, name: string, progressCallback: (n: number) => void) {
    // //     return this.fs.downloadZip(path, name, progressCallback);


    // // }

    // access(file: string) {
    //     return this.fs.access(this.root + file);
    // }
}