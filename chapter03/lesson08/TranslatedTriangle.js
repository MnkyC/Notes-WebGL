// chapter 3
// 平移转换

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform vec4 u_Translation;\n' + // 平移变换矢量 translation variable
  'void main() {\n' +
  '  gl_Position = a_Position + u_Translation;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 在x, y, z方向上平移的距离
// The translation distance for x, y, and z direction
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

  // 将顶点位置写入顶点着色器
  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl, a_Position);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // 获取uniform变量u_Translation的存储位置
  // Get the storage location of u_Translation
  var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  if (!u_Translation) {
    console.log('Failed to get the storage location of u_Translation');
    return;
  }

  // 将平移距离传递给顶点着色器
  // Pass the translation distance to the vertex shader
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三角形
  // Draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl, a_Position) {
  // 顶点数据
  // Vertex data
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

  // 将缓冲区对象绑定到目标（顶点数据）
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // 向缓冲区对象中写入数据
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 将缓冲区对象分配给a_Position变量
  // Assign the buffer object to the attribute variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 连接a_Position变量和分配给它的缓冲区对象
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}