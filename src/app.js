require("dotenv").config();

const express = require("express");
require("./db/conn");

const employee_router = require("./routers/employee_router");

const path = require("path");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 8002;

// *********************create  path
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views"); // views path
const partialsPath = path.join(__dirname, "../templates/partials");

// ********************* register path And router

// priority 1
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
// priority 2
app.use(express.json());
app.use(employee_router);
app.listen(port, () => console.log(`server created at ${port}`));

console.log(process.env.SECRET_KEY);
app.get("", (req, res) => {
  res.render("index");
});

// **************************************************************

// const express = require('express')
// require('./db/conn')

// const employee_router=require("./routers/employee_router");

// const path = require("path");
// const hbs = require("hbs");

// const app = express()
// const port = process.env.PORT || 8002

// // *********************create  path
// const staticPath = path.join(__dirname, "../public");
// const templatePath = path.join(__dirname, "../templates/views"); // views path
// const partialsPath = path.join(__dirname, "../templates/partials");

// // ********************* register path And router

// // priority 1
// app.use(express.urlencoded({extended:false}));
// app.use(express.static(staticPath));
// app.set("view engine", "hbs");
// app.set("views", templatePath);
// hbs.registerPartials(partialsPath);
// // priority 2
// app.use(express.json())
// app.use(employee_router);
// app.listen(port, () => console.log(`server created at ${port}`));

// app.get("", (req, res) => {
//   res.render("index");
// });
