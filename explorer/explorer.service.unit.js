const library = require("./explorer.service");
const assert = require("assert");

describe("Read all files stat from a directory", function() {
    it("should return files with their corresponding stat [./]", function(done) {
        const ret =  library.readDirContent("./");
        ret.then((result) => {
            result.map((entry) => {
                const type = entry.stat.isDirectory() ? "Dir" : "File";
                assert(1);
                console.log(`${entry.file}: ${type}`);
            });
            done();
        });
    });
    it("should return files with their corresponding stat [/]", function() {
        const ret =  library.readDirContent("/");
        return ret.then((result) => {
            result.map((entry) => {
                const type = entry.stat.isDirectory() ? "Dir" : "File";
                assert(1);
                console.log(`${entry.file}: ${type}`);
            });
        })
    });

    // We can have more its here
});