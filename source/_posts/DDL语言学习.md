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
DDL语言主要用于定义和管理数据库的结构，包括库，表，索引，视图等数据库对象的创建与修改
不涉及对数据的操作，而是更关注于数据库的结构与元数据
### DDL常用操作
#### DDL常用语言
```MySQL
create 

alter

drop

show databases/columns/tables from column/status/ create database/ grants/..
```

#### 检索数据
```MySQL
select column1,column2 from table;

select * from table // 所有列

select distinct column from table //去重，应用于所有列

select column from table limit 5,4 //从行5开始的4行

```

#### 排序检索数据
```MySQL
select pro_name from prroducts order by pro_name 选择一个列进行排序


select prod_id,prod_price,prod_xx from products order by prod_id,prod_price;
按照多个列进行排序


select prod_id,prod_price,prod_xx from products order by prod_id desc; 降序
哪个列降序就把desc放在哪个列的后面

```

#### 过滤数据
```MySQL
select pro_name from products where pro_price=2.5 过滤price=2.5的数值
-->注意将order by语句放在where之后

select pro_name from products where pro_price between 5 and 10 ; >and

select cust-ID FROM coutomers WHERE cust-EMAIL IS NULL; >NULL

----组合where语句---
select xx,xx,xx from xx where xx=a and xx=b  >and

select xx,xx,xx from xx where xx=a and xx=b  >or
and的优先级高于or,最好使用()进行合理区分

select columns1, column2 from table where id in (100,200) order by xx  >in

select columns1, column2 from table where id  not in (100,200) order by xx  >not
```

#### 使用通配符进行过滤
- 为了在搜索语句中使用通配符，必须使用LIKE操作符
- 操作符何时不是操作符，当它作为谓词的时候

- 百分号`%`通配符
```MySQL
select prod_id,pro_name from products wher prod_name like 'jet%';
```
	- 注意尾空格，`%`不会匹配尾空格
	- `%`不能匹配NULL

- 下划线`_`通配符
```MySQL
select xx from xx where pro_name like '_ '
```
	- `只能匹配一个字符`

#### 使用正则表达式进行搜索
- 默认不区分大小写
##### 基本字符匹配
```MySQL
select pro_name
from products
where pro_name REGEXP '.100'
order by pro_name

1. 进行or匹配
REGEXP '100|200'

2.匹配几个or字符
REGEXP '[^123] ton'
REGEXP '[1-3] ton'

3.匹配特殊字符
'\\ .'
使用\\作为转义字符

4.匹配字符类

5.匹配多个实例

6.定位符
^ (插入符号)：
将匹配限制在字符串的开头。
例如，^abc 只匹配以 "abc" 开头的字符串。

$ (美元符号)：
将匹配限制在字符串的结尾。
例如，xyz$ 只匹配以 "xyz" 结尾的字符串
```
- `.` 可以匹配任意字符
- `LIKE`匹配整个列，如果被匹配文本在列值中出现，则LIKE将不会找到他


#### 创建计算字段
##### 计算字段
- 计算字段是在运行时，在select()语句内部进行创建的
##### 拼接字段
```MySQL
1.MySQL:将两个列拼接起来：
-Concat()

2.一般的DBMS系统
-使用+或者||

select Concat(Rtrim(xx)),'(',Rtrim(xx)),')' as xxx
```
##### 执行算数计算
```MySQL
select id,num,price,num*price as all_price
from orintity 
whhere origin_num = 2005;
```

