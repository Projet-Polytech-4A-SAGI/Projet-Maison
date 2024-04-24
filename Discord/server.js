var debug = require('debug')('Discord:server.js');
const controller = require('../Controller/controller.js');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, messageLink } = require('discord.js');
const { groupCollapsed } = require('node:console');
require('dotenv').config();
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


tal.plugin({
    tags:{
      Heat: {},
      Light: {},
      Shutter: {},},
	words:{
		chauffage : "Heat",
		radiateur : "Heat",
        temperature : "Heat",
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


function parse(msg)
{

channel = client.channels.cache.get(channel_id)
let doc = tal(msg);
let boolChauffage = doc.has('#Heat');
let boolVolet = doc.has('#Shutter');
let boolLight = (doc.has("#Light"));
let piece = -1
let val = doc.numbers().get();
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
if ((boolChauffage && boolLight) || (boolChauffage && boolVolet) || (boolLight && boolVolet)) {
	let reply = "Le bot ne prend qu'une instruction par phrase. Veuillez reformuler"
    channel.send(reply)
    return null 
}
if((boolChauffage || boolLight || boolVolet) && piece == -1)
{
    let reply = "La pièce n'est pas prise en compte ou n'existe pas.\r\nVeuillez utiliser les pièces suivantes:"
    reply = reply + "\r\n- Chambre\r\n- Salon\r\n- Toilettes"
    channel.send(reply)
    return null
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
        let found = false
            if (doc.has("{ouvrir}")) {
                found = true
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
            else if (doc.has("{fermer}")) {
                found = true
                if(volet[piece-1].getVoletState())
                {
                volet[piece-1].toggleVolet();
                channel.send('Le volet de la pièce "'+pieces[piece-1]+'" a été fermé');
                }
                else
                {
                    channel.send('Le volet est déjà fermé');
                }

            }
        if(!found)
        {
            channel.send("Votre instrcution n'est pas reconnue. Veuillez utiliser les verbes \"ouvrir\" ou \"fermer\".");
        }
    } catch (e) {
        channel.send("Votre instruction est incorrecte, veuillez réessayer.");
     };
}
else if (boolLight) {
    try {
        let found = false
            if (doc.has("{allumer}")) {
                found = true
                if(!lights[piece-1].getLightState())
                {
                    lights[piece-1].toggleLight();
                    channel.send('La lampe de la pièce "'+pieces[piece-1]+'" a été allumée');
                }
                else
                {
                    channel.send('La lampe est déjà allumée');
                }

            }
            else if (doc.has("{eteindre}")) {
                found = true
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
        if(!found)
        {
            channel.send("Votre instrcution n'est pas reconnue. Veuillez utiliser les verbes \"allumer\" ou \"éteindre\".");
        }
    } catch (e) {
        channel.send("Votre instruction est incorrecte, veuillez réessayer.");
     };
}
else
{
    
}

}


client.on(Events.MessageCreate, async message => { // Evenement Discord
	if (message.channelId === channel_id && !message.author.bot) {//Si l'id du channel est bon et que le message est écrit par un humain
		msg = tal(message.content); //On convertit notre message en objet traitale avec fr-Compromise
		sentences = msg.sentence().out("array");// On extrait chaque phrase une par une
		sentences.forEach(element => {
			parse(element);// Et on passe chacune d'entre elles dans l'algorithme

		})
	}
});

client.login(token);
console.log("discord.js : Fin");


module.exports = {
    SetIo
};