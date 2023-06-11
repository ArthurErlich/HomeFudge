/// <reference path="../Abstract/GameObject.ts" />
namespace HomeFudge {

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
    }
}