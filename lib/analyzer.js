"use strict";


/**
 * @typedef {Object} analyzer
 */


/**
 * @return {tracker~analyzer}
 */
module.exports = () => {
    /**
     * Analyzes timesheet.
     *
     * @param {tracker~Timesheets} timesheets
     * @return {Object[]}
     */
    function analyze(timesheets) {
        var data, ts;

        ts = timesheets.timesheets[timesheets.currentTimesheet];
        data = ts.getFormattedData();

        return data;
    }

    return {
        analyze
    };
};
