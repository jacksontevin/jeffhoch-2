import Router from 'koa-joi-router';

import accountRouter from './accounts.route';
import adminRouter from './admin.route';
import authRouter from './auth.route';
import contactRouter from './contact.route';
import conversationRouter from './conversation.route';
import dashboardRouter from './dashboard.route';
import errorRouter from './errorLog.route';
import inquirieRouter from './inquirie.route';
import notificationRouter from './notification.route';
import propertyRouter from './property.route';
import propertyType from './propertyType.route';
import sellerRouter from './seller.route';
import uploadRouter from './upload.route';

const router = Router();

// prefix for microservice
router.prefix('/api');

router.route({
  handler: (ctx) => {
    ctx.body = {
      response: 'Ok',
    };
  },
  method: 'GET',
  path: '/',
});

router.use(propertyType.middleware());
router.use(adminRouter.middleware());
router.use(authRouter.middleware());
router.use(inquirieRouter.middleware());
router.use(contactRouter.middleware());
router.use(propertyRouter.middleware());
router.use(accountRouter.middleware());
router.use(uploadRouter.middleware());
router.use(conversationRouter.middleware());
router.use(errorRouter.middleware());
router.use(notificationRouter.middleware());
router.use(sellerRouter.middleware());
router.use(dashboardRouter.middleware());

export default router;
