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
     * Run tracker.
     *
     * @param {Object} args
     * @return {Promise.<*>}
     */
    function run(args) {
        var date;

        date = time.date("MM-DD-YYYY");

        if (args.use) {
            return timesheetFactory.useTimesheet(date, args["<timesheet>"]);
        }

        return timesheetFactory.loadTimesheets(date).then((ts) => {
            var current, output;

            current = ts.timesheets[ts.currentTimesheet];

            if (!current) {
                throw Error("No timesheet selected. Run `tk use <timesheet>`");
            }

            if (args.in) {
                current.tryClockOut();
                current.clockIn(args["<tag>"], args["--description"]);
            } else if (args.out) {
                current.clockOut();
            } else if (args.edit) {
                current.edit();
            } else {
                output = analyzer.analyze(ts);
                logger.table(`${ts.currentTimesheet} Timesheet Analytics`, output.entries);
                logger.info(`Total: ${output.total}`);
            }

            return timesheetFactory.save(date, ts);
        });
    }

    return {
        run
    };
};