// 沒有用 ORM 的版本
// const mysql = require('mysql2');

// const pool = mysql.createPool({
// 	host: '127.0.0.1',
// 	user: 'root',
// 	database: 'node_complete',
// 	password: 'oo0981833393',
// 	port: '3306'
// })

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', 'oo0981833393', { dialect: 'mysql', host: 'localhost' })

module.exports = sequelize;