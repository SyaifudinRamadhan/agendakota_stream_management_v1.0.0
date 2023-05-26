/**
 * @file contains entry point of controllers api v1 module
 * @author SyaifudinRamadhan
 */

const auth = require("./authController")
const regStream = require('./regisStreamController')

module.exports = {
  auth, regStream
};
