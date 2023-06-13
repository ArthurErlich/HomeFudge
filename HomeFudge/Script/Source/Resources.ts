namespace HomeFudge {
    import ƒ = FudgeCore;
    export class Resources {
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
        public static async getMultiplyComponentNodes(nodeNames: string[], graph: ƒ.Graph): Promise<ƒ.Node[]> {
            let nodeList: ƒ.Node[] = new Array(nodeNames.length);
            let index: number = 0;
            nodeNames.forEach(name => {
                nodeList[index] = graph.getChildrenByName(name)[0];
                index++;
            });

            if (nodeList == null || nodeList[0] == undefined) {
                console.warn("+\"" + nodeNames.toString() + "\" not found inside: " + graph.name + "->Graph");
            }
            return nodeList;
        }
    }
}