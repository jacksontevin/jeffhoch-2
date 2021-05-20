import Koa from 'koa';

import jwt from 'jsonwebtoken';

import { saveErrorLogDB } from '../middleware/errorLog';
import { adminNotification } from './../middleware/notification';
import { userNotification } from '../middleware/notification';
import InqueryService from '../services/Inquirie.services';
import AuthService from '../services/auth.services';
import MailService from '../services/mail.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import { FRONT_END_URL, JWT_SECRET_KEY } from '../utils/config';

export const fetchAllUser = async (ctx: Koa.Context) => {
  const userService = new InqueryService();
  var { perRowPage, currentPage } = ctx.request.query;

  if (!perRowPage) perRowPage = '10';
  if (!currentPage) currentPage = '1';
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
  };
  const count = await userService.fetchUserCount();
  pagination.totalItems = Number(count);
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage));
    const data = await userService.fetchAll(pagination);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch All Users')
    ctx.body = { err };
  }
};

export const saveInquery = async (ctx: Koa.Context, next: any) => {
  const inqueryService = new InqueryService();
  const authService = new AuthService();
  const mailServie = new MailService();
  const payload = ctx.request.body;
  try {
    const data = await inqueryService.create(payload);
    const userPayload = {
      status: 'IS_VERIFY_PENDING',
      userId: data.data.userId,
      firstName: data.data.firstName,
      lastName: data.data.lastName,
      mobile: data.data.mobile,
      role: data.data.role,
      gender: data.data.gender,
    };
    await authService.inqueryStatusChange(userPayload);
    adminNotification(`New ${userPayload.role} ${userPayload.firstName} ${userPayload.lastName} has been registered.`, `/admin-land/users?id=${userPayload.userId}`)
    userNotification('Welcom to Long Island', userPayload.userId ,'/profile')
    ctx.status = data.code || 200;
    ctx.body = data;

    let token = await jwt.sign({ id: data.data.userId }, JWT_SECRET_KEY, {
      expiresIn: '1d',
    });
    let url = `${FRONT_END_URL}/auth/verify-account-by-token?token=${token}`;
    ctx.status = 200;

    const userInfo = await authService.fetchUserById(data.data.userId);

    mailServie.sendMailVerification(userInfo.data.email, url); // send Mail

    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Save Inquery')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchInqueryById = async (ctx: Koa.Context, next: any) => {
  const { _id } = ctx.request.params;
  const inqueryService = new InqueryService();
  try {
    const data = await inqueryService.fetchInqueryById(_id);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Inquery By Id')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const updateInquery = async (ctx: Koa.Context, next: any) => {
  const inqueryService = new InqueryService();
  try {
    const data = await inqueryService.editInquery(ctx.request.body);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Update Inquery')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
