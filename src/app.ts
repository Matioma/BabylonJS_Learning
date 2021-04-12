import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
} from "@babylonjs/core";

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

  constructor() {
    this._canvas = this._createCanvas();
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);

    var camera: ArcRotateCamera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      Vector3.Zero(),
      this._scene
    );
    camera.attachControl(this._canvas, true);
    var light1: HemisphericLight = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      this._scene
    );
    var sphere: Mesh = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      this._scene
    );

    this._input();
    // hide/show the Inspector
    // window.addEventListener("keydown", (ev) => {
    //   // Shift+Ctrl+Alt+I
    //   if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
    //     if (this._scene.debugLayer.isVisible()) {
    //       this._scene.debugLayer.hide();
    //     } else {
    //       this._scene.debugLayer.show();
    //     }
    //   }
    // });
    // run the main render loop
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}
new App();
