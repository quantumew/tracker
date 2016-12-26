"use strict";


/**
 * @typedef {Object} runner
 * @property {Function} clockIn
 * @property {Function} clockOut
 * @property {Function} analyze
 * @property {Function} edit
 */


/**
 * @param {tracker~analyzer} analyzer
 * @param {log~Log} logger
 * @param {tracker~time} time
 * @param {tracker~timesheetFactory} timesheetFactory
 * @return {tracker~runner}
 */
module.exports = (analyzer, logger, time, timesheetFactory) => {
    /**
     * Run tracker elements based on provided command line arguments.
     *
     * @param {Object} args
     * @return {Promise.<*>}
     */
    function run(args) {
        var date;

        date = time.date("MM-DD-YYYY");

        if (args.use) {
            return timesheetFactory.useTimesheet(date, args["<timesheet>"]);
        } else if (args.analyze) {
            return analyzer.run(args);
        }

        return timesheetFactory.loadDailyTimesheet(date).then((ts) => {
            var current;

            current = ts.timesheets[ts.currentTimesheet];

            if (!current) {
                throw Error("No timesheet selected. Run `tk use <timesheet>`");
            }

            if (args.in) {
                current.tryClockOut();
                current.clockIn(args["<tag>"], args["--description"], args["--at"]);
            } else if (args.out) {
                current.clockOut(args["--at"]);
            } else if (args.edit) {
                current.edit(args);
            } else if (args.delete) {
                current.delete(args["<id>"]);
            }

            return timesheetFactory.save(date, ts);
        });
    }

    return {
        run
    };
};
