+++
categories = ['题解']
tags = ['ACM','湖南多校赛']
title = 'The 2024 Hunan Multi-School Programming Training Contest Round 4 (partial)'
slug = '2024-Hunan-Multi-School-4'
date = 2024-04-01T08:52:25+08:00
lastmod = 2024-04-01T19:52:25+08:00
draft = false
+++

公式好像写多了，Latex得加载好一会儿。

[Hunan Collegiate Championship Ⅳ 2024 (feat. Yokohama Regional 2021) - Codeforces](https://codeforces.com/gym/514727)

### A

相邻两个球相交首尾相接求体积并，给出公式，签到题

~~其实我也是第一次知道$\pi=acos(-1)$~~

``` cpp
#include<bits/stdc++.h>
using namespace std;
char buf[1<<21],*p1=buf,*p2=buf;
typedef long long ll;
//#define getchar() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2))?EOF:*p1++
inline void R(ll &n){
	n=0;int f=1;char c=getchar();
	while(c<'0'||c>'9'){if(c=='-') f=-1;c=getchar();}
	while(c>='0'&&c<='9') n=n*10-'0'+c,c=getchar();n*=f;
}
#define double long double
ll n,r,x[105],y[105],z[105]; 
double v;
const double pi=acos(-1);
int main(){
	R(n);R(r);
	v=4.0*pi*r*r*r/3;
	for(int i=1;i<=n;i++){
		R(x[i]);R(y[i]);R(z[i]);
	}
	double f=0,d;
	for(int i=2;i<=n;i++){
		d=sqrt((x[i]-x[i-1])*(x[i]-x[i-1])+(y[i]-y[i-1])*(y[i]-y[i-1])+(z[i]-z[i-1])*(z[i]-z[i-1]));
		f+=2.0/3*pi*(r-d/2)*(r-d/2)*(2*r+d/2);
	}
	d=sqrt((x[1]-x[n])*(x[1]-x[n])+(y[1]-y[n])*(y[1]-y[n])+(z[1]-z[n])*(z[1]-z[n]));
	f+=2.0/3*pi*(r-d/2)*(r-d/2)*(2*r+d/2);
	printf("%.8Lf\n",v*n-f);
	return 0;
}
```
### J

咕。


### H

首先恭喜队友@Wiz_HUA交了三十三发后成为全场唯一过H的人，

赛后复盘时发现是公式推错了一部分，但是最终解法与正解完全吻合，%%%

这个题目要求任意一个由'A','G','C','T'构成的字符串与m个模式串$P_{i}$（存在通配符'*'）中任意一个匹配的概率。相对误差为5%以内。

显然，这个概率等于匹配的所有串的数量/串的总数（4^n）。但是一个串可能匹配多个模式串，所以求出分子的数量不太现实。

那么注意到题目并不需要我们求出精确概率，而是给了一个宽松的相对误差，加上此题时限5秒，于是我们大胆猜测这题可以使用蒙特卡洛法求解。

我们第一个思路是直接随机n个位置上的字符，但是这样做和模式串匹配的概率接近0，从而使得蒙特卡洛的结果很可能为0。

因此我们考虑在一个更小的范围内进行随机。

#### Solution

令`$$U=\{(i,S)|S与P_{i}匹配\}$$$$G=\{(i,S)|i=min\{j|S与P_{j}匹配\}\}$$`

那么，$|U|$即与某一特定模式串匹配的字符串数量的总和，$|G|$即与任意模式串匹配的字符串数量（对于一个字符串匹配多个模式串的情况，我们只记录匹配编号最小的那个）。

我们要求的答案即$$4^{-n} \times |G|=4^{-n} \times |U| \times \frac{|G|}{|U|} $$

其中$|U|=\sum_{i=1}^{m}4^{k_{i}}$，$k_{i}$为第$i$个模式串中'?'的个数。

对于$\frac{|G|}{|U|}$，注意到`$P\{S \in G|S \in U\}=\frac{|G|}{|U|}$`。因此我们若干次随机抽取$U$中的一个字符串$S$，判断其是否属于$G$（若$S$与$P_{i}$匹配但不与$P_{j}(0<j<i)$匹配，那么$S$属于$G$）。这种方法的正确性较为显然。

另一种随机方法是$N$次随机抽取$U$中的一个字符串$S$，若第$i$次抽取的字符串能与$num_{i}$个模式串匹配，那么$$\frac{|G|}{|U|}=\frac{\sum_{i=1}^{N}\frac{1}{num_{i}}}{N}$$
	
证明不会，略。

于是我们可能会写出下面这样的代码：

``` cpp
int n,m;
string s[31];
const char dna[]={'A','G','C','T'};
inline int check(int base,string tmp){
	for(int i=0;i<n;i++)
		if(tmp[i]!=s[base][i]&&s[base][i]!='?') return 0;
	return 1;
}
int main(){
	cin>>n>>m;
	double ans2=0;
	for(int i=1;i<=m;i++){
		cin>>s[i];
		double num=1.0;
		for(int j=0;j<n;j++)
			if(s[i][j]!='?') num/=4;
		ans2+=num;
	}
	srand(time(0));
	const int cycles=290000;
	int ansk=0;
/*	double ans=0;*/
	for(int i=1;i<=cycles;i++){
		int base=rand()%m+1;
		string tmp=s[base];
		for(int i=0;i<n;i++)
			if(tmp[i]=='?')
				tmp[i]=dna[rand()%4];
		for(int i=1;i<base;i++)
			if(check(i,tmp)) goto lp;
		ansk++;
		lp:;
/*	随机化的另一种写法 
		int num=0;
		for(int i=1;i<=m;i++)
			if(check(i,tmp)) ++num;
		ans+=1.0/num;
*/
	}
	cout<<ans2*(1.0*ansk/cycles)<<endl;
/*	cout<<ans2*(1.0*ans/cycles)<<endl;*/
	return 0;
}
```
然而，上述解法有一个致命的错误，随机的时候先对匹配的模式串编号进行均匀随机，再对串进行随机。因为不同模式串的'?'数量不同，因此在$U$中可能匹配的串的数量也不同，此时随机到各个串的概率是不同的。

改进方案是将各个模式串编号对应的可能串数统计出来，按比例进行随机。因为所有模式串匹配到的最多可能串数之和$|U|_{max}=4^{30} \times30 >2^{64}$ ，因此我们可能需要使用`__int128`进行存储。

``` cpp
#define ll __int128
#define double long double
int n,m;
string s[31];
const char dna[]={'A','G','C','T'};
inline int check(int base,string tmp){
	for(int i=0;i<n;i++)
		if(tmp[i]!=s[base][i]&&s[base][i]!='?') return 0;
	return 1;
}
ll u_num[32],u_sum[32];
inline ll random(ll mod){
	return (ll)(((double)rand())/RAND_MAX*mod);
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	cin>>n>>m;
	double ans2=0;
	for(int i=1;i<=m;i++){
		cin>>s[i];
		double num=1.0;
		u_num[i]=1;
		for(int j=0;j<n;j++)
			if(s[i][j]!='?') num/=4;
			else u_num[i]*=4;
		u_sum[i]=u_sum[i-1]+u_num[i];
		ans2+=num;
	}
	srand(time(0));
	const int cycles=290000;
	int ansk=0;
/*	double ans=0;*/
	for(int i=1;i<=cycles;i++){
		int base=lower_bound(u_sum+1,u_sum+1+m,random(u_sum[m]))-u_sum;
		string tmp=s[base];
		for(int i=0;i<n;i++)
			if(tmp[i]=='?')
				tmp[i]=dna[rand()%4];
		for(int i=1;i<base;i++)
			if(check(i,tmp)) goto lp;
		ansk++;
		lp:;
/*	随机化的另一种写法 
		int num=0;
		for(int i=1;i<=m;i++)
			if(check(i,tmp)) ++num;
		ans+=1.0/num;
*/
	}
	cout<<ans2*(1.0*ansk/cycles)<<endl;
/*	cout<<ans2*(1.0*ans/cycles)<<endl;*/
	return 0;
}
```

#### 随机次数和复杂度证明

~~学概率论学的~~

因为概率论课本最后一章正好是蒙特卡洛法，所以顺便学习了一下。

我们要估算的值为$|G|$，而$|G|=\frac{|G|}{|U|} \times|U|$。

令`$$P\{S \in G|S \in U\}=p=\frac{|G|}{|U|}$$ $$I=\frac{|G|}{|U|}$$`

设随机变量$X$满足两点分布$$X \sim  B(1, p)$$

则$I$可以看作随机变量函数$h(X)=X$的数学期望。若能得到$X \sim  B(1, p)$的简单随机样本$X_{1},X_{2},...,X_{N}$，则由大数定律有，当$N$充分大时，算术平均数`$$\hat{I} _{N}=\frac{1}{N}\sum_{i=1}^{n}h(X_{i})$$`

可作为数学期望$I$的近似估计。

因为$E[h(X_{i})]=I$，故$\hat{I} _{N}$是$I$的无偏估计。

又$D[h(X)]=p(1-p)$，则$\hat{I} _{N}$的方差为$\frac{D[h(X)]}{N}$，由中心极限定理，其误差的分布收敛到正态分布$$\sqrt{N}[\hat{I} _{N}-I]\overset{D}{\longrightarrow} N(0,D[h(x)])，N\longrightarrow\infty $$

即`$$P\{\frac{\sqrt{N}|\hat{I} _{N}-I|}{\sqrt{D[h(X)]}}\le x\}=\frac{1}{\sqrt{2\pi }}\int_{-x}^{x}e^{-\frac{t^2}{2}}dt$$`

若希望在置信水平$1-\alpha$ 下，其相对误差`$\frac{|\hat{I} _{N}-I|}{I} < \varepsilon$`，则有$$\frac{\sqrt{N}I\varepsilon}{\sqrt{D[h(X)]}} \ge u_{1-\alpha/2}$$

即样本容量应满足以下条件：$$N \ge (\frac{u_{1-\alpha/2}}{I\varepsilon})^2D[h(X)]$$

因此，样本容量$N$与$\varepsilon^2$成反比。

对于本问题来说，$\varepsilon=0.05$，$I=\frac{|G|}{|U|} \ge \frac{1}{m}$，$D[h(X)]=p(1-p) \le \frac{1}{4}$，查表可得当$\alpha=0.05$时，$u_{1-\alpha/2}=u_{0.975}=1.96$，代入计算，得到$N \ge345744$，总复杂度应为$O(NM^3/\varepsilon^2)$。




