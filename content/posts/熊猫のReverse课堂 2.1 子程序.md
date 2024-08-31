+++
categories = ['笔记']
tags = ['Reverse']
title = '熊猫のReverse课堂 2.1 子程序'
slug = 'reverse-2_1-subroutine'
date = 2024-08-28T09:55:27+08:00
lastmod = 2024-08-30T09:55:27+08:00
draft = false
+++

## 函数原型

1. 参数列表，包括参数个数和各参数类型
2. 返回值类型

（不包括函数名）

eg:
``` cpp
int output_string1(char buf[], int len);
int output_string2(char buf[], int len);

typedef int (*f)(char,int );
f fun;
f f2;
fun = output_output_string1;
fun = output_output_string2;
```

## 1.1 函数调用约定

- 调用约定
	- 约定了函数调用者与被调用者之间的一些操作
		- 参数如何传递，即如何布置使用栈传递的数据?
		- 栈平衡由谁维持，即调用结束后栈平衡的维持策略，由调用者还是被调用者保持栈平衡?0
		- 返回值如何传递?
- 常用调用约定类型
	- C/C++程序，x86架构/32位
		- cdec、stdcall、fastcall
		- thiscall
	- C/C++程序，x86-64架构/64位
		- 变形fastcall
		- thiscall
	- 其他类型

注:以下示例以32位windows操作系统的vc编译器

#### cdecl
- 被称作C调用约定
- 是UNIX系统中的一种常用的函数调用约定
- 参数传递方式
	- 参数逆序传递
- 栈平衡
	- 调用者清理栈数据，维持栈平衡

![enter image description here](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/test.png)

#### stdcall
- 被称作标准调用约定
- 是Windows系统中的一种常用函数调用约定
- Windows API使用stdcall
- 参数传递方式
	- 参数逆序传递
- 栈平衡
	- 被调用者清理栈数据，维持栈平衡

![enter image description here](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/1.png)

#### fastcall
- 被称作快速调用约定
- 是windows系统中一种高效的调用约定
- 参数传递方式
	- 被调用函数的前2个参数使用eax和edx寄存器传递，正序
	- 其他参数使用stdcall调用约定传递
- 栈平衡
	- 参数个数小于等于2个时不存在栈平衡的问题

![enter image description here](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/2.png)

## 1.2 函数序言与尾声
- 原因
	- 函数的调用及返回通过调用栈实现
	- 函数的局部变量和传递的参数保存在栈帧中，使用栈寄存器(esp，ebp)管理栈帧;
	- 调用执行现场(处理器状态)保存在栈帧中。
- 作用
	- 栈帧的初始化
	- 保存现场
	- 保存必要的寄存器的值，以便调用返回后继续使用该值。

#### 1.2.1 序言
- 为局部变量开辟内存空间，即生成栈帧
- 将ebp保存在栈中，调整ebp到当前esp值，增长栈空间
``` asm
push ebp
mov ebp, esp
sub esp,x ;x为栈空间大小
```
- 根据编译器的不同，操作系统的安全设置等，存在各种变形的情况

#### 1.2.2 尾声
- 释放栈中开辟的内存空间，即释放栈帧
- 方式一：缩小栈空间，将esp恢复至ebp，弹出调用函数的ebp，返回到调用函数的下一条指令继续执行。
``` asm
add esp x
pop ebp
ret
```
- 方式二：使用leave指令，相当于`mov esp,ebp;pop ebp`

``` asm
leave
ret
```
- 根据编译器的配置，操作系统的安全设置等，尾声存在各种变形的情况。

1.3 参数传递与变长参数传递
- 传递参数给子程序
	- 传值
		- 传递参数的一个拷贝，不能修改调用函数的数据。
		- 直接将被传递参数压入栈中
	- 传引用
		- 传递指向参数的一个指针，可修改调用函数的数据。复杂数据类型的参数传递口如结构体等，更关注使用传值或传引用的方式
- C语言支持变长参数的函数
	- 如printf()、scanf().
	- 自定义变长参数函数
		- `int myprintf(int i, int j, ...){...}`

1.4 返回值传递
- 传递返回值
	- 子程序(被调用者)将返回值传递给调用函数(调用者)
- 一般使用eax寄存器传递返回值



