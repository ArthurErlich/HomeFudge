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
            super(idString +"_"+ (Math.random()*100));

            GameLoop.addGameObject(this);
            //TODO: TEST out updater list
            ƒ.Loop.addEventListener(UPDATE_EVENTS.GAME_OBJECTS, () => {
                this.update();
            });
        }
    }
}