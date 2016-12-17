"use strict";

describe("runner", () => {
    var bluebird, container, fsMock, jsonFileMock, loggerMock, mkdirp, mockRequire, mockTimesheet, Moment, neodocMock, runner, stat, timeMock, tm;

    beforeEach(() => {
        mockRequire = require("mock-require");
        container = mockRequire.reRequire("../../lib/container");
        bluebird = container.resolve("bluebird");
        mkdirp = jasmine.createSpy("mkdirpAsync").andReturn(bluebird.resolve());
        fsMock = jasmine.createSpyObj("fsAsync", [
            "readFileAsync",
            "statAsync"
        ]);
        loggerMock = require("../mock/logger-mock")();
        jsonFileMock = jasmine.createSpyObj("jsonFileAsync", [
            "writeFileAsync"
        ]);
        stat = {
            isFile: jasmine.createSpy("stat.isFile").andReturn(true)
        };
        fsMock.statAsync.andReturn(bluebird.resolve(stat));
        container.register("debug", false);
        container.register("fsAsync", fsMock);
        container.register("jsonFileAsync", jsonFileMock);
        container.register("neodoc", neodocMock);
        container.register("mkdirpAsync", mkdirp);
        mockTimesheet = JSON.stringify({
            currentTimesheet: "code",
            timesheets: {
                "code-review": {
                    name: "code-review",
                    entries: [
                        {
                            id: 0,
                            tag: "stuff",
                            description: "",
                            in: "2016-12-11T20:17:19-06:00",
                            out: "2016-12-11T20:19:07-06:00"
                        },
                        {
                            id: 1,
                            tag: "stuff",
                            description: "",
                            in: "2016-12-11T21:22:54-06:00",
                            out: "2016-12-11T22:05:34-06:00"
                        }
                    ],
                    currentEntry: 1
                },
                code: {
                    name: "code",
                    entries: [
                        {
                            id: 0,
                            tag: "stuff",
                            description: "",
                            in: "2016-12-11T22:03:12-06:00",
                            out: "2016-12-11T22:03:12-06:00"
                        },
                        {
                            id: 1,
                            tag: "stuff",
                            description: "",
                            in: "2016-12-11T22:03:12-06:00"
                        }
                    ],
                    currentEntry: 0
                }
            }
        });
        timeMock = jasmine.createSpyObj("time", [
            "duration",
            "formatDuration",
            "now",
            "date",
            "splitDate",
            "getRange"
        ]);
        Moment = require("moment");
        tm = new Moment("12-11-2016", "MM-DD-YYYY");
        timeMock.getRange.andReturn(Moment.range(tm, tm));
        timeMock.now.andReturn("NOW");
        container.register("time", timeMock);
        container.register("logger", loggerMock);
        mockRequire("../../lib/container", container);
        runner = container.resolve("runner");
        process.env.HOME = "/home/";
    });
    afterEach(() => {
        mockRequire.stopAll();
    });
    describe("run", () => {
        var args, expected;

        describe("use", () => {
            it("successfully uses timesheet with previous timesheet.", () => {
                args = {
                    "<timesheet>": "code-review",
                    use: true
                };
                fsMock.readFileAsync.andReturn(bluebird.resolve(mockTimesheet));

                return runner.run(args).then(() => {
                    expect(fsMock.readFileAsync).toHaveBeenCalled();
                    expect(fsMock.statAsync).toHaveBeenCalled();
                });
            });
            it("successfully uses timesheet without previous timesheet.", () => {
                args = {
                    "<timesheet>": "code-review",
                    use: true
                };
                jsonFileMock.writeFileAsync.andReturn(bluebird.resolve());
                stat = {
                    isFile: jasmine.createSpy("stat.isFile").andReturn(false)
                };
                fsMock.statAsync.andReturn(bluebird.resolve(stat));

                return runner.run(args).then(() => {
                    expect(fsMock.readFileAsync).not.toHaveBeenCalled();
                    expect(jsonFileMock.writeFileAsync).toHaveBeenCalled();
                    expect(fsMock.statAsync).toHaveBeenCalled();
                });
            });
        });
        describe("in", () => {
            beforeEach(() => {
                args = {
                    "<tag>": "tracker",
                    in: true,
                    "--description": "cr"
                };
                fsMock.readFileAsync.andReturn(bluebird.resolve(mockTimesheet));
                jsonFileMock.writeFileAsync.andReturn(bluebird.resolve());
                timeMock.date.andReturn("12-11-2016");
            });
            it("successfully clocks into a timesheet.", () => {
                return runner.run(args).then(() => {
                    expected = JSON.parse(mockTimesheet);
                    expected.timesheets.code.entries[1].out = "NOW";
                    expected.timesheets.code.currentEntry = 2;
                    expected.timesheets.code.entries[2] = {
                        id: 2,
                        tag: "tracker",
                        description: "cr",
                        in: "NOW"
                    };
                    expect(jsonFileMock.writeFileAsync).toHaveBeenCalledWith("/home/.tracker/12-11-2016.json", expected);
                });
            });
            it("successfully clocks into a timesheet without description.", () => {
                delete args["--description"];

                return runner.run(args).then(() => {
                    expected = JSON.parse(mockTimesheet);
                    expected.timesheets.code.entries[1].out = "NOW";
                    expected.timesheets.code.currentEntry = 2;
                    expected.timesheets.code.entries[2] = {
                        id: 2,
                        tag: "tracker",
                        description: "",
                        in: "NOW"
                    };
                    expect(jsonFileMock.writeFileAsync).toHaveBeenCalledWith("/home/.tracker/12-11-2016.json", expected);
                });
            });
            it("fails with no sheet chosen", () => {
                delete args["--description"];
                fsMock.readFileAsync.andReturn(bluebird.resolve(JSON.stringify({timesheets: {}})));

                return runner.run(args).then(jasmine.fail, (err) => {
                    expect(err).toEqual(new Error("No timesheet selected. Run `tk use <timesheet>`"));
                });
            });
        });
        describe("out", () => {
            args = {
                out: true
            };
            it("clocks out", () => {
                fsMock.readFileAsync.andReturn(bluebird.resolve(mockTimesheet));

                return runner.run(args).then(() => {
                    expect(fsMock.readFileAsync).toHaveBeenCalled();
                });
            });
        });
        describe("analyze", () => {
            var durationMock, formatted;

            beforeEach(() => {
                // Pretty painful but to have a thorough functional test I want
                // to assert this here. This might change. A unit test for
                //  Timesheet should probably do this work.
                formatted = [
                    {
                        Day: "Sunday, December, 11 2016",
                        "Clock In": "11:11",
                        "Clock Out": "11:11",
                        Duration: "time-duration",
                        Tag: "stuff",
                        Description: ""
                    },
                    {
                        Day: "Sunday, December, 11 2016",
                        "Clock In": "11:11",
                        "Clock Out": "",
                        Duration: "time-duration",
                        Tag: "stuff",
                        Description: ""
                    }
                ];
            });
            it("analyzes current days timesheets", () => {
                var allFormatted, formattedTwo;

                formattedTwo = JSON.parse(JSON.stringify(formatted));
                allFormatted = formattedTwo.concat(formatted);
                allFormatted.splice(0, 0, {timesheet: "code-review"});
                allFormatted.splice(3, 0, {timesheet: "code"});
                allFormatted[2]["Clock Out"] = "11:11";
                args = {
                    analyze: true,
                    "--today": true
                };
                timeMock.formatDuration.andReturn("time-duration");
                timeMock.splitDate.andReturn({
                    time: "11:11",
                    day: "Sunday, December, 11 2016"
                });
                durationMock = jasmine.createSpyObj("duration", [
                    "add"
                ]);
                timeMock.duration.andReturn(durationMock);
                fsMock.readFileAsync.andReturn(bluebird.resolve(mockTimesheet));

                return runner.run(args).then(() => {
                    expect(loggerMock.table).toHaveBeenCalledWith("Timesheet Analytics", allFormatted);
                    expect(loggerMock.info).toHaveBeenCalledWith("Total: time-duration");
                });
            });
            it("analyzes used timesheet for today", () => {
                args = {
                    analyze: true
                };
                timeMock.formatDuration.andReturn("time-duration");
                timeMock.splitDate.andReturn({
                    time: "11:11",
                    day: "Sunday, December, 11 2016"
                });
                durationMock = jasmine.createSpyObj("duration", [
                    "add"
                ]);
                timeMock.duration.andReturn(durationMock);
                fsMock.readFileAsync.andReturn(bluebird.resolve(mockTimesheet));

                return runner.run(args).then(() => {
                    expect(loggerMock.table).toHaveBeenCalledWith("Timesheet Analytics", formatted);
                    expect(loggerMock.info).toHaveBeenCalledWith("Total: time-duration");
                });
            });
        });
    });
});
