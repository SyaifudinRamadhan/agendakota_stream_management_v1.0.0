const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrganizationTeam extends Model {
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
      this.belongsTo(models.Organization, {
        foreignKey: 'organization_id',
        as: 'organization'
      })
    }
  }
  OrganizationTeam.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.BIGINT,
      organization_id: DataTypes.BIGINT,
      role: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "OrganizationTeam",
      tableName: "organization_teams",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return OrganizationTeam;
};
