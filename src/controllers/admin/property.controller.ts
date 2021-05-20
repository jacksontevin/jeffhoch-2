import Koa from 'koa';

import { saveErrorLogDB } from '../../middleware/errorLog';
import PropertyService from '../../services/property.services';
import UserService from '../../services/user.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../../utils/config';

export const fetchPropertiesAdmin = async (ctx: Koa.Context) => {
  const propertyService = new PropertyService()
  var { perRowPage, currentPage, status, propertyType, search, seller } = ctx.request.query
  if (!perRowPage) perRowPage = '10'
  if (!currentPage) currentPage = '1'
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    status: status === 'All' ? ['Active', 'Sold', 'Pending', 'Declined', 'Rented', 'Deactivate'] : status,
    propertyType: propertyType,
    search: search,
    seller: seller
  }

  let findData:any = {}
  findData.status = pagination.status
  if (propertyType != 'null') findData.propertyType = pagination.propertyType
  if (seller != 'null') findData.seller = pagination.seller
  const count = await propertyService.fetchPropertiesCountAdmin(pagination, findData)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const data = await propertyService.fetchPropertiesAdmin(pagination, findData)
    ctx.body = data
    ctx.status = data.code
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch Property List')
    ctx.status = err.code
    ctx.body = { err }
  }
}
export const fetchPropertyById = async (ctx: Koa.Context) => {
  const propertyService = new PropertyService()
  const { _id } = ctx.request.params
  try {
    const data = await propertyService.fetchById(_id)
    ctx.body = data
    ctx.status = data.code
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch Property By Id')
    ctx.status = err.code
    ctx.body = { err }
  }
}

