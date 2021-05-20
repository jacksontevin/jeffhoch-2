import { authenticate } from './../middleware/authentication';
import { fetchConversationList } from './../controllers/conversation.controllers';
import Router from 'koa-joi-router';
import koaBody  from 'koa-body';

const router = <any> Router();
router.prefix('/conversation');

router.route({
  method: 'GET',
  path: '/list',
  handler: [authenticate, fetchConversationList]
});

export default router;
