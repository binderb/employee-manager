# Employee Manager

## Description

A Node.js command line tool that manages a MySQL database containing data on a company's departments, roles, and employees using interactive prompts. The project includes the following features in accordance with the challenge guidelines:
- Proper setup of the `.gitignore` file to prevent `node_modules` and other extraneous system files from being tracked.
- Use of the **Inquirer** package to gather user input.
- Robust command line UX/UI to guide the user through various database operations, including **input validation** where necessary.
- Use of the **MySQL 2** package to establish a connection to a local MySQL database and perform operations.
- Use of the **dotenv** package to read database credentials into the environment from a `.env` file.
- Use of the **console.table** package to format query results.

The following database operations can be performed using the tool:
- View data pertaining to all existing **departments**, **roles**, and **employees**.
- View **employees** within a given **department** or under a given **manager**.
- View the **total departmental budget** for a given **department**.
- Add **departments**, **roles**, and **employees** to the database.
- Delete **departments**, **roles**, and **employees** from the database.
- Update **employee** data by assigning a different **role** or **manager**.

## Usage

### Package Installation

Use of the tool requires **Node.js** and relies on the **Inquirer**, **MySQL 2**, **console.table**, **dotenv**, and **figlet** packages as additional dependencies. After cloning the repo, run `npm i` in the project root directory to install all dependencies. 

### Database/Connection Setup

In order for the tool to run properly, you must have a MySQL server installed and running locally, and the server must provide access to a database called `employee_db` with the structure specified in `db/schema.sql`. In order to set this up, enter your MySQL shell and run

    source db/schema.sql

to generate the database, and

    source db/seeds.sql

to populate the database with sample data, if desired.

You must also specify your MySQL user credentials in a `.env` file, which should be located in the root directory of the repo. Use the provided `.env.EXAMPLE` file as a template.

### Using the Tool

After all prior setup steps are complete, run

    node index.js

Follow the command line prompts to interact with the database, and select `Exit Program` from the main menu when finished to gracefully end execution.

### Walkthrough

🎥 A video walkthrough of the application can be viewed [here](https://drive.google.com/file/d/18G0SMTMYb7X6ztFVIw5YjsPOvMqTrjrq/view).

## Credits

General specifications for database structure and CLI workflow were provided by the UofM Coding Bootcamp (Trilogy Education Services); all code was written by the developer.

## License

Please refer to the LICENSE in the repo.
