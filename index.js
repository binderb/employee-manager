const q = require('inquirer');
const figlet = require('figlet');
const texthelper = require('./lib/texthelper');
const EmployeeDB = require('./lib/EmployeeDB');

const db = new EmployeeDB();


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

init();