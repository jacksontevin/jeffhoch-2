import Koa from 'koa';

import { saveErrorLogDB } from '../../middleware/errorLog';
import AuthService from '../../services/auth.services';
import PropertyService from '../../services/property.services';
import UserService from '../../services/user.services';
import { DEFAULT_STATUS_CODE_ERROR } from './../../utils/config';

export const fetchAllUser = async (ctx: Koa.Context) => {
  const userService = new UserService()
  var { perRowPage, currentPage, status, role, search,  orderBy, sortBy  } = ctx.request.query

  if (!perRowPage) perRowPage = '10'
  if (!currentPage) currentPage = '1'
  var pagination = {
    currentPage: Number(currentPage),
    perRowPage: Number(perRowPage),
    totalPages: 0,
    totalItems: 0,
    status: status,
    role: role,
    search: search,
    orderBy: orderBy,
    sortBy: sortBy || 'id'
  }
  var find = {}
  if (status === 'all') find['status'] = ['FUNNEL_PENDING', 'IS_VERIFY_PENDING', 'ACTIVE', 'INVALID_LOGIN_ATTEMPTS_RESTRICTION', 'DISABLE_BY_ADMINISTRATOR', 'EXPIRED']
  else find['status'] = pagination.status
  if(role) find['role'] = role
  const count = await userService.fetchUserCount(find)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const data = await userService.fetchAll(pagination, find)
    ctx.body = data
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch Property List')
    ctx.body = { err }
  }
}

export const fetchUserById = async (ctx: Koa.Context) => {
  const authService = new AuthService()
  var { _id } = ctx.request.query

  try {
    const data = await authService.fetchUserById(_id)
    ctx.body = data
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch User Details By Id')
    ctx.body = { err }
  }
}

export const userUpdate = async (ctx: Koa.Context) => {
  const authService = new AuthService()
  var { _id } = ctx.request.body

  try {
    const data = await authService.editUser(_id, ctx.request.body)
    ctx.body = data
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin User Update By Id')
    ctx.body = { err }
  }
}

export const fetchSellerWithPropertyCount = async (ctx: Koa.Context) => {
  const authService = new AuthService()
  const propertyService = new PropertyService()
  var { _id } = ctx.request.query

  try {
    const userInfo = await authService.fetchUserById(_id)
    let status = await propertyService.fetchBrokerPropertyStatus(_id)

    const { data } = userInfo

    const newObj = {
      name: `${data.firstName} ${data.lastName}`,
      sellerId: `${data._id}`,
      address: data.address,
      image: data.imageUrl,
      bio: data.bio,
      mobile: data.mobile,
      status: data.status,
      email: data.email,
      createdAt: data.createdAt,

      total: status.length,
      appove: status.filter(i => i.status == 'Active').length,
      pending: status.filter(i => i.status == 'Pending').length,
      sold: status.filter(i => i.status == 'Sold').length,
      declined: status.filter(i => i.status == 'Declined').length
    }

    ctx.body = newObj
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'fetch Seller Details With Property Counts')
    ctx.body = { err }
  }
}

export const fetchAllBrokerList = async (ctx: Koa.Context) => {
  const userService = new UserService()
  const propertyService = new PropertyService()
  var { perRowPage, currentPage, status, search } = ctx.request.query

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
  var find = {}
  if (status === 'all') find['status'] = ['FUNNEL_PENDING', 'IS_VERIFY_PENDING', 'ACTIVE', 'INVALID_LOGIN_ATTEMPTS_RESTRICTION', 'DISABLE_BY_ADMINISTRATOR', 'EXPIRED']
  else find['status'] = pagination.status
  find['role'] = 'SELLER'
  const count = await userService.fetchUserCount(find)
  pagination.totalItems = Number(count)
  try {
    pagination.totalPages = Math.ceil(pagination.totalItems / Number(perRowPage))
    const { data } = <any>await userService.fetchAllSeller(pagination, find)
    var finalArray = <any> []
    for (let user of data['users']) {
      let total = 0
      let appove = 0
      let pending = 0
      let declined = 0
      let sold = 0
      let status = await propertyService.fetchBrokerPropertyStatus(user._id)

      total = status.length
      appove = status.filter(i => i.status == 'Active').length
      pending = status.filter(i => i.status == 'Pending').length
      sold = status.filter(i => i.status == 'Sold').length
      declined = status.filter(i => i.status == 'Declined').length

      let newObj = {
        appove,
        total,
        pending,
        declined,
        sold,
        name: `${user.firstName} ${user.lastName}`,
        sellerId: `${user._id}`,
        address: user.address,
        image: user.imageUrl
      }
      finalArray.push(newObj)
    }

    ctx.body = { status: 'Success', code: 200, message: '', data: {pagination, users: finalArray} }
    ctx.status = 200
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch List Broker List ')
    ctx.body = { err }
  }
}

export const fetchAllSellerSpecific = async (ctx: Koa.Context) => {
  const userService = new UserService()

  var find = {role: 'SELLER'}
  try {
    const data = await userService.find(find, 'firstName lastName email')
    ctx.body = data
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Admin Fetch Property List')
    ctx.body = { err }
  }
}

