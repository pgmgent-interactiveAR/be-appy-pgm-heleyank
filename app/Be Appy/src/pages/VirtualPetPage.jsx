import React from "react";

import animalUrl from "../assets/3dModels/fox.glb?url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Error from "../components/Errors/Error";
import Instructions from "../components/Instructions/Instructions";
let clips;
let model;
let mixer;
let action;
let delta;
const clock = new THREE.Clock();

const VirtualPetPage = () => {
  if (navigator.xr && "webkitSpeechRecognition" in window) {
    return (
      <>
        <Instructions />
        <button
          onClick={() => {
            speechRecognition(), activateXR();
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

const speechRecognition = () => {
  // settings speech recognitions
  let speechRecognition = new webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  //start speech recognition
  speechRecognition.start();
  speechRecognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
      displayAnimation(transcript);
    }
    //console.log(transcript);
  };
  speechRecognition.onerror = () => {
    //console.log("Speech Recognition Error");
  };
  speechRecognition.onend = () => {
    //console.log("Speech Recognition Ended");
    //restarts speech recognition after it ended
    speechRecognition.start();
  };
};
const displayAnimation = (transcript) => {
  let words = [];
  transcript.split(" ").forEach((part) => {
    words.push(part);
  });
  // finds animation match and play
  const clip = THREE.AnimationClip.findByName(clips, words[0]);
  if (clip) {
    action = mixer.clipAction(clip).play();
    console.log(clip.name);
    if (clip.name === "blink") {
      action.repetitions = 5;
      action.timeScale = 5;
    } else if (action) {
      action.repetitions = 1;
    }
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

  let animal;

  loader.load(animalUrl, function (gltf) {
    model = gltf;
    animal = gltf.scene;
    animal.scale.set(0.2, 0.2, 0.2);
    animal.visible = false;
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
    if (animal) {
      animal.position.copy(reticle.position);
      animal.visible = true;
      scene.add(animal);
      mixer = new THREE.AnimationMixer(animal);
      //const clip = THREE.AnimationClip.findByName(clips, "sit");
      //action = mixer.clipAction(clip).play();
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
        if (animal?.visible) {
          reticle.visible = false;
        }
        reticle.updateMatrixWorld(true);
      }
      renderer.render(scene, camera);
    }
  };
  session.requestAnimationFrame(onXRFrame);
};

export default VirtualPetPage;
