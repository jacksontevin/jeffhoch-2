import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import Koa from 'koa';
import ErrorLogServices from '../services/errorLog.services';
import { saveErrorLogDB } from '../middleware/errorLog';

export const fetchAllError = async (ctx: Koa.Context) => {
  const errorLogServices = new ErrorLogServices()
  var { perRowPage, currentPage, status, search} = ctx.request.query

  if (!perRowPage) perRowPage = '10'
  if (!currentPage) currentPage = '1'
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    status: status,
    search: search
  }

  let find = {}
  if (status !== 'all') find['status'] = pagination.status

  const count = await errorLogServices.fetchCount(find)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const data = await errorLogServices.fetchAll(pagination, find)
    ctx.body = data
  } catch (err) {
    ctx.status = err.code
    ctx.body = { err }
  }
}
export const fetchErrorById = async (ctx: Koa.Context) => {
  const errorLogServices = new ErrorLogServices()
  try {
    const data = await errorLogServices.fetchErrorById(ctx.request.params._id);
    ctx.body = data;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Proerty Type By Id')
    ctx.body = { err };
  }
}
