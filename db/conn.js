const { Sequelize } = require('sequelize')
const dotenv = require('dotenv').config()

const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;

const sequelize = new Sequelize('toughts', DBUSER, DBPASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log(`Conectado com sucesso ao MySQL!`);
} catch (error) {
    console.log(`Não foi possível conectar, erro: ${error}`);
}

module.exports = sequelize;