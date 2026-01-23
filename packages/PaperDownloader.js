const { DownloaderHelper } = require("node-downloader-helper")
const fs = require("fs");

const versions = JSON.parse(fs.readFileSync("./versions.json"));

function downloadPaper(version, path) {
    const dl = new DownloaderHelper(versions.versions[version], path, { fileName: `paper-${version}.jar` });

    dl.on("end", () => {
        console.log("Download completed!");
    })

    dl.on("progress", (stats) => {
        console.log(`Progress: ${stats.downloaded}%`);
    })

    dl.start().catch(err => console.error(err));
}

module.exports = {
    downloadPaper
}