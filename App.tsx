/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {SafeAreaView, View, Button, ViewProps, StatusBar} from 'react-native';

import {SceneLoader} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import {WebXRSessionManager, WebXRTrackingState} from '@babylonjs/core/XR';
import {EngineView, useEngine} from '@babylonjs/react-native';
import { Scene, Vector3, Mesh, ArcRotateCamera, Camera, PBRMetallicRoughnessMaterial, Color3, Color4,BoundingInfo } from '@babylonjs/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';


const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();
  const [xrSession, setXrSession] = useState<WebXRSessionManager>();
  const [trackingState, setTrackingState] = useState<WebXRTrackingState>();
  const [scene, setScene] = useState<Scene>();

  const onToggleXr = useCallback(() => {
    (async () => {
      if (xrSession) {
        await xrSession.exitXRAsync();
      } else {
        if (scene !== undefined) {
          const xr = await scene.createDefaultXRExperienceAsync({
            disableDefaultUI: true,
            disableTeleportation: true,
          });
          const session = await xr.baseExperience.enterXRAsync(
            'immersive-vr',
            'local-floor',
            xr.renderTarget,
          );
          setXrSession(session);
          session.onXRSessionEnded.add(() => {
            setXrSession(undefined);
            setTrackingState(undefined);
          });

          setTrackingState(xr.baseExperience.camera.trackingState);
          xr.baseExperience.camera.onTrackingStateChanged.add(
            newTrackingState => {
              setTrackingState(newTrackingState);
            },
          );
        }
      }
    })();
  }, [scene, xrSession]);

  useEffect(() => {
    if (engine) {
      // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 7;

    // Our built-in 'sphere' shape.
    const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    console.log(engine.getFps())
    }
  }, [engine]);

  return (
    <>
      <View style={props.style}>
        <Button
          title={xrSession ? 'Stop XR' : 'Start XR'}
          onPress={onToggleXr}
        />
        <View style={{flex: 1}}>
          <EngineView camera={camera} displayFrameRate={true} />
        </View>
      </View>
    </>
  );
};

const App = () => {

  const engine = useEngine();
  const [camera, setCamera] = useState<Camera>();

  useEffect(() => {
    if (engine) {
      const scene = new Scene(engine);
      scene.clearColor = Color4.FromColor3(new Color3(0.71,0.89,0.91),1);
      scene.createDefaultCamera(true,false,true);
      (scene.activeCamera as ArcRotateCamera).alpha += Math.PI;
      (scene.activeCamera as ArcRotateCamera).panningInertia = 0;
      (scene.activeCamera as ArcRotateCamera).allowUpsideDown = true;
      (scene.activeCamera as ArcRotateCamera).noRotationConstraint = true;
      (scene.activeCamera as ArcRotateCamera).useNaturalPinchZoom = true;
      setCamera(scene.activeCamera!);
      scene.createDefaultLight(true);
      scene.lights[0].intensity = 2;
      scene.lights[0].shadowEnabled = true;
      const box = Mesh.CreateIcoSphere("box",{radius:0.2}, scene);
      // const plane = Mesh.CreateGround("ground",10,10,10,scene)
      // plane.position.y = -0.15;
      // plane.receiveShadows = true;
      const mat = new PBRMetallicRoughnessMaterial("mat", scene);
      mat.metallic = 1;
      mat.roughness = 0.5;
      mat.alpha = 0.5;
      mat.baseColor = Color3.Yellow();
      box.material = mat;
      var tmodel:AbstractMesh;
      SceneLoader.Append("https://shed-happens.s3.us-east-2.amazonaws.com/5/b092b50b-bffe-4190-b665-4257b8b65d8f-2023-04-09-10-35-20-862307/android/", "texturedMesh.gltf", scene,
      function (scene) {
        tmodel = scene.meshes[2];
    })
      scene.beforeRender = function () {
        if(tmodel){
          box.setEnabled(false);
          tmodel.rotate(Vector3.Left(), 0.001 * scene.getAnimationRatio());
        }else{
          
          box.rotate(Vector3.Up(), 0.1 * scene.getAnimationRatio());
        }
      };
    }
  }, [engine]);




  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {/* <EngineScreen style={{flex: 1}} /> */}
        <EngineView style={{flex: 1}} camera={camera} />
      </SafeAreaView>
    </>
  );
};

export default App;
