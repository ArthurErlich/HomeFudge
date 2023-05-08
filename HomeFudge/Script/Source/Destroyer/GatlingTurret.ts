namespace HomeFudge {
    import ƒ = FudgeCore;

    //TODO:create super class Turret. GatlingTurret and BeamTurret extends Turret
    export class GatlingTurret extends ƒ.Node {

        //TODO: make Private again
        public headNode: ƒ.Node = null;
        public baseNode: ƒ.Node = null;
        private shootNode: ƒ.Node = null;

        private static headMesh: ƒ.Mesh = null;
        private static baseMesh: ƒ.Mesh = null;
        private static headMaterial: ƒ.Material = null;
        private static baseMaterial: ƒ.Material = null;

        private roundsPerSecond: number = null;
        private reloadsEverySecond: number = null;
        private roundsTimer: number = 0;
        private reloadTimer: number = 0;

        private magazineCapacity: number = null;
        private magazineRounds: number = null;

        private async initConfigAndAllNodes(): Promise<void> {

            let graph: ƒ.Graph = await Resources.getGraphResources(Config.gatlingTurret.graphID);

            //TODO|ON-HOLD| REWRITE Turret Mesh and Material component gathering and attaching -> like Destroyer Class
            this.headNode = this.createComponents("GatlingTurretHead", JSONparser.toVector3(Config.gatlingTurret.headPosition), graph);
            this.baseNode = this.createComponents("GatlingTurretBase", JSONparser.toVector3(Config.gatlingTurret.basePosition), graph);
            //TODO:FixWrongShootNode Position. Shoots above the Barrel
            this.shootNode = this.createShootPosNode(JSONparser.toVector3(Config.gatlingTurret.shootNodePosition));

            this.roundsPerSecond = Config.gatlingTurret.roundsPerSeconds;
            this.reloadsEverySecond = Config.gatlingTurret.reloadTime;
            this.magazineCapacity = Config.gatlingTurret.magazineCapacity;
            this.magazineRounds = this.magazineCapacity;

            this.shootNode.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/autocannon.mp3")));//TODO: REMOVE TEMP AUDIO move to Resources

            this.headNode.addChild(this.shootNode);
            this.baseNode.addChild(this.headNode);
            this.addChild(this.baseNode);


        }
        private createComponents(nodeName: string, transform: ƒ.Vector3, graph: ƒ.Graph): ƒ.Node {
            let node: ƒ.Node = graph.getChildrenByName(nodeName)[0];
            let newNode: ƒ.Node = new ƒ.Node("nodeName");
            if (node == null) {
                console.warn("+\"" + nodeName + "\" not found inside: " + graph.name + "->Graph");
            }
            switch (nodeName) {
                case "GatlingTurretHead":
                    GatlingTurret.headMaterial = node.getComponent(ƒ.ComponentMaterial).material;
                    GatlingTurret.headMesh = node.getComponent(ƒ.ComponentMesh).mesh;
                    newNode.addComponent(new ƒ.ComponentMaterial(GatlingTurret.headMaterial));
                    newNode.addComponent(new ƒ.ComponentMesh(GatlingTurret.headMesh));
                    break;
                case "GatlingTurretBase":
                    GatlingTurret.baseMaterial = node.getComponent(ƒ.ComponentMaterial).material;
                    GatlingTurret.baseMesh = node.getComponent(ƒ.ComponentMesh).mesh;
                    newNode.addComponent(new ƒ.ComponentMaterial(GatlingTurret.baseMaterial));
                    newNode.addComponent(new ƒ.ComponentMesh(GatlingTurret.baseMesh));
                    break;
                default:
                    console.warn("+\"" + nodeName + "\" no material or mesh found inside: " + graph.name + "->Graph");
                    break;
            }
            newNode.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(transform)));
            return newNode;
        }
        private createShootPosNode(transform: ƒ.Vector3): ƒ.Node {
            let shootPosNode: ƒ.Node = new ƒ.Node("ShootSpawnPos");
            shootPosNode.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(transform))); //From gatConfig.json
            return shootPosNode;
        }
        private update = (): void => {
            if (this.roundsPerSecond == null || this.reloadsEverySecond == null || this.magazineCapacity == null) {
                return;
            }
            if (this.roundsTimer <= this.roundsPerSecond) {
                this.roundsTimer += _deltaSeconds;
            }
            if (this.reloadTimer <= this.reloadsEverySecond) {
                this.reloadTimer += _deltaSeconds;
            }

            //TODO: don't use lookAt function. Better do the math yourself! -> X is forward in my game. Z Forward is Standard
            // this.baseNode.mtxLocal.lookAt(aimPos, new ƒ.Vector3(0, 1, 0), true);
            // this.headNode.mtxLocal.lookAt(new ƒ.Vector3(aimPos.y, aimPos.z, 0), new ƒ.Vector3(0, 0, -1), true);
            // this.headNode.mtxLocal.rotateX(90);
            //fix rotation after LookAt

        }
        //Base rotates on the Y-Aches, Positive number for up
        //Head rotates on the Z-Aches
        //TODO:create a moveToFunction which is public, turn rate based on maxRotSpeed
        public moveTurret(xRot: number, yRot: number): void {
            if (this.baseNode == null || this.headNode == null) {
                return;
            }
            //TODO:Add clamp for Y-Aches
            this.baseNode.mtxLocal.rotateY(yRot);

            //TODO:Add clamp for Z-Aches
            this.headNode.mtxLocal.rotateZ(xRot);
        }

        /* This code defines a public method `fire()` that is called when the GatlingTurret is supposed
        to fire. It checks if there are any rounds left in the magazine, and if not, it resets the
        reload timer and refills the magazine. It also checks if the reload timer has finished, and
        if not, it returns without firing. If the reload timer has finished and there are rounds
        left in the magazine, it creates a new GatlingBullet object at the position of the shootNode
        and resets the rounds timer. */
        public fire(parentVelocity: ƒ.Vector3) {
            if (this.magazineRounds <= 0) {
                this.reloadTimer = 0;
                this.magazineRounds = this.magazineCapacity;
            }
            if (this.reloadTimer <= this.reloadsEverySecond) {
                if (this.reloadTimer % 1 == 0) {
                    FudgeCore.Debug.log("TurretReloading");
                }
                return;
            }
            if (this.roundsTimer >= 1 / this.roundsPerSecond) {
                // new GatlingBullet(this.shootNode.mtxWorld.clone, parentVelocity);

                //TODO remove test
                let shot2= this.shootNode.mtxWorld.clone;
                let spread1x = Math.random()*0.2-(Math.random())*0.2;
                let spread1y = Math.random()*0.2-(Math.random())*0.2;
                let spread1z = Math.random()*0.2-(Math.random())*0.2;
                shot2.rotate(new ƒ.Vector3(spread1x,spread1y,spread1z));
                new GatlingBullet(shot2, parentVelocity);
                //TEST end

                this.roundsTimer = 0;
                this.magazineRounds--;
                FudgeCore.Debug.log("RoundsLeft: " + this.magazineRounds);
                this.shootNode.getComponent(ƒ.ComponentAudio).volume = 10;
                this.shootNode.getComponent(ƒ.ComponentAudio).play(true);
            }
        }
        constructor() {
            super("GatlingTurret");
            this.initConfigAndAllNodes();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);

        }
    }
}