namespace HomeFudge {
    import ƒ = FudgeCore;
    export class Player extends ƒ.Node {
        //temporary value
        private tempAimTarget = new ƒ.Vector3(100, 100, 0);

        public destroyer: Destroyer = null;
        public playerID: string = null;

        private selectedWeapon: number = null; //TODO:Check if ok

        private moveDirection: ƒ.Vector3 = ƒ.Vector3.ZERO();

        private update = (): void => {
            if (Mouse.isPressedOne([MOUSE_CODE.LEFT])) {
                this.destroyer.fireWeapon(this.selectedWeapon, this.tempAimTarget);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ALT_LEFT])) {
                console.error("Switch NOT IMPLEMENTED!!!");

            } else {
                //TODO: PointerLock disabled
                this.updateShipMovement();
            }
            this.updateWeaponSelection();

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
        private selectWeapon(weapon: number) {
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
            /*
            Rotation : 
             left ->this.destroyer.rotate(1);
             RIGHT ->this.destroyer.rotate(-1);

            */

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                //LEFT STARVE
                this.destroyer.rotateTo(this.destroyer.DIRECTION.YAW_LEFT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                //RIGHT STARVE
                this.destroyer.rotateTo(this.destroyer.DIRECTION.YAW_RIGHT);
            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //Down
                this.destroyer.rotateTo(this.destroyer.DIRECTION.PITCH_DOWN);
            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                //Up
                this.destroyer.rotateTo(this.destroyer.DIRECTION.PITCH_UP);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q])) {
                //Down
                this.destroyer.rotateTo(this.destroyer.DIRECTION.ROLL_LEFT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
                //Up
                this.destroyer.rotateTo(this.destroyer.DIRECTION.ROLL_RIGHT);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.C])) {
                //FORWARD
                //TODO:Move to Destroyer
                this.moveDirection.set(
                    1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );

            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.V])) {
                //BACKWARD
                //TODO:Move to Destroyer
                this.moveDirection.set(
                    -1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );
            }
        }
        private init() {
            this.initAudio();
            this.initShip(Ship.SHIPS.DESTROYER);
        }
        private initAudio() {
            //inits Music Soundtrack
            let audioComp = new ƒ.ComponentAudio(new ƒ.Audio("Sound/Background/10.Cycles.mp3"), true); //TODO:Move sound to recourses
            //Sound by IXION!
            audioComp.volume = 0.1;
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