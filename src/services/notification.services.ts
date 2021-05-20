import { fetchAll } from './../controllers/PropertyType.controllers';
import { NotificationSchema } from "../models"

export default class NotificationService {

  public async countDocuments(findQuery: any) {
    try {
      const counts = await NotificationSchema.countDocuments(findQuery)
      return { status: 'Success', code: 200, message: '', counts }
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async fetchAll(findQuery: any, pagination) {
    try {
      const notifications = await NotificationSchema.find(findQuery)
        .sort({ 'createdAt': 'descending' })
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage)
      return { status: 'Success', code: 200, message: '', pagination, notifications }
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async seenNotificaion(_id) {
    try {
      await NotificationSchema.findByIdAndUpdate(_id, { isSeen: true }, { new: true })
      return { status: 'Success', code: 200, message: '', data: null }
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }
}
