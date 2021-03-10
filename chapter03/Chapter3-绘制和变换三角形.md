**三维模型的基本单位是三角形**

为了方便一次性将图形的顶点全部传入顶点着色器，WebGL提供了一种机制，缓冲区对象(buffer object)

# 缓冲区对象

可以一次性地向着色器传入多个顶点数据

缓存区对象是WebGL系统中的一块内存区域，可以将大量的顶点数据保存在其中，供顶点着色器使用

## 使用方式

1. 创建缓冲区对象 gl.createBuffer()

   ```
   var vertexBuffer = gl.createBuffer();
   ```

   执行该方法后，WebGL系统中会创建一个缓冲区对象

   相应的，**gl.deleteBuffer(buffer)**用来删除被其创建出来的缓冲区对象

2. 绑定缓冲区对象 gl.bindBuffer()

   ```
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   ```

   将缓冲区对象绑定到“目标”上，WebGL才能处理其中的内容，“目标”代表缓冲区对象的用途

   **gl.ARRAY_BUFFER表示缓冲区对象中包含了顶点的数据**

   至此就可以向缓冲区对象中写入数据了

3. 将数据写入缓冲区对象 gl.bufferData()

   ```
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   ```

   执行该方法后，第二个参数 vertices 的数据写入了绑定到第一个参数 gl.ARRAY_BUFFER 上的缓冲区对象中

   ***不能直接向缓冲区写入数据，只能通过“目标”写入，所以要写数据必须先绑定***

   写入的数据也有要求，要求是类型化数组

4. 将缓冲区对象分配给一个attribute变量 gl.vertexAttribPointer()

   第二章中的 gl.vertexAttrib[1234]f 系列函数为attribute变量分配值时，**一次只能分配一个值**

   现在，需要将整个数组中的所有值一次性分配给一个attribute变量

   这时就需要 gl.vertexAttribPointer()，它可以将缓冲区对象的引用（指针）分配给attribute变量

   ```
   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
   ```

   第一个参数为指定待分配attribute变量的存储位置

   第二个参数为缓冲区中每个顶点的分量个数（1到4），缺省就为0，第4个分量为1

   第三个参数用来指定数据格式

   无返回值

   至此，将整个缓冲区对象分配给了attribute变量

5. 开启attribute变量 gl.enableVertexAttribArray()

   为了顶点着色器能访问缓冲区内的数据，需要 gl.enableVertexAttribArray()

   ```
   gl.enableVertexAttribArray(a_Position);
   ```

   该函数用来处理缓冲区，调用该函数后，缓冲区对象和attribute变量的连接就真正建立起来了

   相应的，可以用 gl.disableVertexAttribArray() 来关闭分配

   至此，一切准备就绪，只需要运行顶点着色器，它就会自动将缓冲区中的顶点画出来

   **注意，开启attribute变量后，就不能用 gl.vertexAttrib[1234]f() 向其传值了，除非先关闭attribute变量**

## 类型化数组

为了绘制三角形，WebGL通常需要同时处理大量相同类型的数据，如顶点的坐标和颜色

**为了优化性能，为每种基本数据类型引入一种特殊的数组，即类型化数组**

- Int8Array，8位整型数（signed char），每个元素占1个字节
- UInt8Array，8位无符号整型数（unsigned char），每个元素占1个字节
- Int16Array，16位整型数（signed short），每个元素占2个字节
- UInt16Array，16位无符号整型数（unsigned short），每个元素占2个字节
- Int32Array，32位整型数（signed int），每个元素占4个字节
- UInt32Array，32位无符号整型数（unsigned int），每个元素占4个字节
- Float32Array，单精度32位浮点数（float），每个元素占4个字节
- Float64Array，双精度64位浮点数（double），每个元素占8个字节

和普通数组一样，可通过new运算符调用构造函数并传入数据而被创造，并且只能用new运算符，不可用[]运算符

还可以通过指定数组元素的个数来创建一个空的类型化数组

```
var vertices = new Float32Array(4);
```

# 基本图形

gl.drawArray() 方法中的第一个参数指定了不同的方式绘制图形

- gl.POINTS
- gl.LINES
- gl.LINE_STRIP
- gl.LINE_LOOP
- gl.TRIANGLES
- gl.TRIANGLE_STRIP
- gl.TRIANGLE_FAN

虽然WebGL只能绘制三种图形：点，线段，三角形，但是所有东西都可以由三角形组成

# 移动、旋转和缩放

## 平移

对顶点坐标的每个分量（x和y），加上三角形在对应轴上平移的距离

这是一个**逐顶点操作**，发生在顶点着色器中

执行步骤

1. 将顶点坐标传给a_Position
2. 向a_Position加上u_Translation
3. 结果赋值给gl_Position

注意，第4分量的值只能是1.0，所以a_Position的w是1.0时，u_Translation的w只能是0.0

## 旋转

旋转需要指明：

- 旋转轴（图形将围绕旋转轴旋转）
- 旋转方向（顺时针或逆时针）
- 旋转角度（图形旋转经过的角度）

"逆时针"的约定：旋转角度是正值，观察者在z轴正半轴处，视线沿着z轴负方向观察，那么看到物体就是逆时针旋转

正旋转（又称**右手法则旋转**）：右手握拳，大拇指伸直并使其指向旋转轴的正方向，那么右手其余几个手指就只指明了旋转的方向

