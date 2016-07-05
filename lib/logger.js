"use strict";

module.exports = (consoleTable, debug) => {
    return {
        /**
         * Displays a message to the console only.
         *
         * @param {*} data All parameters are sent to console.log.
         */
        console() {
            var args;

            args = [].slice.call(arguments);
            console.log.apply(console, args);
        },


        /**
         * Logs debug statements to stderr only if
         * debug has been turned on in environment variables
         * or config.
         *
         * @param {string} text
         */
        debug(text) {
            if (debug) {
                console.error(`DEBUG: ${text}`);
            }
        },


        /**
         * Logs errors to stderr
         *
         * @param {string} text
         */
        error(text) {
            console.error(`${text}`);
        },


        /**
         * Logs info statements to stdout.
         *
         * @param {string} text
         */
        info(text) {
            console.log(text);
        },


        /**
         * Logs warn statments to stderr.
         *
         * @param {string} text
         */
        warn(text) {
            console.error(`WARN: ${text}`);
        },


        /**
         * Logs data as a table.
         *
         * @param {*} data
         */
        table() {
            var args;

            args = [].slice.call(arguments);
            console.table.apply(console, args);
        }

    };
};
