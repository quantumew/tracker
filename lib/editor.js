"use strict";


/**
 * @typedef {Object} tracker~editor
 * @param {Function} edit
 */


/**
 * Manages the editing of a timesheet.
 * @param {tracker~time} time
 * @return {tracker~editor}
 */
module.exports = (time) => {
    /**
     * Edit timesheet.
     *
     * @param {tracker~Timesheet} current
     * @param {Object} args
     * @return {boolean} if entry exists and is updated.
     */
    function editCurrent(current, args) {
        var id, newEntry;

        id = args["<id>"];
        newEntry = current.getEntry(id);

        if (args["--in"]) {
            newEntry.in = time.normalizeTime(args["--in"]);
        }

        if (args["--out"]) {
            newEntry.out = time.normalizeTime(args["--out"]);
        }

        ["tag", "description"].forEach((key) => {
            var val;

            val = args[`--${key}`];

            if (val) {
                newEntry[key] = val;
            }
        });

        return current.setEntry(id, newEntry);
    }

    return {
        editCurrent
    };
};
