import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { EngineView, useEngine } from '@babylonjs/react-native';
import { Scene, Vector3, Mesh, ArcRotateCamera, Camera, PBRMetallicRoughnessMaterial, Color3, Color4, Material, Nullable, UtilityLayerRenderer, BoundingBoxGizmo, SixDofDragBehavior, MultiPointerScaleBehavior, PositionGizmo, RotationGizmo, StandardMaterial, Texture, ScaleGizmo } from '@babylonjs/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
// import { WebXRSessionManager, WebXRTrackingState } from '@babylonjs/core/XR';

var positionGizmo: PositionGizmo
var rotationgizmo: RotationGizmo
var scalegizmo: ScaleGizmo
var tmodel: AbstractMesh;
var elk_model: AbstractMesh;
var left_node: AbstractMesh;
var right_node: AbstractMesh;


const App = () => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  const [buttonState, setButtonState] = useState<number>(0);

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


  let buttonText = '';
  switch (buttonState) {
    case 0:
      buttonText = 'Toggle 1';
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = null;
      }
      break;
    case 1:
      buttonText = 'Toggle 2';
      if (tmodel) {
        positionGizmo.attachedMesh = tmodel;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = null;
      }
      break;
    case 2:
      buttonText = 'Toggle 3';
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = tmodel;
        scalegizmo.attachedMesh = null
      }
      break;
    case 3:
      buttonText = 'Toggle 4';
      if (tmodel) {
        positionGizmo.attachedMesh = null;
        rotationgizmo.attachedMesh = null;
        scalegizmo.attachedMesh = tmodel;
      }
      break;
  }
  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
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

      // ground.position.y = -0.15;
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
      SceneLoader.Append("http://192.168.0.179:5500/antler/", "texturedMesh.gltf", scene,
        function (scene) {
          tmodel = scene.meshes[2];

          positionGizmo.scaleRatio = 2;
          rotationgizmo.scaleRatio = 2;
          scalegizmo.scaleRatio = 2;


          positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
          positionGizmo.updateGizmoPositionToMatchAttachedMesh = true;

          scalegizmo.updateGizmoRotationToMatchAttachedMesh = false;
          scalegizmo.updateGizmoPositionToMatchAttachedMesh = true;
          // var sixDofDragBehavior = new SixDofDragBehavior()
          // tmodel.addBehavior(sixDofDragBehavior)

          rotationgizmo.updateGizmoRotationToMatchAttachedMesh = false;
          rotationgizmo.updateGizmoPositionToMatchAttachedMesh = true;
        })
      SceneLoader.Append("http://192.168.0.179:5500/Antler1/", "deer.gltf", scene,
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

          // positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
          // positionGizmo.updateGizmoPositionToMatchAttachedMesh = true;

          // var sixDofDragBehavior = new SixDofDragBehavior()
          // elk_model.addBehavior(sixDofDragBehavior)

          // rotationgizmo.updateGizmoRotationToMatchAttachedMesh = false;
          // rotationgizmo.updateGizmoPositionToMatchAttachedMesh = true;
        })
      scene.beforeRender = function () {
        if (tmodel) {
          box.setEnabled(false);

          // tmodel.rotate(Vector3.Left(), 0.001 * scene.getAnimationRatio());
        } else {
          box.rotate(Vector3.Up(), 0.01 * scene.getAnimationRatio());
        }
      };
    }
  }, [engine]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* <Button title='Toggle Gizmo' /> */}
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <EngineView style={{ flex: 1 }} camera={camera} />
      </SafeAreaView>
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
      </View>
    </View>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
    display: "flex",
    flexDirection: "row"
  },
  button: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    width: "30%"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
