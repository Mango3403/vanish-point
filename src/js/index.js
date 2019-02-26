import { initBack, initOver, animate } from './main';

// 启动
window.onload = function () {
    if (login) {
        // 场景初始化
        initBack();
        initOver();
        animate();

        // 控制初始化
        setFloorBtn();
        setSceneBtn();
        changeScene();
    } else {
        document.location.href = "/login.html"
    }
}