const express = require('express');
const router = express.Router();
const { connection } = require("../config/db");

// @route   GET analyses/email
// @desc    get one user's analyses
router.get('/:email', (req, res) => {
  connection.query(
    `SELECT * FROM food_detection_analysis
  WHERE email='${req.params.email}';`,
    function(err, rows, fields) {
      if (err) throw err;

      res.status(200).send(rows);
    }
  );
});

module.exports = router;