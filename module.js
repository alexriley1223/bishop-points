const { isModuleEnabled, events } = require('./config');
const package = require('./package');
const BishopModule = require('@classes/BishopModule');

module.exports = (client) => {
	return new BishopModule({
		name: 'Bishop Points',
		description: package.description,
		version: package.version,
		enabled: isModuleEnabled,
		author: package.author,
		directory: __dirname,
		init: function() {
            /* Role(s) exists check */
            if(events['checkUserRank.js']) {
                /* Loop all and verify with client */
                // const roles = client
            }
		},
	});
};

