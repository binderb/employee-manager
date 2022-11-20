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
    case 'View All Roles':
      display_roles();
      break;
    case 'View All Departments':
      display_depts();
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