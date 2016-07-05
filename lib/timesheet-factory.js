"use strict";


/**
 * @typedef {Object} timesheetFactory
 * @property {Function} loadTimesheet
 * @property {Function} useTimesheet
 */


/**
 * @param {tracker~fileManager} fileManager
 * @param {log~Log} logger
 * @param {tracker~Timesheet} Timesheet
 * @return {tracker~timesheetFactory}
 */
module.exports = (fileManager, logger, Timesheet) => {
    /**
     * Save current data.
     *
     * @param {string} timesheet
     * @param {Object} data
     * @return {Promise}
     */
    function save(timesheet, data) {
        return fileManager.write(timesheet, data);
    }


    /**
     * Creates a Timesheet.
     *
     * @param {string} timesheet
     * @return {Promise.<tracker~Timesheet>}
     */
    function loadTimesheets(timesheet) {
        var data;

        return fileManager.exists(timesheet).then((exists) => {
            if (!exists) {
                data = {
                    timesheets: {}
                };

                return save(timesheet, data).then(() => {
                    return data;
                });
            }

            return fileManager.read(timesheet).then((rawData) => {
                Object.keys(rawData.timesheets).forEach((ts) => {
                    rawData.timesheets[ts] = new Timesheet(ts, rawData.timesheets[ts].entries);
                });

                return rawData;
            });
        });
    }


    /**
     * Update current timesheet.
     *
     * @param {string} timesheet
     * @param {string} name
     * @return {Promise}
     */
    function useTimesheet(timesheet, name) {
        return loadTimesheets(timesheet).then((ts) => {
            if (ts.currentTimesheet) {
                ts.timesheets[ts.currentTimesheet].tryClockOut();
            }

            ts.currentTimesheet = name;

            if (!ts.timesheets[name]) {
                ts.timesheets[name] = new Timesheet(name, []);
            }

            return save(timesheet, ts);
        });
    }

    return {
        loadTimesheets,
        save,
        useTimesheet
    };
};
