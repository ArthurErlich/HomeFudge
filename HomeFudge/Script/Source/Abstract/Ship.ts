/// <reference path="GameObject.ts" /> 
namespace HomeFudge{
    import ƒ = FudgeCore;
    enum SHIPS{
        DESTROYER
    }
    export abstract class Ship extends GameObject{
        public static SHIPS = SHIPS;
        protected abstract maxSpeed:number;
        protected abstract maxAcceleration:number;
        protected abstract maxTurnSpeed:number;

        protected abstract healthPoints:number;

        public abstract update():void;
        public abstract destroyNode():void; 

        constructor(name:string){
            super("Ship_" + name);
        }
    }

}