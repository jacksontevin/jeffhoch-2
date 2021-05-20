import { Contact } from './../models/index'
import MailService from './mail.services'

export default class ContactService {
  public async fetchAll(pagination:any, find:any) {
    try {
      var regexSearch = new RegExp(pagination.search || '', 'i');
      const data = await Contact.find({
        ...find, $or: [
            {firstName : regexSearch},
            {lastName : regexSearch},
            {email : regexSearch},
            {userQuery : regexSearch},
            {adminResponse : regexSearch},
          ]
        })
        .sort({'createdAt': 'descending'})
        .populate('typeOfSpace')
        .limit(pagination.perRowPage * 1)
        .skip((pagination.currentPage - 1) * pagination.perRowPage)
      return { status: 'Success', code: 200, message: '', data: {pagination, contacts: data} }
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchCount(find:any) {
    try {
      return await Contact.countDocuments(find)
    } catch (err){
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async create(payload: any) {
    try {
      const data = await Contact.create(payload)
      const mailService = new MailService()
      mailService.saveContactSendMail(payload)
      if (data['_id']) return { status: 'Success', code: 200, message: 'Contact Added Successfully', data: data}
      else return { status: 'Error', code: 404, message: '', data: null}
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err}
    }
  }

  public async fetchContactById(_id: any) {
    try {
      const data = await Contact.findOne({_id}).populate('typeOfSpace')
      if (data['_id']) return { status: 'Success', code: 200, message: '', data: data}
      else return { status: 'Error', code: 404, message: '', data: null}
    } catch (err) {
      return { status: 'Error', code: 400, message: '', err }
    }
  }

  public async resolveContact(payload: any) {
    try {
      const data = await Contact.findByIdAndUpdate(payload._id, payload, { new: true });
      const mailService = new MailService()
      mailService.resolveContactSendMail(data)
      if (data['_id']) return { status: 'Success', code: 200, message: 'Resolve Your Query Successfully', data: data}
      else return { status: 'Error', code: 404, message: 'Somethng Went Worng', data: null}
    } catch (err) {
      return { status: 'Error', code: 500, message: '', err}
    }
  }
}
