const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volet')
		.setDescription('Ouvre/Ferme les volets')
		.addSubcommand(subcommand =>
			subcommand.setName("toggle")
			.setDescription("Change l'état des volets")
			.addStringOption(option =>
				option.setName("etat")
				.setDescription("etat du volet")
				.setRequired(false)
				.addChoices(
					{name:"Ouvrir",value : "O"},
					{name:"Fermer",value : "F"}
				)))
		.addSubcommand(subcommand =>
			subcommand.setName("get")
			.setDescription("Renvoie l'état des volets"))
		,
	async execute(interaction) {
		console.log("Volet.js : La commande /volet a été utilisée");
		const subCommandName = interaction.options.getSubcommand();
		let reply = "";
		if (subCommandName=== "toggle")
		{
			const value = interaction.options.getString("etat") ?? "toggle";
			switch (value)
			{
				case "O":
					if(!controller.Volet.getVoletState())
					{
						controller.Volet.toggleVolet();
						reply = "Le volet a été ouvert";
					}
					else
					{
						reply = "Le volet est déjà ouvert";
					}
					break;
				case "F":
					if(controller.Volet.getVoletState())
					{
						controller.Volet.toggleVolet();
						reply = "Le volet a été fermé";
					}
					else
					{
						reply = "Le volet est déjà fermé";
					}
					break;
				default:
					controller.Volet.toggleVolet();
					if(controller.Volet.getVoletState())
					{
						reply = "Le volet a été ouvert";
					}
					else
					{
						reply = "Le volet a été fermé";
					}
				
			}
		}
		else if(subCommandName	=== "get")
		{
			if(controller.Volet.getVoletState())
			{
				reply = "Le volet est ouvert";
			}
			else
			{
				reply = "Le volet est fermé";
			}
		}
		await interaction.reply({content:reply, ephemeral:true});
	},
};
