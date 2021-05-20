import Koa from 'koa';

import { PropertyType } from '../models/index';
import PropertyTypeService from '../services/propertyType.services';
import { Validator } from 'node-input-validator'

const saveValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    name: 'required'
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

const updateValidate = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    name: 'required',
    _id: 'required'
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

const isUniqueField = async (ctx: Koa.Context, next: any) => {
  const { name, _id } = ctx.request.body
  const isExists = await PropertyType.findOne({ name });
  const id = _id ? _id : 1
  if (isExists && isExists._id != id) {
    ctx.status = 410
    return ctx.body = { status: 'error', code: 410, message: `Property type  Alredy Exit`, data: null }
  } else {
    await next();
  }
}

const saveSubProperyTypeValidator = async (ctx: Koa.Context, next: any) => {
  const v = await new Validator(ctx.request.body, {
    name: 'required'
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

const isSubPropertyTypeUniqueField = async (ctx: Koa.Context, next: any) => {
  const { name } = ctx.request.body
  const propertyTypeService = new PropertyTypeService()
  const res = await propertyTypeService.fetchSubPropertyTypeByName(name)
  if (res.code == 200 && res.data && res.data.name == name) {
    ctx.status = 422;
    ctx.body = { status: 'error', code: 422, message: `Property Type Alredy Exit`, data: null }
    return
  } else {
    return await next()
  }
}

export { saveValidate, updateValidate, isUniqueField, saveSubProperyTypeValidator, isSubPropertyTypeUniqueField };
