// chapter 3
// 旋转变化

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  // x' = x cosβ - y sinβ
  // y' = x sinβ + y cosβ　Equation 3.3
  // z' = z
  'attribute vec4 a_Position;\n' +
  // 'uniform float u_CosB, u_SinB;\n' +
  'uniform vec2 u_CosBSinB;\n' + // 效率更优 better code
  'void main() {\n' +
  '  gl_Position.x = a_Position.x * u_CosBSinB.x - a_Position.y * u_CosBSinB.y;\n' +
  '  gl_Position.y = a_Position.x * u_CosBSinB.y + a_Position.y * u_CosBSinB.x;\n' +
  '  gl_Position.z = a_Position.z;\n' +
  '  gl_Position.w = 1.0;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 旋转角度
// The rotation angle
var ANGLE = 90.0;

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

  // 获取uniform变量uu_CosB和u_SinB的存储位置
  // Get the storage location of u_Translation
  // var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
  // var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
  // if (!u_CosB || !u_SinB) {
  //   console.log('Failed to get the storage location of u_CosB or u_SinB');
  //   return;
  // }

  // 效率更优
  // better code
  var u_CosBSinB = gl.getUniformLocation(gl.program, 'u_CosBSinB');
  if (!u_CosBSinB) {
    console.log('Failed to get the storage location of u_CosBSinB');
    return;
  }

  // 将旋转图形所需的数据传输给顶点着色器
  // Pass the data required to rotate the shape to the vertex shader
  var radian = Math.PI * ANGLE / 180.0; // 转为弧度制 Convert to radians
  var cosB = Math.cos(radian);
  var sinB = Math.sin(radian);
  // gl.uniform1f(u_CosB, cosB);
  // gl.uniform1f(u_SinB, sinB);

  // 效率更优
  // better code
  gl.uniform2f(u_CosBSinB, cosB, sinB);

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
