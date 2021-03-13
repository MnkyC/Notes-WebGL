// chapter 4
// 三角形转动平移

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 旋转角度（度/秒）
// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;

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

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 获取uniform变量u_ModelMatrix的存储位置
  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // 三角形当前的旋转角度
  // Current rotation angle
  var currentAngle = 0.0;
  // 模型矩阵， Matrix4 对象
  // Model matrix
  var modelMatrix = new Matrix4();

  // 开始绘制三角形
  // Start drawing
  var tick = function () {
    currentAngle = animate(currentAngle);  // 更新旋转角度 Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // 绘制三角形 Draw the triangle
    requestAnimationFrame(tick, canvas); // 请求浏览器调用tick Request that the browser calls tick
  };
  tick();
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
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 连接a_Position变量和分配给它的缓冲区对象
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // 设置旋转矩阵
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0.35, 0, 0);

  // 将旋转矩阵传输给顶点着色器
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制三角形
  // Draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// 记录上一次调用函数的时刻
// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // 计算距离上次调用经过多长时间
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // 根据距离上次调用的时间，更新当前的旋转角度
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}
