"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
function error(str) {
    console.error(chalk_1.default.bold.red('Error: ' + str));
}
exports.error = error;
function command(str) {
    console.log(chalk_1.default.blue.bold(str));
}
exports.command = command;
