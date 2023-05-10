namespace HomeFudge {
    import ƒ = FudgeCore;
    enum Weapons {
        GatlingTurret,
        BeamTurret,
        RocketPod
    }
    export class Destroyer extends Ship {
        protected maxSpeed: number = null;
        protected maxAcceleration: number = null;

        private static seedRigidBody: ƒ.ComponentRigidbody = null;
        private rigidBody: ƒ.ComponentRigidbody = null;

        protected healthPoints: number = null;
        protected maxTurnSpeed: number = null;
        private maxTurnAcceleration: number = null

        private gatlingTurret: GatlingTurret = null;
        private beamTurretList: BeamTurret[] = new Array(2);

        private rotThruster: RotThrusters[] = new Array(4);

        //list of weapons
        public weapons = Weapons;

        private static graph: ƒ.Graph = null;
        static mesh: ƒ.Mesh = null;
        static material: ƒ.Material = null;
        static convexHull: Float32Array = null;

        private async initAllConfigs(startTransform: ƒ.Matrix4x4) {
            Destroyer.graph = await Resources.getGraphResources(Config.destroyer.graphID);
            let node: ƒ.Node = await Resources.getComponentNode("Destroyer", Destroyer.graph);
            let nodeConvex: ƒ.Node = await Resources.getComponentNode("DestroyerConvexHull", Destroyer.graph);

            //init mesh and material
            Destroyer.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
            Destroyer.convexHull = ConvexHull.convertToFloat32Array(nodeConvex.getComponent(ƒ.ComponentMesh).mesh);

            Destroyer.material = node.getComponent(ƒ.ComponentMaterial).material;

            //init configs
            this.maxAcceleration = Config.destroyer.maxAcceleration;
            this.maxSpeed = Config.destroyer.maxSpeed;
            this.maxTurnSpeed = Config.destroyer.maxTurnSpeed;
            this.maxTurnAcceleration = Config.destroyer.maxTurnAcceleration;


            //init Weapons
            this.addWeapons();
            this.addThrusters();
            //init Components
            this.setAllComponents(startTransform);
            this.addRigidBody(node, startTransform);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        private addWeapons(): void {
            this.gatlingTurret = new GatlingTurret();
            this.beamTurretList[0] = new BeamTurret(BeamTurret.side.LEFT);
            this.beamTurretList[1] = new BeamTurret(BeamTurret.side.RIGHT);


            //if one turret is missing
            this.addChild(this.gatlingTurret);
            this.addChild(this.beamTurretList[0]);
            this.addChild(this.beamTurretList[1]);

        }

        private addThrusters(): void {
            this.rotThruster[0] = new RotThrusters("FL", JSONparser.toVector3(Config.destroyer.RotThruster_FL));
            this.rotThruster[1] = new RotThrusters("FR", JSONparser.toVector3(Config.destroyer.RotThruster_FR));
            this.rotThruster[2] = new RotThrusters("BL", JSONparser.toVector3(Config.destroyer.RotThruster_BL));
            this.rotThruster[3] = new RotThrusters("BR", JSONparser.toVector3(Config.destroyer.RotThruster_BR));

            this.rotThruster.forEach(thruster => {
                this.addChild(thruster);
            });
        }

        private setAllComponents(startPosition: ƒ.Matrix4x4): void {
            if (Destroyer.material == null || Destroyer.mesh == null) {
                console.warn(this.name + " Mesh and/or Material is missing");
                return;
            }
            this.addComponent(new ƒ.ComponentMaterial(Destroyer.material));
            this.addComponent(new ƒ.ComponentMesh(Destroyer.mesh));
            this.addComponent(new ƒ.ComponentTransform(startPosition));
        }

        private addRigidBody(node: ƒ.Node, startTransform: ƒ.Matrix4x4): void {
            if (Destroyer.seedRigidBody == null) {
                Destroyer.seedRigidBody = node.getComponent(ƒ.ComponentRigidbody);
            }

            this.rigidBody = new ƒ.ComponentRigidbody(
                Config.destroyer.mass,
                Destroyer.seedRigidBody.typeBody,
                Destroyer.seedRigidBody.typeCollider,
                ƒ.COLLISION_GROUP.DEFAULT,
                startTransform,
                Destroyer.convexHull
            );
            this.rigidBody.mtxPivot.scale(new ƒ.Vector3(2, 2, 2)); //Fixes the ConvexHull being 1/2 of the original convex
            this.rigidBody.setPosition(startTransform.translation);
            this.rigidBody.setRotation(startTransform.rotation);
            this.rigidBody.effectRotation = new ƒ.Vector3(0, 0.0025, 0);
            this.rigidBody.restitution = 0;
            this.rigidBody.dampRotation = 10;
            this.rigidBody.dampTranslation = 5;
            this.addComponent(this.rigidBody);
        }

        protected update = (): void => {
            //DISABLE THRUSTERS
            //TODO:Find a new Solution if rotation moves to Player
            // if (this.rotThruster[0].getComponent(ƒ.ComponentMesh).isActive) {
            //     this.rotThruster.forEach(thruster => {
            //         thruster.getComponent(ƒ.ComponentMesh).activate(false);
            //     });
            // }

            //stops micro rotation
            if(Math.abs(this.rigidBody.getAngularVelocity().y) <= 0.01){
                this.rigidBody.setAngularVelocity(ƒ.Vector3.ZERO());
            }

            if (this.rigidBody.getAngularVelocity().y < 0) {
                //RIGHT TURN
                this.rotThruster[0].getComponent(ƒ.ComponentMesh).activate(true);
                this.rotThruster[3].getComponent(ƒ.ComponentMesh).activate(true);
            }else{
                this.rotThruster[0].getComponent(ƒ.ComponentMesh).activate(false);
                this.rotThruster[3].getComponent(ƒ.ComponentMesh).activate(false);
            }
            if (this.rigidBody.getAngularVelocity().y > 0) {
                //LEFT TURN
                this.rotThruster[1].getComponent(ƒ.ComponentMesh).activate(true);
                this.rotThruster[2].getComponent(ƒ.ComponentMesh).activate(true);
            }else{
                this.rotThruster[1].getComponent(ƒ.ComponentMesh).activate(false);
                this.rotThruster[2].getComponent(ƒ.ComponentMesh).activate(false);
            }
            if (this.maxTurnSpeed <= Math.abs(this.rigidBody.getAngularVelocity().y)) {
                return;
            }
            //TODO:remove test of gatling rot
            ///TEST----------------TEST\\\
            let tempRotBase: ƒ.Vector3 = this.gatlingTurret.baseNode.mtxLocal.rotation;
            this.gatlingTurret.baseNode.mtxLocal.rotation = new ƒ.Vector3(
                tempRotBase.x,
                -(Mouse.position.x - (_viewport.canvas.width / 2)) / Math.PI / 3,
                tempRotBase.z
            );
            let tempRotHead: ƒ.Vector3 = this.gatlingTurret.headNode.mtxLocal.rotation;
            this.gatlingTurret.headNode.mtxLocal.rotation = new ƒ.Vector3(
                tempRotHead.x,
                tempRotHead.y,
                -(Mouse.position.y - (_viewport.canvas.height / 2)) / Math.PI / 4,

            );
            // this.beamTurretList[0].rotateTo(-(Mouse.position.y - (_viewport.canvas.height / 2)) / Math.PI / 4);
            // this.beamTurretList[1].rotateTo(-(Mouse.position.y - (_viewport.canvas.height / 2)) / Math.PI / 4);
            ///TEST----------------TEST\\\
        }
        public alive(): boolean {
            //console.error("Method not implemented.");
            return true;
        }
        public destroyNode(): void {
            //console.error("Method not implemented.");
            return null;
        }
        public toString(): string {
            //console.error("Method not implemented.");
            return null;
        }
        public fireWeapon(_weapon: Weapons) {
            switch (_weapon) {
                case Weapons.BeamTurret:
                    this.fireBeam();
                    break;
                case Weapons.RocketPod:
                    //TODO:Implement Rocket Pod
                    console.error("RocketPod not implement!!");
                    break;
                case Weapons.GatlingTurret:
                    this.fireGatling();
                    break;

                default:
                    break;
            }
        }
        public fireGatling() {
            this.gatlingTurret.fire(this.rigidBody.getVelocity());
        }
        public fireBeam() {
            this.beamTurretList.forEach(turret => {
                turret.fire();
            });
        }
        public move(moveDirection: ƒ.Vector3) {
            //TODO:Make smooth
            if (Mathf.vectorLength(moveDirection) >= 0.001) {
                moveDirection.normalize();
            }
            moveDirection.scale(this.maxSpeed * _deltaSeconds);
            if (Mathf.vectorLength(this.rigidBody.getVelocity()) <= this.maxSpeed) {

                //fixes velocity, rotating it to the right direction
                let mtxRot: ƒ.Matrix4x4 = new ƒ.Matrix4x4;
                mtxRot.rotation = this.mtxWorld.rotation;
                this.rigidBody.addVelocity(ƒ.Vector3.TRANSFORMATION(moveDirection, mtxRot));
            }
            //TODO:add smooth acceleration
            //add acceleration
        }
        public rotate(rotateY: number) {
            this.rigidBody.addAngularVelocity(new ƒ.Vector3(0, rotateY * this.maxTurnAcceleration * _deltaSeconds, 0))
        }
        constructor(startTransform: ƒ.Matrix4x4) {
            super("Destroyer");
            this.initAllConfigs(startTransform);
        }
    }
}

