const {Op, where} = require('sequelize')
const {Ticket} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Ticket.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Ticket.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Ticket.findOne({where:{
            id: id
        }, include: argsOrm})
    }
}