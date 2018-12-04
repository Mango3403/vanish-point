let floorBtn = document.querySelector('#floor_1');
let sceneBtn = document.querySelector('#scene_btn');
let sceneGrid = document.querySelector('#scene_grid');
let sceneImgs = document.querySelectorAll('#scene_grid img');
let overlay = document.querySelector('#overlay');

setFloorBtn();
setSceneBtn();
changeScene();

// 设置地砖更换按钮
function setFloorBtn() {
    floorBtn.style.position = 'absolute';
    floorBtn.style.left = window.innerWidth / 2 + 'px';
    floorBtn.style.top = window.innerHeight / 4 * 3 + 'px';
    floorBtn.onclick = function () {
        let {
            floor,
            repeatX,
            repeatY
        } = floors[0];
        if (/1.png/.test(floor.material.map.image.src)) {
            floor.material.map = new THREE.TextureLoader().load('media/floor_sample_2.png')
        } else {
            floor.material.map = new THREE.TextureLoader().load('media/floor_sample_1.png')
        }
        floor.material.map.wrapS = floor.material.map.wrapT = THREE.RepeatWrapping;
        floor.material.map.anisotropy = 2;
        floor.material.needsUpdate = true;
        floor.material.map.repeat.setX(repeatX);
        floor.material.map.repeat.setY(repeatY);
    }
}

// 设置场景更换按钮
function setSceneBtn() {
    sceneBtn.style.position = 'fixed';
    sceneBtn.style.right = 50 + 'px';
    sceneBtn.style.bottom = 50 + 'px';
    sceneBtn.onclick = function () {
        if (getComputedStyle(sceneGrid).opacity == 0) {
            sceneGrid.style.opacity = 1;
        } else {
            sceneGrid.style.opacity = 0;
        }
    }
}

// 更换场景图
function changeScene() {
    // 1. 移除已存在的模块
    // 2. 添加新场景
    // 3. 重新计算消失点
    // 4. 添加模块
    sceneImgs.forEach(elem => {
        elem.onclick = function () {
            if (/1/.test(elem.getAttribute('src'))) {
                floorBtn.style.display = 'block';
            } else {
                floorBtn.style.display = 'none';
            }
            overlay.setAttribute('src', elem.getAttribute('src'));
        }
    });
}