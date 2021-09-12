import fetch from 'node-fetch';

import fs from "fs";


const abeceda = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

async function run(config) {
    let delay = config.delay;
    const msg = config.msg;
    const tokens = config.tokens;
    const channelId = config.channelId;
    const slowmode = config.slowmode;
    const randomNum = config.randomNum;
    const bypassSlowmodeAlogritmus = config.bypassSlowmodeAlogritmus;

    while (true) {
        for(let i=0;i<tokens.length;i++) {
            let token = tokens[i]
            try{
                let formatedMsg = msg;
                let generated = ""
                if(randomNum) {
                    for(let o=0;o<12;o++) {
                        let ran = abeceda[Math.round(Math.random() * abeceda.length)];
                        if(ran === undefined) {
                            generated += "F";
                        } else {
                            generated += ran
                        }
                    }
                    formatedMsg += " | " + generated
                }
                fetch(`https://discordapp.com/api/v6/channels/${channelId}/messages`, {
                    method: "POST",
                    headers: getHeaders(token),
                    body: JSON.stringify({ content: formatedMsg })
                })
                .then(async res => {
                    if(res.status == 403) {
                        return console.log("There is slowmode or you are muted!")
                    }
                    if(res.status == 401) {
                        return console.log("This token is invaild! -" + token)
                    }
                    if(res.status == 200) {
                        return console.log("Message sent")
                    } else {
                        console.log(res.status)
                        delay += 10

                        if(delay < 500) {
                            delay = config.delay;
                        }
                    }
                })
            } catch(error) {
                console.log(error)
            }
            if(bypassSlowmodeAlogritmus === true) {
                console.log("wwait")
                await sleep((slowmode/tokens.length)+((slowmode<delay ? 1 : 0)*delay))
            } else {
                console.log("wait")
                await sleep(delay)
            }
        }
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


