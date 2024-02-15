const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const { guildId } = require('@config/bot.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show a leaderboard of server points'),
	execute: async function(interaction) {
		/* Generate embed message for leaderboard */
        const Points = interaction.client.bishop.db.models.points;
        const botName = interaction.client.bishop.name;
		const guild = interaction.client.guilds.cache.get(guildId);

		const leaderboardEmbed = new EmbedBuilder()
			.setColor(interaction.client.bishop.color)
			.setTitle(`${botName} Points Leaderboard`)
			.setDescription(`Top 10 user points in the server`)
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
            allUsers.forEach((e, i) => {
				const member = guild.members.cache.get(e.userId).user.username;
                leaderboardEmbed.addFields(
                    {
                        name: `${i + 1}. ${member}`,
                        value: `${e.points} points`
                    }
                )
            });

			return interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
		});
	},
});
