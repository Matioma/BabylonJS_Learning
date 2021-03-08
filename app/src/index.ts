import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Mesh,
  MeshBuilder,
} from "babylonjs";

import { addLabelToMesh } from "./gui";
// import BABYLON from "babylonjs";

// import { myScene } from "./firstScene";
import { chapter1, chapter2 } from "./GetStaterted";

var canvas: any = document.getElementById("renderCanvas");
var engine: BABYLON.Engine = new BABYLON.Engine(canvas, true);

var scene: BABYLON.Scene = chapter2(engine, canvas);

engine.runRenderLoop(() => {
  scene.render();
});
