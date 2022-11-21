const q = require('inquirer');
require('console.table');
const figlet = require('figlet');
const texthelper = require('./lib/texthelper');
const EmployeeDB = require('./lib/EmployeeDB');

const db = new EmployeeDB();

init();

/*------------------------------
Initialization
------------------------------*/

async function init () {
  db.connect();
  const figlet_config = {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }
  const title_text = figlet.textSync('Employee Manager',figlet_config);
  console.log('================================================\n\n',
              title_text,
              '\n\n================================================\n');
  await prompt_main_menu();
}

/*------------------------------
Menu Logic
------------------------------*/

async function prompt_main_menu () {
  const data = await q.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: [texthelper.red('View All Employees'),
                texthelper.red('View Employees by Department'),
                texthelper.red('View Employees by Manager'),
                texthelper.red('Add Employee'),
                texthelper.red('Update Employee Role/Manager'),
                texthelper.red('Delete Employee'),
                texthelper.green('View All Roles'),
                texthelper.green('Add Role'),
                texthelper.green('Delete Role'),
                texthelper.cyan('View All Departments'),
                texthelper.cyan('View Departmental Budget'),
                texthelper.cyan('Add Department'),
                texthelper.cyan('Delete Department'),
                texthelper.black('Exit Program')],
      name: 'role'
    },
  ]);
  switch(texthelper.decode(data.role)) {
    case 'View All Employees':
      display_employees();
      break;
    case 'View Employees by Department':
      display_by_dept();
      break;
    case 'View Employees by Manager':
      display_by_manager();
      break;
    case 'Add Employee':
      await add_employee();
      break;
    case 'Update Employee Role/Manager':
      await update_employee_role();
      break;
    case 'Delete Employee':
      await delete_employee();
      break;
    case 'View All Roles':
      display_roles();
      break;
    case 'Add Role':
      await add_role();
      break;
    case 'Delete Role':
      await delete_role();
      break;
    case 'View All Departments':
      display_depts();
      break;
    case 'View Departmental Budget':
      await display_dept_budget();
      break;
    case 'Add Department':
      await add_dept();
      break;
    case 'Delete Department':
      await delete_dept();
      break;
    default:
      await prompt_exit();
  }
}

async function prompt_exit() {
  const data = await q.prompt([
    {
      type: 'confirm',
      message: 'End program?',
      name: 'quit'
    }
  ]);
  if (data.quit) {
    console.log('Exiting program. Have a nice day!');
    db.end();
  } else {
    await prompt_main_menu();
  }
}

/*------------------------------
"View All" functions
------------------------------*/

async function display_employees () {
  const employees = await db.getEmployees();
  console.table('\n',employees);
  await prompt_main_menu();
}

async function display_roles () {
  const roles = await db.getRoles();
  console.table('\n',roles);
  await prompt_main_menu();
}

async function display_depts () {
  const depts = await db.getDepts();
  console.table('\n',depts);
  await prompt_main_menu();
}

async function display_by_manager () {
  const employee_data = await db.getEmployees();
  const manager_names = [];

  for (employee of employee_data) {
    if (employee.manager !== '-' && !manager_names.includes(employee.manager)) manager_names.push(employee.manager);
  }
  const manager_data = [];
  for (manager of manager_names) manager_data.push(employee_data.filter(e => e.first_name+' '+e.last_name === manager)[0]);
  const manager_list = [];
  for (manager of manager_data) manager_list.push(manager.first_name + ' ' + manager.last_name + ' ('+manager.department+')');
  const data = await q.prompt([
    {
      type: 'list',
      message: 'Whose subordinates do you want to view?',
      name: 'manager',
      choices: manager_list
    }
  ]);
  const subordinates = employee_data.filter(e => e.manager == manager_names[manager_list.indexOf(data.manager)]);
  console.log(`\nSubordinates of ${texthelper.yellow(data.manager)}:\n`);
  console.table(subordinates);
  await prompt_main_menu();
}

async function display_by_dept () {
  const employee_data = await db.getEmployees();
  const dept_data = await db.getDepts();
  const dept_names = dept_data.map(e => e.name);

  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which department do you want to view?',
      name: 'dept',
      choices: dept_names
    }
  ]);
  const members = employee_data.filter(e => e.department == data.dept);
  console.log(`\nMembers of the ${texthelper.yellow(data.dept)} department:\n`);
  console.table(members);
  await prompt_main_menu();
}

async function display_dept_budget () {
  const dept_data = await db.getDepts();
  const dept_names = dept_data.map(e => e.name);
  const dept_ids = dept_data.map(e => e.id);
  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which departmental budget do you want to view?',
      name: 'dept',
      choices: dept_names
    }
  ]);
  const budget = await db.getDeptBudget(dept_ids[dept_names.indexOf(data.dept)]);
  console.table('\n',budget);
  await prompt_main_menu();
}

/*------------------------------
"Add" functions
------------------------------*/

async function add_dept () {
  const data = await q.prompt([
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'dept_name',
      validate: confirmInputNonEmptyString
    }
  ]);
  await db.addDept(data.dept_name);
  console.log(texthelper.yellow(`Added ${data.dept_name} department to the database.`));
  await prompt_main_menu();
}

