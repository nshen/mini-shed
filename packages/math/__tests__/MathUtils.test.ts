import { angleNormalize } from "../src/MathUtils";

test('should AngleNormalize work', () => {
    expect(angleNormalize(370)).toEqual(10);
    expect(angleNormalize(-370)).toEqual(350);
})
