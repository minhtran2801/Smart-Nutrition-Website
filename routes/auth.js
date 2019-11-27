const { connection } = require("../config/db");
const express = require('express');
const router = express.Router();

// @desc    User login
router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Bad request')

  connection.query(
    `SELECT * FROM user
  WHERE email='${email}' AND password='${password}';`,
    function(err, rows, fields) {
      if (err) throw err;
      if (rows[0]){
        return res.status(200).send(rows[0]);
      }
      return res.status(404).send('User or password is incorrect');
    }
  );

});

module.exports = router;