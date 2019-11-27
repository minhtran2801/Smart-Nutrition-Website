const { connection } = require("../config/db");
const express = require("express");
const router = express.Router();

// @route   GET users/email
// @desc    get one user
router.get("/:email", (req, res) => {
  connection.query(
    `SELECT * FROM user
  WHERE email='${req.params.email}';`,
    function(err, rows, fields) {
      if (err) throw err;

      res.status(200).send(rows[0]);
    }
  );
});

// @route   GET users
// @desc    get users
router.get("/",  (req, res) => {

  let genQuery;
  switch(req.query.g){
    case 'mf': 
      genQuery = "((gender = 'male') OR (gender = 'female'))";
      break;
    case 'm': 
      genQuery = "(gender = 'male')";
      break;
    case 'f': 
      genQuery = "(gender = 'female')";
      break;
    default:
        genQuery = "((gender = 'male') OR (gender = 'female'))";
  }

  connection.query(
    `SELECT email FROM user
  WHERE (${genQuery} AND (height >=${req.query.hfrom}) AND (height <=${req.query.hto}) AND (weight >=${req.query.wfrom}) AND (weight <=${req.query.wto}));`,
    function(err, rows, fields) {
      if (err) throw err;

      const result = [];
      rows.forEach(element => {
        result.push(element.email)
      });
      res.status(200).send(result);
    }
  );
});

module.exports = router;
