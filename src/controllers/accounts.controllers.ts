import { userNotification } from './../middleware/notification';
import Koa from 'koa';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import { saveErrorLogDB } from '../middleware/errorLog';
import AuthService from '../services/auth.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import { JWT_SECRET_KEY, PASSWORD_SLOT } from '../utils/config';

export const whoAmI = async (ctx: Koa.Context, next: any) => {
  const authService = new AuthService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    const data = await authService.fetchUserById(tokenRes['id']);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'who Am I')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const updateProfile = async (ctx: Koa.Context, next: any) => {
  const authService = new AuthService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { firstName, lastName, address, emergencyContact, mobile, password, bio, gender } = ctx.request.body;
  const payload = {
    _id: tokenRes['id'],
    firstName,
    lastName,
    address,
    emergencyContact,
    mobile,
    bio,
    gender
  };
  if (password) {
    payload['password'] = await bcrypt.hash(password, Number(PASSWORD_SLOT));
  }
  try {
    const data = await authService.editUser(tokenRes['id'], payload);
    ctx.status = data.code || 200;
    ctx.body = data;
    userNotification('Your Profile has been updated successfully! ', data.data['_id'] ,'/profile')
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'update Profile')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
export const updateAccountPic = async (ctx: Koa.Context, next: any) => {
  const authService = new AuthService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { imageUrl } = ctx.request.body;
  const payload = {
    _id: tokenRes['id'],
    imageUrl,
  };
  try {
    const data = await authService.editUser(tokenRes['id'], payload);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'update Account Pic')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const changePassword = async (ctx: Koa.Context, next: any) => {
  const authService = new AuthService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { newPassword, oldPassword} = ctx.request.body;
  const userInfo = await authService.fetchUserById(tokenRes['id']);

  const isPasswordValid = await bcrypt.compare(oldPassword, userInfo.data.password);
  if (!isPasswordValid) {
    userNotification('Password Not Match Please Try Again', tokenRes['id'] ,'/profile')
    ctx.status = 401;
    return (ctx.body = { status: 'Error', code: ctx.status, message: 'Password Not Match', data: null });
  }
  const payload = {
    password: await bcrypt.hash(newPassword, Number(PASSWORD_SLOT)),
    passwordChangeDate: new Date()
  }
  try {
    const data = await authService.editUser(tokenRes['id'], payload);
    ctx.status = data.code || 200;
    ctx.body = { status: 'Success', code: 200, message: 'Your password has been changed successfully!', data:null };
    userNotification('Your password has been changed successfully! ', tokenRes['id'] ,'/profile')
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Change Password Profile')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
