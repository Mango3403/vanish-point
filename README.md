# VanishPointJS
vanishing point in javascript

## 框架
1. UI框架: [material design lite](https://getmdl.io)(由于官方不再更新，将被替换), [material design component](https://material.io)
2. js工具: [threejs](https://threejs.org), [fabric.js](http://fabricjs.com), stats.js, dat.gui.js
3. 打包工具: webpack

## 问题
1. ```camera.position.z = 512;```这个数字是怎么得到的？
2. ```needsUpdate```是干什么用的？
3. 搞清楚```mag```与```repeat```的关系
4. 搞清楚```position```该如何自动准确计算
5. 搞清楚如何获取最准确的消失点，当前只考虑单消失点
6. 试着做两个图层使有些模块可以置顶显示，即不被背景图遮盖

## 笔记
1. 各向异性用于将远景模糊的部分变清楚