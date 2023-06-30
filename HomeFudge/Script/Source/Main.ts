namespace HomeFudge {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");



  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", (event) => <EventListener>start(event));
  document.addEventListener("keydown", (event) => continueLoop(event))


  ///World Node\\\
  export let _worldNode: ƒ.Node = null;

  ///DeltaSeconds\\\
  export let _deltaSeconds: number = 0; //init deltaSeconds to zero for the first frame

  ///Viewport\\\
  export let _viewport: ƒ.Viewport = null;
  //TODO: implement an UI _viewport.pointWorldToClient();//

  ///Player\\\
  let p1: Player = null;

  ///Destroyer\\\
  let astroidList: Astroid[] = null;



  /// ------------T-E-S-T--A-R-E-A------------------\\\
  export enum UPDATE_EVENTS {
    GAME_OBJECTS = "GameObjectUpdate",
    PLAYER_INPUT = "PlayerInputUpdate",
    UI = "UI",
  }
  
  //settings coockie for controll tutorial
  GameStats.setFlags();
  console.log(GameStats.getPlayedStatus());
  
  
  /// ------------T-E-S-T--A-R-E-A------------------\\\

  async function start(_event: CustomEvent): Promise<void> {
    LoadingScreen.remove();
    _viewport = _event.detail;
    _worldNode = _viewport.getBranch();


    // _viewport.physicsDebugMode =ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    console.log(_viewport);
    //Loads Config then initializes the world in the right order
    await loadConfig().then(initWorld).then(() => {
      console.warn("ConfigsLoaded and world Initialized");
    });// to create ships. first load configs than the ships etc..
    async function loadConfig() {
      //loads configs
      console.warn("LoadingConfigs");
      await Config.initConfigs();
      Mouse.init();
      UI.init();
    }
    async function initWorld(): Promise<void> {
      ƒ.Physics.setGravity(ƒ.Vector3.ZERO());
      p1 = new Player("test_P1");
      _viewport.getBranch().addChild(p1);
      _mainCamera.attachToShip(p1.destroyer);
      /// ------------T-E-S-T--A-R-E-A------------------\\\
      let destroyer = new Destroyer(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(500, 0, 0)));
      let mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(400, 30, 0));
      mtx.rotation = new ƒ.Vector3(0, 90, 0);
      let destroyer2 = new Destroyer(mtx);
      _worldNode.appendChild(destroyer2);
      _worldNode.appendChild(destroyer);
      // let node: ƒ.Node= new ƒ.Node("name");
      // let nodeMes = new ƒ.ComponentMesh(new ƒ.MeshSprite);
      // nodeMes.mtxPivot.scale(new ƒ.Vector3(200,200,200));
      // node.addComponent(nodeMes);
      // node.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("lit",ƒ.ShaderLit)));
      // _worldNode.appendChild(node);
      /// ------------T-E-S-T--A-R-E-A------------------\\\
    }

    /// ------------T-E-S-T--A-R-E-A------------------\\\
    //TODO: Before the loop starts. Add an Game Menu draws on frame while updating
    selectedObject = p1;

    let x = 400;
    let y = 10;
    let z = -300;
    astroidList = new Array(20);
    for (let index = 0; index < 20; index++) {
      astroidList[index] = Astroid.spawn(new ƒ.Vector3(x * index * Math.random() - x / 2+100, y * index * Math.random() + 1000 - y / 2, -z * index * Math.random()+100), Astroid.getLarge());
    }
    /// ------------T-E-S-T--A-R-E-A------------------\\\

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 35);  // start the game loop to continuously draw the _viewport, update the audiosystem and drive the physics i/a
  }


  let selectedObject: ƒ.Node = p1;//TODO:REMOVE

  function update(_event: Event): void {
    _deltaSeconds = ƒ.Loop.timeFrameGame / 1000;
    ƒ.Physics.simulate();  // make an update loop just for the Physics. fixed at 30fps to avoid some physics bugs by to many fps
    ƒ.EventTargetStatic.dispatchEvent(new Event(UPDATE_EVENTS.PLAYER_INPUT));
    ƒ.EventTargetStatic.dispatchEvent(new Event(UPDATE_EVENTS.GAME_OBJECTS));

    // GameLoop.update(); <-- different approach instant of dispatching an event for the loop.


    /// ------------T-E-S-T--A-R-E-A------------------\\\
    ƒ.AudioManager.default.update();
    _viewport.draw();
    ƒ.EventTargetStatic.dispatchEvent(new Event(UPDATE_EVENTS.UI)); // UI needs to be updated after drawing the frame


    //move to player, check if the same astroid is selected to stop/ or make a countdown of one second to stop selection spam/ or make
    //Filter nodes. add tag to gameObject
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.F])) {
      let pickViewport: ƒ.Pick[] = ƒ.Picker.pickViewport(_viewport, Mouse.position);

      pickViewport.sort((a, b) => a.zBuffer - b.zBuffer);
      selectedObject = pickViewport[0].node;
      UI_Selection.setNodeToFocus(selectedObject);
    }

    // UI_Selection.update();
    // let uiPos: ƒ.Vector2 = _viewport.pointWorldToClient(selectedObject.mtxWorld.translation);
    UI_Selection.setSize(p1.destroyer.mtxWorld.translation.getDistance(selectedObject.mtxWorld.translation));
    /// ------------T-E-S-T--A-R-E-A------------------\\\
  }




  /// ------------T-E-S-T--A-R-E-A------------------\\\
  // function getPosTest(): void {
  //   let pickCam: ƒ.Pick[] = ƒ.Picker.pickCamera(_worldNode.getChildren(), _viewport.camera, Mouse.position);
  //   let pickViewport: ƒ.Pick[] = ƒ.Picker.pickViewport(_viewport, Mouse.position);

  //   console.log("%c" + "Camera Picker", "background:red");
  //   pickCam.forEach(element => {
  //     console.log("%c" + element.posMesh.toString(), "background:yellow");
  //   });
  //   console.log("-------------");
  //   console.log("%c" + "Viewport Picker", "background:red");
  //   pickViewport.forEach(element => {
  //     console.log("%c" + element.posMesh.toString(), "background:yellow");
  //   });
  //   console.log("-------------");
  // }
  /// ------------T-E-S-T--A-R-E-A------------------\\\



  /// ------------T-E-S-T--A-R-E-A------------------\\\
  //TODO: add a start stop Loop for Debug
  //TODO: add respawn / reset timers and more
  function continueLoop(event: KeyboardEvent) {
    if (event.code == "Insert") {
      ƒ.Loop.continue();
    }
  }

  function getCookie(cName:string) {
    let name = cName + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  /// ------------T-E-S-T--A-R-E-A------------------\\\
}