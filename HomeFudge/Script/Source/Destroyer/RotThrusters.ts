namespace HomeFudge {
    import ƒ = FudgeCore;
    export class RotThrusters extends ƒ.Node {

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;
        private static animation: ƒ.Animation = null;

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
            this.mtxLocal.scale(new ƒ.Vector3(4,4,4));

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
            this.addComponent(new ƒ.ComponentMesh(RotThrusters.mesh));
            this.addComponent(new ƒ.ComponentMaterial(RotThrusters.material));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            let animator = new ƒ.ComponentAnimator(RotThrusters.animation);
            animator.quantization = ƒ.ANIMATION_QUANTIZATION.DISCRETE;
            this.addComponent(animator);
        }

        constructor(side: string, position: ƒ.Vector3) {
            super(side + "RotThruster");
            this.init(side, position);
        }
    }

}