let scene_back, camera_back, renderer_back;
let light, plane;
let maxAnisotropy;

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
        scale_x: 2,
        scale_y: 3.5
    }
};

// 存放所有的floor
let floors = [];

// 存放所有的plane
let planes = [];

window.onload = function () {
    init();
    animate();
}

// 添加一个平面，带有CanvasTexture
function addPlane(scene) {
    let geometry = new THREE.PlaneBufferGeometry(200, 100, 32);
    let material = new THREE.MeshLambertMaterial({
        transparent: true,
        // side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(geometry, material);

    setupCanvasDrawing(material);
    addText();
    addImage();

    // 与yz轴平行
    // plane.rotation.x = -Math.PI / 2;
    // plane.rotation.y = -Math.PI / 2;
    // plane.rotation.z = -Math.PI / 2;

    // 与xz轴平行
    plane.rotation.x = Math.PI / 2;
    plane.rotation.y = -Math.PI;
    plane.rotation.z = Math.PI;

    // y轴每1为一层
    plane.position.x = params.plane.pos_x;
    plane.position.y = params.plane.pos_y;
    plane.position.z = params.plane.pos_z;

    // 设置比例与2D平面比例一致
    plane.scale.x = params.plane.scale_x;
    plane.scale.y = params.plane.scale_y;

    planes.push({
        plane: plane,
    });

    scene.add(plane);
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
    scene_back = new THREE.Scene();
    renderer_back = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });

    // renderer_back.setClearColor(0x000000);
    renderer_back.shadowMap.enabled = true;
    renderer_back.shadowMap.soft = true;
    three_back.append(renderer_back.domElement);

    addLight(scene_back);

    // maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    // repeatX: 35
    // repeatY: 140
    addFloor('tex_floor_1', scene_back, 5, 20, params.repeat_x, params.repeat_y);

    addPlane(scene_back);

    setBackCamera(params.far);

    // 

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // 

    addGui();

    // 

    window.addEventListener('resize', onWindowResize, false);
}

function addGui() {
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
    }).listen();
    f4.add(params.plane, 'scale_y', 0.1, 10).onChange(function (value) {
        plane.scale.y = value;
    }).listen();

    gui.open();
}

// 设置摄像机
function setBackCamera(far) {
    camera_back = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, .1, far);

    camera_back.position.x = 0;
    camera_back.position.y = 200;
    camera_back.position.z = 512;

    // 根据场景上的线计算消失点的算法
    // 对单消失点场景有效，双消失点和多消失点未知
    let lookTarget = new THREE.Vector3().copy(camera_back.position);
    let tanScale = 2 * Math.tan(FOV / 2 * Math.PI / 180);

    // 0.010和0.022根据消失点位置得出
    lookTarget.x += -0.010 * tanScale;
    lookTarget.y += 0.022 * tanScale;
    lookTarget.z += -1;
    camera_back.lookAt(lookTarget);

    camera_back.updateProjectionMatrix();
}

// 添加光源
function addLight(scene) {
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

function onWindowResize() {
    let WINDOW_WIDTH = window.innerWidth;
    let WINDOW_HEIGHT = window.innerHeight;

    camera_back.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
    camera_back.updateProjectionMatrix();
    renderer_back.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function render() {
    onWindowResize();
    params.window_width = window.innerWidth;
    params.window_height = window.innerHeight;
    renderer_back.render(scene_back, camera_back);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}