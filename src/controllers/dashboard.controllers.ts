import Koa from 'koa';

import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { saveErrorLogDB } from '../middleware/errorLog';
import PropertyService from '../services/property.services';
import { JWT_SECRET_KEY, DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import DashboardServices from '../services/dashboard.services';
import PropertyTypeService from '../services/PropertyType.services';

export const fetchDashbaordCounts = async (ctx: Koa.Context) => {
  const propertyService = new PropertyService()
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    let status: any = null
    switch (tokenRes['role']) {
      case 'SUPER_ADMIN': {
        status = await propertyService.fetchAdminPropertyStatus()
        break;
      }
      case 'SELLER': {
        status = await propertyService.fetchBrokerPropertyStatus(tokenRes['id'])
        break;
      }
    }
    const newObj = {
      total: status.length,
      active: status.filter(i => i.status == 'Active').length,
      pending: status.filter(i => i.status == 'Pending').length,
      sold: status.filter(i => i.status == 'Sold').length,
      declined: status.filter(i => i.status == 'Declined').length,
      rent: status.filter(i => i.status == 'Rented').length
    }
    ctx.body = { status: 'Success', code: 200, message: '', data: newObj }
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Conversation List')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
}

export const fetchDashboardRecentUsers = async (ctx: Koa.Context) => {
  const dashboardServices = new DashboardServices()
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    let users: any = null
    switch (tokenRes['role']) {
      case 'SUPER_ADMIN': {
        users = await dashboardServices.fetchRecentUser()
        break;
      }
      case 'SELLER': {
        users = await dashboardServices.fetchRecentUser()
        break;
      }
    }
    ctx.body = { status: 'Success', code: 200, message: '', data: users }
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Dashbaord Recent Users List')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
}

export const fetchPropertyCountBaseOnProperyType = async (ctx: Koa.Context) => {
  const propertyService = new PropertyService()
  const propertyTypeService = new PropertyTypeService()
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);

  const propertyType = await propertyTypeService.fetchAllPrortySpecific()
  try {
    let finalArr: any = []
    for (const item of propertyType.data) {
      let find = {}
      if (tokenRes['role'] == 'SUPER_ADMIN') find = { propertyType: item._id }
      else if (tokenRes['role'] == 'SELLER') find = { seller: tokenRes['id'], propertyType: item._id  }
      const data = {
        count: 0,
        name: ''
      }
      data.name = item.name,
      data.count = await propertyService.fetchPropertyBaseOnPropertyTypes(find),
      finalArr.push(data)
    }
    ctx.body = { status: 'Success', code: 200, message: '', data: finalArr }
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Conversation List')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
}
