import { initBack, initOver, animate } from './main';
import { setFloorBtn, setSceneBtn, changeScene } from './control';

start();

// 启动
function start() {
    // 场景初始化
    initBack();
    initOver();
    animate();

    // 控制初始化
    setFloorBtn();
    setSceneBtn();
    changeScene();
}