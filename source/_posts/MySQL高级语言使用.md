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
### 视图
- 视图是**虚拟的表**，在select层面简化检索数据的查询操作
- 每次使用视图时，都必须处理查询执行时所需的任一检索

### 使用视图
#### 视图基本语法
```MySQL
create view

show create view viewname

drop 
```

#### 利用视图简化复杂的联结
```MySQL
create view product as
select xx,xx,xx
from table1,table2,table3
where table1.id = table2.num
	  table1.num = table3.num
```
#### 利用视图重新格式化检索出的数据
```MySQL
```
#### 利用视图过滤不想要的数据
```MySQL
```
#### 使用视图与计算字段
```MySQL
```
#### 更新视图
```MySQL
```
- 如果MySQl不能准确的确定被更新数据的基数据，则不允许更新（包括插入与删除）
- 一般情况下将试图用于检索而不是更新
### 使用存储过程
#### 存储过程
- 存储过程的好处：简单，安全，高性能
#### 使用存储过程
##### 执行存储过程
- CALL接受存储过程中的名字以及需要传递给它的任一参数
```MySQL
call product(
	@xxx
	@xxx
	@xxx
)
```

##### 创建存储过程
```MySQL
1.简单示例
create PROCEDURE AS priceaverage
BEGIN
 SELECT AVG(privce) AS priceverge
 FROM products
END;

2.mysql命令行客户机的分隔符
DELIMITER // 
为了解释存储过程内部的;字符
除了\符号为外，任何字符均可以

3.使用此存储过程
call priceaverage();
```

##### 带参数创建
```MySQL
DELIMITER //

CREATE PROCEDURE GetUserInfo(
    IN userId INT,
    OUT userName VARCHAR(255),
    OUT userEmail VARCHAR(255)
)
BEGIN
    SELECT name, email
    INTO userName, userEmail
    FROM users
    WHERE id = userId;
END //

DELIMITER ;

in:传入存储过程 入参
out:传出存储过程
into 保存至特定的变量

call(250,
@userName,
@userEmail
);

select @userName
```

##### 建立智能存储过程
```MySQl
DELIMITER //

CREATE PROCEDURE ApplyOrderDiscount(
    IN orderId INT
)
BEGIN
    DECLARE orderAmount DECIMAL(10, 2);  //定义了两个局部变量
    DECLARE discountAmount DECIMAL(10, 2); 

    -- 获取订单金额
    SELECT order_amount INTO orderAmount
    FROM orders
    WHERE order_id = orderId;

    -- 根据订单金额应用折扣
    IF orderAmount >= 1000 THEN
        SET discountAmount = orderAmount * 0.1; -- 10% 折扣
    ELSEIF orderAmount >= 500 THEN
        SET discountAmount = orderAmount * 0.05; -- 5% 折扣
    ELSE
        SET discountAmount = 0; -- 无折扣
    END IF;

    -- 更新订单表
    UPDATE orders
    SET order_amount = orderAmount - discountAmount,
        discount_applied = 1
    WHERE order_id = orderId;

    -- 返回折扣金额 (可选)
    SELECT discountAmount;

END //

DELIMITER ;
```
### 游标
- 游标时存储在MySQL服务器上的数据库查询，他并不是一条select语句，而是被该语句检索出来的结果集
- **MYSQL游标只能用于存储过程**
#### 使用游标
##### 创建游标
```MySQl
create procedure processorder()
begin 
	declare ordernaumbers CURSOR
	for
	select order_num from orders
end;
```
##### 打开于关闭游标
```MySQL
open ordernumbers;
close ordernumbers
```

##### 使用游标数据
```MySQL
fetch 语句用来分别访问游标的每一行

declare local variables
declare o int;
	declare ordernaumbers CURSOR
	for
	select order_num from orders
open ordernaumbers
fetch ordernaumbers into o //从第一行开始到一个名为o的局部变量中
```

##### 更为复杂的游标数据
```MySQL
declare done boolean default 0;
declare o int;

declare ordernumbers cursor
for 
select order_num from orders;

declare continue handler for SQLSTATE '02000' set done 1;

open ordernumbers
repeat
 fetch ordernumbers into o;
until done end repeat;

close ordernumbers;

end;
```

### 使用触发器
- 触发器时MySQl响应以下语句而自动执行的一条MySQL语句
	- insert
	- delete
	- update
#### 创建触发器
```MySQL
1.触发器名称
2.关联的表
3.响应的活动
4.触发器何时执行
```

#### 删除触发器
```MySQL
drop trigger newsxx;
```

#### 使用触发器
##### insert触发器
- 引用`new`虚拟表，访问被插入的行
- 在before触发器中，new中的值也可以被更新
- 对于auto_inrement列，new在执行前包含0，在执行后包含自动生成的值
```MySQL
create trigger neworder after insert on orders
for each row select NEW.order_num
```
##### delete触发器
- 引用一个名为`old`的虚拟表，访问被删除的行
- `old`中的值全部是只读的，不能更新

##### update触发器
- 在update触发器中，你可以引用一个`old`虚拟表访问以前的值，引用一个名为`new`的虚拟表访问新更新的值。
- `old`中的值全部是只读的，不能更新

### 事物处理
#### 事物处理概要
- 事物处理可以用来维护数据库的完整性，它保证成批的MySQL指令要不完全执行，要不完全不执行。
- 常用术语：
	- 事务
	- 回退
	- 提交
	- 保留点
#### 控制事物处理
```MySQL
start transaction
```
##### 使用rollback来回退指令
```MySQL
start transaction

rollback;
```
- 事物处理用来管理insert,updata,delete语句

##### 使用commit进行显示提交
- 一般的MySQl语句都是直接针对数据库执行和编写的，提交操作是自动进行的。
- 在事物处理板块，为了进行明确的提交，需要使用commit语句

##### 使用保留点
- 为了支回退部分的事物处理，必须能在事物处理块中合适的位置放置占位符
```MySQL
savepoint delete1;
rollback to dalete;
```
- 释放保留点：保留点在事物处理完成后自动释放

##### 更改默认行为
```MySQl
set autocommit=0; 不自动提交更改
```
- autocommit标志决定是否自动提交更改

### 全球化于本地化
#### 字符集与校对顺序
- 字符集：字母与字符的集合·
-  编码：某个字符集成员的内部指令
- 校对：规定字符如何比较的指令

#### 使用字符集与校对顺序
```MySQL
show character set
show collation
```
### 安全管理
#### 访问控制
#### 管理用户
```MySQL
use mysql
select user from user
```
- 获取所有的用户账号列表

#### 创建用户账号
```MySQl
create user name identified by 'zx ' 

set password for name = Password('xxxx') //修改用户口令
```

#### 设置访问权限
```MySQL
show grants for xxx;
grant select on database.* to name;
```