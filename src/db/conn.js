const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Employee-registration-login-logout", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connection successfull"))
  .catch((e) => console.log("No Connection"));
