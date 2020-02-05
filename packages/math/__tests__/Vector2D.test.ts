import { Vector2D } from "../src/Vector2D";

test('vector2d', () => {
    expect(new Vector2D().x).toBe(0);
    expect(new Vector2D().y).toBe(0);
});

test('add should works', () => {
    let p = new Vector2D(1);
    let v = new Vector2D(2, 3);

    let result = new Vector2D(3, 3)
    expect(p.add(v)).toEqual(result)
    expect(p.equal(result)).toBeTruthy();
    expect(p.closeTo(result)).toBeTruthy();
})


test('sub or minus method and length', () => {
    let p = new Vector2D(0, -1);
    let i = new Vector2D(1, 1)
    expect(p.minus(i)).toEqual(new Vector2D(-1, -2))
    expect(p.length).toBeCloseTo(2.23607);

})

test('should lengthSquared be square of length', () => {

    let v = new Vector2D(123, 456);
    expect(v.length * v.length).toEqual(v.lengthSquared)

})

test('should scale works', () => {
    let v = new Vector2D(3, 4);
    expect(v.length).toEqual(5);

    v.scale(2)
    expect(v.length).toEqual(10);

    v.scale(.5);
    expect(v.length).toEqual(5);

})


test('should normalized vector have length of 1', () => {
    let i = new Vector2D(3, 4);
    let p = new Vector2D(1, 2);

    expect(i.minus(p).normalize().length).toBeCloseTo(1);

})





