const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
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
      this.hasMany(models.Purchase, {
        foreignKey: 'payment_id',
        as: 'purchases'
      })
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.BIGINT,
      token_trx: DataTypes.STRING,
      pay_state: DataTypes.STRING,
      order_id: DataTypes.STRING,
      price: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      // options
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscore: true,
    }
  );
  return Payment;
};
