import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Sound,
} from "babylonjs";

export function chapter1(engine: Engine, canvas: any): Scene {
  const scene = new Scene(engine);
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  const box = MeshBuilder.CreateBox("box", {}, scene);

  return scene;
}

export function chapter2(engine: BABYLON.Engine, canvas: any): BABYLON.Scene {
  const demoScene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new BABYLON.Vector3(0, 0, 0),
    demoScene
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    demoScene
  );

  const groundMaterial = new BABYLON.StandardMaterial("groundMat", demoScene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const roofMaterial = new BABYLON.StandardMaterial(
    "house_wallMaterial",
    demoScene
  );
  roofMaterial.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg",
    demoScene
  );

  const wallMaterial = new BABYLON.StandardMaterial("boxMaterial", demoScene);
  wallMaterial.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/cubehouse.png",
    demoScene
  );

  const ground = BABYLON.MeshBuilder.CreateGround("Earth", {
    width: 10,
    height: 10,
  });

  let faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
  faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
  faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
  faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side

  const houses: Mesh[] = [];

  const house = BABYLON.MeshBuilder.CreateBox("House_Wall", {
    width: 2,
    height: 1,
    depth: 1,
    faceUV: faceUV,
    wrap: true,
  });
  house.material = wallMaterial;
  house.position.y = 0.5;

  const roof = BABYLON.MeshBuilder.CreateCylinder("Roof", {
    diameter: 1.5,
    tessellation: 3,
  });
  roof.rotation.z = Math.PI / 2;
  // roof.scaling.y = 0.5;
  roof.position.y = 1.22;
  roof.material = roofMaterial;

  ground.material = groundMaterial;

  return demoScene;
}
