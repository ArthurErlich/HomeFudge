"use strict";
var HomeFudge;
(function (HomeFudge) {
    class Config {
        static gatlingBullet = null;
        static gatlingTurret = null;
        static beamTurret = null;
        static laserBeam = null;
        static destroyer = null;
        static camera = null;
        /**
         * The function initializes configurations by fetching JSON files and assigning their contents
         * to corresponding variables.
         */
        static async initConfigs() {
            let gatBulletResponse = await fetch("Configs/gatBulletConfig.json");
            let gatTurretResponse = await fetch("Configs/gatTurretConfig.json");
            let beamTurretResponse = await fetch("Configs/beamTurretConfig.json");
            let laserBeamResponse = await fetch("Configs/laserBeamConfig.json");
            let destroyerResponse = await fetch("Configs/destroyerConfig.json");
            let cameraResponse = await fetch("Configs/cameraConfig.json");
            Config.gatlingBullet = await gatBulletResponse.json();
            Config.gatlingTurret = await gatTurretResponse.json();
            Config.beamTurret = await beamTurretResponse.json();
            Config.laserBeam = await laserBeamResponse.json();
            Config.destroyer = await destroyerResponse.json();
            Config.camera = await cameraResponse.json();
        }
    }
    HomeFudge.Config = Config;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    class ConvexHull {
        static convertToFloat32Array(convexMesh) {
            //TODO:make float 32 array
            let array = new Float32Array(convexMesh.vertices.flatMap((_vertex, _index) => {
                return [...convexMesh.vertices.position(_index).get()];
            }));
            return array;
        }
    }
    HomeFudge.ConvexHull = ConvexHull;
})(HomeFudge || (HomeFudge = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    window.addEventListener("load", init);
    let cmpCamera;
    let canvas;
    let viewport;
    let cmpListener;
    function init(_event) {
        HomeFudge._mainCamera = new HomeFudge.Camera("Main");
        cmpCamera = HomeFudge._mainCamera.camComp;
        canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        cmpListener = new ƒ.ComponentAudioListener();
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            dialog.close();
            let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
            startInteractiveViewport(graphId);
        });
        dialog.showModal();
    }
    async function startInteractiveViewport(graphId) {
        // load resources referenced in the link-tag
        HomeFudge.LoadingScreen.init(canvas);
        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        let graph = FudgeCore.Project.resources[graphId];
        FudgeCore.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // hide the cursor when right clicking, also suppressing right-click menu
        canvas.addEventListener("mousedown", function (event) {
            if (event.button == 2) {
                canvas.requestPointerLock();
            }
        });
        canvas.addEventListener("mouseup", function (event) {
            if (event.button == 2) {
                document.exitPointerLock();
            }
        });
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        // setup audio
        cmpCamera.node.addComponent(cmpListener);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        // dispatch event to signal startup done
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
        // setup the viewport
    }
})(HomeFudge || (HomeFudge = {}));
/* This code defines a namespace called `HomeFudge` and exports a class called `JSONparser` with a
static method `toVector3`. The method takes an array of numbers and returns a new instance of the
`ƒ.Vector3` class from the `FudgeCore` library, using the values from the array as its x, y, and z
components. */
var HomeFudge;
/* This code defines a namespace called `HomeFudge` and exports a class called `JSONparser` with a
static method `toVector3`. The method takes an array of numbers and returns a new instance of the
`ƒ.Vector3` class from the `FudgeCore` library, using the values from the array as its x, y, and z
components. */
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class JSONparser {
        /**
         * This function takes an array of three numbers and returns a new Vector3 object with those
         * values.
         *
         * @param value An array of three numbers representing the x, y, and z components of a vector.
         * @return A new instance of the ƒ.Vector3 class with the x, y, and z values set to the values
         * in the input array.
         * @author Arthur Erlich <arthur.erlich@hs-furtwangen.de>
         */
        static toVector3(value) {
            return new ƒ.Vector3(value[0], value[1], value[2]);
        }
    }
    HomeFudge.JSONparser = JSONparser;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    class LoadingScreen {
        static body;
        static loadText;
        static loadPNG;
        static init(canvas) {
            canvas.style.backgroundColor = "#191919";
            LoadingScreen.body = document.body;
            LoadingScreen.loadText = document.createElement("div");
            LoadingScreen.loadPNG = document.createElement("div");
            LoadingScreen.loadText.style.fontSize = "44px";
            LoadingScreen.loadText.style.textAlign = "center";
            LoadingScreen.loadText.style.width = "420px";
            LoadingScreen.loadText.innerHTML = "HomeFudge is Loading";
            LoadingScreen.loadText.style.position = "fixed";
            LoadingScreen.loadText.style.left = "0";
            LoadingScreen.loadText.style.bottom = "0";
            LoadingScreen.loadText.style.color = "#e8e8e8";
            LoadingScreen.loadPNG = document.createElement("div");
            LoadingScreen.loadPNG.style.width = "100px";
            LoadingScreen.loadPNG.style.height = "100px";
            LoadingScreen.loadPNG.style.position = "fixed";
            LoadingScreen.loadPNG.style.right = "0";
            LoadingScreen.loadPNG.style.bottom = "0";
            let img = document.getElementById("loadingIMG");
            img.hidden = false;
            LoadingScreen.loadPNG.style.backgroundColor = "#e8e8e8 ";
            LoadingScreen.loadPNG.append(img);
            LoadingScreen.body.append(LoadingScreen.loadText);
            LoadingScreen.body.append(LoadingScreen.loadPNG);
        }
        static remove() {
            LoadingScreen.loadText.remove();
            LoadingScreen.loadPNG.remove();
        }
    }
    HomeFudge.LoadingScreen = LoadingScreen;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", (event) => start(event));
    document.addEventListener("keydown", (event) => continueLoop(event));
    ///World Node\\\
    HomeFudge._worldNode = null;
    ///DeltaSeconds\\\
    HomeFudge._deltaSeconds = null;
    ///Viewport\\\
    HomeFudge._viewport = null;
    ///Player\\\
    let p1 = null;
    /// ------------T-E-S-T--A-R-E-A------------------\\\
    /// ------------T-E-S-T--A-R-E-A------------------\\\
    async function start(_event) {
        HomeFudge.LoadingScreen.remove();
        HomeFudge._viewport = _event.detail;
        HomeFudge._worldNode = HomeFudge._viewport.getBranch();
        // _viewport.physicsDebugMode =ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        console.log(HomeFudge._viewport);
        //Loads Config then initilizes the world in the right order
        await loadConfig().then(initWorld).then(() => {
            console.warn("ConfigsLoaded and world Initialized");
        }); // to create ships. first load configs than the ships etc
        async function loadConfig() {
            //loads configs
            performance.now();
            console.warn("LoadingConfigs");
            await HomeFudge.Config.initConfigs();
            HomeFudge.Mouse.init();
        }
        async function initWorld() {
            p1 = new HomeFudge.Player("test_P1");
            HomeFudge._viewport.getBranch().addChild(p1);
            HomeFudge._mainCamera.attachToShip(p1.destroyer);
            let destroyer = new HomeFudge.Destroyer(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(500, 0, 0)));
            HomeFudge._worldNode.appendChild(destroyer);
            ƒ.Physics.setGravity(ƒ.Vector3.ZERO());
        }
        /// ------------T-E-S-T--A-R-E-A------------------\\\
        /// ------------T-E-S-T--A-R-E-A------------------\\\
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 35); // start the game loop to continuously draw the _viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate(); // make an update loop just for the Physics. fixed at 30fps
        HomeFudge._deltaSeconds = ƒ.Loop.timeFrameGame / 1000;
        /// ------------T-E-S-T--A-R-E-A------------------\\\
        // if(draw){
        //   _viewport.draw(false);
        //   draw = false;
        // }else{
        //   _viewport.draw(true);
        //   draw = true;
        // }
        /// ------------T-E-S-T--A-R-E-A------------------\\\
        HomeFudge._viewport.draw(); //TODO move to a loop of 30 frames per second;
        ƒ.AudioManager.default.update();
    }
    /// ------------T-E-S-T--A-R-E-A------------------\\\
    // function getPosTest(): void {
    //   let pickCam: ƒ.Pick[] = ƒ.Picker.pickCamera(_worldNode.getChildren(), _viewport.camera, Mouse.position);
    //   let pickViewport: ƒ.Pick[] = ƒ.Picker.pickViewport(_viewport, Mouse.position);
    //   console.log("%c" + "Camera Picker", "background:red");
    //   pickCam.forEach(element => {
    //     console.log("%c" + element.posMesh.toString(), "background:yellow");
    //   });
    //   console.log("-------------");
    //   console.log("%c" + "Viewport Picker", "background:red");
    //   pickViewport.forEach(element => {
    //     console.log("%c" + element.posMesh.toString(), "background:yellow");
    //   });
    //   console.log("-------------");
    // }
    /// ------------T-E-S-T--A-R-E-A------------------\\\
    //DEBUG
    function continueLoop(event) {
        if (event.code == "Insert") {
            ƒ.Loop.continue();
        }
    }
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class Mathf {
        /**
         * The function performs linear interpolation between two numbers based on a given ratio.
         *
         * @param a a is a number representing the starting value of the range to interpolate between.
         * @param b The parameter "b" is a number representing the end value of the range to
         * interpolate between.
         * @param t t is a number between 0 and 1 that represents the interpolation factor. It
         * determines how much of the second value (b) should be blended with the first value (a) to
         * produce the final result. A value of 0 means that only the first value should be used, while
         * a
         * @return the linear interpolation value between `a` and `b` based on the value of `t`.
         */
        static lerp(a, b, t) {
            if (t < 0) {
                throw new Error(t + " is smaller 0");
            }
            if (t > 1) {
                throw new Error(t + " is larger 1");
            }
            return a + (t * b - t * b);
        }
        /**
         * The function calculates the length of a 3D vector using the Pythagorean theorem.
         *
         * @param v A 3-dimensional vector represented as an object with properties x, y, and z.
         * @return The function `vectorLength` returns the length of a 3D vector represented by the
         * input parameter `v`.
         */
        static vectorLength(v) {
            return Math.sqrt(v.x * v.x +
                v.y * v.y +
                v.z * v.z);
        }
        static vectorNegate(v) {
            return new ƒ.Vector3(-v.x, -v.y, -v.z);
        }
        static DegreeToRadiant(degree) {
            return degree * (Math.PI / 180);
        }
        static RadiantToDegree(radiant) {
            return radiant * (180 / Math.PI);
        }
    }
    HomeFudge.Mathf = Mathf;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class Resources {
        static async getGraphResources(graphID) {
            let graph = ƒ.Project.resources[graphID];
            if (graph == null) {
                console.warn(graph + " not found with ID: " + graphID);
            }
            return graph;
        }
        static async getComponentNode(nodeName, graph) {
            let node = graph.getChildrenByName(nodeName)[0];
            if (node == null) {
                console.warn("+\"" + nodeName + "\" not found inside: " + graph.name + "->Graph");
            }
            return node;
        }
    }
    HomeFudge.Resources = Resources;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    /* This is a TypeScript class definition for an abstract class called `Bullet` that extends the
    `ƒ.Node` class. The `export` keyword makes the class available for use in other modules. */
    class Bullet extends ƒ.Node {
        constructor(idString) {
            super("Bullet" + idString);
            HomeFudge._worldNode.addChild(this);
            //register to update event            
        }
    }
    HomeFudge.Bullet = Bullet;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    let SHIPS;
    (function (SHIPS) {
        SHIPS[SHIPS["DESTROYER"] = 0] = "DESTROYER";
    })(SHIPS || (SHIPS = {}));
    class Ship extends ƒ.Node {
        static SHIPS = SHIPS;
        constructor(name) {
            super("Ship_" + name);
            //register to updater list
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, () => {
                this.update();
            });
        }
    }
    HomeFudge.Ship = Ship;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    let SIDE;
    (function (SIDE) {
        SIDE[SIDE["LEFT"] = 0] = "LEFT";
        SIDE[SIDE["RIGHT"] = 1] = "RIGHT";
    })(SIDE || (SIDE = {}));
    class BeamTurret extends ƒ.Node {
        static side = SIDE;
        static graph = null;
        static mesh = null;
        static material = null;
        beamReady = true;
        rotNode = null;
        beam = null;
        timer = new ƒ.Time();
        //TODO:readd declaration
        // private maxRotSpeed: number;
        // private maxPitch: number;
        // private minPitch: number;
        // private maxBeamTime: number;
        // private maxReloadTime: number;
        async init(side) {
            BeamTurret.graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.beamTurret.graphID);
            let resourceNode = await HomeFudge.Resources.getComponentNode("BeamTurret", BeamTurret.graph);
            if (BeamTurret.material == null || BeamTurret.mesh) {
                BeamTurret.material = resourceNode.getComponent(ƒ.ComponentMaterial).material;
                BeamTurret.mesh = resourceNode.getComponent(ƒ.ComponentMesh).mesh;
            }
            this.rotNode = new ƒ.Node("RotNode" + this.name);
            //Init turret configs
            //TODO: re add init...
            // this.maxRotSpeed = Config.beamTurret.maxRotSpeed;
            // this.maxPitch = Config.beamTurret.maxPitch;
            // this.minPitch = Config.beamTurret.minPitch;
            // this.maxBeamTime = Config.beamTurret.beamTime;
            // this.maxReloadTime = Config.beamTurret.reloadTime;
            this.addChild(this.rotNode);
            let turretPos = HomeFudge.JSONparser.toVector3(HomeFudge.Config.beamTurret.basePosition);
            switch (side) {
                case 0:
                    console.log("adding Beam: LEFT");
                    this.addBeam("LEFT");
                    turretPos.set(turretPos.x, turretPos.y, -turretPos.z);
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(-90);
                    ;
                    break;
                case 1:
                    console.log("adding Beam: RIGHT");
                    this.addBeam("RIGHT");
                    this.addComponents(turretPos);
                    this.mtxLocal.rotateX(90);
                    break;
                default:
                    break;
            }
        }
        addBeam(side) {
            //TODO: BeamMaterial is disabled
            let beamPos = HomeFudge.JSONparser.toVector3(HomeFudge.Config.beamTurret.beamPosition);
            this.beam = new HomeFudge.LaserBeam(side, beamPos);
            this.rotNode.addChild(this.beam);
        }
        addComponents(position) {
            console.log("attaching mtx translation: " + position);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            this.rotNode.addComponent(new ƒ.ComponentTransform());
            this.rotNode.addComponent(new ƒ.ComponentMaterial(BeamTurret.material));
            this.rotNode.addComponent(new ƒ.ComponentMesh(BeamTurret.mesh));
        }
        update = () => {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                this.rotate(this.maxRotSpeed * HomeFudge._deltaSeconds);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                this.rotate(-this.maxRotSpeed * HomeFudge._deltaSeconds);
        };
        rotate(rot) {
            //ROTATION is only between -180° and 180°. Y starts at 0°
            //TODO:add rotation LOCK
            if (this.mtxLocal.rotation.x == -90) {
                this.rotNode.mtxLocal.rotateY(rot);
            }
            if (this.mtxLocal.rotation.x == 90) {
                this.rotNode.mtxLocal.rotateY(-rot);
            }
        }
        fire() {
            console.log("is beam ready: " + this.beamReady);
            if (this.beamReady) {
                this.beamReady = false;
                //Beam time
                this.timer.setTimer(4000, 1, () => {
                    this.beam.getComponent(ƒ.ComponentMesh).activate(false);
                    //Beam reload
                    this.timer.setTimer(4000, 1, () => {
                        this.beamReady = true;
                    });
                });
                this.beam.getComponent(ƒ.ComponentMesh).activate(true);
            }
        }
        rotateTo(cordY) {
            this.rotate(cordY);
        }
        constructor(side) {
            super("BeamTurret");
            this.init(side);
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    HomeFudge.BeamTurret = BeamTurret;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    let WEAPONS;
    (function (WEAPONS) {
        WEAPONS[WEAPONS["GATLING_TURRET"] = 0] = "GATLING_TURRET";
        WEAPONS[WEAPONS["BEAM_TURRET"] = 1] = "BEAM_TURRET";
        WEAPONS[WEAPONS["ROCKET_POD"] = 2] = "ROCKET_POD";
    })(WEAPONS || (WEAPONS = {}));
    class Destroyer extends HomeFudge.Ship {
        maxSpeed = null;
        maxAcceleration = null;
        static seedRigidBody = null;
        rigidBody = null;
        healthPoints = null;
        maxTurnSpeed = null;
        maxTurnAcceleration = null;
        gatlingTurret = null;
        beamTurretList = new Array(2);
        rotThruster = new Array(4);
        //list of weapons
        WEAPONS = WEAPONS;
        static graph = null;
        static mesh = null;
        static material = null;
        static convexHull = null;
        async initAllConfigs(startTransform) {
            Destroyer.graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.destroyer.graphID);
            let node = await HomeFudge.Resources.getComponentNode("Destroyer", Destroyer.graph);
            let nodeConvex = await HomeFudge.Resources.getComponentNode("DestroyerConvexHull", Destroyer.graph);
            //init mesh and material
            Destroyer.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
            Destroyer.convexHull = HomeFudge.ConvexHull.convertToFloat32Array(nodeConvex.getComponent(ƒ.ComponentMesh).mesh);
            Destroyer.material = node.getComponent(ƒ.ComponentMaterial).material;
            //init configs
            this.maxAcceleration = HomeFudge.Config.destroyer.maxAcceleration;
            this.maxSpeed = HomeFudge.Config.destroyer.maxSpeed;
            this.maxTurnSpeed = HomeFudge.Config.destroyer.maxTurnSpeed;
            this.maxTurnAcceleration = HomeFudge.Config.destroyer.maxTurnAcceleration;
            //init Weapons
            this.addWeapons();
            this.addThrusters();
            //init Components
            this.setAllComponents(startTransform);
            this.addRigidBody(node, startTransform);
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        addWeapons() {
            this.gatlingTurret = new HomeFudge.GatlingTurret();
            this.beamTurretList[0] = new HomeFudge.BeamTurret(HomeFudge.BeamTurret.side.LEFT);
            this.beamTurretList[1] = new HomeFudge.BeamTurret(HomeFudge.BeamTurret.side.RIGHT);
            //if one turret is missing
            this.addChild(this.gatlingTurret);
            this.addChild(this.beamTurretList[0]);
            this.addChild(this.beamTurretList[1]);
        }
        addThrusters() {
            this.rotThruster[0] = new HomeFudge.RotThrusters("FL", HomeFudge.JSONparser.toVector3(HomeFudge.Config.destroyer.RotThruster_FL));
            this.rotThruster[1] = new HomeFudge.RotThrusters("FR", HomeFudge.JSONparser.toVector3(HomeFudge.Config.destroyer.RotThruster_FR));
            this.rotThruster[2] = new HomeFudge.RotThrusters("BL", HomeFudge.JSONparser.toVector3(HomeFudge.Config.destroyer.RotThruster_BL));
            this.rotThruster[3] = new HomeFudge.RotThrusters("BR", HomeFudge.JSONparser.toVector3(HomeFudge.Config.destroyer.RotThruster_BR));
            this.rotThruster.forEach(thruster => {
                this.addChild(thruster);
            });
        }
        setAllComponents(startPosition) {
            if (Destroyer.material == null || Destroyer.mesh == null) {
                console.warn(this.name + " Mesh and/or Material is missing");
                return;
            }
            this.addComponent(new ƒ.ComponentMaterial(Destroyer.material));
            this.addComponent(new ƒ.ComponentMesh(Destroyer.mesh));
            this.addComponent(new ƒ.ComponentTransform(startPosition));
        }
        addRigidBody(node, startTransform) {
            if (Destroyer.seedRigidBody == null) {
                Destroyer.seedRigidBody = node.getComponent(ƒ.ComponentRigidbody);
            }
            this.rigidBody = new ƒ.ComponentRigidbody(HomeFudge.Config.destroyer.mass, Destroyer.seedRigidBody.typeBody, Destroyer.seedRigidBody.typeCollider, ƒ.COLLISION_GROUP.DEFAULT, startTransform, Destroyer.convexHull);
            this.rigidBody.mtxPivot.scale(new ƒ.Vector3(2, 2, 2)); //Fixes the ConvexHull being 1/2 of the original convex
            this.rigidBody.setPosition(startTransform.translation);
            this.rigidBody.setRotation(startTransform.rotation);
            this.rigidBody.effectRotation = new ƒ.Vector3(0, 0.0025, 0);
            this.rigidBody.restitution = 0.1;
            this.rigidBody.dampRotation = 10;
            this.rigidBody.dampTranslation = 0.1;
            this.addComponent(this.rigidBody);
        }
        update = () => {
            //DISABLE THRUSTERS
            //TODO:Find a new Solution if rotation moves to Player
            // if (this.rotThruster[0].getComponent(ƒ.ComponentMesh).isActive) {
            //     this.rotThruster.forEach(thruster => {
            //         thruster.getComponent(ƒ.ComponentMesh).activate(false);
            //     });
            // }
            //TODO: add Y hight check.
            //stops micro rotation
            if (Math.abs(this.rigidBody.getAngularVelocity().y) <= 0.01) {
                this.rigidBody.setAngularVelocity(ƒ.Vector3.ZERO());
            }
            //stops micro movement
            if (Math.abs(HomeFudge.Mathf.vectorLength(this.rigidBody.getVelocity())) <= 0.01) {
                this.rigidBody.setVelocity(ƒ.Vector3.ZERO());
            }
            //TODO: move to own function
            if (this.rigidBody.getAngularVelocity().y < 0) {
                //RIGHT TURN
                this.rotThruster[0].getComponent(ƒ.ComponentMesh).activate(true);
                this.rotThruster[3].getComponent(ƒ.ComponentMesh).activate(true);
            }
            else {
                this.rotThruster[0].getComponent(ƒ.ComponentMesh).activate(false);
                this.rotThruster[3].getComponent(ƒ.ComponentMesh).activate(false);
            }
            if (this.rigidBody.getAngularVelocity().y > 0) {
                //LEFT TURN
                this.rotThruster[1].getComponent(ƒ.ComponentMesh).activate(true);
                this.rotThruster[2].getComponent(ƒ.ComponentMesh).activate(true);
            }
            else {
                this.rotThruster[1].getComponent(ƒ.ComponentMesh).activate(false);
                this.rotThruster[2].getComponent(ƒ.ComponentMesh).activate(false);
            }
            if (this.maxTurnSpeed <= Math.abs(this.rigidBody.getAngularVelocity().y)) {
                return;
            }
        };
        alive() {
            //console.error("Method not implemented.");
            return true;
        }
        destroyNode() {
            //console.error("Method not implemented.");
            return null;
        }
        toString() {
            //console.error("Method not implemented.");
            return null;
        }
        fireWeapon(_weapon, target) {
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
        fireGatling(target) {
            this.gatlingTurret.fireAt(this.rigidBody.getVelocity(), target);
        }
        fireBeam() {
            this.beamTurretList.forEach(turret => {
                turret.fire();
            });
        }
        move(moveDirection) {
            //TODO:Make smooth
            if (HomeFudge.Mathf.vectorLength(moveDirection) >= 0.001) {
                moveDirection.normalize();
            }
            moveDirection.scale(this.maxAcceleration * HomeFudge._deltaSeconds);
            if (HomeFudge.Mathf.vectorLength(this.rigidBody.getVelocity()) <= this.maxSpeed) {
                //fixes velocity, rotating it to the right direction
                let mtxRot = new ƒ.Matrix4x4;
                mtxRot.rotation = this.mtxWorld.rotation;
                this.rigidBody.addVelocity(ƒ.Vector3.TRANSFORMATION(moveDirection, mtxRot));
            }
            //TODO:add smooth acceleration
            //add acceleration
        }
        rotate(rotateY) {
            this.rigidBody.addAngularVelocity(new ƒ.Vector3(0, rotateY * this.maxTurnAcceleration * HomeFudge._deltaSeconds, 0));
        }
        constructor(startTransform) {
            super("Destroyer");
            this.initAllConfigs(startTransform);
        }
    }
    HomeFudge.Destroyer = Destroyer;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    //TODO:create a logic for Hit detection. Using a physics engine of Fudge
    //TODO:move texturePivot to the Beck
    class GatlingBullet extends HomeFudge.Bullet {
        maxLifeTime = null;
        static graph = null;
        static mesh = null;
        static material = null;
        static maxSpeed = null;
        static seedRigidBody = null;
        rigidBody = null;
        //TODO: try faction out.
        // faction: FACTION="FACTION.A";
        update = () => {
            //goes out of the update loop as long the date is received into the config variable
            if (this.maxLifeTime == null || GatlingBullet.maxSpeed == null) {
                return;
            }
            this.maxLifeTime -= HomeFudge._deltaSeconds;
            //TODO:Get Distance to Player cam and scale the size a of the mesh to make the bullet better visible at long distance
            //life check.
            if (!this.alive()) {
                this.destroyNode();
            }
        };
        async init(initVelocity, spawnTransform) {
            GatlingBullet.graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.gatlingBullet.graphID);
            let node = await HomeFudge.Resources.getComponentNode("GatlingBullet", GatlingBullet.graph);
            ///initAttributes\\\
            this.maxLifeTime = HomeFudge.Config.gatlingBullet.maxLifeTime;
            GatlingBullet.maxSpeed = HomeFudge.Config.gatlingBullet.maxSpeed;
            this.addComponents(node, spawnTransform);
            //fixes impulse direction.
            //TODO: move into function
            let localShootDir = new ƒ.Vector3(GatlingBullet.maxSpeed, 0, 0);
            let gatRotAtZero = new ƒ.Matrix4x4();
            gatRotAtZero.rotation = spawnTransform.rotation;
            let worldShootDir = ƒ.Vector3.TRANSFORMATION(localShootDir, gatRotAtZero);
            worldShootDir.add(initVelocity);
            this.rigidBody.setVelocity(worldShootDir);
        }
        getNodeResources(node) {
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
        addComponents(node, spawnTransform) {
            this.getNodeResources(node);
            this.addComponent(new ƒ.ComponentTransform(spawnTransform));
            this.addComponent(new ƒ.ComponentMesh(GatlingBullet.mesh));
            this.addComponent(new ƒ.ComponentMaterial(GatlingBullet.material));
            this.rigidBody = new ƒ.ComponentRigidbody(HomeFudge.Config.gatlingBullet.mass, GatlingBullet.seedRigidBody.typeBody, GatlingBullet.seedRigidBody.typeCollider);
            this.rigidBody.mtxPivot = GatlingBullet.seedRigidBody.mtxPivot;
            this.rigidBody.setPosition(spawnTransform.translation);
            this.rigidBody.setRotation(spawnTransform.rotation);
            this.rigidBody.restitution = 0;
            this.rigidBody.dampTranslation = 0;
            this.addComponent(this.rigidBody);
        }
        alive() {
            if (this.maxLifeTime == null) {
                return true;
            }
            return this.maxLifeTime >= 0;
        }
        toString() {
            return this.name + "POSITION: " + this.mtxWorld.translation.toString();
        }
        destroyNode() {
            //remove bullet from viewGraph
            //TODO:Verify if it is a valid approach // I need the Super class Bullet because I extended the Bullet Class to GatlingBullet
            ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            try {
                HomeFudge._worldNode.removeChild(this);
            }
            catch (error) {
                console.warn(error);
                ƒ.Loop.stop();
            }
        }
        constructor(initVelocity, spawnTransform) {
            super("Gatling");
            this.init(initVelocity, spawnTransform);
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    HomeFudge.GatlingBullet = GatlingBullet;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    //TODO:create super class Turret. GatlingTurret and BeamTurret extends Turret
    class GatlingTurret extends ƒ.Node {
        //TODO: make Private again
        headNode = null;
        baseNode = null;
        shootNode = null;
        static headMesh = null;
        static baseMesh = null;
        static headMaterial = null;
        static baseMaterial = null;
        roundsPerSecond = null;
        reloadsEverySecond = null;
        roundsTimer = 0;
        reloadTimer = 0;
        magazineCapacity = null;
        magazineRounds = null;
        async initConfigAndAllNodes() {
            let graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.gatlingTurret.graphID);
            //TODO|ON-HOLD| REWRITE Turret Mesh and Material component gathering and attaching -> like Destroyer Class
            this.headNode = this.createComponents("GatlingTurretHead", HomeFudge.JSONparser.toVector3(HomeFudge.Config.gatlingTurret.headPosition), graph);
            this.baseNode = this.createComponents("GatlingTurretBase", HomeFudge.JSONparser.toVector3(HomeFudge.Config.gatlingTurret.basePosition), graph);
            //TODO:FixWrongShootNode Position. Shoots above the Barrel
            this.shootNode = this.createShootPosNode(HomeFudge.JSONparser.toVector3(HomeFudge.Config.gatlingTurret.shootNodePosition));
            this.roundsPerSecond = HomeFudge.Config.gatlingTurret.roundsPerSeconds;
            this.reloadsEverySecond = HomeFudge.Config.gatlingTurret.reloadTime;
            this.magazineCapacity = HomeFudge.Config.gatlingTurret.magazineCapacity;
            this.magazineRounds = this.magazineCapacity;
            this.shootNode.addComponent(new ƒ.ComponentAudio(new ƒ.Audio("Sound/autocannon.mp3"))); //TODO: REMOVE TEMP AUDIO move to Resources
            this.headNode.addChild(this.shootNode);
            this.baseNode.addChild(this.headNode);
            this.addChild(this.baseNode);
        }
        createComponents(nodeName, transform, graph) {
            let node = graph.getChildrenByName(nodeName)[0];
            let newNode = new ƒ.Node("nodeName");
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
        createShootPosNode(transform) {
            let shootPosNode = new ƒ.Node("ShootSpawnPos");
            shootPosNode.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(transform))); //From gatConfig.json
            return shootPosNode;
        }
        update = () => {
            if (this.roundsPerSecond == null || this.reloadsEverySecond == null || this.magazineCapacity == null) {
                return;
            }
            if (this.roundsTimer <= this.roundsPerSecond) {
                this.roundsTimer += HomeFudge._deltaSeconds;
            }
            if (this.reloadTimer <= this.reloadsEverySecond) {
                this.reloadTimer += HomeFudge._deltaSeconds;
            }
            //TODO: don't use lookAt function. Better do the math yourself! -> X is forward in my game. Z Forward is Standard
            // this.baseNode.mtxLocal.lookAt(aimPos, new ƒ.Vector3(0, 1, 0), true);
            // this.headNode.mtxLocal.lookAt(new ƒ.Vector3(aimPos.y, aimPos.z, 0), new ƒ.Vector3(0, 0, -1), true);
            // this.headNode.mtxLocal.rotateX(90);
            //fix rotation after LookAt
        };
        //Base rotates on the Y-Aches, Positive number for up
        //Head rotates on the Z-Aches
        //TODO:create a moveToFunction which is public, turn rate based on maxRotSpeed
        moveTurret(xRot, yRot) {
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
        fire(shipVelocity) {
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
                let shot2 = this.shootNode.mtxWorld.clone;
                let spread1x = Math.random() * 0.2 - (Math.random()) * 0.2;
                let spread1y = Math.random() * 0.2 - (Math.random()) * 0.2;
                let spread1z = Math.random() * 0.2 - (Math.random()) * 0.2;
                shot2.rotate(new ƒ.Vector3(spread1x, spread1y, spread1z));
                new HomeFudge.GatlingBullet(shipVelocity, shot2);
                //TEST end
                this.roundsTimer = 0;
                this.magazineRounds--;
                FudgeCore.Debug.log("RoundsLeft: " + this.magazineRounds);
                this.shootNode.getComponent(ƒ.ComponentAudio).volume = 10;
                this.shootNode.getComponent(ƒ.ComponentAudio).play(true);
            }
        }
        fireAt(shipVelocity, target) {
            //Look at rotates Z towards target.
            //MtxLocal.LookAt
            //TODO: I need a way to recreate the lookAt function from ƒ to only have vectors and not using the Matrix4x4. And I need a way to have the Y-AchesUp
            let test = ƒ.Vector3.ZERO();
            test = target;
            test.subtract(this.shootNode.mtxLocal.translation);
            test.normalize(1);
            console.log(HomeFudge.Mathf.RadiantToDegree(ƒ.Vector3.DOT(test, this.shootNode.mtxLocal.translation)).toString());
        }
        constructor() {
            super("GatlingTurret");
            this.initConfigAndAllNodes();
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    HomeFudge.GatlingTurret = GatlingTurret;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class LaserBeam extends ƒ.Node {
        static graph = null;
        static mesh = null;
        material = null;
        async init(pos) {
            LaserBeam.graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.laserBeam.graphID);
            let tempResource = await HomeFudge.Resources.getComponentNode("LaserBeam", LaserBeam.graph);
            if (LaserBeam.mesh == null) {
                LaserBeam.mesh = tempResource.getComponent(ƒ.ComponentMesh).mesh;
            }
            this.material = tempResource.getComponent(ƒ.ComponentMaterial).material;
            this.addComponents(pos);
        }
        addComponents(pos) {
            this.addComponent(new ƒ.ComponentMaterial(this.material));
            this.addComponent(new ƒ.ComponentMesh(LaserBeam.mesh));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(pos)));
            this.getComponent(ƒ.ComponentMesh).activate(false);
        }
        constructor(side, position) {
            super("LaserBeam" + side);
            this.init(position);
        }
    }
    HomeFudge.LaserBeam = LaserBeam;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class RotThrusters extends ƒ.Node {
        static graph = null;
        static mesh = null;
        static material = null;
        static animation = null;
        async init(side, position) {
            console.log("addling: " + this.name);
            RotThrusters.graph = await HomeFudge.Resources.getGraphResources(HomeFudge.Config.destroyer.graphID);
            let node = await HomeFudge.Resources.getComponentNode("ThrustExhaust", RotThrusters.graph);
            if (RotThrusters.material == null || RotThrusters.mesh == null) {
                RotThrusters.material = node.getComponent(ƒ.ComponentMaterial).material;
                RotThrusters.mesh = node.getComponent(ƒ.ComponentMesh).mesh;
                RotThrusters.animation = node.getComponent(ƒ.ComponentAnimator).animation;
            }
            this.createComponents(position);
            this.mtxLocal.scale(new ƒ.Vector3(4, 4, 4));
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
        createComponents(position) {
            this.addComponent(new ƒ.ComponentMesh(RotThrusters.mesh));
            this.addComponent(new ƒ.ComponentMaterial(RotThrusters.material));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position)));
            let animator = new ƒ.ComponentAnimator(RotThrusters.animation);
            animator.quantization = ƒ.ANIMATION_QUANTIZATION.DISCRETE;
            this.addComponent(animator);
        }
        constructor(side, position) {
            super(side + "RotThruster");
            this.init(side, position);
        }
    }
    HomeFudge.RotThrusters = RotThrusters;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class Camera extends ƒ.Node {
        attachedTo = null;
        camComp = null;
        camNode = null;
        offset = null;
        attachToShip(ship) {
            this.offset = HomeFudge.JSONparser.toVector3(HomeFudge.Config.camera.offset);
            this.camNode.mtxLocal.translation = this.offset;
            this.attachedTo = ship;
            this.mtxLocal.set(ship.mtxWorld);
            this.camNode.mtxLocal.rotation = new ƒ.Vector3(0, -270, 0); //TODO: Sound Bug when Pivot is rotated 
            //TODO: add node for campComp
            ship.addChild(this);
        }
        update = () => {
            //TODO: remove test rotation
            //  this.mtxLocal.rotateY(10*_deltaSeconds);
        };
        init() {
            this.camComp = new ƒ.ComponentCamera();
            this.camComp.projectCentral(1.77, 75, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.1, 30000);
            this.camNode = new ƒ.Node("camPivotNode");
            this.camNode.addComponent(new ƒ.ComponentTransform());
            this.camNode.addComponent(this.camComp);
            this.addChild(this.camNode);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO())));
        }
        constructor(name) {
            super(name + "Camera");
            this.init();
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    HomeFudge.Camera = Camera;
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    //TODO: add MouseClickOnce to get a one click press
    /**
     * The  Mouse class is a TypeScript class that tracks mouse movement and button presses.
     *
     * @static position: ƒ.Vector2;
     * @static movedDistance: ƒ.Vector2;
     * @ArthurErlich <arthur.erlich@hs-furtwangen.de>}
     */
    class Mouse {
        static position = new ƒ.Vector2(0, 0);
        static movedDistance = new ƒ.Vector2(0, 0);
        static isHidden = false;
        /**
         * This array should be the same length as the {@link MOUSE_CODE }
         */
        static isPressed = new Array(3); // length of MOUSE_CODE enum
        static tempPos = new ƒ.Vector2(0, 0);
        /**
         * This function initializes mouse event listeners and sets up variables for tracking mouse
         * movement.
         * @ArthurErlich <arthur.erlich@hs-furtwangen.de>
         */
        static init() {
            HomeFudge._viewport.canvas.addEventListener("mousemove", Mouse.moveUpdate);
            HomeFudge._viewport.canvas.addEventListener("mousedown", Mouse.mouseDown);
            HomeFudge._viewport.canvas.addEventListener("mouseup", Mouse.mouseUp);
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, Mouse.update);
        }
        /**
         * This is a private static arrow function called `update` that is used to update the
         * `movedDistance` property of the `Mouse` class. It calculates the distance the mouse has
         * moved since the last frame by subtracting the current position of the mouse from the
         * previous position stored in `tempPos`. It then updates `tempPos` to the current position of
         * the mouse so that it can be used to calculate the distance moved in the next frame.
         * @ArthurErlich <arthur.erlich@hs-furtwangen.de>
         */
        static update = () => {
            Mouse.movedDistance.set(Mouse.tempPos.x - Mouse.position.x, Mouse.tempPos.y - Mouse.position.y);
            Mouse.tempPos = Mouse.position;
        };
        /**
         * This is a private static arrow function called `moveUpdate` that is used to update the
         * `position` and `movedDistance` properties of the `Mouse` class when the mouse is moved. It
         * takes a `MouseEvent` object as its parameter and sets the `movedDistance` property to a new
         * `Vector2` object with the `movementX` and `movementY` properties of the `MouseEvent`. It
         * also sets the `position` property to a new `Vector2` object with the `x` and `y` properties
         * of the `MouseEvent`.
        */
        static moveUpdate = (_event) => {
            //switched to set for performance reasons.
            Mouse.movedDistance.set(_event.movementX, _event.movementY);
            Mouse.position.set(_event.clientX, _event.clientY);
        };
        /**
         * The function sets the corresponding value in the Mouse.isPressed array based on the button
         * pressed during a mouse down event.
         *
         * @param _event The _event parameter is a MouseEvent object that contains information about
         * the mouse event that occurred, such as the type of event (e.g. mouse down, mouse up, mouse
         * move), the position of the mouse cursor, and which mouse button was pressed.
         */
        static mouseDown(_event) {
            switch (_event.button) {
                case MOUSE_CODE.RIGHT:
                    Mouse.isPressed[MOUSE_CODE.RIGHT] = MOUSE_CODE.RIGHT;
                    break;
                case MOUSE_CODE.LEFT:
                    Mouse.isPressed[MOUSE_CODE.LEFT] = MOUSE_CODE.LEFT;
                    break;
                case MOUSE_CODE.MIDDLE:
                    Mouse.isPressed[MOUSE_CODE.MIDDLE] = MOUSE_CODE.MIDDLE;
                    break;
                default:
                    break;
            }
        }
        /**
         * The function handles the mouse up event and updates the state of the mouse button that was
         * released.
         *
         * @param _event The _event parameter is a MouseEvent object that contains information about
         * the mouse event that occurred, such as the type of event (e.g. mouseup), the target element
         * that triggered the event, and the position of the mouse cursor at the time of the event.
         */
        static mouseUp(_event) {
            switch (_event.button) {
                case MOUSE_CODE.RIGHT:
                    Mouse.isPressed[MOUSE_CODE.RIGHT] = null;
                    break;
                case MOUSE_CODE.LEFT:
                    Mouse.isPressed[MOUSE_CODE.LEFT] = null;
                    break;
                case MOUSE_CODE.MIDDLE:
                    Mouse.isPressed[MOUSE_CODE.MIDDLE] = null;
                    break;
                default:
                    break;
            }
        }
        /**
         * The function checks if any of the mouse buttons in the input array are currently pressed.
         *
         * @param inputs An array of MOUSE_CODE values that represent the mouse buttons being checked
         * for being pressed.
         * @return A boolean value is being returned, which indicates whether the Mouse is pressed.
         */
        static isPressedOne(inputs) {
            for (let index = 0; index <= Mouse.isPressed.length; index++) {
                for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
                    if (inputs[inputIndex] == Mouse.isPressed[index]) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    HomeFudge.Mouse = Mouse;
    /**
     * Note: adding buttons means to lengthen the {@link Mouse.isPressed}
     */
    let MOUSE_CODE;
    (function (MOUSE_CODE) {
        MOUSE_CODE[MOUSE_CODE["LEFT"] = 0] = "LEFT";
        MOUSE_CODE[MOUSE_CODE["MIDDLE"] = 1] = "MIDDLE";
        MOUSE_CODE[MOUSE_CODE["RIGHT"] = 2] = "RIGHT";
    })(MOUSE_CODE = HomeFudge.MOUSE_CODE || (HomeFudge.MOUSE_CODE = {}));
})(HomeFudge || (HomeFudge = {}));
var HomeFudge;
(function (HomeFudge) {
    var ƒ = FudgeCore;
    class Player extends ƒ.Node {
        destroyer = null;
        selectedWeapon = null; //TODO:Check if ok
        moveDirection = ƒ.Vector3.ZERO();
        update = () => {
            if (HomeFudge.Mouse.isPressedOne([HomeFudge.MOUSE_CODE.LEFT])) {
                this.destroyer.fireWeapon(this.selectedWeapon, new ƒ.Vector3(100, 100, 0));
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ALT_LEFT])) {
                this.rotateShip();
                //TODO: PointerLock enabled
            }
            else {
                //TODO: PointerLock disabled
                this.updateShipMovement();
            }
            this.updateWeaponSelection();
            this.destroyer.move(this.moveDirection);
            this.moveDirection = ƒ.Vector3.ZERO();
            // //TODO: use PlayerCamera instant of mainCamera
            // //TODO: pan camera only a specific threshold
            //TODO: mouse panning for something elses
            // _mainCamera.camComp.mtxPivot.rotation = new ƒ.Vector3(
            //     _mainCamera.camComp.mtxPivot.rotation.x,
            //     -(Mouse.position.x - (_viewport.canvas.width / 2)) / 100,
            //     _mainCamera.camComp.mtxPivot.rotation.z
            // );
        };
        selectWeapon(weapon) {
            switch (weapon) {
                case this.destroyer.WEAPONS.GATLING_TURRET:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                        HomeFudge._viewport.canvas.style.cursor = "url(Textures/MouseAimCurser.png) 16 16, crosshair";
                    }
                    break;
                case this.destroyer.WEAPONS.BEAM_TURRET:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                        HomeFudge._viewport.canvas.style.cursor = "url(Textures/GatlingTurretAimCurser.png) 16 16, crosshair";
                    }
                    break;
                case this.destroyer.WEAPONS.ROCKET_POD:
                    if (this.selectedWeapon != weapon) {
                        this.selectedWeapon = weapon;
                    }
                    break;
                default:
                    console.warn("no WP selected");
                    break;
            }
        }
        rotateShip() {
            throw new Error("Method not implemented.");
        }
        updateWeaponSelection() {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ONE])) {
                //Gatling -> //TODO: Create Look on with mouse
                this.selectWeapon(this.destroyer.WEAPONS.GATLING_TURRET);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.TWO])) {
                //Beam
                this.selectWeapon(this.destroyer.WEAPONS.BEAM_TURRET);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.THREE])) {
                //Rocket
                this.selectWeapon(this.destroyer.WEAPONS.ROCKET_POD);
            }
        }
        updateShipMovement() {
            /*
            Rotation :
             left ->this.destroyer.rotate(1);
             RIGHT ->this.destroyer.rotate(-1);

            */
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                //LEFT STARVE
                this.moveDirection.set(this.moveDirection.x, this.moveDirection.y, -1);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                //RIGHT STARVE
                this.moveDirection.set(this.moveDirection.x, this.moveDirection.y, 1);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //FORWARD
                this.moveDirection.set(1, this.moveDirection.y, this.moveDirection.z);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                //BACKWARD
                this.moveDirection.set(-1, this.moveDirection.y, this.moveDirection.z);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT])) {
                //BACKWARD
                this.moveDirection.set(this.moveDirection.z, this.moveDirection.y, this.moveDirection.z);
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT])) {
                //BACKWARD
                this.moveDirection = new ƒ.Vector3(this.moveDirection.z, this.moveDirection.y, this.moveDirection.z);
            }
        }
        init() {
            this.initAudio();
            this.initShip(HomeFudge.Ship.SHIPS.DESTROYER);
        }
        initAudio() {
            //inits Music Soundtrack
            let audioComp = new ƒ.ComponentAudio(new ƒ.Audio("Sound/Background/10.Cycles.mp3"), true); //TODO:Move sound to recourses
            //Sound by IXION!
            audioComp.volume = 0.1;
            audioComp.play(true);
            HomeFudge._mainCamera.camNode.addComponent(audioComp); //TODO: Change to player Camera
        }
        initShip(ship) {
            switch (ship) {
                case HomeFudge.Ship.SHIPS.DESTROYER:
                    this.destroyer = new HomeFudge.Destroyer(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.ZERO()));
                    this.addChild(this.destroyer);
                    this.selectWeapon(this.destroyer.WEAPONS.BEAM_TURRET);
                    break;
                default:
                    console.warn("no Ship found: " + ship);
                    break;
            }
        }
        constructor(name) {
            super(name);
            this.init();
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    HomeFudge.Player = Player;
})(HomeFudge || (HomeFudge = {}));
//# sourceMappingURL=Script.js.map