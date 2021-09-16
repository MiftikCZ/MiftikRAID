// 

import fetch from 'node-fetch';

import fs from "fs";


const abeceda = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
//**[** *MiftikCZ army* **]** https://discord.gg/QMGH3j7a
async function run(Config) {
    const config = Config.reactionBypass;
    const messageId = config.messageId;
    const channelId = config.channelId;
    const tokens = Config.tokens;
    const emoji = encodeURI(config.emoji);
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i]
        try {
            fetch(`https://discordapp.com/api/v6/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`, {
                method: "PUT",
                headers: getHeaders(token)
            })
                .then(async res => {
                    if (res.status == 403 || res.status == "403") {
                        return console.log("Your not on the server or you don't have permissions")
                    }
                    if (res.status == 401 || res.status == "401") {
                        return console.log("This token is invaild! -" + token)
                    }
                    if (res.status == 404 || res.status == "404") {
                        return console.log("Message with this reaction doesn't exist!")
                    }
                    if (res.status == 200 || res.status == 204) {
                        return console.log("Reaction sent")
                    } else {
                        console.log(res.status + " - " +res.statusText + " - " + token)
                    }
                })
        } catch (error) {
            console.log(error)
        }
        await sleep(300)
    }

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