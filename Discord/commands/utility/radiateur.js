const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
const radiateurs = [controller.Radiator1, controller.Radiator2]
module.exports = {
	data: new SlashCommandBuilder()
		.setName('radiateur')
		.setDescription('Controle les radiateurs')

		.addSubcommand(subcommand =>
			subcommand.setName("toggle")
				.setDescription("Change la consigne du radiateur")

				/*.addNumberOption(option =>
					option.setName("numero")
						.setDescription("numero du radiateur")
						.setRequired(true)
						.setMinValue(0)
						.setMaxValue(radiateurs.length))*/
				.addStringOption(option =>
					option.setName("piece")
						.setDescription("Quelle pièce chauffer ?")
						.setRequired(true)
						.addChoices(
							{ name: "Chambre", value: "chambre" },
							{ name: "Salon", value: "salon" },
						))

				.addNumberOption(option =>
					option.setName("temp")
						.setDescription("Température de consigne")
						.setRequired(true)
						.setMinValue(0)
						.setMaxValue(40))
		)

		.addSubcommand(subcommand =>
			subcommand.setName("get")
				.setDescription("Renvoie les température de consigne et de la pièce")
				.addStringOption(option =>
					option.setName("piece")
						.setDescription("Quelle pièce chauffer ?")
						.setRequired(true)
						.addChoices(
							{ name: "Chambre", value: "chambre" },
							{ name: "Salon", value: "salon" },
						))),
	async execute(interaction) {
		console.log("Radiateur.js : La commande /radiateur a été appelée");
		//const piece = ["chambre","salon","cuisine"]
		const subCommandName = interaction.options.getSubcommand();
		let reply = "";
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

		if (subCommandName === "toggle") {
			const consigne = interaction.options.getNumber("Temp");
			if (num != 0) {
				radiateurs[num - 1].toggleRadiator(consigne);
			}
			else {
				radiateurs.forEach(element => {
					element.toggleRadiator(consigne);

				});
			}
			reply = "Consigne mise à jour";
		}
		else if (subCommandName === "get") {
			reply = "TempC : " + radiateurs[num - 1].getTempC() + "\r\nTempEau : " + radiateurs[num - 1].getTempEau();
		}
		await interaction.reply({ content: reply, ephemeral: true });
	},
};
