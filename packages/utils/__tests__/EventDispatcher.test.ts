import { EventDispatcher } from './../src/EventDispatcher';

test('event', done => {
    let e:EventDispatcher<any> = new EventDispatcher()
    e.on('testEvent', (arg: any) => {
        console.log(arg, typeof arg);
        expect(arg).toBe('1');
        done()
    })
    e.emit('testEvent', '1')
});

test('event with context', done => {

    let o: any = {}
    o.onTest = function (arg: any) {
        expect(arg).toBeUndefined();
        expect(this).toBe(o);
        done();
    }

    let e = new EventDispatcher();
    e.on('test', o.onTest, o); // last parameter
    e.emit('test')
});

test('event without context', done => {
    let o: any = {}
    o.onTest = function (arg: any) {
        expect(arg).toBeUndefined();
        expect(this).toBeNull();
        done();
    }

    let e = new EventDispatcher();
    e.on('test', o.onTest); // last parameter
    e.emit('test')
});

test('typed dispatcher', () => {
    
    let d = new EventDispatcher<[number, string, boolean]>();
    // d.on 和 d.emit 都会有类型信息
    d.on('event', (n, s, b) => {
        console.log(n.toString(), s.toUpperCase(), !b);
        expect(n.toString()).toEqual('1');
        expect(s.toUpperCase()).toEqual('B');
        expect(!b).toBeFalsy();
    })
    // d.emit('event', 1, 1, true); // compile error:  Argument of type '1' is not assignable to parameter of type 'string'
    d.dispatch('event', 1, 'b', true); // dispatch 是 emit 的别名

});