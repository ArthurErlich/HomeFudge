namespace HomeFudge {
    import ƒ = FudgeCore;
    export class ConvexHull{
        public static convertToFloat32Array(convexMesh:ƒ.Mesh):Float32Array{
            //TODO:make float 32 array
            let array:Float32Array = new Float32Array(convexMesh.vertices.flatMap((_vertex: ƒ.Vertex, _index:number)=>{
                return [...convexMesh.vertices.position(_index).get()];
            }));     
            return array;
        }
    }
}