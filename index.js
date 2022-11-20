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
                texthelper.red('Add Employee'),
                texthelper.red('Update Employee Role'),
                texthelper.green('View All Roles'),
                texthelper.green('Add Role'),
                texthelper.cyan('View All Departments'),
                texthelper.cyan('Add Department'),
                texthelper.black('Exit Program')],
      name: 'role'
    },
  ]);
  switch(texthelper.decode(data.role)) {
    case 'View All Employees':
      display_employees();
      break;
    case 'Add Employee':
      await add_employee();
      break;
    case 'View All Roles':
      display_roles();
      break;
    case 'Add Role':
      await add_role();
      break;
    case 'View All Departments':
      display_depts();
      break;
    case 'Add Department':
      await add_dept();
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
  // console.log(data.role);
  // console.log(role_titles);
  // console.log(data.manager);
  // console.log(data.first,' ',role_id,' ',manager_id);
  await db.addEmployee(data.first,data.last,role_id,manager_id);
  console.log(texthelper.yellow(`Added new employee ${data.first} ${data.last} to the database.`));
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