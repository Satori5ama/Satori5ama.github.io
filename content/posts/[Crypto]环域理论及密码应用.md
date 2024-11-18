+++
categories = ['笔记']
tags = ['Crypto']
title = '[Crypto]环域理论及密码应用'
slug = 'Ring-Theory-and-Its-Applications-in-Cryptography'
date = 2024-11-18T07:55:27+08:00
lastmod = 2024-11-18T07:55:27+08:00
draft = false

+++

## 1. 环的定义

### 定义15.1.1

设$G$是一个非空集合，$\cdot$是$G$上的一个代数运算，如果该运算满足结合律: $\forall a, b, c \in G$, $(a \cdot b) \cdot c = a \cdot (b \cdot c)$，则称 $(G, \cdot)$ 为一个半群 (Semigroup)

#### 例1

$$\left(Z_n, \otimes\right) \text{是半群。}$$

#### 例2

整数集合 $Z$关于乘法运算构成半群。

### 定义15.1.2

设 $R$ 是一个非空集合，如果在 $R$ 中定义了两个代数运算 $+$ 和 $\cdot$，并且两个代数运算满足：

(1) $(R, +)$ 为一个交换群；

(2) $(R, \cdot)$ 为一个半群；

(3) 对任意 $x, y, z \in R$，双边分配律成立

$$\begin{align*}
& x \cdot (y + z) = x \cdot y + x \cdot z \\
& (y + z) \cdot x = y \cdot x + z \cdot x
\end{align*}$$

则称 $(R, +, \cdot)$ 为一个环 (Ring)。

注：为了方便起见，通常记 $xy = x \cdot y$​

- 环中加法单位元称为零元，通常记为 $0$；环中元素 $a$ 关于加法逆元记为 $-a$，一般记 $a - b = a + (-b)$。
- 环包含的元素个数称为环的阶。
- 环关于乘法可能没有单位元，如全体偶数构成环，如果环关于乘法有单位元，则就称为环的单位元，通常记为 $1$。环中元素 $a$ 关于乘法逆元如果存在，记为 $a^{-1}$​。

#### 例1

整数环 $(Z, +, \times)$，有理数环 $(Q, +, \times)$，实数环 $(R, +, \times)$，复数环 $(C, +, \times)$。

#### 例2

实数域 $R$ 上 $n$ 阶方阵环 $\left(R^{n\times n}, +, \times\right)$

#### 例3

模 $n$ 的剩余类环：$\left(Z_n, \oplus, \otimes\right)$

#### 例4

整数集 $Z$ 对如下运算构成环 $(Z, \odot, \circ)$

$$ a \odot b = a + b - 1; \quad a \circ b = a + b - ab $$

（不常见的运算）

#### 例5

高斯整数环 $(Z[i] = \{a + bi \mid a, b \in Z\}, +, \times)$

（不常见的集合）

### 定理15.1.3

在环 $R$ 中，如下几个性质成立

1. $$a \cdot 0 = 0 = 0 \cdot a.$$

2. $$-a \cdot b = (-a) \cdot b,$$

3. $$a - a = 0.$$

4) $$\text{如果} a + b = c，\text{则} b = c - a.$$

5. $$-(a + b) = -a - b,$$

6. $$-(a - b) = -a + b.$$

7. $$\left(\sum_{i=1}^n a_i\right)\left(\sum_{j=1}^m b_j\right) = \sum_{i=1}^n\sum_{j=1}^m a_i b_j$$​

### 定义 15.1.4

设 $R$ 为环，$0 \neq a, 0 \neq b \in R$，如果 $ab = 0$，则称 $a, b$ 为 $R$ 中零因子。

#### 例7

环 $Z_{26}$ 中 $13$ 与 $2$ 都是零因子。

#### 例8

环 $Z$​ 中没有零因子。

### 定义15.1.5

在环 $R$ 中，令 $R^* = R \backslash \{0\}$

1) $R$ 为交换环：$R$ 为环，并且 $(R, \cdot)$ 满足交换律。

2) $R$ 为整环：$R$ 是无零因子的交换环。

3) $R$ 为域：$\left(R^*, \cdot\right)$ 为交换群。

注：整数环 $Z$ 是整环，有理数环是域，实数环是域，复数环是域。

注：模 $n$ 的剩余类环，当 $n$ 是素数时是域。

## 2. 多项式环

