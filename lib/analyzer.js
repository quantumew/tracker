"use strict";


/**
 * @typedef {Object} analyzer
 */


/**
 * @param {tracker~time} time
 * @return {tracker~analyzer}
 */
module.exports = (time) => {
    /**
     * Combines many entries into one for analytics.
     *
     * @param {tracker~Timesheets} timesheets
     * @param {Object} args
     * @return {Object}
     */
    function analyzeAll(timesheets) {
        var data, tsData;

        // Concat entries and add up totals.
        data = {
            total: time.duration(),
            entries: []
        };
        Object.keys(timesheets.timesheets).forEach((name) => {
            tsData = timesheets.timesheets[name].getFormattedData();
            data.total.add(tsData.total);

            // Pushing this to split up separate timesheets for console.table.
            data.entries.push({timesheet: name});
            data.entries = data.entries.concat(tsData.entries);
        });
        data.total = time.formatDuration(data.total);

        return data;
    }


    /**
     * Analyzes timesheet.
     *
     * @param {tracker~Timesheets} timesheets
     * @return {Object}
     */
    function analyze(timesheets) {
        var data, ts;

        ts = timesheets.timesheets[timesheets.currentTimesheet];
        data = ts.getFormattedData();
        data.total = time.formatDuration(data.total);

        return data;
    }

    return {
        analyze,
        analyzeAll
    };
};
