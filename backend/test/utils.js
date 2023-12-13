const { expect } = require('chai');
const { getFileLines } = require('../utils');

describe("getFileLines", () => {
    it("returns null when the parameters is not a string", () => {
      let result = getFileLines({});
      expect(result).to.be.null
      result = getFileLines([]);
      expect(result).to.be.null
      result = getFileLines(123);
      expect(result).to.be.null
    });

    it("returns null when the string doesn't start with the correct headers", () => {
      const result = getFileLines('somestring');
      expect(result).to.be.null
    });
    it("returns an empty array if the string doesn't have line breaks", () => {
      const result = getFileLines('file,text,number,hex');
      expect(result).to.deep.equal([]);
    });
    it("skips lines with invalid columns", () => {
      const result = getFileLines('file,text,number,hex\ncolumn1,column2');
      expect(result).to.deep.equal([]);
    });
    it("skips lines with empty columns", () => {
      const result = getFileLines('file,text,number,hex\ncolumn1,column2,,');
      expect(result).to.deep.equal([]);
    });
    it("formats the lines correctly", () => {
      const result = getFileLines('file,text,number,hex\ncolumn1,column2,column3,column4');
      expect(result).to.deep.equal([{
        file: "column1",
        text: "column2",
        number: "column3",
        hex: "column4"
      }]);
    });
});