namespace HomeFudge {
    export class Config {
        public static gatlingBullet: GatlingBulletConfig = null;
        public static gatlingTurret: GatlingTurretConfig = null;
        public static beamTurret: BeamTurretConfig = null;
        public static laserBeam: LaserBeam = null;
        public static destroyer: DestroyerConfig = null;
        public static camera: CameraConfig = null;

        /**
         * The function initializes configurations by fetching JSON files and assigning their contents
         * to corresponding variables.
         */
        public static async initConfigs(): Promise<void> {
            let gatBulletResponse: Response = await fetch("Configs/gatBulletConfig.json");
            let gatTurretResponse: Response = await fetch("Configs/gatTurretConfig.json");
            let beamTurretResponse: Response = await fetch("Configs/beamTurretConfig.json");
            let laserBeamResponse:Response = await fetch("Configs/laserBeamConfig.json")
            let destroyerResponse: Response = await fetch("Configs/destroyerConfig.json");
            let cameraResponse: Response = await fetch("Configs/cameraConfig.json");

            Config.gatlingBullet = await gatBulletResponse.json();
            Config.gatlingTurret = await gatTurretResponse.json();
            Config.beamTurret = await beamTurretResponse.json();
            Config.laserBeam = await laserBeamResponse.json();
            Config.destroyer = await destroyerResponse.json();
            Config.camera = await cameraResponse.json();
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
        maxHealthPoints: number;
        RotThruster_FL:  number[];
        RotThruster_FR:  number[];
        RotThruster_BL: number[]; 
        RotThruster_BR: number[];
        [key: string]: string | number | number[];
    }
    interface CameraConfig {
        offset: number[];
        [key: string]: number[];
    }
}