import {
  Action,
  ActionManager,
  ExecuteCodeAction,
  Scene,
} from "@babylonjs/core";

export class PlayerController {
  public InputMap: any;

  constructor(scene: Scene) {
    scene.actionManager = new ActionManager(scene);

    this.InputMap = {};

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
        this.InputMap[event.sourceEvent.key] =
          event.sourceEvent.type == "keydown";
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
        this.InputMap[event.sourceEvent.key] =
          event.sourceEvent.type == "keydown";
      })
    );

    scene.onBeforeRenderObservable.add(() => {
      this.processInput();
    });
  }

  private processInput(): void {
    if (this.InputMap["ArrowUp"]) {
      console.log("ArrowUp pressed");
    }
  }
}
