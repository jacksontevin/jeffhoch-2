const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertyTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  childPropertyType: {
    type:Schema.Types.ObjectId,
    required: false,
    ref: "PropertyType"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type:Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  updatedBy: {
    type:Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  allowEdit: {
    type: Boolean,
    required: false,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('PropertyType', PropertyTypeSchema);
