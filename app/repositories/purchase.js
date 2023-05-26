const {Op, where} = require('sequelize')
const {Purchase} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Purchase.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Purchase.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Purchase.findOne({where:{
            id: id
        }, include: argsOrm})
    }
}