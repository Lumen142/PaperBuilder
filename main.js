const questionService = require("./packages/QuestionService.js");
const fileCreator = require("./packages/FileCreator.js");
const paperDownloader = require("./packages/PaperDownloader.js");

const fs = require("fs");
const versions = JSON.parse(fs.readFileSync("./versions.json"));
const packageJson = JSON.parse(fs.readFileSync("./package.json"));

const figlet = require("figlet");

let questionAnswers = {
    serverName : "",
    version : "",
    path : "",

    max_memory : 4
};

async function newText(text) {
    let nText = await figlet.text(text)
    return nText;
}

newText(`
    PaperBuilder v${packageJson.version}
    `).then(value => {
    console.log(value)
})

setTimeout(() => {
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

                                questionService.Question("scale", "answer", "TEST", [
                                    {
                                    name: 'answer',
                                    message: 'What is the maximum amount of RAM you will allocate to the server?',
                                    initial: 3
                                    }]).then(value => {
                                
                                    questionAnswers.max_memory = (value.answer + 1).toString()

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

                                    fs.writeFileSync(questionAnswers.path + "/" + questionAnswers.serverName + "/run.bat", `java -Xms2G -Xmx${questionAnswers.max_memory}G -jar + paper-${questionAnswers.version}.jar nogui`);

                                    paperDownloader.downloadPaper(questionAnswers.version, questionAnswers.path + "/" + questionAnswers.serverName).then(() => {
                                        console.log(`
                                            Server software: https://papermc.io/
                                            If you want to add a plugin: https://www.spigotmc.org/resources/categories/spigot.4/
                                        `)
                                    })

                                })

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
}, 1000);
