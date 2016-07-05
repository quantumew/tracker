"use strict";

describe("container", () => {
    var container;

    beforeEach(() => {
        container = require("../../lib/container");
    });
    it("returns an object", () => {
        expect(container).toEqual(jasmine.any(Object));
    });
    it("resolves a dependency", () => {
        expect(container.resolve("container")).toBe(container);
    });
    it("resolve a dependency which has methods to run", () => {
        var path;

        path = container.resolve("path");
        expect(path.join).toEqual(jasmine.any(Function));
    });
});
