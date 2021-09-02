const express = require("express");
const Employee = require("../models/employee_register");

const router = new express.Router();


//------------------registration section------------------------

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
    // const alert =
    //   "<script>alert(`Welcome ${emp.firstName} ${emp.lastName} , login successful`)</script>";

    // res.send(alert);
    res.render("index");

    // res.send(emp)
  } catch (e) {
    res.status(400).send("Error is: " + e);
  }
});
//
module.exports = router;
