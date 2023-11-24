const BishopCommand = require('@classes/BishopCommand');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getParentDirectoryString } = require('@helpers/utils');
const { commands } = require('../config.json');

module.exports = new BishopCommand({
	enabled: commands[getParentDirectoryString(__filename, __dirname)],
	data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay another user with your points')
        .addUserOption((option) =>
            option.setName('user').setDescription('User to pay').setRequired(true),
        )
        .addIntegerOption((option) =>
            option.setName('amount').setDescription('Amount to Pay').setRequired(true),
        ),
	execute: async function(interaction) {
		const userToReceivePoints = interaction.options.getUser('user');
		const amountToGive = interaction.options.getInteger('amount');
		const userGivingPoints = interaction.user;
        const Points = interaction.client.bishop.db.models.points;
        const PointsHistories = interaction.client.bishop.db.models.points_histories;

		if (amountToGive <= 0) {
			interaction.reply({ content: 'Cannot pay 0 or less than 0 points.', ephemeral: true });
			return;
		}

        if(userToReceivePoints.id === userGivingPoints.id) {
            await interaction.reply({
                content: `You cannot pay yourself.`,
                ephemeral: true,
            });
        }

        const userToReceivePointsRecord = await Points.findOne({
            where: {
                userId: userToReceivePoints.id
            }
        });

        const userGivingPointsRecord = await Points.findOne({
            where: {
                userId: userGivingPoints.id
            }
        });

        if(!userToReceivePointsRecord || !userGivingPointsRecord) {
            await interaction.reply({
                content: `You or the user you are attempting to give points to do not have a Points record.`,
                ephemeral: true,
            });
        }

        if(userGivingPointsRecord.points < amountToGive) {
            await interaction.reply({
                content: `You do not have enough points to pay ${userToReceivePoints.username}.`,
                ephemeral: true,
            });
        }

        await Points.increment('points', { by: amountToGive, where: { userId: userToReceivePoints.id }});
        await Points.increment('points', { by: -amountToGive, where: { userId: userGivingPoints.id }});
        await PointsHistories.bulkCreate([
            {
                userId: userToReceivePoints.id,
                points: amountToGive,
                source: 'pay'
            },
            {
                userId: userGivingPoints.id,
                points: -amountToGive,
                source: 'pay'
            }
        ]);

        await interaction.reply({
            content: `${amountToGive} points paid to ${userToReceivePoints.username}!`,
            ephemeral: true,
        });
	},
});
