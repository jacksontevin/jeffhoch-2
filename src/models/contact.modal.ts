const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  userQuery: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  adminResponse: {
    type: String,
    required: false,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', ContactSchema);
