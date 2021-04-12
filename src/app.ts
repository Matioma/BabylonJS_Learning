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
} from "@babylonjs/core";
import { AdvancedDynamicTextureTreeItemComponent } from "@babylonjs/inspector/components/sceneExplorer/entities/gui/advancedDynamicTextureTreeItemComponent";

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
    let camera: ArcRotateCamera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      Vector3.Zero(),
      scene
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

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
    var sphere: Mesh = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );

    await scene.whenReadyAsync();

    this._scene.dispose();
    this._scene = scene;
    this._state = State.GAME;

    this._engine.hideLoadingUI();

    this._scene.attachControl();
  }

  async _setUpGame() {
    let scene = new Scene(this._engine);
    this._gamescene = scene;
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
      switch (this._state) {
        case State.START:
          this._scene.render();
        case State.CUTSCENE:
          this._scene.render();
          break;
        case State.GAME:
          this._scene.render();
          break;
        case State.LOSE:
          this._scene.render();
          break;
        default:
          break;
      }
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
  constructor() {
    this._canvas = this._createCanvas();

    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    this._input();

    this._main();
    // var camera: ArcRotateCamera = new ArcRotateCamera(
    //   "Camera",
    //   Math.PI / 2,
    //   Math.PI / 2,
    //   2,
    //   Vector3.Zero(),
    //   this._scene
    // );
    // camera.attachControl(this._canvas, true);
    // var light1: HemisphericLight = new HemisphericLight(
    //   "light1",
    //   new Vector3(1, 1, 0),
    //   this._scene
    // );
    // var sphere: Mesh = MeshBuilder.CreateSphere(
    //   "sphere",
    //   { diameter: 1 },
    //   this._scene
    // );

    // this._input();

    // this._goToStart();

    // this._engine.runRenderLoop(() => {
    //   this._scene.render();
    // });
  }
}
new App();
