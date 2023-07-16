namespace HomeFudge {
    import ƒ = FudgeCore;
    enum BACKGROUND_MUSIC {
        CYCLES = 0
    }
    enum SOUNDEFFECTS {
        MM10_CANNON_FIRE = 0,
        RCS_FIRE = 1
    }
    export class Audio {
        public static BACKGROUND_MUSIC = BACKGROUND_MUSIC;
        public static SOUNDEFFECTS = SOUNDEFFECTS;
        private static backgroundMusic: ƒ.Audio[] = new Array();
        private static soundEffects: ƒ.Audio[] = new Array();

        static loadAudioFiles(): void {
            // would be nice to load it via a json config file
            this.backgroundMusic.push(new ƒ.Audio("Sound/Background/10.Cycles.mp3"));//Sound by IXION!

            this.soundEffects.push(new ƒ.Audio("Sound/autocannon.mp3"))
            this.soundEffects.push(new ƒ.Audio("Sound/RCS_Fire_Temp.mp3"));

        }
        static getBackgroundMusic(BACKGROUND_MUSIC: BACKGROUND_MUSIC): ƒ.Audio {
            return this.backgroundMusic[BACKGROUND_MUSIC];
        }
        static getSoundEffect(SOUNDEFFECTS: SOUNDEFFECTS): ƒ.Audio {
            return this.soundEffects[SOUNDEFFECTS];
        }
    }
}