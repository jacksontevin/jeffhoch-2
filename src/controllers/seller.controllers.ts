import jwt from 'jsonwebtoken';

import Koa from 'koa';

import { saveErrorLogDB } from '../middleware/errorLog';
import PropertyService from '../services/property.services';
import { DEFAULT_STATUS_CODE_ERROR, JWT_SECRET_KEY } from './../utils/config';

export const fetchPropertiesSeller = async (ctx: Koa.Context, next: any) => {
  const propertyService = new PropertyService()
  var { perRowPage, currentPage, status, propertyType, search } = ctx.request.query
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);

  if (!perRowPage) perRowPage = '10'
  if (!currentPage) currentPage = '1'
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    status: status === 'All' ? ['Active', 'Sold', 'Pending', 'Declined'] : status,
    propertyType: propertyType,
    search: search,
  }
  let findData: any = {
    seller: tokenRes['id']
  }
  findData.status = pagination.status
  if (propertyType != 'null') findData.propertyType = pagination.propertyType

  const count = await propertyService.fetchPropertiesCountAdmin(pagination, findData)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const data = await propertyService.fetchPropertiesAdmin(pagination, findData)
    ctx.body = data
    ctx.status = data.code
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Seller Fetch Property List')
    ctx.status = err.code
    ctx.body = { err }
  }
}
