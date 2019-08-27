const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
  orderNumber: {type: String, required: true},
  fileURL: {type: String, required: true},
  textures: [{type: String}],
  client: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'Client'},
  price: {type: Number},
  processor: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Processor'},
  status: {type: String, required: true},
  color: {type: String},
  shipping: {
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    postCode: {type: String, required: true},
    priority: {type: String, required: true}
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;