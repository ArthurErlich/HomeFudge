namespace HomeFudge{
    import ƒ = FudgeCore;
    export class Vector3 extends ƒ.Vector3{

        //Overites the functio wiht additional rw line. Testing anohter mentod to fix axies rotation to fix some fotinpoint errors in the calculation
        public static override TRANSFORMATION(_vector: ƒ.Vector3, _mtxTransform: ƒ.Matrix4x4, _includeTranslation: boolean = true): Vector3 {
            let result: ƒ.Vector3 = ƒ.Recycler.get(ƒ.Vector3);
            let m: Float32Array = _mtxTransform.get();
            let [x, y, z] = _vector.get();
            
            const rx =  m[0] * x + m[4] * y + m[8] * z;
            const ry =  m[1] * x + m[5] * y + m[9] * z;
            const rz =  m[2] * x + m[6] * y + m[10] * z;
            const rw =   1 / (x * m[3] + y * m[7] + z * m[11] + m[15]);
      
            result.x = rx * rw;
            result.y = ry * rw;
            result.z = rz * rw;
      
            if (_includeTranslation) {
              result.add(_mtxTransform.translation);
            }
      
            return result;
          }
    }
}