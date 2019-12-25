
export type EncodingOption = 'ascii' | 'base64' | 'binary' | 'hex' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | 'utf-8' | 'utf8' | 'latin1';

export interface Stats {
    mode: string;
    size: number;
    lastAccessedTime: number;
    lastModifiedTime: number;
    isDirectory: () => boolean;
    isFile: () => boolean;
}

/**
 *  通用文件管理器，全部 Promis 化
 */
export interface IFileSystemManager {

    // root: string;

    /**
     * 本地用户目录
     */
    USER_DATA_PATH: string;

    /**
     * 判断文件/目录是否存在
     * @param path 要判断是否存在的文件/目录路径 (本地路径)
     */
    access(path: string): Promise<boolean>;

    /**
     * 在文件结尾追加内容
     * @param object 
     */
    appendFile(filePath: string, data: string | ArrayBuffer, encoding?: EncodingOption): Promise<void>;

    /**
     * 复制文件
     * @param srcPath 
     * @param destPath 
     */
    copyFile(srcPath: string, destPath: string): Promise<void>;

    /**
     * 取得文件大小，以字节为单位
     * @param filePath 
     */
    getFileInfo(filePath: string): Promise<number>;

    /**
     * 获取该小程序下已保存的本地缓存文件列表
     */
    getSavedFileList(): Promise<{ filePath: string, size: number, createTime: number }[]>

    /**
     * 创建目录
     * @param dirPath 
     * @param recursive 
     */
    mkdir(dirPath: string, recursive?: boolean): Promise<void>;

    /**
     * 读取目录内文件列表
     * @param dirPath 
     */
    readdir(dirPath: string): Promise<string[]>;

    /**
     * 读取本地文件内容
     * @param filePath 
     * @param encoding 
     */
    readFile(filePath: string, encoding?: EncodingOption): Promise<string | ArrayBuffer>;

    /**
     * 删除该小程序下已保存的本地缓存文件
     * @param filePath 
     */
    removeSavedFile(filePath: string): Promise<void>;

    /**
     * 重命名文件。可以把文件从 oldPath 移动到 newPath
     * @param oldPath 
     * @param newPath 
     */
    rename(oldPath: string, newPath: string): Promise<void>;

    /**
     * 删除目录
     * @param dirPath 
     * @param recursive 
     */
    rmdir(dirPath: string, recursive?: boolean): Promise<void>;

    /**
     * 保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。
     * @param tempFilePath 
     * @param filePath 
     */
    saveFile(tempFilePath: string, filePath?: string): Promise<void>;

    /**
     * 获取文件 Stats 对象
     * @param path 
     * @param recursive 
     */
    stat(path: string, recursive?: boolean): Promise<{ [key: string]: Stats } | Stats>;

    /**
     * 删除文件
     * @param filePath 
     */
    unlink(filePath: string): Promise<void>

    /**
     * 解压文件
     * @param zipFilePath 
     * @param targetPath 
     */
    unzip(zipFilePath: string, targetPath: string): Promise<void>

    writeFile(filePath: string, data: string | ArrayBuffer, encoding?: EncodingOption):Promise<void>


}