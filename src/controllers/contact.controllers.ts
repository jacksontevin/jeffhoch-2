import Koa from 'koa';

import { saveErrorLogDB } from '../middleware/errorLog';
import { notification, adminNotification } from './../middleware/notification';
import ContactService from '../services/contact.services';
import MailService from '../services/mail.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';

export const fetchAllContact = async (ctx: Koa.Context) => {
  const contactService = new ContactService()
  var { perRowPage, currentPage, status, search} = ctx.request.query

  if (!perRowPage) perRowPage = '10'
  if (!currentPage) currentPage = '1'
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    status: status,
    search: search
  }

  let find = {}
  if (status !== 'all') find['status'] = pagination.status

  const count = await contactService.fetchCount(find)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const data = await contactService.fetchAll(pagination, find)
    ctx.body = data
  } catch (err) {
    ctx.status = err.code
    ctx.body = { err }
  }
}

export const saveContact = async (ctx: Koa.Context, next: any) => {
  const contactService = new ContactService()
  try {
    const data = await contactService.create(ctx.request.body)
    adminNotification(`New inquiry generated`, `/admin-land/contacts?id=${data.data._id}`)
    ctx.status = data.code || 200;
    ctx.body = data
    return
  } catch (err) {
    ctx.status = err.code || 500;
    ctx.body = err
    return
  }
}

export const resolveContact = async (ctx: Koa.Context, next: any) => {
  const contactService = new ContactService()
  try {
    const data = await contactService.resolveContact(ctx.request.body)
    ctx.status = data.code || 200;
    ctx.body = data
    return
  } catch (err) {
    ctx.status = err.code || 500;
    ctx.body = err
    return
  }
}

export const resolveResendMail = async (ctx: Koa.Context, next: any) => {
  const mailService = new MailService()
  try {
    mailService.resolveContactSendMail(ctx.request.body)
    ctx.status = 200;
    ctx.body = { status: 'success', code: 200, message: 'Mail Send Successfully', data: null}
    return
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Resolve Resend Mail')
    ctx.status = err.code || 500;
    ctx.body = err
    return
  }
}

export const fetchContactById = async (ctx: Koa.Context, next: any) => {
  const { _id } = ctx.request.params
  const contactService = new ContactService()
  try {
    const data = await contactService.fetchContactById(_id)
    ctx.status = data.code || 200;
    ctx.body = data
    return
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Contact By Id')
    ctx.status = err.code || 500;
    ctx.body = err
    return
  }
}

