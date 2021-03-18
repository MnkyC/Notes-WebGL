// chapter 5
// 使用多个纹理
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
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
  '  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
  '  gl_FragColor = color0 * color1;\n' +
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

  // 获取u_Sampler0和u_Sampler1的存储位置
  // Get the storage location of u_Sampler0 and u_Sampler1
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler0 || !u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler0 or u_Sampler1');
    return false;
  }

  // 配置纹理
  // Set texture
  if (!initTextures(gl, n, u_Sampler0, u_Sampler1)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}

function initVertexBuffers(gl, a_Position, a_TexCoord) {
  var verticesTexCoords = new Float32Array([
    // 顶点坐标和纹理坐标
    // Vertex coordinate, Texture coordinate
    -0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
    0.5, 0.5, 1.0, 1.0,
    0.5, -0.5, 1.0, 0.0,
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

  return n;
}

function initTextures(gl, n, u_Sampler0, u_Sampler1) {
  // 创建纹理对象
  // Create a texture object
  var texture0 = gl.createTexture();
  var texture1 = gl.createTexture();
  if (!texture0 || !texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  // 创建image对象
  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the image object');
    return false;
  }

  // 注册图像加载事件的响应函数
  // Register the event handler to be called when image loading is completed
  image0.onload = function () { loadTexture(gl, n, texture0, u_Sampler0, image0, 0); };
  image1.onload = function () { loadTexture(gl, n, texture1, u_Sampler1, image1, 1); };

  // 浏览器开始加载图像
  // Tell the browser to load an Image
  image0.src = '../../resources/sky.jpg';
  image1.src = '../../resources/circle.gif';

  return true;
}

// 标记纹理单元是否已经就绪
// Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// 对纹理图像进行y轴反转 Flip the image's y-axis

  // 激活纹理
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }

  // 绑定纹理对象到目标上
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 配置纹理参数
  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // 配置纹理图像，将纹理图像分配给纹理对象
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // 将纹理单元编号传递给着色器
  // Pass the texure unit to u_Sampler
  gl.uniform1i(u_Sampler, texUnit);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);   // 绘制矩形 Draw the rectangle
  }
}
