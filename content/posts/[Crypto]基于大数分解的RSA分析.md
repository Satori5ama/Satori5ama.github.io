+++
categories = ['笔记']
tags = ['Crypto']
title = '[Crypto]基于大数分解的RSA分析'
slug = 'RSA-Analysis'
date = 2024-10-08T07:55:27+08:00
lastmod = 2024-10-08T07:55:27+08:00
draft = false
+++

密码课乱写的笔记。

## 1. Fermat 方法(|p-q|较小)

由 

$$
\frac{(p + q)^2}{4} - n = \frac{(p - q)^2}{4} - pq
$$

如果 $|p - q|$ 小，则 

$$
\frac{(p - q)^2}{4} \text{也小，因此} \frac{(p + q)^2}{4} \text{稍大于} n, \frac{(p + q)}{2}\text{稍大于} \sqrt{n}
$$

可得 $n$ 的如下分解步骤：

1. 顺序检查大于 $\sqrt{n}$ 的每一整数 $x$，直到找到一个 $x$ 使得 $x^2 - n$ 是某一整数（记为 $y$）的平方。
2. 由 $x^2 - n = y^2$，得 $n = (x + y)(x - y)$。

``` python
    def fermat_factorization(N, e, ciphertext):
    a = math.isqrt(N) + 1
    b2 = a * a - N
    while not is_perfect_square(b2):
        a += 1
        b2 = a * a - N
    b = math.isqrt(b2)
    p = a - b
    q = a + b
    return p, q
```

## 2. Pollard rho 方法

[分解质因数 - OI Wiki (oi-wiki.org)](https://oi-wiki.org/math/number-theory/pollard-rho/)

采用了生日攻击的原理：即在随机选择 $p^{1/2}$ 个数里面，大概率（约 40%）会有两个数的差是 $p$ 的倍数。

这是一种随机化算法。假设要找的因子为 $p$，随机取 $x_1$，由 $x_n$ 构造 $x_{n+1} = f(x_n) = x_n^2 + a$，使得 $p$ 整除 $x_n - x_{n+1}$ 且 $x_n - x_{n+1}$ 不能整除 $n$，则有：

$$
p = \gcd(x_n, x_{n+1}, n)
$$

``` python
# 代码基于oi-wiki的Pollard-Rho算法的Python实现，稍作修改
from random import randint
from math import gcd
def f(x,c,n):
    return (x*x+c)%n
def Pollard_Rho(x):
    c = randint(1, x - 1)
    s = t = f(0, c, x)
    goal = val = 1
    while True:
        for step in range(1, goal + 1):
            t = f(t, c, x)
            val = val * abs(t - s) % x
            if val == 0:
                return x  # 如果 val 为 0，退出重新分解
            if step % 127 == 0:
                d = gcd(val, x)
                if d > 1:
                    return d,x//d
        d = gcd(val, x)
        if d > 1:
            return d,x//d
        s = t
        goal <<= 1
        val = 1
```

## 3. Pollard rho p-1 方法(p-1或q-1没有较大素因子)

如果 $p-1$ 没有大的素数因子，则存在一个不是很大的数 $B$ 满足 $p-1 \mid B!$。

因此，存在 $\gcd(a, p) = 1$，且 $a^{p-1} - 1 \mid a^{B!} - 1$。由于 $a^{p-1} \equiv 1 \ (\text{mod} \ p)$，所以很大概率具有：

$$(n, a^{B!} - 1) = (n, a^{p-1} - 1) = p$$

**步骤：**

给定：整数 $n$（已知是合数）。

目标：找到一个因子 $d \mid n$。

步骤：

0) 固定整数 $B$。

1) 选择一个整数 $k$，$k$ 是大部分（或者全部）$b$ 的乘积满足 $b \leq B$；例如 $k = B!$。

2) 选择一个随机整数 $a$ 满足 \$2 \leq a \leq n - 2$。

3) 计算 $r = a^k \mod n$。

