const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoryNameSchema = new Schema({
  categoryName: {
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

const CategoryName = mongoose.model('CategoryName', categoryNameSchema);

module.exports = CategoryName;
