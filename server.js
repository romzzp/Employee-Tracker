var mysql = require("mysql");
var inquirer = require("inquirer");
const { config } = require("process");
const logo = require("asciiart-logo");
require("console.table");
display();

function display() {
    const logoText = logo({ name: "Employee-Tracker" }).render();
    console.log(logoText);
}

var connection = mysql.createConnection({
    host: "localhost",
    port: 3006,
    user: "root",
    password: "vrz126117",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    employeeSearch();
});

function employeeSearch() {
    inquirer
        .prompt({
            type: "list",
            name: "company",
            message: "What would you like to do?",
            choices: [
                "Look up all the employees in the company.",
                "Look up employees' department.",
                "Look up employees' role.",
                "Look up employees' pay",
                "Look up managers in the company",
                "Add a new employee.",
                "Add a new Department",
                "Add a new role",
                "Remove Employee",
                "Update Employee Info",
                "Show updated database",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.company) {
                case "Look up all the employees in the company.":
                    employeeData();
                    break;
                case "Look up employees' department.":
                    empDepartment();
                    break;
                case "Look up employees' role.":
                    empRole();
                    break;
                case "Look up employees' pay":
                    empPay();
                    break;
                case "Look up managers in the company":
                    isManager();
                    break;
                case "Add a new employee.":
                    addNewEmployee();
                    break;
                case "Add a new Department":
                    addNewDepartment();
                    break;
                case "Add a new role":
                    addNewRole();
                    break;
                case "Remove Employee":
                    rmEmployee();
                    break;
                case "Update Employee Info":
                    updateDatabase();
                    break;
                case "Show updated database":
                    updatedDB();
                    break;
                case "EXIT":
                    connection.end();
            }
        });
}

function employeeData() {
    var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("All employees were viewed.");
        employeeSearch();
    });
}

function empDepartment() {
    var query = `SELECT d.id, d.name AS Department, r.salary AS salary 
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
        ON m.id = e.manager_id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("All Departments were viewed.");
        employeeSearch();
    });
}

function empRole() {
    var query = `SELECT r.title AS ROLE, r.id, CONCAT (e.first_name, ' ', e.last_name) AS EMPLOYEE 
    FROM employee e
      LEFT JOIN role r
        ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
        ON m.id = e.manager_id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("All Roles were viewed");
        employeeSearch();
    });
}