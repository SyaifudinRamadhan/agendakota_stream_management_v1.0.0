const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      }),
      this.hasMany(models.Ticket, {
        foreignKey: 'session_id',
        as: 'tickets'
      }),
      this.hasMany(models.StreamKey, {
        foreignKey: 'session_id',
        as: 'streamKey'
      })
    }
  }
  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: DataTypes.BIGINT,
      start_rundown_id: DataTypes.BIGINT,
      end_rundown_id: DataTypes.BIGINT,
      title: DataTypes.STRING,
      link: DataTypes.TEXT,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      overview: DataTypes.INTEGER,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      description: DataTypes.STRING,
      deleted: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "Session",
      tableName: "sessions",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return Session;
};