### 定义15.1.5

设 $(R, +, \cdot)$ 是有单位元的交换环，称 $f(x) = a_0 x^0 + a_1 x^1 + \cdots + a_{n-1} x^{n-1} + a_n x^n + \cdots$ 是 $R$ 上关于 $x$ 的多项式，其中 $x$ 是未定元，$a_i = 0 (i > n)$。全体多项式记为 $R[x]$。

- $a_0 x^0$ 等价为 $a_0$
- 系数为单位元的系数可以省略不写，$1 x^{i}$ 为可简记为 $x^{i}$
- 系数为零元的多项式可以省略不写，则 $R$ 上关于 $x$ 的多项式可以简单记为

$$f(x) = a_0 + a_1 x + \ldots + a_{n-1} x^{n-1} + a_n x^n \quad (a_i \in R)$$

如果 $a_n \neq 0, a_i = 0 (i > n)$，则称 $a_n x^n$ 为 $f(x)$ 的首项，$n$ 是多项式 $f(x)$ 的次数，记为 $\operatorname{deg}(f(x)) = n$。

如果 $a_n = 1$，则称 $f(x)$ 为首一多项式。

当 $a_i$ 全为 0 时，记为 $f(x) = 0$，称为零多项式。

#### 例8

环 $Z$ 上的多项式 $f(x) = 13 x^0 + x + 5 x^2 + 4 x^4 + x^6$​ 是首一多项式，且次数为 6。

### 定理15.1.6

对于 $R[x]$ 中的任意两个多项式

$$f(x) = a_0 x^{0} + a_1 x + \ldots + a_{n-1} x^{n-1} + a_n x^n, \quad a_i \in R,$$
$$g(x) = b_0 x^{0} + b_1 x + \ldots + b_{m-1} x^{m-1} + b_m x^m, \quad b_j \in R$$

则 $R[x]$ 关于如下加法和乘法构成环，称为 $R$ 上的多项式环

$$ f(x) + g(x) = \sum_{i=0}^{\max\text{{m, n}} } (a_i \oplus b_i) x^i $$

$$ f(x) \cdot g(x) = \sum_{k=0}^{m+n} \left(\sum_{i+j=k} a_i \otimes b_j\right) x^k $$

### 定理15.1.7

对于多项式环$R[x]$，有

$R$ 单位元为$R[x]$单位元

$R$ 的零元为$R[x]$零元。

若 $R$ 为整环，则$R[x]$也为整环

$R[x]$ 中的可逆元一定是$R$的可逆元

### 定理15.1.8

对于 $R[x]$ 中的任意两个多项式

$$f(x) = a_0 + a_1 x + \ldots + a_{n-1} x^{n-1} + a_n x^n, \quad a_i \in R$$
$$g(x) = b_0 + b_1 x + \ldots + b_{m-1} x^{m-1} + b_m x^m, \quad b_j \in R$$

则：

$$\operatorname{deg}(f(x) + g(x)) \leq \max\{\operatorname{deg}(f(x)), \operatorname{deg}(g(x))\}$$
$$\operatorname{deg}(f(x) g(x)) \leq \operatorname{deg}(f(x)) + \operatorname{deg}(g(x))$$

且当 $R$ 是整环时：

$$\operatorname{deg}(f(x) g(x)) = \operatorname{deg}(f(x)) + \operatorname{deg}(g(x))$$

## 3. 多项式环带余除法

### 定理15.1.9

设 $R$ 为有单位元的整环，则

$$R[x] = \{ a_0 + a_1 x + \ldots + a_n x^n \mid n \geq 0, a_i \in R \}$$

关于多项式加法和乘法为有单位元的整环。

**（本小节后面默认 $R$ 为有单位元的整环!）**

### 定理15.1.10

设 $f(x), g(x) \in R[x]$，$g(x)$ 首一，则存在唯一两个多项式 $q(x)$，$r(x)$，使得

$$ f(x) = q(x) g(x) + r(x) $$

其中 $r(x) = 0$ 或 $\operatorname{deg}(r(x)) < \operatorname{deg}(g(x))$。

- $q(x)$ 称为 $g(x)$ 除 $f(x)$ 的商式；
- $r(x)$ 称为 $g(x)$ 除 $f(x)$ 的余式；
- 上述定理中性质称为带余除法。

对于一般多项式环上述定理不成立。

## 4. 域的概念

