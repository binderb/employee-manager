const EmployeeDB = require('./lib/EmployeeDB');

const db = new EmployeeDB();

async function init () {
  db.connect();
  const depts = await db.getDepts();
  console.log(depts);
  db.end();
}

init();