4) 计算 $d = \gcd(r - 1, n)$。

5) 如果 $d = 1$ 或者 $d = n$，回到步骤 1。否则，$d$ 就是要找的因子。

``` python
from random import randint
from math import gcd
from math import isqrt
def pollards_p_minus_1(N, B):
    # 选择随机的初始值
    a = randint(2, N - 1)
    M = 1
    # 进行 B 次迭代
    for j in range(2, B + 1):
        M *= j   
    a = pow(a, M, N)  # a^M mod N
    # 计算 d
    d = gcd(a - 1, N)
    if d == 1 or d == N:
        return None,None  # 没有找到因子
    return d,N//d
def crack(N):
    B = 2
    j = 3
    p = None
    while(p == None):
        p,q = pollards_p_minus_1(N, B)
        B *= j
        j += 1
    return p,q
```

## 4. 共模攻击


设两个用户的公开钥分别为 $e_1$ 和 $e_2$，且 $e_1$ 和 $e_2$ 互素（一般情况都成立）。明文消息为 $m$，密文分别为：

$$
c_1 \equiv m^{e_1} \mod n
$$
$$
c_2 \equiv m^{e_2} \mod n
$$

截获 $c_1$ 和 $c_2$ 后，可以如下恢复 $m$：

1. 使用扩展欧几里得算法求出满足 $re_1 + se_2 = 1$ 的两个整数 $r$ 和 $s$，其中一个为负，设为 $r$。
2. 再次使用扩展欧几里得算法求出 $c_1^{-1}$。
3. 由此得出：
   $$
   (c_1^{-1}) \cdot c_2^{-r} \equiv m \mod n
   $$

这样，就可以恢复出明文消息 $m$。

``` python 
def gcd_extended(a, b):
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = gcd_extended(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y
def common_modulus_attack(N, e1, c1, e2, c2):
    gcd, d1, d2 = gcd_extended(e1, e2)
    m1 = pow(c1, d1, N)
    m2 = pow(c2, d2, N)
    return m1, m2

# main
# ...
if N1 == N2: 
    m1, m2 = common_modulus_attack(N1, e1, c1, e2, c2)
else:
    print("模数不相同")
m = m1 * m2 % N1
print("明文:", m)
# ...
```

## 5. RSA低指数攻击（中国剩余定理）

假定用RSA算法加密同一消息 $m$ 发给 3 个用户，而每个用户的公钥都选择 3。用户的模数分别为 $n_i$ (i=1,2,3)。当 $i \neq j$ 时，$\gcd(n_i, n_j) = 1$，否则通过 $\gcd(n_i, n_j)$ 可分解 $n_i$ 和 $n_j$。

设明文消息是 $m$，密文分别为：

$$
c_1 \equiv m^3 \mod n_1
$$

$$
c_2 \equiv m^3 \mod n_2
$$

$$
c_3 \equiv m^3 \mod n_3
$$

由中国剩余定理可求出：

$$
m^3 \mod (n_1 n_2 n_3)
$$

``` python
def exgcd(a, b):
    if b == 0:
        x = 1
        y = 0
        return x, y
    x1, y1 = exgcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return x, y
def CRT(k, a, r):
    n = 1
    ans = 0
    for i in range(k):
        n = n * r[i]
    for i in range(k):
        m = n // r[i]
        b, _ = exgcd(m, r[i])  
        ans = (ans + a[i] * m * b % n) % n
    return (ans % n + n) % n

# read_hex_file,write_file为自定义文件IO函数
# main
filename = ["Frame3","Frame8","Frame12","Frame16","Frame20"]
N = []
e = []
c = []
for i in range(len(filename)):
    Nt, et, ct = read_hex_file(filename[i])
    N.append(Nt)
    e.append(et)
    c.append(ct)
for i in range(1,len(e)):
    if e[i] != e[i-1]:
        print("公钥不相同")
        sys.exit();
m = CRT(len(filename),c, N)
m = iroot(m, e[0])
write_file(m[0])
```

