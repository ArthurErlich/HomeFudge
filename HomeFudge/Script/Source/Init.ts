namespace HomeFudge {
    import ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    window.addEventListener("load", init);

    export let _mainCamera: Camera;
    let cmpCamera: ƒ.ComponentCamera;

    let canvas: HTMLCanvasElement;
    let viewport: ƒ.Viewport;
    let cmpListener: ƒ.ComponentAudioListener;

    function init(_event: Event): void {
        _mainCamera = new Camera("Main");
        cmpCamera = _mainCamera.camComp

        canvas = document.querySelector("canvas");

        viewport = new ƒ.Viewport();
        cmpListener = new ƒ.ComponentAudioListener();



        let dialog: HTMLDialogElement = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            dialog.close();
            let graphId: string = document.head.querySelector("meta[autoView]").getAttribute("autoView")
            startInteractiveViewport(graphId);
        });
        dialog.showModal();
    }
    async function startInteractiveViewport(graphId: string): Promise<void> {
        // load resources referenced in the link-tag
        LoadingScreen.init(canvas);

        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        let graph: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources[graphId];
        FudgeCore.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // hide the cursor when right clicking, also suppressing right-click menu
        // canvas.addEventListener("mousedown", function (event) {
        //     if (event.button == 2) {
        //         canvas.requestPointerLock();
        //     }
        // });
        // canvas.addEventListener("mouseup", function (event) {
        //     if (event.button == 2) {
        //         document.exitPointerLock();
        //     }
        // });

        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        // setup audio
        cmpCamera.node.addComponent(cmpListener);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        
        // draw viewport once for immediate feedback
        viewport.draw();

        // dispatch event to signal startup done
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
        // setup the viewport
    }
}