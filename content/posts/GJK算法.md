+++
categories = ['题解']
tags = ['ACM', '计算几何']
title = '两凸包间距离——GJK算法（POJ 3608）'
slug = 'GJK-algorithm'
date = 2024-07-21T08:52:25+08:00
lastmod = 2024-07-21T19:52:25+08:00
draft = false
+++

起因：数模期末大作业，求空域在平面投影上相互之间最短距离是否小于安全距离。空域投影的形状有圆形，凸多边形，跑道形。

使用GJK算法的代码：

``` cpp 
#include<bits/stdc++.h>  
using namespace std;  
#define double long double  
#define x first  
#define y second  
#define MIN(a,b,c,d) (min(min(min(a,b),c),d))  
#define MAX(a,b,c,d) (max(max(max(a,b),c),d))  
typedef pair<double, double> P;  
typedef unsigned uint;  
const P origin = P(0, 0);  
const double eps = 1e-6;    
struct shape {  
    int type;  
    vector<P> poly;  
};  
inline P add(P a, P b) { return P(a.x + b.x, a.y + b.y); }  
inline P del(P a, P b) { return P(a.x - b.x, a.y - b.y); }  
inline P Minus(P a) { return P(-a.x, -a.y); }  
inline double dot(P a, P b) { return a.x * b.x + a.y * b.y; }  
inline double det(P a, P b) { return a.x * b.y - a.y * b.x; }  
inline P mul(P a, double b) { return P(a.x * b, a.y * b); }  
inline bool isEquals(P p1, P p2) {  
    return abs(p1.x - p2.x) < eps && abs(p1.y - p2.y) < eps;  
}  
inline double len(P a) { return sqrt(a.x * a.x + a.y * a.y); }  
inline P normalize(P a) { return P(a.x / len(a), a.y / len(a)); }  
inline P support_poly(vector<P> poly, P dir) {  
    P sup = poly[0];  
    double maxs = dot(sup, dir);  
    for (uint i = 0; i < poly.size(); i++) {  
        if (dot(poly[i], dir) > maxs) {  
            maxs = dot(poly[i], dir);  
            sup = poly[i];  
        }  
    }  
    return sup;  
}  
inline P support_circle(int ox, int oy, int r, P dir) {  
    return add(P(ox, oy), mul(normalize(dir), r));  
}  
inline P support(shape s, P dir) {  
    if (s.type == 1) {  
        double ox = (s.poly[0].x + s.poly[1].x + s.poly[2].x + s.poly[3].x) / 4.0,  
               oy = (s.poly[0].y + s.poly[1].y + s.poly[2].y + s.poly[3].y) / 4.0,  
               r = fabs((s.poly[0].y - s.poly[1].y) / 2.0);  
        return support_circle(ox, oy, r, dir);  
    }  
    if (s.type == 5) {  
        double r = fabs((s.poly[0].y - s.poly[1].y) / 2.0);  
        double ox1 = MIN(s.poly[0].x, s.poly[1].x, s.poly[2].x, s.poly[3].x) + r,  
               oy1 = (s.poly[0].y + s.poly[1].y) / 2.0;  
        double ox2 = MAX(s.poly[0].x, s.poly[1].x, s.poly[2].x, s.poly[3].x) - r,  
               oy2 = (s.poly[2].y + s.poly[3].y) / 2.0;  
        vector<P> poly;  
        poly.push_back(P(ox1, s.poly[0].y));  
        poly.push_back(P(ox1, s.poly[1].y));  
        poly.push_back(P(ox2, s.poly[2].y));  
        poly.push_back(P(ox2, s.poly[3].y));  
        P sup = support_poly(poly, dir);  
        double maxs = dot(sup, dir);  
        P res = support_circle(ox1, oy1, r, dir);  
        if (dot(res, dir) > maxs) {  
            maxs = dot(res, dir);  
            sup = res;  
        }  
        res = support_circle(ox2, oy2, r, dir);  
        if (dot(res, dir) > maxs) {  
            maxs = dot(res, dir);  
            sup = res;  
        }  
        return sup;  
    }  
    return support_poly(s.poly, dir);  
}
inline double calcTriangleArea(P p1, P p2, P p3) {  
    return fabs(det(del(p2, p1), del(p3, p1))) / 2.0;  
}  
inline bool isContainOrigin(P p1, P p2, P p3) {  
    double s1 = calcTriangleArea(origin, p1, p2);  
    double s2 = calcTriangleArea(origin, p1, p3);  
    double s3 = calcTriangleArea(origin, p2, p3);  
    double s = calcTriangleArea(p1, p2, p3);  
    return fabs(s1 + s2 + s3 - s) < eps;  
}  
inline P GetNextDirection(P a, P b) {  
    P ab = del(b, a), ao = del(origin, a);  
    return P(-ab.y * det(ab, ao), ab.x * det(ab, ao));  
}  
inline P NearestPointToOrigin(P a, P b) {  
    if (isEquals(a, b)) return Minus(a);  
    P ab = del(b, a), ba = del(a, b), ap = Minus(a), bp = Minus(b);  
    if (dot(ab, ap) > 0 && dot(ba, bp) > 0) {  
        return mul(normalize(GetNextDirection(a, b)), fabs(det(ab, ap) / len(ab)));  
    }  
    return len(a) < len(b) ? Minus(a) : Minus(b);  
}  
inline bool isinaline(P a, P b, P c) {  
    return fabs(det(del(a, b), del(a, c))) < eps;  
}
inline double GJK(shape p, shape q, P D) {  
    P A = del(support(p, D), support(q, Minus(D)));  
    vector<P> simplex;  
    simplex.push_back(A);  
    P B = del(support(p, Minus(D)), support(q, D));  
    simplex.push_back(B);  
    if (isinaline(A, B, origin)) return 0;  
    D = NearestPointToOrigin(A, B);  
    while (true) {  
        P C = del(support(p, D), support(q, Minus(D)));  
        A = simplex[0]; simplex.pop_back();  
        B = simplex[1]; simplex.pop_back();  
        if (isContainOrigin(A, B, C)) return 0;  
        double da = dot(A, D), db = dot(B, D), dc = dot(C, D);  
        if (fabs(da - dc) < eps || fabs(db - dc) < eps) return len(D);  
        P p1 = NearestPointToOrigin(A, C), p2 = NearestPointToOrigin(B, C);  
        simplex.push_back(C);  
        double len1 = len(p1), len2 = len(p2);  
        if (len1 < len2) {  
            simplex.push_back(A);  
            D = p1;  
        } else {  
            simplex.push_back(B);  
            D = p2;  
        }  
    }  
}  
  
shape s[105];  
double h1[105], h2[105], t1[105], t2[105];  
const double hc = 0.3, pc = 5, tc = 1.5;  
  
int main() {  
    freopen("data.in", "r", stdin);  
    freopen("data.out", "w", stdout);  
    int id = 0;  
    while (scanf("%d", &id) != EOF) {  
        scanf("%d", &s[id].type);  
        if (s[id].type == 1 || s[id].type == 5) {  
            for (int i = 0; i < 4; i++) {  
                double u, v;  
                scanf("%Lf%Lf", &u, &v);  
                s[id].poly.push_back(P(u, v));  
            }  
        } else {  
            for (int i = 0; i < s[id].type + 2; i++) {  
                double u, v;  
                scanf("%Lf%Lf", &u, &v);  
                s[id].poly.push_back(P(u, v));  
            }  
        }  
        scanf("%Lf%Lf%Lf%Lf", &h1[id], &h2[id], &t1[id], &t2[id]);  
    }  
    for (int i = 1; i <= id; i++) {  
        for (int j = i + 1; j <= id; j++) {  
            if (((h2[j] < h1[i] && h1[i] - h2[j] >= hc) ||  
                 (h2[i] < h1[j] && h1[j] - h2[i] >= hc)) ||  
                ((t2[j] < t1[i] && t1[i] - t2[j] >= tc) ||  
                 (t2[i] < t1[j] && t1[j] - t2[i] >= tc)) ||  
                GJK(s[i], s[j], P(1, 0)) >= pc)  
                continue;  
            printf("%d %d\n", i, j);  
        }  
    }  
    return 0;  
}
```
发现POJ 3608其实是这个问题的一个子集，稍微改改输入部分可以通过板子题POJ 3608。

[POJ 3608 -- Bridge Across Islands](http://poj.org/problem?id=3608)
``` cpp
int main() { 
	int n,m;
    while(scanf("%d%d",&n,&m)!=EOF&&(n!=0||m!=0)){
		shape p,q;
		p.type=q.type=2;
		for(int i=1;i<=n;i++){
			double u,v;
		 	scanf("%Lf%Lf",&u,&v);
		 	p.poly.push_back(P(u,v));
		}
		for(int i=1;i<=m;i++){
			double u,v;
			scanf("%Lf%Lf",&u,&v);
			q.poly.push_back(P(u,v));
		}
		printf("%.5Lf\n",GJK(p, q, P(1, 0)));
	}
    return 0;  
}
```


