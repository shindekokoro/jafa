const mongoose = require('mongoose');

const { Schema } = mongoose;

const institutionSchema = new Schema({
  institutionName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  otherInfo: {
    type: String,
    trim: true
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;
