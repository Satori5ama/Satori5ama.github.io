+++
categories = ['题解']
tags = ['Reverse']
title = 'XCTF - 我不是病毒2.0'
slug = 'XCTF-I-am-not-a-virus'
date = 2024-12-23T08:55:27+08:00
lastmod = 2024-12-23T08:55:27+08:00
draft = true

+++

直接分析exe的话，可以发现关键的逻辑集中在main函数最后return的那个函数中，在sub_140005C80函数中会创建一个进程（要是找不到这个函数的话，先关闭地址随机化，或者自行分析），附加调试之后可以发现这个进程就是python310.dll，所以初步判断这个程序是python打包的exe。也可以直接用exeinfope查出来

![image-20230415145746215](file:///C:/Users/12423/AppData/Local/Temp/msohtmlclip1/01/clip_image002.jpg)

用pyinstxtractor.py直接解包，可以发现有.pyz这样的文件和PYZ-00.pyz_extracted这个文件夹，而且后者中的所有文件都是加密过的

可以看到“archive.pyc就是加密的过程，crypto_key是加密的密钥，而我们需要解密.pyz文件”

 

所以分别反编译两个文件，可以找到CRYPT_BLOCK_SIZE = 16，加密方式是AES，加密密钥是HelloHiHowAreYou

编写解密脚本

import tinyaes

import zlib

 

CRYPT_BLOCK_SIZE = 16

 

\# 从crypt_key.pyc获取key，也可自行反编译获取

key = bytes('HelloHiHowAreYou', 'utf-8')

 

inf = open('sign.pyc.encrypted', 'rb') # 打开加密文件

outf = open('sign.pyc', 'wb') # 输出文件

 

\# 按加密块大小进行读取

iv = inf.read(CRYPT_BLOCK_SIZE)

 

cipher = tinyaes.AES(key, iv)

 

\# 解密

plaintext = zlib.decompress(cipher.CTR_xcrypt_buffer(inf.read()))

 

\# 补pyc头(最后自己补也行)

 

outf.write(b'\x6F\x0D\x0D\x0A\x00\x00\x00\x00\x70\x79\x69\x30\x10\x01\x00\x00')

 

\# 写入解密数据

outf.write(plaintext)

 

inf.close()

outf.close()

在解包后的文件夹中有个1kb的main.pyc，用pycdc反编译后发现是调用了sign中的main函数

 

image-20230415145339614

image-20230415145339614

 

所以找到了sign.pyc.encrypted文件，解密后

 

import hashlib as 沈阳

import base64 as 杭州

import ctypes as 蚌埠

 

def main():

  蚌埠.windll.kernel32.VirtualAlloc.restype = 蚌埠.c_void_p

  福建 = input('%e6%82%a8%e7%9a%84%e8%be%93%e5%85%a5%ef%bc%9a')

​         \#您的输入：

  天津 = '9K98jTmDKCXlg9E2kepX4nAi8H0DB57IU57ybV37xjrw2zutw+KnxkoYur3IZzi2ep5tDC6jimCJ7fDpgQ5F3fJu4wHA0LVq9FALbjXN6nMy57KrU8DEloh+Cji3ED3eEl5YWAyb8ktBoyoOkL1c9ASWUPBniHmD7RSqWcNkykt/USjhft9+aV930Jl5VjD6qcXyZTfjnY5MH3u22O9NBEXLj3Y9N5VjEgF2cFJ+Tq7jj92iIlEkNvx8Jl+eH5/hipsonKLTnoLGXs4a0tTQX/uXQOTMBbtd70x04w1Pa0fp+vA9tCw+DXvXj0xmX8c5HMybhpPrwQYDonx7xtS+vRIj/OmU7GxkHOOqYdsGmGdTjTAUEBvZtinOxuR7mZ0r9k+c9da0W93TWm5+2LKNR6OJjmILaJn0lq4foYcfD5+JITDsOD6Vg01yLRG1B4A6OxJ7Rr/DBUabSu2fYf1c4sTFvWgfMV8il6QfJiNMGkVLey1cBPSobenMo+TQC1Ql0//9M4P01sOiwuuVKLvTyDEv6dKO//muVL9S2gq/aZUBWkjj/I5rUJ6Mlt4+jsngmuke9plAjw22fUgz+8uSzn40dhKXfBX/BOCnlwWsMGAefAfoz/XAsoVSG2ioLFmlcYe/WBgaUJEoRUSyv73yiEOTVwIK6EPnDlwRgZZHx2toLu8udpEZ0aKGkex5sn7P8Jf9AbD4/EiQU+FdoJSxGorPSZGvrc4='

  北京 = 沈阳.md5('%e4%ba%91%e5%8d%97'.encode('utf-8')).hexdigest()

​          \#云南

  重庆 = 杭州.b64decode(天津)

  河南 = b''

  北京_len = len(北京)

  广州 = list(range(256))

  j = 0

  \#初始化s盒

  for i in range(256):

​    j = (j + 广州[i] + ord(北京[i % 北京_len])) % 256

​    广州[i] = 广州[j]      #直接用在线网站反编译出来的这个交换有问题，应该改为 广州[i], 广州[j] = 广州[j], 广州[i]

​    广州[j] = 广州[i]

  山东 = 陕西 = 0

 

  for 河北 in 重庆:

​    山东 = (山东 + 1) % 256

​    陕西 = (陕西 + 广州[山东]) % 256

​    广州[山东] = 广州[陕西]#同上

​    广州[陕西] = 广州[山东]

​    河南 += bytes([

​      河北 ^ 广州[(广州[山东] + 广州[陕西]) % 256]])

 

  四川 = 蚌埠.create_string_buffer(福建.encode())

 

  黑龙江 = 蚌埠.windll.kernel32.VirtualAlloc(蚌埠.c_int(0), 蚌埠.c_int(len(河南)), 蚌埠.c_int(12288), 蚌埠.c_int(64))

  蚌埠.windll.kernel32.RtlMoveMemory(蚌埠.c_void_p(黑龙江), (蚌埠.c_ubyte * len(河南)).from_buffer(bytearray(河南)), 蚌埠.c_size_t(len(河南)))

  辽宁 = 蚌埠.windll.kernel32.CreateThread(蚌埠.c_int(0), 

​                    蚌埠.c_int(0), 

​                    蚌埠.c_void_p(黑龙江), #执行的代码

​                    蚌埠.byref(四川),   #参数w

​                    蚌埠.c_int(0), 

​                    蚌埠.pointer(蚌埠.c_int(0)))

  蚌埠.windll.kernel32.WaitForSingleObject(蚌埠.c_int(辽宁), 蚌埠.c_int(-1))

  if 四川.raw == b'%db%1b%00Dy\\C%cc%90_%ca.%b0%b7m%ab%11%9b^h%90%1bl%19%01%0c%eduP6%0c0%7f%c5E-L%b0%fb%ba%f6%9f%00':

​    

​    print('%e6%98%af%e7%9a%84%ef%bc%81%e4%bd%a0%e5%be%97%e5%88%b0%e4%ba%86%ef%bc%81')

​    \#是的！你得到了！

​    return None

  None('%e4%b8%8d%ef%bc%8c%e5%86%8d%e5%b0%9d%e8%af%95%e6%9b%b4%e5%a4%9a%e3%80%82 %ef%bc%88%e7%ac%91%e8%84%b8%e7%ac%a6%e5%8f%b7%ef%bc%89')

  \#不，再尝试更多。 （笑脸符号）

if __name__ == '__main__':

  

  main()

 

变量名应该是被特地修改，降低可读性的，汉字也都经过了URL编码，不过整体逻辑很好理解

先用密钥初始化RC4的S盒，然后RC4解密shellcode，加载shellcode对输入进行处理

解密shellcode

from Crypto.Cipher import ARC4

import base64

import hashlib

 

cipher = '9K98jTmDKCXlg9E2kepX4nAi8H0DB57IU57ybV37xjrw2zutw+KnxkoYur3IZzi2ep5tDC6jimCJ7fDpgQ5F3fJu4wHA0LVq9FALbjXN6nMy57KrU8DEloh+Cji3ED3eEl5YWAyb8ktBoyoOkL1c9ASWUPBniHmD7RSqWcNkykt/USjhft9+aV930Jl5VjD6qcXyZTfjnY5MH3u22O9NBEXLj3Y9N5VjEgF2cFJ+Tq7jj92iIlEkNvx8Jl+eH5/hipsonKLTnoLGXs4a0tTQX/uXQOTMBbtd70x04w1Pa0fp+vA9tCw+DXvXj0xmX8c5HMybhpPrwQYDonx7xtS+vRIj/OmU7GxkHOOqYdsGmGdTjTAUEBvZtinOxuR7mZ0r9k+c9da0W93TWm5+2LKNR6OJjmILaJn0lq4foYcfD5+JITDsOD6Vg01yLRG1B4A6OxJ7Rr/DBUabSu2fYf1c4sTFvWgfMV8il6QfJiNMGkVLey1cBPSobenMo+TQC1Ql0//9M4P01sOiwuuVKLvTyDEv6dKO//muVL9S2gq/aZUBWkjj/I5rUJ6Mlt4+jsngmuke9plAjw22fUgz+8uSzn40dhKXfBX/BOCnlwWsMGAefAfoz/XAsoVSG2ioLFmlcYe/WBgaUJEoRUSyv73yiEOTVwIK6EPnDlwRgZZHx2toLu8udpEZ0aKGkex5sn7P8Jf9AbD4/EiQU+FdoJSxGorPSZGvrc4='

 

cipher = bytes(cipher.encode('utf-8'))

 

arr = base64.b64decode(cipher)  

 

key = hashlib.md5('云南'.encode('utf-8')).hexdigest()

 

key = bytes(key.encode('utf-8'))

 

cipher = ARC4.new(key)

 

p = cipher.decrypt(bytes(arr))

 

print(list(p))

 

然后用函数指针加载shellcode

\#include <cstdio>

\#include <Windows.h>

 

unsigned char shellcode[] = {

​    81, 232, 0, 0, 0, 0, 89, 72, 129, 193, 97, 1, 0, 0, 85, 72, 137, 229, 72, 131, 236, 104, 72, 137, 77, 152, 199, 69, 252, 0, 0, 0, 0, 233, 49, 1, 0, 0, 139, 69, 252, 193, 224, 4, 72, 152, 72, 139, 85, 152, 72, 1, 208, 72, 137, 69, 240, 72, 184, 1, 219, 186, 51, 35, 1, 219, 186, 72, 137, 69, 160, 72, 184, 255, 238, 221, 204, 187, 170, 153, 136, 72, 137, 69, 168, 72, 184, 239, 205, 171, 144, 120, 86, 52, 18, 72, 137, 69, 176, 72, 184, 186, 220, 254, 33, 67, 101, 135, 9, 72, 137, 69, 184, 72, 139, 69, 240, 72, 139, 0, 72, 137, 69, 232, 72, 139, 69, 240, 72, 139, 64, 8, 72, 137, 69, 224, 72, 184, 192, 187, 111, 171, 119, 3, 124, 235, 72, 137, 69, 216, 72, 184, 239, 190, 173, 222, 13, 240, 173, 11, 72, 137, 69, 208, 72, 199, 69, 200, 0, 0, 0, 0, 235, 127, 72, 139, 69, 232, 72, 193, 224, 8, 72, 137, 194, 72, 139, 69, 176, 72, 1, 194, 72, 139, 77, 232, 72, 139, 69, 216, 72, 1, 200, 72, 49, 194, 72, 139, 69, 232, 72, 193, 232, 10, 72, 137, 193, 72, 139, 69, 184, 72, 1, 200, 72, 49, 208, 72, 41, 69, 224, 72, 139, 69, 224, 72, 193, 224, 8, 72, 137, 194, 72, 139, 69, 160, 72, 1, 194, 72, 139, 77, 216, 72, 139, 69, 224, 72, 1, 200, 72, 49, 194, 72, 139, 69, 224, 72, 193, 232, 10, 72, 137, 193, 72, 139, 69, 168, 72, 1, 200, 72, 49, 208, 72, 41, 69, 232, 72, 139, 69, 208, 72, 41, 69, 216, 72, 131, 69, 200, 1, 72, 131, 125, 200, 63, 15, 134, 118, 255, 255, 255, 72, 139, 69, 240, 72, 139, 85, 232, 72, 137, 16, 72, 139, 69, 240, 72, 131, 192, 8, 72, 139, 85, 224, 72, 137, 16, 144, 131, 69, 252, 1, 131, 125, 252, 11, 15, 142, 197, 254, 255, 255, 72, 131, 196, 104, 93, 89, 19, 45, 239, 197, 133, 72, 183, 185, 107, 151, 30, 51, 174, 0, 39, 61, 1, 135, 228, 208, 161, 110, 65, 89, 91, 206, 249, 238, 144, 92, 65, 174, 91, 6, 4, 186, 214, 131, 243, 10, 63, 162, 60, 255, 167, 103, 240, 110, 13, 2, 131, 222, 224, 175, 5, 27, 91, 21, 4, 55, 133, 233, 252, 61, 193, 245, 231, 61, 59, 227, 129, 22, 225, 192, 43, 104, 237, 12, 203, 161, 134, 59, 150, 195, 7, 3, 233, 200, 247, 163, 104, 183, 40, 98, 202, 104, 230, 204, 147, 157, 65, 66, 119, 147, 46, 155, 235, 94, 213, 116, 152, 199, 174, 139, 97, 102, 248, 253, 19, 93, 75, 41, 40, 251, 201, 193, 54, 64, 13, 26, 20, 145, 20, 125, 35, 174, 155, 130, 10, 139, 197, 132, 41, 205, 74, 219, 102, 67, 16, 221, 44, 3, 204, 94, 136, 122, 119, 231, 48, 112, 43, 57, 105, 91, 184, 10, 128, 33, 1, 73, 52, 164, 22, 59, 254, 165, 105, 223, 237, 58, 180, 94, 129, 143, 114, 73, 61, 210, 121, 123, 115, 85

};

 

int main() {

​    PVOID p = VirtualAlloc(NULL, sizeof(shellcode), MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);

​    if (p == NULL) {

​       return -1;

​    }

​    memcpy(p, shellcode, sizeof(shellcode));

​    ((void(__stdcall*)())(p))();

​    return 0;

}

用IDA分析得到的exe

第一段shellcode可以分为两个部分，在0x167之前都是对后面部分的SMC，先动态调试，得到解密后的shellcode之后再复制写入ida

 ![image-20230401213737097](file:///C:/Users/12423/AppData/Local/Temp/msohtmlclip1/01/clip_image004.jpg)

ida_bytes.patch_bytes（要写入的地址，bytes.fromhex（“解密后的二进制shellcode”））

可以得到真正的加密函数

 ![image-20230401213934268](file:///C:/Users/12423/AppData/Local/Temp/msohtmlclip1/01/clip_image006.jpg)

加密主要是将输入中的两个字符拼接在一起然后加密，直接爆破

\#include <iostream>

using namespace std;

int cipher[] = { 219, 27, 0, 68, 121, 92, 67, 204, 144, 95, 202, 46, 176, 183, 109, 171, 17, 155, 94, 104, 144, 27, 108, 25, 1, 12, 237, 117, 80, 54, 12, 48, 127, 197, 69, 45, 76, 176, 251, 186, 246, 159, 0 };

int main() {

​    for (int i = 0; i <= 20; i++) {

​       unsigned int code = cipher[2 * i] + (cipher[i * 2 + 1] << 8);

​       for (int j = 0; j < 127; j++) {

​           for (int k = 0; k < 127; k++) {

​              unsigned int v8 = 2029;

​              unsigned int v9 = (j + (k << 8) % 0xD1EF);

​              unsigned int v6 = 1;

​              while (v8) {

​                  if (v8 & 1) {

​                     v6 = v9 * v6 % 0xD1EF;

​                  }

​                  v9 = v9 * v9 % 0xD1EF;

​                  v8 >>= 1;

​              }

​              if (v6 == code) {

​                  printf("%c%c", j, k);

​                  break;

​              }

​           }

​       }

​    }

​    return 0;

}

 

//XCTF{5c7ad71b-6c91-4481-af7a-69726a66aea8}