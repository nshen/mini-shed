export declare class FileHelper {
    static PROJECT_ROOT: string;
    static PROJECT_ENTRY: string;
    static PROJECT_PKG: string;
    static PROJECT_DIST: string;
    static PROJECT_DIST_H5: string;
    static PROJECT_DIST_WX: string;
    static PROJECT_DIST_QQ: string;
    static PROJECT_DIST_TT: string;
    static PROJECT_DIST_OPPO: string;
    static CLI_ROOT: string;
    static CLI_PLATFORMS: string;
    static init(): void;
    static json(path: string): Promise<any>;
    static exist(path: string): Promise<any>;
}
