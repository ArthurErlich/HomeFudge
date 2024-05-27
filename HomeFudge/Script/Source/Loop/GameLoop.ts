/// <reference path="../Abstract/GameObject.ts" />
namespace HomeFudge {

    /*TODO: for now the GameLoop class wont do anything. It will replace the Custom Event. 
    Events ar nice to use but it would make more sense to have an Class which updates all the GameObjects. 
    The list also shows how many objects are alive and which on are ready to get cleared ot of the array.
    the collection and removing of the garbage will be done every so often, when possible it can be done on a different thread to boost up performance.

    */
    //Refactor Event handling to method handling
    //TODO: remove event handling and replace it with that:
    export class GameLoop {
        private static objects: GameObject[] = [];
        public static addGameObject(_object: GameObject) {
            console.warn("Mehtode should not be used jet!");
            return;
            GameLoop.objects.push(_object);
        }
        public static update(): void {
            GameLoop.objects.forEach(e => {
                if (e == null) {
                    return;
                }
                if (e.alive()) {
                    e.update();
                } else {
                    e = null;
                    e.remove();//TODO:Implement all remove functions
                }
            });
        }
        public static removeGarbage(): void {
            console.log(GameLoop.objects);
            GameLoop.objects.sort();
            console.log(GameLoop.objects);

            for (let i: number = 0; i < GameLoop.objects.length; i++) {
                //Splice nulls from array
            }
        }
        public static getAliveGameobjects():GameObject[]{
            return this.objects;
        }
    }
}