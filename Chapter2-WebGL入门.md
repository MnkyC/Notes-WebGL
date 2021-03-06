# Canvas

HTML5出现前，网页上显示图像只能用HTML的原生方案<img>标签，但只能显示静态图片，不能实时绘制和渲染。后来出现第三方解决方案，如Flash Player

HTML5的出现改变一切，引入<canvas>标签，允许js动态绘制图形

canvas默认是透明的，不绘制是看不见的


部分浏览器并不支持<canvas>标签，会直接忽略，不过可以在标签中加入错误提示

## 使用方式

1. 获取<canvas>元素

   根据<canvas>标签中的id来获取：document.getElementById('canvas的id')

2. 通过元素获取绘图上下文

   canvas不直接提供绘图方法，而是用上下文（context）来绘图
   获取上下文 canvas.getContext('2d')，参数指定了上下文的类型（二维或三维）

3. 调用绘制方法

## 坐标系

横轴为x轴（正方向朝右），纵轴为y轴（正方向朝下），原点在左上角

# WebGL程序—清空绘图区

流程

1. 获取<canvas>元素，同上
2. 为WebGL获取绘图上下文
   这里注意，用canvas.getContext()获取的WebGL绘图上下文在不同浏览器中是不同的，所以需要借助辅助函数getWebGLContext(canvas)，该函数需要引入文件cuon-utils.js

WebGL继承自OpenGL，所以颜色分量的取值范围从0.0到1.0，RGB值越高，颜色越亮，透明度越高，颜色越不透明

**WebGL依赖着色器(shader)的绘图机制，不然无法绘图**

# 着色器

顶点着色器控制点的位置和大小；片元着色器控制点的颜色

## 顶点着色器(Vertex shader)
用于描述顶点特性（位置，颜色等）的程序
顶点是二维或三维空间中的一个点，如端点或交点

和C语言一样，必须包含一个 main() 函数，void 表示不会有返回值，注意，不能为 main() 指定参数

程序中有两个内置变量 gl_Position (顶点位置，即要绘制的点的位置) 和 gl_PointSize (点的尺寸)

**gl_Position 必须被赋值，否则着色器无法正常工作**

## 片元着色器(Fragment shader)
进行逐片元处理过程的程序，如光照
片元是WebGL术语，可以理解为像素（图像的单元），更严格来说，还包括这个像素的位置，颜色和其他信息

**作用就是处理片元，使其显示在屏幕上**

和顶点着色器一样，也从 main() 函数开始执行

```
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
```

将点的颜色赋值给gl_FragColor变量，**gl_FragColor是片元着色器唯一的内置变量**，其控制着像素在屏幕上的最终颜色

gl_FragColor也是vec4类型的，分别代表RGBA格式

## 绘制操作

调用API进行绘制

大致流程：执行顶点着色器，依次执行main()函数，赋值gl_Position和gl_PointSize；执行完顶点着色器，片元着色器就会开始执行，调用main()函数，赋值gl_FragColor，最后绘制完成

## WebGL坐标系

由于WebGL处理三维图形，所以使用三维坐标系（笛卡尔坐标系，又称右手坐标系）

面向屏幕，x轴是水平的（正方向朝右），y轴是垂直的（正方向朝上），z轴是垂直于屏幕的（正方向朝外）

## attribute变量

传输与顶点相关的数据，是一种GLSL ES变量，**用于外部向顶点着色器内传输数据，只用于顶点着色器**

### 使用方式

1. 在顶点着色器中，声明attribute变量

   ```
   attribute vec4 a_Position;
   ```

   关键字attribute被称为**存储限定符**（storage qualifier），其修饰的变量为attribute变量

   **attribute变量必须声明为全局变量**，数据从着色器外部传给该变量

   **格式必须按照：<存储限定符><类型><变量名>**

2. 将attribute变量赋值给gl_Position变量

   ```
   gl_Position = a_Position;
   ```

   **至此就完成了顶点着色器部分，它已经准备好从外部接收顶点坐标了**

3. 要完成第二步，还需要向attribute变量传输数据，为此还需要以下几个步骤

   - 获取attribute变量的存储位置

     每个attribute变量都有一个存储地址，向WebGL系统请求

   ```
   // 获取attribute变量的存储位置
   var a_Position = gl.getAttribLocation(gl.program, 'a_Position')；
   ```

   第一个参数为一个**程序对象**（program object），包括了顶点着色器和片元着色器，作为固定参数即可

   **注意，必须在initShader()函数后再访问gl.program**

   第二个参数为想获取存储地址的attribute变量的名称

   函数返回值为attribute变量的存储地址

   - 向attribute变量赋值

     借助内置函数完成操作

     ```
     // 将顶点位置传输给attribute变量
     gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
     ```

     第一个参数为attribute变量的存储地址

     第二，三，四个参数为三个浮点型数值，即点的x, y, z坐标值

     无返回值

     至此就完成了向attribute变量传输数据

     vertexAttrib3f虽然只传了三个分量值，但默认第4个分量为1.0，表示颜色完全不透明

## uniform变量

传输与顶点无关（对所有顶点都相同）的数据

## 语言
类似于C的OpenGL ES着色器语言（GLSL ES）
## 初始化着色器
借助辅助函数initShader()可对字符串形式的着色器程序进行初始化，该函数需要引入文件cuon-utils.js

**着色器运行在WebGL系统中，不是js程序中**
**WebGL程序包括运行在浏览器的js和运行在WebGL系统的着色器程序**

## WebGL程序执行流程

1.获取<canvas>元素
2.获取WebGL绘图上下文
3.初始化着色器
4.设置<canvas>背景色
5.清除<canvas>
6.绘图


