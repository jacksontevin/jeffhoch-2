import Koa from 'koa';

import jwt from 'jsonwebtoken';

import { saveErrorLogDB } from '../middleware/errorLog';
import { adminNotification } from './../middleware/notification';
import PropertyTypeService from '../services/PropertyType.services';
import AuthService from '../services/auth.services';
import { JWT_SECRET_KEY } from '../utils/config';
import { DEFAULT_STATUS_CODE_ERROR } from '../utils/config';

export const fetchAll = async (ctx: Koa.Context) => {
  const propertyTypeService = new PropertyTypeService();
  var { perRowPage, currentPage, search, isActive, isDeleted, filed } = <any> ctx.request.query;

  if (!perRowPage) perRowPage = '10';
  if (!currentPage) currentPage = '1';
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    search: search ? search : '',
    regexSearch: null,
    isActive: isActive ? isActive : [true, false],
    filed: filed
  };
  var regexSearch = new RegExp(pagination.search, 'i');
  const count = await propertyTypeService.fetchCount(pagination, regexSearch);
  pagination.totalItems = Number(count);
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage));
    const data = await propertyTypeService.fetchAll(pagination, regexSearch);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch All Property Types')
    ctx.body = { err };
  }
};

export const add = async (ctx: Koa.Context) => {
  const propertyTypeService = new PropertyTypeService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { name, childPropertyType, isActive } = ctx.request.body;
  const addData = {
    name,
    childPropertyType: childPropertyType ? childPropertyType : null,
    isActive,
    updatedBy: tokenRes['id'],
    createdBy: tokenRes['id'],
  }
  try {
    const data = await propertyTypeService.save(addData);
    data.message = 'Property Type Added Successfully'
    ctx.status = data.code || 200;
    ctx.body = data;
    adminNotification(`Admin By Property Type Added`, `/admin-land/property-types?id=${data.data.name}`)
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Add Property Type')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const update = async (ctx: Koa.Context) => {
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { name, childPropertyType, _id, isActive, } = ctx.request.body;
    const editData = {
      name,
      childPropertyType,
      _id,
      isActive,
      updatedBy: tokenRes['id']
    }

  const propertyTypeService = new PropertyTypeService();
  const authService = new AuthService();
  try {
    const data = await propertyTypeService.update(editData);
    ctx.body = data;
    const userInfo = await authService.fetchUserById(tokenRes['id'])
    adminNotification(`${userInfo.data.firstName} ${userInfo.data.lastName} updated Property Type`, `/admin-land/property-types?id=${name}`)
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Update Property Type')
    ctx.body = { err };
  }
};
export const fetchById = async (ctx: Koa.Context) => {
  const propertyTypeService = new PropertyTypeService();
  try {
    const data = await propertyTypeService.fetchById(ctx.request.params);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Property Type By Id')
    ctx.body = { err };
  }
};
export const deletePropertyType = async (ctx: Koa.Context) => {
  const propertyTypeService = new PropertyTypeService();
  try {
    const data = await propertyTypeService.delete(ctx.request.params);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Delete Property Type')
    ctx.body = { err };
  }
};
export const restore = async (ctx: Koa.Context) => {
  const propertyTypeService = new PropertyTypeService();
  try {
    const data = await propertyTypeService.restore(ctx.request.params);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'restore Property Type')
    ctx.body = { err };
  }
};
export const fetchAllSpecific = async (ctx: Koa.Context, next: any) => {
  const propertyTypeService = new PropertyTypeService();
  try {
    const data = await propertyTypeService.fetchAllPrortySpecific();
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch All Specific Property Type')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const saveSubPropertyType = async (ctx: Koa.Context, next: any) => {
  const propertyType = new PropertyTypeService();
  try {
    const data = await propertyType.saveSubPropertyType(ctx.request.body);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'save Sub Property')

    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchAllSubPropertyType = async (ctx: Koa.Context, next: any) => {
  const propertyType = new PropertyTypeService();
  try {
    const data = await propertyType.fetchAllSubPropertyType();
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch All Sub Property Type')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
