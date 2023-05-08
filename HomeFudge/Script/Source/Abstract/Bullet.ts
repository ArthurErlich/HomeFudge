namespace HomeFudge {
    import ƒ = FudgeCore;
    /* This is a TypeScript class definition for an abstract class called `Bullet` that extends the
    `ƒ.Node` class. The `export` keyword makes the class available for use in other modules. */
    export abstract class Bullet extends ƒ.Node {
        protected abstract maxLifeTime:number;

        //abstract faction:string; //may be used later for multiple turrets
        public abstract update():void;
        public abstract destroyNode():void; 
        public abstract toString():string;

        constructor(idString:string){
            super("Bullet" + idString);
            _worldNode.addChild(this);
            //register to update event            
        }
    }
}