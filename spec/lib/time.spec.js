"use strict";

describe("time", () => {
    var diffSpy, formatSpy, Moment, t;

    beforeEach(() => {
        Moment = require("moment");
        formatSpy = spyOn(Moment.prototype, "format");
        diffSpy = spyOn(Moment.prototype, "diff");
        Moment.duration = jasmine.createSpy("Moment.duration");
        t = require("../../lib/time")(Moment);
    });
    describe(".now", () => {
        it("creates ISO formatted time", () => {
            var now;

            formatSpy.andReturn("NOW");
            now = t.now();
            expect(now).toBe("NOW");
            expect(formatSpy).toHaveBeenCalledWith("YYYY-MM-DDTHH:mm:ssZ");
        });
    });
    describe(".splitDate", () => {
        it("splits a date into date object for output", () => {
            var date;

            formatSpy.andCallThrough();
            date = t.splitDate("2016-12-11T10:10:10");
            expect(date).toEqual({
                day: "Sunday, December 11, 2016",
                time: "10:10:10 am"
            });
        });
    });
    describe(".duration", () => {
        var end, span, start;

        beforeEach(() => {
            diffSpy.andReturn("diff");
            Moment.duration.andReturn("duration");
            start = "2016-12-12T10:10";
            end = "2016-12-12T01:01";
        });
        it("gets duration with start and end", () => {
            span = t.duration(start, end);
            expect(span).toBe("duration");
            expect(diffSpy).toHaveBeenCalled();
            expect(Moment.duration).toHaveBeenCalledWith("diff");
        });
        it("gets duration without start and end", () => {
            span = t.duration();
            expect(diffSpy).toHaveBeenCalled();
            expect(Moment.duration).toHaveBeenCalledWith("diff");
        });
        it("gets duration without end", () => {
            span = t.duration(start);
            expect(diffSpy).toHaveBeenCalled();
            expect(Moment.duration).toHaveBeenCalledWith("diff");
        });
    });
    describe(".formatDuration", () => {
        var duration, out;

        duration = jasmine.createSpyObj("duration", [
            "get"
        ]);
        it("formats duration with number padding", () => {
            duration.get.andReturn(1);
            out = t.formatDuration(duration);
            expect(out).toBe("1:01");
        });
        it("formats duration without number padding", () => {
            duration.get.andReturn(10);
            out = t.formatDuration(duration);
            expect(out).toBe("10:10");
        });
    });
});
