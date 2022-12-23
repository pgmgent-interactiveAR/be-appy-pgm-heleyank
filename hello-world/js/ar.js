const app = () => {
  init = () => {
    document.querySelector("#startAR").addEventListener("click", activateXR);
  };

  activateXR = async () => {
    // create canvas and initialize Webgl Context
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });

    // create scene to draw object on canvas
    const scene = new THREE.Scene();

    //materials for cube
    const materials = [
      new THREE.MeshBasicMaterial({ color: "red" }),
      new THREE.MeshBasicMaterial({ color: "blue" }),
      new THREE.MeshBasicMaterial({ color: "green" }),
      new THREE.MeshBasicMaterial({ color: "purple" }),
      new THREE.MeshBasicMaterial({ color: "skyblue" }),
      new THREE.MeshBasicMaterial({ color: "darkblue" }),
    ];
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      materials
    );
    cube.position.set(0, 0, -1);

    function rotateCube(speed) {
      cube.rotation.x -= speed * 2;
      cube.rotation.y -= speed;
      cube.rotation.z -= speed * 3;
    }

    scene.add(cube);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: canvas,
      context: gl,
    });

    renderer.autoClear = false;

    const camera = new THREE.PerspectiveCamera();
    camera.matrixAutoUpdate = false;

    const session = await navigator.xr.requestSession("immersive-ar");
    session.updateRenderState({
      baseLayer: new XRWebGLLayer(session, gl),
    });

    const referenceSpace = await session.requestReferenceSpace("local");

    const onXRFrame = (time, frame) => {
      session.requestAnimationFrame(onXRFrame);
      gl.bindFramebuffer(
        gl.FRAMEBUFFER,
        session.renderState.baseLayer.frameBuffer
      );
      const pose = frame.getViewerPose(referenceSpace);

      if (pose) {
        const view = pose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);
        rotateCube(0.1);

        renderer.render(scene, camera);
      }
    };
    session.requestAnimationFrame(onXRFrame);
  };
  init();
};

app();
