const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = function(email) {
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
  phoneNumber: {type: String, minlength: 10, required: true},
  address: {type: String, minlength: 5, required: true},
  city: {type: String, minlength: 2, required: true},
  state: {type: String, required: true},
  postCode: {type: Number, minlength: 5, required: true},
  password: {type: String, minlength: 2, required: true},
  mailingList: {type: Boolean, default: false, required: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;