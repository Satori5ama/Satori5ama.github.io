

网安笔记

虚拟机模块（使用VMware）

1.虚拟机分辨率调小一点，不然很卡。


2.NAT网络设置

[vmware虚拟机上网设置教程（vmware虚拟机设置网络）-CSDN博客](https://blog.csdn.net/wxb880114/article/details/130222102)

这个分为两部分，第一个部分是设置虚拟机上的网络，这部分可以使得虚拟机可以连接外部网络。

![](https://img-blog.csdnimg.cn/img_convert/1019fe8f40268908906a80bf45105290.png)

![](https://img-blog.csdnimg.cn/img_convert/1d9ccbe357ebf312c4d095b688032aa5.png)

![](https://img-blog.csdnimg.cn/img_convert/e047efe7724745b0e9b1afdad2343c88.png)

但是我们还需要使主机可以和虚拟机通信，这部分通过VMware Network Adapter VMnet8设置。

![](https://img-blog.csdnimg.cn/img_convert/61638eb3d80c34c8df9d2a96dcd76052.png)

注意这里VMnet8不建议使用自动分配ip，否则容易使用192.168.1.1与网关ip冲突。

UPD：建议将网关设置成192.168.1.2，VMnet8地址设置为192.168.1.1，

[小白级根治VMware NAT模式无法上网的方案 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/597491598)

3.共享文件夹

由于VMware tools安装失败所以采取了共享文件夹的方式。

把主机上的网络改成专用网络（很重要），否则虚拟机无法发现主机。

关闭密码保护的共享，因为这个选项的实际效果是让这个网络位置根本无法访问。关闭后访问时依然要输密码。

[【VMware】VMware虚拟机与主机之间文件共享配置_vmware 共享文件夹-CSDN博客](https://blog.csdn.net/qq_52201194/article/details/128644016)

[Linux下的共享文件夹设置](https://zhuanlan.zhihu.com/p/650638983)


然后虚拟机访问的时候可能会没有权限，这个时候我们在共享文件夹的安全设置里添加一个Everyone，然后把权限设置为全开。

网络设置使用的是NAT，桥接似乎是不行的。

[为什么共享文件夹同步不了？6种方法帮您解决！ (abackup.com)](https://www.abackup.com/easybackup-tutorials/why-cannot-shared-folders-sync-6540.html)


4.pikachu搭建

利用phpstudy搭建靶场，

[Pikachu超详细靶场搭建教程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/568493971)

[pikachu靶场搭建时Unknown database ‘pikachu‘报错解决_unknown database 'pikachu-CSDN博客](https://blog.csdn.net/m0_56741167/article/details/131760590)

5.kali

[kali登录界面键盘无法输入问题](https://blog.csdn.net/weixin_71982689/article/details/127688313?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2~default~CTRLIST~Rate-1-127688313-blog-127120605.235%5Ev40%5Epc_relevant_anti_vip&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2~default~CTRLIST~Rate-1-127688313-blog-127120605.235%5Ev40%5Epc_relevant_anti_vip&utm_relevant_index=1)

[kali扩盘](https://zhuanlan.zhihu.com/p/574737232?utm_id=0)
