const mysql = require('mysql2');
const dotenv = require('dotenv');
require('dotenv').config();

class EmployeeDB {
  constructor () {
    this.db;
  }

  async connect () {
    const dbConfig = {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PSWD,
      database: process.env.DB_NAME
    }
    try {
      this.db = mysql.createConnection(dbConfig, console.log('Connected to database.')).promise();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getDepts () {
    const results = await this.db.query('SELECT * FROM department');
    return results[0];
  }

  end () {
    this.db.end();
  }
}

module.exports = EmployeeDB;