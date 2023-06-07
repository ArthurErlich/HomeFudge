namespace HomeFudge {
    import ƒ = FudgeCore;
    enum WEAPONS {
        GATLING_TURRET,
        BEAM_TURRET,
        ROCKET_POD
    }
    enum THRUSTER_DIRECTION {
        FORWARDS,
        BACKWARDS,
        LEFT,
        RIGHT,
        YAW_LEFT,
        YAW_RIGHT,
        PITCH_UP,
        PITCH_DOWN,
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

        protected healthPoints: number = null;
        protected maxTurnSpeed: number = null;
        private maxTurnAcceleration: number = null

        private gatlingTurret: GatlingTurret = null;
        private beamTurretList: BeamTurret[] = new Array(2);

        private rotThruster: RotThrusters[] = new Array(4);


        //True when the Player interacts with the Thrusters
        private inputRot: boolean = false;
        private inputAcc: boolean = false;

        //player rotation Input
        private desireRotation: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

        private maxPithsAngle: number = null;

        //list of weapons
        public WEAPONS = WEAPONS;

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
            this.maxPithsAngle = Config.destroyer.maxPitchAngle;


            //init Weapons
            this.addWeapons();
            this.addThrusters();
            //init Components
            this.setAllComponents(startTransform);
            this.addRigidBody(node, startTransform);
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
        private updateThrusters(): void {
            //TODO: move to own function
            //TODO: fire thrusters only wen player or game moves the ship
            if (this.rotThruster[0].getComponent(ƒ.ComponentMesh) == null) {
                return;
            }
            if (this.inputRot) {
                this.fireThrusters(THRUSTER_DIRECTION.OFF);
                return;
            }

            //stop turn thrusters
            if (this.rigidBody.getAngularVelocity().y < 0) {
                this.fireThrusters(THRUSTER_DIRECTION.YAW_LEFT, true);
            } else {
                this.fireThrusters(THRUSTER_DIRECTION.YAW_LEFT, false);
            }
            if (this.rigidBody.getAngularVelocity().y > 0) {
                this.fireThrusters(THRUSTER_DIRECTION.YAW_RIGHT, true);
            } else {
                this.fireThrusters(THRUSTER_DIRECTION.YAW_RIGHT, false);
            }
        }
        //TODO: Fill out the Switch case (move the thruster down)
        private fireThrusters(direction: THRUSTER_DIRECTION, _on?: boolean) {
            if (_on == null) {
                _on = false;
            }
            switch (direction) {
                case THRUSTER_DIRECTION.FORWARDS:
                    break;
                case THRUSTER_DIRECTION.BACKWARDS:
                    break;
                case THRUSTER_DIRECTION.LEFT:
                    break;
                case THRUSTER_DIRECTION.RIGHT:
                    break;
                case THRUSTER_DIRECTION.YAW_LEFT:
                    if (_on) {
                        this.rotThruster[1].activate(true);
                        this.rotThruster[2].activate(true);
                    } else {
                        this.rotThruster[1].activate(false);
                        this.rotThruster[2].activate(false);
                    }
                    break;
                case THRUSTER_DIRECTION.YAW_RIGHT:
                    if (_on) {
                        this.rotThruster[0].activate(true);
                        this.rotThruster[3].activate(true);
                    } else {
                        this.rotThruster[0].activate(false);
                        this.rotThruster[3].activate(false);
                    }
                    break;
                case THRUSTER_DIRECTION.PITCH_UP:
                    break;
                case THRUSTER_DIRECTION.PITCH_DOWN:
                    break;
                case THRUSTER_DIRECTION.OFF:
                    //Disables the Thrusters on default
                    this.rotThruster.forEach(thruster => {
                        if (thruster.isActivated()) {
                            thruster.activate(false);
                        }
                    });
                    break;
            }
        }
        private dampRotation(): void {
            //If player input is enable, and the damper are on

            //TODO: SETTING AND RADIN ROTATION SHOULD BE ALLWAYS WITH THE TRANLSATE LOCAL TO WORLD COORDINATES! RIGIDBODY IS IN WOLRD COORDINATES!!!
            let angularVelocity: ƒ.Vector3 = this.rigidBody.getAngularVelocity();
            let transformedAngularVelocity:ƒ.Vector3 = angularVelocity;//ƒ.Vector3.TRANSFORMATION(angularVelocity, this.mtxWorldInverse);
            let pitch: number = 1;
            let yaw: number = 1;
            if (this.inputRot) {
                return;
            }

            //fixes rounding errors by getting rid after 
            transformedAngularVelocity.set(
                Math.round(transformedAngularVelocity.x * 100) / 100,
                Math.round(transformedAngularVelocity.y * 100) / 100,
                Math.round(transformedAngularVelocity.z * 100) / 100
            );


            // let transposedAngularVelocity:ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(angularVelocity,this.mtxWorldInverse,false);

            //Stops over rotation, aka ping pong rotation
            // if (Math.abs(transformedAngularVelocity.x) <= 0.01) {
            //     this.rigidBody.setAngularVelocity(new ƒ.Vector3(0, transformedAngularVelocity.y, transformedAngularVelocity.z));
            // }
            // if (Math.abs(transformedAngularVelocity.y) <= 0.01) {
            //     this.rigidBody.setAngularVelocity(new ƒ.Vector3(transformedAngularVelocity.x, 0, transformedAngularVelocity.z));
            // }
            // if (Math.abs(transformedAngularVelocity.z) <= 0.01) {
            //     this.rigidBody.setAngularVelocity(new ƒ.Vector3(transformedAngularVelocity.x, transformedAngularVelocity.y, 0));
            // }

            //Fixes Micro rotation
            if (Math.abs(Mathf.vectorLength(this.rigidBody.getAngularVelocity())) <= 0.01) {
                this.rigidBody.setAngularVelocity(ƒ.Vector3.ZERO());
            }

            //Shortens the step for rotation to make it smoothly ends.
            if (transformedAngularVelocity.z <= pitch) {
                pitch = -transformedAngularVelocity.z;
            }
            if (transformedAngularVelocity.z >= pitch) {
                pitch = transformedAngularVelocity.z;
            }

            if (transformedAngularVelocity.y <= yaw) {
                yaw = -transformedAngularVelocity.y;
            }
            if (transformedAngularVelocity.y >= yaw) {
                yaw = transformedAngularVelocity.y;
            }

            if (transformedAngularVelocity.z < 0) {
                // rotUp
                this.yawPitch(0, pitch, true);

            } else if (transformedAngularVelocity.z > 0) {
                // rotDown
                this.yawPitch(0, -pitch, true);
            }

            if (transformedAngularVelocity.y < 0) {
                // rotRight
                this.yawPitch(yaw, 0, true);

            } else if (transformedAngularVelocity.y > 0) {
                // rotLeft
                this.yawPitch(-yaw, 0, true);
            }
        }
        public update(): void {
            //Fixes up rotation so that the ship is on the plain and wont roll
            //TODO: DEBUG

            // let rotation: ƒ.Vector3 = this.rigidBody.getRotation();
            // if (rotation.y <= 0 && rotation.y > 90) {
            //     rotation.set(0, rotation.y, rotation.z);
            //     this.rigidBody.setRotation(rotation);
            // }
            // l
            // 
            // if (rotation.y <= -90 && rotation.y > 0) {
            //     rotation.set(-180, rotation.y, rotation.z);
            //     this.rigidBody.setRotation(rotation);
            // }

            //TODO: remove drag from Physics. Use thrusters to stop the player. Check if the player gives thruster command or not
            let angularVelocity: ƒ.Vector3 = this.rigidBody.getAngularVelocity();
            let transformedAngularVelocity: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(angularVelocity, this.mtxWorldInverse);
            transformedAngularVelocity.set(
                Math.round(transformedAngularVelocity.x * 100) / 100,
                Math.round(transformedAngularVelocity.y * 100) / 100,
                Math.round(transformedAngularVelocity.z * 100) / 100
            );

            
            console.log(angularVelocity.toString());
            // TODO:console.log(transformedAngularVelocity.toString());

            //stops micro rotation

            //stops micro movement
            if (Math.abs(Mathf.vectorLength(this.rigidBody.getVelocity())) <= 0.01) {
                this.rigidBody.setVelocity(ƒ.Vector3.ZERO());
            }

            //TODO:SPLIT UP X and Z Rotation
            //updates rotation
            let mtxRot: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
            mtxRot.rotation = new ƒ.Vector3(0, this.mtxWorld.rotation.y, 0)
            // this.rigidBody.addAngularVelocity(ƒ.Vector3.TRANSFORMATION(this.desireRotation, mtxRot));

            this.rigidBody.setAngularVelocity(ƒ.Vector3.TRANSFORMATION(new ƒ.Vector3(0, angularVelocity.y, angularVelocity.z), mtxRot));
            this.rigidBody.addAngularVelocity(this.desireRotation);
            this.desireRotation = ƒ.Vector3.ZERO();

            //damps rotation
            this.dampRotation(); //ROTATION DAMPING IS KOMPLETYL BUGGY

            //resets inputs flags
            this.inputAcc = false;
            this.inputRot = false;
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
        // public yaw(rotateY: number, isDamped?: boolean) {
        //     /*
        //     Rotation Direction : 
        //      left -> 1
        //      RIGHT -> -1
        //     */
        //     if (isDamped == null) {
        //         isDamped = false;
        //     }
        //     if (!isDamped) {
        //         this.inputRot = true;
        //     }
        //     //clamp maximum up and down
        //     let shipRotation: ƒ.Vector3 = this.rigidBody.getAngularVelocity();

        //     //sets the rotation direction flag to false for later use
        //     let rotLeft: boolean = false;
        //     let rotRight: boolean = false;



        //     if (rotateY < 0) {
        //         rotRight = true;
        //         //TODO:remove Debug

        //     } else if (rotateY > 0) {
        //         rotLeft = true;
        //     }
        //     // -1 && -100 < max
        //     //Stops applaying more force to the rotatin if the maximum rotatin speed is gainend by jumping out of the function

        //     if (rotRight && shipRotation.y <= -this.maxTurnSpeed) {
        //         rotateY = 0;
        //         return;
        //     }
        //     if (rotLeft && shipRotation.y >= this.maxTurnSpeed) {
        //         rotateY = 0;
        //         return;
        //     }
        //     this.desireRotation.set(this.desireRotation.x, (rotateY * this.maxTurnAcceleration) * _deltaSeconds, this.desireRotation.z);
        // }

        // public pitch(rotateZ: number, isDamped?: boolean) {
        //     /*
        //     Rotation Direction : 
        //      UP -> 1
        //      DOWN -> -1
        //     */
        //     //sets the rotation direction flag to false for later use
        //     let pitchDown: boolean = false;
        //     let pitchUp: boolean = false;

        //     let clampUp: boolean = false;
        //     let clampDown: boolean = false;

        //     let angularVelocity: ƒ.Vector3 = this.rigidBody.getAngularVelocity();
        //     let shipRotation: ƒ.Vector3 = this.rigidBody.getRotation();
        //     console.log(shipRotation.z);

        //     if (shipRotation.z <= -this.maxPithsAngle) {
        //         clampDown = true;
        //     }
        //     if (shipRotation.z >= this.maxPithsAngle) {
        //         clampUp = true;
        //     }
        //     if (isDamped == null) {
        //         isDamped = false;
        //     }
        //     if (!isDamped) {
        //         this.inputRot = true;
        //     }
        //     //clamp maximum up and down
        //     this.inputRot = true;

        //     if (rotateZ < 0) {
        //         pitchDown = true;
        //         //TODO:remove Debug

        //     } else if (rotateZ > 0) {
        //         pitchUp = true;
        //     }
        //     // -1 && -100 < max

        //     if (pitchDown && clampDown) {
        //         console.log("down");
        //         rotateZ = 0;
        //         this.inputRot = false;
        //         return;
        //     }
        //     if (pitchUp && clampUp) {
        //         console.log("up");
        //         rotateZ = 0;
        //         this.inputRot = false;
        //         return;
        //     }
        //     // Stops applaying more force to the rotation if the maximum rotatin speed is gainend by setting the change to 0
        //     if (pitchDown && angularVelocity.z <= -this.maxTurnSpeed) {
        //         rotateZ = 0;
        //     }
        //     if (pitchUp && angularVelocity.z >= this.maxTurnSpeed) {
        //         rotateZ = 0;
        //     }

        //     this.desireRotation.set(this.desireRotation.x, this.desireRotation.y, (rotateZ * this.maxTurnAcceleration) * _deltaSeconds);
        // }
        public yawPitch(rotateY: number, rotateZ: number, isDamped?: boolean): void {

            //TODO: redoo rotation completely. add an extra node for rotation?
            /*
            Rotation Direction : 
             UP -> 1
             DOWN -> -1
            Rotation Direction : 
             left -> 1
             RIGHT -> -1
            */
            //sets the rotation direction flag to false for later use
            let pitchDown: boolean = false;
            let pitchUp: boolean = false;
            let rotLeft: boolean = false;
            let rotRight: boolean = false;

            let clampUp: boolean = false;
            let clampDown: boolean = false;

            let angularVelocity: ƒ.Vector3 = this.rigidBody.getAngularVelocity();//ƒ.Vector3.TRANSFORMATION(this.rigidBody.getAngularVelocity(), this.mtxWorldInverse);
            let shipRotation: ƒ.Vector3 = this.rigidBody.getRotation();

            //fixes rounding errors by getting rid after 
            angularVelocity.set(
                Math.round(angularVelocity.x * 100) / 100,
                Math.round(angularVelocity.y * 100) / 100,
                Math.round(angularVelocity.z * 100) / 100
            );

            if (isDamped == null) {
                isDamped = false;
            }
            if (!isDamped) {
                this.inputRot = true;
            }


            if (shipRotation.z <= -this.maxPithsAngle) {
                clampDown = true;
            }
            if (shipRotation.z >= this.maxPithsAngle) {
                clampUp = true;
            }


            if (rotateZ < 0) {
                pitchDown = true;
            } else if (rotateZ > 0) {
                pitchUp = true;
            }

            if (rotateY < 0) {
                rotRight = true;
            } else if (rotateY > 0) {
                rotLeft = true;
            }

            //Stops applaying more force to the rotatin if the maximum rotatin speed is gainend by jumping out of the function
            if (rotRight && angularVelocity.y <= -this.maxTurnSpeed) {
                rotateY = 0;
            }
            if (rotLeft && angularVelocity.y >= this.maxTurnSpeed) {
                rotateY = 0;
            }

            //TODO:FIX CLAMPING
            // if (pitchDown && clampDown) {
            //     console.log("down");
            //     rotateZ = 0;
            //     this.inputRot = false;
            //     return;
            // }
            // if (pitchUp && clampUp) {
            //     console.log("up");
            //     rotateZ = 0;
            //     this.inputRot = false;
            //     return;
            // }

            // Stops applaying more force to the rotation if the maximum rotatin speed is gainend by setting the change to 0
            if (pitchDown && angularVelocity.z <= -this.maxTurnSpeed) {
                rotateZ = 0;
            }
            if (pitchUp && angularVelocity.z >= this.maxTurnSpeed) {
                rotateZ = 0;
            }
            //Applays the rotation force
            this.desireRotation.set(this.desireRotation.x, (rotateY * this.maxTurnAcceleration) * _deltaSeconds, (rotateZ * this.maxTurnAcceleration) * _deltaSeconds);

        }

        constructor(startTransform: ƒ.Matrix4x4) {
            super("Destroyer");
            this.initAllConfigs(startTransform);
        }
    }
}

