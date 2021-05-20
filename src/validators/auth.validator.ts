import Koa from 'koa';
import { Validator } from 'node-input-validator';
import AuthService from '../services/auth.services';
export const userRegisterValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    email: 'required|minLength:2|maxLength:150',
    password: 'required|minLength:4|maxLength:10',
    role: 'required',
  });

  const matched = await v.check();
  if (!matched) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Validation Failed`, data: v.errors };
    return;
  } else {
    await next();
  }
};
export const isEmailUniqueField = async (ctx: Koa.Context, next: any) => {
  const { email } = ctx.request.body;
  const authService = new AuthService();
  const res = await authService.fetchUserByEmail(email);
  if (res.code == 200 && res.data.email == email) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Email Alredy Exit`, data: null };
    return;
  } else {
    return await next();
  }
};

export const isMobileUniqueField = async (ctx: Koa.Context, next: any) => {
  const { mobile } = ctx.request.body;
  const authService = new AuthService();
  const res = await authService.fetchUserByMobile(mobile);
  if (res.code == 200 && res.data.email == mobile) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Mobile Alredy Exit`, data: null };
    return;
  } else {
    return await next();
  }
};

export const checkRole = async (ctx: Koa.Context, next: any) => {
  const { role } = ctx.request.body;
  const allowRole = ['BUYER', 'SELLER', 'BUYER_OR_SELLER', 'TEMP_USER'];
  if (allowRole.includes(role)) {
    await next();
  } else {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Invalid Role`, data: null };
  }
};

export const loginValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    email: 'required|minLength:2|maxLength:150',
    password: 'required|minLength:6|maxLength:18',
  });

  const matched = await v.check();
  if (!matched) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Validation Failed`, data: v.errors };
    return;
  } else {
    await next();
  }
};
export const recoverPasswordValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    otp: 'required|minLength:6|maxLength:6',
    password: 'required|minLength:6|maxLength:18',
    _id: 'required',
  });

  const matched = await v.check();
  if (!matched) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Validation Failed`, data: v.errors };
    return;
  } else {
    await next();
  }
};
