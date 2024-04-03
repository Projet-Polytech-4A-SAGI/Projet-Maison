var debug = require('debug')('Discord:server.js');

const controller = require('../Controller/controller.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { groupCollapsed } = require('node:console');
require('dotenv').config();
const nlp = require('compromise');
const nlp_fr = require('nlp-js-tools-french');
const tal = require("fr-compromise");
const token = process.env.token;
const channel_id = process.env.channelId

const volet = [controller.Shutter1, controller.Shutter2]
const lights = [controller.Light1, controller.Light2, controller.Light3]
const radiateurs = [controller.Radiator1, controller.Radiator2]

var list_heat = ["radiateur","chauffage"]
var list_shutter = ["volet","fenetre","store"]
var list_light = ["lampe","lumiere",]
nlp.plugin({
    tags:{
      Heat: {},
      Light: {},
      Shutter: {},}})

nlp(list_heat).tag("Heat")
nlp(list_shutter).tag("Light")
nlp(list_light).tag("Shutter")

var piece = new Map()




const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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


function parse(msg) {
	let doc = nlp(msg);
	let docFR = new nlp_fr(msg);
	let boolChauffage = doc.has('#Heat');
	let boolVolet = doc.has('#Shutter');
	let boolLight = (doc.has("#Light"));
	let piece
	val = tal(msg).numbers().get();
	if(doc.has("chambre"))
	{
		piece = 1
	}
	else if(doc.has("salon"))
	{
		piece = 2
	}
	else if(doc.has("cuisine"))
	{
		piece = 2
	}
	if (boolChauffage) {
		radiateurs[val[0]-1].toggleRadiator(val[1]);

	}
	else if (boolVolet) {
		try {
			docFR.lemmatizer().forEach(element => {
				if (element.lemma == "ouvrir") {
					volet[val[0]-1].toggleVolet();
				}
				else if (element.lemma == "fermer") {
					volet[val[0]-1].toggleVolet();
				}
			})	
		} catch (e) { };
	}
	else if (boolLight) {
		try {
			docFR.lemmatizer().forEach(element => {
				if (element.lemma == "allumer") {
					lights[val[0] - 1].toggleLight();
				}
				else if (element.lemma == "éteindre") {
					lights[val[0] - 1].toggleLight();
				}
			})
		} catch (e) { };
	}

}


client.on(Events.MessageCreate, async message => {
	if (message.channelId === channel_id) {
		msg = nlp(message.content);
		sentences = msg.sentences().out("array");
		sentences.forEach(element => {
			parse(element);

		})
	}
});

client.login(token);
console.log("discord.js : Fin");