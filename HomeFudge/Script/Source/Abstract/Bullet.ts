/// <reference path="GameObject.ts" />
namespace HomeFudge {
    export abstract class Bullet extends GameObject {
        protected abstract maxLifeTime:number;

        //abstract faction:string; //may be used later for multiple turrets
        public abstract update():void;
        public abstract destroyNode():void; 

        constructor(idString:string){
            super("Bullet" + idString);
            _worldNode.addChild(this);
            //register to update event            
        }
    }
}