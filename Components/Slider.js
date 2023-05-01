var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateBox("sphere", { size: 2 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Material for sphere
    var sphereMat = new BABYLON.StandardMaterial("sphereMat", scene);
    sphereMat.diffuseColor = new BABYLON.Color3(1, 0, 1, 0.12);

    sphere.material = sphereMat;

    // Create the 3D UI manager
    var manager = new BABYLON.GUI.GUI3DManager(scene);

    // Create a horizontal stack panel
    var panel = new BABYLON.GUI.StackPanel3D();
    panel.margin = 0.05;
    panel.isVertical = true;

    manager.addControl(panel);
    panel.position.z = -1.5;

    var slider1 = new BABYLON.GUI.Slider3D("slider1");
    panel.addControl(slider1);
    slider1.maximum = 1;
    slider1.scaling.x = 2;
    slider1.value = 1;
    slider1.onValueChangedObservable.add(function (value) {
        let newColor = sphere.material.diffuseColor;
        newColor.r = value;
        updateSphereMaterial(sphere.material, newColor);
    });

    var slider2 = new BABYLON.GUI.Slider3D("slider2");
    panel.addControl(slider2);
    slider2.maximum = 1;
    slider2.scaling.x = 2;
    slider2.position.y = -0.5;
    slider2.value = 0;
    slider2.onValueChangedObservable.add(function (value) {
        let newColor = sphere.material.diffuseColor;
        newColor.g = value;
        updateSphereMaterial(sphere.material, newColor);
    });

    var slider3 = new BABYLON.GUI.Slider3D("slider3");
    panel.addControl(slider3);
    slider3.maximum = 1;
    slider3.scaling.x = 2;
    slider3.position.y = -1;
    slider1.value = 1;
    slider3.onValueChangedObservable.add(function (value) {
        let newColor = sphere.material.diffuseColor;
        newColor.b = value;
        updateSphereMaterial(sphere.material, newColor);
    });

    var slider4 = new BABYLON.GUI.Slider3D("slider4", true);
    panel.addControl(slider4);
    slider4.maximum = 2 * Math.PI;
    slider4.scaling.x = 2;
    slider4.position.x = 1.5;
    slider4.position.y = -0.5;
    slider4.node.addRotation(0, 0, -Math.PI / 2);
    slider4.onValueChangedObservable.add(function (value) {
        sphere.rotation.x = value;
        sphere.rotation.y = value;
    });

    scene.onAfterRenderObservable.add(() => {
        if (slider4.mesh && !slider4.mesh.behaviors[0].dragging) {
            slider4.value = (slider4.value + 0.01) % slider4.maximum;

            // workaround for position visual update bug, copied straight from slider3D.ts:
            const position = ((slider4.value - slider4.minimum) / (slider4.maximum - slider4.minimum)) * (slider4.end - slider4.start) + slider4.start;
            slider4.mesh.position.x = Math.min(Math.max(position, slider4.start), slider4.end);
        }
    });

    return scene;
};

function updateSphereMaterial(sphereMat, value) {
    sphereMat.diffuseColor = value;
}