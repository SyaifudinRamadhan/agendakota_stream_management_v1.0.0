const {Op, where} = require('sequelize')
const {StreamKey} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return StreamKey.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return StreamKey.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return StreamKey.findOne({where:{
            id: id
        }, include: argsOrm})
    },
    findBySession(sessionId, argsOrm){
        return StreamKey.findAll({where:{
            session_id: sessionId
        }, include: argsOrm})
    },
    create(dataArgs){
        return StreamKey.create(dataArgs)
    },
    deleteById(id){
        return StreamKey.destroy({where: {
            id: id
        }})
    },
    deleteBySession(sessionId){
        return StreamKey.destroy({where: {
            session_id: sessionId
        }})
    }
}