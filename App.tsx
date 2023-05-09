import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { EngineView, useEngine } from '@babylonjs/react-native';
import { Scene, Vector3, Mesh, ArcRotateCamera, Camera, PBRMetallicRoughnessMaterial, Color3, Color4, Material, Nullable, UtilityLayerRenderer, BoundingBoxGizmo, SixDofDragBehavior, MultiPointerScaleBehavior, PositionGizmo, RotationGizmo, StandardMaterial, Texture, ScaleGizmo, SceneSerializer, AssetsManager, MeshAssetTask, GUID } from '@babylonjs/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
// import { WebXRSessionManager, WebXRTrackingState } from '@babylonjs/core/XR';
import RNFS from 'react-native-fs';

var positionGizmo: PositionGizmo
var rotationgizmo: RotationGizmo
var scalegizmo: ScaleGizmo
var tmodel: AbstractMesh;
var elk_model: AbstractMesh;
var left_node: AbstractMesh;
var right_node: AbstractMesh;
var scene: Scene;
var currentTransformingDeltas: string;
var currentTransformingX: number;
var currentTransformingY: number;
var currentTransformingZ: number;
var transformType: number;

var tempTransform: Vector3;

const App = () => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [buttonState, setButtonState] = useState<number>(0);
  const [objectPosition, setObjectPostion] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })

  const handlePress = () => {
    let newState = buttonState + 1;
    if (newState > 3) {
      newState = 0;
    }
    setButtonState(newState);
  }

  const updateAntlerPosition = (position: string) => {
    if (tmodel) {
      if (position === "left") {
        tmodel.position = left_node.position
        console.log(tmodel.position)
        console.log(left_node.position)
      } else if (position === "right") {
        tmodel.position = right_node.position
        console.log(tmodel.position)
        console.log(right_node.position)
      } else {
        console.log("poko")
      }
    }
  }

  const applyTransform = (transform: number, transformimgDeltas: Vector3) => {
    // transform = 0 ======> Position
    // transform = 1 ======> Rotation
    // transform = 2 ======> Scale
    console.log(transform + "===>" + transformimgDeltas);
  }
  const setTransformingDeltas = (transform: number) => {
    if (tmodel) {
      switch (transform) {
        case 0:
          currentTransformingX = tmodel.position.x
          currentTransformingY = tmodel.position.y
          currentTransformingZ = tmodel.position.z
          setObjectPostion({
            x: currentTransformingX,
            y: currentTransformingY,
            z: currentTransformingZ
          })
          break;
        case 1:
          currentTransformingX = tmodel.rotation.x
          currentTransformingY = tmodel.rotation.y
          currentTransformingZ = tmodel.rotation.z
          setObjectPostion({
            x: currentTransformingX,
            y: currentTransformingY,
            z: currentTransformingZ
          })
          console.log(tmodel.parent)
          break;
        case 2:
          currentTransformingX = tmodel.scaling.x
          currentTransformingY = tmodel.scaling.y
          currentTransformingZ = tmodel.scaling.z
          setObjectPostion({
            x: currentTransformingX,
            y: currentTransformingY,
            z: currentTransformingZ
          })
          break;
        default:
          break;
      }
    }

  };

  function saveScene(filename: string, scene: Scene) {
    var serializedScene = SceneSerializer.Serialize(scene);
    var strMesh = JSON.stringify(serializedScene);
    if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
      filename += ".babylon";
    }
    const filePath = `${RNFS.DownloadDirectoryPath}/${filename}`;
    RNFS.writeFile(filePath, strMesh, 'utf8')

    console.log("filePath", filePath)
  }

  function loadScene(url: string, fileName: string, scene: Scene) {
    var loader = new AssetsManager(scene);
    var loader_task: MeshAssetTask
    fileName = 'fileName.babylon';
    var dirPath = RNFS.DownloadDirectoryPath;
    url = `file://${dirPath}/`;


    loader_task = loader.addMeshTask("loader_task", "", url, fileName);
    loader_task.onSuccess = function (task: any) {
      for (var i in task.loadedMeshes) {
        var mesh = task.loadedMeshes[i];
      }
      task.loadedMeshes.shift();
      try {
        var merged = Mesh.MergeMeshes(task.loadedMeshes);
        console.log(merged);
      } catch (e) {
        console.log(e);
      }
    }
    loader.load();

  }


  let buttonText = '';
  switch (buttonState) {
    case 0:
      buttonText = 'Toggle 1';
      // styles.modalView.display = "flex";
      currentTransformingDeltas = '';
      transformType = 9;
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = null;
      }
      break;
    case 1:
      buttonText = 'Toggle 2';
      currentTransformingDeltas = 'Position';
      transformType = 0;
      if (tmodel) {
        positionGizmo.attachedMesh = tmodel;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = null;
      }
      break;
    case 2:
      buttonText = 'Toggle 3';
      currentTransformingDeltas = 'Rotation';
      transformType = 1;
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = tmodel;
        scalegizmo.attachedMesh = null
      }
      break;
    case 3:
      buttonText = 'Toggle 4';
      currentTransformingDeltas = 'Scale';
      transformType = 2;
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = tmodel;
      }
      break;
  }
  useEffect(() => {
    if (engine) {
      scene = new Scene(engine);
      scene.clearColor = Color4.FromColor3(new Color3(0.71, 0.89, 0.91), 1);
      scene.createDefaultCamera(true, false, true);
      (scene.activeCamera as ArcRotateCamera).alpha += Math.PI;
      (scene.activeCamera as ArcRotateCamera).panningInertia = 0;
      (scene.activeCamera as ArcRotateCamera).allowUpsideDown = true;
      (scene.activeCamera as ArcRotateCamera).noRotationConstraint = true;
      (scene.activeCamera as ArcRotateCamera).useNaturalPinchZoom = true;
      setCamera(scene.activeCamera!);
      scene.createDefaultLight(true);
      scene.lights[0].intensity = 2;
      scene.lights[0].shadowEnabled = true;
      const box = Mesh.CreateIcoSphere("box", { radius: 0.2 }, scene);
      const ground = Mesh.CreateGround("ground", 50, 50, 50, scene)

      var groundMat = new StandardMaterial("groundMaterial", scene);
      var grounddiffuseTexture = new Texture("http://localhost:8081/assets/textures/ground_diff.jpg", scene);
      grounddiffuseTexture.uScale = 5.0;
      grounddiffuseTexture.vScale = 5.0;
      groundMat.diffuseTexture = grounddiffuseTexture;
      ground.material = groundMat;
      ground.receiveShadows = true;
      const mat = new PBRMetallicRoughnessMaterial("mat", scene);
      mat.metallic = 1;
      mat.roughness = 0.5;
      mat.alpha = 0.5;
      mat.baseColor = Color3.Yellow();
      mat.wireframe = true;
      box.material = mat;
      var utilLayer = new UtilityLayerRenderer(scene)
      utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
      positionGizmo = new PositionGizmo(utilLayer);
      rotationgizmo = new RotationGizmo(utilLayer);
      scalegizmo = new ScaleGizmo(utilLayer);

      SceneLoader.Append("http://192.168.3.120:5500/antler/", "texturedMesh.gltf", scene,
        function (scene) {
          tmodel = scene.meshes[2];

          positionGizmo.scaleRatio = -2;
          rotationgizmo.scaleRatio = 2;
          scalegizmo.scaleRatio = 2;

          positionGizmo.onDragEndObservable.add(() => {
            setTransformingDeltas(transformType)
          })
          rotationgizmo.onDragEndObservable.add(() => {
            setTransformingDeltas(transformType)
          })
          scalegizmo.onDragEndObservable.add(() => {
            setTransformingDeltas(transformType)
          })

          positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
          positionGizmo.updateGizmoPositionToMatchAttachedMesh = true;
          scalegizmo.updateGizmoPositionToMatchAttachedMesh = true;
          rotationgizmo.updateGizmoRotationToMatchAttachedMesh = false;
          rotationgizmo.updateGizmoPositionToMatchAttachedMesh = true;
        })
      SceneLoader.Append("http://192.168.3.120:5500/Antler1/", "deer.gltf", scene,
        function (elk) {
          elk_model = elk.meshes[2];
          right_node = elk.meshes[5];
          left_node = elk.meshes[6];

          elk.meshes.forEach((value: AbstractMesh) => {
            console.log(value.name);
            if (value.name === "texturedMesh") {
              tmodel = value;
            }
            else if (value.name === "left_node") {
              left_node = value;
            }
            else if (value.name === "right_node") {
              right_node = value;
            }
          })
        })
      scene.beforeRender = function () {
        if (tmodel) {
          box.setEnabled(false);
        } else {
          box.rotate(Vector3.Up(), 0.01 * scene.getAnimationRatio());
        }
      };
    }
  }, [engine]);

  return (
    <View style={{ flex: 1 }}>
      < StatusBar barStyle="dark-content" />
      < SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <EngineView style={{ flex: 1 }} camera={camera} />
      </SafeAreaView >
      < View style={styles.centeredView} >
        < View style={transformType != 9 ? styles.modalView : { display: "none" }} >
          <Text style={{ color: "black" }}>{currentTransformingDeltas}</Text>
          <View style={{ flexDirection: "row", width: 100, height: 60 }}>
            <Text style={{ marginTop: 20, color: "black" }}>X=</Text>
            <TextInput placeholder='X' style={{ width: 30, margin: 10, backgroundColor: "white", color: "black" }}
              value={objectPosition.x.toString()}
              editable={true}
              keyboardType="numeric" />
            <Text style={{ marginTop: 20, color: "black" }}>Y=</Text>
            <TextInput placeholder='Y' style={{ width: 30, margin: 10, backgroundColor: "white", color: "black" }}
              value={objectPosition.y.toString()}
              keyboardType="numeric" />
            <Text style={{ marginTop: 20, color: "black" }}>Z=</Text>
            <TextInput placeholder='Z' style={{ width: 30, margin: 10, backgroundColor: "white", color: "black" }}
              value={objectPosition.z.toString()}
              keyboardType="numeric" />
            <View />
          </View>
          <View style={styles.BtnSet}>
            <TouchableOpacity>
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View >
      </View >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => { updateAntlerPosition("left") }}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { updateAntlerPosition("right") }}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { saveScene("fileName", scene) }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { loadScene("abc", "abc", scene) }}>
          <Text style={styles.buttonText}>Load</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 20,
  },
  button: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    marginTop: 25,
    width: "100%",
    position: "absolute",
    alignItems: "flex-end",
  },
  modalView: {
    width: "60%",
    backgroundColor: 'rgba(255, 255, 205, 1)',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
  },
  BtnSet: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  btnText: {
    color: "black",
    justifyContent: "space-evenly"
  }
});



























  //   const [xrSession, setXrSession] = useState<WebXRSessionManager>();
  //   const [trackingState, setTrackingState] = useState<WebXRTrackingState>();
  //   const [scene, setScene] = useState<Scene>();




  // const onToggleXr = useCallback(() => {
  //   (async () => {
  //     if (xrSession) {
  //       await xrSession.exitXRAsync();
  //     } else {
  //       if (scene !== undefined) {
  //         const xr = await scene.createDefaultXRExperienceAsync({
  //           disableDefaultUI: true,
  //           disableTeleportation: true,
  //         });
  //         const session = await xr.baseExperience.enterXRAsync(
  //           'immersive-vr',
  //           'local-floor',
  //           xr.renderTarget,
  //         );
  //         setXrSession(session);
  //         session.onXRSessionEnded.add(() => {
  //           setXrSession(undefined);
  //           setTrackingState(undefined);
  //         });

  //         setTrackingState(xr.baseExperience.camera.trackingState);
  //         xr.baseExperience.camera.onTrackingStateChanged.add(
  //           newTrackingState => {
  //             setTrackingState(newTrackingState);
  //           },
  //         );
  //       }
  //     }
  //   })();
  // }, [scene, xrSession]);






