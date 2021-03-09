// chapter 2
// 绘制一个点，并使用uniform变量改变点的颜色

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
  'precision mediump float;\n' +   // 限定精度 Finite precision
  'uniform vec4 u_FragColor;\n' +  // 声明uniform变量 uniform variable
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
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

  // 获取uniform变量u_FragColor的存储位置
  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // 注册鼠标点击事件响应函数
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position, u_FragColor) };

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  // 鼠标点击位置数组 The array for the position of a mouse press
var g_colors = [];  // 存储点颜色的数组 The array to store the color of a point
function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // 鼠标点击处的x坐标 x coordinate of a mouse pointer
  var y = ev.clientY; // 鼠标点击处的y坐标 y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  // 获取<canvas>在浏览器客户区中的坐标
  // Get the coordinates of Canvas in the browser client area
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // 将坐标存储到g_points数组中
  // Store the coordinates to g_points array
  g_points.push([x, y]);

  // 将点的颜色存储到g_colors数组中
  // Store the color of the point in g_colors array
  if (x >= 0.0 && y >= 0.0) {      // 第一象限 First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // 红色 Red
  } else if (x < 0.0 && y < 0.0) { // 第三象限 Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // 绿色 Green
  } else {                         // 其他 Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // 白色 White
  }

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for (var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // 将点的位置传递到变量a_Position中
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    // 将点的颜色传递到变量u_FragColor中
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // 绘制一个点
    // Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}