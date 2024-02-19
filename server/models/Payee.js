const mongoose = require('mongoose');

const { Schema } = mongoose;

const payeeSchema = new Schema({
  payeeName: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Payee = mongoose.model('Payee', payeeSchema);

module.exports = Payee;
