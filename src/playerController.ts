import {
  Action,
  ActionManager,
  ExecuteCodeAction,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { Player } from "./player";

export class PlayerController {
  public InputMap: any;

  private _player: Player;

  constructor(player: Player, scene: Scene) {
    scene.actionManager = new ActionManager(scene);
    this._player = player;

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
      // this._player.position.z += 10;
      // this._player.MoveMesh(new Vector3(0, 0, 10));
    }
    if (this.InputMap["ArrowDown"]) {
      this._player.position.z -= 10;
      console.log(this._player.position);
    }

    if (this.InputMap["ArrowLeft"]) {
      this._player.position.x -= 10;
      console.log(this._player.position);
    }
    if (this.InputMap["ArrowRight"]) {
      this._player.position.x += 10;
      console.log(this._player.position);
    }
  }
}
