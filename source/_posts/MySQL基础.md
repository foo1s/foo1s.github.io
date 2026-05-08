---
title: MySQL基础
date: 2025-05-08 15:39:07
tags:
  - 数据库
  - MySQL
categories:
  - DataBase
  - MySQL
---
>MySQL8.4安装教程
>[Windows安装Mysql8.4,看这一篇就够了（超级详细！）\_mysql8.4安装教程-CSDN博客](https://blog.csdn.net/m0_65663088/article/details/140001290)

#### 常用操作
```MySQL
- 开启操作：`net start MySQL84`
- 关闭操作：`net stop MySQL84`（或者在计算机管理服务中进行开启关闭）
- 显式连接：`mysql -uzhw -pzhw0401 -h<> -p<> <database>`
- 隐式连接：`mysql -uzhw -p -h127.0.0.1`
- 查看版本信息：`select version();`
- 退出连接：`exit`

- 创建新的用户：CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
- 查看用户密码：SELECT User, authentication_string FROM mysql.user WHERE User='你的用户名';
- 重置密码：ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
- FLUSH PRIVILEGES;
```

#### 基本概念
- 一条完整的数据的存储的过程：
	创建库-->定字段-->创建表-->插数据

#### SQL语句命名的规定与规范
##### 标识符命名规定
- 数据库名、表名不得超过30个字符，变量名限制为29个
- 必须只能包含 A–Z, a–z, 0–9, 共63个字符，而且不能数字开头
- 数据库名、表名、字段名等对象名中间不能包含空格
- 同一个MySQL软件中，数据库不能同名；同一个库中，表不能重名；同一个表中，字段不能重名https://dev.mysql.com/doc/refman/8.0/en/keywords.html
- 必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在SQL语句中使用` （着重号）引起来

##### 标识符命名规范
- 注释应该清晰、简洁地解释 SQL 语句的意图、功能和影响。
- 库、表、列名应该使用小写字母，并使用下划线（)或驼峰命名法。
- 库、表、字段名应该简洁明了，具有描述性，反映其所存储数据的含义。
- 库名应于对应的程序名一致 例如：程序名为 EcommercePlatform 数据库名命名为ecommerce_platform"
- 表命名最好是遵循 “业务名称_表”的作用  例如：alipay_task 、 force_project、 trade_config 
- 列名应遵循“表实体_属性”的作用 例如：product_name 或 productName

#### MySQL所有条件操作符
```MySQL
=
!=
<
<=
>
>=
between
```
