# Features
This bot has some automatic features and some features that trigger on a command. Commands are not case sensitive.

### Live role 
#### Required permissions: N/A, automatic.
* This comes under the assumption that the server has a role called 'live'.
* Whenever someone goes live, the bot will automatically assign them to the 'live' role.
* This role should be high up on the list if you want the live section to be visible on the user list.

## Commands 

### Addcommand
#### Required permissions: 'Administrator', 'Ban_members' (administrator / moderator)
* This command adds a command keyword to the list of commands.
* Currently this is used as a way to turn off the bot commands if it is unwanted.
* This feature does currently not support creation of custom commands.
#### Example:
> !addcommand color

### Color 
#### Required permissions: Anyone
* Granted that the respective color-role is available to the user, writing !color <color> will assign the user to said color-role.
* What you call the color is up to you, as long as the name of the role ends with 'Color'.
#### Example: 
Role: "blueColor"
> !color blue

### Colors 
#### Required permissions : anyone
* This will look through the server's roles and respond with the available colors.
#### Example:
> "Viable options are: red,blue,purple"

### Commands
#### Required permissions: anyone, results vary between user permissions.
* This command responds with the commands the individual user has access to.
#### Example:
> "Available commands are: color,colors,addcommand,createrole,deleterole,commands,removecommand"

### Createrole
#### Required permissions: manage roles
* This command allows the user to create a role. It sets the name and color. 
* Currently does not support sending permissions.
* The syntax is (currently) !createrole <name> <color>. Color is the hexadecimal value of the desired color.
#### Example:
> !createRole myRole #FF00FF

### Deleterole
#### Required permissions: manage roles
* This command deletes an unwanted role.
* Syntax is !deleterole <name>
#### Example:
> !delete myRole

### rainbow
#### Required permissions: anyone
* This creates a role for the user, changing the role's color every 3 seconds.
#### Example:
> !rainbow