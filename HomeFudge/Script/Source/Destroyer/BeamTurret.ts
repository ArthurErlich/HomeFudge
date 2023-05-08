namespace HomeFudge {
    import ƒ = FudgeCore;
    enum SIDE {
        LEFT,
        RIGHT
    }
    export class BeamTurret extends ƒ.Node {

        public static side: typeof SIDE = SIDE;

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;

        private rotNode:ƒ.Node = null;

        private beam: LaserBeam = null


        private maxRotSpeed: number;
        private maxPitch: number;
        private minPitch: number;
        private maxBeamTime: number;
        private maxReloadTime: number;
        private range: number;



        private async init(side: number): Promise<void> {
            BeamTurret.graph = await Resources.getGraphResources(Config.beamTurret.graphID);
            let resourceNode: ƒ.Node = await Resources.getComponentNode("BeamTurret", BeamTurret.graph);
            if (BeamTurret.material == null || BeamTurret.mesh) {
                BeamTurret.material = resourceNode.getComponent(ƒ.ComponentMaterial).material;
                BeamTurret.mesh = resourceNode.getComponent(ƒ.ComponentMesh).mesh;
            }

            this.rotNode = new ƒ.Node("RotNode" +this.name); 
            //Init turret configs

            this.maxRotSpeed = Config.beamTurret.maxRotSpeed;
            this.maxPitch = Config.beamTurret.maxPitch;
            this.minPitch = Config.beamTurret.minPitch;
            this.maxBeamTime = Config.beamTurret.beamTime;
            this.maxReloadTime = Config.beamTurret.reloadTime;
            this.range = Config.beamTurret.range;

            this.addChild(this.rotNode);
            let turretPos: ƒ.Vector3 = JSONparser.toVector3(Config.beamTurret.basePosition)
            switch (side) {
                case 0:
                    console.log("adding Beam: LEFT");
                    this.addBeam("LEFT");
                    turretPos.set(turretPos.x, turretPos.y, -turretPos.z)
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(-90);;
                    break;
                case 1:
                    console.log("adding Beam: RIGHT");
                    this.addBeam("RIGHT");
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(90);
                    break;
                default:
                    break;
            }
        }
        private addBeam(side: string): void {
            //TODO: BeamMaterial is disabled
            // let beamPos: ƒ.Vector3 = JSONparser.toVector3(Config.beamTurret.beamPosition);
            // this.beam = new LaserBeam(side, beamPos)
            // this.rotNode.addChild(this.beam);
   

        }
        private addComponents(position: ƒ.Vector3) {
            console.log("attaching mtx translation: " + position);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            this.rotNode.addComponent(new ƒ.ComponentTransform());
            this.rotNode.addComponent(new ƒ.ComponentMaterial(BeamTurret.material));
            this.rotNode.addComponent(new ƒ.ComponentMesh(BeamTurret.mesh));
        }
        private update = (): void => {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                this.rotate(this.maxRotSpeed * _deltaSeconds);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                this.rotate(-this.maxRotSpeed * _deltaSeconds);
        }
        private rotate(rot: number) {
            //ROTATION is only between -180° and 180°. Y starts at 0°
            //TODO:add rotation LOCK


            if(this.mtxLocal.rotation.x == -90){
                this.rotNode.mtxLocal.rotateY(rot);
            }
            if(this.mtxLocal.rotation.x == 90){
                this.rotNode.mtxLocal.rotateY(-rot);
            }
        }
        public fire() {
            throw new Error("Method not implemented.");
        }
        public rotateTo(cordY:number){
            this.rotate(cordY);
        }

        constructor(side: number) {2
            super("BeamTurret");
            this.init(side);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
    }
}