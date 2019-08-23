export function calculateNormals(vs: number[], ind: number[]) {
    const x = 0;
    const y = 1;
    const z = 2;
    const ns = [];

    for (let i = 0; i < vs.length; i++) { //for each vertex, initialize normal x, normal y, normal z
        ns[i] = 0.0;
    }

    for (var i = 0; i < ind.length; i = i + 3) { //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
        var v1 = [];
        var v2 = [];
        var normal = [];

        // p2 - p1
        v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
        v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
        v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];

        // p0 - p1
        v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
        v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
        v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];

        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

        for (let j = 0; j < 3; j++) { //update the normals of that triangle: sum of vectors
            ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
            ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
            ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
        }
    }
    // Normalize the result.
    // The increment here is because each vertex occurs.
    for (let i = 0; i < vs.length; i += 3) {
        // With an offset of 3 in the array (due to x, y, z contiguous values)
        const nn = [];
        nn[x] = ns[i + x];
        nn[y] = ns[i + y];
        nn[z] = ns[i + z];

        let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
        if (len === 0) len = 1.0;

        nn[x] = nn[x] / len;
        nn[y] = nn[y] / len;
        nn[z] = nn[z] / len;

        ns[i + x] = nn[x];
        ns[i + y] = nn[y];
        ns[i + z] = nn[z];
    }

    return ns;

}