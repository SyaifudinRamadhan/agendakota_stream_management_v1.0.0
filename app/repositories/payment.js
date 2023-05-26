const {Op, where} = require('sequelize')
const {Payment} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Payment.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Payment.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Payment.findOne({where:{
            id: id
        }, include: argsOrm})
    }
}