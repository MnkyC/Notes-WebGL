# 《WebGL编程指南》学习札记
The beauty of WebGL

- 对每一章节做了知识总结，加入了自己的理解
- 示例代码依据官方源码，相比于书籍源代码，添加了中英文注释，结合了自己的理解和习惯

# 目录

## Chapter 2—WebGL入门

### 读书摘要

- [Chapter2-WebGL入门](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/Chapter2-WebGL%E5%85%A5%E9%97%A8.md)

### 示例程序

- [lesson01-绘制矩形](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson01/DrawRectangle.js)
- [lesson02-绘制颜色](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson02/HelloCanvas.js)
- [lesson03-添加着色器，绘制一个点](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson03/HelloPoint1.js)
- [lesson04-用attribute传值，绘制一个点](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson04/HelloPoint2.js)
- [lesson05-通过鼠标绘制一个点](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson05/ClickedPoints.js)
- [lesson06-绘制一个点，用uniform改变其颜色](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter02/lesson06/ColoredPoints.js)

## Chapter 3—绘制和变换三角形

### 读书摘要

- [Chapter3-绘制和变换三角形](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/Chapter3-%E7%BB%98%E5%88%B6%E5%92%8C%E5%8F%98%E6%8D%A2%E4%B8%89%E8%A7%92%E5%BD%A2.md)

### 示例程序

- [lesson01-用ARRAY_BUFFER缓冲区绘制三个点](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson01/MultiPoint.js)
- [lesson02-绘制三角形](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson02/HelloTriangle.js)
- [lesson03-绘制基本图形（LINES）](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson03/HelloTriangle_LINES.js)
- [lesson04-绘制基本图形（LINE_STRIP）](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson04/HelloTriangle_LINE_STRIP.js)
- [lesson05-绘制基本图形（LINE_LOOP）](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson05/HelloTriangle_LINE_LOOP.js)
- [lesson06-绘制矩形](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson06/HelloQuad.js)
- [lesson07-绘制飘带](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson07/HelloQuad_FAN.js)
- [lesson08-平移转换](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson08/TranslatedTriangle.js)
- [lesson09-利用数学公式旋转变换](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson09/RotatedTriangle.js)
- [lesson10-利用矩阵抽象旋转变换](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson10/RotatedTriangle_Matrix.js)
- [lesson11-利用矩阵抽象进行缩放](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter03/lesson11/ScaledTriangle_Matrix.js)

## Chapter 4—高级变换与动画基础

### 读书摘要

- [Chapter4-高级变换与动画基础](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/Chapter4-%E9%AB%98%E7%BA%A7%E5%8F%98%E6%8D%A2%E4%B8%8E%E5%8A%A8%E7%94%BB%E5%9F%BA%E7%A1%80.md)

### 示例程序

- [lesson01-利用矩阵库进行旋转变换](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson01/RotatedTriangle_Matrix4.js)
- [lesson02-利用模型矩阵先平移后旋转](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson02/RotatedTranslatedTriangle.js)
- [lesson03-利用模型矩阵先旋转后平移](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson03/TranslatedRotatedTriangle.js)
- [lesson04-动画，三角形转动](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson04/RotatingTriangle.js)
- [lesson05-动画，三角形转动平移](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson05/RotatingTranslatedTriangle.js)
- [lesson06-动画，控制三角形速度](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter04/lesson06/RotatingTriangle_withButtons.js)

## Chapter 5—颜色与纹理

### 读书摘要

- [Chapter5-颜色与纹理](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/Chapter5-%E9%A2%9C%E8%89%B2%E4%B8%8E%E7%BA%B9%E7%90%86.md)

### 示例程序

- [lesson01-使用多个缓冲区绘制](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson01/MultiAttributeSize.js)
- [lesson02-使用一个缓冲区绘制](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson02/MultiAttributeSize_Interleaved.js)
- [lesson03-varying变量改变顶点颜色](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson03/MultiAttributeColor.js)
- [lesson04-varying变量绘制彩色三角形](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson04/ColoredTriangle.js)
- [lesson05-绘制彩色三角形，验证光栅化](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson05/HelloTriangle_FragCoord.js)
- [lesson06-使用纹理图像](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson06/TexturedQuad.js)
- [lesson07-调整纹理坐标来重复使用纹理图像](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson07/TexturedQuad_Repeat.js)
- [lesson08-填充和重复使用纹理图像](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson08/TexturedQuad_Clamp_Mirror.js)
- [lesson09-使用多个纹理](https://github.com/MnkyC/Notes-WebGL/blob/main/chapter05/lesson09/MultiTexture.js)

# Author: MnkyC