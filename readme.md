# littlebotfren

## Installation guide

* you must have node installed to run this bot locally.
* You will also need other packages. To install these, run this command:
```sh
npm install
```

## Running the bot locally:

### To just run the bot, write this command:
```sh
npm run start
```

## Developing on the bot.
* If you want to update the bot's behavior while you are developing on it, run this command:
```sh
npm run startOnSave
```


* To compile the typescript to javascript, use 
```sh
webpack
```
**or**
```sh
npm run build
```


* If you want it to compile every time you save, use command: 
```sh
npm run buildOnSave
```

> You will need a .env file to run this locally. It requires a BOT_TOKEN value, which you can find on [Discord's website].


[Discord's website]: <https://discordapp.com/developers/applications/>