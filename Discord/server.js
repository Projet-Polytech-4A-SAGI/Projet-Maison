var debug = require('debug')('Discord:server.js');

const controller = require('../Controller/controller.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { groupCollapsed } = require('node:console');
require('dotenv').config();
const nlp = require('compromise');
const nlp_fr = require('nlp-js-tools-french');
const  token  = process.env.token;
const channel_id = process.env.channelId




const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

console.log("discord.js : Début");
const channel = client.channels.cache.get(channel_id);
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			debug(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	debug(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


function parse(msg)
{
	let doc = nlp(msg);
	let docFR =new nlp_fr(msg);
	let boolChauffage = doc.has('chauffage') || doc.has("temperature");
	let boolVolet = doc.has('volet');
	let boolLight = (doc.has("lampe") || doc.has("lumière"));
	let temp = 0;
	if (boolChauffage)
	{
		let tab = doc.terms().out("array");
		tab.forEach(element => {
			if(element.includes("°"))
			{
				temp = nlp(element).numbers().get()[0]; 
				controller.Radiator1.toggleRadiator(temp);
			}
		});
	}
	else if (boolVolet)
	{
		try{
		docFR.lemmatizer().forEach(element =>{
			if(element.lemma == "ouvrir")
			{
				controller.Shutter1.toggleVolet();
				throw {};
			}
			else if (element.lemma == "fermer")
			{
				controller.Shutter1.toggleVolet();
				throw {};
			}
		})
	}catch(e){};
	}
	else if (boolLight)
	{
		try{
			docFR.lemmatizer().forEach(element =>{
				if(element.lemma == "allumer")
				{
					throw {};
				}
				else if (element.lemma == "éteindre")
				{
					throw {};
				}
			})
		}catch(e){};
	}

}


client.on(Events.MessageCreate,async message =>{
	if (message.channelId === channel_id)
	{
		msg = nlp(message.content);
		sentences = msg.sentences().out("array");
		sentences.forEach(element =>{
		parse(element);

		})
	}
});

client.login(token);
console.log("discord.js : Fin");