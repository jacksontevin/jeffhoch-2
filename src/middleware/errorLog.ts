import { JWT_SECRET_KEY } from '../utils/config';

import jwt from "jsonwebtoken";
import { Error } from '../models';

export const saveErrorLogDB = async (
  req: any,
  errorCode: any,
  error: any,
  action: any
) => {
  const { request } = req;
  const { headers } = request
  var tokenRes = null;
  if (headers.authorization) tokenRes = <any>await jwt.verify(headers.authorization, JWT_SECRET_KEY);
  const data = {
    userId: tokenRes ? tokenRes['id'] : null,
    apiPath: request.url,
    apiBaseUrl: headers.host,
    frontEndBaseUrl: headers.origin,
    method: request.method,
    error: parseData(error),
    errorCode: errorCode,
    payload: parseData(findBody(req.request)),
    action: action
  };
  await Error.create(data);
};

const findBody = (data: any) => {
  if (data.body) {
    return data.body
  } else if (data.query) {
    return data.query
  } else if (data.params) {
    return data.params
  } else {
    return {}
  }
}
const parseData = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch {
    return null;
  }
};
