import React from "react";
import Btns from "../Btns";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import modelUrl from "../../assets/3dModels/fox.glb?url";

let delta = 0;
let xrSession = null;
let referenceSpace,
  viewerSpace,
  xrHitTestSource = null;
const testArrow = false;
let gl;
let renderer;
let reticle;
let scene;
let camera;

export let hitTestResults;

const XrButton = () => {
  return (
    <button onClick={() => activateXR()} className="button">
      <span>Start AR</span>
    </button>
  );
};

//console.log("test", xrSession);
const activateXR = async () => {
  if (!xrSession) {
    xrSession = await navigator.xr.requestSession("immersive-ar", {
      optionalFeatures: ["dom-overlay"],
      requiredFeatures: ["local", "hit-test"],
      domOverlay: { root: document.getElementById("app-overlay") },
    });
    onSessionStarted(xrSession);
  } else {
    xrSession.end();
  }
};
// <Btns />
const onSessionStarted = async (session) => {
  //session.addEventListener("end", onSessionEnded);
  //session.addEventListener("select", onSelectionEvent);

  // create canvas and initialize WebGL Context
  let canvas = document.createElement("canvas");
  camera = new THREE.PerspectiveCamera();

  // document.body.appendChild(canvas);
  gl = canvas.getContext("webgl2", { xrCompatible: true });
  initScene(gl, session);
  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });
  referenceSpace = await session.requestReferenceSpace("local");
  viewerSpace = await session.requestReferenceSpace("viewer");
  xrHitTestSource = await session.requestHitTestSource({
    space: viewerSpace,
  });

  session.requestAnimationFrame(onXRFrame);
};

const initScene = (gl, session) => {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    autoClear: true,
    context: gl,
    canvas: gl.canvas,
  });
  renderer.setClearColor(0x010101, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  // for correct displaying
  renderer.xr.setReferenceSpaceType("local");
  renderer.xr.setSession(session);

  // create scene to draw object on
  scene = new THREE.Scene();
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(10, 15, 10);
  scene.add(directionalLight);
  const loader = new GLTFLoader();

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshPhongMaterial({ color: "#2d4258" })
  );
  let targetedCircle = reticle.clone();

  if (testArrow) {
    let arrow = new THREE.ArrowHelper(
      raycaster.ray.direction,
      raycaster.ray.origin,
      100,
      Math.random() * 0xffffff
    );
    scene.add(arrow);
  }

  loader.load(modelUrl, function (gltf) {
    const model = gltf.scene;
    const clips = gltf.animations;
    model.position.set(0, 0, -2);
    model.scale.set(0.5, 0.5, 0.5);
    model.rotateY(0);
    model.visible = true;
  });

  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  //camera.matrixAutoUpdate = false;

  // prevent selection
  /*document
    .getElementById("home-menu")
    .addEventListener("beforexrselect", (ev) => {
      ev.preventDefault();
    });*/

  //window.addEventListener("resize", onWindowResize);
};
const onXRFrame = (time, frame) => {
  let session = xrSession;
  session.requestAnimationFrame(onXRFrame);

  gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer);

  const pose = frame.getViewerPose(referenceSpace);

  if (pose) {
    const view = pose.views[0];

    const viewport = session.renderState.baseLayer.getViewport(view);
    renderer.setSize(viewport.width, viewport.height);

    //camera.matrix.fromArray(view.transform.matrix);
    //camera.projectionMatrix.fromArray(view.projectionMatrix);
    //camera.updateMatrixWorld(true);

    const hitTestResults = frame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0 && reticle) {
      const hitPose = hitTestResults[0].getPose(referenceSpace);
      reticle.visible = true;
      reticle.position.set(
        hitPose.transform.position.x,
        hitPose.transform.position.y,
        hitPose.transform.position.z
      );
      reticle.updateMatrixWorld(true);
    }
    renderer.render(scene, camera);
  }
};

export default XrButton;
