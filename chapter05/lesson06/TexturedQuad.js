// chapter 5
// 使用纹理图像
// 理解坐标系的转换 从纹理到顶点的映射

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
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

  // 获取attribute变量a_Position和a_TexCoord的存储位置
  // Get the storage location of a_Position and a_TexCoord
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_Position < 0 || a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_Position or a_TexCoord');
    return -1;
  }

  // 设置顶点信息
  // Set the vertex information
  var n = initVertexBuffers(gl, a_Position, a_TexCoord);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 获取u_Sampler的存储位置
  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  // 配置纹理
  // Set texture
  if (!initTextures(gl, n, u_Sampler)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}

function initVertexBuffers(gl, a_Position, a_TexCoord) {
  var verticesTexCoords = new Float32Array([
    // 顶点坐标和纹理坐标
    // Vertex coordinates, texture coordinate
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0,
  ]);
  var n = 4; // 点的个数 The number of vertices

  // 创建缓冲区对象
  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // 将顶点坐标和纹理坐标写入缓冲区对象
  // Write data into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  // 分配并开启缓冲区对象
  // assign and enable buffer
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // 开启分配 Enable the assignment of the buffer object

  // 将纹理坐标分配给a_TexCoord并开启它
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // 开启分配 Enable the assignment of the buffer object

  return n;
}

function initTextures(gl, n, u_Sampler) {
  var texture = gl.createTexture();   // 创建纹理对象 Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  var image = new Image();  // 创建一个image对象 Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  // 注册图像加载事件的响应函数
  // Register the event handler to be called on loading an image
  image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };

  // 浏览器开始加载图像
  // Tell the browser to load an image
  // image.src = './resources/sky.jpg';
  image.src = 'data:image/jpeg;base64,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'

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行y轴反转 Flip the image's y axis

  // 开启0号纹理单元
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);

  // 向target绑定纹理对象
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 配置纹理图像，将纹理图像分配给纹理对象
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // 将0号纹理传递给着色器
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制矩形
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
