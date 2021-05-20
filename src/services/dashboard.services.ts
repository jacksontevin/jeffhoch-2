import { User } from "../models"

export default class DashboardServices {
  public async fetchRecentUser() {
    try {
      return await User.find().limit(10).sort({ 'createdAt': 'descending' }).select('firstName lastName email imageUrl')
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }
}
