import {
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";

export class MyFollowCamera extends TransformNode {
  private _camera: UniversalCamera;
  private _target: TransformNode;

  private _offset: Vector3;

  constructor(target: TransformNode, offset: Vector3, scene: Scene) {
    super("CameraRoot");
    this._camera = new UniversalCamera("Camera", new Vector3(0, 0, 0), scene);
    this._camera.parent = this;

    this._target = target;

    this._offset = offset;
    this.position = this._target.position.add(offset);
    // this.position = offset;
    // this._offset = this.position.subtract(target.position);

    scene.registerBeforeRender(() => {
      this.update();
    });
  }

  update(): void {
    let newPosition: Vector3 = this._target.position.add(this._offset);

    this.position = Vector3.Lerp(this.position, newPosition, 0.01);
  }
}
