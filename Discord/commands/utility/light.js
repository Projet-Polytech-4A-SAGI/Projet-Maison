const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
const lights = [controller.Light1, controller.Light2, controller.Light3]

module.exports = {	
	data: new SlashCommandBuilder()
		.setName('light')
		.setDescription('Controle la lumière')
		.addIntegerOption(option =>
			option.setName("numero")
				.setDescription("Quelle lampe allumer ?")
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(lights.length))

		.addStringOption(option =>
			option.setName('etat')
				.setDescription("Quel est l'état choisi ?")
				.setRequired(false)
				.addChoices(
					{ name: 'on', value: 'on' },
					{ name: 'off', value: 'off' }
				)),

	async execute(interaction) {
		const numero = interaction.options.getInteger('numero');
		const piece = ["chambre","salon","cuisine"]
		const etat = interaction.options.getString('etat') ?? 'on';
		var reply = "La lampe " + " n°" + numero + " a été ";
		if (etat == 'on' && !lights[numero - 1].getLightState()) {
			lights[numero - 1].toggleLight()
			reply += "allumée";
		}
		else if (etat == 'off' && lights[numero - 1].getLightState()) {
			lights[numero - 1].toggleLight()
			reply += "éteinte";
		}
		await interaction.reply({ content: reply, ephemeral: true });
	},
};
