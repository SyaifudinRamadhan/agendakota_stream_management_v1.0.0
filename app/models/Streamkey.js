'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StreamKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Session, {
        foreignKey: 'session_id',
        as: 'session'
      })
    }
  }
  StreamKey.init({
    session_id: DataTypes.INTEGER,
    stream_key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StreamKey',
  });
  return StreamKey;
};