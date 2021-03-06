function main() {
  // 获取<canvas>元素
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  // 获取绘制二维图形的绘图上下文
  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // 绘制蓝色矩形
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // 设置填充颜色为蓝色 Set color to blue
  ctx.fillRect(120, 10, 150, 150);        // 使用填充颜色填充矩形 Fill a rectangle with the color
}
