import * as dotenv from "dotenv";
import Discord from "discord.js";
import { Bot } from "./Bot";

dotenv.config();

const discordClient = new Discord.Client();
const botClient = new Bot.Client("!", ["color", "colors"]);

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