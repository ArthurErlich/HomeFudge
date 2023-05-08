namespace HomeFudge {
    import ƒ = FudgeCore;
    export class LaserBeam extends ƒ.Node {

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private material: ƒ.Material = null;

        private async init(pos:ƒ.Vector3) {
            LaserBeam.graph = await Resources.getGraphResources(Config.laserBeam.graphID);
            let tempResource: ƒ.Node = await Resources.getComponentNode("LaserBeam", LaserBeam.graph);
            if(LaserBeam.mesh == null){
                LaserBeam.mesh = tempResource.getComponent(ƒ.ComponentMesh).mesh;
            }
            this.material = tempResource.getComponent(ƒ.ComponentMaterial).material;
            this.addComponents(pos);
        }
        private addComponents(pos:ƒ.Vector3) {
            this.addComponent(new ƒ.ComponentMaterial(this.material));
            this.addComponent(new ƒ.ComponentMesh(LaserBeam.mesh));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(pos)));
        }

        constructor(side: string,position:ƒ.Vector3) {
            super("LaserBeam" + side)
            this.init(position);
        }
    }
}