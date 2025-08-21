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

        console.log("Your transactions are being processed...")
        child_process.spawn("rm", ["-r",serverName], {cwd : args[1]})
        
        setTimeout(() => {
            child_process.spawn("mkdir", [serverName], { cwd : args[1] })

            let p1 = child_process.spawn("wget", ["-O", "server.jar", obj.versions[args[0]].toLocaleLowerCase()], { cwd: `${args[1]}/${serverName}` })

            p1.stderr.on('data', (data) => {
                console.error(`Downloading... ${data}`);
            });

            p1.on("close", function () {
                console.log("Downloaded!")

                child_process.spawn("> start.sh", [], { cwd: `${args[1]}/${serverName}`, shell: true });

                fs.writeFile(`${args[1]}/${serverName}/start.sh`,
                    `
                    java -Xms2G -Xmx2G -jar server.jar nogui
                    `, (err) => {
                    if (err) throw err;
                    console.log("start.sh has been created!");

                    child_process.spawn("chmod", ["+x", "./start.sh"], { cwd: `${args[1]}/${serverName}`, shell: true });

                    process.exit()
                });

            })
        }, 2000)

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
