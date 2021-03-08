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

import { myScene } from "./firstScene";
import { chapter1, chapter2 } from "./GetStaterted";

var canvas: any = document.getElementById("renderCanvas");
var engine: Engine = new Engine(canvas, true);

var scene: Scene = myScene(engine, canvas);
scene = chapter2(engine, canvas);

engine.runRenderLoop(() => {
  scene.render();
});
