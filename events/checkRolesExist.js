const BishopModuleEvent = require('@classes/BishopModuleEvent');
const { guildId } = require('@config/bot');
const { useRoles, roles } = require('../roles');

module.exports = new BishopModuleEvent({
    name: 'ready',
    enabled: useRoles,
    init: async (client, ...opt) => {
        /* Client is using calculated roles, Loop all and verify with client the roles exist */
        const guild = client.guilds.cache.get(guildId);
        const guildRoles = guild.roles.cache;

        roles.forEach(function(role) {
            if(!guildRoles.find(r => r.id == role.id)) {
                throw Error(
                    `A role specified in bishop-points does not exist while while useRoles is enabled. Please remove or update this role.`,
                );
            }
        });
    },
});