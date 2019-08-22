const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = (email)=> {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email)
};

const adminSchema = new Schema({
  firstName:     {type: String, minlength: 2, required: true},
  lastName: {type: String, minlength: 2, required: true},
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: validateEmail,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
},
  password: {type: String, minlength: 2, required: true},
  clearance: {type: Number, default: 1}
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;