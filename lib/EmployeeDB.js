const mysql = require('mysql2');
const fs = require('fs');
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

  async getEmployees () {
    const queryString = fs.readFileSync('./db/get_employees.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }

  async getRoles () {
    const queryString = fs.readFileSync('./db/get_roles.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }

  async getDepts () {
    const queryString = fs.readFileSync('./db/get_departments.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }

  end () {
    this.db.end();
  }
}

module.exports = EmployeeDB;