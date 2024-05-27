namespace HomeFudge {
    // import ƒ = FudgeCore;
    enum GAME_STATS {
        PLAYED_ONCE = "PlayedOnce"
    }
    export abstract class GameStats {

        public static playedOnce: boolean = false;
        public static setInGameFlags() {
            GameStats.getPlayedStatus();
        }

        public static getPlayedStatus(): boolean {
            let playStatus: string = localStorage.getItem(GAME_STATS.PLAYED_ONCE);

            switch (playStatus) {
                case "" || null:
                    GameStats.setPlayedStatus(false);
                    return false;

                case "true":
                    return true;

                case "false":
                    return false;

                default:
                    return false;

            }
        }
        public static setPlayedStatus(_playedOnce: boolean): void {
            let playStatus: string;
            if (_playedOnce) {
                playStatus = "true";
            } else {
                playStatus = "false";
            }
            localStorage.setItem(GAME_STATS.PLAYED_ONCE, playStatus);
            GameStats.playedOnce = _playedOnce;
        }
    }

}