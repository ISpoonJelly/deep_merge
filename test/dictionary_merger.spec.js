var expect = require("chai").expect;

var merger = require("../dictionary_merger");

describe("Dictionary Merging", function() {
  describe("invalid/empty input", function() {
    it("should return null if any input is undefined", function() {
      expect(merger({ a: "1" }, undefined)).to.be.null;

      expect(merger(undefined, { a: "1" })).to.be.null;
    });

    it("should return empty dictionary if both input is empty", function() {
      expect(merger({}, {})).to.be.empty;
    });

    it("should return the other dictionary if one of dictionaries is empty", function() {
      var a = { item: "Hello World!" };
      var b = {};

      expect(merger(a, b)).to.equal(a);
      expect(merger(b, a)).to.equal(a);
    });
  });

  describe("simple 1-d dictionaries", function() {
    it("should return the elements of both dictionaries in case of no collision", function() {
      var dict1 = { a: 1, b: 2 };
      var dict2 = { c: 3, d: 4 };

      var result = { a: 1, b: 2, c: 3, d: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the elements of the first in case of collision", function() {
      var dict1 = { a: 1, b: 2 };
      var dict2 = { b: 3, c: 4 };

      var result = { a: 1, b: 2, c: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);

      // Negative case, dict2 is the first parameter.
      expect(merger(dict2, dict1)).to.not.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the result of the decision function in case of collision", function() {
      var dict1 = { a: 1, b: 2 };
      var dict2 = { b: 3, c: 4 };

      var decision_func = function(first, second) {
        return first + second;
      };

      var result = { a: 1, b: 5, c: 4 };

      expect(merger(dict1, dict2, decision_func)).to.deep.equal(result);
    });
  });

  describe("nested dictionaries", function() {
    it("should return the elements of both dictionaries in case of no collision", function() {
      var dict1 = { a: { aa: 1 }, b: 2 };
      var dict2 = { c: { cc: 3 }, d: 4 };

      var result = { a: { aa: 1 }, b: 2, c: { cc: 3 }, d: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the elements of the first in case of collision", function() {
      var dict1 = { a: 1, b: { bb: 1 } };
      var dict2 = { b: 3, c: 4 };

      var result = { a: 1, b: { bb: 1 }, c: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);

      // Negative case, dict2 is the first parameter.
      expect(merger(dict2, dict1)).to.not.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the merging of collided items in case of collision", function() {
      var dict1 = { a: 1, b: { bb: 1 } };
      var dict2 = { b: { cc: 3 }, c: 4 };

      var result = { a: 1, b: { bb: 1, cc: 3 }, c: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the merging of collided items in case of collision", function() {
      var dict1 = { a: 1, b: { bb: 5 } };
      var dict2 = { b: { bb: 3 }, c: 4 };

      var result = { a: 1, b: { bb: 5 }, c: 4 };

      expect(merger(dict1, dict2)).to.deep.equal(result);
    });

    it("should return the elements of both dictionaries and the result of the decision function in case of collision", function() {
      var dict1 = { a: 1, b: { aa: 1, bb: 2, cc: 3, dd: { x: 1, y: 2 } } };
      var dict2 = { b: { cc: 5, dd: { y: 3, z: 1 } }, c: 4 };

      var decision_func = function(first, second) {
        return first + second;
      };

      var result = {
        a: 1,
        b: { aa: 1, bb: 2, cc: 8, dd: { x: 1, y: 5, z: 1 } },
        c: 4
      };

      expect(merger(dict1, dict2, decision_func)).to.deep.equal(result);
    });
  });
});