//   const createScene = function () {
//     // This creates a basic Babylon Scene object (non-mesh)
//     const scene = new BABYLON.Scene(engine);

//     // This creates and positions a free camera (non-mesh)
//     const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

//     // This targets the camera to scene origin
//     camera.setTarget(BABYLON.Vector3.Zero());

//     // This attaches the camera to the canvas
//     camera.attachControl(canvas, true);

//     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//     const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

//     // Default intensity is 1. Let's dim the light a small amount
//     light.intensity = 0.7;

//     // Our built-in 'sphere' shape.
//     const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

//     // Move the sphere upward 1/2 its height
//     sphere.position.y = 1;

//     // Our built-in 'ground' shape.
//     const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

//     // Export the scene as a GLTF file
//     BABYLON.GLTF2Export.GLTFAsync(scene, "mymodel.gltf").then((glb) => {
//         console.log("GLTF export succeeded.");

//         // Create a download link for the GLTF file
//         var blob = new Blob([glb], { type: "application/octet-stream" });
//         var url = URL.createObjectURL(blob);

//         var link = document.createElement("a");
//         link.href = url;
//         link.download = "mymodel.gltf";
//         link.click();
//     }).catch((error) => {
//         console.log("GLTF export failed: " + error.message);
//     });

//     return scene;
// };

