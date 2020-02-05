import { IRequestOptions, IRequestResponse } from "./IPlatform";

// https://developers.weixin.qq.com/minigame/dev/api/
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

declare namespace wx {

    // # 基础

    // ## 系统 -- 系统信息

    function getSystemInfoSync(): SystemInfo;
    function getSystemInfo(obj: {
        success: (res: SystemInfo) => void;
        fail?: () => void;
        complete?: () => void;
    }): void

    interface SystemInfo {
        /**
         * 手机品牌
         */
        brand: string;
        /** 
        * 手机型号
        */
        model: string;
        /**
         * 设备像素比
         */
        pixelRatio: number;
        /**
         * 屏幕宽度
         */
        screenWidth: number;
        /**
         * 屏幕高度
         */
        screenHeight: number;
        /**
         * 可使用窗口宽度
         */
        windowWidth: number;
        /**
         * 可使用窗口高度
         */
        windowHeight: number;
        /**
         * 状态栏的高度，单位px
         * @version 1.9.0
         */
        statusBarHeight: number
        /**
         * 微信设置的语言
         */
        language: string;
        /**
         * 微信版本号
         */
        version: string;
        /**
         * 操作系统版本
         */
        system: string;
        /**
         * 客户端平台
         */
        platform: string;
        /**
         * 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
         * @version 1.5.0
         */
        fontSizeSetting: number;
        /**
         * 客户端基础库版本
         */
        SDKVersion: number;
        /**
         * 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）
         */
        benchmarkLevel: number;
    }

    // ## 更新
    function getUpdateManager(): UpdateManager
    interface UpdateManager {
        applyUpdate: () => void;
        onCheckForUpdate: (callback: () => void) => void;
        onUpdateFailed: (callback: () => void) => void;
        onUpdateReady: (callback: () => void) => void;
    }

    // ## 小程序
    // ### 生命周期
    // ### 应用级事件
    // ### 触摸事件

    interface Touch {
        identifier: number;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number
    }

    interface TouchResult {
        touches: TouchList;
        changedTouches: TouchList;
        timeStamp: number;
    }

    function onTouchStart(callback: (res: TouchResult) => void): void;
    function onTouchMove(callback: (res: TouchResult) => void): void;
    function onTouchEnd(callback: (res: TouchResult) => void): void;
    function onTouchCancel(callback: (res: TouchResult) => void): void;
    function offTouchStart(callback: Function): void;
    function offTouchMove(callback: Function): void;
    function offTouchEnd(callback: Function): void;
    function offTouchCancel(callback: Function): void;




    let env: { USER_DATA_PATH: string }

    // # 渲染
    // 画布
    function createCanvas(): wx.Canvas;
    interface Canvas {
        width: number;
        height: number;
        getContext: (contextType: '2d' | 'webgl', contextAttributes?: wx.WebGLContextAttributes) => wxWebGLRenderingContext | CanvasRenderingContext2D;
        toDataURL: string;
        toTempFilePath(object: {
            x: number,
            y: number,
            width: number,
            height: number,
            destWidth: number,
            destHeight: number,
            fileType: 'jpg' | 'png',
            quality: number,
            success: () => void,
            fail?: () => void,
            complete?: () => void
        }): void;
        toTempFilePathSync(object: {
            x: number,
            y: number,
            width: number,
            height: number,
            destWidth: number,
            destHeight: number,
            fileType: 'jpg' | 'png',
            quality: number
        }): string
    }

    // 基础库 2.0.0 开始支持，低版本需做兼容处理。
    interface wxWebGLRenderingContext extends WebGLRenderingContext {
        wxBindCanvasTexture: (texture: number, canvas: wx.Canvas) => void
    }

    interface WebGLContextAttributes {
        antialias?: boolean;
        preserveDrawingBuffer?: boolean;
        antialiasSamples?: number;
    }

    // 图片

    function createImage(): wx.Image;
    interface Image {
        src: string;
        width: number;
        height: number;
        onload(): void;
        onerror(err: Error): void;
    }

    // 字体

    function getTextLineHeight(object: Object): void

    // 帧率

    function setPreferredFramesPerSecond(fps: number): void


    // 生命周期


    // 系统事件

    // 触摸事件

    /**
     * 设备
     */

    // 加速计

    // 电量

    // 剪贴板

    // 罗盘

    // 网络

    /*下载*/

    function downloadFile(object: {
        url: string,
        header?: Object,
        filePath?: string,
        success?: (tempFilePath: string, filePath: string, statusCode: number) => void,
        fail?: () => void,
        complete?: () => void
    }): DownloadTask

    interface DownloadTask {
        abort(): void,
        onProgressUpdate(callback: (res: { progress: number, totalBytesWritten: number, totalBytesExpectedToWrite: number }) => void): void,
        onHeadersReceived(callback: (res: { header: object }) => void): void,
        offProgressUpdate(callback: () => void): void,
        offHeadersReceived(callback: () => void): void,
    }
    // 屏幕

    // 振动

    /**
     *  文件
     */

    function getFileSystemManager(): wx.FileSystemManager
    interface FileItem { }
    interface FileSystemManager {
        // 在本地用户文件目录下创建一个文件 a.txt，写入内容 "hello, world"
        // const fs = wx.getFileSystemManager()
        // fs.writeFileSync(`${wx.env.USER_DATA_PATH}/hello.txt`, 'hello, world', 'utf8')

        /**
         * 获取文件信息
         */
        getFileInfo: (object: {
            filePath: string,
            success?: (size: number) => void,
            fail?: (errMsg: string) => void,
            complete?: () => void
        }) => void


        /**
         * 获取本地缓存文件列表
         */
        getSavedFileList: (object: {
            success?: (res: { errMsg: string, fileList: Array<string> }) => void,
            fail?: () => void,
            complete?: () => void
        }) => void

        /**
         * 删除本地缓存文件
         */
        removeSavedFile: (object: {
            success?: (res: Array<wx.FileItem>) => void,
            fail?: () => void,
            complete?: () => void
        }) => void;


        ENCODING: "ascii" | "base64" | "binary" | "hex" | "ucs2" | "ucs-2" | "utf16le" | "utf-16le" | "utf-8" | "utf8" | "latin1"

        writeFileSync: (
            filePath: string,
            file: string | ArrayBuffer,
            encoding: FileSystemManager["ENCODING"]
        ) => string

        readFileSync: (
            filePath: string,
            encoding: FileSystemManager["ENCODING"]
        ) => string
    }

    /**
     * 位置
     */

    /**
     *  网络
     */

    // 下载

    // 发起请求

    function request<T>(options: IRequestOptions): Promise<IRequestResponse<T>>

    // WebSocket

    // 上传


    /**
     * 开放接口
     */

    // 登陆

    // 授权

    // 用户信息

    // 设置

    // 微信运动

    /**
     *  转发
     */

    /**
     *  数据缓存
     */

    /**
     *  界面
     */

    // 交互

    // 键盘

    // 菜单

    // 窗口

    /**
     *  Worker
     */


    /**
     * 媒体
     */

    // 音频

    // 录音

    // 图片

    // 视频

    /**
     *  性能
    */

    function getPerformance(): Performance
    function triggerGC(): void
    interface Performance {
        now(): number
    }
    /**
     * 定时器
    */

    /**
     * 数据上报
     */


}