namespace HomeFudge {
    import ƒ = FudgeCore;
    export class AstroidLarge extends Astroid {
        private static graph: ƒ.Graph = null;

        private hitPoints = null;

        private static meshList: ƒ.Mesh[] = null;
        private static materialList: ƒ.Material[] = null;

        private rigidBody: ƒ.ComponentRigidbody = null;

        public override update(): void {

        }
        public override alive(): boolean {
            throw new Error("Method not implemented.");
        }
        public override remove(): void {
            throw new Error("Method not implemented.");
        }

        private async init(location: ƒ.Vector3) {
            /// needs to be moved to own class
            let nodeList: ƒ.Node[];
            AstroidLarge.graph = await Resources.getGraphResources(Config.destroyer.graphID);
            nodeList = await Resources.getMultiplyComponentNodes(Config.astroid.seedNodes.large, AstroidLarge.graph);//<-note: Config.astroid.seedNodes.large, is an array 

            AstroidLarge.meshList = Astroid.loadMeshList(nodeList);
            AstroidLarge.materialList = Astroid.loadMaterialList(nodeList);

            //sets the configs for this Astroid
            this.hitPoints = Config.astroid.size.LARGE.hitpoints;

            this.setAllComponents(location, nodeList.length);

        }

        private setAllComponents(location: ƒ.Vector3, selectionLength: number): void {

            if (AstroidLarge.materialList == null || AstroidLarge.meshList == null) {
                console.warn(this.name + " Mesh and/or Material is missing");
                return;
            }

            //random mat/mesh selection:
            let selection: number = Math.floor(Math.random() * selectionLength);

            this.addComponent(new ƒ.ComponentMaterial(AstroidLarge.materialList[selection]));
            this.addComponent(new ƒ.ComponentMesh(AstroidLarge.meshList[selection]));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(location)));

            this.rigidBody = AstroidLarge.setupRigidbody(location, AstroidLarge.meshList[selection].boundingBox.min, Config.astroid.size.LARGE.spawnRotSpeed);
            this.addComponent(this.rigidBody);

        }




        constructor(location: ƒ.Vector3) {
            super("Astroid_Large_" + location.toString() + "_" + Date.now().valueOf());
            this.init(location);
        }
    }
}

