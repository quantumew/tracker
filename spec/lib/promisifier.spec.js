"use strict";

describe("promisifier", () => {
    var promise, promisifier;

    beforeEach(() => {
        promise = require("bluebird");
        spyOn(promise, "promisify").andCallThrough();
        spyOn(promise, "promisifyAll").andCallThrough();
        promisifier = require("../../lib/promisifier")(promise);
    });
    it("is a function", () => {
        expect(promisifier).toEqual(jasmine.any(Function));
    });
    it("promisifies something that is passed in", () => {
        var obj, result;

        obj = {
            thing: "object to promisify"
        };
        result = {
            description: "result from promise.promisifyAll()"
        };
        promise.promisifyAll.andReturn(result);
        expect(promisifier(obj)).toBe(result);
        expect(promise.promisifyAll).toHaveBeenCalledWith(obj);
    });
    it("promisifies a function as well", () => {
        var fn, result;

        fn = () => {};
        result = () => {};
        promise.promisify.andReturn(result);
        promise.promisifyAll.andCallFake((x) => {
            return x;
        });
        expect(promisifier(fn)).toBe(result);
        expect(promise.promisify).toHaveBeenCalledWith(fn);
        expect(promise.promisifyAll).toHaveBeenCalledWith(result);
    });
});
