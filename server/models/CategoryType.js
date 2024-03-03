const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoryTypeSchema = new Schema({
  categoryTypeName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CategoryType = mongoose.model('CategoryType', categoryTypeSchema);

module.exports = CategoryType;
