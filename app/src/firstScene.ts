import * as BABYLON from "babylonjs";
import {
  Scene,
  Vector3,
  Mesh,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
} from "babylonjs";

import { addLabelToMesh } from "./gui";

export function myScene(engine: BABYLON.Engine, canvas): BABYLON.Scene {
  var scene: Scene = new Scene(engine);
  var camera: ArcRotateCamera = new ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 2,
    2,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  var light1: HemisphericLight = new HemisphericLight(
    "light1",
    new Vector3(1, 1, 0),
    scene
  );
  var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

  addLabelToMesh(sphere);
  return scene;
}
