export class GridAxis {

    protected step: number;
    // protected half: number;
    constructor(size: number = 1.8, div: number = 10) {
        this.step = size / div;

        let half = size / 2;

        let verts = [];
        let p;
        for (let i = 0; i <= div; i++) {

            // 垂直
            p = -half + i * this.step;
            verts.push(p);		//x1
            verts.push(half);	//y1
            verts.push(0);		//z1
            verts.push(0);		//c2

            verts.push(p);		//x2
            verts.push(-half);	//y2
            verts.push(0);		//z2
            verts.push(1);		//c2

            //Horizontal line
            p = half - (i * this.step);
            verts.push(-half);	//x1
            verts.push(p);		//y1
            verts.push(0);		//z1
            verts.push(0);		//c1

            verts.push(half);	//x2
            verts.push(p);		//y2
            verts.push(0);		//z2
            verts.push(1);		//c2


        }

    }
}