import dotenv from "dotenv";
import Discord from "discord.js";
import { Bot } from "./Bot";
import http from 'http';

http.createServer().listen(process.env.PORT || 5000);
dotenv.config();
console.assert(true === true);

const discordClient = new Discord.Client();
if(!process.env.commandprefix) throw Error("no command prefix set!");
let botClients: Bot.Client[] = [];

discordClient.on("ready", () => {
    console.log("Connected!");
    console.log(`Logged in as ${discordClient.user.tag}!`);
    const guilds = discordClient.guilds;
    guilds.forEach(guild => {
        const botClient = new Bot.Client(process.env.commandprefix, guild.name, ["color", "colors", "rainbow", "setlivename"]);
        botClients.push(botClient);
    });
});

discordClient.on("message", async message => {
    const botClient = botClients.find( Client => Client.serverName === message.guild.name);
    if(botClient) {
        await botClient.tryCommand(message);
    }
});

discordClient.on("presenceUpdate", newMember => {
    const botClient = botClients.find( Client => Client.serverName === newMember.guild.name);
    if(botClient) {
        botClient.verifyStreamingStatus(newMember);
    }
});

discordClient.login(process.env.BOT_TOKEN);