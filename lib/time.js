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

/**
 * @param {moment} Moment
 * @return {tracker~time}
 */
module.exports = (Moment) => {
    /**
     * Get raw date.
     *
     * @param {string} str
     * @param {string} when
     * @return {string}
     */
    function date(str, when) {
        var d;

        d = new Moment(when);

        return d.format(str);
    }


    /**
     * Load raw date.
     *
     * @param {string} str
     * @param {string} when
     * @return {string}
     */
    function safeDate(str, when) {
        var d;

        d = new Date(when);

        return date(str, d.toISOString());
    }


    /**
     * Get raw moment. I made a decision early on that only if necessary
     * other classes will deal with formatting moment objects.
     *
     * @return {moment}
     */
    function moment() {
        return new Moment();
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
     * Normalizes input time. It builds an ISO formatted date out of a time
     * provided by user. It defaults the date to current date.
     *
     * @param {string} when
     * @return {string}
     */
    function normalizeTime(when) {
        var d, mmt, valid;

        valid = new Moment(when, "HH:mm").isValid();

        if (valid) {
            mmt = new Moment();
            d = mmt.format("YYYY-MM-DD");
            when = `${d}T${when}`;
        } else {
            valid = new Moment(when, "YYYY-MM-DDTHH:mm:ssZ").isValid();

            if (!valid) {
                throw new Error("Invalid time input.");
            }
        }

        return date("YYYY-MM-DDTHH:mm:ssZ", when);
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
     * Get range of dates.
     *
     * @param {string} to
     * @param {string} from
     * @return {moment-range}
     */
    function getRange(to, from) {
        var fm, tm;

        tm = new Moment(to, "MM-DD-YYYY");
        fm = new Moment(from, "MM-DD-YYYY");

        return Moment.range(tm, fm);
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
        getRange,
        moment,
        normalizeTime,
        now,
        safeDate,
        splitDate
    };
};
