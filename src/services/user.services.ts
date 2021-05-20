import { User } from './../models/index'

export default class UserService {
  public async fetchAll(pagination:any, find) {
    try {
      var regexSearch = new RegExp(pagination.search || '', 'i');
      const data = await User.find({
        ...find, $or: [
          { firstName:  regexSearch},
          { lastName:  regexSearch},
          { email:  regexSearch},
          { emergencyContact:  regexSearch},
          { mobile:  regexSearch},
          { role:  regexSearch},
          { status:  regexSearch},
        ]
      })
        .select('firstName lastName address email emergencyContact imageUrl mobile role status createdAt updatedAt')
        .populate('childPropertyType', 'name isActive')
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage)
        .sort({ [pagination.sortBy] : [pagination.orderBy ? 'ascending' : 'descending']})
      return { status: 'Success', code: 200, message: '', data: {pagination, users: data} }
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchAllSeller(pagination:any, find) {
    try {
      var regexSearch = new RegExp(pagination.search || '', 'i');
      const data = await User.find({
        ...find,
        $or: [
          { firstName:  regexSearch},
          { lastName:  regexSearch},
          { address:  regexSearch},
        ]
      })
        .select('firstName lastName address email imageUrl _id')
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage);
      return { status: 'Success', code: 200, message: '', data: {pagination, users: data} }
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchUserCount(find:any) {
    try {
      return await User.countDocuments(find)
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }
  public async find(find:any, select) {
    try {
      return await User.find(find).select(select)
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }
}

