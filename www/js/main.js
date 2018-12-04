let scene, camera, renderer;
let spotLight, plane;
let maxAnisotropy;
let drawStartPos = new THREE.Vector2();

let stats;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let three_back = document.getElementById('three_back');

let FOV = 75;

let params = {
    window_width: window.innerWidth,
    window_height: window.innerHeight,
    repeat_x: 35,
    repeat_y: 140,
    left: -100,
    top: -7000,
    far: 7000,
    plane: {
        pos_x: 0,
        pos_y: 1,
        pos_z: 0,
        scale_x: 1,
        scale_y: 1
    }
};

// 存放所有的floor
let floors = [];

window.onload = function () {
    init();
    animate();
}

// 添加一个平面，带有CanvasTexture
function addPlane(scene) {
    let geometry = new THREE.PlaneBufferGeometry(200, 100, 32);
    let material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(geometry, material);

    setupCanvasDrawing(material);

    // 与yz轴平行
    // plane.rotation.x = -Math.PI / 2;
    // plane.rotation.y = -Math.PI / 2;
    // plane.rotation.z = -Math.PI / 2;

    // 与xz轴平行
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = Math.PI;

    // y轴每1为一层
    plane.position.x = params.plane.pos_x;
    plane.position.y = params.plane.pos_y;
    plane.position.z = params.plane.pos_z;

    scene.add(plane);
}

function setupCanvasDrawing(material) {
    // get canvas and context
    let drawingCanvas = document.getElementById('drawing-canvas');
    let drawingContext = drawingCanvas.getContext('2d');
    // draw white background
    drawingContext.fillStyle = '#FFFFFF';
    drawingContext.fillRect(0, 0, 128, 128);
    // set canvas as material.map (this could be done to any map, bump, displacement etc.)
    material.map = new THREE.CanvasTexture(drawingCanvas);
    // set the letiable to keep track of when to draw
    let paint = false;
    // add canvas event listeners
    drawingCanvas.addEventListener('mousedown', function (e) {
        paint = true;
        drawStartPos.set(e.offsetX, e.offsetY);
    });
    drawingCanvas.addEventListener('mousemove', function (e) {
        if (paint) draw(material, drawingContext, e.offsetX, e.offsetY);
    });
    drawingCanvas.addEventListener('mouseup', function () {
        paint = false;
    });
    drawingCanvas.addEventListener('mouseleave', function () {
        paint = false;
    });
}

function draw(material, drawContext, x, y) {
    drawContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawContext.strokeStyle = '#000000';
    drawContext.lineTo(x, y);
    drawContext.stroke();
    // reset drawing start position to current position.
    drawStartPos.set(x, y);
    // need to flag the map as needing updating.
    material.map.needsUpdate = true;
}

// 添加地板
function addFloor(id, scene, magX, magY, repeatX, repeatY) {
    /*
     * repeat计算方式
     * repeat = mag * (position.z/1000)
     * mag代表倍数
     */

    let floorTexture = new THREE.Texture(document.getElementById(id));
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.anisotropy = 2;
    floorTexture.repeat.set(repeatX, repeatY);
    floorTexture.needsUpdate = true;
    let floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture
    });
    let floorGeometry = new THREE.PlaneBufferGeometry(1024 * magX, 1024 * magY, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.rotation.z = Math.PI;

    floor.position.x = params.left;
    floor.position.z = params.top;
    floors.push({
        floor: floor,
        repeatX: repeatX,
        repeatY: repeatY
    });
    scene.add(floor);
}

// 初始化
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });

    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.soft = true;
    three_back.append(renderer.domElement);

    // maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    // repeatX: 35
    // repeatY: 140
    addFloor('tex_floor_1', scene, 5, 20, params.repeat_x, params.repeat_y);

    addPlane(scene);

    setCamera(params.far);

    // 

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // 

    let gui = new dat.GUI();

    let f2 = gui.addFolder('floor');
    f2.add(params, 'repeat_x', 1, 200).onChange(function (value) {
        let {
            floor,
            repeatX
        } = floors[0];
        repeatX = value;
        floor.material.map.repeat.setX(value);
        floor.material.needsUpdate = true;
    });
    f2.add(params, 'repeat_y', 1, 200).onChange(function (value) {
        let {
            floor,
            repeatY
        } = floors[0];
        repeatX = value;
        floor.material.map.repeat.setY(value);
        floor.material.needsUpdate = true;
    });
    f2.add(params, 'left', -10000, 10000).onChange(function (value) {
        let {
            floor
        } = floors[0];
        floor.position.x = value;
    });
    f2.add(params, 'top', -10000, 10000).onChange(function (value) {
        let {
            floor
        } = floors[0];
        floor.position.z = value;
    });

    let f4 = gui.addFolder('plane');
    f4.add(params.plane, 'pos_x', -1000, 1000).onChange(function (value) {
        plane.position.x = value;
    });
    f4.add(params.plane, 'pos_y', 1, 100).onChange(function (value) {
        plane.position.y = value;
    });
    f4.add(params.plane, 'pos_z', -3000, 1000).onChange(function (value) {
        plane.position.z = value;
    });
    f4.add(params.plane, 'scale_x', 0.1, 10).onChange(function (value) {
        plane.scale.x = value;
    });
    f4.add(params.plane, 'scale_y', 0.1, 10).onChange(function (value) {
        plane.scale.y = value;
    });

    gui.open();

    // 

    window.addEventListener('resize', onWindowResize, false);
}

// 设置摄像机
function setCamera(far) {
    camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, .1, far);

    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 512;

    // 根据场景上的线计算消失点的算法
    // 对单消失点场景有效，双消失点和多消失点未知
    let lookTarget = new THREE.Vector3().copy(camera.position);
    let tanScale = 2 * Math.tan(FOV / 2 * Math.PI / 180);
    lookTarget.x += -0.010 * tanScale;
    lookTarget.y += 0.022 * tanScale;
    lookTarget.z += -1;
    camera.lookAt(lookTarget);

    camera.updateProjectionMatrix();
}

// 添加光源
function addLight(scene) {
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set(20, 35, 40);
    spotLight.intensity = 2.5;
    spotLight.distance = 373;
    spotLight.angle = 1.6;
    spotLight.exponent = 38;
    spotLight.shadowCameraNear = 34;
    spotLight.shadowCameraFar = 2635;
    spotLight.shadowCameraFov = 68;
    spotLight.shadowCameraVisible = false;
    spotLight.shadowBias = 0.00;
    spotLight.shadowDarkness = 0.11;
    scene.add(spotLight);
}

function onWindowResize() {
    let WINDOW_WIDTH = window.innerWidth;
    let WINDOW_HEIGHT = window.innerHeight;
    let x = window.innerWidth / WIDTH;

    camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function render() {
    onWindowResize();
    params.window_width = window.innerWidth;
    params.window_height = window.innerHeight;
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}