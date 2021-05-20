import jwt from 'jsonwebtoken';

import Koa from 'koa';

import { JWT_SECRET_KEY } from '../utils/config';
export const authenticate = async (ctx: Koa.Context, next: any) => {
  let token = '';
  if (typeof ctx.headers.authorization !== 'undefined') {
    token = ctx.headers['authorization'];
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
  const data = await isValidToken(token);
  if (data) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
};

export const AdminAuthetication = async (ctx: Koa.Context, next: any) => {
  let token = '';
  if (typeof ctx.headers.authorization !== 'undefined') {
    token = ctx.headers['authorization'];
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
  const data = await isValidToken(token);
  if (data) {
    if (data['role'] === 'SUPER_ADMIN') {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = { status: 'error', code: 403, message: `Forbidden Anauthorized Access`, data: null };
      return;
    }
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
};

export const sellerAuthetication = async (ctx: Koa.Context, next: any) => {
  let token = '';
  if (typeof ctx.headers.authorization !== 'undefined') {
    token = ctx.headers['authorization'];
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
  const data = await isValidToken(token);
  if (data) {
    if (data['role'] === 'SELLER') {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = { status: 'error', code: 403, message: `Forbidden Anauthorized Access`, data: null };
      return;
    }
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
};

export const adminSellerAuthetication = async (ctx: Koa.Context, next: any) => {
  let token = '';
  if (typeof ctx.headers.authorization !== 'undefined') {
    token = ctx.headers['authorization'];
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
  const data = await isValidToken(token);
  if (data) {
    if (data['role'] === 'SELLER' || data['role'] === 'SUPER_ADMIN') {
      await next();
    } else {
      ctx.status = 403;
      ctx.body = { status: 'error', code: 403, message: `Forbidden Anauthorized Access`, data: null };
      return;
    }
  } else {
    ctx.status = 401;
    ctx.body = { status: 'error', code: 401, message: `Not Authorized`, data: null };
    return;
  }
};


async function isValidToken(token: any) {
  try {
    return await jwt.verify(token, JWT_SECRET_KEY);
  } catch (e) {
    return false;
  }
}

// export const AdminAuthetication: RequestHandler = async (req, res, next) => {
//   const data = await (<any>isValidToken(req.headers.authorization));
//   if (data['user_type'] == 1) {
//     next();
//   } else {
//     res.status(403).json({
//       message: 'Invalid Access Token',
//     });
//   }
// };
// export const BuyerAuthetication: RequestHandler = async (req, res, next) => {
//   const data = await (<any>isValidToken(req.headers.authorization));
//   if (data['user_type'] == 4) {
//     next();
//   } else {
//     res.status(403).json({
//       message: 'Invalid Access Token',
//     });
//   }
// };
