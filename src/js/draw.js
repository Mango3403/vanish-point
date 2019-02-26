let f_canvas;
let draw_start_pos;

let drawing_canvas;
let drawing_context;
let text_input = document.getElementById('drawing-text-input');
let text_btn = document.getElementById('drawing-text-btn');
let image_btn = document.getElementById('drawing-image-btn');

let paint = false;

function initFabricCanvas() {
  f_canvas = new fabric.Canvas('drawing-canvas');
  draw_start_pos = new THREE.Vector2();

  drawing_canvas = f_canvas.lowerCanvasEl;
  drawing_context = drawing_canvas.getContext('2d');
}

// 设置画布
export function setupCanvasDrawing(material) {
  initFabricCanvas();
  // draw white background
  drawing_context.fillStyle = 'rgba(0,0,0,0)';
  drawing_context.fillRect(0, 0, 128, 128);
  // set canvas as material.map (this could be done to any map, bump, displacement etc.)
  material.map = new THREE.CanvasTexture(drawing_canvas);
  // add canvas event listeners
  drawing_canvas.addEventListener('mousedown', function (e) {
    paint = true;
    draw_start_pos.set(e.offsetX, e.offsetY);
  });
  drawing_canvas.addEventListener('mousemove', function (e) {
    if (paint) {
      draw(material, drawing_context, e.offsetX, e.offsetY);
    }
  });
  drawing_canvas.addEventListener('mouseup', function () {
    paint = false;
  });
  drawing_canvas.addEventListener('mouseleave', function () {
    paint = false;
  });

}

// 绘画功能
export function draw(material, drawContext, x, y) {
  // function draw(material) {
  drawContext.moveTo(draw_start_pos.x, draw_start_pos.y);
  drawContext.strokeStyle = '#FFFFFF';
  drawContext.lineTo(x, y);
  drawContext.stroke();
  // reset drawing start position to current position.
  draw_start_pos.set(x, y);
  // f_canvas.isDrawingMode = true;
  // f_canvas.freeDrawingBrush.color = '#FFFFFF';
  // need to flag the map as needing updating.
  material.map.needsUpdate = true;
}

// 设置为透明背景
export function setBackgroundTransparent() {
  let {
    plane
  } = planes[0];
  plane.material.transparent = true;
}

// 设置背景色
export function setBackgroundColor() {
  let {
    plane
  } = planes[0];
  plane.material.transparent = false;
}

// 添加文本
export function addText() {
  text_btn.addEventListener('click', function () {
    let text = new fabric.Text('你好', {
      left: 30,
      top: 30,
      stroke: '#FFFFFF'
    });

    f_canvas.add(text);
  }, false);
}

// 添加图片
export function addImage() {
  image_btn.addEventListener('click', function () {
    fabric.Image.fromURL('/media/shoe.jpg', function (img) {
      img.scaleX = img.scaleY = 0.1;
      // add filter
      img.filters.push(new fabric.Image.filters.Grayscale());

      // apply filters and re-render canvas when done
      img.applyFilters();
      f_canvas.add(img);
    });
  }, false);
}