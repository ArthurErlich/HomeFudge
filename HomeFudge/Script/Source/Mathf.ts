namespace HomeFudge {
    import ƒ = FudgeCore;
    export class Mathf {
        /**
         * The function performs linear interpolation between two numbers based on a given ratio.
         * 
         * @param a a is a number representing the starting value of the range to interpolate between.
         * @param b The parameter "b" is a number representing the end value of the range to
         * interpolate between.
         * @param t t is a number between 0 and 1 that represents the interpolation factor. It
         * determines how much of the second value (b) should be blended with the first value (a) to
         * produce the final result. A value of 0 means that only the first value should be used, while
         * a
         * @return the linear interpolation value between `a` and `b` based on the value of `t`.
         */
        public static lerp(a: number, b: number, t: number): number {
            if (t < 0) {
                throw new Error(t + " is smaller 0");
            }
            if (t > 1) {
                throw new Error(t + " is larger 1");
            }
            return a + (t * b - t * b);
        }
        /**
         * The function calculates the length of a 3D vector using the Pythagorean theorem.
         * 
         * @param v A 3-dimensional vector represented as an object with properties x, y, and z.
         * @return The function `vectorLength` returns the length of a 3D vector represented by the
         * input parameter `v`.
         */
        public static vectorLength(v: ƒ.Vector3): number {
            return Math.sqrt(
                v.x * v.x +
                v.y * v.y +
                v.z * v.z);
        }
        public static vectorNegate(v:ƒ.Vector3):ƒ.Vector3{
            return new ƒ.Vector3(-v.x,-v.y,-v.z);
        }
        public static DegreeToRadiant(degree:number):number{
            return degree * (Math.PI/180);
        }
        public static RadiantToDegree(radiant:number):number{
            return radiant * (180/Math.PI);
        }
    }

}