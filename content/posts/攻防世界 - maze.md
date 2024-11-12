+++
categories = ['题解']
tags = ['Reverse']
title = '攻防世界 - maze'
slug = 'adworld-maze'
date = 2024-11-12T08:55:27+08:00
lastmod = 2024-11-12T08:55:27+08:00
draft = false
+++

查壳，64位elf，无壳。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image002.png)

进入main函数。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image004.png)

伪代码：

``` c
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  __int64 v3; // rbx
  int v4; // eax
  bool v5; // bp
  bool v6; // al
  const char *v7; // rdi
  int v9; // [rsp+0h] [rbp-28h] BYREF
  int v10[9]; // [rsp+4h] [rbp-24h] BYREF

  v10[0] = 0;
  v9 = 0;
  puts("Input flag:");
  scanf("%s", &s1);
  if ( strlen(&s1) != 24 || strncmp(&s1, "nctf{", 5uLL) || *(&byte_6010BF + 24) != 125 )
  {
LABEL_22:
    puts("Wrong flag!");
    exit(-1);
  }
  v3 = 5LL;
  if ( strlen(&s1) - 1 > 5 )
  {
    while ( 1 )
    {
      v4 = *(&s1 + v3);
      v5 = 0;
      if ( v4 > 78 )
      {
        if ( (unsigned __int8)v4 == 79 )
        {
          v6 = sub_400650(v10);
          goto LABEL_14;
        }
        if ( (unsigned __int8)v4 == 111 )
        {
          v6 = sub_400660(v10);
          goto LABEL_14;
        }
      }
      else
      {
        if ( (unsigned __int8)v4 == 46 )
        {
          v6 = sub_400670(&v9);
          goto LABEL_14;
        }
        if ( (unsigned __int8)v4 == 48 )
        {
          v6 = sub_400680(&v9);
LABEL_14:
          v5 = v6;
        }
      }
      if ( !(unsigned __int8)sub_400690((__int64)asc_601060, v10[0], v9) )
        goto LABEL_22;
      if ( ++v3 >= strlen(&s1) - 1 )
      {
        if ( v5 )
          break;
LABEL_20:
        v7 = "Wrong flag!";
        goto LABEL_21;
      }
    }
  }
  if ( asc_601060[8 * v9 + v10[0]] != 35 )
    goto LABEL_20;
  v7 = "Congratulations!";
LABEL_21:
  puts(v7);
  return 0LL;
}
```

观察第一段，可以发现flag形式为nctf{开头，长度为24，结尾为}的字符串。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image006.jpg)

继续阅读，发现程序遍历了字符串{}以内的内容，且当当前位置为O，o，.，0时进入不同的子程序。而当循环结束，最后一次执行子程序返回值不为0时正常跳出循环，否则报错。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image008.jpg)

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image010.png)

然后是四个操作子函数的内容。

sub_400650是自减v10，返回值判断v10是否大于0。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image012.png)

sub_400660是自增v10，返回值判断v10是否小于8

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image014.png)

sub_406670和sub_406680和上面两个函数是相同的，只是操作数变成了v9。

对于sub_400690，我们阅读子程序

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image016.png)

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image018.png)

发现其效果时判断asc_601060[8*v9+v10]是否等于空格或#号，若均不是则报错。

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image020.png)

循环外的这段代码判断asc_601060[8*v9+v10]是否等于#号，若不是则报错

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image022.png)

因此，在循环过程中 $8 * v9 + v10$ 的所有合法取值为$0,1,9,10,11,13,14,19,21,26,27,29,33,34,36,37,38,42,46,50,51,52,53,54$，而最终要求$8*v9+v10 == 36$，且约束$0<v9<8,0<v10<8$，因此可以猜测$v9=4, v10=44$,

在以上取值中构造出合法序列nctf{o0oo00O000oooo..OO}（过程可以通过调试辅助进行）

![img](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/reverse/clip_image024.png)

获得flag：nctf{o0oo00O000oooo..OO}

复盘发现，这个问题其实是一个迷宫问题：

[迷宫问题 - CTF Wiki](https://ctf-wiki.org/reverse/maze/maze/)

题目给出的asc_601060是一个8*8的迷宫，我们输入的应该是’.',‘0’,‘o’,‘O’,并以此来确定上下左右移动

![maze](https://adworld.xctf.org.cn/media/uploads/writeup/a85dd40b-a538-4ead-8ee2-74e2a7e39cdf5851.png#toolbar=0)

