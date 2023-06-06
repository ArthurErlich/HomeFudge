/// <reference path="../Abstract/GameObject.ts" />
namespace HomeFudge {
    import ƒ = FudgeCore;
    enum SIDE {
        LEFT,
        RIGHT
    }
    export class BeamTurret extends GameObject {
        public remove(): void {
            throw new Error("Method not implemented.");
        }
        public alive(): boolean {
            //TODO:remove beamturret on death
            return true;
        }

        public static side: typeof SIDE = SIDE;

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;
        private beamReady: boolean = true;

        private rotNode: ƒ.Node = null;

        private beam: LaserBeam = null
        private timer: ƒ.Time = new ƒ.Time();

        //TODO:readd declaration
        private maxRotSpeed: number = null;
        private maxPitch: number = null;
        private minPitch: number = null;
        private maxBeamTime: number = null;
        private maxReloadTime: number = null;



        private async init(side: number): Promise<void> {
            BeamTurret.graph = await Resources.getGraphResources(Config.beamTurret.graphID);
            let resourceNode: ƒ.Node = await Resources.getComponentNode("BeamTurret", BeamTurret.graph);
            if (BeamTurret.material == null || BeamTurret.mesh) {
                BeamTurret.material = resourceNode.getComponent(ƒ.ComponentMaterial).material;
                BeamTurret.mesh = resourceNode.getComponent(ƒ.ComponentMesh).mesh;
            }

            this.rotNode = new ƒ.Node("RotNode" + this.name);
            //Init turret configs

            //TODO: readd init...
            this.maxRotSpeed = Config.beamTurret.maxRotSpeed;
            this.maxPitch = Config.beamTurret.maxPitch;
            this.minPitch = Config.beamTurret.minPitch;
            this.maxBeamTime = Config.beamTurret.beamTime;
            this.maxReloadTime = Config.beamTurret.reloadTime;

            this.addChild(this.rotNode);
            let turretPos: ƒ.Vector3 = JSONparser.toVector3(Config.beamTurret.basePosition)
            switch (side) {
                case 0:
                    // TODO: remove debug
                    // console.log("adding Beam: LEFT");
                    this.addBeam("LEFT");
                    turretPos.set(turretPos.x, turretPos.y, -turretPos.z)
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(-90);;
                    break;
                case 1:
                    // TODO: remove debug
                    // console.log("adding Beam: RIGHT");
                    this.addBeam("RIGHT");
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(90);
                    break;
                default:
                    break;
            }
        }
        private addBeam(side: string): void {
            //TODO: BeamMaterial is buggy
            let beamPos: ƒ.Vector3 = JSONparser.toVector3(Config.beamTurret.beamPosition);
            this.beam = new LaserBeam(side, beamPos)
            this.rotNode.addChild(this.beam);


        }
        private addComponents(position: ƒ.Vector3) {
            // TODO: remove debug
            // console.log("attaching mtx translation: " + position);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            this.rotNode.addComponent(new ƒ.ComponentTransform());
            this.rotNode.addComponent(new ƒ.ComponentMaterial(BeamTurret.material));
            this.rotNode.addComponent(new ƒ.ComponentMesh(BeamTurret.mesh));
        }
        public update(): void{
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                this.rotate(this.maxRotSpeed * _deltaSeconds);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                this.rotate(-this.maxRotSpeed * _deltaSeconds);
        }
        private rotate(rot: number) {
            //ROTATION is only between -180° and 180°. Y starts at 0°
            //TODO:add rotation LOCK


            if (this.mtxLocal.rotation.x == -90) {
                this.rotNode.mtxLocal.rotateY(rot);
            }
            if (this.mtxLocal.rotation.x == 90) {
                this.rotNode.mtxLocal.rotateY(-rot);
            }
        }
        public fire() {
            console.log("is beam ready: " + this.beamReady);
            if (this.beamReady) {
                this.beamReady = false
                //Beam time
                this.timer.setTimer(4000, 1, () => {
                    this.beam.getComponent(ƒ.ComponentMesh).activate(false);
                    //Beam reload
                    this.timer.setTimer(4000, 1, () => {
                        this.beamReady = true;
                    });
                });
                this.beam.getComponent(ƒ.ComponentMesh).activate(true);
            }

        }
        public rotateTo(cordY: number) {
            //TODO: add rotation to logic, smooth rotate towards.
            this.rotate(cordY);
        }

        constructor(side: number) {
            super("BeamTurret");
            this.init(side);
        }
    }
}