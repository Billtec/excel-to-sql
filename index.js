const XLSX = require('xlsx');
const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');

// 获取当前目录下的所有.xls和.xlsx文件
const files = fs.readdirSync('./').filter(file => file.endsWith('.xls') || file.endsWith('.xlsx'));

// 输出文件列表并让用户选择
console.log('Available files:');
files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
});

// 创建readline接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 获取用户选择的文件索引
rl.question('Please select a file by entering its number: ', (selectedFileIndexStr) => {
    const selectedFileIndex = parseInt(selectedFileIndexStr) - 1;

    // 检查用户选择的文件索引是否有效
    if (selectedFileIndex < 0 || selectedFileIndex >= files.length) {
        console.error('Invalid selection. Please try again.');
        rl.close();
        process.exit(1);
    }

    // 读取用户选择的Excel文件
    const workbook = XLSX.readFile(files[selectedFileIndex]);
    const sheet_name_list = workbook.SheetNames;
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // 获取所有记录的字段并集
    const allFieldNames = new Set();
    excelData.forEach(row => {
        Object.keys(row).forEach(fieldName => {
            allFieldNames.add(fieldName);
        });
    });

    // 确保每个记录都有相同的字段数量
    const completeData = excelData.map(row => {
        // 创建一个新对象，确保所有字段都存在
        const completeRow = {};
        allFieldNames.forEach(fieldName => {
            completeRow[fieldName] = (row[fieldName] === undefined) ? null : row[fieldName]; // 如果字段不存在，使用null填充
        });
        return completeRow;
    });

    // 从第一行开始，因为第一行是字段名
    const sqlStatements = completeData.map(row => {
        const values = Object.values(row).map(value => {
            // 对特殊字符进行转义
            return mysql.escape(value);
        });
        // 生成SQL插入语句，使用反引号包裹字段名
        const fieldNamesEscaped = Array.from(allFieldNames).map(fieldName => {
            return mysql.escapeId(fieldName);
        });
        return `INSERT INTO ${mysql.escapeId(files[selectedFileIndex].split('.')[0])} (${fieldNamesEscaped.join(', ')}) VALUES (${values.join(', ')})`;
    });

    // 获取表名作为输出文件名
    const tableName = files[selectedFileIndex].split('.')[0];
    const outputFileName = `${tableName}.sql`;

    // 将SQL语句保存至对应的sql文件
    fs.writeFileSync(outputFileName, sqlStatements.join(';\n'));

    console.log(`SQL statements have been saved to ${outputFileName}`);
    rl.close();
});
