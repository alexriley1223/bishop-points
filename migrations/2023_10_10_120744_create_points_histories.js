const up = (sequelize) => {
	const queryInterface = sequelize.getQueryInterface();
	const DataTypes = sequelize.datatypes;
	
	queryInterface.createTable('points_histories', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		},
		source: {
			type: DataTypes.STRING,
			allowNull: false
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
	queryInterface.dropTable('points_history');
}

module.exports = {
	up,
	down
}
