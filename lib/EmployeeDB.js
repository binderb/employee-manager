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

  async getDepts () {
    const queryString = fs.readFileSync('./db/get_departments.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }
  
  async getRoles () {
    const queryString = fs.readFileSync('./db/get_roles.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }

  async getEmployees () {
    const queryString = fs.readFileSync('./db/get_employees.sql','utf8');
    const results = await this.db.query(queryString);
    return results[0];
  }

  async addDept (dept_name) {
    const queryString = fs.readFileSync('./db/add_department.sql','utf8');
    const results = await this.db.query(queryString,dept_name);
  }

  async addRole (role_title, role_salary, dept_id) {
    const queryString = fs.readFileSync('./db/add_role.sql','utf8');
    const results = await this.db.query(queryString,[role_title, role_salary, dept_id]);
  }

  async addEmployee (first, last, role, manager) {
    const queryString = fs.readFileSync('./db/add_employee.sql','utf8');
    const results = await this.db.query(queryString,[first, last, role, manager]);
  }

  async updateEmployeeRole (id, role_id, manager_id) {
    const queryString = fs.readFileSync('./db/update_employee_role.sql','utf8');
    const results = await this.db.query(queryString,[role_id, manager_id, id]);
  }

  end () {
    this.db.end();
  }
}

module.exports = EmployeeDB;