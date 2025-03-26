# Excel to SQL

这是一个简单而实用的工具，用于将Excel文件转换为SQL插入语句。它可以自动读取Excel文件的内容，并生成对应的SQL INSERT语句。

## 功能特点

- 支持.xls和.xlsx格式的Excel文件
- 自动识别Excel文件中的所有字段
- 自动处理缺失字段，使用NULL填充
- 正确处理特殊字符，自动进行SQL转义
- 生成标准的SQL INSERT语句
- 支持交互式选择要转换的文件

## 环境要求

- Node.js环境
- 需要安装以下npm包：
  - xlsx
  - mysql

## 安装

1. 确保已安装Node.js
2. 在项目目录下运行以下命令安装依赖：

```bash
npm install
```

## 使用方法

1. 将要转换的Excel文件放在项目根目录下
2. 在命令行中运行：

```bash
node index.js
```

3. 程序会列出当前目录下所有的.xls和.xlsx文件
4. 输入要转换的文件编号
5. 选择SQL生成方式：
   - 输入1：每条记录生成一个独立的INSERT语句
   - 输入2：所有记录合并成一个INSERT语句
6. 程序会自动生成与Excel文件同名的SQL文件（扩展名为.sql），其中包含所有的SQL插入语句

## 注意事项

- 生成的SQL表名将使用Excel文件名（不含扩展名）
- 所有字段名会被反引号(`)包裹
- 字符串类型的值会被单引号包裹并进行适当转义
- 空值会被转换为NULL

## 示例

如果有一个名为`users.xlsx`的文件，运行程序后：

```bash
Available files:
1. users.xlsx
Please select a file by entering its number: 1
Please select SQL generation mode (1: One INSERT per record, 2: Single INSERT with multiple records): 2
```

程序将根据选择的生成方式，生成`users.sql`文件。

如果选择方式1（每条记录一个INSERT），生成的SQL语句格式如下：

```sql
INSERT INTO `users` (`id`, `name`, `email`) VALUES (1, 'John Doe', 'john@example.com');
INSERT INTO `users` (`id`, `name`, `email`) VALUES (2, 'Jane Smith', 'jane@example.com');
```

如果选择方式2（所有记录合并），生成的SQL语句格式如下：

```sql
INSERT INTO `users` (`id`, `name`, `email`) VALUES 
(1, 'John Doe', 'john@example.com'),
(2, 'Jane Smith', 'jane@example.com')
```

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。