import {
  ArcRotateCamera,
  Mesh,
  Scene,
  ShadowGenerator,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";

export class Player extends TransformNode {
  private static readonly ORIGINAL_TILT: Vector3 = new Vector3(
    0.5934119456780721,
    0,
    0
  );

  private _yTilt;

  public camera: UniversalCamera;

  public scene: Scene;

  private _input;
  public mesh: Mesh;

  private _camRoot;

  constructor(assets, scene: Scene, shadowGenerator: ShadowGenerator, input?) {
    super("player", scene);
    this.scene = scene;
    this._setupPlayerCamera();

    this.mesh = assets.mesh;
    this.mesh.parent = this;

    shadowGenerator.addShadowCaster(assets.mesh);
    this._input = input;
  }

  _setupPlayerCamera(): UniversalCamera {
    this._camRoot = new TransformNode("root");
    this._camRoot.position = new Vector3(0, 0, 0);
    this._camRoot.rotation = new Vector3(0, Math.PI, 0);

    let yTilt = new TransformNode("ytilt");
    yTilt.rotation = Player.ORIGINAL_TILT;

    this._yTilt = yTilt;
    yTilt.parent = this._camRoot;

    this.camera = new UniversalCamera(
      "cam",
      new Vector3(0, 0, -30),
      this.scene
    );
    this.camera.lockedTarget = this._camRoot.position;
    this.camera.fov = 0.47350045992678597;
    this.camera.parent = yTilt;

    this.scene.activeCamera = this.camera;
    return this.camera;
  }

  private _updateCamera(): void {
    let cameraPlayer: number = this.mesh.position.y + 2;
    this._camRoot.position = Vector3.Lerp(
      this._camRoot.position,
      new Vector3(this.mesh.position.x, cameraPlayer, this.mesh.position.z),
      0.4
    );
  }
}
