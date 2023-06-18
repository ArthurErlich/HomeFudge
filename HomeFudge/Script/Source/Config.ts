namespace HomeFudge {
    export class Config {
        private static errorText: string = "There was an Error on loading the Configs for"

        public static gatlingBullet: GatlingBullet = null;
        public static gatlingTurret: GatlingTurret = null;
        public static beamTurret: BeamTurret = null;
        public static laserBeam: LaserBeam = null;
        public static destroyer: Destroyer = null;
        public static camera: Camera = null;
        public static astroid: Astroid = null;
        public static ui: Ui = null;

        /**
         * The function initializes configurations by fetching JSON files and assigning their contents
         * to corresponding variables.
         */
        public static async initConfigs(): Promise<void> {
            let gatBulletResponse: Response = await fetch("Configs/gatBulletConfig.json");
            let gatTurretResponse: Response = await fetch("Configs/gatTurretConfig.json");
            let beamTurretResponse: Response = await fetch("Configs/beamTurretConfig.json");
            let laserBeamResponse: Response = await fetch("Configs/laserBeamConfig.json")
            let destroyerResponse: Response = await fetch("Configs/destroyerConfig.json");
            let cameraResponse: Response = await fetch("Configs/cameraConfig.json");
            let astroidResponse: Response = await fetch("Configs/astroidConfig.json");
            let uiResponse: Response = await fetch("Configs/uiConfig.json");



            try {
                Config.gatlingBullet = await gatBulletResponse.json();
            } catch (error) {
                Config.printError(error, GatlingBullet.name);
            }
            try {
                Config.gatlingTurret = await gatTurretResponse.json();
            } catch (error) {
                Config.printError(error, GatlingTurret.name);
            }
            try {
                Config.beamTurret = await beamTurretResponse.json();
            } catch (error) {
                Config.printError(error, BeamTurret.name);
            }
            try {
                Config.laserBeam = await laserBeamResponse.json();
            } catch (error) {
                Config.printError(error, "Beam");
            }
            try {
                Config.destroyer = await destroyerResponse.json();
            } catch (error) {
                Config.printError(error, Destroyer.name);
            }
            try {
                Config.camera = await cameraResponse.json();
            } catch (error) {
                Config.printError(error, Camera.name);
            }
            try {
                Config.astroid = await astroidResponse.json();
            } catch (error) {
                Config.printError(error, Astroid.name);
            }
            try {
                Config.ui = await uiResponse.json();
            } catch (error) {
                Config.printError(error, "UI");
            }


        }
        private static printError(error: Error, object: string) {
            console.error(Config.errorText + " " + object + ": " + error + "\n\n %cAssure that the config.json is correctly written.", "font-weight: bold;");
        }

    }
    ///interface for Blender positions and configs for all parts of the Game\\\
    interface GatlingTurret {
        ///graph of all resource for the turret\\\
        graphID: string;
        ///position for the nodes\\\
        headPosition: number[];
        basePosition: number[];
        shootNodePosition: number[];
        ///rotation stuff\\\
        maxRotSpeed: number;
        maxPitch: number;
        minPitch: number;
        ///shooting stuff\\\
        roundsPerSeconds: number;
        reloadTime: number;
        magazineCapacity: number;
        [key: string]: number[] | number | string;
    }
    interface GatlingBullet {
        graphID: string;
        maxLifeTime: number;
        maxSpeed: number;
        spreadRadius: number;
        mass: number;
        [key: string]: string | number;
    }
    interface BeamTurret {
        graphID: string;
        maxRotSpeed: number;
        maxPitch: number;
        minPitch: number;
        beamTime: number;
        reloadTime: number;
        range: number;
        basePosition: number[];
        beamPosition: number[];

        [key: string]: string | number | number[];
    }
    interface LaserBeam {
        graphID: string;
        [key: string]: string;
    }
    interface Destroyer {
        graphID: string;
        maxAcceleration: number;
        maxSpeed: number;
        maxTurnSpeed: number;
        maxTurnAcceleration: number;
        mass: number;
        maxHealthPoints: number;
        //Forward facing Thrusters
        RotThruster_FL: number[];
        RotThruster_FDL: number[];
        RotThruster_FUL: number[];
        RotThruster_FR: number[];
        RotThruster_FDR: number[];
        RotThruster_FUR: number[];
        //Backwards facing Thrusters
        RotThruster_BL: number[];
        RotThruster_BDL: number[];
        RotThruster_BUL: number[];
        RotThruster_BR: number[];
        RotThruster_BDR: number[];
        RotThruster_BUR: number[];
        MainThrusterA: number[];
        MainThrusterB: number[];
        [key: string]: string | number | number[];
    }
    interface Camera {
        offset: number[];
        [key: string]: number[];
    }
    //#region Astroid
    interface Astroid {
        graphID: string;
        size: AstroidSize;
        seedNodes: AstroidSeedNodes;
        [key: string]: string | AstroidSize | AstroidSeedNodes;
    }
    class AstroidSeedNodes {
        public small: string[];
        public medium: string[];
        public large: string[];
        constructor(_small: string[], _medium: string[], _large: string[]) {
            this.small = _small;
            this.medium = _medium;
            this.large = _large;
        }
    }
    class AstroidSize {
        public SMALL: AstroidData;
        public MEDIUM: AstroidData;
        public LARGE: AstroidData;

        constructor(_small: AstroidData, _medium: AstroidData, _large: AstroidData) {
            if (_small == undefined) {
                throw new Error("Small Astroid is undefined in the config!");
            }
            if (_medium == undefined) {
                throw new Error("Medium Astroid is undefined in the config!");
            }
            if (_large == undefined) {
                throw new Error("Large Astroid is undefined in the config!");
            }
            this.SMALL = _small;
            this.MEDIUM = _medium;
            this.LARGE = _large;
        }
    }
    class AstroidData {
        public hitpoints: number;
        public mass: number;
        public spawnRotSpeed: number;
        constructor(_hitpoints: number, _mass: number, _spawnRotSpeed: number) {
            if (_mass == undefined || typeof _mass == 'number') {
                this.mass = 0;
                throw new Error("Mass is undefined in the config!");
            }
            if (_hitpoints == undefined || typeof _hitpoints == 'number') {
                this.hitpoints = 0;
                throw new Error("HitPoints is undefined in the config!");
            }
            if (_spawnRotSpeed == undefined || typeof _spawnRotSpeed == 'number') {
                this.spawnRotSpeed = 0;
                throw new Error("Spawn rotation speed is undefined in the config!");
            }
            this.hitpoints = _hitpoints;
            this.mass = _mass;
            this.spawnRotSpeed = _spawnRotSpeed;
        }
    }
    //#endregion Astroid

    //#region UI
    interface Ui {
        scaling: number;
        fontSize: number;
        selection: UI_Selection;

        [key: string]: number | UI_Selection;
    }
    class UI_Selection {
        healthBarWidth: number;
        healthBarHight: number;
        healthBarTextSize: number;
        selectionRingRadius: number;
        ringBorderWidth: number;
        constructor(_healthBarWidth: number, _healthBarHight: number, _healthBarTextSize: number, _selectionRingRadius: number, _ringBorderWidth: number) {
            this.healthBarWidth = _healthBarWidth;
            this.healthBarHight = _healthBarHight;
            this.healthBarTextSize = _healthBarTextSize;
            this.selectionRingRadius = _selectionRingRadius;
            this.ringBorderWidth = _ringBorderWidth;
        }
    }
    //#endregion UI
}