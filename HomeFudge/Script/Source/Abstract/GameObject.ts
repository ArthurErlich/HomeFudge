namespace HomeFudge{
    import ƒ = FudgeCore;
    export  abstract class GameObject extends ƒ.Node{
        public abstract update():void;
        public abstract alive():boolean;
        public abstract remove():void;

        public getAliveGameobjects():GameObject[]{
            return GameLoop.getAliveGameobjects();
        }
        constructor(idString:string){
            super(idString +"_"); //+ (Math.random()*100) + location.toString() + "_" + Date.now().valueOf() plus random string to make the ame Unique. Maybe usefull -> Hash functions

            //TODO: TEST out updater list
            // GameLoop.addGameObject(this);// es mention in the GameLoop class, this is a future performance optimization.
            ƒ.Loop.addEventListener(UPDATE_EVENTS.GAME_OBJECTS, () => {
                this.update();
            });
        }
    }
}