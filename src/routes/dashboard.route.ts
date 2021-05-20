import Router from 'koa-joi-router';

import koaBody from 'koa-body';

import { fetchDashboardRecentUsers, fetchPropertyCountBaseOnProperyType } from './../controllers/dashboard.controllers';
import { fetchDashbaordCounts } from '../controllers/dashboard.controllers';
import { authenticate, adminSellerAuthetication } from './../middleware/authentication';

const router = <any> Router();

router.prefix('/dashboard');

router.get('/counts', [authenticate, adminSellerAuthetication, fetchDashbaordCounts]);
router.get('/recent-users', [authenticate, adminSellerAuthetication, fetchDashboardRecentUsers]);
router.get('/property-counts-base-on-property-type', [authenticate, adminSellerAuthetication, fetchPropertyCountBaseOnProperyType]);

export default router;
