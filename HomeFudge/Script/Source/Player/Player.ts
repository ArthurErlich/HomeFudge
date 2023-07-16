namespace HomeFudge {
    import ƒ = FudgeCore;
    export class Player extends ƒ.Node {

        public destroyer: Destroyer = null;
        public playerID: string = null;

        private selectedWeapon: number = null; //TODO:Check if ok
        private selectedObject: ƒ.Node = null;

        private moveDirection: ƒ.Vector3 = ƒ.Vector3.ZERO(); // TODO: remove moveDirection -> better to do in the Destroyer.

        //empty list for the inputs to be listed. Makes so that if W and A is pressed both get executed in the end of the update.
        // private inputList: ƒ.KEYBOARD_CODE[] = null;

        private init() {
            this.initAudio();
            this.initShip(Ship.SHIPS.DESTROYER);
        }

        private update = (): void => {
            UI_FirstStart.resetAllButtonColor();
            if(Mouse.isPressedOne([MOUSE_CODE.RIGHT])) {
                let pickViewport: ƒ.Pick[] = ƒ.Picker.pickViewport(_viewport, Mouse.position);
        
                pickViewport.sort((a, b) => a.zBuffer - b.zBuffer);
                this.selectedObject = pickViewport[0].node;
                UI_Selection.setNodeToFocus(this.selectedObject);
            }
            if (Mouse.isPressedOne([MOUSE_CODE.LEFT])) {
                this.destroyer.fireWeapon(this.selectedWeapon, ƒ.Vector3.ZERO());
            }

            // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE."BUTTON"])) {
            //     console.error("Switch NOT IMPLEMENTED!!!");

            // } else {
            //     //TODO: PointerLock disabled
            // }
            this.updateShipMovement();
            this.updateWeaponSelection();

            //execute the movement commands TODO: refactor inputs to make that here work
            // for (let i: number = 0; i < this.inputList.length; i++){
            //     this.destroyer
            // }

            this.destroyer.move(this.moveDirection);
            this.moveDirection = ƒ.Vector3.ZERO();




            // //TODO: use PlayerCamera instant of mainCamera
            // //TODO: pan camera only a specific threshold
            //TODO: mouse panning for something elses
            // _mainCamera.camComp.mtxPivot.rotation = new ƒ.Vector3(
            //     _mainCamera.camComp.mtxPivot.rotation.x,
            //     -(Mouse.position.x - (_viewport.canvas.width / 2)) / 100,
            //     _mainCamera.camComp.mtxPivot.rotation.z
            // );
        }

        private selectWeapon(weapon: number): void {
            switch (weapon) {
                case this.destroyer.WEAPONS.GATLING_TURRET:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                        _viewport.canvas.style.cursor = "url(Textures/MouseAimCurser.png) 16 16, crosshair";
                    }
                    break;
                case this.destroyer.WEAPONS.BEAM_TURRET:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                        _viewport.canvas.style.cursor = "url(Textures/GatlingTurretAimCurser.png) 16 16, crosshair";
                    }
                    break;
                case this.destroyer.WEAPONS.ROCKET_POD:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                        _viewport.canvas.style.cursor = "crosshair";
                    }
                    break;
                default:
                    console.warn("no WP selected");
                    break;
            }
        }

        private updateWeaponSelection(): void {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ONE])) {
                //Gatling -> //TODO: Create Look on with mouse
                this.selectWeapon(this.destroyer.WEAPONS.GATLING_TURRET);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.TWO])) {
                //Beam
                this.selectWeapon(this.destroyer.WEAPONS.BEAM_TURRET);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.THREE])) {
                //Rocket
                this.selectWeapon(this.destroyer.WEAPONS.ROCKET_POD);
            }
        }
        private updateShipMovement() {

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                //LEFT STRAFE
                this.destroyer.rotateTo(Ship.DIRECTION.YAW_LEFT);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.YAW_LEFT);

            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                //RIGHT STRAFE
                this.destroyer.rotateTo(Ship.DIRECTION.YAW_RIGHT);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.YAW_RIGHT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //Down
                this.destroyer.rotateTo(Ship.DIRECTION.PITCH_DOWN);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.PITCH_DOWN);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                //Up
                this.destroyer.rotateTo(Ship.DIRECTION.PITCH_UP);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.PITCH_UP);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q])) {
                //Down
                this.destroyer.rotateTo(Ship.DIRECTION.ROLL_LEFT);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.ROLL_LEFT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
                //Up
                this.destroyer.rotateTo(Ship.DIRECTION.ROLL_RIGHT);
                UI_FirstStart.setButtonColor(Ship.DIRECTION.ROLL_RIGHT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.C])) {
                //FORWARD
                //TODO:Move to Destroyer
                this.moveDirection.set(
                    1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );
                UI_FirstStart.setButtonColor(Ship.DIRECTION.FORWARDS);

            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.V])) {
                //BACKWARD
                //TODO:Move to Destroyer
                this.moveDirection.set(
                    -1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );
                UI_FirstStart.setButtonColor(Ship.DIRECTION.BACKWARDS);
            }
        }
        private initAudio() {
            let audioComp = new ƒ.ComponentAudio(Audio.getBackgroundMusic(Audio.BACKGROUND_MUSIC.CYCLES), true);
            audioComp.volume = 0.01;
            audioComp.play(true);
            _mainCamera.camNode.addComponent(audioComp);//TODO: Change to player Camera
        }
        private initShip(ship: number) {
            switch (ship) {
                case Ship.SHIPS.DESTROYER:
                    this.destroyer = new Destroyer(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO()));
                    this.addChild(this.destroyer);
                    this.selectWeapon(this.destroyer.WEAPONS.BEAM_TURRET);
                    break;

                default:
                    console.warn("no Ship found: " + ship);
                    break;
            }

        }
        constructor(name: string) {
            super(name);
            this.init();
            ƒ.Loop.addEventListener(UPDATE_EVENTS.PLAYER_INPUT, () => {
                this.update();
            });
        }
    }
}