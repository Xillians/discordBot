import dotenv from "dotenv";
import Discord from "discord.js";
import { Bot } from "./Bot";
import http from 'http';

http.createServer().listen(process.env.PORT || 5000);
dotenv.config();

const discordClient = new Discord.Client();
if(!process.env.commandprefix) throw Error("no command prefix set!");
    const botClient = new Bot.Client(process.env.commandprefix, ["color", "colors"]);

discordClient.on("ready", () => {
    console.log("Connected!");
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("message", async message => {
    await botClient.tryCommand(message);
});

discordClient.on("presenceUpdate", newMember => {
    botClient.verifyStreamingStatus(newMember);
});

discordClient.login(process.env.BOT_TOKEN);