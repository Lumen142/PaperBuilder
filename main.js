const questionService = require("./packages/QuestionService.js");
const fileCreator = require("./packages/FileCreator.js");
const paperDownloader = require("./packages/PaperDownloader.js");

const fs = require("fs");
const { encode } = require("punycode");
const versions = JSON.parse(fs.readFileSync("./versions.json"));

let questionAnswers = {
    serverName : "",
    version : "",
    path : ""
};

questionService.Question("input", "answer", "Server Folder Name?")
.then(
    value => {questionAnswers.serverName = value;
    questionService.Question("input", "answer", "Version?").then(value => {
        if (versions.versions[value]) {
            questionAnswers.version = value;
            questionService.Question("confirm", "answer", "Do you accept the EULA?").then(value => {
                if (value) {
                    questionService.Question("input", "answer", "Path?").then(value => {
                        
                        if (fs.existsSync(value)) {
                            questionAnswers.path = value;

                            fileCreator.newServerFile(questionAnswers.serverName, questionAnswers.path);
                            fileCreator.newEULA(questionAnswers.path + "/" + questionAnswers.serverName);

                            fs.writeFileSync(questionAnswers.path + "/" + questionAnswers.serverName + "/eula.txt",
                                `
                                #By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
                                #Fri Jan 23 20:25:58 TRT 2026
                                eula=true
                                `,
                                "utf-8"
                            );

                            fs.writeFileSync(questionAnswers.path + "/" + questionAnswers.serverName + "/run.bat","java -Xms2G -Xmx4G -jar " + "paper-" + questionAnswers.version + ".jar nogui");

                            paperDownloader.downloadPaper(questionAnswers.version, questionAnswers.path + "/" + questionAnswers.serverName);

                        } else {
                            console.log("Path does not exist!");
                            process.exit();
                        }
                    });
                } else {
                    console.log("You must accept the EULA to proceed.");
                    process.exit();
                }
            });
        } else {
            console.log("Version not found!");
            process.exit();
        }
    })
});