async function add_role () {
  const dept_data = await db.getDepts();
  const dept_names = dept_data.map(e => e.name);
  const dept_ids = dept_data.map(e => e.id);

  const data = await q.prompt([
    {
      type: 'input',
      message: 'What is the name of the role?',
      name: 'role_name',
      validate: confirmInputNonEmptyString
    },
    {
      type: 'input',
      message: 'What is this role\'s annual salary?',
      name: 'salary',
      validate: confirmInputNumber
    },
    {
      type: 'list',
      message: 'Which department does this role belong to?',
      name: 'dept',
      choices: dept_names
    }
  ]);
  const dept_id = dept_ids[dept_names.indexOf(data.dept)];
  await db.addRole(data.role_name,data.salary,dept_id);
  console.log(texthelper.yellow(`Added ${data.role_name} role to the database.`));
  await prompt_main_menu();
}

async function add_employee () {
  const role_data = await db.getRoles();
  const role_titles = role_data.map(e => e.title);
  const role_ids = role_data.map(e => e.id);
  const employee_data = await db.getEmployees();
  const employee_names = ['None',...employee_data.map(e => e.first_name+' '+e.last_name)];
  const employee_ids = [null,...employee_data.map(e => e.id)];

  const data = await q.prompt([
    {
      type: 'input',
      message: 'What is the employee\'s first name?',
      name: 'first',
      validate: confirmInputNonEmptyString
    },
    {
      type: 'input',
      message: 'What is the employee\'s last name?',
      name: 'last',
      validate: confirmInputNonEmptyString
    },
    {
      type: 'list',
      message: 'What is the employee\'s role?',
      name: 'role',
      choices: role_titles
    },
    {
      type: 'list',
      message: 'Who is the employee\'s manager?',
      name: 'manager',
      choices: employee_names
    }
  ]);
  const role_id = role_ids[role_titles.indexOf(data.role)];
  const manager_id = employee_ids[employee_names.indexOf(data.manager)];
  await db.addEmployee(data.first,data.last,role_id,manager_id);
  console.log(`Added new employee ${texthelper.yellow(data.first)} ${texthelper.yellow(data.last)} to the database.`);
  await prompt_main_menu();
}

/*------------------------------
"UPDATE" Functions
------------------------------*/

async function update_employee_role () {
  const role_data = await db.getRoles();
  const role_titles = role_data.map(e => e.title);
  const role_ids = role_data.map(e => e.id);
  const employee_data = await db.getEmployees();
  const employee_names = employee_data.map(e => e.first_name+' '+e.last_name);
  const employee_ids = employee_data.map(e => e.id);
  const employee_manager_names = ['None',...employee_names];
  const employee_manager_ids = [null,...employee_ids];

  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which employee\'s role/manager do you want to update?',
      name: 'employee',
      choices: employee_names
    },
    {
      type: 'list',
      message: 'Which role do you want to assign to the selected employee?',
      name: 'role',
      choices: role_titles
    },
    {
      type: 'list',
      message: 'Who is the employee\'s new manager?',
      name: 'manager',
      choices: employee_manager_names
    }
  ]);
  const employee_id = employee_ids[employee_names.indexOf(data.employee)];
  const role_id = role_ids[role_titles.indexOf(data.role)];
  const manager_id = employee_manager_ids[employee_manager_names.indexOf(data.manager)];
  await db.updateEmployeeRole(employee_id,role_id,manager_id);
  console.log(`Updated ${texthelper.yellow(data.employee)} with the role of ${texthelper.yellow(data.role)} in the database.`);
  await prompt_main_menu();
}

/*------------------------------
"DELETE" Functions
------------------------------*/

async function delete_dept () {
  const dept_data = await db.getDepts();
  const dept_names = dept_data.map(e => e.name);
  const dept_ids = dept_data.map(e => e.id);

  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which department do you want to remove?',
      name: 'dept',
      choices: dept_names
    }
  ]);
  const dept_id = dept_ids[dept_names.indexOf(data.dept)];
  await db.deleteDept(dept_id);
  console.log(`Removed department ${texthelper.yellow(data.dept)} from the database.`);
  await prompt_main_menu();
}

async function delete_role () {
  const role_data = await db.getRoles();
  const role_titles = role_data.map(e => e.title);
  const role_ids = role_data.map(e => e.id);

  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which role do you want to remove?',
      name: 'role',
      choices: role_titles
    }
  ]);
  const role_id = role_ids[role_titles.indexOf(data.role)];
  await db.deleteRole(role_id);
  console.log(`Removed role ${texthelper.yellow(data.role)} from the database.`);
  await prompt_main_menu();
}

async function delete_employee () {
  const employee_data = await db.getEmployees();
  const employee_names = employee_data.map(e => e.first_name+' '+e.last_name);
  const employee_ids = employee_data.map(e => e.id);

  const data = await q.prompt([
    {
      type: 'list',
      message: 'Which employee do you want to remove?',
      name: 'employee',
      choices: employee_names
    }
  ]);
  const employee_id = employee_ids[employee_names.indexOf(data.employee)];
  await db.deleteEmployee(employee_id);
  console.log(`Removed employee ${texthelper.yellow(data.employee)} from the database.`);
  await prompt_main_menu();
}

/*------------------------------
Input Validation Functions
------------------------------*/

function confirmInputNonEmptyString (input) {
  if (input.trim() !== '') return true;
  else return 'You must provide an answer here.';
}

function confirmInputNumber (input) {
  if (!isNaN(parseInt(input)) && parseInt(input) > 0) return true;
  else return 'You must provide a positive integer value.';
}