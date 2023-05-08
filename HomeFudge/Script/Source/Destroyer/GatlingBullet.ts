namespace HomeFudge {
    import ƒ = FudgeCore;
    //TODO:create a logic for Hit detection. Using a physics engine of Fudge
    //TODO:move texturePivot to the Beck
    export class GatlingBullet extends Bullet {
        protected maxLifeTime: number = null;
        protected maxSpeed: number = null;
        protected spreadRadius: number = null;

        private parentVelocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

        private static graph: ƒ.Graph = null;
        private static mesh: ƒ.Mesh = null;
        private static material: ƒ.Material = null;

        //TODO: try faction out.
        // faction: FACTION="FACTION.A";

        public update = (): void => {
            //goes out of the update loop as long the date is received into the config variable
            if (this.maxLifeTime == null || this.maxSpeed == null) {
                return
            }
            this.maxLifeTime -= _deltaSeconds;
            this.mtxLocal.translate( new ƒ.Vector3(
                (this.parentVelocity.x + this.maxSpeed) * _deltaSeconds,
                2*this.parentVelocity.y * _deltaSeconds,
                2*this.parentVelocity.z * _deltaSeconds
                ));

                //TODO:Get Distance to Player cam and scale the size a of the mesh to make the bullet better visible at long distance

            //life check.
            if (!this.alive()) {
                this.destroyNode();
            }
        }
        private async initBulletConfig(): Promise<void> {
            GatlingBullet.graph = await Bullet.getGraphResources(Config.gatlingBullet.graphID);

            ///initAttributes\\\
            this.maxLifeTime = Config.gatlingBullet.maxLifeTime;
            this.maxSpeed = Config.gatlingBullet.maxSpeed;

            let node: ƒ.Node = await Bullet.getComponentNode("GatlingBullet", GatlingBullet.graph);
            if (GatlingBullet.mesh == null) {
                GatlingBullet.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
            }
            if (GatlingBullet.material == null) {
                GatlingBullet.material = node.getComponent(ƒ.ComponentMaterial).material;
            }

            this.addComponent(new ƒ.ComponentMesh(GatlingBullet.mesh));
            this.addComponent(new ƒ.ComponentMaterial(GatlingBullet.material));


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
        constructor(spawnTransform: ƒ.Matrix4x4, _parentVelocity: ƒ.Vector3) {
            super("Gatling");
            this.addComponent(new ƒ.ComponentTransform(spawnTransform));
            ///\\\
            this.parentVelocity = _parentVelocity;
            this.initBulletConfig();
            //TODO:Make that cleaner TEMP FIX 
            let copy =_parentVelocity.clone;
            copy.scale(_deltaSeconds*5);
            this.mtxLocal.translate(copy);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
    }
}