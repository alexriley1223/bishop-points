const CronJob = require('cron').CronJob;
const { getParentDirectoryString } = require('@helpers/utils');
const { jobs } = require('../config.json');
const BishopJob = require('@classes/BishopJob');

module.exports = new BishopJob({
	enabled: jobs[getParentDirectoryString(__filename, __dirname, 'jobs')],
	init: async function(client) {
		new CronJob(
			'0 12 * * *',
			async function() {

        const randPoints = Math.floor(Math.random() * (30 - 10) + 10);
        const Points = client.bishop.db.models.points;
        const PointsHistories = client.bishop.db.models.points_histories;

        await Points.findOne({ order: client.bishop.db.random() }).then(async function (user) {
          const userPoints = Math.floor(user.points + randPoints);
        
          await Points.update({ points: userPoints }, {
            where: {
                userId: user.userId
            }
          });  

          await PointsHistories.create({
            userId: user.userId,
            points: randPoints,
            source: 'daily_points'
          });
    
          // Send @ message in announcements channel
          // client.channels.cache.get(announcementsChannelId).send(`Congrats <@${user[0].user}>! You have won ${randPoints} points for today's free points raffle! 👏🏻`);
    
          client.bishop.logger.info(
            'POINTS',
            `Point change of ${randPoints} for ${user.username}.`,
          );
        });
    
			},
			null,
			true,
			'America/Indianapolis');
	},
});
