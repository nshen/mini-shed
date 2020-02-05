import { parse } from '@loaders.gl/core';
import { OBJLoader, OBJWorkerLoader } from '@loaders.gl/obj'


async function init() {

    let d = await(fetch('./assets/bunny.obj'));
    console.log(d);
    let data = await parse(d,OBJLoader)
    console.log(data)
    // let data = await parse(fetch('./assets/bunny.obj'), OBJLoader);

}

init();