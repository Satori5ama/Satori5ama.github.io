+++
categories = ['笔记']
tags = ['Reverse']
title = 'Reverse 2.1 子程序'
slug = 'reverse-2_1-subroutine'
date = 2024-08-28T09:55:27+08:00
lastmod = 2024-08-28T09:55:27+08:00
draft = false
+++


## 函数调用约定

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




