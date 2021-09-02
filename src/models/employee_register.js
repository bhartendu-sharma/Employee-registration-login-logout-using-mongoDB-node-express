const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, minlength: 3, required: true },
  lastName: { type: String, minlength: 3, required: true },
  gender: { type: String, required: true },
  email: {
    type: String,
    unique: [true, "Email already taken"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid Email Address");
      }
    },
  },
  birthDayDate: {
    type: String,
    length: 10,
  },
  phone: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
    required: true,
    unique: [true, "this number already is in use"],
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating auth token
employeeSchema.methods.generateAuthToken = async function () {
  const emp = this;
  console.log(emp._id); // attention in emp._id, some times string conversion not worked
  const token = jwt.sign({ _id: emp._id.toString() }, process.env.SECRET_KEY);

  emp.tokens = emp.tokens.concat({ token });
  await emp.save();

  return token;
};

//compare password while login
employeeSchema.statics.findByCredentials = async (email, password) => {
  const emp = await Employee.findOne({ email });

  if (!emp) {
    throw new Error("invalid credentials,unable to login");
  }

  const isMatch = await bcrypt.compare(password, emp.password);

  if (!isMatch) {
    throw new Error("invalid credentials,unable to login");
  }

  return emp;
};

// hash plain text password before saving

employeeSchema.pre("save", async function (next) {
  const emp = this;
  if (emp.isModified("password")) {
    emp.password = await bcrypt.hash(emp.password, 10);
  }
});

const Employee = new mongoose.model("Employee", employeeSchema);

module.exports = Employee;























// ****************************************************

// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const employeeSchema = new mongoose.Schema({
//   firstName: { type: String, minlength: 3, required: true },
//   lastName: { type: String, minlength: 3, required: true },
//   gender: { type: String, required: true },
//   email: {
//     type: String,
//     unique: [true, "Email already taken"],
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("invalid Email Address");
//       }
//     },
//   },
//   birthDayDate: {
//     type: String,
//     length: 10,
//   },
//   phone: {
//     type: Number,
//     min: 1000000000,
//     max: 9999999999,
//     required: true,
//     unique: [true, "this number already is in use"],
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   cpassword: {
//     type: String,
//     required: true,
//   },
//   tokens: [
//     {
//       token: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

// //generating auth token
// employeeSchema.methods.generateAuthToken = async function () {
//   const emp = this;
//   console.log(emp._id); // attention in emp._id, some times string conversion not worked
//   const token = jwt.sign({ _id: emp._id.toString() }, "thisisempregistration");

//   emp.tokens = emp.tokens.concat({ token });
//   await emp.save();

//   return token;
// };

// //compare password while login
// employeeSchema.statics.findByCredentials = async (email, password) => {
//   const emp = await Employee.findOne({ email });

//   if (!emp) {
//     throw new Error("invalid credentials,unable to login");
//   }

//   const isMatch = await bcrypt.compare(password, emp.password);

//   if (!isMatch) {
//     throw new Error("invalid credentials,unable to login");
//   }

//   return emp;
// };

// // hash plain text password before saving

// employeeSchema.pre("save", async function (next) {
//   const emp = this;
//   if (emp.isModified("password")) {
//     emp.password = await bcrypt.hash(emp.password, 10);
//   }
// });

// const Employee = new mongoose.model("Employee", employeeSchema);

// module.exports = Employee;
