namespace HomeFudge {
    import ƒ = FudgeCore;
    export class ConsoleCommands{
        public static spawnDestoryer(position: ƒ.Vector3, rotation: ƒ.Vector3): void {
            let transformation: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
            transformation.translation = position;
            transformation.rotation = rotation;
            _worldNode.appendChild(new Destroyer(transformation));
        }
    }
}

