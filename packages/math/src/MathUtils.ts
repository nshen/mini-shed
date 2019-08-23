/** convert degrees to radians */
export const Deg2Rad: number = Math.PI / 180;
/** convert radians to degrees */
export const Rad2Deg: number = 180 / Math.PI;
export const Epsilon: number = 1.0e-7;

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function mod(x: number, m: number) {
    return (x % m + m) % m;
}

/**
 * 角度转为[0,360)
 * @example normalizeAngle(-365) should be 355
 * @param angle 
 */
export function angleNormalize(angle: number): number {
    return mod(angle, 360);
}

/**
 * 浮点数相等
 */
export function floatEqual(float1: number, float2: number, diff: number = 0.0000005): boolean {
    return Math.abs(float1 - float2) < diff;
}


/**
 *  平滑移动
 * @param goal 
 * @param current 
 * @param dt 
 */
export function approach(goal: number, current: number, dt: number) {
    // https://www.youtube.com/watch?v=qJq7I2DLGzI&list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My&index=12
    let diff = goal - current;
    if (diff > dt)
        return current + dt; // 加速
    if (diff < -dt)
        return current - dt; // 减速
    return goal;
}

