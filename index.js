import fetch from 'node-fetch';
import fs from "fs";
import { createInterface } from "readline"

let colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
}

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const abeceda = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function getMsg(_type, msg) {
    if (_type === "info") {
        return `${colors.FgGreen}[*] ${msg}${colors.Reset}`
    }
    if (_type === "warn") {
        return `${colors.FgRed}[!] ${msg}${colors.Reset}`
    }
    if (_type === "question") {
        return `${colors.FgCyan}[?] ${msg} >${colors.Reset} `
    }
}
async function run(Config) {

    const config = Config.spam;
    let delay = config.delay;
    const msg = config.msg;
    const tokens = Config.tokens.filter(token => token);
    const slowmode = config.slowmode;
    const randomNum = config.randomNum;
    const bypassSlowmodeAlogritmus = config.bypassSlowmodeAlogritmus;
    const testTokens = config.testTokens;
    const randomNumLenght = config.randomNumLenght;
    const smoothSpam = config.smoothSpam;
    let tempDelay = 0;
    let gudTokens = [];
    if (testTokens) {
        console.log(getMsg("info", "Checking tokens..."))
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i]
            try {
                fetch(`https://discordapp.com/api/v6/auth/login`, {
                    method: "GET",
                    headers: getHeaders2(token)
                })
                    .then(async res => {
                        if (res.status == 200) {
                            return gudTokens.push(token)
                        } else {
                            if(res.status == 429) {
                                return console.log(getMsg("warn", "You get ratelimited! Try again after few seconds..."))
                            }
                            console.log(res.status + " bad: " + token)
                        }
                    })
            } catch (error) {
                console.log(error)
            }
            await sleep(400)
        }
        await sleep(150)
    } else {
        gudTokens = tokens
    }

    rl.question(getMsg("question", "Channel id"), async id => {
        if (isNaN(id) || id.length < 10) {
            return console.log(getMsg("warn", "Please, enter a vaild channel id."))
        }
        let tempRes = await fetch(`https://discordapp.com/api/v6/channels/${id}/messages`, {
            method: "GET",
            headers: getHeaders(gudTokens[0])
        })

        if (tempRes.status == 400 || tempRes.status == 404) {
            if (isNaN(id) || id.length < 10) {
                return console.log(getMsg("warn", "Please, enter a vaild channel id."))
            }
        }

        while (true) {
            for (let i = 0; i < gudTokens.length; i++) {
                let token = gudTokens[i]
                try {
                    let formatedMsg = msg;
                    let generated = ""
                    if (randomNum) {
                        for (let o = 0; o < randomNumLenght; o++) {
                            let ran = abeceda[Math.round(Math.random() * abeceda.length)];
                            if (ran === undefined) {
                                generated += "F";
                            } else {
                                generated += ran
                            }
                        }
                        formatedMsg += " | " + generated
                    }
                    fetch(`https://discordapp.com/api/v6/channels/${id}/messages`, {
                        method: "POST",
                        headers: getHeaders(token),
                        body: JSON.stringify({ content: formatedMsg })
                    })
                        .then(async res => {
                            const statuscode = res.status.toLocaleString()
                            if (statuscode == "403") {
                                return console.log(getMsg("warn", `${res.statusText} - ${token}`))
                            } else if (statuscode == "401") {
                                return console.log(getMsg("warn", `This token is invaild! - ${token}`))
                            } else if (statuscode.startsWith(2)) {
                                return console.log(getMsg("info", `Message sent`))
                            } else if (statuscode == "429") {
                                console.log(getMsg("warn", `You got slowmode or ratelimited`))
                            } else {
                                return console.log(getMsg("warn", `${statuscode} - ${token}`))
                            }
                        })
                } catch (error) {
                    console.log(error)
                }
                
                if(smoothSpam) {
                    if (bypassSlowmodeAlogritmus === true) {
                        await sleep((slowmode / tokens.length) + ((slowmode < delay ? 1 : 0) * delay))
                    } else {
                        await sleep(delay)
                    }
                } else {
                    if (bypassSlowmodeAlogritmus === true) {
                        await sleep(((slowmode / tokens.length) + ((slowmode < delay ? 1 : 0) * delay)) / 2)
                    } else {
                        await sleep(delay / 2)
                    }
                }
            }
            if(!smoothSpam) {
                if (bypassSlowmodeAlogritmus === true) {
                    await sleep((slowmode / tokens.length) + ((slowmode < delay ? 1 : 0) * delay))
                } else {
                    await sleep(delay)
                }
            }
        }

    });

}
function getHeaders(authorization) {
    return {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US',
        'Cookie': `__cfuid=${randstr(43)}; __dcfduid=${randstr(32)}; locale=en-US`,
        'DNT': '1',
        'origin': 'https://discord.com',
        'TE': 'Trailers',
        'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDAxIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDIiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2J1aWxkX251bWJlciI6ODMwNDAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
        'authorization': authorization,
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    }
}
function getHeaders2(authorization) {
    return {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US',
        'Cookie': `__cfuid=${randstr(43)}; __dcfduid=${randstr(32)}; locale=en-US`,
        'DNT': '1',
        'origin': 'https://discord.com',
        'TE': 'Trailers',
        'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDAxIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDIiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2J1aWxkX251bWJlciI6ODMwNDAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
        'authorization': authorization,
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    }
}

function randstr(len) {
    let alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    let text = ''
    for (let i = 0; i < len; i++) {
        text += alpha[Math.floor(Math.random() * alpha.length)];
    }
    return text;
}

fs.readFile("./tokens.txt", "utf8", (ERRR, CONTENT) => {
    let tokenss = CONTENT.split(/\r?\n/)
    fs.readFile("./config.json", "utf8", (err, content_) => {
        let content = JSON.parse(content_)
        content.tokens = tokenss
        run(content)
    })
})





