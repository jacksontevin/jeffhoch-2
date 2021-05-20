import Koa from 'koa';

import jwt from 'jsonwebtoken';

import { saveErrorLogDB } from '../middleware/errorLog';
import { adminNotification, userNotification } from './../middleware/notification';
import InqueryService from '../services/Inquirie.services';
import PropertyService from '../services/property.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import { JWT_SECRET_KEY } from '../utils/config';

export const saveProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.saveProperty(ctx.request.body);
    savePropertyNotification(ctx, data.data)
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'save Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

const savePropertyNotification = async (ctx, data) => {
  const payload = ctx.request.body
  const tokenRes = <any> await jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  if (tokenRes.role == 'SUPER_ADMIN') {
    userNotification(`Your ${payload.title} Property Create By Admin`,payload.seller,`/seller/properties-details/${data._id}`)
  } else {
    userNotification(`Your ${payload.title} Property Create Successfully`, payload.seller, `/seller/properties-details/${data._id}`)
    adminNotification(`Create New Property ${payload.title} By Seller`, `/admin-land/properties-details/${data._id}`)
  }
}

export const updateProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.editProperty(ctx.request.body);
    updatePropertyNotification(ctx)
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'save Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};


const updatePropertyNotification = async (ctx) => {
  const payload = ctx.request.body
  const tokenRes = <any> await jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  if (tokenRes.role == 'SUPER_ADMIN') {
    userNotification(`Your ${payload.title} Property Update By Admin`,payload.seller,`'/seller/properties-details/${payload._id}`)
  } else {
    userNotification(`Your ${payload.title} Property Update Successfully`, payload.seller, `/seller/properties-details/${payload._id}`)
    adminNotification(`${payload.title} Property Update By Seller`, `/admin-land/properties-details/${payload._id}`)
  }
}

export const propertyChangeStatus = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  const tokenRes = <any>await jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const { _id, status, declineNote, sellerId } = ctx.request.body

  let isApprove:any = null
  if (status == 'Active') isApprove = true
  else if (status == 'Declined') isApprove = false

  try {
    const data = await propertyService.editProperty({ _id, status, declineNote,approvedBy: tokenRes.id, statusChangeDate: new Date(), isApprove });
    ctx.status = data.code || 200;
    ctx.body = data;
    changeStatusNotification(ctx, data, sellerId, _id)
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Change Property Status ')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

const changeStatusNotification = async (ctx, data, sellerId, _id) => {
  const tokenRes = <any>await jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  const title = data.data.status == 'Active' ? 'approved 🤟' : data.data.status
  if (tokenRes.role == 'SUPER_ADMIN') {
    userNotification(`Your Property ${data.data.title} Change Status ${title} by Admin`,sellerId ,`/seller/properties-details/${_id}`)
  } else if (tokenRes.role == 'SELLER')  {
    userNotification(`Your Property  ${data.data.title} has been ${title}`,sellerId ,`/seller/properties-details/${_id}`)
    adminNotification(`${data.data.title} has been ${title}` ,`/admin/properties-details/${_id}`)
  }
}

export const fetchAll = async (ctx: Koa.Context) => {
  const propertyService = new PropertyService();
  var { perRowPage, currentPage } = ctx.request.query;

  if (!perRowPage) perRowPage = '10';
  if (!currentPage) currentPage = '1';
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
  };
  const count = await propertyService.fetchUserCount();
  pagination.totalItems = Number(count);
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage));
    const data = await propertyService.fetchAll(pagination);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch All')
    ctx.body = { err };
  }
};

export const fetchById = async (ctx: Koa.Context, next: any) => {
  const { _id } = ctx.request.params;
  const propertyService = new PropertyService();
  const tokenRes = <any>await jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    const data = await propertyService.fetchById(_id);
    if(tokenRes.role === 'BUYER') await propertyService.editProperty({ views: (data.data.views ? Number(data.data.views) : 1) + 1 , _id});
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch By Id')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchSimilarProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  const { _id } = ctx.request.params;
  try {
    const data = await propertyService.fetchSimilarProperty(_id);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Similar Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const proertyFilter = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.propertyFilter(ctx.request.body);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'proerty Filter')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
export const fetchTrendingProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.fetchTrendingProperty(ctx.request.body);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Trending Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchPropertyTypeWiseProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.fetchPropertyTypeWiseProperty(ctx.request.query);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch PropertyType Wise Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchSpecificProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.fetchSpecificProrerty();
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Specific Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const propertyBaseOnInquery = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    const data = await propertyService.fetchSpecificProrertyBaseOnUserInquery(tokenRes['id']);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'property Base On Inquery')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchFunnelProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  const inqueryService = new InqueryService();
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);

  var { perRowPage, currentPage } = ctx.request.query;

  if (!perRowPage) perRowPage = '20';
  if (!currentPage) currentPage = '1';
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
  };

  try {
    const inquery = await inqueryService.fetchInqueryByUserId(tokenRes['id'])
    if (inquery.data['_id']) {
      try {
        const count = await propertyService.fetchfetchFunnelPropertyCount(inquery['data']);
        pagination.totalItems = Number(count);
        pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage));

        const data = await propertyService.fetchFunnelProperty(inquery['data'], pagination);
        ctx.status = data.code || 200;
        ctx.body = data;
        return;
      } catch (err) {
        saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch funnel proerty')
        ctx.status = err.code || 500;
        ctx.body = err;
        return;
      }
    } else {
      ctx.status = 200;
      return (ctx.body = {
        status: 'Error',
        code: ctx.status,
        message: 'Please Create Inquery',
        redirectInquery: true,
        data: { _id: tokenRes['id']},
      });
    }
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Funnel Proerty Inquery Fetch Error')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const fetchRecentUpdatedProperty = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = await propertyService.fetchRecentUpdatedProperty();
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Recent Updated Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};

export const search = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService();
  try {
    const data = <any> await propertyService.search(ctx.request.query);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch PropertyType Wise Property')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
