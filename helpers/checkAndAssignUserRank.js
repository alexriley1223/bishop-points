const { guildId } = require('@config/bot');
const { roles } = require('../roles');

module.exports = async (client, userId, points) => {
    const guild = client.guilds.cache.get(guildId);
    const member = guild.members.cache.get(userId);
    const memberRoles = member.roles.cache;

    const validRoles = roles.filter((role) => points >= role.amount);
    const eligibleRole = validRoles.reduce((prev, curr) => {
        if (prev.amount < curr.amount) {
            return curr;
        } else {
            return prev;
        }
    });

    if(!memberRoles.find(u => u.id === eligibleRole.id)) {
        // Add all roles up to eligible role
        validRoles.forEach((r) => {
            if(!memberRoles.find(s => s.id === r.id)) {
                member.roles.add(r.id);
            }
        });
    }
};