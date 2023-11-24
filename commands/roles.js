const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const { roles } = require('../roles.json');
const { guildId } = require('@config/bot');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('View the available points roles'),
	execute: async function(interaction) {
		const guild = interaction.client.guilds.cache.get(guildId);
        const guildRoles = guild.roles.cache;

        const rolesEmbed = new EmbedBuilder()
			.setColor(interaction.client.bishop.color)
			.setTitle(`${interaction.client.bishop.name} Attainable Roles`)
			.setDescription(`Roles available via points on the server`)
			.setTimestamp()
			.setFooter({
				text: `Pulled using the ${interaction.client.bishop.name} Bot`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });

        const sortedRoles = roles.sort((a, b) => a.tier - b.tier);
        sortedRoles.forEach((role, i) => {
            const serverRole = guildRoles.find(u => u.id === role.id);
            rolesEmbed.addFields(
                {
                    name: `${i + 1}. ${serverRole.name}`,
                    value: `${role.amount} points`
                }
            )
        });
        await interaction.reply({ embeds: [rolesEmbed], ephemeral: true });
	},
});
