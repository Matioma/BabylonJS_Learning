import {
  ArcRotateCamera,
  Mesh,
  MeshBuilder,
  PhysicsJoint,
  Ray,
  Scene,
  ShadowGenerator,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import { ThinTexture } from "@babylonjs/core/Materials/Textures/thinTexture";
import { NodeMaterialPropertyGridComponent } from "@babylonjs/inspector/components/actionTabs/tabs/propertyGrids/materials/nodeMaterialPropertyGridComponent";

export class Player extends Mesh {
  private boxCollider: Mesh;
  private mesh: Mesh;
  private speed: number = 9;

  static JUMP_FORCE: number = 5;
  static GRAVITY_ACCELERATION: number = 9;

  private drag: number = 0.95;

  private direction: Vector3 = Vector3.Zero();
  private velocity: Vector3 = Vector3.Zero();

  constructor(assets, scene: Scene, collider: Mesh) {
    super("player", scene, null, collider);

    this.position = new Vector3(0, 2, 0);

    this.visibility = 0;
    this.isPickable = true;
    this.checkCollisions = true;

    this.mesh = assets;
    this.mesh.parent = this;

    this._scene.onBeforeRenderObservable.add(() => {
      this.updatePlayerPosition();

      console.log(this._isGrounded());
    });
  }

  public updatePlayerPosition(): void {
    let delta = this._scene.deltaTime / 1000;
    this.ApplyGravity();
    this.moveWithCollisions(
      this.velocity.multiplyByFloats(delta, delta, delta)
    );

    this.velocity = this.velocity.multiplyByFloats(
      this.drag,
      this.drag,
      this.drag
    );
    this.direction = Vector3.Zero();
  }

  public Jump(): void {
    if (!this._isGrounded()) return;

    this.velocity.addInPlace(
      Vector3.Up().multiplyByFloats(
        Player.JUMP_FORCE,
        Player.JUMP_FORCE,
        Player.JUMP_FORCE
      )
    );
  }

  public ApplyGravity() {
    let delta: number = this._scene.getEngine().getDeltaTime() / 1000;

    let velocityChange = Player.GRAVITY_ACCELERATION * delta;

    let gravitationVelocity = Vector3.Down().multiplyByFloats(
      velocityChange,
      velocityChange,
      velocityChange
    );
    console.log(gravitationVelocity);

    this.velocity.addInPlace(gravitationVelocity);
  }

  public AddVelocity(direction: Vector3) {
    this.direction = this.direction.add(direction).normalize();

    console.log(this.direction);

    let XZPlane = new Vector3(this.direction.x, 0, this.direction.z); //direction ignoring Y Axis\
    let XZPlaneVelocity = XZPlane.multiplyByFloats(
      this.speed,
      this.speed,
      this.speed
    );

    this.velocity = new Vector3(0, this.velocity.y, 0).addInPlaceFromFloats(
      XZPlaneVelocity.x,
      0,
      XZPlaneVelocity.z
    );
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
      return mesh.isPickable && mesh.name != "BoxCollider" && mesh.isEnabled();
    };

    let pick = this._scene.pickWithRay(ray, predicate);
    console.log(pick.pickedMesh.name);

    if (pick.hit) {
      return pick;
    } else {
      return null;
    }
  }

  private _isGrounded(): boolean {
    // console.log(this._boundingInfo.boundingBox.extendSizeWorld.y / 2 + 1);
    if (
      this.rayCast(
        this.position,
        Vector3.Down(),
        this._boundingInfo.boundingBox.extendSizeWorld.y / 2 + 1
      ) != null
    ) {
      return true;
    }
    return false;
  }
}
