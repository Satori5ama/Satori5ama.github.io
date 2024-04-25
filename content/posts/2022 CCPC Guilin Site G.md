
+++
categories = ['笔记']
tags = ['ACM']
title = '2022 CCPC Guilin Site G'
slug = '2022-CCPC-Guilin-Site-G'
date = 2024-04-24T08:52:25+08:00
lastmod = 2024-04-24T19:52:25+08:00
draft = false
+++

Luckyblock写了就是我写了（

[2022 CCPC Guilin Site G - Luckyblock - 博客园 (cnblogs.com)](https://www.cnblogs.com/luckyblock/p/18129937)

``` cpp
const int MAXN=2e5+5;
int n;
int a[MAXN];
typedef pair<int,int> P;
vector<int> e[MAXN];
vector<P> d[MAXN];
void dfs1(int u=1,int f=0){
	for(auto v:e[u]){
		if(v==f) continue;
		dfs1(v,u);
		d[u].push_back(P((d[v].empty()?0:d[v][0].first)+a[v],v));
	}
	sort(d[u].begin(),d[u].end(),greater<P>());
}
void dfs2(int u=1,int f=0,int last=0){
	if(f)
		d[u].push_back(P(last,f));
	while(d[u].size()<4) d[u].push_back(P(0,0));
	sort(d[u].begin(),d[u].end(),greater<P>());
	for(auto v:e[u])
		if(v!=f)
			dfs2(v,u,d[u][0].second==v?d[u][1].first+a[u]:d[u][0].first+a[u]);
}
unordered_map<int,int> dp[MAXN];
inline int F(int i,int j){
	if(dp[i].count(j)) return dp[i][j];
	int p1=0;while(d[i][p1].second==j) ++p1;
	int p2=p1+1;while(d[i][p2].second==j) ++p2;
	int res=d[i][p1].first+d[i][p2].first+a[i];
	for(auto v:e[i])
		if(v!=j) res=max(res,F(v,i));
	return dp[i][j]=res;
}
int main(){
	R(n);
	for(int i=1;i<=n;i++) R(a[i]);
	for(int i=1;i<n;i++){
		int u,v;
		R(u);R(v);
		e[u].push_back(v);
		e[v].push_back(u);
	}
	dfs1();
	dfs2();
	int ans=0;
	for(int i=1;i<=n;i++)
		ans=max(ans,d[i][0].first+d[i][1].first+d[i][2].first+d[i][3].first);
		
	for(int i=1;i<=n;i++)
		for(auto j:e[i])
			ans=max(ans,F(i,j)+F(j,i));
	printf("%d\n",ans);
	return 0;
}
```
