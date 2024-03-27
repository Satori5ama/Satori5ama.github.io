
+++
categories = ['笔记']
tags = ['网安', 'Web']
title = 'Hugo文章密码绕过的简单实验'
slug = 'hugo-article-password-bypass'
date = 2024-03-27T08:52:25+08:00
lastmod = 2024-03-27T19:52:25+08:00
draft = false
+++

前情提要：

笔者在搭建博客的时候，发现有给自己的博客文章加上密码功能的实现。实现方式如下。

【参考文献：[Hugo | 为博客文章添加密码 – Zoe's Dumpster. (tantalum.life)](https://blog.tantalum.life/posts/encrypted-blog-posts/)】

在`layouts/_default/single.html`中添加：

``` html
    <div class="post-password">
        {{ if ( .Params.password | default "" ) }}
        <script>
			(function(){
                if (prompt('请输入文章密码') != {{ .Params.password }}){
						alert('密码错误！');
						if (history.length === 1) {
							window.opener = null;
							window.open('', '_self');
							window.close();
						} else {
							history.back();
						}
					}
			})();
        </script>
        {{ end }}
    </div>
```
然后把密码放在markdown文件的头部。

``` markdown
---
title = '这是一个标题'
password = '123'
---
```

密码效果如下（用自己博客的副本，在本地运行hugo测试）：

![enter image description here](https://pic.imgdb.cn/item/660409a19f345e8d039087a5.png)


注意到这个密码功能是用js写的，再加上这个密码验证是一个弹窗，让我想起了之前在pikachu靶场打过的客户端验证码绕过。这里的密码验证能不能通过相同的逻辑绕过呢？

随便输入一个密码，弹出密码错误窗口，

![enter image description here](https://pic.imgdb.cn/item/660409ff9f345e8d0393b0b9.png)

用bp抓包，未捕获到相关数据包，说明密码是在前端验证的。（~~静态博客哪里有后端~~ )

那么我们直接将访问该页面的请求抓包，发送给Repeater。

![enter image description here](https://pic.imgdb.cn/item/66040b3c9f345e8d039ecf5e.png)

在Repeater中发送后收到服务器的应答，获得网页html。注意这里如果出现网页304的情况就清理一下缓存。

![enter image description here](https://pic.imgdb.cn/item/66040c069f345e8d03a615ef.png)

此时可以直接在render中查看。

也可以复制出来放在html文件中，删掉报头后将密码验证部分的js代码删掉。
![enter image description here](https://pic.imgdb.cn/item/66040d429f345e8d03b11328.png)

此时双击html文件就可以查看内容。

![enter image description here](https://pic.imgdb.cn/item/66040de69f345e8d03b6983f.png)

证明这种方式实现的前端验证的密码是可以绕过的。所以这种密码验证只具备观赏性，安全性等于没有，不建议将隐私内容以这种方式放在博客上。对于Hexo等其他静态博客理论上也是成立的。

因为是js校验的，所以猜测把js直接禁掉也是可以直接绕过的的。

这再次验证了一个道理，一切前端的校验都是不安全的，因为~~你不知道用户会对你的网页做什么~~。

另外，如果你和我一样用Github Page搭博客，众所周知Github Page只有Public仓库能使用，所以整个博客上的内容都是公开的，可以直接到Github里把整个博客的源码扒下来，所以不存在什么用密码能保护的东西……




