+++
categories = ['题解']
tags = ['ACM','ICPC']
title = '2024 ICPC Invitational Wuhan Site (partial)'
slug = '2024-ICPC-Invitational-Wuhan Site'
date = 2024-04-01T08:52:25+08:00
lastmod = 2024-07-21T19:52:25+08:00
draft = false
+++

我真傻，真的

好多小马题，~~小马害人~~

[Dashboard - 2024 ICPC National Invitational Collegiate Programming Contest, Wuhan Site - Codeforces](https://codeforces.com/gym/105143)

# I

水签，比较相邻位逆序个数就行了

就这改题时看了一眼就会的破题我比赛还看了5分钟，紫砂了。

``` cpp
#include<bits/stdc++.h>
using namespace std;
typedef unsigned uint;
string s; 
int main(){
	ios::sync_with_stdio(0);
	cin>>s;
	int cnt=0;
	for(uint i=0;i<s.length()-1;i++)
		if(s[i]>s[i+1])
			cnt++;
	cout<<cnt<<endl;
	return 0;
}
```

# K

搜索打了个表发现n%4==0或n%4==1时必胜，否则必败，原理不分析，证明略。

参考文献：[2024 ICPC National Invitational Collegiate Programming Contest, Wuhan Site - Luckyblock - 博客园 (cnblogs.com)](https://www.cnblogs.com/luckyblock/p/18182238#k)

~~这题是队友卡的不能怪我~~，下次这种打表题还是我写吧。

``` cpp
inline void solve(){
	R(T);
	while(T--){
		R(n);
		if(n%4==1||n%4==0)
			puts("Fluttershy");
		else puts("Pinkie Pie");
	}
}
```

# B

~~这题也是队友卡的~~

首先我们可以注意到，题目中操作只能进行 $n$ 次的限制是一个假限制，因为 $n$ 次操作足够我们把一个序列变成任意一个序列。于是我们只需呀考虑最终的序列是什么样的。

显然，我们需要尽可能使得最高位的 $1$ 最小，那么我们容易想到将总和 $sum$ 平均分给 $n$ 个数。但是会出现无法整除存在余数的情况。这种情况下，我们找到 $sum/n$ 二进制的从低到高第一个为 $0$ 的位，将其设置为 $1$ ，比其低的位设为 $0$，由此得到当前的答案。对余数重复进行此操作，最终答案即每次答案的累计。

``` cpp
int p[35],a[200005];
signed main(){
	p[0]=1;
	for(int i=1;i<=30;i++){
		p[i]=p[i-1]*2;
	}
	int n;
	R(n);
	int sum=0;
	for(int i=1;i<=n;i++){
		R(a[i]);
		sum+=a[i];
	}
	int x=0;
	while(1){
		int d=sum/n,y=sum%n,c=0;
		if(y==0){
			x+=d;
			break;
		}
		for(int i=0;i<30;i++){
			if((d&(1<<i))==0){
				c=(1<<i);
				break;
			}
			d-=(1<<i);
		}
		sum%=c;
		x+=c+d;
	}
	printf("%lld\n",x);
	return 0;
}
```



# E

~~你这辈子就是给小马害了~~

本次比赛最战犯的一道题。

问题可以转化为求一棵树从根节点开始每个时刻的生成树的直径。

我们知道对于树上任意一点，离它最远的节点一定是树的直径的一个端点。而直径的一个端点到另一个端点同样是距离最远的。

对于 $t$ 时刻，新增节点为深度为 $t$的所有叶子节点。若当前直径为 $(u,v)$ ，我们考虑这些新增节点是否可能成为新的直径，即对于每个新增节点，找到离它最远的节点，这个问题等价于离找它的父亲节点最远的节点，而离它的父亲最远的节点只可能是 $u,v$ 中的一个。因此在加入一个新节点 $x$ 后，当前直径只可能是 $(u,v)$ ，$(u,x)$ ，$(v,x)$ 中的一个。

注意到$k=i$的答案是具有单调性的，因此单调地枚举时间$t$即可。

``` cpp
#include<bits/stdc++.h>
using namespace std;
int n,r,t0;
vector<int> e[200005];
int fa[200005][20],dep[200005];
inline void R(int &n){
	n=0;int f=1;char c=getchar();
	while(c<'0'||c>'9'){if(c=='-') f=-1;c=getchar();}
	while(c>='0'&&c<='9') n=n*10-'0'+c,c=getchar();n*=f;
}
void dfs(int u,int f){
	fa[u][0]=f;
	dep[u]=dep[f]+1;
	for(int i=1;i<=18;i++)
		fa[u][i]=fa[fa[u][i-1]][i-1];
	for(auto v:e[u])
		if(v!=f)
			dfs(v,u);
}
inline int lca(int a,int b){
	if(a==b) return a;
	if(dep[a]<dep[b]) swap(a,b);
	for(int i=18;i>=0;i--)
		if(dep[fa[a][i]]>=dep[b]) a=fa[a][i];
	if(a==b) return a;
	for(int i=18;i>=0;i--){
		if(fa[a][i]!=fa[b][i]){
			a=fa[a][i];
			b=fa[b][i];
		}
	}
	return fa[a][0];
}
inline int dis(int a,int b){return dep[a]+dep[b]-2*dep[lca(a,b)]+1;}
int len[400005],book[400005];
typedef pair<int,int> P;
queue<P> q;
inline void update(int &u,int &v,int x,int t){
	int duv=dis(u,v),
	dvx=dis(v,x),
	dux=dis(u,x);
	int maxx=max(duv,max(dvx,dux));
	len[t]=maxx;
	if(maxx==duv) return;
	else if(maxx==dvx) u=x;
	else if(maxx==dux) v=x;
}
int ans[400005];
int32_t main(){
//	freopen(".in","r",stdin);freopen(".out","w",stdout);
	R(n);
	for(int i=1;i<n;i++){
		int u,v;
		R(u);R(v);
		e[u].push_back(v);
		e[v].push_back(u);	
	}
	R(r);R(t0);
	dfs(1,0);
	q.push(P(r,0));
	int x=r,y=r;
	len[0]=1;
	int tmax=0;
	book[r]=1;
	while(!q.empty()){
		int u=q.front().first,t=q.front().second;q.pop();
		tmax=t;
		for(auto v:e[u]){
			if(book[v]) continue;
			q.push(P(v,t+1));
			update(x,y,v,t+1);
			book[v]=1;
		} 
	}
	for(int i=tmax+1;i<=n+t0;i++)
		len[i]=len[i-1];
	int ans=t0;
	while(len[ans]>2ll*(ans-t0)+1) ++ans;
	printf("%d ",ans);
	for(int i=2;i<=n;i++){
		while(ans>t0&&len[ans-1]<=2ll*i*(ans-1-t0)+1) --ans;
		printf("%d ",ans);
	}
	return 0;
}
```
___
咕
