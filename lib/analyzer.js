"use strict";


/**
 * @typedef {Object} analyzer
 */


/**
 * @param {tracker~logger} logger
 * @param {tracker~time} time
 * @param {tracker~timesheetFactory} timesheetFactory
 * @return {tracker~analyzer}
 */
module.exports = (logger, time, timesheetFactory) => {
    /**
     * Combines many entries into one for analytics.
     *
     * @param {tracker~Timesheets} timesheets
     * @param {string} [tag]
     * @return {Object}
     */
    function analyze(timesheets, tag) {
        var data, tsData;

        // Concat entries and add up totals.
        data = {
            total: time.duration(),
            entries: []
        };
        timesheets.forEach((ts) => {
            Object.keys(ts.timesheets).forEach((name) => {
                tsData = ts.timesheets[name].getFormattedData(tag);
                data.total.add(tsData.total);

                if (tsData.entries.length > 0) {
                    // Pushing this to split up separate timesheets for console.table.
                    data.entries.push({timesheet: name});
                    data.entries = data.entries.concat(tsData.entries);
                }
            });
        });
        data.total = time.formatDuration(data.total);

        return data;
    }


    /**
     * Analyzes currently loaded timesheet.
     *
     * @param {tracker~Timesheets} timesheets
     * @param {string} [tag]
     * @return {Object}
     */
    function analyzeCurrent(timesheets, tag) {
        var data, ts;

        if (!timesheets.currentTimesheet) {
            throw Error("No timesheet loaded. Use tk analyze --today for analytics on entire day.");
        }

        ts = timesheets.timesheets[timesheets.currentTimesheet];
        data = ts.getFormattedData(tag);
        data.total = time.formatDuration(data.total);

        return data;
    }


    /**
     * Run analysis process.
     *
     * @param {Object} args
     * @return {Promise}
     */
    function run(args) {
        var from, output, to, yesterday;

        if (args["--to"]) {
            to = time.safeDate("MM-DD-YYYY", args["--to"]);
        } else {
            to = time.date("MM-DD-YYYY");
        }

        if (args["--from"]) {
            from = time.safeDate("MM-DD-YYYY", args["--from"]);
        } else {
            from = time.date("MM-DD-YYYY");
        }

        if (args["--today"]) {
            to = time.date("MM-DD-YYYY");
            from = time.date("MM-DD-YYYY");
        } else if (args["--yesterday"]) {
            yesterday = time.moment().subtract(1, "days");
            to = time.date("MM-DD-YYYY", yesterday);
            from = time.date("MM-DD-YYYY", yesterday);
        }

        return timesheetFactory.loadTimesheets(to, from).then((ts) => {
            if (!args["--from"] && !args["--to"] && !args["--today"] && !args["--yesterday"]) {
                output = analyzeCurrent(ts[0], args["--tag"]);
            } else {
                output = analyze(ts, args["--tag"]);
            }

            logger.table("Timesheet Analytics", output.entries);
            logger.info(`Total: ${output.total}`);
        });
    }

    return {
        run
    };
};
