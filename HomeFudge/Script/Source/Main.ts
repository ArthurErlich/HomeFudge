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
  let destroyer: Destroyer = null;
  //TODO: remove debug Destroyer



  /// ------------T-E-S-T--A-R-E-A------------------\\\
  export enum UPDATE_EVENTS {
    GAME_OBJECTS = "GameObjectUpdate",
    PLAYER_INPUT = "PlayerInputUpdate",
  }
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
    }
    async function initWorld(): Promise<void> {
      ƒ.Physics.setGravity(ƒ.Vector3.ZERO());
      p1 = new Player("test_P1");
      _viewport.getBranch().addChild(p1);
      _mainCamera.attachToShip(p1.destroyer);
      /// ------------T-E-S-T--A-R-E-A------------------\\\
      // destroyer = new Destroyer(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(500, 0, 0)));
      // let mtx:ƒ.Matrix4x4 = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(400, 30, 0));
      // mtx.rotation =new ƒ.Vector3(0,90,0);
      // let destroyer2 = new Destroyer(mtx);
      // _worldNode.appendChild(destroyer2);
      // _worldNode.appendChild(destroyer);
      /// ------------T-E-S-T--A-R-E-A------------------\\\
    }

    /// ------------T-E-S-T--A-R-E-A------------------\\\
    //TODO: Before the loop starts. Add an Game Menu draws on frame while updating
    /// ------------T-E-S-T--A-R-E-A------------------\\\

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 35);  // start the game loop to continuously draw the _viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    _deltaSeconds = ƒ.Loop.timeFrameGame / 1000;
    ƒ.Physics.simulate();  // make an update loop just for the Physics. fixed at 30fps
    ƒ.EventTargetStatic.dispatchEvent(new Event(UPDATE_EVENTS.PLAYER_INPUT));
    ƒ.EventTargetStatic.dispatchEvent(new Event(UPDATE_EVENTS.GAME_OBJECTS));


    /// ------------T-E-S-T--A-R-E-A------------------\\\
    // let uiPos: ƒ.Vector2 = _viewport.pointWorldToClient(destroyer.mtxWorld.translation); //TODO: learn the VUI!
    /// ------------T-E-S-T--A-R-E-A------------------\\\

    ƒ.AudioManager.default.update();
    _viewport.draw();

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
  /// ------------T-E-S-T--A-R-E-A------------------\\\
}