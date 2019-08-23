import { Matrix2D } from '../src/Matrix2D';
import { Vector2D } from '../src/Vector2D';

test('new Matrix2D', () => {
    let identity = new Matrix2D(1, 0, 0, 1, 0, 0);
    let m = new Matrix2D();
    expect(m).toEqual(identity);
});

// getter
// ----------------------

test('float32Array', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    expect(a.float32Array).toEqual(new Float32Array([1, 2, 0, 3, 4, 0, 5, 6, 1]))
});

test('determinant', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6)
    expect(a.determinant).toEqual(-2);
});

// methods
// --------------------

test('identity', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    expect(a.identity()).toEqual(new Matrix2D(1, 0, 0, 1, 0, 0));
});

// scale rotate translate
// ------------------------

test('scale', () => {
    let a = new Matrix2D(1, 0, 0, 1, 0, 0);

    a.scale(2); // === a.scale(2,2);
    expect(a.equal(new Matrix2D(2, 0, 0, 2, 0, 0))).toBeTruthy();
});

test('rotate', () => {
    let a = new Matrix2D().rotate(33.3);
    let b = new Matrix2D().fromSRT(1, 1, 33.3, 0, 0);
    expect(a).toEqual(b);
});

test('translate', () => {
    let a = new Matrix2D();
    a.translate(11, 22);
    expect(a).toEqual(new Matrix2D().fromSRT(1, 1, 0, 11, 22));
});

test('fromSRT', () => {
    let a = new Matrix2D().fromSRT(1, 1, 0, 2, 3)
    let b = new Matrix2D().scale(1, 1).rotate(0).translate(2, 3)
    expect(a).toEqual(b);

    a.fromSRT(2, 3, 4, 5, 6);
    b = new Matrix2D().scale(2, 3).rotate(4).translate(5, 6);
    expect(a).toEqual(b);

    a.fromSRT(2, 3, 4, 5, 6);

});

test('fromTranslation fromRotation fromScale multiply together should equal fromSRT', () => {

    let scale = new Matrix2D().fromScale(2, 3);
    let rotate = new Matrix2D().fromRotation(128);
    let translate = new Matrix2D().fromTranslation(7, 8);

    let a = new Matrix2D().append(scale).append(rotate).append(translate);
    let b = new Matrix2D().scale(2, 3).rotate(128).translate(7, 8);
    expect(a).toEqual(b)

    let c = new Matrix2D().fromSRT(2, 3, 128, 7, 8)

    expect(a).toEqual(c)

})

test('append should be inverse of prepend', () => {
    let a = new Matrix2D().fromSRT(2, 3, 4, 5, 6);
    // let a = new Matrix2D(1, 2, 3, 4, 5, 6);

    let b = new Matrix2D().fromSRT(9, 8, 7, 6, 5);
    // let b = new Matrix2D(9, 8, 7, 6, 5, 4);
    expect(a.clone().append(b)).toEqual(b.clone().prepend(a));

})

test('invert', () => {

    let a = new Matrix2D().rotate(113).translate(3, 5).scale(7, 8);
    let inverseA = a.clone().invert();

    expect(a.multiply(inverseA).equal(new Matrix2D())).toBeTruthy();
});

test('should transformVector works', () => {

    let right = new Vector2D(1, 0);
    let m = new Matrix2D().rotate(90).translate(2, 3);
    expect(m.transformVector(right).equal(new Vector2D(0, 1))).toBeTruthy();

});

test('should transformVector works', () => {
    let right = new Vector2D(1, 0);
    let m = new Matrix2D().rotate(90).translate(2, 3);
    expect(m.transformPoint(right).equal(new Vector2D(2, 4))).toBeTruthy();
});

// common methods

test('reset', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    a.reset(6, 5, 4, 3, 2, 1);
    expect(a.equal(new Matrix2D(6, 5, 4, 3, 2, 1))).toBeTruthy();
});

test('equal', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    let b = new Matrix2D(1, 2, 3, 4, 5, 6);
    let c = new Matrix2D(1, 2, 3, 4, 5, 7);
    expect(a).toEqual(b);
    expect(a.equal(c)).toBeFalsy();
});

test('copyFrom ', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    let b = new Matrix2D();
    b.copyFrom(a)
    expect(a).toEqual(b);
});

test('clone ', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    let b = a.clone();
    expect(a).toEqual(b);
});

test('toString ', () => {
    let a = new Matrix2D(1, 2, 3, 4, 5, 6);
    expect(a.toString()).toEqual("[Matrix2D](1,2,0,3,4,0,5,6,1)");
});

//--------------------