const { SlashCommandBuilder } = require('discord.js');
const controller = require('../../../Controller/controller.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('light')
		.setDescription('Controle la lumière')
		.addStringOption(option =>
		option.setName('piece')
			.setDescription('Où se trouve la lampe ?')
			.setRequired(true)
			.addChoices(
				{ name: 'Chambre', value: 'chambre' },
				{ name: 'Salon', value: 'salon' },
				{ name: 'Cuisine', value: 'cuisine' },
			))
		.addIntegerOption(option =>
		option.setName("numero")
			.setDescription("Quelle lampe allumer ?")
			.setRequired(true)
			.setMinValue(1)
			.setMaxValue(3))
		.addStringOption(option =>
		option.setName('etat')
			.setDescription("Quel est l'état choisi ?")
			.setRequired(false)
			.addChoices(
				{name : 'on', value:'on'},
				{name : 'off', value:'off'}
				)),
	async execute(interaction) {
		const piece = interaction.options.getString('piece');
		const numero = interaction.options.getInteger('numero');
		const etat = interaction.options.getString('etat') ?? 'on';
		controller.mafunction(interaction.user.username);
		var reply = "La lampe "+ piece+" n°" + numero +" a été ";
		if(etat == 'on')
		{
		reply += "allumée";
		}
		else
		{
		reply += "éteinte";
		}
		await interaction.reply({content:reply, ephemeral:true});
	},
};
