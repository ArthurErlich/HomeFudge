namespace HomeFudge {
    import ƒ = FudgeCore;
    export class Player extends ƒ.Node {
        public destroyer: Destroyer = null;
        private selectedWeapon: number = null; //TODO:Check if ok

        private moveDirection: ƒ.Vector3 = ƒ.Vector3.ZERO();
        private camRotBeforeChange: ƒ.Vector3 = null;

        private update = (): void => {
            this.camRotBeforeChange = _mainCamera.camComp.mtxPivot.rotation;
            if (Mouse.isPressedOne([MOUSE_CODE.LEFT])) {
                this.destroyer.fireWeapon(this.selectedWeapon);
            }

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                //LEFT
                this.destroyer.rotate(1);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                //RIGHT
                this.destroyer.rotate(-1);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //FORWARD
                this.moveDirection = new ƒ.Vector3(
                    1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                //BACKWARD
                this.moveDirection = new ƒ.Vector3(
                    -1,
                    this.moveDirection.y,
                    this.moveDirection.z
                );

            }
            //TODO move if check int a function to initiate the curser
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ONE])) {
                //Gatling
                if (this.selectedWeapon != this.destroyer.weapons.GatlingTurret) {
                    this.selectedWeapon = this.destroyer.weapons.GatlingTurret;
                    _viewport.canvas.style.cursor = "url(Textures/MouseAimCurser.png) 16 16, crosshair";
                }
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.TWO])) {
                //Beam
                if (this.selectedWeapon != this.destroyer.weapons.BeamTurret) {
                    this.selectedWeapon = this.destroyer.weapons.BeamTurret;
                    _viewport.canvas.style.cursor = "url(Textures/GatlingTurretAimCurser.png) 16 16, crosshair";
                }
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.THREE])) {
                //Rocket
                if (this.selectedWeapon != this.destroyer.weapons.RocketPod) {
                    this.selectedWeapon = this.destroyer.weapons.RocketPod;
                }
            }

            this.destroyer.move(this.moveDirection);
            this.moveDirection = ƒ.Vector3.ZERO();

            


            //TODO: use PlayerCamera instant of mainCamera
            //TODO: pan camera only a specific threshold
            _mainCamera.camComp.mtxPivot.rotation = new ƒ.Vector3(
                _mainCamera.camComp.mtxPivot.rotation.x,
                -(Mouse.position.x - (_viewport.canvas.width / 2)) / 100,
                _mainCamera.camComp.mtxPivot.rotation.z
            );
            _mainCamera.camComp.mtxPivot.rotation = this.camRotBeforeChange; // Resets cam rotation before using the cam rot mouse.
        }
        constructor(name: string) {
            super(name);
            this.destroyer = new Destroyer(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO()));
            this.addChild(this.destroyer);
            this.selectedWeapon = this.destroyer.weapons.GatlingTurret;//Set WP to one
            _viewport.canvas.style.cursor = "url(Textures/MouseAimCurser.png) 16 16, crosshair";//TODO: remove temp setting
            //inits Music Soundtrack
            let audioComp = new ƒ.ComponentAudio(new ƒ.Audio("Sound/Background/10.Cycles.mp3"), true); //TODO:Move sound to recourses
            //Sound by IXION!
            audioComp.volume = 0.1;
            audioComp.play(true);
            _mainCamera.camNode.addComponent(audioComp);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
    }
}