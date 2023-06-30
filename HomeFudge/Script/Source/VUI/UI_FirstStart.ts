/// <reference path="UI.ts" />
namespace HomeFudge {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class UI_FirstStart extends UI {
        private static mainCanvas: HTMLElement;

        private static rollLeft: HTMLElement;
        private static rollRight: HTMLElement;

        private static pitchUp: HTMLElement;
        private static pitchDown: HTMLElement;

        private static yawLeft: HTMLElement;
        private static yawRight: HTMLElement;

        private static forward: HTMLElement;
        private static backwards: HTMLElement;

        private static pressedButton:string[] = new Array(0);

        private static size: ƒ.Vector2 = new ƒ.Vector2(50, 50);

        public update(): void {
            UI_FirstStart.setAllButtonColors();
            return;
        }

        private static createButtons(name: string, pos: ƒ.Vector2):HTMLElement {
            let element:HTMLElement = document.createElement("div");
            element.style.width = this.size.x + "px";
            element.style.height = this.size.y + "px";
            UI.globalSettings(element);

            element.style.left = pos.x - (this.size.x / 2) + "px";
            element.style.top = pos.y - (this.size.y / 2) + "px";
            element.style.borderRadius = "2px";
            element.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            element.style.textAlign = "center";
            element.innerText = name;
            element.style.visibility = "visible";

            return element;
        }
        public static initCanvas(): void {

            UI_FirstStart.mainCanvas = document.querySelector("div#MainFirstStart");
            if (UI_FirstStart.mainCanvas == null) {
                throw new Error("UI First start html element is empty! " + UI_FirstStart.mainCanvas);
            }
            UI.globalSettings(UI_FirstStart.mainCanvas);
            if (GameStats.getPlayedStatus()) {
                return;
            }
            UI_FirstStart.mainCanvas.style.width = "1vw";
            UI_FirstStart.mainCanvas.style.height = "1vh";
            UI_FirstStart.mainCanvas.style.top = 0 + "px";
            UI_FirstStart.mainCanvas.style.left = 0 + "px";
            // UI_FirstStart.mainCanvas.style.backgroundColor = "blue";
            UI_FirstStart.mainCanvas.style.visibility = "visible";

            UI_FirstStart.rollLeft = UI_FirstStart.createButtons(Config.ui.buttons.ROLL_LEFT, new ƒ.Vector2(UI.width / 2 - 80, UI.height / 2 + 80));
            UI_FirstStart.rollRight = UI_FirstStart.createButtons( Config.ui.buttons.ROLL_RIGHT, new ƒ.Vector2(UI.width / 2 + 80, UI.height / 2 + 80));

            UI_FirstStart.forward = UI_FirstStart.createButtons( Config.ui.buttons.FORWARDS, new ƒ.Vector2(UI.width / 2 +250, UI.height / 2+100));
            UI_FirstStart.backwards = UI_FirstStart.createButtons( Config.ui.buttons.BACKWARDS, new ƒ.Vector2(UI.width / 2+250 , UI.height / 2 + 280));

            UI_FirstStart.yawLeft = UI_FirstStart.createButtons(Config.ui.buttons.YAW_LEFT, new ƒ.Vector2(UI.width / 2 - 180, UI.height / 2 + 200));
            UI_FirstStart.yawRight = UI_FirstStart.createButtons( Config.ui.buttons.YAW_RIGHT, new ƒ.Vector2(UI.width / 2 + 180, UI.height / 2 + 200));

            UI_FirstStart.pitchUp = UI_FirstStart.createButtons(Config.ui.buttons.PITCH_UP, new ƒ.Vector2(UI.width / 2, UI.height / 2  +50));
            UI_FirstStart.pitchDown = UI_FirstStart.createButtons(Config.ui.buttons.PITCH_DOWN, new ƒ.Vector2(UI.width / 2 , UI.height / 2+280 ));

            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.rollLeft);
            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.rollRight);

            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.forward);
            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.backwards);

            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.yawLeft);
            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.yawRight);

            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.pitchUp);
            UI_FirstStart.mainCanvas.appendChild(UI_FirstStart.pitchDown);

        }
        public static resetAllButtonColor(): void {

            this.pressedButton = new Array(0);

            this.rollLeft.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this.rollRight.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

            this.forward.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this.backwards.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

            this.yawLeft.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this.yawRight.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

            this.pitchDown.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this.pitchUp.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        }
        public static setButtonColor(BUTTONS: typeof Ship.DIRECTION[keyof typeof Ship.DIRECTION]): void {
            switch (BUTTONS) {
                case Ship.DIRECTION.FORWARDS:
                    this.pressedButton.push(Ship.DIRECTION.FORWARDS);
                    break;
                case Ship.DIRECTION.BACKWARDS:
                    this.pressedButton.push(Ship.DIRECTION.BACKWARDS);
                    break;
                case Ship.DIRECTION.YAW_LEFT:
                    this.pressedButton.push(Ship.DIRECTION.YAW_LEFT);
                    break;
                case Ship.DIRECTION.YAW_RIGHT:
                    this.pressedButton.push(Ship.DIRECTION.YAW_RIGHT);
                    break;
                case Ship.DIRECTION.PITCH_UP:
                    this.pressedButton.push(Ship.DIRECTION.PITCH_UP);
                    break;
                case Ship.DIRECTION.PITCH_DOWN:
                    this.pressedButton.push(Ship.DIRECTION.PITCH_DOWN);
                    break;
                case Ship.DIRECTION.ROLL_LEFT:
                    this.pressedButton.push(Ship.DIRECTION.ROLL_LEFT);
                    break;
                case Ship.DIRECTION.ROLL_RIGHT:
                    this.pressedButton.push(Ship.DIRECTION.ROLL_RIGHT);
                    break;
                default:
                    return;
            }
        }
        private static setAllButtonColors(){
            let color:string =  "rgba(255, 255, 255, 0.9)";
            this.pressedButton.forEach(e => {
                switch (e) {
                    case Ship.DIRECTION.FORWARDS:
                        this.forward.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.BACKWARDS:
                        this.backwards.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.YAW_LEFT:
                        this.yawLeft.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.YAW_RIGHT:
                        this.yawRight.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.PITCH_UP:
                        this.pitchUp.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.PITCH_DOWN:
                        this.pitchDown.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.ROLL_LEFT:
                        this.rollLeft.style.backgroundColor = color;
                        break;
                    case Ship.DIRECTION.ROLL_RIGHT:
                        this.rollRight.style.backgroundColor = color;
                        break;
                    default:
                        return;
                }
            });
        }

        constructor() {
            super();
            UI_FirstStart.initCanvas();

            new ƒUi.Controller(this, UI_FirstStart.mainCanvas);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }
    }
}