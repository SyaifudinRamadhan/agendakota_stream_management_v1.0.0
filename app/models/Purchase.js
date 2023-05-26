const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
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
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
        as: 'event'
      }),
      this.belongsTo(models.Ticket, {
        foreignKey: 'ticket_id',
        as: 'ticket'
      }),
      this.belongsTo(models.Payment, {
        foreignKey: 'payment_id',
        as: 'payment'
      })
    }
  }
  Purchase.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: DataTypes.STRING,
      user_id: DataTypes.BIGINT,
      send_from: DataTypes.BIGINT,
      event_id: DataTypes.BIGINT,
      ticket_id: DataTypes.BIGINT,
      cart_id: DataTypes.BIGINT,
      payment_id: DataTypes.BIGINT,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "Purchase",
      tableName: "purchases",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return Purchase;
};
