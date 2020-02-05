import { Entity } from "./Entity";
import { ECS } from "./ECS";

let ecs = new ECS();
let e: Entity = ecs.addNewEntity('test', { type: 'haha' })
console.log(e);

