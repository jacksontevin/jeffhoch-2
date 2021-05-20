import _ from "lodash";

import { Conversation } from "../models/index";
export default class ConversationServices {
  public async fetchConversationList(id) {
    try {
      const data = await Conversation.find({
        $or: [
          { senderId: id },
          { receiverId: id },
        ],
      }).select('senderId receiverId _id').populate('userId').sort({ 'createdAt': 'descending' })
      const senderObj = _.chain(data).groupBy("senderId._id")
      .map((value, key) => ({ senderId: key, senderObj: value })).value()
      const receiverObj = _.chain(data).groupBy("receiverId._id")
      .map((value, key) => ({ receiverId: key, receiverObj: value })).value()
      let filterData = [...receiverObj, ...senderObj]
      console.log(filterData)
      filterData = [...new Set(filterData)];
      let ids: any = []
      for (const item of filterData) {
        if (item['senderObj']) {
          ids.push(item['senderObj'][0]._id)
        } else if (item['receiverObj']) {
          ids.push(item['receiverObj'][0]._id)
        }
      }
      ids = [...new Set(ids)];
      const msg = await Conversation.find({ _id: ids })
        .populate('senderId', 'firstName lastName imageUrl')
        .populate('receiverId', 'firstName lastName imageUrl')
        .sort({'createdAt': 'descending'})
      return { status: 'Success', code: 200, message: '', messages: msg }
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }
}
