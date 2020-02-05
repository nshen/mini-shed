import { Vector3D } from "../src/Vector3D";

test('collinear', () => {
    let p0 = new Vector3D();
    let p1 = new Vector3D(5, 0);
    let p2 = new Vector3D(3, 3);
    let p3 = new Vector3D(8, 0.00001);

    // 是否3点共线

    let v1 = Vector3D.cross(p1.clone().sub(p0), p2.clone().sub(p0));
    let v2 = Vector3D.cross(p1.clone().sub(p0), p3.clone().sub(p0))
    // console.log(v2)

    expect(v2.isZero()).toBeFalsy();
    expect(v2.nearZero()).toBeTruthy(); // 基本共线

    expect(v1.isZero()).toBeFalsy();
});


/**
 * 
 *  游戏常见的背后杀人backstab，知道R与B的位置以及敌人B的朝向v，R是否在B的后边？
 *
 *  R   <---   B  --->
 * 
 * @param playerPos 
 * @param enemyPos 
 * @param enemyView 单位向量
 */
function isBackstab(playerPos: Vector3D, enemyPos: Vector3D, enemyView: Vector3D) {

    // 首先计算敌人到我的单位向量
    let enemytoPlayer = enemyPos.clone().minus(playerPos).normalize();

    // 点乘完全同向则等于1
    // 点乘完全逆向则等于 -1
    // 点乘完全垂直则等于 0
    if (enemytoPlayer.dot(enemyView) < -0.5) {
        //这里必须大于垂直角，才能算后杀
        return true;
    }
    return false;
}



