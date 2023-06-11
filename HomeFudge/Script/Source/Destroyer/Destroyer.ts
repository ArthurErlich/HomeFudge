namespace HomeFudge {
    import ƒ = FudgeCore;
    enum WEAPONS {
        GATLING_TURRET,
        BEAM_TURRET,
        ROCKET_POD
    }
    enum DIRECTION {
        FORWARDS,
        BACKWARDS,
        LEFT,
        RIGHT,
        YAW_LEFT,
        YAW_RIGHT,
        PITCH_UP,
        PITCH_DOWN,
        ROLL_LEFT,
        ROLL_RIGHT,
        OFF
    }
    export class Destroyer extends Ship {
        public remove(): void {
            throw new Error("Method not implemented.");
        }
        protected maxSpeed: number = null;
        protected maxAcceleration: number = null;

        private static seedRigidBody: ƒ.ComponentRigidbody = null;
        private rigidBody: ƒ.ComponentRigidbody = null;

        // private mtxRigid: ƒ.Matrix4x4 = null;

        private localAngularVelocity: ƒ.Vector3 = null;


        protected healthPoints: number = null;
        protected maxTurnSpeed: number = null;
        private maxTurnAcceleration: number = null

        private gatlingTurret: GatlingTurret = null;
        private beamTurretList: BeamTurret[] = new Array(2);

        private rotThruster: RotThrusters[] = new Array(4); //<-- note adding Thrusters need to add


        //True when the Player interacts with the Thrusters
        private inputRot: boolean = false;
        private inputAcc: boolean = false;

        //player rotation Input
        private desireRotation: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

        //list of weapons
        public WEAPONS = WEAPONS;

        public DIRECTION = DIRECTION;

        //dampers can be disabled by the player
        public damperON = true;

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

            // startTransform.rotateY(90);//DEBUG

            this.setAllComponents(startTransform);
            this.addRigidBody(node, startTransform);

            // this.rigidBody.setAngularVelocity(new ƒ.Vector3(3, 0, 0));//DEBUG
        }
        //#region UpdateLoop
        public update(): void {

            //stops micro movement
            if (Math.abs(Mathf.vectorLength(this.rigidBody.getVelocity())) <= 0.01) {
                this.rigidBody.setVelocity(ƒ.Vector3.ZERO());
            }

            this.calcLocalAngularVelocity();

            //movement stuff
            this.resetThrusters();
            //-> Player input here
            this.applyForces();

            this.dampRotation();
            this.applyForces();


            //resets inputs flags
            this.inputAcc = false;
            this.inputRot = false;

        }

        private addWeapons(): void {
            this.gatlingTurret = new GatlingTurret();
            this.beamTurretList[0] = new BeamTurret(BeamTurret.side.LEFT);
            this.beamTurretList[1] = new BeamTurret(BeamTurret.side.RIGHT);

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

            let rotEffect: number = 0.0025;
            this.rigidBody.effectRotation = new ƒ.Vector3(rotEffect, rotEffect, rotEffect);
            this.rigidBody.restitution = 0.1;
            //TODO:Add damping with trusters
            this.rigidBody.dampRotation = 0;
            this.rigidBody.dampTranslation = 0;
            this.addComponent(this.rigidBody);
        }

        public resetThrusters(): void {
            //When the thruster is not ready to fire go out of the Function
            this.rotThruster.forEach(thruster => {
                if (thruster == null || thruster == undefined) {
                    return;
                }
            });
            this.fireThrusters(DIRECTION.OFF);


        }

        private applyForces(): void {
            this.rigidBody.addAngularVelocity(Mathf.vector3Round(ƒ.Vector3.TRANSFORMATION(this.desireRotation, this.mtxWorld), 100));
            this.desireRotation = ƒ.Vector3.ZERO();
        }

        private calcLocalAngularVelocity(): void {
            let ang = this.rigidBody.getAngularVelocity();
            let angSpeed: number = Mathf.vectorLength(ang);
            if (angSpeed < 0) {
                ang.normalize();
            }
            let localAng: ƒ.Vector3 = Mathf.vector3Round(Vector3.TRANSFORMATION(ang, this.mtxWorldInverse), 1)
            localAng.scale(angSpeed);

            this.localAngularVelocity = localAng;
        }

        //TODO: Fill out the Switch case (move the thruster down)
        public fireThrusters(direction: DIRECTION, _on?: boolean) {
            if (_on == null) {
                _on = false;
            }
            switch (direction) {
                case DIRECTION.FORWARDS:
                    break;
                case DIRECTION.BACKWARDS:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.YAW_LEFT:
                    if (_on) {
                        this.rotThruster[1].activate(true);
                        this.rotThruster[2].activate(true);
                    } else {
                        this.rotThruster[1].activate(false);
                        this.rotThruster[2].activate(false);
                    }
                    break;
                case DIRECTION.YAW_RIGHT:
                    if (_on) {
                        this.rotThruster[0].activate(true);
                        this.rotThruster[3].activate(true);
                    } else {
                        this.rotThruster[0].activate(false);
                        this.rotThruster[3].activate(false);
                    }
                    break;
                case DIRECTION.PITCH_UP:
                    break;
                case DIRECTION.PITCH_DOWN:
                    break;
                case DIRECTION.ROLL_LEFT:
                    break;
                case DIRECTION.ROLL_RIGHT:
                    break;

                case DIRECTION.OFF:
                    this.rotThruster.forEach(thruster => {
                        if (thruster.isActivated()) {
                            thruster.activate(false);
                        }
                    });
                    break;
            }
        }

        private dampRotation(): void {
            let angularVelocity: ƒ.Vector3 = this.rigidBody.getAngularVelocity();
            if (this.inputRot) {
                return;
            }
            // Stops over rotation, aka ping pong rotation
            // if (Math.abs(angularVelocity.x) <= 0.1) {
            //     this.rigidBody.setAngularVelocity(new ƒ.Vector3(0, angularVelocity.y, angularVelocity.z));
            // }
            if (Math.abs(angularVelocity.y) <= 0.1) {
                this.rigidBody.setAngularVelocity(new ƒ.Vector3(angularVelocity.x, 0, angularVelocity.z));
            }
            // if (Math.abs(angularVelocity.z) <= 0.1) {
            //     this.rigidBody.setAngularVelocity(new ƒ.Vector3(angularVelocity.x, angularVelocity.y, 0));
            // }
            // //Fixes Micro rotation
            // if (Math.abs(Mathf.vectorLength(this.rigidBody.getAngularVelocity())) <= 0.01) {
            //     this.rigidBody.setAngularVelocity(ƒ.Vector3.ZERO());
            // }

            //Shortens the step for rotation to make it smoothly ends.
            // if (transformedAngularVelocity.z <= -pitch * this.maxTurnAcceleration) {
            //     pitch =pitch/2;
            // }
            // if (transformedAngularVelocity.z >= pitch * this.maxTurnAcceleration) {
            //     pitch = pitch/2;
            // }

            // if (transformedAngularVelocity.y <= -yaw * this.maxTurnAcceleration) {
            //     yaw = 0;
            // }
            // if (transformedAngularVelocity.y >= yaw * this.maxTurnAcceleration) {
            //     yaw = 0;
            // }

            // if (transformedAngularVelocity.z < 0) {
            //     // rotUp
            //     this.yawPitch(0, pitch, true);

            // } else if (transformedAngularVelocity.z > 0) {
            //     // rotDown
            //     this.yawPitch(0, -pitch, true);
            // }

            if (angularVelocity.y < -0.1) {
                //stop rotRight
                this.rotateTo(1, 0);
                this.resetThrusters();
                this.fireThrusters(DIRECTION.YAW_LEFT, true);

            } else if (angularVelocity.y > 0.1) {
                //stop rotLeft
                this.rotateTo(-1, 0);
                this.resetThrusters();
                this.fireThrusters(DIRECTION.YAW_RIGHT, true);
            }
        }

        public alive(): boolean {
            console.error("Method not implemented.");
            return true;
        }
        public destroyNode(): void {
            console.error("Method not implemented.");
            return null;
        }
        public fireWeapon(_weapon: WEAPONS, target: ƒ.Vector3) {
            switch (_weapon) {
                case WEAPONS.BEAM_TURRET:
                    this.fireBeam();
                    break;
                case WEAPONS.ROCKET_POD:
                    //TODO:Implement Rocket Pod
                    console.error("RocketPod not implement!!");
                    break;
                case WEAPONS.GATLING_TURRET:
                    this.fireGatling(target);
                    break;


                default:
                    break;
            }
        }
        public fireGatling(target: ƒ.Vector3) {
            // this.gatlingTurret.fireAt(this.rigidBody.getVelocity(), target);
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
            moveDirection.scale(this.maxAcceleration * _deltaSeconds);
            if (Mathf.vectorLength(this.rigidBody.getVelocity()) <= this.maxSpeed) {

                //fixes velocity, rotating it to the right direction
                let mtxRot: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
                mtxRot.rotation = this.mtxWorld.rotation;
                this.rigidBody.addVelocity(ƒ.Vector3.TRANSFORMATION(moveDirection, mtxRot));
            }
            //TODO:add smooth acceleration
            //add acceleration
        }
        public rotateTo(rotate: DIRECTION): void {

            //TODO: redoo rotation completely
            /*
            Rotation Direction : 
             UP -> 1
             DOWN -> -1
            Rotation Direction : 
             left -> 1
             RIGHT -> -1
            */
            let rotateZ = null;
            let rotateY = null;
            let rotateX = null;

            switch (rotate) {
                case DIRECTION.FORWARDS:
                    break;
                case DIRECTION.BACKWARDS:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.YAW_LEFT:
                    rotateY = 1;
                    break;
                case DIRECTION.YAW_RIGHT:
                    rotateY = -1;
                    break;
                case DIRECTION.PITCH_UP:
                    rotateZ = 1;
                    break;
                case DIRECTION.PITCH_DOWN:
                    rotateZ = -1;
                    break;
                case DIRECTION.ROLL_LEFT:
                    rotateX = -1;
                    break;
                case DIRECTION.ROLL_RIGHT:
                    rotateX = 1;
                    break;
                case DIRECTION.OFF:
                    return;
                default:
                    return;
            }
            //sets the rotation direction flag to false for later use
            let pitchDown: boolean = false;
            let pitchUp: boolean = false;
            let yawLeft: boolean = false;
            let yawRight: boolean = false;
            let rollRight: boolean = false;
            let rollLeft: boolean = false;

            let angularVelocity: ƒ.Vector3 = this.localAngularVelocity;

            this.inputRot = true; //TODO: move away! Think diffrent

            //TODO: set input flag for Roll move to Switch case
            //serts inut flags fore easier use.
            if (rotateZ < 0) {
                pitchDown = true;
            } else if (rotateZ > 0) {
                pitchUp = true;
            }

            if (rotateY < 0) {
                yawRight = true;
            } else if (rotateY > 0) {
                yawLeft = true;
            }

            // Stops applaying more force to the rotation if the maximum rotatin speed is gainend by setting the change to 0
            if (yawRight && angularVelocity.y <= -this.maxTurnSpeed) {
                rotateY = 0;
            }
            if (yawLeft && angularVelocity.y >= this.maxTurnSpeed) {
                rotateY = 0;
            }

            if (pitchDown && angularVelocity.z <= -this.maxTurnSpeed) {
                rotateZ = 0;
            }
            if (pitchUp && angularVelocity.z >= this.maxTurnSpeed) {
                rotateZ = 0;
            }
            //Applays the rotation force
            this.desireRotation.set((rotateX * this.maxTurnAcceleration) * _deltaSeconds, (rotateY * this.maxTurnAcceleration) * _deltaSeconds, (rotateZ * this.maxTurnAcceleration) * _deltaSeconds);

        }

        constructor(startTransform: ƒ.Matrix4x4) {
            super("Destroyer");
            this.initAllConfigs(startTransform);
        }
    }
}

