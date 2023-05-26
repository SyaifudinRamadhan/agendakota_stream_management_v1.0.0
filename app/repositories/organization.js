const {Op, where} = require('sequelize')
const {Organization} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Organization.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Organization.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Organization.findOne({where:{
            id: id
        }, include: argsOrm})
    }
}