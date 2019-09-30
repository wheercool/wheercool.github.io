import Stats from './stats.module.js';
let stats;
const root = new THREE.Object3D();
const carNode = new THREE.Object3D();
const grindingMachineNode = new THREE.Object3D();
root.add(carNode);
root.add(grindingMachineNode);
const objects = [root, carNode, grindingMachineNode];
const rootState = {
  rotationY: 0,
  rotationX: 0,
  rotationZ: 0,
  x: 0,
  y: 0,
  z: 0,
}

const carNodeState = {
  rotationY: 0,
  rotationX: 0,
  rotationZ: 0,
  x: 500,
  y: 0,
  z: 0,
}


const grindingMachineNodeState = {
  rotationY: 0,
  rotationX: 0,
  rotationZ: 0,
  x: -500,
  y: 0,
  z: 0,
}


const gui = new dat.GUI();

// gui.addFolder('root') 

// gui.addFolder('car')
const rootGui = gui.addFolder('root');
const carGui = gui.addFolder('car');
const gridingMachine = gui.addFolder('griding machine');
['rotationX', 'rotationY', 'rotationZ'].forEach(r =>
  rootGui.add(rootState, r).min(-1).max(1).step(0.001)
);

['x', 'y', 'z'].forEach(r =>
  rootGui.add(rootState, r).min(-1000).max(1000).step(10)
);


['rotationX', 'rotationY', 'rotationZ'].forEach(r =>
  carGui.add(carNodeState, r).min(-1).max(1).step(0.001)
);

['x', 'y', 'z'].forEach(r =>
  carGui.add(carNodeState, r).min(-1000).max(1000).step(10)
);


['rotationX', 'rotationY', 'rotationZ'].forEach(r =>
  gridingMachine.add(grindingMachineNodeState, r).min(-1).max(1).step(0.001)
);

['x', 'y', 'z'].forEach(r =>
  gridingMachine.add(grindingMachineNodeState, r).min(-1000).max(1000).step(10)
)

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w;
  canvas.height = h;
  stats = new Stats();
  document.body.appendChild(stats.dom);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setClearColor(0xeeeeee);
  const scene = new THREE.Scene();

  var axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);


  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 1000);

  // const light = new THREE.AmbientLight(0xffffff, 1);

  // scene.add(light);

  const dLight = new THREE.DirectionalLight(0xffffff, 1);
  dLight.position.set(0, 500, 500);

  scene.add(dLight);

  var dLightHelper = new THREE.DirectionalLightHelper(dLight, 5);
  scene.add(dLightHelper);


  var hLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  hLight.position.set(0, 500, 0)
  hLight.color.setHSL(0.6, 1, 0.6);
  hLight.groundColor.setHSL(0.095, 1, 0.75);
  scene.add(hLight);

  var hLightHelper = new THREE.HemisphereLightHelper(hLight);
  scene.add(hLightHelper)

  var geometry = new THREE.PlaneGeometry( 2000, 2000, 2 );
  var material = new THREE.MeshBasicMaterial( {color: 0x948880, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -1;

  scene.add( plane );


  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);

  scene.add(root);
  var loader = new THREE.GLTFLoader();
  loader.load('car/scene.gltf', function (gltf) {
    console.log(gltf)
    carNode.add(gltf.scene);

  }, undefined, function (error) {

    console.error(error);

  });

  loader.load('grinding_machine/scene.gltf', function (gltf) {
    console.log(gltf)
    grindingMachineNode.add(gltf.scene);

  }, undefined, function (error) {

    console.error(error);

  });

  var r = "skybox/";
  var urls = [
    r + "px.jpg", r + "nx.jpg",
    r + "py.jpg", r + "ny.jpg",
    r + "pz.jpg", r + "nz.jpg"
  ];
  var textureCube = new THREE.CubeTextureLoader().load( urls );
  scene.background = textureCube;


  controls.update();

  function loop() {
    controls.update();
    stats.update();
    root.rotation.x = rootState.rotationX;
    root.rotation.y = rootState.rotationY;
    root.rotation.z = rootState.rotationZ;
    ['x', 'y', 'z'].forEach(p => root.position[p] = rootState[p]);

    carNode.rotation.x = carNodeState.rotationX;
    carNode.rotation.y = carNodeState.rotationY;
    carNode.rotation.z = carNodeState.rotationZ;
    ['x', 'y', 'z'].forEach(p => carNode.position[p] = carNodeState[p]);

    grindingMachineNode.rotation.x = grindingMachineNodeState.rotationX;
    grindingMachineNode.rotation.y = grindingMachineNodeState.rotationY;
    grindingMachineNode.rotation.z = grindingMachineNodeState.rotationZ;
    ['x', 'y', 'z'].forEach(p => grindingMachineNode.position[p] = grindingMachineNodeState[p]);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  loop();
}



