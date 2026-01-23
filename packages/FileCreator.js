const fs = require("fs");

function newServerFile(fileName, path) {
    fs.mkdirSync(path + "/" + fileName, { recursive: true });
}

function newEULA(path) {
    fs.writeFileSync(path + "/eula.txt", "eula");
}

module.exports = {
    newServerFile,
    newEULA
}
