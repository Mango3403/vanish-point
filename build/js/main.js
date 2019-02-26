!function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";let o,a,r,i;n.r(t),n.d(t,"setupCanvasDrawing",function(){return u}),n.d(t,"draw",function(){return c}),n.d(t,"setBackgroundTransparent",function(){return p}),n.d(t,"setBackgroundColor",function(){return f}),n.d(t,"addText",function(){return w}),n.d(t,"addImage",function(){return h});document.getElementById("drawing-text-input");let d=document.getElementById("drawing-text-btn"),l=document.getElementById("drawing-image-btn"),s=!1;function u(e){o=new fabric.Canvas("drawing-canvas"),a=new THREE.Vector2,r=o.lowerCanvasEl,(i=r.getContext("2d")).fillStyle="rgba(0,0,0,0)",i.fillRect(0,0,128,128),e.map=new THREE.CanvasTexture(r),r.addEventListener("mousedown",function(e){s=!0,a.set(e.offsetX,e.offsetY)}),r.addEventListener("mousemove",function(t){s&&c(e,i,t.offsetX,t.offsetY)}),r.addEventListener("mouseup",function(){s=!1}),r.addEventListener("mouseleave",function(){s=!1})}function c(e,t,n,o){t.moveTo(a.x,a.y),t.strokeStyle="#FFFFFF",t.lineTo(n,o),t.stroke(),a.set(n,o),e.map.needsUpdate=!0}function p(){let{plane:e}=planes[0];e.material.transparent=!0}function f(){let{plane:e}=planes[0];e.material.transparent=!1}function w(){d.addEventListener("click",function(){let e=new fabric.Text("你好",{left:30,top:30,stroke:"#FFFFFF"});o.add(e)},!1)}function h(){l.addEventListener("click",function(){fabric.Image.fromURL("/media/shoe.jpg",function(e){e.scaleX=e.scaleY=.1,e.filters.push(new fabric.Image.filters.Grayscale),e.applyFilters(),o.add(e)})},!1)}},function(e,t,n){"use strict";n.r(t),n.d(t,"floors",function(){return y}),n.d(t,"initBack",function(){return x}),n.d(t,"initOver",function(){return v}),n.d(t,"animate",function(){return I});var o=n(0);n(2);let a,r,i,d,l,s,u,c,p,f=window.innerWidth,w=window.innerHeight,h=document.getElementById("three_back"),m=document.getElementById("three_over"),E=75,g={window_width:window.innerWidth,window_height:window.innerHeight,repeat_x:35,repeat_y:140,left:-100,top:-7e3,far:7e3,plane:{pos_x:0,pos_y:1,pos_z:0,scale_x:2,scale_y:3.5,rot_x:Math.PI/2,rot_y:-Math.PI,rot_z:Math.PI}},y=[],_=[];function x(){a=new THREE.Scene,(i=new THREE.WebGLRenderer({antialias:!0,preserveDrawingBuffer:!0})).shadowMap.enabled=!0,i.shadowMap.soft=!0,h.append(i.domElement),b(a),function(e){(r=new THREE.PerspectiveCamera(E,f/w,.1,e)).position.x=0,r.position.y=200,r.position.z=512;let t=(new THREE.Vector3).copy(r.position),n=2*Math.tan(E/2*Math.PI/180);t.x+=-.01*n,t.y+=.022*n,t.z+=-1,r.lookAt(t),r.updateProjectionMatrix()}(g.far),function(e,t,n,o,a,r){let i=new THREE.Texture(document.getElementById(e));i.wrapS=i.wrapT=THREE.RepeatWrapping,i.anisotropy=2,i.repeat.set(a,r),i.needsUpdate=!0;let d=new THREE.MeshBasicMaterial({map:i}),l=new THREE.PlaneBufferGeometry(1024*n,1024*o,10,10),s=new THREE.Mesh(l,d);s.rotation.x=-Math.PI/2,s.rotation.z=Math.PI,s.position.x=g.left,s.position.z=g.top,y.push({floor:s,repeatX:a,repeatY:r}),t.add(s)}("tex_floor_1",a,5,20,g.repeat_x,g.repeat_y),function(e){let t=new dat.GUI,n=t.addFolder("floor");n.add(g,"repeat_x",1,200).onChange(function(e){let{floor:t,repeatX:n}=y[0];n=e,t.material.map.repeat.setX(e),t.material.needsUpdate=!0}),n.add(g,"repeat_y",1,200).onChange(function(e){let{floor:t,repeatY:n}=y[0];repeatX=e,t.material.map.repeat.setY(e),t.material.needsUpdate=!0}),n.add(g,"left",-1e4,1e4).onChange(function(e){let{floor:t}=y[0];t.position.x=e}),n.add(g,"top",-1e4,1e4).onChange(function(e){let{floor:t}=y[0];t.position.z=e}),t.open()}(y[0].floor),p=new Stats,document.body.appendChild(p.dom),window.addEventListener("resize",M(r,i),!1)}function v(){d=new THREE.Scene,(s=new THREE.WebGLRenderer({antialias:!0,alpha:!0,preserveDrawingBuffer:!0})).setClearColor(15658734,0),s.shadowMap.enabled=!0,s.shadowMap.soft=!0,m.append(s.domElement),b(d),function(e){(l=new THREE.PerspectiveCamera(E,f/w,.1,e)).position.x=0,l.position.y=200,l.position.z=512;let t=(new THREE.Vector3).copy(l.position),n=2*Math.tan(E/2*Math.PI/180);t.x+=-.01*n,t.y+=.022*n,t.z+=-1,l.lookAt(t),l.updateProjectionMatrix()}(g.far),function(e){let t=new THREE.PlaneBufferGeometry(200,100,32),n=new THREE.MeshLambertMaterial({transparent:!0,side:THREE.DoubleSide});c=new THREE.Mesh(t,n),Object(o.setupCanvasDrawing)(n),console.log("使用了"),Object(o.addText)(),Object(o.addImage)(),c.rotation.x=g.plane.rot_x,c.rotation.y=g.plane.rot_y,c.rotation.z=g.plane.rot_z,c.position.x=g.plane.pos_x,c.position.y=g.plane.pos_y,c.position.z=g.plane.pos_z,c.scale.x=g.plane.scale_x,c.scale.y=g.plane.scale_y,_.push({plane:c}),e.add(c)}(d),function(e){let t=new dat.GUI,n=t.addFolder("plane");n.add(e,"pos_x",-1e3,1e3).onChange(function(e){c.position.x=e}),n.add(e,"pos_y",1,1e3).onChange(function(e){c.position.y=e}),n.add(e,"pos_z",-3e3,1e3).onChange(function(e){c.position.z=e}),n.add(e,"scale_x",.1,10).onChange(function(e){c.scale.x=e}).listen(),n.add(e,"scale_y",.1,10).onChange(function(e){c.scale.y=e}).listen(),n.add(e,"rot_x",0,2*Math.PI).onChange(function(e){c.rotation.x=e}).step(Math.PI/4),n.add(e,"rot_y",0,2*Math.PI).onChange(function(e){c.rotation.y=e}).step(Math.PI/4),n.add(e,"rot_z",0,2*Math.PI).onChange(function(e){c.rotation.z=e}).step(Math.PI/4),t.open()}(g.plane),window.addEventListener("resize",M(l,s),!1)}function b(e){u=new THREE.AmbientLight(16777215),e.add(u)}function M(e,t){let n=window.innerWidth,o=window.innerHeight;e&&(e.aspect=n/o,e.updateProjectionMatrix()),t&&t.setSize(n,o)}function T(e,t,n){M(r,i),M(l,s),g.window_width=window.innerWidth,g.window_height=window.innerHeight,e.render(t,n)}function I(){requestAnimationFrame(I),T(i,a,r),T(s,d,l),p.update()}},function(e,t,n){"use strict";n.r(t),n.d(t,"login",function(){return o});let o=!1;document.querySelector("#login-btn").addEventListener("click",function(){let e=document.querySelector("#account"),t=document.querySelector("#password");"Shintech2019"===e.value&&"$HINEtech!"===t.value?o=!0:(alert("账号或密码错误"),console.log(e.value),console.log(t.value))})}]);