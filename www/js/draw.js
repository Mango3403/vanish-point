let fCanvas = new fabric.Canvas('drawing-canvas');
let drawStartPos = new THREE.Vector2();

let drawingCanvas = fCanvas.lowerCanvasEl;
let drawingContext = drawingCanvas.getContext('2d');
let textInput = document.getElementById('drawing-text-input');
let textBtn = document.getElementById('drawing-text-btn');
let imageBtn = document.getElementById('drawing-image-btn');

let paint = false;

// 设置画布
function setupCanvasDrawing(material) {
  // draw white background
  drawingContext.fillStyle = 'rgba(0,0,0,0)';
  drawingContext.fillRect(0, 0, 128, 128);
  // set canvas as material.map (this could be done to any map, bump, displacement etc.)
  material.map = new THREE.CanvasTexture(drawingCanvas);
  // add canvas event listeners
  drawingCanvas.addEventListener('mousedown', function (e) {
    paint = true;
    drawStartPos.set(e.offsetX, e.offsetY);
  });
  drawingCanvas.addEventListener('mousemove', function (e) {
    if (paint) {
      draw(material, drawingContext, e.offsetX, e.offsetY);
    }
  });
  drawingCanvas.addEventListener('mouseup', function () {
    paint = false;
  });
  drawingCanvas.addEventListener('mouseleave', function () {
    paint = false;
  });
  // draw(material);
}

// 绘画功能
function draw(material, drawContext, x, y) {
  // function draw(material) {
  drawContext.moveTo(drawStartPos.x, drawStartPos.y);
  drawContext.strokeStyle = '#FFFFFF';
  drawContext.lineTo(x, y);
  drawContext.stroke();
  // reset drawing start position to current position.
  drawStartPos.set(x, y);
  // fCanvas.isDrawingMode = true;
  // fCanvas.freeDrawingBrush.color = '#FFFFFF';
  // need to flag the map as needing updating.
  material.map.needsUpdate = true;
}

// 设置为透明背景
function setBackgroundTransparent() {
  let {
    plane
  } = planes[0];
  plane.material.transparent = true;
}

// 设置背景色
function setBackgroundColor() {
  let {
    plane
  } = planes[0];
  plane.material.transparent = false;
}

// 添加文本
function addText() {
  textBtn.addEventListener('click', function () {
    let text = new fabric.Text('你好', {
      left: 30,
      top: 30,
      stroke: '#FFFFFF'
    });

    fCanvas.add(text);
  }, false);
}

// 添加图片
function addImage() {
  imageBtn.addEventListener('click', function () {
    fabric.Image.fromURL('/www/media/shoe.jpg', function (img) {
      img.scaleX = img.scaleY = 0.1;
      // add filter
      img.filters.push(new fabric.Image.filters.Grayscale());

      // apply filters and re-render canvas when done
      img.applyFilters();
      fCanvas.add(img);
    });
  }, false);
}