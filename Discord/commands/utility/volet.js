const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
const volet = [controller.Shutter1, controller.Shutter2]
module.exports = {
	data: new SlashCommandBuilder()
		.setName('volet')
		.setDescription('Ouvre/Ferme les volets')
		.addSubcommand(subcommand =>
			subcommand.setName("toggle")
				.setDescription("Change l'état des volets")
				.addStringOption(option =>
					option.setName("piece")
						.setDescription("Quel volet ouvrir ?")
						.setRequired(true)
						.addChoices(
							{ name: "Chambre", value: "chambre" },
							{ name: "Salon", value: "salon" },
						))
				/*.addIntegerOption(option =>
					option.setName("numero")
						.setDescription("Quel volet ouvrir ?")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(volet.length))*/
				.addStringOption(option =>
					option.setName("etat")
						.setDescription("etat du volet")
						.setRequired(false)
						.addChoices(
							{ name: "Ouvrir", value: "O" },
							{ name: "Fermer", value: "F" }
						))
		)
		.addSubcommand(subcommand =>
			subcommand.setName("get")
				.setDescription("Renvoie l'état des volets")
				/*.addIntegerOption(option =>
					option.setName("numero")
						.setDescription("Quel volet ?")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(volet.length))*/
						.addStringOption(option =>
							option.setName("piece")
								.setDescription("Quel volet ouvrir ?")
								.setRequired(true)
								.addChoices(
									{ name: "Chambre", value: "chambre" },
									{ name: "Salon", value: "salon" },
								)))
	,
	async execute(interaction) {
		console.log("Volet.js : La commande /volet a été utilisée");
		//const piece = ["chambre","salon","cuisine"]
		const subCommandName = interaction.options.getSubcommand();
		const piece = interaction.options.getString("piece") ?? 1;
		var num = -1;
			switch (piece)
			{
				case "chambre":
					num = 1
					break;
				case "salon":
					num = 2
					break;
				case "toilettes":
					num = 3
					break;
			}
		let reply = "";
		if (subCommandName === "toggle") {
			const value = interaction.options.getString("etat") ?? "toggle";
			

			switch (value) {
				case "O":
					if (!volet[num - 1].getVoletState()) {
						volet[num - 1].toggleVolet(true);
						reply = "Le volet de la pièce \""+piece +"\" a été ouvert";
					}
					else {
						reply = "Le volet est déjà ouvert";
					}
					break;
				case "F":
					if (volet[num - 1].getVoletState()) {
						volet[num - 1].toggleVolet(false);
						reply = "Le volet de la pièce \""+piece +"\" a été fermé";
					}
					else {
						reply = "Le volet est déjà fermé";
					}
					break;
				default:
					volet[num - 1].toggleVolet();
					if (volet[num - 1].getVoletState()) {
						reply = "Le volet de la pièce \""+piece +"\" a été ouvert";
					}
					else {
						reply = "Le volet de la pièce \""+piece +"\" a été fermé";
					}

			}
		}
		else if (subCommandName === "get") {
			reply = "";
			if (volet[num - 1].getVoletState()) {
				reply = "Le volet est ouvert";
			}
			else {
				reply = "Le volet est fermé";
			}
		}
		await interaction.reply({ content: reply, ephemeral: true });
	},
};
