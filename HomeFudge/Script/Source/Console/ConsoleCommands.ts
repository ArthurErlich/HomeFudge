namespace HomeFudge {
    import ƒ = FudgeCore;
    export class ConsoleCommands{

        //Commands
        /*
        ConsoleCommands.spawnDestroyer(new FudgeCore.Vector3(0,0,0),new FudgeCore.Vector3(0,0,0))
        ConsoleCommands.spawnAstroid(new FudgeCore.Vector3(20,20,20),"large")
        */

        public static spawnDestroyer(position: ƒ.Vector3, rotation: ƒ.Vector3): void {
            let transformation: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
            transformation.translation = position;
            transformation.rotation = rotation;
            _worldNode.appendChild(new Destroyer(transformation));
        }
        public static spawnAstroid(location:ƒ.Vector3, size:string):void{
            if(size.toLowerCase() == "large"){
                Astroid.spawn(location,Astroid.SIZE.LARGE);
            }
        }
    }
}

