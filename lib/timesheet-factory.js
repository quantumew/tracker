"use strict";


/**
 * @typedef {Object} timesheetFactory
 * @property {Function} loadTimesheet
 * @property {Function} useTimesheet
 */


/**
 * @param {bluebird} bluebird
 * @param {tracker~fileManager} fileManager
 * @param {log~Log} logger
 * @param {tracker~time} time
 * @param {tracker~Timesheet} Timesheet
 * @return {tracker~timesheetFactory}
 */
module.exports = (bluebird, fileManager, logger, time, Timesheet) => {
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
     * Loads a single timesheet.
     *
     * @param {string} timesheet
     * @return {Promise.<tracker~Timesheet[]>}
     */
    function loadDailyTimesheet(timesheet) {
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
     * Creates a Timesheet.
     *
     * @param {string} to
     * @param {string} from
     * @return {Promise.<tracker~Timesheet[]>}
     */
    function loadTimesheets(to, from) {
        var promises, range, timesheets;

        timesheets = [];
        promises = [];

        if (!from) {
            from = time.date("MM-DD-YYYY");
        }

        range = time.getRange(from, to);
        range.by("days", (date) => {
            promises.push(loadDailyTimesheet(date.format("MM-DD-YYYY")));
        });

        return bluebird.each(promises, (item) => {
            timesheets.push(item);
        }).then(() => {
            return timesheets;
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
        return loadDailyTimesheet(timesheet).then((ts) => {
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
        loadDailyTimesheet,
        loadTimesheets,
        save,
        useTimesheet
    };
};
