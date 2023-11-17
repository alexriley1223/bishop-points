const BishopModuleEvent = require('@classes/BishopModuleEvent');
const { exemptPointChannels } = require('../config.json');
const { getParentDirectoryString } = require('@helpers/utils');
const { events } = require('../config.json');
const checkAndAssignUserRank = require('../helpers/checkAndAssignUserRank');

module.exports = new BishopModuleEvent({
    name: 'voiceStateUpdate',
    enabled: events[getParentDirectoryString(__filename, __dirname, 'events')],
    init: async (client, ...opt) => {
        const oldState = opt[0];
        const newState = opt[1];
        const userName = newState.member.user.username;
        const userId = newState.member.user.id;

        const PointsHistories = client.bishop.db.models.points_histories;
        const Points = client.bishop.db.models.points;
        const PointsLastJoins = client.bishop.db.models.points_last_joins;

        /* Bot Check */
        if (oldState.member.user.bot || newState.member.user.bot) {
            return;
        }

        const date = Date.now();

        /* Exempt Channel Check */
        if(exemptPointChannels.length > 0) {
            
            /* Leaving from an exempt channel and disconnect - don't do anything*/
            if(exemptPointChannels.includes(oldState.channelId) && newState.channelId == null) {
                return;
            } 

            /* Joins a channel that isn't exempt OR joins from an exempt channel */
            if( (oldState.channelId == null && !exemptPointChannels.includes(newState.channelId)) || (exemptPointChannels.includes(oldState.channelId) && newState.channelId !== null)) {
                join(PointsLastJoins, userId, date);
            }

            /* Joins AFK or fully disconnects */
            if( (oldState.channelId !== null && exemptPointChannels.includes(newState.channelId)) || (!exemptPointChannels.includes(newState.channelId) && newState.channelId == null)) {
                await leave(PointsLastJoins, Points, PointsHistories, userId, date, userName, client);
                await checkAndAssignUserRank();
            }

        } else {
            /* No AFK Channel - no checks needed */
            /* Joining Channel */
            if(oldState.channelId == null && newState.channelId !== null) {
                join(PointsLastJoins, userId, date);
            }

            /* Leaving Channel - No other channel */
            if(oldState.channelId !== null && newState.channelId == null) {
                // Record point total
                await leave(PointsLastJoins, Points, PointsHistories, userId, date, userName, client);
                await checkAndAssignUserRank();
            }
        }
    },
});

/* Fires whenever a valid join occurs - record a points_last_joins record */
async function join(PointsLastJoins, userId, date) {
    PointsLastJoins.upsert(
        {
            userId: userId,
            lastJoin: date
        }
    );
}

/* Fires whenever a valid leave occurs - tally up points */
async function leave(PointsLastJoins, Points, PointsHistories, userId, date, userName, client) {
    PointsLastJoins.findOne({
        where: {
            userId: userId,
        },
    }).then(async function(lastJoin) {
        if (lastJoin) {
            const oldTime = lastJoin.lastJoin;
            const calcPoints = Math.floor((date - oldTime) / 1000 / 60);

            if(calcPoints > 0) {
                const pointsEntry = await Points.findOne({ where: { userId: userId }});
                if(pointsEntry) {
                    /* Update User Points */
                    await Points.update({ points: Math.floor(pointsEntry.points + calcPoints) }, {
                        where: {
                            userId: userId
                        }
                    });   
                } else {
                    await Points.create({
                        userId: userId,
                        username: userName,
                        points: calcPoints
                    });
                }

                /* Add points history record */
                await PointsHistories.create({
                    userId: userId,
                    points: calcPoints,
                    source: 'voice'
                });

                client.bishop.logger.info(
                    'POINTS',
                    `Point change of ${calcPoints} for ${userName}.`,
                );
            }
        }
    });
}
