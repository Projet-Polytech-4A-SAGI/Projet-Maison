const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('radiateur')
		.setDescription('Controle les radiateurs')
				.addSubcommand(subcommand =>
			subcommand.setName("toggle")
			.setDescription("Change la consigne du radiateur")
			.addNumberOption(option =>
				option.setName("temp")
				.setDescription("Température de consigne")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(40)))
		.addSubcommand(subcommand =>
			subcommand.setName("get")
			.setDescription("Renvoie les température de consigne et de la pièce")),
	async execute(interaction) {
		console.log("Radiateur.js : La commande /radiateur a été appelée");
		const subCommandName = interaction.options.getSubcommand();
		let reply = "";
		if (subCommandName==="toggle")
		{
			const consigne = interaction.options.getNumber("Temp");
			controller.Radiator.toggleRadiator(consigne);
			reply = "Consigne mise à jour";
		}
		else if(subCommandName === "get")
		{
			reply = "TempC :" + "\r\nTempEau :";
		}
		await interaction.reply({content:reply, ephemeral:true});
	},
};
