// chapter 2
// 绘制一个点，使用attribute传值

// 顶点着色器程序
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // 声明attribute变量 attribute variable
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// 片元着色器程序
// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

  // 获取attribute变量a_Position和a_PointSize的存储位置
  // Get the storage location of a_Position and a_PointSize
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position < 0 || a_PointSize < 0) {
    console.log('Failed to get the storage location of a_Position and a_PointSize');
    return;
  }

  // 将顶点位置传输给attribute变量
  // Pass vertex position to attribute variable
  gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0);

  // 将顶点尺寸传输给attribute变量
  // Pass vertex size to attribute variable
  gl.vertexAttrib1f(a_PointSize, 5.0);

  // 设置<canvas>的背景色
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 0.5);

  // 清空<canvas>
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制一个点
  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}