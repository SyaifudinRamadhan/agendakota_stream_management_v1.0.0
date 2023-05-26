const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      }),
      this.hasMany(models.Event, {
        foreignKey: 'organizer_id',
        as: 'events'
      })
    }
  }
  Organization.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.BIGINT,
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      type: DataTypes.STRING,
      interest: DataTypes.STRING,
      email: DataTypes.STRING,
      no_telepon: DataTypes.STRING,
      instagram: DataTypes.STRING,
      linked: DataTypes.STRING,
      twitter: DataTypes.STRING,
      website: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      banner_img: DataTypes.STRING,
      deleted: DataTypes.INTEGER,
    },
    {
      // options
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return Organization;
};
