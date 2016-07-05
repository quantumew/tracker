"use strict";


/**
 * @typedef {Object} time
 * @property {Function} date
 * @property {Function} now
 * @property {Function} splitDate
 * @property {Function} duration
 * @property {Function} formatDuration
 */


/**
 * @typedef {Object} date
 * @property {string} day
 * @property {string} time
 */

module.exports = (Moment) => {
    /**
     * Get raw date.
     *
     * @param {string} str
     * @return {Moment}
     */
    function date(str) {
        var d;

        d = new Moment();

        return d.format(str);
    }


    /**
     * Gets the current time.
     * It will be ISO formatted.
     *
     * @return {string} current time.
     */
    function now() {
        return date("YYYY-MM-DDTHH:mm:ssZ");
    }


    /**
     * Takes a ISO formated date and returns a date object.
     *
     * @param {string} strDate
     * @return {Object}
     */
    function splitDate(strDate) {
        var mmt;

        mmt = new Moment(strDate);

        return {
            day: mmt.format("dddd, LL"),
            time: mmt.format("HH:mm:ss a")
        };
    }


    /**
     * Get duration between times. Defaults both arguments to now if missing.
     *
     * @param {string} timeIn
     * @param {string} timeOut
     * @return {string} duration
     */
    function duration(timeIn, timeOut) {
        var dur, mmtIn, mmtOut;

        if (!timeIn) {
            timeIn = new Moment();
        }

        if (!timeOut) {
            timeOut = new Moment();
        }

        mmtIn = new Moment(timeIn);
        mmtOut = new Moment(timeOut);
        dur = Moment.duration(mmtOut.diff(mmtIn));

        return dur;
    }


    /**
     * Formats a duration object.
     *
     * @param {moment~Duration} dur
     * @return {string}
     */
    function formatDuration(dur) {
        var fmt, hours, minutes;

        hours = dur.get("hours");
        minutes = dur.get("minutes");

        // Moment.js somehow doesn't have a format function for duration
        // and their humanize function is pretty lame for what I am doing.
        // For instance, 1:30 -> 2 hours. So I am building my own HH:mm. Sort
        // of lame.
        if (String(minutes).length === 1) {
            minutes = `0${minutes}`;
        }

        fmt = `${hours}:${minutes}`;

        return fmt;
    }

    return {
        date,
        duration,
        formatDuration,
        now,
        splitDate
    };
};
