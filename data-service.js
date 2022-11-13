var employees = [];
var departments = [];
var fs = require("fs");
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data) => {
            if (err) reject("unable to read file");
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json', (err1, data1) => {
                if (err1) reject("unable to read file");
                departments = JSON.parse(data1);
                resolve();
            });
        });
    });
}

module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("no results returned");
        }
        resolve(employees);
    })
}

module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        let managers = [];
        for (i in employees) {
            if (employees[i]["isManager"] == true)
                managers.push(employees[i]);
        }
        if (managers.length == 0) {
            reject("no results returned");
        }
        resolve(managers);
    })
}

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        if (departments.length == 0) {
            reject("no results returned");
        }
        resolve(departments);
    })
}


module.exports.addEmployee = function (employeeData) {
    if (employeeData.isManager == undefined)
        employeeData.isManager = false
    else
        employeeData.isManager = true;
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    return new Promise((resolve, reject) => {
        if (employees.length == 0) {
            reject("no results");
        }
        else {
            resolve(employees);
        }
    })
};

module.exports.getEmployeeByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        let temp = employees.filter(employee => employee.status == status);
        if (temp.length == 0) {
            reject('no results');
        }
        resolve(temp);
    })
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        var temp = employees.filter(employee => employee.department == department);
        if (temp.length == 0) {
            reject('department not found');
        }
        resolve(temp);
    })
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        var temp = employees.filter(employee => employee.employeeManagerNum == manager);
        if (temp.length == 0) {
            reject('manager not found');
        }
        resolve(temp);
    })
};

module.exports.getEmployeeByNum = function (value) {
    return new Promise(function (resolve, reject) {
        var temp = employees.filter(employee => employee.employeeNum == value);
        if (temp.length == 0) {
            reject('no employee found');
        }
        resolve(temp);
    })
};

module.exports.updateEmployee=function(employeeData){
    console.log("finding");
    console.log(employeeData);
    return new Promise(function (resolve,reject) {
        for (i in employees) {
            if (employees[i].employeeNum == employeeData.employeeNum){
                console.log("match found");
                employees[i]=employeeData;
            }

            resolve();
        }
        reject();
    })
};