### 定义15.3.1

环 $(F, +, \cdot)$ 的所有非零元关于乘法构成一个交换群，则称 $(F, +, \cdot)$ 为域，简称 $F$ 为域。元素个数为 $k$ 的有限域一般可以记为 $GF(k)$。

- 域中一定包含零元 $0$ 和单位元 $1$​。

例1: 全体实数关于加法和乘法是域。

例2: 全体有理数关于加法和乘法是域。

例3: 全体复数关于加法和乘法是域。

例4: 全体整数关于加法和乘法不是域。

例5: $\left(Z_p, \oplus, \otimes\right)$ 是域，这里 $p$ 是素数。

例6: 当 $n$ 为合数时，$\left(Z_n, \oplus, \otimes\right)$ 不是域。

### 定义15.3.2

若域 $(F, +, \cdot)$ 的子环 $F_0$ 关于加法与乘法构成域，则称 $F_0$ 为 $F$ 的子域，$F$ 称为 $F_0$ 的扩域。

#### 例7

有理数域 $\mathbb{Q}$ 是实数域 $\mathbb{R}$ 的子域，实数域 $\mathbb{R}$ 是复数域 $\mathbb{C}$ 的子域；反过来，复数域 $\mathbb{C}$ 是实数域 $\mathbb{R}$ 的扩域，实数域 $\mathbb{R}$ 是有理数域 $\mathbb{Q}$ 的扩域。

### 定理15.3.3

如果 $(F, +, \times)$ 为域，则 $F$ 具有如下性质：

$$\text{(1)} a + c = b + c \Rightarrow a = b;$$

$$\text{(2)} c \neq 0, a \times c = b \times c \Rightarrow a = b;$$

$$\text{(3)} -(a + b) = (-a) + (-b); (-a) \times (-b) = a \times b$$

$$\text{(4)} -(-a) = a; (a^{-1})^{-1} = a; (-a)^{-1} = -a^{-1}$$

### 定理15.3.4

任何域 $F$ 和它子域 $F_1$ 有相同的 $0$ 和 $1$，且 $F_1$ 是 $F$ 加法子群，$F_1 \backslash \{0\}$ 是 $F \backslash \{0\}$ 的乘法子群。

### 定理15.3.5

有理数域 $\mathbb{Q}$ 没有真子域，阶数为素数的有限域没有真子域。

## 5. 域上的多项式环

### 定理15.4.1

设 $f(x), g(x) \in F[x]$，则存在唯一两个多项式 $q(x), r(x)$，使得 $f(x) = q(x) g(x) + r(x)$，其中 $r(x) = 0$ 或 $\operatorname{deg}(r(x)) < \operatorname{deg}(g(x))$。（不需要满足首一多项式）

- $q(x)$ 称为 $g(x)$ 除 $f(x)$ 的商式；
- $r(x)$ 称为 $g(x)$ 除 $f(x)$ 的余式；
- 上述定理中性质称为带余除法。
- 对于一般多项式环上述定理不成立。

### 定义15.4.2

设 $f(x), g(x) \in F[x]$，如果 $g(x)$ 除 $f(x)$ 的余式 $r(x) = 0$，则称 $g(x)$ 整除 $f(x)$，记为 $g(x) \mid f(x)$，这时称 $g(x)$ 为 $f(x)$ 的因式。否则称 $g(x)$ 不整除 $f(x)$，记为 $g(x) \nmid f(x)$。

- 零次多项式是任意多项式的因式；任意多项式都是零多项式的因式；

- 如果 $f(x) \mid g(x), g(x) \mid f(x)$，则 $f(x) = c \cdot g(x) \quad c \in F \backslash \{0\}$

- 如果 $f(x) \mid g(x), g(x) \mid h(x)$，则 $f(x) \mid h(x)$.

### 定义15.4.3

设 $d(x), f(x), g(x) \in F[x]$。如果

$$(1) d(x) \mid f(x), d(x) \mid g(x)$$

(2) 对 $f(x)$ 和 $g(x)$ 的任意共同的因式（公因子） $d_1(x)$，均有
$$\operatorname{deg} d_1(x) \leq \operatorname{deg} d(x)$$

则称 $d(x)$ 为 $f(x)$ 和 $g(x)$ 的最大公因式，记为

$$ d(x) = (f(x), g(x)) $$

