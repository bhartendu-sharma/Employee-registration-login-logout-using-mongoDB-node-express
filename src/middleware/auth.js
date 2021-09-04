require("dotenv").config();
const jwt = require("jsonwebtoken");

const Employee = require("../models/employee_register");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);
    const verifyEmp = jwt.verify(token, process.env.SECRET_KEY);

    console.log("enter in auth");
    const emp = await Employee.findOne({ _id: verifyEmp._id });

    // console.log(emp);

    // res.locals.user = emp;
    req.token=token;
    req.user=emp;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};
module.exports = auth;
