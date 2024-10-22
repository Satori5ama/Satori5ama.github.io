+++
categories = ['笔记']
tags = ['Crypto']
title = '[Crypto]整数的阶和原根'
slug = 'Order-of-an-Integer-and-Primitive-Root'
date = 2024-10-21T07:55:27+08:00
lastmod = 2024-10-21T07:55:27+08:00
draft = false
+++

> 你说的对，但是感觉不如原根。原根，是一个数学符号。设m是正整数，a是整数，若a模m的阶等于φ(m)，则称a为模m的一个原根。假设一个数g是P的原根，那么g^imodP的结果两两不同，且有1<g<P，0<i<P，归根到底就是g^(P-1)=1(modP)当且仅当指数为P-1的时候成立。(这里P是素数)。你的数学很差，我现在每天用原根都能做1e5次数据规模1e6的NTT，每个月差不多3e6次卷积，也就是现实生活中3e18次乘法运算，换算过来最少也要算1000年。虽然我只有14岁，但是已经超越了中国绝大多数人(包括你)的水平，这便是原根给我的资本

因为ppt没发，所以以下内容部分参考自[oiwiki](https://oi-wiki.org/math/number-theory/primitive-root/)


## 整数的阶

由欧拉定理可知，对 $a \in \mathbb{Z}, m \in \mathbb{N}^*, $ 若 $(a, m) = 1$，则 $a^{\varphi(m)} \equiv 1 \ (\text{mod} \ m)$。
因此满足同余式 $a^n \equiv 1 \ (\text{mod} \ m)$ 的最小正整数 $n$ 存在，这个 $n$ 称作 $a$ 模 $m$ 的阶，记作 $\delta_m(a)$ 或 $\text{ord}_m(a)$。

### 性质

1. $a, a^2, \cdots, a^{\delta_m(a)}$ 模 $m$ 两两不同余。
2. 设 $m \in \mathbb{N}^*, a, b \in \mathbb{Z}, (a, m) = (b, m) = 1$，则 $\delta_m(ab) = \delta_m(a) \delta_m(b)$ 的充要条件是 $( \delta_m(a), \delta_m(b) ) = 1$
3. 若 $a^n \equiv 1 \ (\text{mod} \ m)$，则 $\delta_m(a) \mid n$。特别地，**有$\delta_m(a) | \varphi(m)$**
4. **设 $k \in \mathbb{N}, m \in \mathbb{N}^*, (a, m) = 1$，则 $\delta_m(a^k) = \frac{\delta_m(a)} {(\delta_m(a), k)}$​。**
5. **若$n|m$，则$\delta_n(a)|\delta_m(a)$。**
6. **设$m = \sum_{i=1}^{s}b_i$，这里$b_i$两两互素，记$\delta_{b_i}(a)=f_i(i=1,2,...,s)$，则$\delta_m(a)=[f_1,f_2,...,f_s]$。**



## 原根

设 $m \in \mathbb{N}^* , g \in \mathbb{Z}$。若 $(g, m) = 1$，且 $\delta_m(g) = \varphi(m)$，则称 $g$ 为模 $m$ 的原根，简称 $m$ 的原根
即 $g$ 满足 $\delta_m(g) = |\mathbb{Z}_m^*| = \varphi(m)$。当 $m$ 是质数时，我们有 $g^i \mod m, 0 < i < m$​ 的结果互不相同。

### 原根判定定理

设 $m \geqslant 3, (g, m) = 1$，则 $g$ 是模 $m$ 的原根的充要条件是，对于 $\varphi(m)$ 的每个素因数 $p$，都有
$$g^{\frac{\varphi(m)}{p}} \not\equiv 1 \ (\text{mod} \ m).$$

### 原根个数

若一个数 $m$ 有原根，则它原根的个数为 $\varphi(\varphi(m))$。

### 原根存在定理

一个数 $m$ 存在原根当且仅当 $m = 2, 4, p^\alpha, 2p^\alpha$，其中 $p$ 为奇素数，$\alpha \in \mathbb{N}^*$​​。

设 $p$ 原根为 $g$ ，

- 当 $m = p^\alpha$ 时，其原根 $g_1$ 为 $g$（$g^{p-1} \not\equiv 1 (\text{mod} \ m)$）或 $g+p$ （ $g^{p-1} \equiv 1(\text{mod} \ p^2)$ ）
- 当 $m = 2p^\alpha$ 时，其原根 $g_2$ 为 $g_1$（ $g_1$ 为奇数）或 $g_1+p^\alpha$ （ $g_1$ 为偶数 ）

### 素数原根计算

求整数$p^\alpha$的原根，关键在于求出奇素数 $p$ 的原根。$p$ 的原根可以使用原根判定定理枚举求出。

计算满足如下条件的$p$​原根是容易的：

- $p=2q+1$
- $p=2^aq^b+1$
- $p=2^aq_1q_2...q_k+1$​

形如的 $2q+1$ 素数称为Sophie Germain 素数, 也称为安全素数 

一个长度为 $\ell $ 比特随机整数是Sophie Germain素数的概率 是$\Omega(1/\ell^2)$。只要随机的选取 $\ell $ 比特的整数，利用标准的素数判定方法进行判定,很快就会得到需要的素数

在密码应用中，通常需要产生一个1024二进制位素数的原根。原根产生算法：

1. 利用素性验证算法，生成一个大素数 $q$；
2. 令 $p = q \times 2 + 1$；
3. 利用素性验证算法，验证 $p$ 是否是素数。如果 $p$ 是合数，则跳转到 P1；
4. 生成一个随机数 $g$， $1 < g < p - 1$；
5. 验证 $g^2 \mod p$ 和 $g^q \mod p$ 都不等于 1，否则跳转到 P4；
6. $g$ 是大素数 $p$ 的原根。







