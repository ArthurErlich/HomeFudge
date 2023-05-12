namespace HomeFudge {
    import ƒ = FudgeCore;
    //TODO: add MouseClickOnce to get a one click press
    /**  
     * The  Mouse class is a TypeScript class that tracks mouse movement and button presses.
     * 
     * @static position: ƒ.Vector2;
     * @static movedDistance: ƒ.Vector2;
     * @ArthurErlich <arthur.erlich@hs-furtwangen.de>}
     */
    export class Mouse {

        public static position: ƒ.Vector2 = new ƒ.Vector2(0, 0);
        public static movedDistance: ƒ.Vector2 = new ƒ.Vector2(0, 0);
        public static isHidden: boolean = false;

        /**
         * This array should be the same length as the {@link MOUSE_CODE }
         */
        private static isPressed: Array<MOUSE_CODE> = new Array<MOUSE_CODE>(3); // length of MOUSE_CODE enum
        private static tempPos: ƒ.Vector2 = new ƒ.Vector2(0, 0);

        /**
         * This function initializes mouse event listeners and sets up variables for tracking mouse
         * movement.
         * @ArthurErlich <arthur.erlich@hs-furtwangen.de>
         */
        public static init(): void {
            _viewport.canvas.addEventListener("mousemove", Mouse.moveUpdate);
            _viewport.canvas.addEventListener("mousedown", Mouse.mouseDown);
            _viewport.canvas.addEventListener("mouseup", Mouse.mouseUp);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, Mouse.update);
        }
        /** 
         * This is a private static arrow function called `update` that is used to update the
         * `movedDistance` property of the `Mouse` class. It calculates the distance the mouse has
         * moved since the last frame by subtracting the current position of the mouse from the
         * previous position stored in `tempPos`. It then updates `tempPos` to the current position of
         * the mouse so that it can be used to calculate the distance moved in the next frame. 
         * @ArthurErlich <arthur.erlich@hs-furtwangen.de>
         */
        private static update = (): void => {
            Mouse.movedDistance.set(
                Mouse.tempPos.x - Mouse.position.x,
                Mouse.tempPos.y - Mouse.position.y
            );
            Mouse.tempPos = Mouse.position;
        }
        /** 
         * This is a private static arrow function called `moveUpdate` that is used to update the
         * `position` and `movedDistance` properties of the `Mouse` class when the mouse is moved. It
         * takes a `MouseEvent` object as its parameter and sets the `movedDistance` property to a new
         * `Vector2` object with the `movementX` and `movementY` properties of the `MouseEvent`. It
         * also sets the `position` property to a new `Vector2` object with the `x` and `y` properties
         * of the `MouseEvent`. 
        */
        private static moveUpdate = (_event: MouseEvent): void => {
            //switched to set for performance reasons.
            Mouse.movedDistance.set(_event.movementX, _event.movementY);
            Mouse.position.set(_event.clientX, _event.clientY);
        }

        /**
         * The function sets the corresponding value in the Mouse.isPressed array based on the button
         * pressed during a mouse down event.
         * 
         * @param _event The _event parameter is a MouseEvent object that contains information about
         * the mouse event that occurred, such as the type of event (e.g. mouse down, mouse up, mouse
         * move), the position of the mouse cursor, and which mouse button was pressed.
         */
        private static mouseDown(_event: MouseEvent) {
            switch (_event.button) {
                case MOUSE_CODE.RIGHT:
                    Mouse.isPressed[MOUSE_CODE.RIGHT] = MOUSE_CODE.RIGHT;
                    break;
                case MOUSE_CODE.LEFT:
                    Mouse.isPressed[MOUSE_CODE.LEFT] = MOUSE_CODE.LEFT;
                    break;
                case MOUSE_CODE.MIDDLE:
                    Mouse.isPressed[MOUSE_CODE.MIDDLE] = MOUSE_CODE.MIDDLE;
                    break;

                default:
                    break;
            }
        }
        /**
         * The function handles the mouse up event and updates the state of the mouse button that was
         * released.
         * 
         * @param _event The _event parameter is a MouseEvent object that contains information about
         * the mouse event that occurred, such as the type of event (e.g. mouseup), the target element
         * that triggered the event, and the position of the mouse cursor at the time of the event.
         */
        private static mouseUp(_event: MouseEvent) {
            switch (_event.button) {
                case MOUSE_CODE.RIGHT:
                    Mouse.isPressed[MOUSE_CODE.RIGHT] = null;
                    break;
                case MOUSE_CODE.LEFT:
                    Mouse.isPressed[MOUSE_CODE.LEFT] = null;
                    break;
                case MOUSE_CODE.MIDDLE:
                    Mouse.isPressed[MOUSE_CODE.MIDDLE] = null;
                    break;

                default:
                    break;
            }
        }
        /**
         * The function checks if any of the mouse buttons in the input array are currently pressed.
         * 
         * @param inputs An array of MOUSE_CODE values that represent the mouse buttons being checked
         * for being pressed.
         * @return A boolean value is being returned, which indicates whether the Mouse is pressed.
         */
        public static isPressedOne(inputs: Array<MOUSE_CODE>): boolean {
            for (let index: number = 0; index <= Mouse.isPressed.length; index++) {
                for (let inputIndex: number = 0; inputIndex < inputs.length; inputIndex++) {
                    if (inputs[inputIndex] == Mouse.isPressed[index]) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    /** 
     * Note: adding buttons means to lengthen the {@link Mouse.isPressed}
     */
    export enum MOUSE_CODE {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2
    }
}