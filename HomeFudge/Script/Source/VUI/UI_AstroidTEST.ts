namespace HomeFudge {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
    export class UI_AstroidTEST extends ƒ.Mutable {
        private static uiElement: HTMLDivElement;

        public static setPosition(pos: ƒ.Vector2) {
            let width: number = (UI_AstroidTEST.uiElement.clientWidth)/2;      

            UI_AstroidTEST.uiElement.style.top = (pos.y-width)+"px";
            UI_AstroidTEST.uiElement.style.left = (pos.x-width)+"px";
        }

        constructor() {
            super();

            UI_AstroidTEST.uiElement = document.querySelector("div#vui");
            UI_AstroidTEST.uiElement.style.visibility = "visible";
            UI_AstroidTEST.uiElement.style.width = "10vw";
            UI_AstroidTEST.uiElement.style.height = "10vw";
            new ƒUi.Controller(this, UI_AstroidTEST.uiElement);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }

    }
}