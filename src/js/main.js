import {
    setupCanvasDrawing,
    addText,
    addImage
} from './draw';

let scene_back, camera_back, renderer_back;
let scene_over, camera_over, renderer_over;
let light, plane;
let max_anisotropy;

let stats;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let three_back = document.getElementById('three_back');
let three_over = document.getElementById('three_over');

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
        scale_y: 3.5,
        rot_x: Math.PI / 2,
        rot_y: -Math.PI,
        rot_z: Math.PI,
    }
};

// 存放所有的floor
export let floors = [];

// 存放所有的plane
let planes = [];

/**
 * 添加一个平面到场景，该平面带有CanvasTexture
 * @param {Object} scene 
 */
function addPlane(scene) {
    let geometry = new THREE.PlaneBufferGeometry(200, 100, 32);
    let material = new THREE.MeshLambertMaterial({
        transparent: true,
        side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(geometry, material);

    setupCanvasDrawing(material);
    console.log('使用了');
    addText();
    addImage();

    // 与yz轴平行
    // plane.rotation.x = -Math.PI / 2;
    // plane.rotation.y = -Math.PI / 2;
    // plane.rotation.z = -Math.PI / 2;

    // 与xz轴平行
    // plane.rotation.x = Math.PI / 2;
    // plane.rotation.y = -Math.PI;
    // plane.rotation.z = Math.PI;

    plane.rotation.x = params.plane.rot_x;
    plane.rotation.y = params.plane.rot_y;
    plane.rotation.z = params.plane.rot_z;

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

/**
 * 添加地板
 * @param {String} id 文档id
 * @param {Object} scene 添加到哪个场景
 * @param {Number} magX 
 * @param {Number} magY 
 * @param {Number} repeatX 
 * @param {Number} repeatY 
 */
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

/**
 * 后场景初始化
 */
export function initBack() {
    scene_back = new THREE.Scene();

    // 后场景渲染器
    renderer_back = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer_back.shadowMap.enabled = true;
    renderer_back.shadowMap.soft = true;
    three_back.append(renderer_back.domElement);

    // 为后场景添加光照
    addLight(scene_back);

    setBackCamera(params.far);

    // 最合适的二向异性数值
    // max_anisotropy = renderer.capabilities.getMaxAnisotropy();
    // repeatX: 35
    // repeatY: 140

    // 为后场景添加地板
    addFloor('tex_floor_1', scene_back, 5, 20, params.repeat_x, params.repeat_y);

    // 控制面板
    addGuiFloor(floors[0].floor);

    // 帧率检测
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // 后场景随窗口自适应
    window.addEventListener('resize', onWindowResize(camera_back, renderer_back), false);
}

/**
 * 前场景初始化
 */
export function initOver() {
    scene_over = new THREE.Scene();

    // 前场景渲染器
    renderer_over = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer_over.setClearColor(0xEEEEEE, 0.0);
    renderer_over.shadowMap.enabled = true;
    renderer_over.shadowMap.soft = true;
    three_over.append(renderer_over.domElement);

    // 为前场景添加光照
    addLight(scene_over);

    setOverCamera(params.far);

    // 为前场景添加平面
    addPlane(scene_over);

    // 控制面板
    addGuiPlane(params.plane);

    // 后场景随窗口自适应
    window.addEventListener('resize', onWindowResize(camera_over, renderer_over), false);
}

/**
 * 添加地板控制器
 * @param {Object} floor 
 */
function addGuiFloor(floor) {
    let gui = new dat.GUI();

    let panel = gui.addFolder('floor');
    panel.add(params, 'repeat_x', 1, 200).onChange(function (value) {
        let {
            floor,
            repeatX
        } = floors[0];
        repeatX = value;
        floor.material.map.repeat.setX(value);
        floor.material.needsUpdate = true;
    });
    panel.add(params, 'repeat_y', 1, 200).onChange(function (value) {
        let {
            floor,
            repeatY
        } = floors[0];
        repeatX = value;
        floor.material.map.repeat.setY(value);
        floor.material.needsUpdate = true;
    });
    panel.add(params, 'left', -10000, 10000).onChange(function (value) {
        let {
            floor
        } = floors[0];
        floor.position.x = value;
    });
    panel.add(params, 'top', -10000, 10000).onChange(function (value) {
        let {
            floor
        } = floors[0];
        floor.position.z = value;
    });

    gui.open();
}

/**
 * 添加平面控制器
 * @param {Object} plane 
 */
function addGuiPlane(p) {
    let gui = new dat.GUI();

    let panel = gui.addFolder('plane');
    panel.add(p, 'pos_x', -1000, 1000).onChange(function (value) {
        plane.position.x = value;
    });
    panel.add(p, 'pos_y', 1, 1000).onChange(function (value) {
        plane.position.y = value;
    });
    panel.add(p, 'pos_z', -3000, 1000).onChange(function (value) {
        plane.position.z = value;
    });

    panel.add(p, 'scale_x', 0.1, 10).onChange(function (value) {
        plane.scale.x = value;
    }).listen();
    panel.add(p, 'scale_y', 0.1, 10).onChange(function (value) {
        plane.scale.y = value;
    }).listen();

    panel.add(p, 'rot_x', 0, Math.PI * 2).onChange(function (value) {
        plane.rotation.x = value;
    }).step(Math.PI / 4);
    panel.add(p, 'rot_y', 0, Math.PI * 2).onChange(function (value) {
        plane.rotation.y = value;
    }).step(Math.PI / 4);
    panel.add(p, 'rot_z', 0, Math.PI * 2).onChange(function (value) {
        plane.rotation.z = value;
    }).step(Math.PI / 4);

    gui.open();
}

/**
 * 设置背景图后的摄像机
 * @param {Number} far 
 */
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

/**
 * 设置背景图前的摄像机
 * @param {Number} far 
 */
function setOverCamera(far) {
    camera_over = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, .1, far);

    camera_over.position.x = 0;
    camera_over.position.y = 200;
    camera_over.position.z = 512;

    // 根据场景上的线计算消失点的算法
    // 对单消失点场景有效，双消失点和多消失点未知
    let lookTarget = new THREE.Vector3().copy(camera_over.position);
    let tanScale = 2 * Math.tan(FOV / 2 * Math.PI / 180);

    // 0.010和0.022根据消失点位置得出
    lookTarget.x += -0.010 * tanScale;
    lookTarget.y += 0.022 * tanScale;
    lookTarget.z += -1;
    camera_over.lookAt(lookTarget);

    camera_over.updateProjectionMatrix();
}

/**
 * 为指定场景添加光照
 * @param {Object} scene 
 */
function addLight(scene) {
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}


/**
 * 指定场景随窗口自适应
 * @param {Object} scene 
 * @param {Object} renderer 
 */
function onWindowResize(camera, renderer) {
    let WINDOW_WIDTH = window.innerWidth;
    let WINDOW_HEIGHT = window.innerHeight;

    if (camera) {
        camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
        camera.updateProjectionMatrix();
    }
    renderer && renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
}

/**
 * 渲染场景和相机
 * @param {Object} renderer 
 * @param {Object} scene 
 * @param {Object} camera 
 */
function render(renderer, scene, camera) {
    onWindowResize(camera_back, renderer_back);
    onWindowResize(camera_over, renderer_over);
    params.window_width = window.innerWidth;
    params.window_height = window.innerHeight;
    renderer.render(scene, camera);
}

/**
 * 动态
 */
export function animate() {
    requestAnimationFrame(animate);
    render(renderer_back, scene_back, camera_back);
    render(renderer_over, scene_over, camera_over);
    stats.update();
}