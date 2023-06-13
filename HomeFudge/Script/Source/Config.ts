namespace HomeFudge {
    export class Config {
        private static errorText: string = "There was an Error on loading the Configs for"

        public static gatlingBullet: GatlingBulletConfig = null;
        public static gatlingTurret: GatlingTurretConfig = null;
        public static beamTurret: BeamTurretConfig = null;
        public static laserBeam: LaserBeam = null;
        public static destroyer: DestroyerConfig = null;
        public static camera: CameraConfig = null;
        public static astroid: AstroidConfig = null;

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


        }
        private static printError(error: Error, object: string) {
            console.error(Config.errorText + " " + object + ": " + error + "\n\n %cAssure that the config.json is correctly written.", "font-weight: bold;");
        }

    }
    ///interface for Blender positions and configs for all parts of the Game\\\
    interface GatlingTurretConfig {
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
    interface GatlingBulletConfig {
        graphID: string;
        maxLifeTime: number;
        maxSpeed: number;
        spreadRadius: number;
        mass: number;
        [key: string]: string | number;
    }
    interface BeamTurretConfig {
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
    interface DestroyerConfig {
        graphID: string;
        maxAcceleration: number;
        maxSpeed: number;
        maxTurnSpeed: number;
        maxTurnAcceleration: number;
        mass: number;
        maxHealthPoints: number;
        RotThruster_FL: number[];
        RotThruster_FR: number[];
        RotThruster_BL: number[];
        RotThruster_BR: number[];
        MainThrusterA: number[];
        MainThrusterB: number[];
        [key: string]: string | number | number[];
    }
    interface CameraConfig {
        offset: number[];
        [key: string]: number[];
    }
    interface AstroidConfig {
        graphID: string;
        size: string[];
        seedNodes: AstroidSeedNodes;
        [key: string]: string | string[] | AstroidSeedNodes;
    }
    class AstroidSeedNodes {
        public  small: string[];
        public  medium: string[];
        public  large: string[];
        constructor(_small: string[], _medium: string[], _large: string[]) {
            this.small = _small;
            this.medium = _medium;
            this.large = _large;
        }
    }
}