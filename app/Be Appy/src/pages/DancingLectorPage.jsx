import React from "react";
import me from "../assets/3dModels/helena.glb?url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Error from "../components/Errors/Error";
import Instructions from "../components/Instructions/Instructions";
import Homebtn from "../components/HomeBtn/Homebtn";
let clips;
let model;
let mixer;
let action;
let delta;
const clock = new THREE.Clock();

const DancingLectorPage = () => {
  if (navigator.xr) {
    return (
      <>
        <Homebtn />
        <button
          onClick={() => {
            activateXR();
          }}
          className="button"
        >
          <span>Start AR</span>
        </button>
      </>
    );
  } else {
    <Error />;
  }
};

const activateXR = async () => {
  // create canvas and initialize WebGL Context
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl2", { xrCompatible: true });

  // create scene to draw object on
  const scene = new THREE.Scene();

  // add lights to the scene
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(10, 15, 10);
  scene.add(directionalLight);

  const light = new THREE.AmbientLight(0x404040); // soft white light
  light.intensity = 1;
  scene.add(light);

  const loader = new GLTFLoader();
  let reticle;
  loader.load(
    "https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf",
    function (gltf) {
      reticle = gltf.scene;
      reticle.visible = false;
      scene.add(reticle);
    }
  );

  let meModel;

  loader.load(me, function (gltf) {
    model = gltf;
    meModel = gltf.scene;
    meModel.scale.set(0.0001, 0.0001, 0.0001);
    meModel.visible = false;
    clips = gltf.animations;
  });

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    canvas: canvas,
    context: gl,
  });

  renderer.autoClear = false;

  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;

  const session = await navigator.xr.requestSession("immersive-ar", {
    requiredFeatures: ["hit-test"],
  });

  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });
  session.addEventListener("select", (event) => {
    if (meModel) {
      meModel.position.copy(reticle.position);
      meModel.visible = true;
      scene.add(meModel);
      mixer = new THREE.AnimationMixer(meModel);
      const clip = THREE.AnimationClip.findByName(clips, "twerk");
      action = mixer.clipAction(clip).play();
    }
  });
  const referenceSpace = await session.requestReferenceSpace("local");

  const viewerSpace = await session.requestReferenceSpace("viewer");

  const hitTestSource = await session.requestHitTestSource({
    space: viewerSpace,
  });

  const onXRFrame = (time, frame) => {
    session.requestAnimationFrame(onXRFrame);

    delta = clock.getDelta();
    mixer?.update(delta);
    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      session.renderState.baseLayer.framebuffer
    );

    const pose = frame.getViewerPose(referenceSpace);

    if (pose) {
      const view = pose.views[0];

      const viewport = session.renderState.baseLayer.getViewport(view);
      renderer.setSize(viewport.width, viewport.height);

      camera.matrix.fromArray(view.transform.matrix);
      camera.projectionMatrix.fromArray(view.projectionMatrix);
      camera.updateMatrixWorld(true);

      const hitTestResults = frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0 && reticle) {
        const hitPose = hitTestResults[0].getPose(referenceSpace);
        reticle.visible = true;
        reticle.position.set(
          hitPose.transform.position.x,
          hitPose.transform.position.y,
          hitPose.transform.position.z
        );
        if (meModel?.visible) {
          reticle.visible = false;
        }
        reticle.updateMatrixWorld(true);
      }
      renderer.render(scene, camera);
    }
  };
  session.requestAnimationFrame(onXRFrame);
};

export default DancingLectorPage;
