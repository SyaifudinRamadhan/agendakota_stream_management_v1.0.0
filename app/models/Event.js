const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Organization, {
        foreignKey: 'organizer_id',
        as: 'organizer'
      }),
      this.hasMany(models.Session, {
        foreignKey: 'event_id',
        as: 'sessions'
      })
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      organizer_id: DataTypes.BIGINT,
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      type: DataTypes.STRING,
      topics: DataTypes.STRING,
      punchline: DataTypes.STRING,
      logo: DataTypes.STRING,
      description: DataTypes.TEXT,
      snk: DataTypes.TEXT,
      execution_type: DataTypes.STRING,
      location: DataTypes.TEXT,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      is_publish: DataTypes.INTEGER,
      has_withdrawn: DataTypes.INTEGER,
      breakdown: DataTypes.STRING,
      instagram: DataTypes.STRING,
      twitter: DataTypes.STRING,
      website: DataTypes.STRING,
      deleted: DataTypes.INTEGER,
      facebook: DataTypes.STRING,
      featured: DataTypes.INTEGER,
      unique_code: DataTypes.STRING,
      twn_url: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "Event",
      tableName: "events",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return Event;
};
