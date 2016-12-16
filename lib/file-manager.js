"use strict";


/**
 * @typedef {Object} fileManager
 * @property {Function} read
 * @property {Function} write
 */


/**
 * @param {bluebird} bluebird
 * @param {jsonfile} jsonFileAsync
 * @param {fs} fsAsync
 * @param {log~Log} logger
 * @param {mkdirp} mkdirpAsync
 * @param {path} path
 * @return {tracker~fileManager}
 */
module.exports = (bluebird, jsonFileAsync, fsAsync, logger, mkdirpAsync, path) => {
    /**
     * Builds base file path.
     *
     * @param {string} fileName
     * @return {string}
     */
    function getPath(fileName) {
        var filePath;

        filePath = path.join(process.env.HOME, ".tracker", `${fileName}.json`);

        return filePath;
    }

    /**
     * Writes JSON data to file.
     *
     * @param {string} fileName
     * @param {Object} data
     * @return {Promise}
     */
    function write(fileName, data) {
        var fp;

        jsonFileAsync.spaces = 4;
        fp = getPath(fileName);

        return mkdirpAsync(path.dirname(fp)).then(() => {
            return jsonFileAsync.writeFileAsync(getPath(fileName), data);
        });
    }

    /**
     * File exists.
     *
     * @param {string} fileName
     * @return {Promise.<boolean>}
     */
    function exists(fileName) {
        return fsAsync.statAsync(getPath(fileName)).then((stat) => {
            return stat.isFile();
        }, () => {
            return false;
        });
    }

    /**
     * Reads in file and parses JSON.
     *
     * @param {string} fileName
     * @return {Promise.<Buffer>}
     */
    function read(fileName) {
        var fp;

        fp = getPath(fileName);

        return mkdirpAsync(path.dirname(fp)).then(() => {
            return fsAsync.readFileAsync(getPath(fileName));
        }).then((data) => {
            return JSON.parse(data);
        });
    }

    return {
        exists,
        read,
        write
    };
};
