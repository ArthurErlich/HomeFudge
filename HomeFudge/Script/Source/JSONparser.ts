/* This code defines a namespace called `HomeFudge` and exports a class called `JSONparser` with a
static method `toVector3`. The method takes an array of numbers and returns a new instance of the
`ƒ.Vector3` class from the `FudgeCore` library, using the values from the array as its x, y, and z
components. */
namespace HomeFudge{
    import ƒ = FudgeCore;
    export class JSONparser{
       /**
        * This function takes an array of three numbers and returns a new Vector3 object with those
        * values.
        * 
        * @param value An array of three numbers representing the x, y, and z components of a vector.
        * @return A new instance of the ƒ.Vector3 class with the x, y, and z values set to the values
        * in the input array.
        * @author Arthur Erlich <arthur.erlich@hs-furtwangen.de>
        */
        public static toVector3(value:number[]):ƒ.Vector3{
            return new ƒ.Vector3(value[0],value[1],value[2]);
        }
    }
}