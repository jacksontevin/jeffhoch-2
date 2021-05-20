import { Conversation } from "../models/index";

export default async (socket, io) => {
  socket.on('onClientMsg', async (messageInfo)  => {
    const { senderId, receiverId, message } = messageInfo
    const payload = {
      senderId,
      receiverId,
      message,
      isSeen: false
    }
    const { _id } = await Conversation.create(payload)
    const returnMsg = await Conversation.findOne({ _id }).populate('senderId receiverId', 'firstName lastName email imageUrl')
    io.emit(`getMessage${senderId}`, returnMsg);
  })
};
