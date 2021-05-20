import { Inquirie } from './../models/index'
import jwt from 'jsonwebtoken';

export default class InqueryService {
  public async fetchAll(pagination:any) {
    try {
      const data = await Inquirie.find()
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage);
      return { status: 'Success', code: 200, message: '', data: {pagination, inquirie: data} }
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchUserCount() {
    try {
      return await Inquirie.countDocuments()
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async create(payload: any) {
    try {
      const data = await Inquirie.create(payload)
      if (data['_id']) return { status: 'Success', code: 200, message: 'Inquiry Added Successfully', data: data}
      else return { status: 'Error', code: 404, message: '', data: null}
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchInqueryById(_id: any) {
    try {
      const data = await Inquirie.findOne({_id})
      if (data['_id']) return { status: 'Success', code: 200, message: '', data: data}
      else return { status: 'Error', code: 404, message: '', data: null}
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async editInquery(payload: any) {
    try {
      const data = await Inquirie.findByIdAndUpdate(payload._id, payload, { new: true })
      if (data['_id']) return { status: 'Success', code: 200, message: 'Inquery Updated Successfully', data}
      else return { status: 'Success', code: 404, message: '', data}
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async fetchInqueryByUserId(id: any) {
    try {
      const data = await Inquirie.findOne({userId: id})
      if (data['_id']) return { status: 'Success', code: 200, message: '', data}
      else return { status: 'Success', code: 404, message: '', data}
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }
}


