import { IPlatform } from "./IPlatform";
import { H5Platform } from "./h5/H5Platform";
import { WXPlatform } from "./wx/WXPlatform";
import { QQPlatform } from "./qq/QQPlatform";
import { TTPlatform } from "./tt/TTPlatform";
import { OPPOPlatform } from "./oppo/OPPOPlatform";

/*
__PLATFORM_H5__
__PLATFORM_WX__
__PLATFORM_QQ__
__PLATFORM_TT__
__PLATFORM_OPPO__
*/
export class Platform {
    protected static _platform: IPlatform;

    public static get(): IPlatform {
        if (!Platform._platform) {
            if (__PLATFORM_H5__)
                Platform._platform = new H5Platform();
            if (__PLATFORM_WX__)
                Platform._platform = new WXPlatform();
            if (__PLATFORM_QQ__)
                Platform._platform = new QQPlatform();
            if(__PLATFORM_TT__)
                Platform._platform = new TTPlatform();
            if(__PLATFORM_OPPO__)
                Platform._platform = new OPPOPlatform();

            if (!Platform._platform) {
                throw "@shed/platform 没有找到匹配平台";
            }
        }
        return Platform._platform;
    }


}
