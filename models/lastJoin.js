module.exports = async (sequelize, DataTypes) => {
    sequelize.define("points_last_joins", {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			autoIncrement: false,
		},
		lastJoin: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		}
    });
}