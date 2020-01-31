import { ECS, Entity, Group, System } from "../src/index";


let ecs: ECS;

beforeEach(() => {
    ecs = new ECS();
});

test('entity.has() should works', () => {
    let me = ecs.newEntity('me');
    me.add(
        { type: 'aaa' },
        { type: 'bbb' },
        { type: 'ccc' }
    );
    expect(me.has('aaa', 'bbb', 'ccc')).toBeTruthy();
    expect(me.has('ccc', 'bbb', 'aaa')).toBeTruthy();
    expect(me.has('aaa', 'bbb')).toBeTruthy();
    expect(me.has('aaa', 'ccc')).toBeTruthy();
    expect(me.has('bbb', 'ccc')).toBeTruthy();
    expect(me.has('aaa')).toBeTruthy();
    expect(me.has('bbb')).toBeTruthy();
    expect(me.has('ccc')).toBeTruthy();

    expect(me.has('ddd')).toBeFalsy();
    expect(me.has('aaa', 'ddd')).toBeFalsy();
    expect(me.has('aaa', 'bbb', 'ddd')).toBeFalsy();
    expect(me.has('aaa', 'bbb', 'ccc', 'ddd')).toBeFalsy();
    expect(me.has('bbb', 'ccc', 'ddd')).toBeFalsy();
});


test('group should works', () => {

    let componentA = { type: 'aaa' };
    let componentB = { type: 'bbb' };
    let componentC = { type: 'ccc' };
    let componentD = { type: 'ddd' };

    let e1 = ecs.addNewEntity('aaa', componentA);
    let e2 = ecs.addNewEntity('bbb', componentB);
    let e3 = ecs.addNewEntity('ccc', componentC);
    let e4 = ecs.addNewEntity('ddd', componentD);

    ecs.addNewEntity('bcd',
        componentB,
        componentC,
        componentD
    );

    ecs.addNewEntity('cd', componentC, componentD);
    ecs.addNewEntity('d', componentD);
    //-----------------

    let g1 = ecs.getGroup(componentA.type);
    expect(g1.length).toBe(1);

    let g2 = ecs.getGroup('aaa', 'bbb');
    expect(g2.length).toBe(0);

    let g3 = ecs.getGroup('aaa', 'bbb', 'ccc');
    expect(g3.length).toBe(0);

    let g4 = ecs.getGroup('ddd', 'bbb', 'ccc');
    expect(g4.length).toBe(1);

    expect(ecs.getGroup(componentB.type).length).toBe(2);
    expect(ecs.getGroup(componentC.type).length).toBe(3);
    expect(ecs.getGroup(componentD.type).length).toBe(4);
    expect(ecs.getGroup(componentD.type, componentC.type).length).toBe(2);

});

test('should System works', () => {


    class Com1System extends System {
        protected group1: Group;

        constructor(ecs: ECS) {
            super(ecs);
            this.group1 = this._ecs.getGroup('com1');
        }

        update() {
            expect(this.group1.length).toBe(1);
            // for (const entity of this.group1) {
            //     expect(entity.get('com1').x).toBe(3);
            //     expect(entity.get('com1').y).toBe(0);
            // }
            for (let i in this.group1.entityMap) {
                expect(this.group1.entityMap[i].get('com1').x).toBe(3);
                expect(this.group1.entityMap[i].get('com1').y).toBe(0);
            }
        }
    }


    ecs.addNewEntity('com',
        { type: 'com1', x: 3, y: 0 },
        { type: 'com2', img: 'sss.png' }
    );
    ecs.addSystem(new Com1System(ecs));

    ecs.update();


});