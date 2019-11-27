const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'alexadatabase.cvoyxhepfo1u.us-east-1.rds.amazonaws.com',
  user: 'alexadb',
  password: 'Alexa2019',
  database: 'AlexaDatabase'
});

const connectDB = async () => {
  try {
    await connection.connect();
    console.log('Database connected...');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = {connectDB, connection};