import {
  ArcRotateCamera,
  Engine,
  FreeCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { Player } from "./player";
import { PlayerController } from "./playerController";
import { ResourseManager } from "./ResourceManager";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { MyFollowCamera } from "./FollowCamera";

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;

  private _playerController: PlayerController;
  private _player: Player;

  constructor() {
    this.Start();

    // hide/show the Inspector
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
    console.log("COOl");
  }

  async Start() {
    this._canvas = this._createCanvas();
    this._engine = new Engine(this._canvas, true);
    await this._createScene().then((scene) => {
      this._scene = scene;
    });

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }

  async _createScene(): Promise<Scene> {
    let scene: Scene = new Scene(this._engine);

    scene.collisionsEnabled = true;

    var light1: HemisphericLight = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      scene
    );

    var ground: Mesh = MeshBuilder.CreateBox(
      "Ground",
      { width: 50, height: 1, depth: 50 },
      scene
    );
    ground.position.y = 0.5;
    ground.isPickable = true;
    ground.checkCollisions = true;

    var wall: Mesh = MeshBuilder.CreateBox(
      "RightWall",
      { width: 1, height: 10, depth: 10 },
      scene
    );
    wall.position.x = 10;
    wall.checkCollisions = true;

    await ResourseManager.LoadCharacterAssets(scene).then((mesh) => {
      let boxCollider = MeshBuilder.CreateBox("BoxCollider", {
        width: 1,
        height: 1,
        depth: 1,
      });
      boxCollider.visibility = 0;

      this._player = new Player(mesh, scene, boxCollider);

      let camera = new MyFollowCamera(
        this._player,
        new Vector3(0, 2, -10),
        scene
      );
    });

    this._playerController = new PlayerController(this._player, scene);
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
