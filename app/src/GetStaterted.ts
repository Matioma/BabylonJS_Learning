import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Mesh,
  MeshBuilder,
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

export function chapter2(engine: Engine, canvas: any): Scene {
  console.log("AWESOME");

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
  //const box = MeshBuilder.CreateBox("box", {}, scene);
  //box.position.y = 0.5;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 10,
    height: 10,
  });

  const sound = new Sound(
    "firstSound",
    "../Resources/zapsplat_animals_bats_flying_foxes_in_trees_evening_mary_caincross_reserve_australia_001_17614.mp3",
    scene,
    null,
    {
      loop: true,
      autoplay: true,
    }
  );

  BABYLON.SceneLoader.ImportMeshAsync("", "../Resources/", "scene.glb").then(
    (result) => {
      result.meshes[1].position.x = 20;
      const myMesh_1 = scene.getMeshByName("myMesh_1");
      myMesh_1.rotation.y = Math.PI / 2;
    }
  );

  return scene;
}
