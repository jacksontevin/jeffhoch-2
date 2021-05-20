import { JWT_SECRET_KEY, DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import Koa from 'koa';
import jwt from 'jsonwebtoken';
import ConversationServices from '../services/conversation.services';
import { saveErrorLogDB } from '../middleware/errorLog';

export const fetchConversationList = async (ctx: Koa.Context) => {
  const conversationServices = new ConversationServices()
  const tokenRes = jwt.verify(ctx.headers.authorization || '', JWT_SECRET_KEY);
  try {
    const data = await conversationServices.fetchConversationList(tokenRes['id']);
    ctx.status = data.code || 200;
    ctx.body = data;
    return;
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'Fetch Conversation List')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
}
