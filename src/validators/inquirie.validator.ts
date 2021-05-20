import Koa from 'koa';
import { Validator } from 'node-input-validator'

export const saveInqueryValidator = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    firstName: 'required|minLength:2|maxLength:30',
    lastName: 'maxLength:30',
    mobile: 'required|minLength:5|maxLength:15'
  });

  const matched = await v.check()
  if (!matched) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Validation Failed`, data: v.errors }
    return
  } else {
    await next();
  }
}

export const updateInqueryValidator = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    _id: 'required',
    firstName: 'required|minLength:2|maxLength:30',
    lastName: 'maxLength:30',
    mobile: 'required|minLength:5|maxLength:15'
  });

  const matched = await v.check()
  if (!matched) {
    ctx.status = 422;
    return ctx.body = { status: 'error', code: 422, message: `Validation Failed`, data: v.errors }
  } else {
    await next();
  }
}
