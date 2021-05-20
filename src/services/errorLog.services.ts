import { Error } from "../models"

export default class ErrorLogServices {
  public async fetchAll(pagination: any, find: any) {
    try {
      var regexSearch = new RegExp(pagination.search || '', 'i');
      const data = await Error.find({
        ...find,
        $or: [
          { apiPath: regexSearch },
          { method: regexSearch },
          { error: regexSearch },
          { errorCode: regexSearch },
          { apiBaseUrl: regexSearch },
          { action: regexSearch },
          { apiBaseUrl: regexSearch },
          { frontEndBaseUrl: regexSearch },
        ],
      })
        .sort({ 'createdAt': 'descending' })
        .populate('userId', 'firstName lastName email status role mobile')
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage)
      return { status: 'Success', code: 200, message: '', data: { pagination, errors: data } }
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err }
    }
  }
  public async fetchCount(find:any) {
    try {
      return await Error.countDocuments(find)
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }
  public async fetchErrorById(_id: any) {
    try {
      const data = await Error.findOne({_id}).populate('userId', 'firstName lastName email status role mobile')
      return { status: 'Success', code: 200, message: '', error: data }
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err }
    }
  }
}
