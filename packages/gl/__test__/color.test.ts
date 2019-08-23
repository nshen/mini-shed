
import { Color } from '../src/Color';

test('color.hsl', () => {
    let c = Color.random();
    let { h, s, l, a } = c.toHSLA();
    expect(Color.fromHSLA(h, s, l, a).equal(c)).toBeTruthy();
});
