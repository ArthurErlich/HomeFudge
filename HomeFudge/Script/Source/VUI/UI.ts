
namespace HomeFudge{
    import ƒ = FudgeCore;
    export abstract class UI extends ƒ.Mutable{
        static scale:number = null;
        static ui_elements: UI[]=new Array(0);

        public abstract update():void;

        public static init():void{
            //List of UI elements to initialize
            UI.ui_elements.push(new UI_Selection());
        };
        public static setScaleAndReload(scale:number):void{
            //updates UI elements to new Scale and re Initializes the elements.
            UI_Selection.setScaleAndReload(scale);
        };
        
        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }
        constructor(){
            super();
            UI.scale = Config.ui.scaling;
            ƒ.Loop.addEventListener(UPDATE_EVENTS.UI, () => {
                this.update();
            });
        }
    }

}