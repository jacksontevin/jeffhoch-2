import Koa from 'koa';

import { Validator } from 'node-input-validator';

export const updateProfileValidation = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    firstName: 'required|minLength:2|maxLength:150',
    lastName: 'required|minLength:2|maxLength:150',
    // password: 'minLength:2|maxLength:150',
    // email: 'required|email|minLength:2|maxLength:150',
    address: 'required',
    emergencyContact: 'minLength:6|maxLength:16',
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
