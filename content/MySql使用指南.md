---
title: MySql使用指南
category: 分享
tags:
- sql
date: 2021-07-07
vssue-title: MySql使用指南

---

## 介绍

mysql是开源的关系型数据库

### sql是什么？

SQL是结构化查询语言的缩写，用来访问和操作数据库系统，sql拥有以下几种能力：

1. DDL：允许用户定义数据，也就是创建表、删除表、修改表结构这些操作。通常，DDL由数据库管理员执行。
2. DML：为用户提供添加、删除、更新数据的能力，这些是应用程序对数据库的日常操作。
3. DQL：允许用户查询数据，这也是通常最频繁的数据库日常操作。

约定：SQL关键字总是大写，表明和列名小写

SQL是抽象的、无关实现的，优化器会自动选择最优的计划。

### 时区

mysql默认使用美国东8区时间，连接数据库时，添加属性：`?parseTime=True&loc=Local`使用本地时区

### 关系模型

表的每一行称为记录（Record），每一列称为字段（Column）

#### 主键

不能重复，唯一性，不应修改，选取主键的原则：不使用任何业务相关的字段作为主键。一般使用自增整数型作为主键（BIGINT）

#### 联合主键

多个字段唯一标识记录，也就是两个或者更多的字段设置为主键，非必要情况，尽量不要使用联合主键，它给关系表带来了复杂度的上升。

#### 外键

通过外键可以把数据与另外一张表关联起来。外键不是通过列名实现的，需要定义外键约束：

```
ALTER TABLE students   //
ADD CONSTRAINT fk_class_id // 任意
FOREIGN KEY (class_id)  // 指定外键名称
REFERENCES classes (id); // 指定了外键关联到classes表的id列

```

通过外键约束，可以保证无法插入无效的数据，比如外键id的值不存在关联表中时则无法插入。

由于外键约束会影响性能，大部分公司不设置外键约束。

#### 多对多

通过一个中间表可以，关联两个1对多关系，就形成了多对多关系。

#### 一对一

一个表的记录对应到另一个表的唯一一个记录。有的时候一个大表拆成两个一对一的表，目的是把经常读取和不经常读取的字段分开，以获得更高的性能

#### 索引

索引是关系数据库中对某一列或多个列的值进行预排序的数据结构。通过使用索引，可以让数据库系统不必扫描整个表，而是直接定位到符合条件的记录，这样就大大加快了查询速度。

索引的效率取决于索引列的值是否散列，即该列的值如果越互不相同，那么索引效率越高

可以对一张表创建多个索引。索引的优点是提高了查询效率，缺点是在插入、更新和删除记录时，需要同时修改索引，因此，索引越多，插入、更新和删除记录的速度就越慢。

索引是典型的空间换时间方法。

关系数据库会自动对其创建主键索引

## 安装

下载地址：https://dev.mysql.com/downloads/mysql/

安装完dmg文件后，在系统偏好设置中可以看到mysql

命令行配置文件添加`export PATH=${PATH}:/usr/local/mysql/bin`

此时可以通过密码登录了：`mysql -u root -p`

输入`exit`推出命令行模式

## 语法

### 注释

以`--`开头的是注释

### 查询

#### 基本查询

```sql
SELECT * FROM <表名>
```

SELECT为关键字表示查询，*表示所有列，FROM表示从哪个表查

SELECT不是必须带上FROM，SELECT还可以用来做计算操作`SELECT 100+200`,还可以通过`SELECT 1;`来测试数据库连接。

#### 条件查询

使用where语句设定查询条件，语法：`SELECT * FROM <表名> WHERE <条件表达式>`

表达式中可以使用`AND`、`OR`、`NOT`。

`NOT class_id = 2`其实等价于`class_id <> 2`，因此，`NOT`查询不是很常用。

如果不加括号，则按照`NOT、AND、OR`的优先级进行

编写复杂的条件语句时，使用`()`改变优先级

`LIKE`用来表示相似，语法：`name LIKE 'ab%'`,%表示任意字符，例如'ab%'将匹配'ab'，'abc'，'abcd'

`WHERE 60 <= score <= 90`，意思是`score >=60 or score <=90`

#### 投影查询

默认的查询是把所有列都查出来，使用`SELECT 列1，列2，列3`让结果集包含指定列，称为投影查询,

投影查询时可以使用别名：`SELECT 列1 别名1，列2 别名2`

#### 排序

默认按照主键排序，想修改排序顺序使用`ORDER BY`，默认是升序，降序需要添加`DESC`,例如:`SELECT id, name, gender, score FROM students ORDER BY score DESC;`

如果排序相等可以再添加排序条件：`SELECT id, name, gender, score FROM students ORDER BY score,gender`

#### 分页

分页实际上就是从结果集中“截取”出第M~N条记录,语法:`LIMIT 10 OFFSET 0`,OFFSET是可选的。

