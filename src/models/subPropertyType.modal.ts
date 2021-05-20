const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubPropertyTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('SubPropertyType', SubPropertyTypeSchema);
