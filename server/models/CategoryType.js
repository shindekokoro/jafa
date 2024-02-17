const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoryTypeSchema = new Schema({
  categoryTypeName: {
    type: String,
    required: true,
    trim: true
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CategoryName'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CategoryType = mongoose.model('CategoryType', categoryTypeSchema);

module.exports = CategoryType;
