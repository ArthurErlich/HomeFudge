namespace HomeFudge{
    import ƒ=FudgeCore;
    export class Resources{
        public static async getGraphResources(graphID: string): Promise<ƒ.Graph> {
            let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphID]
            if (graph == null) {
                console.warn(graph + " not found with ID: " + graphID);
            }
            return graph;
        }
        public static async getComponentNode(nodeName: string, graph: ƒ.Graph): Promise<ƒ.Node> {
            let node: ƒ.Node = graph.getChildrenByName(nodeName)[0];
            if (node == null) {
                console.warn("+\"" + nodeName + "\" not found inside: " + graph.name + "->Graph");
            }
            return node;
        }
    }
}