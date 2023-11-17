const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Show your current points'),
	execute: async function(interaction) {
		const userId = interaction.user.id;
        const Points = interaction.client.bishop.db.models.points;
		let userPoints = 0;

		// Find user record by id and set user points value
		await Points.findOne({
			where: {
				userId: userId,
			},
		}).then(function(user) {
			userPoints = user.points;
		});

		await interaction.reply({
			content: 'You currently have ' + userPoints + ' points.',
			ephemeral: true,
		});
	},
});
