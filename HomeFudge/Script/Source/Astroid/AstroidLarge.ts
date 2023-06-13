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

            this.setAllComponents(location);
            this.addRigidbody(location);

        }

        private setAllComponents(location: ƒ.Vector3): void {

            if (AstroidLarge.materialList == null || AstroidLarge.meshList == null) {
                console.warn(this.name + " Mesh and/or Material is missing");
                return;
            }

            //random mat/mesh selection:
            let selection: number = 0;

            this.addComponent(new ƒ.ComponentMaterial(AstroidLarge.materialList[selection]));
            this.addComponent(new ƒ.ComponentMesh(AstroidLarge.meshList[selection]));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(location)));
        }

        private addRigidbody(location: ƒ.Vector3) {
            let rotEffect: number = 0.0025;
            let spawnRotEffect: number = Config.astroid.size.LARGE.spawnRotSpeed;

            this.rigidBody = new ƒ.ComponentRigidbody(
                Config.astroid.size.LARGE.mass,
                ƒ.BODY_TYPE.DYNAMIC,
                ƒ.COLLIDER_TYPE.CUBE,
                ƒ.COLLISION_GROUP.DEFAULT,
                ƒ.Matrix4x4.TRANSLATION(location)
            );

            this.rigidBody.mtxPivot.scale(ƒ.Vector3.SUM(AstroidLarge.meshList[0].boundingBox.min, AstroidLarge.meshList[0].boundingBox.min));
            this.rigidBody.setPosition(location);
            this.rigidBody.restitution = 0.1;
            this.rigidBody.effectRotation = new ƒ.Vector3(rotEffect, rotEffect, rotEffect);
            this.rigidBody.dampRotation = 0;
            this.rigidBody.dampTranslation = 0;
            this.addComponent(this.rigidBody);

            this.rigidBody.setAngularVelocity(new ƒ.Vector3(
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2)
            ));
            spawnRotEffect = 100;
            this.rigidBody.setVelocity(new ƒ.Vector3(
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2)
            ));
        }


        constructor(location: ƒ.Vector3) {
            super("Astroid_Large_" + location.toString() + "_" + Date.now().valueOf());
            this.init(location);
        }
    }
}

