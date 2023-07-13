namespace HomeFudge {
    import ƒ = FudgeCore;
    enum GAME_STATS {
        PLAYED_ONCE = "PlayedOnce"
    }
    export class GameStats {

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
                    break;
                case "true":
                    return true;
                    break;
                case "false":
                    return false;
                    break;
                default:
                    return false;
                    break;
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