import {
  ArcRotateCamera,
  Mesh,
  Ray,
  Scene,
  ShadowGenerator,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";

export class Player extends TransformNode {
  private mesh: Mesh;
  private speed: number = 5;

  constructor(assets, scene: Scene) {
    super("player", scene);

    this.mesh = assets;
    this.mesh.parent = this;

    this._scene.onBeforeRenderObservable.add(() => {
      console.log(this._isGrounded());
    });
  }

  public MovePlayer(direction: Vector3): void {
    let delta: number = this._scene.getEngine().getDeltaTime() / 1000;
    let deltaVelocity = delta * this.speed;

    let offset: Vector3 = direction
      .normalize()
      .multiplyByFloats(deltaVelocity, deltaVelocity, deltaVelocity);
    this.position.addInPlace(offset);
  }

  public MovePlayerWithCollision(): void {}

  public rayCast(start: Vector3, end: Vector3, length: number) {
    let ray = new Ray(start, end.subtract(start).normalizeToNew(), length);

    let predicate = function (mesh: Mesh) {
      return mesh.isPickable && mesh.isEnabled();
    };

    let pick = this._scene.pickWithRay(ray, predicate);

    if (pick.hit) {
      return pick.pickedPoint;
    } else {
      return null;
    }
  }

  private _isGrounded(): boolean {
    if (this.rayCast(this.position, Vector3.Down(), 1) != null) {
      return true;
    }
    return false;
  }
}
