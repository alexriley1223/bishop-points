module.exports = async (sequelize, DataTypes) => {
    sequelize.define("points", {
        id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false
		}
    });
}