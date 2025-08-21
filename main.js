const child_process = require('child_process')
const fs = require("fs")
const readline = require("readline")
const { stdout, stdin } = require('process')

const package = fs.readFileSync("package-lock.json", "utf-8")
const packageJSON = JSON.parse(package)

const jsonData = fs.readFileSync("versions.json", "utf-8")
const obj = JSON.parse(jsonData)

const serverName = obj["defaultServerName"]

const rl = readline.createInterface(
    {
        input : stdin,
        output: stdout
    }
)

let versionList = ""
for (const key in obj.versions) {
    versionList = versionList + "\n" + key
}

const args = process.argv.slice(2)

if ( args.length == 2 ) {

    const version = obj.versions[args[0]]
    
    if (version) {

        rl.question(`If there is a file named “MinecraftServer” at the specified location, it will be deleted. Do you agree?\nYes : 1\nNo : 2\nanswer(default:1) : `, answer => {
            if (answer == "1" || answer != "2") {
                console.log("Your transactions are being processed...")
                child_process.spawn("rm", ["-r",serverName], {cwd : args[1]})
                
                setTimeout(() => {
                    child_process.spawn("mkdir", [serverName], { cwd : args[1] })

                    let p1 = child_process.spawn("wget", ["-O", "server.jar", obj.versions[args[0]].toLocaleLowerCase()], { cwd: `${args[1]}/${serverName}` })

                    p1.stderr.on('data', (data) => {
                        process.stdout.write(`${data}`)
                    });

                    p1.on("close", function () {
                        console.log("Downloaded!")

                        fs.writeFile(`${args[1]}/${serverName}/start.sh`,
                            `
                            java -Xms2G -Xmx2G -jar server.jar nogui
                            `, (err) => {
                            if (err) throw err;
                            console.log("start.sh has been created!");

                            child_process.spawn("chmod", ["+x", "./start.sh"], { cwd: `${args[1]}/${serverName}`, shell: true });
                        });

                        setTimeout(() => {
                            rl.question(`Shall we perform an automatic installation?\nYes: 1\nNo: 2\nanswer(default:1): `, answer => {
                                if (answer == "1" || answer != "2") {
                                    child_process.spawn("clear")

                                    rl.question(`Do you accept eula.txt? (https://aka.ms/MinecraftEULA)\nYes:1\nNo:2\nanswer(default:1): `, answer => {
                                        if (answer == "1" || answer != "2") {
                                            fs.writeFile(`${args[1]}/${serverName}/eula.txt`,`eula=true`, (err) => { 
                                                if (err) {
                                                    console.log("[ERROR] : " + err)
                                                } else {
                                                    console.log("EULA accepted.")
                                                    child_process.spawn(`x-terminal-emulator`, ["-e","bash","-c",'"bash ./start.sh; exec bash"'], { cwd : `../${serverName}/`, shell : true})
                                                    process.exit()
                                                }
                                            })
                                        } else {
                                            console.log("Unfortunately, we cannot continue with the automatic installation without accepting the EULA. :(")
                                            process.exit()
                                        }
                                    })

                                } else {
                                    process.exit()
                                }
                            })
                        }, 1000);

                    })
                }, 2000)
            } else {

            }
        })

    } else {
        console.log(`
            Unfortunately, we couldn't find the version you requested. :(

            If you want to see all currently available versions,
            you can view them using the command below.

            -->> node build.js [<versions>]
            `)
        process.exit()
    }

} else if (args.length == 1 && args[0].toLowerCase() == "versions") {

    console.log(versionList)
    process.exit()

} else if ( args.length == 0 || args.length >= 3 ) {
    console.log(`
        PaperBuilder
            By Lumen142
        
        Using: node build.js [<VERSION>] [<PATH>]

        `)
    process.exit()
}
