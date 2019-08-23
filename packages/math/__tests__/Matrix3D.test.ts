
import { Matrix3D } from '../src/Matrix3D';
import { Vector3D } from '../src/Vector3D';
import { Quaternion } from '../src/Quaternion';
import { Euler } from '../src/Euler';



test('invert', () => {
    let matA = new Matrix3D().fromTranslation(1, 2, 3)
    let res = new Matrix3D(
        1, 0, 0, -1,
        0, 1, 0, -2,
        0, 0, 1, -3,
        0, 0, 0, 1);

    expect((matA.invert() as Matrix3D).equal(res)).toBeTruthy()

})


test('matrix.rotateX() 应该等于 matrix.append(rotateXMatrix)', () => {

    let m = new Matrix3D()
    m.rotateX(33);

    let r = new Matrix3D().fromRotationX(33)
    let m1 = new Matrix3D()
    m1.append(r);

    expect(m.equal(m1)).toBeTruthy();

})

test('matrix.rotateY() 应该等于 matrix.append(rotateYMatrix)', () => {

    let m = new Matrix3D()
    m.rotateY(44);

    let r = new Matrix3D().fromRotationY(44)
    let m1 = new Matrix3D()
    m1.append(r);

    expect(m.equal(m1)).toBeTruthy();

})

test('matrix.rotateZ() 应该等于 matrix.append(rotateZMatrix)', () => {

    let m = new Matrix3D()
    m.rotateZ(55);

    let r = new Matrix3D().fromRotationZ(55)
    let m1 = new Matrix3D()
    m1.append(r);

    expect(m.equal(m1)).toBeTruthy();

})

test('matrix prepend append', () => {

    let m1 = new Matrix3D().fromRotationX(1.34);
    let m2 = new Matrix3D().fromScale(2, 3, 4);
    let m3 = new Matrix3D().fromTranslation(5, 3, 1);

    let r1 = new Matrix3D().append(m1).append(m2).append(m3)
    let r2 = new Matrix3D().prepend(m3).prepend(m2).prepend(m1)

    let r3 = new Matrix3D().multiply(m3).multiply(m2).multiply(m1);


    expect(r1.equal(r2)).toBeTruthy();
    expect(r1.equal(r3)).toBeTruthy();

})


test('should transformVector / Point works', () => {

    let right = new Vector3D(1, 0, 0);
    let up = new Vector3D(0, 1, 0);

    let m = new Matrix3D().fromRotationZ(90).translate(1, 2, 3);
    m.transformVecotr(right);
    expect(Math.abs(right.x - up.x)).toBeLessThan(0.000001);
    expect(Math.abs(right.y - up.y)).toBeLessThan(0.000001);
    expect(Math.abs(right.z - up.z)).toBeLessThan(0.000001);

    expect(m.transformPoint(up)).toEqual(new Vector3D(0, 2, 3, 1)) // 待测
})

test('rigit matrix should have determinant of one', () => {

    let rigid = new Matrix3D().fromRotationX(3.5).rotateZ(Math.PI).translate(111, .1, 2).rotateY(1.2);
    let affine = rigid.clone().scale(1.2, 1, 1)
    expect(rigid.determinant).toBeCloseTo(1);
    expect(affine.determinant).not.toBeCloseTo(1);
});

test('orthogonal matrix 正交矩阵转置等于逆', () => {

    let rigid = new Matrix3D().fromRotationX(3.5).rotateZ(Math.PI).rotateY(1.2);
    let invert = rigid.clone().invert() as Matrix3D;
    let transpose = rigid.clone().transpose();
    expect(invert.equal(transpose)).toBeTruthy()

})


test('should matrix to Quaternion works', () => {
    let m = new Matrix3D().rotateX(2.1).rotateX(1.2).rotateZ(33);
    // let q = new Quaternion().fromMatrix(m);
    let q2 = new Quaternion().fromMatrix(m);
    let m2 = new Matrix3D().fromQuaternion(q2)
    // let m3 = new Matrix3D().fromq
    // console.log(q,q2)

    // console.log(m.toString())
    // console.log(m2.toString())

    // let v1 = new Vector3D(1,2,3);
    // let v2 = new Vector3D(1,2,3);

    // m.transformVecotr(v1);
    // m2.transformVecotr(v2);
    // console.log(v1);
    // console.log(v2)
    expect(m.equal(m2)).toBeTruthy();
})

test('quatertion变换应该与matirx变换得到一样的结果 ', () => {

    let q1 = new Quaternion().fromAxisAngle(Vector3D.UP, 1.23);
    let q2 = new Quaternion().fromAxisAngle(Vector3D.RIGHT, 0.12);

    q1.multiply(q2)

    let m1 = new Matrix3D().fromRotationY(1.23);
    let m2 = new Matrix3D().fromRotationX(0.12);

    m1.multiply(m2)

    let res = new Matrix3D().fromQuaternion(q1)

    // console.log(res.toString())
    // console.log(m1.toString());

    expect(m1.equal(res)).toBeTruthy();



});


test('quaternion append prepend', () => {


    let q1 = new Quaternion().fromAxisAngle(Vector3D.UP, 1.23);
    let q2 = new Quaternion().fromAxisAngle(Vector3D.RIGHT, 2.34);


    let appendResult = q1.clone().append(q2);
    let prependResult = q2.clone().prepend(q1)
    expect(appendResult.equal(prependResult)).toBeTruthy();

});

test('quaternion rotate vector', () => {


    let v = new Vector3D(1, 0, 0);
    let v2 = v.clone()

    let q = new Quaternion().fromAxisAngle(Vector3D.FORWARD, Math.PI / 2);
    let m = new Matrix3D().fromRotationZ(Math.PI / 2);

    q.rotateVector(v);
    m.transformVecotr(v2)

    expect(v.equal(v2)).toBeTruthy();

})


test('fromRT should same as rotate then translate', () => {

    let r = new Quaternion().fromAxisAngle(Vector3D.RIGHT, 1.23);
    let t = new Vector3D(4, 5, 6);
    let rt = new Matrix3D().fromRT(r, t) // rotate -> translate

    let rotateMatrix = new Matrix3D().rotateX(1.23)
    rotateMatrix.translate(4, 5, 6);

    expect(rt.equal(rotateMatrix));


});

test('fromSRT', () => {

    let r = new Quaternion().fromAxisAngle(Vector3D.UP, 1.23);
    let t = new Vector3D(4, 5, 6);
    let s = new Vector3D(7, 8, 9);

    let srt = new Matrix3D().fromSRT(s, r, t) // rotate -> translate

    let m = new Matrix3D().rotateY(1.23)
    m.translate(4, 5, 6);
    m.scale(7, 8, 9)

    expect(srt.equal(m));


});

test('fromEuler', () => {

    let euler = new Euler(23, 0, 0); // rotate around y 1.23
    let m = new Matrix3D().fromEuler(euler);
    let expectMatrix = new Matrix3D().rotateY(23);
    expect(m.equal(expectMatrix)).toBeTruthy();

    euler = new Euler(30, 40, 50);
    m.fromEuler(euler);
    expectMatrix.identity().rotateY(30).rotateX(40).rotateZ(50);
    expect(m.equal(expectMatrix)).toBeTruthy();



});