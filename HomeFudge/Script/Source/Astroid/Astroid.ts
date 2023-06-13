//TODO Add astroid!! SMALL MEDIUM LARGE
namespace HomeFudge {
    import ƒ = FudgeCore;
    enum SIZE {
        SMALL = "SMALL",
        MEDIUM = "MEDIUM",
        LARGE = "LARGE"
    }
    export class Astroid extends GameObject {
        private SIZE = SIZE;
    


        //this is an large Astorid example
        //Mesh and Material index is equal to node index

        public update(): void {

        }
        // public static getRandomSize():SIZE{
        //     return SIZE.LARGE //RNG°
        // }
        public static getLarge():SIZE{
            return SIZE.LARGE //RNG°
        }
        public static spawn(location: ƒ.Vector3 , size?:SIZE): void{//MAKE RNG number. Look at dev doc

            if(size == null || size == undefined){
                size = Astroid.getLarge(); // change to random when ready
            }

            switch (size) {
                case SIZE.LARGE:
                    _worldNode.addChild(new AstroidLarge(location)) 
                    break;
                case SIZE.MEDIUM:
                    console.warn("Medium astroids dont have a class");
                    
                    break;
                case SIZE.SMALL:
                    console.warn("Small astroids dont have a class");

                    break;
                default:
                    break;
            }
        }

        public alive(): boolean {
            throw new Error("Method not implemented.");
        }
        public remove(): void {
            throw new Error("Method not implemented.");
        }
    }
}