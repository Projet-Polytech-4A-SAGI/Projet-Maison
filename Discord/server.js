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

let io;

function SetIo(socket){
    io=socket;
}

const volet = [controller.Shutter1, controller.Shutter2]
const lights = [controller.Light1, controller.Light2, controller.Light3]
const radiateurs = [controller.Radiator1, controller.Radiator2]


nlp.plugin({
    tags:{
      Heat: {},
      Light: {},
      Shutter: {},},
	words:{
		chauffage : "Heat",
		radiateur : "Heat",
		volet : "Shutter",
		fenetre : "Shutter",
		fenêtre : "Shutter",
		fenêtres : "Shutter",
		store : "Shutter",
		lampe : "Light",
		lumiere : "Light",
		chauffages : "Heat",
		radiateurs : "Heat",
		volets : "Shutter",
		fenetres : "Shutter",
		stores : "Shutter",
		lampes : "Light",
		lumieres : "Light",
		lumières : "Light",
		lumière : "Light"

	}
	})





const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

console.log("discord.js : Début");
var channel = client.channels.cache.get(channel_id);
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
	channel = client.channels.cache.get(channel_id)
	channel.send("Le bot a été lancé.");
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
		io.emit("commands", `${interaction.user.username} a executé la commande ${interaction.commandName}`)
		io.emit("dataUpdated",'')


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
	channel = client.channels.cache.get(channel_id)
	let doc = nlp(msg);
	let docFR = new nlp_fr(msg);
	let boolChauffage = doc.has('#Heat');
	let boolVolet = doc.has('#Shutter');
	let boolLight = (doc.has("#Light"));
	let piece = -1
	let val = tal(msg).numbers().get();
	var pieces = ["chambre","salon","toilettes"];
	if(doc.has("chambre"))
	{
		piece = 1;
	}
	else if(doc.has("salon"))
	{
		piece = 2;
	}
	else if(doc.has("toilette") || doc.has("toilettes"))
	{
		piece = 3;
	}
	if (boolChauffage) {
		try
		{
			if(val.length != 1)
			{
				throw new Error();
			}
		radiateurs[piece-1].toggleRadiator(val[0]);
		channel.send('Le radiateur de la pièce "'+pieces[piece-1]+'" a été réglé à '+val[0]+"°");

		}
		catch(e)
		{
			channel.send("Votre instruction est incorrecte, veuillez réessayer.");

		}

	}
	else if (boolVolet) {
		try {
			docFR.lemmatizer().forEach(element => {
				if (element.lemma == "ouvrir") {
					if(!volet[piece-1].getVoletState())
					{
					volet[piece-1].toggleVolet();
					channel.send('Le volet de la pièce "'+pieces[piece-1]+'" a été ouvert');
					}
					else
					{
						channel.send('Le volet est déjà ouvert');

					}

				}
				else if (element.lemma == "fermer") {
					if(!volet[piece-1].getVoletState())
					{
					volet[piece-1].toggleVolet();
					channel.send('Le volet de la pièce "'+pieces[piece-1]+'" a été ouvert');
					}
					else
					{
						channel.send('Le volet est déjà fermé');
					}

				}
				else
				{
					channel.send("Votre instruction n'est pas reconnue, veuillez réessayer.");

				}
			})	
		} catch (e) {
			channel.send("Votre instruction est incorrecte, veuillez réessayer.");
		 };
	}
	else if (boolLight) {
		try {
			docFR.lemmatizer().forEach(element => {
				if (element.lemma == "allumer") {
					lights[piece-1].toggleLight();
					if(!lights[piece-1].getLightState)
					{
						channel.send('La lampe de la pièce "'+pieces[piece-1]+'" a été allumée');
					}
					else
					{
						channel.send('La lampe est déjà allumée');
					}

				}
				else if (element.lemma == "éteindre") {
					if(lights[piece-1].getLightState())
					{
					lights[piece-1].toggleLight();
					channel.send('La lampe de la pièce "'+pieces[piece-1]+'" a été éteinte');
					}
					else
					{
						channel.send('La lampe est déjà allumée');
					}

				}
				else
				{
					channel.send("Votre instruction n'est pas reconnue, veuillez réessayer.");

				}
			})
		} catch (e) {
			channel.send("Votre instruction est incorrecte, veuillez réessayer.");
		 };
	}
	else
	{
		
	}

}


client.on(Events.MessageCreate, async message => {
	if (message.channelId === channel_id && !message.author.bot) {
		msg = nlp(message.content);
		sentences = msg.sentences().out("array");
		sentences.forEach(element => {
			parse(element);

		})
	}
});

client.login(token);
console.log("discord.js : Fin");


module.exports = {
    SetIo
};