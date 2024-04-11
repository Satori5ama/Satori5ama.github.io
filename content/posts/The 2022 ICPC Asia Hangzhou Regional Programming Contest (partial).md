+++
categories = ['题解']
tags = ['ACM','Virtual participation']
title = 'The 2022 ICPC Asia Hangzhou Regional Programming Contest (partial)'
slug = '2022-ICPC-Asia-Hangzhou'
date = 2024-04-11T08:52:25+08:00
lastmod = 2024-04-11T19:52:25+08:00
draft = false
+++

[The 2022 ICPC Asia Hangzhou Regional Programming Contest - Codeforces](https://codeforces.com/gym/104090)

省流：自己打的vp，但是在应该会做的简单数论和DP上疯狂挂分，唐完了。

最后没打过一群学弟，紫砂了。

~~建议我和大一组一队让我混个Au~~

~~同学和大一组一队，感觉要让他白捡Au了~~

### Tag

字符串哈希，数论，DP

### F

签到，暴力判断每个字符串中是否有"bie"，把符合条件的进行字符串hash存储在哈希表（unordered_set）里。

```cpp
int n;
typedef unsigned long long ull;
unordered_set<ull> mp;
const int base=10000007;
int main(){
	 ios::sync_with_stdio(0);cin.tie(0);
	 cin>>n;
	 for(int i=1;i<=n;i++){
	 	int m;
	 	cin>>m;
	 	int f=1;
	 	for(int j=1;j<=m;j++){
	 		string s;
	 		cin>>s;
	 		for(unsigned k=2;k<s.size();k++){
	 			if(s[k-2]=='b'&&s[k-1]=='i'&&s[k]=='e'){
	 				ull hash=0;
	 				for(unsigned p=0;p<s.size();p++)
	 					hash=hash*base+s[p];
					if(mp.find(hash)==mp.end()){
						f=0;
						cout<<s<<endl;
						mp.insert(hash);
					}
	 				break;
				}
			}
		 }
		 if(f){
		 	cout<<"Time to play Genshin Impact, Teacher Rice!"<<endl;
		 }
	 }
	return 0;
}
```
### D

找规律题，写了个暴力后发现最终答案形式一定为$2x,x,x ,... ,x$。

~~吓死了，差点智商又被强奸了~~

``` cpp
int n,a[100005];
int main(){
	R(n);
	double sum=0;
	for(int i=1;i<=n;i++){
		R(a[i]);
		sum+=a[i];
	}
	double k=sum/(n+1);
	printf("%.8lf",k*2);
	for(int i=2;i<=n;i++)
		printf(" %.8lf",k);
	return 0;
}
```
### A

根据等差数列求和公式可知$$sum=\sum_{i=1}^{n}a_i+ns + \frac{n(n+1)}{2}d $$

题意即`$$ns + \frac{n(n+1)}{2}d+\sum_{i=1}^{n}a_i\equiv c(mod  \,m)$$`求任意一种s和d满足c最小。

令$g=gcd(n,\frac{n(n+1)}{2})$由裴蜀定理得$$nx+\frac{n(n+1)}{2}y = g$$的解$x_{1},y_{1}$。

我们只需要再求出$$gx+my=gcd(g,m)$$的解$x_{2},y_{2}$。

令$$k=\left \lfloor  \frac{\sum_{i=1}^{n}a_i}{gcd(g,m)}\right \rfloor$$

那么，$$min\{c\}=\sum_{i=1}^{n}a_i-(k \times gcd(g,m))$$ $$s=x_1 x_2 k$$ $$d=y_1 x_2 k$$

这里要注意，我们要求$s$和$d$均为非负整数且小于$m$，然而我~~当时犯唐~~受经典题的影响试图用`$ax+by\equiv c(mod \,m)$`的最小正整数解公式`$x=(x\%(b/g)+(b/g))\%(b/g)$`，但是这样并不能保证$y$也在范围内。最后发现只要两个值都进行`$x=(x\%m+m)\%m$`就解决了，~~属实唐完了~~

``` cpp
int n,m,a[100005];
void exgcd(int &x,int &y,int &g,int a,int b)
{
    if(!b)
    {
        x=1;
        y=0;
        g=a;
        return;
    }
    exgcd(x,y,g,b,a%b);
    int t=x;
    x=y;
    y=t-a/b*y;
}
signed main(){
	R(n);R(m);
	int sum=0;
	for(int i=1;i<=n;i++){
		R(a[i]);
		sum+=a[i];
	}
	sum%=m;
	int x1,y1,g1;
	exgcd(x1,y1,g1,n,n*(n+1)/2);
	x1=(x1%m+m)%m;
	y1=(y1%m+m)%m;
	int x2,y2,g2;
	exgcd(x2,y2,g2,g1,m);
	x2=(x2%(m)+(m))%(m);
	int k=-sum/g2;
	x1=(x1*k%m*x2%m+m)%m;
	y1=(y1*k%m*x2%m+m)%m;
	printf("%lld\n",sum+k*g2);
	printf("%lld %lld\n",x1,y1);
	return 0;
}
```
### C

发现"only a part of the item will be upgraded"这种情况只可能发生在最后一件可以使用的物品上。除此之外，对于任何使用的物品，使用顺序是无关紧要的。

所以改变物品的使用顺序相当于考虑每件物品取或不取，实际上可以转化成01背包问题。

那么我们正向做一遍01背包，反向做一遍01背包，再枚举最后一件使用的物品是什么，把结果拼起来即可。

特别地，当$\sum p_i \le k$时，我们直接全部选取即可。

``` cpp
int n,K;
int p[3005],w[3005][11];
int f[3005][3005],ff[3005][3005];
const int inf=-1e16;
signed main(){
	R(n);R(K);
	int sum=0;
	for(int i=1;i<=n;i++){
		R(p[i]);
		for(int j=1;j<=p[i];j++){
			R(w[i][j]);
		}
		sum+=p[i];
	}
	int ans=0;
	if(sum<=K){
		for(int i=1;i<=n;i++){
			ans+=w[i][p[i]];
		}
		printf("%lld\n",ans);
		return 0;
	}
	for(int i=0;i<=n+1;i++)
		for(int j=0;j<=K;j++)
			f[i][j]=ff[i][j]=inf;
	f[0][0]=ff[n+1][0]=0;
	for(int i=1;i<=n;i++){
		for(int j=0;j<p[i];j++) f[i][j]=f[i-1][j];
		for(int j=p[i];j<=K;j++)
			f[i][j]=max(f[i-1][j],f[i-1][j-p[i]]+w[i][p[i]]);
	}
	for(int i=n;i>=1;i--){
		for(int j=0;j<p[i];j++) ff[i][j]=ff[i+1][j];
		for(int j=p[i];j<=K;j++)
			ff[i][j]=max(ff[i+1][j],ff[i+1][j-p[i]]+w[i][p[i]]);
	}
	
	for(int i=1;i<=n;i++)
		for(int k=1;k<=p[i];k++)
			for(int j=0;j<=K-k;j++)
				ans=max(ans,f[i-1][j]+ff[i+1][K-k-j]+w[i][k]);	
	printf("%lld\n",ans);
	return 0;
}
```
 以下是Satori5ama在做这题时的唐氏操作：

 - dp数组没清成inf
 - 正向dp数组设成inf了没设置反向dp数组inf
 - 反向dp转移方程直接copy正向dp，然后忘了把i-1改成i+1
 - 没有特判$\sum p_i \le k$
 - 把$w_{i,j}$当成$p_i$加到$sum$里然后查半天查不出来，~~最后重写了一遍过了~~


___

其余题解咕。
