# MiftikRAID
AKA **Nejlepší node.js free raid toolka která nelockuje tokeny**
## Setup
Zapni **run.bat** a tam napiš tyhle příkazy:
```
npm install
pip install requests
```

potom si nastav soubor `config.json`

potom do souboru `tokens.txt` napiš tokeny (pokud chceš mít spam rychlej, dej alespoň 4)
napiš to například takhle:
```
ObQsdWgfSDS_Ausa_.KJDSadasdsadsa
OSDKJDSbQsdWgfS_.SDaEsa_.KJDSbQs
ObQsdWgSDKJDSbQsdRDha_.KJDSWgfSe
```

## Použití toolky
- otevři **run.bat** a tam napiš...
  ```
  Spammer - node .
  Joiner - python join.py
  Leaver - python leave.py
  Reaction - node reaction.js
  ```
  
## Informace
- Jak dát custom emoji do reaction bypassu?
    > do "emoji" v **config.json** napiš `emojiName:emojiId`

## Jak nastavit zprávně delay
- 1 až 4 tokeny **300**
- 5 až 10 tokenů **185**
- 11 až 14 tokenů **125**
- 15 až 25 nebo více tokenů **100**

## Output kódy
- 2xx **nice**
- 400 **špatnej requests, pravděpodobně jsi něco zadal špatně**
- 401 **špatný token**
- 403 **toolka nemá přístup k tokenu/channelu nebo podobně**
- 404 **nenalezeno**
- 405 **tohle se ti asi nikdy neukáže**
- 3xx **tohle se ti asi taky nikdy neukáže**

