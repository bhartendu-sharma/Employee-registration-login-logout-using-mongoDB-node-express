const express = require("express");
const Employee = require("../models/employee_register");
const auth = require("../middleware/auth");

const router = new express.Router();

//-------------------get secret like cookies------------------
router.get("/secret", auth, (req, res) => {
  // res.send(`cookies is : ${req.cookies.jwt}`);
  // const emp = res.locals.user;
  const emp = req.user;

  // console.log(`user is : ${res.locals.user}`);
  const empName = { firstName: emp.firstName, lastName: emp.lastName };
  res.status(201).render("secret", {
    firstName: empName.firstName,
    lastName: empName.lastName,
  });
});
//logout section

//------------------registration section------------------------
router.get("/logout", auth, (req, res) => {
  try {
    res.clearCookie("jwt");
    res.render("index");
  } catch (e) {
    res.status(401).send(e);
  }
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    console.log("try called");
    // res.send("req.body is: "+req.body.firstName);
    // console.log(req.body);
    console.log(" reached here");
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      let empData = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        phone: req.body.phone,
        email: req.body.email,
        password: password,
        cpassword: "hidden",
        birthDayDate: req.body.birthDayDate,
      });

      const token = await empData.generateAuthToken();
      // if we use Employee.generateAuthToken(), then we have to use statics instead of using methods
      // so, carefull

      //cookies
      //syntax:
      // res.cookie(name,value,[Options]);
      // it sets cookie name to value
      // value can be string or object (so as to convert into json)
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 40000), // cookie expires in 40 sec
        // httpOnly: true, //user can not ______ cookie using client side scripting languages
        // secure:true   // works on secure connection (https)
      });
      const newEmp = await empData.save();

      // res.send(newEmp);
      res.status(201).render("index");
    } else {
      res.send("password not matched");
    }
    // res.send(req.body.firstName);
  } catch (e) {
    res.status(500).send("error is: " + e);
  }
});

//--------------------------------login section----------------------------
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  try {
    const emp = await Employee.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await emp.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000), // cookie expires in 60 sec
      // httpOnly: true, //user can not ______ cookie using client side scripting languages
      // secure:true   // works on secure connection (https)
    });
    res.status(201).redirect("/secret");
    // res.send(emp)
  } catch (e) {
    res.status(400).send("Error is: " + e);
  }
});
//
module.exports = router;
