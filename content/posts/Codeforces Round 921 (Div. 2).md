+++
categories = ['题解']
tags = ['ACM', 'CF']
title = 'Codeforces Round 921 (Div. 2)'
slug = 'Codeforces-Round-921-Div. 2'
date = 2024-05-20T16:55:27+08:00
lastmod = 2024-05-24T08:55:27+08:00
draft = false
+++

好久以前的div2拖到现在才改真是唐完了。

[Dashboard - Codeforces Round 921 (Div. 2) - Codeforces](https://codeforces.com/contest/1925)

# Tag

概率论，线段树，数学

# D

概率论没学好导致的。

期望的贡献可以分为两部分，第一部分是原始$f_i$数组产生的贡献，第二部分是增加的数产生的贡献，注意到第二部分和原数组没有任何关系，只与增加的方案相关。

第一部分的贡献即$\frac{k\sum _{i=1}^{m}f_i}{d}$，其中$d=\binom{n}{2}$

令第二部分贡献的随机变量为$Z$，每个友谊组合的贡献的随机变量为同分布$Y_i$，则$Z=Y_1+Y_2+...+Y_m$，这步是问题核心。

令每个友谊组合被选中的次数为$X_i$，因为选中$x$次就会产生$\sum _{i=0}^{x-1}i$的贡献，有$Y_i=\frac{X_i(X_i-1)}{2}$，又$X_i \sim B(k,\frac{1}{d})$，因此$$E(Y)=\sum _{x=1}^{k}\frac{x(x-1)}{2}\cdot P(x)$$，其中$$P(x)=\binom{k}{x}(\frac{1}{d})^x(1-\frac{1}{d})^{k-x}$$

最终$E(Z)=m\cdot E(Y)$

``` cpp
int n,m,k; 
int a[100005],b[100005],f[100005];
const ll mod=1e9+7;
inline ll qpow(ll x,ll n){ll res=1;for(;n;(n&1)&&(res=res*x%mod),x=x*x%mod,n>>=1);return res;}
ll jc[200005],jcinv[200005],dpx[200005],mdpx[200005];
const int MAXK=2e5;
inline ll C(ll n,ll m){return jc[n]*jcinv[m]%mod*jcinv[n-m]%mod;}
int main(){
	jc[0]=jc[1]=1;
	for(int i=2;i<=MAXK;i++)
		jc[i]=jc[i-1]*i%mod;
	jcinv[MAXK]=qpow(jc[MAXK],mod-2);
	for(int i=MAXK-1;i>=0;i--)
		jcinv[i]=jcinv[i+1]*(i+1)%mod;
	int t;
	R(t);
	while(t--){
		R(n);R(m);R(k);
		ll ans1=0,ans2=0;
		for(int i=1;i<=m;i++){
			R(a[i]);R(b[i]);R(f[i]);
			ans1=(ans1+f[i])%mod;
		}
		ll d=1ll*n*(n-1)/2%mod;
		ans1=qpow(d,mod-2)*ans1%mod*k%mod;
		dpx[0]=mdpx[0]=1;
		dpx[1]=qpow(d,mod-2);
		mdpx[1]=(d-1)*qpow(d,mod-2)%mod;
		for(int i=2;i<=k;i++){
			dpx[i]=dpx[i-1]*dpx[1]%mod;
			mdpx[i]=mdpx[i-1]*mdpx[1]%mod;
		}
		ll cnt;
		for(int x=1;x<=k;x++){
			cnt=1ll*x*(x-1)/2%mod;
			ans2=(ans2+cnt*C(k,x)%mod*dpx[x]%mod*mdpx[k-x]%mod)%mod;
		}
		printf("%lld\n",(ans1+ans2*m%mod)%mod);
	}return 0;
}
```
# E

一个比较基础的线段树题。

我们维护区间上的花费总和，注意到每新增一个港口$X_i$，花费受影响的点的集合是从新增港口的左侧的第一个港口$X_l$到右侧第一个港口$X_r$，

对区间$(X_l,X_i]$的影响：该区间内点的右侧第一个港口位置均变为$X_i$

对区间$(X_i,X_r]$的影响：该区间内点的左侧第一个港口权值均变为$V_i$

注意到当一个区间的左港口权值和右港口位置确定时，花费之和可以由等差数列求和直接算出来。

因此我们用线段树维护区间花费和，使用两个lazytag维护区间修改的左港口权值和右港口位置。修改时，只需要根据左港口权值和右港口位置的变化更新$(X_l,X_i]$和$(X_i,X_r]$的花费即可。

当然，这里对每一个插入的港口，我们需要求出它的前驱和后继，这个用map就可以维护。

``` cpp
int n,m,q;
map<int,int> hb;
const int MAXN=3e5;
int rx[MAXN],rv[MAXN];
ll b[4*MAXN+5],tagv[4*MAXN+5],tagx[4*MAXN+5];
#define ls u<<1
#define rs u<<1|1
#define pushup(u) b[u]=b[ls]+b[rs]
inline void pushdown(int u,int l,int r,int mid){
	if(tagv[u]==0) return;
	b[ls]=1ll*((tagx[u]-mid)+(tagx[u]-l))*(mid-l+1)/2*tagv[u];
	tagv[ls]=tagv[u];
	tagx[ls]=tagx[u];
	b[rs]=1ll*((tagx[u]-r)+(tagx[u]-(mid+1)))*(r-mid)/2*tagv[u];
	tagv[rs]=tagv[u];
	tagx[rs]=tagx[u];
	tagv[u]=tagx[u]=0;
}
inline void modify(int u,int l,int r,int x,int y,int v,int xr){
	if(x<=l&&r<=y){
		b[u]=1ll*((xr-r)+(xr-l))*(r-l+1)/2*v;
		tagv[u]=v;
		tagx[u]=xr;
		return;
	}
	int mid=(l+r)>>1;
	pushdown(u,l,r,mid);
	if(x<=mid) modify(ls,l,mid,x,y,v,xr);
	if(y>mid) modify(rs,mid+1,r,x,y,v,xr);
	pushup(u);
}
inline ll query(int u,int l,int r,int x,int y){
	if(x<=l&&r<=y)
		return b[u];
	int mid=(l+r)>>1;
	pushdown(u,l,r,mid);
	ll res=0;
	if(x<=mid) res+=query(ls,l,mid,x,y);
	if(y>mid) res+=query(rs,mid+1,r,x,y);
	pushup(u);
	return res;
}
int main(){
	R(n);R(m);R(q);
	for(int i=1;i<=m;i++)
		R(rx[i]);
	for(int i=1;i<=m;i++){
		R(rv[i]);
		hb[rx[i]]=rv[i];
	}
	auto j=hb.begin();++j;
	for(auto i=hb.begin();j!=hb.end();i++,j++){
		int xl=i->first,v=i->second,xr=j->first;
		modify(1,1,n,xl+1,xr,v,xr);
	}
	while(q--){
		int opt;R(opt);
		if(opt==1){
			int x,v;
			R(x);R(v);
			auto i=hb.lower_bound(x);
			int xr=i->first;
			--i;
			int xl=i->first,vl=i->second;
			modify(1,1,n,xl+1,x,vl,x);
			modify(1,1,n,x+1,xr,v,xr);
			hb[x]=v;
		}
		else{
			int l,r;
			R(l);R(r);
			printf("%lld\n",query(1,1,n,l,r));
		}
	}
	return 0;
}

```


# F

构思数学题。

手玩后发现从第二次对折开始，增加的valley的部分和mountain的部分都是相等的。

因此我们只需要考虑$n$次对折后的总长度。对第$i$次对折新增加的折痕单独考虑，第1次对折的折痕长度为$2\sqrt2$。注意到每对折一次初始折痕长度就会变为上一次对折的$\frac{\sqrt2}{2}$，因此第$i$次对折的初始折痕长度为$(\frac{\sqrt2}{2})^{i-1}$。

又因为之前的每一次对折展开后会让当前第$i$次对折的折痕长度翻倍，因此第$i$次对折新增的总折痕长度是初始折痕长度的$2^{i-1}$倍。

因此总长度`$$sum=\sum _{i=1}^{N}2^{i-1} \cdot
 2\sqrt 2 \cdot (\frac{\sqrt{2}}{2})^{i-1} \\ =2\sum _{i=1}^{N} (\sqrt 2)^i=\frac{2\sqrt{2}(1-(\sqrt2)^{n})}{1-\sqrt2}=\frac{2(\sqrt2+2)(1-(\sqrt2)^{n})}{-1} \\ =-2(\sqrt2+2-(\sqrt2)^{n+1}-2(\sqrt2)^n)$$`

记valley部分长度为$V$，mountain部分长度为$M$，则两者之差为第1次对折的折痕长度$$diff=2 \sqrt 2$$

待求量

`$$\frac{V}{M}=\frac{sum-diff}{sum+diff} \\=\frac{2\sqrt2+2-(\sqrt2)^{n+1}-2(\sqrt2)^n}{2-(\sqrt2)^{n+1}-2(\sqrt2)^n} \\ =1+\frac{2\sqrt2}{2-(\sqrt2)^{n+1}-2(\sqrt2)^n} \\ =1+\frac{2}{\sqrt2-(\sqrt2)^{n}-(\sqrt2)^{n+1}} \\ =\begin{cases}1+\frac{2}{\sqrt2(1-2 ^\frac{n-1}{2})-2^\frac{n+1}{2}}
  & \text{ if } n为奇数
\\
\\1+\frac{2}{\sqrt2(1-2 ^\frac{n}{2})-2^\frac{n}{2}}
  & \text{ if } n为偶数
\end{cases}
\\=\begin{cases}1+\frac{2(\sqrt2(1-2 ^\frac{n-1}{2})+2^\frac{n+1}{2})}{2(1-2 ^\frac{n-1}{2})^2-2^{n+1}}
  & \text{ if } n为奇数
\\
\\1+\frac{2(\sqrt2(1-2 ^\frac{n}{2})+2^\frac{n}{2})}{2(1-2 ^\frac{n}{2})^2-2^{n}}
  & \text{ if } n为偶数
\end{cases}$$`

故`$$B=\begin{cases}\frac{2(1-2 ^\frac{n-1}{2})}{2(1-2 ^\frac{n-1}{2})^2-2^{n+1}}
  & \text{ if } n为奇数
\\ \frac{2(1-2 ^\frac{n}{2})}{2(1-2 ^\frac{n}{2})^2-2^{n}}
  & \text{ if } n为偶数
\end{cases}$$`

``` cpp
ll t,n;
const ll mod=999999893;
inline ll qpow(ll x,ll n){ll res=1;for(;n;(n&1)&&(res=res*x%mod),x=x*x%mod,n>>=1);return res;}
int main(){
	R(t);
	while(t--){
		R(n);
		if(n&1){
			ll p=(2LL*(1LL-qpow(2,(n-1)/2))%mod+mod)%mod;
			ll q=((2LL*(1LL-qpow(2,(n-1)/2))%mod*(1LL-qpow(2,(n-1)/2))%mod-qpow(2,n+1))%mod+mod)%mod;
			printf("%lld\n",p*qpow(q,mod-2)%mod);
		}
		else{
			ll p=(2LL*(1LL-qpow(2,(n)/2))%mod+mod)%mod;
			ll q=((2LL*(1LL-qpow(2,(n)/2))%mod*(1LL-qpow(2,(n)/2))%mod-qpow(2,n))%mod+mod)%mod;
			printf("%lld\n",p*qpow(q,mod-2)%mod);
		}
	}
	return 0;
}
```
