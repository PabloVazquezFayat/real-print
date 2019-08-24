const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = (email)=> {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email)
};

const userSchema = new Schema({
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
  phoneNumber: {type: String, minlength: 10},
  address: {type: String, minlength: 5},
  city: {type: String, minlength: 2},
  state: {type: String, minlength: 2},
  postCode: {type: Number, minlength: 5},
  password: {type: String, minlength: 2, required: true},
  mailingList: {type: Boolean, default: false},
  clearance: {type: Number, default: 1},
  type: {type: String, default: 'user', required: true,}
});

const User = mongoose.model('User', userSchema);

module.exports = User;