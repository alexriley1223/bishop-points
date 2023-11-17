const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { EmbedBuilder, Embed } = require('discord.js');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show a leaderboard of server points'),
	execute: async function(interaction) {
		/* Generate embed message for leaderboard */
        const Points = interaction.client.bishop.db.models.points;
        const botName = interaction.client.bishop.name;
		const leaderboardEmbed = new EmbedBuilder()
			.setColor(interaction.client.bishop.color)
			.setTitle(`${botName} Points Leaderboard`)
			.setDescription(`Top 10 points in the server`)
			.setTimestamp()
			.setFooter({
				text: `Pulled using the ${botName} Bot`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		// Pull all tag entries
		Points.findAll({
			order: [['points', 'DESC']],
			attributes: ['userId', 'points'],
			limit: 10,
		}).then((allUsers) => {
            const pointObj = {};

            allUsers.forEach((e, i) => {
                leaderboardEmbed.addFields(
                    {
                        name: `${i + 1}. ${interaction.client.users.cache.get(e.userId).username}`,
                        value: `${e.points} points`
                    }
                )
            });

			return interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
		});
	},
});
