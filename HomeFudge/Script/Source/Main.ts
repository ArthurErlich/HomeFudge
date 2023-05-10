namespace HomeFudge {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");



  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", (event) => <EventListener>start(event));
  document.addEventListener("keydown", (event) => continueLoop(event))


  ///World Node\\\
  export let _worldNode: ƒ.Node = null;

  ///DeltaSeconds\\\
  export let _deltaSeconds: number = null;

  ///Viewport\\\
  export let _viewport: ƒ.Viewport = null;

  ///Player\\\
  let p1: Player = null;


  /// ------------T-E-S-T--A-R-E-A------------------\\\


  /// ------------T-E-S-T--A-R-E-A------------------\\\

  async function start(_event: CustomEvent): Promise<void> {
    LoadingScreen.remove();
    _viewport = _event.detail;
    _worldNode = _viewport.getBranch();

    // _viewport.physicsDebugMode =ƒ.PHYSICS_DEBUGMODE.COLLIDERS;

    console.log(_viewport);
    //Loads Config then initilizes the world in the right order
    await loadConfig().then(initWorld).then(() => {
      console.warn("ConfigsLoaded and world Initialized");
    });// to create ships. first load configs than the ships etc
    async function loadConfig() {
      //loads configs
      performance.now();
      console.warn("LoadingConfigs");
      await Config.initConfigs();
      Mouse.init();
    }
    async function initWorld(): Promise<void> {
      p1 = new Player("test_P1");
      _viewport.getBranch().addChild(p1);
      _mainCamera.attachToShip(p1.destroyer);
      let destroyer = new Destroyer(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(500,0,0)));
      _worldNode.appendChild(destroyer);
      ƒ.Physics.setGravity(ƒ.Vector3.ZERO());
    }

    /// ------------T-E-S-T--A-R-E-A------------------\\\
    /// ------------T-E-S-T--A-R-E-A------------------\\\

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 35);  // start the game loop to continuously draw the _viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // make an update loop just for the Physics. fixed at 30fps
    _deltaSeconds = ƒ.Loop.timeFrameGame / 1000;

    /// ------------T-E-S-T--A-R-E-A------------------\\\
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.DELETE])) {
      ƒ.Loop.stop();
      console.log(_worldNode);
    }

    //TODO: remove error when frames are dropping
    if (ƒ.Loop.fpsGameAverage <= 20) {
      console.warn(ƒ.Loop.fpsGameAverage);
      console.warn("Active bullets in scene: " + _worldNode.getChildrenByName("BulletGatling").length);
      ƒ.Loop.stop();
    }

    // if(Mouse.isPressedOne([MOUSE_CODE.LEFT])){
    //   getPosTest();
    // }
    // let aimPos:ƒ.Vector3 = getAimPos(); //TODO:Remove unused AimingRayCaster

    /// ------------T-E-S-T--A-R-E-A------------------\\\

    _viewport.draw();//TODO move to a loop of 30 frames per second;
    ƒ.AudioManager.default.update();
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

  //DEBUG
  function continueLoop(event: KeyboardEvent) {
    if (event.code == "Insert") {
      ƒ.Loop.continue();
    }
  }
}