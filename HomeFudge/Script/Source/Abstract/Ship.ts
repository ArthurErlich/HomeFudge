namespace HomeFudge{
    import ƒ = FudgeCore;
    export abstract class Ship extends ƒ.Node{
        protected abstract maxSpeed:number;
        protected abstract maxAcceleration:number;
        protected abstract maxTurnSpeed:number;

        protected abstract healthPoints:number;

        protected abstract update():void;
        public abstract destroyNode():void; 
        public abstract toString():string;

        constructor(name:string){
            super("Ship_" + name);
            //register to updater list
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, () => {
                this.update();
            });
        }
    }

}