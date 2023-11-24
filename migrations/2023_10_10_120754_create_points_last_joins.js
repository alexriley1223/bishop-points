const up = (sequelize) => {
	const queryInterface = sequelize.getQueryInterface();
	const DataTypes = sequelize.datatypes;
	
	queryInterface.createTable('points_last_joins', {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			autoIncrement: false,
		},
		lastJoin: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	});
}

const down = (sequelize) => {
	const queryInterface = sequelize.getQueryInterface();
	queryInterface.dropTable('points_last_joins');
}

module.exports = {
	up,
	down
}

