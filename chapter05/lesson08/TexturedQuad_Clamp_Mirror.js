// chapter 5
// 填充和重复使用纹理图像
// Chrome需要开启--allow-file-access-from-files选项

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
    // Vertex coordinate, Texture coordinate
    -0.5, 0.5, -0.3, 1.7,
    -0.5, -0.5, -0.3, -0.2,
    0.5, 0.5, 1.7, 1.7,
    0.5, -0.5, 1.7, -0.2
  ]);
  var n = 4; // 点的个数 The number of vertices

  // 创建缓冲区对象
  // Create a buffer object
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

  // 将顶点坐标分配给a_Position并开启它
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  // 将纹理坐标分配给a_TexCoord并开启它
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  // 解绑缓冲区对象
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

function initTextures(gl, n, u_Sampler) {
  // 创建纹理对象
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // 创建一个image对象
  // Create the image object
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  // 注册图像加载事件的响应函数
  // Register the event handler to be called when image loading is completed
  image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };

  // 浏览器开始加载图像
  // Tell the browser to load an Image
  image.src = '../../resources/sky.jpg';

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // 对纹理图像进行y轴反转 Flip the image Y coordinate

  // 开启0号纹理单元
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);

  // 向target绑定纹理对象
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

  // 配置纹理图像，将纹理图像分配给纹理对象
  // Set the image to texture
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
