namespace HomeFudge {
    import ƒ = FudgeCore;
    /* This is a TypeScript class definition for an abstract class called `Bullet` that extends the
    `ƒ.Node` class. The `export` keyword makes the class available for use in other modules. */
    export abstract class Bullet extends ƒ.Node {
        protected abstract maxLifeTime:number;
        protected abstract maxSpeed:number;

        //abstract faction:string; //may be used later for multiple turrets
        public abstract update():void;
        public abstract destroyNode():void; 
        public abstract toString():string;

        /**
         * This function retrieves a graph resource from a project in TypeScript.
         * 
         * @param graphID A string representing the ID of the graph resource that needs to be
         * retrieved.
         * @return a Promise that resolves to a ƒ.Graph object.
         */
        protected static async getGraphResources(graphID: string): Promise<ƒ.Graph> {
            let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphID]
            if (graph == null) {
                console.warn(graph + " not found with ID: " + graphID);
            }
            return graph;
        }

        /**
         * This function retrieves a specific node from a graph and returns it as a promise.
         * 
         * @param nodeName A string representing the name of the node that is being searched for in the
         * graph.
         * @param graph A ƒ.Graph object, which is a container for nodes and their connections in a
         * scene or game world.
         * @return a Promise that resolves to a ƒ.Node object.
         */
        protected static async getComponentNode(nodeName: string, graph: ƒ.Graph):  Promise<ƒ.Node> {
            let node:ƒ.Node = graph.getChildrenByName(nodeName)[0];
            if (node == null) {
                console.warn("+\"" + nodeName + "\" not found inside: " + graph.name + "->Graph");
            }
            return node;
        }
        

        constructor(idString:string){
            super("Bullet" + idString);
            _worldNode.addChild(this);
            //register to update event            
        }
    }
}