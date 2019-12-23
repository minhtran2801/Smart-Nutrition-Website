const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'smart-nutrition-database.cpql6yxingst.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Alexa2019',
  database: 'SmartNutritionDB'
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
