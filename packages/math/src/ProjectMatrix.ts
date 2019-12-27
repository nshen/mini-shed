import { Matrix2D } from "./Matrix2D";
import { Matrix3D } from "./Matrix3D";

/**
 * 中心为原点,忽略z
 * @param width 
 * @param height 
 * @param flipY 如果为 false 则y轴向上为正，并且 rotation 逆时针为正。并且需要调用flipY确保贴图正确
 */
export function center2D(width: number, height: number, flipY: boolean = true): Matrix2D {
    return new Matrix2D(
        2 / width, 0,
        0, ((flipY ? -2 : 2) / height),
        0, 0
    );
}

/**
 * 3x3 矩阵，2D投影矩阵，忽略Z轴，直接投影为Canvas的宽高大小
 * 
 * @static
 * @param {number} width canvas width
 * @param {number} height canvas height
 * @param flipY 如果为 false 则y轴向上为正，并且 rotation 逆时针为正。并且需要调用flipY确保贴图正确
 * @returns (description)
 */
export function topleft2D(width: number, height: number, flipY: boolean = true): Matrix2D {
    if (flipY) {
        return new Matrix2D(2 / width, 0, 0, -2 / height, -1, 1);
    } else {
        return new Matrix2D(2 / width, 0, 0, 2 / height, -1, -1);
    }
}

// http://www.songho.ca/opengl/gl_projectionmatrix.html

export function perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix3D {
    return new Matrix3D(
        2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
        0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
        0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
        0.0, 0.0, -1.0, 0.0
    );
}

export function perspectiveRH(width: number, height: number, zNear: number, zFar: number): Matrix3D {
    return new Matrix3D(
        2.0 * zNear / width, 0.0, 0.0, 0.0,
        0.0, 2.0 * zNear / height, 0.0, 0.0,
        0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
        0.0, 0.0, -1.0, 0.0
    );
}

export function perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): Matrix3D {
    let yScale: number = 1.0 / Math.tan(fieldOfViewY / 2.0);
    let xScale: number = yScale / aspectRatio;
    return new Matrix3D(
        xScale, 0.0, 0.0, 0.0,
        0.0, yScale, 0.0, 0.0,
        0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
        0.0, 0.0, -1.0, 0.0
    );
}

export function orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix3D {
    return new Matrix3D(
        2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
        0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
        0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
        0.0, 0.0, 0.0, 1.0
    );
}

export function orthoRH(width: number, height: number, zNear: number, zFar: number): Matrix3D {
    return new Matrix3D(
        2.0 / width, 0.0, 0.0, 0.0,
        0.0, 2.0 / height, 0.0, 0.0,
        0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
        0.0, 0.0, 0.0, 1.0
    );
}