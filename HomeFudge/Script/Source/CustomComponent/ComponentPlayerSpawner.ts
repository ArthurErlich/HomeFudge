namespace HomeFudge {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(HomeFudge);  // Register the namespace to FUDGE for serialization

    export class ComponentPlayerSpawner extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(ComponentPlayerSpawner);
        // Properties may be mutated by users in the editor via the automatically created user interface
        

        #cmpTransform: ƒ.ComponentTransform; //Loook how the Transform is ben getting by RIGID BODY COMPONENT IN FUDGE CORE 
        private playerID: string; // input for setting the Player ID on add change look at the avalbe player span in game and check if ID is the same


        constructor() {
            super();
            // Don't start when running in editor
            // if (ƒ.Project.mode == ƒ.MODE.EDITOR)
            //     return;

            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                this.#cmpTransform = this.node.getComponent(ƒ.ComponentTransform);
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
                case ƒ.EVENT.RENDER_PREPARE:
                    break;
            }
        }
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
    }
}