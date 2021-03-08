// chapter 2
// 通过鼠标绘制一个点

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // 获取<canvas>元素
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // 获取WebGL绘图上下文
  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // 初始化着色器
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 获取attribute变量a_Position的存储位置
  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // 注册鼠标点击事件响应函数
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // 鼠标点击位置数组 The array for the position of a mouse press
function click(ev, gl, canvas, a_Position) {
  var x = ev.clientX; // 鼠标点击处的x坐标 x coordinate of a mouse pointer
  var y = ev.clientY; // 鼠标点击处的y坐标 y coordinate of a mouse pointer

  // 获取<canvas>在浏览器客户区中的坐标
  // Get the coordinates of Canvas in the browser client area
  var rect = ev.target.getBoundingClientRect();

  // 将<canvas>坐标映射到WebGL坐标
  // Map canvas coordinates to WebGL coordinates
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // 将坐标存储到g_points数组中
  // Store the coordinates to g_points array
  // g_points.push(x); g_points.push(y);

  // 代码优化
  // Code optimization
  g_points.push([x, y]);

  // 清除<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  // for (var i = 0; i < len; i += 2) {
  //   // 将点的位置传递到变量a_Position中
  //   // Pass the position of a point to a_Position variable
  //   gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

  //   // 绘制一个点
  //   // Draw a point
  //   gl.drawArrays(gl.POINTS, 0, 1);
  // }

  // 代码优化
  // Code optimization
  for (var i = 0; i < len; i++) {
    var xy = g_points[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}