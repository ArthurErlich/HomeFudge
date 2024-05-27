/// <reference path="UI.ts" />
namespace HomeFudge {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
    export class UI_Selection extends UI {
        public static focusedNode: Astroid = null;
        
        private static ringSelection: HTMLDivElement;
        private static healthMeter: HTMLDivElement;
        private static healthMeterNumber: HTMLElement;
        private static distanceNumbers: HTMLElement;
        private static connectionLine: HTMLElement;

        private static fontSize: number = null;

        private static healthBarWidth: number = null;
        private static healthBarHight: number = null;

        private static ringRadius: number = null;
        private static ringBorderWidth: number = null;

        private static maxNodeHealth: number = 0;
        private static actualNodeHealth: number = 0;



        public static setNodeToFocus(_focusedNode: ƒ.Node) {
            let node = _focusedNode as Astroid;

            //Fix for the time being. Later i will add an tag system
            if (!(node instanceof Astroid)) {
                UI_Selection.focusedNode = null;
                UI_Selection.ringSelection.style.visibility ="hidden";
                UI_Selection.healthMeter.style.visibility ="hidden";
                UI_Selection.healthMeterNumber.style.visibility ="hidden";
                return;

            } else {
                UI_Selection.ringSelection.style.visibility ="visible";
                UI_Selection.healthMeter.style.visibility ="visible";
                UI_Selection.healthMeterNumber.style.visibility ="visible";
                UI_Selection.focusedNode = node;
                UI_Selection.updateHealthBar();
            }

        }
        public update(): void {
            if (UI_Selection.focusedNode == null) {
                return;
            }

            let pos: ƒ.Vector2 = _viewport.pointWorldToClient(UI_Selection.focusedNode.mtxWorld.translation);
            let widthSelector: number = (UI_Selection.ringSelection.clientWidth) / 2;
            let hightHealth: number = (UI_Selection.healthMeter.clientHeight);

            UI_Selection.ringSelection.style.top = (pos.y - widthSelector) + "px";
            UI_Selection.ringSelection.style.left = (pos.x - widthSelector) + "px";

            UI_Selection.healthMeter.style.top = (pos.y - hightHealth - UI_Selection.ringRadius / 2) + "px";
            UI_Selection.healthMeter.style.left = (pos.x + UI_Selection.ringRadius / 2 + 20) + "px";

            UI_Selection.updateHealthBar();
            // UI_Selection.setSize("p1".destroyer.mtxWorld.translation.getDistance(this.focusedNode.mtxWorld.translation))

        }

        public static setSize(distanceToPlayer: number): void {
            return; // spots scaling
            //TODO: adding max and min scaling for the ui
            //replace vw to something  else. 
            let widthSelector: number = (UI_Selection.ringSelection.clientWidth);
            let scale: number = 4000 - distanceToPlayer;
            UI_Selection.ringSelection.style.width = scale + "vw";
            UI_Selection.ringSelection.style.height = scale + "vw";

        }
        public static updateHealthBar(): void {
            //only if astroid
            UI_Selection.maxNodeHealth = UI_Selection.focusedNode.getMaxHP();
            UI_Selection.actualNodeHealth = UI_Selection.focusedNode.getHP();

            let healthSteps: number = UI_Selection.healthBarWidth / UI_Selection.maxNodeHealth;
            UI_Selection.healthMeter.style.width = healthSteps * UI_Selection.actualNodeHealth + "px";
            UI_Selection.healthMeterNumber.innerText = UI_Selection.actualNodeHealth + "HP";
        }
        private static initUiRingSelection(): void {

            UI_Selection.ringSelection = document.querySelector("div#RingSelection");
            UI.globalSettings(UI_Selection.ringSelection);

            UI_Selection.ringSelection.style.width = UI_Selection.ringRadius + "px";
            UI_Selection.ringSelection.style.height = UI_Selection.ringRadius + "px";
            UI_Selection.ringSelection.style.borderRadius = "100%";
            UI_Selection.ringSelection.style.borderColor = "rgba(255, 0, 0, 0.5)";
            UI_Selection.ringSelection.style.borderStyle = "solid";
            UI_Selection.ringSelection.style.borderWidth = UI_Selection.ringBorderWidth + "px";

        }

        private static initUiHealthMeterStatus(): void {
            UI_Selection.healthMeter = document.querySelector("div#HealthMeeter");
            UI.globalSettings(UI_Selection.healthMeter);

            UI_Selection.healthMeter.style.borderRadius = "2px";
            UI_Selection.healthMeter.style.width = UI_Selection.healthBarWidth + "px";
            UI_Selection.healthMeter.style.height = UI_Selection.healthBarHight + "px";
            UI_Selection.healthMeter.style.backgroundColor = "rgba(200, 0, 0, 0.8)";

        }

        private static initUIHealtHMeterNumber(): void {

            if (document.querySelector("div#HealthMeeterNumber") == null) {
                UI_Selection.healthMeterNumber = document.createElement("div");
                UI_Selection.healthMeterNumber.id = "HealthMeeterNumber";
            } else {
                UI_Selection.healthMeterNumber = document.querySelector("div#HealthMeeterNumber")
            }
            UI.globalSettings(UI_Selection.healthMeterNumber);

            UI_Selection.healthMeterNumber.innerText = "1000 HP";
            UI_Selection.healthMeterNumber.style.color = "white";
            UI_Selection.healthMeterNumber.style.textAlign = "left";
            UI_Selection.healthMeterNumber.style.fontSize = UI_Selection.fontSize + "px";
            UI_Selection.healthMeterNumber.style.whiteSpace = "nowrap";
            UI_Selection.healthMeterNumber.style.textOverflow = "clip";
            UI_Selection.healthMeterNumber.style.padding = "2px";

            UI_Selection.healthMeterNumber.style.lineHeight = "normal";
            UI_Selection.healthMeterNumber.style.display = "inline-block";
            UI_Selection.healthMeterNumber.style.verticalAlign = "middle";

            UI_Selection.healthMeter.appendChild(UI_Selection.healthMeterNumber);
        }

        private static initUIConnectionLine(): void {
            UI_Selection.connectionLine = document.createElement("svg");

        //TODO: connect the Circle and Healthbar
            UI_Selection.healthMeter.appendChild(UI_Selection.connectionLine);

        }
        public static init(): void {
            //loadConfigs
            UI_Selection.fontSize = Config.ui.fontSize * Config.ui.scaling;
            UI_Selection.ringRadius = Config.ui.selection.selectionRingRadius * 2 * (Config.ui.scaling / 2);
            UI_Selection.ringBorderWidth = Config.ui.selection.ringBorderWidth * Config.ui.scaling;

            UI_Selection.healthBarHight = Config.ui.selection.healthBarHight * Config.ui.scaling;
            UI_Selection.healthBarWidth = Config.ui.selection.healthBarWidth * Config.ui.scaling;

            UI_Selection.initUiRingSelection();
            UI_Selection.initUiHealthMeterStatus();
            UI_Selection.initUIHealtHMeterNumber();
        }

        public static setScaleAndReload(scale: number): void {
            Config.ui.scaling = scale;
            UI_Selection.init();
        }
        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }
        constructor() {
            super();
            UI_Selection.init();
            new ƒUi.Controller(this, UI_Selection.ringSelection);
            new ƒUi.Controller(this, UI_Selection.healthMeter);
            new ƒUi.Controller(this, UI_Selection.healthMeterNumber);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }

    }
}