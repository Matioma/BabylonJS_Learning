import {
  ActionManager,
  ExecuteCodeAction,
  Scalar,
  Scene,
} from "@babylonjs/core";

export class InputController {
  private _scene: Scene;
  public inputMap: any;

  public vertical: number;
  public verticalAxis;

  public horizontal;
  public hotizontalAxis;

  constructor(scene: Scene) {
    scene.actionManager = new ActionManager(scene);

    this.inputMap = {};

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      })
    );

    scene.onBeforeRenderObservable.add(() => {
      this._updateFromKeyboard();
    });
  }

  private _updateFromKeyboard(): void {
    if (this.inputMap["ArrowUp"]) {
      this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
      this.verticalAxis = 1;
    } else if (this.inputMap["ArrowDown"]) {
      this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
      this.verticalAxis = -1;
    } else {
      this.vertical = 0;
      this.verticalAxis = 0;
    }

    if (this.inputMap["ArrowLeft"]) {
      this.horizontal = Scalar.Lerp(this.vertical, 1, 0.2);
      this.hotizontalAxis = 1;
    } else if (this.inputMap["ArrowRight"]) {
      this.horizontal = Scalar.Lerp(this.vertical, -1, 0.2);
      this.hotizontalAxis = -1;
    } else {
      this.horizontal = 0;
      this.hotizontalAxis = 0;
    }
  }
}
