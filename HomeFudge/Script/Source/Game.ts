namespace HomeFudge{
    import ƒ = FudgeCore;
    enum GAME_STATE{
        LOADING,
        PAUSE,
        PLAY,
        MENUE,
        RESET
    }
    export class Game{
        public static GAME_STATE: GAME_STATE;

        public static initGame(){
            Game.GAME_STATE = GAME_STATE.LOADING;
            //
        }
    }
}