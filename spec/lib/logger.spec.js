"use strict";

describe("logger", () => {
    var loggerFactory;

    beforeEach(() => {
        loggerFactory = require("../../lib/logger");
        require("console.table");
        spyOn(console, "log");
        spyOn(console, "error");
        spyOn(console, "table");
    });

    describe("constructor", () => {
        var log;

        beforeEach(() => {
            log = loggerFactory({}, false);
        });

        it("prints to log from info", () => {
            log.info("something1");
            expect(console.log).toHaveBeenCalledWith("something1");
        });

        it("prints to error from error", () => {
            log.error("something3");
            expect(console.error).toHaveBeenCalledWith("something3");
        });

        it("prints to error from warn", () => {
            log.warn("something4");
            expect(console.error).toHaveBeenCalledWith("WARN: something4");
        });

        it("prints to log from console", () => {
            log.console("something2");
            expect(console.log).toHaveBeenCalledWith("something2");
        });

        it("does not print to error from debug", () => {
            log.debug("something5");
            expect(console.error).not.toHaveBeenCalledWith("something5");
        });

        it("prints a table", () => {
            log.table("test");
            expect(console.table).toHaveBeenCalledWith("test");
        });
    });

    describe("constructor with debug set", () => {
        var log;

        beforeEach(() => {
            log = loggerFactory({}, true);
        });

        it("prints to error from debug", () => {
            log.debug("something");
            expect(console.error).toHaveBeenCalledWith("DEBUG: something");
        });
    });
});
