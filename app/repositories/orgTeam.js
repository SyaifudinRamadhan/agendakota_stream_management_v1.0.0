const {Op, where} = require('sequelize')
const {OrganizationTeam} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return OrganizationTeam.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return OrganizationTeam.findAll({where: argsWhere, include: argsOrm})
    },
    findById(id, argsOrm){
        return OrganizationTeam.findOne({where:{
            id: id
        }, include: argsOrm})
    },
    findAllByOrganizer(organizerId, argsOrm){
        return OrganizationTeam.findAll({where:{
            organization_id: organizerId
        }, include: argsOrm})
    }
}