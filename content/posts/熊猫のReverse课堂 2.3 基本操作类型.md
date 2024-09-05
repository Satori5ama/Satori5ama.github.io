+++
categories = ['笔记']
tags = ['Reverse']
title = '熊猫のReverse课堂 2.3 基本操作类型'
slug = 'reverse-2_3-basic-operation-type'
date = 2024-09-05T10:55:27+08:00
lastmod = 2024-09-05T10:55:27+08:00
draft = false
+++

### `cdq`  指令

-   **全称**：Convert Double to Quad
-   **功能**：CDQ指令是汇编语言中的一条指令，用于将双字数据扩展为四字。它先将EDX的每一位设置为EAX的最高位，然后将EDX扩展为EAX的高位，变为64位。这个指令通常在除法运算之前使用。将 EAX 寄存器的符号扩展到 EDX 寄存器，具体来说，如果 EAX 是负数，EDX 会被设置为全 1（即 -1），如果 EAX 是正数，EDX 会被设置为 0。
-   **用途**：在进行有符号除法时，`cdq`  用于准备被除数（在 EAX 中）以便 `div`  指令可以正确处理符号。

### `div`  指令

-   **功能**：执行无符号除法。它将 EDX:EAX 中的值作为被除数，使用指定的操作数作为除数。结果存储在 EAX 中，余数存储在 EDX 中。
-   **语法**：
    
   `div <divisor>` 
    
-   **注意**：在执行 `div`  指令之前，必须确保 EDX 中的值是正确的（通常通过 `cdq`  指令设置）。

eg：

``` asm
mov eax, 10 ; 被除数 
mov ebx, 3 ; 除数 
; 扩展 EAX 到 EDX 
cdq ; EDX = 0 (因为 EAX 是正数)
 ; 执行除法 
div ebx ; EAX = EAX / EBX, EDX = EAX % EBX ; 结果现在在 EAX 中，余数在 EDX 中
```
___

### fld
- **功能**: 将浮点数加载到浮点堆栈（FPU stack）中。
- **语法**:
 ``` asm
  fld m32fp      ; 从内存加载浮点数
  fld st(i)      ; 从浮点堆栈加载
 ```
- **示例**:
 ```asm
  fld dword [var] ; 将内存中的浮点数加载到 ST(0)
 ```

### fadd
- **功能**: 将两个浮点数相加，结果存储在浮点堆栈的顶部。
- **语法**:
 ``` asm
  fadd st(i)     ; 将 ST(0) 和 ST(i) 相加
  fadd m32fp     ; 将 ST(0) 和内存中的浮点数相加
 ```
- **示例**:
 ``` asm
  fadd st(1)     ; 将 ST(0) 和 ST(1) 相加，结果存储在 ST(0)
```

### fstp
- **功能**: 将浮点数从浮点堆栈存储到内存，并弹出堆栈顶部的值。
- **语法**:
``` asm
  fstp m32fp     ; 将 ST(0) 存储到内存并弹出
```
- **示例**:
``` asm
  fstp dword [var] ; 将 ST(0) 的值存储到内存并弹出
 ```

### 示例代码
以下是一个简单的示例，展示如何使用这些指令进行浮点数加法：
``` asm
section .data
    num1 dd 1.5        ; 第一个浮点数
    num2 dd 2.5        ; 第二个浮点数
    result dd 0.0      ; 存储结果的变量

section .text
global _start

_start:
    fld dword [num1]   ; 加载 num1 到 ST(0)
    fld dword [num2]   ; 加载 num2 到 ST(0)，num1 变为 ST(1)
    fadd st(1)         ; ST(0) + ST(1)，结果在 ST(0)
    fstp dword [result]; 将结果存储到 result，并弹出 ST(0)
```

### 说明
- 这段代码将两个浮点数相加，并将结果存储到指定的内存位置。`fld` 用于加载浮点数，`fadd` 用于执行加法，`fstp` 用于存储结果并清理堆栈。

