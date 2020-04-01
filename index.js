const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

const app = express();

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST_IP,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

app.use(cors());

app.listen(8000, () => {
	console.log(`App server now listening on port 8000`);
});

app.get('/test', (req, res) => {
	const { table } = req.query;

	pool.query(`select * from ${table}`, (err, results) => {
		if (err) {
			return res.send(err);
		} else {
			return res.send(results);
		}
	});
});