- 当 $f(x) = g(x) = 0$ 时，规定 $(f(x), g(x)) = 0$

- 当 $q(x)$ 是 $f(x)$ 与 $g(x)$ 的最大公因式，则 $c \cdot q(x)$ 也是 $f(x)$ 与 $g(x)$ 的最大公因式，一般用 $(f(x), g(x))_1$ 表示最高项系数为 1 的最大公因式；

### 定理15.4.4

(最大公因式的计算方法：辗转相除法)

设 $f(x), g(x), r(x) \in F[x]$，如果 $f(x) = q(x) g(x) + r(x)$

则 $(f(x), g(x))_1 = (g(x), r(x))_1$

### 定理15.4.5

设 $f(x), g(x) \in F[x]$，则 $f(x)$ 与 $g(x)$ 的最大公因式一定存在，并且可以表示为 $f(x)$ 与 $g(x)$ 的一个组合：

$$(f(x), g(x))_1 = u(x) f(x) + v(x) g(x)$$

其中 $u(x), v(x) \in F[x]$。

### 定义15.4.6

设 $f(x), g(x) \in F[x]$。如果 $(f(x), g(x))_1 = 1$ 则称 $f(x)$ 与 $g(x)$ 互素。

互素具有如下性质:

(1)$$(f(x), g(x))_1 = 1 \Leftrightarrow \exists u(x), v(x) \in F[x], u(x) f(x) + v(x) g(x) = 1$$

(2) 若 $(f(x), g(x))_1 = 1, f(x) \mid g(x) h(x)$，则 $f(x) \mid h(x)$

(3) 若 $f(x) \mid h(x), g(x) \mid h(x), (f(x), g(x))_1 = 1$ 则 $f(x) g(x) \mid h(x)$​

### 定义15.4.7 (同余)

对于 $f(x), g(x), m(x)$，如果

$$m(x) \mid f(x) - g(x)$$

记为：$f(x) \equiv g(x) \pmod m(x)$，简记 $f \equiv g \pmod m$

### 性质15.4.8

设 $f \equiv g \pmod m$，$h \equiv i \pmod m$，则

1) $f + h \equiv g + i \pmod m$

2) $f \cdot h \equiv g \cdot i \pmod m$;

3) $n$ 是正整数 $\Rightarrow f^n \equiv g^n \pmod m$;

### 定义15.4.9

(多项式模同余逆元): 如果

$$f(x) g(x) \equiv 1 \pmod m(x)$$

称 $g$ 为 $f$ 模 $m$ 逆元。

### 定义15.4.10

设 $p(x) \in F[x]$，$\operatorname{deg}(p(x)) \geq 1$，如果 $p(x)$ 的因式只有非零常数以及自身的非零常数倍，则称 $p(x)$ 为不可约多项式或既约多项式，否则称 $p(x)$ 为可约多项式。

注：AES算法的 S盒采用了 $Z_2$ 上不可约多项式

$$ f(x) = x^8 + x^4 + x^3 + x + 1 $$

### 定理15.4.11

关于不可约多项式，有如下结论：

- 一次多项式总是不可约
- 多项式的可约性与其所在的域密切相关
- $p(x)$ 为不可约多项式 $\Leftrightarrow p(x)$ 不能分解成两个次数更低的多项式的乘积。对于任意 $f(x)$
$$ p(x) \mid f(x) \text{或} (f(x), p(x)) = 1 $$

### 定理15.4.12

关于一般域上多项式，有如下进一步结论：

1) 复数域上不可约多项式只有一次多项式。

2) 实数域不可约多项式只有一次多项式与某些二次多项式，并且 $$ ax^2 + bx + c \text{ 不可约} \Leftrightarrow b^2 - 4ac < 0 $$

3) 有理数域上存在任意次不可约多项式，并且 $x^n + 2$ 是不可约多项式。

4) 有限域 $F$ 上总存在任意次不可约多项式。

### 定理15.4.13

$F[x]$ 中每一个次数 $\geq 1$ 的首一多项式均可唯一表示成 $F[x]$ 中首一的不可约多项式的乘积。这里的唯一是指，若

$$ f(x) = p_1(x) p_2(x) \ldots p_s(x) = q_1(x) q_2(x) \ldots q_t(x), $$

则 $s = t$，并且适当交换因式的秩序，有

$$ p_i(x) = q_i(x), \quad i = 1, 2, \ldots, s. $$
