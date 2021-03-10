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

  //http://localhost:3000/Resources/scene.glb

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "http://localhost:3000/Resources/scene.glb",
    "scene.glb"
  );

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

  const fullhouse = BABYLON.Mesh.MergeMeshes(
    [house, roof],
    true,
    false,
    null,
    false,
    true
  );
  fullhouse.position.x = -2;
  fullhouse.position.z = 5;

  const newHouse = fullhouse.createInstance("house");
  newHouse.position.x = 3;

  const car = buildCar(demoScene);
  car.position = new BABYLON.Vector3(0, 0.4, 0);
  car.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

  return demoScene;
}

function buildCar(scene: BABYLON.Scene) {
  const wheelMaterial = new BABYLON.StandardMaterial("WheelMAt", scene);
  wheelMaterial.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/wheel.png",
    scene
  );

  const carMaterial = new BABYLON.StandardMaterial("carMaterial", scene);
  carMaterial.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/car.png",
    scene
  );

  const car = BABYLON.MeshBuilder.CreateBox("Body", {
    width: 1,
    depth: 2,
    height: 1,
  });
  car.material = carMaterial;

  const animWheel = new BABYLON.Animation(
    "WheelRotation",
    "rotation.x",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const wheelKeys = [];
  wheelKeys.push({ frame: 0, value: 0 });
  wheelKeys.push({ frame: 30, value: 2 * Math.PI });

  animWheel.setKeys(wheelKeys);

  const wheelRB = BABYLON.MeshBuilder.CreateCylinder("WheelRB", {
    diameter: 1,
    height: 0.2,
  });

  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);
  wheelRB.material = wheelMaterial;
  wheelRB.rotation.z = Math.PI / 2;
  scene.beginAnimation(wheelRB, 0, 30, true);

  wheelRB.parent = car;
  wheelRB.position.z = -0.5;
  wheelRB.position.x = 0.6;
  wheelRB.position.y = -0.5;

  const wheelRF = wheelRB.createInstance("WheelRF");
  wheelRF.position.z = 0.5;
  scene.beginAnimation(wheelRF, 0, 30, true);
  wheelRF.parent = car;

  const wheelLF = wheelRB.createInstance("WheelLF");
  wheelLF.position.z = 0.5;
  wheelLF.position.x = -0.6;
  scene.beginAnimation(wheelLF, 0, 30, true);
  wheelLF.parent = car;

  const wheelLB = wheelRB.createInstance("WheelRF");
  wheelLB.position.x = -0.6;
  scene.beginAnimation(wheelLB, 0, 30, true);
  wheelLB.parent = car;

  return car;
}
