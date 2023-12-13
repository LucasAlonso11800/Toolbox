const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const { request, expect } = chai;

describe("/files/list", () => {
  it("it should return a list of files", (done) => {
    request(app)
      .get("/files/list")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        if (res.body.message) return done();

        expect(res.body).to.haveOwnProperty("files");

        res.body.files.forEach((file) => {
          expect(file).to.be.a("string");
        });
        done();
      });
  });
});

describe("/files/data/:fileName", () => {
  it("it should return a filename with its lines", (done) => {
    request(app)
      .get("/files/data/test2.csv")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        if (res.body.message) return done();

        expect(res.body).to.be.a("array");
        expect(res.body[0]).to.haveOwnProperty("file");
        expect(res.body[0]).to.haveOwnProperty("lines");
        done();
      });
  });
  it("it should return the lines with the right format", (done) => {
    request(app)
      .get("/files/data/test2.csv")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        if (res.body.message) return done();

        res.body[0].lines.forEach((line) => {
          expect(line).to.haveOwnProperty("file");
          expect(line).to.haveOwnProperty("text");
          expect(line).to.haveOwnProperty("number");
          expect(line).to.haveOwnProperty("hex");
        });
        done();
      });
  });
});

describe("/files/data", () => {
  it("it should return all filenames with their lines", (done) => {
    request(app)
      .get("/files/data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        if (res.body.message) return done();

        expect(res.body).to.be.a("array");
        res.body.forEach((file) => {
          expect(file).to.haveOwnProperty("file");
          expect(file).to.haveOwnProperty("lines");
        });
        done();
      });
  });
  it("it should return the lines with the right format", (done) => {
    request(app)
      .get("/files/data/test2.csv")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        if (res.body.message) return done();

        res.body.forEach((file) => {
            file.lines.forEach((line) => {
                expect(line).to.haveOwnProperty('file')
                expect(line).to.haveOwnProperty('text')
                expect(line).to.haveOwnProperty('number')
                expect(line).to.haveOwnProperty('hex')
            })
        });

        done();
      });
  });
});
