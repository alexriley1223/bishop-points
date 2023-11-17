module.exports = async (sequelize, DataTypes) => {
    sequelize.define("points_histories", {
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
        }
    });
}