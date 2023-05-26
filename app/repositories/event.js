const {Op, where} = require('sequelize')
const {Event} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return Event.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return Event.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return Event.findOne({where:{
            id: id
        }, include: argsOrm})
    },
    findBySlug(slug, argsOrm){
        return Event.findOne({where:{
            slug: slug
        }, include: argsOrm})
    },
    findByOrganizer(organizerId, argsOrm){
        return Event.findOne({where:{
            organizer_id: organizerId
        }, include: argsOrm})
    }
}