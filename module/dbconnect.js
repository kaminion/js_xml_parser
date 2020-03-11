const mysql = require('mysql2');

const connection = mysql.createConnection({

    host : 'localhost',
    user : 'maeulmedia',
    password: "maeul200207",
    database: 'maeulmedia'

});

module.exports = {mysql, connection};