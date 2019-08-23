export interface IFileSystemManager {

    root: string;

    download(path: string, name: string, progressCallback?: () => void): Promise<string>;
    unzip(path: string): Promise<void>;
    access(path: string): Promise<void>;

    // downloadZip(path: string, name: string, progress: (n: number) => void): Promise<void>;


}