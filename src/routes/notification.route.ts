import Router from 'koa-joi-router';

import koaBody from 'koa-body';

import { notificationSeen, fetchNotificationCount, fetchNotifications } from '../controllers/notification.controllers';
import { sellerAuthetication } from '../middleware/authentication';
import { authenticate } from '../middleware/authentication';


const router = <any> Router();
router.prefix('/notification');


router.get('/count', [authenticate, fetchNotificationCount]);
router.post('/seen',  koaBody(), [notificationSeen])
router.get('/', [authenticate, fetchNotifications]);

export default router;