mysql中`LIMIT 15 OFFSET 30`可以简写成`LIMIT 30,15`,随着OFFSET越来越大，查询效率也会越来越低

#### 聚合查询

sql提供了一些工具函数，使用这些函数查询也称为聚合查询。

**COUNT()**:查询表有多少条数据，返回的结果只有一行一列，名为`COUNT(*)`，为了方便处理结果，应该设置一个别名：`SELECT COUNT(*) num FROM students;`

除了COUNT，还有`SUM、AVG、MAX、MIN`，`MAX()`和`MIN()`函数并不限于数值类型。如果是字符类型，`MAX()`和`MIN()`会返回排序最后和排序最前的字符。

要特别注意：如果聚合查询的`WHERE`条件没有匹配到任何行，`COUNT()`会返回0，而`SUM()`、`AVG()`、`MAX()`和`MIN()`会返回`NULL`

**分组聚合**:当我们要查询多个字段的数量时，使用`GROUP BY`,聚合查询只能放入分组的列

#### 多表查询

语法：`SELECT * FROM students,classes`,返回结果是两张表的`乘积`，即两个表的列数为相加的关系，行数为相乘的关系。

这种多表查询又称为笛卡尔查询，由于两个表的列一起返回，很有可能会有重复列名，所以应该使用别名：

```sql
SELECT
    students.id sid,
    students.name,
    students.gender,
    students.score,
    classes.id cid,
    classes.name cname
FROM students, classes;
```

因为要使用`表名.列名`的方式访问有些繁琐，所以还可以给表名设置别名：

```sql
SELECT
    s.id sid,
    s.name,
    s.gender,
    s.score,
    c.id cid,
    c.name cname
FROM students s, classes c;
```

#### 连接查询

另一种多表查询方式，先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。

**内连接**

`INNER JOIN`表示要连接的表，`ON`表示连接条件。INNER JOIN只返回同时存在于两张表的行数据

```
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id;
```

**外连接**

RIGHT OUTER JOIN返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以`NULL`填充剩下的字段。

LEFT OUTER JOIN则返回左表都存在的行。

FULL OUTER JOIN，它会把两张表的所有记录全部选择出来，并且，自动把对方不存在的列填充为NULL

#### 强制指定索引

在查询的时候，数据库系统会自动分析查询语句，并选择一个最合适的索引。但是很多时候，数据库系统的查询优化器并不一定总是能使用最优索引。如果我们知道如何选择索引，可以使用`FORCE INDEX`强制查询使用指定的索引。例如：

```sql
SELECT * FROM students FORCE INDEX (idx_class_id) WHERE class_id = 1 ORDER BY id DESC;		
```



### 修改

#### INSERT

插入数据必须使用`INSERT`语句，语法:`INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);`

段顺序不必和数据库表的字段顺序一致，但值的顺序必须和字段顺序一致。

还可以一次性插入多个值,使用`()`分隔：

```sql
INSERT INTO students (class_id, name, gender, score) VALUES
  (1, '大宝', 'M', 87),
  (2, '二宝', 'M', 81);
```

如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就更新该记录，此时，可以使用`INSERT INTO ... ON DUPLICATE KEY UPDATE ...`语句：

```
INSERT INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99) ON DUPLICATE KEY UPDATE name='小明', gender='F', score=99;

```

更新的字段由`UPDATE`决定。

如果要插入的数据已存在，那么想什么也不做，此时，可以使用`INSERT IGNORE INTO ...`语句：

```
INSERT IGNORE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99);
```

当想从SELECT结果集中插入到表中，使用：`INSERT INTO statistics (class_id, average) SELECT class_id, AVG(score) FROM students GROUP BY class_id;`

#### REPLACE

如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就先删除原记录，再插入新记录。此时，可以使用`REPLACE`语句，这样就不必先查询，再决定是否先删除再插入：

```
REPLACE INTO students (id, class_id, name, gender, score) VALUES (1, 1, '小明', 'F', 99);
```



#### UPDATE

语法：`UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;`

这里的where与select中的一致，也就是说可以一次更新多条记录：`UPDATE students SET name='小牛', score=77 WHERE id>=5 AND id<=7;`

更新字段时，可以使用表达式,复用字段原值：`UPDATE students SET score=score+10 WHERE score<80;`

#### DELETE

语法：`DELETE FROM <表名> WHERE ...;`

如果删除的数据关联了从表，那么会有两种情况：

1. 创建外键时定义了ON DELETE CASCADE,关联数据被自动删除
2. 没有定义ON DELETE CASCADE则报错

## 命令行

 MySQL Client的可执行程序是mysql，MySQL Server的可执行程序是mysqld。

### 连接数据库

`mysql -u root -p`

#### 连接远程数据库

```
mysql -h 10.0.1.99 -u root -p
```

