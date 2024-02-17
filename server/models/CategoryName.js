const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoryNameSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  categoryType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'CategoryType'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const CategoryName = mongoose.model('CategoryName', categoryNameSchema);

module.exports = CategoryName;
