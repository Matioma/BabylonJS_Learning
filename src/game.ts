import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { PlayerController } from "./playerController";

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;

  private _playerController: PlayerController;

  constructor() {
    this.Start();
    console.log("COOl");
  }

  Start() {
    this._canvas = this._createCanvas();
    this._engine = new Engine(this._canvas, true);
    this._scene = this._createScene();

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }

  _createScene(): Scene {
    let scene: Scene = new Scene(this._engine);

    var camera: ArcRotateCamera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(this._canvas, true);

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
    this._playerController = new PlayerController(scene);

    return scene;
  }

  _createCanvas(): HTMLCanvasElement {
    let canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    return canvas;
  }
}
new Game();
