namespace HomeFudge {
    import ƒ = FudgeCore;
    //TODO:create a logic for Hit detection. Using a physics engine of Fudge
    //TODO:move texturePivot to the Beck
    export class GatlingBullet extends Bullet {
        protected maxLifeTime: number = null;


        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;
        private static maxSpeed: number = null;

        private static seedRigidBody: ƒ.ComponentRigidbody = null;
        private rigidBody: ƒ.ComponentRigidbody = null;

        //TODO: try faction out.
        // faction: FACTION="FACTION.A";

        public update = (): void => {

            //goes out of the update loop as long the date is received into the config variable
            if (this.maxLifeTime == null || GatlingBullet.maxSpeed == null) {
                return
            }
            this.maxLifeTime -= _deltaSeconds;
            //TODO:Get Distance to Player cam and scale the size a of the mesh to make the bullet better visible at long distance

            //life check.
            if (!this.alive()) {
                this.destroyNode();
            }

        }
        private async init(initVelocity: ƒ.Vector3, spawnTransform: ƒ.Matrix4x4): Promise<void> {
            GatlingBullet.graph = await Resources.getGraphResources(Config.gatlingBullet.graphID);
            let node: ƒ.Node = await Resources.getComponentNode("GatlingBullet", GatlingBullet.graph);

            ///initAttributes\\\
            this.maxLifeTime = Config.gatlingBullet.maxLifeTime;
            GatlingBullet.maxSpeed = Config.gatlingBullet.maxSpeed;

            this.addComponents(node, spawnTransform);

            //fixes impulse direction.
            //TODO: move into function
            let localShootDir: ƒ.Vector3 = new ƒ.Vector3(GatlingBullet.maxSpeed, 0, 0);
            let gatRotAtZero: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
            gatRotAtZero.rotation = spawnTransform.rotation;
            let worldShootDir: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(localShootDir, gatRotAtZero);
            worldShootDir.add(initVelocity);
            this.rigidBody.setVelocity(worldShootDir);
        }
        private getNodeResources(node: ƒ.Node) {
            if (GatlingBullet.mesh == null) {
                GatlingBullet.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
            }
            if (GatlingBullet.material == null) {
                GatlingBullet.material = node.getComponent(ƒ.ComponentMaterial).material;
            }
            if (GatlingBullet.seedRigidBody == null) {
                console.log(node.getComponent(ƒ.ComponentRigidbody));

                GatlingBullet.seedRigidBody = node.getComponent(ƒ.ComponentRigidbody);
            }
        }
        private addComponents(node: ƒ.Node, spawnTransform: ƒ.Matrix4x4) {
            this.getNodeResources(node);
            this.addComponent(new ƒ.ComponentTransform(spawnTransform));
            this.addComponent(new ƒ.ComponentMesh(GatlingBullet.mesh));
            this.addComponent(new ƒ.ComponentMaterial(GatlingBullet.material));
            this.rigidBody = new ƒ.ComponentRigidbody(
                Config.gatlingBullet.mass,
                GatlingBullet.seedRigidBody.typeBody,
                GatlingBullet.seedRigidBody.typeCollider
            );
            this.rigidBody.mtxPivot = GatlingBullet.seedRigidBody.mtxPivot;
            this.rigidBody.setPosition(spawnTransform.translation);
            this.rigidBody.setRotation(spawnTransform.rotation);
            this.rigidBody.restitution = 0;
            this.rigidBody.dampTranslation = 0;
            this.addComponent(this.rigidBody);
        }

        public alive(): boolean {
            if (this.maxLifeTime == null) {
                return true;
            }
            return this.maxLifeTime >= 0;
        }
        public toString(): string {
            return this.name + "POSITION: " + this.mtxWorld.translation.toString();
        }
        public destroyNode(): void {
            //remove bullet from viewGraph
            //TODO:Verify if it is a valid approach // I need the Super class Bullet because I extended the Bullet Class to GatlingBullet
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            try {
                _worldNode.removeChild(this);

            } catch (error) {
                console.warn(error);
                ƒ.Loop.stop();
            }
        }
        constructor(initVelocity: ƒ.Vector3, spawnTransform: ƒ.Matrix4x4) {
            super("Gatling");
            this.init(initVelocity, spawnTransform);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
    }
}