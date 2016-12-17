"use strict";


/**
 * @typedef {Object} Timesheet
 * @property {Function} clockIn
 * @property {Function} clockOut
 */


/**
 * @param {tracker~fileManager} fileManager
 * @param {tracker~time} time
 * @return {tracker~Timesheet}
 */
module.exports = (fileManager, time) => {
    /**
     * Represents a Timesheet.
     */
    class Timesheet {
        /**
         * Constructs Timesheet.
         *
         * @param {string} name - Name of timesheet.
         * @param {array} entries - Array of entries.
         */
        constructor(name, entries) {
            this.name = name;
            this.entries = entries;
            this.entries.sort((a, b) => {
                return a.id - b.id;
            });
            this.currentEntry = this.entries.length - 1;
        }


        /**
         * Clock into Timesheet effectively creating a new entry.
         *
         * @param {string} tag
         * @param {string} description
         * @param {string} [at] defaults to now.
         */
        clockIn(tag, description, at) {
            var t;

            if (!description) {
                description = "";
            }

            if (at) {
                t = time.normalizeTime(at);
            } else {
                t = time.now();
            }

            this.currentEntry = this.entries.length;
            this.entries.push({
                id: this.currentEntry,
                tag,
                description,
                in: t
            });
        }


        /**
         * Clock out of currently clocked into entry.
         *
         * @param {string} [at] defaults to now.
         */
        clockOut(at) {
            var t;

            if (at) {
                t = time.normalizeTime(at);
            } else {
                t = time.now();
            }

            this.entries[this.currentEntry].out = t;
        }


        /**
         * Clocks out of current entry if it has not been clocked out of yet.
         */
        tryClockOut() {
            var entry;

            entry = this.entries[this.currentEntry];

            if (entry && !entry.out) {
                this.clockOut();
            }
        }


        /**
         * Formats data for analyzer.
         *
         * @param {string} [tag]
         * @return {Object}
         */
        getFormattedData(tag) {
            var data, dur, formatted, item, timeIn, timeOut, total;

            formatted = {};
            data = [];
            total = time.duration();

            this.entries.forEach((entry) => {
                if (!tag || tag === entry.tag) {
                    timeIn = time.splitDate(entry.in);

                    if (entry.out) {
                        timeOut = time.splitDate(entry.out);
                    } else {
                        timeOut = {
                            time: ""
                        };
                    }

                    dur = time.duration(entry.in, entry.out);
                    total.add(dur);
                    item = {
                        Day: timeIn.day,
                        "Clock In": timeIn.time,
                        "Clock Out": timeOut.time,
                        Duration: time.formatDuration(dur),
                        Tag: entry.tag,
                        Description: entry.description
                    };
                    data.push(item);
                }
            });

            formatted = {
                entries: data,
                total
            };

            return formatted;
        }
    }

    return Timesheet;
};
