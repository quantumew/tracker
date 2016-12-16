"use strict";

var container, depends, Dizzy, libModules;

Dizzy = require("dizzy");
container = new Dizzy();
container.register("container", container);

// Lib modules registered as a factories.
libModules = {
    analyzer: "./analyzer",
    fileManager: "./file-manager",
    logger: "./logger",
    promisifier: "./promisifier",
    runner: "./runner",
    time: "./time",
    Timesheet: "./timesheet",
    timesheetFactory: "./timesheet-factory"
};
container.registerBulk(libModules).fromModule(__dirname).asFactory().cached();

// Third party dependencies
depends = {
    bluebird: "bluebird",
    consoleTable: "console.table",
    fs: "fs",
    jsonFile: "jsonfile",
    Log: "log",
    mkdirp: "mkdirp",
    Moment: "moment",
    neodoc: "neodoc",
    path: "path",
    promise: "bluebird",
    readLine: "readline"
};
container.registerBulk(depends).fromModule(__dirname);
container.register("fsAsync", "promisifier").fromContainer().asFactory("fs").cached();
container.register("jsonFileAsync", "promisifier").fromContainer().asFactory("jsonFile").cached();
container.register("mkdirpAsync", "promisifier").fromContainer().asFactory("mkdirp").cached();
module.exports = container;
