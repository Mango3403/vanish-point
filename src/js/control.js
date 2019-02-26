import { floors } from './main';
let floor_btn = document.querySelector('#floor_1');
let scene_btn = document.querySelector('#scene_btn');
let scene_grid = document.querySelector('#scene_grid');
let scene_imgs = document.querySelectorAll('#scene_grid img');
let overlay = document.querySelector('#overlay');

let test_btn = document.querySelector('.foo-button');

// setFloorBtn();
// setSceneBtn();
// changeScene();

/**
 * 设置地砖更换按钮
 */
export function setFloorBtn() {
    floor_btn.style.position = 'absolute';
    floor_btn.style.left = window.innerWidth / 2 + 'px';
    floor_btn.style.bottom = 30 + 'px';
    floor_btn.onclick = function () {
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

/**
 * 设置场景更换按钮
 */
export function setSceneBtn() {
    scene_btn.style.position = 'fixed';
    scene_btn.style.right = 20 + 'px';
    scene_btn.style.bottom = 20 + 'px';
    scene_btn.onclick = function () {
        if (getComputedStyle(scene_grid).display === 'flex') {
            scene_grid.style.display = 'none';
        } else {
            scene_grid.style.display = 'flex';
        }
    }
}

/**
 * 更换场景图
 */
export function changeScene() {
    // 1. 移除已存在的模块
    // 2. 添加新场景
    // 3. 重新计算消失点
    // 4. 添加模块
    scene_imgs.forEach(elem => {
        elem.onclick = function () {
            if (/1/.test(elem.getAttribute('src'))) {
                floor_btn.style.display = 'block';
            } else {
                floor_btn.style.display = 'none';
            }
            overlay.setAttribute('src', elem.getAttribute('src'));
        }
    });
}

/**
 * 实例化 material design components
 */
function initMDC() {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));
}