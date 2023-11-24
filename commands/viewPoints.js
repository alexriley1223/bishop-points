const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('viewpoints')
		.setDescription('View current points of a user')
        .addUserOption((opt) => opt.setName('user').setDescription('User to view points of').setRequired(true)),
	execute: async function(interaction) {
		const userToView = interaction.options.getUser('user');
        const Points = interaction.client.bishop.db.models.points;
        const userPointsRecord = await Points.findOne({
            where: {
                userId: userToView.id
            }
        });

        if(userPointsRecord) {
            await interaction.reply({
                content: `${userToView.username} currently has ${userPointsRecord.points} points!`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `Unable to find points for ${userToView.username}.`,
                ephemeral: true,
            });
        }
	},
});
