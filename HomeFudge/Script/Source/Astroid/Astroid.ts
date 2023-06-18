//TODO Add astroid!! SMALL MEDIUM LARGE
namespace HomeFudge {
    import ƒ = FudgeCore;
    enum SIZE {
        SMALL = "SMALL",
        MEDIUM = "MEDIUM",
        LARGE = "LARGE"
    }
    export class Astroid extends GameObject {
        private SIZE = SIZE;

        protected maxHealth:number;
        protected hitPoints: number;

        //this is an large Astorid example
        //Mesh and Material index is equal to node index

        public update(): void {
        }
        // public static getRandomSize():SIZE{
        //     return SIZE.LARGE //RNG°
        // }
        public static getLarge(): SIZE {
            return SIZE.LARGE //RNG°
        }
        public static spawn(location: ƒ.Vector3, size?: SIZE): Astroid {//MAKE RNG number. Look at dev doc
            let astroid:Astroid = null;
            if (size == null || size == undefined) {
                size = Astroid.getLarge(); // change to random when ready
            }

            switch (size) {
                case SIZE.LARGE:
                    astroid =  new AstroidLarge(location);
                    _worldNode.addChild(astroid);
                    break;
                case SIZE.MEDIUM:
                    console.warn("Medium astroids dont have a class");

                    break;
                case SIZE.SMALL:
                    console.warn("Small astroids dont have a class");

                    break;
                default:
                    break;
            }
            return astroid;
        }

        public alive(): boolean {
            throw new Error("Method not implemented.");
        }
        public remove(): void {
            throw new Error("Method not implemented.");
        }
        public getMaxHP():number{
            return this.maxHealth;
        }
        public getHP():number{
            return this.hitPoints;
        }

        protected static loadMeshList(nodes: ƒ.Node[]): ƒ.Mesh[] {
            if (nodes[0].name == undefined) {
                console.error(nodes + " is empty or undefined");
                return null;
            }
            let meshList: ƒ.Mesh[] = new Array(nodes.length);
            for (let index = 0; index < nodes.length; index++) {
                meshList[index] = nodes[index].getComponent(ƒ.ComponentMesh).mesh;
            }
            return meshList;
        }
        protected static loadMaterialList(nodes: ƒ.Node[]): ƒ.Material[] {
            if (nodes[0].name == undefined) {
                console.error(nodes + " is empty or undefined");
                return null;
            }
            let materialList: ƒ.Material[] = new Array(nodes.length);
            for (let index = 0; index < nodes.length; index++) {
                materialList[index] = nodes[index].getComponent(ƒ.ComponentMaterial).material;
            }
            return materialList;
        }
        protected static setupRigidbody(location: ƒ.Vector3, boundingBox: ƒ.Vector3, spawnRotEffect:number): ƒ.ComponentRigidbody {
            let rotEffect: number = 0.0025;
            let rigidBody: ƒ.ComponentRigidbody;

            rigidBody = new ƒ.ComponentRigidbody(
                Config.astroid.size.LARGE.mass,
                ƒ.BODY_TYPE.DYNAMIC,
                ƒ.COLLIDER_TYPE.CUBE,
                ƒ.COLLISION_GROUP.DEFAULT,
                ƒ.Matrix4x4.TRANSLATION(location)
            );

            rigidBody.mtxPivot.scale(ƒ.Vector3.SUM(boundingBox, boundingBox));
            rigidBody.setPosition(location);
            rigidBody.restitution = 1;
            rigidBody.effectRotation = new ƒ.Vector3(rotEffect, rotEffect, rotEffect);
            rigidBody.dampRotation = 0;
            rigidBody.dampTranslation = 0;

            rigidBody.setAngularVelocity(new ƒ.Vector3(
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2),
                Math.random() * spawnRotEffect - (spawnRotEffect / 2)
            ));
            // spawnRotEffect = 100;
            // this.rigidBody.setVelocity(new ƒ.Vector3(
            //     Math.random() * spawnRotEffect - (spawnRotEffect / 2),
            //     Math.random() * spawnRotEffect - (spawnRotEffect / 2),
            //     Math.random() * spawnRotEffect - (spawnRotEffect / 2)
            // ));
            return rigidBody;
        }
        constructor(name:string){
            super(name);
        }
    }
}