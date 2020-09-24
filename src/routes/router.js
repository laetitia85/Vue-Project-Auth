const express = require("express");
const app = express.Router();
const sql = require("../database/database.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();


app.post("/sign-up", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //crypte le msg entré par l'utilisateur

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
    };

    sql.query("INSERT INTO user SET ?", newUser, (err, result) => {
      if (err) {
        console.log("error:", err);
      }
      let token = jwt.sign({ result }, process.env.jwtKey, { expiresIn: 86400 // expires in 24 hours
      });
      console.log(token);
      // console.log("created user:" , {id: res.insertId, ...newUser});
      res.status(200).send({ auth: true, token: token });
    });
  });
});

app.post("/sign-in", (req, res) => {
  sql.query(
    `SELECT * FROM user WHERE email = '${req.body.email}'`,
    (err, result) => {
      bcrypt.compare(req.body.password, result[0].password, function (
        err,
        resultat
      ) {
        //compare le password entré par l'utilisateur avoir le password crypté

        console.log(result[0].password);
        if (resultat) {
          //si c'est true renvoie le résultat

          res.status(200).send({
            msg: "you are authenticated",
          });
        } else {
          //sinon c'est false alors renvoie le msg d'erreur
          res.status(404).send({
            msg: "Sorry, we don't know this user",
          });
        }
      });
    }
  );
});
// });

// if (result.length > 0 ){
//     res.status(200).send({
//   msg: "you are authenticated" })

//   } else if (result.length == 0) {
//       res.status(404).send({
//           msg: "Sorry, we don't know this user" ,
//       });
//   }

module.exports = app;
