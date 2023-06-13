namespace HomeFudge {
    import ƒ = FudgeCore;
    export class AstroidLarge extends Astroid {
        private static graph: ƒ.Graph = null;

        private hitPoints = null;
    
        private static nodeList: ƒ.Node[] = null;
        private static meshList: ƒ.Mesh[] = null;
        private static materialList: ƒ.Material[] = null;

        public override update(): void {
            
        }
        public override alive(): boolean {
            throw new Error("Method not implemented.");
        }
        public override remove(): void {
            throw new Error("Method not implemented.");
        }

        private async init(loacation: ƒ.Vector3) {
            /// needs to be moved to own class
            AstroidLarge.graph = await Resources.getGraphResources(Config.destroyer.graphID);
            if (AstroidLarge.nodeList == null) {
                AstroidLarge.nodeList = await Resources.getMultiplyComponentNodes(Config.astroid.seedNodes.large, AstroidLarge.graph);//<-note: Config.astroid.seedNodes.large, is an array 
            }
        }

        private loadMeshList(nodes: ƒ.Node[]): void{

        }
        private loadMaterialList(nodes: ƒ.Node[]): void{
            
        }
        constructor(location: ƒ.Vector3) {
            super("Astroid_Large_" + location.toString() + "_" + Date.now().valueOf());
            this.init(location);
        }
    }
}

