const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
const lights = [controller.Light1, controller.Light2, controller.Light3]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('light')
		.setDescription('Controle la lumière')
		.addSubcommand(subcommand =>
			subcommand.setName("get")
				.setDescription("Renvoie l'état de la lampe")
				.addStringOption(option =>
					option.setName("piece")
						.setDescription("Quel lumière allumer ?")
						.setRequired(true)
						.addChoices(
							{ name: "Chambre", value: "chambre" },
							{ name: "Salon", value: "salon" },
							{ name: "Toilettes", value: "toilettes" },
						)))
		.addSubcommand(subcommand =>
			subcommand.setName("toggle")
				.setDescription("Allume ou éteint la lampe")
				.addStringOption(option =>
					option.setName("piece")
						.setDescription("Quel lumière allumer ?")
						.setRequired(true)
						.addChoices(
							{ name: "Chambre", value: "chambre" },
							{ name: "Salon", value: "salon" },
							{ name: "Toilettes", value: "toilettes" },
						))

				.addStringOption(option =>
					option.setName('etat')
						.setDescription("Quel est l'état choisi ?")
						.setRequired(false)
						.addChoices(
							{ name: 'on', value: 'on' },
							{ name: 'off', value: 'off' }
						))),

	async execute(interaction) {
		//const numero = interaction.options.getInteger('numero');
		//const piece = ["chambre","salon","cuisine"]
		const etat = interaction.options.getString('etat') ?? 'on';
		const piece = interaction.options.getString("piece") ?? 1;
		const subCommandName = interaction.options.getSubcommand();
		var num = -1;
		switch (piece) {
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
			var reply = "La lampe de la pièce \"" + piece + "\" a été ";
			if (etat == 'on' && !lights[num - 1].getLightState()) {
				lights[num - 1].toggleLight()
				reply += "allumée";
				await interaction.reply({ content: reply, ephemeral: true });

			}
			else if (etat == 'off' && lights[num - 1].getLightState()) {
				lights[num - 1].toggleLight()
				reply += "éteinte";
				await interaction.reply({ content: reply, ephemeral: true });

			}
			else {
				reply = "La lampe de la pièce \"" + piece + "\" est déjà dans cet état";
				await interaction.reply({ content: reply, ephemeral: true });
			}
		}
		else if (subCommandName === "get") {
			if (lights[num - 1].getLightState()) {
				await interaction.reply({ content: "La lampe est allumée", ephemeral: true });

			}
			else {
				await interaction.reply({ content: "La lampe est éteinte", ephemeral: true });

			}
		}
	},
};
