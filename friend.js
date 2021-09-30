// https://discord.com/api/v9/users/@me/relationships/
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
// abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
const abeceda = "123456789";

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
    const tokens = Config.tokens.filter(token => token);

    rl.question(getMsg("question", "User id"), async id => {
        tokens.forEach(async token => {
            try {

                fetch(`https://discord.com/api/v9/users/@me/relationships/${id}`, {
                    method: "PUT",
                    headers: getHeaders(token),
                    body: JSON.stringify({})
                })
                    .then(async res => {
                        const statuscode = res.status.toLocaleString()
                        if (statuscode == "403") {
                            return console.log(getMsg("warn", `${res.statusText} - ${token}`))
                        } else if (statuscode == "401") {
                            return console.log(getMsg("warn", `This token is invaild! - ${token}`))
                        } else if (statuscode.startsWith(2)) {
                            return console.log(getMsg("info", `Friend request sent`))
                        } else if (statuscode == "429") {
                            console.log(getMsg("warn", `You got slowmode or ratelimited`))
                        } else {
                            return console.log(getMsg("warn", `${JSON.stringify(await res.json())} - ${token}`))
                        }
                    })
                    await sleep(120)
            } catch (error) {
                console.log(error)
            }
        })

    });

}
function getHeaders(authorization) {
    return {
        'Content-Type': "application/json",
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US',
        'Cookie': `__cfuid=${randstr(43)}; __dcfduid=${randstr(32)}; locale=en-US`,
        'DNT': '1',
        'origin': 'https://discord.com',
        "Referer": "https://discord.com/channels/882243370808930375/891613744612929558",
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
