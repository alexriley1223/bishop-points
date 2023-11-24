const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
		.setName('modifypoints')
		.setDescription('Modify points of a given user')
        .addStringOption((option) =>
			option
				.setName('type')
				.setDescription('Type of modification to execute')
				.setRequired(true)
				.addChoices(
					{
						name: 'add',
						value: 'add',
					},
					{
						name: 'remove',
						value: 'remove',
					},
					{
						name: 'set',
						value: 'set',
					},
				),
        )
        .addIntegerOption((option) =>
            option.setName('amount').setDescription('Amount to modify').setRequired(true),
        )
        .addUserOption((option) =>
            option.setName('user').setDescription('User to pay').setRequired(true),
        ),
	execute: async function(interaction) {
        const modifyType = interaction.options.getString('type');
		const modifyUser = interaction.options.getUser('user');
		const modifyAmount = interaction.options.getInteger('amount');

        const Points = interaction.client.bishop.db.models.points;
        const PointsHistories = interaction.client.bishop.db.models.points_histories;

        const endUserCurrentPoints = await Points.findOne({
            where: {
                userId: modifyUser.id
            }
        });

        if(!endUserCurrentPoints) {
            await interaction.reply({
                content: `User does not currently have a points record.`,
                ephemeral: true,
            });
            return;
        }

        switch (modifyType) {
            case 'add':
                if(modifyAmount <= 0) {
                    await interaction.reply({
                        content: `Trying to add a negative amount. This is more than likely the inverse of what you want.`,
                        ephemeral: true,
                    });
                    return;
                }
                await Points.increment('points', { by: modifyAmount, where: { userId: modifyUser.id }});
                await PointsHistories.create(
                    {
                        userId: modifyUser.id,
                        points: modifyAmount,
                        source: 'admin_add'
                    }
                );

                await interaction.reply({
                    content: `Added ${modifyAmount} points to ${modifyUser.username}.`,
                    ephemeral: true,
                });
                break;

            case 'remove':
                if(modifyAmount <= 0) {
                    await interaction.reply({
                        content: `Trying to remove a negative amount. This is more than likely the inverse of what you want.`,
                        ephemeral: true,
                    });
                    return;
                }
                await Points.increment('points', { by: -modifyAmount, where: { userId: modifyUser.id }});
                await PointsHistories.create(
                    {
                        userId: modifyUser.id,
                        points: -modifyAmount,
                        source: 'admin_remove'
                    }
                );

                await interaction.reply({
                    content: `Removed ${modifyAmount} points from ${modifyUser.username}.`,
                    ephemeral: true,
                });
                break;

            case 'set':
                if(modifyAmount < 0) {
                    await interaction.reply({
                        content: `Cannot set points less than 0!`,
                        ephemeral: true,
                    });
                    return;
                }
                endUserCurrentPoints.set({
                    points: modifyAmount
                });

                await endUserCurrentPoints.save();

                await PointsHistories.destroy({
                    where: {
                        userId: modifyUser.id
                    }
                });
                await PointsHistories.create(
                    {
                        userId: modifyUser.id,
                        points: modifyAmount,
                        source: 'admin_set'
                    }
                );

                await interaction.reply({
                    content: `Set ${modifyUser.username}'s points to ${modifyAmount}.`,
                    ephemeral: true,
                });
                break;
        }
	},
});
