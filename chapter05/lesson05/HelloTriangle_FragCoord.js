// chapter 5
// 逐顶点 => 光栅化 => 逐片元

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform float u_Width;\n' +
  'uniform float u_Height;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
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
    return -1;
  }

  // 获取uniform变量u_Width的存储位置
  // Get the storage location of u_Width
  var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  if (!u_Width) {
    console.log('Failed to get the storage location of u_Width');
    return;
  }

  // 获取uniform变量u_Height的存储位置
  // Get the storage location of u_Height
  var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  if (!u_Height) {
    console.log('Failed to get the storage location of u_Height');
    return;
  }

  // 将顶点信息写入顶点着色器
  // Write the data of vertices to a vertex shader
  var n = initVertexBuffers(gl, a_Position, u_Width, u_Height);
  if (n < 0) {
    console.log('Failed to set the data of the vertices');
    return;
  }

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三角形
  // Draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, a_Position, u_Width, u_Height) {
  var vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  var n = 3; // 点的个数 The number of vertices

  // 创建缓冲区对象
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将顶点数据写入缓冲区对象
  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 将顶点坐标传递给a_Position
  // Pass the position of a point to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 传递<canvas>的宽高
  // Pass the width and hight of the <canvas>
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  // 开启attribute变量a_Position
  // Enable the generic vertex attribute array
  gl.enableVertexAttribArray(a_Position);

  // 解绑缓冲区对象
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