### 查看所有数据库

`SHOW DATABASES;`

其中：information_schema、mysq、 performance_schema 、sys是系统库，不要改动

### 创建数据库

`CREATE DATABASE xxx;`

#### 使用数据库

`use xxx`

### 删除数据库

`DROP DATABASE test;`

### 查看所有表

`SHOW TABLES;`

### 查看表结构

`DESC test`

### 查看创建表的SQL语句

`SHOW CREATE TABLE students;`

### 创建数据表

- 如果你不想字段为 **NULL** 可以设置字段的属性为 **NOT NULL**， 在操作数据库时如果输入该字段的数据为**NULL** ，就会报错。
- AUTO_INCREMENT定义列为自增的属性，一般用于主键，数值会自动加1。
- PRIMARY KEY关键字用于定义列为主键。 您可以使用多列来定义主键，列间以逗号分隔。
- ENGINE 设置存储引擎，CHARSET 设置编码。

```sql
CREATE TABLE IF NOT EXISTS `runoob_tbl`(
   `runoob_id` INT UNSIGNED AUTO_INCREMENT,
   `runoob_title` VARCHAR(100) NOT NULL,
   `runoob_author` VARCHAR(40) NOT NULL,
   `submission_date` DATE,
   PRIMARY KEY ( `runoob_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### 快照

如果想要对一个表进行快照，即复制一份当前表的数据到一个新表，可以结合`CREATE TABLE`和`SELECT`：

```sql
-- 对class_id=1的记录进行快照，并存储为新表students_of_class1:
CREATE TABLE students_of_class1 SELECT * FROM students WHERE class_id=1;
```



### 删除表

`DROP TABLE test;`

### 修改表

添加

```
ALTER TABLE students ADD COLUMN birth VARCHAR(10) NOT NULL;
```

修改

`ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;`

删除

`ALTER TABLE students DROP COLUMN birthday;`

## 事务

### 介绍

某些业务要求，一系列操作必须全部执行，如果其中有一个失败那么其他必须全部撤销。这种把多条语句作为一个整体进行操作的功能，被称为数据库*事务*。

对于单条SQL语句，数据库系统自动将其作为一个事务执行，这种事务被称为*隐式事务*。

要手动把多条SQL语句作为一个事务执行，使用`BEGIN`开启一个事务，使用`COMMIT`提交一个事务，这种事务被称为*显式事务*：

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

当我们想要主动失败时，可以使用`ROLLBACK`回滚事务

### 隔离级别

mysql中，默认的隔离级别是`Repeatable Read`。当并发操作同一条数据的时候可能会出现数据不一致的问题，通过隔离级别可以有针对性的进行处理。SQL标准定义了4种级别：

| Isolation Level  | 脏读（Dirty Read） | 不可重复读（Non Repeatable Read） | 幻读（Phantom Read） |
| :--------------- | :----------------- | :-------------------------------- | :------------------- |
| Read Uncommitted | Yes                | Yes                               | Yes                  |
| Read Committed   | -                  | Yes                               | Yes                  |
| Repeatable Read  | -                  | -                                 | Yes                  |
| Serializable     | -                  | -                                 | -                    |

脏读（Dirty Read）：一个事务会读到另一个事务更新后但未提交的数据，如果另一个事务回滚，那么当前事务读到的数据就是脏数据

不可重复读：在一个事务内，多次读同一数据，在这个事务还没有结束时，如果另一个事务恰好修改了这个数据，那么，在第一个事务中，两次读取的数据就可能不一致。

幻读：在一个事务中，第一次查询某条记录，发现没有，但是，当试图更新这条不存在的记录时，竟然能成功，并且，再次读取同一条记录，它就神奇地出现了。

虽然`Serializable`隔离级别最严格，不会出现问题，但是性能会大大下降。

## 配置

### Host

当指定user表中的host时，表示只有指定的ip才能访问，如果设置值为`%`，则表示所有ip都可以访问。

## 最佳实践

1. 字段设置为不允许为null，加快查询速度。
2. 把表中不经常读取的数据拆分成其他表，提高查询速度。
3. 使用索引加速查询
4. 不要在where语句中写复杂的运算，妨碍sql优化
5. .语句过大，大量的表join会导致中间结果集不准确，从而限制优化器选择较好的执行计划。
6. [其他](https://www.zhihu.com/question/29619558/answer/1920919756)

## 问题

### mysql语法顺序？

```sql
select[distinct]  
from  
join（如left join）  
on  
where  
group by  
having  
union  
order by  
limit  
```

### mysql执行顺序？

```
from  
on  
join  
where  
group by  
having  
select  
distinct  
union  
order by  
```

### mysql一次性插入和批量插入哪个方式性能好？

一般情况下不是数据量太大的话，一次性插入性能更好。参考文章：https://www.imooc.com/article/291781
