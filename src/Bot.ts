import Discord from 'discord.js';

export namespace Bot {
    export class Client {
        private readonly commandPrefix: string;
        public readonly serverName: string;
        private listOfCommands: string[];
        private liveRoleName: string;
        private readonly protectedCommands = [
            'addcommand', 
            'createrole', 
            'deleterole', 
            'commands', 
            'removecommand'
        ];

        constructor(commandPrefix: string | undefined, serverName: string, commands?: string[]) {
            if (commandPrefix == undefined)
                throw TypeError("client constructor: commandPrefix is not set!");
            if (serverName == undefined)
                throw TypeError("client constructor: serverName is not set!");

            this.commandPrefix = commandPrefix;
            this.serverName = serverName;
            if (commands)
                this.listOfCommands = commands;
            else
                this.listOfCommands = [];
            this.liveRoleName = "live";
        }

        private async addCommand(message: Discord.Message): Promise<void> {
            const commandToAdd: string = message.content.toLowerCase().split(" ")[1];
            if (!this.listOfCommands.includes(commandToAdd)) {
                this.listOfCommands.push(commandToAdd);
                await message.channel.send(`command **${commandToAdd}** has been added.`);
                console.log(this.listOfCommands);
            }
        }

        private async addRole(member: Discord.GuildMember, desiredRole: string): Promise<void> {
            if (member == undefined)
                throw TypeError("addRoleToUser: member not defined");
            if (desiredRole == undefined)
                throw TypeError("addRoleToUser: desiredRole is not defined");

            const newRole = this.findRole(member, desiredRole);
            const username = member.user.username
            if (newRole != undefined) {
                try {
                    await member.addRole(newRole);
                    console.log(`Added role: ${newRole} to user ${username}`);   
                } catch (error) {
                    console.log(`Failed to add role ${newRole} to user ${username}`);
                }
            }
            else
                console.log(`Failed to find role ${desiredRole}`);
        }

        private async changeColor(message: Discord.Message): Promise<void> {
            const desiredColor: string = message.content.toLowerCase().split(" ")[1];
            if (this.findRole(message.member, `${desiredColor}Color`)) {
                const user: Discord.GuildMember = message.member;
                user.roles.forEach(async role => {
                    const lowerCaseRoleName = role.name.toLowerCase();
                    const userHasRole = this.userHasRole(user, role)
                    if (lowerCaseRoleName.includes('color') && userHasRole) {
                        await this.removeRole(user, role);
                    }
                });
                await this.addRole(user, `${desiredColor}Color`);
            }
        }

        private commandIsRecognised(keyword: string): Boolean {
            if (this.listOfCommands.includes(keyword))
                return true;
            else if (this.protectedCommands.includes(keyword))
                return true;
            else {
                console.log(`Did not recognise command: ${keyword}`);
                return false;
            }
        }

        private async createRole(message: Discord.Message): Promise<void> {
            const name: string = message.content.split(" ")[1];
            const color: string = message.content.toLowerCase().split(" ")[2];
            if (name == undefined || color == undefined) {
                message.channel.send("Either name or color wasn't given.");
            }
            else {
                const hexadecimal = '^#+[a-fA-F0-9]{6}$';
                if (color.match(hexadecimal)) {
                    await message.guild.createRole({
                        name: name,
                        color: color
                    });
                    await message.channel.send(`Role **${name}** was created.`);
                }
                else if (!color.match(hexadecimal))
                    await message.channel.send("Color has to be a hexadecimal value. \n Format is: #000000 - #FFFFFF \n You can use this website to find a specific color: <https://htmlcolorcodes.com>");
            }
        }

        private async deleteRole(message: Discord.Message): Promise<void> {
            const name: string = message.content.split(" ")[1];
            if (name == undefined)
                message.channel.send("Role name wasn't given.");
            else {
                const roleToDelete = this.findRole(message.member, name);
                if (roleToDelete != undefined) {
                    roleToDelete.delete();
                    await message.channel.send(`Deleted role: ${name}`);
                }
                else
                    message.channel.send(`Couldn't find role ${name}`);
            }
        }

        private async executeCommand(message: Discord.Message, commandKeyword: string): Promise<void> {
            console.log(`Executing command ${commandKeyword}`);
            switch (commandKeyword) {
                case "addcommand": {
                    if (message.member.hasPermission(['ADMINISTRATOR', 'BAN_MEMBERS']))
                        await this.addCommand(message);
                    else
                        await message.channel.send("Wait... that's illegal!");
                    break;
                }
                case "color": {
                    if(message.member.hasPermission('SEND_MESSAGES'))
                        await this.changeColor(message);
                    else
                        await message.channel.send("Wait... how did we get here?"); // Seriously how would we even???
                    break;
                }
                case "colors": {
                    if(message.member.hasPermission('SEND_MESSAGES'))
                        await this.giveListOfColors(message);
                    else
                        await message.channel.send("Wait... how did we get here?"); // Seriously how would we even???
                    break;
                }
                case "commands": {
                    if(message.member.hasPermission('SEND_MESSAGES'))
                        await this.printCommands(message);
                    else
                        await message.channel.send("Wait.. how did we get here?"); // Seriously how would we even????
                    break;
                }
                case "createrole": {
                    if (message.member.hasPermission('MANAGE_ROLES'))
                        await this.createRole(message);
                    else
                        await message.channel.send("Wait... that's illegal!"); // just for the memes, remove later.
                    break;
                }
                case "deleterole": {
                    if (message.member.hasPermission('MANAGE_ROLES'))
                        await this.deleteRole(message);
                    else
                        await message.channel.send("Wait... that's illegal!"); //just for the memes, remove later.
                    break;
                }
                case "rainbow": {
                    if (message.member.hasPermission(["SEND_MESSAGES"]))
                        await this.rainbow(message);
                    else
                        await message.channel.send("Wait... that's illegal!"); //just for the memes, remove later.
                    break;
                }
                case "removecommand": {
                    if (message.member.hasPermission(['ADMINISTRATOR', 'BAN_MEMBERS']))
                        this.removeCommand(message);
                    else
                        message.channel.send("Wait... that's illegal!"); //just for the memes, remove later.
                    break;
                }
                case "setlivename": {
                    if (message.member.hasPermission(['ADMINISTRATOR', 'BAN_MEMBERS']))
                        this.setLiveRoleName(message);
                    else
                        message.channel.send("Wait... that's illegal!"); //just for the memes, remove later.
                    break;
                }
            }
        }
        
