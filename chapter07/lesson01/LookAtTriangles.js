// chapter 7
// 确定视点，观察点，上方向

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
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

  // 设置顶点坐标和点的颜色（蓝色三角形在最前面）
  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl, a_Position, a_Color);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // 获取uniform变量u_ViewMatrix的存储位置
  // Get the storage location of u_ViewMatrix
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage locations of u_ViewMatrix');
    return;
  }

  // 设置视点，视线和上方向
  // Set the matrix to be used for to set the camera view
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

  // 将视图矩阵传给u_ViewMatrix变量
  // Set the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三角形
  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, a_Position, a_Color) {
  var verticesColors = new Float32Array([
    // 顶点坐标和颜色
    // Vertex coordinates and color(RGBA)
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形在最后面 The back green one
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 黄色三角形在中间 The middle yellow one
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // 蓝色三角形在最前面 The front blue one 
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);
  var n = 9; // 点的个数 The number of vertices

  // 创建缓冲区对象
  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将顶点坐标和颜色写入缓冲区
  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // 将缓冲区对象分配给a_Position变量并开启
  // Assign the buffer object to a_Position and enable the assignment
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // 将缓冲区对象分配给a_Color变量并开启
  // Assign the buffer object to a_Color and enable the assignment
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // 解绑缓冲区对象
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
