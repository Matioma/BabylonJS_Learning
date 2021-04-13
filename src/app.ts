import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Color4,
  FreeCamera,
  EnvironmentHelper,
  Matrix,
  Quaternion,
  StandardMaterial,
  Color3,
  PointLight,
  ShadowGenerator,
} from "@babylonjs/core";
import { AdvancedDynamicTextureTreeItemComponent } from "@babylonjs/inspector/components/sceneExplorer/entities/gui/advancedDynamicTextureTreeItemComponent";
import { Environment } from "./environment";
import { Player } from "./player";

enum State {
  START = 0,
  GAME = 1,
  LOSE = 2,
  CUTSCENE = 3,
}

class App {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;

  private _cutScene: Scene;
  private _gamescene: Scene;

  private _state: State = State.START;

  private assets;
  private __player: Player;

  private _environment: Environment;

  _createCanvas(): HTMLCanvasElement {
    let canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    return canvas;
  }

  _input() {
    //hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (this._scene.debugLayer.isVisible()) {
          this._scene.debugLayer.hide();
        } else {
          this._scene.debugLayer.show();
        }
      }
    });
  }

  async _goToStart() {
    this._engine.displayLoadingUI();

    this._scene.detachControl();

    let scene = new Scene(this._engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    //GUI
    const startBtn = Button.CreateSimpleButton("Start", "Play");
    startBtn.width = 0.2;
    startBtn.height = "40px";
    startBtn.color = "white";
    // startBtn.top = "-14px";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    guiMenu.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      this._goToCutScene();
      scene.detachControl();
    });

    await scene.whenReadyAsync();

    this._engine.hideLoadingUI();

    this._scene.dispose();
    this._scene = scene;
    this._state = State.START;
  }

  async _goToCutScene() {
    this._engine.displayLoadingUI();
    //--SETUP SCENE--
    //dont detect any inputs from this ui while the game is loading
    this._scene.detachControl();
    this._cutScene = new Scene(this._engine);
    let camera = new FreeCamera(
      "camera1",
      new Vector3(0, 0, 0),
      this._cutScene
    );
    camera.setTarget(Vector3.Zero());
    this._cutScene.clearColor = new Color4(0, 0, 0, 1);

    //--PROGRESS DIALOGUE--
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const next = Button.CreateSimpleButton("next", "NEXT");
    next.color = "white";
    next.thickness = 0;
    next.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    next.width = "64px";
    next.height = "64px";
    next.top = "-3%";
    next.left = "-12%";
    guiMenu.addControl(next);

    next.onPointerUpObservable.add(() => {
      this._goToGame();
    });

    await this._cutScene.whenReadyAsync();

    this._engine.hideLoadingUI();

    this._scene.dispose();
    this._state = State.CUTSCENE;
    this._scene = this._cutScene;

    var finishedLoading = false;
    await this._setUpGame().then((res) => {
      finishedLoading = true;
    });
  }

  async _goToGame() {
    this._scene.detachControl();

    let scene = this._gamescene;

    scene.clearColor = new Color4(
      0.01568627450980392,
      0.01568627450980392,
      0.20392156862745098
    );

    const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    //scene.detachControl();

    const loseBtn = Button.CreateSimpleButton("lose", "LOSE");
    loseBtn.width = 0.2;
    loseBtn.height = "40px";
    loseBtn.color = "white";
    loseBtn.top = "-14px";
    loseBtn.thickness = 0;
    loseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    playerUI.addControl(loseBtn);

    loseBtn.onPointerUpObservable.add(() => {
      this._goToLose();
      scene.detachControl();
    });

    var light1: HemisphericLight = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      scene
    );

    await this._initlizeGameAsync(scene);

    await scene.whenReadyAsync();
    scene.getMeshByName("outer").position = new Vector3(0, 3, 0);

    this._scene.dispose();
    this._scene = scene;
    this._state = State.GAME;

    this._engine.hideLoadingUI();
    this._scene.attachControl();
  }

  async _setUpGame() {
    let scene = new Scene(this._engine);
    this._gamescene = scene;

    const environment = new Environment(scene);
    this._environment = environment;
    environment.load();

    await this._loadCharacterAssets(scene);
  }

  async _loadCharacterAssets(scene: Scene) {
    async function loadCharacter() {
      const outer = MeshBuilder.CreateBox(
        "outer",
        {
          width: 2,
          depth: 1,
          height: 3,
        },
        scene
      );
      outer.isVisible = false;
      outer.isPickable = false;
      outer.checkCollisions = true;
      outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

      outer.ellipsoid = new Vector3(1, 1.5, 1);
      outer.ellipsoidOffset = new Vector3(0, 1.5, 0);
      outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);

      var box = MeshBuilder.CreateBox(
        "small1",
        {
          width: 0.5,
          depth: 0.5,
          height: 0.25,
          faceColors: [
            new Color4(0, 0, 0, 1),
            new Color4(0, 0, 0, 1),
            new Color4(0, 0, 0, 1),
            new Color4(0, 0, 0, 1),
            new Color4(0, 0, 0, 1),
            new Color4(0, 0, 0, 1),
          ],
        },
        scene
      );

      box.position.y = 1.5;
      box.position.z = 1;

      var body = MeshBuilder.CreateCylinder(
        "body",
        { height: 3, diameter: 2, tessellation: 2 },
        scene
      );
      var bodyMtl = new StandardMaterial("red", scene);
      bodyMtl.diffuseColor = new Color3(0.8, 0.5, 0.5);
      body.material = bodyMtl;
      body.isPickable = false;
      body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

      box.parent = body;
      body.parent = outer;

      return {
        mesh: outer as Mesh,
      };
    }

    return loadCharacter().then((assets) => {
      this.assets = assets;
    });
  }

  private async _goToLose() {
    this._engine.displayLoadingUI();

    this._scene.detachControl();
    let scene = new Scene(this._engine);

    scene.clearColor = new Color4(0, 0, 0, 1);
    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);

    camera.setTarget(Vector3.Zero());

    //GUI
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const mainBtn = Button.CreateSimpleButton("mainMenu", "Main Menu");

    mainBtn.width = 0.2;
    mainBtn.height = "40px";
    mainBtn.color = "white";

    guiMenu.addControl(mainBtn);

    mainBtn.onPointerUpObservable.add(() => {
      this._goToStart();
    });
    await scene.whenReadyAsync();

    this._engine.hideLoadingUI();

    this._scene.dispose();
    this._scene = scene;
    this._state = State.LOSE;
  }

  private async _main(): Promise<void> {
    await this._goToStart();

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }

  private async _initlizeGameAsync(scene): Promise<void> {
    var light0 = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      scene
    );

    const light = new PointLight("sparkLight", new Vector3(0, 0, 0), scene);
    light.diffuse = new Color3(
      0.08627450980392157,
      0.10980392156862745,
      0.15294117647058825
    );
    light.intensity = 35;
    light.radius = 1;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.darkness = 0.4;

    this.__player = new Player(this.assets, scene, shadowGenerator);
  }
  constructor() {
    this._canvas = this._createCanvas();

    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    this._input();

    this._main();
  }
}
new App();
