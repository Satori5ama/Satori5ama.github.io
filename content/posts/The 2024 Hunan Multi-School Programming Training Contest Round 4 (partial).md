+++
categories = ['题解']
tags = ['ACM','湖南多校赛']
title = 'The 2024 Hunan Multi-School Programming Training Contest Round 4 (partial)'
slug = '2024-Hunan-Multi-School-4'
date = 2024-04-01T08:52:25+08:00
lastmod = 2024-04-28T16:52:25+08:00
draft = false
+++

公式好像写多了，Latex得加载好一会儿。

[Hunan Collegiate Championship Ⅳ 2024 (feat. Yokohama Regional 2021) - Codeforces](https://codeforces.com/gym/514727)

### Tag

随机化（蒙特卡洛法），偏序，图论转化

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

赛场思路比较诡异的一题。

首先第一反应先排个序再说。

按x升序排序之后，我们发现一个显然的性质，对于左下角点的选取，若对于一个点$(x_{i},y_{i})$，存在一个点$(x_{j},y_{j})$满足$x_{j}<x_{i},y_{j}<y_{i}$，那么$(x_{i},y_{i})$必不可能为左下角点。因此，左下角的可能点纵坐标必为一个单调递减序列。

同理，右上角的可能点纵坐标也必为一个单调递减序列。并且左下角点的横坐标值一定小于右下角点的横坐标值。

所以，对于左下角点，我们采用从左到右枚举的方式，记录当前枚举点之前的最小纵坐标，并和当前点的纵坐标比较，如果当前点的纵坐标是一个新的最小值，那么当前点可以作为一个左下角点。

此时，我们用一个单调队列维护当前点右侧的单调递减序列，这个队列中存的即是固定左下角后右上角的所有可能点。

但是对于右上角的可能点，还要满足这样几个条件：

 1. 从起点至当前点的区间内纵坐标最大值小于右上角点的纵坐标；
 2. 从终点到右上角点的区间内纵坐标最小值大于当前点的纵坐标。

因此，我们要同时记录从起点至当前点的纵坐标最大值（用一个变量记录），以及从终点到右上角所有可能点的纵坐标最小值（用一个数组记录从终点到任一个点的区间内纵坐标最小值）。这两个值已知后，我们将两个值在单调队列中作二分答案，就可以求出右上角的真实可选区间。

``` cpp
struct node{
	int x,y;
}e[200005];
int n,mins[200005];
inline bool cmp(node a,node b){return a.x<b.x;}
deque<int> q,q2,q3;		
int main(){
	R(n);
	for(int i=1;i<=n;i++){R(e[i].x);R(e[i].y);}
	sort(e+1,e+1+n,cmp);
	for(int i=1;i<=n;i++){
		while(!q.empty()&&e[q.back()].y<e[i].y){
			q.pop_back(); 
			q2.pop_back();
		} 
		q.push_back(i);			//q维护右上角可能点(单调递减序列)的下标
		q2.push_back(e[i].y);	//q2维护右上角可能点的纵坐标
	}
	mins[n]=n;
	for(int i=n-1;i>=1;i--){
		if(e[i].y<e[mins[i+1]].y) mins[i]=i;
		else mins[i]=mins[i+1];
	}	//mins[i]维护点i到点n的区间内纵坐标最小的点的下标 
	for(unsigned i=0;i<q.size();i++)
		q3.push_back(e[mins[q[i]]].y);	//q3维护右上角可能点到终点的区间内最小的纵坐标
	int ly=1,my=1;	//ly表示起点到当前点中纵坐标最小点的下标,my表示起点到当前点中纵坐标最大点的下标  
	long long sum=0;
	while(!q.empty()&&e[ly].x>=e[q.front()].x){
		q.pop_front();
		q2.pop_front();
		q3.pop_front();
	} 
	if(e[ly].y<e[q.back()].y)
		sum+=max(int((upper_bound(q2.begin(),q2.end(),e[my].y,greater<int>())-q2.begin())-(upper_bound(q3.begin(),q3.end(),e[ly].y)-q3.begin())),0);
	for(int i=2;i<=n;i++){
		if(e[my].y<=e[i].y) my=i;
		if(e[ly].y>=e[i].y){
			ly=i;
			while(!q.empty()&&e[ly].x>=e[q.front()].x){
				q.pop_front();
				q2.pop_front();
				q3.pop_front();
			} 
			if(e[ly].y<e[q.back()].y)
				sum+=max(int((upper_bound(q2.begin(),q2.end(),e[my].y,greater<int>())-q2.begin())-(upper_bound(q3.begin(),q3.end(),e[ly].y)-q3.begin())),0);
		}
	}
	printf("%lld\n",sum);
	return 0;
}
```

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

UPD：学了中心极限定理回来重新整理了下证明。

因为概率论课本最后一章正好是蒙特卡洛法，所以顺便学习了一下。

我们要估算的值为$|G|$，而$|G|=\frac{|G|}{|U|} \times|U|$。

令`$$P\{S \in G|S \in U\}=p=\frac{|G|}{|U|}$$ $$I=\frac{|G|}{|U|}$$`

设每次随机的结果为随机变量$X_i$，记字符串属于G为$\{X_i=1\}$，不属于G为$\{X_i=0\}$，则$X_i$独立同服从两点分布$X_i \sim  B(1, p)$，$Y_N=X_1+X_2+...+X_N \sim B(N,p)$

则$I=E(X_i)=\frac{1}{N}\sum_{i-1}^{N}E(X_i)$，若能得到$X_i$的简单随机样本$X_{1},X_{2},...,X_{N}$，则由大数定律有，当$N$充分大时，算术平均数`$$\hat{I} _{N}=\frac{1}{N}\sum_{i=1}^{n}X_{i}\overset{P}{\longrightarrow} \frac{1}{N}\sum_{i-1}^{n}E(X_i) = I$$`

可作为数学期望$I$的近似估计。

因为$Y_N \sim B(N,p)$，由棣莫弗-拉普拉斯中心极限定理可得`$$P\{\frac{Y_N-Np}{\sqrt{Np(1-p)}}\le x\}=\frac{1}{\sqrt{2\pi }}\int_{-\infty}^{x}e^{-\frac{t^2}{2}}dt$$`

即`$$P\{\frac{\sqrt{N}|\hat{I} _{N}-I|}{\sqrt{D(X)}}\le x\}=\frac{1}{\sqrt{2\pi }}\int_{-x}^{x}e^{-\frac{t^2}{2}}dt$$`

此处$D(X)=p(1-p)$，表示单次随机$X_i$的方差。

若希望在置信水平$1-\alpha$ 下，其相对误差`$\frac{|\hat{I} _{N}-I|}{I} < \varepsilon$`，则有$$\frac{\sqrt{N}I\varepsilon}{\sqrt{D(X)}} \ge u_{1-\alpha/2}$$

即样本容量应满足以下条件：$$N \ge (\frac{u_{1-\alpha/2}}{I\varepsilon})^2D(X)$$

因此，样本容量$N$与$\varepsilon^2$成反比。

对于本问题来说，$\varepsilon=0.05$，$I=\frac{|G|}{|U|} \ge \frac{1}{m}$，$D(X)=p(1-p) \le \frac{1}{4}$，查表可得当$\alpha=0.05$时，$u_{1-\alpha/2}=u_{0.975}=1.96$，代入计算，得到$N \ge345744$，总复杂度应为$O(NM^3/\varepsilon^2)$。

### C

#### Statement

You are given the decoder of the data compression. The set of code words is {00, 01, …, 99} 

> 0X-> output X 
>
> X0-> no output 
>
> AL-> do “output the A-thlast one” for L times 

Example: (Compression ratio = 8/15) 

> Code string: 00 01 25 48
> 
> Decoded string: 0 1 01010 10101010

 Some code strings decoded into the same string. 

> E.g., these are all decoded into 010101010101010: 
>
> 00012548, 00012228821000, 00012882221000 

Reversible: it and its reverse are both decoded into the same string. 

Your task is to find the lexicographically earliest shortest reversible code string decoded into the given string

#### Solution

很有意思的一题。

发现操作序列反转后实际上可以视作分别每个两位操作码反转，然后从后往前生成字符串。

所以用状态$(i,j)$记录匹配了正向前$i$位，反向前$j$位的操作序列，在这个操作序列后添加操作$AL$可以转移到下一个状态。但是我们发现$i,j$两个维度状态遍历存在先后次序的问题，直接使用DP较为麻烦。

于是我们采取**图论转化**的方式，把每个状态看作节点，若在状态$(i,j)$的操作序列后添加操作$AL$可以转移到状态$(i',j')$，那么将$(i,j)$向$(i',j')$连边。

那么这个图实际上是一个DAG，最终我们所求的即$(0,0)$到$(n,n)$的最短路径。此时我们就可以在图上进行DP。

为了方便，此处直接使用BFS求解最短路，记录下途中的操作即可。

``` cpp
#pragma GCC optimize("Ofast")
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N=500,Base=501;
char given[N+5];
int n;
#define base (n+1)
vector<int> e[Base*Base];
vector<char> A[Base*Base],L[Base*Base]; 
queue<int> q;
int ans[Base*Base],ansA[Base*Base],ansL[Base*Base];
inline void add(int u1,int u2,int v1,int v2,int a,int l){
	e[u1*base+u2].push_back(v1*base+v2);
	A[u1*base+u2].push_back(a);
	L[u1*base+u2].push_back(l);
}
inline void init(){
	for(int i=0;i<=n;i++)
		for(int j=0;j<=n;j++)
			for(int k=0;k<=9;k++)
				for(int p=0;p<=9;p++){
					if(k==0){
						if(p==0){
							if(i<n&&j<n&&given[i+1]==p+'0'&&given[n-j]==k+'0')
								add(i,j,i+1,j+1,k,p); 
						} 
						else if(i<n&&given[i+1]==p+'0') add(i,j,i+1,j,k,p); 
					}
					else if(p==0){
						if(j<n&&given[n-j]==k+'0') add(i,j,i,j+1,k,p);
					}
					else{
						int flag=1;
						if(i+p>n||i-k<0||j+p+k>n) continue;
						for(register int z=1;z<=p;z++){
							if(given[i+z]!=given[i+z-k]){
								flag=0;
								break;
							}
						}
						if(!flag) continue;
						for(register int z=0;z<k;z++){
							if(given[n-j-z]!=given[n-j-z-p]){
								flag=0;
								break;
							}
						}
						if(flag) add(i,j,i+p,j+k,k,p);
					}
				}
}
inline void bfs(){
	q.push(0);
	memset(ans,-1,sizeof(ans));
	while(!q.empty()){
		int u=q.front();q.pop();
		for(register unsigned i=0;i<e[u].size();i++){
			int v=e[u][i];
			if(ans[v]==-1){
				ans[v]=u;
				ansA[v]=A[u][i];
				ansL[v]=L[u][i];
				if(v==n*base+n) goto lp;
				q.push(v);
			}
		}
	}
	lp:;
}
void out(int u){
	if(!u) return;
	out(ans[u]);
	putchar(ansA[u]+'0');putchar(ansL[u]+'0');
}
int main(){
	scanf("%s",given+1);
	n=strlen(given+1);
	init();
	bfs();
	out(n*base+n);
	return 0;
}
```

### 参考文献
[The 2024 Hunan Multi-School Programming Training Contest, Round 4 - Luckyblock - 博客园 (cnblogs.com)](https://www.cnblogs.com/luckyblock/p/18113751)

