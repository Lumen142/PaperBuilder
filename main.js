
const child_process = require('child_process')
const https = require("https")
const fs = require("fs")
const readline = require("readline")
const { stdout, stdin } = require('process')
const { type } = require('os')

const package = fs.readFileSync("package-lock.json", "utf-8")
const packageJSON = JSON.parse(package)

const jsonData = fs.readFileSync("versions.json", "utf-8")
const obj = JSON.parse(jsonData)

const serverName = obj["defaultServerName"]

let versionList = ""
for (const key in obj.versions) {
    versionList = versionList + "\n" + key
}

console.log(
    `
    ${versionList}

    PaperBuilder ${packageJSON["version"]}
        By Lumen142
    
    Please select one of the versions above. :)

    `
)

const rl = readline.createInterface({ input : stdin, output : stdout })

rl.question("Sürüm? : ", (answer) => {

    if ( obj.versions[answer] ) {

        rl.question(`
            
            The files named “MinecraftServer” in this folder will be deleted.

            1 : okay
            2 : no

            default : 1
            
            `, (_) => {
            console.log("Your transactions are being processed...")

            if (_ == "1" || _ != "2") {
                child_process.spawn("rm", ["-r",serverName])

                setTimeout(() => {
                    child_process.spawn("mkdir", [serverName])
                    
                    let p1 = child_process.spawn("wget", ["-O","server.jar",obj.versions[answer]], {cwd : `./${serverName}`})

                    p1.on("close", function() {
                        console.log("Downloaded!")

                        child_process.spawn("> start.sh", [], { cwd: `./${serverName}`, shell: true});

                        fs.writeFile(`./${serverName}/start.sh`, 
                        `
                        java -Xms2G -Xmx2G -jar server.jar nogui
                        `, (err) => {
                            if (err) throw err;
                            console.log("start.sh has been created!");

                            child_process.spawn("chmod", ["+x", "./start.sh"], { cwd: `./${serverName}`, shell: true});

                            process.exit()
                        });

                    })
                }, 2000)
            } else {
                console.log("Transactions canceled.")
                process.exit()
            }
        })

    } else {
        console.log("Invalid version.")
        process.exit()
    }

})
