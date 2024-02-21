require('dotenv').config()

var debug = require('debug')('http')
  , http = require('http')
  , name = 'deploy_commands.js';

const { REST, Routes } = require('discord.js');
const clientId = process.env.clientId;
const guildId = process.env.guildId; 
const token = process.env.token;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			debug(`%o [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`, name);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		debug(`%o Started refreshing ${commands.length} application (/) commands.`, name);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		debug(`%o Successfully reloaded ${data.length} application (/) commands.`, name);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
