namespace HomeFudge {
    import ƒ = FudgeCore;
    export class RotThrusters extends ƒ.Node {

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;
        private static animation: ƒ.Animation = null;

        private meshComp: ƒ.ComponentMesh;

        private async init(side: string, position: ƒ.Vector3) {
            //TODO: remove debug
            //console.log("addling: "+ this.name);

            RotThrusters.graph = await Resources.getGraphResources(Config.destroyer.graphID);
            let node: ƒ.Node = await Resources.getComponentNode("ThrustExhaust", RotThrusters.graph);

            if (RotThrusters.material == null || RotThrusters.mesh == null) {
                RotThrusters.material = node.getComponent(ƒ.ComponentMaterial).material;
                RotThrusters.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
                RotThrusters.animation = node.getComponent(ƒ.ComponentAnimator).animation;
            }
            this.createComponents(position);
            this.mtxLocal.scale(new ƒ.Vector3(4, 4, 4));
            this.meshComp.activate(false);


            switch (side) {
                case "FL":
                    this.mtxLocal.rotateY(-90);
                    break;
                case "FR":
                    this.mtxLocal.rotateY(90);
                    break;
                case "BL":
                    this.mtxLocal.rotateY(-90);
                    break;
                case "BR":
                    this.mtxLocal.rotateY(90);
                    break;

                default:
                    break;
            }
        }
        private createComponents(position: ƒ.Vector3): void {
            this.meshComp = new ƒ.ComponentMesh(RotThrusters.mesh);
            this.addComponent(this.meshComp);
            this.addComponent(new ƒ.ComponentMaterial(RotThrusters.material));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            let animator = new ƒ.ComponentAnimator(RotThrusters.animation);
            animator.quantization = ƒ.ANIMATION_QUANTIZATION.DISCRETE;
            this.addComponent(animator);
        }
        public activate(activate: boolean) {
            this.meshComp.activate(activate);
        }
        public isActivated(): boolean {
            if (this.meshComp == null || this.meshComp == undefined) {
                return false;
            }
            return this.meshComp.isActive;
        }
        constructor(side: string, position: ƒ.Vector3) {
            super(side + "RotThruster");
            this.init(side, position);
        }
    }

}