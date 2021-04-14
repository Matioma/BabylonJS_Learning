import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";

export class ResourseManager {
  static async LoadCharacterAssets(scene: Scene) {
    var playerData: Mesh = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 1 },
      scene
    );
    return playerData as Mesh;
  }
}
