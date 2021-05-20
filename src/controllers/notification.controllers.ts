import jwt from 'jsonwebtoken';

import Koa from 'koa';

import { saveErrorLogDB } from '../middleware/errorLog';
import NotificationService from '../services/notification.services';
import { DEFAULT_STATUS_CODE_ERROR, JWT_SECRET_KEY } from './../utils/config';

export const fetchNotificationCount = async (ctx: Koa.Context) => {
  const notificationService = new NotificationService()
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {

    var find
    if (tokenRes['role'] === 'SUPER_ADMIN') {
      find = { type: 1, isSeen: false }
    } else if (tokenRes['role'] === 'SELLER') {
      find = { user: tokenRes['id'], isSeen: false }
    }

    const data = await notificationService.countDocuments(find);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Notification Count')
    ctx.body = { err };
  }
}


export const fetchNotifications = async (ctx: Koa.Context) => {
  const notificationService = new NotificationService()
  var { perRowPage, currentPage, status, search} = ctx.request.query
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);

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

  var find
  if (tokenRes['role'] === 'SUPER_ADMIN') {
    find = { type: 1 }
  } else if (tokenRes['role'] === 'SELLER') {
    find = { user: tokenRes['id'], type: 0 }
  }

  const count = await notificationService.countDocuments({ type: 1 })
  pagination.totalItems = Number(count.counts)
  pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))

  try {
    const data = await notificationService.fetchAll(find, pagination);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Notifications')
    ctx.body = { err };
 }
}


export const notificationSeen = async (ctx: Koa.Context) => {
  const notificationService = new NotificationService()
  var { ids } = ctx.request.body
  for (const _id of ids) await notificationService.seenNotificaion(_id);
  try {
    ctx.body = { status: 'Success', code: 200, message: '', data: null };
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Notifications Seen')
    ctx.body = { err };
 }
}
