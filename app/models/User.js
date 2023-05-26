const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Organization, {
        foreignKey: 'user_id',
        as: 'organizations'
      }),
      this.hasMany(models.OrganizationTeam, {
        foreignKey: 'user_id',
        as: 'teamOrganizations'
      }),
      this.hasMany(models.Payment, {
        foreignKey: 'user_id',
        as: 'payments'
      })
      this.hasMany(models.Purchase, {
        foreignKey: 'user_id',
        as: 'purchases'
      })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      google_id: DataTypes.STRING,
      pkg_id: DataTypes.BIGINT,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      photo: DataTypes.STRING,
      phone: DataTypes.STRING,
      bio: DataTypes.TEXT,
      headline: DataTypes.TEXT,
      instagram_profile: DataTypes.STRING,
      linkedin_profile: DataTypes.STRING,
      twitter_profile: DataTypes.STRING,
      is_active: DataTypes.INTEGER,
      pkg_status: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      token: DataTypes.STRING,
    },
    {
      // options
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return User;
};
