/// <reference path="UI.ts" />
namespace HomeFudge {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
    export class UI_FirstStart extends UI {
        private static mainCanvas: HTMLElement;
        public update(): void {
            return;
        }
        public static initCanvas():void{
            UI_FirstStart.mainCanvas = document.querySelector("div#MainFirstStart");
            if(UI_FirstStart.mainCanvas == null){
                throw new Error("UI First start html element is empty! " + UI_FirstStart.mainCanvas);
            }
            UI.globalSettings(UI_FirstStart.mainCanvas);
            
            UI_FirstStart.mainCanvas.style.width = "50px";
            UI_FirstStart.mainCanvas.style.height ="50px";
            UI_FirstStart.mainCanvas.style.top = (UI.height/2)-50/2+"px";
            UI_FirstStart.mainCanvas.style.left = (UI.width/2)-50/2+"px";

            UI_FirstStart.mainCanvas.style.backgroundColor="blue";
            UI_FirstStart.mainCanvas.style.visibility = "visible";
        }
        constructor(){
            super();
            UI_FirstStart.initCanvas();
            
            new ƒUi.Controller(this,  UI_FirstStart.mainCanvas);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }
    }
}