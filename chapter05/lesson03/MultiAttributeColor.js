// chapter 5
// 利用varying变量改变顶点颜色

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' + // varying变量 varying variable
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +  // 将数据传给片元着色器 Pass the data to the fragment shader
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' + // 精度限定 Precision qualifier
  '#endif\n' +
  'varying vec4 v_Color;\n' +    // 从顶点着色器接受数据 Receive the data from the vertex shader
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
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

  // 获取attribute变量a_Position和a_Color的存储位置
  // Get the storage location of a_Position and a_Color
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Position < 0 || a_Color < 0) {
    console.log('Failed to get the storage location of a_Position or a_Color');
    return -1;
  }

  // 设置顶点坐标和点的颜色
  // Set vertex coordinates and colors
  var n = initVertexBuffers(gl, a_Position, a_Color);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三个点
  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl, a_Position, a_Color) {
  var verticesColors = new Float32Array([
    // 顶点坐标和点的颜色
    // Vertex coordinates and color
    0.0, 0.5, 1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 1.0,
  ]);
  var n = 3; // 点的个数 The number of vertices

  // 创建缓冲区对象
  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将顶点坐标和颜色写入缓冲区
  // Write the vertex coordinates and colors to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  // 获取每个元素所占字节数
  // Get the number of bytes per element
  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // 分配并开启缓冲区
  // assign and enable buffer
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);  // 开启缓冲区分配 Enable the assignment of the buffer object

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);  // 开启缓冲区分配 Enable the assignment of the buffer object

  return n;
}
