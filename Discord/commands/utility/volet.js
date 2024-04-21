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
				.addIntegerOption(option =>
					option.setName("numero")
						.setDescription("Quel volet ouvrir ?")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(volet.length))
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
				.addIntegerOption(option =>
					option.setName("numero")
						.setDescription("Quel volet ?")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(volet.length)))
	,
	async execute(interaction) {
		console.log("Volet.js : La commande /volet a été utilisée");
		const piece = ["chambre","salon","cuisine"]
		const subCommandName = interaction.options.getSubcommand();
		let reply = "";
		if (subCommandName === "toggle") {
			const value = interaction.options.getString("etat") ?? "toggle";
			const num = interaction.options.getInteger("numero") ?? 1;
			switch (value) {
				case "O":
					if (!volet[num - 1].getVoletState()) {
						volet[num - 1].toggleVolet();
						reply = "Le volet de la pièce \""+piece[num -1] +" a été ouvert";
					}
					else {
						reply = "Le volet est déjà ouvert";
					}
					break;
				case "F":
					if (volet[num - 1].getVoletState()) {
						volet[num - 1].toggleVolet();
						reply = "Le volet de la pièce \""+piece[num -1] +" a été fermé";
					}
					else {
						reply = "Le volet est déjà fermé";
					}
					break;
				default:
					volet[num - 1].toggleVolet();
					if (volet[num - 1].getVoletState()) {
						reply = "Le volet de la pièce \""+piece[num -1] +" a été ouvert";
					}
					else {
						reply = "Le volet de la pièce \""+piece[num -1] +" a été fermé";
					}

			}
		}
		else if (subCommandName === "get") {
			const num = interaction.options.getInteger("numero") ?? 1;
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
