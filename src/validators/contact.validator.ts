import { Validator } from 'node-input-validator'
import Koa from 'koa';

export const contactValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    firstName: 'required|minLength:2|maxLength:30',
    lastName: 'maxLength:30',
    email: 'required|email',
    userQuery: 'required|minLength:2|maxLength:1500',
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
