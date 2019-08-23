import { Quaternion } from "../src/Quaternion";
import { Vector3D } from "../src/Vector3D";
import { Matrix3D } from "../src/Matrix3D";
import { Rad2Deg } from "../src/MathUtils";

test('绕X轴旋转应该等于对应的轴角', () => {
    let q = new Quaternion().fromAxisAngle(Vector3D.RIGHT, 33);
    let q2 = new Quaternion().rotateX(33);
    expect(q).toEqual(q2);
});

test('绕Y轴旋转应该等于对应的轴角', () => {
    let q = new Quaternion().fromAxisAngle(Vector3D.UP, 44);
    let q2 = new Quaternion().rotateY(44);
    expect(q).toEqual(q2);
});

test('绕Z轴旋转应该等于对应的轴角', () => {
    let q = new Quaternion().fromAxisAngle(Vector3D.FORWARD, 55);
    let q2 = new Quaternion().rotateZ(55)
    expect(q).toEqual(q2);
});

test('should rotateX/Y/Z works', () => {
    let q = new Quaternion().fromAxisAngle(Vector3D.RIGHT, 1.23);
    let q2 = new Quaternion().fromAxisAngle(Vector3D.UP, 2.34);
    let q3 = new Quaternion().fromAxisAngle(Vector3D.FORWARD, 3.45);

    q.append(q2).append(q3);

    let q4 = new Quaternion().rotateX(1.23).rotateY(2.34).rotateZ(3.45);
    expect(q.equal(q4)).toBeTruthy();

});

test('should rotateX/Y/Z do same thing as matrix', () => {


    let q = new Quaternion().rotateX(1.23).rotateY(2.34).rotateZ(3.45);
    let m = new Matrix3D().rotateX(1.23).rotateY(2.34).rotateZ(3.45);


    let q2m = new Matrix3D().fromQuaternion(q);

    expect(m.equal(q2m)).toBeTruthy();
    // let qm = new Quaternion().fromMatrix(m);


    // console.log(q4.dot(qm));
    // console.log(q.toString(), q4.toString());
    // expect(q).toEqual(q4);
    // expect(q4).toEqual(qm);
});

test('should quaternion equal works', () => {

    let q = new Quaternion().rotateX(1.23).rotateY(2.34).rotateZ(3.45);
    let m = new Matrix3D().rotateX(1.23).rotateY(2.34).rotateZ(3.45);


    let q2m = new Matrix3D().fromQuaternion(q);
    let m2q = new Quaternion().fromMatrix(m);

    expect(m.equal(q2m)).toBeTruthy();
    expect(q.equal(m2q)).toBeTruthy();

    // let qm = new Quaternion().fromMatrix(m);


    // console.log(q4.dot(qm));
    // console.log(q.toString(), q4.toString());
    // expect(q).toEqual(q4);
    // expect(q4).toEqual(qm);
});

test('should rotateVector works', () => {
    let m = new Matrix3D().rotateX(30).rotateY(40).rotateZ(112);
    let q = new Quaternion().fromMatrix(m);

    let right1 = Vector3D.RIGHT.clone();
    let right2 = Vector3D.RIGHT.clone();


    // 旋转一个方向向量
    m.transformVecotr(right1);
    q.rotateVector(right2);

    expect(right1.equal(right2, true)).toBeTruthy();

    let up1 = Vector3D.UP.clone();
    let up2 = Vector3D.UP.clone();

    // 矩阵可以旋转一个点，而四元数不能
    m.transformPoint(up1);
    q.rotateVector(up2);

    //此时 up1.w === 1 表示一个点， 而 up2.w ===0 表示一个方向
    expect(up1.equal(up2, true)).toBeFalsy();

    // 支持非单位向量
    right1.reset(13, 22, 34);
    right2.reset(13, 22, 34);


    // 旋转一个方向向量
    m.transformVecotr(right1);
    q.rotateVector(right2);

    expect(right1.equal(right2, true)).toBeTruthy();


})

test('Quaternion.Difference', () => {

    let q = new Quaternion().rotateX(123);
    let v = new Quaternion().rotateY(321);

    let out = Quaternion.Difference(q,v);

    expect(q.append(out).equal(v)).toBeTruthy();

    // let angle = Math.acos(q.dot(v)) * 2 * Rad2Deg;

    // expect(out.w).toEqual(q.dot(v));

});

test('Quaternion.Slerp', () => {

    let q = new Quaternion().rotateX(30);
    let v = new Quaternion().rotateY(40);

    let out = new Quaternion();

    
    
});
