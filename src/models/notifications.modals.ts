const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  adminPath: {
    type: String,
    default: ''
  },
  userPath: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'User',
  },
  type: {
    type: Number,
    enum: [0, 1] // 0 => Users, 1 => Admin
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', NotificationSchema);
