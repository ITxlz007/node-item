// 将封装的函数直接导出
module.exports = (sql, values, cb) => {
    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'yingxiong',
        multipleStatements: true
    });
    conn.connect();
    conn.query(sql, values, cb);
    conn.end();
}