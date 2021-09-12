import requests
import time
import random

def getHeaders(authorization) :
    one = randstr(43)
    two = randstr(32)
    return {
        # 'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US',
        'Cookie': f'__cfuid={randstr(43)}; __dcfduid={randstr(32)}; locale=en-US',
        'DNT': '1',
        'origin': 'https://discord.com',
        'TE': 'Trailers',
        'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDAxIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDIiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2J1aWxkX251bWJlciI6ODMwNDAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
        'authorization': authorization,
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    }

def randstr(lenn) :
    alpha = "abcdefghijklmnopqrstuvwxyz0123456789"
    text = ''
    for i in range(0,lenn): 
        text += alpha[random.randint(0,len(alpha)-1)]

    return text




link = input('Discord Invite Link: ')

apilink = "https://discordapp.com/api/v6/invite/" + str(link)

print (link)

with open('tokens.txt','r') as handle:
        tokens = handle.readlines()
        for tokenn in tokens:

            token = tokenn.rstrip()

            headers = getHeaders(token)

            r = requests.post(apilink, headers=headers)
            if r.status_code == "403" or r.status_code == 403:
                print(token + " - Is locked!")
            else:
                print(r.status_code)
            time.sleep(0.350)

        print ("joined!")

