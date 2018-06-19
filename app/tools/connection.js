import Sequelize from 'sequelize';
import DB_CONFIG from '../../config/db.config.json';

const Con =
  new Sequelize(DB_CONFIG.database, DB_CONFIG.username, DB_CONFIG.password, DB_CONFIG.options);


Con
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = Con;

/*
const User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync()
  .then(() => User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  }))
  .then(jane => {
    console.log(jane.toJSON());
  });  */