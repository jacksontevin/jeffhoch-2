const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  senderId: {
    type:Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  receiverId: {
    type:Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  message: {
    type: String
  },
  isSeen: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export default mongoose.model('Conversation', ConversationSchema);
