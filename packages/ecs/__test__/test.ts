import { Entity } from "../src/Entity";
import { ECS } from "../src/ECS";

let ecs = new ECS();
let e: Entity = ecs.addNewEntity('test', { type: 'haha' })
console.log(e);

