/// <reference path="GameObject.ts" /> 
namespace HomeFudge{
    enum SHIPS{
        DESTROYER
    }
    export abstract class Ship extends GameObject{
        public static SHIPS = SHIPS;
        public static DIRECTION = {
            FORWARDS:"FORWARDS",
            BACKWARDS:"BACKWARDS",
            LEFT:"LEFT",
            RIGHT:"RIGHT",
            YAW_LEFT:"YAW_LEFT",
            YAW_RIGHT:"YAW_RIGHT",
            PITCH_UP:"PITCH_UP",
            PITCH_DOWN:"PITCH_DOWN",
            ROLL_LEFT:"ROLL_LEFT",
            ROLL_RIGHT:"ROLL_RIGHT",
            OFF:"OFF"
        };

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