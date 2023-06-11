//TODO Add astroid!! SMALL MEDIUM LARGE
namespace HomeFudge{
    import ƒ = FudgeCore;
    enum SIZE{
        SMALL,
        MEDIUM,
        LARGE
    }
    export class Astroid extends GameObject{
        private SIZE = SIZE;
        private size:SIZE = null;

        public update(): void {
            throw new Error("Method not implemented.");
        }
        public alive(): boolean {
            throw new Error("Method not implemented.");
        }
        public remove(): void {
            throw new Error("Method not implemented.");
        }
        init(location: ƒ.Vector3) {
            this.size = SIZE.LARGE; //MAKE RNG number. Look at dev doc
            throw new Error("Method not implemented.");
        }
        constructor(location:ƒ.Vector3){
            super("Astroid " + location.toString())
            this.init(location);
        }

    }
}