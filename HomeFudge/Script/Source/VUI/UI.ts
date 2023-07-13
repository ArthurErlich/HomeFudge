
namespace HomeFudge{
    import ƒ = FudgeCore;
    export abstract class UI extends ƒ.Mutable{
        static scale:number = null;
        static width:number = null;
        static height:number = null;
        static elements: UI[]=new Array(0);

        public abstract update():void;

        public static init():void{
            //List of UI elements to initialize
            UI.elements.push(new UI_Selection());
            UI.elements.push(new UI_FirstStart());
        };
        public static setScaleAndReload(scale:number):void{
        };
        public static globalSettings(element: HTMLElement) {
            element.style.visibility = "visible";
            element.style.position = "absolute";
            element.style.pointerEvents = "none";
        }
        
        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }
        constructor(){
            super();
            UI.scale = Config.ui.scaling;
            ƒ.Loop.addEventListener(UPDATE_EVENTS.UI, () => {
                this.update();
            });
            UI.width = _viewport.canvas.width;
            UI.height = _viewport.canvas.height;
        }
    }
}

//TODO: Move to "nice to have doc"
//Reflect.get(cmp,Audio,"source") <- hack way to get hidden stuff behind private members
//mtxPivot.mutate("{translation":{x:y, y:3}})
// using control for delay on the camera movement. Let the camera pivot node lags behinds the real world coordinate