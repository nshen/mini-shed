import { IFileSystemManager, EncodingOption } from "../IFileSystemManager";

export class H5FileSystemManager implements IFileSystemManager {


    root: string = "";

    get USER_DATA_PATH(): string {
        return "";
    }

    access(path: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    appendFile(filePath: string, data: string | ArrayBuffer, encoding?: EncodingOption): Promise<void> {
        throw new Error("Method not implemented.");
    }

    copyFile(srcPath: string, destPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getFileInfo(filePath: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getSavedFileList(): Promise<{ filePath: string; size: number; createTime: number; }[]> {
        throw new Error("Method not implemented.");
    }
    mkdir(dirPath: string, recursive?: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    readdir(dirPath: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    async readFile<T extends string | ArrayBuffer>(filePath: string, encoding?: EncodingOption): Promise<T> {
        let res = await fetch(filePath);
        if (encoding !== 'binary')
            return await res.text() as T;
        return await res.arrayBuffer() as T;
    }
    removeSavedFile(filePath: string): Promise<void> {
        throw new Error("Method not implemented.");
    };
    rename(oldPath: string, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    };
    rmdir(dirPath: string, recursive?: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    };
    saveFile(tempFilePath: string, filePath?: string): Promise<void> {
        throw new Error("Method not implemented.");
    };
    stat(path: string, recursive?: boolean): Promise<{ [key: string]: import("../IFileSystemManager").Stats; } | import("../IFileSystemManager").Stats> {
        throw new Error("Method not implemented.");
    };
    unlink(filePath: string): Promise<void> {
        throw new Error("Method not implemented.");
    };
    unzip(zipFilePath: string, targetPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    };
    writeFile(filePath: string, data: string | ArrayBuffer, encoding?: EncodingOption): Promise<void> {
        throw new Error("Method not implemented.");
    }

}