        private async giveListOfColors(message: Discord.Message): Promise<void> {
            const allRoles: Discord.Collection<string, Discord.Role> = message.guild.roles;
            let colorOptions: string[] = [];

            allRoles.forEach(role => {
                if (role.name.includes('Color')){
                    const roleName = role.name.substr(0, role.name.length - 'Color'.length);
                    colorOptions.push(`> ${roleName}\n`);
                }   
            });
            
            message.channel.send(`Viable options are: \n ${colorOptions.join("")}`);
        }

        private async printCommands(message: Discord.Message): Promise<void> {
            let allCommands: string[] = [];
            this.listOfCommands.forEach(command => {
                allCommands.push("> " + command + "\n");
            });
            if (message.member.hasPermission(['ADMINISTRATOR', 'BAN_MEMBERS'])) {
                this.protectedCommands.forEach(command => {
                    allCommands.push("> " + command + "\n");
                });
            }
            await message.channel.send(`Available commands are: ${allCommands.join("")}`);
        }

        private async rainbow(message: Discord.Message): Promise<string> {
            return new Promise(async (resolve) => {
                const username = message.member.user.username;
                if(this.findRole(message.member, `${username + "Color"}`)) {
                    console.log("role doesn't exist!");                    
                    await message.guild.createRole({
                        name: username + "Color",
                        color: "#000000"
                    });
                }
                var newRole = this.findRole(message.member, `${username + "Color"}`);    
                await message.member.addRole(newRole);
                var interval = setInterval(() => {
                    var roleExists = this.findRole(message.member, `${username + "Color"}`);
                    if(!roleExists) {
                        resolve("Role is gone!");
                        clearInterval(interval);
                    }
                    else {
                        let randomHex: string = (Math.floor(Math.random() * 16777216)).toString(16);
                        let hexValue = "000000".substr(0, 6-randomHex.length) + randomHex;
                        var newColor = `#${hexValue}`;       
                        console.log("new color is: ", newColor);                                
                        newRole.setColor(newColor);
                    }
                }, 5000);
            })
        }

        private async removeCommand(message: Discord.Message): Promise<void> {
            const commandToRemove: string = message.content.toLowerCase().split(" ")[1];
            if (this.listOfCommands.includes(commandToRemove)) {
                const command = this.listOfCommands.indexOf(commandToRemove);
                this.listOfCommands.splice(command, 1);
                await message.channel.send(`command **${commandToRemove}** has been removed.`);
                console.log(this.listOfCommands);
            }
        }

        private async removeRole(member: Discord.GuildMember, role: Discord.Role): Promise<void> {
            if (member == undefined)
                throw TypeError("removeRoleFromUser: member not defined");
            if (role == undefined)
                throw TypeError("removeRoleFromUser: role not defined");

            try {
                await member.removeRole(role);
                console.log(`Removed role ${role.name} from ${member.user.username}.`);
            } catch (error) {
                console.log(`Failed to remove role ${role.name} from ${member.user.username}`);
                console.log(error.message);
                
            }
        }

        private setLiveRoleName(message: Discord.Message): void {
            const name: string = message.content.split(" ")[1];
            this.liveRoleName = name;
            return;
        }

        public async tryCommand(message: Discord.Message): Promise<void> {
            if (message == undefined)
                throw TypeError("tryCommand: message is not set!");

            if (message.content.startsWith(this.commandPrefix)) {
                const commandKeyword = message.content.toLowerCase().split(" ")[0].substr(1);
                if (this.commandIsRecognised(commandKeyword) === true) {
                    await this.executeCommand(message, commandKeyword);
                }
            }
        }

        public async verifyStreamingStatus(member: Discord.GuildMember): Promise<void> {
            if (member == undefined)
                throw TypeError("verifyStreamingStatus: member is not defined.");

            const userHasLiveRole: Discord.Role = this.findRole(member, this.liveRoleName);
            const gameStatus: Discord.Game = member.user.presence.game;
            if (gameStatus === null && userHasLiveRole) {
                console.log("game presence null: user should not have role: live.");
                await this.removeRole(member, userHasLiveRole);
            }

            if (gameStatus !== null) {
                const streamingStatus: Boolean = gameStatus.streaming;
                if (streamingStatus && !userHasLiveRole)
                    await this.addRole(member, this.liveRoleName);
                else if (!streamingStatus && userHasLiveRole)
                    await this.removeRole(member, userHasLiveRole);
            }
        }

        private findRole(member: Discord.GuildMember, roleName: string): Discord.Role{
            const role = member.guild.roles.find(role => role.name.toLocaleLowerCase() === roleName.toLowerCase())
            role ? console.log(`found role ${roleName}`) : console.log(`failed to find role ${roleName}`);
            return role;
        }
 
        private userHasRole(member: Discord.GuildMember, role: Discord.Role): Boolean {
            return member.roles.has(role.id);
        }
    }
}