namespace HomeFudge {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
    export class UI_EnemySelection extends ƒ.Mutable {
        private static ui_RingSelection: HTMLDivElement;
        private static ui_HealthMeter: HTMLDivElement;

        //Helatbar lenght 6ev



        public static setPosition(pos: ƒ.Vector2):void {
            let widthSelector: number = (UI_EnemySelection.ui_RingSelection.clientWidth)/2;  
            let hightHealth: number = (UI_EnemySelection.ui_HealthMeter.clientHeight);      

            UI_EnemySelection.ui_RingSelection.style.top = (pos.y-widthSelector)+"px";
            UI_EnemySelection.ui_RingSelection.style.left = (pos.x-widthSelector)+"px";

            UI_EnemySelection.ui_HealthMeter.style.top = (pos.y-hightHealth-5)+"px";
            UI_EnemySelection.ui_HealthMeter.style.left = (pos.x+20)+"px";
        }
        public static setSize(distanceToPlayer:number):void{
            let widthSelector: number = (UI_EnemySelection.ui_RingSelection.clientWidth);
            let scale: number = 4000/distanceToPlayer;
            UI_EnemySelection.ui_RingSelection.style.width = scale+"vw";
            UI_EnemySelection.ui_RingSelection.style.height = scale+"vw";

        }
        public static setHealthBar(hpPercent:number):void{
            let healthSteps: number =  6/100;
            UI_EnemySelection.ui_HealthMeter.style.width = healthSteps*hpPercent+"vw";
        }
        private static initUiRingSelection():void{
            UI_EnemySelection.ui_RingSelection = document.querySelector("div#RingSelection");
            UI_EnemySelection.ui_RingSelection.style.position= "absolute";
            UI_EnemySelection.ui_RingSelection.style.visibility = "visible";
            UI_EnemySelection.ui_RingSelection.style.width = "2vw";
            UI_EnemySelection.ui_RingSelection.style.height = "2vw";
            UI_EnemySelection.ui_RingSelection.style.borderRadius= "100%";
            UI_EnemySelection.ui_RingSelection.style.borderColor=  "rgba(255, 0, 0, 0.5)";
            UI_EnemySelection.ui_RingSelection.style.borderStyle= "solid";
            UI_EnemySelection.ui_RingSelection.style.borderWidth= "-2px";
            UI_EnemySelection.ui_RingSelection.style.position= "absolute";
        }
        private static initUiHealthStatus():void{
            UI_EnemySelection.ui_HealthMeter = document.querySelector("div#HealthMeeter");
            UI_EnemySelection.ui_HealthMeter.style.visibility = "visible";
            UI_EnemySelection.ui_HealthMeter.style.position= "absolute";
            UI_EnemySelection.ui_HealthMeter.style.width = "6vw";
            UI_EnemySelection.ui_HealthMeter.style.height = "1vw";
            UI_EnemySelection.ui_HealthMeter.style.backgroundColor = "rgba(255, 0, 0, 0.8)";

        }

        constructor() {
            super();
            UI_EnemySelection.initUiRingSelection();
            UI_EnemySelection.initUiHealthStatus();
           
           

            new ƒUi.Controller(this, UI_EnemySelection.ui_RingSelection);
            // new ƒUi.Controller(this, UI_EnemySelection.uiHealthMeter);
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }

    }
}