const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
  },
  apiPath: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
  errorCode: {
    type: String,
    default: true,
  },
  payload: {
    type: String,
    required: false
  },
  action: {
    type: String,
    required: false
  },
  apiBaseUrl: {
    type: String,
    required: false
  },
  frontEndBaseUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('error', ErrorSchema);
