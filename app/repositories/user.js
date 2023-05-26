const {Op, where} = require('sequelize')
const {User} = require('../models')

module.exports = {
    findOne(argsWhere, argsOrm){
        return User.findOne({where: argsWhere, include: argsOrm})
    },
    findAll(argsWhere, argsOrm){
        return User.findAll({where: argsWhere, include: argsOrm})
    },
    findByEmail(email, argsOrm){
        let args = {
            email: email
        }
        console.log(argsOrm);
        return User.findOne({where: args, include: argsOrm})
    },
    findByUsername(username, argsOrm){
        let args = {
            name: username
        }
        return User.findOne({where: args, include: argsOrm})
    }
}