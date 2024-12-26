+++
categories = ['题解']
tags = ['Reverse']
title = 'CISCN2024初赛re部分Wp'
slug = 'ciscn-wp'
date = 2024-12-18T08:55:27+08:00
lastmod = 2024-12-18T08:55:27+08:00
draft = true

+++

省流：糖丸了。

# ezCsky

> 某个新能源汽车使用了国产的交叉编译链对tbox的固件程序进行了编译，你能通过逆向发现其中的秘密吗？

诶，IDA怎么打不开？什么叫mcore.dll is not included?

啊？mcore是Motorola的芯片？

> mCore是一个易于使用的主控板是专门设计用于mbot。基于Arduino Uno、电集成各种机载传感器，如蜂鸣器、光传感器、RGB LED等。

好像也对，忘记看题目了，这玩意是个固件程序。

去github上下了个IDA的mcore模块。

[MotoFanRu/M-CORE_IDA-Pro: M·CORE processor support module for IDA Pro](https://github.com/MotoFanRu/M-CORE_IDA-Pro)

总算打开了，但是无法F5。没办法，硬读RISC指令集

好在左边函数名给出了提示，很明显这道题里有一个RC4加密。还有一个xor函数（这个在main函数中并没有找到），有可能还有一个xor加密。

![1734483313693](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734483313693.png)

进数据区查看几个偏移量的内容，可以很快找到疑似密文串。

![1734483433255](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734483433255.png)

然后找密钥的时候犯了大唐，

![1734483765529](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734483765529.png)

找密钥的时候找到`$d_13`，但是把0x74657374拿去试却得不出结果，赛后发现后面的`dword_895C`也是密钥的一部分。

![1734484038661](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734484038661.png)

（不仔细看代码的下场）

![1734484240025](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734484240025.png)

转字符串后发现密钥就是`testkey`。

然而发现RC4解不出有意义的串，说明很可能还有一层xor加密。

![1734485635056](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734485635056.png)

尝试用前5个字节看看密钥，

![1734485702181](https://cdn.jsdmirror.com/gh/Satori5ama/Figurebed@main/img/a29c66ec0d8b97583100eea594700a7c/1734485702181.png)

发现密钥其实就是flag左偏移一个字节，实际上就是每个字节异或下一个字节。

因此，我们对RC4解密后的串做异或解密，exp：

``` python
if __name__ == "__main__":
    hex_input = "0a0d061c1f545653575100031d14585603191c0054034b14580702494c020701510c0800010003004f7d"
    s = list(bytes.fromhex(hex_input))
    slen= len(s)
    for i in range(1,slen):
        s[slen - i - 1] = s[slen - i - 1] ^ s[slen - i]
    for i in range(0,len(s)):
        s[i] = chr(s[i])
    print(str(s)[1:-1].replace("'",'').replace(', ',''))
```

得到`flag{d0f5b330-9a74-11ef-9afd-acde48001122}`



