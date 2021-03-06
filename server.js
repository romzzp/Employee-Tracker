const mysql = require("mysql");
const inquirer = require("inquirer");
const { config } = require("process");
const logo = require("asciiart-logo");
require("console.table");
display();

function display() {
    const logoText = logo({ name: "Employee-Tracker" }).render();
    console.log(logoText);
}

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vrz126117",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) console.log(err);
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
        if (err) console.log(err);
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
        if (err) console.log(err);
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
        if (err) console.log(err);
        console.table(res);
        console.log("All Roles were viewed");
        employeeSearch();
    });
}

function empPay() {
    var query = `SELECT CONCAT(e.first_name, ' ', e.last_name) AS EMPLOYEE, r.salary AS SALARY
    FROM employee e
      LEFT JOIN role r
        ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
        ON m.id = e.manager_id`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        console.log("All Employees' salary were viewed.");
        employeeSearch();
    });
}

function isManager() {
    var query = `SELECT CONCAT (e.first_name, ' ', e.last_name) AS Manager, r.title, r.salary 
    FROM employee e 
    LEFT JOIN role r
        ON e.role_id = r.id
      LEFT JOIN department d
      ON d.id = r.department_id
      LEFT JOIN employee m
        ON m.id = e.manager_id
    WHERE e.manager_id IS NOT NULL`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        console.log("All managers were viewed.");
        employeeSearch();
    });
}

function addNewEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "input",
                name: "role_id",
                message: "What is the employee's role id?"
            },
            {
                type: "input",
                name: "manager_id",
                message: "What is the employee's manager id?"
            }
        ]).then(function (res) {
            var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            connection.query(query, [res.first_name, res.last_name, res.role_id, res.manager_id], function (err) {
                if (err) console.log(err);
                console.log("Successfully added a new employee.");
                updateEmployeeData();
                employeeSearch();
            });
        });
}

function addNewDepartment() {
    inquirer
        .prompt(
            [{
                type: "input",
                name: "department_name",
                message: "What Department would you like to add?"
            }
            ]).then(function (answer) {
                var query = "INSERT INTO department (name) VALUE (?)";
                connection.query(query, answer.department_name, function (err) {
                    if (err) console.log(err);
                    console.log(`Successfully added: ${answer.department_name}`);
                    updateDepartment();
                    employeeSearch();
                });
            });
}

function addNewRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Describe the employee's new role."
            },
            {
                type: "input",
                name: "department_id",
                message: "What is the employee's department id?"
                // choices: [1,2,3,4]
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this employee for this role?",
            }
        ]).then(function (res) {
            var query = "INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)";
            connection.query(query, [res.title, res.department_id, res.salary], function (err) {
                if (err) console.log(err);
                console.log(`Successfully added role for: ${res.title}`);
                updateRole();
                employeeSearch();
            });
        });
}

function updateEmployeeData() {
    var query = `SELECT * FROM employee`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        console.log("Successfully updated the employee table.");
        employeeSearch();
    });
}

function updateDepartment() {
    var query = `SELECT * FROM department`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        console.log("Successfully updated the department table.");
        employeeSearch();
    });
}

function updateRole() {
    var query = `SELECT * FROM role`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        console.log("Successfully updated the role table");
        employeeSearch();
    });
}

function updatedDB() {
    var query = `select * from employee`;
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res);
        employeeSearch();
    });
}

function updateDatabase() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "empID",
                message: "Enter the ID of the employee you want to update."
            },
            {
                type: "input",
                name: "newTitle",
                message: "Enter the new title"
            },
            {
                type: "input",
                name: "newSalary",
                message: "Enter the new salary"
            },
            {
                type: "input",
                name: "newDeptID",
                message: "Enter the new department ID."
            }
        ]).then(function (answer) {
            var query = "UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?";
            connection.query(query, [answer.newTitle, answer.newSalary, answer.newDeptID, parseInt(answer.empID)], function (err) {
                if (err) console.log(err);
                console.log("Successfully updated the employee.");
                updateRole();
                employeeSearch();
            });
        })
}

function rmEmployee() {
    var empId = "SELECT * FROM employee ORDER BY id"
    connection.query(empId, function (err, res) {
        if (err) console.log(err);
        var empArr = [];
        for (var i = 0; i < res.length; i++) {
            empArr.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
        }
        console.log(empArr);

        inquirer.prompt([
            {
                type: "list",
                message: "Please select the employee you want to remove!",
                choices: empArr,
                name: "rmEmp"
            }
        ]).then(function (res) {
            var parse = parseInt(res.rmEmp.split(" "));
            var query = `DELETE FROM employee WHERE id = ${parse}`;
            connection.query(query, function (err) {
                if (err) console.log(err);
                console.log("Successfully removed employee.");
                employeeSearch();
            });
        })
    });
}
// employeeSearch();