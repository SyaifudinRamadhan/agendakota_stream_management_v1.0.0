const {Op, where} = require('sequelize')
const {Session} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Session.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Session.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Session.findOne({where:{
            id: id
        }, include: argsOrm})
    }
}